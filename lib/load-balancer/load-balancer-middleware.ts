// Load Balancer Middleware
// HTTP request routing and load balancing for scalability

import { Request, Response, NextFunction } from 'express';
import { getClusterManager } from './cluster-manager';

export interface LoadBalancerRequest extends Request {
  cluster?: {
    server: any;
    sessionId: string;
    startTime: number;
  };
  originalUrl?: string;
  originalMethod?: string;
  originalHeaders?: Record<string, string>;
}

export interface RoutingRule {
  path: string;
  method: string;
  serverId?: string;
  weight?: number;
  condition?: (req: LoadBalancerRequest) => boolean;
}

export interface LoadBalancerOptions {
  enabled: boolean;
  algorithm?: 'round_robin' | 'least_connections' | 'weighted_round_robin' | 'ip_hash' | 'random';
  healthCheckPath?: string;
  timeout?: number;
  retries?: number;
  sessionAffinity?: boolean;
  stickySessions?: boolean;
  customRoutes?: RoutingRule[];
  bypassPaths?: string[];
  rateLimit?: {
    enabled: boolean;
    requestsPerMinute: number;
    burstSize: number;
  };
}

export class LoadBalancerMiddleware {
  private clusterManager;
  private options: LoadBalancerOptions;
  private connectionCounts: Map<string, number> = new Map();
  private sessionMap: Map<string, string> = new Map();

  constructor(options: LoadBalancerOptions = {}) {
    this.clusterManager = getClusterManager();
    this.options = {
      enabled: true,
      algorithm: 'weighted_round_robin',
      healthCheckPath: '/health',
      timeout: 30000,
      retries: 3,
      sessionAffinity: true,
      stickySessions: true,
      customRoutes: [],
      bypassPaths: ['/health', '/metrics', '/status'],
      rateLimit: {
        enabled: true,
        requestsPerMinute: 100,
        burstSize: 200
      },
      ...options
    };
  }

  // Main middleware function
  middleware() {
    return (req: LoadBalancerRequest, res: Response, next: NextFunction) => {
      // Skip load balancing if disabled
      if (!this.options.enabled) {
        return next();
      }

      // Skip load balancing for health checks and metrics
      if (this.shouldBypass(req)) {
        return next();
      }

      // Apply rate limiting
      if (this.options.rateLimit?.enabled && !this.checkRateLimit(req)) {
        return this.sendRateLimitResponse(res);
      }

      // Handle session affinity
      this.handleSessionAffinity(req, res);

      // Select target server
      const server = this.selectServer(req);
      
      if (!server) {
        return this.sendServiceUnavailable(res);
      }

      // Update request metadata
      req.cluster = {
        server,
        sessionId: req.cluster?.sessionId || this.generateSessionId(),
        startTime: Date.now()
      };

      // Store original request details
      req.originalUrl = req.url;
      req.originalMethod = req.method;
      req.originalHeaders = { ...req.headers };

      // Route request to selected server
      this.routeRequest(req, res, next, server);
    };
  }

  private shouldBypass(req: LoadBalancerRequest): boolean {
    return this.options.bypassPaths?.some(path => 
      req.url?.startsWith(path)
    ) || false;
  }

  private checkRateLimit(req: LoadBalancerRequest): boolean {
    const clientIp = this.getClientIp(req);
    const key = `rate_limit_${clientIp}`;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window

    const current = this.connectionCounts.get(key) || { count: 0, resetTime: now };

    // Reset window if expired
    if (now - current.resetTime > windowMs) {
      current.count = 0;
      current.resetTime = now;
    }

    // Check rate limit
    if (current.count >= this.options.rateLimit.requestsPerMinute) {
      return false;
    }

    // Update count
    current.count++;
    this.connectionCounts.set(key, current);

    return true;
  }

