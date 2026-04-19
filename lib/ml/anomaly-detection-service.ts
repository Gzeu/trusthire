// Anomaly Detection Service
// Advanced anomaly detection system for identifying unusual patterns and threats

import { PrismaClient } from '@prisma/client';
import { getRedisClient } from '@/lib/redis-wrapper';

export interface AnomalyDetection {
  id: string;
  type: 'statistical' | 'behavioral' | 'network' | 'temporal' | 'resource' | 'pattern' | 'correlation' | 'threshold' | 'hybrid';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description: string;
  source: string;
  timestamp: string;
  affectedResources: string[];
  indicators: AnomalyIndicator[];
  context: AnomalyContext;
  recommendations: string[];
  status: 'active' | 'resolved' | 'false_positive';
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface AnomalyIndicator {
  name: string;
  value: number;
  threshold: number;
  deviation: number;
  category: 'metric' | 'behavior' | 'pattern' | 'correlation';
  description: string;
}

export interface AnomalyContext {
  timeWindow: string;
  baseline: BaselineMetrics;
  current: CurrentMetrics;
  comparison: ComparisonMetrics;
  environment: EnvironmentContext;
}

export interface BaselineMetrics {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  percentile95: number;
  percentile99: number;
}

export interface CurrentMetrics {
  value: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  volatility: number;
  momentum: number;
  rank: number;
}

export interface ComparisonMetrics {
  zScore: number;
  iqrScore: number;
  percentile: number;
  anomalyScore: number;
  deviationFactor: number;
}

export interface EnvironmentContext {
  systemLoad: number;
  activeUsers: number;
  recentEvents: number;
  securityLevel: string;
  timeOfDay: string;
  dayOfWeek: string;
}

export interface DetectionRule {
  id: string;
  name: string;
  type: 'threshold' | 'statistical' | 'pattern' | 'correlation' | 'hybrid' | 'behavioral' | 'network' | 'temporal' | 'resource';
  enabled: boolean;
  sensitivity: 'low' | 'medium' | 'high' | 'ultra';
  conditions: RuleCondition[];
  actions: RuleAction[];
  cooldown: number; // seconds
}

export interface RuleCondition {
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'ne' | 'gte' | 'lte' | 'between' | 'not_between';
  value: number | number[];
  weight: number;
}

export interface RuleAction {
  type: 'alert' | 'block' | 'quarantine' | 'escalate' | 'log';
  parameters: Record<string, any>;
  delay: number; // seconds
}

class AnomalyDetectionService {
  private prisma: PrismaClient;
  private redis: any;
  private rules: Map<string, DetectionRule> = new Map();
  private baselines: Map<string, BaselineMetrics> = new Map();

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = getRedisClient();
    this.initializeRules();
    this.startBaselineCollection();
  }

  // Detect anomalies in real-time data
  async detectAnomalies(data: any, source: string): Promise<AnomalyDetection[]> {
    try {
      const anomalies: AnomalyDetection[] = [];

      // Get applicable rules
      const applicableRules = Array.from(this.rules.values()).filter(rule => rule.enabled);

      for (const rule of applicableRules) {
        const detection = await this.evaluateRule(rule, data, source);
        if (detection) {
          anomalies.push(detection);
        }
      }

      // Statistical anomaly detection
      const statisticalAnomalies = await this.detectStatisticalAnomalies(data, source);
      anomalies.push(...statisticalAnomalies);

      // Behavioral anomaly detection
      const behavioralAnomalies = await this.detectBehavioralAnomalies(data, source);
      anomalies.push(...behavioralAnomalies);

      // Pattern anomaly detection
      const patternAnomalies = await this.detectPatternAnomalies(data, source);
      anomalies.push(...patternAnomalies);

      // Store anomalies
      for (const anomaly of anomalies) {
        await this.storeAnomaly(anomaly);
      }

      return anomalies;
    } catch (error) {
      console.error('Anomaly detection failed:', error);
      throw error;
    }
  }

