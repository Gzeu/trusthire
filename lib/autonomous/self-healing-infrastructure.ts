// Self-Healing Infrastructure Service
// Autonomous detection and remediation of system issues

import { EventEmitter } from 'events';
import { PrismaClient } from '@prisma/client';
import { getRedisClient } from '@/lib/redis-wrapper';

export interface HealthMetric {
  id: string;
  name: string;
  category: 'cpu' | 'memory' | 'disk' | 'network' | 'service' | 'database' | 'application';
  currentValue: number;
  threshold: {
    warning: number;
    critical: number;
  };
  status: 'healthy' | 'warning' | 'critical';
  trend: 'improving' | 'stable' | 'degrading';
  lastUpdated: string;
  historical: Array<{
    timestamp: string;
    value: number;
    status: string;
  }>;
}

export interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  score: number; // 0-100
  metrics: HealthMetric[];
  issues: HealthIssue[];
  recommendations: HealingRecommendation[];
  lastAssessment: string;
}

export interface HealthIssue {
  id: string;
  type: 'performance' | 'availability' | 'capacity' | 'security' | 'configuration';
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  affectedComponents: string[];
  indicators: HealthIndicator[];
  impact: {
    performance: number; // 0-1
    availability: number; // 0-1
    userExperience: number; // 0-1
  };
  detectedAt: string;
  status: 'new' | 'investigating' | 'resolving' | 'resolved' | 'ignored';
}

export interface HealthIndicator {
  metric: string;
  value: number;
  threshold: number;
  deviation: number;
  confidence: number; // 0-1
}

export interface HealingRecommendation {
  id: string;
  type: 'immediate' | 'scheduled' | 'preventive';
  priority: 'low' | 'medium' | 'high' | 'critical';
  action: HealingAction;
  confidence: number; // 0-1
  estimatedImpact: {
    improvement: number; // 0-1
    risk: number; // 0-1
    duration: number; // seconds
  };
  dependencies: string[];
  rollbackPlan: RollbackPlan;
}

export interface HealingAction {
  type: 'restart' | 'scale' | 'optimize' | 'patch' | 'reconfigure' | 'cleanup' | 'backup' | 'restore';
  target: string;
  parameters: Record<string, any>;
  automation: 'manual' | 'semi' | 'full';
}

export interface RollbackPlan {
  available: boolean;
  steps: RollbackStep[];
  timeToRollback: number;
  successProbability: number; // 0-1
}

export interface RollbackStep {
  action: string;
  target: string;
  parameters: Record<string, any>;
  order: number;
}

export interface HealingActionExecution {
  id: string;
  recommendationId: string;
  action: HealingAction;
  status: 'pending' | 'executing' | 'completed' | 'failed' | 'rolled_back';
  startedAt: string;
  completedAt?: string;
  results: ExecutionResult[];
  errors: string[];
  rollbackTriggered: boolean;
}

export interface ExecutionResult {
  metric: string;
  beforeValue: number;
  afterValue: number;
  improvement: number;
  targetAchieved: boolean;
}

export interface PredictiveHealth {
  predictions: HealthPrediction[];
  modelAccuracy: number; // 0-1
  nextAssessment: string;
  recommendedActions: PredictiveAction[];
}

export interface HealthPrediction {
  metric: string;
  timeframe: string; // e.g., "1h", "24h", "7d"
  predictedValue: number;
  confidence: number; // 0-1
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: PredictionFactor[];
}

export interface PredictionFactor {
  factor: string;
  influence: number; // -1 to 1
  confidence: number; // 0-1
}

export interface PredictiveAction {
  action: HealingAction;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  window: string; // Time window for action
  effectiveness: number; // 0-1
}

export interface ResourceOptimization {
  type: 'cpu' | 'memory' | 'disk' | 'network' | 'cost';
  currentUsage: number;
  optimalUsage: number;
  savings: number;
  recommendations: OptimizationRecommendation[];
}

export interface OptimizationRecommendation {
  action: string;
  target: string;
  expectedSavings: number;
  implementation: {
    complexity: 'low' | 'medium' | 'high';
    duration: number;
    risk: number; // 0-1
  };
}

