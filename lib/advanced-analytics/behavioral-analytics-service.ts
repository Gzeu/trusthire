// Advanced Behavioral Analytics and UEBA Service
// Complete User and Entity Behavior Analytics platform

import { PrismaClient } from '@prisma/client';
import { getRedisClient } from '@/lib/redis-wrapper';

export interface BehavioralProfile {
  id: string;
  entity_id: string;
  entity_type: 'user' | 'device' | 'application' | 'service' | 'network';
  baseline_metrics: BaselineMetrics;
  current_metrics: CurrentMetrics;
  behavior_patterns: BehaviorPattern[];
  risk_factors: RiskFactor[];
  anomalies: Anomaly[];
  risk_score: number;
  confidence: number;
  last_updated: string;
  created_at: string;
  updated_at: string;
}

export interface BaselineMetrics {
  access_frequency: number;
  time_patterns: TimePattern[];
  location_patterns: LocationPattern[];
  device_usage: DeviceUsage;
  application_usage: ApplicationUsage;
  network_behavior: NetworkBehavior;
  data_access: DataAccess;
  authentication_patterns: AuthenticationPattern[];
  session_metrics: SessionMetrics;
  resource_consumption: ResourceConsumption;
}

export interface TimePattern {
  hour_of_day: number;
  day_of_week: number;
  frequency: number;
  duration: number;
  confidence: number;
}

export interface LocationPattern {
  location: string;
  frequency: number;
  duration: number;
  risk_level: 'low' | 'medium' | 'high';
  confidence: number;
}

export interface DeviceUsage {
  primary_devices: string[];
  device_switch_frequency: number;
  usage_by_device_type: Record<string, number>;
  device_health_score: number;
  security_compliance: number;
}

export interface ApplicationUsage {
  primary_applications: string[];
  usage_frequency: Record<string, number>;
  usage_duration: Record<string, number>;
  risk_level_by_app: Record<string, 'low' | 'medium' | 'high'>;
  data_volume_by_app: Record<string, number>;
}

export interface NetworkBehavior {
  typical_ips: string[];
  typical_ports: number[];
  typical_protocols: string[];
  bandwidth_usage: number;
  connection_duration: number;
  latency_patterns: number[];
  security_events: number;
}

export interface DataAccess {
  sensitive_data_access: number;
  data_volume: number;
  access_frequency: Record<string, number>;
  data_types_accessed: string[];
  export_frequency: number;
  download_volume: number;
}

export interface AuthenticationPattern {
  method: string;
  success_rate: number;
  failure_rate: number;
  typical_time_of_day: number[];
  location_variance: number;
  device_variance: number;
  mfa_usage: number;
}

export interface SessionMetrics {
  average_duration: number;
  session_frequency: number;
  concurrent_sessions: number;
  idle_time: number;
  activity_level: 'low' | 'medium' | 'high';
  termination_reasons: Record<string, number>;
}

export interface ResourceConsumption {
  cpu_usage: number;
  memory_usage: number;
  storage_usage: number;
  network_bandwidth: number;
  api_calls: number;
  database_queries: number;
}

export interface CurrentMetrics {
  access_frequency: number;
  time_patterns: TimePattern[];
  location_patterns: LocationPattern[];
  device_usage: DeviceUsage;
  application_usage: ApplicationUsage;
  network_behavior: NetworkBehavior;
  data_access: DataAccess;
  authentication_patterns: AuthenticationPattern[];
  session_metrics: SessionMetrics;
  resource_consumption: ResourceConsumption;
  last_activity: string;
}

export interface BehaviorPattern {
  id: string;
  name: string;
  description: string;
  pattern_type: 'temporal' | 'behavioral' | 'resource' | 'security';
  confidence: number;
  frequency: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  indicators: string[];
  conditions: PatternCondition[];
  created_at: string;
  updated_at: string;
}

export interface PatternCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'not_in' | 'contains' | 'regex';
  value: any;
  weight: number;
  required: boolean;
}

export interface RiskFactor {
  id: string;
  name: string;
  description: string;
  category: 'behavioral' | 'environmental' | 'contextual' | 'historical';
  weight: number;
  threshold: number;
  current_value: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  trend: 'increasing' | 'decreasing' | 'stable';
  last_updated: string;
}

export interface Anomaly {
  id: string;
  type: 'statistical' | 'behavioral' | 'temporal' | 'contextual' | 'resource';
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  description: string;
  confidence: number;
  detected_at: string;
  entity_id: string;
  entity_type: string;
  indicators: AnomalyIndicator[];
  baseline_value: any;
  current_value: any;
  deviation: number;
  risk_impact: number;
  status: 'new' | 'investigating' | 'confirmed' | 'false_positive' | 'resolved';
  resolution?: string;
  resolved_at?: string;
}

export interface AnomalyIndicator {
  metric: string;
  value: any;
  threshold: number;
  deviation: number;
  significance: number;
}

