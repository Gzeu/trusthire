// AI-Powered Intelligence for TrustHire
// Natural language processing, threat prediction, and intelligent recommendations

import { Groq } from 'groq-sdk';

export interface CommunicationAnalysis {
  legitimacyScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  suspiciousPatterns: string[];
  redFlags: string[];
  sentiment: 'positive' | 'neutral' | 'negative' | 'manipulative';
  urgency: 'low' | 'medium' | 'high';
  professionalLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  confidence: number; // 0-100
}

export interface ThreatPrediction {
  threatType: 'phishing' | 'malware' | 'social_engineering' | 'data_exfiltration' | 'fake_job';
  probability: number; // 0-100
  riskFactors: string[];
  indicators: string[];
  timeline: 'immediate' | 'short_term' | 'long_term';
  impact: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string[];
}

export interface ProfileAnalysis {
  authenticityScore: number; // 0-100
  verificationStatus: 'verified' | 'suspicious' | 'fake' | 'unknown';
  profileCompleteness: number; // 0-100
  networkQuality: 'poor' | 'average' | 'good' | 'excellent';
  activityPattern: 'normal' | 'suspicious' | 'bot_like' | 'inactive';
  redFlags: string[];
  recommendations: string[];
}

export interface IntelligentRecommendation {
  type: 'security' | 'opportunity' | 'verification' | 'action';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  action: string;
  reasoning: string;
  confidence: number; // 0-100
}

