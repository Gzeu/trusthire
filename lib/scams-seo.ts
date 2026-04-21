import { prisma } from '@/lib/prisma'

export type ScamCategory =
  | 'fake_job'
  | 'malicious_repo'
  | 'phishing_domain'
  | 'scam_payment'
  | 'other'

export const CATEGORY_LABELS: Record<ScamCategory, string> = {
  fake_job: 'Fake Job Offer',
  malicious_repo: 'Malicious Repository',
  phishing_domain: 'Phishing Domain',
  scam_payment: 'Scam Payment Request',
  other: 'Other Scam',
}

export const CATEGORY_DESCRIPTIONS: Record<ScamCategory, string> = {
  fake_job:
    'Fraudulent recruiting offers targeting blockchain and Web3 developers with fake employment opportunities.',
  malicious_repo:
    'GitHub repositories containing malware, backdoors, or credential-stealing code disguised as legitimate Web3 tools.',
  phishing_domain:
    'Fake websites impersonating legitimate crypto companies, DAOs, or developer platforms to steal credentials.',
  scam_payment:
    'Fraudulent requests for upfront payment, "test tasks", or wallet drainers disguised as onboarding steps.',
  other:
    'Miscellaneous scam patterns targeting Web3 developers during the recruiting process.',
}

export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

export function fromSlug(slug: string): string {
  return slug.replace(/-/g, ' ')
}

export async function getApprovedScamReports() {
  return prisma.scamReport.findMany({
    where: { status: 'approved' },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getScamReportBySlug(slug: string) {
  const reports = await prisma.scamReport.findMany({
    where: { status: 'approved' },
  })
  return reports.find((r) => toSlug(`${r.recruiterName}-${r.company}-${r.id.slice(0, 6)}`) === slug) ?? null
}

export function buildScamJsonLd(report: {
  recruiterName: string
  company: string
  category: string
  evidence: string
  createdAt: Date
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Report',
    name: `Scam Alert: ${report.recruiterName} @ ${report.company}`,
    description: report.evidence.slice(0, 300),
    datePublished: report.createdAt.toISOString(),
    about: {
      '@type': 'Thing',
      name: CATEGORY_LABELS[report.category as ScamCategory] ?? report.category,
    },
    publisher: {
      '@type': 'Organization',
      name: 'TrustHire',
      url: 'https://trusthire.vercel.app',
    },
  }
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
