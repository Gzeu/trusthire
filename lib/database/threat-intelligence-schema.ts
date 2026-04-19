// Database Schema for Threat Intelligence
// Prisma schema for storing threat intelligence data and sync history

export interface ThreatIntelligenceDatabase {
  // Unified threat data storage
  threats: ThreatRecord[];
  
  // Source-specific data
  mispEvents: MISPEventRecord[];
  virusTotalReports: VirusTotalReportRecord[];
  phishTankEntries: PhishTankEntryRecord[];
  
  // Sync and metadata
  syncHistory: SyncRecord[];
  sourceStatus: SourceStatusRecord[];
  apiUsage: APIUsageRecord[];
  
  // User preferences and subscriptions
  userSubscriptions: UserSubscriptionRecord[];
  userPreferences: UserPreferenceRecord[];
  
  // Analytics and metrics
  threatAnalytics: ThreatAnalyticsRecord[];
  connectionMetrics: ConnectionMetricsRecord[];
}

export interface ThreatRecord {
  id: string;
  name: string;
  source: 'MISP' | 'VirusTotal' | 'PhishTank' | 'aggregated';
  type: 'malware' | 'phishing' | 'vulnerability' | 'apt' | 'ransomware';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  timestamp: string;
  description: string;
  indicators: {
    domains: string[];
    ips: string[];
    hashes: string[];
    urls: string[];
  };
  tags: string[];
  isActive: boolean;
  isSubscribed: boolean;
  metadata: {
    originalSource: string;
    sourceId: string;
    raw: any;
  };
  createdAt: string;
  updatedAt: string;
  syncCount: number;
  lastSyncAt: string;
}

export interface MISPEventRecord {
  id: string;
  uuid: string;
  info: string;
  timestamp: string;
  published: boolean;
  threat_level: 'high' | 'medium' | 'low';
  analysis: string;
  tags: string[];
  attributes: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  syncCount: number;
  lastSyncAt: string;
}

export interface VirusTotalReportRecord {
  sha256: string;
  sha1: string;
  md5: string;
  scan_date: string;
  positives: number;
  total: number;
  permalink: string;
  submission_names: string[];
  tags: string[];
  threat_names: string[];
  threat_labels: string[];
  additional_info: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  syncCount: number;
  lastSyncAt: string;
}

export interface PhishTankEntryRecord {
  id: string;
  url: string;
  phish_id: string;
  phish_detail_url: string;
  submission_date: string;
  verified: boolean;
  verification: boolean;
  online: boolean;
  target: string;
  country: string;
  details: string;
  submitter: string;
  title: string;
  author: string;
  ip: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  syncCount: number;
  lastSyncAt: string;
}

