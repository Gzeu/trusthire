import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/prisma'
import { toSlug, CATEGORY_LABELS, ScamCategory } from '@/lib/scams-seo'

export const runtime = 'edge'
export const revalidate = 86400
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function ScamOgImage({ params }: { params: { slug: string } }) {
  const reports = await prisma.scamReport.findMany({ where: { status: 'approved' } })
  const report = reports.find(
    (r) => toSlug(`${r.recruiterName}-${r.company}-${r.id.slice(0, 6)}`) === params.slug
  )

  const categoryLabel = report
    ? (CATEGORY_LABELS[report.category as ScamCategory] ?? report.category)
    : 'Scam Report'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0f0f0f',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              background: '#ef4444',
              color: 'white',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            ⚠ {categoryLabel}
          </div>
        </div>

        {/* Main content */}
        <div>
          <div style={{ color: '#ef4444', fontSize: '16px', fontWeight: 600, marginBottom: '12px', letterSpacing: '0.5px' }}>
            SCAM ALERT — VERIFIED BY TRUSTHIRE
          </div>
          <div style={{ color: '#ffffff', fontSize: '52px', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
            {report ? `${report.recruiterName}` : 'Unknown Recruiter'}
          </div>
          {report?.company && (
            <div style={{ color: '#a3a3a3', fontSize: '28px', fontWeight: 400 }}>
              @ {report.company}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ color: '#525252', fontSize: '18px' }}>
            trusthire.vercel.app/scams
          </div>
          <div style={{ color: '#525252', fontSize: '16px' }}>
            Web3 Developer Protection
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
