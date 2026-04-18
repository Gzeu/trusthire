// TrustHire Monitoring Service
// Analytics, metrics, and performance monitoring

export interface MetricData {
  name: string;
  value: number;
  labels?: Record<string, string>;
  timestamp: number;
}

export interface PerformanceMetrics {
  requestDuration: number;
  responseSize: number;
  statusCode: number;
  endpoint: string;
  userId?: string;
  timestamp: number;
}

export interface SecurityMetrics {
  threatsDetected: number;
  falsePositives: number;
  analysisTime: number;
  patternMatches: Record<string, number>;
  timestamp: number;
}

export interface UserMetrics {
  userId: string;
  sessionDuration: number;
  assessmentsCreated: number;
  scansPerformed: number;
  lastActivity: number;
}

export class MonitoringService {
  private metrics: Map<string, MetricData[]> = new Map();
  private performanceMetrics: PerformanceMetrics[] = [];
  private securityMetrics: SecurityMetrics[] = [];
  private userMetrics: Map<string, UserMetrics> = new Map();

  // Metrics collection
  recordMetric(name: string, value: number, labels?: Record<string, string>): void {
    const metric: MetricData = {
      name,
      value,
      labels,
      timestamp: Date.now(),
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const metricArray = this.metrics.get(name)!;
    metricArray.push(metric);

    // Keep only last 1000 metrics per type
    if (metricArray.length > 1000) {
      metricArray.shift();
    }
  }

  recordPerformance(data: Omit<PerformanceMetrics, 'timestamp'>): void {
    const metric: PerformanceMetrics = {
      ...data,
      timestamp: Date.now(),
    };

    this.performanceMetrics.push(metric);

    // Keep only last 5000 performance metrics
    if (this.performanceMetrics.length > 5000) {
      this.performanceMetrics.shift();
    }

    // Record specific metrics
    this.recordMetric('request_duration', data.requestDuration, {
      endpoint: data.endpoint,
      status_code: data.statusCode.toString(),
    });

    this.recordMetric('response_size', data.responseSize, {
      endpoint: data.endpoint,
    });
  }

  recordSecurity(data: Omit<SecurityMetrics, 'timestamp'>): void {
    const metric: SecurityMetrics = {
      ...data,
      timestamp: Date.now(),
    };

    this.securityMetrics.push(metric);

    // Keep only last 1000 security metrics
    if (this.securityMetrics.length > 1000) {
      this.securityMetrics.shift();
    }

    // Record specific metrics
    this.recordMetric('threats_detected', data.threatsDetected);
    this.recordMetric('false_positives', data.falsePositives);
    this.recordMetric('analysis_time', data.analysisTime);

    // Record pattern matches
    Object.entries(data.patternMatches).forEach(([pattern, count]) => {
      this.recordMetric('pattern_matches', count, { pattern });
    });
  }

  recordUserActivity(userId: string, activity: Partial<UserMetrics>): void {
    const existing = this.userMetrics.get(userId) || {
      userId,
      sessionDuration: 0,
      assessmentsCreated: 0,
      scansPerformed: 0,
      lastActivity: Date.now(),
    };

    const updated: UserMetrics = {
      ...existing,
      ...activity,
      lastActivity: Date.now(),
    };

    this.userMetrics.set(userId, updated);

    // Record specific metrics
    this.recordMetric('assessments_created', updated.assessmentsCreated, {
      user_id: userId,
    });

    this.recordMetric('scans_performed', updated.scansPerformed, {
      user_id: userId,
    });
  }

  // Metrics retrieval
  getMetrics(name: string, timeRange?: number): MetricData[] {
    const metrics = this.metrics.get(name) || [];
    
    if (!timeRange) {
      return metrics;
    }

    const cutoff = Date.now() - timeRange;
    return metrics.filter(metric => metric.timestamp >= cutoff);
  }

  getPerformanceMetrics(timeRange?: number): PerformanceMetrics[] {
    if (!timeRange) {
      return this.performanceMetrics;
    }

    const cutoff = Date.now() - timeRange;
    return this.performanceMetrics.filter(metric => metric.timestamp >= cutoff);
  }

  getSecurityMetrics(timeRange?: number): SecurityMetrics[] {
    if (!timeRange) {
      return this.securityMetrics;
    }

    const cutoff = Date.now() - timeRange;
    return this.securityMetrics.filter(metric => metric.timestamp >= cutoff);
  }

  getUserMetrics(userId: string): UserMetrics | undefined {
    return this.userMetrics.get(userId);
  }

  getAllUserMetrics(): UserMetrics[] {
    return Array.from(this.userMetrics.values());
  }

  // Analytics and aggregations
  getAverageResponseTime(endpoint?: string, timeRange?: number): number {
    const metrics = this.getPerformanceMetrics(timeRange);
    const filtered = endpoint ? metrics.filter(m => m.endpoint === endpoint) : metrics;
    
    if (filtered.length === 0) return 0;
    
    const total = filtered.reduce((sum, m) => sum + m.requestDuration, 0);
    return total / filtered.length;
  }

  getSuccessRate(endpoint?: string, timeRange?: number): number {
    const metrics = this.getPerformanceMetrics(timeRange);
    const filtered = endpoint ? metrics.filter(m => m.endpoint === endpoint) : metrics;
    
    if (filtered.length === 0) return 0;
    
    const successful = filtered.filter(m => m.statusCode >= 200 && m.statusCode < 400).length;
    return (successful / filtered.length) * 100;
  }

  getTopEndpoints(timeRange?: number): Array<{ endpoint: string; count: number; avgResponseTime: number }> {
    const metrics = this.getPerformanceMetrics(timeRange);
    const endpointStats = new Map<string, { count: number; totalTime: number }>();

    metrics.forEach(metric => {
      const existing = endpointStats.get(metric.endpoint) || { count: 0, totalTime: 0 };
      endpointStats.set(metric.endpoint, {
        count: existing.count + 1,
        totalTime: existing.totalTime + metric.requestDuration,
      });
    });

    return Array.from(endpointStats.entries())
      .map(([endpoint, stats]) => ({
        endpoint,
        count: stats.count,
        avgResponseTime: stats.totalTime / stats.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  getThreatDetectionRate(timeRange?: number): number {
    const metrics = this.getSecurityMetrics(timeRange);
    
    if (metrics.length === 0) return 0;
    
    const totalThreats = metrics.reduce((sum, m) => sum + m.threatsDetected, 0);
    const totalAssessments = metrics.length;
    
    return totalAssessments > 0 ? (totalThreats / totalAssessments) * 100 : 0;
  }

  getFalsePositiveRate(timeRange?: number): number {
    const metrics = this.getSecurityMetrics(timeRange);
    
    if (metrics.length === 0) return 0;
    
    const totalThreats = metrics.reduce((sum, m) => sum + m.threatsDetected, 0);
    const totalFalsePositives = metrics.reduce((sum, m) => sum + m.falsePositives, 0);
    
    return totalThreats > 0 ? (totalFalsePositives / totalThreats) * 100 : 0;
  }

  // Health checks
  getSystemHealth(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    metrics: {
      avgResponseTime: number;
      successRate: number;
      activeUsers: number;
      threatDetectionRate: number;
    };
  } {
    const avgResponseTime = this.getAverageResponseTime(undefined, 300000); // Last 5 minutes
    const successRate = this.getSuccessRate(undefined, 300000);
    const activeUsers = this.getAllUserMetrics().filter(u => Date.now() - u.lastActivity < 300000).length;
    const threatDetectionRate = this.getThreatDetectionRate(300000);

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    if (avgResponseTime > 5000 || successRate < 95) {
      status = 'degraded';
    }

    if (avgResponseTime > 10000 || successRate < 90) {
      status = 'unhealthy';
    }

    return {
      status,
      metrics: {
        avgResponseTime,
        successRate,
        activeUsers,
        threatDetectionRate,
      },
    };
  }

  // Export metrics for Prometheus
  getPrometheusMetrics(): string {
    const lines: string[] = [];

    // Request duration metrics
    const durationMetrics = this.getMetrics('request_duration');
    const durationByEndpoint = new Map<string, number[]>();

    durationMetrics.forEach(metric => {
      const endpoint = metric.labels?.endpoint || 'unknown';
      if (!durationByEndpoint.has(endpoint)) {
        durationByEndpoint.set(endpoint, []);
      }
      durationByEndpoint.get(endpoint)!.push(metric.value);
    });

    lines.push('# HELP trusthire_request_duration_seconds Request duration in seconds');
    lines.push('# TYPE trusthire_request_duration_seconds histogram');

    durationByEndpoint.forEach((durations, endpoint) => {
      const avg = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      lines.push(`trusthire_request_duration_seconds{endpoint="${endpoint}"} ${avg}`);
    });

    // Success rate metrics
    const successRate = this.getSuccessRate();
    lines.push('# HELP trusthire_success_rate Percentage of successful requests');
    lines.push('# TYPE trusthire_success_rate gauge');
    lines.push(`trusthire_success_rate ${successRate}`);

    // Threat detection metrics
    const threatRate = this.getThreatDetectionRate();
    lines.push('# HELP trusthire_threat_detection_rate Percentage of assessments with threats detected');
    lines.push('# TYPE trusthire_threat_detection_rate gauge');
    lines.push(`trusthire_threat_detection_rate ${threatRate}`);

    return lines.join('\n');
  }

  // Cleanup old metrics
  cleanup(): void {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago

    // Clean up performance metrics
    this.performanceMetrics = this.performanceMetrics.filter(m => m.timestamp >= cutoff);

    // Clean up security metrics
    this.securityMetrics = this.securityMetrics.filter(m => m.timestamp >= cutoff);

    // Clean up other metrics
    this.metrics.forEach((metrics, name) => {
      const filtered = metrics.filter(m => m.timestamp >= cutoff);
      this.metrics.set(name, filtered);
    });

    // Clean up inactive user metrics
    const activeUsers = Array.from(this.userMetrics.entries())
      .filter(([_, metrics]) => metrics.lastActivity >= cutoff);
    
    this.userMetrics = new Map(activeUsers);
  }
}

// Singleton instance
export const monitoringService = new MonitoringService();

// React hook for using monitoring service
export function useMonitoringService() {
  return monitoringService;
}

export default monitoringService;
