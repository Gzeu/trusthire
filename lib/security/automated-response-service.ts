// Automated Threat Response Service
// Comprehensive automated response system for real-time threat mitigation

import { PrismaClient } from '@prisma/client';
import { getRedisClient } from '@/lib/redis-wrapper';

export interface ThreatResponse {
  id: string;
  threatId: string;
  threatType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  responseActions: ResponseAction[];
  status: 'pending' | 'executing' | 'completed' | 'failed' | 'cancelled';
  triggeredAt: string;
  executedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  context: ResponseContext;
  results: ResponseResult[];
}

export interface ResponseAction {
  id: string;
  type: 'block' | 'quarantine' | 'alert' | 'isolate' | 'patch' | 'monitor' | 'escalate' | 'log' | 'notify';
  priority: 'low' | 'medium' | 'high' | 'critical';
  delay: number; // seconds
  parameters: Record<string, any>;
  conditions: ResponseCondition[];
  dependencies: string[]; // Other actions that must complete first
  rollbackAction?: ResponseAction;
}

export interface ResponseCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'not_in' | 'contains' | 'not_contains';
  value: any;
  required: boolean;
}

export interface ResponseContext {
  threat: ThreatData;
  environment: EnvironmentData;
  user: UserData;
  system: SystemData;
  mlInsights?: {
    confidence: number;
    classification: string;
    riskScore: number;
    predictions: Array<{ type: string; probability: number; }>;
  };
}

export interface ThreatData {
  id: string;
  type: string;
  severity: string;
  source: string;
  indicators: Array<{
    type: 'ip' | 'domain' | 'hash' | 'url' | 'email';
    value: string;
    confidence: number;
  }>;
  description: string;
  timestamp: string;
}

export interface EnvironmentData {
  systemLoad: number;
  activeUsers: number;
  securityLevel: string;
  timeOfDay: string;
  dayOfWeek: string;
  recentAlerts: number;
  activeThreats: number;
}

export interface UserData {
  id?: string;
  role: string;
  permissions: string[];
  sessionActive: boolean;
  lastActivity: string;
}

export interface SystemData {
  hostname: string;
  platform: string;
  version: string;
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
}

export interface ResponseResult {
  actionId: string;
  actionType: string;
  status: 'success' | 'failed' | 'partial' | 'skipped';
  executedAt: string;
  duration: number;
  output?: any;
  errorMessage?: string;
  metrics: Record<string, number>;
}

export interface ResponseRule {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  conditions: ResponseCondition[];
  actions: ResponseAction[];
  cooldown: number; // seconds
  maxExecutions: number;
  executionWindow: number; // seconds
  categories: string[];
  minSeverity: string;
}

export interface ResponseTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  actions: ResponseAction[];
  variables: Array<{
    name: string;
    type: string;
    required: boolean;
    defaultValue?: any;
  }>;
}

