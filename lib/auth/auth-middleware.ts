// Authentication Middleware
// JWT-based authentication middleware for API protection

import { Request, Response, NextFunction } from 'express';
import { getAuthenticationService } from './authentication-service';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
    permissions: string[];
  };
  token?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    scope: string[];
  };
}

export interface AuthOptions {
  required?: boolean;
  permissions?: string[];
  roles?: string[];
  skipAuth?: boolean;
}

export interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}

// Rate limiting store
const rateLimitStore = new Map<string, {
  count: number;
  resetTime: number;
  windowMs: number;
}>();

export function createAuthMiddleware(options: AuthOptions = {}) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authService = getAuthenticationService();
    
    // Skip authentication if explicitly requested
    if (options.skipAuth) {
      return next();
    }

    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return handleUnauthorized(res, options, 'No authorization header provided');
    }

    if (!authHeader.startsWith('Bearer ')) {
      return handleUnauthorized(res, options, 'Invalid authorization header format');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const authResult = await authService.verifyToken(token);
    if (!authResult.success) {
      return handleUnauthorized(res, options, authResult.error || 'Invalid token');
    }

    // Attach user and token to request
    req.user = authResult.data.user;
    req.token = authResult.data;
    
    // Check required permissions
    if (options.required && options.permissions && options.permissions.length > 0) {
      const userPermissions = authResult.data.permissions;
      const hasRequiredPermissions = options.permissions.every(permission => 
        userPermissions.includes(permission)
      );
      
      if (!hasRequiredPermissions) {
        return handleForbidden(res, options, 'Insufficient permissions');
      }
    }

    // Check required roles
    if (options.roles && options.roles.length > 0) {
      const userRole = authResult.data.user.role;
      const hasRequiredRole = options.roles.includes(userRole);
      
      if (!hasRequiredRole) {
        return handleForbidden(res, options, 'Insufficient role');
      }
    }

    next();
  };
}

export function createRateLimitMiddleware(options: RateLimitOptions = {}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes default
    const maxRequests = options.maxRequests || 100;
    const message = options.message || 'Too many requests';

    // Get current rate limit data
    const current = rateLimitStore.get(key) || {
      count: 0,
      resetTime: now,
      windowMs
    };

    // Reset window if expired
    if (now - current.resetTime > current.windowMs) {
      rateLimitStore.delete(key);
      current.count = 0;
      current.resetTime = now;
    }

    // Check rate limit
    if (current.count >= maxRequests) {
      const resetTime = new Date(now + current.windowMs).toISOString();
      rateLimitStore.set(key, {
        ...current,
        resetTime
      });
      
      return handleTooManyRequests(res, message, resetTime);
    }

    // Increment counter
    current.count++;
    rateLimitStore.set(key, current);

    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': Math.max(0, maxRequests - current.count).toString(),
      'X-RateLimit-Reset': new Date(current.resetTime + current.windowMs).toISOString(),
      'Retry-After': current.windowMs.toString()
    });

    next();
  };
}

export function createRoleBasedAuthMiddleware(roles: string[], permissions: string[]) {
  return createAuthMiddleware({
    required: true,
    roles,
    permissions
  });
}

export function createPermissionBasedAuthMiddleware(permissions: string[]) {
  return createAuthMiddleware({
    required: true,
    permissions
  });
}

// Helper functions for error handling
function handleUnauthorized(res: Response, options: AuthOptions, message?: string) {
  res.status(401).json({
    success: false,
    error: message || 'Unauthorized',
    code: 'UNAUTHORIZED',
    ...(options.skipAuth ? {} : {
      'WWW-Authenticate': 'Bearer realm="TrustHire Security"'
    })
  });
}

function handleForbidden(res: Response, options: AuthOptions, message?: string) {
  res.status(403).json({
    success: false,
    error: message || 'Forbidden',
    code: 'FORBIDDEN'
  });
}

function handleTooManyRequests(res: Response, message: string, resetTime: string) {
  res.status(429).json({
    success: false,
    error: message,
    code: 'TOO_MANY_REQUESTS',
    'Retry-After': resetTime
  });
}

// Middleware for API key validation
export function createApiKeyMiddleware(allowedKeys: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'API key required',
        code: 'API_KEY_REQUIRED'
      });
    }

    if (!allowedKeys.includes(apiKey)) {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key',
        code: 'INVALID_API_KEY'
      });
    }

    next();
  };
}

// Middleware for session validation
export function createSessionMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const sessionId = req.headers['x-session-id'];
    
    if (!sessionId) {
      return res.status(401).json({
        success: false,
        error: 'Session ID required',
        code: 'SESSION_REQUIRED'
      });
    }

    // In production, you would validate the session against a database
    // For now, we'll just check if it exists
    
    next();
  };
}

// Middleware for CORS
export function createCorsMiddleware(allowedOrigins: string[] = ['*']) {
  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header(' 'Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Session-ID');
      res.header('Access-Control-Allow-Credentials', 'true');
    }

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    next();
  };
}

// Security headers middleware
export function createSecurityHeadersMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=315360; includeSubDomains; preload');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'unsafe-inline'; object-src 'none';");
    
    // Remove server information
    res.removeHeader('Server');
    res.removeHeader('X-Powered-By');
    
    next();
  };
}

// Request logging middleware
export function createRequestLoggingMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const timestamp = new Date().toISOString();
      
      console.log({
        timestamp,
        method: req.method,
        url: req.url,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        duration: `${duration}ms`,
        statusCode: res.statusCode,
        contentLength: res.get('content-length'),
        referer: req.headers.referer,
        user: req.user?.email || 'anonymous'
      });
    });

    next();
  };
}

// Comprehensive security middleware
export function createSecurityMiddleware(options: {
  requireAuth?: boolean;
  requireApiKey?: boolean;
  requireRateLimit?: boolean;
  allowedOrigins?: string[];
  allowedApiKeys?: string[];
  rateLimit?: RateLimitOptions;
} = {}) {
  const middlewares = [];

  // Add CORS middleware
  if (options.allowedOrigins) {
    middlewares.push(createCorsMiddleware(options.allowedOrigins));
  }

  // Add security headers
  middlewares.push(createSecurityHeadersMiddleware());

  // Add request logging
  middlewares.push(createRequestLoggingMiddleware());

  // Add API key validation
  if (options.requireApiKey && options.allowedApiKeys) {
    middlewares.push(createApiKeyMiddleware(options.allowedApiKeys));
  }

  // Add rate limiting
  if (options.requireRateLimit) {
    middlewares.push(createRateLimitMiddleware(options.rateLimit));
  }

  // Add authentication
  if (options.requireAuth) {
    middlewares.push(createAuthMiddleware({
      required: true,
      roles: options.roles,
      permissions: options.permissions
    }));
  }

  return middlewares;
}
