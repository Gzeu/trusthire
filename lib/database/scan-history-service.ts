// Scan History Persistence Service
// Handles storing and retrieving scan results with intelligent caching

import { PrismaClient } from '@prisma/client';
import { getRedisClient } from '@/lib/redis-wrapper';

export interface ScanHistoryEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  sessionId: string;
  scanType: 'github' | 'url' | 'linkedin' | 'forms';
  target: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  overallScore?: number;
  scanDuration?: number;
  resultData: string; // JSON
  errorData?: string; // JSON
  metadata?: string; // JSON
  ipAddress?: string;
  userAgent?: string;
}

export interface CreateScanHistoryRequest {
  userId?: string;
  sessionId: string;
  scanType: 'github' | 'url' | 'linkedin' | 'forms';
  target: string;
  status?: 'pending' | 'running' | 'completed' | 'failed';
  overallScore?: number;
  scanDuration?: number;
  resultData?: any;
  errorData?: any;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface ScanHistoryFilter {
  userId?: string;
  sessionId?: string;
  scanType?: 'github' | 'url' | 'linkedin' | 'forms';
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt' | 'updatedAt' | 'scanDuration' | 'overallScore';
  orderDirection?: 'asc' | 'desc';
}

export interface ScanHistoryStats {
  totalScans: number;
  completedScans: number;
  failedScans: number;
  avgScanDuration: number;
  scansByType: Record<string, number>;
  recentScans: ScanHistoryEntry[];
}

class ScanHistoryService {
  private prisma: PrismaClient;
  private redis: any;
  private cacheTimeout = 300; // 5 minutes

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = getRedisClient();
  }

  // Create a new scan history entry
  async createScanHistory(request: CreateScanHistoryRequest): Promise<ScanHistoryEntry> {
    try {
      const scanHistory = await this.prisma.scanHistory.create({
        data: {
          userId: request.userId,
          sessionId: request.sessionId,
          scanType: request.scanType,
          target: request.target,
          status: request.status || 'pending',
          overallScore: request.overallScore,
          scanDuration: request.scanDuration,
          resultData: JSON.stringify(request.resultData || {}),
          errorData: request.errorData ? JSON.stringify(request.errorData) : undefined,
          metadata: request.metadata ? JSON.stringify(request.metadata) : undefined,
          ipAddress: request.ipAddress,
          userAgent: request.userAgent
        }
      });

      // Cache the new entry
      await this.cacheScanEntry(scanHistory.id, scanHistory);

      // Update metrics
      await this.updateScanMetrics(request.scanType, 'created');

      return this.formatScanHistoryEntry(scanHistory);
    } catch (error) {
      console.error('Failed to create scan history entry:', error);
      throw error;
    }
  }

  // Update an existing scan history entry
  async updateScanHistory(
    id: string, 
    updates: Partial<CreateScanHistoryRequest>
  ): Promise<ScanHistoryEntry> {
    try {
      const updateData: any = {};
      
      if (updates.status) updateData.status = updates.status;
      if (updates.overallScore !== undefined) updateData.overallScore = updates.overallScore;
      if (updates.scanDuration !== undefined) updateData.scanDuration = updates.scanDuration;
      if (updates.resultData !== undefined) updateData.resultData = JSON.stringify(updates.resultData);
      if (updates.errorData !== undefined) updateData.errorData = JSON.stringify(updates.errorData);
      if (updates.metadata !== undefined) updateData.metadata = JSON.stringify(updates.metadata);

      const scanHistory = await this.prisma.scanHistory.update({
        where: { id },
        data: updateData
      });

      // Update cache
      await this.cacheScanEntry(id, scanHistory);

      // Update metrics if status changed to completed
      if (updates.status === 'completed') {
        await this.updateScanMetrics(scanHistory.scanType, 'completed');
      }

      return this.formatScanHistoryEntry(scanHistory);
    } catch (error) {
      console.error('Failed to update scan history entry:', error);
      throw error;
    }
  }

