/**
 * Custom Threat Detection Engine
 * Advanced AI-powered threat detection with custom models
 */

import { modelManager, ThreatInput, ThreatPrediction, PatternMatch } from './model-manager';

export interface ThreatPattern {
  id: string;
  name: string;
  pattern: RegExp | string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'phishing' | 'malware' | 'social_engineering' | 'data_exfiltration' | 'other';
  description: string;
  indicators: string[];
  confidence: number;
}

export interface DetectionRule {
  id: string;
  name: string;
  conditions: {
    field: string;
    operator: 'contains' | 'matches' | 'equals' | 'greater_than' | 'less_than';
    value: string | number;
  }[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: 'flag' | 'block' | 'monitor' | 'alert';
  confidence: number;
}

export interface ThreatContext {
  platform: string;
  userType: string;
  interactionType: string;
  timeOfDay: number;
  deviceType: string;
  location?: string;
  previousInteractions: number;
}

class CustomThreatDetector {
  private patterns: Map<string, ThreatPattern> = new Map();
  private rules: Map<string, DetectionRule> = new Map();
  private modelId: string;

  constructor() {
    this.modelId = 'threat-detector-v1';
    this.initializeThreatPatterns();
    this.initializeDetectionRules();
  }

  private initializeThreatPatterns(): void {
    const defaultPatterns: ThreatPattern[] = [
      {
        id: 'urgent_payment_request',
        name: 'Urgent Payment Request',
        pattern: /(?:urgent|immediate|asap|right now).*(?:payment|transfer|send money|wire|crypto|bitcoin)/i,
        severity: 'high',
        category: 'phishing',
        description: 'Detects urgent payment requests often used in scams',
        indicators: ['urgency_language', 'payment_request', 'pressure_tactics'],
        confidence: 0.85
      },
      {
        id: 'fake_job_offer',
        name: 'Fake Job Offer',
        pattern: /(?:congratulations|you're hired|job offer|position).*(?:technical assessment|test|coding challenge|repository)/i,
        severity: 'critical',
        category: 'social_engineering',
        description: 'Detects fake job offers requiring technical tests',
        indicators: ['job_offer', 'technical_assessment', 'unrealistic_opportunity'],
        confidence: 0.92
      },
      {
        id: 'suspicious_link',
        name: 'Suspicious Link Pattern',
        pattern: /(?:bit\.ly|tinyurl|t\.co|short\.link|cutt\.ly)/i,
        severity: 'medium',
        category: 'phishing',
        description: 'Detects URL shorteners often used in phishing',
        indicators: ['url_shortener', 'obscured_destination', 'trust_manipulation'],
        confidence: 0.75
      },
      {
        id: 'crypto_wallet_request',
        name: 'Crypto Wallet Request',
        pattern: /(?:wallet|private key|seed phrase|mnemonic|recovery phrase).*(?:share|send|provide|give)/i,
        severity: 'critical',
        category: 'data_exfiltration',
        description: 'Detects requests for crypto wallet information',
        indicators: ['wallet_request', 'sensitive_data', 'theft_attempt'],
        confidence: 0.95
      },
      {
        id: 'remote_access_request',
        name: 'Remote Access Request',
        pattern: /(?:remote desktop|teamviewer|anydesk|screen share|access).*(?:computer|pc|laptop|device)/i,
        severity: 'high',
        category: 'malware',
        description: 'Detects requests for remote computer access',
        indicators: ['remote_access', 'malware_delivery', 'system_compromise'],
        confidence: 0.88
      },
      {
        id: 'off_platform_communication',
        name: 'Off-Platform Communication',
        pattern: /(?:telegram|whatsapp|signal|discord|slack).*(?:continue|move|switch|chat)/i,
        severity: 'medium',
        category: 'social_engineering',
        description: 'Detects attempts to move conversation off-platform',
        indicators: ['platform_switch', 'evasion_tactics', 'reduced_oversight'],
        confidence: 0.78
      }
    ];

    defaultPatterns.forEach(pattern => {
      this.patterns.set(pattern.id, pattern);
    });
  }

  private initializeDetectionRules(): void {
    const defaultRules: DetectionRule[] = [
      {
        id: 'high_urgency_with_payment',
        name: 'High Urgency with Payment Request',
        conditions: [
          { field: 'urgency_score', operator: 'greater_than', value: 0.7 },
          { field: 'payment_mentioned', operator: 'equals', value: 1 },
          { field: 'verification_required', operator: 'equals', value: 0 }
        ],
        severity: 'critical',
        action: 'block',
        confidence: 0.91
      },
      {
        id: 'technical_assessment_required',
        name: 'Technical Assessment Required',
        conditions: [
          { field: 'job_related', operator: 'equals', value: 1 },
          { field: 'technical_test_requested', operator: 'equals', value: 1 },
          { field: 'company_verified', operator: 'equals', value: 0 }
        ],
        severity: 'high',
        action: 'flag',
        confidence: 0.85
      },
      {
        id: 'suspicious_domain_pattern',
        name: 'Suspicious Domain Pattern',
        conditions: [
          { field: 'domain_age_days', operator: 'less_than', value: 30 },
          { field: 'domain_tld', operator: 'contains', value: '.xyz' },
          { field: 'brand_impersonation', operator: 'equals', value: 1 }
        ],
        severity: 'medium',
        action: 'monitor',
        confidence: 0.76
      }
    ];

    defaultRules.forEach(rule => {
      this.rules.set(rule.id, rule);
    });
  }

  async predictThreatLevel(input: ThreatInput): Promise<ThreatPrediction> {
    try {
      // Load the threat detection model
      const model = await modelManager.loadCustomModel(this.modelId);
      
      if (model.status !== 'ready') {
        throw new Error('Threat detection model is not ready');
      }

      // Extract features from input
      const features = this.extractFeatures(input);
      
      // Pattern matching
      const patternMatches = this.detectPatterns(input.content);
      
      // Rule evaluation
      const ruleViolations = this.evaluateRules(features);
      
      // ML prediction (simulated)
      const mlPrediction = await this.runMLPrediction(features);
      
      // Combine all evidence
      const combinedScore = this.combineEvidence(patternMatches, ruleViolations, mlPrediction);
      
      // Generate threat prediction
      const prediction: ThreatPrediction = {
        threatLevel: this.calculateThreatLevel(combinedScore.score),
        confidence: combinedScore.confidence,
        indicators: this.extractIndicators(patternMatches, ruleViolations),
        reasoning: this.generateReasoning(patternMatches, ruleViolations, mlPrediction),
        recommendations: this.generateRecommendations(combinedScore)
      };

      return prediction;
    } catch (error) {
      console.error('Error in threat prediction:', error);
      return {
        threatLevel: 'medium',
        confidence: 0.5,
        indicators: ['analysis_error'],
        reasoning: 'Unable to complete threat analysis due to system error',
        recommendations: ['Manual review recommended']
      };
    }
  }

  private extractFeatures(input: ThreatInput): Record<string, any> {
    const content = input.content.toLowerCase();
    
    return {
      urgency_score: this.calculateUrgencyScore(content),
      payment_mentioned: content.includes('payment') || content.includes('transfer') ? 1 : 0,
      job_related: content.includes('job') || content.includes('position') || content.includes('offer') ? 1 : 0,
      technical_test_requested: content.includes('technical assessment') || content.includes('coding test') ? 1 : 0,
      company_verified: 0, // Would be determined from external verification
      domain_age_days: 0, // Would be determined from domain lookup
      domain_tld: '', // Would be determined from domain analysis
      brand_impersonation: 0, // Would be determined from brand analysis
      link_count: (content.match(/http[s]?:\/\/[^\s]+/g) || []).length,
      suspicious_keywords: this.countSuspiciousKeywords(content),
      pressure_tactics: this.detectPressureTactics(content) ? 1 : 0,
      verification_required: this.detectVerificationRequest(content) ? 1 : 0
    };
  }

  private calculateUrgencyScore(content: string): number {
    const urgencyWords = ['urgent', 'immediate', 'asap', 'right now', 'quickly', 'fast', 'hurry', 'don\'t wait'];
    const foundWords = urgencyWords.filter(word => content.includes(word));
    return Math.min(1.0, foundWords.length / urgencyWords.length);
  }

  private countSuspiciousKeywords(content: string): number {
    const suspiciousWords = [
      'bitcoin', 'cryptocurrency', 'wallet', 'private key', 'seed phrase',
      'remote desktop', 'teamviewer', 'screen share', 'access',
      'wire transfer', 'money transfer', 'send money', 'payment'
    ];
    return suspiciousWords.filter(word => content.includes(word)).length;
  }

  private detectPressureTactics(content: string): boolean {
    const pressurePhrases = [
      'don\'t tell anyone', 'keep it secret', 'act now', 'limited time',
      'only you', 'special opportunity', 'trust me', 'don\'t ask questions'
    ];
    return pressurePhrases.some(phrase => content.includes(phrase));
  }

  private detectVerificationRequest(content: string): boolean {
    const verificationPhrases = [
      'verify your account', 'confirm identity', 'security check',
      'verification required', 'prove you\'re real'
    ];
    return verificationPhrases.some(phrase => content.includes(phrase));
  }

  private detectPatterns(content: string): PatternMatch[] {
    const matches: PatternMatch[] = [];
    
    Array.from(this.patterns.entries()).forEach(([id, pattern]) => {
      const regex = pattern.pattern instanceof RegExp ? pattern.pattern : new RegExp(pattern.pattern, 'i');
      const match = content.match(regex);
      
      if (match && match.index !== undefined) {
        matches.push({
          pattern: pattern.name,
          severity: pattern.severity,
          confidence: pattern.confidence,
          description: pattern.description,
          evidence: match[0] || content.substring(Math.max(0, match.index - 50), match.index + 50)
        });
      }
    });
    
    return matches;
  }

  private evaluateRules(features: Record<string, any>): DetectionRule[] {
    const violations: DetectionRule[] = [];
    
    Array.from(this.rules.entries()).forEach(([id, rule]) => {
      const conditionsMet = rule.conditions.every((condition: any) => {
        const fieldValue = features[condition.field];
        
        switch (condition.operator) {
          case 'equals':
            return fieldValue === condition.value;
          case 'contains':
            return String(fieldValue).includes(String(condition.value));
          case 'greater_than':
            return Number(fieldValue) > Number(condition.value);
          case 'less_than':
            return Number(fieldValue) < Number(condition.value);
          case 'matches':
            return new RegExp(condition.value as string).test(String(fieldValue));
          default:
            return false;
        }
      });
      
      if (conditionsMet) {
        violations.push(rule);
      }
    });
    
    return violations;
  }

  private async runMLPrediction(features: Record<string, any>): Promise<{
    threat_score: number;
    confidence: number;
    feature_importance: Record<string, number>;
  }> {
    // Simulate ML model prediction
    // In a real implementation, this would call the actual ML model
    
    const featureScores = {
      urgency_score: features.urgency_score * 0.2,
      payment_mentioned: features.payment_mentioned ? 0.15 : 0,
      job_related: features.job_related ? 0.1 : 0,
      technical_test_requested: features.technical_test_requested ? 0.25 : 0,
      suspicious_keywords: Math.min(0.2, features.suspicious_keywords * 0.05),
      pressure_tactics: features.pressure_tactics ? 0.15 : 0,
      link_count: Math.min(0.1, features.link_count * 0.02)
    };
    
    const totalScore = Object.values(featureScores).reduce((sum, score) => sum + score, 0);
    
    return {
      threat_score: Math.min(1.0, totalScore),
      confidence: 0.85 + Math.random() * 0.1,
      feature_importance: featureScores
    };
  }

  private combineEvidence(patterns: PatternMatch[], rules: DetectionRule[], mlPrediction: any): {
    score: number;
    confidence: number;
    evidence: string[];
  } {
    const evidence: string[] = [];
    let totalScore = 0;
    let totalWeight = 0;
    
    // Pattern matching evidence
    patterns.forEach(pattern => {
      const weight = pattern.confidence;
      const severityScore = this.getSeverityScore(pattern.severity);
      totalScore += severityScore * weight;
      totalWeight += weight;
      evidence.push(`Pattern: ${pattern.pattern} (${pattern.severity})`);
    });
    
    // Rule violations evidence
    rules.forEach(rule => {
      const weight = rule.confidence;
      const severityScore = this.getSeverityScore(rule.severity);
      totalScore += severityScore * weight;
      totalWeight += weight;
      evidence.push(`Rule: ${rule.name} (${rule.severity})`);
    });
    
    // ML prediction evidence
    const mlWeight = mlPrediction.confidence;
    totalScore += mlPrediction.threat_score * mlWeight;
    totalWeight += mlWeight;
    evidence.push(`ML Prediction: ${(mlPrediction.threat_score * 100).toFixed(1)}%`);
    
    const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0;
    const finalConfidence = Math.min(0.95, (patterns.length + rules.length) / 10 + mlPrediction.confidence * 0.5);
    
    return {
      score: finalScore,
      confidence: finalConfidence,
      evidence
    };
  }

  private getSeverityScore(severity: string): number {
    switch (severity) {
      case 'critical': return 1.0;
      case 'high': return 0.8;
      case 'medium': return 0.6;
      case 'low': return 0.3;
      default: return 0.5;
    }
  }

  private calculateThreatLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 0.8) return 'critical';
    if (score >= 0.6) return 'high';
    if (score >= 0.4) return 'medium';
    return 'low';
  }

