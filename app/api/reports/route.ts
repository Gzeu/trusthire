import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/reports — submit a community scam report
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recruiterName, recruiterUrl, platform, description, evidence } = body;

    if (!recruiterName || !description) {
      return NextResponse.json(
        { error: 'recruiterName and description are required' },
        { status: 400 }
      );
    }

    // Sanitize slug for public URL
    const slug = recruiterName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const report = await prisma.scamReport.create({
      data: {
        recruiterName,
        recruiterUrl: recruiterUrl ?? null,
        platform: platform ?? 'unknown',
        description,
        evidence: evidence ?? null,
        slug: `${slug}-${Date.now()}`,
        upvotes: 0,
        status: 'pending',
      },
    });

    return NextResponse.json({ success: true, id: report.id, slug: report.slug });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to submit report', details: String(err) },
      { status: 500 }
    );
  }
}

// GET /api/reports — list confirmed public reports
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 50);
  const skip = (page - 1) * limit;

  try {
    const [reports, total] = await Promise.all([
      prisma.scamReport.findMany({
        where: { status: 'confirmed' },
        orderBy: { upvotes: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          recruiterName: true,
          platform: true,
          upvotes: true,
          createdAt: true,
        },
      }),
      prisma.scamReport.count({ where: { status: 'confirmed' } }),
    ]);

    return NextResponse.json({ reports, total, page, limit });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch reports', details: String(err) },
      { status: 500 }
    );
  }
}
