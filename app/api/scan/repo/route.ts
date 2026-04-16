import { NextRequest, NextResponse } from 'next/server';
import { scanGithubRepo } from '@/lib/repoScanner';

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });
  const result = await scanGithubRepo(url);
  return NextResponse.json(result);
}
