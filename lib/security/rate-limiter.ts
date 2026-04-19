// Rate Limiter and Connection Validation
// Advanced rate limiting with multiple algorithms and connection validation

export interface RateLimitConfig {
  algorithm: 'fixed_window' | 'sliding_window' | 'token_bucket' | 'distributed' | 'adaptive';
  windowSize: number; // milliseconds
  maxRequests: number;
  burstLimit: number;
  penaltyMultiplier: number;
  skipSuccessfulRequests: boolean;
  keyGenerator: 'ip' | 'user_id' | 'session_id' | 'api_key' | 'composite';
  headers: string[];
  ipWhitelist: string[];
  skipPaths: string[];
  skipMethods: string[];
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime?: string;
  retryAfter?: number;
  penalty?: number;
  key?: string;
  message?: string;
  metadata: {
    algorithm: string;
    windowStart: string;
    windowEnd: string;
    totalRequests: number;
    usedTokens: number;
    currentUsage: number;
  };
}

export interface ConnectionValidationConfig {
  enabled: boolean;
  maxConnections: number;
  timeout: number; // milliseconds
  retryAttempts: number;
  retryDelay: number; // milliseconds
  ipValidation: {
      enabled: boolean;
      blacklist: string[];
      whitelist: string[];
      geoLocation: {
        enabled: boolean;
        allowedCountries: string[];
        blockedCountries: string[];
        allowedRegions: string[];
      };
    };
  userValidation: {
      enabled: boolean;
      requireAuthentication: boolean;
      allowedRoles: string[];
      blockedUsers: string[];
      sessionValidation: {
        enabled: boolean;
        maxSessions: number;
        sessionTimeout: number; // minutes
      };
    };
  requestValidation: {
      enabled: boolean;
      maxRequestSize: number;
    allowedMethods: string[];
    blockedHeaders: string[];
    allowedContentTypes: string[];
    maxUrlLength: number;
    suspiciousPatterns: string[];
  };
  sslValidation: {
      enabled: boolean;
      minVersion: string;
    allowedCiphers: string[];
    certificateValidation: boolean;
    ocspStapling: boolean;
    hstsEnabled: boolean;
  };
}

export interface SecurityMetrics {
  totalRequests: number;
  blockedRequests: number;
  rateLimitedRequests: number;
  suspiciousRequests: number;
  connectionErrors: number;
  sslErrors: number;
  topBlockedIPs: Array<{
    ip: string;
    count: number;
    lastSeen: string;
    country: string;
  reason: string;
  }>;
  topBlockedUsers: Array<{
    userId: string;
    count: number;
    lastSeen: string;
    reason: string;
  }>;
  topSuspiciousPatterns: Array<{
    pattern: string;
    count: number;
    lastSeen: string;
    examples: string[];
  }>;
  timestamp: string;
}

export class RateLimiter {
  private config: RateLimitConfig;
  private validationConfig: ConnectionValidationConfig;
  private storage: Map<string, any> = new Map();
  private metrics: SecurityMetrics;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(config: RateLimitConfig, validationConfig: ConnectionValidationConfig) {
    this.config = config;
    this.validationConfig = validationConfig;
    this.metrics = {
      totalRequests: 0,
      blockedRequests: 0,
      rateLimitedRequests: 0,
      suspiciousRequests: 0,
      connectionErrors: 0,
      sslErrors: 0,
      topBlockedIPs: [],
      topBlockedUsers: [],
      topSuspiciousPatterns: [],
      timestamp: new Date().toISOString()
    };
    
    this.initializeStorage();
    this.startCleanup();
  }

  private initializeStorage(): void {
    // In production, this would use Redis or similar
    // For now, using in-memory storage
    console.log('Rate limiter initialized with in-memory storage');
  }

  private startCleanup(): void {
    if (this.config.windowSize > 0) {
      this.cleanupInterval = setInterval(() => {
        this.cleanupExpiredEntries();
      }, this.config.windowSize);
    }
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    for (const [key, entry] of this.storage.entries()) {
      if (entry.resetTime && now > entry.resetTime) {
        expiredKeys.push(key);
      }
    }
    
    expiredKeys.forEach(key => this.storage.delete(key));
  }

