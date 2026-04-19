// Security Middleware
// Comprehensive security middleware for rate limiting and connection validation

import { Request, Response, NextFunction } from 'express';
import { getRateLimiter } from './rate-limiter';

export interface SecurityMiddlewareOptions {
  rateLimit: {
    enabled: boolean;
    config?: Partial<RateLimitConfig>;
  };
  connection: {
    enabled: boolean;
    config?: Partial<ConnectionValidationConfig>;
  };
  ipWhitelist: string[];
  cors: {
    enabled: boolean;
    origins: string[];
    methods: string[];
    headers: string[];
    credentials: boolean;
  };
  ssl: {
    enabled: boolean;
    redirectHttpToHttps: boolean;
    hstsEnabled: boolean;
    frameOptions: string[];
    customHeaders: Record<string, string>;
  };
  };
  logging: {
    enabled: boolean;
    level: 'error' | 'warn' | 'info' | 'debug';
    logFormat: 'json';
    logRequests: boolean;
    logHeaders: boolean;
    logBody: boolean;
    logUserAgent: boolean;
    logIP: boolean;
    logCountry: boolean;
    logUserAgent: boolean;
    logTimestamp: boolean;
    logRequestId: boolean;
    logResponseTime: boolean;
    logErrorDetails: boolean;
  };
  headers: {
    security: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=630720000; includeSubDomains; preload',
      'Content-Security-Policy': "default-src 'self'; script-src 'unsafe-inline'; object-src 'unsafe-eval'; object-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: data:; font-src data: 'font-src data: font-src data: data: font-src data: blob:; frame-src; frame-src; frame-ancestors; connect-src; media-src; manifest-src; worker-src; manifest-src; worker; report-to; report-uri; report-to; report-uri; referrer; origin; base-uri; form-action'
    },
    'X-Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=630720000; includeSubDomains; preload',
      'Content-Security-Policy': "default-src 'self'; script-src 'unsafe-inline; object-src 'unsafe-eval'; object-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: data: font-src data: font-src data: data: font-src data: blob: frame-src; frame-src; frame-ancestors; connect-src; media-src; manifest-src; worker-src; report-to; report-uri; report-to; report-uri; referrer; origin; base-uri; form-action'
    }
  };
}

export interface SecurityResult {
  allowed: boolean;
  error?: string;
    warnings: string[];
    metadata?: {
      clientIp: string;
      country?: string;
      userAgent?: string;
      blockedReason?: string;
      rateLimit?: RateLimitResult;
      connectionValidation?: any;
    };
}

export class SecurityMiddleware {
  private rateLimiter: RateLimiter;
  private options: SecurityMiddlewareOptions;
  private securityMetrics: {
    totalRequests: number;
    blockedRequests: number;
    rateLimitedRequests: number;
    suspiciousRequests: number;
    connectionErrors: number;
    sslErrors: number;
    invalidRequests: number;
    corsErrors: number;
  };

  constructor(options: SecurityMiddlewareOptions = {}) {
    this.options = {
      rateLimit: {
        enabled: true,
        config: {
          algorithm: 'fixed_window',
          windowSize: 60000, // 1 minute
          maxRequests: 100,
          burstLimit: 200,
          penaltyMultiplier: 2,
          skipSuccessfulRequests: true
        }
      },
      connection: {
        enabled: true,
        config: {
          maxConnections: 1000,
          timeout: 30000,
          retryAttempts: 3,
          retryDelay: 1000
          ipValidation: {
            enabled: true,
            blacklist: ['192.168.1.100', '10.0.0.1'],
            whitelist: ['127.0.0.1', '10.0.0.2'],
            geoLocation: {
              enabled: true,
              allowedCountries: ['US', 'CA', 'GB', 'DE', 'FR', 'JP', 'AU'],
              blockedCountries: ['CN', 'RU', 'KP', 'IR', 'MM'],
              allowedRegions: ['us-east-1', 'us-west-2', 'eu-west-1', 'eu-west-2'],
              blockedRegions: ['cn-north-1', 'cn-northwest']
            }
          },
          userValidation: {
            enabled: true,
            requireAuthentication: true,
            allowedRoles: ['admin', 'analyst', 'viewer'],
            blockedUsers: [],
            sessionValidation: {
              enabled: true,
              maxSessions: 10,
              sessionTimeout: 30
            }
          },
          requestValidation: {
            enabled: true,
            maxRequestSize: 1048576,
            allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            allowedContentTypes: ['application/json', 'text/plain', 'multipart/form-data'],
            maxUrlLength: 2048,
            suspiciousPatterns: [
              '<script',
              'javascript:',
              'eval(',
              'document.cookie',
              'document.write',
              'window.location',
              'document.referrer'
            ]
          },
          sslValidation: {
            enabled: true,
            minVersion: 'TLSv1.2',
            allowedCiphers: [
              'TLS_AES_128_GCM_SHA256',
              'TLS_AES_128_GCM_SHA384',
              'TLS_AES_128_CBC_SHA256',
              'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA',
              'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA'
            ],
            certificateValidation: true,
            ocspStapling: true,
            hstsEnabled: true
          }
        }
      },
      cors: {
        enabled: true,
        origins: ['https://trusthire.com', 'https://api.trusthire.com'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
        },
        credentials: true
      },
      ssl: {
        enabled: true,
        redirectHttpToHttps: true,
        hstsEnabled: true,
        frameOptions: ['DENY', 'SAMEORIGIN', 'ALLOW-FROM', 'ALLOW-FROM', 'ALLOW-FROM'],
        customHeaders: {
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'X-XSS-Protection': '1; mode=block',
          'Strict-Transport-Security': 'max-age=630720000; includeSubDomains; preload',
          'Content-Security-Policy': "default-src 'self'; script-src 'unsafe-inline'; object-src 'unsafe-eval'; object-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: data: font-src data: font-src data: data: font-src data: blob: frame-src; frame-src; frame-ancestors; connect-src; media-src; manifest-src; worker-src; report-to; report-uri; report-to; report-uri; referrer; origin; base-uri; form-action'
        }
      },
      logging: {
        enabled: true,
        level: 'warn',
        logFormat: 'json',
        logRequests: true,
        logHeaders: true,
        logBody: true,
        logUserAgent: true,
        logIP: true,
        logCountry: true,
        logTimestamp: true,
        logRequestId: true,
        logResponseTime: true,
        logErrorDetails: true
      }
    };

    this.rateLimiter = getRateLimiter(
      this.options.rateLimit.config,
      this.options.connection.config
    );
    this.securityMetrics = {
      totalRequests: 0,
      blockedRequests: 0,
      rateLimitedRequests: 0,
      suspiciousRequests: 0,
      connectionErrors: 0,
      sslErrors: 0,
      invalidRequests: 0,
      corsErrors: 0
    };
  }