  // Get scan history by ID
  async getScanHistory(id: string): Promise<ScanHistoryEntry | null> {
    try {
      // Try cache first
      const cached = await this.getCachedScanEntry(id);
      if (cached) return cached;

      const scanHistory = await this.prisma.scanHistory.findUnique({
        where: { id }
      });

      if (!scanHistory) return null;

      const formatted = this.formatScanHistoryEntry(scanHistory);
      await this.cacheScanEntry(id, scanHistory);
      
      return formatted;
    } catch (error) {
      console.error('Failed to get scan history entry:', error);
      throw error;
    }
  }

  // Get scan history with filters
  async getScanHistoryList(filter: ScanHistoryFilter = {}): Promise<{
    entries: ScanHistoryEntry[];
    total: number;
  }> {
    try {
      const cacheKey = `scan-history-list-${JSON.stringify(filter)}`;
      
      // Try cache first
      const cached = await this.redis?.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const where: any = {};
      
      if (filter.userId) where.userId = filter.userId;
      if (filter.sessionId) where.sessionId = filter.sessionId;
      if (filter.scanType) where.scanType = filter.scanType;
      if (filter.status) where.status = filter.status;
      
      if (filter.dateFrom || filter.dateTo) {
        where.createdAt = {};
        if (filter.dateFrom) where.createdAt.gte = filter.dateFrom;
        if (filter.dateTo) where.createdAt.lte = filter.dateTo;
      }

      const orderBy = filter.orderBy || 'createdAt';
      const orderDirection = filter.orderDirection || 'desc';
      const limit = Math.min(filter.limit || 50, 100); // Max 100 entries
      const offset = filter.offset || 0;

      const [entries, total] = await Promise.all([
        this.prisma.scanHistory.findMany({
          where,
          orderBy: { [orderBy]: orderDirection },
          take: limit,
          skip: offset
        }),
        this.prisma.scanHistory.count({ where })
      ]);

      const formattedEntries = entries.map(entry => this.formatScanHistoryEntry(entry));
      
      const result = {
        entries: formattedEntries,
        total
      };

      // Cache for 2 minutes
      await this.redis?.setex(cacheKey, 120, JSON.stringify(result));

      return result;
    } catch (error) {
      console.error('Failed to get scan history list:', error);
      throw error;
    }
  }

  // Get scan statistics
  async getScanStatistics(filter: Partial<ScanHistoryFilter> = {}): Promise<ScanHistoryStats> {
    try {
      const cacheKey = `scan-stats-${JSON.stringify(filter)}`;
      
      // Try cache first
      const cached = await this.redis?.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const where: any = {};
      
      if (filter.userId) where.userId = filter.userId;
      if (filter.sessionId) where.sessionId = filter.sessionId;
      if (filter.scanType) where.scanType = filter.scanType;
      
      if (filter.dateFrom || filter.dateTo) {
        where.createdAt = {};
        if (filter.dateFrom) where.createdAt.gte = filter.dateFrom;
        if (filter.dateTo) where.createdAt.lte = filter.dateTo;
      }

      const [
        totalScans,
        completedScans,
        failedScans,
        avgScanDuration,
        scansByType,
        recentScans
      ] = await Promise.all([
        this.prisma.scanHistory.count({ where }),
        this.prisma.scanHistory.count({ where: { ...where, status: 'completed' } }),
        this.prisma.scanHistory.count({ where: { ...where, status: 'failed' } }),
        this.prisma.scanHistory.aggregate({
          where: { ...where, status: 'completed', scanDuration: { not: null } },
          _avg: { scanDuration: true }
        }),
        this.prisma.scanHistory.groupBy({
          by: ['scanType'],
          where,
          _count: true
        }),
        this.prisma.scanHistory.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: 5
        })
      ]);

