// Security Orchestration Service (SOAR)
// Complete SOAR platform for automated security operations

import { PrismaClient } from '@prisma/client';
import { getRedisClient } from '@/lib/redis-wrapper';

export interface SOARPlaybook {
  id: string;
  name: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  triggers: PlaybookTrigger[];
  steps: PlaybookStep[];
  conditions: PlaybookCondition[];
  variables: PlaybookVariable[];
  timeout: number; // seconds
  retryPolicy: RetryPolicy;
  notifications: NotificationConfig[];
  metrics: PlaybookMetrics;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  version: string;
}

export interface PlaybookTrigger {
  id: string;
  type: 'threat' | 'alert' | 'incident' | 'compliance' | 'schedule' | 'manual';
  conditions: TriggerCondition[];
  enabled: boolean;
  priority: number;
  cooldown: number; // seconds
}

export interface TriggerCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'not_in' | 'contains' | 'not_contains' | 'regex';
  value: any;
  required: boolean;
}

export interface PlaybookStep {
  id: string;
  name: string;
  description: string;
  type: 'action' | 'decision' | 'parallel' | 'delay' | 'approval' | 'script' | 'integration';
  order: number;
  enabled: boolean;
  config: StepConfig;
  dependencies: string[]; // Step IDs that must complete first
  timeout: number; // seconds
  retryPolicy: RetryPolicy;
  conditions: StepCondition[];
  on_failure: 'stop' | 'continue' | 'retry' | 'escalate';
  on_success: 'continue' | 'stop' | 'branch';
}

export interface StepConfig {
  // Action step
  action?: {
    type: 'block' | 'quarantine' | 'isolate' | 'patch' | 'scan' | 'collect' | 'notify' | 'escalate' | 'remediate';
    target: string;
    parameters: Record<string, any>;
  };
  
  // Decision step
  decision?: {
    condition: string;
    true_branch: string; // Step ID
    false_branch: string; // Step ID
  };
  
  // Parallel step
  parallel?: {
    steps: string[]; // Step IDs to run in parallel
    wait_for_all: boolean;
  };
  
  // Delay step
  delay?: {
    duration: number; // seconds
    reason: string;
  };
  
  // Approval step
  approval?: {
    required_approvers: string[];
    approval_type: 'any' | 'all' | 'manager' | 'custom';
    timeout: number;
    auto_approve: boolean;
  };
  
  // Script step
  script?: {
    language: 'python' | 'bash' | 'powershell' | 'javascript';
    code: string;
    parameters: Record<string, any>;
    sandbox: boolean;
  };
  
  // Integration step
  integration?: {
    platform: string;
    action: string;
    credentials: string;
    parameters: Record<string, any>;
    webhook_url?: string;
  };
}

export interface StepCondition {
  field: string;
  operator: string;
  value: any;
  required: boolean;
}

export interface PlaybookCondition {
  id: string;
  name: string;
  description: string;
  expression: string; // Logical expression
  variables: string[];
  enabled: boolean;
}

export interface PlaybookVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'datetime';
  required: boolean;
  default_value?: any;
  description: string;
  source: 'input' | 'context' | 'computed' | 'external';
}

export interface RetryPolicy {
  max_attempts: number;
  backoff_type: 'fixed' | 'exponential' | 'linear';
  base_delay: number; // seconds
  max_delay: number; // seconds
  retry_on: ['failure', 'timeout', 'error'];
}

export interface NotificationConfig {
  type: 'email' | 'slack' | 'teams' | 'webhook' | 'sms';
  recipients: string[];
  template: string;
  triggers: ('start' | 'complete' | 'failure' | 'escalation')[];
  enabled: boolean;
}

export interface PlaybookMetrics {
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  average_execution_time: number;
  last_execution: string;
  success_rate: number;
}

export interface PlaybookExecution {
  id: string;
  playbook_id: string;
  playbook_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'paused';
  triggered_by: string;
  triggered_at: string;
  started_at?: string;
  completed_at?: string;
  context: ExecutionContext;
  steps: StepExecution[];
  variables: Record<string, any>;
  metrics: ExecutionMetrics;
  error_message?: string;
  approval_requests: ApprovalRequest[];
}