  // Evaluate detection rule
  private async evaluateRule(rule: DetectionRule, data: any, source: string): Promise<AnomalyDetection | null> {
    try {
      let triggered = false;
      let totalScore = 0;
      const triggeredConditions: RuleCondition[] = [];

      for (const condition of rule.conditions) {
        const value = this.extractMetricValue(data, condition.metric);
        const conditionMet = this.evaluateCondition(value, condition);
        
        if (conditionMet) {
          triggered = true;
          totalScore += condition.weight;
          triggeredConditions.push(condition);
        }
      }

      if (!triggered) {
        return null;
      }

      // Calculate confidence
      const confidence = Math.min(1, totalScore / rule.conditions.length);

      // Determine severity
      const severity = this.determineSeverity(confidence, rule.sensitivity);

      // Generate indicators
      const indicators = triggeredConditions.map(condition => ({
        name: condition.metric,
        value: this.extractMetricValue(data, condition.metric),
        threshold: Array.isArray(condition.value) ? condition.value[0] : condition.value,
        deviation: this.calculateDeviation(this.extractMetricValue(data, condition.metric), condition),
        category: 'metric' as const,
        description: `${condition.metric} ${condition.operator} ${condition.value}`
      }));

      // Get context
      const context = await this.getAnomalyContext(rule.type, data);

      // Generate recommendations
      const recommendations = this.generateAnomalyRecommendations(rule, indicators, context);

      return {
        id: crypto.randomUUID(),
        type: rule.type,
        severity,
        confidence,
        description: `Rule "${rule.name}" triggered`,
        source,
        timestamp: new Date().toISOString(),
        affectedResources: this.extractAffectedResources(data),
        indicators,
        context,
        recommendations,
        status: 'active'
      };
    } catch (error) {
      console.error('Rule evaluation failed:', error);
      return null;
    }
  }

  // Detect statistical anomalies
  private async detectStatisticalAnomalies(data: any, source: string): Promise<AnomalyDetection[]> {
    try {
      const anomalies: AnomalyDetection[] = [];
      const metrics = this.extractMetrics(data);

      for (const [metricName, value] of Object.entries(metrics)) {
        if (typeof value !== 'number') continue;

        const baseline = this.baselines.get(metricName);
        if (!baseline) continue;

        const zScore = Math.abs((value - baseline.mean) / baseline.stdDev);
        const iqrScore = this.calculateIQRScore(value, baseline);
        const percentile = this.calculatePercentile(value, baseline);

        // Check if anomaly
        if (zScore > 3 || iqrScore > 1.5 || percentile > 99 || percentile < 1) {
          const anomalyScore = Math.max(zScore, iqrScore, Math.abs(50 - percentile) / 50);
          const confidence = Math.min(1, anomalyScore / 5);

          const indicators: AnomalyIndicator[] = [{
            name: metricName,
            value,
            threshold: baseline.mean + 3 * baseline.stdDev,
            deviation: zScore,
            category: 'metric' as const,
            description: `Statistical anomaly detected in ${metricName}`
          }];

          const context = await this.getAnomalyContext('statistical', data);
          const recommendations = this.generateStatisticalRecommendations(metricName, value, baseline);

          anomalies.push({
            id: crypto.randomUUID(),
            type: 'statistical',
            severity: this.determineSeverity(confidence, 'medium'),
            confidence,
            description: `Statistical anomaly in ${metricName}`,
            source,
            timestamp: new Date().toISOString(),
            affectedResources: this.extractAffectedResources(data),
            indicators,
            context,
            recommendations,
            status: 'active'
          });
        }
      }

      return anomalies;
    } catch (error) {
      console.error('Statistical anomaly detection failed:', error);
      return [];
    }
  }

  // Detect behavioral anomalies
  private async detectBehavioralAnomalies(data: any, source: string): Promise<AnomalyDetection[]> {
    try {
      const anomalies: AnomalyDetection[] = [];

      // Check for unusual user behavior
      if (data.userId && data.action) {
        const behaviorKey = `user_behavior:${data.userId}`;
        const recentBehavior = await this.redis.lrange(behaviorKey, 0, 99);
        
        // Analyze action frequency
        const recentActions = recentBehavior.filter((item: string) => {
          const parsed = JSON.parse(item);
          return parsed.action === data.action;
        });

        const actionFrequency = recentActions.length;
        const avgFrequency = recentBehavior.length / 10; // Assume 10 different actions

        if (actionFrequency > avgFrequency * 3) { // 3x more frequent than average
          const confidence = Math.min(1, actionFrequency / (avgFrequency * 5));
          
          anomalies.push({
            id: crypto.randomUUID(),
            type: 'behavioral',
            severity: this.determineSeverity(confidence, 'medium'),
            confidence,
            description: `Unusual frequency of action "${data.action}" for user ${data.userId}`,
            source,
            timestamp: new Date().toISOString(),
            affectedResources: [`user:${data.userId}`],
            indicators: [{
              name: 'action_frequency',
              value: actionFrequency,
              threshold: avgFrequency * 3,
              deviation: (actionFrequency - avgFrequency) / avgFrequency,
              category: 'behavior' as const,
              description: `Action frequency: ${actionFrequency} (avg: ${avgFrequency.toFixed(2)})`
            }],
            context: await this.getAnomalyContext('behavioral', data),
            recommendations: [
              'Monitor user activity for potential compromise',
              'Consider temporary account restrictions',
              'Review recent login attempts and IP addresses'
            ],
            status: 'active'
          });
        }

        // Store current behavior
        await this.redis.lpush(behaviorKey, JSON.stringify({
          action: data.action,
          timestamp: new Date().toISOString(),
          source
        }));
        await this.redis.ltrim(behaviorKey, 0, 999); // Keep last 1000 actions
      }

      return anomalies;
    } catch (error) {
      console.error('Behavioral anomaly detection failed:', error);
      return [];
    }
  }

