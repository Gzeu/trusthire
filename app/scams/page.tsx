import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Web3 Recruiting Scam Database | TrustHire',
  description:
    'Community-verified database of fake recruiters, malicious repositories, and blockchain developer scams. Search and report Web3 recruiting fraud.',
  openGraph: {
    title: 'Web3 Scam Recruiter Database — TrustHire',
    description: 'Browse confirmed scam reports from the Web3 developer community.',
    type: 'website',
  },
};

async function getReports() {
  try {
    return await prisma.scamReport.findMany({
      where: { status: 'confirmed' },
      orderBy: { upvotes: 'desc' },
      take: 50,
      select: {
        id: true,
        slug: true,
        recruiterName: true,
        platform: true,
        upvotes: true,
        createdAt: true,
        description: true,
      },
    });
  } catch {
    return [];
  }
}

export default async function ScamsPage() {
  const reports = await getReports();

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="text-sm text-emerald-400 hover:text-emerald-300 mb-4 inline-block">
            ← Back to TrustHire
          </Link>
          <h1 className="text-3xl font-bold text-white mb-3">
            Web3 Recruiting Scam Database
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Community-verified reports of fake recruiters, malicious repositories, and
            social engineering attacks targeting blockchain developers. Every entry is
            upvoted and confirmed by multiple community members.
          </p>
          <div className="flex gap-4 mt-6">
            <Link
              href="/report"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              + Submit a Report
            </Link>
            <span className="text-sm text-gray-500 flex items-center">
              {reports.length} confirmed reports
            </span>
          </div>
        </div>

        {/* JSON-LD structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Dataset',
              name: 'Web3 Recruiting Scam Database',
              description:
                'Community-verified database of fake recruiters and scam operations targeting blockchain developers.',
              url: 'https://trusthire.vercel.app/scams',
              creator: { '@type': 'Organization', name: 'TrustHire' },
            }),
          }}
        />

        {/* Reports List */}
        {reports.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">No confirmed reports yet.</p>
            <p className="text-sm">Be the first to submit a scam report.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((r) => (
              <Link
                key={r.id}
                href={`/scams/${r.slug}`}
                className="block bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-emerald-800 rounded-xl p-5 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-white truncate">{r.recruiterName}</h2>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{r.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                        {r.platform}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center shrink-0">
                    <span className="text-red-400 font-bold text-lg">{r.upvotes}</span>
                    <span className="text-xs text-gray-500">votes</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
