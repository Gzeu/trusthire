// Enhanced Authentication Service
// Comprehensive authentication with MFA, session management, and role-based access

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  avatar?: string;
  timezone?: string;
  language: string;
  preferences?: any;
  createdAt: string;
  lastLoginAt?: string;
  loginCount: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  mfaCode?: string;
  rememberMe?: boolean;
  deviceInfo?: any;
}

export interface RegisterRequest {
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  language?: string;
  deviceInfo?: any;
}

export interface SessionInfo {
  sessionId: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  deviceInfo?: any;
  location?: any;
  expiresAt: string;
  lastActivityAt: string;
}

export interface MFASetupResult {
  secret: string;
  qrCode: string;
  backupCodes: string[];
  manualEntryKey: string;
}

export interface ApiKeyCreateRequest {
  name: string;
  permissions: string[];
  expiresAt?: Date;
  rateLimit?: number;
  metadata?: any;
}

export interface ApiKeyInfo {
  id: string;
  name: string;
  keyPrefix: string;
  permissions: string[];
  isActive: boolean;
  lastUsedAt?: string;
  expiresAt?: string;
  usageCount: number;
  createdAt: string;
}

class EnhancedAuthService {
  private prisma: PrismaClient;
  private jwtSecret: string;
  private jwtRefreshSecret: string;
  private accessTokenExpiry = 15 * 60; // 15 minutes
  private refreshTokenExpiry = 7 * 24 * 60 * 60; // 7 days
  private maxSessionsPerUser = 5;
  private passwordMinLength = 8;
  private sessionTimeout = 30 * 60; // 30 minutes

  constructor() {
    this.prisma = new PrismaClient();
    this.jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
  }

  // User Registration
  async register(request: RegisterRequest): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      // Validate input
      this.validateRegistrationInput(request);

