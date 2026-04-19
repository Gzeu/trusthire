// Analytics Dashboard API Route
// Provides comprehensive analytics data for the dashboard

import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '@/lib/database/analytics-service';
import { scanHistoryService } from '@/lib/database/scan-history-service';
import { cacheService } from '@/lib/cache/cache-service';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d';
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    // Calculate date range based on timeRange
    const now = new Date();
    let dateFrom: Date;
    
    switch (timeRange) {
      case '30d':
        dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        dateFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '7d':
      default:
        dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
    }

    // Try to get from cache first
    const cacheKey = `dashboard-metrics-${timeRange}-${userId || 'anonymous'}-${sessionId || 'anonymous'}`;
    const cached = await cacheService.get(cacheKey);
    
    if (cached) {
      return NextResponse.json(cached);
    }

    // Fetch data in parallel
    const [
      dashboardMetrics,
      scanStats,
      analyticsMetrics
    ] = await Promise.all([
      analyticsService.getDashboardMetrics(),
      scanHistoryService.getScanStatistics({
        dateFrom,
        dateTo: now,
        userId: userId || undefined,
        sessionId: sessionId || undefined
      }),
      analyticsService.getMetrics({
        dateFrom,
        dateTo: now,
        userId: userId || undefined,
        sessionId: sessionId || undefined
      })
    ]);

    // Combine and format data
    const response = {
      overview: {
        totalScans: dashboardMetrics.overview.totalScans,
        activeUsers: dashboardMetrics.overview.activeUsers,
        avgScanDuration: dashboardMetrics.overview.avgScanDuration,
        successRate: dashboardMetrics.overview.successRate
      },
      trends: {
        dailyScans: dashboardMetrics.trends.dailyScans,
        scanTypes: dashboardMetrics.trends.scanTypes,
        userGrowth: dashboardMetrics.trends.userGrowth
      },
      performance: dashboardMetrics.performance,
      scanStats: {
        totalScans: scanStats.totalScans,
        completedScans: scanStats.completedScans,
        failedScans: scanStats.failedScans,
        avgScanDuration: scanStats.avgScanDuration,
        scansByType: scanStats.scansByType
      },
      analytics: {
        totalEvents: analyticsMetrics.totalEvents,
        uniqueUsers: analyticsMetrics.uniqueUsers,
        uniqueSessions: analyticsMetrics.uniqueSessions,
        eventsByType: analyticsMetrics.eventsByType,
        topEventTypes: analyticsMetrics.topEventTypes,
        userEngagement: analyticsMetrics.userEngagement
      }
    };

    // Cache for 2 minutes
    await cacheService.set(cacheKey, response, { ttl: 120, tags: ['dashboard', 'analytics'] });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch dashboard analytics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'track_event':
        // Track a custom analytics event
        await analyticsService.trackEvent({
          sessionId: data.sessionId,
          eventType: data.eventType,
          eventData: data.eventData,
          userId: data.userId,
          ipAddress: request.ip,
          userAgent: request.headers.get('user-agent') || undefined,
          referrer: request.headers.get('referer') || undefined
        });

        return NextResponse.json({ success: true, message: 'Event tracked successfully' });

      case 'clear_cache':
        // Clear dashboard cache
        const cacheKey = `dashboard-metrics-${data.timeRange || '7d'}-${data.userId || 'anonymous'}-${data.sessionId || 'anonymous'}`;
        await cacheService.delete(cacheKey);

        return NextResponse.json({ success: true, message: 'Cache cleared successfully' });

      default:
        return NextResponse.json(
          { error: 'Invalid action', message: `Action '${action}' is not supported` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Dashboard analytics POST error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