export class AIAnalyzer {
  private groq: Groq;
  private model = 'mixtral-8x7b-32768';

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY || '',
    });
  }

  // Natural Language Processing for Recruiter Communication
  async analyzeCommunication(
    message: string,
    context?: {
      platform?: 'linkedin' | 'email' | 'telegram' | 'whatsapp';
      senderProfile?: string;
      previousMessages?: string[];
    }
  ): Promise<CommunicationAnalysis> {
    const prompt = `
Analyze this recruiter message for legitimacy and potential scam indicators:

Message: "${message}"
Platform: ${context?.platform || 'unknown'}
Sender Profile: ${context?.senderProfile || 'not provided'}
Previous Messages: ${context?.previousMessages?.length || 0}

Provide analysis in JSON format with:
1. legitimacyScore (0-100)
2. riskLevel (low/medium/high/critical)
3. suspiciousPatterns (array of strings)
4. redFlags (array of strings)
5. sentiment (positive/neutral/negative/manipulative)
6. urgency (low/medium/high)
7. professionalLevel (low/medium/high)
8. recommendations (array of strings)
9. confidence (0-100)

Focus on:
- Urgency tactics and pressure
- Vague job descriptions
- Requests for personal information
- Unusual compensation claims
- Grammar and professionalism
- Suspicious links or attachments
- Inconsistent company information
`;

    try {
      const response = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature: 0.1,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content || '{}';
      const analysis = JSON.parse(content);

      return {
        legitimacyScore: analysis.legitimacyScore || 50,
        riskLevel: analysis.riskLevel || 'medium',
        suspiciousPatterns: analysis.suspiciousPatterns || [],
        redFlags: analysis.redFlags || [],
        sentiment: analysis.sentiment || 'neutral',
        urgency: analysis.urgency || 'medium',
        professionalLevel: analysis.professionalLevel || 'medium',
        recommendations: analysis.recommendations || [],
        confidence: analysis.confidence || 70,
      };
    } catch (error) {
      console.error('Communication analysis error:', error);
      return this.getDefaultCommunicationAnalysis();
    }
  }

  // Machine Learning-based Threat Prediction
  async predictThreat(
    data: {
      communication?: string;
      repositoryUrl?: string;
      senderProfile?: string;
      context?: any;
    }
  ): Promise<ThreatPrediction[]> {
    const prompt = `
Analyze this data for potential security threats and predict attack vectors:

Communication: "${data.communication || 'not provided'}"
Repository: "${data.repositoryUrl || 'not provided'}"
Profile: "${data.senderProfile || 'not provided'}"

Provide threat predictions in JSON array format with objects containing:
1. threatType (phishing/malware/social_engineering/data_exfiltration/fake_job)
2. probability (0-100)
3. riskFactors (array of strings)
4. indicators (array of strings)
5. timeline (immediate/short_term/long_term)
6. impact (low/medium/high/critical)
7. mitigation (array of strings)

Consider:
- Social engineering tactics
- Technical indicators
- Behavioral patterns
- Historical attack methods
- Current threat landscape
`;

    try {
      const response = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature: 0.2,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content || '[]';
      const predictions = JSON.parse(content);

      return Array.isArray(predictions) ? predictions : [this.getDefaultThreatPrediction()];
    } catch (error) {
      console.error('Threat prediction error:', error);
      return [this.getDefaultThreatPrediction()];
    }
  }

  // Profile Authenticity Analysis
  async analyzeProfile(
    profileData: {
      name?: string;
      headline?: string;
      company?: string;
      experience?: any[];
      connections?: number;
      activity?: any[];
      profileUrl?: string;
    }
  ): Promise<ProfileAnalysis> {
    const prompt = `
Analyze this professional profile for authenticity and legitimacy:

Name: "${profileData.name || 'not provided'}"
Headline: "${profileData.headline || 'not provided'}"
Company: "${profileData.company || 'not provided'}"
Experience: ${profileData.experience?.length || 0} positions
Connections: ${profileData.connections || 0}
Recent Activity: ${profileData.activity?.length || 0} items

Provide analysis in JSON format with:
1. authenticityScore (0-100)
2. verificationStatus (verified/suspicious/fake/unknown)
3. profileCompleteness (0-100)
4. networkQuality (poor/average/good/excellent)
5. activityPattern (normal/suspicious/bot_like/inactive)
6. redFlags (array of strings)
7. recommendations (array of strings)

Focus on:
- Profile completeness and consistency
- Network quality and connection patterns
- Activity regularity and authenticity
- Company verification and legitimacy
- Experience timeline consistency
- Suspicious patterns or anomalies
`;

    try {
      const response = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature: 0.1,
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content || '{}';
      const analysis = JSON.parse(content);

      return {
        authenticityScore: analysis.authenticityScore || 50,
        verificationStatus: analysis.verificationStatus || 'unknown',
        profileCompleteness: analysis.profileCompleteness || 50,
        networkQuality: analysis.networkQuality || 'average',
        activityPattern: analysis.activityPattern || 'normal',
        redFlags: analysis.redFlags || [],
        recommendations: analysis.recommendations || [],
      };
    } catch (error) {
      console.error('Profile analysis error:', error);
      return this.getDefaultProfileAnalysis();
    }
  }

  // Intelligent Recommendations Engine
  async generateRecommendations(
    context: {
      communicationAnalysis?: CommunicationAnalysis;
      threatPredictions?: ThreatPrediction[];
      profileAnalysis?: ProfileAnalysis;
      userHistory?: any;
      riskTolerance?: 'low' | 'medium' | 'high';
    }
  ): Promise<IntelligentRecommendation[]> {
    const prompt = `
Generate intelligent security recommendations based on this analysis:

Communication Risk: ${context.communicationAnalysis?.riskLevel || 'unknown'}
Threat Predictions: ${context.threatPredictions?.length || 0} threats identified
Profile Authenticity: ${context.profileAnalysis?.authenticityScore || 50}/100
User Risk Tolerance: ${context.riskTolerance || 'medium'}

Provide recommendations in JSON array format with objects containing:
1. type (security/opportunity/verification/action)
2. priority (low/medium/high/critical)
3. title (string)
4. description (string)
5. action (specific action to take)
6. reasoning (why this is important)
7. confidence (0-100)

Focus on:
- Immediate security actions
- Verification steps
- Opportunity assessment
- Long-term security strategy
- User education needs
- Process improvements
`;

    try {
      const response = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature: 0.3,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content || '[]';
      const recommendations = JSON.parse(content);

      return Array.isArray(recommendations) ? recommendations : [this.getDefaultRecommendation()];
    } catch (error) {
      console.error('Recommendations generation error:', error);
      return [this.getDefaultRecommendation()];
    }
  }

  // Automated Report Generation
  async generateReport(
    data: {
      communicationAnalysis?: CommunicationAnalysis;
      threatPredictions?: ThreatPrediction[];
      profileAnalysis?: ProfileAnalysis;
      recommendations?: IntelligentRecommendation[];
      timestamp?: number;
    }
  ): Promise<string> {
    const prompt = `
Generate a comprehensive security assessment report based on this analysis:

Risk Level: ${data.communicationAnalysis?.riskLevel || 'unknown'}
Legitimacy Score: ${data.communicationAnalysis?.legitimacyScore || 50}/100
Threats Identified: ${data.threatPredictions?.length || 0}
Profile Authenticity: ${data.profileAnalysis?.authenticityScore || 50}/100
Recommendations: ${data.recommendations?.length || 0}

Generate a professional report with:
1. Executive Summary
2. Risk Assessment
3. Detailed Findings
4. Threat Analysis
5. Recommendations
6. Next Steps

Use professional tone, clear structure, and actionable insights.
`;

    try {
      const response = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature: 0.2,
        max_tokens: 3000,
      });

      return response.choices[0]?.message?.content || 'Report generation failed';
    } catch (error) {
      console.error('Report generation error:', error);
      return 'Unable to generate report at this time.';
    }
  }

  // Learning and Feedback Integration
  async learnFromFeedback(
    originalAnalysis: any,
    userFeedback: {
      accuracy?: number; // 0-100
      correctPredictions?: string[];
      missedThreats?: string[];
      falsePositives?: string[];
    }
  ): Promise<void> {
    // This would integrate with a learning system
    // For now, we'll log the feedback for future analysis
    console.log('Learning from feedback:', {
      originalAnalysis,
      userFeedback,
      timestamp: Date.now(),
    });
  }

  // Default fallback methods
  private getDefaultCommunicationAnalysis(): CommunicationAnalysis {
    return {
      legitimacyScore: 50,
      riskLevel: 'medium',
      suspiciousPatterns: ['Unable to analyze'],
      redFlags: ['Analysis unavailable'],
      sentiment: 'neutral',
      urgency: 'medium',
      professionalLevel: 'medium',
      recommendations: ['Manual review recommended'],
      confidence: 30,
    };
  }

  private getDefaultThreatPrediction(): ThreatPrediction {
    return {
      threatType: 'fake_job',
      probability: 30,
      riskFactors: ['Unable to analyze'],
      indicators: ['Analysis unavailable'],
      timeline: 'short_term',
      impact: 'medium',
      mitigation: ['Manual verification required'],
    };
  }

  private getDefaultProfileAnalysis(): ProfileAnalysis {
    return {
      authenticityScore: 50,
      verificationStatus: 'unknown',
      profileCompleteness: 50,
      networkQuality: 'average',
      activityPattern: 'normal',
      redFlags: ['Unable to analyze'],
      recommendations: ['Manual review recommended'],
    };
  }

  private getDefaultRecommendation(): IntelligentRecommendation {
    return {
      type: 'verification',
      priority: 'medium',
      title: 'Manual Verification Required',
      description: 'AI analysis unavailable, manual review recommended',
      action: 'Review all information manually',
      reasoning: 'Automated analysis temporarily unavailable',
      confidence: 30,
    };
  }
}

// Singleton instance
export const aiAnalyzer = new AIAnalyzer();

// React hook for using AI analyzer
export function useAIAnalyzer() {
  return aiAnalyzer;
}

export default aiAnalyzer;
