// Authentication API Routes
// Login endpoint

import { NextRequest, NextResponse } from 'next/server';

// Mock authentication service for deployment
interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

interface AuthResult {
  success: boolean;
  data?: any;
  error?: string;
}

class MockAuthService {
  private users: Map<string, User> = new Map();

  constructor() {
    // Initialize with mock users
    this.users.set('1', {
      id: '1',
      email: 'admin@trusthire.com',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    
    this.users.set('2', {
      id: '2',
      email: 'analyst@trusthire.com',
      username: 'analyst',
      firstName: 'Security',
      lastName: 'Analyst',
      role: 'analyst',
      createdAt: new Date().toISOString()
    });
  }

  async login(email: string, password: string): Promise<AuthResult> {
    // Mock login - accept any password for demo users
    const user = Array.from(this.users.values()).find(u => u.email === email);
    
    if (user) {
      return {
        success: true,
        data: {
          user,
          accessToken: 'mock-access-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          expiresIn: 3600
        }
      };
    }
    
    return {
      success: false,
      error: 'Invalid credentials'
    };
  }

  async register(userData: any): Promise<AuthResult> {
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'viewer',
      createdAt: new Date().toISOString()
    };

    this.users.set(newUser.id, newUser);

    return {
      success: true,
      data: {
        user: newUser,
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresIn: 3600
      }
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResult> {
    // Mock refresh token validation
    if (refreshToken.startsWith('mock-refresh-token')) {
      return {
        success: true,
        data: {
          accessToken: 'mock-access-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          expiresIn: 3600
        }
      };
    }
    
    return {
      success: false,
      error: 'Invalid refresh token'
    };
  }

  async verifyToken(token: string): Promise<User | null> {
    // Mock token verification
    if (token.startsWith('mock-access-token')) {
      return Array.from(this.users.values())[0]; // Return first user for demo
    }
    return null;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<AuthResult> {
    // Mock password change
    return {
      success: true
    };
  }

  async logout(token: string): Promise<void> {
    // Mock logout - nothing to do
  }

  async healthCheck(): Promise<any> {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      users: this.users.size
    };
  }
}

const mockAuthService = new MockAuthService();

// Login
export async function POST(request: NextRequest) {
  try {
    const { email, password, action = 'login' } = await request.json();

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({
          success: false,
          error: 'Email and password are required',
          code: 'MISSING_CREDENTIALS'
        }, { status: 400 });
      }

      const result = await mockAuthService.login(email, password);

      if (result.success) {
        return NextResponse.json({
          success: true,
          data: result.data,
          message: 'Login successful'
        });
      } else {
        return NextResponse.json({
          success: false,
          error: result.error,
          code: 'INVALID_CREDENTIALS'
        }, { status: 401 });
      }
    } else if (action === 'register') {
      const { username, firstName, lastName, role = 'viewer' } = await request.json();

      if (!email || !username || !password || !firstName || !lastName) {
        return NextResponse.json({
          success: false,
          error: 'All required fields must be provided',
          code: 'MISSING_REQUIRED_FIELDS'
        }, { status: 400 });
      }

      const result = await mockAuthService.register({
        email,
        username,
        password,
        firstName,
        lastName,
        role
      });

      if (result.success) {
        return NextResponse.json({
          success: true,
          data: result.data,
          message: 'Registration successful'
        });
      } else {
        return NextResponse.json({
          success: false,
          error: result.error,
          code: 'REGISTRATION_FAILED'
        }, { status: 400 });
      }
    } else if (action === 'refresh') {
      const { refreshToken } = await request.json();

      if (!refreshToken) {
        return NextResponse.json({
          success: false,
          error: 'Refresh token is required',
          code: 'MISSING_REFRESH_TOKEN'
        }, { status: 400 });
      }

      const result = await mockAuthService.refreshToken(refreshToken);

      if (result.success) {
        return NextResponse.json({
          success: true,
          data: result.data,
          message: 'Token refreshed successfully'
        });
      } else {
        return NextResponse.json({
          success: false,
          error: result.error,
          code: 'INVALID_REFRESH_TOKEN'
        }, { status: 401 });
      }
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid action',
        code: 'INVALID_ACTION'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

// Get User Profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'health') {
      const health = await mockAuthService.healthCheck();

      return NextResponse.json({
        success: true,
        data: health
      });
    } else if (action === 'profile') {
      const authHeader = request.headers.get('authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({
          success: false,
          error: 'Authorization token is required',
          code: 'MISSING_AUTH_TOKEN'
        }, { status: 401 });
      }

      const token = authHeader.substring(7);
      const user = await mockAuthService.verifyToken(token);

      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'Invalid or expired token',
          code: 'INVALID_TOKEN'
        }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        data: user
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid action',
        code: 'INVALID_ACTION'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('GET auth error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}
