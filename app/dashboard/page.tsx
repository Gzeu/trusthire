'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Shield, AlertTriangle, CheckCircle, Clock,
  Search, ChevronLeft, ChevronRight, ExternalLink,
  BarChart2, Activity, XCircle, RefreshCw
} from 'lucide-react';

interface AssessmentRow {
  id: string;
  createdAt: string;
  recruiterName: string;
  company: string;
  finalScore: number;
  verdict: string;
  shareToken: string;
}

interface DashboardData {
  assessments: AssessmentRow[];
  total: number;
  page: number;
  totalPages: number;
}

const VERDICT_CONFIG = {
  low_risk:  { label: 'Low Risk',  color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30',  dot: 'bg-green-400' },
  caution:   { label: 'Caution',   color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', dot: 'bg-yellow-400' },
  high_risk: { label: 'High Risk', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', dot: 'bg-orange-400' },
  critical:  { label: 'Critical',  color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30',    dot: 'bg-red-400' },
};

function verdictConfig(v: string) {
  return VERDICT_CONFIG[v as keyof typeof VERDICT_CONFIG] ?? VERDICT_CONFIG.caution;
}

function ScoreBadge({ score, verdict }: { score: number; verdict: string }) {
  const cfg = verdictConfig(verdict);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {score}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, color = 'text-white' }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="bg-[#111113] border border-white/5 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-white/30 text-xs font-mono uppercase tracking-wider">{label}</span>
        <Icon className="w-4 h-4 text-white/20" />
      </div>
      <div className={`text-3xl font-mono font-bold ${color}`}>{value}</div>
      {sub && <div className="text-xs font-mono text-white/30 mt-1">{sub}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const fetchData = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/assessments/recent?page=${p}&limit=20`);
      const json = await res.json();
      setData(json);
    } catch {
      setData({ assessments: [], total: 0, page: 1, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(page); }, [page, fetchData]);

  const assessments = data?.assessments ?? [];

  const filtered = assessments.filter(a => {
    const matchSearch =
      search === '' ||
      a.recruiterName.toLowerCase().includes(search.toLowerCase()) ||
      a.company.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || a.verdict === filter;
    return matchSearch && matchFilter;
  });

  // Stats
  const total = data?.total ?? 0;
  const critical = assessments.filter(a => a.verdict === 'critical').length;
  const safe = assessments.filter(a => a.verdict === 'low_risk').length;
  const avgScore = assessments.length
    ? Math.round(assessments.reduce((s, a) => s + a.finalScore, 0) / assessments.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            <span className="font-mono font-bold">TrustHire</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xs font-mono text-white/80 border-b border-red-500 pb-0.5">Dashboard</Link>
            <Link href="/patterns" className="text-xs font-mono text-white/40 hover:text-white/70 transition-colors">Patterns</Link>
            <Link href="/assess" className="text-sm font-mono bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
              + New Assessment
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-mono font-bold">Assessment Dashboard</h1>
            <p className="text-white/40 text-sm font-mono mt-1">All security assessments run through TrustHire</p>
          </div>
          <button
            onClick={() => fetchData(page)}
            className="flex items-center gap-2 text-sm font-mono text-white/40 hover:text-white border border-white/10 px-3 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={BarChart2} label="Total Assessments" value={total} sub="all time" />
          <StatCard icon={Activity} label="Avg Score" value={avgScore} sub="this page" color={avgScore >= 70 ? 'text-green-400' : avgScore >= 45 ? 'text-yellow-400' : 'text-red-400'} />
          <StatCard icon={XCircle} label="Critical" value={critical} sub="this page" color={critical > 0 ? 'text-red-400' : 'text-white'} />
          <StatCard icon={CheckCircle} label="Low Risk" value={safe} sub="this page" color={safe > 0 ? 'text-green-400' : 'text-white'} />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search by recruiter or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#111113] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-red-500/50"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'critical', 'high_risk', 'caution', 'low_risk'] as const).map(v => (
              <button
                key={v}
                onClick={() => setFilter(v)}
                className={`px-3 py-2 rounded-lg text-xs font-mono transition-colors border ${
                  filter === v
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'bg-[#111113] border-white/10 text-white/40 hover:text-white/70'
                }`}
              >
                {v === 'all' ? 'All' : verdictConfig(v).label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] text-xs font-mono text-white/30 uppercase tracking-wider px-6 py-3 border-b border-white/5">
            <span>Recruiter</span>
            <span>Company</span>
            <span className="text-right pr-4">Score</span>
            <span className="text-right pr-4">Date</span>
            <span />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-6 h-6 animate-spin text-white/20" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Shield className="w-8 h-8 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 font-mono text-sm">No assessments found.</p>
              <Link href="/assess" className="text-red-400 font-mono text-xs hover:underline mt-2 inline-block">Run your first assessment →</Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filtered.map(a => {
                const cfg = verdictConfig(a.verdict);
                return (
                  <div key={a.id} className="grid grid-cols-[1fr_1fr_auto_auto_auto] items-center px-6 py-4 hover:bg-white/3 transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                      <span className="font-mono text-sm text-white truncate">{a.recruiterName}</span>
                    </div>
                    <span className="font-mono text-sm text-white/50 truncate">{a.company}</span>
                    <div className="pr-4">
                      <ScoreBadge score={a.finalScore} verdict={a.verdict} />
                    </div>
                    <span className="font-mono text-xs text-white/30 pr-4 whitespace-nowrap">
                      {new Date(a.createdAt).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <Link
                      href={`/results/${a.id}`}
                      className="flex items-center gap-1 text-xs font-mono text-white/30 hover:text-red-400 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> View
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {(data?.totalPages ?? 0) > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-white/30">
              Page {data?.page} of {data?.totalPages} · {data?.total} total
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-mono border border-white/10 text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                disabled={page >= (data?.totalPages ?? 1)}
                onClick={() => setPage(p => p + 1)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-mono border border-white/10 text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
