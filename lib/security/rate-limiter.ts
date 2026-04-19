// Rate Limiting and Security System
// Advanced rate limiting with multiple algorithms and connection validation

export interface RateLimitConfig {
  algorithm: 'fixed_window' | 'sliding_window' | 'token_bucket';
  windowSize: number; // in milliseconds
  maxRequests: number;
  burstLimit?: number;
  keyGenerator: 'ip' | 'user_id' | 'session_id' | 'api_key' | 'composite';
  ipWhitelist?: string[];
  skipPaths?: string[];
}

export interface ConnectionValidationConfig {
  enabled: boolean;
  maxConnections: number;
  ipValidation: {
    enabled: boolean;
    blacklist: string[];
    whitelist: string[];
    geoLocation: {
      enabled: boolean;
      allowedCountries: string[];
      blockedCountries: string[];
    };
  };
  userValidation: {
    enabled: boolean;
    allowedRoles: string[];
    blockedUsers: string[];
  };
  requestValidation: {
    enabled: boolean;
    maxRequestSize: number;
    allowedMethods: string[];
    allowedContentTypes: string[];
  };
  sslValidation: {
    enabled: boolean;
    minVersion: string;
    requireStrictTransport: boolean;
  };
}

export interface SecurityMetrics {
  totalRequests: number;
  blockedRequests: number;
  rateLimitHits: number;
  topBlockedIPs: Array<{ ip: string; count: number; reason: string }>;
  topBlockedUsers: Array<{ userId: string; count: number; reason: string }>;
  topSuspiciousPatterns: Array<{ pattern: string; count: number }>;
  connectionStats: {
    activeConnections: number;
    totalConnections: number;
    peakConnections: number;
  };
  sslViolations: number;
  geoBlocked: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metadata: {
    clientIp: string;
    country?: string;
    userAgent: string;
    sslVersion?: string;
    requestSize: number;
    suspiciousPatterns: string[];
  };
}

export class RateLimiter {
  private config: RateLimitConfig;
  private connectionConfig: ConnectionValidationConfig;
  private metrics: SecurityMetrics;
  private requestCounts: Map<string, { count: number; resetTime: number; burstCount: number }>;
  private connections: Map<string, { count: number; lastSeen: number }>;
  private blockedIPs: Map<string, { reason: string; count: number; blockedAt: number }>;
  private blockedUsers: Map<string, { reason: string; count: number; blockedAt: number }>;
  private suspiciousPatterns: Map<string, number>;

  constructor(config: RateLimitConfig, connectionConfig: ConnectionValidationConfig) {
    this.config = config;
    this.connectionConfig = connectionConfig;
    this.requestCounts = new Map();
    this.connections = new Map();
    this.blockedIPs = new Map();
    this.blockedUsers = new Map();
    this.suspiciousPatterns = new Map();
    
    this.metrics = {
      totalRequests: 0,
      blockedRequests: 0,
      rateLimitHits: 0,
      topBlockedIPs: [],
      topBlockedUsers: [],
      topSuspiciousPatterns: [],
      connectionStats: {
        activeConnections: 0,
        totalConnections: 0,
        peakConnections: 0
      },
      sslViolations: 0,
      geoBlocked: 0
    };
  }

  checkLimit(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const windowStart = now - this.config.windowSize;
    
    let data = this.requestCounts.get(key);
    
    if (!data || data.resetTime <= now) {
      data = {
        count: 0,
        resetTime: now + this.config.windowSize,
        burstCount: 0
      };
      this.requestCounts.set(key, data);
    }
    
    data.count++;
    
    // Check burst limit if configured
    if (this.config.burstLimit && data.count > this.config.burstLimit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: data.resetTime
      };
    }
    
    const allowed = data.count <= this.config.maxRequests;
    const remaining = Math.max(0, this.config.maxRequests - data.count);
    
    if (!allowed) {
      this.metrics.rateLimitHits++;
    }
    
