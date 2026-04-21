import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { toSlug } from '@/lib/scams-seo'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://trusthire.vercel.app'

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/scams`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/assess`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/report`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/dashboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
  ]

  // Dynamic scam pages
  const reports = await prisma.scamReport.findMany({
    where: { status: 'approved' },
    select: { id: true, recruiterName: true, company: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })

  const scamRoutes: MetadataRoute.Sitemap = reports.map((r) => ({
    url: `${baseUrl}/scams/${toSlug(`${r.recruiterName}-${r.company}-${r.id.slice(0, 6)}`)}`,
    lastModified: r.createdAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...scamRoutes]
}
