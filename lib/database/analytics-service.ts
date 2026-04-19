// Analytics Service
// Handles user analytics tracking and metrics collection

import { PrismaClient } from '@prisma/client';
import { getRedisClient } from '@/lib/redis-wrapper';

export interface AnalyticsEvent {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  sessionId: string;
  eventDate: string;
  eventType: string;
  eventData: string; // JSON
  metadata?: string; // JSON
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

export interface CreateAnalyticsEventRequest {
  userId?: string;
  sessionId: string;
  eventType: string;
  eventData?: any;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

export interface AnalyticsFilter {
  userId?: string;
  sessionId?: string;
  eventType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
  orderBy?: 'eventDate' | 'createdAt';
  orderDirection?: 'asc' | 'desc';
}

export interface AnalyticsMetrics {
  totalEvents: number;
  uniqueUsers: number;
  uniqueSessions: number;
  eventsByType: Record<string, number>;
  eventsByHour: Record<string, number>;
  topEventTypes: Array<{ eventType: string; count: number }>;
  recentEvents: AnalyticsEvent[];
  userEngagement: {
    avgEventsPerSession: number;
    sessionDuration: number;
    bounceRate: number;
  };
}

export interface DashboardMetrics {
  overview: {
    totalScans: number;
    activeUsers: number;
    avgScanDuration: number;
    successRate: number;
  };
  trends: {
    dailyScans: Array<{ date: string; count: number }>;
    scanTypes: Array<{ type: string; count: number }>;
    userGrowth: Array<{ date: string; users: number }>;
  };
  performance: {
    apiResponseTime: number;
    cacheHitRate: number;
    errorRate: number;
    systemHealth: 'healthy' | 'warning' | 'critical';
  };
}

class AnalyticsService {
  private prisma: PrismaClient;
  private redis: any;
  private cacheTimeout = 300; // 5 minutes

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = getRedisClient();
  }

  // Track an analytics event
  async trackEvent(request: CreateAnalyticsEventRequest): Promise<AnalyticsEvent> {
    try {
      const event = await this.prisma.userAnalytics.create({
        data: {
          userId: request.userId,
          sessionId: request.sessionId,
          eventType: request.eventType,
          eventData: JSON.stringify(request.eventData || {}),
          metadata: request.metadata ? JSON.stringify(request.metadata) : undefined,
          ipAddress: request.ipAddress,
          userAgent: request.userAgent,
          referrer: request.referrer
        }
      });

      // Cache recent events
      await this.cacheRecentEvent(event);

      // Update metrics
      await this.updateEventMetrics(request.eventType);

      return this.formatAnalyticsEvent(event);
    } catch (error) {
      console.error('Failed to track analytics event:', error);
      throw error;
    }
  }

  // Track multiple events (batch)
  async trackEvents(events: CreateAnalyticsEventRequest[]): Promise<AnalyticsEvent[]> {
    try {
      const createdEvents = await Promise.all(
        events.map(event => this.trackEvent(event))
      );

      return createdEvents;
    } catch (error) {
      console.error('Failed to track analytics events:', error);
      throw error;
    }
  }

  // Get analytics events with filters
  async getEvents(filter: AnalyticsFilter = {}): Promise<{
    events: AnalyticsEvent[];
    total: number;
  }> {
    try {
      const cacheKey = `analytics-events-${JSON.stringify(filter)}`;
      
      // Try cache first
      const cached = await this.redis?.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const where: any = {};
      
      if (filter.userId) where.userId = filter.userId;
      if (filter.sessionId) where.sessionId = filter.sessionId;
      if (filter.eventType) where.eventType = filter.eventType;
      
      if (filter.dateFrom || filter.dateTo) {
        where.eventDate = {};
        if (filter.dateFrom) where.eventDate.gte = filter.dateFrom;
        if (filter.dateTo) where.eventDate.lte = filter.dateTo;
      }

      const orderBy = filter.orderBy || 'eventDate';
      const orderDirection = filter.orderDirection || 'desc';
      const limit = Math.min(filter.limit || 100, 500); // Max 500 entries
      const offset = filter.offset || 0;

      const [events, total] = await Promise.all([
        this.prisma.userAnalytics.findMany({
          where,
          orderBy: { [orderBy]: orderDirection },
          take: limit,
          skip: offset
        }),
        this.prisma.userAnalytics.count({ where })
      ]);

      const formattedEvents = events.map(event => this.formatAnalyticsEvent(event));
      
      const result = {
        events: formattedEvents,
        total
      };

      // Cache for 2 minutes
      await this.redis?.setex(cacheKey, 120, JSON.stringify(result));

      return result;
    } catch (error) {
      console.error('Failed to get analytics events:', error);
      throw error;
    }
  }

