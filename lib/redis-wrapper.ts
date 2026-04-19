// Redis wrapper for development/production compatibility
// Prevents connection errors during build and development

class RedisWrapper {
  private client: any = null;
  private isConnected = false;

  constructor() {
    // Only try to connect in production or when explicitly enabled
    if (typeof window === 'undefined' && process.env.REDIS_URL) {
      this.initializeRedis();
    }
  }

  private async initializeRedis() {
    try {
      // Dynamic import to prevent build errors
      const redisModule = await eval('import("redis")').catch(() => null);
      if (!redisModule) {
        console.warn('Redis module not available, using fallback');
        return;
      }
      
      const Redis = redisModule.createClient;
      this.client = Redis({
        url: process.env.REDIS_URL,
        socket: {
          connectTimeout: 5000,
          lazyConnect: true,
        },
      });

      this.client.on('error', (err: any) => {
        console.warn('Redis connection error:', err.message);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('Redis connected');
        this.isConnected = true;
      });

      // Try to connect
      await this.client.connect().catch(() => {
        console.warn('Redis connection failed, using fallback');
      });
    } catch (error) {
      console.warn('Redis not available, using fallback:', error);
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConnected || !this.client) {
      return null;
    }
    try {
      return await this.client.get(key);
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, options?: { EX?: number }): Promise<void> {
    if (!this.isConnected || !this.client) {
      return;
    }
    try {
      await this.client.set(key, value, options);
    } catch {
      // Silent fail
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected || !this.client) {
      return;
    }
    try {
      await this.client.del(key);
    } catch {
      // Silent fail
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      return false;
    }
    try {
      return await this.client.exists(key);
    } catch {
      return false;
    }
  }

  async flush(): Promise<void> {
    if (!this.isConnected || !this.client) {
      return;
    }
    try {
      await this.client.flushAll();
    } catch {
      // Silent fail
    }
  }

  isRedisAvailable(): boolean {
    return this.isConnected && this.client !== null;
  }
}

// Singleton instance
const redisWrapper = new RedisWrapper();

export default redisWrapper;

// Export functions for easier usage
export const redis = {
  get: (key: string) => redisWrapper.get(key),
  set: (key: string, value: string, options?: { EX?: number }) => 
    redisWrapper.set(key, value, options),
  del: (key: string) => redisWrapper.del(key),
  exists: (key: string) => redisWrapper.exists(key),
  flush: () => redisWrapper.flush(),
  isAvailable: () => redisWrapper.isRedisAvailable(),
};
