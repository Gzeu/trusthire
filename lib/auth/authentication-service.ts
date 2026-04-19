// Authentication and Authorization Service
// Mock implementation for deployment

import { randomBytes, randomUUID } from 'crypto';

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'analyst' | 'viewer';
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  permissions: string[];
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface AuthResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface AuthConfig {
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
    issuer: string;
    audience: string;
  };
  bcrypt: {
    saltRounds: number;
  };
  session: {
    maxAge: number;
    secure: boolean;
    httpOnly: boolean;
  };
  rateLimit: {
    windowMs: number;
    maxAttempts: number;
    lockoutMinutes: number;
  };
}

export class AuthenticationService {
  private users: Map<string, User> = new Map();
  private refreshTokens: Map<string, { userId: string; expiresAt: number }> = new Map();
  private config: AuthConfig;
  private loginAttempts: Map<string, { count: number; lockUntil: number }> = new Map();

  constructor(config?: Partial<AuthConfig>) {
    this.config = {
      jwt: {
        secret: config?.jwt?.secret || process.env.JWT_SECRET || 'mock-secret-key',
        expiresIn: config?.jwt?.expiresIn || '1h',
        refreshExpiresIn: config?.jwt?.refreshExpiresIn || '7d',
        issuer: config?.jwt?.issuer || 'trusthire',
        audience: config?.jwt?.audience || 'trusthire-users'
      },
      bcrypt: {
        saltRounds: config?.bcrypt?.saltRounds || 12
      },
      session: {
        maxAge: config?.session?.maxAge || 86400000, // 24 hours
        secure: config?.session?.secure ?? true,
        httpOnly: config?.session?.httpOnly ?? true
      },
      rateLimit: {
        windowMs: config?.rateLimit?.windowMs || 900000, // 15 minutes
        maxAttempts: config?.rateLimit?.maxAttempts || 5,
        lockoutMinutes: config?.rateLimit?.lockoutMinutes || 30
      }
    };

    // Initialize with mock users
    this.initializeMockUsers();
  }

