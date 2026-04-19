// Threat Intelligence Aggregator
// Enhanced with ML integration for intelligent threat analysis

import { mlTrainingService } from '@/lib/ml/ml-training-service';
import { threatPredictionService } from '@/lib/ml/threat-prediction-service';
import { anomalyDetectionService } from '@/lib/ml/anomaly-detection-service';

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
  mlInsights?: {
    classification: string;
    riskScore: number;
    confidence: number;
    predictions: Array<{
      threatType: string;
      probability: number;
      timeframe: string;
      factors: Array<{ name: string; weight: number; value: number; }>;
    }>;
    anomalies?: Array<{
      type: string;
      severity: string;
      confidence: number;
      description: string;
      indicators: Array<{ name: string; value: number; threshold: number; }>;
    }>;
  };
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

      // Apply ML analysis if enabled
      if (options.enableMLAnalysis) {
        filteredThreats = await this.applyMLAnalysis(filteredThreats);
      }

      // Sort by priority and date
      filteredThreats.sort((a, b) => {
        const severityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
        const severityDiff = (severityOrder[b.severity as keyof typeof severityOrder] || 0) - 
                           (severityOrder[a.severity as keyof typeof severityOrder] || 0);
        if (severityDiff !== 0) return severityDiff;
        return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
      });

      // Apply limit
      if (options.limit) {
        filteredThreats = filteredThreats.slice(0, options.limit);
      }

      return filteredThreats;
    } catch (error) {
      console.error('Failed to get threats:', error);
      throw error;
    }
  }

  async searchThreats(query: string, options: any = {}): Promise<ThreatData[]> {
    try {
      const allThreats = await this.getThreats(options);
      
      return allThreats.filter(threat => 
        threat.name.toLowerCase().includes(query.toLowerCase()) ||
        threat.description.toLowerCase().includes(query.toLowerCase()) ||
        threat.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase())) ||
        threat.indicators.domains.some((domain: string) => domain.toLowerCase().includes(query.toLowerCase())) ||
        threat.indicators.ips.some((ip: string) => ip.includes(query)) ||
        threat.indicators.hashes.some((hash: string) => hash.toLowerCase().includes(query.toLowerCase()))
      );
    } catch (error) {
      console.error('Failed to search threats:', error);
      throw error;
    }
  }

  async getSourceStatus(): Promise<SourceStatus[]> {
    try {
      return this.sources;
    } catch (error) {
      console.error('Failed to get source status:', error);
      throw error;
    }
  }

  async getStatistics(): Promise<any> {
    try {
      const threats = this.threats;
      const sources = this.sources;
      
      return {
        totalThreats: threats.length,
        sources: sources.length,
        activeSources: sources.filter(s => s.enabled).length,
        threatsByType: this.calculateThreatsByType(threats),
        threatsBySeverity: this.calculateThreatsBySeverity(threats),
        threatsBySource: this.calculateThreatsBySource(threats),
        averageConfidence: this.calculateAverageConfidence(threats),
        lastSync: sources.reduce((latest, source) => {
          return !latest || new Date(source.lastSync) > new Date(latest) ? source.lastSync : latest;
        }, ''),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to get statistics:', error);
      throw error;
    }
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
    
    const sum = threats.reduce((sum, threat) => sum + threat.confidence, 0);
    return sum / threats.length;
  }

  // Apply ML analysis to threats
  private async applyMLAnalysis(threats: ThreatData[]): Promise<ThreatData[]> {
    try {
      const analyzedThreats = await Promise.all(
        threats.map(async (threat) => {
          try {
            // Get ML classification
            const classification = await this.classifyThreat(threat);
            
            // Get threat predictions
            const predictions = await this.getPredictions(threat);
            
            // Check for anomalies
            const anomalies = await this.detectAnomalies(threat);

            // Calculate risk score
            const riskScore = this.calculateRiskScore(threat, classification, predictions, anomalies);

            return {
              ...threat,
              mlInsights: {
                classification,
                riskScore,
                confidence: classification.confidence,
                predictions,
                anomalies
              }
            };
          } catch (error) {
            console.error(`Failed to analyze threat ${threat.id}:`, error);
            return threat; // Return original threat if analysis fails
          }
        })
      );

      return analyzedThreats;
    } catch (error) {
      console.error('Failed to apply ML analysis:', error);
      return threats; // Return original threats if analysis fails
    }
  }

  // Classify threat using ML models
  private async classifyThreat(threat: ThreatData): Promise<any> {
    try {
      // Mock ML classification
      const classificationMap: Record<string, string> = {
        'malware': 'malicious',
        'phishing': 'social_engineering',
        'apt': 'advanced_persistent_threat',
        'ransomware': 'malicious',
        'ddos': 'network_attack'
      };

      const baseClassification = classificationMap[threat.type] || 'unknown';
      const confidence = threat.confidence * 0.9; // Adjust confidence based on source

      return {
        classification: baseClassification,
        confidence,
        modelUsed: 'threat_classifier_v2',
        processingTime: 15
      };
    } catch (error) {
      console.error('Failed to classify threat:', error);
      return {
        classification: 'unknown',
        confidence: 0.5,
        modelUsed: 'fallback',
        processingTime: 0
      };
    }
  }

  // Get threat predictions
  private async getPredictions(threat: ThreatData): Promise<any[]> {
    try {
      // Mock threat predictions
      const timeframes = ['1h', '6h', '24h', '7d'];
      
      return timeframes.map(timeframe => ({
        threatType: threat.type,
        probability: Math.random() * 0.3 + 0.1, // 10-40% probability
        timeframe,
        factors: [
          { name: 'historical_trend', weight: 0.3, value: Math.random() },
          { name: 'source_confidence', weight: 0.2, value: threat.confidence },
          { name: 'threat_frequency', weight: 0.25, value: Math.random() },
          { name: 'environmental_risk', weight: 0.25, value: Math.random() }
        ]
      }));
    } catch (error) {
      console.error('Failed to get predictions:', error);
      return [];
    }
  }

  // Detect anomalies in threat data
  private async detectAnomalies(threat: ThreatData): Promise<any[]> {
    try {
      const anomalies = [];

      // Check for unusual patterns
      if (threat.confidence > 0.95) {
        anomalies.push({
          type: 'high_confidence',
          severity: 'medium',
          confidence: 0.8,
          description: 'Unusually high confidence score detected',
          indicators: [
            { name: 'confidence_score', value: threat.confidence, threshold: 0.95 }
          ]
        });
      }

      // Check for multiple indicators
      const indicatorCount = Object.values(threat.indicators).reduce((sum, arr) => sum + arr.length, 0);
      if (indicatorCount > 5) {
        anomalies.push({
          type: 'multiple_indicators',
          severity: 'low',
          confidence: 0.6,
          description: 'Unusually high number of indicators',
          indicators: [
            { name: 'indicator_count', value: indicatorCount, threshold: 5 }
          ]
        });
      }

      return anomalies;
    } catch (error) {
      console.error('Failed to detect anomalies:', error);
      return [];
    }
  }

  // Calculate risk score
  private calculateRiskScore(
    threat: ThreatData, 
    classification: any, 
    predictions: any[], 
    anomalies: any[]
  ): number {
    try {
      let riskScore = 0;

      // Base risk from severity
      const severityScores = { 'critical': 0.9, 'high': 0.7, 'medium': 0.5, 'low': 0.3 };
      riskScore += severityScores[threat.severity as keyof typeof severityScores] || 0.3;

      // Adjust based on classification
      if (classification.classification === 'malicious') {
        riskScore += 0.2;
      } else if (classification.classification === 'unknown') {
        riskScore -= 0.1;
      }

      // Adjust based on confidence
      riskScore *= classification.confidence;

      // Add prediction impact
      const maxPredictionProbability = Math.max(...predictions.map(p => p.probability));
      riskScore += maxPredictionProbability * 0.1;

      // Add anomaly impact
      const anomalyImpact = anomalies.reduce((sum, a) => sum + (a.confidence * 0.05), 0);
      riskScore += anomalyImpact;

      return Math.min(1.0, Math.max(0.0, riskScore));
    } catch (error) {
      console.error('Failed to calculate risk score:', error);
      return 0.5;
    }
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
