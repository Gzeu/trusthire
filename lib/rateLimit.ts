// Rate limiting for TrustHire Autonomous System
export function getClientIp(request: any): string {
  return request.headers['x-forwarded-for'] || 
         request.headers['x-real-ip'] || 
         request.connection?.remoteAddress || 
         '127.0.0.1';
}

export function checkRateLimit(ip: string, limit: number = 100): Promise<boolean> {
  const service = new RateLimit({
    windowMs: 60000,
    maxRequests: limit
  });
  const result = service.checkLimit(ip);
  return Promise.resolve(result.allowed);
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  totalRequests: number;
}

export class RateLimit {
  private requests = new Map<string, { count: number; resetTime: number; windowMs: number }>();

  constructor(private config: RateLimitConfig) {}

  checkLimit(identifier: string): RateLimitResult {
    const now = Date.now();
    const existing = this.requests.get(identifier);

    if (!existing || now > existing.resetTime) {
      // New window or expired window
      const newRecord = {
        count: 1,
        resetTime: now + this.config.windowMs,
        windowMs: this.config.windowMs
      };
      this.requests.set(identifier, newRecord);
      
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: newRecord.resetTime,
        totalRequests: 1
      };
    }

    // Existing window
    if (existing.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: existing.resetTime,
        totalRequests: existing.count
      };
    }

    // Increment count
    existing.count++;
    
    return {
      allowed: true,
      remaining: this.config.maxRequests - existing.count,
      resetTime: existing.resetTime,
      totalRequests: existing.count
    };
  }

  reset(identifier?: string): void {
    if (identifier) {
      this.requests.delete(identifier);
    } else {
      this.requests.clear();
    }
  }

  getStatus(identifier: string): {
    current: number;
    max: number;
    remaining: number;
    resetTime: number;
    timeUntilReset: number;
  } | null {
    const record = this.requests.get(identifier);
    if (!record) return null;

    const now = Date.now();
    const timeUntilReset = Math.max(0, record.resetTime - now);

    return {
      current: record.count,
      max: this.config.maxRequests,
      remaining: Math.max(0, this.config.maxRequests - record.count),
      resetTime: record.resetTime,
      timeUntilReset
    };
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.requests.entries());
    for (const [key, record] of entries) {
      if (now > record.resetTime) {
        this.requests.delete(key);
      }
    }
  }

  // Get all active rate limits
  getAllActive(): Array<{
    identifier: string;
    count: number;
    resetTime: number;
    timeUntilReset: number;
  }> {
    const now = Date.now();
    const active: Array<{
      identifier: string;
      count: number;
      resetTime: number;
      timeUntilReset: number;
    }> = [];

    const entries = Array.from(this.requests.entries());
    for (const [identifier, record] of entries) {
      if (now <= record.resetTime) {
        active.push({
          identifier,
          count: record.count,
          resetTime: record.resetTime,
          timeUntilReset: record.resetTime - now
        });
      }
    }

    return active;
  }
}

// Rate limit middleware for API routes
export function createRateLimit(config: RateLimitConfig) {
  const rateLimit = new RateLimit(config);
  
  return {
    check: (identifier: string) => rateLimit.checkLimit(identifier),
    reset: (identifier?: string) => rateLimit.reset(identifier),
    getStatus: (identifier: string) => rateLimit.getStatus(identifier),
    cleanup: () => rateLimit.cleanup(),
    getAllActive: () => rateLimit.getAllActive()
  };
}

// Pre-configured rate limits
export const apiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Too many requests from this IP, please try again later.'
});

export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: 'Too many authentication attempts, please try again later.'
});

export const analysisRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 50,
  message: 'Too many analysis requests, please try again later.'
});