  // Main rate limiting function
  checkLimit(key: string, identifier?: string): RateLimitResult {
    const now = Date.now();
    const windowMs = this.config.windowSize;
    const maxRequests = this.config.maxRequests;
    const burstLimit = this.config.burstLimit;
    
    // Get or create entry for this key
    let entry = this.storage.get(key);
    
    if (!entry) {
      entry = {
        count: 0,
        resetTime: now,
        tokens: this.config.keyGenerator === 'token_bucket' ? [] : [this.generateToken()],
        usedTokens: 0
      };
      this.storage.set(key, entry);
    }

    // Check if we're in a new window
    if (entry.resetTime && now > entry.resetTime + windowMs) {
      entry.count = 0;
      entry.usedTokens = 0;
      entry.resetTime = now;
    }

    // Check burst limit
    if (burstLimit > 0 && entry.count >= burstLimit) {
      return {
        allowed: false,
        limit: 0,
        remaining: 0,
        resetTime: new Date(entry.resetTime + windowMs).toISOString(),
        retryAfter: this.config.penaltyMultiplier * 1000,
        penalty: this.config.penaltyMultiplier,
        message: 'Burst limit exceeded',
        metadata: {
          algorithm: this.config.algorithm,
          windowStart: new Date(entry.resetTime).toISOString(),
          windowEnd: new Date(entry.resetTime + windowMs).toISOString(),
          totalRequests: entry.count,
          usedTokens: entry.usedTokens,
          currentUsage: entry.count
        }
      };
    }

    // Check regular limit
    if (entry.count >= maxRequests) {
      const resetTime = new Date(entry.resetTime + windowMs).toISOString();
      
      return {
        allowed: false,
        limit: 0,
        remaining: 0,
        resetTime,
        retryAfter: this.config.penaltyMultiplier * 1000,
        penalty: this.config.penaltyMultiplier,
        message: 'Rate limit exceeded',
        metadata: {
          algorithm: this.config.algorithm,
          windowStart: new Date(entry.resetTime).toISOString(),
          windowEnd: resetTime,
          totalRequests: entry.count,
          usedTokens: entry.usedTokens,
          currentUsage: entry.count
        }
      };
    }

    // Update usage
    entry.count++;
    entry.currentUsage = entry.count;
    
    // Handle token bucket algorithm
    if (this.config.algorithm === 'token_bucket' && this.config.keyGenerator === 'token_bucket') {
      if (entry.tokens.length > 0) {
        const token = entry.tokens.shift();
        entry.usedTokens++;
        
        if (entry.usedTokens >= entry.tokens.length) {
          // All tokens used, wait for reset
          const resetTime = new Date(entry.resetTime + windowMs).toISOString();
          entry.tokens = [this.generateToken()];
          entry.usedTokens = 0;
        }
      }
    }

    this.storage.set(key, entry);

    return {
      allowed: true,
      limit: maxRequests - entry.count,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime,
      retryAfter: 0,
      penalty: 0,
      key: entry.tokens?.[0] || key,
      metadata: {
        algorithm: this.config.algorithm,
        windowStart: new Date(entry.resetTime).toISOString(),
        windowEnd: new Date(entry.resetTime + windowMs).toISOString(),
        totalRequests: entry.count,
        usedTokens: entry.usedTokens,
        currentUsage: entry.count
      }
    };
  }

