// Threat Intelligence Aggregator
// Mock implementation for deployment

export interface ThreatData {
  id: string;
  name: string;
  source: string;
  type: string;
  severity: string;
  description: string;
  indicators: {
    domains: string[];
    ips: string[];
    hashes: string[];
    urls: string[];
  };
  tags: string[];
  confidence: number;
  firstSeen: string;
  lastSeen: string;
  metadata: any;
}

export interface SourceStatus {
  name: string;
  enabled: boolean;
  priority: number;
  lastSync: string;
  status: 'active' | 'error' | 'disabled';
  error?: string;
  metrics: {
    threatsCount: number;
    lastSyncDuration: number;
    apiCalls: number;
  };
}

export class ThreatIntelligenceAggregator {
  private threats: ThreatData[] = [];
  private sources: SourceStatus[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock threat data
    this.threats = [
      {
        id: 'threat-1',
        name: 'Sophisticated Phishing Campaign',
        source: 'MISP',
        type: 'phishing',
        severity: 'high',
        description: 'Targeted phishing campaign against financial institutions with advanced social engineering techniques',
        indicators: {
          domains: ['secure-bank-update.com', 'account-verification-urgent.com'],
          ips: ['192.168.1.100', '10.0.0.50'],
          hashes: ['a1b2c3d4e5f6', 'f6e5d4c3b2a1'],
          urls: ['https://secure-bank-update.com/login', 'https://account-verification-urgent.com']
        },
        tags: ['phishing', 'financial', 'social_engineering'],
        confidence: 0.92,
        firstSeen: '2024-01-15T10:00:00Z',
        lastSeen: '2024-01-20T15:30:00Z',
        metadata: {
          originalSource: 'MISP',
          sourceId: 'event-12345',
          raw: {}
        }
      },
      {
        id: 'threat-2',
        name: 'Ransomware Variant Detected',
        source: 'VirusTotal',
        type: 'malware',
        severity: 'critical',
        description: 'New ransomware variant targeting enterprise systems with double extortion tactics',
        indicators: {
          domains: ['malicious-c2.com'],
          ips: ['203.0.113.10', '198.51.100.20'],
          hashes: ['b2c3d4e5f6a7', 'a7f6e5d4c3b2'],
          urls: ['https://malicious-c2.com/api']
        },
        tags: ['ransomware', 'malware', 'extortion'],
        confidence: 0.88,
        firstSeen: '2024-01-10T08:15:00Z',
        lastSeen: '2024-01-18T12:45:00Z',
        metadata: {
          originalSource: 'VirusTotal',
          sourceId: 'file-67890',
          raw: {}
        }
      },
      {
        id: 'threat-3',
        name: 'Phishing Website Cluster',
        source: 'PhishTank',
        type: 'phishing',
        severity: 'medium',
        description: 'Cluster of phishing websites impersonating popular e-commerce platforms',
        indicators: {
          domains: ['fake-shop-secure.com', 'store-login-verify.com'],
          ips: ['172.16.0.1', '10.1.1.1'],
          hashes: ['c3d4e5f6a7b8'],
          urls: ['https://fake-shop-secure.com']
        },
        tags: ['phishing', 'ecommerce', 'impersonation'],
        confidence: 0.75,
        firstSeen: '2024-01-12T14:20:00Z',
        lastSeen: '2024-01-19T09:15:00Z',
        metadata: {
          originalSource: 'PhishTank',
          sourceId: 'entry-54321',
          raw: {}
        }
      }
    ];

    // Mock source status
    this.sources = [
      {
        name: 'MISP',
        enabled: true,
        priority: 1,
        lastSync: new Date().toISOString(),
        status: 'active',
        metrics: {
          threatsCount: 1250,
          lastSyncDuration: 2500,
          apiCalls: 156
        }
      },
      {
        name: 'VirusTotal',
        enabled: true,
        priority: 2,
        lastSync: new Date().toISOString(),
        status: 'active',
        metrics: {
          threatsCount: 3420,
          lastSyncDuration: 1800,
          apiCalls: 89
        }
      },
      {
        name: 'PhishTank',
        enabled: true,
        priority: 3,
        lastSync: new Date().toISOString(),
        status: 'active',
        metrics: {
          threatsCount: 890,
          lastSyncDuration: 1200,
          apiCalls: 45
        }
      }
    ];
  }