  private initializeMockUsers() {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'admin@trusthire.com',
        username: 'admin',
        password: 'admin123', // In production, this would be hashed
        role: 'admin',
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        permissions: ['read', 'write', 'delete', 'admin', 'manage_users', 'manage_system']
      },
      {
        id: '2',
        email: 'analyst@trusthire.com',
        username: 'analyst',
        password: 'analyst123', // In production, this would be hashed
        role: 'analyst',
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        permissions: ['read', 'write', 'analyze', 'create_alerts']
      },
      {
        id: '3',
        email: 'viewer@trusthire.com',
        username: 'viewer',
        password: 'viewer123', // In production, this would be hashed
        role: 'viewer',
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        permissions: ['read']
      }
    ];

    mockUsers.forEach(user => {
      this.users.set(user.email, user);
    });
  }

  // Authentication methods
  async login(email: string, password: string): Promise<AuthResult<AuthToken>> {
    try {
      // Check rate limiting
      const rateLimitCheck = this.checkRateLimit(email);
      if (!rateLimitCheck.allowed) {
        return {
          success: false,
          error: rateLimitCheck.error,
          code: rateLimitCheck.code
        };
      }

      // Find user
      const user = this.users.get(email);
      if (!user) {
        return {
          success: false,
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        };
      }

      // Check if user is active
      if (!user.isActive) {
        return {
          success: false,
          error: 'Account is disabled',
          code: 'ACCOUNT_DISABLED'
        };
      }

      // Verify password (mock implementation)
      if (password !== user.password) {
        return {
          success: false,
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        };
      }

      // Generate tokens
      const tokens = this.generateTokens(user);
      
      // Update last login
      user.lastLoginAt = new Date().toISOString();
      this.users.set(email, user);

      // Clear rate limit attempts on successful login
      this.loginAttempts.delete(email);

      return {
        success: true,
        data: tokens
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed',
        code: 'LOGIN_ERROR'
      };
    }
  }

  async register(userData: {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'admin' | 'analyst' | 'viewer';
  }): Promise<AuthResult<AuthToken>> {
    try {
      // Validate required fields
      const requiredFields = ['email', 'username', 'password', 'firstName', 'lastName'];
      const missingFields = requiredFields.filter(field => !userData[field as keyof typeof userData]);
      
      if (missingFields.length > 0) {
        return {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`,
          code: 'MISSING_FIELDS'
        };
      }

      // Check if user already exists
      if (this.users.has(userData.email)) {
        return {
          success: false,
          error: 'User already exists',
          code: 'USER_EXISTS'
        };
      }

      // Check if username is taken
      const existingUser = Array.from(this.users.values()).find(u => u.username === userData.username);
      if (existingUser) {
        return {
          success: false,
          error: 'Username already taken',
          code: 'USERNAME_TAKEN'
        };
      }

      // Create new user
      const newUser: User = {
        id: randomUUID(),
        email: userData.email,
        username: userData.username,
        password: userData.password, // In production, this would be hashed
        role: userData.role || 'viewer',
        isActive: true,
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
        permissions: this.getPermissionsForRole(userData.role || 'viewer')
      };

      // Save user
      this.users.set(newUser.email, newUser);

      // Generate tokens
      const tokens = this.generateTokens(newUser);

      return {
        success: true,
        data: tokens
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed',
        code: 'REGISTRATION_ERROR'
      };
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResult<AuthToken>> {
    try {
      // Find refresh token
      const tokenData = this.refreshTokens.get(refreshToken);
      if (!tokenData || tokenData.expiresAt < Date.now()) {
        return {
          success: false,
          error: 'Invalid or expired refresh token',
          code: 'INVALID_REFRESH_TOKEN'
        };
      }

      // Find user
      const user = Array.from(this.users.values()).find(u => u.id === tokenData.userId);
      if (!user || !user.isActive) {
        return {
          success: false,
          error: 'User not found or inactive',
          code: 'USER_NOT_FOUND'
        };
      }

      // Generate new tokens
      const tokens = this.generateTokens(user);

      // Remove old refresh token
      this.refreshTokens.delete(refreshToken);

      return {
        success: true,
        data: tokens
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: 'Token refresh failed',
        code: 'TOKEN_REFRESH_ERROR'
      };
    }
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      // Mock token verification
      if (token.startsWith('mock-access-token')) {
        // Return first user for demo purposes
        const users = Array.from(this.users.values());
        return users.length > 0 ? users[0] : null;
      }
      
      return null;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  async logout(token: string): Promise<void> {
    try {
      // In a real implementation, you might want to invalidate the token
      // For now, we'll just log it
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<AuthResult<void>> {
    try {
      const user = Array.from(this.users.values()).find(u => u.id === userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        };
      }

      // Verify current password (mock implementation)
      if (currentPassword !== user.password) {
        return {
          success: false,
          error: 'Current password is incorrect',
          code: 'INVALID_CURRENT_PASSWORD'
        };
      }

      // Update password
      user.password = newPassword; // In production, this would be hashed
      this.users.set(user.email, user);

      return {
        success: true
      };
    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        error: 'Password change failed',
        code: 'PASSWORD_CHANGE_ERROR'
      };
    }
  }

  async resetPassword(email: string): Promise<AuthResult<void>> {
    try {
      const user = this.users.get(email);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        };
      }

      // In a real implementation, you would send a reset email
      // For now, we'll just return success
      console.log(`Password reset initiated for ${email}`);

      return {
        success: true
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: 'Password reset failed',
        code: 'PASSWORD_RESET_ERROR'
      };
    }
  }

  // User management
  async getUsers(): Promise<User[]> {
    try {
      return Array.from(this.users.values()).map(user => ({
        ...user,
        password: '***' // Don't expose password
      }));
    } catch (error) {
      console.error('Get users error:', error);
      throw new Error('Failed to get users');
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const user = Array.from(this.users.values()).find(u => u.id === id);
      if (user) {
        return {
          ...user,
          password: '***' // Don't expose password
        };
      }
      return null;
    } catch (error) {
      console.error('Get user error:', error);
      throw new Error('Failed to get user');
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<AuthResult<User>> {
    try {
      const user = Array.from(this.users.values()).find(u => u.id === id);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        };
      }

      const updatedUser = { ...user, ...updates };
      this.users.set(user.email, updatedUser);

      return {
        success: true,
        data: {
          ...updatedUser,
          password: '***' // Don't expose password
        }
      };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        error: 'Failed to update user',
        code: 'UPDATE_USER_ERROR'
      };
    }
  }

  async deleteUser(id: string): Promise<AuthResult<void>> {
    try {
      const user = Array.from(this.users.values()).find(u => u.id === id);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        };
      }

      this.users.delete(user.email);

      return {
        success: true
      };
    } catch (error) {
      console.error('Delete user error:', error);
      return {
        success: false,
        error: 'Failed to delete user',
        code: 'DELETE_USER_ERROR'
      };
    }
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    details: Record<string, any>;
  }> {
    try {
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        details: {
          totalUsers: this.users.size,
          activeUsers: Array.from(this.users.values()).filter(u => u.isActive).length,
          activeRefreshTokens: this.refreshTokens.size,
          config: this.config
        }
      };
    } catch (error) {
      console.error('Health check error:', error);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        details: {
          error: 'Health check failed'
        }
      };
    }
  }

  // Helper methods
  private generateTokens(user: User): AuthToken {
    const accessToken = `mock-access-token-${randomUUID()}`;
    const refreshToken = `mock-refresh-token-${randomUUID()}`;
    const expiresIn = 3600; // 1 hour in seconds

    // Store refresh token
    this.refreshTokens.set(refreshToken, {
      userId: user.id,
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    });

    return {
      accessToken,
      refreshToken,
      expiresIn,
      tokenType: 'Bearer'
    };
  }

  private getPermissionsForRole(role: 'admin' | 'analyst' | 'viewer'): string[] {
    const rolePermissions = {
      admin: ['read', 'write', 'delete', 'admin', 'manage_users', 'manage_system'],
      analyst: ['read', 'write', 'analyze', 'create_alerts'],
      viewer: ['read']
    };

    return rolePermissions[role] || [];
  }

  private checkRateLimit(email: string): { allowed: boolean; error?: string; code?: string } {
    const now = Date.now();
    const attempts = this.loginAttempts.get(email);

    if (attempts && attempts.lockUntil > now) {
      const remainingMinutes = Math.ceil((attempts.lockUntil - now) / 60000);
      return {
        allowed: false,
        error: `Account locked. Try again in ${remainingMinutes} minutes`,
        code: 'ACCOUNT_LOCKED'
      };
    }

    return { allowed: true };
  }
}

// Singleton instance
let authenticationService: AuthenticationService | null = null;

export function getAuthenticationService(config?: Partial<AuthConfig>): AuthenticationService {
  if (!authenticationService) {
    authenticationService = new AuthenticationService(config);
  }
  return authenticationService;
}