  // Get analytics metrics
  async getMetrics(filter: Partial<AnalyticsFilter> = {}): Promise<AnalyticsMetrics> {
    try {
      const cacheKey = `analytics-metrics-${JSON.stringify(filter)}`;
      
      // Try cache first
      const cached = await this.redis?.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const where: any = {};
      
      if (filter.userId) where.userId = filter.userId;
      if (filter.sessionId) where.sessionId = filter.sessionId;
      if (filter.eventType) where.eventType = filter.eventType;
      
      if (filter.dateFrom || filter.dateTo) {
        where.eventDate = {};
        if (filter.dateFrom) where.eventDate.gte = filter.dateFrom;
        if (filter.dateTo) where.eventDate.lte = filter.dateTo;
      }

      const [
        totalEvents,
        uniqueUsers,
        uniqueSessions,
        eventsByType,
        recentEvents,
        hourlyEvents
      ] = await Promise.all([
        this.prisma.userAnalytics.count({ where }),
        this.prisma.userAnalytics.groupBy({
          by: ['userId'],
          where: { userId: { not: null }, ...where },
          _count: true
        }).then(result => result.length),
        this.prisma.userAnalytics.groupBy({
          by: ['sessionId'],
          where,
          _count: true
        }).then(result => result.length),
        this.prisma.userAnalytics.groupBy({
          by: ['eventType'],
          where,
          _count: true
        }),
        this.prisma.userAnalytics.findMany({
          where,
          orderBy: { eventDate: 'desc' },
          take: 10
        }),
        this.getHourlyEventCounts(where)
      ]);

      const eventsByTypeMap = eventsByType.reduce((acc, item) => {
        acc[item.eventType] = item._count;
        return acc;
      }, {} as Record<string, number>);

      const topEventTypes = Object.entries(eventsByTypeMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([eventType, count]) => ({ eventType, count }));

      // Calculate user engagement metrics
      const userEngagement = await this.calculateUserEngagement(where);

      const metrics: AnalyticsMetrics = {
        totalEvents,
        uniqueUsers,
        uniqueSessions,
        eventsByType: eventsByTypeMap,
        eventsByHour: hourlyEvents,
        topEventTypes,
        recentEvents: recentEvents.map(event => this.formatAnalyticsEvent(event)),
        userEngagement
      };

      // Cache for 5 minutes
      await this.redis?.setex(cacheKey, this.cacheTimeout, JSON.stringify(metrics));

      return metrics;
    } catch (error) {
      console.error('Failed to get analytics metrics:', error);
      throw error;
    }
  }

  // Get dashboard metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const cacheKey = 'dashboard-metrics';
      
      // Try cache first
      const cached = await this.redis?.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Get overview metrics
      const [totalScans, activeUsers, scanMetrics] = await Promise.all([
        this.prisma.scanHistory.count({
          where: {
            createdAt: { gte: sevenDaysAgo }
          }
        }),
        this.prisma.userAnalytics.groupBy({
          by: ['userId'],
          where: {
            eventDate: { gte: sevenDaysAgo },
            userId: { not: null }
          },
          _count: true
        }).then(result => result.length),
        this.prisma.scanHistory.aggregate({
          where: {
            createdAt: { gte: sevenDaysAgo },
            status: 'completed',
            scanDuration: { not: null }
          },
          _avg: { scanDuration: true },
          _count: true
        })
      ]);

      const successRate = await this.prisma.scanHistory.aggregate({
        where: {
          createdAt: { gte: sevenDaysAgo }
        },
        _count: true
      }).then(async total => {
        if (total._count === 0) return 0;
        
        const completed = await this.prisma.scanHistory.count({
          where: {
            createdAt: { gte: sevenDaysAgo },
            status: 'completed'
          }
        });
        
        return (completed / total._count) * 100;
      });

