// Zero Trust Architecture Service
// Complete zero-trust implementation with continuous verification

import { PrismaClient } from '@prisma/client';
import { getRedisClient } from '@/lib/redis-wrapper';

export interface ZeroTrustPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  scope: PolicyScope;
  rules: PolicyRule[];
  conditions: PolicyCondition[];
  actions: RuleAction[];
  verification: VerificationConfig;
  compliance: ComplianceConfig;
  metrics: PolicyMetrics;
  created_at: string;
  updated_at: string;
  created_by: string;
  version: string;
}

export interface PolicyScope {
  users: string[];
  groups: string[];
  devices: string[];
  applications: string[];
  networks: string[];
  locations: string[];
  data_types: string[];
  access_levels: AccessLevel[];
}

export interface AccessLevel {
  level: number;
  name: string;
  description: string;
  permissions: string[];
  restrictions: string[];
  time_restrictions: TimeRestriction[];
  geo_restrictions: GeoRestriction[];
  device_requirements: DeviceRequirement[];
  authentication_requirements: AuthRequirement[];
}

export interface TimeRestriction {
  type: 'business_hours' | 'custom' | 'never' | 'always';
  start_time?: string; // HH:MM
  end_time?: string;   // HH:MM
  days?: number[];    // 0-6 (Sunday-Saturday)
  timezone?: string;
}

export interface GeoRestriction {
  type: 'allow' | 'deny';
  countries: string[];
  regions: string[];
  ip_ranges: string[];
  locations: string[];
}

export interface DeviceRequirement {
  type: 'os' | 'version' | 'patch_level' | 'encryption' | 'antivirus' | 'firewall' | 'certificate';
  operator: 'eq' | 'ne' | 'gte' | 'lte' | 'in' | 'not_in';
  value: string | string[];
  required: boolean;
}

export interface AuthRequirement {
  type: 'mfa' | 'password' | 'certificate' | 'biometric' | 'hardware_token' | 'sso';
  required: boolean;
  strength: 'low' | 'medium' | 'high';
  methods: string[];
  fallback_allowed: boolean;
}

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  conditions: RuleCondition[];
  actions: RuleAction[];
  timeout: number; // seconds
  retry_policy: RetryPolicy;
  evaluation_mode: 'real_time' | 'scheduled' | 'event_driven';
}

export interface RuleCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'not_in' | 'contains' | 'regex';
  value: any;
  weight: number;
  required: boolean;
  negated: boolean;
}

export interface RuleAction {
  type: 'allow' | 'deny' | 'challenge' | 'escalate' | 'log' | 'notify' | 'require_mfa' | 'require_device_check';
  parameters: Record<string, any>;
  priority: number;
  delay?: number; // seconds
}

export interface RetryPolicy {
  max_attempts: number;
  backoff_type: 'fixed' | 'exponential' | 'linear';
  base_delay: number; // seconds
  max_delay: number; // seconds
  retry_on: ('failure' | 'timeout' | 'error')[];
}

export interface PolicyCondition {
  id: string;
  name: string;
  description: string;
  expression: string;
  variables: string[];
  enabled: boolean;
}

export interface VerificationConfig {
  continuous: boolean;
  interval: number; // minutes
  methods: VerificationMethod[];
  risk_thresholds: RiskThreshold[];
  anomaly_detection: AnomalyDetectionConfig;
  behavioral_analysis: BehavioralAnalysisConfig;
}

export interface VerificationMethod {
  type: 'device_health' | 'user_behavior' | 'network_anomaly' | 'data_access' | 'session_integrity';
  enabled: boolean;
  frequency: number; // minutes
  sensitivity: 'low' | 'medium' | 'high';
  thresholds: Record<string, number>;
}

export interface RiskThreshold {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  actions: string[];
  escalation_required: boolean;
}

export interface AnomalyDetectionConfig {
  enabled: boolean;
  algorithms: AnomalyAlgorithm[];
  baseline_period: number; // days
  sensitivity: number; // 0-1
  false_positive_rate: number; // 0-1
}

export interface AnomalyAlgorithm {
  type: 'statistical' | 'machine_learning' | 'behavioral' | 'temporal';
  enabled: boolean;
  parameters: Record<string, any>;
  weight: number;
}

export interface BehavioralAnalysisConfig {
  enabled: boolean;
  baseline_days: number;
  risk_factors: RiskFactor[];
  patterns: BehaviorPattern[];
  learning_enabled: boolean;
}

export interface RiskFactor {
  factor: string;
  weight: number;
  threshold: number;
  description: string;
}

export interface BehaviorPattern {
  id: string;
  name: string;
  description: string;
  pattern: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
}

export interface ComplianceConfig {
  frameworks: ComplianceFramework[];
  audit_frequency: number; // days
  reporting: ReportingConfig;
  enforcement: EnforcementConfig;
  monitoring: MonitoringConfig;
}

export interface ComplianceFramework {
  name: string;
  version: string;
  requirements: ComplianceRequirement[];
  enabled: boolean;
}

export interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  category: string;
  mandatory: boolean;
  controls: ComplianceControl[];
  verification_method: string;
  evidence_required: boolean;
}

export interface ComplianceControl {
  id: string;
  name: string;
  description: string;
  type: 'technical' | 'administrative' | 'physical';
  implemented: boolean;
  effectiveness: number; // 0-1
  last_verified: string;
}

export interface ReportingConfig {
  enabled: boolean;
  format: 'json' | 'pdf' | 'html' | 'csv';
  frequency: number; // days
  recipients: string[];
  include_details: boolean;
  include_recommendations: boolean;
}

