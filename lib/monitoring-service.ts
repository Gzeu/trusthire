// Monitoring service for TrustHire Autonomous System
export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: number;
  timestamp: string;
}

export interface HealthCheck {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  lastCheck: string;
  error?: string;
}

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  service: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
}

export class MonitoringService {
  private metrics: SystemMetrics[] = [];
  private healthChecks = new Map<string, HealthCheck>();
  private alerts = new Map<string, Alert>();
  private alertThresholds = {
    cpu: 80,
    memory: 85,
    disk: 90,
    responseTime: 5000
  };

  constructor() {
    // Start monitoring
    this.startMonitoring();
    // Clean up old data periodically
    setInterval(() => this.cleanupOldData(), 300000); // Every 5 minutes
  }

  private startMonitoring(): void {
    setInterval(async () => {
      await this.collectMetrics();
      await this.performHealthChecks();
    }, 30000); // Every 30 seconds
  }

  private async collectMetrics(): Promise<void> {
    const metrics: SystemMetrics = {
      cpu: this.getCpuUsage(),
      memory: this.getMemoryUsage(),
      disk: this.getDiskUsage(),
      network: this.getNetworkUsage(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };

    this.metrics.push(metrics);
    
    // Keep only last 1000 entries
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Check for alerts
    this.checkAlerts(metrics);
  }

  private async performHealthChecks(): Promise<void> {
    const services = ['database', 'redis', 'api', 'autonomous-system'];
    
    for (const service of services) {
      const healthCheck = await this.checkServiceHealth(service);
      this.healthChecks.set(service, healthCheck);
    }
  }

  private async checkServiceHealth(service: string): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Mock health check - in production, this would actually ping the service
      const responseTime = Math.random() * 1000;
      const isHealthy = responseTime < this.alertThresholds.responseTime;

      return {
        service,
        status: isHealthy ? 'healthy' : Math.random() > 0.8 ? 'degraded' : 'unhealthy',
        responseTime,
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      return {
        service,
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastCheck: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private checkAlerts(metrics: SystemMetrics): void {
    if (metrics.cpu > this.alertThresholds.cpu) {
      this.createAlert({
        type: 'warning',
        service: 'system',
        message: `CPU usage is ${metrics.cpu.toFixed(1)}%`,
        severity: metrics.cpu > 95 ? 'critical' : 'high'
      });
    }

    if (metrics.memory > this.alertThresholds.memory) {
      this.createAlert({
        type: 'warning',
        service: 'system',
        message: `Memory usage is ${metrics.memory.toFixed(1)}%`,
        severity: metrics.memory > 95 ? 'critical' : 'high'
      });
    }

    if (metrics.disk > this.alertThresholds.disk) {
      this.createAlert({
        type: 'error',
        service: 'system',
        message: `Disk usage is ${metrics.disk.toFixed(1)}%`,
        severity: 'critical'
      });
    }
  }

  private createAlert(alertData: Omit<Alert, 'id' | 'timestamp' | 'resolved'>): void {
    const alert: Alert = {
      ...alertData,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      resolved: false
    };

    this.alerts.set(alert.id, alert);
  }

  getMetrics(limit: number = 100): SystemMetrics[] {
    return this.metrics.slice(-limit);
  }

  getHealthChecks(): HealthCheck[] {
    return Array.from(this.healthChecks.values());
  }

  getAlerts(resolved?: boolean): Alert[] {
    const alerts = Array.from(this.alerts.values());
    return alerts.filter(alert => resolved === undefined || alert.resolved === resolved);
  }

  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (!alert) return false;

    alert.resolved = true;
    alert.resolvedAt = new Date().toISOString();
    this.alerts.set(alertId, alert);
    return true;
  }

  getSystemStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    uptime: number;
    activeAlerts: number;
    healthScore: number;
  } {
    const healthChecks = this.getHealthChecks();
    const activeAlerts = this.getAlerts(false);
    const latestMetrics = this.getMetrics(1)[0];

    const unhealthyServices = healthChecks.filter(hc => hc.status === 'unhealthy').length;
    const degradedServices = healthChecks.filter(hc => hc.status === 'degraded').length;
    const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical').length;

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (unhealthyServices > 0 || criticalAlerts > 0) {
      status = 'unhealthy';
    } else if (degradedServices > 0 || activeAlerts.length > 0) {
      status = 'degraded';
    }

    const healthScore = Math.max(0, 100 - (unhealthyServices * 40) - (degradedServices * 20) - (activeAlerts.length * 10));

    return {
      status,
      uptime: latestMetrics?.uptime || 0,
      activeAlerts: activeAlerts.length,
      healthScore
    };
  }

  private cleanupOldData(): void {
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
    
    // Clean up old metrics
    this.metrics = this.metrics.filter(m => new Date(m.timestamp).getTime() > cutoffTime);
    
    // Clean up old resolved alerts
    const alertEntries = Array.from(this.alerts.entries());
    for (const [id, alert] of alertEntries) {
      if (alert.resolved && alert.resolvedAt && new Date(alert.resolvedAt).getTime() < cutoffTime) {
        this.alerts.delete(id);
      }
    }
  }

  private generateId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Mock methods for getting system metrics
  private getCpuUsage(): number {
    return Math.random() * 100;
  }

  private getMemoryUsage(): number {
    return Math.random() * 100;
  }

  private getDiskUsage(): number {
    return Math.random() * 100;
  }

  private getNetworkUsage(): number {
    return Math.random() * 100;
  }
}

export const monitoringService = new MonitoringService();
