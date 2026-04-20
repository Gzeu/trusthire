/**
 * AI Agent Coordination System
 * Manages multiple autonomous agents for complex threat analysis
 */

import { AutonomousAgent } from './autonomous-agent';
import { ThreatPattern, RecruiterProfile, SecurityAnalysis } from '@/types/security';

export interface CoordinationTask {
  id: string;
  type: 'parallel' | 'sequential' | 'hierarchical';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  target: RecruiterProfile | string;
  agents: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  results?: any[];
  errors?: string[];
}

export interface AgentCapability {
  name: string;
  description: string;
  enabled: boolean;
  accuracy: number;
  lastUsed: Date;
  usageCount: number;
  performance: {
    avgResponseTime: number;
    successRate: number;
    errorRate: number;
  };
}

export interface CoordinationResult {
  taskId: string;
  success: boolean;
  results: any[];
  insights: string[];
  recommendations: string[];
  confidence: number;
  processingTime: number;
  agentsInvolved: string[];
  errors?: string[];
}

export class AgentCoordinator {
  private agents: Map<string, AutonomousAgent> = new Map();
  private taskQueue: CoordinationTask[] = [];
  private activeTasks: Map<string, CoordinationTask> = new Map();
  private capabilities: Map<string, AgentCapability> = new Map();

  constructor() {
    this.initializeCapabilities();
  }

  private initializeCapabilities(): void {
    // Define agent capabilities
    const capabilities: AgentCapability[] = [
      {
        name: 'threat_detection',
        description: 'Detect various types of security threats',
        enabled: true,
        accuracy: 0.94,
        lastUsed: new Date(),
        usageCount: 0,
        performance: {
          avgResponseTime: 2.5,
          successRate: 0.95,
          errorRate: 0.05
        }
      },
      {
        name: 'pattern_analysis',
        description: 'Analyze patterns and identify anomalies',
        enabled: true,
        accuracy: 0.91,
        lastUsed: new Date(),
        usageCount: 0,
        performance: {
          avgResponseTime: 3.2,
          successRate: 0.89,
          errorRate: 0.11
        }
      },
      {
        name: 'risk_assessment',
        description: 'Assess risk levels and provide recommendations',
        enabled: true,
        accuracy: 0.88,
        lastUsed: new Date(),
        usageCount: 0,
        performance: {
          avgResponseTime: 1.8,
          successRate: 0.92,
          errorRate: 0.08
        }
      },
      {
        name: 'behavioral_analysis',
        description: 'Analyze user behavior and detect anomalies',
        enabled: true,
        accuracy: 0.86,
        lastUsed: new Date(),
        usageCount: 0,
        performance: {
          avgResponseTime: 4.1,
          successRate: 0.84,
          errorRate: 0.16
        }
      },
      {
        name: 'predictive_analysis',
        description: 'Predict future threats based on patterns',
        enabled: true,
        accuracy: 0.89,
        lastUsed: new Date(),
        usageCount: 0,
        performance: {
          avgResponseTime: 5.3,
          successRate: 0.87,
          errorRate: 0.13
        }
      }
    ];

    capabilities.forEach(cap => {
      this.capabilities.set(cap.name, cap);
    });
  }

  registerAgent(agent: AutonomousAgent): void {
    this.agents.set(agent.getId(), agent);
    console.log(`Agent registered: ${agent.getId()}`);
  }

  unregisterAgent(agentId: string): void {
    this.agents.delete(agentId);
    console.log(`Agent unregistered: ${agentId}`);
  }

  async createTask(
    type: CoordinationTask['type'],
    priority: CoordinationTask['priority'],
    description: string,
    target: RecruiterProfile | string,
    agentCapabilities: string[] = []
  ): Promise<string> {
    const task: CoordinationTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      priority,
      description,
      target,
      agents: this.selectBestAgents(agentCapabilities),
      status: 'pending',
      createdAt: new Date()
    };