    return {
      allowed,
      remaining,
      resetTime: data.resetTime
    };
  }

  validateConnection(req: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suspiciousPatterns: string[] = [];
    
    const clientIp = this.getClientIp(req);
    const userAgent = req.headers['user-agent'] || '';
    const requestSize = this.getContentLength(req);
    
    // Check IP blacklist
    if (this.connectionConfig.ipValidation.enabled) {
      if (this.connectionConfig.ipValidation.blacklist.includes(clientIp)) {
        errors.push('IP address is blacklisted');
        this.updateTopBlockedIPs(clientIp, 'Blacklisted IP');
      }
      
      // Check geographic restrictions
      if (this.connectionConfig.ipValidation.geoLocation.enabled) {
        const country = this.getCountryFromIP(clientIp);
        if (this.connectionConfig.ipValidation.geoLocation.blockedCountries.includes(country)) {
          errors.push('Geographic location is blocked');
          this.metrics.geoBlocked++;
        }
      }
    }
    
    // Check request size
    if (this.connectionConfig.requestValidation.enabled) {
      if (requestSize > this.connectionConfig.requestValidation.maxRequestSize) {
        errors.push('Request size exceeds limit');
      }
    }
    
    // Check for suspicious patterns
    const patterns = this.checkSuspiciousPatterns(req);
    suspiciousPatterns.push(...patterns);
    
    // Check SSL validation
    if (this.connectionConfig.sslValidation.enabled && req.secure) {
      const sslVersion = this.getSSLVersion(req);
      if (this.isSSLVersionOutdated(sslVersion)) {
        warnings.push('SSL version is outdated');
        this.metrics.sslViolations++;
      }
    }
    
    const isValid = errors.length === 0;
    
    if (!isValid) {
      this.metrics.blockedRequests++;
    }
    
    return {
      isValid,
      errors,
      warnings,
      metadata: {
        clientIp,
        country: this.getCountryFromIP(clientIp),
        userAgent,
        sslVersion: this.getSSLVersion(req),
        requestSize,
        suspiciousPatterns
      }
    };
  }

  private getClientIp(req: any): string {
    return req.headers['x-forwarded-for'] || 
           req.headers['x-real-ip'] || 
           req.connection?.remoteAddress || 
           req.ip || 
           'unknown';
  }

  private getUserId(req: any): string {
    // In production, this would extract from authentication
    return req.user?.id || 'anonymous';
  }

  private getContentLength(req: any): number {
    const contentLength = req.headers['content-length'];
    return contentLength ? parseInt(contentLength) : 0;
  }

  private getCurrentConnections(clientIp: string): number {
    const data = this.connections.get(clientIp);
    return data ? data.count : 0;
  }

  private getCountryFromIP(ip: string): string {
    // Mock implementation - in production, use GeoIP database
    const mockCountries: { [key: string]: string } = {
      '127.0.0.1': 'US',
      '192.168.1.1': 'US',
      '10.0.0.1': 'US'
    };
    return mockCountries[ip] || 'Unknown';
  }

  private getSSLVersion(req: any): string {
    // Mock implementation - in production, extract from TLS handshake
    return 'TLSv1.3';
  }

  private isSSLVersionOutdated(version: string): boolean {
    const outdatedVersions = ['SSLv2', 'SSLv3', 'TLSv1.0', 'TLSv1.1'];
    return outdatedVersions.includes(version);
  }

  private checkSuspiciousPatterns(req: any): string[] {
    const patterns: string[] = [];
    const userAgent = req.headers['user-agent'] || '';
    const url = req.url || '';
    
    // Check for common attack patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /union.*select/i,
      /drop.*table/i,
      /exec/i,
      /eval/i
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(url) || pattern.test(userAgent)) {
        patterns.push(pattern.source);
        this.updateTopSuspiciousPatterns(pattern.source);
      }
    }
    
    return patterns;
  }

  private updateTopBlockedIPs(ip: string, reason: string) {
    const existing = this.blockedIPs.get(ip);
    const count = existing ? existing.count + 1 : 1;
    
    this.blockedIPs.set(ip, {
      reason,
      count,
      blockedAt: Date.now()
    });
  }

  private updateTopBlockedUsers(userId: string, reason: string) {
    const existing = this.blockedUsers.get(userId);
    const count = existing ? existing.count + 1 : 1;
    
    this.blockedUsers.set(userId, {
      reason,
      count,
      blockedAt: Date.now()
    });
  }

  private updateTopSuspiciousPatterns(pattern: string) {
    const existing = this.suspiciousPatterns.get(pattern);
    this.suspiciousPatterns.set(pattern, existing ? existing + 1 : 1);
  }

  getMetrics(): SecurityMetrics {
    // Update top lists
    this.metrics.topBlockedIPs = Array.from(this.blockedIPs.entries())
      .map(([ip, data]) => ({ ip, count: data.count, reason: data.reason }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    this.metrics.topBlockedUsers = Array.from(this.blockedUsers.entries())
      .map(([userId, data]) => ({ userId, count: data.count, reason: data.reason }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    this.metrics.topSuspiciousPatterns = Array.from(this.suspiciousPatterns.entries())
      .map(([pattern, count]) => ({ pattern, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return { ...this.metrics };
  }

  resetMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      blockedRequests: 0,
      rateLimitHits: 0,
      topBlockedIPs: [],
      topBlockedUsers: [],
      topSuspiciousPatterns: [],
      connectionStats: {
        activeConnections: 0,
        totalConnections: 0,
        peakConnections: 0
      },
      sslViolations: 0,
      geoBlocked: 0
    };
  }

  destroy(): void {
    this.requestCounts.clear();
    this.connections.clear();
    this.blockedIPs.clear();
    this.blockedUsers.clear();
    this.suspiciousPatterns.clear();
  }
}

export function createRateLimiter(config: Partial<RateLimitConfig> = {}, connectionConfig: Partial<ConnectionValidationConfig> = {}): RateLimiter {
  const defaultConfig: RateLimitConfig = {
    algorithm: 'sliding_window',
    windowSize: 60000, // 1 minute
    maxRequests: 100,
    burstLimit: 200,
    keyGenerator: 'ip',
    ipWhitelist: ['127.0.0.1', '::1'],
    skipPaths: ['/health', '/metrics', '/status']
  };

  const defaultConnectionConfig: ConnectionValidationConfig = {
    enabled: true,
    maxConnections: 1000,
    ipValidation: {
      enabled: true,
      blacklist: [],
      whitelist: ['127.0.0.1', '::1'],
      geoLocation: {
        enabled: false,
        allowedCountries: ['US', 'CA', 'GB', 'DE', 'FR'],
        blockedCountries: ['CN', 'RU', 'KP', 'IR']
      }
    },
    userValidation: {
      enabled: false,
      allowedRoles: [],
      blockedUsers: []
    },
    requestValidation: {
      enabled: true,
      maxRequestSize: 10 * 1024 * 1024, // 10MB
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedContentTypes: ['application/json', 'application/x-www-form-urlencoded', 'multipart/form-data']
    },
    sslValidation: {
      enabled: true,
      minVersion: 'TLSv1.2',
      requireStrictTransport: true
    }
  };

  return new RateLimiter(
    { ...defaultConfig, ...config },
    { ...defaultConnectionConfig, ...connectionConfig }
  );
}
