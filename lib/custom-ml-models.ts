// Custom ML Models for TrustHire
// Organization-specific training and deployment

export interface TrainingData {
  id: string;
  type: 'communication' | 'threat' | 'behavior' | 'profile';
  organizationId: string;
  inputs: any;
  expectedOutput: any;
  timestamp: number;
  feedback?: {
    accuracy: number; // 0-100
    correctPredictions: string[];
    missedThreats: string[];
    falsePositives: string[];
  };
}

export interface ModelConfig {
  id: string;
  name: string;
  type: 'communication' | 'threat' | 'behavior' | 'profile';
  organizationId: string;
  version: string;
  modelType: 'neural_network' | 'random_forest' | 'svm' | 'ensemble';
  hyperparameters: Record<string, any>;
  trainingDataSize: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  createdAt: string;
  lastTrained: string;
  isActive: boolean;
}

export interface PredictionResult {
  modelId: string;
  prediction: any;
  confidence: number; // 0-100
  explanation: string;
  features: Record<string, number>;
  processingTime: number;
}

export class CustomMLModels {
  private models: Map<string, ModelConfig> = new Map();
  private trainingData: Map<string, TrainingData[]> = new Map();
  private featureExtractors: Map<string, (data: any) => Record<string, number>> = new Map();

  constructor() {
    this.initializeFeatureExtractors();
    this.initializeDefaultModels();
  }