      // Check if user already exists
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: request.email.toLowerCase() },
            ...(request.username ? [{ username: request.username }] : [])
          ]
        }
      });

      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }

      // Hash password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(request.password, salt);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email: request.email.toLowerCase(),
          username: request.username,
          firstName: request.firstName,
          lastName: request.lastName,
          passwordHash,
          salt,
          role: 'USER',
          status: 'ACTIVE',
          preferences: JSON.stringify({
            theme: 'dark',
            notifications: true,
            language: request.language || 'en'
          })
        }
      });

      // Log registration
      await this.logAuditEvent({
        userId: user.id,
        action: 'REGISTER',
        success: true,
        resource: 'User',
        resourceId: user.id
      });

      // Create session and tokens
      const tokens = await this.createSession(user.id, {
        ipAddress: undefined, // Will be set by middleware
        userAgent: undefined,
        deviceInfo: request.deviceInfo
      });

      // Update login stats
      await this.updateLoginStats(user.id);

      return {
        user: this.formatUser(user),
        tokens
      };
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  // User Login
  async login(request: LoginRequest): Promise<{ user: User; tokens: AuthTokens; requiresMFA: boolean }> {
    try {
      // Find user
      const user = await this.prisma.user.findUnique({
        where: { email: request.email.toLowerCase() }
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check user status
      if (user.status !== 'ACTIVE') {
        throw new Error('Account is not active');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(request.password, user.passwordHash);
      if (!isValidPassword) {
        await this.logAuditEvent({
          userId: user.id,
          action: 'LOGIN',
          success: false,
          errorMessage: 'Invalid password'
        });
        throw new Error('Invalid credentials');
      }

      // Check MFA
      if (user.mfaEnabled && !request.mfaCode) {
        return {
          user: this.formatUser(user),
          tokens: {} as AuthTokens,
          requiresMFA: true
        };
      }

      // Verify MFA code if required
      if (user.mfaEnabled && request.mfaCode) {
        if (!user.mfaSecret) {
          throw new Error('MFA not properly configured');
        }

        const isValidMFA = speakeasy.totp.verify({
          token: request.mfaCode,
          secret: user.mfaSecret
        });

        if (!isValidMFA) {
          await this.logAuditEvent({
            userId: user.id,
            action: 'LOGIN',
            success: false,
            errorMessage: 'Invalid MFA code'
          });
          throw new Error('Invalid MFA code');
        }
      }

      // Clean up old sessions
      await this.cleanupOldSessions(user.id);

      // Create new session
      const tokens = await this.createSession(user.id, {
        ipAddress: undefined, // Will be set by middleware
        userAgent: undefined,
        deviceInfo: request.deviceInfo
      });

      // Update login stats
      await this.updateLoginStats(user.id);

      // Log successful login
      await this.logAuditEvent({
        userId: user.id,
        action: 'LOGIN',
        success: true
      });

      return {
        user: this.formatUser(user),
        tokens,
        requiresMFA: false
      };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Refresh tokens
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret) as any;
      
      // Find session
      const session = await this.prisma.userSession.findUnique({
        where: { refreshToken },
        include: { user: true }
      });

      if (!session || !session.isActive || session.expiresAt < new Date()) {
        throw new Error('Invalid or expired refresh token');
      }

      // Update session activity
      await this.prisma.userSession.update({
        where: { id: session.id },
        data: { lastActivityAt: new Date() }
      });

      // Generate new tokens
      const newTokens = this.generateTokens(session.userId);
      
      // Update session with new refresh token
      await this.prisma.userSession.update({
        where: { id: session.id },
        data: { refreshToken: newTokens.refreshToken }
      });

      return newTokens;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw new Error('Failed to refresh tokens');
    }
  }

  // Logout
  async logout(refreshToken: string): Promise<void> {
    try {
      const session = await this.prisma.userSession.findUnique({
        where: { refreshToken },
        include: { user: true }
      });

      if (session) {
        // Deactivate session
        await this.prisma.userSession.update({
          where: { id: session.id },
          data: { isActive: false }
        });

        // Log logout
        await this.logAuditEvent({
          userId: session.userId,
          action: 'LOGOUT',
          success: true
        });
      }
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  // Setup MFA
  async setupMFA(userId: string): Promise<MFASetupResult> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Generate secret
      const secret = speakeasy.generateSecret();
      const serviceName = 'TrustHire Security Platform';
      const issuer = 'TrustHire';
      const manualEntryKey = speakeasy.otpauthURL({
        secret: secret.base32,
        label: user.email,
        issuer: serviceName
      });

      // Generate QR code
      const qrCode = await QRCode.toDataURL(manualEntryKey);

      // Generate backup codes
      const backupCodes = Array.from({ length: 10 }, () => 
        crypto.randomBytes(4).toString('hex').toUpperCase()
      );

      // Store secret and backup codes (encrypted)
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          mfaSecret: secret.base32,
          backupCodes: JSON.stringify(backupCodes)
        }
      });

      // Log MFA setup
      await this.logAuditEvent({
        userId,
        action: 'MFA_ENABLED',
        success: true
      });

      return {
        secret: secret.base32,
        qrCode,
        backupCodes,
        manualEntryKey
      };
    } catch (error) {
      console.error('MFA setup failed:', error);
      throw error;
    }
  }

  // Verify and enable MFA
  async enableMFA(userId: string, code: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user || !user.mfaSecret) {
        throw new Error('MFA setup not found');
      }

      const isValidCode = speakeasy.totp.verify({
        token: code,
        secret: user.mfaSecret
      });

      if (!isValidCode) {
        throw new Error('Invalid verification code');
      }

      // Enable MFA
      await this.prisma.user.update({
        where: { id: userId },
        data: { mfaEnabled: true }
      });

      // Log MFA enable
      await this.logAuditEvent({
        userId,
        action: 'MFA_ENABLED',
        success: true
      });
    } catch (error) {
      console.error('MFA enable failed:', error);
      throw error;
    }
  }

  // Disable MFA
  async disableMFA(userId: string, password: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      // Disable MFA
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          mfaEnabled: false,
          mfaSecret: null,
          backupCodes: null
        }
      });

      // Log MFA disable
      await this.logAuditEvent({
        userId,
        action: 'MFA_DISABLED',
        success: true
      });
    } catch (error) {
      console.error('MFA disable failed:', error);
      throw error;
    }
  }

  // Create API Key
  async createApiKey(userId: string, request: ApiKeyCreateRequest): Promise<{ apiKey: string; info: ApiKeyInfo }> {
    try {
      // Generate API key
      const key = crypto.randomBytes(32).toString('hex');
      const keyPrefix = key.substring(0, 8);

      // Store in database
      const apiKey = await this.prisma.apiKey.create({
        data: {
          userId,
          name: request.name,
          key,
          keyPrefix,
          permissions: JSON.stringify(request.permissions),
          expiresAt: request.expiresAt,
          rateLimit: request.rateLimit,
          metadata: request.metadata ? JSON.stringify(request.metadata) : undefined
        }
      });

      // Log API key creation
      await this.logAuditEvent({
        userId,
        action: 'API_KEY_CREATED',
        success: true,
        resource: 'ApiKey',
        resourceId: apiKey.id
      });

      return {
        apiKey: key,
        info: this.formatApiKey(apiKey)
      };
    } catch (error) {
      console.error('API key creation failed:', error);
      throw error;
    }
  }

  // Delete API Key
  async deleteApiKey(userId: string, apiKeyId: string): Promise<void> {
    try {
      const apiKey = await this.prisma.apiKey.findFirst({
        where: { id: apiKeyId, userId }
      });

      if (!apiKey) {
        throw new Error('API key not found');
      }

      // Deactivate API key
      await this.prisma.apiKey.update({
        where: { id: apiKeyId },
        data: { isActive: false }
      });

      // Log API key deletion
      await this.logAuditEvent({
        userId,
        action: 'API_KEY_DELETED',
        success: true,
        resource: 'ApiKey',
        resourceId: apiKeyId
      });
    } catch (error) {
      console.error('API key deletion failed:', error);
      throw error;
    }
  }

  // Get user sessions
  async getUserSessions(userId: string): Promise<SessionInfo[]> {
    try {
      const sessions = await this.prisma.userSession.findMany({
        where: { userId, isActive: true },
        orderBy: { lastActivityAt: 'desc' }
      });

      return sessions.map((session: any) => ({
        sessionId: session.sessionId,
        userId: session.userId,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        deviceInfo: session.deviceInfo ? JSON.parse(session.deviceInfo) : undefined,
        location: session.location ? JSON.parse(session.location) : undefined,
        expiresAt: session.expiresAt.toISOString(),
        lastActivityAt: session.lastActivityAt.toISOString()
      }));
    } catch (error) {
      console.error('Failed to get user sessions:', error);
      throw error;
    }
  }

  // Revoke session
  async revokeSession(userId: string, sessionId: string): Promise<void> {
    try {
      const session = await this.prisma.userSession.findFirst({
        where: { sessionId, userId, isActive: true }
      });

      if (!session) {
        throw new Error('Session not found');
      }

      // Deactivate session
      await this.prisma.userSession.update({
        where: { id: session.id },
        data: { isActive: false }
      });
    } catch (error) {
      console.error('Session revocation failed:', error);
      throw error;
    }
  }

  // Helper methods
  private validateRegistrationInput(request: RegisterRequest): void {
    if (!request.email || !request.email.includes('@')) {
      throw new Error('Valid email is required');
    }

    if (request.password.length < this.passwordMinLength) {
      throw new Error(`Password must be at least ${this.passwordMinLength} characters`);
    }

    if (request.password !== request.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (!request.acceptTerms) {
      throw new Error('You must accept the terms and conditions');
    }

    if (request.username && (request.username.length < 3 || request.username.length > 30)) {
      throw new Error('Username must be between 3 and 30 characters');
    }
  }

  private generateTokens(userId: string): AuthTokens {
    const accessToken = jwt.sign(
      { userId, type: 'access' },
      this.jwtSecret,
      { expiresIn: this.accessTokenExpiry }
    );

    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      this.jwtRefreshSecret,
      { expiresIn: this.refreshTokenExpiry }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: this.accessTokenExpiry,
      tokenType: 'Bearer'
    };
  }

  private async createSession(userId: string, sessionData: {
    ipAddress?: string;
    userAgent?: string;
    deviceInfo?: any;
  }): Promise<AuthTokens> {
    const tokens = this.generateTokens(userId);
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + this.refreshTokenExpiry * 1000);

    await this.prisma.userSession.create({
      data: {
        userId,
        sessionId,
        refreshToken: tokens.refreshToken,
        accessToken: tokens.accessToken,
        ipAddress: sessionData.ipAddress,
        userAgent: sessionData.userAgent,
        deviceInfo: sessionData.deviceInfo ? JSON.stringify(sessionData.deviceInfo) : undefined,
        expiresAt
      }
    });

    return tokens;
  }

  private async cleanupOldSessions(userId: string): Promise<void> {
    // Get all active sessions for user
    const sessions = await this.prisma.userSession.findMany({
      where: { userId, isActive: true },
      orderBy: { lastActivityAt: 'desc' }
    });

    // Keep only the most recent sessions
    if (sessions.length > this.maxSessionsPerUser) {
      const sessionsToRevoke = sessions.slice(this.maxSessionsPerUser);
      
      await this.prisma.userSession.updateMany({
        where: {
          id: { in: sessionsToRevoke.map((s: any) => s.id) }
        },
        data: { isActive: false }
      });
    }

    // Clean up expired sessions
    await this.prisma.userSession.updateMany({
      where: {
        expiresAt: { lt: new Date() },
        isActive: true
      },
      data: { isActive: false }
    });
  }

  private async updateLoginStats(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
        loginCount: { increment: 1 }
      }
    });
  }

  private async logAuditEvent(event: {
    userId?: string;
    sessionId?: string;
    action: string;
    success: boolean;
    errorMessage?: string;
    resource?: string;
    resourceId?: string;
    metadata?: any;
  }): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: event.userId,
          sessionId: event.sessionId,
          action: event.action as any,
          resource: event.resource,
          resourceId: event.resourceId,
          success: event.success,
          errorMessage: event.errorMessage,
          metadata: event.metadata ? JSON.stringify(event.metadata) : undefined
        }
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }

  private formatUser(user: any): User {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      mfaEnabled: user.mfaEnabled,
      avatar: user.avatar,
      timezone: user.timezone,
      language: user.language,
      preferences: user.preferences ? JSON.parse(user.preferences) : undefined,
      createdAt: user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString(),
      loginCount: user.loginCount
    };
  }

  private formatApiKey(apiKey: any): ApiKeyInfo {
    return {
      id: apiKey.id,
      name: apiKey.name,
      keyPrefix: apiKey.keyPrefix,
      permissions: apiKey.permissions,
      isActive: apiKey.isActive,
      lastUsedAt: apiKey.lastUsedAt?.toISOString(),
      expiresAt: apiKey.expiresAt?.toISOString(),
      usageCount: apiKey.usageCount,
      createdAt: apiKey.createdAt.toISOString()
    };
  }

  // Health check
  async healthCheck(): Promise<{
    database: boolean;
    jwt: boolean;
    lastActivity: number;
  }> {
    try {
      const [databaseHealth, lastActivity] = await Promise.all([
        this.prisma.user.count().then(() => true).catch(() => false),
        this.prisma.userSession.count({
          where: {
            lastActivityAt: {
              gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
            }
          }
        })
      ]);

      return {
        database: databaseHealth,
        jwt: !!this.jwtSecret,
        lastActivity
      };
    } catch (error) {
      console.error('Auth health check failed:', error);
      return {
        database: false,
        jwt: false,
        lastActivity: 0
      };
    }
  }
}

// Singleton instance
export const enhancedAuthService = new EnhancedAuthService();

