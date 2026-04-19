import { NextRequest, NextResponse } from 'next/server';
import { scanGithubRepo } from '@/lib/repoScanner';
import { withErrorHandling, RateLimitError } from '@/lib/error-handler';
import { validateInput, RepoScanSchema } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const handler = async (req: NextRequest) => {
  const ip = getClientIp(req);
  if (!checkRateLimit(ip, 20, 60_000)) {
    throw new RateLimitError('Repository scan rate limit exceeded. Please wait a minute.');
  }

  // Validate and parse input
  const body = await req.json();
  const { url } = validateInput(RepoScanSchema, body);

  try {
    const result = await scanGithubRepo(url);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Repository scan error:', error);
    throw new Error('Repository scan failed');
  }
};

export const POST = withErrorHandling(handler);
