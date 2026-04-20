// Enhanced authentication service for TrustHire Autonomous System
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'analyst' | 'manager';
  permissions: string[];
  lastLogin?: string;
  isActive: boolean;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  token?: string;
  error?: string;
  expiresIn?: number;
}

export interface SessionData {
  userId: string;
  sessionId: string;
  createdAt: string;
  expiresAt: string;
  lastActivity: string;
  ipAddress?: string;
  userAgent?: string;
}

export class EnhancedAuthService {
  private sessions = new Map<string, SessionData>();
  private users = new Map<string, AuthUser>();

  constructor() {
    this.initializeMockUsers();
    // Clean up expired sessions every hour
    setInterval(() => this.cleanupSessions(), 3600000);
  }

  private initializeMockUsers(): void {
    const mockUsers: AuthUser[] = [
      {
        id: '1',
        email: 'admin@trusthire.com',
        name: 'System Administrator',
        role: 'admin',
        permissions: ['read', 'write', 'delete', 'manage_users', 'system_config'],
        isActive: true
      },
      {
        id: '2',
        email: 'analyst@trusthire.com',
        name: 'Security Analyst',
        role: 'analyst',
        permissions: ['read', 'write', 'analyze'],
        isActive: true
      }
    ];

    mockUsers.forEach(user => {
      this.users.set(user.email, user);
    });
  }

  async authenticate(email: string, password: string): Promise<AuthResult> {
    const user = this.users.get(email);
    
    if (!user || !user.isActive) {
      return {
        success: false,
        error: 'Invalid credentials or user inactive'
      };
    }

    // Mock password validation - in production, use proper hashing
    if (password !== 'password123') {
      return {
        success: false,
        error: 'Invalid password'
      };
    }

    const token = this.generateToken(user);
    const sessionId = this.createSession(user);

    return {
      success: true,
      user,
      token,
      expiresIn: 3600 // 1 hour
    };
  }

  async validateToken(token: string): Promise<AuthResult> {
    try {
      const payload = this.decodeToken(token);
      const user = this.users.get(payload.email);
      
      if (!user || !user.isActive) {
        return {
          success: false,
          error: 'User not found or inactive'
        };
      }

      const session = this.sessions.get(payload.sessionId);
      if (!session || new Date(session.expiresAt) < new Date()) {
        return {
          success: false,
          error: 'Session expired'
        };
      }

      // Update last activity
      session.lastActivity = new Date().toISOString();

      return {
        success: true,
        user
      };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid token'
      };
    }
  }

  async refreshToken(token: string): Promise<AuthResult> {
    const validation = await this.validateToken(token);
    
    if (!validation.success || !validation.user) {
      return validation;
    }

    const newToken = this.generateToken(validation.user);
    const sessionId = this.createSession(validation.user);

    return {
      success: true,
      user: validation.user,
      token: newToken,
      expiresIn: 3600
    };
  }

  async logout(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = this.decodeToken(token);
      this.sessions.delete(payload.sessionId);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid token'
      };
    }
  }

  private generateToken(user: AuthUser): string {
    // Mock JWT generation - in production, use proper JWT library
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId: this.generateSessionId(),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    };

    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  private decodeToken(token: string): any {
    // Mock JWT decoding - in production, use proper JWT library
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString());
      return payload;
    } catch (error) {
      throw new Error('Invalid token format');
    }
  }

  private createSession(user: AuthUser): string {
    const sessionId = this.generateSessionId();
    const session: SessionData = {
      userId: user.id,
      sessionId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
      lastActivity: new Date().toISOString()
    };

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private cleanupSessions(): void {
    const now = new Date();
    const expiredSessions: string[] = [];

    const entries = Array.from(this.sessions.entries());
    for (const [sessionId, session] of entries) {
      if (new Date(session.expiresAt) < now) {
        expiredSessions.push(sessionId);
      }
    }

    expiredSessions.forEach(sessionId => {
      this.sessions.delete(sessionId);
    });
  }

  hasPermission(user: AuthUser, permission: string): boolean {
    return user.permissions.includes(permission) || user.role === 'admin';
  }

  getActiveSessions(): SessionData[] {
    return Array.from(this.sessions.values());
  }

  getUserSessions(userId: string): SessionData[] {
    return Array.from(this.sessions.values()).filter(
      session => session.userId === userId
    );
  }
}

export const enhancedAuthService = new EnhancedAuthService();