export interface SyncRecord {
  id: string;
  source: 'MISP' | 'VirusTotal' | 'PhishTank';
  type: 'full' | 'incremental' | 'error';
  status: 'started' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  duration?: number;
  recordsProcessed: number;
  recordsAdded: number;
  recordsUpdated: number;
  recordsDeleted: number;
  errorMessage?: string;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface SourceStatusRecord {
  id: string;
  source: 'MISP' | 'VirusTotal' | 'PhishTank';
  status: 'active' | 'error' | 'disabled' | 'maintenance';
  lastSyncAt: string;
  lastSuccessfulSyncAt: string;
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  averageSyncDuration: number;
  errorMessage?: string;
  rateLimitInfo: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
    currentUsage: number;
    resetTime: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface APIUsageRecord {
  id: string;
  source: 'MISP' | 'VirusTotal' | 'PhishTank';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  requestCount: number;
  successCount: number;
  errorCount: number;
  averageResponseTime: number;
  totalResponseTime: number;
  lastRequestAt: string;
  rateLimitHits: number;
  quotaRemaining?: number;
  quotaReset?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscriptionRecord {
  id: string;
  userId: string;
  threatId: string;
  source: 'MISP' | 'VirusTotal' | 'PhishTank';
  subscriptionType: 'threat' | 'type' | 'severity' | 'tag';
  subscriptionValue: string;
  isActive: boolean;
  notificationSettings: {
    email: boolean;
    push: boolean;
    sms: boolean;
    webhook: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferenceRecord {
  id: string;
  userId: string;
  preferenceType: 'source_priority' | 'filter_settings' | 'sync_settings' | 'notification_settings';
  preferenceKey: string;
  preferenceValue: any;
  createdAt: string;
  updatedAt: string;
}

export interface ThreatAnalyticsRecord {
  id: string;
  date: string;
  totalThreats: number;
  threatsByType: Record<string, number>;
  threatsBySeverity: Record<string, number>;
  threatsBySource: Record<string, number>;
  newThreats: number;
  updatedThreats: number;
  resolvedThreats: number;
  averageConfidence: number;
  topThreatTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  topThreatSources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  createdAt: string;
}

export interface ConnectionMetricsRecord {
  id: string;
  timestamp: string;
  source: 'MISP' | 'VirusTotal' | 'PhishTank';
  metricType: 'response_time' | 'success_rate' | 'error_rate' | 'throughput';
  metricValue: number;
  metadata: Record<string, any>;
  createdAt: string;
}

// Database query interfaces
export interface ThreatQuery {
  limit?: number;
  offset?: number;
  type?: string;
  severity?: string;
  source?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  isActive?: boolean;
  isSubscribed?: boolean;
  search?: string;
}

export interface SyncQuery {
  source?: string;
  type?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface AnalyticsQuery {
  dateFrom?: string;
  dateTo?: string;
  groupBy?: 'day' | 'week' | 'month' | 'type' | 'severity' | 'source';
  metrics?: string[];
}

// Database operation results
export interface DatabaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    total?: number;
    limit?: number;
    offset?: number;
    duration?: number;
  };
}

// Prisma schema definition
export const threatIntelligencePrismaSchema = `
// This would be the actual Prisma schema
model Threat {
  id              String   @id @default(cuid())
  name            String
  source          ThreatSource
  type            ThreatType
  severity         ThreatSeverity
  confidence      Float
  timestamp       DateTime @default(now())
  description     String
  indicators      Json
  tags            String[]
  isActive        Boolean  @default(true)
  isSubscribed     Boolean  @default(false)
  metadata        Json
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  syncCount       Int      @default(0)
  lastSyncAt      DateTime @default(now())
  
  @@index([source])
  @@index([type])
  @@index([severity])
  @@index([timestamp])
  @@index([isActive])
  @@index([isSubscribed])
}

model MISPEvent {
  id              String   @id @default(cuid())
  uuid            String   @unique
  info            String
  timestamp       DateTime
  published       Boolean
  threatLevel     MISPThreatLevel
  analysis        String
  tags            String[]
  attributes      Json
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  syncCount       Int      @default(0)
  lastSyncAt      DateTime @default(now())
  
  @@index([published])
  @@index([threatLevel])
  @@index([timestamp])
}

model VirusTotalReport {
  id              String   @id @default(cuid())
  sha256          String   @unique
  sha1            String
  md5             String
  scanDate        DateTime
  positives        Int
  total           Int
  permalink       String
  submissionNames String[]
  tags            String[]
  threatNames     String[]
  threatLabels    String[]
  additionalInfo   Json
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  syncCount       Int      @default(0)
  lastSyncAt      DateTime @default(now())
  
  @@index([scanDate])
  @@index([positives])
}

model PhishTankEntry {
  id                String   @id @default(cuid())
  url               String   @unique
  phishId           String   @unique
  phishDetailUrl     String
  submissionDate     DateTime
  verified          Boolean
  verification      Boolean
  online            Boolean
  target            String
  country           String
  details           String
  submitter         String
  title             String
  author            String
  ip                String
  tags              String[]
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  syncCount         Int      @default(0)
  lastSyncAt        DateTime @default(now())
  
  @@index([verified])
  @@index([submissionDate])
  @@index([target])
}

model SyncRecord {
  id                String   @id @default(cuid())
  source            ThreatSource
  type              SyncType
  status            SyncStatus
  startTime         DateTime
  endTime           DateTime?
  duration          Int?
  recordsProcessed   Int
  recordsAdded      Int
  recordsUpdated    Int
  recordsDeleted    Int
  errorMessage      String?
  metadata          Json
  createdAt         DateTime @default(now())
  
  @@index([source])
  @@index([type])
  @@index([status])
  @@index([startTime])
}

model SourceStatus {
  id                    String   @id @default(cuid())
  source                ThreatSource
  status                SourceStatus
  lastSyncAt            DateTime
  lastSuccessfulSyncAt DateTime
  totalSyncs            Int      @default(0)
  successfulSyncs        Int      @default(0)
  failedSyncs           Int      @default(0)
  averageSyncDuration    Float
  errorMessage          String?
  rateLimitInfo         Json
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@index([source])
  @@index([status])
}

model APIUsage {
  id                String   @id @default(cuid())
  source            ThreatSource
  endpoint          String
  method            APIMethod
  requestCount      Int      @default(0)
  successCount      Int      @default(0)
  errorCount        Int      @default(0)
  averageResponseTime Float
  totalResponseTime Float
  lastRequestAt     DateTime
  rateLimitHits     Int      @default(0)
  quotaRemaining    Int?
  quotaReset        DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([source])
  @@index([endpoint])
  @@index([method])
  @@index([lastRequestAt])
}

model UserSubscription {
  id                    String   @id @default(cuid())
  userId                String
  threatId              String
  source                ThreatSource
  subscriptionType      SubscriptionType
  subscriptionValue      String
  isActive              Boolean  @default(true)
  notificationSettings    Json
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@index([userId])
  @@index([threatId])
  @@index([source])
  @@index([isActive])
}

model UserPreference {
  id                String   @id @default(cuid())
  userId            String
  preferenceType    PreferenceType
  preferenceKey    String
  preferenceValue   Json
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([userId])
  @@index([preferenceType])
  @@index([preferenceKey])
}

model ThreatAnalytics {
  id                String   @id @default(cuid())
  date              String
  totalThreats      Int
  threatsByType     Json
  threatsBySeverity Json
  threatsBySource   Json
  newThreats        Int
  updatedThreats    Int
  resolvedThreats   Int
  averageConfidence Float
  topThreatTypes    Json
  topThreatSources  Json
  createdAt         DateTime @default(now())
  
  @@index([date])
  @@unique([date])
}

model ConnectionMetrics {
  id                String   @id @default(cuid())
  timestamp         DateTime @default(now())
  source            ThreatSource
  metricType        MetricType
  metricValue       Float
  metadata          Json
  createdAt         DateTime @default(now())
  
  @@index([source])
  @@index([metricType])
  @@index([timestamp])
}

enum ThreatSource {
  MISP
  VirusTotal
  PhishTank
}

enum ThreatType {
  malware
  phishing
  vulnerability
  apt
  ransomware
}

enum ThreatSeverity {
  low
  medium
  high
  critical
}

enum MISPThreatLevel {
  low
  medium
  high
  critical
}

enum SyncType {
  full
  incremental
  error
}

enum SyncStatus {
  started
  completed
  failed
}

enum SourceStatus {
  active
  error
  disabled
  maintenance
}

enum APIMethod {
  GET
  POST
  PUT
  DELETE
}

enum SubscriptionType {
  threat
  type
  severity
  tag
}

enum PreferenceType {
  source_priority
  filter_settings
  sync_settings
  notification_settings
}

enum MetricType {
  response_time
  success_rate
  error_rate
  throughput
}
`;

// Database connection and utility functions
export interface DatabaseConfig {
  type: 'sqlite' | 'postgresql' | 'mysql';
  url: string;
  ssl?: boolean;
  poolSize?: number;
  timeout?: number;
  maxConnections?: number;
}

export class ThreatIntelligenceDatabase {
  private config: DatabaseConfig;
  
  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  // Connection management
  async connect(): Promise<void> {
    // Database connection logic
    console.log(`Connecting to ${this.config.type} database at ${this.config.url}`);
  }

  async disconnect(): Promise<void> {
    // Database disconnection logic
    console.log('Disconnecting from database');
  }

  // Threat operations
  async createThreat(threat: Omit<ThreatRecord, 'id' | 'createdAt' | 'updatedAt' | 'syncCount' | 'lastSyncAt'>): Promise<DatabaseResult<ThreatRecord>> {
    // Create threat record
    console.log('Creating threat record:', threat.name);
    return {
      success: true,
      data: {
        ...threat,
        id: `threat_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        syncCount: 0,
        lastSyncAt: new Date().toISOString()
      }
    };
  }

  async getThreats(query: ThreatQuery): Promise<DatabaseResult<ThreatRecord[]>> {
    // Get threats with filtering
    console.log('Querying threats with filters:', query);
    return {
      success: true,
      data: [],
      metadata: {
        total: 0,
        limit: query.limit || 50,
        offset: query.offset || 0
      }
    };
  }

  async updateThreat(id: string, updates: Partial<ThreatRecord>): Promise<DatabaseResult<ThreatRecord>> {
    // Update threat record
    console.log('Updating threat record:', id, updates);
    return {
      success: true,
      data: {
        id,
        ...updates,
        updatedAt: new Date().toISOString()
      } as ThreatRecord
    };
  }

  async deleteThreat(id: string): Promise<DatabaseResult<boolean>> {
    // Delete threat record
    console.log('Deleting threat record:', id);
    return {
      success: true,
      data: true
    };
  }

  // Sync operations
  async createSyncRecord(sync: Omit<SyncRecord, 'id' | 'createdAt'>): Promise<DatabaseResult<SyncRecord>> {
    // Create sync record
    console.log('Creating sync record:', sync.source);
    return {
      success: true,
      data: {
        ...sync,
        id: `sync_${Date.now()}`,
        createdAt: new Date().toISOString()
      }
    };
  }

  async updateSyncRecord(id: string, updates: Partial<SyncRecord>): Promise<DatabaseResult<SyncRecord>> {
    // Update sync record
    console.log('Updating sync record:', id, updates);
    return {
      success: true,
      data: {
        id,
        ...updates
      } as SyncRecord
    };
  }

  async getSyncHistory(query: SyncQuery): Promise<DatabaseResult<SyncRecord[]>> {
    // Get sync history
    console.log('Querying sync history:', query);
    return {
      success: true,
      data: [],
      metadata: {
        total: 0,
        limit: query.limit || 50,
        offset: query.offset || 0
      }
    };
  }

  // Source status operations
  async updateSourceStatus(source: string, status: Partial<SourceStatusRecord>): Promise<DatabaseResult<SourceStatusRecord>> {
    // Update source status
    console.log('Updating source status:', source, status);
    return {
      success: true,
      data: {
        id: `status_${source}`,
        source: source as any,
        status: status.status || 'active',
        lastSyncAt: new Date().toISOString(),
        lastSuccessfulSyncAt: new Date().toISOString(),
        totalSyncs: 0,
        successfulSyncs: 0,
        failedSyncs: 0,
        averageSyncDuration: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...status
      } as SourceStatusRecord
    };
  }

  async getSourceStatus(source: string): Promise<DatabaseResult<SourceStatusRecord | null>> {
    // Get source status
    console.log('Getting source status:', source);
    return {
      success: true,
      data: {
        id: `status_${source}`,
        source: source as any,
        status: 'active',
        lastSyncAt: new Date().toISOString(),
        lastSuccessfulSyncAt: new Date().toISOString(),
        totalSyncs: 0,
        successfulSyncs: 0,
        failedSyncs: 0,
        averageSyncDuration: 0,
        rateLimitInfo: {
          requestsPerMinute: 100,
          requestsPerHour: 6000,
          requestsPerDay: 144000,
          currentUsage: 0,
          resetTime: new Date(Date.now() + 60000).toISOString()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }

  // Analytics operations
  async createAnalyticsRecord(analytics: Omit<ThreatAnalyticsRecord, 'id' | 'createdAt'>): Promise<DatabaseResult<ThreatAnalyticsRecord>> {
    // Create analytics record
    console.log('Creating analytics record:', analytics.date);
    return {
      success: true,
      data: {
        ...analytics,
        id: `analytics_${Date.now()}`,
        createdAt: new Date().toISOString()
      }
    };
  }

  async getAnalytics(query: AnalyticsQuery): Promise<DatabaseResult<ThreatAnalyticsRecord[]>> {
    // Get analytics data
    console.log('Querying analytics:', query);
    return {
      success: true,
      data: [],
      metadata: {
        total: 0,
        limit: 50,
        offset: 0
      }
    };
  }

  // Cleanup operations
  async cleanupOldRecords(daysToKeep: number = 90): Promise<DatabaseResult<{ deletedRecords: number }>> {
    // Cleanup old records
    console.log('Cleaning up records older than', daysToKeep, 'days');
    return {
      success: true,
      data: { deletedRecords: 0 }
    };
  }
}

// Singleton instance
let threatIntelligenceDatabase: ThreatIntelligenceDatabase | null = null;

export function getThreatIntelligenceDatabase(): ThreatIntelligenceDatabase {
  if (!threatIntelligenceDatabase) {
    const config: DatabaseConfig = {
      type: (process.env.DB_TYPE as any) || 'sqlite',
      url: process.env.DATABASE_URL || 'file:./threat-intelligence.db',
      ssl: process.env.DB_SSL === 'true',
      poolSize: parseInt(process.env.DB_POOL_SIZE || '10'),
      timeout: parseInt(process.env.DB_TIMEOUT || '30000'),
      maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '100')
    };
    
    threatIntelligenceDatabase = new ThreatIntelligenceDatabase(config);
  }
  return threatIntelligenceDatabase;
}