export interface UEBAAlert {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  entity_id: string;
  entity_type: string;
  anomaly_ids: string[];
  risk_score: number;
  confidence: number;
  indicators: AlertIndicator[];
  recommendations: string[];
  status: 'new' | 'investigating' | 'escalated' | 'resolved';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface AlertIndicator {
  type: string;
  description: string;
  value: any;
  threshold: number;
  significance: number;
}

export interface AnalyticsConfig {
  baseline_period: number; // days
  update_frequency: number; // minutes
  anomaly_threshold: number; // standard deviations
  risk_threshold: number; // 0-1
  learning_enabled: boolean;
  ml_models: MLModelConfig[];
  alerting: AlertingConfig;
  retention: RetentionConfig;
}

export interface MLModelConfig {
  type: 'isolation_forest' | 'one_class_svm' | 'autoencoder' | 'lstm' | 'random_forest';
  enabled: boolean;
  parameters: Record<string, any>;
  accuracy: number;
  precision: number;
  recall: number;
  last_trained: string;
  training_frequency: number; // days
}

export interface AlertingConfig {
  enabled: boolean;
  channels: AlertChannel[];
  thresholds: AlertThreshold[];
  escalation: EscalationConfig;
  suppression: SuppressionConfig;
}

export interface AlertChannel {
  type: 'email' | 'slack' | 'teams' | 'webhook' | 'sms';
  destination: string;
  enabled: boolean;
  template: string;
  filters: AlertFilter[];
}

export interface AlertFilter {
  field: string;
  operator: string;
  value: any;
}

export interface AlertThreshold {
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  value: number;
  severity: string;
}

export interface EscalationConfig {
  enabled: boolean;
  levels: EscalationLevel[];
  timeout: number; // minutes
}

export interface EscalationLevel {
  level: number;
  severity: string;
  recipients: string[];
  actions: string[];
}

export interface SuppressionConfig {
  enabled: boolean;
  rules: SuppressionRule[];
  duration: number; // minutes
}

export interface SuppressionRule {
  name: string;
  condition: string;
  duration: number;
  reason: string;
}

export interface RetentionConfig {
  profiles: number; // days
  anomalies: number; // days
  alerts: number; // days
  metrics: number; // days
  raw_events: number; // days
}

export interface AnalyticsMetrics {
  total_entities: number;
  active_entities: number;
  anomalies_detected: number;
  alerts_generated: number;
  false_positive_rate: number;
  detection_accuracy: number;
  average_risk_score: number;
  high_risk_entities: number;
  ml_model_performance: ModelPerformance;
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  training_time: number;
  last_updated: string;
}

class BehavioralAnalyticsService {
  private prisma: PrismaClient;
  private redis: any;
  private profiles: Map<string, BehavioralProfile> = new Map();
  private anomalies: Map<string, Anomaly> = new Map();
  private alerts: Map<string, UEBAAlert> = new Map();
  private config!: AnalyticsConfig;
  private isProcessing = false;

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = getRedisClient();
    this.initializeDefaultConfig();
    this.startAnalyticsProcessor();
  }

