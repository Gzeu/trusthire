import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/reports/vote { reportId, direction: 'up' | 'down' }
export async function POST(req: NextRequest) {
  try {
    const { reportId, direction } = await req.json();

    if (!reportId || !['up', 'down'].includes(direction)) {
      return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
    }

    const report = await prisma.scamReport.update({
      where: { id: reportId },
      data: {
        upvotes: { increment: direction === 'up' ? 1 : -1 },
        // Auto-confirm when community heavily upvotes
        status: undefined,
      },
    });

    // Auto-promote to confirmed after 3 upvotes
    if (report.upvotes >= 3 && report.status === 'pending') {
      await prisma.scamReport.update({
        where: { id: reportId },
        data: { status: 'confirmed' },
      });
    }

    return NextResponse.json({ success: true, upvotes: report.upvotes });
  } catch (err) {
    return NextResponse.json(
      { error: 'Vote failed', details: String(err) },
      { status: 500 }
    );
  }
}