class SelfHealingInfrastructure extends EventEmitter {
  private prisma: PrismaClient;
  private redis: any;
  private healthMetrics: Map<string, HealthMetric> = new Map();
  private activeIssues: Map<string, HealthIssue> = new Map();
  private healingActions: Map<string, HealingActionExecution> = new Map();
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.prisma = new PrismaClient();
    this.redis = getRedisClient();
    this.initialize();
  }

  // Initialize the self-healing system
  private async initialize(): Promise<void> {
    try {
      await this.loadHealthMetrics();
      await this.loadActiveIssues();
      await this.startHealthMonitoring();
      await this.startPredictiveAnalysis();
      this.emit('initialized');
    } catch (error) {
      console.error('Failed to initialize Self-Healing Infrastructure:', error);
      throw error;
    }
  }

  // Start continuous health monitoring
  async startHealthMonitoring(): Promise<void> {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.performHealthAssessment();
        await this.detectHealthIssues();
        await this.generateHealingRecommendations();
        await this.executeAutomatedHealing();
      } catch (error) {
        console.error('Health monitoring error:', error);
        this.emit('monitoring_error', error);
      }
    }, 30000); // Every 30 seconds

    this.emit('monitoring_started');
  }

  // Stop health monitoring
  async stopHealthMonitoring(): Promise<void> {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    this.emit('monitoring_stopped');
  }

  // Perform comprehensive health assessment
  async performHealthAssessment(): Promise<SystemHealth> {
    try {
      // Collect current metrics
      const currentMetrics = await this.collectHealthMetrics();
      
      // Analyze metrics and detect anomalies
      const analyzedMetrics = await this.analyzeHealthMetrics(currentMetrics);
      
      // Calculate overall health score
      const healthScore = this.calculateHealthScore(analyzedMetrics);
      
      // Detect active issues
      const issues = await this.detectActiveIssues(analyzedMetrics);
      
      // Generate recommendations
      const recommendations = await this.generateRecommendations(issues, analyzedMetrics);
      
      const systemHealth: SystemHealth = {
        overall: this.getOverallStatus(healthScore),
        score: healthScore,
        metrics: analyzedMetrics,
        issues,
        recommendations,
        lastAssessment: new Date().toISOString()
      };

      // Store health assessment
      await this.storeHealthAssessment(systemHealth);
      
      this.emit('health_assessment', systemHealth);
      return systemHealth;
    } catch (error) {
      console.error('Health assessment failed:', error);
      throw error;
    }
  }

  // Collect health metrics from various sources
  private async collectHealthMetrics(): Promise<HealthMetric[]> {
    const metrics: HealthMetric[] = [];

    // CPU metrics
    metrics.push({
      id: 'cpu_usage',
      name: 'CPU Usage',
      category: 'cpu',
      currentValue: await this.getCPUUsage(),
      threshold: { warning: 70, critical: 90 },
      status: 'healthy',
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
      historical: []
    });

    // Memory metrics
    metrics.push({
      id: 'memory_usage',
      name: 'Memory Usage',
      category: 'memory',
      currentValue: await this.getMemoryUsage(),
      threshold: { warning: 80, critical: 95 },
      status: 'healthy',
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
      historical: []
    });

    // Disk metrics
    metrics.push({
      id: 'disk_usage',
      name: 'Disk Usage',
      category: 'disk',
      currentValue: await this.getDiskUsage(),
      threshold: { warning: 80, critical: 95 },
      status: 'healthy',
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
      historical: []
    });

    // Network metrics
    metrics.push({
      id: 'network_latency',
      name: 'Network Latency',
      category: 'network',
      currentValue: await this.getNetworkLatency(),
      threshold: { warning: 100, critical: 500 },
      status: 'healthy',
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
      historical: []
    });

    // Service availability
    metrics.push({
      id: 'service_availability',
      name: 'Service Availability',
      category: 'service',
      currentValue: await this.getServiceAvailability(),
      threshold: { warning: 95, critical: 90 },
      status: 'healthy',
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
      historical: []
    });

    // Database performance
    metrics.push({
      id: 'database_response_time',
      name: 'Database Response Time',
      category: 'database',
      currentValue: await this.getDatabaseResponseTime(),
      threshold: { warning: 200, critical: 1000 },
      status: 'healthy',
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
      historical: []
    });

    // Application response time
    metrics.push({
      id: 'application_response_time',
      name: 'Application Response Time',
      category: 'application',
      currentValue: await this.getApplicationResponseTime(),
      threshold: { warning: 500, critical: 2000 },
      status: 'healthy',
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
      historical: []
    });

    return metrics;
  }

  // Get CPU usage (simulated)
  private async getCPUUsage(): Promise<number> {
    // Simulate CPU usage with some randomness
    return Math.random() * 60 + 20; // 20-80%
  }

  // Get memory usage (simulated)
  private async getMemoryUsage(): Promise<number> {
    // Simulate memory usage
    return Math.random() * 50 + 30; // 30-80%
  }

  // Get disk usage (simulated)
  private async getDiskUsage(): Promise<number> {
    // Simulate disk usage
    return Math.random() * 40 + 40; // 40-80%
  }

  // Get network latency (simulated)
  private async getNetworkLatency(): Promise<number> {
    // Simulate network latency in ms
    return Math.random() * 80 + 20; // 20-100ms
  }

  // Get service availability (simulated)
  private async getServiceAvailability(): Promise<number> {
    // Simulate service availability percentage
    return Math.random() * 5 + 95; // 95-100%
  }

  // Get database response time (simulated)
  private async getDatabaseResponseTime(): Promise<number> {
    // Simulate database response time in ms
    return Math.random() * 150 + 50; // 50-200ms
  }

  // Get application response time (simulated)
  private async getApplicationResponseTime(): Promise<number> {
    // Simulate application response time in ms
    return Math.random() * 300 + 100; // 100-400ms
  }

  // Analyze health metrics and detect anomalies
  private async analyzeHealthMetrics(metrics: HealthMetric[]): Promise<HealthMetric[]> {
    const analyzedMetrics: HealthMetric[] = [];

    for (const metric of metrics) {
      // Update status based on thresholds
      if (metric.currentValue >= metric.threshold.critical) {
        metric.status = 'critical';
      } else if (metric.currentValue >= metric.threshold.warning) {
        metric.status = 'warning';
      } else {
        metric.status = 'healthy';
      }

      // Analyze trend (simplified)
      metric.trend = this.analyzeTrend(metric);

      // Update historical data
      await this.updateMetricHistory(metric);

      analyzedMetrics.push(metric);
      this.healthMetrics.set(metric.id, metric);
    }

    return analyzedMetrics;
  }

  // Analyze metric trend
  private analyzeTrend(metric: HealthMetric): 'improving' | 'stable' | 'degrading' {
    // Simplified trend analysis
    if (metric.historical.length < 2) return 'stable';

    const recent = metric.historical.slice(-5);
    if (recent.length < 2) return 'stable';

    const values = recent.map(h => h.value);
    const avgChange = (values[values.length - 1] - values[0]) / values.length;

    if (avgChange > 5) return 'degrading';
    if (avgChange < -5) return 'improving';
    return 'stable';
  }

  // Update metric historical data
  private async updateMetricHistory(metric: HealthMetric): Promise<void> {
    const historyEntry = {
      timestamp: new Date().toISOString(),
      value: metric.currentValue,
      status: metric.status
    };

    metric.historical.push(historyEntry);

    // Keep only last 24 hours of data (assuming 30-second intervals)
    const maxEntries = (24 * 60 * 60) / 30; // 2880 entries
    if (metric.historical.length > maxEntries) {
      metric.historical = metric.historical.slice(-maxEntries);
    }
  }

  // Calculate overall health score
  private calculateHealthScore(metrics: HealthMetric[]): number {
    if (metrics.length === 0) return 100;

    let totalScore = 0;
    let weightSum = 0;

    const weights: Record<string, number> = {
      'cpu': 0.2,
      'memory': 0.2,
      'disk': 0.15,
      'network': 0.15,
      'service': 0.15,
      'database': 0.1,
      'application': 0.05
    };

    for (const metric of metrics) {
      const weight = weights[metric.category] || 0.1;
      let score = 100;

      if (metric.status === 'critical') {
        score = 30;
      } else if (metric.status === 'warning') {
        score = 60;
      }

      // Factor in trend
      if (metric.trend === 'degrading') score -= 10;
      if (metric.trend === 'improving') score += 5;

      totalScore += score * weight;
      weightSum += weight;
    }

    return Math.round(totalScore / weightSum);
  }

  // Get overall status from health score
  private getOverallStatus(score: number): 'healthy' | 'warning' | 'critical' {
    if (score >= 80) return 'healthy';
    if (score >= 60) return 'warning';
    return 'critical';
  }

  // Detect active health issues
  private async detectActiveIssues(metrics: HealthMetric[]): Promise<HealthIssue[]> {
    const issues: HealthIssue[] = [];

    for (const metric of metrics) {
      if (metric.status === 'warning' || metric.status === 'critical') {
        const issue: HealthIssue = {
          id: crypto.randomUUID(),
          type: this.getIssueType(metric),
          severity: metric.status === 'critical' ? 'critical' : 'high',
          category: metric.category,
          description: this.generateIssueDescription(metric),
          affectedComponents: [metric.name],
          indicators: [{
            metric: metric.name,
            value: metric.currentValue,
            threshold: metric.threshold.warning,
            deviation: ((metric.currentValue - metric.threshold.warning) / metric.threshold.warning) * 100,
            confidence: 0.8
          }],
          impact: this.calculateImpact(metric),
          detectedAt: new Date().toISOString(),
          status: 'new'
        };

        issues.push(issue);
        this.activeIssues.set(issue.id, issue);
      }
    }

    return issues;
  }

  // Get issue type from metric
  private getIssueType(metric: HealthMetric): 'performance' | 'availability' | 'capacity' | 'security' | 'configuration' {
    if (metric.category === 'cpu' || metric.category === 'memory' || metric.category === 'application') {
      return 'performance';
    }
    if (metric.category === 'service' || metric.category === 'network') {
      return 'availability';
    }
    if (metric.category === 'disk') {
      return 'capacity';
    }
    return 'configuration';
  }

  // Generate issue description
  private generateIssueDescription(metric: HealthMetric): string {
    const statusText = metric.status === 'critical' ? 'critically high' : 'elevated';
    return `${metric.name} is ${statusText} at ${metric.currentValue.toFixed(2)} (threshold: ${metric.threshold.warning})`;
  }

  // Calculate impact of health issue
  private calculateImpact(metric: HealthMetric): {
    performance: number;
    availability: number;
    userExperience: number;
  } {
    const severity = metric.status === 'critical' ? 0.8 : 0.4;
    const category = metric.category;

    return {
      performance: (category === 'cpu' || category === 'memory' || category === 'application') ? severity : severity * 0.5,
      availability: (category === 'service' || category === 'network') ? severity : severity * 0.3,
      userExperience: (category === 'application' || category === 'network') ? severity : severity * 0.4
    };
  }

  // Generate healing recommendations
  private async generateRecommendations(issues: HealthIssue[], metrics: HealthMetric[]): Promise<HealingRecommendation[]> {
    const recommendations: HealingRecommendation[] = [];

    for (const issue of issues) {
      const recommendation = await this.generateRecommendationForIssue(issue, metrics);
      if (recommendation) {
        recommendations.push(recommendation);
      }
    }

    // Sort by priority
    recommendations.sort((a, b) => {
      const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    return recommendations;
  }

  // Generate recommendation for specific issue
  private async generateRecommendationForIssue(issue: HealthIssue, metrics: HealthMetric[]): Promise<HealingRecommendation | null> {
    const action = await this.determineHealingAction(issue, metrics);
    if (!action) return null;

    return {
      id: crypto.randomUUID(),
      type: issue.severity === 'critical' ? 'immediate' : 'scheduled',
      priority: issue.severity,
      action,
      confidence: 0.8,
      estimatedImpact: {
        improvement: 0.7,
        risk: 0.2,
        duration: 300 // 5 minutes
      },
      dependencies: [],
      rollbackPlan: {
        available: true,
        steps: this.generateRollbackSteps(action),
        timeToRollback: 60,
        successProbability: 0.9
      }
    };
  }

  // Determine appropriate healing action
  private async determineHealingAction(issue: HealthIssue, metrics: HealthMetric[]): Promise<HealingAction | null> {
    switch (issue.category) {
      case 'cpu':
        if (issue.severity === 'critical') {
          return {
            type: 'scale',
            target: 'compute_resources',
            parameters: { action: 'increase', amount: '50%' },
            automation: 'full'
          };
        }
        return {
          type: 'optimize',
          target: 'cpu_intensive_processes',
          parameters: { priority: 'lower', limit: '80%' },
          automation: 'full'
        };

      case 'memory':
        if (issue.severity === 'critical') {
          return {
            type: 'scale',
            target: 'memory_resources',
            parameters: { action: 'increase', amount: '50%' },
            automation: 'full'
          };
        }
        return {
          type: 'cleanup',
          target: 'memory_cache',
          parameters: { aggressive: true },
          automation: 'full'
        };

      case 'disk':
        return {
          type: 'cleanup',
          target: 'disk_space',
          parameters: { type: 'logs', retention: '7d' },
          automation: 'full'
        };

      case 'service':
        return {
          type: 'restart',
          target: 'affected_services',
          parameters: { graceful: true },
          automation: 'full'
        };

      case 'network':
        return {
          type: 'reconfigure',
          target: 'network_settings',
          parameters: { optimization: 'throughput' },
          automation: 'semi'
        };

      case 'database':
        return {
          type: 'optimize',
          target: 'database_queries',
          parameters: { analyze: true, optimize: true },
          automation: 'semi'
        };

      case 'application':
        return {
          type: 'restart',
          target: 'application_instances',
          parameters: { rolling: true },
          automation: 'full'
        };

      default:
        return null;
    }
  }

  // Generate rollback steps
  private generateRollbackSteps(action: HealingAction): RollbackStep[] {
    const steps: RollbackStep[] = [];

    switch (action.type) {
      case 'scale':
        steps.push({
          action: 'scale_down',
          target: action.target,
          parameters: { amount: action.parameters.amount },
          order: 1
        });
        break;

      case 'restart':
        steps.push({
          action: 'verify_service_health',
          target: action.target,
          parameters: {},
          order: 1
        });
        break;

      case 'reconfigure':
        steps.push({
          action: 'restore_configuration',
          target: action.target,
          parameters: { backup: 'auto' },
          order: 1
        });
        break;

      case 'cleanup':
        steps.push({
          action: 'restore_cleanup',
          target: action.target,
          parameters: { restore: true },
          order: 1
        });
        break;
    }

    return steps;
  }

  // Execute automated healing actions
  private async executeAutomatedHealing(): Promise<void> {
    const recommendations = await this.getAutomatableRecommendations();

    for (const recommendation of recommendations) {
      if (recommendation.confidence >= 0.7 && recommendation.action.automation === 'full') {
        await this.executeHealingAction(recommendation);
      }
    }
  }

  // Get recommendations that can be automated
  private async getAutomatableRecommendations(): Promise<HealingRecommendation[]> {
    // This would typically fetch from database or cache
    // For now, return empty array
    return [];
  }

  // Execute healing action
  private async executeHealingAction(recommendation: HealingRecommendation): Promise<void> {
    const execution: HealingActionExecution = {
      id: crypto.randomUUID(),
      recommendationId: recommendation.id,
      action: recommendation.action,
      status: 'pending',
      startedAt: new Date().toISOString(),
      results: [],
      errors: [],
      rollbackTriggered: false
    };

    try {
      this.healingActions.set(execution.id, execution);
      execution.status = 'executing';

      // Simulate action execution
      await this.simulateActionExecution(execution);

      execution.status = 'completed';
      execution.completedAt = new Date().toISOString();

      this.emit('healing_action_completed', execution);
    } catch (error) {
      execution.status = 'failed';
      execution.errors.push(error instanceof Error ? error.message : 'Unknown error');
      
      // Trigger rollback if available
      if (recommendation.rollbackPlan.available) {
        await this.executeRollback(execution, recommendation.rollbackPlan);
      }

      this.emit('healing_action_failed', execution);
    }
  }

  // Simulate action execution
  private async simulateActionExecution(execution: HealingActionExecution): Promise<void> {
    const duration = Math.random() * 10000 + 5000; // 5-15 seconds
    await new Promise(resolve => setTimeout(resolve, duration));

    // Simulate results
    const beforeValue = Math.random() * 50 + 50;
    const afterValue = Math.random() * 20 + 20;
    const improvement = ((beforeValue - afterValue) / beforeValue) * 100;

    execution.results.push({
      metric: 'performance',
      beforeValue,
      afterValue,
      improvement,
      targetAchieved: improvement > 30
    });
  }

  // Execute rollback
  private async executeRollback(execution: HealingActionExecution, rollbackPlan: RollbackPlan): Promise<void> {
    execution.rollbackTriggered = true;

    try {
      for (const step of rollbackPlan.steps) {
        // Simulate rollback step execution
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      this.emit('rollback_completed', execution);
    } catch (error) {
      execution.errors.push(`Rollback failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      this.emit('rollback_failed', execution);
    }
  }

  // Detect health issues (separate method for continuous monitoring)
  async detectHealthIssues(): Promise<HealthIssue[]> {
    const metrics = Array.from(this.healthMetrics.values());
    return this.detectActiveIssues(metrics);
  }

  // Generate healing recommendations (separate method)
  async generateHealingRecommendations(): Promise<HealingRecommendation[]> {
    const issues = Array.from(this.activeIssues.values());
    const metrics = Array.from(this.healthMetrics.values());
    return this.generateRecommendations(issues, metrics);
  }

  // Start predictive analysis
  private async startPredictiveAnalysis(): Promise<void> {
    setInterval(async () => {
      try {
        const predictions = await this.generatePredictiveHealth();
        this.emit('predictive_health', predictions);
      } catch (error) {
        console.error('Predictive analysis error:', error);
      }
    }, 300000); // Every 5 minutes
  }

  // Generate predictive health analysis
  async generatePredictiveHealth(): Promise<PredictiveHealth> {
    const predictions: HealthPrediction[] = [];
    const metrics = Array.from(this.healthMetrics.values());

    for (const metric of metrics) {
      if (metric.historical.length >= 10) {
        const prediction = this.predictMetricTrend(metric);
        predictions.push(prediction);
      }
    }

    return {
      predictions,
      modelAccuracy: 0.85,
      nextAssessment: new Date(Date.now() + 300000).toISOString(), // 5 minutes from now
      recommendedActions: predictions
        .filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical')
        .map(p => this.generatePredictiveAction(p))
    };
  }

  // Predict metric trend
  private predictMetricTrend(metric: HealthMetric): HealthPrediction {
    const values = metric.historical.slice(-20).map(h => h.value);
    const trend = this.calculateTrend(values);
    const predictedValue = metric.currentValue + (trend * 10); // Predict 10 time units ahead

    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (predictedValue >= metric.threshold.critical) riskLevel = 'critical';
    else if (predictedValue >= metric.threshold.warning) riskLevel = 'high';
    else if (predictedValue >= metric.threshold.warning * 0.8) riskLevel = 'medium';

    return {
      metric: metric.name,
      timeframe: '1h',
      predictedValue,
      confidence: 0.75,
      riskLevel,
      factors: [{
        factor: 'historical_trend',
        influence: trend,
        confidence: 0.8
      }]
    };
  }

  // Calculate trend from values
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    const n = values.length;

    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += values[i];
      sumXY += i * values[i];
      sumX2 += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  }

  // Generate predictive action
  private generatePredictiveAction(prediction: HealthPrediction): PredictiveAction {
    return {
      action: {
        type: 'optimize',
        target: prediction.metric,
        parameters: { preventive: true },
        automation: 'semi'
      },
      urgency: prediction.riskLevel === 'critical' ? 'critical' : 'high',
      window: '1h',
      effectiveness: 0.7
    };
  }

  // Store health assessment
  private async storeHealthAssessment(health: SystemHealth): Promise<void> {
    try {
      // Store in Redis for quick access
      await this.redis.setex('system_health', 300, JSON.stringify(health));

      // Store in database for persistence
      await this.prisma.$executeRaw`
        INSERT INTO SystemHealth (
          overall, score, metrics, issues, recommendations, lastAssessment
        ) VALUES (
          ${health.overall}, ${health.score}, ${JSON.stringify(health.metrics)},
          ${JSON.stringify(health.issues)}, ${JSON.stringify(health.recommendations)},
          ${new Date(health.lastAssessment)}
        )
      `;
    } catch (error) {
      console.warn('Failed to store health assessment:', error);
    }
  }

  // Load health metrics
  private async loadHealthMetrics(): Promise<void> {
    try {
      const cached = await this.redis.get('health_metrics');
      if (cached) {
        const metrics = JSON.parse(cached) as HealthMetric[];
        metrics.forEach(metric => this.healthMetrics.set(metric.id, metric));
      }
    } catch (error) {
      console.warn('Failed to load health metrics:', error);
    }
  }

  // Load active issues
  private async loadActiveIssues(): Promise<void> {
    try {
      const cached = await this.redis.get('active_issues');
      if (cached) {
        const issues = JSON.parse(cached) as HealthIssue[];
        issues.forEach(issue => this.activeIssues.set(issue.id, issue));
      }
    } catch (error) {
      console.warn('Failed to load active issues:', error);
    }
  }

  // Get current system health
  async getCurrentHealth(): Promise<SystemHealth> {
    try {
      const cached = await this.redis.get('system_health');
      if (cached) {
        return JSON.parse(cached) as SystemHealth;
      }
    } catch (error) {
      console.warn('Failed to get cached health:', error);
    }

    // If no cached data, perform new assessment
    return this.performHealthAssessment();
  }

  // Get healing action history
  async getHealingHistory(limit: number = 50): Promise<HealingActionExecution[]> {
    try {
      const actions = await this.prisma.$queryRaw<Array<any>>`
        SELECT * FROM SelfHealingAction 
        ORDER BY startedAt DESC 
        LIMIT ${limit}
      `;

      return actions.map((action: any) => ({
        id: action.id,
        recommendationId: action.recommendationId,
        action: JSON.parse(action.action),
        status: action.status,
        startedAt: action.startedAt,
        completedAt: action.completedAt,
        results: JSON.parse(action.results || '[]'),
        errors: JSON.parse(action.errors || '[]'),
        rollbackTriggered: action.rollbackTriggered
      }));
    } catch (error) {
      console.warn('Failed to get healing history:', error);
      return [];
    }
  }

  // Get resource optimization recommendations
  async getResourceOptimization(): Promise<ResourceOptimization[]> {
    const optimizations: ResourceOptimization[] = [];

    // CPU optimization
    const cpuMetric = this.healthMetrics.get('cpu_usage');
    if (cpuMetric && cpuMetric.currentValue > 50) {
      optimizations.push({
        type: 'cpu',
        currentUsage: cpuMetric.currentValue,
        optimalUsage: 60,
        savings: (cpuMetric.currentValue - 60) * 0.1,
        recommendations: [{
          action: 'optimize_cpu_intensive_processes',
          target: 'cpu_usage',
          expectedSavings: 15,
          implementation: {
            complexity: 'medium',
            duration: 1800,
            risk: 0.2
          }
        }]
      });
    }

    // Memory optimization
    const memoryMetric = this.healthMetrics.get('memory_usage');
    if (memoryMetric && memoryMetric.currentValue > 70) {
      optimizations.push({
        type: 'memory',
        currentUsage: memoryMetric.currentValue,
        optimalUsage: 75,
        savings: (memoryMetric.currentValue - 75) * 0.05,
        recommendations: [{
          action: 'implement_memory_caching',
          target: 'memory_usage',
          expectedSavings: 10,
          implementation: {
            complexity: 'low',
            duration: 900,
            risk: 0.1
          }
        }]
      });
    }

    return optimizations;
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    monitoring: boolean;
    activeIssues: number;
    healingActions: number;
    lastAssessment: string | null;
    errors: string[];
  }> {
    try {
      const health = await this.getCurrentHealth();
      const activeIssues = this.activeIssues.size;
      const healingActions = this.healingActions.size;

      return {
        status: health.overall,
        monitoring: this.isMonitoring,
        activeIssues,
        healingActions,
        lastAssessment: health.lastAssessment,
        errors: []
      };
    } catch (error) {
      return {
        status: 'critical',
        monitoring: false,
        activeIssues: 0,
        healingActions: 0,
        lastAssessment: null,
        errors: [error instanceof Error ? error.message : 'Health check failed']
      };
    }
  }
}

// Singleton instance
export const selfHealingInfrastructure = new SelfHealingInfrastructure();
