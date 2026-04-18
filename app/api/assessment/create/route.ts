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
  try {
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

    // Run repo scans safely — never let a single failure crash the whole request
    const repoScanResults = await Promise.allSettled(
      (body.artifacts ?? []).filter((a) => a.type === 'github').map((a) => scanGithubRepo(a.url))
    );
    const repoScans = repoScanResults.map((r) =>
      r.status === 'fulfilled' ? r.value : { repoUrl: '', error: 'Scan failed', files: [], suspiciousFiles: [] }
    );

    // Run domain checks safely
    const domainTargets = (body.artifacts ?? [])
      .filter((a) => a.type !== 'github')
      .map((a) => a.url)
      .concat(
        body.recruiter.emailReceived
          ? [body.recruiter.emailReceived.split('@')[1] ?? '']
          : []
      );

    const domainCheckResults = await Promise.allSettled(
      domainTargets.map((url) => checkDomainSafety(url))
    );
    const domainChecks = domainCheckResults.map((r) =>
      r.status === 'fulfilled' ? r.value : { safe: true, vtReputation: 0, vtMalicious: 0, vtCategories: [], domainAgeYears: null }
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
        const profileAnalysis = await analyzeProfileWithGroq({
          name: body.recruiter.name,
          company: body.recruiter.claimedCompany,
          jobTitle: body.recruiter.jobTitle,
          email: body.recruiter.emailReceived,
          messages: body.recruiter.recruiterMessages ? [body.recruiter.recruiterMessages] : [],
          jobDescription: body.job.jobDescription
        });

        const codeAnalyses = await Promise.allSettled(
          repoScans.map(async (scan) => {
            if (scan.repoUrl) {
              return analyzeCodeWithGroq(JSON.stringify(scan, null, 2), `Repository: ${scan.repoUrl}`);
            }
            return { suspiciousPatterns: [], recommendations: [] };
          })
        );
        const resolvedCodeAnalyses = codeAnalyses.map((r) =>
          r.status === 'fulfilled' ? r.value : { suspiciousPatterns: [], recommendations: [] }
        );

        aiAnalysis = await generateRiskAssessmentWithGroq({
          profile: body.recruiter,
          job: body.job,
          code: repoScans,
          domains: domainChecks,
          existingFlags: redFlags
        });

        aiAnalysis = normalizeAiAnalysis(aiAnalysis);

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

        const allCodeRecommendations = resolvedCodeAnalyses.flatMap((a) => a.recommendations ?? []);
        if (allCodeRecommendations.length > 0) {
          workflowAdvice.push(...allCodeRecommendations.slice(0, 3).map((rec) => ({
            action: 'request_more_proof' as const,
            priority: 'medium' as const,
            description: rec
          })));
        }
      } catch (error) {
        console.error('Groq AI analysis failed:', error);
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
      vtResults: domainChecks.map((dc) => ({
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

    let incidentReport = generateIncidentReport(assessmentResult);

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
      scores,
      finalScore,
      verdict,
      redFlags,
      greenSignals,
      missingEvidence,
      workflowAdvice,
      repoScans,
      domainChecks,
      incidentReport,
      aiAnalysis,
    });

  } catch (error) {
    // Top-level safety net — always return valid JSON, never an empty 500
    console.error('Assessment create fatal error:', error);
    return NextResponse.json(
      { error: 'Assessment failed. Please try again.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