  async getThreats(options: any = {}): Promise<ThreatData[]> {
    try {
      let filteredThreats = [...this.threats];

      // Apply filters
      if (options.type) {
        filteredThreats = filteredThreats.filter(t => t.type === options.type);
      }
      if (options.severity) {
        filteredThreats = filteredThreats.filter(t => t.severity === options.severity);
      }
      if (options.source) {
        filteredThreats = filteredThreats.filter(t => t.source === options.source);
      }
      if (options.tags) {
        filteredThreats = filteredThreats.filter(t => 
          options.tags.some((tag: string) => t.tags.includes(tag))
        );
      }
      if (options.confidence) {
        filteredThreats = filteredThreats.filter(t => t.confidence >= options.confidence);
      }
      if (options.limit) {
        filteredThreats = filteredThreats.slice(0, options.limit);
      }

      // Sort by priority and timestamp
      return filteredThreats.sort((a, b) => {
        const aPriority = this.getSourcePriority(a.source);
        const bPriority = this.getSourcePriority(b.source);
        
        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }
        
        return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
      });
    } catch (error) {
      console.error('Get threats error:', error);
      throw new Error(`Failed to get threats: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async searchThreats(query: string, options: any = {}): Promise<ThreatData[]> {
    try {
      const allThreats = await this.getThreats();
      
      return allThreats.filter(threat => {
        const searchText = query.toLowerCase();
        return (
          threat.name.toLowerCase().includes(searchText) ||
          threat.description.toLowerCase().includes(searchText) ||
          threat.tags.some(tag => tag.toLowerCase().includes(searchText)) ||
          threat.indicators.domains.some(domain => domain.toLowerCase().includes(searchText)) ||
          threat.indicators.ips.some(ip => ip.includes(searchText)) ||
          threat.indicators.hashes.some(hash => hash.toLowerCase().includes(searchText))
        );
      });
    } catch (error) {
      console.error('Search threats error:', error);
      throw new Error(`Failed to search threats: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getSourceStatus(): Promise<SourceStatus[]> {
    try {
      return [...this.sources];
    } catch (error) {
      console.error('Get source status error:', error);
      throw new Error(`Failed to get source status: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getStatistics(): Promise<any> {
    try {
      const threats = await this.getThreats();
      const sources = await this.getSourceStatus();

      return {
        totalThreats: threats.length,
        sources: sources.length,
        activeSources: sources.filter(s => s.status === 'active').length,
        threatsByType: this.calculateThreatsByType(threats),
        threatsBySeverity: this.calculateThreatsBySeverity(threats),
        threatsBySource: this.calculateThreatsBySource(threats),
        averageConfidence: this.calculateAverageConfidence(threats),
        lastSync: sources.reduce((latest, source) => {
          const sourceTime = new Date(source.lastSync).getTime();
          const latestTime = new Date(latest.lastSync).getTime();
          return sourceTime > latestTime ? source : latest;
        }).lastSync,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Get statistics error:', error);
      throw new Error(`Failed to get statistics: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async syncAllSources(): Promise<void> {
    try {
      // Mock sync - update last sync time
      this.sources = this.sources.map(source => ({
        ...source,
        lastSync: new Date().toISOString(),
        status: 'active' as const,
        metrics: {
          ...source.metrics,
          lastSyncDuration: Math.random() * 3000 + 1000,
          apiCalls: source.metrics.apiCalls + Math.floor(Math.random() * 10) + 1
        }
      }));

      console.log('All sources synced successfully');
    } catch (error) {
      console.error('Sync sources error:', error);
      throw new Error(`Failed to sync sources: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private getSourcePriority(source: string): number {
    const sourceInfo = this.sources.find(s => s.name === source);
    return sourceInfo ? sourceInfo.priority : 999;
  }

  private calculateThreatsByType(threats: ThreatData[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    threats.forEach(threat => {
      distribution[threat.type] = (distribution[threat.type] || 0) + 1;
    });
    return distribution;
  }

  private calculateThreatsBySeverity(threats: ThreatData[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    threats.forEach(threat => {
      distribution[threat.severity] = (distribution[threat.severity] || 0) + 1;
    });
    return distribution;
  }

  private calculateThreatsBySource(threats: ThreatData[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    threats.forEach(threat => {
      distribution[threat.source] = (distribution[threat.source] || 0) + 1;
    });
    return distribution;
  }

  private calculateAverageConfidence(threats: ThreatData[]): number {
    if (threats.length === 0) return 0;
    
    const totalConfidence = threats.reduce((sum, threat) => sum + threat.confidence, 0);
    return Math.round((totalConfidence / threats.length) * 100) / 100;
  }
}

// Singleton instance
let threatIntelligenceAggregator: ThreatIntelligenceAggregator | null = null;

export function getThreatIntelligenceAggregator(): ThreatIntelligenceAggregator {
  if (!threatIntelligenceAggregator) {
    threatIntelligenceAggregator = new ThreatIntelligenceAggregator();
  }
  return threatIntelligenceAggregator;
}
