// Threat Actor Profiling and Attribution System
// Complete threat actor intelligence and attribution platform

import { PrismaClient } from '@prisma/client';
import { getRedisClient } from '@/lib/redis-wrapper';

export interface ThreatActor {
  id: string;
  name: string;
  aliases: string[];
  description: string;
  actor_type: 'apt' | 'cybercrime' | 'hacktivist' | 'insider' | 'state_sponsored' | 'terrorist' | 'unknown';
  sophistication: 'low' | 'medium' | 'high' | 'advanced';
  motivations: Motivation[];
  capabilities: Capability[];
  infrastructure: Infrastructure[];
  tools: Tool[];
  tactics: Tactics[];
  techniques: Technique[];
  procedures: Procedure[];
  targets: Target[];
  campaigns: Campaign[];
  attribution: Attribution;
  timeline: Timeline[];
  indicators: Indicator[];
  relationships: Relationship[];
  risk_assessment: RiskAssessment;
  intelligence_sources: IntelligenceSource[];
  last_updated: string;
  created_at: string;
  updated_at: string;
  confidence: number; // 0-1
  status: 'active' | 'dormant' | 'disbanded' | 'unknown';
}

export interface Motivation {
  type: 'financial' | 'political' | 'espionage' | 'destruction' | 'ideological' | 'reputation' | 'unknown';
  description: string;
  evidence: string[];
  confidence: number;
}

export interface Capability {
  category: 'malware_development' | 'vulnerability_exploitation' | 'social_engineering' | 'supply_chain' | 'lateral_movement' | 'persistence' | 'evasion' | 'c2' | 'exfiltration' | 'encryption';
  level: 'none' | 'basic' | 'intermediate' | 'advanced' | 'expert';
  description: string;
  evidence: string[];
  tools_used: string[];
  confidence: number;
}

export interface Infrastructure {
  type: 'c2_server' | 'malware_distribution' | 'phishing' | 'exfiltration' | 'staging' | 'communication' | 'registration' | 'hosting';
  details: InfrastructureDetails;
  status: 'active' | 'inactive' | 'compromised' | 'takedown';
  first_seen: string;
  last_seen: string;
  confidence: number;
}

export interface InfrastructureDetails {
  domains: string[];
  ip_addresses: string[];
  urls: string[];
  email_addresses: string[];
  certificates: Certificate[];
  hosting_providers: string[];
  countries: string[];
  asns: number[];
}

export interface Certificate {
  fingerprint: string;
  issuer: string;
  subject: string;
  serial_number: string;
  valid_from: string;
  valid_until: string;
  algorithm: string;
}

export interface Tool {
  name: string;
  type: 'malware' | 'exploit' | 'utility' | 'framework' | 'script' | 'toolkit';
  family?: string;
  variants: string[];
  description: string;
  capabilities: string[];
  first_seen: string;
  last_seen: string;
  prevalence: 'rare' | 'uncommon' | 'common' | 'widespread';
  attribution_confidence: number;
}

export interface Tactics {
  framework: string; // MITRE ATT&CK, etc.
  tactics: string[];
  kill_chain: KillChainPhase[];
  preferred_methods: string[];
  adaptation_trends: AdaptationTrend[];
}

export interface KillChainPhase {
  phase: string;
  description: string;
  techniques: string[];
  tools: string[];
  frequency: number;
  success_rate: number;
}

export interface AdaptationTrend {
  period: string;
  changes: string[];
  new_techniques: string[];
  abandoned_techniques: string[];
  drivers: string[];
}

export interface Technique {
  id: string;
  name: string;
  description: string;
  framework: string;
  tactics: string[];
  platforms: string[];
  data_sources: string[];
  detection_methods: DetectionMethod[];
  mitigation_strategies: MitigationStrategy[];
  usage_frequency: 'rare' | 'uncommon' | 'common' | 'frequent';
  effectiveness: number; // 0-1
  last_used: string;
}

export interface DetectionMethod {
  method: string;
  description: string;
  effectiveness: number; // 0-1
  implementation_difficulty: 'low' | 'medium' | 'high';
  false_positive_rate: number; // 0-1
}

export interface MitigationStrategy {
  strategy: string;
  description: string;
  effectiveness: number; // 0-1
  implementation_cost: 'low' | 'medium' | 'high';
  prerequisites: string[];
}

export interface Procedure {
  id: string;
  name: string;
  description: string;
  steps: ProcedureStep[];
  tools_used: string[];
  techniques_used: string[];
  objectives: string[];
  success_rate: number;
  complexity: 'low' | 'medium' | 'high';
  time_estimate: number; // minutes
  evidence: string[];
  last_observed: string;
}

export interface ProcedureStep {
  step_number: number;
  action: string;
  description: string;
  tools: string[];
  techniques: string[];
  expected_outcome: string;
  failure_points: string[];
  time_estimate: number; // minutes
}

export interface Target {
  type: 'industry' | 'organization' | 'individual' | 'government' | 'infrastructure' | 'data' | 'system';
  category: string;
  description: string;
  geography: string[];
  size: 'small' | 'medium' | 'large' | 'enterprise';
  value: 'low' | 'medium' | 'high' | 'critical';
  attack_surface: string[];
  vulnerabilities: string[];
  protection_level: 'minimal' | 'basic' | 'moderate' | 'advanced';
  targeting_frequency: number;
  success_rate: number;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed' | 'suspended' | 'unknown';
  objectives: string[];
  targets: string[];
  tools_used: string[];
  techniques_used: string[];
  success_indicators: string[];
  impact_assessment: ImpactAssessment;
  attribution_confidence: number;
  intelligence_sources: string[];
}

export interface ImpactAssessment {
  affected_entities: number;
  data_compromised: boolean;
  financial_impact: 'none' | 'minor' | 'moderate' | 'significant' | 'major';
  operational_impact: 'none' | 'minor' | 'moderate' | 'significant' | 'major';
  reputational_impact: 'none' | 'minor' | 'moderate' | 'significant' | 'major';
  recovery_time: number; // days
  cost_estimate?: number;
}

export interface Attribution {
  confidence: number; // 0-1
  methodology: AttributionMethodology[];
  evidence: AttributionEvidence[];
  challenges: AttributionChallenge[];
  alternative_attributions: AlternativeAttribution[];
  last_reviewed: string;
  reviewer: string;
}

export interface AttributionMethodology {
  method: 'technical' | 'operational' | 'human' | 'intelligence' | 'open_source' | 'forensic';
  description: string;
  weight: number; // 0-1
  findings: string[];
  confidence: number;
}

export interface AttributionEvidence {
  type: 'code_similarity' | 'infrastructure_overlap' | 'tool_usage' | 'tactics_similarity' | 'timing_correlation' | 'language_analysis' | 'operational_patterns' | 'intelligence_reports';
  description: string;
  strength: 'weak' | 'moderate' | 'strong' | 'conclusive';
  source: string;
  reliability: number; // 0-1
  relevance: number; // 0-1
}

export interface AttributionChallenge {
  challenge: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string;
}

