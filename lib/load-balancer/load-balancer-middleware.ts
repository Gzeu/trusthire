// Load Balancer Middleware
// Simplified implementation for Next.js

import { NextRequest, NextResponse } from 'next/server';
import { getClusterManager } from './cluster-manager';

export interface LoadBalancerRequest extends NextRequest {
  selectedServer?: string;
  loadBalancerMetrics?: any;
}

export interface LoadBalancerOptions {
  algorithm?: 'round_robin' | 'weighted_round_robin' | 'least_connections' | 'ip_hash';
  sessionAffinity?: boolean;
  stickySessions?: boolean;
  healthCheck?: {
    enabled: boolean;
    interval: number;
    timeout: number;
    retries: number;
  };
  rateLimit?: {
    enabled: boolean;
    requestsPerMinute: number;
    burstSize: number;
  };
}

export interface LoadBalancerStats {
  totalRequests: number;
  activeConnections: number;
  averageResponseTime: number;
  errorRate: number;
  throughput: number;
  serverStats: Array<{
    serverId: string;
    requests: number;
    responseTime: number;
    errorRate: number;
    status: string;
  }>;
  timestamp: string;
}

export class LoadBalancerMiddleware {
  private clusterManager: any;
  private options: LoadBalancerOptions;
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(options: LoadBalancerOptions = {}) {
    this.options = {
      algorithm: 'weighted_round_robin',
      sessionAffinity: true,
      stickySessions: true,
      healthCheck: {
        enabled: true,
        interval: 30000,
        timeout: 5000,
        retries: 3
      },
      rateLimit: {
        enabled: true,
        requestsPerMinute: 100,
        burstSize: 200
      },
      ...options
    };

    this.clusterManager = getClusterManager(this.options);
  }

  // Main middleware function
  async handleRequest(req: NextRequest): Promise<NextResponse> {
    try {
      // Rate limiting
      if (this.options.rateLimit?.enabled) {
        const rateLimitResult = this.checkRateLimit(req);
        if (!rateLimitResult.allowed) {
          return NextResponse.json({
            error: 'Rate limit exceeded',
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: rateLimitResult.retryAfter
          }, { status: 429 });
        }
      }

      // Select server
      const clientIP = this.getClientIP(req);
      const selectedServer = this.clusterManager.selectServer(clientIP);

      if (!selectedServer) {
        return NextResponse.json({
          error: 'No healthy servers available',
          code: 'NO_HEALTHY_SERVERS'
        }, { status: 503 });
      }

      // Add load balancer headers
      const response = NextResponse.next();
      response.headers.set('X-Load-Balancer-Server', selectedServer.id);
      response.headers.set('X-Load-Balancer-Algorithm', this.options.algorithm || 'weighted_round_robin');
      response.headers.set('X-Load-Balancer-Response-Time', selectedServer.responseTime.toString());

      return response;
    } catch (error) {
      console.error('Load balancer error:', error);
      return NextResponse.json({
        error: 'Load balancer error',
        code: 'LOAD_BALANCER_ERROR'
      }, { status: 500 });
    }
  }

