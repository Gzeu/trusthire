// OAuth Integration Service
// Handles OAuth authentication for GitHub, Google, and other providers

import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

export interface OAuthProvider {
  name: string;
  clientId: string;
  clientSecret: string;
  authorizeUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scopes: string[];
}

export interface OAuthState {
  state: string;
  provider: string;
  returnUrl?: string;
  timestamp: number;
}

export interface OAuthUserInfo {
  id: string;
  email?: string;
  name?: string;
  username?: string;
  avatar?: string;
  provider: string;
  raw: any;
}

export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  scope?: string;
  expires_in?: number;
  refresh_token?: string;
}

class OAuthService {
  private prisma: PrismaClient;
  private providers: Map<string, OAuthProvider>;
  private stateStore: Map<string, OAuthState>;

  constructor() {
    this.prisma = new PrismaClient();
    this.providers = new Map();
    this.stateStore = new Map();
    
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // GitHub OAuth Provider
    this.providers.set('github', {
      name: 'GitHub',
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      authorizeUrl: 'https://github.com/login/oauth/authorize',
      tokenUrl: 'https://github.com/login/oauth/access_token',
      userInfoUrl: 'https://api.github.com/user',
      scopes: ['user:email']
    });

    // Google OAuth Provider
    this.providers.set('google', {
      name: 'Google',
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
      scopes: ['openid', 'email', 'profile']
    });

    // Microsoft OAuth Provider
    this.providers.set('microsoft', {
      name: 'Microsoft',
      clientId: process.env.MICROSOFT_CLIENT_ID || '',
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
      authorizeUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
      scopes: ['openid', 'email', 'profile']
    });
  }

  // Generate OAuth authorization URL
  getAuthorizationUrl(provider: string, returnUrl?: string): string {
    const providerConfig = this.providers.get(provider);
    
    if (!providerConfig) {
      throw new Error(`Unsupported OAuth provider: ${provider}`);
    }

    // Generate state
    const state = crypto.randomBytes(32).toString('hex');
    const oauthState: OAuthState = {
      state,
      provider,
      returnUrl,
      timestamp: Date.now()
    };

    // Store state (in production, use Redis or database)
    this.stateStore.set(state, oauthState);

    // Build authorization URL
    const params = new URLSearchParams({
      client_id: providerConfig.clientId,
      redirect_uri: this.getRedirectUri(provider),
      scope: providerConfig.scopes.join(' '),
      response_type: 'code',
      state,
      access_type: 'offline', // For Google refresh tokens
      prompt: 'consent' // For Google
    });

    return `${providerConfig.authorizeUrl}?${params.toString()}`;
  }

  // Handle OAuth callback
  async handleCallback(provider: string, code: string, state: string): Promise<OAuthUserInfo> {
    try {
      // Verify state
      const storedState = this.stateStore.get(state);
      
      if (!storedState || storedState.provider !== provider) {
        throw new Error('Invalid state parameter');
      }

      // Check state expiration (10 minutes)
      if (Date.now() - storedState.timestamp > 10 * 60 * 1000) {
        this.stateStore.delete(state);
        throw new Error('State expired');
      }

      // Exchange code for access token
      const tokenResponse = await this.exchangeCodeForToken(provider, code);
      
      // Get user info
      const userInfo = await this.getUserInfo(provider, tokenResponse.access_token);

      // Clean up state
      this.stateStore.delete(state);

      return userInfo;
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw error;
    }
  }

  // Find or create user from OAuth
  async findOrCreateUser(userInfo: OAuthUserInfo): Promise<{ user: any; isNew: boolean }> {
    try {
      // Check if user already exists with this OAuth account
      const existingOAuthAccount = await this.prisma.oAuthAccount.findUnique({
        where: {
          provider_providerId: {
            provider: userInfo.provider as any,
            providerId: userInfo.id
          }
        },
        include: { user: true }
      });

      if (existingOAuthAccount) {
        // Update OAuth account if needed
        await this.prisma.oAuthAccount.update({
          where: { id: existingOAuthAccount.id },
          data: {
            providerEmail: userInfo.email,
            lastUsedAt: new Date()
          }
        });

        return { user: existingOAuthAccount.user, isNew: false };
      }

      // Check if user exists with same email
      let user = null;
      if (userInfo.email) {
        user = await this.prisma.user.findUnique({
          where: { email: userInfo.email.toLowerCase() }
        });
      }

      if (user) {
        // Link OAuth account to existing user
        await this.prisma.oAuthAccount.create({
          data: {
            userId: user.id,
            provider: userInfo.provider as any,
            providerId: userInfo.id,
            providerEmail: userInfo.email
          }
        });

        return { user, isNew: false };
      }

      // Create new user
      const newUser = await this.prisma.user.create({
        data: {
          email: userInfo.email || `${userInfo.id}@${userInfo.provider}.com`,
          username: userInfo.username,
          firstName: userInfo.name?.split(' ')[0],
          lastName: userInfo.name?.split(' ').slice(1).join(' '),
          passwordHash: '', // OAuth users don't have passwords
          salt: '',
          role: 'USER',
          status: 'ACTIVE',
          emailVerified: !!userInfo.email,
          avatar: userInfo.avatar,
          preferences: JSON.stringify({
            theme: 'dark',
            notifications: true,
            language: 'en'
          })
        }
      });

      // Create OAuth account
      await this.prisma.oAuthAccount.create({
        data: {
          userId: newUser.id,
          provider: userInfo.provider as any,
          providerId: userInfo.id,
          providerEmail: userInfo.email
        }
      });

      return { user: newUser, isNew: true };
    } catch (error) {
      console.error('Find or create user error:', error);
      throw error;
    }
  }