  private extractIndicators(patterns: PatternMatch[], rules: DetectionRule[]): string[] {
    const indicators = new Set<string>();
    
    patterns.forEach(pattern => {
      indicators.add(`pattern_match_${pattern.pattern.toLowerCase().replace(/\s+/g, '_')}`);
    });
    
    rules.forEach(rule => {
      indicators.add(`rule_violation_${rule.name.toLowerCase().replace(/\s+/g, '_')}`);
    });
    
    return Array.from(indicators);
  }

  private generateReasoning(patterns: PatternMatch[], rules: DetectionRule[], mlPrediction: any): string {
    const reasons = [];
    
    if (patterns.length > 0) {
      reasons.push(`Detected ${patterns.length} suspicious patterns including ${patterns[0].pattern}`);
    }
    
    if (rules.length > 0) {
      reasons.push(`Triggered ${rules.length} security rules including ${rules[0].name}`);
    }
    
    if (mlPrediction.threat_score > 0.7) {
      reasons.push(`ML model indicates high threat probability (${(mlPrediction.threat_score * 100).toFixed(1)}%)`);
    }
    
    return reasons.join('. ') || 'No specific threats detected, but caution advised based on contextual factors.';
  }

  private generateRecommendations(evidence: any): string[] {
    const recommendations = [];
    
    if (evidence.score >= 0.8) {
      recommendations.push('Immediately cease communication with this contact');
      recommendations.push('Report this incident to your security team');
      recommendations.push('Block and blacklist this contact');
    } else if (evidence.score >= 0.6) {
      recommendations.push('Exercise extreme caution with this interaction');
      recommendations.push('Verify identity through official channels only');
      recommendations.push('Do not share any personal or financial information');
    } else if (evidence.score >= 0.4) {
      recommendations.push('Proceed with caution and verify all claims');
      recommendations.push('Request additional verification of identity');
      recommendations.push('Document all interactions for future reference');
    } else {
      recommendations.push('Standard security precautions recommended');
      recommendations.push('Monitor for any unusual behavior');
    }
    
    return recommendations;
  }

  async detectSuspiciousPatterns(content: string): Promise<PatternMatch[]> {
    return this.detectPatterns(content);
  }

  addCustomPattern(pattern: ThreatPattern): void {
    this.patterns.set(pattern.id, pattern);
  }

  addCustomRule(rule: DetectionRule): void {
    this.rules.set(rule.id, rule);
  }

  getPatterns(): ThreatPattern[] {
    return Array.from(this.patterns.values());
  }

  getRules(): DetectionRule[] {
    return Array.from(this.rules.values());
  }
}

export const customThreatDetector = new CustomThreatDetector();
export default CustomThreatDetector;