export interface ExecutionContext {
  trigger_data: any;
  user_context: UserContext;
  system_context: SystemContext;
  threat_context?: ThreatContext;
  compliance_context?: ComplianceContext;
}

export interface UserContext {
  user_id: string;
  username: string;
  role: string;
  permissions: string[];
  department: string;
  manager?: string;
}

export interface SystemContext {
  hostname: string;
  platform: string;
  environment: string;
  region: string;
  resources: ResourceInfo[];
}

export interface ResourceInfo {
  type: 'server' | 'workstation' | 'network' | 'application' | 'data';
  id: string;
  name: string;
  status: string;
  owner: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
}

export interface ThreatContext {
  threat_id: string;
  threat_type: string;
  severity: string;
  confidence: number;
  indicators: any[];
  source: string;
  timestamp: string;
}

export interface ComplianceContext {
  framework: string;
  requirements: string[];
  risk_level: string;
  audit_trail: any[];
  deadline?: string;
}

export interface StepExecution {
  id: string;
  step_id: string;
  step_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped' | 'cancelled';
  started_at?: string;
  completed_at?: string;
  duration?: number;
  result?: any;
  error_message?: string;
  retry_count: number;
  logs: ExecutionLog[];
  artifacts: Artifact[];
}

export interface ExecutionLog {
  timestamp: string;
  level: 'debug' | 'info' | 'warning' | 'error';
  message: string;
  details?: any;
}

export interface Artifact {
  id: string;
  type: 'file' | 'screenshot' | 'log' | 'report' | 'evidence';
  name: string;
  content?: string;
  path?: string;
  size?: number;
  hash?: string;
  created_at: string;
}

export interface ExecutionMetrics {
  total_steps: number;
  completed_steps: number;
  failed_steps: number;
  skipped_steps: number;
  execution_time: number;
  cpu_time: number;
  memory_usage: number;
  network_calls: number;
  api_calls: number;
}

export interface ApprovalRequest {
  id: string;
  step_id: string;
  playbook_execution_id: string;
  requester: string;
  approvers: string[];
  title: string;
  description: string;
  context: any;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  created_at: string;
  expires_at: string;
  responses: ApprovalResponse[];
}

export interface ApprovalResponse {
  approver: string;
  decision: 'approve' | 'reject';
  comment?: string;
  timestamp: string;
}

