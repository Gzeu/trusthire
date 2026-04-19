// Load Balancer - Cluster Manager
// Multiple server instances for scalability and high availability

export interface ServerInstance {
  id: string;
  host: string;
  port: number;
  protocol: 'http' | 'https';
  status: 'healthy' | 'degraded' | 'unhealthy' | 'maintenance';
  weight: number;
  maxConnections: number;
  currentConnections: number;
  responseTime: number;
  lastHealthCheck: string;
  capabilities: {
    threatIntelligence: boolean;
    analytics: boolean;
    authentication: boolean;
    websocket: boolean;
  };
  metadata: {
    region: string;
    zone: string;
    version: string;
    deployment: string;
    startedAt: string;
    lastRestart: string;
  };
}

export interface LoadBalancerConfig {
  algorithm: 'round_robin' | 'least_connections' | 'weighted_round_robin' | 'ip_hash' | 'random';
  healthCheck: {
    enabled: boolean;
    interval: number; // milliseconds
    timeout: number; // milliseconds
    retries: number;
    path: string;
    expectedStatus: number;
  };
  connection: {
    timeout: number; // milliseconds
    maxRetries: number;
    retryDelay: number; // milliseconds
  };
  failover: {
    enabled: boolean;
    threshold: number; // percentage of unhealthy servers
    timeout: number; // milliseconds
  };
  sessionAffinity: {
    enabled: boolean;
    timeout: number; // minutes
    cookieName: string;
  };
  ssl: {
    enabled: boolean;
    certPath: string;
    keyPath: string;
    caPath: string;
  };
  monitoring: {
    enabled: boolean;
    metricsInterval: number; // milliseconds
    alertThresholds: {
      responseTime: number; // milliseconds
      errorRate: number; // percentage
      connectionCount: number;
    };
  };
}

export interface HealthCheckResult {
  serverId: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  error?: string;
  timestamp: string;
  metrics: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
}

export interface LoadBalancerMetrics {
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

export class ClusterManager {
  private config: LoadBalancerConfig;
  private servers: Map<string, ServerInstance> = new Map();
  private currentIndex = 0;
  private metrics: LoadBalancerMetrics;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private metricsInterval: NodeJS.Timeout | null = null;

  constructor(config: LoadBalancerConfig) {
    this.config = config;
    this.initializeServers();
    this.startHealthChecks();
    this.startMetricsCollection();
  }

  private initializeServers(): void {
    // Initialize mock servers for demonstration
    const mockServers: ServerInstance[] = [
      {
        id: 'server-1',
        host: 'server-1.trusthire.com',
        port: 3001,
        protocol: 'https',
        status: 'healthy',
        weight: 1,
        maxConnections: 1000,
        currentConnections: 0,
        responseTime: 45,
        lastHealthCheck: new Date().toISOString(),
        capabilities: {
          threatIntelligence: true,
          analytics: true,
          authentication: true,
          websocket: true
        },
        metadata: {
          region: 'us-east-1',
          zone: 'us-east-1a',
          version: '1.0.0',
          deployment: 'production',
          startedAt: new Date().toISOString(),
          lastRestart: new Date().toISOString()
        }
      },
      {
        id: 'server-2',
        host: 'server-2.trusthire.com',
        port: 3002,
        protocol: 'https',
        status: 'healthy',
        weight: 1,
        maxConnections: 1000,
        currentConnections: 0,
        responseTime: 38,
        lastHealthCheck: new Date().toISOString(),
        capabilities: {
          threatIntelligence: true,
          analytics: true,
          authentication: true,
          websocket: true
        },
        metadata: {
          region: 'us-east-1',
          zone: 'us-east-1b',
          version: '1.0.0',
          deployment: 'production',
          startedAt: new Date().toISOString(),
          lastRestart: new Date().toISOString()
        }
      },
      {
        id: 'server-3',
        host: 'server-3.trusthire.com',
        port: 3003,
        protocol: 'https',
        status: 'healthy',
        weight: 2,
        maxConnections: 1500,
        currentConnections: 0,
        responseTime: 32,
        lastHealthCheck: new Date().toISOString(),
        capabilities: {
          threatIntelligence: true,
          analytics: true,
          authentication: false,
          websocket: false
        },
        metadata: {
          region: 'us-west-2',
          zone: 'us-west-2a',
          version: '1.0.0',
          deployment: 'production',
          startedAt: new Date().toISOString(),
          lastRestart: new Date().toISOString()
        }
      }
    ];

    mockServers.forEach(server => {
      this.servers.set(server.id, server);
    });
  }

