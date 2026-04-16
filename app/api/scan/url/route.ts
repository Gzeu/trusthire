import { NextRequest, NextResponse } from 'next/server';
import { checkDomainSafety } from '@/lib/domainChecker';

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });
  const result = await checkDomainSafety(url);
  return NextResponse.json(result);
}
