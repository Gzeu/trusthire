// Autonomous System Health Check API Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { autonomousOrchestrator } from '@/lib/autonomous/autonomous-orchestrator';

export async function GET(request: NextRequest) {
  try {
    const health = await autonomousOrchestator.healthCheck();
    
    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      system: {
        status: health.status,
        autonomyLevel: health.autonomyLevel,
        uptime: health.uptime,
        lastActivity: health.lastActivity
      },
      services: {
        total: health.services,
        healthy: health.services.filter(s => s.status === 'healthy').length,
        warning: health.services.filter(s => s.status === 'warning').length,
        critical: health.services.filter(s => s.status === 'critical').length,
        disabled: health.services.filter(s => s.status === 'disabled').length
      },
      performance: {
        overall: health.performance,
        decisionMaking: health.performance,
        responseTime: health.responseTime,
        accuracy: health.accuracy,
        efficiency: health.efficiency,
        reliability: health.reliability,
        learning: health.learning
      },
      health: {
        status: health.health,
        score: health.health,
        issues: health.issues.length,
        recommendations: health.recommendations.length
      },
      metrics: {
        uptime: health.uptime,
        errorRate: health.errors.length
      }
    });
  } catch (error) {
    console.error('Autonomous health check failed:', error);
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      details: {
        message: 'Autonomous system health check failed',
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}
