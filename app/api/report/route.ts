import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const VALID_CATEGORIES = ['fake_job', 'malicious_repo', 'phishing_domain', 'scam_payment', 'other'];

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  const allowed = checkRateLimit(`report:${ip}`, 5, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. You can submit at most 5 reports per hour.' },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { recruiterName, company, evidence, category } = body as Record<string, string>;

  if (!recruiterName || !company || !evidence || !category) {
    return NextResponse.json(
      { error: 'Missing required fields: recruiterName, company, evidence, category.' },
      { status: 400 }
    );
  }

  if (typeof recruiterName !== 'string' || recruiterName.trim().length === 0) {
    return NextResponse.json({ error: 'recruiterName must be a non-empty string.' }, { status: 400 });
  }
  if (typeof company !== 'string' || company.trim().length === 0) {
    return NextResponse.json({ error: 'company must be a non-empty string.' }, { status: 400 });
  }
  if (typeof evidence !== 'string' || evidence.trim().length === 0) {
    return NextResponse.json({ error: 'evidence must be a non-empty string.' }, { status: 400 });
  }
  if (evidence.length > 2000) {
    return NextResponse.json({ error: 'evidence must not exceed 2000 characters.' }, { status: 400 });
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json(
      { error: `category must be one of: ${VALID_CATEGORIES.join(', ')}.` },
      { status: 400 }
    );
  }

  const report = await prisma.scamReport.create({
    data: {
      recruiterName: recruiterName.trim(),
      company: company.trim(),
      evidence: evidence.trim(),
      category,
      status: 'pending',
      reporterIp: ip,
    },
  });

  const existing = await prisma.blacklist.findFirst({
    where: {
      OR: [
        { value: recruiterName.trim().toLowerCase() },
        { value: company.trim().toLowerCase() },
      ],
    },
  });

  if (existing) {
    await prisma.blacklist.update({
      where: { id: existing.id },
      data: { reportCount: { increment: 1 } },
    });
  }

  return NextResponse.json({ success: true, reportId: report.id }, { status: 201 });
}
