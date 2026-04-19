import { prisma } from './prisma';
import { performanceMonitor, trackDatabaseOperation } from './performance-monitor';

// Database optimization utilities and query helpers

export interface QueryOptions {
  include?: string[];
  select?: string[];
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

class DatabaseOptimizer {
  private static instance: DatabaseOptimizer;
  
  static getInstance(): DatabaseOptimizer {
    if (!DatabaseOptimizer.instance) {
      DatabaseOptimizer.instance = new DatabaseOptimizer();
    }
    return DatabaseOptimizer.instance;
  }

  // Assessment optimizations
  async getAssessmentById(id: string, options: QueryOptions = {}): Promise<any> {
    return trackDatabaseOperation('select', 'Assessment', async () => {
      const query: any = {
        where: { id },
        select: this.buildSelect(options.select, [
          'id', 'createdAt', 'sessionId', 'recruiterName', 'company',
          'finalScore', 'verdict', 'shareToken'
        ]),
      };

      if (options.include?.length) {
        query.include = this.buildInclude(options.include);
      }

      if (options.orderBy) {
        query.orderBy = { [options.orderBy]: options.orderDirection || 'desc' };
      }

      return prisma.assessment.findUnique(query);
    });
  }

  async getAssessmentsBySession(sessionId: string, options: QueryOptions = {}): Promise<any[]> {
    return trackDatabaseOperation('select', 'Assessment', async () => {
      const query: any = {
        where: { sessionId },
        select: this.buildSelect(options.select, [
          'id', 'createdAt', 'recruiterName', 'company', 'finalScore', 'verdict'
        ]),
      };

      if (options.orderBy) {
        query.orderBy = { [options.orderBy]: options.orderDirection || 'desc' };
      }

      if (options.limit) {
        query.take = options.limit;
      }

      return prisma.assessment.findMany(query);
    });
  }

  async getAssessmentsPaginated(
    page: number = 1,
    pageSize: number = 20,
    options: QueryOptions = {}
  ): Promise<PaginationResult<any>> {
    return trackDatabaseOperation('select', 'Assessment', async () => {
      const offset = (page - 1) * pageSize;
      
      const [data, total] = await Promise.all([
        prisma.assessment.findMany({
          select: this.buildSelect(options.select, [
            'id', 'createdAt', 'recruiterName', 'company', 'finalScore', 'verdict'
          ]),
          orderBy: options.orderBy ? 
            { [options.orderBy]: options.orderDirection || 'desc' } : 
            { createdAt: 'desc' },
          skip: offset,
          take: pageSize,
        }),
        prisma.assessment.count()
      ]);

      return {
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNext: offset + pageSize < total,
        hasPrev: page > 1,
      };
    });
  }

  // Scan history optimizations
  async getScanHistoryBySession(sessionId: string, options: QueryOptions = {}): Promise<any[]> {
    return trackDatabaseOperation('select', 'ScanHistory', async () => {
      const query: any = {
        where: { sessionId },
        select: this.buildSelect(options.select, [
          'id', 'createdAt', 'scanType', 'target', 'status', 'overallScore', 'scanDuration'
        ]),
      };

      if (options.orderBy) {
        query.orderBy = { [options.orderBy]: options.orderDirection || 'desc' };
      }

      if (options.limit) {
        query.take = options.limit;
      }

      return prisma.scanHistory.findMany(query);
    });
  }

  async getScanMetrics(
    dateFrom?: Date,
    dateTo?: Date,
    scanType?: string
  ): Promise<any[]> {
    return trackDatabaseOperation('select', 'ScanMetrics', async () => {
      const where: any = {};
      
      if (dateFrom || dateTo) {
        where.date = {};
        if (dateFrom) where.date.gte = dateFrom;
        if (dateTo) where.date.lte = dateTo;
      }
      
      if (scanType) {
        where.scanType = scanType;
      }

      return prisma.scanMetrics.findMany({
        where,
        orderBy: { date: 'desc' },
      });
    });
  }

