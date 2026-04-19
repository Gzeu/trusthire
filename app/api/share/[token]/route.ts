import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// ─── GET /api/share/[token] ────────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const token = params.token;
  
  // Rate-limit: 60 requests per minute per IP
  const ip = getClientIp(req);
  if (!checkRateLimit(ip, 60, 60_000)) {
    return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
  }

  try {
    // Find assessment by share token
    const assessment = await prisma.assessment.findUnique({
      where: { shareToken: token },
      select: {
        id: true,
        recruiterName: true,
        company: true,
        position: true,
        finalScore: true,
        verdict: true,
        createdAt: true,
        shareToken: true,
        isPublic: true,
        identityScore: true,
        repoScore: true,
        riskFactors: true,
        warnings: true,
        recommendations: true,
      },
    });

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Check if assessment is publicly shareable
    if (!assessment.isPublic) {
      return NextResponse.json({ error: 'Assessment is not public' }, { status: 403 });
    }

    // Format response
    const response = {
      id: assessment.id,
      recruiterName: assessment.recruiterName,
      company: assessment.company,
      position: assessment.position,
      finalScore: assessment.finalScore,
      verdict: assessment.verdict,
      createdAt: assessment.createdAt.toISOString(),
      shareToken: assessment.shareToken,
      isPublic: assessment.isPublic,
      analysis: {
        identityScore: assessment.identityScore || 0,
        repoScore: assessment.repoScore || 0,
        riskFactors: assessment.riskFactors || [],
        warnings: assessment.warnings || [],
        recommendations: assessment.recommendations || [],
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[api/share/[token]] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ─── POST /api/share/[token] ───────────────────────────────────────────────────
// Toggle public sharing status (for assessment owners)

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const token = params.token;
  
  // Rate-limit: 10 requests per minute per IP
  const ip = getClientIp(req);
  if (!checkRateLimit(ip, 10, 60_000)) {
    return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { isPublic } = body;

    if (typeof isPublic !== 'boolean') {
      return NextResponse.json({ error: 'isPublic must be a boolean' }, { status: 400 });
    }

    // Update assessment sharing status
    const assessment = await prisma.assessment.update({
      where: { shareToken: token },
      data: { isPublic },
      select: {
        id: true,
        shareToken: true,
        isPublic: true,
      },
    });

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      shareToken: assessment.shareToken,
      isPublic: assessment.isPublic,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://trusthire.vercel.app'}/share/${assessment.shareToken}`,
    });
  } catch (error) {
    console.error('[api/share/[token]] POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