export interface AlternativeAttribution {
  actor: string;
  confidence: number;
  supporting_evidence: string[];
  conflicting_evidence: string[];
}

export interface Timeline {
  date: string;
  event: string;
  description: string;
  category: 'activity' | 'attribution' | 'tool_development' | 'campaign' | 'infrastructure' | 'intelligence';
  sources: string[];
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
}

export interface Indicator {
  type: 'domain' | 'ip' | 'url' | 'hash' | 'email' | 'certificate' | 'pattern' | 'yara_rule' | 'snort_rule';
  value: string;
  description: string;
  context: string;
  first_seen: string;
  last_seen: string;
  confidence: number;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  source: string;
  tags: string[];
  related_actors: string[];
  related_campaigns: string[];
}

export interface Relationship {
  related_actor: string;
  relationship_type: 'collaboration' | 'competition' | 'shared_infrastructure' | 'shared_tools' | 'shared_targets' | 'mentorship' | 'conflict' | 'unknown';
  description: string;
  evidence: string[];
  confidence: number;
  strength: 'weak' | 'moderate' | 'strong';
  nature: 'formal' | 'informal' | 'coerced' | 'transactional' | 'unknown';
  timeline: string[];
}

export interface RiskAssessment {
  overall_risk: 'low' | 'medium' | 'high' | 'critical';
  threat_level: number; // 0-1
  capability_score: number; // 0-1
  intent_score: number; // 0-1
  targeting_likelihood: number; // 0-1
  impact_potential: number; // 0-1
  vulnerability_exploitation: number; // 0-1
  time_horizon: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  priority_actions: string[];
  mitigation_recommendations: string[];
  last_assessed: string;
}

export interface IntelligenceSource {
  source: string;
  type: 'open_source' | 'commercial' | 'government' | 'industry' | 'academic' | 'internal' | 'partner';
  reliability: number; // 0-1
  credibility: number; // 0-1
  last_update: string;
  coverage: string[];
  access_level: 'public' | 'restricted' | 'classified';
  confidence_weight: number; // 0-1
}

export interface ThreatActorProfile {
  actor: ThreatActor;
  analysis: ActorAnalysis;
  predictions: ActorPrediction[];
  recommendations: ActorRecommendation[];
  monitoring: MonitoringConfig;
}

export interface ActorAnalysis {
  behavior_patterns: BehaviorPattern[];
  evolution_trends: EvolutionTrend[];
  threat_assessment: ThreatAssessment;
  capability_analysis: CapabilityAnalysis;
  targeting_analysis: TargetingAnalysis;
  operational_patterns: OperationalPattern[];
}

export interface BehaviorPattern {
  pattern: string;
  description: string;
  frequency: number;
  time_period: string;
  indicators: string[];
  confidence: number;
  significance: 'low' | 'medium' | 'high' | 'critical';
}

export interface EvolutionTrend {
  trend: string;
  description: string;
  direction: 'increasing' | 'decreasing' | 'stable' | 'fluctuating';
  time_period: string;
  drivers: string[];
  implications: string[];
  confidence: number;
}

export interface ThreatAssessment {
  current_threat_level: 'low' | 'medium' | 'high' | 'critical';
  projected_threat_level: 'low' | 'medium' | 'high' | 'critical';
  time_horizon: number; // months
  key_factors: string[];
  uncertainty_factors: string[];
  confidence: number;
}

export interface CapabilityAnalysis {
  technical_capabilities: TechnicalCapability[];
  operational_capabilities: OperationalCapability[];
  resource_capabilities: ResourceCapability[];
  capability_gaps: string[];
  development_focus: string[];
}

export interface TechnicalCapability {
  capability: string;
  level: 'none' | 'basic' | 'intermediate' | 'advanced' | 'expert';
  evidence: string[];
  tools: string[];
  techniques: string[];
  maturity: number; // 0-1
}

export interface OperationalCapability {
  capability: string;
  level: 'limited' | 'moderate' | 'extensive';
  scale: 'small' | 'medium' | 'large' | 'enterprise';
  persistence: 'low' | 'medium' | 'high';
  adaptability: 'low' | 'medium' | 'high';
  evidence: string[];
}

export interface ResourceCapability {
  resource: 'funding' | 'personnel' | 'infrastructure' | 'tools' | 'intelligence' | 'time';
  level: 'limited' | 'adequate' | 'abundant';
  sustainability: 'low' | 'medium' | 'high';
  sources: string[];
  constraints: string[];
}

export interface TargetingAnalysis {
  primary_targets: string[];
  secondary_targets: string[];
  target_selection_criteria: TargetSelectionCriteria[];
  geographic_focus: string[];
  industry_focus: string[];
  target_evolution: TargetEvolution[];
}

export interface TargetSelectionCriteria {
  criterion: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: string[];
  weight: number; // 0-1
}

export interface TargetEvolution {
  period: string;
  changes: string[];
  new_targets: string[];
  abandoned_targets: string[];
  drivers: string[];
}

export interface OperationalPattern {
  pattern: string;
  description: string;
  frequency: string;
  duration: string;
  timing: TimingPattern[];
  success_factors: string[];
  failure_points: string[];
  adaptations: string[];
}

export interface TimingPattern {
  time_period: string;
  frequency: number;
  conditions: string[];
  significance: string;
}

export interface ActorPrediction {
  prediction_type: 'activity' | 'targeting' | 'capability' | 'infrastructure' | 'campaign' | 'threat_level';
  prediction: string;
  description: string;
  confidence: number;
  time_horizon: string;
  probability: number; // 0-1
  impact: 'low' | 'medium' | 'high' | 'critical';
  basis: string[];
  assumptions: string[];
  monitoring_indicators: string[];
}

export interface ActorRecommendation {
  category: 'detection' | 'prevention' | 'response' | 'intelligence' | 'monitoring';
  priority: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  description: string;
  implementation: ImplementationGuide;
  effectiveness: number; // 0-1
  cost: 'low' | 'medium' | 'high';
  timeframe: string;
  dependencies: string[];
}

export interface ImplementationGuide {
  steps: string[];
  resources: string[];
  tools: string[];
  teams: string[];
  timeline: string;
  success_criteria: string[];
  risks: string[];
}

export interface MonitoringConfig {
  indicators: MonitoringIndicator[];
  thresholds: MonitoringThreshold[];
  alerting: AlertingConfig;
  reporting: ReportingConfig;
  data_sources: string[];
}

export interface MonitoringIndicator {
  indicator: string;
  type: 'technical' | 'behavioral' | 'operational' | 'intelligence';
  description: string;
  collection_method: string;
  frequency: string;
  confidence_threshold: number;
  alert_conditions: string[];
}

export interface MonitoringThreshold {
  metric: string;
  threshold: number;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  action: string[];
}

export interface AlertingConfig {
  enabled: boolean;
  channels: AlertChannel[];
  escalation: EscalationConfig;
  suppression: SuppressionConfig;
}

