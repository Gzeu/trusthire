// TrustHire Rate Limiter
// Advanced rate limiting with different strategies

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (identifier: string) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  message?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

export class RateLimiter {
  private configs: Map<string, RateLimitConfig> = new Map();
  private requests: Map<string, number[]> = new Map();

  constructor() {
    // Clean up old requests every minute
    setInterval(() => this.cleanup(), 60000);
  }

  addConfig(name: string, config: RateLimitConfig): void {
    this.configs.set(name, config);
  }

  private getKey(configName: string, identifier: string): string {
    const config = this.configs.get(configName);
    if (!config) throw new Error(`Rate limit config '${configName}' not found`);

    const baseKey = config.keyGenerator ? config.keyGenerator(identifier) : identifier;
    return `${configName}:${baseKey}`;
  }

  private cleanup(): void {
    const now = Date.now();
    
    this.requests.forEach((timestamps, key) => {
      const config = this.configs.get(key.split(':')[0]);
      if (!config) return;

      const cutoff = now - config.windowMs;
      const validTimestamps = timestamps.filter(timestamp => timestamp > cutoff);

      if (validTimestamps.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validTimestamps);
      }
    });
  }

  async checkLimit(configName: string, identifier: string): Promise<RateLimitResult> {
    const config = this.configs.get(configName);
    if (!config) {
      throw new Error(`Rate limit config '${configName}' not found`);
    }

    const key = this.getKey(configName, identifier);
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get existing requests for this identifier
    let timestamps = this.requests.get(key) || [];
    
    // Filter out old requests outside the window
    timestamps = timestamps.filter(timestamp => timestamp > windowStart);

    const allowed = timestamps.length < config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - timestamps.length);
    const resetTime = timestamps.length > 0 ? 
      Math.min(...timestamps) + config.windowMs : 
      now + config.windowMs;

    if (allowed) {
      // Add current request
      timestamps.push(now);
      this.requests.set(key, timestamps);
    }

    return {
      allowed,
      limit: config.maxRequests,
      remaining,
      resetTime,
      retryAfter: allowed ? undefined : Math.ceil((resetTime - now) / 1000),
    };
  }

  // Predefined rate limit configurations
  static getDefaultConfigs(): Record<string, RateLimitConfig> {
    return {
      // API endpoints
      'assessment': {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 20,
        message: 'Too many assessment requests, please try again later.',
      },
      'sandbox': {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 5,
        message: 'Too many sandbox analysis requests, please try again later.',
      },
      'scan-repo': {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 10,
        message: 'Too many repository scans, please try again later.',
      },
      'scan-url': {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 100,
        message: 'Too many URL scans, please try again later.',
      },
      'patterns': {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 50,
        message: 'Too many pattern requests, please try again later.',
      },
      'assessments-recent': {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 50,
        message: 'Too many recent assessments requests, please try again later.',
      },
      'report': {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 30,
        message: 'Too many report requests, please try again later.',
      },

      // Global limits
      'global-api': {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 1000,
        message: 'API rate limit exceeded, please try again later.',
      },

      // Authentication limits
      'auth': {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 5,
        message: 'Too many authentication attempts, please try again later.',
      },

      // Admin limits
      'admin': {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 100,
        message: 'Admin rate limit exceeded, please try again later.',
      },
    };
  }
}

// Express middleware for rate limiting
export function createRateLimitMiddleware(configName: string, identifierGetter?: (req: any) => string) {
  const rateLimiter = new RateLimiter();
  const configs = RateLimiter.getDefaultConfigs();
  
  // Add all default configs
  Object.entries(configs).forEach(([name, config]) => {
    rateLimiter.addConfig(name, config);
  });

  return async (req: any, res: any, next: any) => {
    try {
      const identifier = identifierGetter ? 
        identifierGetter(req) : 
        req.headers['x-user-id'] || req.ip || 'anonymous';

      const result = await rateLimiter.checkLimit(configName, identifier);

      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': result.limit,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
      });

      if (!result.allowed) {
        res.set('Retry-After', result.retryAfter?.toString() || '60');
        return res.status(429).json({
          error: configs[configName]?.message || 'Rate limit exceeded',
          retryAfter: result.retryAfter,
        });
      }

      next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      next(); // Allow request if rate limiting fails
    }
  };
}