      const stats: ScanHistoryStats = {
        totalScans,
        completedScans,
        failedScans,
        avgScanDuration: avgScanDuration._avg.scanDuration || 0,
        scansByType: scansByType.reduce((acc, item) => {
          acc[item.scanType] = item._count;
          return acc;
        }, {} as Record<string, number>),
        recentScans: recentScans.map(entry => this.formatScanHistoryEntry(entry))
      };

      // Cache for 5 minutes
      await this.redis?.setex(cacheKey, this.cacheTimeout, JSON.stringify(stats));

      return stats;
    } catch (error) {
      console.error('Failed to get scan statistics:', error);
      throw error;
    }
  }

  // Delete scan history entry
  async deleteScanHistory(id: string): Promise<boolean> {
    try {
      await this.prisma.scanHistory.delete({
        where: { id }
      });

      // Remove from cache
      await this.redis?.del(`scan-entry-${id}`);

      return true;
    } catch (error) {
      console.error('Failed to delete scan history entry:', error);
      return false;
    }
  }

  // Clear old scan history (cleanup)
  async clearOldHistory(daysOld = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await this.prisma.scanHistory.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          }
        }
      });

      return result.count;
    } catch (error) {
      console.error('Failed to clear old scan history:', error);
      return 0;
    }
  }

  // Helper methods
  private formatScanHistoryEntry(entry: any): ScanHistoryEntry {
    return {
      id: entry.id,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
      userId: entry.userId,
      sessionId: entry.sessionId,
      scanType: entry.scanType,
      target: entry.target,
      status: entry.status,
      overallScore: entry.overallScore,
      scanDuration: entry.scanDuration,
      resultData: entry.resultData,
      errorData: entry.errorData,
      metadata: entry.metadata,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent
    };
  }

  private async cacheScanEntry(id: string, entry: any): Promise<void> {
    try {
      const key = `scan-entry-${id}`;
      const formatted = this.formatScanHistoryEntry(entry);
      await this.redis?.setex(key, this.cacheTimeout, JSON.stringify(formatted));
    } catch (error) {
      console.warn('Failed to cache scan entry:', error);
    }
  }

  private async getCachedScanEntry(id: string): Promise<ScanHistoryEntry | null> {
    try {
      const cached = await this.redis?.get(`scan-entry-${id}`);
      if (cached) {
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      console.warn('Failed to get cached scan entry:', error);
      return null;
    }
  }

  private async updateScanMetrics(scanType: string, action: 'created' | 'completed'): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const metrics = await this.prisma.scanMetrics.upsert({
        where: {
          date_scanType: {
            date: today,
            scanType
          }
        },
        update: {
          totalScans: { increment: 1 },
          completedScans: action === 'completed' ? { increment: 1 } : undefined
        },
        create: {
          date: today,
          scanType,
          totalScans: 1,
          completedScans: action === 'completed' ? 1 : 0
        }
      });

      // Cache metrics
      const cacheKey = `scan-metrics-${scanType}-${today.toISOString().split('T')[0]}`;
      await this.redis?.setex(cacheKey, this.cacheTimeout, JSON.stringify(metrics));
    } catch (error) {
      console.warn('Failed to update scan metrics:', error);
    }
  }

  // Health check
  async healthCheck(): Promise<{
    database: boolean;
    redis: boolean;
    lastScanCount: number;
  }> {
    try {
      const [databaseHealth, redisHealth, lastScanCount] = await Promise.all([
        this.prisma.scanHistory.count().then(() => true).catch(() => false),
        this.redis?.ping().then(() => true).catch(() => false) ?? false,
        this.prisma.scanHistory.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
            }
          }
        })
      ]);

      return {
        database: databaseHealth,
        redis: redisHealth,
        lastScanCount
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        database: false,
        redis: false,
        lastScanCount: 0
      };
    }
  }
}

// Singleton instance
export const scanHistoryService = new ScanHistoryService();

// Export types
export type { ScanHistoryEntry, CreateScanHistoryRequest, ScanHistoryFilter, ScanHistoryStats };
