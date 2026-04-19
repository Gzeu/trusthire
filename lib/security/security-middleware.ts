// Security Middleware
// Comprehensive security middleware for Next.js applications

import { NextRequest, NextResponse } from 'next/server';
import { createRateLimiter, RateLimiter } from './rate-limiter';

export interface SecurityMiddlewareConfig {
  rateLimit?: {
    enabled: boolean;
    config?: any;
  };
  connection?: {
    enabled: boolean;
    config?: any;
  };
  cors?: {
    enabled: boolean;
    origins?: string[];
    credentials?: boolean;
  };
  ssl?: {
    enabled: boolean;
    redirectHttpToHttps?: boolean;
    hstsEnabled?: boolean;
  };
}

export class SecurityMiddleware {
  private rateLimiter: RateLimiter | null = null;
  private config: SecurityMiddlewareConfig;

  constructor(config: SecurityMiddlewareConfig = {}) {
    this.config = {
      rateLimit: {
        enabled: true,
        config: {
          algorithm: 'sliding_window',
          windowSize: 60000,
          maxRequests: 100,
          burstLimit: 200
        }
      },
      connection: {
        enabled: true,
        config: {
          maxConnections: 1000,
          ipValidation: {
            enabled: true,
            blacklist: [],
            whitelist: ['127.0.0.1', '::1'],
            geoLocation: {
              enabled: false,
              allowedCountries: ['US', 'CA', 'GB', 'DE', 'FR'],
              blockedCountries: []
            }
          }
        }
      },
      cors: {
        enabled: true,
        origins: ['http://localhost:3000'],
        credentials: true
      },
      ssl: {
        enabled: true,
        redirectHttpToHttps: true,
        hstsEnabled: true
      },
      ...config
    };

    if (this.config.rateLimit?.enabled) {
      this.rateLimiter = createRateLimiter(
        this.config.rateLimit.config,
        this.config.connection?.config || {}
      );
    }
  }

  middleware() {
    return async (request: NextRequest, response: NextResponse) => {
      try {
        // Rate limiting
        if (this.config.rateLimit?.enabled && this.rateLimiter) {
          const clientIp = this.getClientIp(request);
          const rateLimitResult = this.rateLimiter.checkLimit(clientIp);
          
          if (!rateLimitResult.allowed) {
            return NextResponse.json({
              error: 'Rate limit exceeded',
              code: 'RATE_LIMIT_EXCEEDED',
              retryAfter: rateLimitResult.resetTime
            }, { 
              status: 429,
              headers: {
                'X-RateLimit-Limit': this.config.rateLimit.config?.maxRequests?.toString() || '100',
                'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
              }
            });
          }
        }

        // Connection validation
        if (this.config.connection?.enabled && this.rateLimiter) {
          const validation = this.rateLimiter.validateConnection(request);
          
          if (!validation.isValid) {
            return NextResponse.json({
              error: 'Connection validation failed',
              errors: validation.errors,
              code: 'CONNECTION_ERROR'
            }, { status: 403 });
          }
        }

        // CORS handling
        if (this.config.cors?.enabled) {
          const origin = request.headers.get('origin');
          
          if (origin && this.config.cors.origins && this.config.cors.origins.length > 0) {
            if (!this.config.cors.origins.includes(origin)) {
              return NextResponse.json({
                error: 'CORS policy violation',
                code: 'CORS_ERROR'
              }, { status: 403 });
            }
          }

          response.headers.set('Access-Control-Allow-Origin', origin || '*');
          response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          
          if (this.config.cors.credentials) {
            response.headers.set('Access-Control-Allow-Credentials', 'true');
          }
        }

        // Security headers
        if (this.config.ssl?.enabled) {
          response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
          response.headers.set('X-Content-Type-Options', 'nosniff');
          response.headers.set('X-Frame-Options', 'DENY');
          response.headers.set('X-XSS-Protection', '1; mode=block');
          response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
          response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
        }

        return response;
      } catch (error) {
        console.error('Security middleware error:', error);
        return NextResponse.json({
          error: 'Internal security error',
          code: 'SECURITY_ERROR'
        }, { status: 500 });
      }
    };
  }

  private getClientIp(request: NextRequest): string {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = request.ip;
    
    return forwardedFor ? forwardedFor.split(',')[0].trim() : 
           realIp || 
           ip || 
           'unknown';
  }

  destroy(): void {
    if (this.rateLimiter) {
      this.rateLimiter.destroy();
    }
  }
}

export function createSecurityMiddleware(config: SecurityMiddlewareConfig = {}): SecurityMiddleware {
  return new SecurityMiddleware(config);
}
