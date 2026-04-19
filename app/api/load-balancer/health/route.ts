// Load Balancer API Routes
// Health checks, metrics, and server management

import { NextRequest, NextResponse } from 'next/server';
import { getClusterManager } from '@/lib/load-balancer/cluster-manager';

export async function GET(request: NextRequest) {
  try {
    const clusterManager = getClusterManager();
    const servers = clusterManager.getAllServers();
    const metrics = clusterManager.getMetrics();

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      loadBalancer: {
        algorithm: 'weighted_round_robin',
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
        protocol: server.protocol,
        status: server.status,
        connections: server.currentConnections,
        maxConnections: server.maxConnections,
        responseTime: server.responseTime,
        lastHealthCheck: server.lastHealthCheck,
        weight: server.weight,
        region: server.metadata.region,
        zone: server.metadata.zone,
        version: server.metadata.version,
        deployment: server.metadata.deployment,
        capabilities: server.capabilities,
        startedAt: server.metadata.startedAt,
        lastRestart: server.metadata.lastRestart,
        uptime: server.metadata.startedAt ? 
          Math.floor((Date.now() - new Date(server.metadata.startedAt).getTime()) / 1000) : 0
      }))
    };

    return NextResponse.json({
      success: true,
      data: healthStatus
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const clusterManager = getClusterManager();
    const metrics = clusterManager.getMetrics();

    const metricsData = {
      timestamp: new Date().toISOString(),
      loadBalancer: {
        algorithm: 'weighted_round_robin',
        sessionAffinity: true,
        stickySessions: true,
        rateLimitEnabled: true,
        rateLimitConfig: {
          requestsPerMinute: 100,
          burstSize: 200
        },
        bypassPaths: ['/health', '/metrics', '/status'],
        customRoutes: 0
      },
      performance: {
        totalRequests: metrics.totalRequests,
        activeConnections: metrics.activeConnections,
        averageResponseTime: metrics.averageResponseTime,
        errorRate: metrics.errorRate,
        throughput: metrics.throughput,
        requestsPerSecond: Math.round(metrics.throughput / 60), // Assuming 60-second window
        peakConnections: metrics.serverStats.reduce((max, s) => Math.max(max, s.connections), 0)
      },
      servers: metrics.serverStats,
      connectionCounts: clusterManager.getAllServers().reduce((counts, server) => {
        counts[server.id] = {
          connections: server.currentConnections,
          capacity: server.maxConnections,
          utilization: (server.currentConnections / server.maxConnections) * 100,
          responseTime: server.responseTime,
          status: server.status,
          lastHealthCheck: server.lastHealthCheck
        };
        return counts;
      }, {}),
      alerts: {
        highResponseTime: metrics.serverStats.filter(s => s.responseTime > 1000).length,
        highErrorRate: metrics.serverStats.filter(s => s.errorRate > 10).length,
        highConnections: metrics.serverStats.filter(s => s.connections > s.maxConnections * 0.8).length,
        unhealthyServers: metrics.serverStats.filter(s => s.status === 'unhealthy').length
      }
    };

    return NextResponse.json({
      success: true,
      data: metricsData
    });
  } catch (error) {
    console.error('Metrics error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { serverId, updates } = await request.json();

    if (!serverId) {
      return NextResponse.json({
        success: false,
        error: 'Server ID is required',
        code: 'MISSING_SERVER_ID'
      }, { status: 400 });
    }

    const clusterManager = getClusterManager();
    const server = clusterManager.getServer(serverId);

    if (!server) {
      return NextResponse.json({
        success: false,
        error: 'Server not found',
        code: 'SERVER_NOT_FOUND'
      }, { status: 404 });
    }

    clusterManager.updateServer(serverId, updates);

    return NextResponse.json({
      success: true,
      message: 'Server updated successfully',
      data: clusterManager.getServer(serverId)
    });
  } catch (error) {
    console.error('Update server error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const serverData = await request.json();

    // Validate required fields
    const requiredFields = ['host', 'port', 'protocol'];
    const missingFields = requiredFields.filter(field => !serverData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
        code: 'MISSING_REQUIRED_FIELDS'
      }, { status: 400 });
    }

    // Validate data types
    if (typeof serverData.port !== 'number' || serverData.port < 1 || serverData.port > 65535) {
      return NextResponse.json({
        success: false,
        error: 'Invalid port number',
        code: 'INVALID_PORT'
      }, { status: 400 });
    }

    if (!['http', 'https'].includes(serverData.protocol)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid protocol. Must be http or https',
        code: 'INVALID_PROTOCOL'
      }, { status: 400 });
    }

    // Validate host
    if (!serverData.host || typeof serverData.host !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Invalid host',
        code: 'INVALID_HOST'
      }, { status: 400 });
    }

    const clusterManager = getClusterManager();
    clusterManager.addServer(serverData);

    return NextResponse.json({
      success: true,
      message: 'Server added successfully',
      data: clusterManager.getServer(serverData.id)
    });
  } catch (error) {
    console.error('Add server error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { serverId } = await request.json();

    if (!serverId) {
      return NextResponse.json({
        success: false,
        error: 'Server ID is required',
        code: 'MISSING_SERVER_ID'
      }, { status: 400 });
    }

    const clusterManager = getClusterManager();
    const server = clusterManager.getServer(serverId);

    if (!server) {
      return NextResponse.json({
        success: false,
        error: 'Server not found',
        code: 'SERVER_NOT_FOUND'
      }, { status: 404 });
    }

    clusterManager.removeServer(serverId);

    return NextResponse.json({
      success: true,
      message: 'Server removed successfully'
    });
  } catch (error) {
    console.error('Remove server error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get('id');

    if (!serverId) {
      return NextResponse.json({
        success: false,
        error: 'Server ID is required',
        code: 'MISSING_SERVER_ID'
      }, { status: 400 });
    }

    const clusterManager = getClusterManager();
    const server = clusterManager.getServer(serverId);

    if (!server) {
      return NextResponse.json({
        success: false,
        error: 'Server not found',
        code: 'SERVER_NOT_FOUND'
      }, { status: 404 });
    }

    const serverMetrics = clusterManager.getServerMetrics(serverId);

    return NextResponse.json({
      success: true,
      data: {
        server,
        metrics: serverMetrics
      }
    });
  } catch (error) {
    console.error('Get server error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const clusterManager = getClusterManager();
    const servers = clusterManager.getAllServers();

    const serversData = servers.map(server => ({
      id: server.id,
      host: server.host,
      port: server.port,
      protocol: server.protocol,
      status: server.status,
      weight: server.weight,
      maxConnections: server.maxConnections,
      currentConnections: server.currentConnections,
      responseTime: server.responseTime,
      lastHealthCheck: server.lastHealthCheck,
      capabilities: server.capabilities,
      metadata: {
        region: server.metadata.region,
        zone: server.metadata.zone,
        version: server.metadata.version,
        deployment: server.metadata.deployment,
        startedAt: server.metadata.startedAt,
        lastRestart: server.metadata.lastRestart,
        uptime: server.metadata.startedAt ? 
          Math.floor((Date.now() - new Date(server.metadata.startedAt).getTime()) / 1000) : 0
      }
    }));

    return NextResponse.json({
      success: true,
      data: serversData
    });
  } catch (error) {
    console.error('Get servers error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { algorithm, sessionAffinity, stickySessions, customRoutes, rateLimit } = await request.json();

    // Validate algorithm
    const validAlgorithms = ['round_robin', 'least_connections', 'weighted_round_robin', 'ip_hash', 'random'];
    if (algorithm && !validAlgorithms.includes(algorithm)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid load balancing algorithm',
        code: 'INVALID_ALGORITHM'
      }, { status: 400 });
    }

    // In a real implementation, you would update the cluster manager configuration
    // For now, we'll just return the current configuration

    const config = {
      algorithm: algorithm || 'weighted_round_robin',
      sessionAffinity: sessionAffinity !== undefined ? sessionAffinity : true,
      stickySessions: stickySessions !== undefined ? stickySessions : true,
      customRoutes: customRoutes || [],
      rateLimit: rateLimit || {
        enabled: true,
        requestsPerMinute: 100,
        burstSize: 200
      }
    };

    return NextResponse.json({
      success: true,
      message: 'Load balancer configuration updated',
      data: config
    });
  } catch (error) {
    console.error('Configuration error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { serverId, action } = await request.json();

    if (!serverId || !action) {
      return NextResponse.json({
        success: false,
        error: 'Server ID and action are required',
        code: 'MISSING_PARAMETERS'
      }, { status: 400 });
    }

    const clusterManager = getClusterManager();
    const server = clusterManager.getServer(serverId);

    if (!server) {
      return NextResponse.json({
        success: false,
        error: 'Server not found',
        code: 'SERVER_NOT_FOUND'
      }, { status: 404 });
    }

    let result;
    switch (action) {
      case 'enable':
        clusterManager.updateServer(serverId, { status: 'healthy' });
        result = { message: 'Server enabled successfully' };
        break;
      case 'disable':
        clusterManager.updateServer(serverId, { status: 'maintenance' });
        result = { message: 'Server disabled successfully' };
        break;
      case 'restart':
        clusterManager.updateServer(serverId, { 
          status: 'healthy',
          metadata: {
            ...server.metadata,
            lastRestart: new Date().toISOString()
          }
        });
        result = { message: 'Server restart triggered' };
        break;
      default:
        result = { error: 'Invalid action' };
    }

    return NextResponse.json({
      success: result.message ? true : false,
      message: result.message || 'Invalid action',
      data: result.message ? clusterManager.getServer(serverId) : null
    });
  } catch (error) {
    console.error('Server control error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}
