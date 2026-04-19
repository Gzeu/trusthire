// Advanced Analytics - Threat Pattern Analyzer
// Machine learning for threat pattern recognition and analysis

export interface ThreatPattern {
  id: string;
  name: string;
  description: string;
  category: 'malware' | 'phishing' | 'apt' | 'ransomware' | 'vulnerability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  indicators: {
    keywords: string[];
    domains: string[];
    ips: string[];
    hashes: string[];
    urls: string[];
    patterns: string[];
  };
  frequency: {
    daily: number;
    weekly: number;
    monthly: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  geography: {
    countries: string[];
    regions: string[];
    hotspots: Array<{
      country: string;
      count: number;
      percentage: number;
    }>;
  };
  timeline: Array<{
    date: string;
    count: number;
    severity: string;
  }>;
  relatedPatterns: string[];
  mitigation: {
    prevention: string[];
    detection: string[];
    response: string[];
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface ThreatAnalysis {
  id: string;
  threatId: string;
  analysisType: 'pattern' | 'anomaly' | 'prediction' | 'correlation';
  confidence: number;
  insights: string[];
  recommendations: string[];
  riskScore: number;
  metadata: {
    model: string;
    version: string;
    features: string[];
    trainingData: string;
    accuracy: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MLModel {
  id: string;
  name: string;
  type: 'classification' | 'clustering' | 'anomaly_detection' | 'prediction';
  category: 'threat' | 'behavior' | 'network' | 'content';
  version: string;
  status: 'training' | 'active' | 'deprecated';
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  features: string[];
  hyperparameters: Record<string, any>;
  trainingData: {
    samples: number;
    features: number;
    classes: number;
    lastTrained: string;
  };
  deployment: {
    endpoint: string;
    version: string;
    deployedAt: string;
    health: 'healthy' | 'degraded' | 'unhealthy';
  };
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsConfig {
  ml: {
    models: {
      threatClassifier: {
        enabled: boolean;
        modelPath: string;
        threshold: number;
      };
      anomalyDetector: {
        enabled: boolean;
        modelPath: string;
        sensitivity: number;
      };
      patternRecognizer: {
        enabled: boolean;
        modelPath: string;
        minConfidence: number;
      };
      threatPredictor: {
        enabled: boolean;
        modelPath: string;
        predictionWindow: number;
      };
    };
    training: {
      batchSize: number;
      learningRate: number;
      epochs: number;
      validationSplit: number;
      retrainInterval: number;
    };
    deployment: {
      autoDeploy: boolean;
      healthCheckInterval: number;
      rollbackThreshold: number;
    };
  };
  analytics: {
    retention: {
      patterns: number; // days
      analyses: number; // days
      models: number; // days
    };
    aggregation: {
      window: number; // hours
      granularity: 'hour' | 'day' | 'week' | 'month';
    };
    alerts: {
      confidenceThreshold: number;
      riskScoreThreshold: number;
      anomalyThreshold: number;
    };
  };
}

export class ThreatPatternAnalyzer {
  private config: AnalyticsConfig;
  private patterns: Map<string, ThreatPattern> = new Map();
  private models: Map<string, MLModel> = new Map();
  private analyses: Map<string, ThreatAnalysis> = new Map();

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.initializeMockPatterns();
    this.initializeMockModels();
  }

  private initializeMockPatterns(): void {
    const mockPatterns: ThreatPattern[] = [
      {
        id: 'pattern-1',
        name: 'Spear Phishing Campaign',
        description: 'Targeted phishing attacks using personalized emails',
        category: 'phishing',
        severity: 'high',
        confidence: 0.85,
        indicators: {
          keywords: ['urgent', 'account', 'suspended', 'verify', 'click', 'link'],
          domains: ['suspicious-domain.com', 'fake-bank.net'],
          ips: ['192.168.1.100', '10.0.0.50'],
          hashes: ['a1b2c3d4e5f6', 'f6e5d4c3b2a1'],
          urls: ['https://suspicious-domain.com/login', 'https://fake-bank.net/verify'],
          patterns: ['email_spoofing', 'urgency_tactics', 'brand_impersonation']
        },
        frequency: {
          daily: 15,
          weekly: 105,
          monthly: 450,
          trend: 'increasing'
        },
        geography: {
          countries: ['US', 'UK', 'CA', 'AU'],
          regions: ['North America', 'Europe'],
          hotspots: [
            { country: 'US', count: 200, percentage: 45 },
            { country: 'UK', count: 120, percentage: 27 }
          ]
        },
        timeline: [
          { date: '2024-01-01', count: 12, severity: 'high' },
          { date: '2024-01-02', count: 18, severity: 'high' },
          { date: '2024-01-03', count: 15, severity: 'medium' }
        ],
        relatedPatterns: ['brand_impersonation', 'email_spoofing', 'social_engineering'],
        mitigation: {
          prevention: ['Email filtering', 'User training', 'DMARC implementation'],
          detection: ['Pattern matching', 'ML classification', 'URL analysis'],
          response: ['Block malicious domains', 'User notification', 'Incident response']
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      },
      {
        id: 'pattern-2',
        name: 'Ransomware-as-a-Service',
        description: 'Ransomware attacks delivered through cloud services',
        category: 'ransomware',
        severity: 'critical',
        confidence: 0.92,
        indicators: {
          keywords: ['encrypt', 'ransom', 'bitcoin', 'payment', 'decrypt'],
          domains: ['malicious-cdn.com', 'ransomware-host.net'],
          ips: ['203.0.113.45', '198.51.100.10'],
          hashes: ['c3d4e5f6a1b2', 'b2a1f6e5d4c3'],
          urls: ['https://malicious-cdn.com/payload', 'https://ransomware-host.net/decrypt'],
          patterns: ['file_encryption', 'payment_demand', 'lateral_movement']
        },
        frequency: {
          daily: 8,
          weekly: 56,
          monthly: 240,
          trend: 'stable'
        },
        geography: {
          countries: ['US', 'DE', 'FR', 'JP'],
          regions: ['North America', 'Europe', 'Asia'],
          hotspots: [
            { country: 'US', count: 80, percentage: 33 },
            { country: 'DE', count: 60, percentage: 25 }
          ]
        },
        timeline: [
          { date: '2024-01-01', count: 10, severity: 'critical' },
          { date: '2024-01-02', count: 6, severity: 'critical' },
          { date: '2024-01-03', count: 8, severity: 'high' }
        ],
        relatedPatterns: ['file_encryption', 'lateral_movement', 'payment_extortion'],
        mitigation: {
          prevention: ['Endpoint protection', 'Network segmentation', 'Backup strategies'],
          detection: ['Behavioral analysis', 'File monitoring', 'Network traffic analysis'],
          response: ['Isolate affected systems', 'Restore from backup', 'Incident response']
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      }
    ];

    mockPatterns.forEach(pattern => {
      this.patterns.set(pattern.id, pattern);
    });
  }

  private initializeMockModels(): void {
    const mockModels: MLModel[] = [
      {
        id: 'model-1',
        name: 'Threat Classification Model',
        type: 'classification',
        category: 'threat',
        version: '1.0.0',
        status: 'active',
        accuracy: 0.94,
        precision: 0.92,
        recall: 0.89,
        f1Score: 0.90,
        features: ['email_content', 'url_analysis', 'domain_reputation', 'sender_analysis'],
        hyperparameters: {
          learning_rate: 0.001,
          batch_size: 32,
          epochs: 100,
          dropout: 0.2
        },
        trainingData: {
          samples: 50000,
          features: 150,
          classes: 5,
          lastTrained: new Date().toISOString()
        },
        deployment: {
          endpoint: '/api/analytics/classify',
          version: '1.0.0',
          deployedAt: new Date().toISOString(),
          health: 'healthy'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'model-2',
        name: 'Anomaly Detection Model',
        type: 'anomaly_detection',
        category: 'behavior',
        version: '1.0.0',
        status: 'active',
        accuracy: 0.88,
        precision: 0.85,
        recall: 0.82,
        f1Score: 0.83,
        features: ['network_traffic', 'user_behavior', 'system_logs', 'api_usage'],
        hyperparameters: {
          contamination_rate: 0.1,
          n_neighbors: 20,
          algorithm: 'isolation_forest'
        },
        trainingData: {
          samples: 100000,
          features: 200,
          classes: 2,
          lastTrained: new Date().toISOString()
        },
        deployment: {
          endpoint: '/api/analytics/detect-anomaly',
          version: '1.0.0',
          deployedAt: new Date().toISOString(),
          health: 'healthy'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    mockModels.forEach(model => {
      this.models.set(model.id, model);
    });
  }

  // Pattern Analysis Methods
  async analyzeThreat(threatData: any): Promise<ThreatAnalysis> {
    try {
      const analysisId = `analysis-${Date.now()}`;
      
      // Extract features from threat data
      const features = this.extractFeatures(threatData);
      
      // Classify threat using ML models
      const classification = await this.classifyThreat(features);
      
      // Detect anomalies
      const anomalyScore = await this.detectAnomalies(features);
      
      // Generate insights
      const insights = this.generateInsights(features, classification, anomalyScore);
      
      // Calculate risk score
      const riskScore = this.calculateRiskScore(classification, anomalyScore, features);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(classification, anomalyScore, insights);

      const analysis: ThreatAnalysis = {
        id: analysisId,
        threatId: threatData.id || 'unknown',
        analysisType: 'pattern',
        confidence: classification.confidence,
        insights,
        recommendations,
        riskScore,
        metadata: {
          model: classification.model,
          version: classification.version,
          features: Object.keys(features),
          trainingData: 'threat_intelligence_dataset',
          accuracy: classification.accuracy
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.analyses.set(analysisId, analysis);
      return analysis;
    } catch (error) {
      console.error('Threat analysis error:', error);
      throw new Error(`Failed to analyze threat: ${error.message}`);
    }
  }

  private extractFeatures(threatData: any): Record<string, any> {
    return {
      // Content features
      content_length: threatData.description?.length || 0,
      keyword_density: this.calculateKeywordDensity(threatData.description || ''),
      urgency_score: this.calculateUrgencyScore(threatData.description || ''),
      
      // Technical features
      domain_age: this.calculateDomainAge(threatData.indicators?.domains || []),
      ip_reputation: this.calculateIPReputation(threatData.indicators?.ips || []),
      hash_complexity: this.calculateHashComplexity(threatData.indicators?.hashes || []),
      
      // Temporal features
      hour_of_day: new Date().getHours(),
      day_of_week: new Date().getDay(),
      time_since_last_similar: this.calculateTimeSinceLastSimilar(threatData),
      
      // Geographic features
      country_risk: this.calculateCountryRisk(threatData.geography?.countries || []),
      
      // Behavioral features
      attack_complexity: this.calculateAttackComplexity(threatData),
      target_specificity: this.calculateTargetSpecificity(threatData)
    };
  }

  private async classifyThreat(features: Record<string, any>): Promise<any> {
    // Mock classification - in production, this would use actual ML models
    const model = this.models.get('model-1');
    
    if (!model || model.status !== 'active') {
      return {
        model: 'threat_classifier',
        version: '1.0.0',
        confidence: 0.5,
        prediction: 'unknown',
        accuracy: 0.5
      };
    }

    // Simulate ML classification
    const score = Math.random();
    let prediction = 'benign';
    let confidence = 0.5;

    if (score > 0.7) {
      prediction = 'malware';
      confidence = 0.85 + Math.random() * 0.1;
    } else if (score > 0.5) {
      prediction = 'phishing';
      confidence = 0.75 + Math.random() * 0.1;
    } else if (score > 0.3) {
      prediction = 'vulnerability';
      confidence = 0.65 + Math.random() * 0.1;
    }

    return {
      model: model.name,
      version: model.version,
      confidence,
      prediction,
      accuracy: model.accuracy
    };
  }

  private async detectAnomalies(features: Record<string, any>): Promise<number> {
    // Mock anomaly detection - in production, this would use actual ML models
    const model = this.models.get('model-2');
    
    if (!model || model.status !== 'active') {
      return 0.5;
    }

    // Simulate anomaly detection
    const anomalyScore = Math.random();
    return anomalyScore;
  }

  private generateInsights(features: Record<string, any>, classification: any, anomalyScore: number): string[] {
    const insights: string[] = [];

    // Classification insights
    if (classification.confidence > 0.8) {
      insights.push(`High confidence ${classification.prediction} threat detected`);
    }

    // Anomaly insights
    if (anomalyScore > 0.7) {
      insights.push('Unusual behavior pattern detected');
    }

    // Feature-based insights
    if (features.urgency_score > 0.8) {
      insights.push('High urgency indicators present');
    }

    if (features.domain_age < 30) {
      insights.push('Recently registered domain detected');
    }

    if (features.ip_reputation < 0.3) {
      insights.push('Suspicious IP address detected');
    }

    return insights;
  }

  private calculateRiskScore(classification: any, anomalyScore: number, features: Record<string, any>): number {
    let riskScore = 0;

    // Classification risk
    const threatRisk = {
      'malware': 0.8,
      'phishing': 0.6,
      'apt': 0.9,
      'ransomware': 0.95,
      'vulnerability': 0.4,
      'benign': 0.1
    };

    riskScore += (threatRisk[classification.prediction] || 0.1) * classification.confidence;

    // Anomaly risk
    riskScore += anomalyScore * 0.3;

    // Feature risk
    riskScore += features.urgency_score * 0.2;
    riskScore += (1 - features.domain_age / 365) * 0.1;
    riskScore += (1 - features.ip_reputation) * 0.15;

    return Math.min(riskScore, 1.0);
  }

  private generateRecommendations(classification: any, anomalyScore: number, insights: string[]): string[] {
    const recommendations: string[] = [];

    // Classification-based recommendations
    switch (classification.prediction) {
      case 'malware':
        recommendations.push('Scan affected systems with updated antivirus');
        recommendations.push('Isolate potentially infected endpoints');
        recommendations.push('Review recent file downloads and email attachments');
        break;
      case 'phishing':
        recommendations.push('Block suspicious domains and URLs');
        recommendations.push('Educate users about phishing techniques');
        recommendations.push('Implement advanced email filtering');
        break;
      case 'apt':
        recommendations.push('Enhance network monitoring and logging');
        recommendations.push('Implement threat hunting procedures');
        recommendations.push('Review privileged account access');
        break;
      case 'ransomware':
        recommendations.push('Ensure regular backups are maintained');
        recommendations.push('Implement file integrity monitoring');
        recommendations.push('Prepare incident response plan');
        break;
      case 'vulnerability':
        recommendations.push('Apply security patches promptly');
        recommendations.push('Conduct vulnerability assessments');
        recommendations.push('Implement vulnerability management program');
        break;
    }

    // Anomaly-based recommendations
    if (anomalyScore > 0.7) {
      recommendations.push('Investigate unusual system behavior');
      recommendations.push('Review recent system changes');
      recommendations.push('Monitor for potential compromise');
    }

    return recommendations;
  }

  // Pattern Recognition Methods
  async recognizePatterns(threatData: any[]): Promise<ThreatPattern[]> {
    try {
      const patterns: ThreatPattern[] = [];

      for (const threat of threatData) {
        // Check against existing patterns
        const matchedPatterns = await this.matchAgainstPatterns(threat);
        
        if (matchedPatterns.length > 0) {
          patterns.push(...matchedPatterns);
        } else {
          // Generate new pattern if significant
          const newPattern = await this.generateNewPattern(threat);
          if (newPattern) {
            patterns.push(newPattern);
          }
        }
      }

      return patterns;
    } catch (error) {
      console.error('Pattern recognition error:', error);
      throw new Error(`Failed to recognize patterns: ${error.message}`);
    }
  }

  private async matchAgainstPatterns(threatData: any): Promise<ThreatPattern[]> {
    const matchedPatterns: ThreatPattern[] = [];

    for (const pattern of this.patterns.values()) {
      if (!pattern.isActive) continue;

      let matchScore = 0;
      let totalChecks = 0;

      // Check keyword matches
      if (threatData.description) {
        const keywords = threatData.description.toLowerCase().split(' ');
        const keywordMatches = keywords.filter(keyword => 
          pattern.indicators.keywords.includes(keyword.toLowerCase())
        ).length;
        
        matchScore += keywordMatches / keywords.length;
        totalChecks++;
      }

      // Check domain matches
      if (threatData.indicators?.domains) {
        const domainMatches = threatData.indicators.domains.filter(domain =>
          pattern.indicators.domains.includes(domain)
        ).length;
        
        matchScore += domainMatches / threatData.indicators.domains.length;
        totalChecks++;
      }

      // Check IP matches
      if (threatData.indicators?.ips) {
        const ipMatches = threatData.indicators.ips.filter(ip =>
          pattern.indicators.ips.includes(ip)
        ).length;
        
        matchScore += ipMatches / threatData.indicators.ips.length;
        totalChecks++;
      }

      // Calculate overall match score
      const overallScore = totalChecks > 0 ? matchScore / totalChecks : 0;

      if (overallScore > 0.6) {
        matchedPatterns.push(pattern);
      }
    }

    return matchedPatterns;
  }

  private async generateNewPattern(threatData: any): Promise<ThreatPattern | null> {
    // Only generate new patterns for significant threats
    if (threatData.severity !== 'critical' && threatData.severity !== 'high') {
      return null;
    }

    const pattern: ThreatPattern = {
      id: `pattern-${Date.now()}`,
      name: `New Pattern: ${threatData.name || 'Unknown'}`,
      description: `Automatically generated pattern from threat: ${threatData.id}`,
      category: threatData.category || 'malware',
      severity: threatData.severity || 'medium',
      confidence: 0.7,
      indicators: {
        keywords: this.extractKeywords(threatData.description || ''),
        domains: threatData.indicators?.domains || [],
        ips: threatData.indicators?.ips || [],
        hashes: threatData.indicators?.hashes || [],
        urls: threatData.indicators?.urls || [],
        patterns: this.extractPatterns(threatData)
      },
      frequency: {
        daily: 1,
        weekly: 1,
        monthly: 1,
        trend: 'stable'
      },
      geography: {
        countries: threatData.geography?.countries || [],
        regions: threatData.geography?.regions || [],
        hotspots: []
      },
      timeline: [{
        date: new Date().toISOString().split('T')[0],
        count: 1,
        severity: threatData.severity || 'medium'
      }],
      relatedPatterns: [],
      mitigation: {
        prevention: ['Implement security controls'],
        detection: ['Enhance monitoring'],
        response: ['Incident response procedures']
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };

    this.patterns.set(pattern.id, pattern);
    return pattern;
  }

  // Utility Methods
  private calculateKeywordDensity(text: string): number {
    const keywords = ['urgent', 'suspended', 'verify', 'click', 'payment', 'encrypt'];
    const words = text.toLowerCase().split(' ');
    const keywordCount = words.filter(word => keywords.includes(word)).length;
    return words.length > 0 ? keywordCount / words.length : 0;
  }

  private calculateUrgencyScore(text: string): number {
    const urgencyWords = ['urgent', 'immediate', 'asap', 'critical', 'emergency'];
    const words = text.toLowerCase().split(' ');
    const urgencyCount = words.filter(word => urgencyWords.includes(word)).length;
    return words.length > 0 ? urgencyCount / words.length : 0;
  }

  private calculateDomainAge(domains: string[]): number {
    // Mock calculation - in production, this would check actual domain registration dates
    return domains.length > 0 ? Math.random() * 365 : 365;
  }

  private calculateIPReputation(ips: string[]): number {
    // Mock calculation - in production, this would check actual IP reputation
    return ips.length > 0 ? Math.random() : 1.0;
  }

  private calculateHashComplexity(hashes: string[]): number {
    // Mock calculation based on hash length and entropy
    if (hashes.length === 0) return 0;
    
    const avgLength = hashes.reduce((sum, hash) => sum + hash.length, 0) / hashes.length;
    return Math.min(avgLength / 64, 1.0);
  }

  private calculateTimeSinceLastSimilar(threatData: any): number {
    // Mock calculation - in production, this would check against historical data
    return Math.random() * 30; // days
  }

  private calculateCountryRisk(countries: string[]): number {
    // Mock calculation - in production, this would use actual country risk data
    const riskCountries = ['CN', 'RU', 'KP', 'IR'];
    const riskCount = countries.filter(country => riskCountries.includes(country)).length;
    return countries.length > 0 ? riskCount / countries.length : 0;
  }

  private calculateAttackComplexity(threatData: any): number {
    // Mock calculation based on threat characteristics
    let complexity = 0.5;
    
    if (threatData.indicators?.domains?.length > 1) complexity += 0.1;
    if (threatData.indicators?.ips?.length > 1) complexity += 0.1;
    if (threatData.indicators?.hashes?.length > 1) complexity += 0.1;
    if (threatData.geography?.countries?.length > 1) complexity += 0.1;
    
    return Math.min(complexity, 1.0);
  }

  private calculateTargetSpecificity(threatData: any): number {
    // Mock calculation based on targeting indicators
    let specificity = 0.5;
    
    if (threatData.description?.includes('targeted')) specificity += 0.2;
    if (threatData.description?.includes('personalized')) specificity += 0.2;
    if (threatData.indicators?.domains?.length === 1) specificity += 0.1;
    
    return Math.min(specificity, 1.0);
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction - in production, this would use NLP
    const words = text.toLowerCase().split(' ');
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'];
    
    return words
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .slice(0, 10);
  }

  private extractPatterns(threatData: any): string[] {
    // Mock pattern extraction - in production, this would use pattern recognition algorithms
    const patterns: string[] = [];
    
    if (threatData.category === 'phishing') {
      patterns.push('email_spoofing', 'urgency_tactics');
    }
    
    if (threatData.category === 'malware') {
      patterns.push('file_encryption', 'persistence_mechanism');
    }
    
    return patterns;
  }

  // Public API Methods
  async getPatterns(options: {
    category?: string;
    severity?: string;
    active?: boolean;
    limit?: number;
  } = {}): Promise<ThreatPattern[]> {
    let patterns = Array.from(this.patterns.values());

    // Apply filters
    if (options.category) {
      patterns = patterns.filter(p => p.category === options.category);
    }
    
    if (options.severity) {
      patterns = patterns.filter(p => p.severity === options.severity);
    }
    
    if (options.active !== undefined) {
      patterns = patterns.filter(p => p.isActive === options.active);
    }

    // Apply limit
    if (options.limit) {
      patterns = patterns.slice(0, options.limit);
    }

    return patterns;
  }

  async getModels(options: {
    type?: string;
    category?: string;
    status?: string;
    limit?: number;
  } = {}): Promise<MLModel[]> {
    let models = Array.from(this.models.values());

    // Apply filters
    if (options.type) {
      models = models.filter(m => m.type === options.type);
    }
    
    if (options.category) {
      models = models.filter(m => m.category === options.category);
    }
    
    if (options.status) {
      models = models.filter(m => m.status === options.status);
    }

    // Apply limit
    if (options.limit) {
      models = models.slice(0, options.limit);
    }

    return models;
  }

  async getAnalyses(options: {
    threatId?: string;
    analysisType?: string;
    limit?: number;
  } = {}): Promise<ThreatAnalysis[]> {
    let analyses = Array.from(this.analyses.values());

    // Apply filters
    if (options.threatId) {
      analyses = analyses.filter(a => a.threatId === options.threatId);
    }
    
    if (options.analysisType) {
      analyses = analyses.filter(a => a.analysisType === options.analysisType);
    }

    // Apply limit
    if (options.limit) {
      analyses = analyses.slice(0, options.limit);
    }

    return analyses;
  }

  async createPattern(pattern: Omit<ThreatPattern, 'id' | 'createdAt' | 'updatedAt'>): Promise<ThreatPattern> {
    const newPattern: ThreatPattern = {
      ...pattern,
      id: `pattern-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.patterns.set(newPattern.id, newPattern);
    return newPattern;
  }

  async updatePattern(id: string, updates: Partial<ThreatPattern>): Promise<ThreatPattern> {
    const pattern = this.patterns.get(id);
    if (!pattern) {
      throw new Error(`Pattern not found: ${id}`);
    }

    const updatedPattern = {
      ...pattern,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.patterns.set(id, updatedPattern);
    return updatedPattern;
  }

  async deletePattern(id: string): Promise<boolean> {
    return this.patterns.delete(id);
  }

  async getAnalytics(): Promise<{
    totalPatterns: number;
    totalAnalyses: number;
    totalModels: number;
    activeModels: number;
    averageConfidence: number;
    topCategories: Array<{ category: string; count: number }>;
    recentActivity: Array<{ date: string; analyses: number }>;
  }> {
    const patterns = Array.from(this.patterns.values());
    const analyses = Array.from(this.analyses.values());
    const models = Array.from(this.models.values());

    const totalPatterns = patterns.length;
    const totalAnalyses = analyses.length;
    const totalModels = models.length;
    const activeModels = models.filter(m => m.status === 'active').length;
    
    const averageConfidence = analyses.length > 0 
      ? analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length 
      : 0;

    const categoryCounts = patterns.reduce((counts, p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const recentActivity = this.calculateRecentActivity(analyses);

    return {
      totalPatterns,
      totalAnalyses,
      totalModels,
      activeModels,
      averageConfidence,
      topCategories,
      recentActivity
    };
  }

  private calculateRecentActivity(analyses: ThreatAnalysis[]): Array<{ date: string; analyses: number }> {
    const activity: Record<string, number> = {};
    
    analyses.forEach(analysis => {
      const date = analysis.createdAt.split('T')[0];
      activity[date] = (activity[date] || 0) + 1;
    });

    return Object.entries(activity)
      .map(([date, analyses]) => ({ date, analyses }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 30);
  }
}

// Singleton instance
let threatPatternAnalyzer: ThreatPatternAnalyzer | null = null;

export function getThreatPatternAnalyzer(): ThreatPatternAnalyzer {
  if (!threatPatternAnalyzer) {
    const config: AnalyticsConfig = {
      ml: {
        models: {
          threatClassifier: {
            enabled: true,
            modelPath: '/models/threat_classifier.pkl',
            threshold: 0.7
          },
          anomalyDetector: {
            enabled: true,
            modelPath: '/models/anomaly_detector.pkl',
            sensitivity: 0.8
          },
          patternRecognizer: {
            enabled: true,
            modelPath: '/models/pattern_recognizer.pkl',
            minConfidence: 0.6
          },
          threatPredictor: {
            enabled: true,
            modelPath: '/models/threat_predictor.pkl',
            predictionWindow: 24
          }
        },
        training: {
          batchSize: 32,
          learningRate: 0.001,
          epochs: 100,
          validationSplit: 0.2,
          retrainInterval: 7 * 24 * 60 * 60 * 1000 // 7 days
        },
        deployment: {
          autoDeploy: true,
          healthCheckInterval: 5 * 60 * 1000, // 5 minutes
          rollbackThreshold: 0.8
        }
      },
      analytics: {
        retention: {
          patterns: 90,
          analyses: 30,
          models: 180
        },
        aggregation: {
          window: 1,
          granularity: 'hour'
        },
        alerts: {
          confidenceThreshold: 0.8,
          riskScoreThreshold: 0.7,
          anomalyThreshold: 0.7
        }
      }
    };
    
    threatPatternAnalyzer = new ThreatPatternAnalyzer(config);
  }
  return threatPatternAnalyzer;
}
