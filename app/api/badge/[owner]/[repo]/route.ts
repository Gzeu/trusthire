import { NextRequest, NextResponse } from 'next/server'
import { tursoClient } from '@/lib/turso-client'

export const runtime = 'edge'

export async function GET(
  _req: NextRequest,
  { params }: { params: { owner: string; repo: string } }
) {
  const { owner, repo } = params
  const target = `${owner}/${repo}`

  let score: number | null = null
  let blacklisted = false

  try {
    // Check blacklist first
    const blResult = await tursoClient.execute(
      `SELECT value FROM Blacklist WHERE type = 'repo' AND value LIKE ? LIMIT 1`,
      [`%${target}%`]
    )
    blacklisted = blResult.rows.length > 0

    if (!blacklisted) {
      // Get latest completed scan
      const scanResult = await tursoClient.execute(
        `SELECT overallScore FROM ScanHistory WHERE target LIKE ? AND status = 'completed' ORDER BY createdAt DESC LIMIT 1`,
        [`%${target}%`]
      )
      if (scanResult.rows.length > 0) {
        score = Number(scanResult.rows[0][0])
      }
    }
  } catch {
    // DB unavailable — return neutral unscanned badge
  }

  // Determine badge values
  let message: string
  let color: string

  if (blacklisted) {
    message = 'MALICIOUS'
    color = '#dc2626'
  } else if (score !== null) {
    if (score >= 80) {
      message = `safe | ${score}/100`
      color = '#16a34a'
    } else if (score >= 50) {
      message = `caution | ${score}/100`
      color = '#d97706'
    } else {
      message = `high risk | ${score}/100`
      color = '#dc2626'
    }
  } else {
    message = 'unscanned'
    color = '#6b7280'
  }

  const label = 'TrustHire'
  const labelWidth = 72
  const messageWidth = message.length * 6.5 + 16
  const totalWidth = labelWidth + messageWidth

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${message}">
  <title>${label}: ${message}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${messageWidth}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="${labelWidth / 2}" y="14" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${labelWidth / 2}" y="13">${label}</text>
    <text x="${labelWidth + messageWidth / 2}" y="14" fill="#010101" fill-opacity=".3">${message}</text>
    <text x="${labelWidth + messageWidth / 2}" y="13">${message}</text>
  </g>
</svg>`

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
