// Threat Prediction Service
// Advanced threat prediction system with time series analysis and forecasting

import { PrismaClient } from '@prisma/client';
import { getRedisClient } from '@/lib/redis-wrapper';

export interface ThreatPrediction {
  id: string;
  threatType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  timeframe: string;
  probability: number;
  factors: PredictionFactor[];
  recommendations: string[];
  createdAt: string;
  expiresAt: string;
  metadata: Record<string, any>;
}

export interface PredictionFactor {
  name: string;
  weight: number;
  value: number;
  description: string;
  category: 'historical' | 'environmental' | 'behavioral' | 'technical';
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  category: string;
  metadata?: Record<string, any>;
}

export interface PredictionModel {
  id: string;
  name: string;
  type: 'trend' | 'seasonal' | 'anomaly' | 'classification';
  algorithm: 'linear_regression' | 'arima' | 'lstm' | 'random_forest' | 'gradient_boosting';
  accuracy: number;
  lastTrained: string;
  features: string[];
  hyperparameters: Record<string, any>;
}

export interface PredictionRequest {
  threatType?: string;
  timeframe: '1h' | '6h' | '24h' | '7d' | '30d' | '90d';
  confidence: number;
  includeFactors: boolean;
  includeRecommendations: boolean;
  historicalData?: boolean;
}