export interface EnforcementConfig {
  mode: 'monitor' | 'warn' | 'block' | 'escalate';
  automatic_actions: boolean;
  manual_review_required: boolean;
  escalation_threshold: number;
}

export interface MonitoringConfig {
  real_time: boolean;
  alerts: AlertConfig[];
  dashboard: DashboardConfig;
  logging: LoggingConfig;
}

export interface AlertConfig {
  enabled: boolean;
  channels: AlertChannel[];
  thresholds: AlertThreshold[];
  severity_filter: string[];
}

export interface AlertChannel {
  type: 'email' | 'slack' | 'teams' | 'webhook' | 'sms';
  destination: string;
  enabled: boolean;
  template: string;
}

export interface AlertThreshold {
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  value: number;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
}

export interface DashboardConfig {
  enabled: boolean;
  widgets: DashboardWidget[];
  refresh_interval: number; // seconds
  access_roles: string[];
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'alert' | 'timeline';
  title: string;
  position: { x: number; y: number; width: number; height: number };
  config: Record<string, any>;
  data_source: string;
}

export interface LoggingConfig {
  enabled: boolean;
  level: 'debug' | 'info' | 'warning' | 'error';
  retention_days: number;
  include_sensitive: boolean;
  audit_trail: boolean;
}

export interface PolicyMetrics {
  total_evaluations: number;
  successful_evaluations: number;
  failed_evaluations: number;
  average_evaluation_time: number;
  compliance_rate: number;
  risk_score: number;
  last_evaluation: string;
  anomalies_detected: number;
  false_positives: number;
}

export interface AccessRequest {
  id: string;
  user_id: string;
  resource_id: string;
  access_type: 'read' | 'write' | 'execute' | 'admin';
  requested_at: string;
  expires_at?: string;
  justification: string;
  context: RequestContext;
  evaluation: EvaluationResult;
  status: 'pending' | 'approved' | 'denied' | 'expired' | 'cancelled';
  approved_by?: string;
  approved_at?: string;
  denied_reason?: string;
  conditions: AccessCondition[];
}

export interface RequestContext {
  device: DeviceContext;
  network: NetworkContext;
  location: LocationContext;
  session: SessionContext;
  application: ApplicationContext;
  data: DataContext;
}

export interface DeviceContext {
  device_id: string;
  device_type: 'desktop' | 'laptop' | 'mobile' | 'tablet' | 'server' | 'iot';
  os: string;
  os_version: string;
  browser?: string;
  browser_version?: string;
  ip_address: string;
  mac_address: string;
  device_health: DeviceHealth;
  security_status: SecurityStatus;
  compliance_status: ComplianceStatus;
}

export interface DeviceHealth {
  score: number; // 0-1
  issues: HealthIssue[];
  last_scan: string;
  patch_level: string;
  antivirus_status: string;
  encryption_status: string;
  firewall_status: string;
}

export interface HealthIssue {
  type: 'outdated' | 'missing' | 'misconfigured' | 'infected' | 'vulnerable';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
}

export interface SecurityStatus {
  compromised: boolean;
  threats_detected: number;
  last_threat_scan: string;
  quarantine_status: string;
  trust_level: 'trusted' | 'untrusted' | 'unknown';
  risk_score: number; // 0-1
}

export interface ComplianceStatus {
  compliant: boolean;
  violations: ComplianceViolation[];
  last_audit: string;
  compliance_score: number; // 0-1
  framework_compliance: Record<string, number>;
}

export interface ComplianceViolation {
  control_id: string;
  control_name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  remediation: string;
  due_date: string;
}

export interface NetworkContext {
  source_ip: string;
  destination_ip: string;
  protocol: string;
  port: number;
  network_type: 'internal' | 'external' | 'vpn' | 'wireless';
  zone: string;
  bandwidth: number;
  latency: number;
  security_level: string;
}

export interface LocationContext {
  country: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  is_corporate_location: boolean;
  access_point: string;
}

export interface SessionContext {
  session_id: string;
  start_time: string;
  duration: number; // seconds
  activity_level: 'low' | 'medium' | 'high';
  authentication_method: string;
  mfa_verified: boolean;
  concurrent_sessions: number;
  last_activity: string;
}

export interface ApplicationContext {
  application_id: string;
  application_name: string;
  version: string;
  category: string;
  sensitivity_level: string;
  data_classification: string;
  access_pattern: string;
}

export interface DataContext {
  data_type: string;
  classification: 'public' | 'internal' | 'confidential' | 'restricted' | 'secret';
  volume: number; // bytes
  transfer_method: string;
  encryption_status: string;
  dlp_status: string;
  retention_policy: string;
}

export interface EvaluationResult {
  policy_id: string;
  decision: 'allow' | 'deny' | 'challenge' | 'escalate';
  confidence: number; // 0-1
  risk_score: number; // 0-1
  compliance_score: number; // 0-1
  evaluation_time: number; // milliseconds
  rules_evaluated: string[];
  conditions_met: ConditionResult[];
  recommendations: string[];
  anomalies: Anomaly[];
  next_verification: string;
  expires_at?: string;
}

export interface ConditionResult {
  condition_id: string;
  condition_name: string;
  result: boolean;
  confidence: number;
  details: string;
  evidence: string[];
}

export interface Anomaly {
  id: string;
  type: 'behavioral' | 'statistical' | 'temporal' | 'contextual';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  confidence: number;
  detected_at: string;
  indicators: string[];
  baseline: BaselineMetrics;
  current: CurrentMetrics;
  impact: string;
}

export interface BaselineMetrics {
  access_frequency: number;
  time_patterns: TimePattern[];
  device_usage: DeviceUsage;
  network_behavior: NetworkBehavior;
  data_access: DataAccess;
}

