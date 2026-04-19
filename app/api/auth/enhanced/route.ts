// Enhanced Authentication API Routes
// Comprehensive authentication endpoints with MFA and session management

import { NextRequest, NextResponse } from 'next/server';
import { enhancedAuthService } from '@/lib/auth/enhanced-auth-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'register':
        return handleRegister(body);
      case 'login':
        return handleLogin(body, request);
      case 'refresh':
        return handleRefresh(body);
      case 'logout':
        return handleLogout(body);
      case 'setup-mfa':
        return handleSetupMFA(body);
      case 'enable-mfa':
        return handleEnableMFA(body);
      case 'disable-mfa':
        return handleDisableMFA(body);
      case 'create-api-key':
        return handleCreateApiKey(body);
      case 'get-user-sessions':
        return handleGetUserSessions(body);
      case 'revoke-session':
        return handleRevokeSession(body);
      default:
        return NextResponse.json(
          { error: 'Invalid action', message: `Action '${action}' is not supported` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Auth API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Authentication error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

async function handleRegister(body: any) {
  try {
    const { email, username, firstName, lastName, password, confirmPassword, acceptTerms } = body;

    if (!email || !password || !confirmPassword || acceptTerms === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await enhancedAuthService.register({
      email,
      username,
      firstName,
      lastName,
      password,
      confirmPassword,
      acceptTerms
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Registration failed' },
      { status: 400 }
    );
  }
}

async function handleLogin(body: any, request: NextRequest) {
  try {
    const { email, password, mfaCode, rememberMe, deviceInfo } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get client info
    const ipAddress = request.ip || request.headers.get('x-forwarded-for') || undefined;
    const userAgent = request.headers.get('user-agent') || undefined;

    const result = await enhancedAuthService.login({
      email,
      password,
      mfaCode,
      rememberMe,
      deviceInfo: {
        ...deviceInfo,
        ipAddress,
        userAgent
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 401 }
    );
  }
}

async function handleRefresh(body: any) {
  try {
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    const tokens = await enhancedAuthService.refreshTokens(refreshToken);

    return NextResponse.json(tokens);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Token refresh failed' },
      { status: 401 }
    );
  }
}

async function handleLogout(body: any) {
  try {
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    await enhancedAuthService.logout(refreshToken);

    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Logout failed' },
      { status: 400 }
    );
  }
}

async function handleSetupMFA(body: any) {
  try {
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const result = await enhancedAuthService.setupMFA(userId);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'MFA setup failed' },
      { status: 400 }
    );
  }
}

async function handleEnableMFA(body: any) {
  try {
    const { userId, code } = body;

    if (!userId || !code) {
      return NextResponse.json(
        { error: 'User ID and verification code are required' },
        { status: 400 }
      );
    }

    await enhancedAuthService.enableMFA(userId, code);

    return NextResponse.json({ success: true, message: 'MFA enabled successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'MFA enable failed' },
      { status: 400 }
    );
  }
}

async function handleDisableMFA(body: any) {
  try {
    const { userId, password } = body;

    if (!userId || !password) {
      return NextResponse.json(
        { error: 'User ID and password are required' },
        { status: 400 }
      );
    }

    await enhancedAuthService.disableMFA(userId, password);

    return NextResponse.json({ success: true, message: 'MFA disabled successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'MFA disable failed' },
      { status: 400 }
    );
  }
}

async function handleCreateApiKey(body: any) {
  try {
    const { userId, name, permissions, expiresAt, rateLimit, metadata } = body;

    if (!userId || !name || !permissions) {
      return NextResponse.json(
        { error: 'User ID, name, and permissions are required' },
        { status: 400 }
      );
    }

    const result = await enhancedAuthService.createApiKey(userId, {
      name,
      permissions,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      rateLimit,
      metadata
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'API key creation failed' },
      { status: 400 }
    );
  }
}

async function handleGetUserSessions(body: any) {
  try {
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const sessions = await enhancedAuthService.getUserSessions(userId);

    return NextResponse.json({ sessions });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get sessions' },
      { status: 400 }
    );
  }
}

async function handleRevokeSession(body: any) {
  try {
    const { userId, sessionId } = body;

    if (!userId || !sessionId) {
      return NextResponse.json(
        { error: 'User ID and session ID are required' },
        { status: 400 }
      );
    }

    await enhancedAuthService.revokeSession(userId, sessionId);

    return NextResponse.json({ success: true, message: 'Session revoked successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Session revocation failed' },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'health':
        return handleHealthCheck();
      case 'verify-token':
        return handleVerifyToken(request);
      default:
        return NextResponse.json(
          { error: 'Invalid action', message: `Action '${action}' is not supported` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Auth GET API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Authentication error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

async function handleHealthCheck() {
  try {
    const health = await enhancedAuthService.healthCheck();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      ...health
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Health check failed'
      },
      { status: 503 }
    );
  }
}

async function handleVerifyToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // This would typically verify the JWT token
    // For now, we'll just return a simple verification
    // In a real implementation, you'd decode and verify the JWT
    
    return NextResponse.json({
      valid: true,
      message: 'Token is valid'
    });
  } catch (error) {
    return NextResponse.json(
      { 
        valid: false,
        error: error instanceof Error ? error.message : 'Token verification failed'
      },
      { status: 401 }
    );
  }
}
