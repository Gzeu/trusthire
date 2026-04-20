import { NextRequest, NextResponse } from 'next/server';
import { getHealthStatus } from '@/lib/monitoring/health-check';

export async function GET(req: NextRequest) {
  try {
    const health = await getHealthStatus();
    
    const statusCode = health.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json(health, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      uptime: 0,
      memory: { used: 0, total: 0, percentage: 0 },
      apis: { collect: false, validate: false, analytics: false, export: false },
      database: { connected: false, records: 0 }
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}
