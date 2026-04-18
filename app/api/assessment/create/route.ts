import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateScores, getVerdict, generateRedFlags, generateGreenSignals, generateMissingEvidence, generateWorkflowAdvice } from '@/lib/scoring';
import { scanGithubRepo } from '@/lib/repoScanner';
import { checkDomainSafety } from '@/lib/domainChecker';
import { generateIncidentReport } from '@/lib/reportGenerator';
import { generateRiskAssessmentWithGroq, generateReportSummaryWithGroq, analyzeProfileWithGroq, analyzeCodeWithGroq } from '@/lib/groq-analysis';
import { normalizeAiAnalysis } from '@/lib/normalizeAiAnalysis';
import type { AssessmentInput } from '@/types';

const rateLimit = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || entry.reset < now) {
    rateLimit.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please wait a minute.' }, { status: 429 });
  }

  let body: AssessmentInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.recruiter?.name || !body.recruiter?.claimedCompany) {
    return NextResponse.json({ error: 'Name and company are required' }, { status: 400 });
  }

  // Run repo scans in parallel
  const repoScans = await Promise.all(
    (body.artifacts ?? []).filter((a) => a.type === 'github').map((a) => scanGithubRepo(a.url))
  );

  // Run domain checks in parallel
  const domainChecks = await Promise.all(
    (body.artifacts ?? [])
      .filter((a) => a.type !== 'github')
      .map((a) => checkDomainSafety(a.url))
      .concat(
        body.recruiter.emailReceived
          ? [checkDomainSafety(body.recruiter.emailReceived.split('@')[1] ?? '')]
          : []
      )
  );

  // Calculate scores and generate full assessment
  const scores = await calculateScores(body, repoScans, domainChecks);
  const finalScore = scores.identityConfidence + scores.employerLegitimacy + scores.processLegitimacy + scores.technicalSafety;
  const verdict = getVerdict(finalScore);
  const redFlags = generateRedFlags(body, repoScans, domainChecks);
  const greenSignals = generateGreenSignals(body, repoScans, domainChecks);
  const missingEvidence = generateMissingEvidence(body);
  const workflowAdvice = generateWorkflowAdvice(verdict, redFlags);

  // Enhanced AI Analysis with Groq
  let aiAnalysis = null;
  const groqApiKey = process.env.GROQ_API_KEY;
  if (groqApiKey) {
    try {
      // Analyze profile data
      const profileAnalysis = await analyzeProfileWithGroq({
        name: body.recruiter.name,
        company: body.recruiter.claimedCompany,
        jobTitle: body.recruiter.jobTitle,
        email: body.recruiter.emailReceived,
        messages: body.recruiter.recruiterMessages ? [body.recruiter.recruiterMessages] : [],
        jobDescription: body.job.jobDescription
      });

      // Analyze code from repositories if available
      const codeAnalyses = await Promise.all(
        repoScans.map(async (scan) => {
          if (scan.repoUrl) {
            try {
              return await analyzeCodeWithGroq(
                JSON.stringify(scan, null, 2),
                `Repository: ${scan.repoUrl}`
              );
            } catch (error) {
              console.error(`Code analysis failed for ${scan.repoUrl}:`, error);
              return { suspiciousPatterns: [], recommendations: [] };
            }
          }
          return { suspiciousPatterns: [], recommendations: [] };
        })
      );

      // Generate comprehensive risk assessment
      aiAnalysis = await generateRiskAssessmentWithGroq({
        profile: body.recruiter,
        job: body.job,
        code: repoScans,
        domains: domainChecks,
        existingFlags: redFlags
      });

      // Normalize AI analysis for consistent frontend handling
      aiAnalysis = normalizeAiAnalysis(aiAnalysis);

      // Add AI insights to existing data
      if (profileAnalysis?.redFlags?.length > 0) {
        redFlags.push(...profileAnalysis.redFlags.map((flag: any) => ({
          category: 'identity' as const,
          severity: 'warning' as const,
          signal: 'AI Analysis',
          explanation: flag,
          recommendation: 'Review this finding carefully and verify independently'
        })));
      }

      if (profileAnalysis?.greenFlags?.length > 0) {
        greenSignals.push(...profileAnalysis.greenFlags);
      }

      // Merge AI recommendations with workflow advice
      if (codeAnalyses.some(analysis => analysis.recommendations.length > 0)) {
        const allCodeRecommendations = codeAnalyses.flatMap(analysis => analysis.recommendations);
        workflowAdvice.push(...allCodeRecommendations.slice(0, 3).map(rec => ({
          action: 'request_more_proof' as const,
          priority: 'medium' as const,
          description: rec
        })));
      }

    } catch (error) {
      console.error('Groq AI analysis failed:', error);
      // Continue without AI analysis - fallback to standard scoring
    }
  }

  // Create full assessment result for incident report
  const assessmentResult = {
    id: 'temp',
    createdAt: new Date().toISOString(),
    recruiterName: body.recruiter.name,
    company: body.recruiter.claimedCompany,
    finalScore,
    verdict,
    scores,
    redFlags,
    greenSignals,
    missingEvidence,
    workflowAdvice,
    repoScans,
    vtResults: domainChecks.map(dc => ({ 
    url: '', 
    domainResult: {
      reputation: dc.vtReputation || 0,
      malicious: dc.vtMalicious || 0,
      suspicious: 0,
      categories: dc.vtCategories || [],
      creationDate: dc.domainAgeYears ? dc.domainAgeYears * 365 * 24 * 60 * 60 * 1000 : undefined,
      country: undefined
    }
  })),
    shareToken: 'temp',
    aiAnalysis
  };

  // Generate enhanced incident report with AI insights
  let incidentReport = generateIncidentReport(assessmentResult);
  
  // Add AI summary if available
  if (aiAnalysis && aiAnalysis.summary && groqApiKey) {
    try {
      const aiSummary = await generateReportSummaryWithGroq({
        scores,
        flags: redFlags,
        signals: greenSignals,
        missing: missingEvidence,
        advice: workflowAdvice,
        recruiterName: body.recruiter.name,
        company: body.recruiter.claimedCompany
      });
      
      incidentReport = `
${incidentReport}

=== AI-ENHANCED ANALYSIS ===
${aiSummary}

=== AI RISK ASSESSMENT ===
Risk Level: ${aiAnalysis.riskAssessment.level?.toUpperCase() || 'UNKNOWN'}
Confidence: ${aiAnalysis.riskAssessment ? (aiAnalysis.riskAssessment.confidence * 100).toFixed(1) : '0'}%
Reasoning: ${aiAnalysis.riskAssessment?.reasoning || 'AI analysis unavailable'}

=== AI KEY FINDINGS ===
${aiAnalysis.summary?.keyFindings?.map((finding: string) => `  - ${finding}`).join('\n') || '  - No key findings available'}

=== AI RECOMMENDED NEXT STEPS ===
${aiAnalysis.summary?.nextSteps?.map((step: string) => `  1. ${step}`).join('\n') || '  - No specific recommendations'}
      `.trim();
    } catch (error) {
      console.error('Failed to generate AI summary:', error);
    }
  }

  // Save to DB
  let savedId: string;
  let shareToken: string;
  try {
    const saved = await prisma.assessment.create({
      data: {
        sessionId: `session_${Date.now()}`,
        recruiterName: body.recruiter.name,
        company: body.recruiter.claimedCompany,
        finalScore: finalScore,
        verdict: verdict,
        inputData: body as object,
        scoreData: scores as object,
        redFlags: redFlags as object,
        vtResults: domainChecks as object,
        repoScans: repoScans as object,
      },
    });
    savedId = saved.id;
    shareToken = saved.shareToken;
  } catch {
    savedId = `local_${Date.now()}`;
    shareToken = `share_${Math.random().toString(36).slice(2)}`;
  }

  return NextResponse.json({
    id: savedId,
    shareToken,
    createdAt: new Date().toISOString(),
    recruiterName: body.recruiter.name,
    company: body.recruiter.claimedCompany,
    scores: scores,
    finalScore: finalScore,
    verdict: verdict,
    redFlags: redFlags,
    greenSignals: greenSignals,
    missingEvidence: missingEvidence,
    workflowAdvice: workflowAdvice,
    repoScans,
    domainChecks,
    incidentReport,
    aiAnalysis,
  });
}
