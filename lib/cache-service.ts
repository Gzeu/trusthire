// TrustHire Cache Service
// Redis-based caching for API responses and session management

import Redis from 'ioredis';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  keyPrefix?: string;
}

export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class CacheService {
  private redis: Redis;
  private defaultTTL: number = 300; // 5 minutes default

  constructor(config?: { url?: string; defaultTTL?: number }) {
    const redisUrl = config?.url || process.env.REDIS_URL || 'redis://localhost:6379';
    
    this.redis = new Redis(redisUrl, {
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.defaultTTL = config?.defaultTTL || this.defaultTTL;

    // Handle connection errors
    this.redis.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    this.redis.on('connect', () => {
      console.log('Redis connected successfully');
    });
  }

  private getKey(key: string, prefix?: string): string {
    const keyPrefix = prefix || 'trusthire';
    return `${keyPrefix}:${key}`;
  }

  async set<T>(key: string, data: T, options?: CacheOptions): Promise<void> {
    try {
      const cacheKey = this.getKey(key, options?.keyPrefix);
      const ttl = options?.ttl || this.defaultTTL;
      
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };

      await this.redis.setex(cacheKey, ttl, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Cache set error:', error);
      // Don't throw error, just log it - cache failures shouldn't break the app
    }
  }

  async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
    try {
      const cacheKey = this.getKey(key, options?.keyPrefix);
      const cached = await this.redis.get(cacheKey);
      
      if (!cached) {
        return null;
      }

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      
      // Check if the item has expired
      const now = Date.now();
      const age = (now - cacheItem.timestamp) / 1000; // Convert to seconds
      
      if (age > cacheItem.ttl) {
        await this.delete(key, options);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async delete(key: string, options?: CacheOptions): Promise<void> {
    try {
      const cacheKey = this.getKey(key, options?.keyPrefix);
      await this.redis.del(cacheKey);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async clear(prefix?: string): Promise<void> {
    try {
      const pattern = prefix ? `${prefix}:*` : 'trusthire:*';
      const keys = await this.redis.keys(pattern);
      
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  async exists(key: string, options?: CacheOptions): Promise<boolean> {
    try {
      const cacheKey = this.getKey(key, options?.keyPrefix);
      const exists = await this.redis.exists(cacheKey);
      return exists === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  async increment(key: string, value: number = 1, options?: CacheOptions): Promise<number> {
    try {
      const cacheKey = this.getKey(key, options?.keyPrefix);
      return await this.redis.incrby(cacheKey, value);
    } catch (error) {
      console.error('Cache increment error:', error);
      return 0;
    }
  }

  async getTTL(key: string, options?: CacheOptions): Promise<number> {
    try {
      const cacheKey = this.getKey(key, options?.keyPrefix);
      return await this.redis.ttl(cacheKey);
    } catch (error) {
      console.error('Cache TTL error:', error);
      return -1;
    }
  }

  // Session management
  async setSession(userId: string, sessionData: any, ttl: number = 86400): Promise<void> {
    await this.set(`session:${userId}`, sessionData, { ttl, keyPrefix: 'session' });
  }

  async getSession(userId: string): Promise<any | null> {
    return await this.get(`session:${userId}`, { keyPrefix: 'session' });
  }

  async deleteSession(userId: string): Promise<void> {
    await this.delete(`session:${userId}`, { keyPrefix: 'session' });
  }

  // Rate limiting
  async checkRateLimit(identifier: string, limit: number, window: number): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = `rate_limit:${identifier}`;
    const now = Date.now();
    const windowStart = now - (window * 1000);

    try {
      // Get current requests in window
      const requests = await this.get<number[]>(key, { keyPrefix: 'rate_limit' }) || [];
      
      // Filter out old requests
      const validRequests = requests.filter(timestamp => timestamp > windowStart);
      
      if (validRequests.length >= limit) {
        // Rate limit exceeded
        const oldestRequest = Math.min(...validRequests);
        return {
          allowed: false,
          remaining: 0,
          resetTime: oldestRequest + (window * 1000),
        };
      }

      // Add current request
      validRequests.push(now);
      await this.set(key, validRequests, { ttl: window, keyPrefix: 'rate_limit' });

      return {
        allowed: true,
        remaining: limit - validRequests.length,
        resetTime: now + (window * 1000),
      };
    } catch (error) {
      console.error('Rate limit check error:', error);
      // Allow request if cache fails
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: now + (window * 1000),
      };
    }
  }

  // Cache warming
  async warmCache(): Promise<void> {
    try {
      // Warm up frequently accessed data
      const patterns = await this.get('security_patterns', { keyPrefix: 'static' });
      if (!patterns) {
        // This would typically fetch from database or API
        await this.set('security_patterns', [], { ttl: 3600, keyPrefix: 'static' });
      }
    } catch (error) {
      console.error('Cache warming error:', error);
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; latency: number }> {
    const start = Date.now();
    
    try {
      await this.redis.ping();
      const latency = Date.now() - start;
      return { status: 'healthy', latency };
    } catch (error) {
      return { status: 'unhealthy', latency: Date.now() - start };
    }
  }

  // Close connection
  async disconnect(): Promise<void> {
    await this.redis.quit();
  }
}

// Singleton instance
export const cacheService = new CacheService();

// React hook for using cache service
export function useCacheService() {
  return cacheService;
}

export default cacheService;
