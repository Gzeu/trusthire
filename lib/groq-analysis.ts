import { Groq } from 'groq-sdk';

// Use Vercel environment variable name
const groqApiKey = process.env.GROQ_API_KEY_GROQ_API_KEY || process.env.GROQ_API_KEY || '';

console.log('Groq API Key available:', !!groqApiKey);
console.log('Groq API Key length:', groqApiKey.length || 0);

const groq = new Groq({
  apiKey: groqApiKey,
});

export interface GroqAnalysisResult {
  riskAssessment: {
    level: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    reasoning: string;
  };
  codeAnalysis: {
    suspiciousPatterns: Array<{
      pattern: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      location?: string;
    }>;
    recommendations: string[];
  };
  profileAnalysis: {
    redFlags: string[];
    greenFlags: string[];
    inconsistencies: string[];
  };
  summary: {
    overallRisk: string;
    keyFindings: string[];
    nextSteps: string[];
  };
}

export async function analyzeCodeWithGroq(
  codeContent: string,
  context: string = ''
): Promise<GroqAnalysisResult['codeAnalysis']> {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a cybersecurity expert specializing in code security analysis for recruitment scams. 
  Analyze the provided code for malicious patterns, credential theft, data exfiltration, or other security risks.
  Focus on patterns commonly used in fake technical assessments and recruitment scams.
  Respond with JSON format containing suspiciousPatterns array and recommendations array.`
        },
        {
          role: "user",
          content: `Context: ${context}\n\nCode to analyze:\n\n${codeContent}`
        }
      ],
      temperature: 0.1,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });
    const response = JSON.parse(completion.choices[0]?.message?.content || '{}');
    
    return {
      suspiciousPatterns: response.suspiciousPatterns || [],
      recommendations: response.recommendations || []
    };
  } catch (error) {
    console.error('Groq code analysis error:', error);
    return {
      suspiciousPatterns: [],
      recommendations: ['Unable to perform AI analysis - manual review recommended']
    };
  }
}

export async function analyzeProfileWithGroq(
  profileData: {
    name?: string;
    company?: string;
    jobTitle?: string;
    connections?: number;
    profileAge?: number;
    verified?: boolean;
    email?: string;
    messages?: string[];
    jobDescription?: string;
  }
): Promise<GroqAnalysisResult['profileAnalysis']> {
  // Check if API key is available and valid
  const apiKey = process.env.GROQ_API_KEY_GROQ_API_KEY || process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.length < 20) {
    console.log('Groq API key not available or too short, using fallback');
    return {
      redFlags: ['Unable to verify AI analysis - API key not configured'],
      greenFlags: ['Standard security assessment completed'],
      inconsistencies: ['AI verification unavailable']
    };
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a cybersecurity expert specializing in recruitment scam detection. 
  Analyze the provided recruiter profile and job context for red flags, inconsistencies, and suspicious patterns.
  Focus on identity verification, company legitimacy, and common scam tactics.
  Respond with JSON format containing redFlags array, greenFlags array, and inconsistencies array.
  Each array should contain strings only.`
        },
        {
          role: "user",
          content: `Profile Analysis Request:
Name: ${profileData.name || 'Not provided'}
Company: ${profileData.company || 'Not provided'}
Job Title: ${profileData.jobTitle || 'Not provided'}
Email: ${profileData.email || 'Not provided'}
Profile Age: ${profileData.profileAge || 'Unknown'} months
Connections: ${profileData.connections || 'Unknown'}
Verified: ${profileData.verified || 'Unknown'}
Messages: ${profileData.messages?.join('\n') || 'No messages provided'}
Job Description: ${profileData.jobDescription || 'Not provided'}`
        }
      ],
      temperature: 0.1,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });
    
    const content = completion.choices[0]?.message?.content || '{}';
    console.log('Groq profile analysis raw response:', content);
    
    const response = JSON.parse(content);
    
    // Strict validation of response structure
    const validatedResponse = {
      redFlags: Array.isArray(response.redFlags) ? response.redFlags.filter((flag: any) => typeof flag === 'string') : [],
      greenFlags: Array.isArray(response.greenFlags) ? response.greenFlags.filter((flag: any) => typeof flag === 'string') : [],
      inconsistencies: Array.isArray(response.inconsistencies) ? response.inconsistencies.filter((flag: any) => typeof flag === 'string') : []
    };
    
    console.log('Groq profile analysis validated response:', validatedResponse);
    
    return validatedResponse;
  } catch (error) {
    console.error('Groq profile analysis error - Full details:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      apiKeyLength: groqApiKey.length,
      apiKeyPresent: !!groqApiKey
    });
    
    // Check specific error types
    if (error instanceof Error) {
      if (error.message.includes('403')) {
        console.log('Invalid Groq API key detected');
        return {
          redFlags: ['AI API key invalid - contact administrator'],
          greenFlags: ['Standard security assessment completed'],
          inconsistencies: ['AI verification temporarily unavailable']
        };
      }
      
      if (error.message.includes('model_decommissioned') || error.message.includes('model_not_found')) {
        console.log('Groq model deprecated or not found');
        return {
          redFlags: ['AI model deprecated - update required'],
          greenFlags: ['Standard security assessment completed'],
          inconsistencies: ['AI model temporarily unavailable']
        };
      }
      
      if (error.message.includes('429') || error.message.includes('rate_limit')) {
        console.log('Groq rate limit exceeded');
        return {
          redFlags: ['AI rate limit exceeded - please try again later'],
          greenFlags: ['Standard security assessment completed'],
          inconsistencies: ['AI service temporarily rate limited']
        };
      }
    }
    
    return {
      redFlags: [`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      greenFlags: ['Standard security assessment completed'],
      inconsistencies: ['AI verification unavailable - technical issues']
    };
  }
}

export async function generateRiskAssessmentWithGroq(
  allData: {
    profile: any;
    job: any;
    code: any;
    domains: any;
    existingFlags: any[];
  }
): Promise<GroqAnalysisResult> {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a senior cybersecurity analyst specializing in recruitment fraud detection.
  Analyze all provided data to generate a comprehensive risk assessment.
  Consider the credibility of the recruiter, legitimacy of the job offer, technical safety, and overall risk level.
  Provide specific, actionable insights and recommendations.
  Respond with JSON format containing riskAssessment, codeAnalysis, profileAnalysis, and summary objects.
  CRITICAL: riskAssessment.confidence must be a number between 0 and 1. riskAssessment.level must be one of: low, medium, high, critical.`
        },
        {
          role: "user",
          content: JSON.stringify(allData, null, 2)
        }
      ],
      temperature: 0.2,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });
    
    const content = completion.choices[0]?.message?.content || '{}';
    console.log('Groq risk assessment raw response:', content);
    
    const response = JSON.parse(content);
    
    // Validate risk assessment
    const confidence = Number(response.riskAssessment?.confidence);
    const validRiskLevels = ['low', 'medium', 'high', 'critical'];
    const riskLevel = response.riskAssessment?.level;
    
    const riskAssessment = {
      level: validRiskLevels.includes(riskLevel) ? riskLevel : 'medium',
      confidence: Number.isFinite(confidence) && confidence >= 0 && confidence <= 1 ? confidence : 0.5,
      reasoning: response.riskAssessment?.reasoning || 'Unable to generate detailed assessment'
    };
    
    console.log('Groq risk assessment validated:', riskAssessment);
    
    return {
      riskAssessment,
      codeAnalysis: response.codeAnalysis || {
        suspiciousPatterns: [],
        recommendations: ['Manual code review recommended']
      },
      profileAnalysis: response.profileAnalysis || {
        redFlags: [],
        greenFlags: [],
        inconsistencies: []
      },
      summary: response.summary || {
        overallRisk: 'Moderate risk detected - proceed with caution',
        keyFindings: ['Limited data available for analysis'],
        nextSteps: ['Verify company legitimacy', 'Request additional documentation']
      }
    };
  } catch (error) {
    console.error('Groq comprehensive analysis error - Full details:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      apiKeyLength: groqApiKey.length,
      apiKeyPresent: !!groqApiKey
    });
    
    return {
      riskAssessment: {
        level: 'medium',
        confidence: 0.3,
        reasoning: 'AI analysis unavailable - using standard heuristics only'
      },
      codeAnalysis: {
        suspiciousPatterns: [],
        recommendations: ['Manual review required due to AI analysis failure']
      },
      profileAnalysis: {
        redFlags: ['AI analysis unavailable'],
        greenFlags: [],
        inconsistencies: []
      },
      summary: {
        overallRisk: 'Unable to perform comprehensive AI analysis',
        keyFindings: ['Standard heuristic analysis applied'],
        nextSteps: ['Manual verification recommended', 'Proceed with standard caution']
      }
    };
  }
}

export async function generateReportSummaryWithGroq(
  assessmentData: {
    scores: any;
    flags: any[];
    signals: any[];
    missing: any[];
    advice: any[];
    recruiterName: string;
    company: string;
  }
): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a professional security report writer. Generate a clear, concise, and actionable summary of the recruitment security assessment.
  Focus on the most important findings, risk level, and recommended actions.
  Use professional but accessible language. Include specific risk indicators and next steps.`
        },
        {
          role: "user",
          content: JSON.stringify(assessmentData, null, 2)
        }
      ],
      temperature: 0.3,
      max_tokens: 800
    });
    return completion.choices[0]?.message?.content || 'Unable to generate AI summary';
  } catch (error) {
    console.error('Groq report summary error:', error);
    return 'AI summary unavailable - please review the detailed assessment results below.';
  }
}
