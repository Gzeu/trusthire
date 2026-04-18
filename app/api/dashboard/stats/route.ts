import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { prisma } from '@/lib/prisma';

interface DashboardStats {
  totalAssessments: number;
  averageScore: number;
  verdictCounts: {
    low_risk: number;
    caution: number;
    high_risk: number;
    critical: number;
  };
  recentAssessments: Array<{
    id: string;
    createdAt: string;
    recruiterName: string;
    company: string;
    finalScore: number;
    verdict: string;
    shareToken: string;
  }>;
}

export async function GET(request: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(request);
  const isAllowed = await checkRateLimit(clientIp, 30, 60 * 1000); // 30 requests per minute
  if (!isAllowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  try {
    // Execute all queries in parallel for better performance
    const [
      totalAssessments,
      scoreData,
      verdictCounts,
      recentAssessments
    ] = await Promise.all([
      // Total assessments count
      prisma.assessment.count(),
      
      // All scores for calculating global average
      prisma.assessment.findMany({
        select: {
          finalScore: true
        }
      }),
      
      // Verdict distribution
      prisma.assessment.groupBy({
        by: ['verdict']
      }),
      
      // Last 10 assessments
      prisma.assessment.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          createdAt: true,
          recruiterName: true,
          company: true,
          finalScore: true,
          verdict: true,
          shareToken: true
        }
      })
    ]);

    // Calculate global average score
    const averageScore = scoreData.length > 0
      ? Math.round(
          scoreData.reduce((sum: number, assessment: any) => sum + assessment.finalScore, 0) / 
          scoreData.length
        )
      : 0;

    // Initialize verdict counts with defaults
    const verdictCountsMap = {
      low_risk: 0,
      caution: 0,
      high_risk: 0,
      critical: 0
    };

    // Populate verdict counts from groupBy result
    verdictCounts.forEach((item: any) => {
      if (item.verdict in verdictCountsMap) {
        verdictCountsMap[item.verdict as keyof typeof verdictCountsMap] = item._count;
      }
    });

    const stats: DashboardStats = {
      totalAssessments,
      averageScore,
      verdictCounts: verdictCountsMap,
      recentAssessments: recentAssessments.map((assessment: any) => ({
        ...assessment,
        createdAt: assessment.createdAt.toISOString()
      }))
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