  // Key generation
  private generateToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  // Connection validation
  validateConnection(req: any): {
    isValid: true,
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
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if connection validation is enabled
    if (!this.validationConfig.enabled) {
      return {
        isValid: true,
        errors,
        warnings
      };
    }

    const clientIp = this.getClientIp(req);
    const userAgent = req.headers['user-agent'] || '';

    // IP validation
    if (this.validationConfig.ipValidation.enabled) {
      if (this.validationConfig.ipValidation.blacklist.includes(clientIp)) {
        errors.push('IP address is blacklisted');
        this.metrics.blockedRequests++;
        this.updateTopBlockedIPs(clientIp, 'Blacklisted');
        return {
          isValid: false,
          errors,
          warnings
        };
      }

      if (this.validationConfig.ipValidation.whitelist.length > 0 && 
          !this.validationConfig.ipValidation.whitelist.includes(clientIp)) {
        errors.push('IP address not whitelisted');
        this.metrics.blockedRequests++;
        this.updateTopBlockedIPs(clientIp, 'Not Whitelisted');
        return {
          isValid: false,
          errors,
          warnings
        };
      }
    }

    // Geographic validation
    if (this.validationConfig.geoLocation.enabled) {
      const country = this.getCountryFromIP(clientIp);
      
      if (this.validationConfig.geoLocation.blockedCountries.includes(country)) {
        errors.push(`Access from country ${country} is blocked`);
        this.metrics.blockedRequests++;
        this.updateTopBlockedIPs(clientIp, 'Geographic Restriction');
        return {
          isValid: false,
          errors,
          warnings
        };
      }
    }

    // User validation
    if (this.validationConfig.userValidation.enabled) {
      const userId = this.getUserId(req);
      
      if (this.validationConfig.userValidation.blockedUsers.includes(userId)) {
        errors.push('User is blocked');
        this.metrics.blockedRequests++;
        this.updateTopBlockedUsers(userId, 'Blocked');
        return {
          isValid: false,
          errors,
          warnings
        };
      }
    }

    // Request validation
    if (this.validationConfig.requestValidation.enabled) {
      const method = req.method;
      
      if (!this.validationConfig.requestValidation.allowedMethods.includes(method)) {
        errors.push(`Method ${method} is not allowed`);
        this.metrics.blockedRequests++;
        return {
          isValid: false,
          errors,
          warnings
        };
      }

      const contentLength = this.getContentLength(req);
      if (contentLength > this.validationConfig.requestValidation.maxUrlLength) {
        errors.push(`Request size ${contentLength} exceeds maximum allowed`);
        this.metrics.suspiciousRequests++;
        return {
          isValid: false,
          errors,
          warnings
        };
      }

      const suspiciousPatterns = this.checkSuspiciousPatterns(req);
      if (suspiciousPatterns.length > 0) {
        errors.push('Suspicious patterns detected');
        this.metrics.suspiciousRequests++;
        this.updateTopSuspiciousPatterns(suspiciousPatterns);
        return {
          isValid: false,
          errors,
          warnings
        };
      }

    // SSL validation
    if (this.validationConfig.sslValidation.enabled) {
      const sslVersion = req.headers['x-forwarded-proto'] || '';
      
      if (this.validationConfig.sslValidation.minVersion && 
          this.isSSLVersionOutdated(sslVersion)) {
        errors.push('SSL version is outdated');
        this.metrics.sslErrors++;
        return {
          isValid: false,
          errors,
          warnings
        };
      }
    }

    // Request size validation
    const requestSize = this.getRequestSize(req);
    if (requestSize > this.validationConfig.requestValidation.maxRequestSize) {
      errors.push(`Request size ${requestSize} exceeds maximum allowed`);
      this.metrics.suspiciousRequests++;
      return {
        isValid: false,
        errors,
        warnings
      };
    }

    // Connection limit validation
    const currentConnections = this.getCurrentConnections(clientIp);
    if (this.validationConfig.maxConnections > 0 && 
        currentConnections >= this.validationConfig.maxConnections) {
      errors.push('Connection limit exceeded');
      this.metrics.connectionErrors++;
      return {
        isValid: false,
        errors,
        warnings
      };
    }

    return {
      isValid: true,
      errors,
      warnings,
      metadata: {
        clientIp,
        country,
        userAgent,
        sslVersion,
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
    // In production, this would track active connections per IP
    return 1; // Mock implementation
  }

  private getCountryFromIP(ip: string): string {
    // Mock implementation - in production, use GeoIP database
    const ipParts = ip.split('.');
    if (ipParts.length === 4) {
      return 'US'; // Mock
    }
    return 'Unknown';
  }

  private isSSLVersionOutdated(version: string): boolean {
    // Mock implementation - in production, use SSL version checking
    const outdatedVersions = ['SSLv2', 'SSLv3'];
    return outdatedVersions.some(v => version.startsWith(v));
  }

  private checkSuspiciousPatterns(req: any): string[] {
    const patterns = this.validationConfig.requestValidation.suspiciousPatterns;
    const url = req.url || '';
    const userAgent = req.headers['user-agent'] || '';
    const body = req.body || '';
    
    const detectedPatterns: string[] = [];
    
    for (const pattern of patterns) {
      if (url.toLowerCase().includes(pattern.toLowerCase()) ||
          userAgent.toLowerCase().includes(pattern.toLowerCase()) ||
          (body && body.toString().toLowerCase().includes(pattern.toLowerCase()))) {
        detectedPatterns.push(pattern);
      }
    }
    
    return detectedPatterns;
  }

  // Metrics and monitoring
  private updateTopBlockedIPs(ip: string, reason: string): void {
    const existing = this.metrics.topBlockedIPs.find(item => item.ip === ip);
    
    if (existing) {
      existing.count++;
      existing.lastSeen = new Date().toISOString();
    } else {
      this.metrics.topBlockedIPs.push({
        ip,
        count: 1,
        lastSeen: new Date().toISOString(),
        country: this.getCountryFromIP(ip),
        reason
      });
    }
  }

  private updateTopBlockedUsers(userId: string, reason: string): void {
    const existing = this.metrics.topBlockedUsers.find(item => item.userId === userId);
    
    if (existing) {
      existing.count++;
      existing.lastSeen = new Date().toISOString();
    } else {
      this.metrics.topBlockedUsers.push({
        userId,
        count: 1,
        lastSeen: new Date().toISOString(),
        reason
      });
    }
  }

  private updateTopSuspiciousPatterns(patterns: string[]): void {
    patterns.forEach(pattern => {
      const existing = this.metrics.topSuspiciousPatterns.find(item => item.pattern === pattern);
      
      if (existing) {
        existing.count++;
        existing.lastSeen = new Date().toISOString();
      } else {
        this.metrics.topSuspiciousPatterns.push({
          pattern,
          count: 1,
          lastSeen: new Date().toISOString(),
          examples: []
        });
      }
    }
  }

  // Public API methods
  getMetrics(): SecurityMetrics {
    return this.metrics;
  }

  resetMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      blockedRequests: 0,
      rateLimitedRequests: 0,
      suspiciousRequests: 0,
      connectionErrors: 0,
      sslErrors: 0,
      topBlockedIPs: [],
      topBlockedUsers: [],
      topSuspiciousPatterns: [],
      timestamp: new Date().toISOString()
    };
  }

  // Cleanup
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    this.storage.clear();
    this.metrics = {
      totalRequests: 0,
      blockedRequests: 0,
      rateLimitedRequests: 0,
      suspiciousRequests: 0,
      connectionErrors: 0,
      sslErrors: 0,
      topBlockedIPs: [],
      topBlockedUsers: [],
      topSuspiciousPatterns: [],
      timestamp: new Date().toISOString()
    };
  }
}

// Factory function
export function createRateLimiter(
  rateLimitConfig: RateLimitConfig = {
    algorithm: 'fixed_window',
    windowSize: 60000, // 1 minute
    maxRequests: 100,
    burstLimit: 200,
    penaltyMultiplier: 2,
    skipSuccessfulRequests: true,
    keyGenerator: 'ip',
    headers: ['x-forwarded-for', 'x-real-ip'],
    ipWhitelist: [],
    skipPaths: ['/health', '/metrics', '/status'],
    skipMethods: ['OPTIONS', 'HEAD'],
    tokenBucket: {
      refillRate: 10,
      tokenSize: 10,
      tokensPerToken: 1
    }
  },
  connectionValidationConfig: ConnectionValidationConfig = {
    enabled: true,
    maxConnections: 1000,
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    ipValidation: {
      enabled: true,
      blacklist: [
        '192.168.1.100',
        '10.0.0.1',
        '172.16.254.1'
      ],
      whitelist: [
        '127.0.0.1',
        '10.0.0.2',
        '192.168.1.101'
      ],
      geoLocation: {
        enabled: true,
        allowedCountries: ['US', 'CA', 'GB', 'DE', 'FR', 'JP', 'AU'],
        blockedCountries: ['CN', 'RU', 'KP', 'IR', 'MM'],
        allowedRegions: ['us-east-1', 'us-west-2', 'eu-west-1', 'eu-west-2'],
        blockedRegions: ['cn-north-1', 'cn-northwest']
      }
    },
    userValidation: {
      enabled: true,
      requireAuthentication: true,
      allowedRoles: ['admin', 'analyst', 'viewer'],
      blockedUsers: [],
      sessionValidation: {
        enabled: true,
        maxSessions: 10,
        sessionTimeout: 30
      }
    },
    requestValidation: {
      enabled: true,
      maxRequestSize: 1048576, // 10MB
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      blockedHeaders: [
        'x-forwarded-for',
        'x-forwarded-proto',
        'x-forwarded-host'
      ],
      allowedContentTypes: ['application/json', 'text/plain', 'multipart/form-data'],
      maxUrlLength: 2048,
      suspiciousPatterns: [
        '<script',
        'javascript:',
        'eval(',
        'document.cookie',
        'document.write',
        'window.location',
        'document.referrer'
      ]
    },
    sslValidation: {
      enabled: true,
      minVersion: 'TLSv1.2',
      allowedCiphers: [
        'TLS_AES_128_GCM_SHA256',
        'TLS_AES_256_GCM_SHA384',
        'TLS_AES_128_CBC_SHA256',
        'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA',
        'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA'
      ],
      certificateValidation: true,
      ocspStapling: true,
      hstsEnabled: true
    }
  }
): RateLimiter {
  const limiter = new RateLimiter(rateLimitConfig, connectionValidationConfig);
  return limiter;
}

// Singleton instance
let rateLimiter: RateLimiter | null = null;

export function getRateLimiter(): RateLimiter {
  if (!rateLimiter) {
    rateLimiter = createRateLimiter();
  }
  return rateLimiter;
}
