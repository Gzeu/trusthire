/**
 * Mistral AI Integration for TrustHire
 * Advanced AI capabilities with Mistral models for enhanced security analysis
 */

export interface MistralConfig {
  apiKey: string;
  model: 'mistral-tiny' | 'mistral-small' | 'mistral-medium' | 'mistral-large' | 'codestral';
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface MistralResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface SecurityAnalysisRequest {
  content: string;
  context?: {
    platform?: string;
    userRole?: string;
    previousInteractions?: string[];
    riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  };
  analysisType: 'threat_detection' | 'behavioral_analysis' | 'risk_assessment' | 'compliance_check';
}

export interface MistralSecurityAnalysis {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  indicators: string[];
  reasoning: string;
  recommendations: string[];
  riskFactors: Array<{
    factor: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }>;
  complianceIssues: Array<{
    standard: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    remediation: string;
  }>;
}

class MistralIntegration {
  private config: MistralConfig;
  private baseUrl: string = 'https://api.mistral.ai/v1';
  private rateLimit: Map<string, number> = new Map();
  private requestHistory: Array<{
    timestamp: number;
    model: string;
    tokens: number;
    success: boolean;
  }> = [];

  constructor(config: MistralConfig) {
    this.config = config;
    this.initializeRateLimiting();
  }

  private initializeRateLimiting(): void {
    // Initialize rate limiting for different models
    this.rateLimit.set('mistral-tiny', 0);
    this.rateLimit.set('mistral-small', 0);
    this.rateLimit.set('mistral-medium', 0);
    this.rateLimit.set('mistral-large', 0);
    this.rateLimit.set('codestral', 0);
  }

  async performSecurityAnalysis(request: SecurityAnalysisRequest): Promise<MistralSecurityAnalysis> {
    const prompt = this.generateSecurityPrompt(request);
    
    try {
      const mistralResponse = await this.callMistralAPI(prompt);
      const analysis = this.parseSecurityResponse(mistralResponse);
      
      // Log the request for analytics
      this.logRequest(request.analysisType, mistralResponse.usage.total_tokens, true);
      
      return analysis;
    } catch (error) {
      console.error('Mistral security analysis error:', error);
      this.logRequest(request.analysisType, 0, false);
      
      // Fallback response
      return {
        threatLevel: 'medium',
        confidence: 0.5,
        indicators: ['API error occurred'],
        reasoning: 'Analysis failed due to API error, manual review recommended',
        recommendations: ['Manual review required', 'Check API configuration'],
        riskFactors: [{
          factor: 'API Connectivity',
          severity: 'medium',
          description: 'Unable to perform automated analysis'
        }],
        complianceIssues: []
      };
    }
  }

  async analyzeCodeSecurity(code: string, language?: string): Promise<{
    vulnerabilities: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      line: number;
      description: string;
      recommendation: string;
    }>;
    securityScore: number;
    bestPractices: string[];
    compliance: Array<{
      standard: string;
      status: 'compliant' | 'non_compliant';
      issues: string[];
    }>;
  }> {
    const prompt = this.generateCodeAnalysisPrompt(code, language);
    
    try {
      const response = await this.callMistralAPI(prompt, 'codestral');
      return this.parseCodeAnalysisResponse(response);
    } catch (error) {
      console.error('Mistral code analysis error:', error);
      return {
        vulnerabilities: [],
        securityScore: 0,
        bestPractices: [],
        compliance: []
      };
    }
  }

  async generateThreatReport(threatData: {
    incidents: Array<{
      type: string;
      severity: string;
      description: string;
      timestamp: string;
    }>;
    trends: Array<{
      threat: string;
      frequency: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    }>;
    riskFactors: string[];
  }): Promise<{
    executiveSummary: string;
    detailedAnalysis: string;
    recommendations: string[];
    riskScore: number;
    futureOutlook: string;
  }> {
    const prompt = this.generateReportPrompt(threatData);
    
    try {
      const response = await this.callMistralAPI(prompt, 'mistral-large');
      return this.parseReportResponse(response);
    } catch (error) {
      console.error('Mistral report generation error:', error);
      return {
        executiveSummary: 'Unable to generate automated report',
        detailedAnalysis: 'Manual analysis required',
        recommendations: ['Manual review needed'],
        riskScore: 0,
        futureOutlook: 'Unknown'
      };
    }
  }

  async detectSocialEngineering(content: string, context?: {
    platform?: string;
    senderInfo?: string;
    previousMessages?: string[];
  }): Promise<{
    isSocialEngineering: boolean;
    confidence: number;
    techniques: string[];
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    manipulationType: string[];
    riskAssessment: string;
    recommendedActions: string[];
  }> {
    const prompt = this.generateSocialEngineeringPrompt(content, context);
    
    try {
      const response = await this.callMistralAPI(prompt);
      return this.parseSocialEngineeringResponse(response);
    } catch (error) {
      console.error('Mistral social engineering detection error:', error);
      return {
        isSocialEngineering: false,
        confidence: 0,
        techniques: [],
        urgencyLevel: 'low',
        manipulationType: [],
        riskAssessment: 'Analysis failed',
        recommendedActions: ['Manual review required']
      };
    }
  }