  // Load Balancing Algorithms
  selectServer(): ServerInstance | null {
    const healthyServers = Array.from(this.servers.values())
      .filter(server => server.status === 'healthy');

    if (healthyServers.length === 0) {
      console.warn('No healthy servers available');
      return null;
    }

    switch (this.config.algorithm) {
      case 'round_robin':
        return this.roundRobinSelection(healthyServers);
      case 'least_connections':
        return this.leastConnectionsSelection(healthyServers);
      case 'weighted_round_robin':
        return this.weightedRoundRobinSelection(healthyServers);
      case 'ip_hash':
        return this.ipHashSelection(healthyServers);
      case 'random':
        return this.randomSelection(healthyServers);
      default:
        return this.roundRobinSelection(healthyServers);
    }
  }

  private roundRobinSelection(servers: ServerInstance[]): ServerInstance {
    const server = servers[this.currentIndex % servers.length];
    this.currentIndex++;
    return server;
  }

  private leastConnectionsSelection(servers: ServerInstance[]): ServerInstance {
    return servers.reduce((min, server) => 
      server.currentConnections < min.currentConnections ? server : min
    );
  }

  private weightedRoundRobinSelection(servers: ServerInstance[]): ServerInstance {
    const totalWeight = servers.reduce((sum, server) => sum + server.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const server of servers) {
      random -= server.weight;
      if (random <= 0) {
        return server;
      }
    }
    
    return servers[0];
  }

  private ipHashSelection(servers: ServerInstance[]): ServerInstance {
    // Mock IP-based selection - in production, this would use client IP
    const hash = this.hashString('mock-client-ip');
    const index = Math.abs(hash) % servers.length;
    return servers[index];
  }

  private randomSelection(servers: ServerInstance[]): ServerInstance {
    const index = Math.floor(Math.random() * servers.length);
    return servers[index];
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  // Health Checks
  private startHealthChecks(): void {
    if (!this.config.healthCheck.enabled) {
      return;
    }

    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthChecks();
    }, this.config.healthCheck.interval);
  }

  private async performHealthChecks(): Promise<void> {
    const healthCheckPromises = Array.from(this.servers.values()).map(server =>
      this.checkServerHealth(server)
    );

    try {
      const results = await Promise.allSettled(healthCheckPromises);
      
      results.forEach((result, index) => {
        const server = Array.from(this.servers.values())[index];
        if (result.status === 'fulfilled') {
          this.updateServerHealth(server.id, result.value);
        } else {
          this.updateServerHealth(server.id, {
            status: 'unhealthy',
            error: result.reason?.message || 'Health check failed'
          });
        }
      });
    } catch (error) {
      console.error('Health check batch failed:', error);
    }
  }

