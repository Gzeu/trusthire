import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let report = null;
  try {
    report = await prisma.scamReport.findUnique({ where: { slug: params.slug } });
  } catch {}

  if (!report) {
    return { title: 'Report Not Found | TrustHire' };
  }

  return {
    title: `${report.recruiterName} — Scam Report | TrustHire`,
    description: report.description.slice(0, 155),
    openGraph: {
      title: `⚠ Scam Alert: ${report.recruiterName}`,
      description: report.description.slice(0, 155),
      type: 'article',
    },
  };
}

export default async function ScamDetailPage({ params }: Props) {
  let report = null;
  try {
    report = await prisma.scamReport.findUnique({ where: { slug: params.slug } });
  } catch {}

  if (!report || report.status === 'pending') notFound();

  const riskColor =
    report.upvotes >= 10 ? 'text-red-400' :
    report.upvotes >= 4  ? 'text-orange-400' : 'text-yellow-400';

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/scams" className="text-sm text-emerald-400 hover:text-emerald-300 mb-6 inline-block">
          ← All Reports
        </Link>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Report',
              name: `Scam Report: ${report.recruiterName}`,
              description: report.description,
              datePublished: report.createdAt,
              author: { '@type': 'Organization', name: 'TrustHire Community' },
              about: {
                '@type': 'Person',
                name: report.recruiterName,
                url: report.recruiterUrl ?? undefined,
              },
            }),
          }}
        />

        {/* Warning banner */}
        <div className="bg-red-950 border border-red-800 rounded-xl p-4 mb-8 flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-red-300">Community Verified Scam Report</p>
            <p className="text-sm text-red-400 mt-1">
              This report has been verified by {report.upvotes} community member{report.upvotes !== 1 ? 's' : ''}.
              Exercise extreme caution.
            </p>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-2">{report.recruiterName}</h1>

          <div className="flex flex-wrap gap-3 mb-6">
            <span className="text-xs bg-gray-800 text-gray-400 px-3 py-1 rounded-full">
              Platform: {report.platform}
            </span>
            {report.recruiterUrl && (
              <a
                href={report.recruiterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-gray-800 text-emerald-400 px-3 py-1 rounded-full hover:bg-gray-700 transition-colors"
              >
                View Profile →
              </a>
            )}
            <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-gray-800 ${riskColor}`}>
              {report.upvotes} upvote{report.upvotes !== 1 ? 's' : ''}
            </span>
          </div>

          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Description</h2>
          <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{report.description}</p>

          {report.evidence && (
            <>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-8 mb-3">Evidence</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap bg-gray-800 rounded-lg p-4">
                {report.evidence}
              </p>
            </>
          )}

          <p className="text-xs text-gray-600 mt-8">
            Reported on {new Date(report.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-400 text-sm mb-4">
            Encountered this scammer? Help the community by upvoting or submitting more evidence.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/report"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Submit a Report
            </Link>
            <Link
              href="/"
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Scan a Recruiter
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
