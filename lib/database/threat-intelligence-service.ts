// Threat Intelligence Database Service
// High-level service for database operations and persistence

import { 
  ThreatIntelligenceDatabase, 
  getThreatIntelligenceDatabase,
  ThreatRecord,
  SyncRecord,
  SourceStatusRecord,
  APIUsageRecord,
  UserSubscriptionRecord,
  UserPreferenceRecord,
  ThreatAnalyticsRecord,
  ThreatQuery,
  SyncQuery,
  AnalyticsQuery,
  DatabaseResult,
  DatabaseConfig
} from './threat-intelligence-schema';

export interface PersistenceService {
  // Threat operations
  saveThreat(threat: Omit<ThreatRecord, 'id' | 'createdAt' | 'updatedAt' | 'syncCount' | 'lastSyncAt'>): Promise<DatabaseResult<ThreatRecord>>;
  getThreats(query: ThreatQuery): Promise<DatabaseResult<ThreatRecord[]>>;
  getThreatById(id: string): Promise<DatabaseResult<ThreatRecord | null>>;
  updateThreat(id: string, updates: Partial<ThreatRecord>): Promise<DatabaseResult<ThreatRecord>>;
  deleteThreat(id: string): Promise<DatabaseResult<boolean>>;
  searchThreats(query: string, filters?: ThreatQuery): Promise<DatabaseResult<ThreatRecord[]>>;
  
  // Sync operations
  createSyncRecord(sync: Omit<SyncRecord, 'id' | 'createdAt'>): Promise<DatabaseResult<SyncRecord>>;
  updateSyncRecord(id: string, updates: Partial<SyncRecord>): Promise<DatabaseResult<SyncRecord>>;
  getSyncHistory(query: SyncQuery): Promise<DatabaseResult<SyncRecord[]>>;
  getLatestSyncRecord(source: string): Promise<DatabaseResult<SyncRecord | null>>;
  
  // Source status operations
  updateSourceStatus(source: string, status: Partial<SourceStatusRecord>): Promise<DatabaseResult<SourceStatusRecord>>;
  getSourceStatus(source: string): Promise<DatabaseResult<SourceStatusRecord | null>>;
  getAllSourceStatus(): Promise<DatabaseResult<SourceStatusRecord[]>>;
  
  // Analytics operations
  createAnalyticsRecord(analytics: Omit<ThreatAnalyticsRecord, 'id' | 'createdAt'>): Promise<DatabaseResult<ThreatAnalyticsRecord>>;
  getAnalytics(query: AnalyticsQuery): Promise<DatabaseResult<ThreatAnalyticsRecord[]>>;
  getAnalyticsByDate(date: string): Promise<DatabaseResult<ThreatAnalyticsRecord | null>>;
  
  // Maintenance operations
  cleanupOldRecords(daysToKeep?: number): Promise<DatabaseResult<{ deletedRecords: number }>>;
  optimizeDatabase(): Promise<DatabaseResult<boolean>>;
  getDatabaseStats(): Promise<DatabaseResult<any>>;
}

