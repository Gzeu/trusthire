// Authentication and Authorization Service
// JWT-based authentication with role-based access control

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomBytes, randomUUID } from 'crypto';

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'analyst' | 'viewer';
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      webhook: boolean;
    };
    theme: string;
    language: string;
    timezone: string;
  };
  subscriptions: {
    threats: string[];
    types: string[];
    severities: string[];
    sources: string[];
  };
  profile: {
    firstName: string;
    lastName: string;
    organization: string;
    avatar?: string;
    bio?: string;
    phone?: string;
    department?: string;
  };
  mfaEnabled: boolean;
  mfaSecret?: string;
  loginAttempts: number;
  lockedUntil?: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  scope: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  mfaCode?: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'analyst' | 'viewer';
  firstName: string;
  lastName: string;
  organization?: string;
  phone?: string;
  department?: string;
}

export interface PasswordResetRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface MFASetupRequest {
  secret: string;
  backupCodes: string[];
}

export interface AuthConfig {
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
    issuer: string;
    algorithm: string;
  };
  bcrypt: {
    saltRounds: number;
  };
  rateLimit: {
    windowMs: number;
    maxAttempts: number;
    skipSuccessfulRequests: boolean;
  };
  password: {
    minLength: number;
    maxLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  mfa: {
    issuer: string;
    window: number;
    backupCodesGenerated: number;
  };
  session: {
    secret: string;
    resave: boolean;
    rolling: boolean;
    maxAge: string;
  };
}

export interface AuthResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    loginAttempts?: number;
    mfaRequired?: boolean;
    lockedUntil?: string;
    rateLimitReset?: string;
  };
}

export class AuthenticationService {
  private config: AuthConfig;
  private users: Map<string, User> = new Map();
  private refreshTokens: Map<string, { userId: string; expiresAt: string }> = new Map();
  private loginAttempts: Map<string, { count: number; lastAttempt: string; lockedUntil?: string }> = new Map();

  constructor(config: AuthConfig) {
    this.config = config;
    this.initializeMockUsers();
  }