  // Health check endpoint
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    details: {
      totalServers: number;
      healthyServers: number;
      algorithm: string;
      sessionAffinity: boolean;
      rateLimitEnabled: boolean;
      metrics: LoadBalancerStats;
    };
  }> {
    try {
      const metrics = this.clusterManager.getMetrics();
      const totalServers = this.clusterManager.getServerCount();
      const healthyServers = this.clusterManager.getHealthyServerCount();

      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      
      if (healthyServers === 0) {
        status = 'unhealthy';
      } else if (healthyServers < totalServers * 0.5) {
        status = 'degraded';
      }

      return {
        status,
        timestamp: new Date().toISOString(),
        details: {
          totalServers,
          healthyServers,
          algorithm: this.options.algorithm || 'weighted_round_robin',
          sessionAffinity: this.options.sessionAffinity || false,
          rateLimitEnabled: this.options.rateLimit?.enabled || false,
          metrics
        }
      };
    } catch (error) {
      console.error('Health check error:', error);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        details: {
          totalServers: 0,
          healthyServers: 0,
          algorithm: this.options.algorithm || 'weighted_round_robin',
          sessionAffinity: this.options.sessionAffinity || false,
          rateLimitEnabled: this.options.rateLimit?.enabled || false,
          metrics: {
            totalRequests: 0,
            activeConnections: 0,
            averageResponseTime: 0,
            errorRate: 1,
            throughput: 0,
            serverStats: [],
            timestamp: new Date().toISOString()
          }
        }
      };
    }
  }

  // Metrics endpoint
  async getMetrics(): Promise<LoadBalancerStats> {
    return this.clusterManager.getMetrics();
  }

  // Server management endpoints
  async getServers(): Promise<any[]> {
    return this.clusterManager.getAllServers();
  }

  async getServer(id: string): Promise<any> {
    return this.clusterManager.getServer(id);
  }

  async addServer(serverData: any): Promise<any> {
    return this.clusterManager.addServer(serverData);
  }

  async updateServer(id: string, updates: any): Promise<any> {
    return this.clusterManager.updateServer(id, updates);
  }

  async removeServer(id: string): Promise<boolean> {
    return this.clusterManager.removeServer(id);
  }

  // Configuration management
  async updateConfig(config: Partial<LoadBalancerOptions>): Promise<void> {
    this.options = { ...this.options, ...config };
    this.clusterManager.updateConfig(this.options);
  }

  async getConfig(): Promise<LoadBalancerOptions> {
    return this.options;
  }

  // Rate limiting
  private checkRateLimit(req: NextRequest): { allowed: boolean; retryAfter?: number } {
    if (!this.options.rateLimit?.enabled) {
      return { allowed: true };
    }

    const clientIP = this.getClientIP(req);
    const now = Date.now();
    const key = `rate-limit:${clientIP}`;
    
    let clientData = this.requestCounts.get(key);
    
    if (!clientData || now > clientData.resetTime) {
      clientData = {
        count: 1,
        resetTime: now + 60000 // 1 minute
      };
      this.requestCounts.set(key, clientData);
      return { allowed: true };
    }

    clientData.count++;
    
    if (clientData.count > (this.options.rateLimit.requestsPerMinute || 100)) {
      const retryAfter = Math.ceil((clientData.resetTime - now) / 1000);
      return { allowed: false, retryAfter };
    }

    return { allowed: true };
  }

  private getClientIP(req: NextRequest): string {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    
    return forwardedFor ? forwardedFor.split(',')[0].trim() : 
           realIp || 
           '127.0.0.1';
  }

  // Cleanup expired rate limit entries
  cleanupRateLimits(): void {
    const now = Date.now();
    Array.from(this.requestCounts.entries()).forEach(([key, data]) => {
      if (now > data.resetTime) {
        this.requestCounts.delete(key);
      }
    });
  }

  // Get load balancer statistics
  async getStatistics(): Promise<{
    totalRequests: number;
    activeConnections: number;
    averageResponseTime: number;
    errorRate: number;
    throughput: number;
    serverCount: number;
    healthyServerCount: number;
    loadPercentage: number;
    rateLimitEntries: number;
  }> {
    const metrics = this.clusterManager.getMetrics();
    
    return {
      totalRequests: metrics.totalRequests,
      activeConnections: metrics.activeConnections,
      averageResponseTime: metrics.averageResponseTime,
      errorRate: metrics.errorRate,
      throughput: metrics.throughput,
      serverCount: this.clusterManager.getServerCount(),
      healthyServerCount: this.clusterManager.getHealthyServerCount(),
      loadPercentage: this.clusterManager.getLoadPercentage(),
      rateLimitEntries: this.requestCounts.size
    };
  }

  // Start/stop the load balancer
  start(): void {
    this.clusterManager.start();
    
    // Set up periodic cleanup
    setInterval(() => {
      this.cleanupRateLimits();
    }, 60000); // Clean up every minute
  }

  stop(): void {
    this.clusterManager.stop();
  }
}

// Singleton instance
let loadBalancerMiddleware: LoadBalancerMiddleware | null = null;

export function getLoadBalancerMiddleware(options?: LoadBalancerOptions): LoadBalancerMiddleware {
  if (!loadBalancerMiddleware) {
    loadBalancerMiddleware = new LoadBalancerMiddleware(options);
  }
  return loadBalancerMiddleware;
}

// Helper function to create middleware for Next.js routes
export function createLoadBalancerHandler(options?: LoadBalancerOptions) {
  const middleware = getLoadBalancerMiddleware(options);
  
  return async (req: NextRequest) => {
    return middleware.handleRequest(req);
  };
}
