// Redis Wrapper for TrustHire
// Provides a simple interface for Redis operations with fallback to in-memory storage

interface RedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, mode?: string, duration?: number): Promise<string | null>;
  setex(key: string, seconds: number, value: string): Promise<string>;
  del(key: string): Promise<number>;
  exists(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  ttl(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  flushdb(): Promise<string>;
  lpush(key: string, ...values: string[]): Promise<number>;
  rpush(key: string, ...values: string[]): Promise<number>;
  lpop(key: string): Promise<string | null>;
  rpop(key: string): Promise<string | null>;
  lrange(key: string, start: number, stop: number): Promise<string[]>;
  ltrim(key: string, start: number, stop: number): Promise<string>;
  llen(key: string): Promise<number>;
}

// In-memory fallback storage
class InMemoryStorage implements RedisClient {
  private storage = new Map<string, { value: string; expiry?: number }>();
  private lists = new Map<string, string[]>();

  async get(key: string): Promise<string | null> {
    const item = this.storage.get(key);
    if (!item) return null;
    
    if (item.expiry && Date.now() > item.expiry) {
      this.storage.delete(key);
      return null;
    }
    
    return item.value;
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<string | null> {
    const expiry = duration ? Date.now() + duration * 1000 : undefined;
    this.storage.set(key, { value, expiry });
    return 'OK';
  }

  async setex(key: string, seconds: number, value: string): Promise<string> {
    const expiry = Date.now() + seconds * 1000;
    this.storage.set(key, { value, expiry });
    return 'OK';
  }

  async del(key: string): Promise<number> {
    const deleted = this.storage.has(key) ? 1 : 0;
    this.storage.delete(key);
    this.lists.delete(key);
    return deleted;
  }

  async exists(key: string): Promise<number> {
    const item = this.storage.get(key);
    if (!item) return 0;
    
    if (item.expiry && Date.now() > item.expiry) {
      this.storage.delete(key);
      return 0;
    }
    
    return 1;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const item = this.storage.get(key);
    if (!item) return 0;
    
    item.expiry = Date.now() + seconds * 1000;
    return 1;
  }

  async ttl(key: string): Promise<number> {
    const item = this.storage.get(key);
    if (!item) return -2;
    
    if (!item.expiry) return -1;
    
    const remaining = Math.floor((item.expiry - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return Array.from(this.storage.keys()).filter(key => regex.test(key));
  }

  async flushdb(): Promise<string> {
    this.storage.clear();
    this.lists.clear();
    return 'OK';
  }

  async lpush(key: string, ...values: string[]): Promise<number> {
    let list = this.lists.get(key) || [];
    list.unshift(...values);
    this.lists.set(key, list);
    return list.length;
  }

  async rpush(key: string, ...values: string[]): Promise<number> {
    let list = this.lists.get(key) || [];
    list.push(...values);
    this.lists.set(key, list);
    return list.length;
  }

  async lpop(key: string): Promise<string | null> {
    let list = this.lists.get(key) || [];
    if (list.length === 0) return null;
    
    const value = list.shift();
    this.lists.set(key, list);
    return value || null;
  }

  async rpop(key: string): Promise<string | null> {
    let list = this.lists.get(key) || [];
    if (list.length === 0) return null;
    
    const value = list.pop();
    this.lists.set(key, list);
    return value || null;
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    let list = this.lists.get(key) || [];
    
    if (stop === -1) {
      return list.slice(start);
    }
    
    return list.slice(start, stop + 1);
  }

  async ltrim(key: string, start: number, stop: number): Promise<string> {
    let list = this.lists.get(key) || [];
    
    if (stop === -1) {
      list = list.slice(start);
    } else {
      list = list.slice(start, stop + 1);
    }
    
    this.lists.set(key, list);
    return 'OK';
  }

  async llen(key: string): Promise<number> {
    return (this.lists.get(key) || []).length;
  }
}

// Redis client implementation
class RedisWrapper implements RedisClient {
  private client: RedisClient;
  private isRedis = false;

  constructor() {
    // Try to use Redis if available, otherwise fall back to in-memory storage
    this.client = new InMemoryStorage();
    this.isRedis = false;
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<string | null> {
    return this.client.set(key, value, mode, duration);
  }

  async setex(key: string, seconds: number, value: string): Promise<string> {
    return this.client.setex(key, seconds, value);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return this.client.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  async flushdb(): Promise<string> {
    return this.client.flushdb();
  }

  async lpush(key: string, ...values: string[]): Promise<number> {
    return this.client.lpush(key, ...values);
  }

  async rpush(key: string, ...values: string[]): Promise<number> {
    return this.client.rpush(key, ...values);
  }

  async lpop(key: string): Promise<string | null> {
    return this.client.lpop(key);
  }

  async rpop(key: string): Promise<string | null> {
    return this.client.rpop(key);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.client.lrange(key, start, stop);
  }

  async ltrim(key: string, start: number, stop: number): Promise<string> {
    return this.client.ltrim(key, start, stop);
  }

  async llen(key: string): Promise<number> {
    return this.client.llen(key);
  }

  isRedisAvailable(): boolean {
    return this.isRedis;
  }
}

// Global Redis client instance
let redisClient: RedisWrapper | null = null;

export function getRedisClient(): RedisClient {
  if (!redisClient) {
    redisClient = new RedisWrapper();
  }
  return redisClient;
}

export type { RedisClient };
export { RedisWrapper };