  // Detect pattern anomalies
  private async detectPatternAnomalies(data: any, source: string): Promise<AnomalyDetection[]> {
    try {
      const anomalies: AnomalyDetection[] = [];

      // Check for unusual patterns in time series data
      if (data.timestamp && data.value) {
        const patternKey = `pattern:${source}`;
        const recentData = await this.redis.lrange(patternKey, 0, 49); // Last 50 data points

        if (recentData.length >= 10) {
          const values = recentData.map((item: string) => JSON.parse(item).value);
          const pattern = this.detectPatternBreak(values, data.value);

          if (pattern.isAnomalous) {
            const confidence = pattern.confidence;
            
            anomalies.push({
              id: crypto.randomUUID(),
              type: 'temporal',
              severity: this.determineSeverity(confidence, 'medium'),
              confidence,
              description: `Pattern anomaly detected in ${source}`,
              source,
              timestamp: new Date().toISOString(),
              affectedResources: [source],
              indicators: [{
                name: 'pattern_deviation',
                value: pattern.deviation,
                threshold: 2.0,
                deviation: pattern.deviation / 2.0,
                category: 'pattern' as const,
                description: `Pattern deviation: ${pattern.deviation.toFixed(2)}`
              }],
              context: await this.getAnomalyContext('temporal', data),
              recommendations: [
                'Investigate recent changes in system behavior',
                'Check for potential external influences',
                'Monitor for continued pattern deviations'
              ],
              status: 'active'
            });
          }
        }

        // Store current data point
        await this.redis.lpush(patternKey, JSON.stringify({
          value: data.value,
          timestamp: data.timestamp
        }));
        await this.redis.ltrim(patternKey, 0, 999);
      }

      return anomalies;
    } catch (error) {
      console.error('Pattern anomaly detection failed:', error);
      return [];
    }
  }

  // Pattern detection
  private detectPatternBreak(historicalValues: number[], currentValue: number): {
    isAnomalous: boolean;
    deviation: number;
    confidence: number;
  } {
    const mean = historicalValues.reduce((sum, val) => sum + val, 0) / historicalValues.length;
    const stdDev = Math.sqrt(historicalValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / historicalValues.length);
    
    const deviation = Math.abs(currentValue - mean) / stdDev;
    const isAnomalous = deviation > 2.5; // 2.5 standard deviations
    const confidence = Math.min(1, deviation / 5);

    return { isAnomalous, deviation, confidence };
  }

