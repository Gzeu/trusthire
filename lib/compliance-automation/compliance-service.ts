// Automated Compliance and Audit Framework
// Complete compliance automation with audit trails and reporting

import { PrismaClient } from '@prisma/client';
import { getRedisClient } from '@/lib/redis-wrapper';

export interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  description: string;
  category: 'security' | 'privacy' | 'financial' | 'healthcare' | 'industry_specific';
  requirements: ComplianceRequirement[];
  controls: ComplianceControl[];
  mappings: FrameworkMapping[];
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  requirement_id: string;
  requirement_text: string;
  control_objectives: string[];
  validation_criteria: ValidationCriteria[];
  evidence_requirements: EvidenceRequirement[];
  testing_procedures: TestingProcedure[];
  frequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  mandatory: boolean;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  status: 'compliant' | 'non_compliant' | 'partial' | 'not_assessed' | 'exempt';
  last_assessed: string;
  next_assessment: string;
  assigned_to?: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface ValidationCriteria {
  id: string;
  name: string;
  description: string;
  criteria_type: 'automated' | 'manual' | 'hybrid';
  test_method: string;
  expected_result: string;
  acceptance_criteria: string[];
  tools_required: string[];
  evidence_required: string[];
  frequency: string;
}

export interface EvidenceRequirement {
  id: string;
  evidence_type: 'document' | 'screenshot' | 'log' | 'configuration' | 'interview' | 'observation' | 'report';
  description: string;
  retention_period: number; // days
  format: string[];
  location: string;
  custodian: string;
  collection_method: string;
  verification_method: string;
}

export interface TestingProcedure {
  id: string;
  name: string;
  description: string;
  procedure_type: 'automated' | 'manual' | 'hybrid';
  steps: TestStep[];
  prerequisites: string[];
  expected_duration: number; // minutes
  skill_level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  tools_required: string[];
  success_criteria: string[];
  failure_handling: string[];
}

export interface TestStep {
  id: string;
  step_number: number;
  description: string;
  action: string;
  expected_result: string;
  evidence_required: string[];
  tools_required: string[];
  time_estimate: number; // minutes
}

export interface ComplianceControl {
  id: string;
  name: string;
  description: string;
  control_type: 'preventive' | 'detective' | 'corrective' | 'compensating';
  implementation_status: 'implemented' | 'partially_implemented' | 'not_implemented' | 'planned';
  effectiveness: number; // 0-1
  maturity_level: 'initial' | 'repeatable' | 'defined' | 'managed' | 'optimized' | 'innovating';
  automation_level: 'manual' | 'semi_automated' | 'fully_automated';
  coverage: number; // 0-1
  testing_frequency: string;
  last_tested: string;
  next_test: string;
  test_results: TestResult[];
  owner: string;
  documentation: string[];
  metrics: ControlMetrics;
  created_at: string;
  updated_at: string;
}

export interface TestResult {
  id: string;
  test_date: string;
  test_type: 'automated' | 'manual' | 'hybrid';
  result: 'pass' | 'fail' | 'warning' | 'error' | 'skipped';
  score: number; // 0-100
  findings: TestFinding[];
  evidence: Evidence[];
  tester: string;
  duration: number; // minutes
  environment: string;
  notes: string;
  recommendations: string[];
  follow_up_required: boolean;
  follow_up_date?: string;
}

export interface TestFinding {
  id: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  impact: string;
  recommendation: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'deferred';
  assigned_to?: string;
  due_date?: string;
  resolved_at?: string;
  resolution?: string;
}

export interface Evidence {
  id: string;
  type: 'document' | 'screenshot' | 'log' | 'configuration' | 'interview' | 'observation' | 'report';
  name: string;
  description: string;
  file_path?: string;
  url?: string;
  hash?: string;
  size?: number;
  collected_at: string;
  collected_by: string;
  retention_until: string;
  metadata: Record<string, any>;
}

export interface ControlMetrics {
  effectiveness_score: number;
  coverage_percentage: number;
  test_pass_rate: number;
  average_test_duration: number;
  findings_count: number;
  critical_findings: number;
  cost_of_control: number;
  roi_score: number;
  last_updated: string;
}

export interface FrameworkMapping {
  id: string;
  source_framework: string;
  source_requirement: string;
  target_framework: string;
  target_requirement: string;
  mapping_type: 'equivalent' | 'partial' | 'related' | 'superset' | 'subset';
  confidence: number; // 0-1
  justification: string;
  created_by: string;
  created_at: string;
}

export interface ComplianceAudit {
  id: string;
  title: string;
  description: string;
  audit_type: 'internal' | 'external' | 'regulatory' | 'certification';
  scope: AuditScope;
  framework_ids: string[];
  requirements: string[];
  status: 'planned' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  start_date: string;
  end_date?: string;
  auditor: string;
  audit_team: string[];
  methodology: string;
  findings: AuditFinding[];
  recommendations: AuditRecommendation[];
  evidence: Evidence[];
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  report: AuditReport;
  follow_up_actions: FollowUpAction[];
  created_at: string;
  updated_at: string;
}

export interface AuditScope {
  departments: string[];
  systems: string[];
  processes: string[];
  locations: string[];
  time_period: {
    start: string;
    end: string;
  };
  exclusions: string[];
  limitations: string[];
}

export interface AuditFinding {
  id: string;
  category: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  root_cause?: string;
  affected_controls: string[];
  affected_requirements: string[];
  evidence: string[];
  recommendations: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'deferred';
  assigned_to?: string;
  due_date?: string;
  resolved_at?: string;
  resolution?: string;
}

export interface AuditRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high';
  cost_estimate?: number;
  timeline: string;
  responsible_party: string;
  success_criteria: string[];
  dependencies: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  completed_at?: string;
}

export interface AuditReport {
  executive_summary: string;
  methodology: string;
  scope: string;
  findings_summary: string;
  compliance_score: number;
  grade_distribution: Record<string, number>;
  key_findings: string[];
  recommendations_summary: string;
  appendix: string[];
  sign_offs: SignOff[];
}

export interface SignOff {
  name: string;
  title: string;
  signature: string;
  date: string;
  comments?: string;
}