      // Get trends data
      const [dailyScans, scanTypes, userGrowth] = await Promise.all([
        this.getDailyScanCounts(thirtyDaysAgo, today),
        this.getScanTypeDistribution(sevenDaysAgo, today),
        this.getUserGrowthData(thirtyDaysAgo, today)
      ]);

      // Get performance metrics
      const performance = await this.getPerformanceMetrics();

      const dashboardMetrics: DashboardMetrics = {
        overview: {
          totalScans,
          activeUsers,
          avgScanDuration: scanMetrics._avg.scanDuration || 0,
          successRate
        },
        trends: {
          dailyScans,
          scanTypes,
          userGrowth
        },
        performance
      };

      // Cache for 2 minutes
      await this.redis?.setex(cacheKey, 120, JSON.stringify(dashboardMetrics));

      return dashboardMetrics;
    } catch (error) {
      console.error('Failed to get dashboard metrics:', error);
      throw error;
    }
  }

  // Helper methods
  private formatAnalyticsEvent(event: any): AnalyticsEvent {
    return {
      id: event.id,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
      userId: event.userId,
      sessionId: event.sessionId,
      eventDate: event.eventDate.toISOString(),
      eventType: event.eventType,
      eventData: event.eventData,
      metadata: event.metadata,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      referrer: event.referrer
    };
  }

  private async cacheRecentEvent(event: any): Promise<void> {
    try {
      const key = `recent-event-${event.id}`;
      const formatted = this.formatAnalyticsEvent(event);
      await this.redis?.setex(key, 60, JSON.stringify(formatted)); // Cache for 1 minute
    } catch (error) {
      console.warn('Failed to cache recent event:', error);
    }
  }

  private async updateEventMetrics(eventType: string): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const cacheKey = `event-metrics-${eventType}-${today.toISOString().split('T')[0]}`;
      
      // Update daily metrics
      const current = await this.redis?.get(cacheKey) || '{}';
      const metrics = JSON.parse(current);
      metrics[eventType] = (metrics[eventType] || 0) + 1;
      
      await this.redis?.setex(cacheKey, this.cacheTimeout, JSON.stringify(metrics));
    } catch (error) {
      console.warn('Failed to update event metrics:', error);
    }
  }

  private async getHourlyEventCounts(where: any): Promise<Record<string, number>> {
    try {
      const events = await this.prisma.userAnalytics.findMany({
        where,
        select: { eventDate: true }
      });

      const hourlyCounts: Record<string, number> = {};
      
      events.forEach(event => {
        const hour = new Date(event.eventDate).getHours();
        const key = `${hour}:00`;
        hourlyCounts[key] = (hourlyCounts[key] || 0) + 1;
      });

      return hourlyCounts;
    } catch (error) {
      console.error('Failed to get hourly event counts:', error);
      return {};
    }
  }

  private async calculateUserEngagement(where: any): Promise<{
    avgEventsPerSession: number;
    sessionDuration: number;
    bounceRate: number;
  }> {
    try {
      const [sessionStats, sessionEvents] = await Promise.all([
        this.prisma.userAnalytics.groupBy({
          by: ['sessionId'],
          where,
          _count: true,
          _min: { eventDate: true },
          _max: { eventDate: true }
        }),
        this.prisma.userAnalytics.groupBy({
          by: ['sessionId', 'eventType'],
          where,
          _count: true
        })
      ]);

      const avgEventsPerSession = sessionStats.length > 0 
        ? sessionStats.reduce((sum, session) => sum + session._count, 0) / sessionStats.length 
        : 0;

      const sessionDurations = sessionStats
        .filter(session => session._min.eventDate && session._max.eventDate)
        .map(session => 
          new Date(session._max.eventDate!).getTime() - new Date(session._min.eventDate!).getTime()
        );

      const avgSessionDuration = sessionDurations.length > 0
        ? sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length
        : 0;

      // Calculate bounce rate (sessions with only 1 event)
      const singleEventSessions = sessionStats.filter(session => session._count === 1).length;
      const bounceRate = sessionStats.length > 0 ? (singleEventSessions / sessionStats.length) * 100 : 0;

      return {
        avgEventsPerSession,
        sessionDuration: avgSessionDuration,
        bounceRate
      };
    } catch (error) {
      console.error('Failed to calculate user engagement:', error);
      return {
        avgEventsPerSession: 0,
        sessionDuration: 0,
        bounceRate: 0
      };
    }
  }

  private async getDailyScanCounts(dateFrom: Date, dateTo: Date): Promise<Array<{ date: string; count: number }>> {
    try {
      const scans = await this.prisma.scanHistory.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: { gte: dateFrom, lte: dateTo }
        },
        _count: true
      });

      return scans.map(scan => ({
        date: scan.createdAt.toISOString().split('T')[0],
        count: scan._count
      }));
    } catch (error) {
      console.error('Failed to get daily scan counts:', error);
      return [];
    }
  }

  private async getScanTypeDistribution(dateFrom: Date, dateTo: Date): Promise<Array<{ type: string; count: number }>> {
    try {
      const scanTypes = await this.prisma.scanHistory.groupBy({
        by: ['scanType'],
        where: {
          createdAt: { gte: dateFrom, lte: dateTo }
        },
        _count: true
      });

      return scanTypes.map(scan => ({
        type: scan.scanType,
        count: scan._count
      }));
    } catch (error) {
      console.error('Failed to get scan type distribution:', error);
      return [];
    }
  }

  private async getUserGrowthData(dateFrom: Date, dateTo: Date): Promise<Array<{ date: string; users: number }>> {
    try {
      const users = await this.prisma.userAnalytics.groupBy({
        by: ['eventDate'],
        where: {
          eventDate: { gte: dateFrom, lte: dateTo },
          userId: { not: null }
        },
        _count: { userId: true }
      });

      return users.map(user => ({
        date: user.eventDate.toISOString().split('T')[0],
        users: user._count.userId
      }));
    } catch (error) {
      console.error('Failed to get user growth data:', error);
      return [];
    }
  }

  private async getPerformanceMetrics(): Promise<{
    apiResponseTime: number;
    cacheHitRate: number;
    errorRate: number;
    systemHealth: 'healthy' | 'warning' | 'critical';
  }> {
    try {
      // Mock performance metrics - in real implementation, these would come from monitoring
      const apiResponseTime = 150; // ms
      const cacheHitRate = 85; // %
      const errorRate = 2; // %

      let systemHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (errorRate > 10 || apiResponseTime > 1000) {
        systemHealth = 'critical';
      } else if (errorRate > 5 || apiResponseTime > 500) {
        systemHealth = 'warning';
      }

      return {
        apiResponseTime,
        cacheHitRate,
        errorRate,
        systemHealth
      };
    } catch (error) {
      console.error('Failed to get performance metrics:', error);
      return {
        apiResponseTime: 0,
        cacheHitRate: 0,
        errorRate: 0,
        systemHealth: 'critical'
      };
    }
  }

  // Health check
  async healthCheck(): Promise<{
    database: boolean;
    redis: boolean;
    lastEventCount: number;
  }> {
    try {
      const [databaseHealth, redisHealth, lastEventCount] = await Promise.all([
        this.prisma.userAnalytics.count().then(() => true).catch(() => false),
        this.redis?.ping().then(() => true).catch(() => false) ?? false,
        this.prisma.userAnalytics.count({
          where: {
            eventDate: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
            }
          }
        })
      ]);

      return {
        database: databaseHealth,
        redis: redisHealth,
        lastEventCount
      };
    } catch (error) {
      console.error('Analytics health check failed:', error);
      return {
        database: false,
        redis: false,
        lastEventCount: 0
      };
    }
  }

  // Clean up old analytics data
  async cleanupOldEvents(daysOld = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await this.prisma.userAnalytics.deleteMany({
        where: {
          eventDate: {
            lt: cutoffDate
          }
        }
      });

      return result.count;
    } catch (error) {
      console.error('Failed to cleanup old analytics events:', error);
      return 0;
    }
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService();

// Export types
export type { 
  AnalyticsEvent, 
  CreateAnalyticsEventRequest, 
  AnalyticsFilter, 
  AnalyticsMetrics, 
  DashboardMetrics 
};