  private async callMistralAPI(prompt: string, model?: string): Promise<MistralResponse> {
    const selectedModel = model || this.config.model;
    
    // Check rate limiting
    await this.checkRateLimit(selectedModel);
    
    const requestBody = {
      model: selectedModel,
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt()
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
      top_p: this.config.topP,
      frequency_penalty: this.config.frequencyPenalty,
      presence_penalty: this.config.presencePenalty
    };

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as MistralResponse;
  }

  private getSystemPrompt(): string {
    return `You are an advanced AI security analyst for TrustHire, a comprehensive security platform. 
Your expertise includes:
- Threat detection and analysis
- Behavioral pattern recognition
- Risk assessment and mitigation
- Compliance checking and reporting
- Social engineering detection
- Code security analysis

Always provide:
1. Clear, actionable insights
2. Evidence-based reasoning
3. Specific recommendations
4. Risk severity assessments
5. Compliance considerations

Be thorough but concise. Focus on practical security implications.`;
  }

  private generateSecurityPrompt(request: SecurityAnalysisRequest): string {
    const contextInfo = request.context ? 
      `Context: Platform - ${request.context.platform || 'unknown'}, User Role - ${request.context.userRole || 'unknown'}, Risk Level - ${request.context.riskLevel || 'medium'}` : 
      'No additional context provided';

    return `Analyze the following content for security threats and risks:

${contextInfo}

Content to analyze:
"""
${request.content}
"""

Analysis type: ${request.analysisType}

Please provide a comprehensive security analysis including:
1. Threat level assessment (low/medium/high/critical)
2. Confidence score (0-1)
3. Specific threat indicators
4. Detailed reasoning
5. Actionable recommendations
6. Risk factors with severity levels
7. Compliance issues if applicable

Format your response as structured JSON for easy parsing.`;
  }

  private generateCodeAnalysisPrompt(code: string, language?: string): string {
    const langInfo = language ? `Language: ${language}` : 'Language: auto-detected';
    
    return `Analyze the following code for security vulnerabilities and best practices:

${langInfo}

Code to analyze:
"""
${code}
"""

Please identify:
1. Security vulnerabilities with severity levels and line numbers
2. Overall security score (0-100)
3. Security best practices violations
4. Compliance issues with relevant standards (OWASP, NIST, etc.)

Provide specific, actionable recommendations for each issue found.`;
  }

  private generateReportPrompt(threatData: any): string {
    return `Generate a comprehensive threat intelligence report based on the following data:

Recent Incidents:
${JSON.stringify(threatData.incidents, null, 2)}

Threat Trends:
${JSON.stringify(threatData.trends, null, 2)}

Risk Factors:
${threatData.riskFactors.join(', ')}

Please provide:
1. Executive summary for leadership
2. Detailed technical analysis
3. Specific recommendations
4. Overall risk score (0-100)
5. Future outlook and predictions

Focus on actionable insights and strategic recommendations.`;
  }

  private generateSocialEngineeringPrompt(content: string, context?: any): string {
    const contextInfo = context ? 
      `Context: Platform - ${context.platform || 'unknown'}, Sender - ${context.senderInfo || 'unknown'}, Previous messages - ${context.previousMessages?.length || 0}` : 
      'No additional context';

    return `Analyze this content for social engineering tactics:

${contextInfo}

Content:
"""
${content}
"""

Identify:
1. Is this social engineering? (true/false)
2. Confidence level (0-1)
3. Specific techniques used
4. Urgency level (low/medium/high/critical)
5. Manipulation types
6. Risk assessment
7. Recommended actions

Look for urgency, authority impersonation, social proof, scarcity, and other manipulation tactics.`;
  }