  private sendRateLimitResponse(res: Response): void {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded',
      retryAfter: 60
    });
  }

  private handleSessionAffinity(req: LoadBalancerRequest, res: Response): void {
    if (!this.options.sessionAffinity) {
      return;
    }

    // Check for existing session cookie
    const sessionId = req.cookies?.[this.options.stickySessions ? 'TRUSTHIRE_SESSION' : 'SESSION_ID'];
    
    if (sessionId) {
      req.cluster = {
        ...req.cluster,
        sessionId
      };
    }
  }

  private selectServer(req: LoadBalancerRequest): any {
    // Check custom routing rules first
    const customServer = this.checkCustomRoutes(req);
    if (customServer) {
      return customServer;
    }

    // Use load balancing algorithm
    return this.clusterManager.selectServer();
  }

  private checkCustomRoutes(req: LoadBalancerRequest): any {
    if (!this.options.customRoutes) {
      return null;
    }

    for (const rule of this.options.customRoutes) {
      if (req.method === rule.method && req.url?.startsWith(rule.path)) {
        if (rule.condition && !rule.condition(req)) {
          continue;
        }

        if (rule.serverId) {
          return this.clusterManager.getServer(rule.serverId);
        }
      }
    }

    return null;
  }

  private routeRequest(req: LoadBalancerRequest, res: Response, next: NextFunction, server: any): void {
    const startTime = Date.now();
    
    try {
      // Update server connection count
      this.incrementConnectionCount(server.id);

      // Set response headers
      this.setResponseHeaders(res, server);

      // Proxy request to target server
      await this.proxyRequest(req, res, server);

      // Log successful request
      this.logRequest(req, res, server, startTime, null);
    } catch (error) {
      // Handle request failure
      this.handleRequestError(req, res, server, startTime, error);
    } finally {
      // Decrement connection count
      this.decrementConnectionCount(server.id);
    }
  }

  private async proxyRequest(req: LoadBalancerRequest, res: Response, server: any): Promise<void> {
    const targetUrl = `${server.protocol}://${server.host}:${server.port}${req.originalUrl || req.url}`;

    // Create proxy request
    const response = await fetch(targetUrl, {
      method: req.originalMethod || req.method,
      headers: {
        ...req.originalHeaders,
        'X-Forwarded-For': this.getClientIp(req),
        'X-Forwarded-Proto': req.protocol,
        'X-Forwarded-Host': req.headers.host,
        'X-Original-URI': req.originalUrl || req.url,
        'X-Load-Balancer': 'trusthire-lb',
        'X-Server-ID': server.id,
        'X-Session-ID': req.cluster?.sessionId
      },
      body: req.body,
      timeout: this.options.timeout
    });

    // Copy response headers
    this.copyResponseHeaders(response, res);

    // Set response status
    res.status(response.status);

    // Send response body
    if (response.body) {
      if (typeof response.body === 'string') {
        res.send(response.body);
      } else if (Buffer.isBuffer(response.body)) {
        res.send(response.body);
      } else {
        res.json(response.body);
      }
    } else {
      res.end();
    }
  }

  private setResponseHeaders(res: Response, server: any): void {
    res.setHeader('X-Server-ID', server.id);
    res.setHeader('X-Load-Balancer', 'trusthire-lb');
    res.setHeader('X-Backend-Server', `${server.host}:${server.port}`);
    res.setHeader('X-Response-Time', server.responseTime.toString());
    res.setHeader('X-Server-Weight', server.weight.toString());
    res.setHeader('X-Server-Region', server.metadata.region);
    res.setHeader('X-Server-Zone', server.metadata.zone);
  }

  private copyResponseHeaders(source: any, target: Response): void {
    // Copy all headers except hop-by-hop headers
    const hopByHopHeaders = ['connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailers', 'transfer-encoding', 'upgrade'];
    
    if (source.headers) {
      for (const [key, value] of Object.entries(source.headers)) {
        if (!hopByHopHeaders.includes(key.toLowerCase())) {
          target.setHeader(key, value);
        }
      }
    }
  }

  private handleRequestError(req: LoadBalancerRequest, res: Response, server: any, startTime: number, error: any): void {
    const duration = Date.now() - startTime;
    
    console.error(`Request failed: ${req.method} ${req.url} -> ${server.host}:${server.port}`, {
      error: error.message,
      duration,
      server: server.id
    });

    // Try to provide a graceful error response
    if (!res.headersSent) {
      res.status(502).json({
        error: 'Bad Gateway',
        message: 'The server encountered an error while processing the request',
        serverId: server.id,
        timestamp: new Date().toISOString()
      });
    }

    this.logRequest(req, res, server, startTime, error);
  }

  private logRequest(req: LoadBalancerRequest, res: Response, server: any, startTime: number, error: any): void {
    const duration = Date.now() - startTime;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.originalMethod || req.method,
      url: req.originalUrl || req.url,
      clientIp: this.getClientIp(req),
      userAgent: req.headers['user-agent'],
      serverId: server.id,
      serverHost: `${server.host}:${server.port}`,
      serverRegion: server.metadata.region,
      sessionId: req.cluster?.sessionId,
      duration,
      status: res.statusCode,
      error: error ? error.message : null,
      responseSize: res.get('content-length') || 0,
      referer: req.headers.referer,
      forwardedFor: req.headers['x-forwarded-for']
    };

    console.log('Load balancer request:', logData);
  }

  private getClientIp(req: LoadBalancerRequest): string {
    return req.headers['x-forwarded-for'] || 
           req.headers['x-real-ip'] || 
           req.connection?.remoteAddress || 
           req.ip || 
           'unknown';
  }

  private generateSessionId(): string {
    return `lb-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private incrementConnectionCount(serverId: string): void {
    const current = this.connectionCounts.get(serverId) || 0;
    this.connectionCounts.set(serverId, current + 1);
  }

  private decrementConnectionCount(serverId: string): void {
    const current = this.connectionCounts.get(serverId) || 0;
    this.connectionCounts.set(serverId, Math.max(0, current - 1));
  }

  private sendServiceUnavailable(res: Response): void {
    res.status(503).json({
      error: 'Service Unavailable',
      message: 'All servers are currently unavailable',
      timestamp: new Date().toISOString()
    });
  }

  // Health check endpoint
  healthCheck(req: Request, res: Response): void {
    const clusterManager = getClusterManager();
    const servers = clusterManager.getAllServers();
    const metrics = clusterManager.getMetrics();

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      loadBalancer: {
        algorithm: this.options.algorithm,
        totalServers: servers.length,
        healthyServers: clusterManager.getHealthyServers().length,
        totalConnections: metrics.activeConnections,
        averageResponseTime: metrics.averageResponseTime,
        errorRate: metrics.errorRate
      },
      servers: servers.map(server => ({
        id: server.id,
        host: server.host,
        port: server.port,
        status: server.status,
        connections: server.currentConnections,
        maxConnections: server.maxConnections,
        responseTime: server.responseTime,
        lastHealthCheck: server.lastHealthCheck,
        region: server.metadata.region,
        zone: server.metadata.zone,
        version: server.metadata.version,
        capabilities: server.capabilities
      }))
    };

    res.status(200).json(healthStatus);
  }

  // Metrics endpoint
  metrics(req: Request, res: Response): void {
    const clusterManager = getClusterManager();
    const metrics = clusterManager.getMetrics();

    const metricsData = {
      timestamp: new Date().toISOString(),
      loadBalancer: {
        algorithm: this.options.algorithm,
        sessionAffinity: this.options.sessionAffinity,
        stickySessions: this.options.stickySessions,
        rateLimitEnabled: this.options.rateLimit?.enabled,
        rateLimitConfig: this.options.rateLimit,
        bypassPaths: this.options.bypassPaths,
        customRoutes: this.options.customRoutes?.length || 0
      },
      performance: {
        totalRequests: metrics.totalRequests,
        activeConnections: metrics.activeConnections,
        averageResponseTime: metrics.averageResponseTime,
        errorRate: metrics.errorRate,
        throughput: metrics.throughput
      },
      servers: metrics.serverStats,
      connectionCounts: Object.fromEntries(this.connectionCounts)
    };

    res.status(200).json(metricsData);
  }

  // Server management endpoints
  async addServer(req: Request, res: Response): Promise<void> {
    try {
      const serverData = await this.parseRequestBody(req);
      const clusterManager = getClusterManager();
      
      clusterManager.addServer(serverData);
      
      res.status(201).json({
        success: true,
        message: 'Server added successfully',
        server: clusterManager.getServer(serverData.id)
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async removeServer(req: Request, res: Response): Promise<void> {
    try {
      const { serverId } = await this.parseRequestBody(req);
      const clusterManager = getClusterManager();
      
      clusterManager.removeServer(serverId);
      
      res.status(200).json({
        success: true,
        message: 'Server removed successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateServer(req: Request, res: Response): Promise<void> {
    try {
      const { serverId, updates } = await this.parseRequestBody(req);
      const clusterManager = getClusterManager();
      
      clusterManager.updateServer(serverId, updates);
      
      res.status(200).json({
        success: true,
        message: 'Server updated successfully',
        server: clusterManager.getServer(serverId)
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  private async parseRequestBody(req: Request): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = '';
      
      req.on('data', chunk => {
        body += chunk;
      });
      
      req.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
      
      req.on('error', reject);
    });
  }

  // Cleanup
  destroy(): void {
    this.connectionCounts.clear();
    this.sessionMap.clear();
  }
}

// Factory function
export function createLoadBalancer(options: LoadBalancerOptions = {}) {
  const middleware = new LoadBalancerMiddleware(options);
  
  return {
    middleware: middleware.middleware(),
    healthCheck: middleware.healthCheck.bind(middleware),
    metrics: middleware.metrics.bind(middleware),
    addServer: middleware.addServer.bind(middleware),
    removeServer: middleware.removeServer.bind(middleware),
    updateServer: middleware.updateServer.bind(middleware),
    destroy: middleware.destroy.bind(middleware)
  };
}
