import { NextRequest } from 'next/server';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  tags?: Record<string, string>;
}

interface RequestMetrics {
  requestId: string;
  method: string;
  url: string;
  userAgent?: string;
  ip: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  statusCode?: number;
  error?: string;
  memoryUsage?: NodeJS.MemoryUsage;
  cpuUsage?: NodeJS.CpuUsage;
}

interface DatabaseMetrics {
  operation: string;
  table: string;
  duration: number;
  rowCount?: number;
  success: boolean;
  error?: string;
}

interface CacheMetrics {
  operation: 'hit' | 'miss' | 'set' | 'delete';
  key: string;
  duration?: number;
  size?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private requests: Map<string, RequestMetrics> = new Map();
  private maxMetrics: number = 10000; // Keep last 10k metrics

  // Request tracking
  startRequest(requestId: string, req: NextRequest): void {
    const url = new URL(req.url);
    
    this.requests.set(requestId, {
      requestId,
      method: req.method,
      url: url.pathname + url.search,
      userAgent: req.headers.get('user-agent') || undefined,
      ip: req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
          req.headers.get('x-real-ip') || 'unknown',
      startTime: Date.now(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
    });
  }

  endRequest(requestId: string, statusCode: number, error?: string): void {
    const request = this.requests.get(requestId);
    if (!request) return;

    const endTime = Date.now();
    const duration = endTime - request.startTime;
    const finalMemoryUsage = process.memoryUsage();
    const finalCpuUsage = process.cpuUsage(request.cpuUsage);

    // Update request with completion data
    request.endTime = endTime;
    request.duration = duration;
    request.statusCode = statusCode;
    request.error = error;

    // Record performance metrics
    this.recordMetric('request_duration', duration, 'ms', {
      method: request.method,
      status_code: statusCode.toString(),
      status_class: statusCode < 400 ? 'success' : statusCode < 500 ? 'client_error' : 'server_error',
    });

    this.recordMetric('memory_usage', finalMemoryUsage.heapUsed, 'bytes', {
      type: 'heap',
    });

    this.recordMetric('cpu_usage', finalCpuUsage.user + finalCpuUsage.system, 'microseconds', {
      type: 'total',
    });

    // Clean up request tracking
    this.requests.delete(requestId);
  }

  // Database operation tracking
  recordDatabaseOperation(metrics: DatabaseMetrics): void {
    this.recordMetric('db_operation_duration', metrics.duration, 'ms', {
      operation: metrics.operation,
      table: metrics.table,
      success: metrics.success.toString(),
    });

    if (metrics.rowCount !== undefined) {
      this.recordMetric('db_rows_affected', metrics.rowCount, 'count', {
        operation: metrics.operation,
        table: metrics.table,
      });
    }
  }

  // Cache operation tracking
  recordCacheOperation(metrics: CacheMetrics): void {
    this.recordMetric('cache_operation', 1, 'count', {
      operation: metrics.operation,
    });

    if (metrics.duration) {
      this.recordMetric('cache_duration', metrics.duration, 'ms', {
        operation: metrics.operation,
      });
    }

    if (metrics.size) {
      this.recordMetric('cache_size', metrics.size, 'bytes', {
        operation: metrics.operation,
      });
    }
  }

  // Custom metric recording
  recordMetric(name: string, value: number, unit: string, tags?: Record<string, string>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      tags,
    };

    this.metrics.push(metric);

    // Keep metrics array from growing too large
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  // Get metrics for analysis
  getMetrics(filter?: {
    name?: string;
    since?: number;
    tags?: Record<string, string>;
  }): PerformanceMetric[] {
    let filtered = this.metrics;

    if (filter?.name) {
      filtered = filtered.filter(m => m.name === filter.name);
    }

    if (filter?.since) {
      filtered = filtered.filter(m => m.timestamp >= filter.since!);
    }

    if (filter?.tags) {
      filtered = filtered.filter(m => {
        if (!m.tags) return false;
        return Object.entries(filter.tags!).every(([key, value]) => m.tags![key] === value);
      });
    }

    return filtered;
  }

  // Get aggregated statistics
  getAggregatedMetrics(name: string, timeWindow?: number): {
    count: number;
    min: number;
    max: number;
    avg: number;
    p50: number;
    p95: number;
    p99: number;
  } {
    const since = timeWindow ? Date.now() - timeWindow : undefined;
    const metrics = this.getMetrics({ name, since });
    
    if (metrics.length === 0) {
      return { count: 0, min: 0, max: 0, avg: 0, p50: 0, p95: 0, p99: 0 };
    }

    const values = metrics.map(m => m.value).sort((a, b) => a - b);
    const count = values.length;
    const min = values[0];
    const max = values[count - 1];
    const avg = values.reduce((sum, val) => sum + val, 0) / count;

    const p50Index = Math.floor(count * 0.5);
    const p95Index = Math.floor(count * 0.95);
    const p99Index = Math.floor(count * 0.99);

    return {
      count,
      min,
      max,
      avg,
      p50: values[p50Index],
      p95: values[p95Index],
      p99: values[p99Index],
    };
  }

  // Get system health metrics
  getSystemHealth(): {
    memory: NodeJS.MemoryUsage;
    cpu: NodeJS.CpuUsage;
    uptime: number;
    activeRequests: number;
    errorRate: number;
    avgResponseTime: number;
  } {
    const memory = process.memoryUsage();
    const cpu = process.cpuUsage();
    const uptime = process.uptime();

    // Calculate error rate from recent requests
    const recentMetrics = this.getMetrics({ 
      name: 'request_duration',
      since: Date.now() - 5 * 60 * 1000 // Last 5 minutes
    });
    
    const totalRequests = recentMetrics.length;
    const errorRequests = this.getMetrics({ 
      since: Date.now() - 5 * 60 * 1000,
      tags: { status_class: 'client_error' }
    }).length + this.getMetrics({ 
      since: Date.now() - 5 * 60 * 1000,
      tags: { status_class: 'server_error' }
    }).length;

    const errorRate = totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0;
    
    const responseTimeStats = this.getAggregatedMetrics('request_duration', 5 * 60 * 1000);

    return {
      memory,
      cpu,
      uptime,
      activeRequests: this.requests.size,
      errorRate,
      avgResponseTime: responseTimeStats.avg,
    };
  }

  // Export metrics for monitoring systems
  exportMetrics(format: 'prometheus' | 'json' = 'json'): string {
    if (format === 'prometheus') {
      return this.exportPrometheusFormat();
    }
    
    return JSON.stringify({
      timestamp: Date.now(),
      metrics: this.metrics,
      systemHealth: this.getSystemHealth(),
    }, null, 2);
  }

  private exportPrometheusFormat(): string {
    const lines: string[] = [];
    const metricGroups = new Map<string, PerformanceMetric[]>();

    // Group metrics by name
    this.metrics.forEach(metric => {
      if (!metricGroups.has(metric.name)) {
        metricGroups.set(metric.name, []);
      }
      metricGroups.get(metric.name)!.push(metric);
    });

    // Convert to Prometheus format
    for (const [name, metrics] of Array.from(metricGroups.entries())) {
      const latestMetric = metrics[metrics.length - 1];
      const tags = latestMetric.tags ? 
        Object.entries(latestMetric.tags).map(([k, v]) => `${k}="${v}"`).join(',') : '';
      
      const tagName = tags ? `{${tags}}` : '';
      lines.push(`trusthire_${name}${tagName} ${latestMetric.value} ${latestMetric.timestamp}`);
    }

    // Add system health metrics
    const health = this.getSystemHealth();
    lines.push(`trusthire_memory_usage_bytes{type="heap"} ${health.memory.heapUsed} ${Date.now()}`);
    lines.push(`trusthire_active_requests ${health.activeRequests} ${Date.now()}`);
    lines.push(`trusthire_error_rate_percent ${health.errorRate} ${Date.now()}`);
    lines.push(`trusthire_avg_response_time_ms ${health.avgResponseTime} ${Date.now()}`);

    return lines.join('\n');
  }

  // Clear old metrics
  cleanup(maxAge: number = 24 * 60 * 60 * 1000): void { // 24 hours default
    const cutoff = Date.now() - maxAge;
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
  }

  // Reset all metrics
  reset(): void {
    this.metrics = [];
    this.requests.clear();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Helper functions for common operations
export function trackDatabaseOperation<T>(
  operation: string,
  table: string,
  fn: () => Promise<T>
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const startTime = Date.now();
    
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      
      performanceMonitor.recordDatabaseOperation({
        operation,
        table,
        duration,
        success: true,
      });
      
      resolve(result);
    } catch (error) {
      const duration = Date.now() - startTime;
      
      performanceMonitor.recordDatabaseOperation({
        operation,
        table,
        duration,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      reject(error);
    }
  });
}

export function trackCacheOperation<T>(
  operation: 'hit' | 'miss' | 'set' | 'delete',
  key: string,
  fn: () => Promise<T> | T
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const startTime = Date.now();
    
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      
      performanceMonitor.recordCacheOperation({
        operation,
        key,
        duration,
        size: result ? JSON.stringify(result).length : undefined,
      });
      
      resolve(result);
    } catch (error) {
      const duration = Date.now() - startTime;
      
      performanceMonitor.recordCacheOperation({
        operation,
        key,
        duration,
      });
      
      reject(error);
    }
  });
}

// Middleware helper
export function withPerformanceTracking(
  handler: (req: NextRequest) => Promise<Response>,
  requestId?: string
) {
  return async (req: NextRequest): Promise<Response> => {
    const reqId = requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Start tracking
    performanceMonitor.startRequest(reqId, req);
    
    try {
      const response = await handler(req);
      
      // End tracking with success
      performanceMonitor.endRequest(reqId, response.status);
      
      // Add performance headers
      if (response instanceof Response) {
        const requestData = performanceMonitor['requests'].get(reqId);
        if (requestData) {
          response.headers.set('X-Request-ID', reqId);
          response.headers.set('X-Response-Time', `${Date.now() - requestData.startTime}ms`);
        }
      }
      
      return response;
    } catch (error) {
      // End tracking with error
      performanceMonitor.endRequest(reqId, 500, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  };
}

// Cleanup old metrics periodically
setInterval(() => {
  performanceMonitor.cleanup();
}, 60 * 60 * 1000); // Every hour

export { PerformanceMonitor };