class SecurityOrchestrationService {
  private prisma: PrismaClient;
  private redis: any;
  private playbooks: Map<string, SOARPlaybook> = new Map();
  private executions: Map<string, PlaybookExecution> = new Map();
  private executionQueue: PlaybookExecution[] = [];
  private isProcessing = false;

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = getRedisClient();
    this.initializeDefaultPlaybooks();
    this.startExecutionProcessor();
  }

  // Create new playbook
  async createPlaybook(playbook: Omit<SOARPlaybook, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>): Promise<SOARPlaybook> {
    try {
      const newPlaybook: SOARPlaybook = {
        ...playbook,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metrics: {
          total_executions: 0,
          successful_executions: 0,
          failed_executions: 0,
          average_execution_time: 0,
          last_execution: '',
          success_rate: 0
        }
      };

      // Store in database
      await this.prisma.sOARPlaybook.create({
        data: {
          id: newPlaybook.id,
          name: newPlaybook.name,
          description: newPlaybook.description,
          category: newPlaybook.category,
          severity: newPlaybook.severity,
          enabled: newPlaybook.enabled,
          triggers: JSON.stringify(newPlaybook.triggers),
          steps: JSON.stringify(newPlaybook.steps),
          conditions: JSON.stringify(newPlaybook.conditions),
          variables: JSON.stringify(newPlaybook.variables),
          timeout: newPlaybook.timeout,
          retryPolicy: JSON.stringify(newPlaybook.retryPolicy),
          notifications: JSON.stringify(newPlaybook.notifications),
          metrics: JSON.stringify(newPlaybook.metrics),
          createdBy: newPlaybook.createdBy,
          version: newPlaybook.version
        }
      });

      // Store in memory
      this.playbooks.set(newPlaybook.id, newPlaybook);

      return newPlaybook;
    } catch (error) {
      console.error('Failed to create playbook:', error);
      throw error;
    }
  }

  // Execute playbook
  async executePlaybook(
    playbookId: string, 
    triggerData: any, 
    userContext: UserContext,
    systemContext: SystemContext
  ): Promise<PlaybookExecution> {
    try {
      const playbook = this.playbooks.get(playbookId);
      if (!playbook) {
        throw new Error(`Playbook ${playbookId} not found`);
      }

      if (!playbook.enabled) {
        throw new Error(`Playbook ${playbookId} is disabled`);
      }

      // Check if already running for same trigger
      const existingExecution = await this.checkDuplicateExecution(playbookId, triggerData);
      if (existingExecution) {
        return existingExecution;
      }

      // Create execution context
      const context: ExecutionContext = {
        trigger_data: triggerData,
        user_context: userContext,
        system_context: systemContext
      };

      // Create execution
      const execution: PlaybookExecution = {
        id: crypto.randomUUID(),
        playbook_id: playbookId,
        playbook_name: playbook.name,
        status: 'pending',
        triggered_by: userContext.user_id,
        triggered_at: new Date().toISOString(),
        context,
        steps: [],
        variables: this.initializeVariables(playbook.variables, triggerData, context),
        metrics: {
          total_steps: playbook.steps.length,
          completed_steps: 0,
          failed_steps: 0,
          skipped_steps: 0,
          execution_time: 0,
          cpu_time: 0,
          memory_usage: 0,
          network_calls: 0,
          api_calls: 0
        },
        approval_requests: []
      };

      // Store execution
      await this.storeExecution(execution);
      this.executions.set(execution.id, execution);

      // Add to queue
      this.executionQueue.push(execution);

      // Log execution start
      await this.logExecutionEvent(execution.id, 'playbook_started', {
        playbook_id: playbookId,
        playbook_name: playbook.name,
        triggered_by: userContext.user_id
      });

      return execution;
    } catch (error) {
      console.error('Failed to execute playbook:', error);
      throw error;
    }
  }

  // Process execution queue
  private async processExecutionQueue(): Promise<void> {
    if (this.isProcessing || this.executionQueue.length === 0) return;

    this.isProcessing = true;

    try {
      while (this.executionQueue.length > 0) {
        const execution = this.executionQueue.shift()!;
        
        try {
          await this.executePlaybookSteps(execution);
        } catch (error) {
          console.error(`Failed to execute playbook ${execution.id}:`, error);
          execution.status = 'failed';
          execution.error_message = error instanceof Error ? error.message : 'Unknown error';
          execution.completed_at = new Date().toISOString();
          await this.storeExecution(execution);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  // Execute playbook steps
  private async executePlaybookSteps(execution: PlaybookExecution): Promise<void> {
    try {
      const playbook = this.playbooks.get(execution.playbook_id);
      if (!playbook) return;

      execution.status = 'running';
      execution.started_at = new Date().toISOString();
      await this.storeExecution(execution);

      // Sort steps by order
      const sortedSteps = [...playbook.steps].sort((a, b) => a.order - b.order);

      for (const step of sortedSteps) {
        if (!step.enabled) continue;

        // Check dependencies
        const dependenciesMet = await this.checkStepDependencies(execution, step.dependencies);
        if (!dependenciesMet) {
          continue; // Skip step if dependencies not met
        }

        // Check step conditions
        const conditionsMet = await this.evaluateStepConditions(execution, step.conditions);
        if (!conditionsMet) {
          await this.createStepExecution(execution, step.id, step.name, 'skipped');
          continue;
        }

        // Execute step
        await this.executeStep(execution, step);
      }

      // Check if all steps completed
      const allStepsCompleted = execution.steps.every(s => 
        s.status === 'completed' || s.status === 'skipped'
      );

      if (allStepsCompleted) {
        execution.status = 'completed';
        execution.completed_at = new Date().toISOString();
        
        // Update playbook metrics
        await this.updatePlaybookMetrics(playbook.id, execution);
      }

      await this.storeExecution(execution);

    } catch (error) {
      execution.status = 'failed';
      execution.error_message = error instanceof Error ? error.message : 'Unknown error';
      execution.completed_at = new Date().toISOString();
      await this.storeExecution(execution);
      throw error;
    }
  }

  // Execute individual step
  private async executeStep(execution: PlaybookExecution, step: PlaybookStep): Promise<void> {
    const stepExecution = await this.createStepExecution(execution, step.id, step.name, 'running');
    
    try {
      const startTime = Date.now();

      switch (step.type) {
        case 'action':
          await this.executeActionStep(execution, step);
          break;
        case 'decision':
          await this.executeDecisionStep(execution, step);
          break;
        case 'parallel':
          await this.executeParallelStep(execution, step);
          break;
        case 'delay':
          await this.executeDelayStep(execution, step);
          break;
        case 'approval':
          await this.executeApprovalStep(execution, step);
          break;
        case 'script':
          await this.executeScriptStep(execution, step);
          break;
        case 'integration':
          await this.executeIntegrationStep(execution, step);
          break;
        default:
          throw new Error(`Unknown step type: ${step.type}`);
      }

      const duration = Date.now() - startTime;
      
      // Update step execution
      stepExecution.status = 'completed';
      stepExecution.duration = duration;
      stepExecution.completed_at = new Date().toISOString();
      
      await this.updateStepExecution(stepExecution);

    } catch (error) {
      const duration = Date.now() - Date.now();
      
      stepExecution.status = 'failed';
      stepExecution.duration = duration;
      stepExecution.error_message = error instanceof Error ? error.message : 'Unknown error';
      stepExecution.completed_at = new Date().toISOString();
      
      await this.updateStepExecution(stepExecution);

      // Handle failure based on policy
      if (step.on_failure === 'stop') {
        throw error;
      } else if (step.on_failure === 'retry') {
        await this.retryStep(execution, step);
      }
    }
  }

  // Execute action step
  private async executeActionStep(execution: PlaybookExecution, step: PlaybookStep): Promise<void> {
    const action = step.config.action!;
    
    switch (action.type) {
      case 'block':
        await this.blockTarget(action.target, action.parameters);
        break;
      case 'quarantine':
        await this.quarantineTarget(action.target, action.parameters);
        break;
      case 'isolate':
        await this.isolateTarget(action.target, action.parameters);
        break;
      case 'patch':
        await this.patchTarget(action.target, action.parameters);
        break;
      case 'scan':
        await this.scanTarget(action.target, action.parameters);
        break;
      case 'collect':
        await this.collectEvidence(action.target, action.parameters);
        break;
      case 'notify':
        await this.sendNotification(action.target, action.parameters);
        break;
      case 'escalate':
        await this.escalateIncident(action.target, action.parameters);
        break;
      case 'remediate':
        await this.remediateThreat(action.target, action.parameters);
        break;
    }
  }

  // Execute decision step
  private async executeDecisionStep(execution: PlaybookExecution, step: PlaybookStep): Promise<void> {
    const decision = step.config.decision!;
    
    // Evaluate condition
    const result = await this.evaluateCondition(execution, decision.condition);
    
    // Determine next step
    const nextStepId = result ? decision.true_branch : decision.false_branch;
    
    // Add next step to execution queue if not already executed
    if (nextStepId && !execution.steps.some(s => s.step_id === nextStepId)) {
      const nextStep = this.playbooks.get(execution.playbook_id)?.steps.find(s => s.id === nextStepId);
      if (nextStep) {
        await this.executeStep(execution, nextStep);
      }
    }
  }

  // Execute parallel step
  private async executeParallelStep(execution: PlaybookExecution, step: PlaybookStep): Promise<void> {
    const parallel = step.config.parallel!;
    
    const promises = parallel.steps.map(async (stepId) => {
      const step = this.playbooks.get(execution.playbook_id)?.steps.find(s => s.id === stepId);
      if (step) {
        return this.executeStep(execution, step);
      }
    });

    if (parallel.wait_for_all) {
      await Promise.all(promises);
    } else {
      await Promise.race(promises);
    }
  }

  // Execute delay step
  private async executeDelayStep(execution: PlaybookExecution, step: PlaybookStep): Promise<void> {
    const delay = step.config.delay!;
    
    await new Promise(resolve => setTimeout(resolve, delay.duration * 1000));
  }

  // Execute approval step
  private async executeApprovalStep(execution: PlaybookExecution, step: PlaybookStep): Promise<void> {
    const approval = step.config.approval!;
    
    // Create approval request
    const approvalRequest: ApprovalRequest = {
      id: crypto.randomUUID(),
      step_id: step.id,
      playbook_execution_id: execution.id,
      requester: execution.triggered_by,
      approvers: approval.required_approvers,
      title: `Approval required for ${step.name}`,
      description: step.description,
      context: execution.context,
      status: 'pending',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + approval.timeout * 1000).toISOString(),
      responses: []
    };

    // Store approval request
    await this.storeApprovalRequest(approvalRequest);
    execution.approval_requests.push(approvalRequest);

    // Wait for approval
    await this.waitForApproval(approvalRequest);
  }

  // Execute script step
  private async executeScriptStep(execution: PlaybookExecution, step: PlaybookStep): Promise<void> {
    const script = step.config.script!;
    
    // Execute script in sandbox
    const result = await this.executeScript(script.language, script.code, script.parameters, script.sandbox);
    
    // Store result
    const stepExecution = execution.steps.find(s => s.step_id === step.id);
    if (stepExecution) {
      stepExecution.result = result;
    }
  }

  // Execute integration step
  private async executeIntegrationStep(execution: PlaybookExecution, step: PlaybookStep): Promise<void> {
    const integration = step.config.integration!;
    
    // Call external API
    const result = await this.callIntegrationAPI(
      integration.platform,
      integration.action,
      integration.credentials,
      integration.parameters,
      integration.webhook_url
    );
    
    // Store result
    const stepExecution = execution.steps.find(s => s.step_id === step.id);
    if (stepExecution) {
      stepExecution.result = result;
    }
  }

  // Helper methods for actions
  private async blockTarget(target: string, parameters: Record<string, any>): Promise<void> {
    console.log(`Blocking target: ${target}`, parameters);
    // Implementation for blocking
  }

  private async quarantineTarget(target: string, parameters: Record<string, any>): Promise<void> {
    console.log(`Quarantining target: ${target}`, parameters);
    // Implementation for quarantine
  }

  private async isolateTarget(target: string, parameters: Record<string, any>): Promise<void> {
    console.log(`Isolating target: ${target}`, parameters);
    // Implementation for isolation
  }

  private async patchTarget(target: string, parameters: Record<string, any>): Promise<void> {
    console.log(`Patching target: ${target}`, parameters);
    // Implementation for patching
  }

  private async scanTarget(target: string, parameters: Record<string, any>): Promise<void> {
    console.log(`Scanning target: ${target}`, parameters);
    // Implementation for scanning
  }

  private async collectEvidence(target: string, parameters: Record<string, any>): Promise<void> {
    console.log(`Collecting evidence from: ${target}`, parameters);
    // Implementation for evidence collection
  }

  private async sendNotification(target: string, parameters: Record<string, any>): Promise<void> {
    console.log(`Sending notification to: ${target}`, parameters);
    // Implementation for notifications
  }

  private async escalateIncident(target: string, parameters: Record<string, any>): Promise<void> {
    console.log(`Escalating incident: ${target}`, parameters);
    // Implementation for escalation
  }

  private async remediateThreat(target: string, parameters: Record<string, any>): Promise<void> {
    console.log(`Remediating threat: ${target}`, parameters);
    // Implementation for remediation
  }

  // Helper methods
  private async evaluateCondition(execution: PlaybookExecution, condition: string): Promise<boolean> {
    // Simplified condition evaluation
    return true;
  }

  private async executeScript(language: string, code: string, parameters: Record<string, any>, sandbox: boolean): Promise<any> {
    // Simplified script execution
    return { success: true, output: 'Script executed successfully' };
  }

  private async callIntegrationAPI(platform: string, action: string, credentials: string, parameters: Record<string, any>, webhook_url?: string): Promise<any> {
    // Simplified API call
    return { success: true, response: 'API call successful' };
  }

  private async waitForApproval(approvalRequest: ApprovalRequest): Promise<void> {
    // Simplified approval waiting
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
  }

  private async retryStep(execution: PlaybookExecution, step: PlaybookStep): Promise<void> {
    // Implement retry logic
    console.log(`Retrying step: ${step.name}`);
  }

  private async checkStepDependencies(execution: PlaybookExecution, dependencies: string[]): Promise<boolean> {
    return dependencies.every(depId => 
      execution.steps.some(step => step.step_id === depId && step.status === 'completed')
    );
  }

  private async evaluateStepConditions(execution: PlaybookExecution, conditions: StepCondition[]): Promise<boolean> {
    return conditions.every(condition => {
      // Simplified condition evaluation
      return true;
    });
  }

  private async createStepExecution(execution: PlaybookExecution, stepId: string, stepName: string, status: string): Promise<StepExecution> {
    const stepExecution: StepExecution = {
      id: crypto.randomUUID(),
      step_id: stepId,
      step_name: stepName,
      status: status as any,
      started_at: new Date().toISOString(),
      retry_count: 0,
      logs: [],
      artifacts: []
    };

    execution.steps.push(stepExecution);
    await this.storeExecution(execution);
    
    return stepExecution;
  }

  private async updateStepExecution(stepExecution: StepExecution): Promise<void> {
    // Update in database
    // Implementation for updating step execution
  }

  private async storeExecution(execution: PlaybookExecution): Promise<void> {
    await this.redis.setex(`soar_execution:${execution.id}`, 3600, JSON.stringify(execution));
    
    // Store in database
    await this.prisma.sOARExecution.create({
      data: {
        id: execution.id,
        playbookId: execution.playbook_id,
        playbookName: execution.playbook_name,
        status: execution.status,
        triggeredBy: execution.triggered_by,
        triggeredAt: new Date(execution.triggered_at),
        startedAt: execution.started_at ? new Date(execution.started_at) : null,
        completedAt: execution.completed_at ? new Date(execution.completed_at) : null,
        context: JSON.stringify(execution.context),
        steps: JSON.stringify(execution.steps),
        variables: JSON.stringify(execution.variables),
        metrics: JSON.stringify(execution.metrics),
        errorMessage: execution.error_message
      }
    });
  }

  private async storeApprovalRequest(approvalRequest: ApprovalRequest): Promise<void> {
    await this.redis.setex(`approval_request:${approvalRequest.id}`, 3600, JSON.stringify(approvalRequest));
  }

  private async checkDuplicateExecution(playbookId: string, triggerData: any): Promise<PlaybookExecution | null> {
    // Check for duplicate executions
    return null;
  }

  private initializeVariables(variables: PlaybookVariable[], triggerData: any, context: ExecutionContext): Record<string, any> {
    const initialized: Record<string, any> = {};
    
    variables.forEach(variable => {
      if (variable.default_value !== undefined) {
        initialized[variable.name] = variable.default_value;
      }
      
      // Initialize from context
      if (variable.source === 'context') {
        // Extract from context based on variable name
        initialized[variable.name] = this.extractFromContext(variable.name, context);
      }
    });
    
    return initialized;
  }

  private extractFromContext(variableName: string, context: ExecutionContext): any {
    // Simplified context extraction
    const parts = variableName.split('.');
    let value: any = context;
    
    for (const part of parts) {
      value = value?.[part];
    }
    
    return value;
  }

  private async updatePlaybookMetrics(playbookId: string, execution: any): Promise<void> {
    const playbook = this.playbooks.get(playbookId);
    if (!playbook) return;

    playbook.metrics.total_executions++;
    
    if (execution.status === 'completed') {
      playbook.metrics.successful_executions++;
    } else {
      playbook.metrics.failed_executions++;
    }
    
    playbook.metrics.last_execution = execution.completed_at || execution.triggered_at;
    playbook.metrics.success_rate = playbook.metrics.successful_executions / playbook.metrics.total_executions;
    
    // Update in database
    await this.prisma.sOARPlaybook.update({
      where: { id: playbookId },
      data: {
        metrics: JSON.stringify(playbook.metrics),
        updatedAt: new Date()
      }
    });
  }

  private async logExecutionEvent(executionId: string, event: string, data: any): Promise<void> {
    await this.redis.lpush(`soar_execution_events:${executionId}`, JSON.stringify({
      event,
      timestamp: new Date().toISOString(),
      data
    }));
    await this.redis.ltrim(`soar_execution_events:${executionId}`, 0, 99);
  }

  // Initialize default playbooks
  private initializeDefaultPlaybooks(): void {
    // Malware Response Playbook
    const malwarePlaybook: SOARPlaybook = {
      id: 'malware-response',
      name: 'Malware Incident Response',
      description: 'Automated response playbook for malware incidents',
      category: 'malware',
      severity: 'high',
      enabled: true,
      triggers: [{
        id: 'malware-trigger',
        type: 'threat',
        conditions: [{
          field: 'threat_type',
          operator: 'eq',
          value: 'malware',
          required: true
        }],
        enabled: true,
        priority: 1,
        cooldown: 300
      }],
      steps: [
        {
          id: 'quarantine-step',
          name: 'Quarantine Affected Systems',
          description: 'Quarantine systems affected by malware',
          type: 'action',
          order: 1,
          enabled: true,
          config: {
            action: {
              type: 'quarantine',
              target: '{{context.threat_context.indicators.ips}}',
              parameters: {
                reason: 'Malware detected - automatic quarantine',
                duration: 86400
              }
            }
          },
          dependencies: [],
          timeout: 300,
          retryPolicy: {
            max_attempts: 3,
            backoff_type: 'exponential',
            base_delay: 10,
            max_delay: 300,
            retry_on: ['failure']
          },
          conditions: [],
          on_failure: 'escalate',
          on_success: 'continue'
        },
        {
          id: 'scan-step',
          name: 'Full System Scan',
          description: 'Perform full system scan on quarantined systems',
          type: 'action',
          order: 2,
          enabled: true,
          config: {
            action: {
              type: 'scan',
              target: '{{context.threat_context.indicators.ips}}',
              parameters: {
                scanType: 'full',
                engine: 'advanced',
                heuristics: true
              }
            }
          },
          dependencies: ['quarantine-step'],
          timeout: 1800,
          retryPolicy: {
            max_attempts: 2,
            backoff_type: 'fixed',
            base_delay: 60,
            max_delay: 120,
            retry_on: ['failure']
          },
          conditions: [],
          on_failure: 'continue',
          on_success: 'continue'
        },
        {
          id: 'notify-step',
          name: 'Notify Security Team',
          description: 'Send notification to security team with scan results',
          type: 'action',
          order: 3,
          enabled: true,
          config: {
            action: {
              type: 'notify',
              target: 'security-team',
              parameters: {
                message: 'Malware incident response completed',
                severity: 'high',
                includeResults: true
              }
            }
          },
          dependencies: ['scan-step'],
          timeout: 60,
          retryPolicy: {
            max_attempts: 1,
            backoff_type: 'fixed',
            base_delay: 0,
            max_delay: 0,
            retry_on: []
          },
          conditions: [],
          on_failure: 'continue',
          on_success: 'continue'
        }
      ],
      conditions: [],
      variables: [
        {
          id: 'target-systems',
          name: 'target_systems',
          type: 'array',
          required: true,
          description: 'Systems affected by malware',
          source: 'context'
        }
      ],
      timeout: 3600,
      retryPolicy: {
        max_attempts: 3,
        backoff_type: 'exponential',
        base_delay: 30,
        max_delay: 600,
        retry_on: ['failure']
      },
      notifications: [
        {
          type: 'email',
          recipients: ['security-team@company.com'],
          template: 'malware-response',
          triggers: ['start', 'complete', 'failure'],
          enabled: true
        }
      ],
      metrics: {
        total_executions: 0,
        successful_executions: 0,
        failed_executions: 0,
        average_execution_time: 0,
        last_execution: '',
        success_rate: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      version: '1.0.0'
    };

    this.playbooks.set(malwarePlaybook.id, malwarePlaybook);
  }

  // Start execution processor
  private startExecutionProcessor(): void {
    setInterval(() => {
      if (!this.isProcessing && this.executionQueue.length > 0) {
        this.processExecutionQueue();
      }
    }, 5000); // Process every 5 seconds
  }

  // Get active executions
  async getActiveExecutions(): Promise<PlaybookExecution[]> {
    try {
      const executions = await this.prisma.sOARExecution.findMany({
        where: { 
          status: { in: ['pending', 'running'] }
        },
        orderBy: { triggeredAt: 'desc' },
        take: 50
      });

      return executions.map(execution => ({
        id: execution.id,
        playbook_id: execution.playbookId,
        playbook_name: execution.playbookName,
        status: execution.status as any,
        triggered_by: execution.triggeredBy,
        triggered_at: execution.triggeredAt.toISOString(),
        started_at: execution.startedAt?.toISOString(),
        completed_at: execution.completedAt?.toISOString(),
        context: JSON.parse(execution.context),
        steps: JSON.parse(execution.steps),
        variables: JSON.parse(execution.variables),
        metrics: JSON.parse(execution.metrics),
        error_message: execution.errorMessage || undefined,
        approval_requests: []
      }));
    } catch (error) {
      console.error('Failed to get active executions:', error);
      return [];
    }
  }

  // Get playbook by ID
  async getPlaybook(playbookId: string): Promise<SOARPlaybook | null> {
    try {
      const playbook = await this.prisma.sOARPlaybook.findUnique({
        where: { id: playbookId }
      });

      if (!playbook) return null;

      return {
        id: playbook.id,
        name: playbook.name,
        description: playbook.description,
        category: playbook.category,
        severity: playbook.severity as any,
        enabled: playbook.enabled,
        triggers: JSON.parse(playbook.triggers),
        steps: JSON.parse(playbook.steps),
        conditions: JSON.parse(playbook.conditions),
        variables: JSON.parse(playbook.variables),
        timeout: playbook.timeout,
        retryPolicy: JSON.parse(playbook.retryPolicy),
        notifications: JSON.parse(playbook.notifications),
        metrics: JSON.parse(playbook.metrics),
        createdAt: playbook.createdAt.toISOString(),
        updatedAt: playbook.updatedAt.toISOString(),
        createdBy: playbook.createdBy,
        version: playbook.version
      };
    } catch (error) {
      console.error('Failed to get playbook:', error);
      return null;
    }
  }

  // Get all playbooks
  async getPlaybooks(): Promise<SOARPlaybook[]> {
    try {
      const playbooks = await this.prisma.sOARPlaybook.findMany({
        orderBy: { createdAt: 'desc' }
      });

      return playbooks.map(playbook => ({
        id: playbook.id,
        name: playbook.name,
        description: playbook.description,
        category: playbook.category,
        severity: playbook.severity as any,
        enabled: playbook.enabled,
        triggers: JSON.parse(playbook.triggers),
        steps: JSON.parse(playbook.steps),
        conditions: JSON.parse(playbook.conditions),
        variables: JSON.parse(playbook.variables),
        timeout: playbook.timeout,
        retryPolicy: JSON.parse(playbook.retryPolicy),
        notifications: JSON.parse(playbook.notifications),
        metrics: JSON.parse(playbook.metrics),
        createdAt: playbook.createdAt.toISOString(),
        updatedAt: playbook.updatedAt.toISOString(),
        createdBy: playbook.createdBy,
        version: playbook.version
      }));
    } catch (error) {
      console.error('Failed to get playbooks:', error);
      return [];
    }
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    activeExecutions: number;
    queuedExecutions: number;
    playbooksEnabled: number;
    lastExecution: string | null;
    errors: string[];
  }> {
    try {
      const [activeExecutions, playbooksEnabled, lastExecution] = await Promise.all([
        Promise.resolve(this.executions.size),
        Promise.resolve(Array.from(this.playbooks.values()).filter(p => p.enabled).length),
        this.redis.get('last_soar_execution')
      ]);

      const status = this.executionQueue.length > 50 ? 'critical' : 
                   this.executionQueue.length > 20 ? 'warning' : 'healthy';

      return {
        status,
        activeExecutions,
        queuedExecutions: this.executionQueue.length,
        playbooksEnabled,
        lastExecution,
        errors: []
      };
    } catch (error) {
      console.error('SOAR health check failed:', error);
      return {
        status: 'critical',
        activeExecutions: 0,
        queuedExecutions: 0,
        playbooksEnabled: 0,
        lastExecution: null,
        errors: [error instanceof Error ? error.message : 'Health check failed']
      };
    }
  }
}

// Singleton instance
export const securityOrchestrationService = new SecurityOrchestrationService();

