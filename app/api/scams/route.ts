import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { toSlug, CATEGORY_LABELS, ScamCategory } from '@/lib/scams-seo'

export const revalidate = 3600

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') ?? undefined
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20')))
  const skip = (page - 1) * limit

  const [reports, total] = await Promise.all([
    prisma.scamReport.findMany({
      where: {
        status: 'approved',
        ...(category ? { category } : {}),
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        createdAt: true,
        recruiterName: true,
        company: true,
        category: true,
        evidence: true,
      },
    }),
    prisma.scamReport.count({
      where: { status: 'approved', ...(category ? { category } : {}) },
    }),
  ])

  const data = reports.map((r) => ({
    id: r.id,
    slug: toSlug(`${r.recruiterName}-${r.company}-${r.id.slice(0, 6)}`),
    url: `https://trusthire.vercel.app/scams/${toSlug(`${r.recruiterName}-${r.company}-${r.id.slice(0, 6)}`)}`,
    recruiterName: r.recruiterName,
    company: r.company,
    category: r.category,
    categoryLabel: CATEGORY_LABELS[r.category as ScamCategory] ?? r.category,
    evidence: r.evidence.slice(0, 300),
    reportedAt: r.createdAt,
  }))

  return NextResponse.json(
    {
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
      },
    }
  )
}
