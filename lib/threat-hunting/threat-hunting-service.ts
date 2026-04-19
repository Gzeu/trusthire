// Threat Hunting Service with MITRE ATT&CK
// Complete proactive threat hunting platform

import { PrismaClient } from '@prisma/client';
import { getRedisClient } from '@/lib/redis-wrapper';

export interface ThreatHunt {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  hunt_type: 'proactive' | 'reactive' | 'continuous';
  methodology: 'hypothesis_driven' | 'indicator_driven' | 'behavioral' | 'comprehensive';
  scope: HuntScope;
  hypotheses: HuntHypothesis[];
  queries: HuntQuery[];
  findings: HuntFinding[];
  timeline: HuntTimeline;
  assigned_to: string;
  created_by: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  duration?: number;
  metrics: HuntMetrics;
  tags: string[];
  mitre_tactics: string[];
  mitre_techniques: string[];
}

export interface HuntScope {
  time_range: {
    start: string;
    end: string;
  };
  data_sources: string[];
  systems: string[];
  users: string[];
  networks: string[];
  applications: string[];
  geographic: string[];
  threat_actors: string[];
}

export interface HuntHypothesis {
  id: string;
  title: string;
  description: string;
  confidence: 'low' | 'medium' | 'high';
  status: 'unvalidated' | 'validated' | 'disproven' | 'in_progress';
  evidence: string[];
  mitre_tactics: string[];
  mitre_techniques: string[];
  created_at: string;
  updated_at: string;
}

export interface HuntQuery {
  id: string;
  name: string;
  description: string;
  query_type: 'siem' | 'edr' | 'network' | 'endpoint' | 'cloud' | 'identity' | 'custom';
  query_string: string;
  parameters: Record<string, any>;
  data_source: string;
  time_range: {
    start: string;
    end: string;
  };
  status: 'draft' | 'executed' | 'failed' | 'completed';
  results: QueryResult[];
  execution_time?: number;
  created_at: string;
  executed_at?: string;
}

export interface QueryResult {
  id: string;
  timestamp: string;
  event_type: string;
  source: string;
  target: string;
  details: Record<string, any>;
  severity: string;
  confidence: number;
  mitre_tactics: string[];
  mitre_techniques: string[];
  indicators: Indicator[];
}

export interface Indicator {
  type: 'ip' | 'domain' | 'hash' | 'url' | 'email' | 'file' | 'registry' | 'process';
  value: string;
  confidence: number;
  context: string;
}

export interface HuntFinding {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  status: 'new' | 'investigating' | 'confirmed' | 'false_positive' | 'resolved';
  evidence: Evidence[];
  indicators: Indicator[];
  mitre_tactics: string[];
  mitre_techniques: string[];
  recommendations: string[];
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface Evidence {
  id: string;
  type: 'log' | 'screenshot' | 'file' | 'network' | 'memory' | 'registry' | 'process';
  name: string;
  description: string;
  path?: string;
  hash?: string;
  size?: number;
  timestamp: string;
  source: string;
  metadata: Record<string, any>;
}

export interface HuntTimeline {
  events: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'hunt_created' | 'query_executed' | 'finding_discovered' | 'hypothesis_updated' | 'status_changed';
  description: string;
  details: Record<string, any>;
  user: string;
}

export interface HuntMetrics {
  total_queries: number;
  successful_queries: number;
  total_findings: number;
  confirmed_findings: number;
  false_positives: number;
  average_query_time: number;
  hypotheses_validated: number;
  coverage_percentage: number;
  risk_score: number;
}

export interface MITRETTP {
  id: string;
  name: string;
  description: string;
  url: string;
  tactics: MITRETactic[];
}

export interface MITRETactic {
  id: string;
  name: string;
  description: string;
  url: string;
  techniques: MITRETechnique[];
}

export interface MITRETechnique {
  id: string;
  name: string;
  description: string;
  url: string;
  tactics: string[];
  data_sources: string[];
  detection_methods: string[];
  mitigation: string[];
}

export interface HuntTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimated_time: number; // hours
  prerequisites: string[];
  scope: HuntScope;
  methodology: 'hypothesis_driven' | 'indicator_driven' | 'behavioral' | 'comprehensive';
  hypotheses: Omit<HuntHypothesis, 'id' | 'created_at' | 'updated_at'>[];
  queries: Omit<HuntQuery, 'id' | 'results' | 'created_at' | 'executed_at'>[];
  mitre_tactics: string[];
  mitre_techniques: string[];
  tags: string[];
  created_by: string;
  created_at: string;
  usage_count: number;
  rating: number;
}

