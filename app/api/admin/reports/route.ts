import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { refreshBlacklist } from '@/lib/blacklistCache';

function checkAdmin(req: NextRequest): boolean {
  const secret = req.headers.get('x-admin-secret');
  return secret === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const skip = (page - 1) * limit;

  const where = status ? { status } : {};

  const [reports, total] = await Promise.all([
    prisma.scamReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.scamReport.count({ where }),
  ]);

  return NextResponse.json({
    reports,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function PATCH(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { reportId, action, addToBlacklist, blacklistType, blacklistValue, reason } = body as {
    reportId: string;
    action: 'approve' | 'reject';
    addToBlacklist?: boolean;
    blacklistType?: string;
    blacklistValue?: string;
    reason?: string;
  };

  if (!reportId || !action) {
    return NextResponse.json({ error: 'Missing reportId or action.' }, { status: 400 });
  }
  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ error: 'action must be approve or reject.' }, { status: 400 });
  }

  const report = await prisma.scamReport.findUnique({ where: { id: reportId } });
  if (!report) {
    return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
  }

  await prisma.scamReport.update({
    where: { id: reportId },
    data: {
      status: action === 'approve' ? 'approved' : 'rejected',
      resolvedAt: new Date(),
      resolvedBy: 'admin',
    },
  });

  if (action === 'approve' && addToBlacklist && blacklistType && blacklistValue) {
    const normalizedValue = blacklistValue.trim().toLowerCase();
    const existing = await prisma.blacklist.findFirst({
      where: { type: blacklistType, value: normalizedValue },
    });

    if (existing) {
      await prisma.blacklist.update({
        where: { id: existing.id },
        data: { reportCount: { increment: 1 }, reason: reason || existing.reason },
      });
    } else {
      await prisma.blacklist.create({
        data: {
          type: blacklistType,
          value: normalizedValue,
          reason: reason || `Approved from report #${reportId}`,
          addedBy: 'admin',
          reportCount: 1,
        },
      });
    }
    await refreshBlacklist();
  }

  return NextResponse.json({ success: true });
}
