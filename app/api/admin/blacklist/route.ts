import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { refreshBlacklist } from '@/lib/blacklistCache';

const VALID_TYPES = ['domain', 'email', 'repo', 'github_user'];

function checkAdmin(req: NextRequest): boolean {
  const secret = req.headers.get('x-admin-secret');
  return secret === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || undefined;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
  const skip = (page - 1) * limit;

  const where = type ? { type } : {};

  const [entries, total] = await Promise.all([
    prisma.blacklist.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.blacklist.count({ where }),
  ]);

  return NextResponse.json({
    entries,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { type, value, reason } = body as { type: string; value: string; reason: string };

  if (!type || !value || !reason) {
    return NextResponse.json({ error: 'Missing required fields: type, value, reason.' }, { status: 400 });
  }
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json(
      { error: `type must be one of: ${VALID_TYPES.join(', ')}.` },
      { status: 400 }
    );
  }

  const normalizedValue = value.trim().toLowerCase();
  const existing = await prisma.blacklist.findFirst({ where: { type, value: normalizedValue } });
  if (existing) {
    return NextResponse.json({ error: 'Entry already exists.' }, { status: 409 });
  }

  const entry = await prisma.blacklist.create({
    data: {
      type,
      value: normalizedValue,
      reason: reason.trim(),
      addedBy: 'admin',
      reportCount: 1,
    },
  });

  await refreshBlacklist();
  return NextResponse.json({ success: true, entry }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { id } = body as { id: string };
  if (!id) {
    return NextResponse.json({ error: 'Missing id.' }, { status: 400 });
  }

  const existing = await prisma.blacklist.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Entry not found.' }, { status: 404 });
  }

  await prisma.blacklist.delete({ where: { id } });
  await refreshBlacklist();

  return NextResponse.json({ success: true });
}
