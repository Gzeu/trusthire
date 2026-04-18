// Health check API endpoint
// Provides comprehensive health status for monitoring

import { NextRequest, NextResponse } from 'next/server';
import { monitoringService } from '@/lib/monitoring-service';
import { cacheService } from '@/lib/cache-service';

export async function GET(request: NextRequest) {
  try {
    const systemHealth = monitoringService.getSystemHealth();
    const cacheHealth = await cacheService.healthCheck();

    // Check external services
    const externalChecks = await checkExternalServices();

    const health = {
      status: systemHealth.status,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        api: {
          status: systemHealth.status,
          responseTime: systemHealth.metrics.avgResponseTime,
          successRate: systemHealth.metrics.successRate,
        },
        cache: {
          status: cacheHealth.status,
          latency: cacheHealth.latency,
        },
        database: {
          status: externalChecks.database ? 'healthy' : 'unhealthy',
          latency: externalChecks.databaseLatency,
        },
        externalApis: externalChecks.apis,
      },
      metrics: systemHealth.metrics,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };

    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503;

    return NextResponse.json(health, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 503 }
    );
  }
}

async function checkExternalServices() {
  const checks = {
    database: false,
    databaseLatency: 0,
    apis: {} as Record<string, { status: 'healthy' | 'unhealthy'; latency: number }>,
  };

  // Check database connectivity
  try {
    const dbStart = Date.now();
    // This would be a simple database ping
    // For now, we'll simulate it
    checks.database = true;
    checks.databaseLatency = Date.now() - dbStart;
  } catch (error) {
    const dbStart = Date.now();
    checks.database = false;
    checks.databaseLatency = Date.now() - dbStart;
  }

  // Check external APIs
  const apiEndpoints = [
    { name: 'groq', url: 'https://api.groq.com' },
    { name: 'virustotal', url: 'https://www.virustotal.com' },
    { name: 'github', url: 'https://api.github.com' },
  ];

  for (const api of apiEndpoints) {
    try {
      const start = Date.now();
      const response = await fetch(api.url, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      checks.apis[api.name] = {
        status: response.ok ? 'healthy' : 'unhealthy',
        latency: Date.now() - start,
      };
    } catch (error) {
      checks.apis[api.name] = {
        status: 'unhealthy',
        latency: 5000, // Timeout
      };
    }
  }

  return checks;
}