// Advanced rate limiter with sliding window and different strategies
export class AdvancedRateLimiter {
  private slidingWindows: Map<string, Map<number, number>> = new Map();
  private configs: Map<string, RateLimitConfig> = new Map();

  addConfig(name: string, config: RateLimitConfig): void {
    this.configs.set(name, config);
  }

  private getSlidingWindow(key: string): Map<number, number> {
    if (!this.slidingWindows.has(key)) {
      this.slidingWindows.set(key, new Map());
    }
    return this.slidingWindows.get(key)!;
  }

  async checkSlidingWindowLimit(configName: string, identifier: string): Promise<RateLimitResult> {
    const config = this.configs.get(configName);
    if (!config) {
      throw new Error(`Rate limit config '${configName}' not found`);
    }

    const key = `${configName}:${identifier}`;
    const window = this.getSlidingWindow(key);
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Count requests in the sliding window
    let requestCount = 0;
    const requestsToRemove: number[] = [];

    window.forEach((count, timestamp) => {
      if (timestamp < windowStart) {
        requestsToRemove.push(timestamp);
      } else {
        requestCount += count;
      }
    });

    // Remove old requests
    requestsToRemove.forEach(timestamp => window.delete(timestamp));

    const allowed = requestCount < config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - requestCount);
    const resetTime = now + config.windowMs;

    if (allowed) {
      // Add current request
      const currentCount = window.get(now) || 0;
      window.set(now, currentCount + 1);
    }

    return {
      allowed,
      limit: config.maxRequests,
      remaining,
      resetTime,
      retryAfter: allowed ? undefined : Math.ceil((resetTime - now) / 1000),
    };
  }

  // Token bucket algorithm
  async checkTokenBucketLimit(configName: string, identifier: string): Promise<RateLimitResult> {
    const config = this.configs.get(configName);
    if (!config) {
      throw new Error(`Rate limit config '${configName}' not found`);
    }

    const key = `token-bucket:${configName}:${identifier}`;
    const now = Date.now();
    const window = this.getSlidingWindow(key);

    // Get current token count and last refill time
    const lastRefill = window.keys().length > 0 ? Math.max(...window.keys()) : now;
    const timeSinceRefill = now - lastRefill;
    const tokensToAdd = Math.floor(timeSinceRefill / (config.windowMs / config.maxRequests));
    
    let currentTokens = window.get(lastRefill) || config.maxRequests;
    currentTokens = Math.min(config.maxRequests, currentTokens + tokensToAdd);

    // Clear old entries and set new token count
    window.clear();
    window.set(now, currentTokens);

    const allowed = currentTokens > 0;
    const tokensToConsume = allowed ? 1 : 0;
    const remainingTokens = Math.max(0, currentTokens - tokensToConsume);

    if (allowed) {
      window.set(now, remainingTokens);
    }

    return {
      allowed,
      limit: config.maxRequests,
      remaining: remainingTokens,
      resetTime: now + config.windowMs,
      retryAfter: allowed ? undefined : Math.ceil(config.windowMs / 1000),
    };
  }
}

// Singleton instances
export const rateLimiter = new RateLimiter();
export const advancedRateLimiter = new AdvancedRateLimiter();

// Initialize with default configs
Object.entries(RateLimiter.getDefaultConfigs()).forEach(([name, config]) => {
  rateLimiter.addConfig(name, config);
  advancedRateLimiter.addConfig(name, config);
});

// React hook for using rate limiter
export function useRateLimiter() {
  return { rateLimiter, advancedRateLimiter };
}

export { RateLimiter as default };
