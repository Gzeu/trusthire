// Authentication API Routes
// Login, registration, token management, and user management

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticationService } from '@/lib/auth/authentication-service';

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe, mfaCode } = await request.json();

    const authService = getAuthenticationService();
    const result = await authService.login({
      email,
      password,
      rememberMe,
      mfaCode
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'Login successful'
      });
    } else {
      const statusCode = result.error?.includes('locked') ? 423 : 
                         result.error?.includes('MFA') ? 401 : 401;
      
      return NextResponse.json({
        success: false,
        error: result.error,
        code: result.error?.includes('locked') ? 'ACCOUNT_LOCKED' : 
               result.error?.includes('MFA') ? 'MFA_REQUIRED' : 'INVALID_CREDENTIALS',
        statusCode
      }, { status: statusCode });
    }
  } catch (error) {
      console.error('Login error:', error);
      return NextResponse.json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        status: 500
      }, { status: 500 });
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      username, 
      password, 
      confirmPassword, 
      role, 
      firstName, 
      lastName, 
      organization, 
      phone, 
      department 
    } = await request.json();

    const authService = getAuthenticationService();
    const result = await authService.register({
      email,
      username,
      password,
      confirmPassword,
      role,
      firstName,
      lastName,
      organization,
      phone,
      department
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'Registration successful'
      });
    } else {
      const statusCode = result.error?.includes('exists') ? 409 : 
                         result.error?.includes('password') ? 400 : 400;
      
      return NextResponse.json({
        success: false,
        error: result.error,
        code: result.error?.includes('exists') ? 'USER_EXISTS' : 
               result.error?.includes('password') ? 'INVALID_PASSWORD' : 'VALIDATION_ERROR',
        statusCode
      }, { status: statusCode });
    }
  } catch (error) {
      console.error('Registration error:', error);
      return NextResponse.json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        status: 500
      }, { status: 500 });
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();

    const authService = getAuthenticationService();
    const result = await authService.refreshToken(refreshToken);

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'Token refreshed successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Token refresh failed',
        code: 'INVALID_TOKEN'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Token refresh error:', error);
      return NextResponse.json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        status: 500
      }, { status: 500 });
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword, confirmPassword } = await request.json();

    const authService = getAuthenticationService();
    const userId = request.user?.id;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED'
      }, { status: 401 });
    }

    const result = await authService.changePassword(userId, {
      currentPassword,
      newPassword,
      confirmPassword
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'Password changed successfully'
      });
    } else {
      const statusCode = result.error?.includes('incorrect') ? 400 : 400;
      
      return NextResponse.json({
        success: false,
        error: result.error,
        code: result.error?.includes('incorrect') ? 'INVALID_CURRENT_PASSWORD' : 'PASSWORD_CHANGE_FAILED',
        statusCode
      }, { status: statusCode });
    }
  } catch (error) {
    console.error('Password change error:', error);
      return NextResponse.json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        status: 500
      }, { status: 500 });
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, token, newPassword, confirmPassword } = await request.json();

    const authService = getAuthenticationService();
    const result = await authService.resetPassword({
      email,
      token,
      newPassword,
      confirmPassword
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'Password reset successful'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Password reset failed',
        code: 'PASSWORD_RESET_FAILED'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Password reset error:', error);
      return NextResponse.json({
        success: false,
        error: 'Internal server error',
        code: ' 'INTERNAL_SERVER_ERROR',
        status: 500
      }, { status: 500 });
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const authService = getAuthenticationService();
    const userId = request.user?.id;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED'
      }, { status: 401 });
    }

    const result = await authService.getUserById(userId);

    if (result.success) {
      // Remove sensitive data before returning
      const { password, ...user } = result.data;
      const userWithoutPassword = { ...user };
      
      return NextResponse.json({
        success: true,
        data: userWithoutPassword
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'User not found',
        code: 'USER_NOT_FOUND'
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
      status: 500
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authService = getAuthenticationService();
    const result = await authService.logout(request.headers.authorization?.substring(7));

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'Logout successful'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Logout failed',
        code: 'INVALID_TOKEN'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        status: 500
      }, { status: 500 });
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const authService = getAuthenticationService();
    const result = await authService.healthCheck();

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
      status: 500
    }, { status: 500 });
  }
}