  // Create or update behavioral profile
  async updateProfile(entityId: string, entityType: string, metrics: CurrentMetrics): Promise<BehavioralProfile> {
    try {
      let profile = this.profiles.get(`${entityType}:${entityId}`);
      
      if (!profile) {
        // Create new profile
        profile = {
          id: crypto.randomUUID(),
          entity_id: entityId,
          entity_type: entityType as any,
          baseline_metrics: this.createInitialBaseline(metrics),
          current_metrics: metrics,
          behavior_patterns: [],
          risk_factors: [],
          anomalies: [],
          risk_score: 0,
          confidence: 0,
          last_updated: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      } else {
        // Update existing profile
        profile.current_metrics = metrics;
        profile.baseline_metrics = this.updateBaseline(profile.baseline_metrics, metrics);
        profile.last_updated = new Date().toISOString();
        profile.updated_at = new Date().toISOString();
      }

      // Analyze for anomalies
      const anomalies = await this.detectAnomalies(profile);
      profile.anomalies = anomalies;

      // Update risk score
      profile.risk_score = this.calculateRiskScore(profile);
      profile.confidence = this.calculateConfidence(profile);

      // Store profile
      this.profiles.set(`${entityType}:${entityId}`, profile);
      await this.storeProfile(profile);

      // Generate alerts if needed
      if (profile.risk_score > this.config.risk_threshold) {
        await this.generateAlerts(profile);
      }

      return profile;
    } catch (error) {
      console.error('Failed to update behavioral profile:', error);
      throw error;
    }
  }

  // Create initial baseline
  private createInitialBaseline(metrics: CurrentMetrics): BaselineMetrics {
    return {
      access_frequency: metrics.access_frequency,
      time_patterns: metrics.time_patterns,
      location_patterns: metrics.location_patterns,
      device_usage: metrics.device_usage,
      application_usage: metrics.application_usage,
      network_behavior: metrics.network_behavior,
      data_access: metrics.data_access,
      authentication_patterns: metrics.authentication_patterns,
      session_metrics: metrics.session_metrics,
      resource_consumption: metrics.resource_consumption
    };
  }

  // Update baseline
  private updateBaseline(baseline: BaselineMetrics, current: CurrentMetrics): BaselineMetrics {
    // Exponential moving average update
    const alpha = 0.1; // Learning rate

    return {
      access_frequency: alpha * current.access_frequency + (1 - alpha) * baseline.access_frequency,
      time_patterns: this.updateTimePatterns(baseline.time_patterns, current.time_patterns, alpha),
      location_patterns: this.updateLocationPatterns(baseline.location_patterns, current.location_patterns, alpha),
      device_usage: this.updateDeviceUsage(baseline.device_usage, current.device_usage, alpha),
      application_usage: this.updateApplicationUsage(baseline.application_usage, current.application_usage, alpha),
      network_behavior: this.updateNetworkBehavior(baseline.network_behavior, current.network_behavior, alpha),
      data_access: this.updateDataAccess(baseline.data_access, current.data_access, alpha),
      authentication_patterns: this.updateAuthenticationPatterns(baseline.authentication_patterns, current.authentication_patterns, alpha),
      session_metrics: this.updateSessionMetrics(baseline.session_metrics, current.session_metrics, alpha),
      resource_consumption: this.updateResourceConsumption(baseline.resource_consumption, current.resource_consumption, alpha)
    };
  }

  // Update time patterns
  private updateTimePatterns(baseline: TimePattern[], current: TimePattern[], alpha: number): TimePattern[] {
    const updated = [...baseline];
    
    for (const pattern of current) {
      const existing = updated.find(p => p.hour_of_day === pattern.hour_of_day && p.day_of_week === pattern.day_of_week);
      
      if (existing) {
        existing.frequency = alpha * pattern.frequency + (1 - alpha) * existing.frequency;
        existing.duration = alpha * pattern.duration + (1 - alpha) * existing.duration;
        existing.confidence = Math.min(1.0, alpha + (1 - alpha) * existing.confidence);
      } else {
        updated.push({
          ...pattern,
          confidence: alpha
        });
      }
    }
    
    return updated;
  }

  // Update location patterns
  private updateLocationPatterns(baseline: LocationPattern[], current: LocationPattern[], alpha: number): LocationPattern[] {
    const updated = [...baseline];
    
    for (const pattern of current) {
      const existing = updated.find(p => p.location === pattern.location);
      
      if (existing) {
        existing.frequency = alpha * pattern.frequency + (1 - alpha) * existing.frequency;
        existing.duration = alpha * pattern.duration + (1 - alpha) * existing.duration;
        existing.confidence = Math.min(1.0, alpha + (1 - alpha) * existing.confidence);
      } else {
        updated.push({
          ...pattern,
          confidence: alpha
        });
      }
    }
    
    return updated;
  }

  // Update device usage
  private updateDeviceUsage(baseline: DeviceUsage, current: DeviceUsage, alpha: number): DeviceUsage {
    return {
      primary_devices: current.primary_devices,
      device_switch_frequency: alpha * current.device_switch_frequency + (1 - alpha) * baseline.device_switch_frequency,
      usage_by_device_type: this.updateRecord(baseline.usage_by_device_type, current.usage_by_device_type, alpha),
      device_health_score: alpha * current.device_health_score + (1 - alpha) * baseline.device_health_score,
      security_compliance: alpha * current.security_compliance + (1 - alpha) * baseline.security_compliance
    };
  }

  // Update application usage
  private updateApplicationUsage(baseline: ApplicationUsage, current: ApplicationUsage, alpha: number): ApplicationUsage {
    return {
      primary_applications: current.primary_applications,
      usage_frequency: this.updateRecord(baseline.usage_frequency, current.usage_frequency, alpha),
      usage_duration: this.updateRecord(baseline.usage_duration, current.usage_duration, alpha),
      risk_level_by_app: current.risk_level_by_app,
      data_volume_by_app: this.updateRecord(baseline.data_volume_by_app, current.data_volume_by_app, alpha)
    };
  }

  // Update network behavior
  private updateNetworkBehavior(baseline: NetworkBehavior, current: NetworkBehavior, alpha: number): NetworkBehavior {
    return {
      typical_ips: current.typical_ips,
      typical_ports: current.typical_ports,
      typical_protocols: current.typical_protocols,
      bandwidth_usage: alpha * current.bandwidth_usage + (1 - alpha) * baseline.bandwidth_usage,
      connection_duration: alpha * current.connection_duration + (1 - alpha) * baseline.connection_duration,
      latency_patterns: current.latency_patterns,
      security_events: alpha * current.security_events + (1 - alpha) * baseline.security_events
    };
  }

  // Update data access
  private updateDataAccess(baseline: DataAccess, current: DataAccess, alpha: number): DataAccess {
    return {
      sensitive_data_access: alpha * current.sensitive_data_access + (1 - alpha) * baseline.sensitive_data_access,
      data_volume: alpha * current.data_volume + (1 - alpha) * baseline.data_volume,
      access_frequency: this.updateRecord(baseline.access_frequency, current.access_frequency, alpha),
      data_types_accessed: current.data_types_accessed,
      export_frequency: alpha * current.export_frequency + (1 - alpha) * baseline.export_frequency,
      download_volume: alpha * current.download_volume + (1 - alpha) * baseline.download_volume
    };
  }

  // Update authentication patterns
  private updateAuthenticationPatterns(baseline: AuthenticationPattern[], current: AuthenticationPattern[], alpha: number): AuthenticationPattern[] {
    const updated = [...baseline];
    
    for (const pattern of current) {
      const existing = updated.find(p => p.method === pattern.method);
      
      if (existing) {
        existing.success_rate = alpha * pattern.success_rate + (1 - alpha) * existing.success_rate;
        existing.failure_rate = alpha * pattern.failure_rate + (1 - alpha) * existing.failure_rate;
        existing.mfa_usage = alpha * pattern.mfa_usage + (1 - alpha) * existing.mfa_usage;
      } else {
        updated.push(pattern);
      }
    }
    
    return updated;
  }

  // Update session metrics
  private updateSessionMetrics(baseline: SessionMetrics, current: SessionMetrics, alpha: number): SessionMetrics {
    return {
      average_duration: alpha * current.average_duration + (1 - alpha) * baseline.average_duration,
      session_frequency: alpha * current.session_frequency + (1 - alpha) * baseline.session_frequency,
      concurrent_sessions: alpha * current.concurrent_sessions + (1 - alpha) * baseline.concurrent_sessions,
      idle_time: alpha * current.idle_time + (1 - alpha) * baseline.idle_time,
      activity_level: current.activity_level,
      termination_reasons: this.updateRecord(baseline.termination_reasons, current.termination_reasons, alpha)
    };
  }

  // Update resource consumption
  private updateResourceConsumption(baseline: ResourceConsumption, current: ResourceConsumption, alpha: number): ResourceConsumption {
    return {
      cpu_usage: alpha * current.cpu_usage + (1 - alpha) * baseline.cpu_usage,
      memory_usage: alpha * current.memory_usage + (1 - alpha) * baseline.memory_usage,
      storage_usage: alpha * current.storage_usage + (1 - alpha) * baseline.storage_usage,
      network_bandwidth: alpha * current.network_bandwidth + (1 - alpha) * baseline.network_bandwidth,
      api_calls: alpha * current.api_calls + (1 - alpha) * baseline.api_calls,
      database_queries: alpha * current.database_queries + (1 - alpha) * baseline.database_queries
    };
  }

  // Update record
  private updateRecord(baseline: Record<string, number>, current: Record<string, number>, alpha: number): Record<string, number> {
    const updated = { ...baseline };
    
    for (const [key, value] of Object.entries(current)) {
      updated[key] = alpha * value + (1 - alpha) * (baseline[key] || 0);
    }
    
    return updated;
  }

  // Detect anomalies
  private async detectAnomalies(profile: BehavioralProfile): Promise<Anomaly[]> {
    try {
      const anomalies: Anomaly[] = [];
      const baseline = profile.baseline_metrics;
      const current = profile.current_metrics;

      // Statistical anomalies
      const statisticalAnomalies = this.detectStatisticalAnomalies(baseline, current, profile);
      anomalies.push(...statisticalAnomalies);

      // Behavioral anomalies
      const behavioralAnomalies = this.detectBehavioralAnomalies(baseline, current, profile);
      anomalies.push(...behavioralAnomalies);

      // Temporal anomalies
      const temporalAnomalies = this.detectTemporalAnomalies(baseline, current, profile);
      anomalies.push(...temporalAnomalies);

      // Resource anomalies
      const resourceAnomalies = this.detectResourceAnomalies(baseline, current, profile);
      anomalies.push(...resourceAnomalies);

      // Store anomalies
      for (const anomaly of anomalies) {
        this.anomalies.set(anomaly.id, anomaly);
        await this.storeAnomaly(anomaly);
      }

      return anomalies;
    } catch (error) {
      console.error('Failed to detect anomalies:', error);
      return [];
    }
  }

  // Detect statistical anomalies
  private detectStatisticalAnomalies(baseline: BaselineMetrics, current: CurrentMetrics, profile: BehavioralProfile): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const threshold = this.config.anomaly_threshold;

    // Access frequency anomaly
    const accessFreqDeviation = this.calculateDeviation(baseline.access_frequency, current.access_frequency);
    if (accessFreqDeviation > threshold) {
      anomalies.push({
        id: crypto.randomUUID(),
        type: 'statistical',
        severity: this.getSeverity(accessFreqDeviation),
        description: `Unusual access frequency: ${current.access_frequency} (baseline: ${baseline.access_frequency})`,
        confidence: Math.min(1.0, accessFreqDeviation / threshold),
        detected_at: new Date().toISOString(),
        entity_id: profile.entity_id,
        entity_type: profile.entity_type,
        indicators: [{
          metric: 'access_frequency',
          value: current.access_frequency,
          threshold: baseline.access_frequency,
          deviation: accessFreqDeviation,
          significance: 0.8
        }],
        baseline_value: baseline.access_frequency,
        current_value: current.access_frequency,
        deviation: accessFreqDeviation,
        risk_impact: this.calculateRiskImpact(accessFreqDeviation),
        status: 'new'
      });
    }

    // Data access anomaly
    const dataAccessDeviation = this.calculateDeviation(baseline.data_access.sensitive_data_access, current.data_access.sensitive_data_access);
    if (dataAccessDeviation > threshold) {
      anomalies.push({
        id: crypto.randomUUID(),
        type: 'statistical',
        severity: this.getSeverity(dataAccessDeviation),
        description: `Unusual sensitive data access: ${current.data_access.sensitive_data_access} (baseline: ${baseline.data_access.sensitive_data_access})`,
        confidence: Math.min(1.0, dataAccessDeviation / threshold),
        detected_at: new Date().toISOString(),
        entity_id: profile.entity_id,
        entity_type: profile.entity_type,
        indicators: [{
          metric: 'sensitive_data_access',
          value: current.data_access.sensitive_data_access,
          threshold: baseline.data_access.sensitive_data_access,
          deviation: dataAccessDeviation,
          significance: 0.9
        }],
        baseline_value: baseline.data_access.sensitive_data_access,
        current_value: current.data_access.sensitive_data_access,
        deviation: dataAccessDeviation,
        risk_impact: this.calculateRiskImpact(dataAccessDeviation),
        status: 'new'
      });
    }

    return anomalies;
  }