  // Main middleware function
  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Skip security checks if disabled
      if (!this.options.rateLimit.enabled && !this.options.connection.enabled) {
        return next();
      }

      // Apply security headers
      this.setSecurityHeaders(res);

      // CORS handling
      this.handleCORS(req, res);

      // Rate limiting
      const rateLimitResult = this.rateLimiter.checkLimit(
        this.getClientIdentifier(req),
        this.getSessionId(req)
      );

      if (!rateLimitResult.allowed) {
        return this.sendRateLimitResponse(res, rateLimitResult);
      }

      // Connection validation
      const connectionValidation = this.rateLimiter.validateConnection(req);
      if (!connectionValidation.isValid) {
        return this.sendSecurityErrorResponse(res, connectionValidation.errors, 403);
      }

      // Request validation
      const requestValidation = this.rateLimiter.validateRequest(req);
      if (!requestValidation.isValid) {
        return this.sendSecurityErrorResponse(res, requestValidation.errors, 400);
      }

      // Update metrics
      this.updateMetrics(req, rateLimitResult, connectionValidation);

      // Continue to next middleware
      next();
    };
  }

  private getClientIdentifier(req: Request): string {
    const forwardedFor = req.headers['x-forwarded-for'];
    const realIP = forwardedFor || 
                   req.headers['x-real-ip'] || 
                   req.connection?.remoteAddress || 
                   req.ip || 
                   'unknown';

    // Check for session ID in cookies or headers
    const sessionId = req.cookies?.[this.options.connection.sessionValidation.userValidation.sessionValidation?.cookieName] || 
                     req.headers['x-session-id'];

    // Generate composite key
    const clientKey = this.options.rateLimit.keyGenerator === 'composite' 
      ? `${realIP}:${sessionId}:${req.method}:${req.url?.split('?')[0]}` 
      : this.options.rateLimit.keyGenerator === 'user_id' 
        ? this.getUserId(req) 
        : this.options.rateLimit.keyGenerator === 'ip' 
        ? realIP 
        : this.options.rateLimit.keyGenerator === 'session_id' 
        ? sessionId 
        : this.options.rateLimit.keyGenerator === 'api_key' 
          ? req.headers['x-api-key']
          : 'anonymous';

    return clientKey;
  }

  private getSessionId(req: Request): string {
    return req.cookies?.[this.options.connection.sessionValidation.userValidation.sessionValidation?.cookieName] || 
           req.headers['x-session-id'];
  }

  private getUserId(req: Request): string {
    // In production, this would extract from JWT or session
    return req.user?.id || 'anonymous';
  }

  private setSecurityHeaders(res: Response): void {
    // Security headers
    if (this.options.security.headers.security.enabled) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Strict-Transport-Security', 'max-age=630720000; includeSubDomains; preload');
      res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'unsafe-inline'; object-src 'unsafe-eval'; object-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: data: font-src data: data: font-src data: data: blob: frame-src; frame-src; frame-ancestors; connect-src; media-src; manifest-src; worker-src; report-to; report-uri; report-to; report-uri; referrer; origin; base-uri; form-action");
      res.setHeader('Referrer-Policy', 'no-referrer');
      res.setHeader('X-Content-Type', 'application/json');
    }

    // CORS headers
    if (this.options.cors.enabled) {
      const origin = req.headers.origin;
      
      if (this.options.cors.origins.includes('*') || 
          this.options.cors.origins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', '*');
      } else {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }

      if (this.options.cors.methods.length > 0) {
        const allowedMethods = this.options.cors.methods.join(', ');
        res.setHeader('Access-Control-Allow-Methods', allowedMethods);
      }

      if (this.options.cors.credentials) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      }

      if (this.options.cors.headers && Object.keys(this.options.cors.headers).length > 0) {
        Object.entries(this.options.cors.headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
      }
    }

    // SSL headers
    if (this.options.ssl.enabled) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      
      if (this.options.ssl.redirectHttpToHttps) {
        res.setHeader('Location', `https://${req.headers.host}${req.url}`);
      }

      if (this.options.ssl.hstsEnabled) {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      }

      if (this.options.ssl.frameOptions.length > 0) {
        const frameOptions = this.options.ssl.frameOptions.join(', ');
        res.setHeader('X-Frame-Options', frameOptions);
      }

      if (this.options.ssl.customHeaders && Object.keys(this.options.ssl.customHeaders).length > 0) {
        Object.entries(this.options.ssl.customHeaders).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
      }
    }
  }

    // Content Security Policy
    if (this.options.headers.security.enabled) {
      res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'unsafe-inline'; object-src 'unsafe-eval'; style-src 'unsafe-inline'; img-src data: data: font-src data: data: blob: frame-src; frame-src; frame-ancestors; connect-src; media-src; manifest-src; worker-src; report-to; report-uri; report-to; report-uri; referrer; origin; base-uri; form-action");
    }
  }

    // Additional security headers
    res.setHeader('X-Request-ID', this.generateRequestId());
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Download-Options', 'noopen');
    res.removeHeader('Server');
    res.setHeader('X-Powered-By', 'TrustHire Security');
  }

    // Cache control
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

    // Timing headers
    res.setHeader('Date', new Date().toUTCString());
  }

    // Hide server information
    res.removeHeader('Server');
    res.removeHeader('X-Powered-By');
  }

    // CSP headers
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'unsafe-inline'; object-src 'unsafe-eval'; style-src 'unsafe-inline'; img-src data: data: font-src data: data: blob: frame-src; frame-src; frame-ancestors; connect-src; media-src; manifest-src; worker-src; report-to; report-uri; report-uri; referrer; origin; base-uri; form-action");
  }

    // Anti-bot headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
  }

    // Clickjacking protection
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }

    // Data protection
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    }
  }

  private sendRateLimitResponse(res: Response, rateLimitResult: RateLimitResult): void {
    res.status = 429;
    res.setHeader('Retry-After', rateLimitResult.retryAfter.toString());
    res.json({
      error: 'Too Many Requests',
      message: rateLimitResult.message || 'Rate limit exceeded',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: rateLimitResult.retryAfter
    });
  }

  private sendSecurityErrorResponse(res: Response, errors: string[], statusCode: number = 403): void {
    res.status = statusCode;
    res.json({
      error: 'Security validation failed',
      errors,
      code: 'SECURITY_ERROR'
    });
  }

  private handleCORS(req: Request, res: Response): void {
    const origin = req.headers.origin;
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status = 200;
      res.setHeader('Access-Control-Allow-Methods', this.options.cors.methods.join(', '));
      
      if (this.options.cors.credentials) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      }
      
      res.setHeader('Access-Control-Max-Age', '1728000');
      res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, PUT, DELETE, PATCH');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.end();
      return;
    }

    // Handle simple cross-origin requests
    if (this.options.cors.origins.includes('*') || 
        this.options.cors.origins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    } else if (this.options.cors.origins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', 'null');
    }
  }

    // Set additional CORS headers
    if (this.options.cors.credentials && origin) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    // Set Vary header
    res.setHeader('Vary', 'Origin');
  }

    // Set additional headers
    if (this.options.cors.headers && Object.keys(this.options.cors.headers).length > 0) {
      Object.entries(this.options.cors.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
    }
  }

    // Set preflight headers
    res.setHeader('Access-Control-Allow-Methods', this.options.cors.methods.join(', '));
    res.setHeader('Access-Control-Max-Age', '1728000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

    // Handle actual request
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateMetrics(req: Request, rateLimitResult: any, connectionValidation: any): void {
    if (rateLimitResult) {
      this.metrics.rateLimitedRequests++;
    }

    if (connectionValidation.errors.length > 0) {
      this.metrics.connectionErrors++;
    }

    if (connectionValidation.warnings.length > 0) {
      console.warn('Connection validation warnings:', connectionValidation.warnings);
    }

    if (rateLimitResult.penalty > 0) {
      this.metrics.blockedRequests++;
    }

    this.metrics.totalRequests++;
  }
  }
}

  // Cleanup
  destroy(): void {
    if (this.rateLimiter) {
      this.rateLimiter.destroy();
    }
  }
}

// Factory function
export function createSecurityMiddleware(options: SecurityMiddlewareOptions = {}): any {
  const middleware = new SecurityMiddleware(options);
  return middleware.middleware();
}
}