class AutomatedResponseService {
  private prisma: PrismaClient;
  private redis: any;
  private rules: Map<string, ResponseRule> = new Map();
  private templates: Map<string, ResponseTemplate> = new Map();
  private activeResponses: Map<string, ThreatResponse> = new Map();
  private executionQueue: ResponseAction[] = [];
  private isProcessing = false;

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = getRedisClient();
    this.initializeRules();
    this.initializeTemplates();
    this.startQueueProcessor();
  }

  // Trigger automated response for threat
  async triggerResponse(threat: ThreatData, context: ResponseContext): Promise<ThreatResponse> {
    try {
      // Check if response already exists for this threat
      const existingResponse = await this.getExistingResponse(threat.id);
      if (existingResponse && existingResponse.status !== 'failed') {
        return existingResponse;
      }

      // Find applicable rules
      const applicableRules = this.findApplicableRules(threat, context);
      
      if (applicableRules.length === 0) {
        throw new Error('No applicable response rules found');
      }

      // Select best rule (highest priority)
      const rule = applicableRules.sort((a, b) => b.priority - a.priority)[0];

      // Create response
      const response: ThreatResponse = {
        id: crypto.randomUUID(),
        threatId: threat.id,
        threatType: threat.type,
        severity: threat.severity as any,
        responseActions: this.generateActions(rule, threat, context),
        status: 'pending',
        triggeredAt: new Date().toISOString(),
        context,
        results: []
      };

      // Store response
      await this.storeResponse(response);
      this.activeResponses.set(response.id, response);

      // Add actions to queue
      this.addToQueue(response.responseActions);

      // Log trigger
      await this.logResponseEvent(response.id, 'triggered', {
        ruleId: rule.id,
        ruleName: rule.name,
        threatType: threat.type,
        threatSeverity: threat.severity
      });

      return response;
    } catch (error) {
      console.error('Failed to trigger automated response:', error);
      throw error;
    }
  }

  // Find applicable rules for threat
  private findApplicableRules(threat: ThreatData, context: ResponseContext): ResponseRule[] {
    const applicable: ResponseRule[] = [];

    const rules = Array.from(this.rules.values());
    for (const rule of rules) {
      if (!rule.enabled) continue;

      // Check category
      if (rule.categories.length > 0 && !rule.categories.includes(threat.type)) continue;

      // Check severity
      if (rule.minSeverity && this.compareSeverity(threat.severity, rule.minSeverity) < 0) continue;

      // Check conditions
      if (this.evaluateConditions(rule.conditions, threat, context)) {
        applicable.push(rule);
      }
    }

    return applicable;
  }

  // Generate actions from rule
  private generateActions(rule: ResponseRule, threat: ThreatData, context: ResponseContext): ResponseAction[] {
    return rule.actions.map(action => ({
      ...action,
      id: crypto.randomUUID(),
      parameters: this.interpolateParameters(action.parameters, threat, context)
    }));
  }

  // Evaluate rule conditions
  private evaluateConditions(conditions: ResponseCondition[], threat: ThreatData, context: ResponseContext): boolean {
    for (const condition of conditions) {
      const value = this.getFieldValue(condition.field, threat, context);
      const result = this.evaluateCondition(value, condition.operator, condition.value);
      
      if (condition.required && !result) {
        return false;
      }
    }
    return true;
  }

  // Get field value for condition evaluation
  private getFieldValue(field: string, threat: ThreatData, context: ResponseContext): any {
    const parts = field.split('.');
    let value: any = { threat, ...context };

    for (const part of parts) {
      value = value?.[part];
    }

    return value;
  }

  // Evaluate condition
  private evaluateCondition(value: any, operator: string, expected: any): boolean {
    switch (operator) {
      case 'eq': return value === expected;
      case 'ne': return value !== expected;
      case 'gt': return Number(value) > Number(expected);
      case 'lt': return Number(value) < Number(expected);
      case 'gte': return Number(value) >= Number(expected);
      case 'lte': return Number(value) <= Number(expected);
      case 'in': return Array.isArray(expected) && expected.includes(value);
      case 'not_in': return Array.isArray(expected) && !expected.includes(value);
      case 'contains': return String(value).includes(String(expected));
      case 'not_contains': return !String(value).includes(String(expected));
      default: return false;
    }
  }

  // Compare severity levels
  private compareSeverity(severity1: string, severity2: string): number {
    const levels = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
    return (levels[severity1 as keyof typeof levels] || 0) - (levels[severity2 as keyof typeof levels] || 0);
  }

  // Interpolate parameters with context data
  private interpolateParameters(parameters: Record<string, any>, threat: ThreatData, context: ResponseContext): Record<string, any> {
    const interpolated: Record<string, any> = {};

    for (const [key, value] of Object.entries(parameters)) {
      if (typeof value === 'string' && value.includes('{{')) {
        interpolated[key] = value.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
          const fieldValue = this.getFieldValue(path.trim(), threat, context);
          return fieldValue !== undefined ? String(fieldValue) : match;
        });
      } else {
        interpolated[key] = value;
      }
    }

    return interpolated;
  }

  // Add actions to execution queue
  private addToQueue(actions: ResponseAction[]): void {
    // Sort by priority and delay
    const sortedActions = actions.sort((a, b) => {
      const priorityOrder: Record<string, number> = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
      const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      if (priorityDiff !== 0) return priorityDiff;
      return a.delay - b.delay;
    });

    this.executionQueue.push(...sortedActions);
    
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  // Process execution queue
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.executionQueue.length === 0) return;

    this.isProcessing = true;

    try {
      while (this.executionQueue.length > 0) {
        const action = this.executionQueue.shift()!;
        
        // Wait for delay
        if (action.delay > 0) {
          await new Promise(resolve => setTimeout(resolve, action.delay * 1000));
        }

        // Check dependencies
        if (action.dependencies.length > 0) {
          const dependenciesCompleted = await this.checkDependencies(action.dependencies);
          if (!dependenciesCompleted) {
            // Re-queue action for later
            this.executionQueue.push(action);
            continue;
          }
        }

        // Execute action
        await this.executeAction(action);
      }
    } catch (error) {
      console.error('Error processing response queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Execute single action
  private async executeAction(action: ResponseAction): Promise<void> {
    const startTime = Date.now();
    let result: ResponseResult;

    try {
      let output: any;

      switch (action.type) {
        case 'block':
          output = await this.executeBlockAction(action);
          break;
        case 'quarantine':
          output = await this.executeQuarantineAction(action);
          break;
        case 'alert':
          output = await this.executeAlertAction(action);
          break;
        case 'isolate':
          output = await this.executeIsolateAction(action);
          break;
        case 'patch':
          output = await this.executePatchAction(action);
          break;
        case 'monitor':
          output = await this.executeMonitorAction(action);
          break;
        case 'escalate':
          output = await this.executeEscalateAction(action);
          break;
        case 'log':
          output = await this.executeLogAction(action);
          break;
        case 'notify':
          output = await this.executeNotifyAction(action);
          break;
        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }

      const duration = Date.now() - startTime;

      result = {
        actionId: action.id,
        actionType: action.type,
        status: 'success',
        executedAt: new Date().toISOString(),
        duration,
        output,
        metrics: this.calculateActionMetrics(action, output)
      };

      // Log success
      await this.logActionResult(action.id, result);

    } catch (error) {
      const duration = Date.now() - startTime;

      result = {
        actionId: action.id,
        actionType: action.type,
        status: 'failed',
        executedAt: new Date().toISOString(),
        duration,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        metrics: {}
      };

      // Log failure
      await this.logActionResult(action.id, result);
    }

    // Store result
    await this.storeActionResult(result);
  }

  // Action execution methods
  private async executeBlockAction(action: ResponseAction): Promise<any> {
    const { target, type, duration } = action.parameters;
    
    // Block IP, domain, or user
    if (type === 'ip') {
      await this.blockIPAddress(target, duration);
    } else if (type === 'domain') {
      await this.blockDomain(target, duration);
    } else if (type === 'user') {
      await this.blockUser(target, duration);
    }

    return { blocked: true, target, type, duration };
  }

  private async executeQuarantineAction(action: ResponseAction): Promise<any> {
    const { target, type, reason } = action.parameters;
    
    // Quarantine file, system, or user
    if (type === 'file') {
      await this.quarantineFile(target, reason);
    } else if (type === 'system') {
      await this.quarantineSystem(target, reason);
    } else if (type === 'user') {
      await this.quarantineUser(target, reason);
    }

    return { quarantined: true, target, type, reason };
  }

  private async executeAlertAction(action: ResponseAction): Promise<any> {
    const { message, severity, recipients, channels } = action.parameters;
    
    // Send alert through various channels
    const alertResults = [];
    
    if (channels.includes('email')) {
      const emailResult = await this.sendEmailAlert(recipients, message, severity);
      alertResults.push({ channel: 'email', success: emailResult });
    }
    
    if (channels.includes('slack')) {
      const slackResult = await this.sendSlackAlert(message, severity);
      alertResults.push({ channel: 'slack', success: slackResult });
    }
    
    if (channels.includes('sms')) {
      const smsResult = await this.sendSMSAlert(recipients, message, severity);
      alertResults.push({ channel: 'sms', success: smsResult });
    }

    return { alertSent: true, results: alertResults };
  }

  private async executeIsolateAction(action: ResponseAction): Promise<any> {
    const { target, type, networkSegment } = action.parameters;
    
    // Isolate system or network segment
    if (type === 'system') {
      await this.isolateSystem(target, networkSegment);
    } else if (type === 'network') {
      await this.isolateNetwork(networkSegment);
    }

    return { isolated: true, target, type, networkSegment };
  }

  private async executePatchAction(action: ResponseAction): Promise<any> {
    const { target, patchType, priority } = action.parameters;
    
    // Apply security patch
    const patchResult = await this.applySecurityPatch(target, patchType, priority);

    return { patched: true, target, patchType, priority, patchResult };
  }

  private async executeMonitorAction(action: ResponseAction): Promise<any> {
    const { target, metrics, duration } = action.parameters;
    
    // Start monitoring
    const monitoringId = await this.startMonitoring(target, metrics, duration);

    return { monitoringStarted: true, target, metrics, duration, monitoringId };
  }

  private async executeEscalateAction(action: ResponseAction): Promise<any> {
    const { level, recipients, reason, context } = action.parameters;
    
    // Escalate to higher level
    const escalationResult = await this.escalateThreat(level, recipients, reason, context);

    return { escalated: true, level, recipients, reason, escalationResult };
  }

  private async executeLogAction(action: ResponseAction): Promise<any> {
    const { level, message, context, category } = action.parameters;
    
    // Log security event
    const logId = await this.logSecurityEvent(level, message, context, category);

    return { logged: true, level, message, category, logId };
  }

  private async executeNotifyAction(action: ResponseAction): Promise<any> {
    const { recipients, message, type, priority } = action.parameters;
    
    // Send notification
    const notificationResult = await this.sendNotification(recipients, message, type, priority);

    return { notified: true, recipients, message, type, priority, notificationResult };
  }

  // Placeholder action implementations
  private async blockIPAddress(ip: string, duration: number): Promise<void> {
    // Implementation for IP blocking
    console.log(`Blocking IP ${ip} for ${duration} seconds`);
  }

  private async blockDomain(domain: string, duration: number): Promise<void> {
    // Implementation for domain blocking
    console.log(`Blocking domain ${domain} for ${duration} seconds`);
  }

  private async blockUser(userId: string, duration: number): Promise<void> {
    // Implementation for user blocking
    console.log(`Blocking user ${userId} for ${duration} seconds`);
  }

  private async quarantineFile(filePath: string, reason: string): Promise<void> {
    // Implementation for file quarantine
    console.log(`Quarantining file ${filePath}: ${reason}`);
  }

  private async quarantineSystem(systemId: string, reason: string): Promise<void> {
    // Implementation for system quarantine
    console.log(`Quarantining system ${systemId}: ${reason}`);
  }

  private async quarantineUser(userId: string, reason: string): Promise<void> {
    // Implementation for user quarantine
    console.log(`Quarantining user ${userId}: ${reason}`);
  }

  private async sendEmailAlert(recipients: string[], message: string, severity: string): Promise<boolean> {
    // Implementation for email alerts
    console.log(`Sending email alert to ${recipients.join(', ')}: ${message} (${severity})`);
    return true;
  }

  private async sendSlackAlert(message: string, severity: string): Promise<boolean> {
    // Implementation for Slack alerts
    console.log(`Sending Slack alert: ${message} (${severity})`);
    return true;
  }

  private async sendSMSAlert(recipients: string[], message: string, severity: string): Promise<boolean> {
    // Implementation for SMS alerts
    console.log(`Sending SMS alert to ${recipients.join(', ')}: ${message} (${severity})`);
    return true;
  }

  private async isolateSystem(systemId: string, networkSegment: string): Promise<void> {
    // Implementation for system isolation
    console.log(`Isolating system ${systemId} to network segment ${networkSegment}`);
  }

  private async isolateNetwork(networkSegment: string): Promise<void> {
    // Implementation for network isolation
    console.log(`Isolating network segment ${networkSegment}`);
  }

  private async applySecurityPatch(target: string, patchType: string, priority: string): Promise<any> {
    // Implementation for security patching
    console.log(`Applying ${patchType} patch to ${target} with priority ${priority}`);
    return { patchApplied: true, target, patchType, priority };
  }

  private async startMonitoring(target: string, metrics: string[], duration: number): Promise<string> {
    // Implementation for monitoring
    const monitoringId = crypto.randomUUID();
    console.log(`Starting monitoring for ${target}: ${metrics.join(', ')} for ${duration} seconds`);
    return monitoringId;
  }

  private async escalateThreat(level: string, recipients: string[], reason: string, context: any): Promise<any> {
    // Implementation for threat escalation
    console.log(`Escalating threat to ${level}: ${reason} - notifying ${recipients.join(', ')}`);
    return { escalated: true, level, recipients, reason };
  }

  private async logSecurityEvent(level: string, message: string, context: any, category: string): Promise<string> {
    // Implementation for security logging
    const logId = crypto.randomUUID();
    console.log(`Logging security event [${level}] ${category}: ${message}`);
    return logId;
  }

  private async sendNotification(recipients: string[], message: string, type: string, priority: string): Promise<any> {
    // Implementation for notifications
    console.log(`Sending ${type} notification to ${recipients.join(', ')}: ${message} (${priority})`);
    return { notificationSent: true, recipients, message, type, priority };
  }

  // Helper methods
  private calculateActionMetrics(action: ResponseAction, output: any): Record<string, number> {
    return {
      executionTime: Date.now(),
      priority: { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 }[action.priority] || 0,
      parameterCount: Object.keys(action.parameters).length
    };
  }

  private async checkDependencies(dependencies: string[]): Promise<boolean> {
    for (const depId of dependencies) {
      const result = await this.redis.get(`action_result:${depId}`);
      if (!result) return false;
      
      const parsed = JSON.parse(result);
      if (parsed.status !== 'success') return false;
    }
    return true;
  }

  private async isRuleInCooldown(ruleId: string): Promise<boolean> {
    const cooldownKey = `rule_cooldown:${ruleId}`;
    const cooldown = await this.redis.get(cooldownKey);
    return cooldown !== null;
  }

  private async hasReachedExecutionLimit(ruleId: string): Promise<boolean> {
    const limitKey = `rule_executions:${ruleId}`;
    const executions = await this.redis.lrange(limitKey, 0, -1);
    return executions.length >= 10; // Max 10 executions
  }

  private async getExistingResponse(threatId: string): Promise<ThreatResponse | null> {
    const response = await this.redis.get(`response:${threatId}`);
    return response ? JSON.parse(response) : null;
  }

  private async storeResponse(response: any): Promise<void> {
    await this.redis.setex(`response:${response.threatId}`, 3600, JSON.stringify(response));
    
    // Store in database for persistence
    await this.prisma.automatedResponse.create({
      data: {
        id: response.id,
        threatId: response.threatId,
        threatType: response.threatType,
        severity: response.severity,
        status: response.status,
        triggeredAt: new Date(response.triggeredAt),
        executedAt: response.executedAt ? new Date(response.executedAt) : null,
        completedAt: response.completedAt ? new Date(response.completedAt) : null,
        errorMessage: response.errorMessage,
        context: JSON.stringify(response.context),
        actions: JSON.stringify(response.responseActions),
        results: JSON.stringify(response.results)
      }
    });
  }

  private async logResponseEvent(responseId: string, event: string, data: any): Promise<void> {
    await this.redis.lpush(`response_events:${responseId}`, JSON.stringify({
      event,
      timestamp: new Date().toISOString(),
      data
    }));
    await this.redis.ltrim(`response_events:${responseId}`, 0, 99);
  }

  private async logActionResult(actionId: string, result: ResponseResult): Promise<void> {
    await this.redis.setex(`action_result:${actionId}`, 3600, JSON.stringify(result));
  }

  private async storeActionResult(result: ResponseResult): Promise<void> {
    await this.redis.lpush(`action_results:${result.actionId}`, JSON.stringify(result));
    await this.redis.ltrim(`action_results:${result.actionId}`, 0, 9);
  }

  // Initialize default rules
  private initializeRules(): void {
    // High severity malware rule
    this.rules.set('malware_high_severity', {
      id: 'malware_high_severity',
      name: 'High Severity Malware Response',
      enabled: true,
      priority: 100,
      conditions: [
        { field: 'threat.type', operator: 'eq', value: 'malware', required: true },
        { field: 'threat.severity', operator: 'gte', value: 'high', required: true }
      ],
      actions: [
        {
          id: '',
          type: 'quarantine',
          priority: 'critical',
          delay: 0,
          parameters: {
            target: '{{threat.indicators.0.value}}',
            type: 'file',
            reason: 'High severity malware detected'
          },
          conditions: [],
          dependencies: []
        },
        {
          id: '',
          type: 'alert',
          priority: 'high',
          delay: 5,
          parameters: {
            message: 'High severity malware detected: {{threat.description}}',
            severity: 'critical',
            recipients: ['security-team@company.com'],
            channels: ['email', 'slack']
          },
          conditions: [],
          dependencies: []
        },
        {
          id: '',
          type: 'escalate',
          priority: 'high',
          delay: 10,
          parameters: {
            level: 'senior',
            recipients: ['csirt@company.com'],
            reason: 'High severity malware requires immediate attention',
            context: '{{threat}}'
          },
          conditions: [],
          dependencies: []
        }
      ],
      cooldown: 300,
      maxExecutions: 1,
      executionWindow: 3600,
      categories: ['malware'],
      minSeverity: 'high'
    });

    // Phishing attack rule
    this.rules.set('phishing_attack', {
      id: 'phishing_attack',
      name: 'Phishing Attack Response',
      enabled: true,
      priority: 80,
      conditions: [
        { field: 'threat.type', operator: 'eq', value: 'phishing', required: true }
      ],
      actions: [
        {
          id: '',
          type: 'block',
          priority: 'high',
          delay: 0,
          parameters: {
            target: '{{threat.indicators.0.value}}',
            type: 'domain',
            duration: 86400
          },
          conditions: [],
          dependencies: []
        },
        {
          id: '',
          type: 'alert',
          priority: 'medium',
          delay: 2,
          parameters: {
            message: 'Phishing attack detected: {{threat.description}}',
            severity: 'high',
            recipients: ['security-team@company.com'],
            channels: ['email']
          },
          conditions: [],
          dependencies: []
        },
        {
          id: '',
          type: 'notify',
          priority: 'low',
          delay: 5,
          parameters: {
            recipients: ['all-users@company.com'],
            message: 'Phishing attempt blocked. Please be cautious of suspicious emails.',
            type: 'security_alert',
            priority: 'medium'
          },
          conditions: [],
          dependencies: []
        }
      ],
      cooldown: 600,
      maxExecutions: 5,
      executionWindow: 3600,
      categories: ['phishing'],
      minSeverity: 'medium'
    });
  }

  // Initialize response templates
  private initializeTemplates(): void {
    this.templates.set('malware_response', {
      id: 'malware_response',
      name: 'Malware Response Template',
      description: 'Standard response for malware threats',
      category: 'malware',
      actions: [
        {
          id: '',
          type: 'quarantine',
          priority: 'critical',
          delay: 0,
          parameters: {
            target: '{{threat.indicators.0.value}}',
            type: 'file',
            reason: 'Malware detected by automated system'
          },
          conditions: [],
          dependencies: []
        }
      ],
      variables: [
        { name: 'target', type: 'string', required: true },
        { name: 'reason', type: 'string', required: false, defaultValue: 'Security policy violation' }
      ]
    });
  }

  // Start queue processor
  private startQueueProcessor(): void {
    setInterval(() => {
      if (!this.isProcessing && this.executionQueue.length > 0) {
        this.processQueue();
      }
    }, 1000);
  }

  // Get active responses
  async getActiveResponses(): Promise<ThreatResponse[]> {
    try {
      const responses = await this.prisma.automatedResponse.findMany({
        where: { 
          status: { in: ['pending', 'executing'] }
        },
        orderBy: { triggeredAt: 'desc' },
        take: 50
      });

      return responses.map(response => ({
        id: response.id,
        threatId: response.threatId,
        threatType: response.threatType,
        severity: response.severity as any,
        responseActions: JSON.parse(response.actions),
        status: response.status as any,
        triggeredAt: response.triggeredAt.toISOString(),
        executedAt: response.executedAt?.toISOString(),
        completedAt: response.completedAt?.toISOString(),
        errorMessage: response.errorMessage || undefined,
        context: JSON.parse(response.context),
        results: JSON.parse(response.results)
      }));
    } catch (error) {
      console.error('Failed to get active responses:', error);
      return [];
    }
  }

  // Cancel response
  async cancelResponse(responseId: string): Promise<void> {
    try {
      const response = this.activeResponses.get(responseId);
      if (!response) return;

      // Remove from queue
      this.executionQueue = this.executionQueue.filter(action => 
        !response.responseActions.some(ra => ra.id === action.id)
      );

      // Update status
      response.status = 'cancelled';
      response.completedAt = new Date().toISOString();

      await this.storeResponse(response);
      this.activeResponses.delete(responseId);

      // Log cancellation
      await this.logResponseEvent(responseId, 'cancelled', {
        cancelledAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('Failed to cancel response:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    activeResponses: number;
    queuedActions: number;
    rulesEnabled: number;
    lastExecution: string | null;
    errors: string[];
  }> {
    try {
      const [activeResponses, rulesEnabled, lastExecution] = await Promise.all([
        Promise.resolve(this.activeResponses.size),
        Promise.resolve(Array.from(this.rules.values()).filter(r => r.enabled).length),
        this.redis.get('last_action_execution')
      ]);

      const status = this.executionQueue.length > 100 ? 'critical' : 
                   this.executionQueue.length > 50 ? 'warning' : 'healthy';

      return {
        status,
        activeResponses,
        queuedActions: this.executionQueue.length,
        rulesEnabled,
        lastExecution,
        errors: []
      };
    } catch (error) {
      console.error('Automated response health check failed:', error);
      return {
        status: 'critical',
        activeResponses: 0,
        queuedActions: 0,
        rulesEnabled: 0,
        lastExecution: null,
        errors: [error instanceof Error ? error.message : 'Health check failed']
      };
    }
  }
}

// Singleton instance
export const automatedResponseService = new AutomatedResponseService();

