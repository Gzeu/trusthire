import { NextRequest, NextResponse } from 'next/server';

interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  apis: {
    collect: boolean;
    validate: boolean;
    analytics: boolean;
    export: boolean;
  };
  database: {
    connected: boolean;
    records: number;
  };
}

const startTime = Date.now();

export function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    used: Math.round(usage.heapUsed / 1024 / 1024), // MB
    total: Math.round(usage.heapTotal / 1024 / 1024), // MB
    percentage: Math.round((usage.heapUsed / usage.heapTotal) * 100)
  };
}

export async function checkAPIHealth(): Promise<{ collect: boolean; validate: boolean; analytics: boolean; export: boolean }> {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://trusthire.vercel.app' 
    : 'http://localhost:3000';
  
  const apis = ['collect', 'validate', 'analytics', 'export'];
  const results: { collect: boolean; validate: boolean; analytics: boolean; export: boolean } = {
    collect: false,
    validate: false,
    analytics: false,
    export: false
  };
  
  for (const api of apis) {
    try {
      const response = await fetch(`${baseUrl}/api/data/${api}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (api === 'collect') results.collect = response.ok;
      else if (api === 'validate') results.validate = response.ok;
      else if (api === 'analytics') results.analytics = response.ok;
      else if (api === 'export') results.export = response.ok;
    } catch (error) {
      if (api === 'collect') results.collect = false;
      else if (api === 'validate') results.validate = false;
      else if (api === 'analytics') results.analytics = false;
      else if (api === 'export') results.export = false;
    }
  }
  
  return results;
}

export function getDatabaseStats() {
  // In production, this would check actual database connection
  // For now, return mock stats
  return {
    connected: true,
    records: 0 // Would be actual count from database
  };
}

export async function getHealthStatus(): Promise<HealthCheck> {
  const memory = getMemoryUsage();
  const apis = await checkAPIHealth();
  const database = getDatabaseStats();
  
  const allAPIsHealthy = Object.values(apis).every(status => status);
  const isHealthy = allAPIsHealthy && database.connected && memory.percentage < 90;
  
  return {
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: Date.now() - startTime,
    memory,
    apis,
    database
  };
}

export async function GET(req: NextRequest) {
  try {
    const health = await getHealthStatus();
    
    const statusCode = health.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json(health, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}