export interface FollowUpAction {
  id: string;
  title: string;
  description: string;
  type: 'corrective' | 'preventive' | 'improvement';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  progress: number; // 0-100
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface CompliancePolicy {
  id: string;
  name: string;
  description: string;
  category: 'security' | 'privacy' | 'access' | 'data_protection' | 'incident_response' | 'business_continuity';
  framework_references: string[];
  requirements: string[];
  controls: string[];
  procedures: ComplianceProcedure[];
  enforcement: EnforcementPolicy;
  monitoring: MonitoringPolicy;
  exceptions: PolicyException[];
  version: string;
  status: 'draft' | 'review' | 'approved' | 'deprecated';
  effective_date: string;
  review_date: string;
  owner: string;
  approvers: string[];
  created_at: string;
  updated_at: string;
}

export interface ComplianceProcedure {
  id: string;
  name: string;
  description: string;
  purpose: string;
  scope: string;
  responsibilities: Responsibility[];
  steps: ProcedureStep[];
  inputs: string[];
  outputs: string[];
  tools: string[];
  references: string[];
  frequency: string;
  version: string;
  last_updated: string;
}

export interface Responsibility {
  role: string;
  responsibilities: string[];
  authority: string[];
  accountabilities: string[];
}

export interface ProcedureStep {
  step_number: number;
  action: string;
  description: string;
  responsible: string;
  due_date?: string;
  inputs: string[];
  outputs: string[];
  tools: string[];
  quality_criteria: string[];
  time_estimate: number; // minutes
}

export interface EnforcementPolicy {
  violation_handling: ViolationHandling;
  disciplinary_actions: DisciplinaryAction[];
  escalation_procedures: EscalationProcedure[];
  reporting_requirements: ReportingRequirement[];
  audit_trail: AuditTrailRequirement;
}

export interface ViolationHandling {
  classification: 'minor' | 'moderate' | 'major' | 'critical';
  response_time: number; // hours
  investigation_required: boolean;
  documentation_required: boolean[];
  notification_required: string[];
}

export interface DisciplinaryAction {
  violation_type: string;
  severity: 'warning' | 'reprimand' | 'suspension' | 'termination' | 'legal';
  conditions: string[];
  appeal_process: string;
}

export interface EscalationProcedure {
  trigger_conditions: string[];
  escalation_levels: EscalationLevel[];
  time_thresholds: number[];
  communication_plan: string[];
}

export interface EscalationLevel {
  level: number;
  authority: string;
  responsibilities: string[];
  notification_required: string[];
  decision_authority: string[];
}

export interface ReportingRequirement {
  incident_types: string[];
  reporting_timeline: number; // hours
  report_format: string[];
  recipients: string[];
  regulatory_notifications: string[];
}

export interface AuditTrailRequirement {
  events_to_log: string[];
  retention_period: number; // days
  log_format: string;
  protection_requirements: string[];
  access_controls: string[];
  verification_procedures: string[];
}

export interface MonitoringPolicy {
  continuous_monitoring: ContinuousMonitoring;
  periodic_assessments: PeriodicAssessment[];
  alerting: AlertingPolicy;
  reporting: ReportingPolicy;
  metrics: ComplianceMetrics;
}

export interface ContinuousMonitoring {
  automated_checks: AutomatedCheck[];
  real_time_alerts: RealTimeAlert[];
  dashboards: ComplianceDashboard[];
  integration_points: string[];
  frequency: number; // minutes
}

export interface AutomatedCheck {
  name: string;
  description: string;
  check_type: 'configuration' | 'access' | 'activity' | 'security' | 'compliance';
  frequency: number; // minutes
  threshold: number;
  failure_actions: string[];
  success_criteria: string[];
}

export interface RealTimeAlert {
  trigger_conditions: string[];
  severity_levels: string[];
  notification_channels: string[];
  escalation_rules: EscalationRule[];
  auto_response: AutoResponse[];
}

export interface EscalationRule {
  condition: string;
  severity_threshold: string;
  escalation_time: number; // minutes
  recipients: string[];
  actions: string[];
}

export interface AutoResponse {
  trigger: string;
  actions: string[];
  conditions: string[];
  approval_required: boolean;
}

export interface ComplianceDashboard {
  name: string;
  description: string;
  widgets: DashboardWidget[];
  access_roles: string[];
  refresh_interval: number; // minutes
  data_sources: string[];
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'alert' | 'trend' | 'status';
  title: string;
  description: string;
  data_source: string;
  configuration: Record<string, any>;
  position: { x: number; y: number; width: number; height: number };
  refresh_interval: number; // minutes
}

export interface PeriodicAssessment {
  assessment_type: string;
  frequency: string;
  scope: string[];
  methodology: string[];
  participants: string[];
  deliverables: string[];
  schedule: AssessmentSchedule;
}

export interface AssessmentSchedule {
  start_date: string;
  end_date: string;
  frequency: string;
  reminders: number[];
  auto_scheduling: boolean;
}

export interface AlertingPolicy {
  alert_rules: AlertRule[];
  notification_channels: NotificationChannel[];
  escalation_policies: EscalationPolicy[];
  suppression_rules: SuppressionRule[];
}

export interface AlertRule {
  name: string;
  description: string;
  condition: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  threshold: number;
  time_window: number; // minutes
  notification_channels: string[];
  auto_response: string[];
}

export interface NotificationChannel {
  type: 'email' | 'sms' | 'webhook' | 'slack' | 'teams' | 'in_app';
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

export interface SuppressionRule {
  name: string;
  condition: string;
  duration: number; // minutes
  reason: string;
  auto_reenable: boolean;
}

export interface ReportingPolicy {
  report_types: ReportType[];
  schedule: ReportSchedule;
  distribution: DistributionList[];
  formats: string[];
  retention: RetentionPolicy;
}

export interface ReportType {
  name: string;
  description: string;
  type: 'compliance_status' | 'audit_results' | 'risk_assessment' | 'trend_analysis' | 'executive_summary';
  frequency: string;
  recipients: string[];
  template: string;
}

export interface ReportSchedule {
  generation_time: string;
  frequency: string;
  auto_delivery: boolean;
  recipients: string[];
}

export interface DistributionList {
  name: string;
  recipients: string[];
  permissions: string[];
}

export interface RetentionPolicy {
  reports: number; // days
  audit_logs: number; // days
  evidence: number; // days
  policies: number; // days
  auto_cleanup: boolean;
}

export interface PolicyException {
  id: string;
  title: string;
  description: string;
  policy_id: string;
  reason: string;
  justification: string;
  risk_assessment: string;
  mitigation_measures: string[];
  approver: string;
  approval_date: string;
  expiry_date?: string;
  conditions: string[];
  monitoring: string[];
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'revoked';
  created_at: string;
  updated_at: string;
}

export interface ComplianceMetrics {
  overall_compliance_score: number;
  framework_scores: Record<string, number>;
  control_effectiveness: number;
  audit_success_rate: number;
  findings_trend: number;
  risk_reduction: number;
  cost_of_compliance: number;
  roi: number;
  maturity_level: string;
  last_updated: string;
}

class ComplianceService {
  private prisma: PrismaClient;
  private redis: any;
  private frameworks: Map<string, ComplianceFramework> = new Map();
  private audits: Map<string, ComplianceAudit> = new Map();
  private policies: Map<string, CompliancePolicy> = new Map();
  private schedules: Map<string, NodeJS.Timeout> = new Map();
  private config: ComplianceConfig;

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = getRedisClient();
    this.initializeDefaultConfig();
    this.initializeDefaultFrameworks();
    this.initializeDefaultPolicies();
    this.startScheduledTasks();
  }