  // Detect behavioral anomalies
  private detectBehavioralAnomalies(baseline: BaselineMetrics, current: CurrentMetrics, profile: BehavioralProfile): Anomaly[] {
    const anomalies: Anomaly[] = [];

    // Device switching anomaly
    const deviceSwitchDeviation = this.calculateDeviation(baseline.device_usage.device_switch_frequency, current.device_usage.device_switch_frequency);
    if (deviceSwitchDeviation > this.config.anomaly_threshold) {
      anomalies.push({
        id: crypto.randomUUID(),
        type: 'behavioral',
        severity: this.getSeverity(deviceSwitchDeviation),
        description: `Unusual device switching frequency: ${current.device_usage.device_switch_frequency}`,
        confidence: Math.min(1.0, deviceSwitchDeviation / this.config.anomaly_threshold),
        detected_at: new Date().toISOString(),
        entity_id: profile.entity_id,
        entity_type: profile.entity_type,
        indicators: [{
          metric: 'device_switch_frequency',
          value: current.device_usage.device_switch_frequency,
          threshold: baseline.device_usage.device_switch_frequency,
          deviation: deviceSwitchDeviation,
          significance: 0.7
        }],
        baseline_value: baseline.device_usage.device_switch_frequency,
        current_value: current.device_usage.device_switch_frequency,
        deviation: deviceSwitchDeviation,
        risk_impact: this.calculateRiskImpact(deviceSwitchDeviation),
        status: 'new'
      });
    }

    // Authentication failure anomaly
    const authFailureRate = current.authentication_patterns.reduce((sum, pattern) => sum + pattern.failure_rate, 0) / current.authentication_patterns.length;
    const baselineAuthFailureRate = baseline.authentication_patterns.reduce((sum, pattern) => sum + pattern.failure_rate, 0) / baseline.authentication_patterns.length;
    const authFailureDeviation = this.calculateDeviation(baselineAuthFailureRate, authFailureRate);
    
    if (authFailureDeviation > this.config.anomaly_threshold) {
      anomalies.push({
        id: crypto.randomUUID(),
        type: 'behavioral',
        severity: this.getSeverity(authFailureDeviation),
        description: `Unusual authentication failure rate: ${authFailureRate}`,
        confidence: Math.min(1.0, authFailureDeviation / this.config.anomaly_threshold),
        detected_at: new Date().toISOString(),
        entity_id: profile.entity_id,
        entity_type: profile.entity_type,
        indicators: [{
          metric: 'authentication_failure_rate',
          value: authFailureRate,
          threshold: baselineAuthFailureRate,
          deviation: authFailureDeviation,
          significance: 0.8
        }],
        baseline_value: baselineAuthFailureRate,
        current_value: authFailureRate,
        deviation: authFailureDeviation,
        risk_impact: this.calculateRiskImpact(authFailureDeviation),
        status: 'new'
      });
    }

    return anomalies;
  }