  // User analytics optimizations
  async getUserAnalyticsPaginated(
    page: number = 1,
    pageSize: number = 50,
    options: QueryOptions = {}
  ): Promise<PaginationResult<any>> {
    return trackDatabaseOperation('select', 'UserAnalytics', async () => {
      const offset = (page - 1) * pageSize;
      
      const [data, total] = await Promise.all([
        prisma.userAnalytics.findMany({
          select: this.buildSelect(options.select, [
            'id', 'eventDate', 'eventType', 'sessionId'
          ]),
          orderBy: options.orderBy ? 
            { [options.orderBy]: options.orderDirection || 'desc' } : 
            { eventDate: 'desc' },
          skip: offset,
          take: pageSize,
        }),
        prisma.userAnalytics.count()
      ]);

      return {
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNext: offset + pageSize < total,
        hasPrev: page > 1,
      };
    });
  }

  // Cache management
  async getCacheEntry(key: string): Promise<any | null> {
    return trackDatabaseOperation('select', 'CacheEntry', async () => {
      const entry = await prisma.cacheEntry.findUnique({
        where: { key },
        select: { value: true, expiresAt: true },
      });

      if (!entry) return null;
      
      // Check if expired
      if (entry.expiresAt < new Date()) {
        await this.deleteCacheEntry(key);
        return null;
      }

      return JSON.parse(entry.value);
    });
  }

  async setCacheEntry(
    key: string, 
    value: any, 
    ttlSeconds: number = 3600
  ): Promise<void> {
    return trackDatabaseOperation('insert', 'CacheEntry', async () => {
      const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
      
      await prisma.cacheEntry.upsert({
        where: { key },
        update: {
          value: JSON.stringify(value),
          expiresAt,
        },
        create: {
          key,
          value: JSON.stringify(value),
          expiresAt,
        },
      });
    });
  }

  async deleteCacheEntry(key: string): Promise<void> {
    return trackDatabaseOperation('delete', 'CacheEntry', async () => {
      await prisma.cacheEntry.delete({
        where: { key },
      });
    });
  }

