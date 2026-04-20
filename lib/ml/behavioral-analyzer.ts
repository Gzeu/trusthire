/**
 * Advanced Behavioral Analysis Engine
 * Analyzes user behavior patterns and detects anomalies
 */

import { modelManager, BehaviorProfile, AnomalyReport, RiskScore } from './model-manager';

export interface UserInteraction {
  id: string;
  userId: string;
  type: 'assessment' | 'share' | 'login' | 'scan' | 'view';
  timestamp: Date;
  platform: string;
  metadata: Record<string, any>;
  riskScore?: number;
}

export interface BehaviorPattern {
  type: string;
  frequency: number;
  typicalRange: {
    min: number;
    max: number;
  };
  riskImpact: number;
  description: string;
}

export interface AnomalyDetection {
  type: string;
  severity: number;
  confidence: number;
  description: string;
  evidence: string;
  recommendations: string[];
}

export interface BehavioralMetrics {
  assessmentFrequency: number;
  typicalRiskLevel: number;
  preferredPlatforms: string[];
  interactionPatterns: string[];
  timePatterns: {
    mostActiveHours: number[];
    typicalSessionDuration: number;
    weeklyActivity: number[];
  };
  riskTolerance: number;
  verificationRequests: number;
}

class BehavioralAnalyzer {
  private modelId: string;
  private interactionHistory: Map<string, UserInteraction[]> = new Map();
  private behaviorProfiles: Map<string, BehaviorProfile> = new Map();

  constructor() {
    this.modelId = 'behavioral-analyzer-v1';
    this.initializeDefaultPatterns();
  }

  private initializeDefaultPatterns(): void {
    // Initialize default behavioral patterns
    // This would typically be loaded from training data
  }

  async analyzeUserBehavior(userId: string): Promise<BehaviorProfile> {
    try {
      // Load the behavioral analysis model
      const model = await modelManager.loadCustomModel(this.modelId);
      
      if (model.status !== 'ready') {
        throw new Error('Behavioral analysis model is not ready');
      }

      // Get user interaction history
      const interactions = this.getUserInteractions(userId);
      
      // Calculate behavioral metrics
      const metrics = this.calculateBehavioralMetrics(interactions);
      
      // Create behavior profile
      const profile: BehaviorProfile = {
        userId,
        patterns: {
          assessmentFrequency: metrics.assessmentFrequency,
          typicalRiskLevel: metrics.typicalRiskLevel,
          preferredPlatforms: metrics.preferredPlatforms,
          interactionPatterns: metrics.interactionPatterns
        },
        anomalies: [],
        riskScore: 0.5,
        lastUpdated: new Date()
      };
      
      // Detect anomalies
      const anomalyReport = await this.detectAnomalies(profile);
      
      // Calculate dynamic risk score
      const riskScore = await this.calculateDynamicRisk(metrics, anomalyReport.anomalies);
      
      // Update profile with analysis results
      profile.anomalies = anomalyReport.anomalies.map((anomaly: any) => ({
        type: anomaly.type,
        severity: anomaly.severity,
        description: anomaly.description,
        timestamp: new Date()
      }));
      profile.riskScore = riskScore.adjustedScore;

      // Cache the profile
      this.behaviorProfiles.set(userId, profile);
      
      return profile;
    } catch (error) {
      console.error('Error analyzing user behavior:', error);
      
      // Return default profile on error
      return {
        userId,
        patterns: {
          assessmentFrequency: 0,
          typicalRiskLevel: 0.5,
          preferredPlatforms: [],
          interactionPatterns: []
        },
        anomalies: [],
        riskScore: 0.5,
        lastUpdated: new Date()
      };
    }
  }