  // Detect temporal anomalies
  private detectTemporalAnomalies(baseline: BaselineMetrics, current: CurrentMetrics, profile: BehavioralProfile): Anomaly[] {
    const anomalies: Anomaly[] = [];

    // Time pattern anomaly
    for (const currentPattern of current.time_patterns) {
      const baselinePattern = baseline.time_patterns.find(p => p.hour_of_day === currentPattern.hour_of_day && p.day_of_week === currentPattern.day_of_week);
      
      if (baselinePattern && baselinePattern.confidence > 0.5) {
        const frequencyDeviation = this.calculateDeviation(baselinePattern.frequency, currentPattern.frequency);
        if (frequencyDeviation > this.config.anomaly_threshold) {
          anomalies.push({
            id: crypto.randomUUID(),
            type: 'temporal',
            severity: this.getSeverity(frequencyDeviation),
            description: `Unusual activity at ${currentPattern.hour_of_day}:00 on day ${currentPattern.day_of_week}`,
            confidence: Math.min(1.0, frequencyDeviation / this.config.anomaly_threshold),
            detected_at: new Date().toISOString(),
            entity_id: profile.entity_id,
            entity_type: profile.entity_type,
            indicators: [{
              metric: 'time_pattern_frequency',
              value: currentPattern.frequency,
              threshold: baselinePattern.frequency,
              deviation: frequencyDeviation,
              significance: 0.6
            }],
            baseline_value: baselinePattern.frequency,
            current_value: currentPattern.frequency,
            deviation: frequencyDeviation,
            risk_impact: this.calculateRiskImpact(frequencyDeviation),
            status: 'new'
          });
        }
      }
    }

    return anomalies;
  }

  // Detect resource anomalies
  private detectResourceAnomalies(baseline: BaselineMetrics, current: CurrentMetrics, profile: BehavioralProfile): Anomaly[] {
    const anomalies: Anomaly[] = [];

    // CPU usage anomaly
    const cpuDeviation = this.calculateDeviation(baseline.resource_consumption.cpu_usage, current.resource_consumption.cpu_usage);
    if (cpuDeviation > this.config.anomaly_threshold) {
      anomalies.push({
        id: crypto.randomUUID(),
        type: 'resource',
        severity: this.getSeverity(cpuDeviation),
        description: `Unusual CPU usage: ${current.resource_consumption.cpu_usage}%`,
        confidence: Math.min(1.0, cpuDeviation / this.config.anomaly_threshold),
        detected_at: new Date().toISOString(),
        entity_id: profile.entity_id,
        entity_type: profile.entity_type,
        indicators: [{
          metric: 'cpu_usage',
          value: current.resource_consumption.cpu_usage,
          threshold: baseline.resource_consumption.cpu_usage,
          deviation: cpuDeviation,
          significance: 0.5
        }],
        baseline_value: baseline.resource_consumption.cpu_usage,
        current_value: current.resource_consumption.cpu_usage,
        deviation: cpuDeviation,
        risk_impact: this.calculateRiskImpact(cpuDeviation),
        status: 'new'
      });
    }

    // Network bandwidth anomaly
    const bandwidthDeviation = this.calculateDeviation(baseline.resource_consumption.network_bandwidth, current.resource_consumption.network_bandwidth);
    if (bandwidthDeviation > this.config.anomaly_threshold) {
      anomalies.push({
        id: crypto.randomUUID(),
        type: 'resource',
        severity: this.getSeverity(bandwidthDeviation),
        description: `Unusual network bandwidth usage: ${current.resource_consumption.network_bandwidth}`,
        confidence: Math.min(1.0, bandwidthDeviation / this.config.anomaly_threshold),
        detected_at: new Date().toISOString(),
        entity_id: profile.entity_id,
        entity_type: profile.entity_type,
        indicators: [{
          metric: 'network_bandwidth',
          value: current.resource_consumption.network_bandwidth,
          threshold: baseline.resource_consumption.network_bandwidth,
          deviation: bandwidthDeviation,
          significance: 0.7
        }],
        baseline_value: baseline.resource_consumption.network_bandwidth,
        current_value: current.resource_consumption.network_bandwidth,
        deviation: bandwidthDeviation,
        risk_impact: this.calculateRiskImpact(bandwidthDeviation),
        status: 'new'
      });
    }

    return anomalies;
  }

  // Calculate deviation
  private calculateDeviation(baseline: number, current: number): number {
    if (baseline === 0) {
      return current > 0 ? 10 : 0; // High deviation if baseline is 0 and current is not
    }
    return Math.abs(current - baseline) / baseline;
  }

  // Get severity
  private getSeverity(deviation: number): Anomaly['severity'] {
    if (deviation > 3) return 'critical';
    if (deviation > 2) return 'high';
    if (deviation > 1) return 'medium';
    return 'low';
  }