  private parseSecurityResponse(response: MistralResponse): MistralSecurityAnalysis {
    const content = response.choices[0]?.message?.content || '';
    
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(content);
      return {
        threatLevel: parsed.threatLevel || 'medium',
        confidence: parsed.confidence || 0.5,
        indicators: parsed.indicators || [],
        reasoning: parsed.reasoning || 'Analysis completed',
        recommendations: parsed.recommendations || [],
        riskFactors: parsed.riskFactors || [],
        complianceIssues: parsed.complianceIssues || []
      };
    } catch {
      // Fallback to text parsing
      return {
        threatLevel: this.extractThreatLevel(content),
        confidence: this.extractConfidence(content),
        indicators: this.extractIndicators(content),
        reasoning: content.substring(0, 500),
        recommendations: this.extractRecommendations(content),
        riskFactors: [],
        complianceIssues: []
      };
    }
  }

  private parseCodeAnalysisResponse(response: MistralResponse): any {
    const content = response.choices[0]?.message?.content || '';
    
    try {
      return JSON.parse(content);
    } catch {
      return {
        vulnerabilities: [],
        securityScore: 50,
        bestPractices: [],
        compliance: []
      };
    }
  }

  private parseReportResponse(response: MistralResponse): any {
    const content = response.choices[0]?.message?.content || '';
    
    try {
      return JSON.parse(content);
    } catch {
      return {
        executiveSummary: content.substring(0, 200),
        detailedAnalysis: content,
        recommendations: ['Manual review required'],
        riskScore: 50,
        futureOutlook: 'Unknown'
      };
    }
  }

  private parseSocialEngineeringResponse(response: MistralResponse): any {
    const content = response.choices[0]?.message?.content || '';
    
    try {
      return JSON.parse(content);
    } catch {
      return {
        isSocialEngineering: content.toLowerCase().includes('social engineering'),
        confidence: 0.5,
        techniques: [],
        urgencyLevel: 'medium',
        manipulationType: [],
        riskAssessment: content.substring(0, 200),
        recommendedActions: ['Manual review required']
      };
    }
  }

  private extractThreatLevel(content: string): 'low' | 'medium' | 'high' | 'critical' {
    const lower = content.toLowerCase();
    if (lower.includes('critical') || lower.includes('severe')) return 'critical';
    if (lower.includes('high') || lower.includes('dangerous')) return 'high';
    if (lower.includes('medium') || lower.includes('moderate')) return 'medium';
    return 'low';
  }

  private extractConfidence(content: string): number {
    const matches = content.match(/confidence[:\s]*(\d+\.?\d*)/i);
    if (matches) {
      const value = parseFloat(matches[1]);
      return Math.min(Math.max(value, 0), 1);
    }
    return 0.5;
  }

  private extractIndicators(content: string): string[] {
    const indicators: string[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.toLowerCase().includes('indicator') || line.toLowerCase().includes('sign')) {
        indicators.push(line.trim());
      }
    }
    
    return indicators.slice(0, 5); // Limit to top 5
  }

  private extractRecommendations(content: string): string[] {
    const recommendations: string[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.toLowerCase().includes('recommend') || line.toLowerCase().includes('suggest')) {
        recommendations.push(line.trim());
      }
    }
    
    return recommendations.slice(0, 5); // Limit to top 5
  }

  private async checkRateLimit(model: string): Promise<void> {
    const now = Date.now();
    const lastRequest = this.rateLimit.get(model) || 0;
    
    // Rate limit: 1 request per second for most models
    if (now - lastRequest < 1000) {
      const delay = 1000 - (now - lastRequest);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    this.rateLimit.set(model, Date.now());
  }

  private logRequest(analysisType: string, tokens: number, success: boolean): void {
    this.requestHistory.push({
      timestamp: Date.now(),
      model: this.config.model,
      tokens,
      success
    });
    
    // Keep only last 1000 requests
    if (this.requestHistory.length > 1000) {
      this.requestHistory = this.requestHistory.slice(-1000);
    }
  }

  // Analytics and monitoring methods
  getUsageStatistics(): {
    totalRequests: number;
    successfulRequests: number;
    averageTokens: number;
    mostUsedModel: string;
    requestHistory: Array<{
      timestamp: number;
      model: string;
      tokens: number;
      success: boolean;
    }>;
  } {
    const totalRequests = this.requestHistory.length;
    const successfulRequests = this.requestHistory.filter(r => r.success).length;
    const averageTokens = totalRequests > 0 ? 
      this.requestHistory.reduce((sum, r) => sum + r.tokens, 0) / totalRequests : 0;
    
    const modelCounts = this.requestHistory.reduce((acc, r) => {
      acc[r.model] = (acc[r.model] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostUsedModel = Object.entries(modelCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || this.config.model;
    
    return {
      totalRequests,
      successfulRequests,
      averageTokens,
      mostUsedModel,
      requestHistory: this.requestHistory.slice(-100) // Last 100 requests
    };
  }

  updateConfig(newConfig: Partial<MistralConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): MistralConfig {
    return { ...this.config };
  }
}

// Initialize with Mistral API
export const mistralIntegration = new MistralIntegration({
  apiKey: process.env.MISTRAL_API_KEY || 'LUuX3tTpa9Kru3bzRQH1Osfxow6XcdVQ',
  model: 'mistral-medium',
  temperature: 0.1,
  maxTokens: 2000,
  topP: 0.9,
  frequencyPenalty: 0,
  presencePenalty: 0
});

export default MistralIntegration;