  async detectAnomalies(behavior: BehaviorProfile): Promise<AnomalyReport> {
    try {
      const anomalies: AnomalyDetection[] = [];
      
      // Check for assessment frequency anomalies
      if (behavior.patterns.assessmentFrequency > 10) {
        anomalies.push({
          type: 'high_assessment_frequency',
          severity: 0.7,
          confidence: 0.8,
          description: 'Unusually high assessment frequency detected',
          evidence: `${behavior.patterns.assessmentFrequency} assessments in recent period`,
          recommendations: [
            'Monitor for automated or bot-like behavior',
            'Verify user identity through additional means',
            'Consider rate limiting for this user'
          ]
        });
      }

      // Check for risk level anomalies
      if (behavior.patterns.typicalRiskLevel > 0.8) {
        anomalies.push({
          type: 'elevated_risk_tolerance',
          severity: 0.6,
          confidence: 0.75,
          description: 'User consistently engages with high-risk content',
          evidence: `Typical risk level: ${(behavior.patterns.typicalRiskLevel * 100).toFixed(1)}%`,
          recommendations: [
            'Provide additional security education',
            'Implement enhanced verification for this user',
            'Monitor for potential security risks'
          ]
        });
      }

      // Check for platform switching anomalies
      if (behavior.patterns.preferredPlatforms.length > 5) {
        anomalies.push({
          type: 'excessive_platform_switching',
          severity: 0.5,
          confidence: 0.7,
          description: 'User frequently switches between platforms',
          evidence: `${behavior.patterns.preferredPlatforms.length} different platforms used`,
          recommendations: [
            'Monitor for potential account takeover attempts',
            'Verify user sessions across platforms',
            'Consider implementing platform consistency checks'
          ]
        });
      }

      // Check for time-based anomalies
      const currentHour = new Date().getHours();
      if (currentHour >= 2 && currentHour <= 5) {
        anomalies.push({
          type: 'unusual_activity_time',
          severity: 0.4,
          confidence: 0.6,
          description: 'Activity detected during unusual hours',
          evidence: `Activity at ${currentHour}:00`,
          recommendations: [
            'Implement additional verification for off-hours activities',
            'Monitor for potential automated behavior',
            'Consider time-based access restrictions'
          ]
        });
      }

      // Calculate overall risk score
      const overallRiskScore = anomalies.length > 0 
        ? anomalies.reduce((sum, a) => sum + (a.severity * a.confidence), 0) / anomalies.length
        : 0.1;

      // Generate recommendations based on overall risk
      const recommendations = this.generateAnomalyRecommendations(anomalies, overallRiskScore);

      return {
        userId: behavior.userId,
        anomalies: anomalies.map(a => ({
          type: a.type,
          severity: a.severity,
          description: a.description,
          confidence: a.confidence,
          timestamp: new Date()
        })),
        overallRiskScore,
        recommendations
      };
    } catch (error) {
      console.error('Error detecting anomalies:', error);
      
      return {
        userId: behavior.userId,
        anomalies: [],
        overallRiskScore: 0.5,
        recommendations: ['Manual review recommended due to analysis error']
      };
    }
  }

  async calculateDynamicRisk(behavior: BehavioralMetrics, anomalies: AnomalyDetection[]): Promise<RiskScore> {
    try {
      // Base score from behavioral patterns
      const behavioralScore = this.calculateBehavioralRisk(behavior);
      
      // Adjust for anomalies
      const anomalyScore = anomalies.length > 0
        ? anomalies.reduce((sum, a) => sum + (a.severity * a.confidence), 0) / anomalies.length
        : 0;

      // Contextual factors (time, location, etc.)
      const contextualScore = this.calculateContextualRisk(behavior);
      
      // Historical factors (past behavior trends)
      const historicalScore = this.calculateHistoricalRisk(behavior);

      // Combine all factors
      const baseScore = (behavioralScore * 0.4) + (contextualScore * 0.3) + (historicalScore * 0.3);
      const adjustedScore = Math.min(1.0, baseScore + (anomalyScore * 0.5));

      return {
        baseScore: Math.round(behavioralScore * 100) / 100,
        adjustedScore: Math.round(adjustedScore * 100) / 100,
        factors: {
          behavioral: Math.round(behavioralScore * 100) / 100,
          contextual: Math.round(contextualScore * 100) / 100,
          historical: Math.round(historicalScore * 100) / 100
        },
        confidence: 0.8 + (Math.random() * 0.15), // Simulated confidence
        explanation: this.generateRiskExplanation(behavioralScore, anomalyScore, contextualScore, historicalScore)
      };
    } catch (error) {
      console.error('Error calculating dynamic risk:', error);
      
      return {
        baseScore: 0.5,
        adjustedScore: 0.5,
        factors: {
          behavioral: 0.5,
          contextual: 0.5,
          historical: 0.5
        },
        confidence: 0.5,
        explanation: 'Unable to calculate dynamic risk due to system error'
      };
    }
  }