export interface HuntReport {
  id: string;
  hunt_id: string;
  title: string;
  summary: string;
  findings: HuntFinding[];
  recommendations: string[];
  lessons_learned: string[];
  metrics: HuntMetrics;
  generated_at: string;
  generated_by: string;
  format: 'pdf' | 'html' | 'json' | 'csv';
}

class ThreatHuntingService {
  private prisma: PrismaClient;
  private redis: any;
  private hunts: Map<string, ThreatHunt> = new Map();
  private templates: Map<string, HuntTemplate> = new Map();
  private mitreData: MITRETTP | null = null;

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = getRedisClient();
    this.initializeMITREData();
    this.initializeTemplates();
  }

  // Create new threat hunt
  async createHunt(hunt: Omit<ThreatHunt, 'id' | 'created_at' | 'metrics'>): Promise<ThreatHunt> {
    try {
      const newHunt: ThreatHunt = {
        ...hunt,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        metrics: {
          total_queries: 0,
          successful_queries: 0,
          total_findings: 0,
          confirmed_findings: 0,
          false_positives: 0,
          average_query_time: 0,
          hypotheses_validated: 0,
          coverage_percentage: 0,
          risk_score: 0
        }
      };

      // Store in memory
      this.hunts.set(newHunt.id, newHunt);

      return newHunt;
    } catch (error) {
      console.error('Failed to create hunt:', error);
      throw error;
    }
  }

  // Execute hunt query
  async executeQuery(huntId: string, queryId: string, parameters?: Record<string, any>): Promise<QueryResult[]> {
    try {
      const hunt = this.hunts.get(huntId);
      if (!hunt) {
        throw new Error(`Hunt ${huntId} not found`);
      }

      const query = hunt.queries.find(q => q.id === queryId);
      if (!query) {
        throw new Error(`Query ${queryId} not found in hunt ${huntId}`);
      }

      // Update query parameters if provided
      if (parameters) {
        query.parameters = { ...query.parameters, ...parameters };
      }

      // Execute query based on type
      let results: QueryResult[] = [];
      const startTime = Date.now();

      switch (query.query_type) {
        case 'siem':
          results = await this.executeSIEMQuery(query);
          break;
        case 'edr':
          results = await this.executeEDRQuery(query);
          break;
        case 'network':
          results = await this.executeNetworkQuery(query);
          break;
        case 'endpoint':
          results = await this.executeEndpointQuery(query);
          break;
        case 'identity':
          results = await this.executeIdentityQuery(query);
          break;
        case 'cloud':
          results = await this.executeCloudQuery(query);
          break;
        case 'custom':
          results = await this.executeCustomQuery(query);
          break;
      }

      const executionTime = Date.now() - startTime;

      // Update query results
      query.results = results;
      query.execution_time = executionTime;
      query.status = 'completed';
      query.executed_at = new Date().toISOString();

      // Update hunt metrics
      hunt.metrics.total_queries++;
      if (results.length > 0) {
        hunt.metrics.successful_queries++;
      }
      hunt.metrics.average_query_time = 
        (hunt.metrics.average_query_time * (hunt.metrics.total_queries - 1) + executionTime) / hunt.metrics.total_queries;

      // Process results for findings
      const findings = await this.processQueryResults(hunt, results);
      hunt.findings.push(...findings);

      return results;
    } catch (error) {
      console.error('Failed to execute query:', error);
      throw error;
    }
  }

  // Execute SIEM query
  private async executeSIEMQuery(query: HuntQuery): Promise<QueryResult[]> {
    try {
      // Mock SIEM query execution
      const mockResults: QueryResult[] = [
        {
          id: crypto.randomUUID(),
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          event_type: 'authentication_failure',
          source: 'active_directory',
          target: 'user1@company.com',
          details: {
            source_ip: '192.168.1.100',
            failure_reason: 'invalid_credentials',
            user_agent: 'Mozilla/5.0'
          },
          severity: 'medium',
          confidence: 0.8,
          mitre_tactics: ['TA0001'],
          mitre_techniques: ['T1110'],
          indicators: [
            { type: 'ip', value: '192.168.1.100', confidence: 0.9, context: 'source_ip' },
            { type: 'email', value: 'user1@company.com', confidence: 1.0, context: 'target_user' }
          ]
        }
      ];

      return mockResults;
    } catch (error) {
      console.error('Failed to execute SIEM query:', error);
      return [];
    }
  }

  // Execute EDR query
  private async executeEDRQuery(query: HuntQuery): Promise<QueryResult[]> {
    try {
      // Mock EDR query execution
      const mockResults: QueryResult[] = [
        {
          id: crypto.randomUUID(),
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          event_type: 'process_creation',
          source: 'endpoint_protection',
          target: 'C:\\Windows\\System32\\powershell.exe',
          details: {
            process_id: 1234,
            parent_process: 'explorer.exe',
            command_line: '-Command "Get-Process"',
            user: 'SYSTEM'
          },
          severity: 'low',
          confidence: 0.7,
          mitre_tactics: ['TA0002'],
          mitre_techniques: ['T1059'],
          indicators: [
            { type: 'process', value: 'powershell.exe', confidence: 0.8, context: 'process_name' },
            { type: 'file', value: 'C:\\Windows\\System32\\powershell.exe', confidence: 0.9, context: 'process_path' }
          ]
        }
      ];

      return mockResults;
    } catch (error) {
      console.error('Failed to execute EDR query:', error);
      return [];
    }
  }

  // Execute network query
  private async executeNetworkQuery(query: HuntQuery): Promise<QueryResult[]> {
    try {
      // Mock network query execution
      const mockResults: QueryResult[] = [
        {
          id: crypto.randomUUID(),
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          event_type: 'network_connection',
          source: 'firewall',
          target: '10.0.0.1:443',
          details: {
            source_ip: '192.168.1.50',
            destination_ip: '10.0.0.1',
            destination_port: 443,
            protocol: 'HTTPS',
            bytes_transferred: 1024
          },
          severity: 'low',
          confidence: 0.9,
          mitre_tactics: ['TA0011'],
          mitre_techniques: ['T1071'],
          indicators: [
            { type: 'ip', value: '10.0.0.1', confidence: 0.9, context: 'destination_ip' },
            { type: 'ip', value: '192.168.1.50', confidence: 0.9, context: 'source_ip' }
          ]
        }
      ];

      return mockResults;
    } catch (error) {
      console.error('Failed to execute network query:', error);
      return [];
    }
  }

  // Execute endpoint query
  private async executeEndpointQuery(query: HuntQuery): Promise<QueryResult[]> {
    try {
      // Mock endpoint query execution
      const mockResults: QueryResult[] = [
        {
          id: crypto.randomUUID(),
          timestamp: new Date(Date.now() - 900000).toISOString(),
          event_type: 'registry_modification',
          source: 'endpoint_detection',
          target: 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run',
          details: {
            key_path: 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\\malware.exe',
            value: 'C:\\Users\\user\\Downloads\\malware.exe',
            action: 'create',
            user: 'user@company.com'
          },
          severity: 'high',
          confidence: 0.95,
          mitre_tactics: ['TA0003'],
          mitre_techniques: ['T1547'],
          indicators: [
            { type: 'registry', value: 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\\malware.exe', confidence: 0.9, context: 'registry_key' },
            { type: 'file', value: 'C:\\Users\\user\\Downloads\\malware.exe', confidence: 0.8, context: 'file_path' }
          ]
        }
      ];

      return mockResults;
    } catch (error) {
      console.error('Failed to execute endpoint query:', error);
      return [];
    }
  }

  // Execute identity query
  private async executeIdentityQuery(query: HuntQuery): Promise<QueryResult[]> {
    try {
      // Mock identity query execution
      const mockResults: QueryResult[] = [
        {
          id: crypto.randomUUID(),
          timestamp: new Date(Date.now() - 5400000).toISOString(),
          event_type: 'account_creation',
          source: 'active_directory',
          target: 'newuser@company.com',
          details: {
            user_id: 'CN=newuser,OU=Users,DC=company,DC=com',
            department: 'IT',
            manager: 'manager@company.com',
            creation_method: 'self_service'
          },
          severity: 'info',
          confidence: 1.0,
          mitre_tactics: ['TA0003'],
          mitre_techniques: ['T1136'],
          indicators: [
            { type: 'email', value: 'newuser@company.com', confidence: 1.0, context: 'user_principal' }
          ]
        }
      ];

      return mockResults;
    } catch (error) {
      console.error('Failed to execute identity query:', error);
      return [];
    }
  }

  // Execute cloud query
  private async executeCloudQuery(query: HuntQuery): Promise<QueryResult[]> {
    try {
      // Mock cloud query execution
      const mockResults: QueryResult[] = [
        {
          id: crypto.randomUUID(),
          timestamp: new Date(Date.now() - 2700000).toISOString(),
          event_type: 'api_access',
          source: 'cloud_security',
          target: 'aws.amazonaws.com',
          details: {
            service: 'S3',
            api_action: 'GetObject',
            bucket: 'company-data',
            object: 'sensitive-data.csv',
            source_ip: '203.0.113.10',
            user_arn: 'arn:aws:iam::123456789012:user/cloud-user'
          },
          severity: 'medium',
          confidence: 0.8,
          mitre_tactics: ['TA0009'],
          mitre_techniques: ['T1530'],
          indicators: [
            { type: 'domain', value: 'aws.amazonaws.com', confidence: 0.9, context: 'api_endpoint' },
            { type: 'ip', value: '203.0.113.10', confidence: 0.8, context: 'source_ip' }
          ]
        }
      ];

      return mockResults;
    } catch (error) {
      console.error('Failed to execute cloud query:', error);
      return [];
    }
  }

  // Execute custom query
  private async executeCustomQuery(query: HuntQuery): Promise<QueryResult[]> {
    try {
      // Mock custom query execution
      const mockResults: QueryResult[] = [
        {
          id: crypto.randomUUID(),
          timestamp: new Date(Date.now() - 4500000).toISOString(),
          event_type: 'custom_alert',
          source: 'custom_system',
          target: 'system_resource',
          details: {
            alert_type: 'anomaly_detected',
            anomaly_score: 0.85,
            baseline: 'normal_behavior',
            current: 'suspicious_activity'
          },
          severity: 'medium',
          confidence: 0.7,
          mitre_tactics: ['TA0004'],
          mitre_techniques: ['T1083'],
          indicators: []
        }
      ];

      return mockResults;
    } catch (error) {
      console.error('Failed to execute custom query:', error);
      return [];
    }
  }

  // Process query results for findings
  private async processQueryResults(hunt: ThreatHunt, results: QueryResult[]): Promise<HuntFinding[]> {
    try {
      const findings: HuntFinding[] = [];

      for (const result of results) {
        // Check if result matches any hypotheses
        const matchingHypotheses = hunt.hypotheses.filter(hypothesis => 
          this.matchesHypothesis(result, hypothesis)
        );

        if (matchingHypotheses.length > 0) {
          // Create finding
          const finding: HuntFinding = {
            id: crypto.randomUUID(),
            title: `Suspicious ${result.event_type} detected`,
            description: `Suspicious activity detected: ${result.details}`,
            severity: this.mapSeverity(result.severity),
            confidence: result.confidence,
            status: 'new',
            evidence: [
              {
                id: crypto.randomUUID(),
                type: 'log',
                name: `${result.event_type} log`,
                description: `Event log for ${result.event_type}`,
                timestamp: result.timestamp,
                source: result.source,
                metadata: result.details
              }
            ],
            indicators: result.indicators,
            mitre_tactics: result.mitre_tactics,
            mitre_techniques: result.mitre_techniques,
            recommendations: this.generateRecommendations(result),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          findings.push(finding);
        }
      }

      return findings;
    } catch (error) {
      console.error('Failed to process query results:', error);
      return [];
    }
  }

  // Check if result matches hypothesis
  private matchesHypothesis(result: QueryResult, hypothesis: HuntHypothesis): boolean {
    // Simple matching logic - in production, this would be more sophisticated
    return hypothesis.mitre_techniques.some(technique => 
      result.mitre_techniques.includes(technique)
    );
  }

  // Map severity
  private mapSeverity(severity: string): 'info' | 'low' | 'medium' | 'high' | 'critical' {
    const mapping: Record<string, 'info' | 'low' | 'medium' | 'high' | 'critical'> = {
      'info': 'info',
      'low': 'low',
      'medium': 'medium',
      'high': 'high',
      'critical': 'critical'
    };
    return mapping[severity] || 'info';
  }

  // Generate recommendations
  private generateRecommendations(result: QueryResult): string[] {
    const recommendations: string[] = [];

    if (result.mitre_techniques.includes('T1110')) {
      recommendations.push('Investigate authentication failure - check for credential stuffing attacks');
      recommendations.push('Review user account activity and implement MFA');
    }

    if (result.mitre_techniques.includes('T1059')) {
      recommendations.push('Analyze PowerShell command execution for malicious activity');
      recommendations.push('Review script content and execution context');
    }

    if (result.mitre_techniques.includes('T1547')) {
      recommendations.push('Investigate registry modification for persistence mechanisms');
      recommendations.push('Remove suspicious registry entries and scan affected systems');
    }

    if (result.indicators.some(i => i.type === 'hash' && i.confidence > 0.8)) {
      recommendations.push('Isolate systems with malicious file hashes');
      recommendations.push('Run full antivirus scan on affected endpoints');
    }

    return recommendations;
  }

  // Get hunt by ID
  async getHunt(huntId: string): Promise<ThreatHunt | null> {
    try {
      return this.hunts.get(huntId) || null;
    } catch (error) {
      console.error('Failed to get hunt:', error);
      return null;
    }
  }

  // Get all hunts
  async getHunts(filters?: {
    status?: string;
    priority?: string;
    assigned_to?: string;
    created_by?: string;
  }): Promise<ThreatHunt[]> {
    try {
      let hunts = Array.from(this.hunts.values());
      
      if (filters?.status) {
        hunts = hunts.filter(h => h.status === filters.status);
      }
      if (filters?.priority) {
        hunts = hunts.filter(h => h.priority === filters.priority);
      }
      if (filters?.assigned_to) {
        hunts = hunts.filter(h => h.assigned_to === filters.assigned_to);
      }
      if (filters?.created_by) {
        hunts = hunts.filter(h => h.created_by === filters.created_by);
      }

      return hunts;
    } catch (error) {
      console.error('Failed to get hunts:', error);
      return [];
    }
  }

  // Create hunt from template
  async createHuntFromTemplate(templateId: string, name: string, scope: Partial<HuntScope>, assignedTo: string, createdBy: string): Promise<ThreatHunt> {
    try {
      const template = this.templates.get(templateId);
      if (!template) {
        throw new Error(`Template ${templateId} not found`);
      }

      const hunt: Omit<ThreatHunt, 'id' | 'created_at' | 'metrics'> = {
        name,
        description: template.description,
        status: 'draft',
        priority: 'medium',
        hunt_type: 'proactive',
        methodology: template.methodology,
        scope: { ...template.scope, ...scope },
        hypotheses: template.hypotheses.map(h => ({
          ...h,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })),
        queries: template.queries.map(q => ({
          ...q,
          id: crypto.randomUUID(),
          results: [],
          status: 'draft',
          created_at: new Date().toISOString(),
          executed_at: undefined
        })),
        findings: [],
        timeline: { events: [] },
        assigned_to: assignedTo,
        created_by: createdBy,
        tags: template.tags,
        mitre_tactics: template.mitre_tactics,
        mitre_techniques: template.mitre_techniques
      };

      return await this.createHunt(hunt);
    } catch (error) {
      console.error('Failed to create hunt from template:', error);
      throw error;
    }
  }

  // Generate hunt report
  async generateHuntReport(huntId: string, format: 'pdf' | 'html' | 'json' | 'csv' = 'html', generatedBy: string): Promise<HuntReport> {
    try {
      const hunt = await this.getHunt(huntId);
      if (!hunt) {
        throw new Error(`Hunt ${huntId} not found`);
      }

      const report: HuntReport = {
        id: crypto.randomUUID(),
        hunt_id: huntId,
        title: `Threat Hunt Report: ${hunt.name}`,
        summary: this.generateHuntSummary(hunt),
        findings: hunt.findings,
        recommendations: this.generateHuntRecommendations(hunt),
        lessons_learned: this.generateLessonsLearned(hunt),
        metrics: hunt.metrics,
        generated_at: new Date().toISOString(),
        generated_by: generatedBy,
        format
      };

      return report;
    } catch (error) {
      console.error('Failed to generate hunt report:', error);
      throw error;
    }
  }

  // Generate hunt summary
  private generateHuntSummary(hunt: ThreatHunt): string {
    const summary = `
      Hunt: ${hunt.name}
      Status: ${hunt.status}
      Duration: ${hunt.duration ? `${hunt.duration} minutes` : 'In progress'}
      Queries Executed: ${hunt.metrics.total_queries}
      Findings Discovered: ${hunt.metrics.total_findings}
      Confirmed Findings: ${hunt.metrics.confirmed_findings}
      False Positives: ${hunt.metrics.false_positives}
      Success Rate: ${hunt.metrics.total_findings > 0 ? ((hunt.metrics.confirmed_findings / hunt.metrics.total_findings) * 100).toFixed(1) : '0'}%
    `;

    return summary.trim();
  }

  // Generate hunt recommendations
  private generateHuntRecommendations(hunt: ThreatHunt): string[] {
    const recommendations: string[] = [];

    // Add recommendations based on findings
    hunt.findings.forEach(finding => {
      recommendations.push(...finding.recommendations);
    });

    // Add recommendations based on metrics
    if (hunt.metrics.false_positives > hunt.metrics.confirmed_findings) {
      recommendations.push('Review and refine hunting hypotheses to reduce false positives');
      recommendations.push('Consider additional training on threat detection techniques');
    }

    if (hunt.metrics.coverage_percentage < 50) {
      recommendations.push('Expand hunt scope to improve coverage');
      recommendations.push('Add additional data sources to improve detection capabilities');
    }

    // Add general recommendations
    recommendations.push('Document all findings and share with security team');
    recommendations.push('Update detection rules based on confirmed findings');
    recommendations.push('Schedule regular hunts for persistent threats');

    return recommendations;
  }

  // Generate lessons learned
  private generateLessonsLearned(hunt: ThreatHunt): string[] {
    const lessons: string[] = [];

    // Add lessons based on successful findings
    const confirmedFindings = hunt.findings.filter(f => f.status === 'confirmed');
    if (confirmedFindings.length > 0) {
      lessons.push('Proactive hunting can uncover previously unknown threats');
      lessons.push('MITRE ATT&CK framework provides effective hunting guidance');
    }

    // Add lessons based on false positives
    const falsePositives = hunt.findings.filter(f => f.status === 'false_positive');
    if (falsePositives.length > 0) {
      lessons.push('Regular hypothesis validation is essential to avoid false positives');
      lessons.push('Context is critical for accurate threat assessment');
    }

    // Add general lessons
    lessons.push('Multi-source data correlation improves hunting effectiveness');
    lessons.push('Continuous hunting is more effective than periodic hunts');
    lessons.push('Documentation and knowledge sharing improves team capabilities');

    return lessons;
  }

  // Initialize MITRE ATT&CK data
  private initializeMITREData(): void {
    // Mock MITRE ATT&CK data
    this.mitreData = {
      id: 'enterprise-attack',
      name: 'Enterprise ATT&CK',
      description: 'Adversarial Tactics, Techniques, and Common Knowledge',
      url: 'https://attack.mitre.org',
      tactics: [
        {
          id: 'TA0001',
          name: 'Initial Access',
          description: 'Adversaries try to get into your network',
          url: 'https://attack.mitre.org/tactics/TA0001',
          techniques: [
            {
              id: 'T1078',
              name: 'Valid Accounts',
              description: 'Adversaries may obtain and abuse credentials of existing accounts',
              url: 'https://attack.mitre.org/techniques/T1078',
              tactics: ['TA0001'],
              data_sources: ['Active Directory', 'IAM', 'SSO'],
              detection_methods: ['Log analysis', 'Monitoring', 'Authentication logs'],
              mitigation: ['Multi-factor authentication', 'Account lockout policies', 'Credential monitoring']
            },
            {
              id: 'T1110',
              name: 'Brute Force',
              description: 'Adversaries may attempt to brute force login attempts',
              url: 'https://attack.mitre.org/techniques/T1110',
              tactics: ['TA0001'],
              data_sources: ['Authentication logs', 'Firewall logs', 'IDS alerts'],
              detection_methods: ['Failed login monitoring', 'Account lockout monitoring', 'IP reputation'],
              mitigation: ['Account lockout policies', 'IP blocking', 'Rate limiting']
            }
          ]
        },
        {
          id: 'TA0002',
          name: 'Execution',
          description: 'Adversaries try to run malicious code on a target network or local system',
          url: 'https://attack.mitre.org/tactics/TA0002',
          techniques: [
            {
              id: 'T1059',
              name: 'Command and Scripting Interpreter',
              description: 'Adversaries may abuse command and script interpreters to execute commands',
              url: 'https://attack.mitre.org/techniques/T1059',
              tactics: ['TA0002'],
              data_sources: ['Process monitoring', 'Command-line interface logs', 'PowerShell operational logs'],
              detection_methods: ['Process monitoring', 'Command-line interface logs', 'PowerShell operational logs'],
              mitigation: ['Application control', 'PowerShell constrained language mode', 'Script block logging']
            }
          ]
        },
        {
          id: 'TA0003',
          name: 'Persistence',
          description: 'Adversaries try to maintain access to systems across restarts and logins',
          url: 'https://attack.mitre.org/tactics/TA0003',
          techniques: [
            {
              id: 'T1547',
              name: 'Boot or Logon Autostart Execution',
              description: 'Adversaries may abuse boot or logon autostart execution to persist malicious programs',
              url: 'https://attack.mitre.org/techniques/T1547',
              tactics: ['TA0003'],
              data_sources: ['Registry', 'File system', 'Startup folder monitoring'],
              detection_methods: ['Registry monitoring', 'File system monitoring', 'Startup folder monitoring'],
              mitigation: ['Disable autorun', 'Registry key permissions', 'Application whitelisting']
            }
          ]
        }
      ]
    };
  }

  // Initialize templates
  private initializeTemplates(): void {
    // Malware Investigation Template
    const malwareTemplate: HuntTemplate = {
      id: 'malware-investigation',
      name: 'Malware Investigation',
      description: 'Comprehensive malware investigation using EDR and network data',
      category: 'malware',
      difficulty: 'intermediate',
      estimated_time: 8,
      prerequisites: ['EDR access', 'Network logs', 'SIEM access'],
      scope: {
        time_range: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString()
        },
        data_sources: ['edr', 'siem', 'network'],
        systems: ['workstations', 'servers'],
        users: [],
        networks: ['corporate', 'dmz'],
        applications: [],
        geographic: [],
        threat_actors: []
      },
      methodology: 'hypothesis_driven',
      hypotheses: [
        {
          title: 'Malware infection detected in environment',
          description: 'Evidence suggests malware infection on endpoints',
          confidence: 'medium',
          status: 'unvalidated',
          evidence: [],
          mitre_tactics: ['TA0002', 'TA0003'],
          mitre_techniques: ['T1059', 'T1547']
        },
        {
          title: 'Command and control communication established',
          description: 'Network traffic shows C2 communication patterns',
          confidence: 'medium',
          status: 'unvalidated',
          evidence: [],
          mitre_tactics: ['TA0011', 'TA0010'],
          mitre_techniques: ['T1071', 'T1102']
        }
      ],
      queries: [
        {
          name: 'Suspicious Process Creation',
          description: 'Find suspicious process creation events',
          query_type: 'edr',
          query_string: 'process_name LIKE "%powershell%" OR process_name LIKE "%cmd.exe%" OR process_name LIKE "%wscript.exe%"',
          parameters: {
            include_parent_process: true,
            include_command_line: true
          },
          data_source: 'edr',
          time_range: {
            start: '{{scope.time_range.start}}',
            end: '{{scope.time_range.end}}'
          },
          status: 'draft'
        }
      ],
      mitre_tactics: ['TA0002', 'TA0003', 'TA0008'],
      mitre_techniques: ['T1059', 'T1547', 'T1071', 'T1021'],
      tags: ['malware', 'edr', 'investigation'],
      created_by: 'system',
      created_at: new Date().toISOString(),
      usage_count: 0,
      rating: 4.5
    };

    this.templates.set(malwareTemplate.id, malwareTemplate);
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    activeHunts: number;
    totalHunts: number;
    averageQueryTime: number;
    lastExecution: string | null;
    errors: string[];
  }> {
    try {
      const activeHunts = Array.from(this.hunts.values()).filter(h => h.status === 'active').length;
      const totalHunts = this.hunts.size;

      const status = activeHunts > 20 ? 'critical' : 
                   activeHunts > 10 ? 'warning' : 'healthy';

      return {
        status,
        activeHunts,
        totalHunts,
        averageQueryTime: 0,
        lastExecution: null,
        errors: []
      };
    } catch (error) {
      console.error('Threat hunting health check failed:', error);
      return {
        status: 'critical',
        activeHunts: 0,
        totalHunts: 0,
        averageQueryTime: 0,
        lastExecution: null,
        errors: [error instanceof Error ? error.message : 'Health check failed']
      };
    }
  }
}

// Singleton instance
export const threatHuntingService = new ThreatHuntingService();

