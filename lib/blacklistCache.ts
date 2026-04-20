// Blacklist cache service for TrustHire Autonomous System
export function refreshBlacklist() {
  const cache = new BlacklistCache();
  return cache.refreshCache();
}

export class BlacklistCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  constructor() {
    // Clean up expired entries every hour
    setInterval(() => this.cleanup(), 3600000);
  }
  
  set(key: string, data: any, ttl: number = 3600000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  has(key: string): boolean {
    return this.get(key) !== null;
  }
  
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  refreshCache(): Promise<boolean> {
    return Promise.resolve(true);
  }
  
  size(): number {
    return this.cache.size;
  }
  
  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

export const blacklistCache = new BlacklistCache();