  // Add compliance framework
  async addFramework(framework: Omit<ComplianceFramework, 'id' | 'created_at' | 'updated_at'>): Promise<ComplianceFramework> {
    try {
      const newFramework: ComplianceFramework = {
        ...framework,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Store in database
      await this.prisma.complianceFramework.create({
        data: {
          id: newFramework.id,
          name: newFramework.name,
          version: newFramework.version,
          description: newFramework.description,
          category: newFramework.category,
          requirements: JSON.stringify(newFramework.requirements),
          controls: JSON.stringify(newFramework.controls),
          mappings: JSON.stringify(newFramework.mappings),
          enabled: newFramework.enabled,
          createdAt: new Date(newFramework.created_at),
          updatedAt: new Date(newFramework.updated_at)
        }
      });

      // Store in memory
      this.frameworks.set(newFramework.id, newFramework);

      return newFramework;
    } catch (error) {
      console.error('Failed to add compliance framework:', error);
      throw error;
    }
  }

  // Conduct compliance audit
  async conductAudit(audit: Omit<ComplianceAudit, 'id' | 'findings' | 'recommendations' | 'evidence' | 'score' | 'grade' | 'report' | 'follow_up_actions' | 'created_at' | 'updated_at'>): Promise<ComplianceAudit> {
    try {
      const newAudit: ComplianceAudit = {
        ...audit,
        id: crypto.randomUUID(),
        findings: [],
        recommendations: [],
        evidence: [],
        score: 0,
        grade: 'F',
        report: {
          executive_summary: '',
          methodology: audit.methodology,
          scope: '',
          findings_summary: '',
          compliance_score: 0,
          grade_distribution: {},
          key_findings: [],
          recommendations_summary: '',
          appendix: [],
          sign_offs: []
        },
        follow_up_actions: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Execute audit
      await this.executeAudit(newAudit);

      // Store audit
      this.audits.set(newAudit.id, newAudit);
      await this.storeAudit(newAudit);

      return newAudit;
    } catch (error) {
      console.error('Failed to conduct compliance audit:', error);
      throw error;
    }
  }

  // Execute audit
  private async executeAudit(audit: ComplianceAudit): Promise<void> {
    try {
      audit.status = 'in_progress';

      // Get requirements for audit
      const requirements = await this.getAuditRequirements(audit.framework_ids, audit.requirements);

      // Test each requirement
      let totalScore = 0;
      let maxScore = 0;

      for (const requirement of requirements) {
        const testResult = await this.testRequirement(requirement);
        const score = this.calculateRequirementScore(testResult);
        
        totalScore += score;
        maxScore += 100;

        // Create finding if needed
        if (testResult.result !== 'pass') {
          const finding: AuditFinding = {
            id: crypto.randomUUID(),
            category: requirement.category,
            severity: this.mapSeverityToAudit(testResult.findings),
            title: `Non-compliance: ${requirement.name}`,
            description: testResult.findings.map(f => f.description).join('; '),
            impact: `Failure to meet requirement: ${requirement.requirement_text}`,
            affected_controls: [],
            affected_requirements: [requirement.id],
            evidence: testResult.evidence.map(e => e.id),
            recommendations: testResult.recommendations,
            priority: this.mapSeverityToPriority(testResult.findings),
            status: 'open',
            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
          };

          audit.findings.push(finding);
        }
      }

      // Calculate overall score
      audit.score = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
      audit.grade = this.calculateGrade(audit.score);

      // Generate report
      audit.report = this.generateAuditReport(audit);

      // Generate recommendations
      audit.recommendations = this.generateAuditRecommendations(audit);

      audit.status = 'completed';
      audit.end_date = new Date().toISOString();

    } catch (error) {
      console.error('Failed to execute audit:', error);
      audit.status = 'failed';
      audit.end_date = new Date().toISOString();
    }
  }

  // Get audit requirements
  private async getAuditRequirements(frameworkIds: string[], requirementIds: string[]): Promise<ComplianceRequirement[]> {
    try {
      const requirements: ComplianceRequirement[] = [];

      // Get requirements from frameworks
      for (const frameworkId of frameworkIds) {
        const framework = this.frameworks.get(frameworkId);
        if (framework && framework.enabled) {
          requirements.push(...framework.requirements);
        }
      }

      // Filter by specific requirement IDs if provided
      if (requirementIds.length > 0) {
        return requirements.filter(req => requirementIds.includes(req.id));
      }

      return requirements;
    } catch (error) {
      console.error('Failed to get audit requirements:', error);
      return [];
    }
  }

  // Test requirement
  private async testRequirement(requirement: ComplianceRequirement): Promise<TestResult> {
    try {
      const testResult: TestResult = {
        id: crypto.randomUUID(),
        test_date: new Date().toISOString(),
        test_type: 'automated',
        result: 'pass',
        score: 100,
        findings: [],
        evidence: [],
        tester: 'system',
        duration: 0,
        environment: 'production',
        notes: '',
        recommendations: [],
        follow_up_required: false
      };

      // Execute validation criteria
      for (const criteria of requirement.validation_criteria) {
        const criteriaResult = await this.executeValidationCriteria(criteria);
        
        if (criteriaResult.result !== 'pass') {
          testResult.result = 'fail';
          testResult.score = Math.max(0, testResult.score - 20);
          testResult.findings.push(...criteriaResult.findings);
          testResult.evidence.push(...criteriaResult.evidence);
          testResult.recommendations.push(...criteriaResult.recommendations);
        }
      }

      return testResult;
    } catch (error) {
      console.error('Failed to test requirement:', error);
      return {
        id: crypto.randomUUID(),
        test_date: new Date().toISOString(),
        test_type: 'manual',
        result: 'error',
        score: 0,
        findings: [{
          id: crypto.randomUUID(),
          severity: 'critical',
          category: 'system_error',
          description: `Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          impact: 'Unable to assess compliance',
          recommendation: 'Manual investigation required',
          priority: 'critical',
          status: 'open'
        }],
        evidence: [],
        tester: 'system',
        duration: 0,
        environment: 'production',
        notes: error instanceof Error ? error.message : 'Unknown error',
        recommendations: ['Investigate test failure', 'Retry test after fixing issues'],
        follow_up_required: true
      };
    }
  }

  // Execute validation criteria
  private async executeValidationCriteria(criteria: ValidationCriteria): Promise<TestResult> {
    try {
      const testResult: TestResult = {
        id: crypto.randomUUID(),
        test_date: new Date().toISOString(),
        test_type: criteria.criteria_type,
        result: 'pass',
        score: 100,
        findings: [],
        evidence: [],
        tester: 'system',
        duration: 0,
        environment: 'production',
        notes: '',
        recommendations: [],
        follow_up_required: false
      };

      // Mock validation execution - in production, this would execute actual tests
      if (criteria.criteria_type === 'automated') {
        // Simulate automated checks
        const mockResult = Math.random() > 0.2; // 80% pass rate
        testResult.result = mockResult ? 'pass' : 'fail';
        testResult.score = mockResult ? 100 : 60;
        
        if (!mockResult) {
          testResult.findings.push({
            id: crypto.randomUUID(),
            severity: 'medium',
            category: 'validation_failure',
            description: `Automated validation failed for: ${criteria.name}`,
            impact: 'Partial compliance',
            recommendation: 'Review and fix configuration',
            priority: 'medium',
            status: 'open'
          });
        }
      } else {
        // Simulate manual checks
        testResult.result = 'pass'; // Assume manual checks pass
        testResult.notes = 'Manual verification required';
      }

      return testResult;
    } catch (error) {
      console.error('Failed to execute validation criteria:', error);
      throw error;
    }
  }

  // Calculate requirement score
  private calculateRequirementScore(testResult: TestResult): number {
    return testResult.score;
  }

  // Map severity to audit
  private mapSeverityToAudit(findings: TestFinding[]): 'info' | 'low' | 'medium' | 'high' | 'critical' {
    if (findings.length === 0) return 'info';
    
    const severities = findings.map(f => f.severity);
    if (severities.includes('critical')) return 'critical';
    if (severities.includes('high')) return 'high';
    if (severities.includes('medium')) return 'medium';
    if (severities.includes('low')) return 'low';
    return 'info';
  }

  // Map severity to priority
  private mapSeverityToPriority(findings: TestFinding[]): 'low' | 'medium' | 'high' | 'critical' {
    return this.mapSeverityToAudit(findings) as 'low' | 'medium' | 'high' | 'critical';
  }

  // Calculate grade
  private calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  // Generate audit report
  private generateAuditReport(audit: ComplianceAudit): AuditReport {
    const criticalFindings = audit.findings.filter(f => f.severity === 'critical');
    const highFindings = audit.findings.filter(f => f.severity === 'high');
    
    return {
      executive_summary: `Compliance audit completed with score of ${audit.score.toFixed(1)}% (${audit.grade}). ${criticalFindings.length} critical and ${highFindings.length} high findings identified.`,
      methodology: audit.methodology,
      scope: `Audit covered ${audit.framework_ids.length} frameworks across ${audit.scope.departments.length} departments`,
      findings_summary: `Total findings: ${audit.findings.length}. Critical: ${criticalFindings.length}, High: ${highFindings.length}`,
      compliance_score: audit.score,
      grade_distribution: {
        'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 1
      },
      key_findings: audit.findings.slice(0, 5).map(f => f.title),
      recommendations_summary: `${audit.recommendations.length} recommendations generated for improvement`,
      appendix: ['Detailed findings', 'Evidence documentation', 'Compliance matrices'],
      sign_offs: []
    };
  }

  // Generate audit recommendations
  private generateAuditRecommendations(audit: ComplianceAudit): AuditRecommendation[] {
    const recommendations: AuditRecommendation[] = [];

    // Generate recommendations based on findings
    const findingsByCategory = this.groupFindingsByCategory(audit.findings);
    
    for (const [category, findings] of Object.entries(findingsByCategory)) {
      if (findings.length > 0) {
        recommendations.push({
          id: crypto.randomUUID(),
          title: `Address ${category} compliance issues`,
          description: `Implement controls to address ${findings.length} findings in ${category}`,
          category,
          priority: this.getHighestPriority(findings),
          effort: 'medium',
          timeline: '30-60 days',
          responsible_party: 'Compliance Team',
          success_criteria: [
            'All findings resolved',
            'Controls implemented',
            'Evidence of compliance documented'
          ],
          dependencies: ['Management approval', 'Resource allocation'],
          status: 'pending',
          due_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    }

    return recommendations;
  }

  // Group findings by category
  private groupFindingsByCategory(findings: AuditFinding[]): Record<string, AuditFinding[]> {
    const grouped: Record<string, AuditFinding[]> = {};
    
    for (const finding of findings) {
      if (!grouped[finding.category]) {
        grouped[finding.category] = [];
      }
      grouped[finding.category].push(finding);
    }
    
    return grouped;
  }

  // Get highest priority
  private getHighestPriority(findings: AuditFinding[]): 'low' | 'medium' | 'high' | 'critical' {
    const priorities = findings.map(f => f.priority);
    if (priorities.includes('critical')) return 'critical';
    if (priorities.includes('high')) return 'high';
    if (priorities.includes('medium')) return 'medium';
    return 'low';
  }

  // Store audit
  private async storeAudit(audit: ComplianceAudit): Promise<void> {
    try {
      await this.redis.setex(`compliance_audit:${audit.id}`, 86400, JSON.stringify(audit));
      
      // Store in database
      await this.prisma.complianceAudit.create({
        data: {
          id: audit.id,
          title: audit.title,
          description: audit.description,
          auditType: audit.audit_type,
          scope: JSON.stringify(audit.scope),
          frameworkIds: JSON.stringify(audit.framework_ids),
          requirements: JSON.stringify(audit.requirements),
          status: audit.status,
          startDate: new Date(audit.start_date),
          endDate: audit.end_date ? new Date(audit.end_date) : null,
          auditor: audit.auditor,
          auditTeam: JSON.stringify(audit.audit_team),
          methodology: audit.methodology,
          findings: JSON.stringify(audit.findings),
          recommendations: JSON.stringify(audit.recommendations),
          evidence: JSON.stringify(audit.evidence),
          score: audit.score,
          grade: audit.grade,
          report: JSON.stringify(audit.report),
          followUpActions: JSON.stringify(audit.follow_up_actions),
          createdAt: new Date(audit.created_at),
          updatedAt: new Date(audit.updated_at)
        }
      });
    } catch (error) {
      console.error('Failed to store compliance audit:', error);
    }
  }

  // Get compliance metrics
  async getComplianceMetrics(): Promise<ComplianceMetrics> {
    try {
      const audits = Array.from(this.audits.values());
      const frameworks = Array.from(this.frameworks.values()).filter(f => f.enabled);

      // Calculate overall compliance score
      const overallScore = audits.length > 0 ? 
        audits.reduce((sum, audit) => sum + audit.score, 0) / audits.length : 0;

      // Calculate framework scores
      const frameworkScores: Record<string, number> = {};
      for (const framework of frameworks) {
        const frameworkAudits = audits.filter(a => a.framework_ids.includes(framework.id));
        frameworkScores[framework.name] = frameworkAudits.length > 0 ?
          frameworkAudits.reduce((sum, audit) => sum + audit.score, 0) / frameworkAudits.length : 0;
      }

      return {
        overall_compliance_score: overallScore,
        framework_scores,
        control_effectiveness: 0.85, // Mock value
        audit_success_rate: 0.92, // Mock value
        findings_trend: -0.15, // Mock value
        risk_reduction: 0.25, // Mock value
        cost_of_compliance: 150000, // Mock value
        roi: 2.5, // Mock value
        maturity_level: 'managed',
        last_updated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to get compliance metrics:', error);
      throw error;
    }
  }

  // Initialize default configuration
  private initializeDefaultConfig(): void {
    this.config = {
      audit_frequency: 'quarterly',
      auto_scheduling: true,
      notification_channels: ['email', 'in_app'],
      retention_period: 2555, // 7 years
      risk_threshold: 0.7,
      compliance_threshold: 0.8,
      reporting_format: ['pdf', 'html'],
      evidence_retention: 2555,
      audit_trail_retention: 2555
    };
  }

  // Initialize default frameworks
  private initializeDefaultFrameworks(): void {
    // SOC 2 Framework
    const soc2Framework: ComplianceFramework = {
      id: 'soc2',
      name: 'SOC 2 Type II',
      version: '2022',
      description: 'Service Organization Control 2 Type II compliance framework',
      category: 'security',
      requirements: [
        {
          id: 'soc2-cc1',
          name: 'Security',
          description: 'Information and systems are protected against unauthorized access',
          category: 'Security',
          requirement_id: 'CC1',
          requirement_text: 'The entity implements reasonable controls to protect information and systems from unauthorized access, use, or modification.',
          control_objectives: ['Access Control', 'Security Monitoring'],
          validation_criteria: [
            {
              id: 'soc2-cc1-1',
              name: 'Access Control Review',
              description: 'Review access control mechanisms',
              criteria_type: 'automated',
              test_method: 'Configuration review',
              expected_result: 'Access controls properly implemented',
              acceptance_criteria: ['All systems have access controls', 'Access is properly restricted'],
              tools_required: ['Configuration scanner'],
              evidence_required: ['Configuration screenshots', 'Access policies'],
              frequency: 'quarterly'
            }
          ],
          evidence_requirements: [
            {
              id: 'soc2-cc1-e1',
              evidence_type: 'document',
              description: 'Access control policies',
              retention_period: 2555,
              format: ['PDF', 'DOCX'],
              location: 'Policy repository',
              custodian: 'Security Team',
              collection_method: 'Document review',
              verification_method: 'Manager sign-off'
            }
          ],
          testing_procedures: [
            {
              id: 'soc2-cc1-t1',
              name: 'Access Control Testing',
              description: 'Test access control implementations',
              procedure_type: 'automated',
              steps: [
                {
                  id: 'soc2-cc1-t1-s1',
                  step_number: 1,
                  action: 'Scan system configurations',
                  description: 'Scan all systems for access control configurations',
                  responsible: 'Security Team',
                  inputs: ['System access'],
                  outputs: ['Scan results'],
                  tools: ['Configuration scanner'],
                  quality_criteria: ['Complete coverage', 'Accurate results'],
                  time_estimate: 60
                }
              ],
              prerequisites: ['System access'],
              expected_duration: 120,
              skill_level: 'intermediate',
              tools_required: ['Configuration scanner', 'Access management system'],
              success_criteria: ['All systems scanned', 'No critical vulnerabilities'],
              failure_handling: ['Document issues', 'Schedule retest']
            }
          ],
          frequency: 'quarterly',
          mandatory: true,
          risk_level: 'high',
          status: 'not_assessed',
          last_assessed: '',
          next_assessed: '',
          notes: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ],
      controls: [
        {
          id: 'soc2-ac1',
          name: 'Access Control Management',
          description: 'Manage access to systems and data',
          control_type: 'preventive',
          implementation_status: 'implemented',
          effectiveness: 0.9,
          maturity_level: 'managed',
          automation_level: 'semi_automated',
          coverage: 0.95,
          testing_frequency: 'quarterly',
          last_tested: new Date().toISOString(),
          next_test: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          test_results: [],
          owner: 'Security Team',
          documentation: ['Access control policy', 'Procedure documentation'],
          metrics: {
            effectiveness_score: 0.9,
            coverage_percentage: 0.95,
            test_pass_rate: 0.95,
            average_test_duration: 45,
            findings_count: 2,
            critical_findings: 0,
            cost_of_control: 50000,
            roi_score: 3.2,
            last_updated: new Date().toISOString()
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ],
      mappings: [],
      enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.frameworks.set(soc2Framework.id, soc2Framework);

    // GDPR Framework
    const gdprFramework: ComplianceFramework = {
      id: 'gdpr',
      name: 'General Data Protection Regulation',
      version: '2018',
      description: 'EU General Data Protection Regulation compliance framework',
      category: 'privacy',
      requirements: [
        {
          id: 'gdpr-art32',
          name: 'Security of Processing',
          description: 'Implement appropriate technical and organizational measures for data security',
          category: 'Data Protection',
          requirement_id: 'Article 32',
          requirement_text: 'The controller and the processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk.',
          control_objectives: ['Data Security', 'Risk Management'],
          validation_criteria: [
            {
              id: 'gdpr-art32-1',
              name: 'Security Measures Review',
              description: 'Review implemented security measures',
              criteria_type: 'manual',
              test_method: 'Documentation review',
              expected_result: 'Appropriate security measures implemented',
              acceptance_criteria: ['Security measures documented', 'Risk assessment completed'],
              tools_required: ['Document management system'],
              evidence_required: ['Security policies', 'Risk assessment reports'],
              frequency: 'annual'
            }
          ],
          evidence_requirements: [
            {
              id: 'gdpr-art32-e1',
              evidence_type: 'document',
              description: 'Data protection policies',
              retention_period: 2555,
              format: ['PDF', 'DOCX'],
              location: 'Policy repository',
              custodian: 'DPO',
              collection_method: 'Document review',
              verification_method: 'Management review'
            }
          ],
          testing_procedures: [
            {
              id: 'gdpr-art32-t1',
              name: 'Security Assessment',
              description: 'Assess security measures implementation',
              procedure_type: 'manual',
              steps: [
                {
                  id: 'gdpr-art32-t1-s1',
                  step_number: 1,
                  action: 'Review security documentation',
                  description: 'Review all security-related documentation',
                  responsible: 'DPO',
                  inputs: ['Security policies'],
                  outputs: ['Review report'],
                  tools: ['Document management system'],
                  quality_criteria: ['Complete review', 'Accurate assessment'],
                  time_estimate: 120
                }
              ],
              prerequisites: ['Security documentation'],
              expected_duration: 240,
              skill_level: 'advanced',
              tools_required: ['Document management system'],
              success_criteria: ['All documentation reviewed', 'Assessment completed'],
              failure_handling: ['Document gaps', 'Plan improvements']
            }
          ],
          frequency: 'annual',
          mandatory: true,
          risk_level: 'critical',
          status: 'not_assessed',
          last_assessed: '',
          next_assessed: '',
          notes: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ],
      controls: [
        {
          id: 'gdpr-dp1',
          name: 'Data Protection Officer',
          description: 'Appoint Data Protection Officer',
          control_type: 'preventive',
          implementation_status: 'implemented',
          effectiveness: 0.95,
          maturity_level: 'managed',
          automation_level: 'manual',
          coverage: 1.0,
          testing_frequency: 'annual',
          last_tested: new Date().toISOString(),
          next_test: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          test_results: [],
          owner: 'Legal Department',
          documentation: ['DPO appointment', 'Role description'],
          metrics: {
            effectiveness_score: 0.95,
            coverage_percentage: 1.0,
            test_pass_rate: 1.0,
            average_test_duration: 30,
            findings_count: 0,
            critical_findings: 0,
            cost_of_control: 75000,
            roi_score: 2.8,
            last_updated: new Date().toISOString()
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ],
      mappings: [],
      enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.frameworks.set(gdprFramework.id, gdprFramework);
  }

  // Initialize default policies
  private initializeDefaultPolicies(): void {
    // Security Policy
    const securityPolicy: CompliancePolicy = {
      id: 'security-policy',
      name: 'Information Security Policy',
      description: 'Comprehensive information security policy for the organization',
      category: 'security',
      framework_references: ['soc2', 'gdpr'],
      requirements: ['soc2-cc1', 'gdpr-art32'],
      controls: ['soc2-ac1', 'gdpr-dp1'],
      procedures: [
        {
          id: 'security-proc-1',
          name: 'Access Management Procedure',
          description: 'Procedure for managing user access',
          purpose: 'Ensure proper access control',
          scope: 'All systems and applications',
          responsibilities: [
            {
              role: 'System Administrator',
              responsibilities: ['Manage user accounts', 'Review access logs'],
              authority: ['Create accounts', 'Disable accounts'],
              accountabilities: ['Access control compliance']
            }
          ],
          steps: [
            {
              step_number: 1,
              action: 'Receive access request',
              description: 'Process access request from manager',
              responsible: 'System Administrator',
              due_date: '1 business day',
              inputs: ['Access request form'],
              outputs: ['Processed request'],
              tools: ['Access management system'],
              quality_criteria: ['Request processed within SLA'],
              time_estimate: 30
            }
          ],
          inputs: ['Access request form'],
          outputs: ['Access granted/denied'],
          tools: ['Access management system', 'Identity provider'],
          references: ['Security policy'],
          frequency: 'as_needed',
          version: '1.0',
          last_updated: new Date().toISOString()
        }
      ],
      enforcement: {
        violation_handling: {
          classification: 'moderate',
          response_time: 24,
          investigation_required: true,
          documentation_required: ['Incident report', 'Investigation notes'],
          notification_required: ['Security Manager', 'Department Head']
        },
        disciplinary_actions: [
          {
            violation_type: 'Unauthorized access',
            severity: 'suspension',
            conditions: ['First offense', 'No malicious intent'],
            appeal_process: 'HR review within 5 business days'
          }
        ],
        escalation_procedures: {
          trigger_conditions: ['Critical data access', 'Repeated violations'],
          escalation_levels: [
            {
              level: 1,
              authority: 'Security Manager',
              responsibilities: ['Initial investigation', 'Documentation'],
              notification_required: ['Department Head'],
              decision_authority: ['Access suspension', 'Temporary restrictions']
            }
          ],
          time_thresholds: [4, 8, 24],
          communication_plan: ['Email notification', 'Management briefing']
        },
        reporting_requirements: {
          incident_types: ['Security violation', 'Access breach'],
          reporting_timeline: 24,
          report_format: ['Incident report form'],
          recipients: ['Security Manager', 'DPO'],
          regulatory_notifications: ['DPO within 72 hours']
        },
        audit_trail: {
          events_to_log: ['Access granted', 'Access denied', 'Policy violation'],
          retention_period: 2555,
          log_format: 'JSON',
          protection_requirements: ['Encryption', 'Access control'],
          access_controls: ['Security team only'],
          verification_procedures: ['Monthly audit', 'Hash verification']
        }
      },
      monitoring: {
        continuous_monitoring: {
          automated_checks: [
            {
              name: 'Access Review',
              description: 'Review access permissions',
              check_type: 'access',
              frequency: 1440, // 24 hours
              threshold: 0,
              failure_actions: ['Alert security team', 'Generate report'],
              success_criteria: ['All access reviewed']
            }
          ],
          real_time_alerts: [
            {
              trigger_conditions: ['Unauthorized access attempt', 'Privilege escalation'],
              severity_levels: ['high', 'critical'],
              notification_channels: ['email', 'sms'],
              escalation_rules: [
                {
                  condition: 'Critical access violation',
                  severity_threshold: 'critical',
                  escalation_time: 15,
                  recipients: ['CISO', 'Security Manager'],
                  actions: ['Immediate account suspension']
                }
              ],
              auto_response: [
                {
                  trigger: 'Multiple failed attempts',
                  actions: ['Account lockout', 'Security alert'],
                  conditions: ['More than 5 failures'],
                  approval_required: false
                }
              ]
          },
          dashboards: [
            {
              name: 'Security Dashboard',
              description: 'Real-time security monitoring',
              widgets: [],
              access_roles: ['Security Team', 'Management'],
              refresh_interval: 5
            }
          ],
          integration_points: ['Active Directory', 'SIEM', 'Identity Provider'],
          frequency: 5
        },
        periodic_assessments: [
          {
            assessment_type: 'Quarterly Security Review',
            frequency: 'quarterly',
            scope: ['All systems', 'Access controls'],
            methodology: ['NIST CSF'],
            participants: ['Security Team', 'Auditors'],
            deliverables: ['Assessment report', 'Recommendations'],
            schedule: {
              start_date: new Date().toISOString(),
              end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
              frequency: 'quarterly',
              reminders: [7, 3, 1],
              auto_scheduling: true
            }
          }
        ],
        alerting: {
          alert_rules: [
            {
              name: 'Security Violation Alert',
              description: 'Alert on security policy violations',
              condition: 'policy_violation_detected',
              severity: 'high',
              enabled: true,
              threshold: 1,
              time_window: 60,
              notification_channels: ['email', 'slack'],
              auto_response: ['Create incident ticket', 'Notify security team']
            }
          ],
          notification_channels: [
            {
              type: 'email',
              destination: 'security@company.com',
              enabled: true,
              template: 'security_alert',
              filters: [
                { field: 'severity', operator: 'in', value: ['high', 'critical'] }
              ]
            }
          ],
          escalation_policies: [],
          suppression_rules: []
        },
        reporting: {
          report_types: [
            {
              name: 'Monthly Security Report',
              description: 'Monthly security compliance report',
              type: 'compliance_status',
              frequency: 'monthly',
              recipients: ['Management', 'Security Team'],
              template: 'security_monthly'
            }
          ],
          schedule: {
            generation_time: '09:00',
            frequency: 'monthly',
            auto_delivery: true,
            recipients: ['management@company.com']
          },
          distribution: [
            {
              name: 'Management Distribution',
              recipients: ['CEO', 'CFO', 'Department Heads'],
              permissions: ['view', 'download']
            }
          ],
          formats: ['pdf', 'html'],
          retention: {
            reports: 2555,
            audit_logs: 2555,
            evidence: 2555,
            policies: 2555,
            auto_cleanup: true
          }
        },
        metrics: {
          overall_compliance_score: 0,
          framework_scores: {},
          control_effectiveness: 0,
          audit_success_rate: 0,
          findings_trend: 0,
          risk_reduction: 0,
          cost_of_compliance: 0,
          roi: 0,
          maturity_level: 'initial',
          last_updated: new Date().toISOString()
        }
      },
      exceptions: [],
      version: '1.0',
      status: 'approved',
      effective_date: new Date().toISOString(),
      review_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      owner: 'CISO',
      approvers: ['CEO', 'Legal Counsel'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.policies.set(securityPolicy.id, securityPolicy);
  }

  // Start scheduled tasks
  private startScheduledTasks(): void {
    // Schedule quarterly audits
    const quarterlyAudit = setInterval(() => {
      this.scheduleQuarterlyAudits();
    }, 24 * 60 * 60 * 1000); // Check daily

    this.schedules.set('quarterly-audit', quarterlyAudit);

    // Schedule monthly compliance checks
    const monthlyCheck = setInterval(() => {
      this.performMonthlyComplianceChecks();
    }, 24 * 60 * 60 * 1000); // Check daily

    this.schedules.set('monthly-check', monthlyCheck);
  }

  // Schedule quarterly audits
  private async scheduleQuarterlyAudits(): Promise<void> {
    try {
      const now = new Date();
      const quarter = Math.floor(now.getMonth() / 3) + 1;
      const year = now.getFullYear();

      // Check if we're at the start of a quarter
      if (now.getMonth() % 3 === 0 && now.getDate() === 1) {
        console.log(`Starting Q${quarter} ${year} compliance audits`);

        // Schedule audits for all enabled frameworks
        for (const framework of Array.from(this.frameworks.values()).filter(f => f.enabled)) {
          await this.conductAudit({
            title: `${framework.name} Audit - Q${quarter} ${year}`,
            description: `Quarterly compliance audit for ${framework.name}`,
            audit_type: 'internal',
            scope: {
              departments: ['IT', 'Security', 'Legal'],
              systems: ['All critical systems'],
              processes: ['Access management', 'Data protection'],
              locations: ['All locations'],
              time_period: {
                start: new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString(),
                end: now.toISOString()
              },
              exclusions: ['Test systems'],
              limitations: []
            },
            framework_ids: [framework.id],
            requirements: [],
            auditor: 'Internal Audit Team',
            audit_team: ['Security Team', 'Compliance Officer'],
            methodology: 'Framework-based assessment'
          });
        }
      }
    } catch (error) {
      console.error('Failed to schedule quarterly audits:', error);
    }
  }

  // Perform monthly compliance checks
  private async performMonthlyComplianceChecks(): Promise<void> {
    try {
      console.log('Performing monthly compliance checks');

      // Check policy compliance
      for (const policy of Array.from(this.policies.values())) {
        if (policy.status === 'approved') {
          // Mock compliance check
          const complianceScore = Math.random() * 0.3 + 0.7; // 70-100%
          
          if (complianceScore < 0.8) {
            console.warn(`Policy ${policy.name} compliance score: ${(complianceScore * 100).toFixed(1)}%`);
          }
        }
      }

      // Check framework requirements
      for (const framework of Array.from(this.frameworks.values()).filter(f => f.enabled)) {
        const overdueRequirements = framework.requirements.filter(req => {
          if (req.next_assessed) {
            return new Date(req.next_assessed) < new Date();
          }
          return false;
        });

        if (overdueRequirements.length > 0) {
          console.warn(`${framework.name} has ${overdueRequirements.length} overdue requirements`);
        }
      }

    } catch (error) {
      console.error('Failed to perform monthly compliance checks:', error);
    }
  }

  // Get audit by ID
  async getAudit(auditId: string): Promise<ComplianceAudit | null> {
    try {
      return this.audits.get(auditId) || null;
    } catch (error) {
      console.error('Failed to get compliance audit:', error);
      return null;
    }
  }

  // Get all audits
  async getAudits(filters?: {
    framework_id?: string;
    status?: string;
    auditor?: string;
    date_range?: {
      start: string;
      end: string;
    };
  }): Promise<ComplianceAudit[]> {
    try {
      let audits = Array.from(this.audits.values());

      // Apply filters
      if (filters?.framework_id) {
        audits = audits.filter(audit => audit.framework_ids.includes(filters.framework_id));
      }
      if (filters?.status) {
        audits = audits.filter(audit => audit.status === filters.status);
      }
      if (filters?.auditor) {
        audits = audits.filter(audit => audit.auditor === filters.auditor);
      }
      if (filters?.date_range) {
        const start = new Date(filters.date_range.start).getTime();
        const end = new Date(filters.date_range.end).getTime();
        audits = audits.filter(audit => {
          const auditTime = new Date(audit.start_date).getTime();
          return auditTime >= start && auditTime <= end;
        });
      }

      return audits;
    } catch (error) {
      console.error('Failed to get compliance audits:', error);
      return [];
    }
  }

  // Get framework by ID
  async getFramework(frameworkId: string): Promise<ComplianceFramework | null> {
    try {
      return this.frameworks.get(frameworkId) || null;
    } catch (error) {
      console.error('Failed to get compliance framework:', error);
      return null;
    }
  }

  // Get all frameworks
  async getFrameworks(filters?: {
    category?: string;
    enabled?: boolean;
  }): Promise<ComplianceFramework[]> {
    try {
      let frameworks = Array.from(this.frameworks.values());

      if (filters?.category) {
        frameworks = frameworks.filter(f => f.category === filters.category);
      }
      if (filters?.enabled !== undefined) {
        frameworks = frameworks.filter(f => f.enabled === filters.enabled);
      }

      return frameworks;
    } catch (error) {
      console.error('Failed to get compliance frameworks:', error);
      return [];
    }
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    activeFrameworks: number;
    totalFrameworks: number;
    activeAudits: number;
    totalAudits: number;
    averageComplianceScore: number;
    nextScheduledAudit: string | null;
    errors: string[];
  }> {
    try {
      const activeFrameworks = Array.from(this.frameworks.values()).filter(f => f.enabled).length;
      const totalFrameworks = this.frameworks.size;
      const activeAudits = Array.from(this.audits.values()).filter(a => a.status === 'in_progress').length;
      const totalAudits = this.audits.size;
      const metrics = await this.getComplianceMetrics();

      const status = activeFrameworks === 0 ? 'critical' : 
                   metrics.overall_compliance_score < 0.7 ? 'warning' : 'healthy';

      return {
        status,
        activeFrameworks,
        totalFrameworks,
        activeAudits,
        totalAudits,
        averageComplianceScore: metrics.overall_compliance_score,
        nextScheduledAudit: null,
        errors: []
      };
    } catch (error) {
      console.error('Compliance health check failed:', error);
      return {
        status: 'critical',
        activeFrameworks: 0,
        totalFrameworks: 0,
        activeAudits: 0,
        totalAudits: 0,
        averageComplianceScore: 0,
        nextScheduledAudit: null,
        errors: [error instanceof Error ? error.message : 'Health check failed']
      };
    }
  }
}

// Singleton instance
export const complianceService = new ComplianceService();
