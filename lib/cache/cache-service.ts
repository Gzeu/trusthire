// Cache Service
// Advanced Redis caching with intelligent invalidation and performance optimization

import { getRedisClient } from '@/lib/redis-wrapper';

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  expiresAt?: Date;
  metadata?: Record<string, any>;
  tags?: string[];
}

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
  metadata?: Record<string, any>;
  compress?: boolean; // Compress large values
}

export interface CacheStats {
  totalKeys: number;
  hitRate: number;
  missRate: number;
  memoryUsage: number;
  topKeys: Array<{ key: string; hits: number; size: number }>;
  tagDistribution: Record<string, number>;
}

export interface CachePattern {
  pattern: string;
  description: string;
  ttl: number;
  tags: string[];
}

class CacheService {
  private redis: any;
  private stats: {
    hits: number;
    misses: number;
    sets: number;
    deletes: number;
    lastReset: Date;
  };
  private defaultTTL = 300; // 5 minutes
  private maxKeyLength = 250;

  constructor() {
    this.redis = getRedisClient();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      lastReset: new Date()
    };
  }

  // Set a cache entry
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<boolean> {
    try {
      if (!this.redis) {
        console.warn('Redis not available, cache disabled');
        return false;
      }

      // Validate key
      if (!key || typeof key !== 'string') {
        throw new Error('Invalid cache key');
      }

      // Truncate key if too long
      const safeKey = key.length > this.maxKeyLength 
        ? key.substring(0, this.maxKeyLength) 
        : key;

      const ttl = options.ttl || this.defaultTTL;
      const serializedValue = JSON.stringify(value);
      
      // Set the main cache entry
      if (ttl > 0) {
        await this.redis.setex(safeKey, ttl, serializedValue);
      } else {
        await this.redis.set(safeKey, serializedValue);
      }

      // Store metadata if provided
      if (options.metadata || options.tags) {
        const metadataKey = `${safeKey}:meta`;
        const metadata = {
          createdAt: new Date().toISOString(),
          expiresAt: ttl > 0 ? new Date(Date.now() + ttl * 1000).toISOString() : null,
          tags: options.tags || [],
          ...options.metadata
        };
        await this.redis.setex(metadataKey, ttl, JSON.stringify(metadata));
      }

      // Add to tag indexes if tags provided
      if (options.tags && options.tags.length > 0) {
        await this.addToTagIndexes(safeKey, options.tags, ttl);
      }

      this.stats.sets++;
      return true;
    } catch (error) {
      console.error('Failed to set cache entry:', error);
      this.stats.misses++;
      return false;
    }
  }

  // Get a cache entry
  async get<T>(key: string): Promise<T | null> {
    try {
      if (!this.redis) {
        console.warn('Redis not available, cache disabled');
        return null;
      }

      const safeKey = key.length > this.maxKeyLength 
        ? key.substring(0, this.maxKeyLength) 
        : key;

      const value = await this.redis.get(safeKey);
      
      if (value === null) {
        this.stats.misses++;
        return null;
      }

      this.stats.hits++;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Failed to get cache entry:', error);
      this.stats.misses++;
      return null;
    }
  }

  // Get multiple cache entries
  async mget<T>(keys: string[]): Promise<Record<string, T | null>> {
    try {
      if (!this.redis || keys.length === 0) {
        return {};
      }

      const safeKeys = keys.map(key => 
        key.length > this.maxKeyLength ? key.substring(0, this.maxKeyLength) : key
      );

      const values = await this.redis.mget(...safeKeys);
      
      const result: Record<string, T | null> = {};
      
      keys.forEach((key, index) => {
        const value = values[index];
        if (value === null) {
          result[key] = null;
          this.stats.misses++;
        } else {
          try {
            result[key] = JSON.parse(value) as T;
            this.stats.hits++;
          } catch (parseError) {
            console.error('Failed to parse cached value for key:', key);
            result[key] = null;
            this.stats.misses++;
          }
        }
      });

      return result;
    } catch (error) {
      console.error('Failed to get multiple cache entries:', error);
      this.stats.misses++;
      return {};
    }
  }

  // Delete a cache entry
  async delete(key: string): Promise<boolean> {
    try {
      if (!this.redis) {
        return false;
      }

      const safeKey = key.length > this.maxKeyLength 
        ? key.substring(0, this.maxKeyLength) 
        : key;

      // Get metadata to remove from tag indexes
      const metadata = await this.getMetadata(safeKey);
      
      // Remove from tag indexes
      if (metadata?.tags) {
        await this.removeFromTagIndexes(safeKey, metadata.tags);
      }

      // Delete main entry and metadata
      await Promise.all([
        this.redis.del(safeKey),
        this.redis.del(`${safeKey}:meta`)
      ]);

      this.stats.deletes++;
      return true;
    } catch (error) {
      console.error('Failed to delete cache entry:', error);
      return false;
    }
  }

  // Delete multiple cache entries
  async mdelete(keys: string[]): Promise<number> {
    try {
      if (!this.redis || keys.length === 0) {
        return 0;
      }

      const safeKeys = keys.map(key => 
        key.length > this.maxKeyLength ? key.substring(0, this.maxKeyLength) : key
      );

      // Get metadata for all keys to remove from tag indexes
      const metadataPromises = safeKeys.map(key => this.getMetadata(key));
      const metadataResults = await Promise.all(metadataPromises);

      // Remove from tag indexes
      const tagRemovalPromises = metadataResults.map((metadata, index) => {
        if (metadata?.tags) {
          return this.removeFromTagIndexes(safeKeys[index], metadata.tags);
        }
        return Promise.resolve();
      });

      await Promise.all(tagRemovalPromises);

      // Delete all entries and metadata
      const allKeys = safeKeys.flatMap(key => [key, `${key}:meta`]);
      const deletedCount = await this.redis.del(...allKeys);

      this.stats.deletes += deletedCount;
      return deletedCount;
    } catch (error) {
      console.error('Failed to delete multiple cache entries:', error);
      return 0;
    }
  }

  // Clear cache by pattern
  async clearPattern(pattern: string): Promise<number> {
    try {
      if (!this.redis) {
        return 0;
      }

      const keys = await this.redis.keys(pattern);
      if (keys.length === 0) {
        return 0;
      }

      return await this.mdelete(keys);
    } catch (error) {
      console.error('Failed to clear cache pattern:', error);
      return 0;
    }
  }

  // Clear cache by tags
  async clearTags(tags: string[]): Promise<number> {
    try {
      if (!this.redis || tags.length === 0) {
        return 0;
      }

      const tagKeys = tags.map(tag => `tag:${tag}`);
      const keySets = await this.redis.mget(...tagKeys);
      
      const allKeys: string[] = [];
      keySets.forEach((keySet: any) => {
        if (keySet) {
          try {
            const keys = JSON.parse(keySet);
            allKeys.push(...keys);
          } catch (error) {
            console.error('Failed to parse tag key set:', error);
          }
        }
      });

      if (allKeys.length === 0) {
        return 0;
      }

      // Remove from tag indexes
      await this.redis.del(...tagKeys);

      // Delete all keys
      return await this.mdelete(allKeys);
    } catch (error) {
      console.error('Failed to clear cache by tags:', error);
      return 0;
    }
  }

  // Get cache statistics
  async getStats(): Promise<CacheStats> {
    try {
      if (!this.redis) {
        return {
          totalKeys: 0,
          hitRate: 0,
          missRate: 0,
          memoryUsage: 0,
          topKeys: [],
          tagDistribution: {}
        };
      }

      const totalKeys = await this.redis.dbsize();
      const info = await this.redis.info('memory');
      const memoryUsage = this.parseMemoryInfo(info);

      // Get top keys (simplified - in production, you'd use Redis Sorted Sets)
      const keys = await this.redis.keys('*');
      const topKeys = await this.getTopKeys(keys.slice(0, 10));

      // Get tag distribution
      const tagKeys = await this.redis.keys('tag:*');
      const tagDistribution: Record<string, number> = {};
      
      for (const tagKey of tagKeys) {
        const keySet = await this.redis.get(tagKey);
        if (keySet) {
          try {
            const keys = JSON.parse(keySet);
            const tagName = tagKey.replace('tag:', '');
            tagDistribution[tagName] = keys.length;
          } catch (error) {
            console.error('Failed to parse tag key set:', error);
          }
        }
      }

      const totalRequests = this.stats.hits + this.stats.misses;
      const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;
      const missRate = totalRequests > 0 ? (this.stats.misses / totalRequests) * 100 : 0;

      return {
        totalKeys,
        hitRate,
        missRate,
        memoryUsage,
        topKeys,
        tagDistribution
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return {
        totalKeys: 0,
        hitRate: 0,
        missRate: 0,
        memoryUsage: 0,
        topKeys: [],
        tagDistribution: {}
      };
    }
  }

  // Reset statistics
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      lastReset: new Date()
    };
  }

  // Get cache patterns
  getPatterns(): CachePattern[] {
    return [
      {
        pattern: 'scan-result:*',
        description: 'Individual scan results',
        ttl: 1800, // 30 minutes
        tags: ['scan', 'result']
      },
      {
        pattern: 'scan-history:*',
        description: 'Scan history lists',
        ttl: 300, // 5 minutes
        tags: ['scan', 'history']
      },
      {
        pattern: 'analytics:*',
        description: 'Analytics data and metrics',
        ttl: 600, // 10 minutes
        tags: ['analytics', 'metrics']
      },
      {
        pattern: 'api-response:*',
        description: 'API response caching',
        ttl: 120, // 2 minutes
        tags: ['api', 'response']
      },
      {
        pattern: 'user-session:*',
        description: 'User session data',
        ttl: 3600, // 1 hour
        tags: ['user', 'session']
      },
      {
        pattern: 'threat-intel:*',
        description: 'Threat intelligence data',
        ttl: 1800, // 30 minutes
        tags: ['threat', 'intel']
      }
    ];
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    redis: boolean;
    memory: number;
    hitRate: number;
    errors: string[];
  }> {
    try {
      const errors: string[] = [];
      let status: 'healthy' | 'warning' | 'critical' = 'healthy';
      
      // Check Redis connection
      const redisHealthy = this.redis ? await this.redis.ping().then(() => true).catch(() => false) : false;
      
      if (!redisHealthy) {
        errors.push('Redis connection failed');
        status = 'critical';
      }

      // Get memory usage
      const memoryUsage = redisHealthy ? await this.getMemoryUsage() : 0;
      const memoryThreshold = 100 * 1024 * 1024; // 100MB
      
      if (memoryUsage > memoryThreshold) {
        errors.push(`High memory usage: ${Math.round(memoryUsage / 1024 / 1024)}MB`);
        if (status === 'healthy') status = 'warning';
      }

      // Get hit rate
      const totalRequests = this.stats.hits + this.stats.misses;
      const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;
      
      if (hitRate < 50 && totalRequests > 100) {
        errors.push(`Low cache hit rate: ${hitRate.toFixed(1)}%`);
        if (status === 'healthy') status = 'warning';
      }

      return {
        status,
        redis: redisHealthy,
        memory: memoryUsage,
        hitRate,
        errors
      };
    } catch (error) {
      console.error('Cache health check failed:', error);
      return {
        status: 'critical',
        redis: false,
        memory: 0,
        hitRate: 0,
        errors: ['Health check failed']
      };
    }
  }

  // Cleanup expired entries
  async cleanup(): Promise<number> {
    try {
      if (!this.redis) {
        return 0;
      }

      // Get all keys with metadata
      const metaKeys = await this.redis.keys('*:meta');
      let cleanedCount = 0;

      for (const metaKey of metaKeys) {
        try {
          const metadata = await this.redis.get(metaKey);
          if (metadata) {
            const meta = JSON.parse(metadata);
            if (meta.expiresAt && new Date(meta.expiresAt) < new Date()) {
              const key = metaKey.replace(':meta', '');
              await this.delete(key);
              cleanedCount++;
            }
          }
        } catch (error) {
          console.error('Failed to cleanup key:', metaKey, error);
        }
      }

      return cleanedCount;
    } catch (error) {
      console.error('Cache cleanup failed:', error);
      return 0;
    }
  }

  // Helper methods
  private async getMetadata(key: string): Promise<any> {
    try {
      const metadata = await this.redis?.get(`${key}:meta`);
      return metadata ? JSON.parse(metadata) : null;
    } catch (error) {
      return null;
    }
  }

  private async addToTagIndexes(key: string, tags: string[], ttl: number): Promise<void> {
    try {
      for (const tag of tags) {
        const tagKey = `tag:${tag}`;
        const existingKeys = await this.redis.get(tagKey);
        const keys = existingKeys ? JSON.parse(existingKeys) : [];
        
        if (!keys.includes(key)) {
          keys.push(key);
          await this.redis.setex(tagKey, ttl, JSON.stringify(keys));
        }
      }
    } catch (error) {
      console.error('Failed to add to tag indexes:', error);
    }
  }

  private async removeFromTagIndexes(key: string, tags: string[]): Promise<void> {
    try {
      for (const tag of tags) {
        const tagKey = `tag:${tag}`;
        const existingKeys = await this.redis.get(tagKey);
        
        if (existingKeys) {
          const keys = JSON.parse(existingKeys);
          const index = keys.indexOf(key);
          
          if (index > -1) {
            keys.splice(index, 1);
            
            if (keys.length > 0) {
              await this.redis.set(tagKey, JSON.stringify(keys));
            } else {
              await this.redis.del(tagKey);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to remove from tag indexes:', error);
    }
  }

  private async getTopKeys(keys: string[]): Promise<Array<{ key: string; hits: number; size: number }>> {
    try {
      const topKeys = [];
      
      for (const key of keys) {
        const size = await this.redis.memory('usage', key).catch(() => 0);
        topKeys.push({
          key,
          hits: 0, // Would need tracking mechanism for real hit counts
          size
        });
      }

      return topKeys.sort((a, b) => b.size - a.size);
    } catch (error) {
      console.error('Failed to get top keys:', error);
      return [];
    }
  }

  private parseMemoryInfo(info: string): number {
    try {
      const match = info.match(/used_memory:(\d+)/);
      return match ? parseInt(match[1]) : 0;
    } catch (error) {
      return 0;
    }
  }

  private async getMemoryUsage(): Promise<number> {
    try {
      const info = await this.redis.info('memory');
      return this.parseMemoryInfo(info);
    } catch (error) {
      return 0;
    }
  }
}

// Singleton instance
export const cacheService = new CacheService();

