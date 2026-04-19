// Intelligence Fusion Service
// Multi-source intelligence fusion and correlation engine

import { PrismaClient } from '@prisma/client';
import { getRedisClient } from '@/lib/redis-wrapper';

export interface IntelligenceSource {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'open_source' | 'commercial' | 'government' | 'partner';
  category: 'malware' | 'vulnerability' | 'threat_actor' | 'ioc' | 'campaign' | 'general';
  priority: 'low' | 'medium' | 'high' | 'critical';
  reliability: number; // 0-1
  timeliness: number; // 0-1
  confidence: number; // 0-1
  enabled: boolean;
  api_config?: APIConfig;
  feed_config?: FeedConfig;
  last_sync: string;
  sync_frequency: number; // minutes
  metrics: SourceMetrics;
  created_at: string;
  updated_at: string;
}

export interface APIConfig {
  endpoint: string;
  authentication: 'api_key' | 'oauth' | 'certificate' | 'basic';
  credentials: Record<string, string>;
  headers: Record<string, string>;
  rate_limit: {
    requests_per_minute: number;
    burst_limit: number;
  };
  timeout: number; // seconds
  retry_policy: RetryPolicy;
}

export interface FeedConfig {
  format: 'stix' | 'taxii' | 'json' | 'xml' | 'csv' | 'rss';
  url: string;
  polling_interval: number; // minutes
  parser_config: Record<string, any>;
  authentication?: APIConfig['authentication'];
  credentials?: Record<string, string>;
}

export interface RetryPolicy {
  max_attempts: number;
  backoff_type: 'fixed' | 'exponential' | 'linear';
  base_delay: number; // seconds
  max_delay: number; // seconds;
  retry_on: ('failure' | 'timeout' | 'error')[];
}

export interface SourceMetrics {
  total_items: number;
  successful_syncs: number;
  failed_syncs: number;
  average_sync_time: number;
  last_sync_duration: number;
  error_rate: number;
  data_quality_score: number;
}

export interface IntelligenceItem {
  id: string;
  source_id: string;
  external_id?: string;
  type: 'indicator' | 'threat_actor' | 'campaign' | 'malware' | 'vulnerability' | 'report' | 'alert';
  title: string;
  description: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  reliability: number;
  timestamp: string;
  first_seen: string;
  last_seen: string;
  tags: string[];
  indicators: Indicator[];
  attributes: Record<string, any>;
  context: ItemContext;
  relationships: Relationship[];
  analysis: ItemAnalysis;
  created_at: string;
  updated_at: string;
}

export interface Indicator {
  id: string;
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'file' | 'registry' | 'process' | 'certificate';
  value: string;
  confidence: number;
  source: string;
  context: string;
  first_seen: string;
  last_seen: string;
  tags: string[];
  reputation: IndicatorReputation;
}

export interface IndicatorReputation {
  malicious_score: number;
  suspicious_score: number;
  benign_score: number;
  sources_count: number;
  last_updated: string;
  categories: string[];
}

export interface ItemContext {
  geo_location?: {
    country: string;
    region: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  threat_actor?: {
    name: string;
    alias: string[];
    motivation: string;
    capabilities: string[];
    target_industries: string[];
  };
  campaign?: {
    name: string;
    description: string;
    start_date: string;
    end_date?: string;
    target_regions: string[];
    tactics: string[];
  };
  malware?: {
    family: string;
    variant?: string;
    type: string;
    capabilities: string[];
    delivery_method: string[];
  };
  vulnerability?: {
    cve_id: string;
    cvss_score: number;
    severity: string;
    affected_products: string[];
    patch_available: boolean;
  };
}

export interface Relationship {
  id: string;
  type: 'related_to' | 'associated_with' | 'derived_from' | 'targets' | 'uses' | 'part_of';
  target_id: string;
  target_type: string;
  confidence: number;
  source: string;
  description: string;
}

export interface ItemAnalysis {
  fusion_score: number;
  correlation_count: number;
  related_items: string[];
  anomalies: Anomaly[];
  risk_assessment: RiskAssessment;
  recommendations: string[];
}

export interface Anomaly {
  type: 'unusual_pattern' | 'outlier' | 'correlation_spike' | 'temporal_anomaly';
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  detected_at: string;
  indicators: string[];
}

export interface RiskAssessment {
  overall_risk: 'low' | 'medium' | 'high' | 'critical';
  risk_factors: RiskFactor[];
  risk_score: number;
  time_to_impact: number; // days
  impact_assessment: string;
}

export interface RiskFactor {
  factor: string;
  weight: number;
  score: number;
  description: string;
}

export interface FusionRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  conditions: RuleCondition[];
  actions: RuleAction[];
  confidence_threshold: number;
  correlation_window: number; // hours
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface RuleCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'not_in' | 'contains' | 'regex';
  value: any;
  weight: number;
  required: boolean;
}

export interface RuleAction {
  type: 'correlate' | 'enrich' | 'escalate' | 'create_alert' | 'update_reputation';
  parameters: Record<string, any>;
  priority: number;
}

