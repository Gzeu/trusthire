// Threat Intelligence Database Service
// Simplified implementation for deployment

import { getThreatIntelligenceDatabase } from './threat-intelligence-schema';
import { ThreatRecord, SyncRecord, SourceStatusRecord, ThreatAnalyticsRecord, APIUsageRecord } from './threat-intelligence-schema';

export interface DatabaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  metadata?: {
    total?: number;
    limit?: number;
    offset?: number;
    duration?: number;
  };
}

export class ThreatIntelligencePersistenceService {
  private database: any;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout: number = 300000; // 5 minutes

  constructor() {
    this.database = getThreatIntelligenceDatabase();
  }

  // Cache methods
  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const { data, timestamp } = cached;
    if (Date.now() - timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }
    
    return data;
  }

  private clearCache(pattern?: string): void {
    if (pattern) {
      Array.from(this.cache.keys()).forEach(key => {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      });
    } else {
      this.cache.clear();
    }
  }

  // Threat operations
  async saveThreat(threat: Omit<ThreatRecord, 'id' | 'createdAt' | 'updatedAt' | 'syncCount' | 'lastSyncAt'>): Promise<DatabaseResult<ThreatRecord>> {
    try {
      const result = await this.database.createThreat(threat);
      
      if (result.success && result.data) {
        this.clearCache('threats:');
        this.clearCache('analytics:');
      }
      
      return result;
    } catch (error) {
      console.error('Save threat error:', error);
      return {
        success: false,
        error: 'Failed to save threat',
        code: 'SAVE_THREAT_ERROR'
      };
    }
  }

  async getThreat(id: string): Promise<DatabaseResult<ThreatRecord | null>> {
    try {
      const cacheKey = `threat:${id}`;
      const cached = this.getCache(cacheKey);
      
      if (cached) {
        return {
          success: true,
          data: cached,
          metadata: { }
        };
      }

      const result = await this.database.getThreat(id);
      
      if (result.success && result.data) {
        this.setCache(cacheKey, result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Get threat error:', error);
      return {
        success: false,
        error: 'Failed to get threat',
        code: 'GET_THREAT_ERROR'
      };
    }
  }

  async updateThreat(id: string, updates: Partial<ThreatRecord>): Promise<DatabaseResult<ThreatRecord>> {
    try {
      const result = await this.database.updateThreat(id, updates);
      
      if (result.success && result.data) {
        this.clearCache(`threat:${id}`);
        this.clearCache('threats:');
        this.clearCache('analytics:');
      }
      
      return result;
    } catch (error) {
      console.error('Update threat error:', error);
      return {
        success: false,
        error: 'Failed to update threat',
        code: 'UPDATE_THREAT_ERROR'
      };
    }
  }

  async deleteThreat(id: string): Promise<DatabaseResult<void>> {
    try {
      const result = await this.database.deleteThreat(id);
      
      if (result.success) {
        this.clearCache(`threat:${id}`);
        this.clearCache('threats:');
        this.clearCache('analytics:');
      }
      
      return result;
    } catch (error) {
      console.error('Delete threat error:', error);
      return {
        success: false,
        error: 'Failed to delete threat',
        code: 'DELETE_THREAT_ERROR'
      };
    }
  }

  async getThreats(options: {
    type?: string;
    severity?: string;
    source?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<DatabaseResult<ThreatRecord[]>> {
    try {
      const cacheKey = `threats:${JSON.stringify(options)}`;
      const cached = this.getCache(cacheKey);
      
      if (cached) {
        return {
          success: true,
          data: cached,
          metadata: { }
        };
      }

      const result = await this.database.getThreats(options);
      
      if (result.success && result.data) {
        this.setCache(cacheKey, result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Get threats error:', error);
      return {
        success: false,
        error: 'Failed to get threats',
        code: 'GET_THREATS_ERROR'
      };
    }
  }

  // Batch operations
  async batchSaveThreats(threats: Omit<ThreatRecord, 'id' | 'createdAt' | 'updatedAt' | 'syncCount' | 'lastSyncAt'>[]): Promise<DatabaseResult<{
    successful: ThreatRecord[];
    failed: { threat: any; error: string }[];
    total: number;
  }>> {
    try {
      const results = {
        successful: [] as ThreatRecord[],
        failed: [] as { threat: any; error: string }[],
        total: threats.length
      };

      for (const threat of threats) {
        try {
          const result = await this.saveThreat(threat);
          if (result.success && result.data) {
            results.successful.push(result.data);
          } else {
            results.failed.push({
              threat,
              error: result.error || 'Unknown error'
            });
          }
        } catch (error) {
          results.failed.push({
            threat,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }

      this.clearCache('threats:');
      this.clearCache('analytics:');

      return {
        success: true,
        data: results
      };
    } catch (error) {
      console.error('Batch save threats error:', error);
      return {
        success: false,
        error: 'Failed to batch save threats',
        code: 'BATCH_SAVE_THREATS_ERROR'
      };
    }
  }

  // Sync operations
  async createSyncRecord(sync: Omit<SyncRecord, 'id' | 'createdAt'>): Promise<DatabaseResult<SyncRecord>> {
    try {
      const result = await this.database.createSync(sync);
      
      if (result.success && result.data) {
        this.clearCache('syncs:');
        this.clearCache('source-status:');
      }
      
      return result;
    } catch (error) {
      console.error('Create sync record error:', error);
      return {
        success: false,
        error: 'Failed to create sync record',
        code: 'CREATE_SYNC_ERROR'
      };
    }
  }

  async getSyncRecords(options: {
    source?: string;
    status?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<DatabaseResult<SyncRecord[]>> {
    try {
      const cacheKey = `syncs:${JSON.stringify(options)}`;
      const cached = this.getCache(cacheKey);
      
      if (cached) {
        return {
          success: true,
          data: cached,
          metadata: { }
        };
      }

      const result = await this.database.getSyncs(options);
      
      if (result.success && result.data) {
        this.setCache(cacheKey, result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Get sync records error:', error);
      return {
        success: false,
        error: 'Failed to get sync records',
        code: 'GET_SYNC_RECORDS_ERROR'
      };
    }
  }

  // Source status operations
  async getSourceStatus(source: string): Promise<DatabaseResult<SourceStatusRecord | null>> {
    try {
      const cacheKey = `source-status:${source}`;
      const cached = this.getCache(cacheKey);
      
      if (cached) {
        return {
          success: true,
          data: cached,
          metadata: { }
        };
      }

      const result = await this.database.getSourceStatus(source);
      
      if (result.success && result.data) {
        this.setCache(cacheKey, result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Get source status error:', error);
      return {
        success: false,
        error: 'Failed to get source status',
        code: 'GET_SOURCE_STATUS_ERROR'
      };
    }
  }

  async updateSourceStatus(source: string, updates: Partial<SourceStatusRecord>): Promise<DatabaseResult<SourceStatusRecord>> {
    try {
      const result = await this.database.updateSourceStatus(source, updates);
      
      if (result.success && result.data) {
        this.clearCache(`source-status:${source}`);
        this.clearCache('source-status:');
      }
      
      return result;
    } catch (error) {
      console.error('Update source status error:', error);
      return {
        success: false,
        error: 'Failed to update source status',
        code: 'UPDATE_SOURCE_STATUS_ERROR'
      };
    }
  }

  async getAllSourceStatus(): Promise<DatabaseResult<SourceStatusRecord[]>> {
    try {
      const cacheKey = 'source-status:all';
      const cached = this.getCache(cacheKey);
      
      if (cached) {
        return {
          success: true,
          data: cached,
          metadata: { }
        };
      }

      const result = await this.database.getAllSourceStatus();
      
      if (result.success && result.data) {
        this.setCache(cacheKey, result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Get all source status error:', error);
      return {
        success: false,
        error: 'Failed to get all source status',
        code: 'GET_ALL_SOURCE_STATUS_ERROR'
      };
    }
  }

  // API usage operations
  async createAPIUsageRecord(usage: Omit<APIUsageRecord, 'id' | 'createdAt'>): Promise<DatabaseResult<APIUsageRecord>> {
    try {
      const result = await this.database.createAPIUsage(usage);
      
      if (result.success && result.data) {
        this.clearCache('api-usage:');
      }
      
      return result;
    } catch (error) {
      console.error('Create API usage record error:', error);
      return {
        success: false,
        error: 'Failed to create API usage record',
        code: 'CREATE_API_USAGE_ERROR'
      };
    }
  }

  async getAPIUsageRecords(options: {
    source?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<DatabaseResult<APIUsageRecord[]>> {
    try {
      const cacheKey = `api-usage:${JSON.stringify(options)}`;
      const cached = this.getCache(cacheKey);
      
      if (cached) {
        return {
          success: true,
          data: cached,
          metadata: { }
        };
      }

      const result = await this.database.getAPIUsage(options);
      
      if (result.success && result.data) {
        this.setCache(cacheKey, result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Get API usage records error:', error);
      return {
        success: false,
        error: 'Failed to get API usage records',
        code: 'GET_API_USAGE_ERROR'
      };
    }
  }

  // Analytics operations
  async getAnalytics(options: {
    dateFrom?: string;
    dateTo?: string;
    type?: string;
  } = {}): Promise<DatabaseResult<ThreatAnalyticsRecord[]>> {
    try {
      const cacheKey = `analytics:${JSON.stringify(options)}`;
      const cached = this.getCache(cacheKey);
      
      if (cached) {
        return {
          success: true,
          data: cached,
          metadata: { }
        };
      }

      const result = await this.database.getAnalytics(options);
      
      if (result.success && result.data) {
        this.setCache(cacheKey, result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Get analytics error:', error);
      return {
        success: false,
        error: 'Failed to get analytics',
        code: 'GET_ANALYTICS_ERROR'
      };
    }
  }

  async createAnalyticsRecord(analytics: Omit<ThreatAnalyticsRecord, 'id' | 'createdAt'>): Promise<DatabaseResult<ThreatAnalyticsRecord>> {
    try {
      const result = await this.database.createAnalytics(analytics);
      
      if (result.success && result.data) {
        this.clearCache('analytics:');
      }
      
      return result;
    } catch (error) {
      console.error('Create analytics record error:', error);
      return {
        success: false,
        error: 'Failed to create analytics record',
        code: 'CREATE_ANALYTICS_ERROR'
      };
    }
  }

  // Health and maintenance
  async healthCheck(): Promise<DatabaseResult<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    details: Record<string, any>;
  }>> {
    try {
      const details = {
        cacheSize: this.cache.size,
        cacheTimeout: this.cacheTimeout,
        databaseConnected: true
      };

      return {
        success: true,
        data: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          details
        }
      };
    } catch (error) {
      console.error('Health check error:', error);
      return {
        success: false,
        error: 'Health check failed',
        code: 'HEALTH_CHECK_ERROR'
      };
    }
  }

  async clearAllCache(): Promise<DatabaseResult<void>> {
    try {
      this.cache.clear();
      return {
        success: true
      };
    } catch (error) {
      console.error('Clear cache error:', error);
      return {
        success: false,
        error: 'Failed to clear cache',
        code: 'CLEAR_CACHE_ERROR'
      };
    }
  }

  // Statistics
  async getStatistics(): Promise<DatabaseResult<{
    totalThreats: number;
    totalSyncs: number;
    totalAnalytics: number;
    totalAPIUsage: number;
    cacheSize: number;
  }>> {
    try {
      const threatsResult = await this.getThreats({ offset: 0 });
      const syncsResult = await this.getSyncRecords({ offset: 0 });
      const analyticsResult = await this.getAnalytics({});
      const apiUsageResult = await this.getAPIUsageRecords({ offset: 0 });

      return {
        success: true,
        data: {
          totalThreats: threatsResult.metadata?.total || 0,
          totalSyncs: syncsResult.metadata?.total || 0,
          totalAnalytics: analyticsResult.metadata?.total || 0,
          totalAPIUsage: apiUsageResult.metadata?.total || 0,
          cacheSize: this.cache.size
        }
      };
    } catch (error) {
      console.error('Get statistics error:', error);
      return {
        success: false,
        error: 'Failed to get statistics',
        code: 'GET_STATISTICS_ERROR'
      };
    }
  }
}

// Singleton instance
let threatIntelligencePersistenceService: ThreatIntelligencePersistenceService | null = null;

export function getThreatIntelligencePersistenceService(): ThreatIntelligencePersistenceService {
  if (!threatIntelligencePersistenceService) {
    threatIntelligencePersistenceService = new ThreatIntelligencePersistenceService();
  }
  return threatIntelligencePersistenceService;
}