export interface TimePattern {
  hour: number;
  day_of_week: number;
  frequency: number;
  duration: number;
}

export interface DeviceUsage {
  device_type: string;
  usage_hours: number;
  application_usage: Record<string, number>;
  bandwidth_usage: number;
}

export interface NetworkBehavior {
  typical_ips: string[];
  typical_protocols: string[];
  typical_ports: number[];
  typical_bandwidth: number;
  typical_duration: number;
}

export interface DataAccess {
  typical_data_types: string[];
  typical_volumes: number[];
  typical_frequency: number;
  typical_locations: string[];
}

export interface CurrentMetrics {
  access_frequency: number;
  time_patterns: TimePattern[];
  device_usage: DeviceUsage;
  network_behavior: NetworkBehavior;
  data_access: DataAccess;
}

export interface AccessCondition {
  type: 'time_limit' | 'geo_restriction' | 'device_requirement' | 'mfa_required' | 'data_protection';
  condition: string;
  value: any;
  enforced: boolean;
  expires_at?: string;
}

class ZeroTrustService {
  private prisma: PrismaClient;
  private redis: any;
  private policies: Map<string, ZeroTrustPolicy> = new Map();
  private accessRequests: Map<string, AccessRequest> = new Map();
  private userBaselines: Map<string, BaselineMetrics> = new Map();
  private deviceBaselines: Map<string, BaselineMetrics> = new Map();
  private isProcessing = false;

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = getRedisClient();
    this.initializeDefaultPolicies();
    this.startContinuousVerification();
  }

  // Create zero-trust policy
  async createPolicy(policy: Omit<ZeroTrustPolicy, 'id' | 'created_at' | 'updated_at' | 'metrics'>): Promise<ZeroTrustPolicy> {
    try {
      const newPolicy: ZeroTrustPolicy = {
        ...policy,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metrics: {
          total_evaluations: 0,
          successful_evaluations: 0,
          failed_evaluations: 0,
          average_evaluation_time: 0,
          compliance_rate: 0,
          risk_score: 0,
          last_evaluation: '',
          anomalies_detected: 0,
          false_positives: 0
        }
      };

      // Store in database
      await this.prisma.zeroTrustPolicy.create({
        data: {
          id: newPolicy.id,
          name: newPolicy.name,
          description: newPolicy.description,
          enabled: newPolicy.enabled,
          priority: newPolicy.priority,
          scope: JSON.stringify(newPolicy.scope),
          rules: JSON.stringify(newPolicy.rules),
          conditions: JSON.stringify(newPolicy.conditions),
          actions: JSON.stringify(newPolicy.actions),
          verification: JSON.stringify(newPolicy.verification),
          compliance: JSON.stringify(newPolicy.compliance),
          metrics: JSON.stringify(newPolicy.metrics),
          createdBy: newPolicy.created_by,
          version: newPolicy.version,
          createdAt: new Date(newPolicy.created_at),
          updatedAt: new Date(newPolicy.updated_at)
        }
      });

      // Store in memory
      this.policies.set(newPolicy.id, newPolicy);

      return newPolicy;
    } catch (error) {
      console.error('Failed to create zero-trust policy:', error);
      throw error;
    }
  }

  // Evaluate access request
  async evaluateAccess(request: Omit<AccessRequest, 'id' | 'evaluation' | 'status'>): Promise<AccessRequest> {
    try {
      const accessRequest: AccessRequest = {
        ...request,
        id: crypto.randomUUID(),
        evaluation: {
          policy_id: '',
          decision: 'deny',
          confidence: 0,
          risk_score: 1.0,
          compliance_score: 0,
          evaluation_time: 0,
          rules_evaluated: [],
          conditions_met: [],
          recommendations: [],
          anomalies: [],
          next_verification: ''
        },
        status: 'pending'
      };

      // Find applicable policies
      const applicablePolicies = await this.findApplicablePolicies(accessRequest);
      
      if (applicablePolicies.length === 0) {
        accessRequest.evaluation.decision = 'deny';
        accessRequest.evaluation.recommendations.push('No applicable policies found');
        accessRequest.status = 'denied';
        accessRequest.denied_reason = 'No applicable policies found';
        return accessRequest;
      }

      // Evaluate policies
      let finalDecision: 'allow' | 'deny' | 'challenge' | 'escalate' = 'deny';
      let highestConfidence = 0;
      let lowestRiskScore = 1.0;

      for (const policy of applicablePolicies) {
        const evaluation = await this.evaluatePolicy(policy, accessRequest);
        
        // Update policy metrics
        policy.metrics.total_evaluations++;
        if (evaluation.decision === 'allow') {
          policy.metrics.successful_evaluations++;
        } else {
          policy.metrics.failed_evaluations++;
        }

        // Keep best result
        if (evaluation.confidence > highestConfidence || 
            (evaluation.confidence === highestConfidence && evaluation.risk_score < lowestRiskScore)) {
          accessRequest.evaluation = evaluation;
          accessRequest.evaluation.policy_id = policy.id;
          finalDecision = evaluation.decision;
          highestConfidence = evaluation.confidence;
          lowestRiskScore = evaluation.risk_score;
        }
      }

      // Set final status
      accessRequest.status = finalDecision === 'allow' ? 'approved' : 
                           finalDecision === 'challenge' ? 'pending' : 'denied';

      // Store request
      this.accessRequests.set(accessRequest.id, accessRequest);
      await this.storeAccessRequest(accessRequest);

      // Trigger continuous verification if allowed
      if (finalDecision === 'allow' && accessRequest.expires_at) {
        await this.scheduleContinuousVerification(accessRequest);
      }

      return accessRequest;
    } catch (error) {
      console.error('Failed to evaluate access request:', error);
      throw error;
    }
  }

  // Find applicable policies
  private async findApplicablePolicies(request: AccessRequest): Promise<ZeroTrustPolicy[]> {
    try {
      const applicable: ZeroTrustPolicy[] = [];

      for (const policy of Array.from(this.policies.values())) {
        if (!policy.enabled) continue;

        // Check if policy scope matches request
        const scopeMatch = await this.checkPolicyScope(policy.scope, request);
        if (scopeMatch) {
          applicable.push(policy);
        }
      }

      // Sort by priority
      applicable.sort((a, b) => {
        const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        return bPriority - aPriority;
      });

      return applicable;
    } catch (error) {
      console.error('Failed to find applicable policies:', error);
      return [];
    }
  }

  // Check policy scope
  private async checkPolicyScope(scope: PolicyScope, request: AccessRequest): Promise<boolean> {
    try {
      // Check users
      if (scope.users.length > 0 && !scope.users.includes(request.user_id)) {
        return false;
      }

      // Check devices
      if (scope.devices.length > 0 && !scope.devices.includes(request.context.device.device_id)) {
        return false;
      }

      // Check applications
      if (scope.applications.length > 0 && !scope.applications.includes(request.context.application.application_id)) {
        return false;
      }

      // Check networks
      if (scope.networks.length > 0 && !scope.networks.includes(request.context.network.zone)) {
        return false;
      }

      // Check locations
      if (scope.locations.length > 0 && !scope.locations.includes(request.context.location.country)) {
        return false;
      }

      // Check data types
      if (scope.data_types.length > 0 && !scope.data_types.includes(request.context.data.data_type)) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to check policy scope:', error);
      return false;
    }
  }

  // Evaluate individual policy
  private async evaluatePolicy(policy: ZeroTrustPolicy, request: AccessRequest): Promise<EvaluationResult> {
    try {
      const startTime = Date.now();
      const evaluation: EvaluationResult = {
        policy_id: policy.id,
        decision: 'deny',
        confidence: 0,
        risk_score: 1.0,
        compliance_score: 0,
        evaluation_time: 0,
        rules_evaluated: [],
        conditions_met: [],
        recommendations: [],
        anomalies: [],
        next_verification: ''
      };

      // Evaluate rules
      for (const rule of policy.rules) {
        if (!rule.enabled) continue;

        const ruleResult = await this.evaluateRule(rule, request);
        if (ruleResult.decision !== 'allow') {
          evaluation.decision = ruleResult.decision;
          evaluation.recommendations.push(...ruleResult.recommendations);
          break; // First deny/challenge/escalate wins
        }
        evaluation.rules_evaluated.push(rule.id);
      }

      // Calculate scores
      evaluation.confidence = this.calculateConfidence(request, evaluation);
      evaluation.risk_score = this.calculateRiskScore(request, evaluation);
      evaluation.compliance_score = this.calculateComplianceScore(request, evaluation);

      // Detect anomalies
      evaluation.anomalies = await this.detectAnomalies(request);

      // Set next verification
      if (policy.verification.continuous && request.expires_at) {
        evaluation.next_verification = new Date(Date.now() + policy.verification.interval * 60000).toISOString();
      }

      evaluation.evaluation_time = Date.now() - startTime;

      return evaluation;
    } catch (error) {
      console.error('Failed to evaluate policy:', error);
      throw error;
    }
  }

  // Evaluate rule
  private async evaluateRule(rule: PolicyRule, request: AccessRequest): Promise<{ decision: 'allow' | 'deny' | 'challenge' | 'escalate'; recommendations: string[] }> {
    try {
      let decision: 'allow' | 'deny' | 'challenge' | 'escalate' = 'allow';
      const recommendations: string[] = [];

      // Evaluate conditions
      for (const condition of rule.conditions) {
        const result = this.evaluateCondition(condition, request);
        if (!result && condition.required) {
          decision = 'deny';
          recommendations.push(`Required condition failed: ${condition.field}`);
          break;
        }
      }

      // Apply actions based on decision
      if (decision === 'allow') {
        for (const action of rule.actions) {
          if (action.type === 'deny') {
            decision = 'deny';
            recommendations.push('Access denied by rule action');
            break;
          } else if (action.type === 'challenge') {
            decision = 'challenge';
            recommendations.push('Additional verification required');
          } else if (action.type === 'escalate') {
            decision = 'escalate';
            recommendations.push('Access escalated for review');
          }
        }
      }

      return { decision, recommendations };
    } catch (error) {
      console.error('Failed to evaluate rule:', error);
      return { decision: 'deny', recommendations: ['Rule evaluation failed'] };
    }
  }

  // Evaluate condition
  private evaluateCondition(condition: RuleCondition, request: AccessRequest): boolean {
    try {
      let value: any;

      // Get field value from request context
      switch (condition.field) {
        case 'user_risk_score':
          value = this.calculateUserRiskScore(request.user_id);
          break;
        case 'device_compliance':
          value = request.context.device.compliance_status.compliant;
          break;
        case 'network_security_level':
          value = request.context.network.security_level === 'high';
          break;
        case 'geo_restriction':
          value = this.checkGeoRestriction(request.context.location);
          break;
        case 'time_restriction':
          value = this.checkTimeRestriction(request.context.session);
          break;
        case 'data_classification':
          value = request.context.data.classification === 'public';
          break;
        case 'session_duration':
          value = request.context.session.duration < 3600000; // 1 hour
          break;
        case 'concurrent_sessions':
          value = request.context.session.concurrent_sessions <= 1;
          break;
        default:
          // Try to get from request context
          value = this.getNestedValue(request, condition.field);
      }

      // Apply operator with negation
      let result = this.applyOperator(value, condition.operator, condition.value);
      if (condition.negated) {
        result = !result;
      }

      return result;
    } catch (error) {
      console.error('Failed to evaluate condition:', error);
      return false;
    }
  }

  // Apply operator
  private applyOperator(value: any, operator: string, conditionValue: any): boolean {
    switch (operator) {
      case 'eq':
        return value === conditionValue;
      case 'ne':
        return value !== conditionValue;
      case 'gt':
        return Number(value) > Number(conditionValue);
      case 'lt':
        return Number(value) < Number(conditionValue);
      case 'gte':
        return Number(value) >= Number(conditionValue);
      case 'lte':
        return Number(value) <= Number(conditionValue);
      case 'in':
        return Array.isArray(conditionValue) && conditionValue.includes(value);
      case 'not_in':
        return Array.isArray(conditionValue) && !conditionValue.includes(value);
      case 'contains':
        return String(value).includes(String(conditionValue));
      case 'regex':
        return new RegExp(conditionValue).test(String(value));
      default:
        return false;
    }
  }

  // Get nested value from object
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Calculate user risk score
  private calculateUserRiskScore(userId: string): number {
    // Mock implementation - in production, this would query user behavior analytics
    return Math.random() * 0.8; // 0-0.8
  }

  // Check geo restriction
  private checkGeoRestriction(location: LocationContext): boolean {
    // Mock implementation - in production, this would check against allowed locations
    return location.is_corporate_location;
  }

  // Check time restriction
  private checkTimeRestriction(session: SessionContext): boolean {
    // Mock implementation - in production, this would check business hours
    const now = new Date();
    const hour = now.getHours();
    return hour >= 9 && hour <= 17; // 9 AM - 5 PM
  }

  // Calculate confidence
  private calculateConfidence(request: AccessRequest, evaluation: EvaluationResult): number {
    let confidence = 0.5; // Base confidence

    // Add confidence from successful rule evaluations
    if (evaluation.rules_evaluated.length > 0) {
      confidence += 0.3;
    }

    // Add confidence from compliance
    confidence += evaluation.compliance_score * 0.2;

    return Math.min(1.0, confidence);
  }

  // Calculate risk score
  private calculateRiskScore(request: AccessRequest, evaluation: EvaluationResult): number {
    let riskScore = 0.5; // Base risk

    // Add risk from anomalies
    if (evaluation.anomalies.length > 0) {
      riskScore += evaluation.anomalies.length * 0.1;
    }

    // Add risk from device compliance
    if (!request.context.device.compliance_status.compliant) {
      riskScore += 0.2;
    }

    // Add risk from security status
    if (request.context.device.security_status.compromised) {
      riskScore += 0.3;
    }

    return Math.min(1.0, riskScore);
  }

  // Calculate compliance score
  private calculateComplianceScore(request: AccessRequest, evaluation: EvaluationResult): number {
    let complianceScore = 0.5; // Base compliance

    // Add compliance from device
    if (request.context.device.compliance_status.compliant) {
      complianceScore += 0.3;
    }

    // Add compliance from data classification
    if (request.context.data.classification === 'public') {
      complianceScore += 0.1;
    }

    // Add compliance from session security
    if (request.context.session.mfa_verified) {
      complianceScore += 0.1;
    }

    return Math.min(1.0, complianceScore);
  }

  // Detect anomalies
  private async detectAnomalies(request: AccessRequest): Promise<Anomaly[]> {
    try {
      const anomalies: Anomaly[] = [];

      // Get user baseline
      const userBaseline = this.userBaselines.get(request.user_id);
      if (!userBaseline) {
        // Create baseline if not exists
        await this.createUserBaseline(request.user_id);
        return anomalies;
      }

      // Check for behavioral anomalies
      const behavioralAnomalies = this.detectBehavioralAnomalies(request, userBaseline);
      anomalies.push(...behavioralAnomalies);

      // Check for temporal anomalies
      const temporalAnomalies = this.detectTemporalAnomalies(request, userBaseline);
      anomalies.push(...temporalAnomalies);

      // Check for contextual anomalies
      const contextualAnomalies = this.detectContextualAnomalies(request);
      anomalies.push(...contextualAnomalies);

      return anomalies;
    } catch (error) {
      console.error('Failed to detect anomalies:', error);
      return [];
    }
  }

  // Detect behavioral anomalies
  private detectBehavioralAnomalies(request: AccessRequest, baseline: BaselineMetrics): Anomaly[] {
    const anomalies: Anomaly[] = [];

    // Check access frequency
    const currentFrequency = 1; // Current request
    const typicalFrequency = baseline.access_frequency;
    if (currentFrequency > typicalFrequency * 3) {
      anomalies.push({
        id: crypto.randomUUID(),
        type: 'behavioral',
        severity: 'medium',
        description: 'Unusually high access frequency detected',
        confidence: 0.7,
        detected_at: new Date().toISOString(),
        indicators: ['access_frequency'],
        baseline: baseline,
        current: {
          access_frequency: currentFrequency,
          time_patterns: [],
          device_usage: request.context.device ? this.createDeviceUsage(request.context.device) : {} as DeviceUsage,
          network_behavior: request.context.network ? this.createNetworkBehavior(request.context.network) : {} as NetworkBehavior,
          data_access: request.context.data ? this.createDataAccess(request.context.data) : {} as DataAccess
        },
        impact: 'May indicate compromised account or unusual activity pattern'
      });
    }

    return anomalies;
  }

  // Detect temporal anomalies
  private detectTemporalAnomalies(request: AccessRequest, baseline: BaselineMetrics): Anomaly[] {
    const anomalies: Anomaly[] = [];

    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    // Check if access time is unusual for user
    const typicalTimePattern = baseline.time_patterns.find(p => p.hour === currentHour && p.day_of_week === currentDay);
    if (!typicalTimePattern) {
      anomalies.push({
        id: crypto.randomUUID(),
        type: 'temporal',
        severity: 'low',
        description: 'Access at unusual time for user',
        confidence: 0.6,
        detected_at: now.toISOString(),
        indicators: ['time_pattern'],
        baseline: baseline,
        current: {
          access_frequency: 1,
          time_patterns: [{
            hour: currentHour,
            day_of_week: currentDay,
            frequency: 0,
            duration: 0
          }],
          device_usage: request.context.device ? this.createDeviceUsage(request.context.device) : {} as DeviceUsage,
          network_behavior: request.context.network ? this.createNetworkBehavior(request.context.network) : {} as NetworkBehavior,
          data_access: request.context.data ? this.createDataAccess(request.context.data) : {} as DataAccess
        },
        impact: 'May indicate unauthorized access or schedule change'
      });
    }

    return anomalies;
  }

  // Detect contextual anomalies
  private detectContextualAnomalies(request: AccessRequest): Anomaly[] {
    const anomalies: Anomaly[] = [];

    // Check for unusual device
    if (request.context.device.device_type === 'mobile' && request.context.data.classification === 'secret') {
      anomalies.push({
        id: crypto.randomUUID(),
        type: 'contextual',
        severity: 'high',
        description: 'Accessing secret data from mobile device',
        confidence: 0.8,
        detected_at: new Date().toISOString(),
        indicators: ['device_type', 'data_classification'],
        baseline: {} as BaselineMetrics,
        current: {} as BaselineMetrics,
        impact: 'High risk data access from potentially insecure device'
      });
    }

    // Check for unusual network location
    if (!request.context.location.is_corporate_location && request.context.data.classification !== 'public') {
      anomalies.push({
        id: crypto.randomUUID(),
        type: 'contextual',
        severity: 'medium',
        description: 'Accessing non-public data from non-corporate location',
        confidence: 0.7,
        detected_at: new Date().toISOString(),
        indicators: ['location', 'data_classification'],
        baseline: {} as BaselineMetrics,
        current: {} as BaselineMetrics,
        impact: 'Potential data exposure risk'
      });
    }

    return anomalies;
  }

  // Create device usage from context
  private createDeviceUsage(device: DeviceContext): DeviceUsage {
    return {
      device_type: device.device_type,
      usage_hours: 1,
      application_usage: { [device.application?.application_id || 'unknown']: 1 },
      bandwidth_usage: 0,
    };
  }

  // Create network behavior from context
  private createNetworkBehavior(network: NetworkContext): NetworkBehavior {
    return {
      typical_ips: [network.source_ip],
      typical_protocols: [network.protocol],
      typical_ports: [network.port],
      typical_bandwidth: network.bandwidth,
      typical_duration: 0
    };
  }

  // Create data access from context
  private createDataAccess(data: DataContext): DataAccess {
    return {
      typical_data_types: [data.data_type],
      typical_volumes: [data.volume],
      typical_frequency: 1,
      typical_locations: ['unknown']
    };
  }

  // Create user baseline
  private async createUserBaseline(userId: string): Promise<void> {
    try {
      const baseline: BaselineMetrics = {
        access_frequency: 1,
        time_patterns: [],
        device_usage: {
          device_type: 'desktop',
          usage_hours: 8,
          application_usage: {},
          bandwidth_usage: 1000000,
        },
        network_behavior: {
          typical_ips: [],
          typical_protocols: ['https'],
          typical_ports: [443, 80],
          typical_bandwidth: 1000000,
          typical_duration: 300
        },
        data_access: {
          typical_data_types: ['document'],
          typical_volumes: [1024],
          typical_frequency: 5,
          typical_locations: ['corporate']
        }
      };

      this.userBaselines.set(userId, baseline);
      
      // Store in database
      await this.redis.setex(`user_baseline:${userId}`, 86400, JSON.stringify(baseline));
    } catch (error) {
      console.error('Failed to create user baseline:', error);
    }
  }

  // Store access request
  private async storeAccessRequest(request: AccessRequest): Promise<void> {
    try {
      await this.redis.setex(`access_request:${request.id}`, 3600, JSON.stringify(request));
      
      // Store in database
      await this.prisma.accessRequest.create({
        data: {
          id: request.id,
          userId: request.user_id,
          resourceId: request.resource_id,
          accessType: request.access_type,
          requestedAt: new Date(request.requested_at),
          expiresAt: request.expires_at ? new Date(request.expires_at) : null,
          justification: request.justification,
          context: JSON.stringify(request.context),
          evaluation: JSON.stringify(request.evaluation),
          status: request.status,
          approvedBy: request.approved_by || null,
          approvedAt: request.approved_at ? new Date(request.approved_at) : null,
          deniedReason: request.denied_reason || null,
          conditions: JSON.stringify(request.conditions)
        }
      });
    } catch (error) {
      console.error('Failed to store access request:', error);
    }
  }

  // Schedule continuous verification
  private async scheduleContinuousVerification(request: AccessRequest): Promise<void> {
    try {
      if (!request.expires_at) return;

      const expiresAt = new Date(request.expires_at);
      const now = new Date();
      
      if (expiresAt > now) {
        const delay = expiresAt.getTime() - now.getTime();
        
        setTimeout(async () => {
          await this.performContinuousVerification(request);
        }, delay);
      }
    } catch (error) {
      console.error('Failed to schedule continuous verification:', error);
    }
  }

  // Perform continuous verification
  private async performContinuousVerification(request: AccessRequest): Promise<void> {
    try {
      // Re-evaluate access
      const newEvaluation = await this.evaluateAccess({
        user_id: request.user_id,
        resource_id: request.resource_id,
        access_type: request.access_type,
        requested_at: request.requested_at,
        expires_at: request.expires_at,
        justification: request.justification,
        context: request.context,
        conditions: []
      });

      // Check if decision changed
      if (newEvaluation.evaluation.decision !== request.evaluation.decision) {
        // Decision changed, take action
        if (newEvaluation.evaluation.decision === 'deny') {
          await this.revokeAccess(request.id);
        }
        
        // Update request
        request.evaluation = newEvaluation.evaluation;
        request.status = newEvaluation.status;
        await this.storeAccessRequest(request);
      }

      // Schedule next verification if still valid
      if (newEvaluation.status === 'approved' && request.expires_at) {
        await this.scheduleContinuousVerification(request);
      }
    } catch (error) {
      console.error('Failed to perform continuous verification:', error);
    }
  }

  // Revoke access
  private async revokeAccess(requestId: string): Promise<void> {
    try {
      // Update request status
      const request = this.accessRequests.get(requestId);
      if (request) {
        request.status = 'cancelled';
        await this.storeAccessRequest(request);
      }

      // Log revocation
      console.log(`Access revoked for request: ${requestId}`);
      
      // In production, this would also:
      // - Invalidate session tokens
      // - Notify security team
      // - Update audit logs
      // - Block further access attempts
    } catch (error) {
      console.error('Failed to revoke access:', error);
    }
  }

  // Initialize default policies
  private initializeDefaultPolicies(): void {
    // Default zero-trust policy
    const defaultPolicy: ZeroTrustPolicy = {
      id: 'default-zero-trust',
      name: 'Default Zero Trust Policy',
      description: 'Default zero-trust access control policy',
      enabled: true,
      priority: 'high',
      scope: {
        users: [],
        groups: [],
        devices: [],
        applications: [],
        networks: ['internal'],
        locations: [],
        data_types: [],
        access_levels: [
          {
            level: 1,
            name: 'Basic Access',
            description: 'Basic access level with standard security',
            permissions: ['read'],
            restrictions: ['no_sensitive_data'],
            time_restrictions: [
              {
                type: 'business_hours',
                start_time: '09:00',
                end_time: '17:00',
                days: [1, 2, 3, 4, 5],
                timezone: 'UTC'
              }
            ],
            geo_restrictions: [
              {
                type: 'deny',
                countries: [],
                regions: [],
                ip_ranges: [],
                locations: ['unknown']
              }
            ],
            device_requirements: [
              {
                type: 'antivirus',
                operator: 'eq',
                value: 'active',
                required: true
              },
              {
                type: 'encryption',
                operator: 'eq',
                value: 'enabled',
                required: true
              }
            ],
            authentication_requirements: [
              {
                type: 'mfa',
                required: true,
                strength: 'medium',
                methods: ['totp', 'sms'],
                fallback_allowed: false
              }
            ]
          }
        ]
      },
      rules: [
        {
          id: 'basic-security-check',
          name: 'Basic Security Check',
          description: 'Basic security validation',
          enabled: true,
          priority: 1,
          conditions: [
            {
              field: 'device_compliance',
              operator: 'eq',
              value: true,
              weight: 0.3,
              required: true,
              negated: false
            },
            {
              field: 'network_security_level',
              operator: 'eq',
              value: true,
              weight: 0.3,
              required: true,
              negated: false
            },
            {
              field: 'session_duration',
              operator: 'lte',
              value: 3600000,
              weight: 0.2,
              required: false,
              negated: false
            }
          ],
          actions: [
            {
              type: 'allow',
              parameters: {},
              priority: 1
            }
          ],
          timeout: 30,
          retry_policy: {
            max_attempts: 3,
            backoff_type: 'exponential',
            base_delay: 1,
            max_delay: 10,
            retry_on: ['failure', 'timeout']
          },
          evaluation_mode: 'real_time'
        }
      ],
      conditions: [],
      actions: [],
      verification: {
        continuous: true,
        interval: 30,
        methods: [
          {
            type: 'user_behavior',
            enabled: true,
            frequency: 30,
            sensitivity: 'medium',
            thresholds: {
              anomaly_score: 0.7,
              risk_increase: 0.3
            }
          },
          {
            type: 'device_health',
            enabled: true,
            frequency: 60,
            sensitivity: 'medium',
            thresholds: {
              health_score: 0.6,
              compliance_score: 0.8
            }
          }
        ],
        risk_thresholds: [
          {
            level: 'low',
            score: 0.3,
            actions: ['log'],
            escalation_required: false
          },
          {
            level: 'medium',
            score: 0.5,
            actions: ['log', 'notify'],
            escalation_required: false
          },
          {
            level: 'high',
            score: 0.7,
            actions: ['log', 'notify', 'challenge'],
            escalation_required: true
          },
          {
            level: 'critical',
            score: 0.9,
            actions: ['deny', 'escalate'],
            escalation_required: true
          }
        ],
        anomaly_detection: {
          enabled: true,
          algorithms: [
            {
              type: 'statistical',
              enabled: true,
              parameters: {
                window_size: 100,
                threshold: 2.0
              },
              weight: 0.4
            },
            {
              type: 'behavioral',
              enabled: true,
              parameters: {
                baseline_days: 30,
                sensitivity: 0.7
              },
              weight: 0.6
            }
          ],
          baseline_period: 30,
          sensitivity: 0.7,
          false_positive_rate: 0.1
        },
        behavioral_analysis: {
          enabled: true,
          baseline_days: 30,
          risk_factors: [
            {
              factor: 'access_frequency',
              weight: 0.3,
              threshold: 3.0,
              description: 'Unusual access frequency'
            },
            {
              factor: 'time_pattern',
              weight: 0.4,
              threshold: 0.8,
              description: 'Unusual time patterns'
            },
            {
              factor: 'device_usage',
              weight: 0.3,
              threshold: 0.6,
              description: 'Unusual device usage'
            }
          ],
          patterns: [
            {
              id: 'after_hours_access',
              name: 'After Hours Access',
              description: 'Access outside business hours',
              pattern: 'hour > 17 || hour < 9',
              risk_level: 'medium',
              enabled: true
            },
            {
              id: 'unusual_device',
              name: 'Unusual Device',
              description: 'Access from rarely used device',
              pattern: 'device_usage_frequency < 0.1',
              risk_level: 'medium',
              enabled: true
            }
          ],
          learning_enabled: true
        }
      },
      compliance: {
        frameworks: [
          {
            name: 'NIST SP 800-207',
            version: '1.0',
            requirements: [],
            enabled: true
          },
          {
            name: 'ISO 27001',
            version: '2022',
            requirements: [],
            enabled: true
          }
        ],
        audit_frequency: 30,
        reporting: {
          enabled: true,
          format: 'json',
          frequency: 7,
          recipients: ['security-team@company.com'],
          include_details: true,
          include_recommendations: true
        },
        enforcement: {
          mode: 'monitor',
          automatic_actions: false,
          manual_review_required: true,
          escalation_threshold: 0.8
        },
        monitoring: {
          real_time: true,
          alerts: [
            {
              enabled: true,
              channels: [
                {
                  type: 'email',
                  destination: 'security-team@company.com',
                  enabled: true,
                  template: 'zero-trust-alert'
                }
              ],
              thresholds: [
                {
                  metric: 'risk_score',
                  operator: 'gt',
                  value: 0.7,
                  severity: 'high'
                }
              ],
              severity_filter: ['medium', 'high', 'critical']
            }
          ],
          dashboard: {
            enabled: true,
            widgets: [],
            refresh_interval: 30,
            access_roles: ['security_admin', 'auditor']
          },
          logging: {
            enabled: true,
            level: 'info',
            retention_days: 90,
            include_sensitive: false,
            audit_trail: true
          }
        }
      },
      metrics: {
        total_evaluations: 0,
        successful_evaluations: 0,
        failed_evaluations: 0,
        average_evaluation_time: 0,
        compliance_rate: 0,
        risk_score: 0,
        last_evaluation: '',
        anomalies_detected: 0,
        false_positives: 0
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'system',
      version: '1.0.0'
    };

    this.policies.set(defaultPolicy.id, defaultPolicy);
  }

  // Start continuous verification
  private startContinuousVerification(): void {
    setInterval(() => {
      if (!this.isProcessing) {
        this.performContinuousVerificationCheck();
      }
    }, 60000); // Check every minute
  }

  // Perform continuous verification check
  private async performContinuousVerificationCheck(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;

    try {
      // Get active access requests
      const activeRequests = Array.from(this.accessRequests.values())
        .filter(req => req.status === 'approved' && req.expires_at && new Date(req.expires_at) > new Date());

      // Check each request
      for (const request of activeRequests) {
        await this.performContinuousVerification(request);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  // Get access request by ID
  async getAccessRequest(requestId: string): Promise<AccessRequest | null> {
    try {
      return this.accessRequests.get(requestId) || null;
    } catch (error) {
      console.error('Failed to get access request:', error);
      return null;
    }
  }

  // Get all policies
  async getPolicies(filters?: {
    enabled?: boolean;
    priority?: string;
    created_by?: string;
  }): Promise<ZeroTrustPolicy[]> {
    try {
      let policies = Array.from(this.policies.values());
      
      if (filters?.enabled !== undefined) {
        policies = policies.filter(p => p.enabled === filters.enabled);
      }
      if (filters?.priority) {
        policies = policies.filter(p => p.priority === filters.priority);
      }
      if (filters?.created_by) {
        policies = policies.filter(p => p.created_by === filters.created_by);
      }

      return policies;
    } catch (error) {
      console.error('Failed to get policies:', error);
      return [];
    }
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    activePolicies: number;
    totalPolicies: number;
    activeRequests: number;
    averageEvaluationTime: number;
    lastEvaluation: string | null;
    userBaselines: number;
    errors: string[];
  }> {
    try {
      const activePolicies = Array.from(this.policies.values()).filter(p => p.enabled).length;
      const totalPolicies = this.policies.size;
      const activeRequests = Array.from(this.accessRequests.values())
        .filter(req => req.status === 'approved' && req.expires_at && new Date(req.expires_at) > new Date()).length;
      const userBaselines = this.userBaselines.size;

      const status = activePolicies === 0 ? 'critical' : 
                   activeRequests > 1000 ? 'warning' : 'healthy';

      return {
        status,
        activePolicies,
        totalPolicies,
        activeRequests,
        averageEvaluationTime: 0, // Would be calculated from actual metrics
        lastEvaluation: null,
        userBaselines,
        errors: []
      };
    } catch (error) {
      console.error('Zero trust health check failed:', error);
      return {
        status: 'critical',
        activePolicies: 0,
        totalPolicies: 0,
        activeRequests: 0,
        averageEvaluationTime: 0,
        lastEvaluation: null,
        userBaselines: 0,
        errors: [error instanceof Error ? error.message : 'Health check failed']
      };
    }
  }
}

// Singleton instance
export const zeroTrustService = new ZeroTrustService();