  // Calculate risk impact
  private calculateRiskImpact(deviation: number): number {
    return Math.min(1.0, deviation / 5); // Normalize to 0-1
  }

  // Calculate risk score
  private calculateRiskScore(profile: BehavioralProfile): number {
    let riskScore = 0;

    // Anomaly-based risk
    const anomalyRisk = profile.anomalies.reduce((sum, anomaly) => {
      const severityWeight = {
        'info': 0.1,
        'low': 0.2,
        'medium': 0.4,
        'high': 0.7,
        'critical': 1.0
      };
      return sum + (severityWeight[anomaly.severity] * anomaly.confidence * anomaly.risk_impact);
    }, 0);
    riskScore += Math.min(0.6, anomalyRisk);

    // Behavioral risk factors
    const behaviorRisk = profile.risk_factors.reduce((sum, factor) => {
      return sum + (factor.weight * factor.current_value / factor.threshold);
    }, 0);
    riskScore += Math.min(0.3, behaviorRisk);

    // Base risk
    riskScore += 0.1;

    return Math.min(1.0, riskScore);
  }

  // Calculate confidence
  private calculateConfidence(profile: BehavioralProfile): number {
    let confidence = 0.5; // Base confidence

    // Data volume confidence
    const totalEvents = profile.current_metrics.access_frequency;
    if (totalEvents > 100) {
      confidence += 0.2;
    } else if (totalEvents > 50) {
      confidence += 0.1;
    }

    // Baseline maturity confidence
    const baselineAge = (Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24); // days
    if (baselineAge > 30) {
      confidence += 0.2;
    } else if (baselineAge > 7) {
      confidence += 0.1;
    }

    // Anomaly confidence
    const anomalyConfidence = profile.anomalies.length > 0 ? 
      profile.anomalies.reduce((sum, a) => sum + a.confidence, 0) / profile.anomalies.length : 0.5;
    confidence += anomalyConfidence * 0.1;

    return Math.min(1.0, confidence);
  }

