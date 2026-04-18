import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit(ip, 30, 60_000)) {
    return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20')));
  const skip = (page - 1) * limit;

  try {
    const [assessments, total] = await Promise.all([
      prisma.assessment.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
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
      prisma.assessment.count(),
    ]);

    return NextResponse.json({
      assessments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Dashboard fetch error:', err);
    return NextResponse.json({ assessments: [], total: 0, page: 1, totalPages: 0 });
  }
}