class ThreatPredictionService {
  private prisma: PrismaClient;
  private redis: any;
  private models: Map<string, PredictionModel> = new Map();

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = getRedisClient();
    this.initializeModels();
  }

  // Predict threat probability
  async predictThreat(request: PredictionRequest): Promise<ThreatPrediction[]> {
    try {
      const cacheKey = `threat_prediction:${JSON.stringify(request)}`;
      const cached = await this.redis.get(cacheKey);
      
      if (cached) {
        return JSON.parse(cached);
      }

      // Get historical data
      const historicalData = await this.getHistoricalData(request.timeframe, request.threatType);
      
      // Generate predictions
      const predictions: ThreatPrediction[] = [];

      // Predict for each threat type or specific type
      const threatTypes = request.threatType ? [request.threatType] : [
        'malware', 'phishing', 'ransomware', 'apt', 'data_breach', 'ddos', 'social_engineering'
      ];

      for (const threatType of threatTypes) {
        const prediction = await this.predictSingleThreat(
          threatType, 
          request.timeframe, 
          historicalData.filter(d => d.category === threatType),
          request.confidence,
          request.includeFactors,
          request.includeRecommendations
        );
        
        if (prediction) {
          predictions.push(prediction);
        }
      }

      // Cache results
      await this.redis.setex(cacheKey, 300, JSON.stringify(predictions)); // 5 minutes

      return predictions;
    } catch (error) {
      console.error('Threat prediction failed:', error);
      throw error;
    }
  }

  // Predict single threat
  private async predictSingleThreat(
    threatType: string,
    timeframe: string,
    historicalData: TimeSeriesData[],
    confidence: number,
    includeFactors: boolean,
    includeRecommendations: boolean
  ): Promise<ThreatPrediction> {
    try {
      // Time series analysis
      const timeSeriesAnalysis = this.analyzeTimeSeries(historicalData);
      
      // Calculate base probability
      const baseProbability = this.calculateBaseProbability(timeSeriesAnalysis);
      
      // Apply confidence adjustment
      const adjustedProbability = this.adjustForConfidence(baseProbability, confidence);
      
      // Determine severity
      const severity = this.determineSeverity(adjustedProbability, timeSeriesAnalysis);
      
      // Generate factors
      const factors = includeFactors ? this.generatePredictionFactors(
        threatType, 
        timeSeriesAnalysis, 
        historicalData
      ) : [];

      // Generate recommendations
      const recommendations = includeRecommendations ? 
        this.generateRecommendations(threatType, severity, factors) : [];

      // Calculate expiry
      const expiresAt = this.calculateExpiry(timeframe);

      return {
        id: crypto.randomUUID(),
        threatType,
        severity,
        confidence,
        timeframe,
        probability: adjustedProbability,
        factors,
        recommendations,
        createdAt: new Date().toISOString(),
        expiresAt,
        metadata: {
          timeSeriesAnalysis,
          baseProbability,
          historicalDataPoints: historicalData.length
        }
      };
    } catch (error) {
      console.error('Single threat prediction failed:', error);
      throw error;
    }
  }

  // Analyze time series data
  private analyzeTimeSeries(data: TimeSeriesData[]): any {
    if (data.length < 2) {
      return {
        trend: 'insufficient_data',
        volatility: 0,
        seasonality: 0,
        momentum: 0,
        avgValue: 0,
        stdDev: 0
      };
    }

    const values = data.map(d => d.value);
    const timestamps = data.map(d => new Date(d.timestamp).getTime());

    // Basic statistics
    const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avgValue, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    // Trend analysis (simple linear regression)
    const n = values.length;
    const xMean = timestamps.reduce((sum, ts) => sum + ts, 0) / n;
    const yMean = avgValue;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (timestamps[i] - xMean) * (values[i] - yMean);
      denominator += Math.pow(timestamps[i] - xMean, 2);
    }
    
    const slope = denominator !== 0 ? numerator / denominator : 0;
    const trend = slope > 0.01 ? 'increasing' : slope < -0.01 ? 'decreasing' : 'stable';
    
    // Volatility
    const volatility = stdDev / avgValue;
    
    // Momentum (recent vs older comparison)
    const recentPeriod = Math.min(7, Math.floor(n / 4));
    const recentAvg = values.slice(-recentPeriod).reduce((sum, val) => sum + val, 0) / recentPeriod;
    const olderAvg = values.slice(0, recentPeriod).reduce((sum, val) => sum + val, 0) / recentPeriod;
    const momentum = (recentAvg - olderAvg) / olderAvg;

    return {
      trend,
      volatility,
      seasonality: 0, // Simplified - would need more complex analysis
      momentum,
      avgValue,
      stdDev
    };
  }

  // Calculate base probability
  private calculateBaseProbability(analysis: any): number {
    let probability = 0.1; // Base probability

    // Trend factor
    if (analysis.trend === 'increasing') {
      probability += 0.3;
    } else if (analysis.trend === 'decreasing') {
      probability -= 0.2;
    }

    // Volatility factor
    probability += analysis.volatility * 0.2;

    // Momentum factor
    probability += Math.max(-0.2, Math.min(0.2, analysis.momentum));

    // Average value factor (normalized)
    if (analysis.avgValue > 0) {
      probability += Math.min(0.3, analysis.avgValue / 100);
    }

    return Math.max(0.05, Math.min(0.95, probability));
  }

  // Adjust for confidence
  private adjustForConfidence(probability: number, confidence: number): number {
    const confidenceFactor = confidence / 100;
    return probability * (0.5 + confidenceFactor * 0.5);
  }

  // Determine severity
  private determineSeverity(probability: number, analysis: any): 'low' | 'medium' | 'high' | 'critical' {
    if (probability >= 0.8) return 'critical';
    if (probability >= 0.6) return 'high';
    if (probability >= 0.4) return 'medium';
    return 'low';
  }

  // Generate prediction factors
  private generatePredictionFactors(
    threatType: string,
    analysis: any,
    historicalData: TimeSeriesData[]
  ): PredictionFactor[] {
    const factors: PredictionFactor[] = [];

    // Historical trend factor
    factors.push({
      name: 'Historical Trend',
      weight: 0.3,
      value: analysis.trend === 'increasing' ? 0.8 : analysis.trend === 'decreasing' ? 0.2 : 0.5,
      description: `Recent trend is ${analysis.trend}`,
      category: 'historical'
    });

    // Volatility factor
    factors.push({
      name: 'Volatility',
      weight: 0.2,
      value: Math.min(1, analysis.volatility * 2),
      description: `Volatility index: ${analysis.volatility.toFixed(2)}`,
      category: 'historical'
    });

    // Momentum factor
    factors.push({
      name: 'Momentum',
      weight: 0.2,
      value: analysis.momentum > 0 ? 0.7 : 0.3,
      description: `Momentum indicator: ${analysis.momentum.toFixed(2)}`,
      category: 'behavioral'
    });

    // Data availability factor
    factors.push({
      name: 'Data Availability',
      weight: 0.15,
      value: Math.min(1, historicalData.length / 30),
      description: `${historicalData.length} data points available`,
      category: 'environmental'
    });

    // Time-based factor
    const currentHour = new Date().getHours();
    const isBusinessHours = currentHour >= 9 && currentHour <= 17;
    
    factors.push({
      name: 'Time Factor',
      weight: 0.15,
      value: isBusinessHours ? 0.6 : 0.4,
      description: isBusinessHours ? 'Business hours' : 'Off hours',
      category: 'environmental'
    });

    return factors;
  }

  // Generate recommendations
  private generateRecommendations(
    threatType: string,
    severity: string,
    factors: PredictionFactor[]
  ): string[] {
    const recommendations: string[] = [];

    // Severity-based recommendations
    if (severity === 'critical') {
      recommendations.push('Immediate action required - high threat probability');
      recommendations.push('Enable all security measures and monitoring');
      recommendations.push('Consider temporary service disruption for mitigation');
    } else if (severity === 'high') {
      recommendations.push('Increased monitoring recommended');
      recommendations.push('Review and update security policies');
      recommendations.push('Prepare incident response plan');
    } else if (severity === 'medium') {
      recommendations.push('Continue monitoring for changes');
      recommendations.push('Review security configurations');
    } else {
      recommendations.push('Maintain standard security posture');
    }

    // Factor-based recommendations
    const highRiskFactors = factors.filter(f => f.value > 0.7);
    if (highRiskFactors.length > 0) {
      recommendations.push(`Address high-risk factors: ${highRiskFactors.map(f => f.name).join(', ')}`);
    }

    // Threat type-specific recommendations
    switch (threatType) {
      case 'malware':
        recommendations.push('Update antivirus signatures');
        recommendations.push('Scan systems for malware indicators');
        break;
      case 'phishing':
        recommendations.push('Enhance email filtering');
        recommendations.push('Educate users on phishing awareness');
        break;
      case 'ransomware':
        recommendations.push('Backup critical data');
        recommendations.push('Test restore procedures');
        break;
      case 'ddos':
        recommendations.push('Review DDoS protection measures');
        recommendations.push('Prepare traffic surge response');
        break;
    }

    return recommendations;
  }

  // Calculate expiry time
  private calculateExpiry(timeframe: string): string {
    const now = new Date();
    let expiry: Date;

    switch (timeframe) {
      case '1h':
        expiry = new Date(now.getTime() + 60 * 60 * 1000);
        break;
      case '6h':
        expiry = new Date(now.getTime() + 6 * 60 * 60 * 1000);
        break;
      case '24h':
        expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;
      case '7d':
        expiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        expiry = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }

    return expiry.toISOString();
  }

  // Get historical data
  private async getHistoricalData(timeframe: string, threatType?: string): Promise<TimeSeriesData[]> {
    try {
      const now = new Date();
      let dateFrom: Date;

      switch (timeframe) {
        case '1h':
          dateFrom = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case '6h':
          dateFrom = new Date(now.getTime() - 6 * 60 * 60 * 1000);
          break;
        case '24h':
          dateFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          dateFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }

      // Get threat data
      const threatData = await this.prisma.threatDatabase.findMany({
        where: {
          isActive: true,
          createdAt: {
            gte: dateFrom
          },
          ...(threatType ? { threatType } : {})
        },
        orderBy: { createdAt: 'asc' }
      });

      // Get scan data
      const scanData = await this.prisma.scanHistory.findMany({
        where: {
          status: 'completed',
          createdAt: {
            gte: dateFrom
          },
          ...(threatType ? { resultData: { contains: threatType } } : {})
        },
        orderBy: { createdAt: 'asc' }
      });

      // Get analytics data
      const analyticsData = await this.prisma.userAnalytics.findMany({
        where: {
          createdAt: {
            gte: dateFrom
          },
          ...(threatType ? { eventData: { contains: threatType } } : {})
        },
        orderBy: { createdAt: 'asc' }
      });

      // Combine and format data
      const timeSeriesData: TimeSeriesData[] = [];

      // Add threat data points
      threatData.forEach(threat => {
        timeSeriesData.push({
          timestamp: threat.createdAt.toISOString(),
          value: this.getThreatSeverityValue(threat.severity),
          category: threat.threatType,
          metadata: {
            source: threat.source,
            isActive: threat.isActive
          }
        });
      });

      // Add scan data points
      scanData.forEach(scan => {
        if (scan.overallScore !== null) {
          timeSeriesData.push({
            timestamp: scan.createdAt.toISOString(),
            value: scan.overallScore / 100, // Normalize to 0-1
            category: 'scan_score',
            metadata: {
              scanType: scan.scanType,
              status: scan.status
            }
          });
        }
      });

      // Add analytics data points
      analyticsData.forEach(analytics => {
        const eventType = analytics.eventType;
        const value = this.getAnalyticsEventValue(eventType);
        
        timeSeriesData.push({
          timestamp: analytics.createdAt.toISOString(),
          value,
          category: 'analytics',
          metadata: {
            sessionId: analytics.sessionId,
            userId: analytics.userId
          }
        });
      });

      return timeSeriesData.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    } catch (error) {
      console.error('Failed to get historical data:', error);
      return [];
    }
  }

  // Get threat severity value
  private getThreatSeverityValue(severity: string): number {
    switch (severity.toLowerCase()) {
      case 'critical': return 0.9;
      case 'high': return 0.7;
      case 'medium': return 0.5;
      case 'low': return 0.3;
      default: return 0.4;
    }
  }

  // Get analytics event value
  private getAnalyticsEventValue(eventType: string): number {
    // Assign values to different event types
    const eventValues: Record<string, number> = {
      'scan_completed': 0.2,
      'scan_failed': 0.8,
      'threat_detected': 0.9,
      'security_alert': 0.7,
      'login_failed': 0.6,
      'data_exported': 0.3,
      'user_registered': 0.1,
      'default': 0.4
    };

    return eventValues[eventType] || eventValues.default;
  }

  // Initialize prediction models
  private initializeModels(): void {
    // Initialize with default models
    this.models.set('trend_analysis', {
      id: 'trend_analysis',
      name: 'Trend Analysis Model',
      type: 'trend',
      algorithm: 'linear_regression',
      accuracy: 0.85,
      lastTrained: new Date().toISOString(),
      features: ['timestamp', 'value', 'category'],
      hyperparameters: {
        regularization: 0.01,
        learning_rate: 0.001
      }
    });

    this.models.set('anomaly_detection', {
      id: 'anomaly_detection',
      name: 'Anomaly Detection Model',
      type: 'anomaly',
      algorithm: 'random_forest',
      accuracy: 0.82,
      lastTrained: new Date().toISOString(),
      features: ['timestamp', 'value', 'category', 'rolling_mean', 'rolling_std'],
      hyperparameters: {
        contamination: 0.1,
        n_estimators: 100
      }
    });
  }

  // Get prediction model
  getModel(modelId: string): PredictionModel | undefined {
    return this.models.get(modelId);
  }

  // Get all models
  getAllModels(): PredictionModel[] {
    return Array.from(this.models.values());
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    models: number;
    lastPrediction: string | null;
    errors: string[];
  }> {
    try {
      const [models, lastPrediction] = await Promise.all([
        Promise.resolve(this.models.size),
        this.redis.get('last_prediction_timestamp')
      ]);

      return {
        status: models > 0 ? 'healthy' : 'warning',
        models,
        lastPrediction,
        errors: []
      };
    } catch (error) {
      console.error('Threat prediction health check failed:', error);
      return {
        status: 'critical',
        models: 0,
        lastPrediction: null,
        errors: [error instanceof Error ? error.message : 'Health check failed']
      };
    }
  }

  // Update last prediction timestamp
  private async updateLastPrediction(): Promise<void> {
    await this.redis.set('last_prediction_timestamp', new Date().toISOString(), {
      EX: 300 // 5 minutes
    });
  }
}

// Singleton instance
export const threatPredictionService = new ThreatPredictionService();

