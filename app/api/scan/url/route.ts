import { NextRequest, NextResponse } from 'next/server';
import { checkDomainSafety } from '@/lib/domainChecker';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit(ip, 20, 60_000)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please wait a minute.' }, { status: 429 });
  }

  let url: string;
  try {
    const body = await req.json();
    url = body.url;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'url is required' }, { status: 400 });
  }

  try {
    const result = await checkDomainSafety(url);
    return NextResponse.json(result);
  } catch (err) {
    console.error('URL scan error:', err);
    return NextResponse.json({ error: 'Scan failed' }, { status: 500 });
  }
}