export interface FusionResult {
  id: string;
  rule_id: string;
  items: string[];
  confidence: number;
  risk_score: number;
  correlations: Correlation[];
  analysis: string;
  recommendations: string[];
  created_at: string;
}

export interface Correlation {
  type: 'indicator_overlap' | 'temporal_proximity' | 'attribution_link' | 'campaign_association';
  strength: number;
  description: string;
  evidence: string[];
  confidence: number;
}

export interface IntelligenceFusionConfig {
  correlation_threshold: number;
  confidence_threshold: number;
  temporal_window: number; // hours
  geographic_proximity: number; // km
  semantic_similarity: number;
  enable_ml: boolean;
  enable_graph_analysis: boolean;
  enable_anomaly_detection: boolean;
  fusion_rules: FusionRule[];
}

class IntelligenceFusionService {
  private prisma: PrismaClient;
  private redis: any;
  private sources: Map<string, IntelligenceSource> = new Map();
  private items: Map<string, IntelligenceItem> = new Map();
  private rules: Map<string, FusionRule> = new Map();
  private config!: IntelligenceFusionConfig;
  private isProcessing = false;

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = getRedisClient();
    this.initializeDefaultConfig();
    this.initializeDefaultSources();
    this.initializeDefaultRules();
    this.startFusionProcessor();
  }

  // Add intelligence source
  async addSource(source: Omit<IntelligenceSource, 'id' | 'created_at' | 'updated_at' | 'metrics'>): Promise<IntelligenceSource> {
    try {
      const newSource: IntelligenceSource = {
        ...source,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metrics: {
          total_items: 0,
          successful_syncs: 0,
          failed_syncs: 0,
          average_sync_time: 0,
          last_sync_duration: 0,
          error_rate: 0,
          data_quality_score: 0
        }
      };

      // Store in database
      await this.prisma.intelligenceSource.create({
        data: {
          id: newSource.id,
          name: newSource.name,
          type: newSource.type,
          category: newSource.category,
          priority: newSource.priority,
          reliability: newSource.reliability,
          timeliness: newSource.timeliness,
          confidence: newSource.confidence,
          enabled: newSource.enabled,
          apiConfig: newSource.api_config ? JSON.stringify(newSource.api_config) : null,
          feedConfig: newSource.feed_config ? JSON.stringify(newSource.feed_config) : null,
          lastSync: new Date(newSource.last_sync),
          syncFrequency: newSource.sync_frequency,
          metrics: JSON.stringify(newSource.metrics),
          createdAt: new Date(newSource.created_at),
          updatedAt: new Date(newSource.updated_at)
        }
      });

      // Store in memory
      this.sources.set(newSource.id, newSource);

      return newSource;
    } catch (error) {
      console.error('Failed to add intelligence source:', error);
      throw error;
    }
  }

  // Ingest intelligence data
  async ingestIntelligence(sourceId: string, data: any[]): Promise<IntelligenceItem[]> {
    try {
      const source = this.sources.get(sourceId);
      if (!source) {
        throw new Error(`Source ${sourceId} not found`);
      }

      const items: IntelligenceItem[] = [];

      for (const itemData of data) {
        const item = await this.processIntelligenceItem(sourceId, itemData);
        if (item) {
          items.push(item);
          this.items.set(item.id, item);
        }
      }

      // Update source metrics
      source.metrics.total_items += items.length;
      source.metrics.successful_syncs++;
      source.metrics.last_sync_duration = Date.now() - Date.now(); // Would calculate actual duration
      source.last_sync = new Date().toISOString();

      // Trigger fusion processing
      await this.triggerFusionProcessing(items);

      return items;
    } catch (error) {
      console.error('Failed to ingest intelligence:', error);
      throw error;
    }
  }

  // Process individual intelligence item
  private async processIntelligenceItem(sourceId: string, itemData: any): Promise<IntelligenceItem | null> {
    try {
      const source = this.sources.get(sourceId);
      if (!source) return null;

      // Extract and normalize data
      const item: IntelligenceItem = {
        id: crypto.randomUUID(),
        source_id: sourceId,
        external_id: itemData.id || itemData.external_id,
        type: this.normalizeType(itemData.type),
        title: itemData.title || itemData.name || 'Unknown',
        description: itemData.description || '',
        severity: this.normalizeSeverity(itemData.severity),
        confidence: this.calculateConfidence(itemData.confidence, source.confidence),
        reliability: source.reliability,
        timestamp: itemData.timestamp || new Date().toISOString(),
        first_seen: itemData.first_seen || itemData.timestamp || new Date().toISOString(),
        last_seen: itemData.last_seen || itemData.timestamp || new Date().toISOString(),
        tags: this.normalizeTags(itemData.tags || []),
        indicators: this.extractIndicators(itemData),
        attributes: this.extractAttributes(itemData),
        context: this.extractContext(itemData),
        relationships: [],
        analysis: {
          fusion_score: 0,
          correlation_count: 0,
          related_items: [],
          anomalies: [],
          risk_assessment: {
            overall_risk: 'low',
            risk_factors: [],
            risk_score: 0,
            time_to_impact: 0,
            impact_assessment: ''
          },
          recommendations: []
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return item;
    } catch (error) {
      console.error('Failed to process intelligence item:', error);
      return null;
    }
  }

  // Normalize item type
  private normalizeType(type: string): IntelligenceItem['type'] {
    const typeMap: Record<string, IntelligenceItem['type']> = {
      'indicator': 'indicator',
      'ioc': 'indicator',
      'threat_actor': 'threat_actor',
      'actor': 'threat_actor',
      'campaign': 'campaign',
      'malware': 'malware',
      'vulnerability': 'vulnerability',
      'cve': 'vulnerability',
      'report': 'report',
      'alert': 'alert',
      'sighting': 'alert'
    };

    return typeMap[type.toLowerCase()] || 'indicator';
  }

  // Normalize severity
  private normalizeSeverity(severity: string): IntelligenceItem['severity'] {
    const severityMap: Record<string, IntelligenceItem['severity']> = {
      'info': 'info',
      'low': 'low',
      'medium': 'medium',
      'high': 'high',
      'critical': 'critical',
      '1': 'info',
      '2': 'low',
      '3': 'medium',
      '4': 'high',
      '5': 'critical'
    };

    return severityMap[severity.toLowerCase()] || 'info';
  }

  // Calculate confidence
  private calculateConfidence(itemConfidence: number, sourceConfidence: number): number {
    const itemConf = itemConfidence || 0.5;
    const sourceConf = sourceConfidence || 0.5;
    return Math.min(1.0, (itemConf + sourceConf) / 2);
  }

  // Normalize tags
  private normalizeTags(tags: string[]): string[] {
    return tags.map(tag => tag.toLowerCase().trim()).filter((tag, index, arr) => arr.indexOf(tag) === index);
  }

  // Extract indicators
  private extractIndicators(itemData: any): Indicator[] {
    const indicators: Indicator[] = [];

    // Extract IP addresses
    if (itemData.ip) {
      indicators.push({
        id: crypto.randomUUID(),
        type: 'ip',
        value: itemData.ip,
        confidence: 0.8,
        source: 'extracted',
        context: 'source_ip',
        first_seen: itemData.first_seen || new Date().toISOString(),
        last_seen: itemData.last_seen || new Date().toISOString(),
        tags: ['extracted'],
        reputation: {
          malicious_score: 0,
          suspicious_score: 0,
          benign_score: 0,
          sources_count: 1,
          last_updated: new Date().toISOString(),
          categories: []
        }
      });
    }

    // Extract domains
    if (itemData.domain) {
      indicators.push({
        id: crypto.randomUUID(),
        type: 'domain',
        value: itemData.domain,
        confidence: 0.8,
        source: 'extracted',
        context: 'domain',
        first_seen: itemData.first_seen || new Date().toISOString(),
        last_seen: itemData.last_seen || new Date().toISOString(),
        tags: ['extracted'],
        reputation: {
          malicious_score: 0,
          suspicious_score: 0,
          benign_score: 0,
          sources_count: 1,
          last_updated: new Date().toISOString(),
          categories: []
        }
      });
    }

    // Extract hashes
    if (itemData.hash || itemData.md5 || itemData.sha256) {
      const hash = itemData.hash || itemData.md5 || itemData.sha256;
      indicators.push({
        id: crypto.randomUUID(),
        type: 'hash',
        value: hash,
        confidence: 0.9,
        source: 'extracted',
        context: 'file_hash',
        first_seen: itemData.first_seen || new Date().toISOString(),
        last_seen: itemData.last_seen || new Date().toISOString(),
        tags: ['extracted'],
        reputation: {
          malicious_score: 0,
          suspicious_score: 0,
          benign_score: 0,
          sources_count: 1,
          last_updated: new Date().toISOString(),
          categories: []
        }
      });
    }

    return indicators;
  }

  // Extract attributes
  private extractAttributes(itemData: any): Record<string, any> {
    const attributes: Record<string, any> = {};

    // Copy relevant fields
    const relevantFields = ['cve_id', 'cvss_score', 'malware_family', 'threat_actor', 'campaign', 'target_industry'];
    relevantFields.forEach(field => {
      if (itemData[field]) {
        attributes[field] = itemData[field];
      }
    });

    return attributes;
  }

  // Extract context
  private extractContext(itemData: any): ItemContext {
    const context: ItemContext = {};

    // Geo location
    if (itemData.country || itemData.geo_location) {
      context.geo_location = {
        country: itemData.country || 'Unknown',
        region: itemData.region || '',
        city: itemData.city || '',
        latitude: itemData.latitude || 0,
        longitude: itemData.longitude || 0
      };
    }

    // Threat actor
    if (itemData.threat_actor || itemData.actor) {
      context.threat_actor = {
        name: itemData.threat_actor || itemData.actor,
        alias: itemData.actor_alias || [],
        motivation: itemData.motivation || '',
        capabilities: itemData.capabilities || [],
        target_industries: itemData.target_industries || []
      };
    }

    // Campaign
    if (itemData.campaign) {
      context.campaign = {
        name: itemData.campaign,
        description: itemData.campaign_description || '',
        start_date: itemData.campaign_start || new Date().toISOString(),
        end_date: itemData.campaign_end,
        target_regions: itemData.target_regions || [],
        tactics: itemData.tactics || []
      };
    }

    // Malware
    if (itemData.malware_family || itemData.malware) {
      context.malware = {
        family: itemData.malware_family || itemData.malware,
        variant: itemData.malware_variant,
        type: itemData.malware_type || '',
        capabilities: itemData.malware_capabilities || [],
        delivery_method: itemData.delivery_method || []
      };
    }

    // Vulnerability
    if (itemData.cve_id || itemData.vulnerability) {
      context.vulnerability = {
        cve_id: itemData.cve_id || itemData.vulnerability,
        cvss_score: itemData.cvss_score || 0,
        severity: itemData.vulnerability_severity || '',
        affected_products: itemData.affected_products || [],
        patch_available: itemData.patch_available || false
      };
    }

    return context;
  }

  // Trigger fusion processing
  private async triggerFusionProcessing(items: IntelligenceItem[]): Promise<void> {
    try {
      // Add items to processing queue
      for (const item of items) {
        await this.redis.lpush('fusion_queue', JSON.stringify(item));
      }

      // Wake up processor if sleeping
      this.isProcessing = true;
    } catch (error) {
      console.error('Failed to trigger fusion processing:', error);
    }
  }

  // Process fusion queue
  private async processFusionQueue(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;

    try {
      while (true) {
        const itemData = await this.redis.brpop('fusion_queue', 1);
        if (!itemData) {
          break;
        }

        try {
          const item: IntelligenceItem = JSON.parse(itemData[1]);
          await this.performFusionAnalysis(item);
        } catch (error) {
          console.error('Failed to process fusion item:', error);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  // Perform fusion analysis
  private async performFusionAnalysis(item: IntelligenceItem): Promise<void> {
    try {
      // Find related items
      const relatedItems = await this.findRelatedItems(item);

      // Apply fusion rules
      const fusionResults = await this.applyFusionRules(item, relatedItems);

      // Update item analysis
      item.analysis.fusion_score = this.calculateFusionScore(item, relatedItems);
      item.analysis.correlation_count = relatedItems.length;
      item.analysis.related_items = relatedItems.map(i => i.id);
      item.analysis.anomalies = this.detectAnomalies(item, relatedItems);
      item.analysis.risk_assessment = this.assessRisk(item, relatedItems);
      item.analysis.recommendations = this.generateRecommendations(item, relatedItems);

      // Store fusion results
      for (const result of fusionResults) {
        await this.storeFusionResult(result);
      }

      // Update item in memory
      this.items.set(item.id, item);

    } catch (error) {
      console.error('Failed to perform fusion analysis:', error);
    }
  }

  // Find related items
  private async findRelatedItems(item: IntelligenceItem): Promise<IntelligenceItem[]> {
    try {
      const related: IntelligenceItem[] = [];
      const allItems = Array.from(this.items.values());

      for (const otherItem of allItems) {
        if (otherItem.id === item.id) continue;

        // Check for indicator overlap
        const indicatorOverlap = this.calculateIndicatorOverlap(item, otherItem);
        if (indicatorOverlap > this.config.correlation_threshold) {
          related.push(otherItem);
          continue;
        }

        // Check temporal proximity
        const temporalProximity = this.calculateTemporalProximity(item, otherItem);
        if (temporalProximity > this.config.correlation_threshold) {
          related.push(otherItem);
          continue;
        }

        // Check semantic similarity
        const semanticSimilarity = this.calculateSemanticSimilarity(item, otherItem);
        if (semanticSimilarity > this.config.semantic_similarity) {
          related.push(otherItem);
          continue;
        }
      }

      return related;
    } catch (error) {
      console.error('Failed to find related items:', error);
      return [];
    }
  }

  // Calculate indicator overlap
  private calculateIndicatorOverlap(item1: IntelligenceItem, item2: IntelligenceItem): number {
    const indicators1 = new Set(item1.indicators.map(i => i.value));
    const indicators2 = new Set(item2.indicators.map(i => i.value));

    const intersection = new Set(Array.from(indicators1).filter(i => indicators2.has(i)));
    const union = new Set([...Array.from(indicators1), ...Array.from(indicators2)]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }

  // Calculate temporal proximity
  private calculateTemporalProximity(item1: IntelligenceItem, item2: IntelligenceItem): number {
    const time1 = new Date(item1.timestamp).getTime();
    const time2 = new Date(item2.timestamp).getTime();
    const timeDiff = Math.abs(time1 - time2);
    const window = this.config.temporal_window * 60 * 60 * 1000; // Convert to milliseconds

    return Math.max(0, 1 - (timeDiff / window));
  }

  // Calculate semantic similarity
  private calculateSemanticSimilarity(item1: IntelligenceItem, item2: IntelligenceItem): number {
    // Simple text similarity - in production, use NLP models
    const text1 = `${item1.title} ${item1.description}`.toLowerCase();
    const text2 = `${item2.title} ${item2.description}`.toLowerCase();

    const words1 = new Set(text1.split(/\s+/));
    const words2 = new Set(text2.split(/\s+/));

    const intersection = new Set(Array.from(words1).filter(w => words2.has(w)));
    const union = new Set([...Array.from(words1), ...Array.from(words2)]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }

  // Apply fusion rules
  private async applyFusionRules(item: IntelligenceItem, relatedItems: IntelligenceItem[]): Promise<FusionResult[]> {
    try {
      const results: FusionResult[] = [];

      for (const rule of Array.from(this.rules.values())) {
        if (!rule.enabled) continue;

        const ruleResult = await this.evaluateRule(rule, item, relatedItems);
        if (ruleResult) {
          results.push(ruleResult);
        }
      }

      return results;
    } catch (error) {
      console.error('Failed to apply fusion rules:', error);
      return [];
    }
  }

  // Evaluate fusion rule
  private async evaluateRule(rule: FusionRule, item: IntelligenceItem, relatedItems: IntelligenceItem[]): Promise<FusionResult | null> {
    try {
      // Check if rule conditions are met
      const conditionsMet = this.evaluateRuleConditions(rule.conditions, item, relatedItems);
      if (!conditionsMet) return null;

      // Create fusion result
      const result: FusionResult = {
        id: crypto.randomUUID(),
        rule_id: rule.id,
        items: [item.id, ...relatedItems.map(i => i.id)],
        confidence: this.calculateConfidence(item.confidence, 0.8),
        risk_score: this.assessRisk(item, relatedItems).risk_score,
        correlations: this.generateCorrelations(item, relatedItems)
        analysis: `Fusion rule "${rule.name}" triggered`,
        recommendations: this.generateRecommendations(item, relatedItems),
        created_at: new Date().toISOString()
      };

      return result;
    } catch (error) {
      console.error('Failed to evaluate fusion rule:', error);
      return null;
    }
  }

  // Evaluate rule conditions
  private evaluateRuleConditions(conditions: RuleCondition[], item: IntelligenceItem, relatedItems: IntelligenceItem[]): boolean {
    try {
      for (const condition of conditions) {
        if (!this.evaluateCondition(condition, item, relatedItems)) {
          if (condition.required) return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Failed to evaluate rule conditions:', error);
      return false;
    }
  }

  // Evaluate individual condition
  private evaluateCondition(condition: RuleCondition, item: IntelligenceItem, relatedItems: IntelligenceItem[]): boolean {
    try {
      let value: any;

      // Get field value
      switch (condition.field) {
        case 'severity':
          value = item.severity;
          break;
        case 'confidence':
          value = item.confidence;
          break;
        case 'type':
          value = item.type;
          break;
        case 'correlation_count':
          value = relatedItems.length;
          break;
        case 'has_indicators':
          value = item.indicators.length > 0;
          break;
        case 'has_context':
          value = Object.keys(item.context).length > 0;
          break;
        default:
          value = item.attributes[condition.field];
      }

      // Apply operator
      switch (condition.operator) {
        case 'eq':
          return value === condition.value;
        case 'ne':
          return value !== condition.value;
        case 'gt':
          return Number(value) > Number(condition.value);
        case 'lt':
          return Number(value) < Number(condition.value);
        case 'gte':
          return Number(value) >= Number(condition.value);
        case 'lte':
          return Number(value) <= Number(condition.value);
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(value);
        case 'not_in':
          return Array.isArray(condition.value) && !condition.value.includes(value);
        case 'contains':
          return String(value).includes(String(condition.value));
        case 'regex':
          return new RegExp(condition.value).test(String(value));
        default:
          return false;
      }
    } catch (error) {
      console.error('Failed to evaluate condition:', error);
      return false;
    }
  }

  // Calculate fusion score
  private calculateFusionScore(item: IntelligenceItem, relatedItems: IntelligenceItem[]): number {
    try {
      let score = item.confidence * item.reliability;

      // Add correlation bonus
      const correlationBonus = Math.min(0.3, relatedItems.length * 0.1);
      score += correlationBonus;

      // Add source diversity bonus
      const uniqueSources = new Set([item.source_id, ...relatedItems.map(i => i.source_id)]).size;
      const diversityBonus = Math.min(0.2, uniqueSources * 0.05);
      score += diversityBonus;

      return Math.min(1.0, score);
    } catch (error) {
      console.error('Failed to calculate fusion score:', error);
      return 0;
    }
  }

  // Detect anomalies
  private detectAnomalies(item: IntelligenceItem, relatedItems: IntelligenceItem[]): Anomaly[] {
    try {
      const anomalies: Anomaly[] = [];

      // Check for unusual correlation patterns
      if (relatedItems.length > 10) {
        anomalies.push({
          type: 'correlation_spike',
          description: 'Unusually high number of correlations detected',
          confidence: 0.8,
          impact: 'medium',
          detected_at: new Date().toISOString(),
          indicators: item.indicators.map(i => i.id)
        });
      }

      // Check for temporal anomalies
      const timeSpan = this.calculateTimeSpan(item, relatedItems);
      if (timeSpan < 3600000 && relatedItems.length > 5) { // Less than 1 hour with many correlations
        anomalies.push({
          type: 'temporal_anomaly',
          description: 'High activity concentration in short time period',
          confidence: 0.7,
          impact: 'high',
          detected_at: new Date().toISOString(),
          indicators: item.indicators.map(i => i.id)
        });
      }

      return anomalies;
    } catch (error) {
      console.error('Failed to detect anomalies:', error);
      return [];
    }
  }

  // Calculate time span
  private calculateTimeSpan(item: IntelligenceItem, relatedItems: IntelligenceItem[]): number {
    const timestamps = [item.timestamp, ...relatedItems.map(i => i.timestamp)];
    const times = timestamps.map(t => new Date(t).getTime());
    return Math.max(...times) - Math.min(...times);
  }

  // Assess risk
  private assessRisk(item: IntelligenceItem, relatedItems: IntelligenceItem[]): RiskAssessment {
    try {
      let riskScore = 0;
      const riskFactors: RiskFactor[] = [];

      // Base risk from severity
      const severityScore = this.getSeverityScore(item.severity);
      riskFactors.push({
        factor: 'severity',
        weight: 0.3,
        score: severityScore,
        description: `Item severity: ${item.severity}`
      });
      riskScore += severityScore * 0.3;

      // Confidence factor
      riskFactors.push({
        factor: 'confidence',
        weight: 0.2,
        score: item.confidence,
        description: `Item confidence: ${item.confidence}`
      });
      riskScore += item.confidence * 0.2;

      // Correlation factor
      const correlationScore = Math.min(1.0, relatedItems.length / 10);
      riskFactors.push({
        factor: 'correlations',
        weight: 0.3,
        score: correlationScore,
        description: `Correlation count: ${relatedItems.length}`
      });
      riskScore += correlationScore * 0.3;

      // Source reliability factor
      riskFactors.push({
        factor: 'source_reliability',
        weight: 0.2,
        score: item.reliability,
        description: `Source reliability: ${item.reliability}`
      });
      riskScore += item.reliability * 0.2;

      // Determine overall risk
      const overallRisk = this.getRiskLevel(riskScore);

      return {
        overall_risk: overallRisk,
        risk_factors: riskFactors,
        risk_score: riskScore,
        time_to_impact: this.estimateTimeToImpact(item, relatedItems),
        impact_assessment: this.assessImpact(item, relatedItems)
      };
    } catch (error) {
      console.error('Failed to assess risk:', error);
      return {
        overall_risk: 'low',
        risk_factors: [],
        risk_score: 0,
        time_to_impact: 0,
        impact_assessment: 'Unable to assess impact'
      };
    }
  }

  // Get severity score
  private getSeverityScore(severity: IntelligenceItem['severity']): number {
    const scores: Record<IntelligenceItem['severity'], number> = {
      'info': 0.1,
      'low': 0.3,
      'medium': 0.5,
      'high': 0.8,
      'critical': 1.0
    };
    return scores[severity] || 0.1;
  }

  // Get risk level
  private getRiskLevel(score: number): RiskAssessment['overall_risk'] {
    if (score >= 0.8) return 'critical';
    if (score >= 0.6) return 'high';
    if (score >= 0.4) return 'medium';
    return 'low';
  }

  // Estimate time to impact
  private estimateTimeToImpact(item: IntelligenceItem, relatedItems: IntelligenceItem[]): number {
    // Simple estimation based on severity and correlations
    const baseTime = {
      'info': 30,
      'low': 14,
      'medium': 7,
      'high': 3,
      'critical': 1
    };

    const baseDays = baseTime[item.severity] || 30;
    const correlationReduction = Math.min(0.7, relatedItems.length * 0.1);
    
    return Math.max(1, baseDays * (1 - correlationReduction));
  }

  // Assess impact
  private assessImpact(item: IntelligenceItem, relatedItems: IntelligenceItem[]): string {
    const impactFactors = [];

    if (item.severity === 'critical') {
      impactFactors.push('Critical severity indicates high impact');
    }

    if (relatedItems.length > 5) {
      impactFactors.push('Multiple correlations suggest widespread impact');
    }

    if (item.context.threat_actor) {
      impactFactors.push(`Threat actor ${item.context.threat_actor.name} indicates targeted impact`);
    }

    if (item.context.vulnerability && item.context.vulnerability.cvss_score > 7) {
      impactFactors.push('High CVSS score indicates significant impact');
    }

    return impactFactors.length > 0 ? impactFactors.join('. ') : 'Impact assessment pending further analysis';
  }

  // Generate recommendations
  private generateRecommendations(item: IntelligenceItem, relatedItems: IntelligenceItem[]): string[] {
    const recommendations: string[] = [];

    // Base recommendations
    if (item.severity === 'critical') {
      recommendations.push('Immediate investigation and response required');
    }

    if (item.confidence > 0.8) {
      recommendations.push('High confidence - consider immediate action');
    }

    // Correlation-based recommendations
    if (relatedItems.length > 3) {
      recommendations.push('Multiple sources confirm - elevate priority');
      recommendations.push('Consider creating incident response case');
    }

    // Context-based recommendations
    if (item.context.threat_actor) {
      recommendations.push(`Review TTPs for ${item.context.threat_actor.name}`);
    }

    if (item.context.vulnerability) {
      recommendations.push('Check for available patches and apply immediately');
    }

    // Indicator-based recommendations
    if (item.indicators.length > 0) {
      recommendations.push('Block identified indicators in security controls');
      recommendations.push('Scan systems for indicators of compromise');
    }

    return recommendations;
  }

  // Generate correlations
  private generateCorrelations(item: IntelligenceItem, relatedItems: IntelligenceItem[]): Correlation[] {
    const correlations: Correlation[] = [];

    for (const relatedItem of relatedItems) {
      // Indicator overlap correlation
      const indicatorOverlap = this.calculateIndicatorOverlap(item, relatedItem);
      if (indicatorOverlap > 0.3) {
        correlations.push({
          type: 'indicator_overlap',
          strength: indicatorOverlap,
          description: `Shared indicators between items`,
          evidence: item.indicators.filter(i => 
            relatedItem.indicators.some(ri => ri.value === i.value)
          ).map(i => i.value),
          confidence: indicatorOverlap
        });
      }

      // Temporal proximity correlation
      const temporalProximity = this.calculateTemporalProximity(item, relatedItem);
      if (temporalProximity > 0.3) {
        correlations.push({
          type: 'temporal_proximity',
          strength: temporalProximity,
          description: `Temporal proximity detected`,
          evidence: [`Time difference: ${Math.abs(new Date(item.timestamp).getTime() - new Date(relatedItem.timestamp).getTime()) / 1000} seconds`],
          confidence: temporalProximity
        });
      }
    }

    return correlations;
  }

  // Initialize default configuration
  private initializeDefaultConfig(): void {
    this.config = {
      correlation_threshold: 0.3,
      confidence_threshold: 0.5,
      temporal_window: 24,
      geographic_proximity: 100,
      semantic_similarity: 0.4,
      enable_ml: true,
      enable_graph_analysis: true,
      enable_anomaly_detection: true,
      fusion_rules: []
    };
  }

  // Initialize default sources
  private initializeDefaultSources(): void {
    // Mock sources - in production, these would be loaded from database
    const sources: IntelligenceSource[] = [
      {
        id: 'internal-siem',
        name: 'Internal SIEM',
        type: 'internal',
        category: 'ioc',
        priority: 'high',
        reliability: 0.9,
        timeliness: 0.95,
        confidence: 0.85,
        enabled: true,
        sync_frequency: 5,
        last_sync: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metrics: {
          total_items: 0,
          successful_syncs: 0,
          failed_syncs: 0,
          average_sync_time: 0,
          last_sync_duration: 0,
          error_rate: 0,
          data_quality_score: 0
        }
      },
      {
        id: 'threat-intel-feed',
        name: 'Commercial Threat Intelligence Feed',
        type: 'commercial',
        category: 'general',
        priority: 'high',
        reliability: 0.8,
        timeliness: 0.9,
        confidence: 0.75,
        enabled: true,
        feed_config: {
          format: 'stix',
          url: 'https://api.threatintel.example.com/feed',
          polling_interval: 60,
          parser_config: {}
        },
        sync_frequency: 60,
        last_sync: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metrics: {
          total_items: 0,
          successful_syncs: 0,
          failed_syncs: 0,
          average_sync_time: 0,
          last_sync_duration: 0,
          error_rate: 0,
          data_quality_score: 0
        }
      }
    ];

    sources.forEach(source => this.sources.set(source.id, source));
  }

  // Initialize default rules
  private initializeDefaultRules(): void {
    // High-priority correlation rule
    const highPriorityRule: FusionRule = {
      id: 'high-priority-correlation',
      name: 'High Priority Correlation',
      description: 'Correlate high-priority items across sources',
      enabled: true,
      priority: 1,
      conditions: [
        {
          field: 'severity',
          operator: 'in',
          value: ['high', 'critical'],
          weight: 0.5,
          required: true
        },
        {
          field: 'correlation_count',
          operator: 'gte',
          value: 2,
          weight: 0.3,
          required: true
        },
        {
          field: 'confidence',
          operator: 'gte',
          value: 0.7,
          weight: 0.2,
          required: false
        }
      ],
      actions: [
        {
          type: 'escalate',
          parameters: { priority: 'high', notify: true },
          priority: 1
        },
        {
          type: 'create_alert',
          parameters: { type: 'fusion_correlation' },
          priority: 2
        }
      ],
      confidence_threshold: 0.6,
      correlation_window: 24,
      tags: ['high-priority', 'correlation'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.rules.set(highPriorityRule.id, highPriorityRule);
  }

  // Start fusion processor
  private startFusionProcessor(): void {
    setInterval(() => {
      if (!this.isProcessing) {
        this.processFusionQueue();
      }
    }, 10000); // Process every 10 seconds
  }

  // Store fusion result
  private async storeFusionResult(result: FusionResult): Promise<void> {
    try {
      await this.redis.setex(`fusion_result:${result.id}`, 3600, JSON.stringify(result));
      
      // Store in database
      await this.prisma.fusionResult.create({
        data: {
          id: result.id,
          ruleId: result.rule_id,
          items: JSON.stringify(result.items),
          confidence: result.confidence,
          riskScore: result.risk_score,
          correlations: JSON.stringify(result.correlations),
          analysis: result.analysis,
          recommendations: JSON.stringify(result.recommendations),
          createdAt: new Date(result.created_at)
        }
      });
    } catch (error) {
      console.error('Failed to store fusion result:', error);
    }
  }

  // Get intelligence items
  async getIntelligenceItems(filters?: {
    type?: string;
    severity?: string;
    source_id?: string;
    confidence_min?: number;
    date_range?: {
      start: string;
      end: string;
    };
  }): Promise<IntelligenceItem[]> {
    try {
      let items = Array.from(this.items.values());

      // Apply filters
      if (filters?.type) {
        items = items.filter(item => item.type === filters.type);
      }
      if (filters?.severity) {
        items = items.filter(item => item.severity === filters.severity);
      }
      if (filters?.source_id) {
        items = items.filter(item => item.source_id === filters.source_id);
      }
      if (filters?.confidence_min !== undefined) {
        items = items.filter(item => item.confidence >= filters.confidence_min);
      }
      if (filters?.date_range) {
        const start = new Date(filters.date_range.start).getTime();
        const end = new Date(filters.date_range.end).getTime();
        items = items.filter(item => {
          const itemTime = new Date(item.timestamp).getTime();
          return itemTime >= start && itemTime <= end;
        });
      }

      // Sort by fusion score and timestamp
      items.sort((a, b) => {
        const scoreDiff = b.analysis.fusion_score - a.analysis.fusion_score;
        if (scoreDiff !== 0) return scoreDiff;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });

      return items;
    } catch (error) {
      console.error('Failed to get intelligence items:', error);
      return [];
    }
  }

  // Get fusion results
  async getFusionResults(filters?: {
    rule_id?: string;
    confidence_min?: number;
    date_range?: {
      start: string;
      end: string;
    };
  }): Promise<FusionResult[]> {
    try {
      let results: FusionResult[] = [];

      // Get from database
      const dbResults = await this.prisma.fusionResult.findMany({
        where: {
          ...(filters?.rule_id && { ruleId: filters.rule_id }),
          ...(filters?.confidence_min && { confidence: { gte: filters.confidence_min } }),
          ...(filters?.date_range && {
            createdAt: {
              gte: new Date(filters.date_range.start),
              lte: new Date(filters.date_range.end)
            }
          })
        },
        orderBy: { createdAt: 'desc' },
        take: 100
      });

      results = dbResults.map((result: any) => ({
        id: result.id,
        rule_id: result.ruleId,
        items: JSON.parse(result.items),
        confidence: result.confidence,
        risk_score: result.riskScore,
        correlations: JSON.parse(result.correlations),
        analysis: result.analysis,
        recommendations: JSON.parse(result.recommendations),
        created_at: result.createdAt.toISOString()
      }));

      return results;
    } catch (error) {
      console.error('Failed to get fusion results:', error);
      return [];
    }
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    activeSources: number;
    totalItems: number;
    fusionResults: number;
    averageProcessingTime: number;
    lastFusion: string | null;
    errors: string[];
  }> {
    try {
      const activeSources = Array.from(this.sources.values()).filter(s => s.enabled).length;
      const totalItems = this.items.size;
      const fusionResults = await this.getFusionResults();
      const lastFusion = fusionResults.length > 0 ? fusionResults[0].created_at : null;

      const status = activeSources === 0 ? 'critical' : 
                   totalItems === 0 ? 'warning' : 'healthy';

      return {
        status,
        activeSources,
        totalItems,
        fusionResults: fusionResults.length,
        averageProcessingTime: 0, // Would be calculated from actual metrics
        lastFusion,
        errors: []
      };
    } catch (error) {
      console.error('Intelligence fusion health check failed:', error);
      return {
        status: 'critical',
        activeSources: 0,
        totalItems: 0,
        fusionResults: 0,
        averageProcessingTime: 0,
        lastFusion: null,
        errors: [error instanceof Error ? error.message : 'Health check failed']
      };
    }
  }
}

// Singleton instance
export const intelligenceFusionService = new IntelligenceFusionService();
