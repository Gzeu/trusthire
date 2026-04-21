import { NextRequest, NextResponse } from 'next/server';

// GET /api/widget?url=<target>&theme=light|dark
// Returns JSON risk summary for embeddable widget
export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const theme = searchParams.get('theme') ?? 'light';

  if (!url) {
    return NextResponse.json({ error: 'url param required' }, { status: 400 });
  }

  // Proxy to internal scan endpoint
  try {
    const base = req.nextUrl.origin;
    const scanRes = await fetch(`${base}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, source: 'widget' }),
    });

    if (!scanRes.ok) {
      throw new Error(`scan failed: ${scanRes.status}`);
    }

    const data = await scanRes.json();
    const score: number = data?.riskScore ?? data?.risk_score ?? 0;
    const level: string = score >= 75 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';
    const color = level === 'HIGH' ? '#dc2626' : level === 'MEDIUM' ? '#d97706' : '#16a34a';

    const payload = {
      url,
      riskScore: score,
      riskLevel: level,
      color,
      theme,
      scannedAt: new Date().toISOString(),
      poweredBy: 'TrustHire',
      poweredByUrl: 'https://trusthire.vercel.app',
    };

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Analysis failed', details: String(err) },
      { status: 500 }
    );
  }
}
