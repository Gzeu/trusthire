// Metrics API endpoint
// Provides Prometheus-compatible metrics for monitoring

import { NextRequest, NextResponse } from 'next/server';
import { monitoringService } from '@/lib/monitoring-service';

export async function GET(request: NextRequest) {
  try {
    // Get Prometheus metrics
    const prometheusMetrics = monitoringService.getPrometheusMetrics();
    
    // Get system health
    const health = monitoringService.getSystemHealth();
    
    // Add health metrics
    const healthMetrics = [
      `# HELP trusthire_system_health System health status (1=healthy, 0.5=degraded, 0=unhealthy)`,
      '# TYPE trusthire_system_health gauge',
      `trusthire_system_health ${health.status === 'healthy' ? 1 : health.status === 'degraded' ? 0.5 : 0}`,
      '',
      `# HELP trusthire_avg_response_time_seconds Average response time in seconds`,
      '# TYPE trusthire_avg_response_time_seconds gauge',
      `trusthire_avg_response_time_seconds ${health.metrics.avgResponseTime / 1000}`,
      '',
      `# HELP trusthire_success_rate_percentage Success rate percentage`,
      '# TYPE trusthire_success_rate_percentage gauge',
      `trusthire_success_rate_percentage ${health.metrics.successRate}`,
      '',
      `# HELP trusthire_active_users Current active users`,
      '# TYPE trusthire_active_users gauge',
      `trusthire_active_users ${health.metrics.activeUsers}`,
      '',
      `# HELP trusthire_threat_detection_rate_percentage Threat detection rate percentage`,
      '# TYPE trusthire_threat_detection_rate_percentage gauge',
      `trusthire_threat_detection_rate_percentage ${health.metrics.threatDetectionRate}`,
    ];

    const allMetrics = prometheusMetrics + '\n' + healthMetrics.join('\n');

    return new NextResponse(allMetrics, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Metrics endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to generate metrics' },
      { status: 500 }
    );
  }
}