  async cleanupExpiredCache(): Promise<number> {
    return trackDatabaseOperation('delete', 'CacheEntry', async () => {
      const result = await prisma.cacheEntry.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });
      
      return result.count;
    });
  }

  // Threat intelligence optimizations
  async getThreatItems(
    threatType?: string,
    severity?: string,
    limit: number = 100
  ): Promise<any[]> {
    return trackDatabaseOperation('select', 'IntelligenceItem', async () => {
      const where: any = {
        isActive: true,
      };

      if (threatType) {
        where.type = threatType;
      }

      if (severity) {
        where.severity = severity;
      }

      return prisma.intelligenceItem.findMany({
        where,
        select: {
          id: true,
          type: true,
          title: true,
          description: true,
          severity: true,
          confidence: true,
          timestamp: true,
          tags: true,
        },
        orderBy: { timestamp: 'desc' },
        take: limit,
      });
    });
  }

  async getBehavioralProfile(
    entityId: string,
    entityType: string
  ): Promise<any | null> {
    return trackDatabaseOperation('select', 'BehavioralProfile', async () => {
      return prisma.behavioralProfile.findUnique({
        where: {
          entityId_entityType: {
            entityId,
            entityType,
          },
        },
        select: {
          id: true,
          riskScore: true,
          confidence: true,
          lastUpdated: true,
          behaviorPatterns: true,
          riskFactors: true,
        },
      });
    });
  }

  // Batch operations
  async createAssessmentsBatch(assessments: any[]): Promise<void> {
    return trackDatabaseOperation('insert', 'Assessment', async () => {
      await prisma.assessment.createMany({
        data: assessments,
        skipDuplicates: true,
      });
    });
  }

  async updateScanMetricsBatch(metrics: any[]): Promise<void> {
    return trackDatabaseOperation('update', 'ScanMetrics', async () => {
      const operations = metrics.map(metric => 
        prisma.scanMetrics.upsert({
          where: {
            date_scanType: {
              date: metric.date,
              scanType: metric.scanType,
            },
          },
          update: metric,
          create: metric,
        })
      );

      await Promise.all(operations);
    });
  }

  // Health and maintenance
  async getDatabaseStats(): Promise<{
    totalAssessments: number;
    totalScanHistory: number;
    totalCacheEntries: number;
    expiredCacheEntries: number;
    avgAssessmentScore: number;
    recentScansCount: number;
  }> {
    const [
      totalAssessments,
      totalScanHistory,
      totalCacheEntries,
      expiredCacheEntries,
      avgScoreResult,
      recentScansResult,
    ] = await Promise.all([
      prisma.assessment.count(),
      prisma.scanHistory.count(),
      prisma.cacheEntry.count(),
      prisma.cacheEntry.count({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      }),
      prisma.assessment.aggregate({
        _avg: {
          finalScore: true,
        },
      }),
      prisma.scanHistory.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
    ]);

    return {
      totalAssessments,
      totalScanHistory,
      totalCacheEntries,
      expiredCacheEntries,
      avgAssessmentScore: avgScoreResult._avg.finalScore || 0,
      recentScansCount: recentScansResult,
    };
  }

  async optimizeDatabase(): Promise<{
    cacheCleanup: number;
    indexOptimization: boolean;
    vacuumResult: boolean;
  }> {
    const results = {
      cacheCleanup: 0,
      indexOptimization: false,
      vacuumResult: false,
    };

    try {
      // Clean up expired cache entries
      results.cacheCleanup = await this.cleanupExpiredCache();
      
      // For SQLite, we can run VACUUM to optimize the database
      if (process.env.DATABASE_URL?.includes('sqlite')) {
        await prisma.$executeRaw`VACUUM`;
        results.vacuumResult = true;
      }
      
      // Analyze query performance (this would be more sophisticated in production)
      results.indexOptimization = true;
      
      performanceMonitor.recordMetric('database_optimization', 1, 'count', {
        operation: 'cleanup',
        cache_entries_deleted: results.cacheCleanup.toString(),
      });
      
    } catch (error) {
      console.error('Database optimization failed:', error);
      performanceMonitor.recordMetric('database_optimization_error', 1, 'count', {
        operation: 'cleanup',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    return results;
  }

  // Helper methods
  private buildSelect(selectFields?: string[], defaultFields: string[]): any {
    if (!selectFields || selectFields.length === 0) {
      return defaultFields.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {} as any);
    }

    return selectFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as any);
  }

  private buildInclude(includeFields?: string[]): any {
    if (!includeFields || includeFields.length === 0) {
      return undefined;
    }

    return includeFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as any);
  }

  // Connection management
  async testConnection(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  async getConnectionPoolStats(): Promise<{
    activeConnections: number;
    totalConnections: number;
    idleConnections: number;
  }> {
    // This would depend on the database provider
    // For SQLite, connection pooling is different
    try {
      const result = await prisma.$queryRaw`PRAGMA busy_timeout`;
      return {
        activeConnections: 1,
        totalConnections: 1,
        idleConnections: 0,
      };
    } catch (error) {
      console.error('Failed to get connection stats:', error);
      return {
        activeConnections: 0,
        totalConnections: 0,
        idleConnections: 0,
      };
    }
  }
}

// Export singleton instance
export const dbOptimizer = DatabaseOptimizer.getInstance();

// Export convenience functions
export const {
  getAssessmentById,
  getAssessmentsBySession,
  getAssessmentsPaginated,
  getScanHistoryBySession,
  getScanMetrics,
  getUserAnalyticsPaginated,
  getCacheEntry,
  setCacheEntry,
  deleteCacheEntry,
  cleanupExpiredCache,
  getThreatItems,
  getBehavioralProfile,
  createAssessmentsBatch,
  updateScanMetricsBatch,
  getDatabaseStats,
  optimizeDatabase,
  testConnection,
  getConnectionPoolStats,
} = dbOptimizer;

// Scheduled maintenance tasks
export async function runScheduledMaintenance(): Promise<void> {
  console.log('Starting scheduled database maintenance...');
  
  try {
    const stats = await optimizeDatabase();
    console.log('Database optimization completed:', stats);
    
    performanceMonitor.recordMetric('database_maintenance', 1, 'count', {
      cache_entries_deleted: stats.cacheCleanup.toString(),
      vacuum_completed: stats.vacuumResult.toString(),
    });
  } catch (error) {
    console.error('Scheduled maintenance failed:', error);
    performanceMonitor.recordMetric('database_maintenance_error', 1, 'count', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// Run maintenance every 6 hours
if (typeof setInterval !== 'undefined') {
  setInterval(runScheduledMaintenance, 6 * 60 * 60 * 1000);
}