  private initializeMockUsers(): void {
    // Initialize with some mock users for demonstration
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'admin@trusthire.com',
        username: 'admin',
        password: '$2b$12$5f36ec70a9e894f96c3e3e8c4b7b11e6a2d823',
        role: 'admin',
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false,
            webhook: false
          },
          theme: 'dark',
          language: 'en',
          timezone: 'UTC'
        },
        subscriptions: {
          threats: ['critical', 'high'],
          types: ['malware', 'apt'],
          severities: ['critical'],
          sources: ['MISP', 'VirusTotal']
        },
        profile: {
          firstName: 'Admin',
          lastName: 'User',
          organization: 'TrustHire Security',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TrustHireAdmin',
          bio: 'Security administrator with full system access'
        },
        mfaEnabled: false,
        loginAttempts: 0
      },
      {
        id: '2',
        email: 'analyst@trusthire.com',
        username: 'analyst',
        password: '$2b$12$5f36ec70a9e894f96c3e3e8c4b7b11e6a2d823',
        role: 'analyst',
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false,
            webhook: false
          },
          theme: 'dark',
          language: 'en',
          timezone: 'UTC'
        },
        subscriptions: {
          threats: ['high', 'medium'],
          types: ['malware', 'phishing'],
          severities: ['high', 'medium'],
          sources: ['MISP', 'PhishTank']
        },
        profile: {
          firstName: 'Security',
          lastName: 'Analyst',
          organization: 'TrustHire Security',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TrustHireAnalyst',
          bio: 'Security analyst focused on threat analysis and investigation'
        },
        mfaEnabled: false,
        loginAttempts: 0
      },
      {
        id: '3',
        email: 'viewer@trusthire.com',
        username: 'viewer',
        password: '$2b$12$5f36ec70a9e894f96c3e3e8c4b7b11e6a2d823',
        role: 'viewer',
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          notifications: {
            email: true,
            push: false,
            sms: false,
            webhook: false
          },
          theme: 'dark',
          language: 'en',
          timezone: 'UTC'
        },
        subscriptions: {
          threats: ['low', 'medium'],
          types: ['phishing'],
          severities: ['low', 'medium'],
          sources: ['PhishTank']
        },
        profile: {
          firstName: 'Security',
          lastName: 'Viewer',
          organization: 'TrustHire Security',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TrustHireViewer',
          bio: 'Security viewer with read-only access to threat intelligence'
        },
        mfaEnabled: false,
        loginAttempts: 0
      }
    ];

    mockUsers.forEach(user => {
      this.users.set(user.email, user);
    });
  }

  // Password utilities
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.config.bcrypt.saltRounds);
    return bcrypt.hash(password, salt);
  }

  private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // JWT utilities
  private generateAccessToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      permissions: this.getPermissionsForRole(user.role)
    };

    return jwt.sign(payload, this.config.jwt.secret, {
      expiresIn: this.config.jwt.expiresIn,
      issuer: this.config.jwt.issuer,
      algorithm: this.config.jwt.algorithm
    });
  }

  private generateRefreshToken(user: User): string {
    const payload = {
      userId: user.id,
      type: 'refresh'
    };

    return jwt.sign(payload, this.config.jwt.secret, {
      expiresIn: this.config.jwt.refreshExpiresIn,
      issuer: this.config.jwt.issuer,
      algorithm: this.config.jwt.algorithm
    });
  }

  private verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.config.jwt.secret, {
        issuer: this.config.jwt.issuer,
        algorithms: [this.config.jwt.algorithm]
      });
    } catch (error) {
      return null;
    }
  }

  private getPermissionsForRole(role: string): string[] {
    const rolePermissions = {
      admin: [
        'read:threats',
        'write:threats',
        'delete:threats',
        'manage:users',
        'read:analytics',
        'write:analytics',
        'manage:system',
        'read:config',
        'write:config',
        'manage:api_keys',
        'read:logs',
        'write:logs'
      ],
      analyst: [
        'read:threats',
        'write:threats',
        'read:analytics',
        'write:analytics',
        'read:config',
        'write:config'
      ],
      viewer: [
        'read:threats',
        'read:analytics'
      ]
    };

    return rolePermissions[role] || [];
  }

  // Rate limiting
  private checkRateLimit(email: string): AuthResult<null> {
    const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: new Date().toISOString() };
    
    if (attempts.count >= this.config.rateLimit.maxAttempts) {
      const timeSinceLastAttempt = Date.now() - new Date(attempts.lastAttempt).getTime();
      
      if (timeSinceLastAttempt < this.config.rateLimit.windowMs) {
        const lockedUntil = new Date(Date.now() + this.config.rateLimit.windowMs).toISOString();
        
        return {
          success: false,
          error: 'Too many login attempts. Account temporarily locked.',
          metadata: {
            loginAttempts: attempts.count + 1,
            lockedUntil,
            rateLimitReset: new Date(new Date(attempts.lastAttempt).getTime() + this.config.rateLimit.windowMs).toISOString()
          }
        };
      }
    }

    return { success: true, data: null };
  }

  private checkAccountLock(email: string): AuthResult<null> {
    const attempts = this.loginAttempts.get(email);
    
    if (attempts && attempts.lockedUntil) {
      const now = new Date();
      const lockedUntil = new Date(attempts.lockedUntil);
      
      if (now < lockedUntil) {
        return {
          success: false,
          error: `Account is locked until ${lockedUntil.toLocaleString()}`,
          metadata: {
            loginAttempts: attempts.count,
            lockedUntil: attempts.lockedUntil
          }
        };
      }
    }

    return { success: true, data: null };
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<AuthResult<AuthToken>> {
    try {
      // Check rate limiting and account lock
      const rateLimitCheck = this.checkRateLimit(credentials.email);
      if (!rateLimitCheck.success) {
        return rateLimitCheck;
      }

      const accountLockCheck = this.checkAccountLock(credentials.email);
      if (!accountLockCheck.success) {
        return accountLockCheck;
      }

      // Find user
      const user = this.users.get(credentials.email);
      if (!user) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      if (!user.isActive) {
        return {
          success: false,
          error: 'Account is inactive'
        };
      }

      // Verify password
      const isPasswordValid = await this.comparePassword(credentials.password, user.password);
      if (!isPasswordValid) {
        // Update login attempts
        const currentAttempts = this.loginAttempts.get(credentials.email) || { count: 0, lastAttempt: new Date().toISOString() };
        this.loginAttempts.set(credentials.email, {
          count: currentAttempts.count + 1,
          lastAttempt: new Date().toISOString()
        });

        return {
          success: false,
          error: 'Invalid credentials',
          metadata: {
            loginAttempts: currentAttempts.count + 1
          }
        };
      }

      // Check MFA if enabled
      if (user.mfaEnabled && !credentials.mfaCode) {
        return {
          success: false,
          error: 'MFA code required',
          metadata: {
            mfaRequired: true
          }
        };
      }

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Update user
      user.lastLoginAt = new Date().toISOString();
      user.loginAttempts = 0;
      this.users.set(user.email, user);

      // Store refresh token
      this.refreshTokens.set(refreshToken, {
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      });

      // Clear login attempts
      this.loginAttempts.delete(credentials.email);

      return {
        success: true,
        data: {
          accessToken,
          refreshToken,
          tokenType: 'Bearer',
          expiresIn: 3600, // 1 hour
          scope: ['read', 'write']
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResult<User>> {
    try {
      // Validate input
      if (userData.password !== userData.confirmPassword) {
        return {
          success: false,
          error: 'Passwords do not match'
        };
      }

      if (userData.password.length < this.config.password.minLength) {
        return {
          success: false,
          error: `Password must be at least ${this.config.password.minLength} characters`
        };
      }

      if (userData.password.length > this.config.password.maxLength) {
        return {
          success: false,
          error: `Password must be no more than ${this.config.password.maxLength} characters`
        };
      }

      if (this.config.password.requireUppercase && !/[A-Z]/.test(userData.password)) {
        return {
          success: false,
          error: 'Password must contain at least one uppercase letter'
        };
      }

      if (this.config.password.requireLowercase && !/[a-z]/.test(userData.password)) {
        return {
          success: false,
          error: 'Password must contain at least one lowercase letter'
        };
      }

      if (this.config.password.requireNumbers && !/\d/.test(userData.password)) {
        return {
          success: false,
          error: 'Password must contain at least one number'
        };
      }

      if (this.config.password.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"|\\?<>]/.test(userData.password)) {
        return {
          success: false,
          error: 'Password must contain at least one special character'
        };
      }

      // Check if user already exists
      if (this.users.has(userData.email)) {
        return {
          success: false,
          error: 'User with this email already exists'
        };
      }

      // Hash password
      const hashedPassword = await this.hashPassword(userData.password);

      // Create user
      const newUser: User = {
        id: randomUUID(),
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        role: userData.role,
        isActive: true,
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false,
            webhook: false
          },
          theme: 'dark',
          language: 'en',
          timezone: 'UTC'
        },
        subscriptions: {
          threats: ['medium'],
          types: ['phishing'],
          severities: ['medium'],
          sources: ['PhishTank']
        },
        profile: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          organization: userData.organization,
          phone: userData.phone,
          department: userData.department
        },
        mfaEnabled: false,
        loginAttempts: 0
      };

      this.users.set(newUser.email, newUser);

      return {
        success: true,
        data: newUser
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed'
      };
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResult<AuthToken>> {
    try {
      const tokenData = this.refreshTokens.get(refreshToken);
      
      if (!tokenData) {
        return {
          success: false,
          error: 'Invalid refresh token'
        };
      }

      const now = new Date();
      if (now > new Date(tokenData.expiresAt)) {
        return {
          success: false,
          error: 'Refresh token expired'
        };
      }

      const user = this.users.get(tokenData.userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Generate new tokens
      const accessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      // Update refresh token
      this.refreshTokens.set(newRefreshToken, {
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      // Remove old refresh token
      this.refreshTokens.delete(refreshToken);

      return {
        success: true,
        data: {
          accessToken,
          refreshToken: newRefreshToken,
          tokenType: 'Bearer',
          expiresIn: 3600,
          scope: ['read', 'write']
        }
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: 'Token refresh failed'
      };
    }
  }

  async verifyToken(token: string): Promise<AuthResult<any>> {
    try {
      const decoded = this.verifyToken(token);
      
      if (!decoded) {
        return {
          success: false,
          error: 'Invalid token'
        };
      }

      const user = this.users.get(decoded.email);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role
          },
          permissions: this.getPermissionsForRole(user.role)
        }
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        error: 'Token verification failed'
      };
    }
  }

  async logout(accessToken: string): Promise<AuthResult<boolean>> {
    try {
      const decoded = this.verifyToken(accessToken);
      
      if (!decoded) {
        return {
          success: false,
          error: 'Invalid token'
        };
      }

      const user = this.users.get(decoded.email);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // In production, you might want to blacklist the token
      // For now, we'll just return success

      return {
        success: true,
        data: true
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: 'Logout failed'
      };
    }
  }

  async changePassword(userId: string, changeData: ChangePasswordRequest): Promise<AuthResult<boolean>> {
    try {
      const user = this.users.get(userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Validate current password
      const isCurrentPasswordValid = await this.comparePassword(changeData.currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return {
          success: false,
          error: 'Current password is incorrect'
        };
      }

      // Validate new password
      if (changeData.newPassword !== changeData.confirmPassword) {
        return {
          success: false,
          error: 'New passwords do not match'
        };
      }

      // Hash new password
      const hashedPassword = await this.hashPassword(changeData.newPassword);

      // Update user
      user.password = hashedPassword;
      user.updatedAt = new Date().toISOString();
      this.users.set(user.email, user);

      return {
        success: true,
        data: true
      };
    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        error: 'Password change failed'
      };
    }
  }

  async resetPassword(resetData: PasswordResetRequest): Promise<AuthResult<boolean>> {
    try {
      const user = this.users.find(u => u.email === resetData.email);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // In production, you would validate the reset token
      // For now, we'll skip token validation

      // Hash new password
      const hashedPassword = await this.hashPassword(resetData.newPassword);

      // Update user
      user.password = hashedPassword;
      user.updatedAt = new Date().toISOString();
      user.loginAttempts = 0;
      this.users.set(user.email, user);

      return {
        success: true,
        data: true
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: 'Password reset failed'
      };
    }
  }

  // User management
  async getUserById(userId: string): Promise<AuthResult<User | null>> {
    const user = Array.from(this.users.values()).find(u => u.id === userId);
    
    return {
      success: true,
      data: user || null
    };
  }

  async getUserByEmail(email: string): Promise< AuthResult<User | null>> {
    const user = this.users.get(email);
    
    return {
      success: true,
      data: user || null
    };
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<AuthResult<User>> {
    const user = Array.from(this.users.values()).find(u => u.id === userId);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.users.set(user.email, updatedUser);

    return {
      success: true,
      data: updatedUser
    };
  }

  // Authorization
  hasPermission(user: User, permission: string): boolean {
    const permissions = this.getPermissionsForRole(user.role);
    return permissions.includes(permission);
  }

  hasAnyPermission(user: User, permissions: string[]): boolean {
    const userPermissions = this.getPermissionsForRole(user.role);
    return permissions.some(permission => userPermissions.includes(permission));
  }

  // Health check
  async healthCheck(): Promise<AuthResult<{
    totalUsers: number;
    activeUsers: number;
    mfaEnabledUsers: number;
    databaseStatus: 'connected' | 'disconnected';
    jwtStatus: 'valid' | 'invalid';
  }>> {
    try {
      const totalUsers = this.users.size;
      const activeUsers = Array.from(this.users.values()).filter(u => u.isActive).length;
      const mfaEnabledUsers = Array.from(this.users.values()).filter(u => u.mfaEnabled).length;

      return {
        success: true,
        data: {
          totalUsers,
          activeUsers,
          mfaEnabledUsers,
          databaseStatus: 'connected',
          jwtStatus: 'valid'
        }
      };
    } catch (error) {
      console.error('Health check error:', error);
      return {
        success: false,
        error: 'Health check failed'
      };
    }
}

// Singleton instance
let authenticationService: AuthenticationService | null = null;

export function getAuthenticationService(): AuthenticationService {
  if (!authenticationService) {
    const config: AuthConfig = {
      jwt: {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
        expiresIn: '1h',
        refreshExpiresIn: '30d',
        issuer: 'trusthire-security',
        algorithm: 'HS256'
      },
      bcrypt: {
        saltRounds: 12
      },
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxAttempts: 5,
        skipSuccessfulRequests: true
      },
      password: {
        minLength: 8,
        maxLength: 128,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true
      },
      mfa: {
        issuer: 'TrustHire Security',
        window: 5 * 60, // 5 minutes
        backupCodesGenerated: 10
      },
      session: {
        secret: process.env.SESSION_SECRET || 'your-session-secret',
        resave: true,
        rolling: true,
        maxAge: '24h'
      }
    };
    
    authenticationService = new AuthenticationService(config);
  }
  return authenticationService;
}
