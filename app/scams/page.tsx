import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { toSlug, CATEGORY_LABELS, CATEGORY_DESCRIPTIONS, ScamCategory } from '@/lib/scams-seo'

export const revalidate = 3600 // ISR — rebuild every hour

export const metadata: Metadata = {
  title: 'Web3 Recruiting Scam Database | TrustHire',
  description:
    'Community-verified database of fake recruiters, malicious GitHub repositories, and phishing domains targeting blockchain and Web3 developers. Updated in real time.',
  keywords: [
    'web3 scam recruiter',
    'blockchain developer scam',
    'fake crypto job offer',
    'malicious github repository web3',
    'phishing domain crypto',
    'trusthire scam database',
  ],
  openGraph: {
    title: 'Web3 Recruiting Scam Database | TrustHire',
    description:
      'Verified scam reports from the Web3 developer community. Check before you apply.',
    type: 'website',
    url: 'https://trusthire.vercel.app/scams',
  },
  alternates: {
    canonical: 'https://trusthire.vercel.app/scams',
  },
}

async function getStats() {
  const [total, byCategory] = await Promise.all([
    prisma.scamReport.count({ where: { status: 'approved' } }),
    prisma.scamReport.groupBy({
      by: ['category'],
      where: { status: 'approved' },
      _count: { id: true },
    }),
  ])
  return { total, byCategory }
}

async function getRecentReports(category?: string) {
  return prisma.scamReport.findMany({
    where: {
      status: 'approved',
      ...(category ? { category } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
}

export default async function ScamsIndexPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const { category } = searchParams
  const [stats, reports] = await Promise.all([
    getStats(),
    getRecentReports(category),
  ])

  const listJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Web3 Recruiting Scam Database',
    description:
      'Community-verified scam reports targeting Web3 and blockchain developers',
    numberOfItems: stats.total,
    itemListElement: reports.slice(0, 10).map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://trusthire.vercel.app/scams/${toSlug(`${r.recruiterName}-${r.company}-${r.id.slice(0, 6)}`)}`,
      name: `${r.recruiterName} @ ${r.company}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }}
      />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="border-b border-border bg-card">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-foreground transition-colors">TrustHire</Link>
              <span>/</span>
              <span className="text-foreground">Scam Database</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-3">
              Web3 Recruiting Scam Database
            </h1>
            <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
              Community-verified reports of fake recruiters, malicious repositories,
              and phishing domains targeting blockchain and Web3 developers.
              Every entry is reviewed before publication.
            </p>

            {/* Stats */}
            <div className="flex gap-6 mt-8">
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">Verified Reports</div>
              </div>
              {stats.byCategory.map((c) => (
                <div key={c.category}>
                  <div className="text-2xl font-bold text-foreground">{c._count.id}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">
                    {CATEGORY_LABELS[c.category as ScamCategory] ?? c.category}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/scams"
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              All
            </Link>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <Link
                key={key}
                href={`/scams?category=${key}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  category === key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Reports List */}
          {reports.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">No verified reports yet in this category.</p>
              <Link
                href="/report"
                className="mt-4 inline-block text-primary hover:underline text-sm"
              >
                Submit a report →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => {
                const slug = toSlug(`${report.recruiterName}-${report.company}-${report.id.slice(0, 6)}`)
                return (
                  <Link
                    key={report.id}
                    href={`/scams/${slug}`}
                    className="block group"
                  >
                    <article className="border border-border rounded-lg p-5 bg-card hover:border-primary/50 hover:shadow-sm transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-destructive/10 text-destructive">
                              {CATEGORY_LABELS[report.category as ScamCategory] ?? report.category}
                            </span>
                            <time className="text-xs text-muted-foreground">
                              {new Date(report.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </time>
                          </div>
                          <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {report.recruiterName}
                            {report.company && (
                              <span className="text-muted-foreground font-normal"> @ {report.company}</span>
                            )}
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {report.evidence}
                          </p>
                        </div>
                        <span className="text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1">→</span>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 border border-border rounded-lg p-6 bg-card text-center">
            <h3 className="font-semibold text-foreground mb-2">Encountered a Web3 recruiting scam?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Help protect the community. Submit a verified report and it will be reviewed within 24h.
            </p>
            <Link
              href="/report"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Submit a Report
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