export interface AlertChannel {
  type: 'email' | 'sms' | 'webhook' | 'slack' | 'teams' | 'siem';
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

export interface ReportingConfig {
  frequency: string;
  format: string[];
  recipients: string[];
  content: string[];
  templates: string[];
}

class ThreatActorService {
  private prisma: PrismaClient;
  private redis: any;
  private actors: Map<string, ThreatActor> = new Map();
  private profiles: Map<string, ThreatActorProfile> = new Map();
  private config: ThreatActorConfig;
  private isProcessing = false;

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = getRedisClient();
    this.initializeDefaultConfig();
    this.initializeDefaultActors();
    this.startAnalysisProcessor();
  }

  // Create or update threat actor
  async updateActor(actor: Omit<ThreatActor, 'id' | 'created_at' | 'updated_at'>): Promise<ThreatActor> {
    try {
      const existingActor = Array.from(this.actors.values()).find(a => 
        a.name === actor.name || a.aliases.some(alias => actor.aliases.includes(alias))
      );

      const updatedActor: ThreatActor = {
        ...actor,
        id: existingActor?.id || crypto.randomUUID(),
        created_at: existingActor?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Store in database
      await this.prisma.threatActor.upsert({
        where: { id: updatedActor.id },
        update: {
          name: updatedActor.name,
          aliases: JSON.stringify(updatedActor.aliases),
          description: updatedActor.description,
          actorType: updatedActor.actor_type,
          sophistication: updatedActor.sophistication,
          motivations: JSON.stringify(updatedActor.motivations),
          capabilities: JSON.stringify(updatedActor.capabilities),
          infrastructure: JSON.stringify(updatedActor.infrastructure),
          tools: JSON.stringify(updatedActor.tools),
          tactics: JSON.stringify(updatedActor.tactics),
          techniques: JSON.stringify(updatedActor.techniques),
          procedures: JSON.stringify(updatedActor.procedures),
          targets: JSON.stringify(updatedActor.targets),
          campaigns: JSON.stringify(updatedActor.campaigns),
          attribution: JSON.stringify(updatedActor.attribution),
          timeline: JSON.stringify(updatedActor.timeline),
          indicators: JSON.stringify(updatedActor.indicators),
          relationships: JSON.stringify(updatedActor.relationships),
          riskAssessment: JSON.stringify(updatedActor.risk_assessment),
          intelligenceSources: JSON.stringify(updatedActor.intelligence_sources),
          confidence: updatedActor.confidence,
          status: updatedActor.status,
          updatedAt: new Date(updatedActor.updated_at)
        },
        create: {
          id: updatedActor.id,
          name: updatedActor.name,
          aliases: JSON.stringify(updatedActor.aliases),
          description: updatedActor.description,
          actorType: updatedActor.actor_type,
          sophistication: updatedActor.sophistication,
          motivations: JSON.stringify(updatedActor.motivations),
          capabilities: JSON.stringify(updatedActor.capabilities),
          infrastructure: JSON.stringify(updatedActor.infrastructure),
          tools: JSON.stringify(updatedActor.tools),
          tactics: JSON.stringify(updatedActor.tactics),
          techniques: JSON.stringify(updatedActor.techniques),
          procedures: JSON.stringify(updatedActor.procedures),
          targets: JSON.stringify(updatedActor.targets),
          campaigns: JSON.stringify(updatedActor.campaigns),
          attribution: JSON.stringify(updatedActor.attribution),
          timeline: JSON.stringify(updatedActor.timeline),
          indicators: JSON.stringify(updatedActor.indicators),
          relationships: JSON.stringify(updatedActor.relationships),
          riskAssessment: JSON.stringify(updatedActor.risk_assessment),
          intelligenceSources: JSON.stringify(updatedActor.intelligence_sources),
          confidence: updatedActor.confidence,
          status: updatedActor.status,
          createdAt: new Date(updatedActor.created_at),
          updatedAt: new Date(updatedActor.updated_at)
        }
      });

      // Store in memory
      this.actors.set(updatedActor.id, updatedActor);

      // Update profile
      await this.updateActorProfile(updatedActor.id);

      return updatedActor;
    } catch (error) {
      console.error('Failed to update threat actor:', error);
      throw error;
    }
  }

  // Update actor profile
  private async updateActorProfile(actorId: string): Promise<void> {
    try {
      const actor = this.actors.get(actorId);
      if (!actor) return;

      const profile: ThreatActorProfile = {
        actor,
        analysis: await this.analyzeActor(actor),
        predictions: await this.generatePredictions(actor),
        recommendations: await this.generateRecommendations(actor),
        monitoring: this.generateMonitoringConfig(actor)
      };

      this.profiles.set(actorId, profile);
      await this.storeProfile(profile);
    } catch (error) {
      console.error('Failed to update actor profile:', error);
    }
  }

  // Analyze actor
  private async analyzeActor(actor: ThreatActor): Promise<ActorAnalysis> {
    try {
      return {
        behavior_patterns: this.identifyBehaviorPatterns(actor),
        evolution_trends: this.identifyEvolutionTrends(actor),
        threat_assessment: this.assessThreat(actor),
        capability_analysis: this.analyzeCapabilities(actor),
        targeting_analysis: this.analyzeTargeting(actor),
        operational_patterns: this.identifyOperationalPatterns(actor)
      };
    } catch (error) {
      console.error('Failed to analyze actor:', error);
      throw error;
    }
  }

  // Identify behavior patterns
  private identifyBehaviorPatterns(actor: ThreatActor): BehaviorPattern[] {
    const patterns: BehaviorPattern[] = [];

    // Analyze timeline for patterns
    const recentActivities = actor.timeline
      .filter(t => new Date(t.date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))
      .filter(t => t.category === 'activity');

    // Group by event type
    const eventGroups = this.groupBy(recentActivities, 'event');
    
    for (const [event, events] of Object.entries(eventGroups)) {
      if (events.length >= 3) {
        patterns.push({
          pattern: event,
          description: `Repeated ${event} activities detected`,
          frequency: events.length,
          time_period: '90 days',
          indicators: events.map(e => e.description),
          confidence: Math.min(1.0, events.length / 10),
          significance: events.length > 5 ? 'high' : 'medium'
        });
      }
    }

    return patterns;
  }

  // Group by helper
  private groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  // Identify evolution trends
  private identifyEvolutionTrends(actor: ThreatActor): EvolutionTrend[] {
    const trends: EvolutionTrend[] = [];

    // Analyze capability evolution
    const capabilityTrends = this.analyzeCapabilityEvolution(actor);
    trends.push(...capabilityTrends);

    // Analyze targeting evolution
    const targetingTrends = this.analyzeTargetingEvolution(actor);
    trends.push(...targetingTrends);

    // Analyze tool evolution
    const toolTrends = this.analyzeToolEvolution(actor);
    trends.push(...toolTrends);

    return trends;
  }

  // Analyze capability evolution
  private analyzeCapabilityEvolution(actor: ThreatActor): EvolutionTrend[] {
    const trends: EvolutionTrend[] = [];

    // Mock capability evolution analysis
    const advancedCapabilities = actor.capabilities.filter(c => c.level === 'advanced' || c.level === 'expert');
    const basicCapabilities = actor.capabilities.filter(c => c.level === 'basic' || c.level === 'intermediate');

    if (advancedCapabilities.length > basicCapabilities.length) {
      trends.push({
        trend: 'Increasing sophistication',
        description: 'Actor shows advanced capabilities in multiple areas',
        direction: 'increasing',
        time_period: '12 months',
        drivers: ['Resource investment', 'Skill development', 'Tool acquisition'],
        implications: ['Higher threat level', 'More difficult to detect', 'Greater impact potential'],
        confidence: 0.7
      });
    }

    return trends;
  }

  // Analyze targeting evolution
  private analyzeTargetingEvolution(actor: ThreatActor): EvolutionTrend[] {
    const trends: EvolutionTrend[] = [];

    // Mock targeting evolution analysis
    const recentTargets = actor.targets.filter(t => t.targeting_frequency > 0.5);
    const targetTypes = this.groupBy(recentTargets, 'type');

    if (Object.keys(targetTypes).length > 3) {
      trends.push({
        trend: 'Expanding target scope',
        description: 'Actor is targeting multiple types of entities',
        direction: 'increasing',
        time_period: '6 months',
        drivers: ['Opportunity seeking', 'Financial motivation', 'Capability expansion'],
        implications: ['Broader attack surface', 'Increased risk across sectors'],
        confidence: 0.6
      });
    }

    return trends;
  }

  // Analyze tool evolution
  private analyzeToolEvolution(actor: ThreatActor): EvolutionTrend[] {
    const trends: EvolutionTrend[] = [];

    // Mock tool evolution analysis
    const recentTools = actor.tools.filter(t => 
      new Date(t.last_seen) > new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
    );

    if (recentTools.length > actor.tools.length * 0.3) {
      trends.push({
        trend: 'Tool diversification',
        description: 'Actor is using new or updated tools',
        direction: 'increasing',
        time_period: '6 months',
        drivers: ['Evasion requirements', 'Capability enhancement', 'Counter-detection'],
        implications: ['Detection challenges', 'Updated signatures needed'],
        confidence: 0.8
      });
    }

    return trends;
  }

  // Assess threat
  private assessThreat(actor: ThreatActor): ThreatAssessment {
    const capabilityScore = this.calculateCapabilityScore(actor);
    const intentScore = this.calculateIntentScore(actor);
    const currentThreatLevel = this.calculateThreatLevel(capabilityScore, intentScore);

    return {
      current_threat_level: currentThreatLevel,
      projected_threat_level: this.projectThreatLevel(currentThreatLevel, actor),
      time_horizon: 12,
      key_factors: this.identifyKeyFactors(actor),
      uncertainty_factors: this.identifyUncertaintyFactors(actor),
      confidence: actor.confidence
    };
  }

  // Calculate capability score
  private calculateCapabilityScore(actor: ThreatActor): number {
    const capabilityLevels = {
      'none': 0,
      'basic': 0.25,
      'intermediate': 0.5,
      'advanced': 0.75,
      'expert': 1.0
    };

    const totalScore = actor.capabilities.reduce((sum, cap) => {
      return sum + (capabilityLevels[cap.level] || 0) * cap.confidence;
    }, 0);

    return actor.capabilities.length > 0 ? totalScore / actor.capabilities.length : 0;
  }

  // Calculate intent score
  private calculateIntentScore(actor: ThreatActor): number {
    const motivationWeights = {
      'financial': 0.8,
      'espionage': 0.9,
      'destruction': 0.7,
      'political': 0.6,
      'ideological': 0.5,
      'reputation': 0.4,
      'unknown': 0.3
    };

    const totalWeight = actor.motivations.reduce((sum, mot) => {
      return sum + (motivationWeights[mot.type] || 0.3) * mot.confidence;
    }, 0);

    return actor.motivations.length > 0 ? totalWeight / actor.motivations.length : 0;
  }

  // Calculate threat level
  private calculateThreatLevel(capabilityScore: number, intentScore: number): 'low' | 'medium' | 'high' | 'critical' {
    const combinedScore = (capabilityScore + intentScore) / 2;

    if (combinedScore >= 0.8) return 'critical';
    if (combinedScore >= 0.6) return 'high';
    if (combinedScore >= 0.4) return 'medium';
    return 'low';
  }

  // Project threat level
  private projectThreatLevel(currentLevel: string, actor: ThreatActor): 'low' | 'medium' | 'high' | 'critical' {
    // Mock projection based on trends
    const evolutionTrends = this.identifyEvolutionTrends(actor);
    const increasingTrends = evolutionTrends.filter(t => t.direction === 'increasing');

    if (increasingTrends.length > 2) {
      const levels: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
      const currentIndex = levels.indexOf(currentLevel);
      return levels[Math.min(currentIndex + 1, levels.length - 1)];
    }

    return currentLevel;
  }

  // Identify key factors
  private identifyKeyFactors(actor: ThreatActor): string[] {
    const factors: string[] = [];

    if (actor.sophistication === 'advanced' || actor.sophistication === 'expert') {
      factors.push('High technical sophistication');
    }

    if (actor.motivations.some(m => m.type === 'financial')) {
      factors.push('Financial motivation');
    }

    if (actor.infrastructure.filter(i => i.status === 'active').length > 5) {
      factors.push('Extensive infrastructure');
    }

    if (actor.tools.length > 10) {
      factors.push('Diverse toolset');
    }

    return factors;
  }

  // Identify uncertainty factors
  private identifyUncertaintyFactors(actor: ThreatActor): string[] {
    const factors: string[] = [];

    if (actor.confidence < 0.7) {
      factors.push('Limited intelligence confidence');
    }

    if (actor.status === 'unknown') {
      factors.push('Uncertain actor status');
    }

    if (actor.intelligence_sources.some(s => s.reliability < 0.5)) {
      factors.push('Low source reliability');
    }

    return factors;
  }

  // Analyze capabilities
  private analyzeCapabilities(actor: ThreatActor): CapabilityAnalysis {
    return {
      technical_capabilities: this.analyzeTechnicalCapabilities(actor),
      operational_capabilities: this.analyzeOperationalCapabilities(actor),
      resource_capabilities: this.analyzeResourceCapabilities(actor),
      capability_gaps: this.identifyCapabilityGaps(actor),
      development_focus: this.identifyDevelopmentFocus(actor)
    };
  }

  // Analyze technical capabilities
  private analyzeTechnicalCapabilities(actor: ThreatActor): TechnicalCapability[] {
    return actor.capabilities.map(cap => ({
      capability: cap.category,
      level: cap.level as any,
      evidence: cap.evidence,
      tools: cap.tools_used,
      techniques: [],
      maturity: cap.confidence
    }));
  }

  // Analyze operational capabilities
  private analyzeOperationalCapabilities(actor: ThreatActor): OperationalCapability[] {
    const capabilities: OperationalCapability[] = [];

    // Analyze campaign patterns
    const activeCampaigns = actor.campaigns.filter(c => c.status === 'active');
    
    capabilities.push({
      capability: 'Campaign execution',
      level: activeCampaigns.length > 3 ? 'extensive' : activeCampaigns.length > 0 ? 'moderate' : 'limited',
      scale: activeCampaigns.length > 5 ? 'enterprise' : activeCampaigns.length > 2 ? 'large' : 'medium',
      persistence: actor.status === 'active' ? 'high' : 'medium',
      adaptability: this.calculateAdaptability(actor),
      evidence: activeCampaigns.map(c => c.name)
    });

    return capabilities;
  }

  // Calculate adaptability
  private calculateAdaptability(actor: ThreatActor): 'low' | 'medium' | 'high' {
    const toolVariety = actor.tools.length;
    const techniqueVariety = actor.techniques.length;
    const infrastructureVariety = actor.infrastructure.length;

    const adaptabilityScore = (toolVariety + techniqueVariety + infrastructureVariety) / 30;

    if (adaptabilityScore > 0.7) return 'high';
    if (adaptabilityScore > 0.4) return 'medium';
    return 'low';
  }

  // Analyze resource capabilities
  private analyzeResourceCapabilities(actor: ThreatActor): ResourceCapability[] {
    const capabilities: ResourceCapability[] = [];

    // Infrastructure resources
    const activeInfrastructure = actor.infrastructure.filter(i => i.status === 'active');
    capabilities.push({
      resource: 'infrastructure',
      level: activeInfrastructure.length > 10 ? 'abundant' : activeInfrastructure.length > 5 ? 'adequate' : 'limited',
      sustainability: activeInfrastructure.length > 5 ? 'high' : 'medium',
      sources: activeInfrastructure.map(i => i.type),
      constraints: activeInfrastructure.some(i => i.status === 'compromised') ? ['Compromised infrastructure'] : []
    });

    return capabilities;
  }

  // Identify capability gaps
  private identifyCapabilityGaps(actor: ThreatActor): string[] {
    const gaps: string[] = [];
    const capabilityCategories = actor.capabilities.map(c => c.category);

    const allCategories = [
      'malware_development',
      'vulnerability_exploitation',
      'social_engineering',
      'supply_chain',
      'lateral_movement',
      'persistence',
      'evasion',
      'c2',
      'exfiltration',
      'encryption'
    ];

    for (const category of allCategories) {
      if (!capabilityCategories.includes(category)) {
        gaps.push(`Limited ${category.replace(/_/g, ' ')} capability`);
      }
    }

    return gaps;
  }

  // Identify development focus
  private identifyDevelopmentFocus(actor: ThreatActor): string[] {
    const focus: string[] = [];

    // Analyze recent tool additions
    const recentTools = actor.tools.filter(t => 
      new Date(t.first_seen) > new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
    );

    if (recentTools.length > 0) {
      const toolTypes = this.groupBy(recentTools, 'type');
      focus.push(...Object.keys(toolTypes).map(type => `${type} development`));
    }

    return focus;
  }

  // Analyze targeting
  private analyzeTargeting(actor: ThreatActor): TargetingAnalysis {
    return {
      primary_targets: this.identifyPrimaryTargets(actor),
      secondary_targets: this.identifySecondaryTargets(actor),
      target_selection_criteria: this.analyzeTargetSelectionCriteria(actor),
      geographic_focus: this.analyzeGeographicFocus(actor),
      industry_focus: this.analyzeIndustryFocus(actor),
      target_evolution: this.analyzeTargetEvolution(actor)
    };
  }

  // Identify primary targets
  private identifyPrimaryTargets(actor: ThreatActor): string[] {
    return actor.targets
      .filter(t => t.targeting_frequency > 0.7 && t.value === 'high' || t.value === 'critical')
      .map(t => t.type);
  }

  // Identify secondary targets
  private identifySecondaryTargets(actor: ThreatActor): string[] {
    return actor.targets
      .filter(t => t.targeting_frequency > 0.3 && t.targeting_frequency <= 0.7)
      .map(t => t.type);
  }

  // Analyze target selection criteria
  private analyzeTargetSelectionCriteria(actor: ThreatActor): TargetSelectionCriteria[] {
    const criteria: TargetSelectionCriteria[] = [];

    // Analyze common characteristics of targets
    const highValueTargets = actor.targets.filter(t => t.value === 'high' || t.value === 'critical');
    
    if (highValueTargets.length > 0) {
      criteria.push({
        criterion: 'High value targets',
        importance: 'critical',
        description: 'Actor preferentially targets high-value entities',
        evidence: highValueTargets.map(t => t.description),
        weight: 0.8
      });
    }

    return criteria;
  }

  // Analyze geographic focus
  private analyzeGeographicFocus(actor: ThreatActor): string[] {
    const geographies = new Set<string>();
    
    for (const target of actor.targets) {
      target.geography.forEach(geo => geographies.add(geo));
    }

    for (const infra of actor.infrastructure) {
      infra.details.countries.forEach(country => geographies.add(country));
    }

    return Array.from(geographies);
  }

  // Analyze industry focus
  private analyzeIndustryFocus(actor: ThreatActor): string[] {
    const industries = new Set<string>();
    
    for (const target of actor.targets) {
      if (target.type === 'industry') {
        industries.add(target.category);
      }
    }

    return Array.from(industries);
  }

  // Analyze target evolution
  private analyzeTargetEvolution(actor: ThreatActor): TargetEvolution[] {
    const evolutions: TargetEvolution[] = [];

    // Mock target evolution analysis
    const recentTargets = actor.targets.filter(t => 
      new Date(t.last_seen) > new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
    );

    if (recentTargets.length > 0) {
      evolutions.push({
        period: 'Last 6 months',
        changes: ['Expanded target types'],
        new_targets: recentTargets.map(t => t.type),
        abandoned_targets: [],
        drivers: ['Opportunity seeking', 'Capability expansion']
      });
    }

    return evolutions;
  }

  // Identify operational patterns
  private identifyOperationalPatterns(actor: ThreatActor): OperationalPattern[] {
    const patterns: OperationalPattern[] = [];

    // Analyze campaign patterns
    const campaigns = actor.campaigns.filter(c => c.status === 'completed');
    
    if (campaigns.length > 2) {
      const durations = campaigns.map(c => {
        if (c.end_date) {
          return new Date(c.end_date).getTime() - new Date(c.start_date).getTime();
        }
        return 0;
      }).filter(d => d > 0);

      const avgDuration = durations.length > 0 ? durations.reduce((sum, d) => sum + d, 0) / durations.length : 0;

      patterns.push({
        pattern: 'Campaign execution',
        description: `Average campaign duration: ${Math.round(avgDuration / (24 * 60 * 60 * 1000))} days`,
        frequency: campaigns.length > 0 ? `${campaigns.length} campaigns observed` : 'Unknown',
        duration: `${Math.round(avgDuration / (24 * 60 * 60 * 1000))} days average`,
        timing: [],
        success_factors: campaigns.flatMap(c => c.success_indicators),
        failure_points: [],
        adaptations: []
      });
    }

    return patterns;
  }

  // Generate predictions
  private async generatePredictions(actor: ThreatActor): Promise<ActorPrediction[]> {
    const predictions: ActorPrediction[] = [];

    // Activity predictions
    predictions.push({
      prediction_type: 'activity',
      prediction: 'Continued campaign operations',
      description: 'Actor likely to maintain current activity levels',
      confidence: 0.7,
      time_horizon: '3 months',
      probability: 0.8,
      impact: 'high',
      basis: ['Historical activity patterns', 'Current infrastructure status'],
      assumptions: ['No significant disruptions', 'Resource availability maintained'],
      monitoring_indicators: ['Infrastructure activity', 'Tool deployment']
    });

    // Targeting predictions
    const primaryTargets = this.identifyPrimaryTargets(actor);
    if (primaryTargets.length > 0) {
      predictions.push({
        prediction_type: 'targeting',
        prediction: `Focus on ${primaryTargets.join(', ')} sectors`,
        description: 'Actor likely to continue targeting primary sectors',
        confidence: 0.6,
        time_horizon: '6 months',
        probability: 0.7,
        impact: 'medium',
        basis: ['Historical targeting patterns', 'Motivation analysis'],
        assumptions: ['Motivations remain consistent', 'Target opportunities available'],
        monitoring_indicators: ['Sector-specific threat indicators', 'Target reconnaissance']
      });
    }

    return predictions;
  }

  // Generate recommendations
  private async generateRecommendations(actor: ThreatActor): Promise<ActorRecommendation[]> {
    const recommendations: ActorRecommendation[] = [];

    // Detection recommendations
    recommendations.push({
      category: 'detection',
      priority: actor.sophistication === 'advanced' || actor.sophistication === 'expert' ? 'high' : 'medium',
      recommendation: 'Enhanced detection capabilities',
      description: 'Implement advanced detection methods for sophisticated actor',
      implementation: {
        steps: ['Deploy EDR solutions', 'Implement behavioral analytics', 'Update threat intelligence feeds'],
        resources: ['Security team', 'Budget allocation', 'Technology platforms'],
        tools: ['SIEM', 'EDR', 'Threat intelligence platforms'],
        teams: ['Security Operations', 'Threat Intelligence'],
        timeline: '3-6 months',
        success_criteria: ['Detection rate improvement', 'Reduced dwell time'],
        risks: ['Implementation complexity', 'False positives']
      },
      effectiveness: 0.8,
      cost: 'high',
      timeframe: '3-6 months',
      dependencies: ['Budget approval', 'Staff training']
    });

    // Prevention recommendations
    recommendations.push({
      category: 'prevention',
      priority: 'medium',
      recommendation: 'Targeted hardening',
      description: 'Strengthen defenses against actor-specific TTPs',
      implementation: {
        steps: ['Analyze actor TTPs', 'Implement specific controls', 'Update security policies'],
        resources: ['Security team', 'Policy documents'],
        tools: ['Configuration management', 'Security frameworks'],
        teams: ['Security Operations', 'IT Operations'],
        timeline: '1-3 months',
        success_criteria: ['Control implementation', 'Policy compliance'],
        risks: ['Operational impact', 'Compatibility issues']
      },
      effectiveness: 0.7,
      cost: 'medium',
      timeframe: '1-3 months',
      dependencies: ['TTP analysis', 'Change management']
    });

    return recommendations;
  }

  // Generate monitoring config
  private generateMonitoringConfig(actor: ThreatActor): MonitoringConfig {
    return {
      indicators: this.generateMonitoringIndicators(actor),
      thresholds: this.generateMonitoringThresholds(),
      alerting: {
        enabled: true,
        channels: [
          {
            type: 'email',
            destination: 'security@company.com',
            enabled: true,
            template: 'threat_actor_alert',
            filters: [
              { field: 'severity', operator: 'in', value: ['high', 'critical'] }
            ]
          }
        ],
        escalation: {
          enabled: true,
          levels: [
            {
              level: 1,
              severity: 'high',
              recipients: ['Security Manager'],
              actions: ['Investigation required']
            }
          ],
          timeout: 60
        },
        suppression: {
          enabled: true,
          rules: [],
          duration: 30
        }
      },
      reporting: {
        frequency: 'weekly',
        format: ['pdf', 'html'],
        recipients: ['Security Team', 'Management'],
        content: ['Activity summary', 'Threat assessment', 'Recommendations'],
        templates: ['threat_actor_report']
      },
      data_sources: ['SIEM', 'Threat intelligence', 'Network logs', 'Endpoint data']
    };
  }

  // Generate monitoring indicators
  private generateMonitoringIndicators(actor: ThreatActor): MonitoringIndicator[] {
    const indicators: MonitoringIndicator[] = [];

    // Infrastructure monitoring
    actor.infrastructure.forEach(infra => {
      if (infra.status === 'active') {
        indicators.push({
          indicator: `Infrastructure: ${infra.type}`,
          type: 'technical',
          description: `Monitor ${infra.type} infrastructure`,
          collection_method: 'Network monitoring',
          frequency: 'continuous',
          confidence_threshold: 0.7,
          alert_conditions: ['Activity detected', 'New infrastructure']
        });
      }
    });

    // Tool monitoring
    actor.tools.forEach(tool => {
      indicators.push({
        indicator: `Tool: ${tool.name}`,
        type: 'technical',
        description: `Monitor for ${tool.name} usage`,
        collection_method: 'Endpoint detection',
        frequency: 'continuous',
        confidence_threshold: 0.6,
        alert_conditions: ['Tool detected', 'New variant']
      });
    });

    return indicators;
  }

  // Generate monitoring thresholds
  private generateMonitoringThresholds(): MonitoringThreshold[] {
    return [
      {
        metric: 'confidence_score',
        threshold: 0.8,
        operator: 'gte',
        severity: 'high',
        action: ['Generate alert', 'Update intelligence']
      },
      {
        metric: 'activity_frequency',
        threshold: 5,
        operator: 'gt',
        severity: 'medium',
        action: ['Increase monitoring', 'Review defenses']
      }
    ];
  }

  // Store profile
  private async storeProfile(profile: ThreatActorProfile): Promise<void> {
    try {
      await this.redis.setex(`threat_actor_profile:${profile.actor.id}`, 3600, JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to store threat actor profile:', error);
    }
  }

  // Get actor by ID
  async getActor(actorId: string): Promise<ThreatActor | null> {
    try {
      return this.actors.get(actorId) || null;
    } catch (error) {
      console.error('Failed to get threat actor:', error);
      return null;
    }
  }

  // Get all actors
  async getActors(filters?: {
    actor_type?: string;
    sophistication?: string;
    status?: string;
    confidence_min?: number;
  }): Promise<ThreatActor[]> {
    try {
      let actors = Array.from(this.actors.values());

      // Apply filters
      if (filters?.actor_type) {
        actors = actors.filter(actor => actor.actor_type === filters.actor_type);
      }
      if (filters?.sophistication) {
        actors = actors.filter(actor => actor.sophistication === filters.sophistication);
      }
      if (filters?.status) {
        actors = actors.filter(actor => actor.status === filters.status);
      }
      if (filters?.confidence_min !== undefined) {
        actors = actors.filter(actor => actor.confidence >= filters.confidence_min);
      }

      return actors;
    } catch (error) {
      console.error('Failed to get threat actors:', error);
      return [];
    }
  }

  // Get actor profile
  async getActorProfile(actorId: string): Promise<ThreatActorProfile | null> {
    try {
      return this.profiles.get(actorId) || null;
    } catch (error) {
      console.error('Failed to get actor profile:', error);
      return null;
    }
  }

  // Search actors
  async searchActors(query: string, filters?: {
    actor_type?: string;
    sophistication?: string;
    status?: string;
  }): Promise<ThreatActor[]> {
    try {
      let actors = Array.from(this.actors.values());

      // Text search
      const lowerQuery = query.toLowerCase();
      actors = actors.filter(actor => 
        actor.name.toLowerCase().includes(lowerQuery) ||
        actor.aliases.some(alias => alias.toLowerCase().includes(lowerQuery)) ||
        actor.description.toLowerCase().includes(lowerQuery)
      );

      // Apply filters
      if (filters?.actor_type) {
        actors = actors.filter(actor => actor.actor_type === filters.actor_type);
      }
      if (filters?.sophistication) {
        actors = actors.filter(actor => actor.sophistication === filters.sophistication);
      }
      if (filters?.status) {
        actors = actors.filter(actor => actor.status === filters.status);
      }

      return actors;
    } catch (error) {
      console.error('Failed to search threat actors:', error);
      return [];
    }
  }

  // Initialize default configuration
  private initializeDefaultConfig(): void {
    this.config = {
      update_frequency: 3600, // 1 hour
      analysis_frequency: 86400, // 24 hours
      confidence_threshold: 0.7,
      alert_threshold: 0.8,
      retention_period: 2555, // 7 years
      max_actors: 1000,
      intelligence_sources: [
        'open_source',
        'commercial',
        'industry',
        'internal'
      ]
    };
  }

  // Initialize default actors
  private initializeDefaultActors(): void {
    // Mock APT28 actor
    const apt28: ThreatActor = {
      id: 'apt28',
      name: 'APT28',
      aliases: ['Fancy Bear', 'Sofacy', 'Pawn Storm'],
      description: 'Russian state-sponsored threat actor known for cyber espionage and political influence operations',
      actor_type: 'apt',
      sophistication: 'advanced',
      motivations: [
        {
          type: 'espionage',
          description: 'Political and military espionage',
          evidence: ['Targeting of government entities', 'Intelligence gathering operations'],
          confidence: 0.9
        },
        {
          type: 'political',
          description: 'Political influence operations',
          evidence: ['Election interference campaigns', 'Disinformation operations'],
          confidence: 0.8
        }
      ],
      capabilities: [
        {
          category: 'malware_development',
          level: 'advanced',
          description: 'Custom malware development capabilities',
          evidence: ['Sofacy malware family', 'Custom backdoors'],
          tools_used: ['Sofacy', 'X-Agent', 'X-Tunnel'],
          confidence: 0.9
        },
        {
          category: 'vulnerability_exploitation',
          level: 'advanced',
          description: 'Zero-day vulnerability exploitation',
          evidence: ['Use of zero-day exploits', 'Rapid exploitation of disclosed vulnerabilities'],
          tools_used: ['CVE exploits', 'Custom exploits'],
          confidence: 0.8
        }
      ],
      infrastructure: [
        {
          type: 'c2_server',
          details: {
            domains: ['example-c2.com'],
            ip_addresses: ['192.0.2.1'],
            urls: [],
            email_addresses: [],
            certificates: [],
            hosting_providers: ['Various'],
            countries: ['RU'],
            asns: [12345]
          },
          status: 'active',
          first_seen: '2015-01-01T00:00:00Z',
          last_seen: new Date().toISOString(),
          confidence: 0.7
        }
      ],
      tools: [
        {
          name: 'Sofacy',
          type: 'malware',
          family: 'Sofacy',
          variants: ['Sofacy', 'X-Agent'],
          description: 'Custom backdoor used for persistent access',
          capabilities: ['Remote access', 'Data exfiltration', 'Lateral movement'],
          first_seen: '2015-01-01T00:00:00Z',
          last_seen: new Date().toISOString(),
          prevalence: 'uncommon',
          attribution_confidence: 0.9
        }
      ],
      tactics: {
        framework: 'MITRE ATT&CK',
        tactics: ['Initial Access', 'Execution', 'Persistence', 'Command and Control', 'Exfiltration'],
        kill_chain: [
          {
            phase: 'Reconnaissance',
            description: 'Target reconnaissance and intelligence gathering',
            techniques: ['T1595'],
            tools: ['Open source intelligence'],
            frequency: 0.8,
            success_rate: 0.7
          }
        ],
        preferred_methods: ['Spear phishing', 'Exploitation of vulnerabilities'],
        adaptation_trends: [
          {
            period: '2020-2023',
            changes: ['Increased use of legitimate services'],
            new_techniques: ['Living off the land'],
            abandoned_techniques: ['Custom malware'],
            drivers: ['Detection evasion']
          }
        ]
      },
      techniques: [
        {
          id: 'T1566',
          name: 'Phishing',
          description: 'Spear phishing attachments and links',
          framework: 'MITRE ATT&CK',
          tactics: ['Initial Access'],
          platforms: ['Windows', 'Linux', 'macOS'],
          data_sources: ['Email logs', 'Network traffic'],
          detection_methods: [
            {
              method: 'Email analysis',
              description: 'Analyze email headers and content',
              effectiveness: 0.7,
              implementation_difficulty: 'medium',
              false_positive_rate: 0.2
            }
          ],
          mitigation_strategies: [
            {
              strategy: 'Email filtering',
              description: 'Implement advanced email filtering',
              effectiveness: 0.8,
              implementation_cost: 'medium',
              prerequisites: ['Email gateway']
            }
          ],
          usage_frequency: 'frequent',
          effectiveness: 0.8,
          last_used: new Date().toISOString()
        }
      ],
      procedures: [
        {
          id: 'apt28-initial-access',
          name: 'Initial Access Procedure',
          description: 'Standard procedure for gaining initial access',
          steps: [
            {
              step_number: 1,
              action: 'Target identification',
              description: 'Identify high-value targets',
              tools: ['OSINT tools'],
              techniques: ['T1595'],
              expected_outcome: 'Target list compiled',
              failure_points: ['Limited public information'],
              time_estimate: 120
            }
          ],
          tools_used: ['OSINT tools', 'Custom scripts'],
          techniques_used: ['T1595'],
          objectives: ['Gain initial access'],
          success_rate: 0.7,
          complexity: 'medium',
          time_estimate: 240,
          evidence: ['Campaign analysis'],
          last_observed: new Date().toISOString()
        }
      ],
      targets: [
        {
          type: 'government',
          category: 'Government agencies',
          description: 'Government and diplomatic entities',
          geography: ['US', 'EU', 'NATO countries'],
          size: 'enterprise',
          value: 'critical',
          attack_surface: ['Email systems', 'Web applications'],
          vulnerabilities: ['Unpatched systems', 'Weak authentication'],
          protection_level: 'moderate',
          targeting_frequency: 0.8,
          success_rate: 0.6
        }
      ],
      campaigns: [
        {
          id: 'apt28-election-2020',
          name: 'Election Interference 2020',
          description: 'Campaign targeting election infrastructure',
          start_date: '2020-01-01T00:00:00Z',
          end_date: '2020-12-31T23:59:59Z',
          status: 'completed',
          objectives: ['Influence election outcome', 'Gather intelligence'],
          targets: ['Election infrastructure', 'Political campaigns'],
          tools_used: ['Sofacy', 'Custom malware'],
          techniques_used: ['T1566', 'T1053'],
          success_indicators: ['Data exfiltrated', 'Systems compromised'],
          impact_assessment: {
            affected_entities: 50,
            data_compromised: true,
            financial_impact: 'minor',
            operational_impact: 'moderate',
            reputational_impact: 'significant',
            recovery_time: 180,
            cost_estimate: 1000000
          },
          attribution_confidence: 0.8,
          intelligence_sources: ['Open source', 'Government reports']
        }
      ],
      attribution: {
        confidence: 0.8,
        methodology: [
          {
            method: 'technical',
            description: 'Code similarity and infrastructure analysis',
            weight: 0.4,
            findings: ['Code similarities', 'Shared infrastructure'],
            confidence: 0.7
          },
          {
            method: 'intelligence',
            description: 'Intelligence community assessments',
            weight: 0.6,
            findings: ['Government attribution', 'Defector statements'],
            confidence: 0.9
          }
        ],
        evidence: [
          {
            type: 'code_similarity',
            description: 'Similar code patterns across malware samples',
            strength: 'strong',
            source: 'Malware analysis',
            reliability: 0.8,
            relevance: 0.9
          }
        ],
        challenges: [
          {
            challenge: 'False flag operations',
            description: 'Actor may attempt to attribute attacks to others',
            impact: 'high',
            mitigation: 'Multiple source verification'
          }
        ],
        alternative_attributions: [],
        last_reviewed: new Date().toISOString(),
        reviewer: 'Threat Intelligence Team'
      },
      timeline: [
        {
          date: '2015-01-01T00:00:00Z',
          event: 'First observed activity',
          description: 'APT28 first observed in cyber operations',
          category: 'activity',
          sources: ['Industry reports'],
          confidence: 0.8,
          impact: 'high'
        }
      ],
      indicators: [
        {
          type: 'domain',
          value: 'example-c2.com',
          description: 'Command and control domain',
          context: 'C2 infrastructure',
          first_seen: '2015-01-01T00:00:00Z',
          last_seen: new Date().toISOString(),
          confidence: 0.7,
          severity: 'high',
          source: 'Threat intelligence',
          tags: ['c2', 'apt28'],
          related_actors: ['apt28'],
          related_campaigns: ['apt28-election-2020']
        }
      ],
      relationships: [
        {
          related_actor: 'apt29',
          relationship_type: 'collaboration',
          description: 'Possible collaboration on certain campaigns',
          evidence: ['Shared infrastructure', 'Similar targets'],
          confidence: 0.5,
          strength: 'moderate',
          nature: 'informal',
          timeline: ['2016-2018']
        }
      ],
      risk_assessment: {
        overall_risk: 'high',
        threat_level: 0.8,
        capability_score: 0.85,
        intent_score: 0.75,
        targeting_likelihood: 0.7,
        impact_potential: 0.8,
        vulnerability_exploitation: 0.7,
        time_horizon: 'short_term',
        priority_actions: ['Enhanced monitoring', 'Threat hunting', 'Intelligence sharing'],
        mitigation_recommendations: ['Patch management', 'Network segmentation', 'User training'],
        last_assessed: new Date().toISOString()
      },
      intelligence_sources: [
        {
          source: 'Mandiant',
          type: 'commercial',
          reliability: 0.9,
          credibility: 0.9,
          last_update: new Date().toISOString(),
          coverage: ['APT groups', 'Malware analysis'],
          access_level: 'restricted',
          confidence_weight: 0.8
        }
      ],
      last_updated: new Date().toISOString(),
      created_at: '2015-01-01T00:00:00Z',
      updated_at: new Date().toISOString(),
      confidence: 0.8,
      status: 'active'
    };

    this.actors.set(apt28.id, apt28);
  }

  // Start analysis processor
  private startAnalysisProcessor(): void {
    setInterval(() => {
      if (!this.isProcessing) {
        this.processActorAnalysis();
      }
    }, this.config.analysis_frequency * 1000);
  }

  // Process actor analysis
  private async processActorAnalysis(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;

    try {
      // Update all actor profiles
      for (const actor of Array.from(this.actors.values())) {
        await this.updateActorProfile(actor.id);
      }

      // Generate intelligence summaries
      await this.generateIntelligenceSummaries();

    } finally {
      this.isProcessing = false;
    }
  }

  // Generate intelligence summaries
  private async generateIntelligenceSummaries(): Promise<void> {
    try {
      const activeActors = Array.from(this.actors.values()).filter(a => a.status === 'active');
      
      // Generate daily summary
      const summary = {
        date: new Date().toISOString(),
        total_actors: this.actors.size,
        active_actors: activeActors.length,
        high_risk_actors: activeActors.filter(a => a.risk_assessment.overall_risk === 'critical' || a.risk_assessment.overall_risk === 'high').length,
        recent_activity: activeActors.filter(a => 
          new Date(a.last_updated) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length
      };

      await this.redis.setex('threat_actor_summary', 86400, JSON.stringify(summary));
    } catch (error) {
      console.error('Failed to generate intelligence summaries:', error);
    }
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    totalActors: number;
    activeActors: number;
    highRiskActors: number;
    averageConfidence: number;
    lastAnalysis: string | null;
    errors: string[];
  }> {
    try {
      const totalActors = this.actors.size;
      const activeActors = Array.from(this.actors.values()).filter(a => a.status === 'active').length;
      const highRiskActors = Array.from(this.actors.values()).filter(a => 
        a.risk_assessment.overall_risk === 'critical' || a.risk_assessment.overall_risk === 'high'
      ).length;
      const averageConfidence = this.actors.size > 0 ? 
        Array.from(this.actors.values()).reduce((sum, a) => sum + a.confidence, 0) / this.actors.size : 0;

      const status = activeActors === 0 ? 'critical' : 
                   averageConfidence < 0.5 ? 'warning' : 'healthy';

      return {
        status,
        totalActors,
        activeActors,
        highRiskActors,
        averageConfidence,
        lastAnalysis: null,
        errors: []
      };
    } catch (error) {
      console.error('Threat actor health check failed:', error);
      return {
        status: 'critical',
        totalActors: 0,
        activeActors: 0,
        highRiskActors: 0,
        averageConfidence: 0,
        lastAnalysis: null,
        errors: [error instanceof Error ? error.message : 'Health check failed']
      };
    }
  }
}

// Configuration interface
interface ThreatActorConfig {
  update_frequency: number;
  analysis_frequency: number;
  confidence_threshold: number;
  alert_threshold: number;
  retention_period: number;
  max_actors: number;
  intelligence_sources: string[];
}

// Singleton instance
export const threatActorService = new ThreatActorService();