    this.taskQueue.push(task);
    this.sortTaskQueue();
    
    // Process queue immediately if high priority
    if (priority === 'critical' || priority === 'high') {
      await this.processTaskQueue();
    }

    return task.id;
  }

  private selectBestAgents(requiredCapabilities: string[]): string[] {
    const availableAgents = Array.from(this.agents.entries())
      .filter(([_, agent]) => agent.getStatus() === 'idle')
      .map(([id, _]) => id);

    // If specific capabilities are required, filter agents accordingly
    if (requiredCapabilities.length > 0) {
      // For now, return all available agents
      // In a real implementation, this would check agent capabilities
      return availableAgents.slice(0, Math.min(3, availableAgents.length));
    }

    // Default: return up to 3 best agents
    return availableAgents.slice(0, Math.min(3, availableAgents.length));
  }

  private sortTaskQueue(): void {
    this.taskQueue.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  async processTaskQueue(): Promise<void> {
    while (this.taskQueue.length > 0 && this.activeTasks.size < 5) {
      const task = this.taskQueue.shift();
      if (!task) break;

      this.activeTasks.set(task.id, task);
      this.executeTask(task);
    }
  }

  private async executeTask(task: CoordinationTask): Promise<void> {
    try {
      task.status = 'running';
      task.startedAt = new Date();

      const results = await this.coordinateAgents(task);
      
      task.status = 'completed';
      task.completedAt = new Date();
      task.results = results;

      // Update agent capabilities
      this.updateAgentPerformance(task.agents, true);

      console.log(`Task completed: ${task.id} in ${Date.now() - task.startedAt.getTime()}ms`);

    } catch (error) {
      task.status = 'failed';
      task.completedAt = new Date();
      task.errors = [error instanceof Error ? error.message : 'Unknown error'];

      // Update agent capabilities
      this.updateAgentPerformance(task.agents, false);

      console.error(`Task failed: ${task.id}`, error);
    } finally {
      this.activeTasks.delete(task.id);
      
      // Process next task in queue
      setTimeout(() => this.processTaskQueue(), 100);
    }
  }

  private async coordinateAgents(task: CoordinationTask): Promise<any[]> {
    const results: any[] = [];
    const agents = task.agents.map(id => this.agents.get(id)).filter(Boolean) as AutonomousAgent[];

    switch (task.type) {
      case 'parallel':
        // Execute all agents in parallel
        const parallelPromises = agents.map(agent => 
          this.executeAgentTask(agent, task)
        );
        const parallelResults = await Promise.allSettled(parallelPromises);
        results.push(...parallelResults.map(r => r.status === 'fulfilled' ? r.value : r.reason));
        break;

      case 'sequential':
        // Execute agents one after another
        for (const agent of agents) {
          try {
            const result = await this.executeAgentTask(agent, task);
            results.push(result);
          } catch (error) {
            results.push({ error: error instanceof Error ? error.message : 'Unknown error' });
          }
        }
        break;

      case 'hierarchical':
        // Execute with primary agent first, then secondary agents
        const primaryAgent = agents[0];
        const secondaryAgents = agents.slice(1);
        
        if (primaryAgent) {
          const primaryResult = await this.executeAgentTask(primaryAgent, task);
          results.push(primaryResult);

          // Secondary agents analyze the primary result
          for (const agent of secondaryAgents) {
            const secondaryResult = await this.executeAgentTask(agent, {
              ...task,
              target: primaryResult
            });
            results.push(secondaryResult);
          }
        }
        break;
    }

    return results;
  }

  private async executeAgentTask(agent: AutonomousAgent, task: CoordinationTask): Promise<any> {
    const startTime = Date.now();
    
    try {
      // Update capability usage
      const capabilities = this.getAgentCapabilities(agent.getId());
      capabilities.forEach(cap => {
        cap.lastUsed = new Date();
        cap.usageCount++;
      });

      // Execute agent task based on target type
      let result;
      if (typeof task.target === 'string') {
        result = await agent.analyzeText(task.target);
      } else {
        result = await agent.analyzeProfile(task.target);
      }

      const processingTime = Date.now() - startTime;
      
      return {
        agentId: agent.getId(),
        result,
        processingTime,
        success: true
      };

    } catch (error) {
      return {
        agentId: agent.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime,
        success: false
      };
    }
  }

  private getAgentCapabilities(agentId: string): AgentCapability[] {
    // Return all capabilities for now
    // In a real implementation, this would return agent-specific capabilities
    return Array.from(this.capabilities.values());
  }

  private updateAgentPerformance(agentIds: string[], success: boolean): void {
    agentIds.forEach(agentId => {
      const capabilities = this.getAgentCapabilities(agentId);
      capabilities.forEach(cap => {
        if (success) {
          cap.performance.successRate = (cap.performance.successRate * 0.9) + (0.1 * 1.0);
          cap.performance.errorRate = cap.performance.errorRate * 0.95;
        } else {
          cap.performance.successRate = cap.performance.successRate * 0.95;
          cap.performance.errorRate = (cap.performance.errorRate * 0.9) + (0.1 * 1.0);
        }
      });
    });
  }

  async getTaskStatus(taskId: string): Promise<CoordinationTask | null> {
    return this.activeTasks.get(taskId) || 
           this.taskQueue.find(t => t.id === taskId) || 
           null;
  }

  async getActiveTasks(): Promise<CoordinationTask[]> {
    return Array.from(this.activeTasks.values());
  }

  async getTaskQueue(): Promise<CoordinationTask[]> {
    return [...this.taskQueue];
  }

  async getAgentCapabilities(): Promise<AgentCapability[]> {
    return Array.from(this.capabilities.values());
  }

  async getCoordinationMetrics(): Promise<any> {
    const completedTasks = Array.from(this.activeTasks.values())
      .filter(t => t.status === 'completed');

    const failedTasks = Array.from(this.activeTasks.values())
      .filter(t => t.status === 'failed');

    const avgProcessingTime = completedTasks.length > 0
      ? completedTasks.reduce((sum, t) => sum + (t.completedAt!.getTime() - t.startedAt!.getTime()), 0) / completedTasks.length
      : 0;

    return {
      totalAgents: this.agents.size,
      activeTasks: this.activeTasks.size,
      queuedTasks: this.taskQueue.length,
      completedTasks: completedTasks.length,
      failedTasks: failedTasks.length,
      successRate: completedTasks.length + failedTasks.length > 0 
        ? completedTasks.length / (completedTasks.length + failedTasks.length)
        : 1,
      averageProcessingTime: avgProcessingTime,
      capabilities: Array.from(this.capabilities.values()),
      agentStatuses: Array.from(this.agents.entries()).map(([id, agent]) => ({
        id,
        status: agent.getStatus(),
        lastActivity: agent.getLastActivity()
      }))
    };
  }

  async optimizeAgentPerformance(): Promise<void> {
    // Analyze performance metrics and suggest optimizations
    const capabilities = Array.from(this.capabilities.values());
    
    capabilities.forEach(cap => {
      if (cap.performance.errorRate > 0.15) {
        console.warn(`Agent capability ${cap.name} has high error rate: ${cap.performance.errorRate}`);
        // Suggest optimization strategies
        if (cap.performance.avgResponseTime > 5) {
          console.log(`Consider optimizing ${cap.name} for faster response time`);
        }
      }
    });
  }

  async shutdown(): Promise<void> {
    // Gracefully shutdown all agents
    const shutdownPromises = Array.from(this.agents.values()).map(agent => 
      agent.shutdown()
    );
    
    await Promise.allSettled(shutdownPromises);
    console.log('Agent coordinator shutdown complete');
  }
}

// Singleton instance
export const agentCoordinator = new AgentCoordinator();