  // Initialize feature extractors for different data types
  private initializeFeatureExtractors(): void {
    // Communication features
    this.featureExtractors.set('communication', (data: any) => {
      const message = data.message || '';
      const context = data.context || {};
      
      return {
        // Text features
        messageLength: message.length,
        wordCount: message.split(/\s+/).length,
        sentenceCount: message.split(/[.!?]+/).length,
        exclamationCount: (message.match(/!/g) || []).length,
        questionCount: (message.match(/\?/g) || []).length,
        urgencyWords: (message.match(/\b(urgent|immediately|asap|now|quick|fast)\b/gi) || []).length,
        
        // Suspicious patterns
        personalInfoRequests: (message.match(/\b(ssn|social security|bank account|credit card|password|private key)\b/gi) || []).length,
        externalLinks: (message.match(/https?:\/\/[^\s]+/gi) || []).length,
        fileRequests: (message.match(/\b(download|upload|install|run|execute|open)\b/gi) || []).length,
        
        // Professionalism indicators
        grammarErrors: this.estimateGrammarErrors(message),
        professionalLanguage: this.estimateProfessionalism(message),
        companyMentions: (message.match(/\b(company|corporation|inc|llc|ltd)\b/gi) || []).length,
        
        // Context features
        platformScore: this.getPlatformRiskScore(context.platform),
        senderProfileCompleteness: this.estimateProfileCompleteness(context.senderProfile),
        communicationFrequency: context.previousMessages?.length || 0,
      };
    });

    // Threat features
    this.featureExtractors.set('threat', (data: any) => {
      const code = data.code || '';
      const urls = data.urls || [];
      const files = data.files || [];
      
      return {
        // Code features
        codeLength: code.length,
        lineCount: code.split('\n').length,
        complexity: this.estimateCodeComplexity(code),
        
        // Suspicious code patterns
        dynamicExecution: (code.match(/eval\s*\(|Function\s*\(/gi) || []).length,
        processExecution: (code.match(/child_process\.(exec|spawn|fork)/gi) || []).length,
        environmentAccess: (code.match(/process\.env|process\.argv/gi) || []).length,
        networkRequests: (code.match(/(fetch|axios|http|https|curl|wget)/gi) || []).length,
        fileSystemAccess: (code.match(/fs\.|path\.|os\./gi) || []).length,
        cryptoOperations: (code.match(/(crypto|encrypt|decrypt|hash|sign|verify)/gi) || []).length,
        
        // URL features
        suspiciousDomains: urls.filter(url => this.isSuspiciousDomain(url)).length,
        externalServices: urls.length,
        shortUrls: urls.filter(url => this.isShortUrl(url)).length,
        
        // File features
        executableFiles: files.filter(f => this.isExecutableFile(f.name || '')).length,
        suspiciousFiles: files.filter(f => this.isSuspiciousFile(f.name || '')).length,
        totalFileSize: files.reduce((sum, f) => sum + (f.size || 0), 0),
        
        // Context features
        repositoryAge: this.estimateRepositoryAge(data.repositoryUrl),
        contributorCount: this.estimateContributorCount(data.repositoryUrl),
      };
    });

    // Behavioral features
    this.featureExtractors.set('behavioral', (data: any) => {
      const monitor = data.monitor || {};
      
      return {
        // Network features
        networkRequestCount: monitor.networkRequests?.length || 0,
        suspiciousNetworkRequests: monitor.networkRequests?.filter((r: any) => 
          this.isSuspiciousNetworkRequest(r)
        ).length || 0,
        uniqueDomains: new Set(monitor.networkRequests?.map((r: any) => 
          new URL(r.url).hostname
        ) || []).size,
        
        // File system features
        fileOperationCount: monitor.fileOperations?.length || 0,
        suspiciousFileOperations: monitor.fileOperations?.filter((f: any) => 
          this.isSuspiciousFileOperation(f)
        ).length || 0,
        systemFileAccess: monitor.fileOperations?.filter((f: any) => 
          this.isSystemFile(f.path)
        ).length || 0,
        
        // Process features
        processCount: monitor.processCreations?.length || 0,
        suspiciousProcesses: monitor.processCreations?.filter((p: any) => 
          this.isSuspiciousProcess(p)
        ).length || 0,
        uniqueCommands: new Set(monitor.processCreations?.map((p: any) => p.command) || []).size,
        
        // Memory features
        maxMemoryUsage: Math.max(...(monitor.memoryUsage?.map((m: any) => m.total) || [0])),
        memoryGrowthRate: this.calculateMemoryGrowthRate(monitor.memoryUsage || []),
        
        // Temporal features
        executionDuration: monitor.duration || 0,
        rapidOperations: this.countRapidOperations(monitor),
        
        // Anomaly features
        anomalyCount: monitor.anomalies?.length || 0,
        criticalAnomalies: monitor.anomalies?.filter((a: any) => 
          a.riskLevel === 'critical'
        ).length || 0,
      };
    });

    // Profile features
    this.featureExtractors.set('profile', (data: any) => {
      const profile = data.profile || {};
      const connections = profile.connections || [];
      
      return {
        // Completeness features (convert booleans to numbers)
        hasName: profile.name ? 1 : 0,
        hasHeadline: profile.headline ? 1 : 0,
        hasCompany: profile.company ? 1 : 0,
        hasExperience: profile.experience ? 1 : 0,
        hasConnections: connections.length > 0 ? 1 : 0,
        hasActivity: profile.activity ? 1 : 0,
        completenessScore: Object.keys(profile).length / 10,
        
        // Network features
        connectionCount: connections.length,
        connectionGrowthRate: profile.connectionGrowthRate || 0,
        networkQuality: this.calculateNetworkQuality(connections),
        mutualConnections: profile.mutualConnections || 0,
        followerRatio: profile.followerRatio || 0,
        
        // Activity features
        postFrequency: profile.postFrequency || 0,
        lastActiveDays: profile.lastActiveDays || 0,
        regularityScore: profile.regularityScore || 0,
        engagementRate: profile.engagementRate || 0,
        professionalLanguage: this.estimateProfileProfessionalism(profile),
        
        // Verification features
        hasVerifiedEmail: this.hasVerifiedEmail(profile) ? 1 : 0,
        hasVerifiedPhone: this.hasVerifiedPhone(profile) ? 1 : 0,
        hasProfilePhoto: !!profile.profilePhoto ? 1 : 0,
        verificationBadges: profile.verificationBadges?.length || 0,
      };
    });
  }

  // Initialize default models
  private initializeDefaultModels(): void {
    const defaultModels: Omit<ModelConfig, 'id' | 'organizationId' | 'createdAt'>[] = [
      {
        name: 'Communication Analysis Model',
        type: 'communication',
        version: '1.0.0',
        modelType: 'neural_network',
        hyperparameters: {
          layers: [128, 64, 32],
          activation: 'relu',
          dropout: 0.2,
          learningRate: 0.001,
          epochs: 100,
          batchSize: 32,
        },
        trainingDataSize: 0,
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0,
        lastTrained: new Date().toISOString(),
        isActive: true,
      },
      {
        name: 'Threat Detection Model',
        type: 'threat',
        version: '1.0.0',
        modelType: 'random_forest',
        hyperparameters: {
          nEstimators: 100,
          maxDepth: 10,
          minSamplesSplit: 2,
          minSamplesLeaf: 1,
          randomState: 42,
        },
        trainingDataSize: 0,
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0,
        lastTrained: new Date().toISOString(),
        isActive: true,
      },
      {
        name: 'Behavioral Analysis Model',
        type: 'behavior',
        version: '1.0.0',
        modelType: 'ensemble',
        hyperparameters: {
          baseModels: ['random_forest', 'svm'],
          voting: 'soft',
          weights: [0.6, 0.4],
        },
        trainingDataSize: 0,
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0,
        lastTrained: new Date().toISOString(),
        isActive: true,
      },
      {
        name: 'Profile Authenticity Model',
        type: 'profile',
        version: '1.0.0',
        modelType: 'svm',
        hyperparameters: {
          kernel: 'rbf',
          C: 1.0,
          gamma: 'scale',
          probability: true,
        },
        trainingDataSize: 0,
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0,
        lastTrained: new Date().toISOString(),
        isActive: true,
      },
    ];

    // Add models for a default organization
    const organizationId = 'default';
    defaultModels.forEach((model, index) => {
      const fullModel: ModelConfig = {
        ...model,
        id: `${organizationId}-${model.type}-${index}`,
        organizationId,
        createdAt: new Date().toISOString(),
      };
      this.models.set(fullModel.id, fullModel);
    });
  }

  // Add training data
  addTrainingData(data: Omit<TrainingData, 'id' | 'timestamp'>): string {
    const id = `${data.type}-${data.organizationId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const trainingData: TrainingData = {
      ...data,
      id,
      timestamp: Date.now(),
    };

    if (!this.trainingData.has(`${data.type}-${data.organizationId}`)) {
      this.trainingData.set(`${data.type}-${data.organizationId}`, []);
    }
    
    this.trainingData.get(`${data.type}-${data.organizationId}`)!.push(trainingData);
    return id;
  }

  // Train a custom model
  async trainModel(organizationId: string, modelType: string, config?: Partial<ModelConfig>): Promise<ModelConfig> {
    const trainingDataKey = `${modelType}-${organizationId}`;
    const data = this.trainingData.get(trainingDataKey) || [];
    
    if (data.length < 10) {
      throw new Error(`Insufficient training data for ${modelType} model. Minimum 10 samples required.`);
    }

    // Get or create model config
    const existingModels = Array.from(this.models.values()).filter(
      m => m.organizationId === organizationId && m.type === modelType
    );
    
    let modelConfig: ModelConfig;
    if (existingModels.length > 0) {
      modelConfig = { ...existingModels[0], ...config };
    } else {
      const defaultConfig = Array.from(this.models.values()).find(
        m => m.type === modelType && m.organizationId === 'default'
      );
      
      if (!defaultConfig) {
        throw new Error(`No default model found for type: ${modelType}`);
      }
      
      modelConfig = {
        ...defaultConfig,
        id: `${organizationId}-${modelType}-${Date.now()}`,
        organizationId,
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        ...config,
      };
    }

    // Extract features and labels
    const featureExtractor = this.featureExtractors.get(modelType);
    if (!featureExtractor) {
      throw new Error(`No feature extractor found for type: ${modelType}`);
    }

    const features = data.map(item => featureExtractor(item.inputs));
    const labels = data.map(item => item.expectedOutput);

    // Train model (simplified - in production, this would use actual ML libraries)
    const trainingResult = await this.performTraining(features, labels, modelConfig);

    // Update model config with training results
    const trainedModel: ModelConfig = {
      ...modelConfig,
      trainingDataSize: data.length,
      accuracy: trainingResult.accuracy,
      precision: trainingResult.precision,
      recall: trainingResult.recall,
      f1Score: trainingResult.f1Score,
      lastTrained: new Date().toISOString(),
      isActive: true,
    };

    this.models.set(trainedModel.id, trainedModel);
    return trainedModel;
  }

  // Perform model training (simplified implementation)
  private async performTraining(
    features: Record<string, number>[],
    labels: any[],
    config: ModelConfig
  ): Promise<{ accuracy: number; precision: number; recall: number; f1Score: number }> {
    // This is a simplified training implementation
    // In production, this would use actual ML libraries like TensorFlow.js, scikit-learn, etc.
    
    // Simulate training time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate training metrics based on data size and complexity
    const dataSize = features.length;
    const featureCount = Object.keys(features[0] || {}).length;
    
    // Simulate metrics that improve with more data
    const baseAccuracy = Math.min(0.95, 0.5 + (dataSize / 1000) * 0.3);
    const basePrecision = Math.min(0.92, 0.45 + (dataSize / 1000) * 0.35);
    const baseRecall = Math.min(0.90, 0.4 + (dataSize / 1000) * 0.4);
    const baseF1 = 2 * (basePrecision * baseRecall) / (basePrecision + baseRecall);

    // Add some randomness to simulate real training variance
    const accuracy = baseAccuracy + (Math.random() - 0.5) * 0.05;
    const precision = basePrecision + (Math.random() - 0.5) * 0.05;
    const recall = baseRecall + (Math.random() - 0.5) * 0.05;
    const f1Score = 2 * (precision * recall) / (precision + recall);

    return {
      accuracy: Math.max(0, Math.min(1, accuracy)),
      precision: Math.max(0, Math.min(1, precision)),
      recall: Math.max(0, Math.min(1, recall)),
      f1Score: Math.max(0, Math.min(1, f1Score)),
    };
  }

  // Make prediction with custom model
  async predict(organizationId: string, modelType: string, data: any): Promise<PredictionResult> {
    const models = Array.from(this.models.values()).filter(
      m => m.organizationId === organizationId && m.type === modelType && m.isActive
    );

    if (models.length === 0) {
      throw new Error(`No active model found for ${modelType} in organization ${organizationId}`);
    }

    const model = models[0]; // Use the most recent model
    const featureExtractor = this.featureExtractors.get(modelType);
    
    if (!featureExtractor) {
      throw new Error(`No feature extractor found for type: ${modelType}`);
    }

    const features = featureExtractor(data);
    const startTime = Date.now();

    // Perform prediction (simplified implementation)
    const prediction = await this.performPrediction(features, model);

    const processingTime = Date.now() - startTime;

    return {
      modelId: model.id,
      prediction,
      confidence: prediction.confidence || 75,
      explanation: this.generateExplanation(prediction, features),
      features,
      processingTime,
    };
  }

  // Perform prediction (simplified implementation)
  private async performPrediction(
    features: Record<string, number>,
    model: ModelConfig
  ): Promise<{ prediction: any; confidence: number }> {
    // This is a simplified prediction implementation
    // In production, this would use the actual trained model

    // Simulate prediction time
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate prediction based on features (simplified logic)
    const prediction = this.generatePredictionFromFeatures(features, model.type);
    const confidence = this.calculatePredictionConfidence(features, model);

    return { prediction, confidence };
  }

  // Generate prediction from features (simplified logic)
  private generatePredictionFromFeatures(features: Record<string, number>, modelType: string): any {
    switch (modelType) {
      case 'communication':
        return {
          legitimacyScore: Math.max(0, Math.min(100, 100 - features.urgencyWords * 10 - features.suspiciousDomains * 15)),
          riskLevel: features.urgencyWords > 2 ? 'high' : features.suspiciousDomains > 0 ? 'medium' : 'low',
          suspiciousPatterns: features.suspiciousDomains > 0 ? ['External links'] : [],
          redFlags: features.personalInfoRequests > 0 ? ['Personal info requests'] : [],
        };

      case 'threat':
        const threatScore = features.dynamicExecution * 25 + features.processExecution * 20 + features.suspiciousDomains * 15;
        return {
          threatType: threatScore > 50 ? 'malware' : 'suspicious',
          probability: Math.min(100, threatScore),
          riskFactors: features.dynamicExecution > 0 ? ['Dynamic execution'] : [],
          indicators: features.suspiciousDomains > 0 ? ['Suspicious domains'] : [],
        };

      case 'behavioral':
        const anomalyScore = features.criticalAnomalies * 30 + features.suspiciousNetworkRequests * 15;
        return {
          anomalyType: anomalyScore > 40 ? 'suspicious_behavior' : 'normal',
          confidence: Math.min(100, anomalyScore),
          patterns: features.rapidOperations > 0 ? ['Rapid operations'] : [],
        };

      case 'profile':
        const authenticityScore = features.completenessScore + features.networkQuality * 10;
        return {
          authenticityScore: Math.min(100, authenticityScore),
          verificationStatus: authenticityScore > 70 ? 'verified' : 'suspicious',
          redFlags: features.hasVerifiedEmail ? [] : ['Unverified email'],
        };

      default:
        return { prediction: 'unknown', confidence: 50 };
    }
  }

  // Calculate prediction confidence
  private calculatePredictionConfidence(features: Record<string, number>, model: ModelConfig): number {
    // Simplified confidence calculation based on model accuracy and feature quality
    const baseConfidence = model.accuracy;
    const featureCount = Object.keys(features).length;
    const featureQuality = this.assessFeatureQuality(features);
    
    return Math.min(100, baseConfidence * featureQuality * (1 + featureCount / 100));
  }

  // Assess feature quality
  private assessFeatureQuality(features: Record<string, number>): number {
    // Simplified assessment - in production, this would be more sophisticated
    const nonZeroFeatures = Object.values(features).filter(v => v !== 0).length;
    const totalFeatures = Object.keys(features).length;
    
    return totalFeatures > 0 ? nonZeroFeatures / totalFeatures : 0;
  }

  // Generate explanation for prediction
  // Helper methods for profile analysis
  private calculateNetworkQuality(connections: any[]): number {
    if (!connections || connections.length === 0) return 0;
    
    // Simple network quality calculation based on connection count and profile completeness
    const avgConnections = connections.length;
    const qualityScore = Math.min(avgConnections / 100, 1); // Normalize to 0-1
    
    return qualityScore;
  }

  private estimateProfileProfessionalism(profile: any): number {
    let score = 0;
    
    // Check for professional elements
    if (profile.headline && profile.headline.length > 10) score += 0.2;
    if (profile.experience && profile.experience.length > 0) score += 0.3;
    if (profile.company) score += 0.2;
    if (profile.email && profile.email.includes('@')) score += 0.2;
    if (profile.summary && profile.summary.length > 50) score += 0.1;
    
    return Math.min(score, 1);
  }

  private hasVerifiedEmail(profile: any): boolean {
    return !!(profile.email && profile.emailVerified);
  }

  private hasVerifiedPhone(profile: any): boolean {
    return !!(profile.phone && profile.phoneVerified);
  }

  private generateExplanation(prediction: any, features: Record<string, number>): string {
    const significantFeatures = Object.entries(features)
      .filter(([, value]) => value !== 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    const featureDescriptions = significantFeatures.map(([name, value]) => {
      const formattedName = name.replace(/([A-Z])/g, ' $1').toLowerCase();
      return `${formattedName}: ${value}`;
    });

    return `Based on analysis of key features: ${featureDescriptions.join(', ')}. This led to the prediction: ${JSON.stringify(prediction).substring(0, 100)}...`;
  }

  // Helper methods for feature extraction
  private estimateGrammarErrors(text: string): number {
    // Simplified grammar error estimation
    const commonErrors = text.match(/\b(its|your|you're|they're|we're|dont|cant|wont|shouldnt|couldnt|wouldnt)\b/gi) || [];
    return commonErrors.length;
  }

  private estimateProfessionalism(text: string): number {
    const professionalWords = text.match(/\b(opportunity|position|role|experience|skills|qualified|professional|team|company|corporation|career|development|growth)\b/gi) || [];
    const unprofessionalWords = text.match(/\b(hey|yo|sup|dude|awesome|cool|wanna|gonna| kinda|sorta|stuff|thingy)\b/gi) || [];
    
    const totalWords = text.split(/\s+/).length;
    const professionalRatio = professionalWords.length / totalWords;
    const unprofessionalRatio = unprofessionalWords.length / totalWords;
    
    return Math.max(0, Math.min(100, (professionalRatio - unprofessionalRatio) * 100));
  }

  private getPlatformRiskScore(platform?: string): number {
    const riskScores: Record<string, number> = {
      'linkedin': 20,
      'email': 40,
      'telegram': 80,
      'whatsapp': 70,
      'discord': 90,
      'unknown': 50,
    };
    
    return riskScores[platform?.toLowerCase() || 'unknown'] || 50;
  }

  private estimateProfileCompleteness(profile: any): number {
    const fields = ['name', 'headline', 'company', 'experience', 'connections', 'activity'];
    const completedFields = fields.filter(field => profile[field]);
    return (completedFields.length / fields.length) * 100;
  }

  private estimateCodeComplexity(code: string): number {
    // Simplified complexity estimation
    const lines = code.split('\n').length;
    const controlStructures = (code.match(/\b(if|else|for|while|switch|case|try|catch|function|class)\b/gi) || []).length;
    const nesting = (code.match(/{/g) || []).length;
    
    return Math.min(100, (lines * 0.1 + controlStructures * 5 + nesting * 3));
  }

  private isSuspiciousDomain(url: string): boolean {
    const suspiciousDomains = [
      'pastebin.com', 'gist.github.com', 'bit.ly', 'tinyurl.com',
      't.me', 'discord.com', 'webhook.site', 'ngrok.io'
    ];
    
    try {
      const domain = new URL(url).hostname;
      return suspiciousDomains.some(suspicious => domain.includes(suspicious));
    } catch {
      return false;
    }
  }

  private isShortUrl(url: string): boolean {
    const shortUrlServices = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly'];
    return shortUrlServices.some(service => url.includes(service));
  }

  private isExecutableFile(filename: string): boolean {
    const executableExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.vbs', '.js', '.jar', '.app', '.deb', '.rpm', '.dmg', '.pkg', '.msi', '.ps1', '.sh', '.py'];
    const extension = filename.split('.').pop()?.toLowerCase();
    return executableExtensions.includes(`.${extension}`);
  }

  private isSuspiciousFile(filename: string): boolean {
    const suspiciousNames = ['setup', 'install', 'run', 'execute', 'crack', 'patch', 'keygen', 'loader', 'dropper'];
    const lowerFilename = filename.toLowerCase();
    return suspiciousNames.some(name => lowerFilename.includes(name));
  }

  private isSystemFile(path: string): boolean {
    const systemPaths = ['/etc/', '/bin/', '/usr/bin/', '/system/', '/windows/', '/system32/', '/program files/'];
    return systemPaths.some(sysPath => path.toLowerCase().includes(sysPath));
  }

  private isSuspiciousNetworkRequest(request: any): boolean {
    const url = request.url?.toLowerCase() || '';
    return this.isSuspiciousDomain(url) || 
           request.body?.includes('eval') || 
           request.body?.includes('exec');
  }

  private isSuspiciousFileOperation(operation: any): boolean {
    const path = operation.path?.toLowerCase() || '';
    return this.isSystemFile(path) || 
           path.includes('password') || 
           path.includes('key') || 
           path.includes('secret');
  }

  private isSuspiciousProcess(process: any): boolean {
    const suspiciousCommands = ['powershell', 'cmd', 'bash', 'sh', 'python', 'curl', 'wget', 'nc', 'netcat'];
    return suspiciousCommands.includes(process.command?.toLowerCase()) ||
           process.args?.some((arg: string) => arg.includes('http') || arg.includes('curl'));
  }

  private calculateMemoryGrowthRate(memoryUsage: any[]): number {
    if (memoryUsage.length < 2) return 0;
    
    const first = memoryUsage[0];
    const last = memoryUsage[memoryUsage.length - 1];
    const growth = last.total - first.total;
    const duration = last.timestamp - first.timestamp;
    
    return duration > 0 ? (growth / duration) * 1000 : 0; // growth per second
  }

  private countRapidOperations(monitor: any): number {
    const allOperations = [
      ...monitor.networkRequests,
      ...monitor.fileOperations,
      ...monitor.processCreations
    ];
    
    let rapidCount = 0;
    for (let i = 1; i < allOperations.length; i++) {
      const timeDiff = allOperations[i].timestamp - allOperations[i - 1].timestamp;
      if (timeDiff < 1000) { // Less than 1 second
        rapidCount++;
      }
    }
    
    return rapidCount;
  }

  private estimateRepositoryAge(repositoryUrl?: string): number {
    // Simplified repository age estimation
    return Math.floor(Math.random() * 365 * 5); // 0-5 years
  }

  private estimateContributorCount(repositoryUrl?: string): number {
    // Simplified contributor count estimation
    return Math.floor(Math.random() * 100) + 1;
  }

  private calculateProfileCompleteness(profile: any): number {
    const fields = ['name', 'headline', 'company', 'experience', 'connections', 'activity'];
    const completedFields = fields.filter(field => profile[field]);
    return (completedFields.length / fields.length) * 100;
  }

  private estimateConnectionGrowthRate(profile: any): number {
    // Simplified connection growth rate estimation
    return Math.random() * 10 - 5; // -5 to +5 per month
  }

  private estimateNetworkQuality(profile: any): number {
    const connections = profile.connections || 0;
    if (connections < 50) return 20;
    if (connections < 200) return 50;
    if (connections < 500) return 80;
    return 95;
  }

  private calculateAverageJobDuration(experience: any[]): number {
    if (experience.length === 0) return 0;
    
    const durations = experience.map((exp: any) => {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30); // months
    });
    
    return durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
  }

  private estimateCareerProgression(experience: any[]): number {
    if (experience.length < 2) return 50;
    
    let progression = 0;
    for (let i = 1; i < experience.length; i++) {
      const current = experience[i];
      const previous = experience[i - 1];
      
      if (current.level && previous.level) {
        const levels = ['intern', 'junior', 'mid', 'senior', 'lead', 'manager', 'director'];
        const currentIndex = levels.indexOf(current.level.toLowerCase());
        const previousIndex = levels.indexOf(previous.level.toLowerCase());
        
        if (currentIndex > previousIndex) {
          progression++;
        }
      }
    }
    
    return (progression / (experience.length - 1)) * 100;
  }

  private estimateActivityRegularity(activity: any[]): number {
    if (activity.length === 0) return 0;
    
    const now = Date.now();
    const recentActivity = activity.filter((a: any) => 
      now - new Date(a.timestamp).getTime() < 30 * 24 * 60 * 60 * 1000
    );
    
    const days = 30;
    return (recentActivity.length / days) * 100;
  }

  private extractKeywords(text: string): string[] {
    const keywords = text.toLowerCase().match(/\b(javascript|python|react|node|developer|engineer|manager|lead|senior|junior|fullstack|frontend|backend|devops|architect)\b/gi) || [];
    return Array.from(new Set(keywords));
  }

  
  // Get models for organization
  getModels(organizationId: string): ModelConfig[] {
    return Array.from(this.models.values()).filter(m => m.organizationId === organizationId);
  }

  // Get training data for organization
  getTrainingData(organizationId: string, type?: string): TrainingData[] {
    const allData = Array.from(this.trainingData.values()).flat();
    return allData.filter(d => 
      d.organizationId === organizationId && (!type || d.type === type)
    );
  }

  // Update model based on feedback
  async updateModelFromFeedback(
    organizationId: string,
    modelType: string,
    prediction: any,
    feedback: {
      accuracy: number;
      correctPredictions: string[];
      missedThreats: string[];
      falsePositives: string[];
    }
  ): Promise<void> {
    // Add feedback to training data for continuous learning
    this.addTrainingData({
      type: modelType as any,
      organizationId,
      inputs: prediction.features || {},
      expectedOutput: feedback.correctPredictions,
      feedback,
    });

    // Retrain model if enough feedback data is available
    const trainingData = this.getTrainingData(organizationId, modelType);
    if (trainingData.length >= 10) {
      await this.trainModel(organizationId, modelType);
    }
  }

  // Export model for backup
  exportModel(modelId: string): ModelConfig | null {
    return this.models.get(modelId) || null;
  }

  // Import model from backup
  importModel(model: ModelConfig): void {
    this.models.set(model.id, model);
  }

  // Delete model
  deleteModel(modelId: string): boolean {
    return this.models.delete(modelId);
  }
}

// Singleton instance
export const customMLModels = new CustomMLModels();

// React hook for using custom ML models
export function useCustomMLModels() {
  return customMLModels;
}

export default customMLModels;
