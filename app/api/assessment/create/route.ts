import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateScores, getVerdict, generateRedFlags, generateGreenSignals, generateMissingEvidence, generateWorkflowAdvice } from '@/lib/scoring';
import { scanGithubRepo } from '@/lib/repoScanner';
import { checkDomainSafety } from '@/lib/domainChecker';
import { verifyCompany } from '@/lib/companyVerifier';
import { validateEmailWithAPI } from '@/lib/emailValidator';
import { generateIncidentReport } from '@/lib/reportGenerator';
import { generateRiskAssessmentWithGroq, generateReportSummaryWithGroq, analyzeProfileWithGroq, analyzeCodeWithGroq } from '@/lib/groq-analysis';
import { normalizeAiAnalysis } from '@/lib/normalizeAiAnalysis';
import { langChainService } from '@/lib/langchain-integration';
import { withErrorHandling, RateLimitError, ExternalServiceError } from '@/lib/error-handler';
import { validateInput, AssessmentInputSchema, transformAssessmentInput } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import type { AssessmentInput, RepoScanResult } from '@/types';

const EMPTY_REPO_SCAN: RepoScanResult = {
  repoUrl: '',
  hasPackageJson: false,
  dangerousScripts: [],
  patternMatches: [],
  riskLevel: 'safe',
  error: 'Scan failed',
};

const handler = async (req: NextRequest) => {
  const ip = getClientIp(req);
  if (!checkRateLimit(ip, 10, 60_000)) {
    throw new RateLimitError('Assessment creation rate limit exceeded. Please wait a minute.');
  }

  // Validate and parse input
  const body = await req.json();
  const validatedInput = validateInput(AssessmentInputSchema, body);
  const assessmentInput = transformAssessmentInput(validatedInput);

    // Run repo scans safely — never let a single failure crash the whole request
    const artifacts = assessmentInput.artifacts;
    const repoScanResults = await Promise.allSettled(
      artifacts.filter((a) => a.type === 'github').map((a) => scanGithubRepo(a.url))
    );
    const repoScans: RepoScanResult[] = repoScanResults.map((r) =>
      r.status === 'fulfilled' ? r.value : { ...EMPTY_REPO_SCAN }
    );

    // Run domain checks safely
    const domainTargets = artifacts
      .filter((a) => a.type !== 'github')
      .map((a) => a.url)
      .concat(
        assessmentInput.recruiter.emailReceived
          ? [assessmentInput.recruiter.emailReceived.split('@')[1] ?? '']
          : []
      );

    const domainCheckResults = await Promise.allSettled(
      domainTargets.map((url) => checkDomainSafety(url))
    );
    const domainChecks = domainCheckResults.map((r) =>
      r.status === 'fulfilled' ? r.value : {
        domain: 'unknown',
        hasSuspiciousTLD: false,
        isBrandSpoofing: false,
        isShortlink: false,
        domainAgeYears: null,
        vtMalicious: 0,
        vtReputation: 0,
        vtCategories: [],
        riskFlags: ['Domain check failed']
      }
    );

    // Enhanced company verification
    let companyVerification = null;
    try {
      companyVerification = await verifyCompany(
        assessmentInput.recruiter.claimedCompany,
        domainChecks.length > 0 ? domainChecks[0].domain : undefined
      );
    } catch (error) {
      console.error('Company verification failed:', error);
      throw new ExternalServiceError('CompanyVerifier', 'Failed to verify company', error);
    }

    // Email validation for recruiter
    let emailValidation = null;
    if (assessmentInput.recruiter.emailReceived) {
      try {
        emailValidation = await validateEmailWithAPI(assessmentInput.recruiter.emailReceived);
      } catch (error) {
        console.error('Email validation failed:', error);
        throw new ExternalServiceError('EmailValidator', 'Failed to validate email', error);
      }
    }

    // Calculate scores and generate full assessment
    const scores = await calculateScores(assessmentInput, repoScans, domainChecks);
    const finalScore = scores.identityConfidence + scores.employerLegitimacy + scores.processLegitimacy + scores.technicalSafety;
    const verdict = getVerdict(finalScore);
    const redFlags = generateRedFlags(assessmentInput, repoScans, domainChecks);
    const greenSignals = generateGreenSignals(assessmentInput, repoScans, domainChecks);
    const missingEvidence = generateMissingEvidence(assessmentInput);
    const workflowAdvice = generateWorkflowAdvice(verdict, redFlags);

    // Enhanced AI Analysis with LangChain and Groq
    let aiAnalysis = null;
    const groqApiKey = process.env.GROQ_API_KEY;
    
    // First, try LangChain analysis for recruiter messages
    let messageAnalysis = null;
    if (assessmentInput.recruiter.recruiterMessages && assessmentInput.recruiter.recruiterMessages.length > 0) {
      try {
        messageAnalysis = await langChainService.runChain('security', {
          input: assessmentInput.recruiter.recruiterMessages,
          context: {
            type: 'recruiter_messages',
            platform: 'assessment'
          }
        });
      } catch (error) {
        console.error('LangChain message analysis failed:', error);
        throw new ExternalServiceError('LangChain', 'Message analysis failed', error);
      }
    }
    
    // Fallback to Groq for profile analysis if LangChain fails
    let profileAnalysis = null;
    if (groqApiKey) {
      try {
        profileAnalysis = await analyzeProfileWithGroq({
          name: assessmentInput.recruiter.name,
          company: assessmentInput.recruiter.claimedCompany,
          jobTitle: assessmentInput.recruiter.jobTitle,
          email: assessmentInput.recruiter.emailReceived,
          messages: assessmentInput.recruiter.recruiterMessages ? [assessmentInput.recruiter.recruiterMessages] : [],
          jobDescription: assessmentInput.job.jobDescription
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
          profile: assessmentInput.recruiter,
          job: assessmentInput.job,
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

        // Combine LangChain message analysis with profile analysis
        if (messageAnalysis && messageAnalysis.success) {
          // Add LangChain message insights to red flags
          if (messageAnalysis.data.redFlags && messageAnalysis.data.redFlags.length > 0) {
            redFlags.push(...messageAnalysis.data.redFlags.map((flag: any) => ({
              category: 'communication' as const,
              severity: 'high' as const,
              signal: 'LangChain Analysis',
              explanation: `Suspicious message pattern detected: ${flag.explanation}`,
              recommendation: 'Review recruiter messages for scam indicators'
            })));
          }

          // Add LangChain message insights to green signals
          if (messageAnalysis.data.greenFlags && messageAnalysis.data.greenFlags.length > 0) {
            greenSignals.push(...messageAnalysis.data.greenFlags);
          }
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
        throw new ExternalServiceError('Groq', 'AI analysis failed', error);
      }
    }

    const assessmentResult = {
      id: 'temp',
      createdAt: new Date().toISOString(),
      recruiterName: assessmentInput.recruiter.name,
      company: assessmentInput.recruiter.claimedCompany,
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
      aiAnalysis,
      // Enhanced verification results
      companyVerification,
      emailValidation
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
          recruiterName: assessmentInput.recruiter.name,
          company: assessmentInput.recruiter.claimedCompany,
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
      recruiterName: assessmentInput.recruiter.name,
      company: assessmentInput.recruiter.claimedCompany,
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
};

export const POST = withErrorHandling(handler);
