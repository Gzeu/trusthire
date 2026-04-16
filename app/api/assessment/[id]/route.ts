import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateIncidentReport } from '@/lib/reportGenerator';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id: params.id },
    });
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Transform database data to match frontend expectations
    const scores = assessment.scoreData as any;
    const redFlags = assessment.redFlags as any[];
    const vtResults = assessment.vtResults as any[] || [];
    const repoScans = assessment.repoScans as any[] || [];
    
    // Create a minimal AssessmentResult-like object for the incident report
    const assessmentResult = {
      id: assessment.id,
      createdAt: assessment.createdAt.toISOString(),
      recruiterName: assessment.recruiterName,
      company: assessment.company,
      finalScore: assessment.finalScore,
      verdict: assessment.verdict as any, // Cast to Verdict type
      scores: scores,
      redFlags: redFlags,
      greenSignals: [], // Not stored in DB
      missingEvidence: [], // Not stored in DB
      workflowAdvice: [], // Not stored in DB
      repoScans: repoScans,
      vtResults: vtResults.map(vt => ({ url: '', urlResult: vt.urlResult, domainResult: vt.domainResult })),
      shareToken: assessment.shareToken
    };

    const incidentReport = generateIncidentReport(assessmentResult);

    return NextResponse.json({
      ...assessmentResult,
      incidentReport,
      domainChecks: vtResults, // For compatibility with frontend
    });
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}