  // Get user's OAuth accounts
  async getUserOAuthAccounts(userId: string): Promise<any[]> {
    try {
      const accounts = await this.prisma.oAuthAccount.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      return accounts.map(account => ({
        id: account.id,
        provider: account.provider,
        providerId: account.providerId,
        providerEmail: account.providerEmail,
        createdAt: account.createdAt.toISOString(),
        lastUsedAt: account.lastUsedAt?.toISOString()
      }));
    } catch (error) {
      console.error('Failed to get OAuth accounts:', error);
      throw error;
    }
  }

  // Unlink OAuth account
  async unlinkOAuthAccount(userId: string, provider: string): Promise<void> {
    try {
      const account = await this.prisma.oAuthAccount.findFirst({
        where: { userId, provider: provider as any }
      });

      if (!account) {
        throw new Error('OAuth account not found');
      }

      // Check if user has other OAuth accounts or password
      const otherAccounts = await this.prisma.oAuthAccount.findMany({
        where: { 
          userId,
          provider: { not: provider as any }
        }
      });

      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (otherAccounts.length === 0 && (!user || !user.passwordHash)) {
        throw new Error('Cannot unlink last authentication method');
      }

      // Delete OAuth account
      await this.prisma.oAuthAccount.delete({
        where: { id: account.id }
      });
    } catch (error) {
      console.error('Failed to unlink OAuth account:', error);
      throw error;
    }
  }

  // Helper methods
  private getRedirectUri(provider: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}/api/auth/oauth/callback/${provider}`;
  }

  private async exchangeCodeForToken(provider: string, code: string): Promise<OAuthTokenResponse> {
    const providerConfig = this.providers.get(provider);
    
    if (!providerConfig) {
      throw new Error(`Unsupported OAuth provider: ${provider}`);
    }

    const response = await fetch(providerConfig.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        client_id: providerConfig.clientId,
        client_secret: providerConfig.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.getRedirectUri(provider)
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token exchange failed: ${error}`);
    }

    return response.json();
  }

  private async getUserInfo(provider: string, accessToken: string): Promise<OAuthUserInfo> {
    const providerConfig = this.providers.get(provider);
    
    if (!providerConfig) {
      throw new Error(`Unsupported OAuth provider: ${provider}`);
    }

    const response = await fetch(providerConfig.userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'User-Agent': 'TrustHire-OAuth'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get user info: ${error}`);
    }

    const data = await response.json();

    // Normalize user info based on provider
    switch (provider) {
      case 'github':
        return {
          id: data.id.toString(),
          email: data.email,
          name: data.name,
          username: data.login,
          avatar: data.avatar_url,
          provider,
          raw: data
        };

      case 'google':
        return {
          id: data.id,
          email: data.email,
          name: data.name,
          username: data.email?.split('@')[0],
          avatar: data.picture,
          provider,
          raw: data
        };

      case 'microsoft':
        return {
          id: data.id,
          email: data.mail || data.userPrincipalName,
          name: data.displayName,
          username: data.userPrincipalName?.split('@')[0],
          avatar: null, // Microsoft doesn't provide avatar in basic response
          provider,
          raw: data
        };

      default:
        throw new Error(`Unknown OAuth provider: ${provider}`);
    }
  }

  // Health check
  async healthCheck(): Promise<{
    providers: string[];
    configured: Record<string, boolean>;
    lastActivity: number;
  }> {
    try {
      const providers = Array.from(this.providers.keys());
      const configured: Record<string, boolean> = {};
      
      for (const provider of providers) {
        const config = this.providers.get(provider);
        configured[provider] = !!(config?.clientId && config?.clientSecret);
      }

      return {
        providers,
        configured,
        lastActivity: this.stateStore.size
      };
    } catch (error) {
      console.error('OAuth health check failed:', error);
      return {
        providers: [],
        configured: {},
        lastActivity: 0
      };
    }
  }

  // Cleanup expired states
  cleanupExpiredStates(): void {
    const now = Date.now();
    const expiredStates: string[] = [];

    for (const [state, oauthState] of this.stateStore.entries()) {
      if (now - oauthState.timestamp > 10 * 60 * 1000) { // 10 minutes
        expiredStates.push(state);
      }
    }

    expiredStates.forEach(state => this.stateStore.delete(state));
  }
}

// Singleton instance
export const oauthService = new OAuthService();

// Export types
export type { OAuthProvider, OAuthState, OAuthUserInfo, OAuthTokenResponse };
