'use client';
import { useState } from 'react';
import Link from 'next/link';

const PLATFORMS = ['LinkedIn', 'Telegram', 'Discord', 'Twitter/X', 'Email', 'GitHub', 'Other'];

export default function ReportPage() {
  const [form, setForm] = useState({
    recruiterName: '',
    recruiterUrl: '',
    platform: 'LinkedIn',
    description: '',
    evidence: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Submission failed');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(String(err));
    }
  };

  if (status === 'success') {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-white mb-3">Report Submitted!</h1>
          <p className="text-gray-400 mb-6">
            Thank you for helping protect the Web3 developer community. Your report
            will be reviewed and published once verified by community members.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/scams"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              View All Reports
            </Link>
            <Link
              href="/"
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/scams" className="text-sm text-emerald-400 hover:text-emerald-300 mb-6 inline-block">
          ← Back to Scam Database
        </Link>

        <h1 className="text-2xl font-bold text-white mb-2">Submit a Scam Report</h1>
        <p className="text-gray-400 text-sm mb-8">
          Help protect Web3 developers by reporting fake recruiters, malicious repositories,
          and social engineering attacks. All reports are reviewed before being made public.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recruiter Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Scammer / Recruiter Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.recruiterName}
              onChange={(e) => setForm({ ...form, recruiterName: e.target.value })}
              placeholder="e.g. John Smith, @crypto_recruiter_xyz"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
            <select
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Profile URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Profile / Repository URL
            </label>
            <input
              type="url"
              value={form.recruiterUrl}
              onChange={(e) => setForm({ ...form, recruiterUrl: e.target.value })}
              placeholder="https://linkedin.com/in/..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              What happened? <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the scam attempt. Include: what they asked you to do, how the interaction started, what red flags you noticed..."
              required
              rows={5}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Evidence */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Evidence (optional)
            </label>
            <textarea
              value={form.evidence}
              onChange={(e) => setForm({ ...form, evidence: e.target.value })}
              placeholder="Paste any relevant messages, links, or other evidence..."
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {status === 'error' && (
            <div className="bg-red-950 border border-red-800 rounded-lg px-4 py-3 text-red-400 text-sm">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
          >
            {status === 'loading' ? 'Submitting...' : 'Submit Report'}
          </button>

          <p className="text-xs text-gray-600 text-center">
            Reports are anonymous and reviewed before publication. False reports may be removed.
          </p>
        </form>
      </div>
    </main>
  );
}
