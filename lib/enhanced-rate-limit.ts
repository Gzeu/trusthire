import { NextRequest } from 'next/server';
import { RateLimitError } from './error-handler';

interface RateLimitEntry {
  count: number;
  resetAt: number;
  firstRequest: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: NextRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

class EnhancedRateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor(private cleanupMs: number = 5 * 60 * 1000) { // 5 minutes
    // Clean up expired entries periodically
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, this.cleanupMs);
  }

  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    for (const [key, entry] of Array.from(this.store.entries())) {
      if (now > entry.resetAt) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.store.delete(key));
  }

  isAllowed(key: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetAt) {
      // First request or window expired
      this.store.set(key, {
        count: 1,
        resetAt: now + config.windowMs,
        firstRequest: now,
      });

      return {
        allowed: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs,
      };
    }

    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      return {
        allowed: false,
        limit: config.maxRequests,
        remaining: 0,
        resetTime: entry.resetAt,
        retryAfter,
      };
    }

    // Increment counter
    entry.count++;
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetAt,
    };
  }

  reset(key: string): void {
    this.store.delete(key);
  }

  getStats(key: string): { count: number; resetAt: number; firstRequest: number } | null {
    return this.store.get(key) || null;
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

// Global rate limiter instance
const globalRateLimiter = new EnhancedRateLimiter();

// Predefined rate limit configurations
export const RATE_LIMIT_CONFIGS = {
  // Assessment endpoints - stricter limits
  assessment: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
  },
  // Scan endpoints - moderate limits
  scan: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20,
  },
  // AI analysis endpoints - stricter due to cost
  aiAnalysis: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
  },
  // General API - more lenient
  general: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
  },
  // Authentication endpoints - very strict
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
  // Admin endpoints - extremely strict
  admin: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 2,
  },
} as const;

// Default key generators
export const KEY_GENERATORS = {
  byIP: (req: NextRequest): string => {
    const forwarded = req.headers.get('x-forwarded-for');
    const realIP = req.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0].trim() || realIP || 'unknown';
    return `rate_limit:ip:${ip}`;
  },
  byUser: (req: NextRequest): string => {
    // This would require authentication middleware
    const userId = req.headers.get('x-user-id') || 'anonymous';
    return `rate_limit:user:${userId}`;
  },
  byEndpoint: (req: NextRequest): string => {
    const url = new URL(req.url);
    const endpoint = `${url.pathname}:${req.method}`;
    return `rate_limit:endpoint:${endpoint}`;
  },
  combined: (req: NextRequest): string => {
    const ip = KEY_GENERATORS.byIP(req);
    const endpoint = KEY_GENERATORS.byEndpoint(req);
    return `${ip}:${endpoint}`;
  },
} as const;

export function createRateLimitMiddleware(config: RateLimitConfig) {
  return (req: NextRequest): void => {
    const key = config.keyGenerator ? config.keyGenerator(req) : KEY_GENERATORS.byIP(req);
    const result = globalRateLimiter.isAllowed(key, config);

    if (!result.allowed) {
      throw new RateLimitError(
        `Rate limit exceeded. Try again in ${result.retryAfter} seconds.`
      );
    }

    // Add rate limit headers to response (this would need to be handled by the error wrapper)
    // For now, we'll store them in a way that can be accessed later
    (req as any).rateLimitInfo = {
      limit: result.limit,
      remaining: result.remaining,
      resetTime: result.resetTime,
    };
  };
}

// Predefined middleware functions
export const rateLimitMiddleware = {
  assessment: createRateLimitMiddleware(RATE_LIMIT_CONFIGS.assessment),
  scan: createRateLimitMiddleware(RATE_LIMIT_CONFIGS.scan),
  aiAnalysis: createRateLimitMiddleware(RATE_LIMIT_CONFIGS.aiAnalysis),
  general: createRateLimitMiddleware(RATE_LIMIT_CONFIGS.general),
  auth: createRateLimitMiddleware(RATE_LIMIT_CONFIGS.auth),
  admin: createRateLimitMiddleware(RATE_LIMIT_CONFIGS.admin),
};

// Helper function to apply rate limiting with error handling
export function withRateLimit(
  handler: (req: NextRequest) => Promise<Response>,
  config: RateLimitConfig
) {
  return async (req: NextRequest): Promise<Response> => {
    // Apply rate limiting
    const rateLimitFn = createRateLimitMiddleware(config);
    rateLimitFn(req);

    // Execute the handler
    const response = await handler(req);

    // Add rate limit headers to response
    const rateLimitInfo = (req as any).rateLimitInfo;
    if (rateLimitInfo && response instanceof Response) {
      response.headers.set('X-RateLimit-Limit', rateLimitInfo.limit.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimitInfo.remaining.toString());
      response.headers.set('X-RateLimit-Reset', rateLimitInfo.resetTime.toString());
    }

    return response;
  };
}

// Legacy compatibility function
export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): boolean {
  const result = globalRateLimiter.isAllowed(key, {
    windowMs,
    maxRequests,
  });
  return result.allowed;
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  return forwarded?.split(',')[0].trim() || realIP || 'unknown';
}

// Export the global rate limiter for advanced usage
export { globalRateLimiter };
