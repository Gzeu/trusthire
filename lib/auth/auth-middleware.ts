// Authentication Middleware
// Simplified authentication middleware for Next.js

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticationService } from './authentication-service';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
    permissions: string[];
  };
}

export interface AuthMiddlewareOptions {
  requireAuth?: boolean;
  requireApiKey?: boolean;
  requireRateLimit?: boolean;
  allowedOrigins?: string[];
  allowedApiKeys?: string[];
  rateLimit?: RateLimitOptions;
}

export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

export interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// Simple in-memory rate limiter for demo purposes
const rateLimitStore: RateLimitStore = {};

export function createAuthMiddleware(options: AuthMiddlewareOptions = {}) {
  const {
    requireAuth = true,
    requireApiKey = false,
    requireRateLimit = false,
    allowedOrigins = ['http://localhost:3000'],
    allowedApiKeys = [],
    rateLimit = {
      windowMs: 60000, // 1 minute
      maxRequests: 100,
      message: 'Too many requests'
    }
  } = options;

  return async (req: NextRequest, res?: NextResponse) => {
    try {
      // CORS handling
      if (allowedOrigins.length > 0) {
        const origin = req.headers.get('origin');
        if (origin && allowedOrigins.includes(origin)) {
          const response = NextResponse.next();
          response.headers.set('Access-Control-Allow-Origin', origin);
          response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          response.headers.set('Access-Control-Allow-Credentials', 'true');
          return response;
        }
      }

      // Rate limiting
      if (requireRateLimit) {
        const clientIp = getClientIp(req);
        const now = Date.now();
        const key = `rate-limit:${clientIp}`;
        
        if (!rateLimitStore[key] || now > rateLimitStore[key].resetTime) {
          rateLimitStore[key] = {
            count: 1,
            resetTime: now + rateLimit.windowMs
          };
        } else {
          rateLimitStore[key].count++;
          
          if (rateLimitStore[key].count > rateLimit.maxRequests) {
            return NextResponse.json({
              error: rateLimit.message || 'Rate limit exceeded',
              code: 'RATE_LIMIT_EXCEEDED',
              retryAfter: Math.ceil((rateLimitStore[key].resetTime - now) / 1000)
            }, { status: 429 });
          }
        }
      }

      // API key validation
      if (requireApiKey) {
        const apiKey = req.headers.get('x-api-key');
        
        if (!apiKey || !allowedApiKeys.includes(apiKey)) {
          return NextResponse.json({
            error: 'Invalid or missing API key',
            code: 'INVALID_API_KEY'
          }, { status: 401 });
        }
      }

      // Authentication
      if (requireAuth) {
        const authHeader = req.headers.get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return NextResponse.json({
            error: 'Authorization token is required',
            code: 'MISSING_AUTH_TOKEN'
          }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const authService = getAuthenticationService();
        
        try {
          // Mock token verification
          if (token.startsWith('mock-access-token')) {
            const user = {
              id: '1',
              email: 'admin@trusthire.com',
              username: 'admin',
              role: 'admin',
              permissions: ['read', 'write', 'admin']
            };
            
            // Add user to request context (in Next.js, we'd handle this differently)
            return NextResponse.next();
          } else {
            return NextResponse.json({
              error: 'Invalid token',
              code: 'INVALID_TOKEN'
            }, { status: 401 });
          }
        } catch (error) {
          console.error('Auth error:', error);
          return NextResponse.json({
            error: 'Authentication failed',
            code: 'AUTH_ERROR'
          }, { status: 401 });
        }
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.json({
        error: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR'
      }, { status: 500 });
    }
  };
}

// Helper functions
function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  
  return forwardedFor ? forwardedFor.split(',')[0].trim() : 
         realIp || 
         '127.0.0.1';
}

// Role-based access control
export function hasPermission(user: any, permission: string): boolean {
  if (!user || !user.permissions) {
    return false;
  }
  
  return user.permissions.includes(permission) || user.permissions.includes('admin');
}

// Role checking
export function hasRole(user: any, role: string): boolean {
  if (!user || !user.role) {
    return false;
  }
  
  return user.role === role || user.role === 'admin';
}

// API key validation
export function validateApiKey(req: NextRequest, allowedKeys: string[]): boolean {
  const apiKey = req.headers.get('x-api-key');
  return apiKey ? allowedKeys.includes(apiKey) : false;
}

// JWT token extraction (simplified)
export function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7);
}

// Rate limiting check
export function checkRateLimit(req: NextRequest, options: RateLimitOptions): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const clientIp = getClientIp(req);
  const now = Date.now();
  const key = `rate-limit:${clientIp}`;
  
  if (!rateLimitStore[key] || now > rateLimitStore[key].resetTime) {
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + options.windowMs
    };
    
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetTime: rateLimitStore[key].resetTime
    };
  }
  
  rateLimitStore[key].count++;
  
  return {
    allowed: rateLimitStore[key].count <= options.maxRequests,
    remaining: Math.max(0, options.maxRequests - rateLimitStore[key].count),
    resetTime: rateLimitStore[key].resetTime
  };
}

// Security headers
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
  
  return response;
}

// CORS configuration
export function configureCORS(response: NextResponse, origin: string): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  
  return response;
}

// Error response helper
export function createErrorResponse(
  error: string, 
  code: string, 
  statusCode: number = 500, 
  details?: any
): NextResponse {
  return NextResponse.json({
    error,
    code,
    ...(details && { details })
  }, { status: statusCode });
}

// Success response helper
export function createSuccessResponse(
  data: any, 
  message?: string
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    ...(message && { message })
  });
}

// Predefined middleware configurations
export const authMiddleware = createAuthMiddleware({
  requireAuth: true,
  requireRateLimit: true,
  rateLimit: {
    windowMs: 60000,
    maxRequests: 100
  }
});

export const apiKeyMiddleware = createAuthMiddleware({
  requireAuth: false,
  requireApiKey: true
});

export const publicMiddleware = createAuthMiddleware({
  requireAuth: false,
  requireApiKey: false,
  requireRateLimit: true,
  rateLimit: {
    windowMs: 60000,
    maxRequests: 200
  }
});