  private async checkServerHealth(server: ServerInstance): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.healthCheck.timeout);

      const response = await fetch(`${server.protocol}://${server.host}:${server.port}${this.config.healthCheck.path}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'TrustHire-HealthCheck/1.0'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (response.status === this.config.healthCheck.expectedStatus) {
        return {
          serverId: server.id,
          status: 'healthy',
          responseTime,
          timestamp: new Date().toISOString(),
          metrics: await this.getServerMetrics(server)
        };
      } else {
        return {
          serverId: server.id,
          status: 'degraded',
          responseTime,
          timestamp: new Date().toISOString(),
          metrics: await this.getServerMetrics(server)
        };
      }
    } catch (error) {
      return {
        serverId: server.id,
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error.message,
        timestamp: new Date().toISOString(),
        metrics: {
          cpu: 0,
          memory: 0,
          disk: 0,
          network: 0
        }
      };
    }
  }

  private async getServerMetrics(server: ServerInstance): Promise<any> {
    // Mock metrics - in production, this would fetch actual server metrics
    return {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
      network: Math.random() * 100
    };
  }

  private updateServerHealth(serverId: string, healthResult: Partial<HealthCheckResult>): void {
    const server = this.servers.get(serverId);
    if (!server) return;

    server.status = healthResult.status || 'unhealthy';
    server.responseTime = healthResult.responseTime || 0;
    server.lastHealthCheck = healthResult.timestamp || new Date().toISOString();

    this.servers.set(serverId, server);
  }

  // Metrics Collection
  private startMetricsCollection(): void {
    if (!this.config.monitoring.enabled) {
      return;
    }

    this.metricsInterval = setInterval(() => {
      this.collectMetrics();
    }, this.config.monitoring.metricsInterval);
  }

  private collectMetrics(): void {
    const servers = Array.from(this.servers.values());
    const totalRequests = servers.reduce((sum, server) => sum + server.currentConnections, 0);
    const activeConnections = totalRequests;
    const averageResponseTime = servers.reduce((sum, server) => sum + server.responseTime, 0) / servers.length;
    const errorRate = this.calculateErrorRate(servers);
    const throughput = this.calculateThroughput(servers);

    this.metrics = {
      totalRequests,
      activeConnections,
      averageResponseTime,
      errorRate,
      throughput,
      serverStats: servers.map(server => ({
        serverId: server.id,
        requests: server.currentConnections,
        responseTime: server.responseTime,
        errorRate: server.status === 'unhealthy' ? 100 : 0,
        status: server.status
      })),
      timestamp: new Date().toISOString()
    };

    this.checkAlertThresholds();
  }

  private calculateErrorRate(servers: ServerInstance[]): number {
    const unhealthyServers = servers.filter(server => server.status === 'unhealthy');
    return (unhealthyServers.length / servers.length) * 100;
  }

  private calculateThroughput(servers: ServerInstance[]): number {
    // Mock throughput calculation
    return servers.reduce((sum, server) => sum + server.currentConnections, 0) / servers.length;
  }

  private checkAlertThresholds(): void {
    const thresholds = this.config.monitoring.alertThresholds;

    // Check response time threshold
    if (this.metrics.averageResponseTime > thresholds.responseTime) {
      this.triggerAlert('high_response_time', {
        current: this.metrics.averageResponseTime,
        threshold: thresholds.responseTime,
        servers: this.metrics.serverStats.filter(s => s.responseTime > thresholds.responseTime)
      });
    }

    // Check error rate threshold
    if (this.metrics.errorRate > thresholds.errorRate) {
      this.triggerAlert('high_error_rate', {
        current: this.metrics.errorRate,
        threshold: thresholds.errorRate,
        servers: this.metrics.serverStats.filter(s => s.status === 'unhealthy')
      });
    }

    // Check connection count threshold
    if (this.metrics.activeConnections > thresholds.connectionCount) {
      this.triggerAlert('high_connection_count', {
        current: this.metrics.activeConnections,
        threshold: thresholds.connectionCount,
        servers: this.metrics.serverStats
      });
    }
  }

  private triggerAlert(alertType: string, data: any): void {
    console.warn(`Alert triggered: ${alertType}`, data);
    // In production, this would send alerts to monitoring systems
  }

  // Connection Management
  async handleConnection(clientIp: string, userAgent?: string): Promise<{
    server: ServerInstance | null;
    sessionId: string;
  }> {
    const server = this.selectServer();
    
    if (!server) {
      throw new Error('No healthy servers available');
    }

    // Check server capacity
    if (server.currentConnections >= server.maxConnections) {
      // Try another server
      const alternativeServer = this.selectServer();
      if (!alternativeServer || alternativeServer.currentConnections >= alternativeServer.maxConnections) {
        throw new Error('All servers at capacity');
      }
      server.currentConnections++;
      return {
        server: alternativeServer,
        sessionId: this.generateSessionId()
      };
    }

    server.currentConnections++;
    return {
      server,
      sessionId: this.generateSessionId()
    };
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  releaseConnection(serverId: string): void {
    const server = this.servers.get(serverId);
    if (server && server.currentConnections > 0) {
      server.currentConnections--;
    }
  }

  // Server Management
  addServer(server: Omit<ServerInstance, 'id'>): void {
    const newServer: ServerInstance = {
      ...server,
      id: `server-${Date.now()}`,
      status: 'healthy',
      currentConnections: 0,
      lastHealthCheck: new Date().toISOString()
    };

    this.servers.set(newServer.id, newServer);
  }

  removeServer(serverId: string): void {
    this.servers.delete(serverId);
  }

  updateServer(serverId: string, updates: Partial<ServerInstance>): void {
    const server = this.servers.get(serverId);
    if (server) {
      this.servers.set(serverId, { ...server, ...updates });
    }
  }

  getServer(serverId: string): ServerInstance | null {
    return this.servers.get(serverId) || null;
  }

  getAllServers(): ServerInstance[] {
    return Array.from(this.servers.values());
  }

  getHealthyServers(): ServerInstance[] {
    return Array.from(this.servers.values())
      .filter(server => server.status === 'healthy');
  }

  // Metrics and Monitoring
  getMetrics(): LoadBalancerMetrics {
    return this.metrics;
  }

  getServerMetrics(serverId: string): {
    server: ServerInstance | null;
    metrics: any;
  } {
    const server = this.servers.get(serverId);
    return {
      server,
      metrics: server ? {
        connections: server.currentConnections,
        capacity: server.maxConnections,
        utilization: (server.currentConnections / server.maxConnections) * 100,
        responseTime: server.responseTime,
        status: server.status,
        lastHealthCheck: server.lastHealthCheck
      } : null
    };
  }

  // Failover Management
  async handleFailover(): Promise<void> {
    if (!this.config.failover.enabled) {
      return;
    }

    const unhealthyCount = Array.from(this.servers.values())
      .filter(server => server.status === 'unhealthy').length;
    const totalCount = this.servers.size;
    const unhealthyPercentage = (unhealthyCount / totalCount) * 100;

    if (unhealthyPercentage >= this.config.failover.threshold) {
      console.warn(`Failover triggered: ${unhealthyPercentage}% servers unhealthy`);
      
      // In production, this would trigger failover procedures
      // 1. Redirect traffic to healthy servers
      // 2. Spin up new instances if needed
      // 3. Send alerts to monitoring systems
      await this.triggerFailoverProcedures(unhealthyPercentage);
    }
  }

  private async triggerFailoverProcedures(unhealthyPercentage: number): Promise<void> {
    // Mock failover procedures
    console.log('Executing failover procedures...');
    
    // 1. Update server weights to prioritize healthy servers
    const healthyServers = this.getHealthyServers();
    healthyServers.forEach(server => {
      server.weight = server.weight * 2;
    });

    // 2. Temporarily disable unhealthy servers
    const unhealthyServers = Array.from(this.servers.values())
      .filter(server => server.status === 'unhealthy');
    
    unhealthyServers.forEach(server => {
      server.status = 'maintenance';
    });

    // 3. Schedule recovery procedures
    setTimeout(() => {
      this.recoverUnhealthyServers();
    }, this.config.failover.timeout);
  }

  private recoverUnhealthyServers(): void {
    console.log('Attempting to recover unhealthy servers...');
    
    const maintenanceServers = Array.from(this.servers.values())
      .filter(server => server.status === 'maintenance');
    
    maintenanceServers.forEach(server => {
      server.status = 'healthy';
      server.weight = 1;
    });
  }

  // Cleanup
  destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
    
    this.servers.clear();
    this.currentIndex = 0;
  }
}

// Singleton instance
let clusterManager: ClusterManager | null = null;

export function getClusterManager(): ClusterManager {
  if (!clusterManager) {
    const config: LoadBalancerConfig = {
      algorithm: 'weighted_round_robin',
      healthCheck: {
        enabled: true,
        interval: 30000, // 30 seconds
        timeout: 5000, // 5 seconds
        retries: 3,
        path: '/health',
        expectedStatus: 200
      },
      connection: {
        timeout: 30000, // 30 seconds
        maxRetries: 3,
        retryDelay: 1000 // 1 second
      },
      failover: {
        enabled: true,
        threshold: 50, // 50% of servers
        timeout: 300000 // 5 minutes
      },
      sessionAffinity: {
        enabled: true,
        timeout: 30, // 30 minutes
        cookieName: 'TRUSTHIRE_SESSION'
      },
      ssl: {
        enabled: true,
        certPath: process.env.SSL_CERT_PATH || '/etc/ssl/cert.pem',
        keyPath: process.env.SSL_KEY_PATH || '/etc/ssl/key.pem',
        caPath: process.env.SSL_CA_PATH || '/etc/ssl/ca.pem'
      },
      monitoring: {
        enabled: true,
        metricsInterval: 60000, // 1 minute
        alertThresholds: {
          responseTime: 1000, // 1 second
          errorRate: 10, // 10%
          connectionCount: 800 // 80% of total capacity
        }
      }
    };
    
    clusterManager = new ClusterManager(config);
  }
  return clusterManager;
}
