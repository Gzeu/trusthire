// Threat Intelligence Aggregator
// Unified interface for multiple threat intelligence sources

import { getMISPClient, MISPClient, MISPEvent } from './misp-client';
import { getVirusTotalClient, VirusTotalClient, VirusTotalFileReport } from './virustotal-client';
import { getPhishTankClient, PhishTankClient, PhishTankEntry } from './phishtank-client';

export interface ThreatIntelligenceSource {
  name: string;
  enabled: boolean;
  priority: number;
  lastSync: string;
  status: 'active' | 'error' | 'disabled';
  error?: string;
}

export interface UnifiedThreatData {
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
}

export interface ThreatIntelligenceConfig {
  sources: {
    misp: {
      enabled: boolean;
      priority: number;
      config: any;
    };
    virustotal: {
      enabled: boolean;
      priority: number;
      config: any;
    };
    phishtank: {
      enabled: boolean;
      priority: number;
      config: any;
    };
  };
  sync: {
    interval: number; // milliseconds
    batchSize: number;
    maxRetries: number;
    retryDelay: number;
  };
  filters: {
    minSeverity: 'low' | 'medium' | 'high' | 'critical';
    excludeTags: string[];
    includeTypes: string[];
  };
}

export class ThreatIntelligenceAggregator {
  private config: ThreatIntelligenceConfig;
  private mispClient: MISPClient | null = null;
  private virusTotalClient: VirusTotalClient | null = null;
  private phishTankClient: PhishTankClient | null = null;
  private syncInterval: NodeJS.Timeout | null = null;
  private isSyncing = false;

  constructor(config: ThreatIntelligenceConfig) {
    this.config = config;
    this.initializeClients();
  }

  private initializeClients(): void {
    if (this.config.sources.misp.enabled) {
      this.mispClient = getMISPClient();
    }
    
    if (this.config.sources.virustotal.enabled) {
      this.virusTotalClient = getVirusTotalClient();
    }
    
    if (this.config.sources.phishtank.enabled) {
      this.phishTankClient = getPhishTankClient();
    }
  }

  // Sync Management
  async startSync(): Promise<void> {
    if (this.isSyncing) {
      console.warn('Sync already in progress');
      return;
    }

    this.isSyncing = true;
    console.log('Starting threat intelligence sync');

    try {
      await this.syncAllSources();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.isSyncing = false;
    }

    // Schedule next sync
    this.scheduleNextSync();
  }

  async stopSync(): Promise<void> {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.isSyncing = false;
    console.log('Threat intelligence sync stopped');
  }