  // Get anomaly context
  private async getAnomalyContext(type: string, data: any): Promise<AnomalyContext> {
    try {
      const now = new Date();
      const hour = now.getHours();
      const dayOfWeek = now.getDay();

      // Get current system metrics
      const systemLoad = await this.getCurrentSystemLoad();
      const activeUsers = await this.getActiveUserCount();
      const recentEvents = await this.getRecentEventCount();

      const environment: EnvironmentContext = {
        systemLoad,
        activeUsers,
        recentEvents,
        securityLevel: this.getCurrentSecurityLevel(),
        timeOfDay: `${hour}:00`,
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]
      };

      // Calculate baseline and current metrics
      const baseline = await this.calculateBaseline(type, data);
      const current = await this.calculateCurrentMetrics(data);
      const comparison = this.calculateComparison(baseline, current);

      return {
        timeWindow: '1h',
        baseline,
        current,
        comparison,
        environment
      };
    } catch (error) {
      console.error('Failed to get anomaly context:', error);
      throw error;
    }
  }

  // Helper methods
  private extractMetricValue(data: any, metric: string): number {
    const keys = metric.split('.');
    let value = data;
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    return typeof value === 'number' ? value : 0;
  }

  private evaluateCondition(value: number, condition: RuleCondition): boolean {
    switch (condition.operator) {
      case 'gt': return value > (Array.isArray(condition.value) ? condition.value[0] : condition.value);
      case 'lt': return value < (Array.isArray(condition.value) ? condition.value[0] : condition.value);
      case 'eq': return value === (Array.isArray(condition.value) ? condition.value[0] : condition.value);
      case 'ne': return value !== (Array.isArray(condition.value) ? condition.value[0] : condition.value);
      case 'gte': return value >= (Array.isArray(condition.value) ? condition.value[0] : condition.value);
      case 'lte': return value <= (Array.isArray(condition.value) ? condition.value[0] : condition.value);
      case 'between':
        return Array.isArray(condition.value) && 
               value >= condition.value[0] && 
               value <= condition.value[1];
      case 'not_between':
        return Array.isArray(condition.value) && 
               (value < condition.value[0] || value > condition.value[1]);
      default:
        return false;
    }
  }

  private calculateDeviation(value: number, condition: RuleCondition): number {
    const threshold = Array.isArray(condition.value) ? condition.value[0] : condition.value;
    return threshold !== 0 ? Math.abs(value - threshold) / Math.abs(threshold) : 0;
  }

  private determineSeverity(confidence: number, sensitivity: string): 'low' | 'medium' | 'high' | 'critical' {
    const sensitivityMultiplier = {
      'low': 0.7,
      'medium': 1.0,
      'high': 1.3,
      'ultra': 1.6
    }[sensitivity] || 1.0;

    const adjustedConfidence = confidence * sensitivityMultiplier;

    if (adjustedConfidence >= 0.9) return 'critical';
    if (adjustedConfidence >= 0.7) return 'high';
    if (adjustedConfidence >= 0.5) return 'medium';
    return 'low';
  }

  private extractMetrics(data: any): Record<string, number> {
    const metrics: Record<string, number> = {};

    // Extract common metrics
    if (typeof data.responseTime === 'number') metrics.responseTime = data.responseTime;
    if (typeof data.errorRate === 'number') metrics.errorRate = data.errorRate;
    if (typeof data.requestCount === 'number') metrics.requestCount = data.requestCount;
    if (typeof data.cpuUsage === 'number') metrics.cpuUsage = data.cpuUsage;
    if (typeof data.memoryUsage === 'number') metrics.memoryUsage = data.memoryUsage;
    if (typeof data.networkTraffic === 'number') metrics.networkTraffic = data.networkTraffic;

    return metrics;
  }

  private extractAffectedResources(data: any): string[] {
    const resources: string[] = [];

    if (data.userId) resources.push(`user:${data.userId}`);
    if (data.sessionId) resources.push(`session:${data.sessionId}`);
    if (data.ipAddress) resources.push(`ip:${data.ipAddress}`);
    if (data.resourceId) resources.push(`resource:${data.resourceId}`);
    if (data.service) resources.push(`service:${data.service}`);

    return resources;
  }

  private calculateIQRScore(value: number, baseline: BaselineMetrics): number {
    const q1 = baseline.percentile95 * 0.5; // Simplified
    const q3 = baseline.percentile95;
    const iqr = q3 - q1;
    
    if (value < q1 - 1.5 * iqr || value > q3 + 1.5 * iqr) {
      return Math.abs(value - baseline.mean) / iqr;
    }
    
    return 0;
  }

  private calculatePercentile(value: number, baseline: BaselineMetrics): number {
    // Simplified percentile calculation
    if (value <= baseline.min) return 0;
    if (value >= baseline.max) return 100;
    
    return ((value - baseline.min) / (baseline.max - baseline.min)) * 100;
  }

  private generateAnomalyRecommendations(rule: DetectionRule, indicators: AnomalyIndicator[], context: AnomalyContext): string[] {
    const recommendations: string[] = [];

    // Rule-based recommendations
    rule.actions.forEach(action => {
      switch (action.type) {
        case 'alert':
          recommendations.push('Immediate alert sent to security team');
          break;
        case 'escalate':
          recommendations.push('Escalated to senior security personnel');
          break;
        case 'block':
          recommendations.push('Automatic blocking measures applied');
          break;
      }
    });

    // Indicator-based recommendations
    const highDeviationIndicators = indicators.filter(i => i.deviation > 2);
    if (highDeviationIndicators.length > 0) {
      recommendations.push(`Investigate high deviation indicators: ${highDeviationIndicators.map(i => i.name).join(', ')}`);
    }

    // Context-based recommendations
    if (context.environment.systemLoad > 0.8) {
      recommendations.push('High system load detected - consider scaling resources');
    }

    if (context.environment.recentEvents > 100) {
      recommendations.push('High event volume - investigate potential attack');
    }

    return recommendations;
  }

  private generateStatisticalRecommendations(metricName: string, value: number, baseline: BaselineMetrics): string[] {
    const recommendations: string[] = [];

    if (value > baseline.mean + 3 * baseline.stdDev) {
      recommendations.push(`Unusually high ${metricName} detected - investigate potential cause`);
    } else if (value < baseline.mean - 3 * baseline.stdDev) {
      recommendations.push(`Unusually low ${metricName} detected - check for service issues`);
    }

    recommendations.push(`Monitor ${metricName} for continued anomalies`);
    recommendations.push('Review recent system changes that might affect this metric');

    return recommendations;
  }

  // Initialize default rules
  private initializeRules(): void {
    // High error rate rule
    this.rules.set('high_error_rate', {
      id: 'high_error_rate',
      name: 'High Error Rate Detection',
      type: 'threshold',
      enabled: true,
      sensitivity: 'medium',
      conditions: [{
        metric: 'errorRate',
        operator: 'gt',
        value: 0.05,
        weight: 1.0
      }],
      actions: [{
        type: 'alert',
        parameters: { level: 'warning' },
        delay: 0
      }],
      cooldown: 300
    });

    // High response time rule
    this.rules.set('high_response_time', {
      id: 'high_response_time',
      name: 'High Response Time Detection',
      type: 'threshold',
      enabled: true,
      sensitivity: 'medium',
      conditions: [{
        metric: 'responseTime',
        operator: 'gt',
        value: 5000,
        weight: 1.0
      }],
      actions: [{
        type: 'alert',
        parameters: { level: 'warning' },
        delay: 0
      }],
      cooldown: 300
    });

    // Unusual login pattern rule
    this.rules.set('unusual_login', {
      id: 'unusual_login',
      name: 'Unusual Login Pattern',
      type: 'behavioral',
      enabled: true,
      sensitivity: 'high',
      conditions: [{
        metric: 'loginAttempts',
        operator: 'gt',
        value: 10,
        weight: 0.7
      }, {
        metric: 'failedLogins',
        operator: 'gt',
        value: 5,
        weight: 0.3
      }],
      actions: [{
        type: 'escalate',
        parameters: { level: 'security' },
        delay: 60
      }],
      cooldown: 600
    });
  }

  // Start baseline collection
  private startBaselineCollection(): void {
    setInterval(async () => {
      try {
        await this.updateBaselines();
      } catch (error) {
        console.error('Baseline update failed:', error);
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  // Update baselines
  private async updateBaselines(): Promise<void> {
    try {
      const metrics = ['responseTime', 'errorRate', 'requestCount', 'cpuUsage', 'memoryUsage'];

      for (const metric of metrics) {
        const data = await this.getRecentMetricData(metric, 1000); // Last 1000 data points
        if (data.length > 0) {
          const baseline = this.calculateBaselineMetrics(data);
          this.baselines.set(metric, baseline);
        }
      }
    } catch (error) {
      console.error('Failed to update baselines:', error);
    }
  }

  // Calculate baseline metrics
  private calculateBaselineMetrics(data: number[]): BaselineMetrics {
    const sorted = [...data].sort((a, b) => a - b);
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);

    return {
      mean,
      median,
      stdDev,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      percentile95: sorted[Math.floor(sorted.length * 0.95)],
      percentile99: sorted[Math.floor(sorted.length * 0.99)]
    };
  }

  // Placeholder methods (would be implemented with actual data sources)
  private async getCurrentSystemLoad(): Promise<number> {
    return 0.5; // Placeholder
  }

  private async getActiveUserCount(): Promise<number> {
    return 100; // Placeholder
  }

  private async getRecentEventCount(): Promise<number> {
    return 50; // Placeholder
  }

  private getCurrentSecurityLevel(): string {
    return 'normal';
  }

  private async calculateBaseline(type: string, data: any): Promise<BaselineMetrics> {
    return {
      mean: 100,
      median: 95,
      stdDev: 20,
      min: 50,
      max: 200,
      percentile95: 150,
      percentile99: 180
    };
  }

  private async calculateCurrentMetrics(data: any): Promise<CurrentMetrics> {
    return {
      value: 120,
      trend: 'increasing',
      volatility: 0.3,
      momentum: 0.1,
      rank: 75
    };
  }

  private calculateComparison(baseline: BaselineMetrics, current: CurrentMetrics): ComparisonMetrics {
    const zScore = (current.value - baseline.mean) / baseline.stdDev;
    return {
      zScore,
      iqrScore: 1.5,
      percentile: 75,
      anomalyScore: Math.abs(zScore),
      deviationFactor: Math.abs(current.value - baseline.mean) / baseline.mean
    };
  }

  private async getRecentMetricData(metric: string, limit: number): Promise<number[]> {
    // Placeholder implementation
    return Array.from({ length: limit }, (_, i) => 100 + Math.random() * 50);
  }

  // Store anomaly
  private async storeAnomaly(anomaly: any): Promise<void> {
    try {
      // Store in Redis for quick access
      await this.redis.setex(`anomaly:${anomaly.id}`, 3600, JSON.stringify(anomaly));
      
      // Store in database for persistence
      await this.prisma.anomalyDetection.create({
        data: {
          id: anomaly.id,
          type: anomaly.type,
          severity: anomaly.severity,
          confidence: anomaly.confidence,
          description: anomaly.description,
          source: anomaly.source,
          timestamp: new Date(anomaly.timestamp),
          affectedResources: JSON.stringify(anomaly.affectedResources),
          indicators: JSON.stringify(anomaly.indicators),
          context: JSON.stringify(anomaly.context),
          recommendations: JSON.stringify(anomaly.recommendations),
          status: anomaly.status
        }
      });
    } catch (error) {
      console.error('Failed to store anomaly:', error);
    }
  }

  // Get active anomalies
  async getActiveAnomalies(): Promise<AnomalyDetection[]> {
    try {
      const anomalies = await this.prisma.anomalyDetection.findMany({
        where: { status: 'active' },
        orderBy: { timestamp: 'desc' },
        take: 100
      });

      return anomalies.map(anomaly => ({
        id: anomaly.id,
        type: anomaly.type as any,
        severity: anomaly.severity as any,
        confidence: anomaly.confidence,
        description: anomaly.description,
        source: anomaly.source,
        timestamp: anomaly.timestamp.toISOString(),
        affectedResources: JSON.parse(anomaly.affectedResources),
        indicators: JSON.parse(anomaly.indicators),
        context: JSON.parse(anomaly.context),
        recommendations: JSON.parse(anomaly.recommendations),
        status: anomaly.status as any,
        resolvedAt: anomaly.resolvedAt?.toISOString(),
        resolvedBy: anomaly.resolvedBy || undefined
      }));
    } catch (error) {
      console.error('Failed to get active anomalies:', error);
      return [];
    }
  }

  // Resolve anomaly
  async resolveAnomaly(anomalyId: string, resolvedBy: string): Promise<void> {
    try {
      await this.prisma.anomalyDetection.update({
        where: { id: anomalyId },
        data: {
          status: 'resolved',
          resolvedAt: new Date(),
          resolvedBy
        }
      });

      await this.redis.del(`anomaly:${anomalyId}`);
    } catch (error) {
      console.error('Failed to resolve anomaly:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    activeAnomalies: number;
    rulesEnabled: number;
    baselinesAvailable: number;
    lastDetection: string | null;
    errors: string[];
  }> {
    try {
      const [activeAnomalies, rulesEnabled, baselinesAvailable, lastDetection] = await Promise.all([
        this.prisma.anomalyDetection.count({ where: { status: 'active' } }),
        Promise.resolve(Array.from(this.rules.values()).filter(r => r.enabled).length),
        Promise.resolve(this.baselines.size),
        this.redis.get('last_anomaly_timestamp')
      ]);

      const status = activeAnomalies > 50 ? 'critical' : activeAnomalies > 20 ? 'warning' : 'healthy';

      return {
        status,
        activeAnomalies,
        rulesEnabled,
        baselinesAvailable,
        lastDetection,
        errors: []
      };
    } catch (error) {
      console.error('Anomaly detection health check failed:', error);
      return {
        status: 'critical',
        activeAnomalies: 0,
        rulesEnabled: 0,
        baselinesAvailable: 0,
        lastDetection: null,
        errors: [error instanceof Error ? error.message : 'Health check failed']
      };
    }
  }
}

// Singleton instance
export const anomalyDetectionService = new AnomalyDetectionService();

