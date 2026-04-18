import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RecentAssessment {
  id: string;
  createdAt: string;
  recruiterName: string;
  company: string;
  finalScore: number;
  verdict: string;
  shareToken: string;
}

export interface DashboardStats {
  total: number;
  avgScore: number;
  byVerdict: {
    critical: number;
    high_risk: number;
    caution: number;
    low_risk: number;
  };
  recent: RecentAssessment[];
}

// ─── GET /api/dashboard/stats ─────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // Rate-limit: 30 requests per minute per IP
  const ip = getClientIp(req);
  if (!checkRateLimit(ip, 30, 60_000)) {
    return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
  }

  try {
    // Run all DB queries in parallel for performance
    const [total, allScores, verdictCounts, recent] = await Promise.all([
      // Total number of assessments
      prisma.assessment.count(),

      // All scores (for global average)
      prisma.assessment.findMany({
        select: { finalScore: true },
      }),

      // Group-by verdict counts
      prisma.assessment.groupBy({
        by: ['verdict'],
        _count: { verdict: true },
      }),

      // Last 10 assessments, newest first
      prisma.assessment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          createdAt: true,
          recruiterName: true,
          company: true,
          finalScore: true,
          verdict: true,
          shareToken: true,
        },
      }),
    ]);

    // Compute global average score
    const avgScore =
      allScores.length > 0
        ? Math.round(
            allScores.reduce((sum: number, a: any) => sum + a.finalScore, 0) / allScores.length
          )
        : 0;

    // Map groupBy result into a keyed object with defaults
    const byVerdict = { critical: 0, high_risk: 0, caution: 0, low_risk: 0 };
    for (const row of verdictCounts) {
      const key = row.verdict as keyof typeof byVerdict;
      if (key in byVerdict) byVerdict[key] = row._count.verdict;
    }

    const stats: DashboardStats = {
      total,
      avgScore,
      byVerdict,
      recent: recent.map((a: any) => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
      })),
    };

    return NextResponse.json(stats);
  } catch (err) {
    console.error('[dashboard/stats] DB error:', err);
    return NextResponse.json(
      { error: 'Failed to load dashboard stats.' },
      { status: 500 }
    );
  }
}
