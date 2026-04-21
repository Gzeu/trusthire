import { NextRequest, NextResponse } from 'next/server';

// GET /api/badge/[owner]/[repo]
// Returns a dynamic SVG badge for GitHub READMEs
export const runtime = 'edge';

function makeSvg(riskLevel: string, score: number): string {
  const color =
    riskLevel === 'HIGH' ? '#dc2626' :
    riskLevel === 'MEDIUM' ? '#d97706' : '#16a34a';
  const label = 'TrustHire';
  const value =
    riskLevel === 'LOW'    ? `✓ Safe (${score})` :
    riskLevel === 'MEDIUM' ? `⚠ Risk: ${score}` :
                              `✗ High Risk: ${score}`;

  const labelW = 80;
  const valueW = Math.max(90, value.length * 7);
  const totalW = labelW + valueW;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="20">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalW}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelW}" height="20" fill="#555"/>
    <rect x="${labelW}" width="${valueW}" height="20" fill="${color}"/>
    <rect width="${totalW}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="${labelW / 2}" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${labelW / 2}" y="14">${label}</text>
    <text x="${labelW + valueW / 2}" y="15" fill="#010101" fill-opacity=".3">${value}</text>
    <text x="${labelW + valueW / 2}" y="14">${value}</text>
  </g>
</svg>`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { owner: string; repo: string } }
) {
  const { owner, repo } = params;
  const base = req.nextUrl.origin;

  try {
    const scanRes = await fetch(`${base}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: `https://github.com/${owner}/${repo}`,
        source: 'badge',
      }),
    });

    const data = scanRes.ok ? await scanRes.json() : {};
    const score: number = data?.riskScore ?? data?.risk_score ?? 0;
    const level =
      score >= 75 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';

    const svg = makeSvg(level, score);

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch {
    const svg = makeSvg('UNKNOWN', 0);
    return new NextResponse(svg, {
      headers: { 'Content-Type': 'image/svg+xml' },
    });
  }
}