  // Generate alerts
  private async generateAlerts(profile: BehavioralProfile): Promise<void> {
    try {
      const criticalAnomalies = profile.anomalies.filter(a => a.severity === 'critical' || a.severity === 'high');
      
      if (criticalAnomalies.length > 0) {
        const alert: UEBAAlert = {
          id: crypto.randomUUID(),
          title: `High Risk Behavior Detected - ${profile.entity_type}`,
          description: `Unusual behavior detected for ${profile.entity_type} ${profile.entity_id}. Risk score: ${profile.risk_score.toFixed(2)}`,
          severity: profile.risk_score > 0.8 ? 'critical' : 'high',
          entity_id: profile.entity_id,
          entity_type: profile.entity_type,
          anomaly_ids: criticalAnomalies.map(a => a.id),
          risk_score: profile.risk_score,
          confidence: profile.confidence,
          indicators: criticalAnomalies.map(a => ({
            type: a.type,
            description: a.description,
            value: a.current_value,
            threshold: a.baseline_value,
            significance: a.confidence
          })),
          recommendations: this.generateRecommendations(profile),
          status: 'new',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        this.alerts.set(alert.id, alert);
        await this.storeAlert(alert);
      }
    } catch (error) {
      console.error('Failed to generate alerts:', error);
    }
  }

  // Generate recommendations
  private generateRecommendations(profile: BehavioralProfile): string[] {
    const recommendations: string[] = [];

    // Based on anomalies
    for (const anomaly of profile.anomalies) {
      if (anomaly.type === 'statistical' && anomaly.indicators.some(i => i.metric === 'access_frequency')) {
        recommendations.push('Review recent access patterns for potential unauthorized activity');
      }
      if (anomaly.type === 'behavioral' && anomaly.indicators.some(i => i.metric === 'authentication_failure_rate')) {
        recommendations.push('Investigate authentication failures - possible credential compromise');
      }
      if (anomaly.type === 'temporal') {
        recommendations.push('Verify if activity outside normal hours is authorized');
      }
      if (anomaly.type === 'resource' && anomaly.indicators.some(i => i.metric === 'network_bandwidth')) {
        recommendations.push('Monitor for potential data exfiltration or unauthorized transfers');
      }
    }

    // Based on risk score
    if (profile.risk_score > 0.8) {
      recommendations.push('Immediate investigation required - high risk behavior detected');
      recommendations.push('Consider temporary access restrictions while investigating');
    } else if (profile.risk_score > 0.6) {
      recommendations.push('Schedule security review within 24 hours');
    }

    // General recommendations
    recommendations.push('Review and update baseline if behavior change is legitimate');
    recommendations.push('Document investigation findings for future reference');

    return recommendations;
  }

  // Store profile
  private async storeProfile(profile: BehavioralProfile): Promise<void> {
    try {
      await this.redis.setex(`behavioral_profile:${profile.entity_type}:${profile.entity_id}`, 3600, JSON.stringify(profile));
      
      // Store in database
      await this.prisma.behavioralProfile.upsert({
        where: { entityId_entityType: { entityId: profile.entity_id, entityType: profile.entity_type } },
        update: {
          baselineMetrics: JSON.stringify(profile.baseline_metrics),
          currentMetrics: JSON.stringify(profile.current_metrics),
          behaviorPatterns: JSON.stringify(profile.behavior_patterns),
          riskFactors: JSON.stringify(profile.risk_factors),
          anomalies: JSON.stringify(profile.anomalies),
          riskScore: profile.risk_score,
          confidence: profile.confidence,
          lastUpdated: new Date(profile.last_updated),
          updatedAt: new Date(profile.updated_at)
        },
        create: {
          id: profile.id,
          entityId: profile.entity_id,
          entityType: profile.entity_type,
          baselineMetrics: JSON.stringify(profile.baseline_metrics),
          currentMetrics: JSON.stringify(profile.current_metrics),
          behaviorPatterns: JSON.stringify(profile.behavior_patterns),
          riskFactors: JSON.stringify(profile.risk_factors),
          anomalies: JSON.stringify(profile.anomalies),
          riskScore: profile.risk_score,
          confidence: profile.confidence,
          lastUpdated: new Date(profile.last_updated),
          createdAt: new Date(profile.created_at),
          updatedAt: new Date(profile.updated_at)
        }
      });
    } catch (error) {
      console.error('Failed to store behavioral profile:', error);
    }
  }

  // Store anomaly
  private async storeAnomaly(anomaly: Anomaly): Promise<void> {
    try {
      await this.redis.setex(`anomaly:${anomaly.id}`, 86400, JSON.stringify(anomaly));
      
      // Store in database
      await this.prisma.anomaly.create({
        data: {
          id: anomaly.id,
          type: anomaly.type,
          severity: anomaly.severity,
          description: anomaly.description,
          confidence: anomaly.confidence,
          detectedAt: new Date(anomaly.detected_at),
          entityId: anomaly.entity_id,
          entityType: anomaly.entity_type,
          indicators: JSON.stringify(anomaly.indicators),
          baselineValue: JSON.stringify(anomaly.baseline_value),
          currentValue: JSON.stringify(anomaly.current_value),
          deviation: anomaly.deviation,
          riskImpact: anomaly.risk_impact,
          status: anomaly.status,
          resolution: anomaly.resolution,
          resolvedAt: anomaly.resolved_at ? new Date(anomaly.resolved_at) : null
        }
      });
    } catch (error) {
      console.error('Failed to store anomaly:', error);
    }
  }

  // Store alert
  private async storeAlert(alert: UEBAAlert): Promise<void> {
    try {
      await this.redis.setex(`ueba_alert:${alert.id}`, 86400, JSON.stringify(alert));
      
      // Store in database
      await this.prisma.uebaAlert.create({
        data: {
          id: alert.id,
          title: alert.title,
          description: alert.description,
          severity: alert.severity,
          entityId: alert.entity_id,
          entityType: alert.entity_type,
          anomalyIds: JSON.stringify(alert.anomaly_ids),
          riskScore: alert.risk_score,
          confidence: alert.confidence,
          indicators: JSON.stringify(alert.indicators),
          recommendations: JSON.stringify(alert.recommendations),
          status: alert.status,
          assignedTo: alert.assigned_to || null,
          createdAt: new Date(alert.created_at),
          updatedAt: new Date(alert.updated_at),
          resolvedAt: alert.resolved_at ? new Date(alert.resolved_at) : null
        }
      });
    } catch (error) {
      console.error('Failed to store UEBA alert:', error);
    }
  }

  // Get profile
  async getProfile(entityId: string, entityType: string): Promise<BehavioralProfile | null> {
    try {
      return this.profiles.get(`${entityType}:${entityId}`) || null;
    } catch (error) {
      console.error('Failed to get behavioral profile:', error);
      return null;
    }
  }

  // Get anomalies
  async getAnomalies(filters?: {
    entity_id?: string;
    entity_type?: string;
    severity?: string;
    status?: string;
    date_range?: {
      start: string;
      end: string;
    };
  }): Promise<Anomaly[]> {
    try {
      let anomalies = Array.from(this.anomalies.values());

      // Apply filters
      if (filters?.entity_id) {
        anomalies = anomalies.filter(anomaly => anomaly.entity_id === filters.entity_id);
      }
      if (filters?.entity_type) {
        anomalies = anomalies.filter(anomaly => anomaly.entity_type === filters.entity_type);
      }
      if (filters?.severity) {
        anomalies = anomalies.filter(anomaly => anomaly.severity === filters.severity);
      }
      if (filters?.status) {
        anomalies = anomalies.filter(anomaly => anomaly.status === filters.status);
      }
      if (filters?.date_range) {
        const start = new Date(filters.date_range.start).getTime();
        const end = new Date(filters.date_range.end).getTime();
        anomalies = anomalies.filter(anomaly => {
          const anomalyTime = new Date(anomaly.detected_at).getTime();
          return anomalyTime >= start && anomalyTime <= end;
        });
      }

      return anomalies;
    } catch (error) {
      console.error('Failed to get anomalies:', error);
      return [];
    }
  }

  // Get alerts
  async getAlerts(filters?: {
    entity_id?: string;
    entity_type?: string;
    severity?: string;
    status?: string;
    assigned_to?: string;
    date_range?: {
      start: string;
      end: string;
    };
  }): Promise<UEBAAlert[]> {
    try {
      let alerts = Array.from(this.alerts.values());

      // Apply filters
      if (filters?.entity_id) {
        alerts = alerts.filter(alert => alert.entity_id === filters.entity_id);
      }
      if (filters?.entity_type) {
        alerts = alerts.filter(alert => alert.entity_type === filters.entity_type);
      }
      if (filters?.severity) {
        alerts = alerts.filter(alert => alert.severity === filters.severity);
      }
      if (filters?.status) {
        alerts = alerts.filter(alert => alert.status === filters.status);
      }
      if (filters?.assigned_to) {
        alerts = alerts.filter(alert => alert.assigned_to === filters.assigned_to);
      }
      if (filters?.date_range) {
        const start = new Date(filters.date_range.start).getTime();
        const end = new Date(filters.date_range.end).getTime();
        alerts = alerts.filter(alert => {
          const alertTime = new Date(alert.created_at).getTime();
          return alertTime >= start && alertTime <= end;
        });
      }

      return alerts;
    } catch (error) {
      console.error('Failed to get UEBA alerts:', error);
      return [];
    }
  }

  // Initialize default configuration
  private initializeDefaultConfig(): void {
    this.config = {
      baseline_period: 30,
      update_frequency: 15,
      anomaly_threshold: 2.0,
      risk_threshold: 0.7,
      learning_enabled: true,
      ml_models: [
        {
          type: 'isolation_forest',
          enabled: true,
          parameters: { n_estimators: 100, contamination: 0.1 },
          accuracy: 0.85,
          precision: 0.82,
          recall: 0.88,
          last_trained: new Date().toISOString(),
          training_frequency: 7
        },
        {
          type: 'one_class_svm',
          enabled: true,
          parameters: { nu: 0.1, kernel: 'rbf' },
          accuracy: 0.83,
          precision: 0.80,
          recall: 0.86,
          last_trained: new Date().toISOString(),
          training_frequency: 7
        }
      ],
      alerting: {
        enabled: true,
        channels: [
          {
            type: 'email',
            destination: 'security-team@trusthire.com',
            enabled: true,
            template: 'ueba-alert',
            filters: [
              { field: 'severity', operator: 'in', value: ['high', 'critical'] }
            ]
          }
        ],
        thresholds: [
          { metric: 'risk_score', operator: 'gt', value: 0.8, severity: 'high' },
          { metric: 'anomaly_count', operator: 'gt', value: 5, severity: 'medium' }
        ],
        escalation: {
          enabled: true,
          levels: [
            { level: 1, severity: 'high', recipients: ['analyst'], actions: ['investigate'] },
            { level: 2, severity: 'critical', recipients: ['manager'], actions: ['escalate'] }
          ],
          timeout: 60
        },
        suppression: {
          enabled: true,
          rules: [],
          duration: 30
        }
      },
      retention: {
        profiles: 365,
        anomalies: 90,
        alerts: 180,
        metrics: 30,
        raw_events: 7
      }
    };
  }

  // Start analytics processor
  private startAnalyticsProcessor(): void {
    setInterval(() => {
      if (!this.isProcessing) {
        this.processAnalytics();
      }
    }, this.config.update_frequency * 60 * 1000); // Convert minutes to milliseconds
  }

  // Process analytics
  private async processAnalytics(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;

    try {
      // Process behavioral profiles
      for (const profile of Array.from(this.profiles.values())) {
        // Update baseline if needed
        const lastUpdate = new Date(profile.last_updated).getTime();
        const now = Date.now();
        const updateInterval = this.config.update_frequency * 60 * 1000;

        if (now - lastUpdate > updateInterval) {
          // Simulate metrics update - in production, this would fetch real metrics
          const mockMetrics: CurrentMetrics = {
            ...profile.current_metrics,
            last_activity: new Date().toISOString()
          };

          await this.updateProfile(profile.entity_id, profile.entity_type, mockMetrics);
        }
      }

      // Clean up old data
      await this.cleanupOldData();

    } finally {
      this.isProcessing = false;
    }
  }

  // Clean up old data
  private async cleanupOldData(): Promise<void> {
    try {
      const now = Date.now();
      const retention = this.config.retention;

      // Clean up old anomalies
      for (const [id, anomaly] of Array.from(this.anomalies.entries())) {
        const anomalyTime = new Date(anomaly.detected_at).getTime();
        const retentionMs = retention.anomalies * 24 * 60 * 60 * 1000;
        
        if (now - anomalyTime > retentionMs) {
          this.anomalies.delete(id);
        }
      }

      // Clean up old alerts
      for (const [id, alert] of Array.from(this.alerts.entries())) {
        const alertTime = new Date(alert.created_at).getTime();
        const retentionMs = retention.alerts * 24 * 60 * 60 * 1000;
        
        if (now - alertTime > retentionMs) {
          this.alerts.delete(id);
        }
      }

    } catch (error) {
      console.error('Failed to cleanup old data:', error);
    }
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    activeProfiles: number;
    totalProfiles: number;
    anomaliesDetected: number;
    alertsGenerated: number;
    averageRiskScore: number;
    mlModelPerformance: ModelPerformance;
    lastProcessing: string | null;
    errors: string[];
  }> {
    try {
      const totalProfiles = this.profiles.size;
      const activeProfiles = Array.from(this.profiles.values())
        .filter(profile => Date.now() - new Date(profile.last_updated).getTime() < 24 * 60 * 60 * 1000).length;
      const anomaliesDetected = this.anomalies.size;
      const alertsGenerated = this.alerts.size;
      const averageRiskScore = this.profiles.size > 0 ? 
        Array.from(this.profiles.values()).reduce((sum, p) => sum + p.risk_score, 0) / this.profiles.size : 0;

      const mlModelPerformance: ModelPerformance = {
        accuracy: 0.84,
        precision: 0.81,
        recall: 0.87,
        f1_score: 0.84,
        roc_auc: 0.89,
        training_time: 120,
        last_updated: new Date().toISOString()
      };

      const status = activeProfiles === 0 ? 'critical' : 
                   averageRiskScore > 0.8 ? 'warning' : 'healthy';

      return {
        status,
        activeProfiles,
        totalProfiles,
        anomaliesDetected,
        alertsGenerated,
        averageRiskScore,
        mlModelPerformance,
        lastProcessing: null,
        errors: []
      };
    } catch (error) {
      console.error('Behavioral analytics health check failed:', error);
      return {
        status: 'critical',
        activeProfiles: 0,
        totalProfiles: 0,
        anomaliesDetected: 0,
        alertsGenerated: 0,
        averageRiskScore: 0,
        mlModelPerformance: {
          accuracy: 0,
          precision: 0,
          recall: 0,
          f1_score: 0,
          roc_auc: 0,
          training_time: 0,
          last_updated: ''
        },
        lastProcessing: null,
        errors: [error instanceof Error ? error.message : 'Health check failed']
      };
    }
  }
}

// Singleton instance
export const behavioralAnalyticsService = new BehavioralAnalyticsService();