  private scheduleNextSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      this.startSync();
    }, this.config.sync.interval);
  }

  // Source Synchronization
  private async syncAllSources(): Promise<UnifiedThreatData[]> {
    const allThreats: UnifiedThreatData[] = [];
    const sources = [];

    // Sync MISP
    if (this.mispClient && this.config.sources.misp.enabled) {
      try {
        const mispEvents = await this.mispClient.getEvents({
          limit: this.config.sync.batchSize,
          published: true
        });
        
        const mispThreats = mispEvents.events.map(event => 
          this.transformMISPEvent(event)
        );
        
        allThreats.push(...mispThreats);
        sources.push({
          name: 'MISP',
          enabled: true,
          priority: this.config.sources.misp.priority,
          lastSync: new Date().toISOString(),
          status: 'active'
        });
      } catch (error) {
        console.error('MISP sync error:', error);
        sources.push({
          name: 'MISP',
          enabled: true,
          priority: this.config.sources.misp.priority,
          lastSync: new Date().toISOString(),
          status: 'error',
          error: error.message
        });
      }
    }

    // Sync VirusTotal
    if (this.virusTotalClient && this.config.sources.virustotal.enabled) {
      try {
        const vtReports = await this.virusTotalClient.searchFiles('', {
          limit: this.config.sync.batchSize,
          positives: '1'
        });
        
        const vtThreats = vtReports.map(report => 
          this.transformVirusTotalReport(report)
        );
        
        allThreats.push(...vtThreats);
        sources.push({
          name: 'VirusTotal',
          enabled: true,
          priority: this.config.sources.virustotal.priority,
          lastSync: new Date().toISOString(),
          status: 'active'
        });
      } catch (error) {
        console.error('VirusTotal sync error:', error);
        sources.push({
          name: 'VirusTotal',
          enabled: true,
          priority: this.config.sources.virustotal.priority,
          lastSync: new Date().toISOString(),
          status: 'error',
          error: error.message
        });
      }
    }

    // Sync PhishTank
    if (this.phishTankClient && this.config.sources.phishtank.enabled) {
      try {
        const ptEntries = await this.phishTankClient.getEntries({
          limit: this.config.sync.batchSize,
          verified: true
        });
        
        const ptThreats = ptEntries.entries.map(entry => 
          this.transformPhishTankEntry(entry)
        );
        
        allThreats.push(...ptThreats);
        sources.push({
          name: 'PhishTank',
          enabled: true,
          priority: this.config.sources.phishtank.priority,
          lastSync: new Date().toISOString(),
          status: 'active'
        });
      } catch (error) {
        console.error('PhishTank sync error:', error);
        sources.push({
          name: 'PhishTank',
          enabled: true,
          priority: this.config.sources.phishtank.priority,
          lastSync: new Date().toISOString(),
          status: 'error',
          error: error.message
        });
      }
    }

    // Filter and deduplicate threats
    const filteredThreats = this.filterAndDeduplicate(allThreats);
    
    // Sort by priority and timestamp
    const sortedThreats = filteredThreats.sort((a, b) => {
      const aPriority = this.getSourcePriority(a.source);
      const bPriority = this.getSourcePriority(b.source);
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority; // Higher priority first
      }
      
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return sortedThreats;
  }

  // Data Transformation
  private transformMISPEvent(event: MISPEvent): UnifiedThreatData {
    const transformed = this.mispClient!.transformToTrustHireFormat(event);
    return {
      ...transformed,
      metadata: {
        originalSource: 'MISP',
        sourceId: event.id,
        raw: event
      }
    };
  }

  private transformVirusTotalReport(report: VirusTotalFileReport): UnifiedThreatData {
    const transformed = this.virusTotalClient!.transformToTrustHireFormat(report);
    return {
      ...transformed,
      metadata: {
        originalSource: 'VirusTotal',
        sourceId: report.sha256,
        raw: report
      }
    };
  }

  private transformPhishTankEntry(entry: PhishTankEntry): UnifiedThreatData {
    const transformed = this.phishTankClient!.transformToTrustHireFormat(entry);
    return {
      ...transformed,
      metadata: {
        originalSource: 'PhishTank',
        sourceId: entry.id,
        raw: entry
      }
    };
  }

  // Filtering and Deduplication
  private filterAndDeduplicate(threats: UnifiedThreatData[]): UnifiedThreatData[] {
    const seen = new Set<string>();
    const filtered: UnifiedThreatData[] = [];

    for (const threat of threats) {
      // Apply filters
      if (!this.passesFilters(threat)) {
        continue;
      }

      // Deduplicate by ID
      if (seen.has(threat.id)) {
        continue;
      }
      seen.add(threat.id);

      filtered.push(threat);
    }

    return filtered;
  }

  private passesFilters(threat: UnifiedThreatData): boolean {
    // Severity filter
    const severityLevels = { low: 1, medium: 2, high: 3, critical: 4 };
    const minSeverity = severityLevels[this.config.filters.minSeverity];
    const threatSeverity = severityLevels[threat.severity];
    
    if (threatSeverity < minSeverity) {
      return false;
    }

    // Type filter
    if (this.config.filters.includeTypes.length > 0) {
      if (!this.config.filters.includeTypes.includes(threat.type)) {
        return false;
      }
    }

    // Exclude tags filter
    if (this.config.filters.excludeTags.length > 0) {
      const hasExcludedTag = threat.tags.some(tag => 
        this.config.filters.excludeTags.includes(tag)
      );
      if (hasExcludedTag) {
        return false;
      }
    }

    return true;
  }

  private getSourcePriority(source: string): number {
    switch (source) {
      case 'MISP':
        return this.config.sources.misp.priority;
      case 'VirusTotal':
        return this.config.sources.virustotal.priority;
      case 'PhishTank':
        return this.config.sources.phishtank.priority;
      default:
        return 0;
    }
  }

  // Public API Methods
  async getThreats(options: {
    limit?: number;
    offset?: number;
    type?: string;
    severity?: string;
    source?: string;
  } = {}): Promise<{ threats: UnifiedThreatData[]; total: number }> {
    const allThreats = await this.syncAllSources();
    
    let filtered = allThreats;

    // Apply filters
    if (options.type) {
      filtered = filtered.filter(threat => threat.type === options.type);
    }
    
    if (options.severity) {
      filtered = filtered.filter(threat => threat.severity === options.severity);
    }
    
    if (options.source) {
      filtered = filtered.filter(threat => threat.source === options.source);
    }

    // Apply pagination
    const offset = options.offset || 0;
    const limit = options.limit || 50;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      threats: paginated,
      total: filtered.length
    };
  }

  async getThreatById(id: string): Promise<UnifiedThreatData | null> {
    const allThreats = await this.syncAllSources();
    return allThreats.find(threat => threat.id === id) || null;
  }

  async searchThreats(query: string, options: {
    limit?: number;
    type?: string;
    severity?: string;
  } = {}): Promise<UnifiedThreatData[]> {
    const allThreats = await this.syncAllSources();
    
    let results = allThreats.filter(threat => 
      threat.name.toLowerCase().includes(query.toLowerCase()) ||
      threat.description.toLowerCase().includes(query.toLowerCase()) ||
      threat.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    // Apply additional filters
    if (options.type) {
      results = results.filter(threat => threat.type === options.type);
    }
    
    if (options.severity) {
      results = results.filter(threat => threat.severity === options.severity);
    }

    const limit = options.limit || 50;
    return results.slice(0, limit);
  }

  async getSourceStatus(): Promise<ThreatIntelligenceSource[]> {
    const sources: ThreatIntelligenceSource[] = [];

    if (this.config.sources.misp.enabled) {
      sources.push({
        name: 'MISP',
        enabled: true,
        priority: this.config.sources.misp.priority,
        lastSync: new Date().toISOString(),
        status: 'active'
      });
    }

    if (this.config.sources.virustotal.enabled) {
      sources.push({
        name: 'VirusTotal',
        enabled: true,
        priority: this.config.sources.virustotal.priority,
        lastSync: new Date().toISOString(),
        status: 'active'
      });
    }

    if (this.config.sources.phishtank.enabled) {
      sources.push({
        name: 'PhishTank',
        enabled: true,
        priority: this.config.sources.phishtank.priority,
        lastSync: new Date().toISOString(),
        status: 'active'
      });
    }

    return sources;
  }

  async updateConfig(config: Partial<ThreatIntelligenceConfig>): Promise<void> {
    this.config = { ...this.config, ...config };
    this.initializeClients();
    
    // Restart sync if interval changed
    if (config.sync?.interval) {
      await this.stopSync();
      await this.startSync();
    }
  }

  // Statistics and Analytics
  async getStatistics(): Promise<{
    total_threats: number;
    threats_by_type: Record<string, number>;
    threats_by_severity: Record<string, number>;
    threats_by_source: Record<string, number>;
    recent_threats: {
      last_24h: number;
      last_7d: number;
      last_30d: number;
    };
    source_status: ThreatIntelligenceSource[];
  }> {
    const allThreats = await this.syncAllSources();
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const threatsByType: Record<string, number> = {};
    const threatsBySeverity: Record<string, number> = {};
    const threatsBySource: Record<string, number> = {};

    allThreats.forEach(threat => {
      // Count by type
      threatsByType[threat.type] = (threatsByType[threat.type] || 0) + 1;
      
      // Count by severity
      threatsBySeverity[threat.severity] = (threatsBySeverity[threat.severity] || 0) + 1;
      
      // Count by source
      threatsBySource[threat.source] = (threatsBySource[threat.source] || 0) + 1;
    });

    const recent24h = allThreats.filter(threat => 
      new Date(threat.timestamp) >= last24h
    ).length;
    
    const recent7d = allThreats.filter(threat => 
      new Date(threat.timestamp) >= last7d
    ).length;
    
    const recent30d = allThreats.filter(threat => 
      new Date(threat.timestamp) >= last30d
    ).length;

    return {
      total_threats: allThreats.length,
      threats_by_type: threatsByType,
      threats_by_severity: threatsBySeverity,
      threats_by_source: threatsBySource,
      recent_threats: {
        last_24h: recent24h,
        last_7d: recent7d,
        last_30d: recent30d
      },
      source_status: await this.getSourceStatus()
    };
  }
}

// Singleton instance
let threatIntelligenceAggregator: ThreatIntelligenceAggregator | null = null;

export function getThreatIntelligenceAggregator(): ThreatIntelligenceAggregator {
  if (!threatIntelligenceAggregator) {
    const config: ThreatIntelligenceConfig = {
      sources: {
        misp: {
          enabled: process.env.MISP_ENABLED === 'true',
          priority: 1,
          config: {}
        },
        virustotal: {
          enabled: process.env.VIRUSTOTAL_ENABLED === 'true',
          priority: 2,
          config: {}
        },
        phishtank: {
          enabled: process.env.PHISHTANK_ENABLED === 'true',
          priority: 3,
          config: {}
        }
      },
      sync: {
        interval: parseInt(process.env.THREAT_SYNC_INTERVAL || '300000'), // 5 minutes
        batchSize: parseInt(process.env.THREAT_SYNC_BATCH_SIZE || '50'),
        maxRetries: 3,
        retryDelay: 5000
      },
      filters: {
        minSeverity: 'low',
        excludeTags: [],
        includeTypes: []
      }
    };
    
    threatIntelligenceAggregator = new ThreatIntelligenceAggregator(config);
  }
  return threatIntelligenceAggregator;
}
