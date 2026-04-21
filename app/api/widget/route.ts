import { NextRequest, NextResponse } from 'next/server'
import { tursoClient } from '@/lib/turso-client'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json(
      { error: 'Missing required param: url' },
      {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    )
  }

  let score: number | null = null
  let blacklisted = false
  let blacklistReason: string | null = null
  let lastScanned: string | null = null
  let scanType: string | null = null

  try {
    const [blResult, scanResult] = await Promise.all([
      tursoClient.execute(
        `SELECT reason, type FROM Blacklist WHERE value LIKE ? LIMIT 1`,
        [`%${url}%`]
      ),
      tursoClient.execute(
        `SELECT overallScore, createdAt, scanType FROM ScanHistory WHERE target LIKE ? AND status = 'completed' ORDER BY createdAt DESC LIMIT 1`,
        [`%${url}%`]
      ),
    ])

    if (blResult.rows.length > 0) {
      blacklisted = true
      blacklistReason = String(blResult.rows[0][0])
    }

    if (scanResult.rows.length > 0) {
      score = Number(scanResult.rows[0][0])
      lastScanned = String(scanResult.rows[0][1])
      scanType = String(scanResult.rows[0][2])
    }
  } catch {
    // DB unavailable — return partial result
  }

  let verdict: string
  if (blacklisted) {
    verdict = 'MALICIOUS'
  } else if (score === null) {
    verdict = 'UNSCANNED'
  } else if (score >= 80) {
    verdict = 'SAFE'
  } else if (score >= 50) {
    verdict = 'CAUTION'
  } else {
    verdict = 'HIGH_RISK'
  }

  const badgeColor = {
    MALICIOUS: '#dc2626',
    HIGH_RISK: '#dc2626',
    CAUTION: '#d97706',
    SAFE: '#16a34a',
    UNSCANNED: '#6b7280',
  }[verdict]

  const result = {
    url,
    verdict,
    score,
    blacklisted,
    blacklistReason,
    lastScanned,
    scanType,
    badgeColor,
    scanUrl: `https://trusthire.vercel.app/?target=${encodeURIComponent(url)}`,
    poweredBy: 'TrustHire — Web3 Recruiting Security Platform',
    embedSnippet: `<div id="th-badge"></div><script>fetch('https://trusthire.vercel.app/api/widget?url=${encodeURIComponent(url)}').then(r=>r.json()).then(d=>{document.getElementById('th-badge').innerHTML='<a href="'+d.scanUrl+'" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:6px;border:1px solid '+d.badgeColor+';color:'+d.badgeColor+';font-size:13px;text-decoration:none;font-family:sans-serif">🛡 TrustHire: <strong>'+d.verdict+'</strong>'+(d.score?(' · '+d.score+'/100'):'')+' ↗</a>'})<\/script>`,
  }

  return NextResponse.json(result, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
