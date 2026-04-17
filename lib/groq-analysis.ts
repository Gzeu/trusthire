import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
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
      model: "llama-3.1-70b-versatile",
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
    email?: string;
    messages?: string[];
    jobDescription?: string;
  }
): Promise<GroqAnalysisResult['profileAnalysis']> {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert in identifying recruitment scams and fake job offers. 
          Analyze the provided profile and recruitment data for signs of fraudulent activity.
          Look for inconsistencies, suspicious patterns, and red flags common in recruitment scams.
          Respond with JSON format containing redFlags array, greenFlags array, and inconsistencies array.`
        },
        {
          role: "user",
          content: JSON.stringify(profileData, null, 2)
        }
      ],
      temperature: 0.1,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0]?.message?.content || '{}');
    
    return {
      redFlags: response.redFlags || [],
      greenFlags: response.greenFlags || [],
      inconsistencies: response.inconsistencies || []
    };
  } catch (error) {
    console.error('Groq profile analysis error:', error);
    return {
      redFlags: ['Unable to perform AI profile analysis'],
      greenFlags: [],
      inconsistencies: []
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
      model: "llama-3.1-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a senior cybersecurity analyst specializing in recruitment fraud detection.
          Analyze all provided data to generate a comprehensive risk assessment.
          Consider the credibility of the recruiter, legitimacy of the job offer, technical safety, and overall risk level.
          Provide specific, actionable insights and recommendations.
          Respond with JSON format containing riskAssessment, codeAnalysis, profileAnalysis, and summary objects.`
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

    const response = JSON.parse(completion.choices[0]?.message?.content || '{}');
    
    return {
      riskAssessment: response.riskAssessment || {
        level: 'medium',
        confidence: 0.5,
        reasoning: 'Unable to generate detailed assessment'
      },
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
    console.error('Groq comprehensive analysis error:', error);
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
      model: "llama-3.1-70b-versatile",
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
