import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import {
  toSlug,
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
  ScamCategory,
  buildScamJsonLd,
  buildBreadcrumbJsonLd,
} from '@/lib/scams-seo'

export const revalidate = 3600

interface Props {
  params: { slug: string }
}

async function getReportBySlug(slug: string) {
  const reports = await prisma.scamReport.findMany({
    where: { status: 'approved' },
  })
  return reports.find(
    (r) => toSlug(`${r.recruiterName}-${r.company}-${r.id.slice(0, 6)}`) === slug
  ) ?? null
}

export async function generateStaticParams() {
  const reports = await prisma.scamReport.findMany({
    where: { status: 'approved' },
    select: { id: true, recruiterName: true, company: true },
    take: 1000,
  })
  return reports.map((r) => ({
    slug: toSlug(`${r.recruiterName}-${r.company}-${r.id.slice(0, 6)}`),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const report = await getReportBySlug(params.slug)
  if (!report) return { title: 'Report Not Found | TrustHire' }

  const categoryLabel = CATEGORY_LABELS[report.category as ScamCategory] ?? report.category
  const title = `${report.recruiterName} @ ${report.company} — Web3 Scam Alert | TrustHire`
  const description = `Verified ${categoryLabel.toLowerCase()} targeting Web3 developers. ${report.evidence.slice(0, 160)}...`

  return {
    title,
    description,
    keywords: [
      `${report.recruiterName} scam`,
      `${report.company} fake recruiter`,
      `web3 ${categoryLabel.toLowerCase()}`,
      'blockchain developer scam',
      'crypto recruiting fraud',
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://trusthire.vercel.app/scams/${params.slug}`,
      publishedTime: report.createdAt.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://trusthire.vercel.app/scams/${params.slug}`,
    },
  }
}

export default async function ScamDetailPage({ params }: Props) {
  const report = await getReportBySlug(params.slug)
  if (!report) notFound()

  const categoryLabel = CATEGORY_LABELS[report.category as ScamCategory] ?? report.category
  const scamJsonLd = buildScamJsonLd(report)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'TrustHire', url: 'https://trusthire.vercel.app' },
    { name: 'Scam Database', url: 'https://trusthire.vercel.app/scams' },
    { name: `${report.recruiterName} @ ${report.company}`, url: `https://trusthire.vercel.app/scams/${params.slug}` },
  ])

  // Related reports — same category, exclude current
  const related = await prisma.scamReport.findMany({
    where: { status: 'approved', category: report.category, NOT: { id: report.id } },
    orderBy: { createdAt: 'desc' },
    take: 4,
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(scamJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-10">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">TrustHire</Link>
            <span>/</span>
            <Link href="/scams" className="hover:text-foreground transition-colors">Scam Database</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">{report.recruiterName}</span>
          </nav>

          {/* Report Header */}
          <article>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-destructive/10 text-destructive uppercase tracking-wide">
                ⚠ {categoryLabel}
              </span>
              <span className="text-xs text-muted-foreground">
                Verified •{' '}
                <time dateTime={report.createdAt.toISOString()}>
                  {new Date(report.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
              {report.recruiterName}
              {report.company && (
                <span className="text-muted-foreground font-normal"> @ {report.company}</span>
              )}
            </h1>

            <p className="text-muted-foreground text-sm mb-8">
              {CATEGORY_DESCRIPTIONS[report.category as ScamCategory]}
            </p>

            {/* Evidence Card */}
            <div className="border border-border rounded-lg overflow-hidden mb-6">
              <div className="px-4 py-3 bg-muted/50 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">Evidence & Description</h2>
              </div>
              <div className="px-4 py-4">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {report.evidence}
                </p>
              </div>
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="border border-border rounded-lg p-4 bg-card">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Recruiter Name</div>
                <div className="text-sm font-medium text-foreground">{report.recruiterName}</div>
              </div>
              <div className="border border-border rounded-lg p-4 bg-card">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Company / Platform</div>
                <div className="text-sm font-medium text-foreground">{report.company || '—'}</div>
              </div>
              <div className="border border-border rounded-lg p-4 bg-card">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Scam Category</div>
                <div className="text-sm font-medium text-foreground">{categoryLabel}</div>
              </div>
              <div className="border border-border rounded-lg p-4 bg-card">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Date Reported</div>
                <div className="text-sm font-medium text-foreground">
                  {new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Warning banner */}
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 mb-8">
              <h3 className="text-sm font-semibold text-destructive mb-1">⚠ Safety Warning</h3>
              <p className="text-sm text-muted-foreground">
                Do not interact with this recruiter or share any personal information, wallet addresses, or private keys.
                If you have received a similar offer, report it immediately.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-12">
              <Link
                href="/assess"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Scan a Recruiter
              </Link>
              <Link
                href="/report"
                className="inline-flex items-center gap-2 border border-border bg-card text-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                Submit a Report
              </Link>
            </div>
          </article>

          {/* Related Reports */}
          {related.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-foreground mb-4">
                Related {categoryLabel} Reports
              </h2>
              <div className="space-y-3">
                {related.map((r) => {
                  const relSlug = toSlug(`${r.recruiterName}-${r.company}-${r.id.slice(0, 6)}`)
                  return (
                    <Link key={r.id} href={`/scams/${relSlug}`} className="block group">
                      <div className="border border-border rounded-lg p-4 bg-card hover:border-primary/50 transition-all">
                        <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                          {r.recruiterName} @ {r.company}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{r.evidence}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

        </div>
      </main>
    </>
  )
}