export class ThreatIntelligencePersistenceService implements PersistenceService {
  private database: ThreatIntelligenceDatabase;
  private cache: Map<string, any> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.database = getThreatIntelligenceDatabase();
  }

  // Cache management
  private setCache<T>(key: string, value: T): void {
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  private getCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const { value, timestamp } = cached;
    if (Date.now() - timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }
    
    return value;
  }

  private clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  // Threat operations
  async saveThreat(threat: Omit<ThreatRecord, 'id' | 'createdAt' | 'updatedAt' | 'syncCount' | 'lastSyncAt'>): Promise<DatabaseResult<ThreatRecord>> {
    try {
      const result = await this.database.createThreat(threat);
      
      if (result.success) {
        // Clear relevant cache entries
        this.clearCache(`threat_`);
        this.clearCache(`threats_`);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to save threat:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getThreats(query: ThreatQuery): Promise<DatabaseResult<ThreatRecord[]>> {
    try {
      const cacheKey = `threats_${JSON.stringify(query)}`;
      const cached = this.getCache<ThreatRecord[]>(cacheKey);
      
      if (cached) {
        return {
          success: true,
          data: cached,
          metadata: { fromCache: true }
        };
      }
      
      const result = await this.database.getThreats(query);
      
      if (result.success && result.data) {
        this.setCache(cacheKey, result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to get threats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getThreatById(id: string): Promise<DatabaseResult<ThreatRecord | null>> {
    try {
      const cacheKey = `threat_${id}`;
      const cached = this.getCache<ThreatRecord>(cacheKey);
      
      if (cached) {
        return {
          success: true,
          data: cached,
          metadata: { fromCache: true }
        };
      }
      
      const result = await this.database.getThreats({ limit: 1, offset: 0 });
      
      if (result.success && result.data) {
        const threat = result.data.find(t => t.id === id);
        if (threat) {
          this.setCache(cacheKey, threat);
        }
      }
      
      return {
        success: true,
        data: threat || null
      };
    } catch (error) {
      console.error('Failed to get threat by ID:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  async updateThreat(id: string, updates: Partial<ThreatRecord>): Promise<DatabaseResult<ThreatRecord>> {
    try {
      const result = await this.database.updateThreat(id, updates);
      
      if (result.success) {
        // Clear relevant cache entries
        this.clearCache(`threat_${id}`);
        this.clearCache(`threats_`);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to update threat:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteThreat(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const result = await this.database.deleteThreat(id);
      
      if (result.success) {
        // Clear relevant cache entries
        this.clearCache(`threat_${id}`);
        this.clearCache(`threats_`);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to delete threat:', error);
      return {
        success: false,
        error: error.message,
        data: false
      };
    }
  }

  async searchThreats(query: string, filters: ThreatQuery = {}): Promise<DatabaseResult<ThreatRecord[]>> {
    try {
      const searchQuery = {
        ...filters,
        search: query
      };
      
      const cacheKey = `search_${JSON.stringify(searchQuery)}`;
      const cached = this.getCache<ThreatRecord[]>(cacheKey);
      
      if (cached) {
        return {
          success: true,
          data: cached,
          metadata: { fromCache: true }
        };
      }
      
      const result = await this.database.getThreats(searchQuery);
      
      if (result.success && result.data) {
        this.setCache(cacheKey, result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to search threats:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  // Sync operations
  async createSyncRecord(sync: Omit<SyncRecord, 'id' | 'createdAt'>): Promise<DatabaseResult<SyncRecord>> {
    try {
      const result = await this.database.createSyncRecord(sync);
      
      if (result.success) {
        // Clear sync history cache
        this.clearCache(`sync_`);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to create sync record:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateSyncRecord(id: string, updates: Partial<SyncRecord>): Promise<DatabaseResult<SyncRecord>> {
    try {
      const result = await this.database.updateSyncRecord(id, updates);
      
      if (result.success) {
        // Clear sync history cache
        this.clearCache(`sync_`);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to update sync record:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getSyncHistory(query: SyncQuery): Promise<DatabaseResult<SyncRecord[]>> {
    try {
      const cacheKey = `sync_history_${JSON.stringify(query)}`;
      const cached = this.getCache<SyncRecord[]>(cacheKey);
      
      if (cached) {
        return {
          success: true,
          data: cached,
          metadata: { fromCache: true }
        };
      }
      
      const result = await this.database.getSyncHistory(query);
      
      if (result.success && result.data) {
        this.setCache(cacheKey, result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to get sync history:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  async getLatestSyncRecord(source: string): Promise<DatabaseResult<SyncRecord | null>> {
    try {
      const query: SyncQuery = {
        source,
        limit: 1,
        orderBy: { startTime: 'desc' }
      };
      
      const result = await this.database.getSyncHistory(query);
      
      return {
        success: true,
        data: result.data && result.data.length > 0 ? result.data[0] : null
      };
    } catch (error) {
      console.error('Failed to get latest sync record:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  // Source status operations
  async updateSourceStatus(source: string, status: Partial<SourceStatusRecord>): Promise<DatabaseResult<SourceStatusRecord>> {
    try {
      const result = await this.database.updateSourceStatus(source, status);
      
      if (result.success) {
        // Clear source status cache
        this.clearCache(`source_status_${source}`);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to update source status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getSourceStatus(source: string): Promise<DatabaseResult<SourceStatusRecord | null>> {
    try {
      const cacheKey = `source_status_${source}`;
      const cached = this.getCache<SourceStatusRecord>(cacheKey);
      
      if (cached) {
        return {
          success: true,
          data: cached,
          metadata: { fromCache: true }
        };
      }
      
      const result = await this.database.getSourceStatus(source);
      
      if (result.success && result.data) {
        this.setCache(cacheKey, result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to get source status:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  async getAllSourceStatus(): Promise<DatabaseResult<SourceStatusRecord[]>> {
    try {
      const cacheKey = 'source_status_all';
      const cached = this.getCache<SourceStatusRecord[]>(cacheKey);
      
      if (cached) {
        return {
          success: true,
          data: cached,
          metadata: { fromCache: true }
        };
      }
      
      const result = await this.database.getSyncHistory({ type: 'source_status' });
      
      if (result.success && result.data) {
        this.setCache(cacheKey, result.data);
      }
      
      return {
        success: true,
        data: result.data as SourceStatusRecord[]
      };
    } catch (error) {
      console.error('Failed to get all source status:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  // Analytics operations
  async createAnalyticsRecord(analytics: Omit<ThreatAnalyticsRecord, 'id' | 'createdAt'>): Promise<DatabaseResult<ThreatAnalyticsRecord>> {
    try {
      const result = await this.database.createAnalyticsRecord(analytics);
      
      if (result.success) {
        // Clear analytics cache
        this.clearCache(`analytics_`);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to create analytics record:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getAnalytics(query: AnalyticsQuery): Promise<DatabaseResult<ThreatAnalyticsRecord[]>> {
    try {
      const cacheKey = `analytics_${JSON.stringify(query)}`;
      const cached = this.getCache<ThreatAnalyticsRecord[]>(cacheKey);
      
      if (cached) {
        return {
          success: true,
          data: cached,
          metadata: { fromCache: true }
        };
      }
      
      const result = await this.database.getAnalytics(query);
      
      if (result.success && result.data) {
        this.setCache(cacheKey, result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to get analytics:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  async getAnalyticsByDate(date: string): Promise<DatabaseResult<ThreatAnalyticsRecord | null>> {
    try {
      const cacheKey = `analytics_date_${date}`;
      const cached = this.getCache<ThreatAnalyticsRecord>(cacheKey);
      
      if (cached) {
        return {
          success: true,
          data: cached,
          metadata: { fromCache: true }
        };
      }
      
      const result = await this.database.getAnalytics({ dateFrom: date, dateTo: date });
      
      return {
        success: true,
        data: result.data && result.data.length > 0 ? result.data[0] : null
      };
    } catch (error) {
      console.error('Failed to get analytics by date:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  // Maintenance operations
  async cleanupOldRecords(daysToKeep: number = 90): Promise<DatabaseResult<{ deletedRecords: number }>> {
    try {
      console.log(`Starting cleanup of records older than ${daysToKeep} days`);
      const result = await this.database.cleanupOldRecords(daysToKeep);
      
      if (result.success) {
        // Clear all caches after cleanup
        this.clearCache();
      }
      
      return result;
    } catch (error) {
      console.error('Failed to cleanup old records:', error);
      return {
        success: false,
        error: error.message,
        data: { deletedRecords: 0 }
      };
    }
  }

  async optimizeDatabase(): Promise<DatabaseResult<boolean>> {
    try {
      console.log('Starting database optimization');
      const result = await this.database.optimizeDatabase();
      
      if (result.success) {
        // Clear all caches after optimization
        this.clearCache();
      }
      
      return result;
    } catch (error) {
      console.error('Failed to optimize database:', error);
      return {
        success: false,
        error: error.message,
        data: false
      };
    }
  }

  async getDatabaseStats(): Promise<DatabaseResult<any>> {
    try {
      const result = await this.database.getDatabaseStats();
      return result;
    } catch (error) {
      console.error('Failed to get database stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Batch operations
  async batchSaveThreats(threats: Array<Omit<ThreatRecord, 'id' | 'createdAt' | 'updatedAt' | 'syncCount' | 'lastSyncAt'>>): Promise<DatabaseResult<ThreatRecord[]>> {
    const results: ThreatRecord[] = [];
    const errors: string[] = [];
    
    for (const threat of threats) {
      const result = await this.saveThreat(threat);
      if (result.success && result.data) {
        results.push(result.data);
      } else {
        errors.push(result.error || 'Unknown error');
      }
    }
    
    return {
      success: errors.length === 0,
      data: results,
      error: errors.length > 0 ? errors.join('; ') : undefined,
      metadata: {
        total: threats.length,
        successful: results.length,
        failed: errors.length
      }
    };
  }

  async batchUpdateThreats(updates: Array<{ id: string; updates: Partial<ThreatRecord> }>): Promise<DatabaseResult<ThreatRecord[]>> {
    const results: ThreatRecord[] = [];
    const errors: string[] = [];
    
    for (const { id, updates } of updates) {
      const result = await this.updateThreat(id, updates);
      if (result.success && result.data) {
        results.push(result.data);
      } else {
        errors.push(result.error || 'Unknown error');
      }
    }
    
    return {
      success: errors.length === 0,
      data: results,
      error: errors.length > 0 ? errors.join('; ') : undefined,
      metadata: {
        total: updates.length,
        successful: results.length,
        failed: errors.length
      }
    };
  }

  // Health check
  async healthCheck(): Promise<DatabaseResult<{
    database: boolean;
    cache: boolean;
    lastSync: string | null;
    totalRecords: number;
  }>> {
    try {
      const databaseStats = await this.getDatabaseStats();
      const latestSync = await this.getLatestSyncRecord('MISP');
      
      return {
        success: true,
        data: {
          database: databaseStats.success,
          cache: this.cache.size > 0,
          lastSync: latestSync.data?.timestamp || null,
          totalRecords: databaseStats.data?.totalThreats || 0
        }
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        success: false,
        error: error.message
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
