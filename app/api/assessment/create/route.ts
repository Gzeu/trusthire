import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateScores, getVerdict, generateRedFlags, generateGreenSignals, generateMissingEvidence, generateWorkflowAdvice } from '@/lib/scoring';
import { scanGithubRepo } from '@/lib/repoScanner';
import { checkDomainSafety } from '@/lib/domainChecker';
import { generateIncidentReport } from '@/lib/reportGenerator';
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
  const scores = calculateScores(body, repoScans, domainChecks);
  const finalScore = scores.identityConfidence + scores.employerLegitimacy + scores.processLegitimacy + scores.technicalSafety;
  const verdict = getVerdict(finalScore);
  const redFlags = generateRedFlags(body, repoScans, domainChecks);
  const greenSignals = generateGreenSignals(body, repoScans, domainChecks);
  const missingEvidence = generateMissingEvidence(body);
  const workflowAdvice = generateWorkflowAdvice(verdict, redFlags);

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
    shareToken: 'temp'
  };

  // Generate incident report
  const incidentReport = generateIncidentReport(assessmentResult);

  // Save to DB
  let savedId: string;
  let shareToken: string;
  try {
    const saved = await prisma.assessment.create({
      data: {
        sessionId: `session_${Date.now()}`, // Generate a session ID
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
    // If DB is not configured, generate a temp ID
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
  });
}