  private getUserInteractions(userId: string): UserInteraction[] {
    return this.interactionHistory.get(userId) || [];
  }

  private calculateBehavioralMetrics(interactions: UserInteraction[]): BehavioralMetrics {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    const recentInteractions = interactions.filter(i => i.timestamp >= thirtyDaysAgo);
    
    // Assessment frequency
    const assessments = recentInteractions.filter(i => i.type === 'assessment');
    const assessmentFrequency = assessments.length / 30; // per day

    // Typical risk level
    const riskScores = recentInteractions
      .filter(i => i.riskScore !== undefined)
      .map(i => i.riskScore!);
    const typicalRiskLevel = riskScores.length > 0 
      ? riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length
      : 0.5;

    // Preferred platforms
    const platformCounts = recentInteractions.reduce((counts, i) => {
      counts[i.platform] = (counts[i.platform] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    const preferredPlatforms = Object.entries(platformCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([platform]) => platform);

    // Interaction patterns
    const interactionPatterns = recentInteractions.reduce((patterns, i) => {
      patterns[i.type] = (patterns[i.type] || 0) + 1;
      return patterns;
    }, {} as Record<string, number>);

    // Time patterns
    const hourCounts = new Array(24).fill(0);
    const weeklyActivity = new Array(7).fill(0);
    
    recentInteractions.forEach(i => {
      hourCounts[i.timestamp.getHours()]++;
      weeklyActivity[i.timestamp.getDay()]++;
    });

    const mostActiveHours = hourCounts
      .map((count, hour) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(h => h.hour);

    const typicalSessionDuration = this.calculateTypicalSessionDuration(recentInteractions);

    return {
      assessmentFrequency,
      typicalRiskLevel,
      preferredPlatforms,
      interactionPatterns: Object.keys(interactionPatterns),
      timePatterns: {
        mostActiveHours,
        typicalSessionDuration,
        weeklyActivity
      },
      riskTolerance: typicalRiskLevel,
      verificationRequests: recentInteractions.filter(i => i.type === 'login').length
    };
  }

  private calculateTypicalSessionDuration(interactions: UserInteraction[]): number {
    // Group interactions by session (simplified - within 30 minutes)
    const sessions: UserInteraction[][] = [];
    let currentSession: UserInteraction[] = [];

    const sortedInteractions = interactions.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    sortedInteractions.forEach(interaction => {
      if (currentSession.length === 0) {
        currentSession.push(interaction);
      } else {
        const lastInteraction = currentSession[currentSession.length - 1];
        const timeDiff = interaction.timestamp.getTime() - lastInteraction.timestamp.getTime();
        
        if (timeDiff <= 30 * 60 * 1000) { // 30 minutes
          currentSession.push(interaction);
        } else {
          sessions.push(currentSession);
          currentSession = [interaction];
        }
      }
    });

    if (currentSession.length > 0) {
      sessions.push(currentSession);
    }

    // Calculate average session duration
    const sessionDurations = sessions.map(session => {
      if (session.length <= 1) return 0;
      const start = session[0].timestamp.getTime();
      const end = session[session.length - 1].timestamp.getTime();
      return (end - start) / (1000 * 60); // Convert to minutes
    });

    return sessionDurations.length > 0
      ? sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length
      : 0;
  }

  private calculateBehavioralRisk(metrics: BehavioralMetrics): number {
    let risk = 0.3; // Base risk

    // Assessment frequency risk
    if (metrics.assessmentFrequency > 5) risk += 0.2;
    if (metrics.assessmentFrequency > 10) risk += 0.1;

    // Risk tolerance
    risk += metrics.riskTolerance * 0.3;

    // Platform diversity (can indicate account sharing)
    if (metrics.preferredPlatforms.length > 3) risk += 0.1;

    // Time-based risk
    const currentHour = new Date().getHours();
    if (currentHour >= 2 && currentHour <= 5) risk += 0.1;

    return Math.min(1.0, risk);
  }

  private calculateContextualRisk(metrics: BehavioralMetrics): number {
    let risk = 0.2; // Base contextual risk

    // Unusual hours risk
    const unusualHours = metrics.timePatterns.mostActiveHours.filter(hour => hour >= 2 && hour <= 5);
    if (unusualHours.length > 0) risk += unusualHours.length * 0.1;

    // Session duration risk
    if (metrics.timePatterns.typicalSessionDuration > 60) risk += 0.1;
    if (metrics.timePatterns.typicalSessionDuration > 120) risk += 0.1;

    return Math.min(1.0, risk);
  }

  private calculateHistoricalRisk(metrics: BehavioralMetrics): number {
    let risk = 0.2; // Base historical risk

    // Verification frequency
    if (metrics.verificationRequests > 10) risk += 0.1;
    if (metrics.verificationRequests > 20) risk += 0.1;

    // Interaction pattern diversity
    if (metrics.interactionPatterns.length > 5) risk += 0.1;

    return Math.min(1.0, risk);
  }

  private generateRiskExplanation(behavioral: number, anomaly: number, contextual: number, historical: number): string {
    const explanations = [];

    if (behavioral > 0.6) {
      explanations.push('User behavior patterns indicate elevated risk');
    }

    if (anomaly > 0.5) {
      explanations.push('Anomalous activities detected');
    }

    if (contextual > 0.6) {
      explanations.push('Contextual factors suggest increased risk');
    }

    if (historical > 0.6) {
      explanations.push('Historical patterns indicate security concerns');
    }

    return explanations.length > 0 
      ? explanations.join('. ')
      : 'User behavior appears normal with standard risk levels';
  }

  private generateAnomalyRecommendations(anomalies: AnomalyDetection[], overallRisk: number): string[] {
    const recommendations = [];

    if (overallRisk > 0.7) {
      recommendations.push('Implement enhanced monitoring for this user');
      recommendations.push('Consider additional verification requirements');
      recommendations.push('Review recent activities for security implications');
    } else if (overallRisk > 0.5) {
      recommendations.push('Monitor user behavior for changes');
      recommendations.push('Provide security awareness education');
    } else {
      recommendations.push('Continue standard monitoring procedures');
    }

    // Add specific recommendations based on anomaly types
    anomalies.forEach(anomaly => {
      recommendations.push(...anomaly.recommendations);
    });

    // Remove duplicates and return
    return Array.from(new Set(recommendations));
  }

  // Method to record new interactions
  recordInteraction(interaction: UserInteraction): void {
    const userInteractions = this.interactionHistory.get(interaction.userId) || [];
    userInteractions.push(interaction);
    
    // Keep only last 90 days of interactions
    const ninetyDaysAgo = new Date(Date.now() - (90 * 24 * 60 * 60 * 1000));
    const filteredInteractions = userInteractions.filter(i => i.timestamp >= ninetyDaysAgo);
    
    this.interactionHistory.set(interaction.userId, filteredInteractions);
  }

  // Method to get cached behavior profile
  getBehaviorProfile(userId: string): BehaviorProfile | undefined {
    return this.behaviorProfiles.get(userId);
  }

  // Method to clear cached profiles
  clearCache(): void {
    this.behaviorProfiles.clear();
  }
}

export const behavioralAnalyzer = new BehavioralAnalyzer();
export default BehavioralAnalyzer;
