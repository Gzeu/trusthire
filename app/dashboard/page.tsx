'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Shield, CheckCircle, AlertTriangle, TrendingUp,
  Search, ChevronLeft, ChevronRight, ExternalLink,
  BarChart2, Activity, XCircle, RefreshCw, PlusCircle,
  Users, Clock, Target
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

interface DashboardStats {
  totalAssessments: number;
  averageScore: number;
  verdictCounts: {
    low_risk: number;
    caution: number;
    high_risk: number;
    critical: number;
  };
  recentAssessments: AssessmentRow[];
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

function StatCard({ icon: Icon, label, value, sub, color = 'text-white', glow = false }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color?: string; glow?: boolean;
}) {
  return (
    <div className={`bg-[#111113] border ${glow ? 'border-red-500/50 shadow-lg shadow-red-500/20' : 'border-white/5'} rounded-3xl p-6 transition-all duration-300 hover:border-white/10`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-white/30 text-xs font-mono uppercase tracking-wider">{label}</span>
        <Icon className={`w-4 h-4 ${glow ? 'text-red-400' : 'text-white/20'}`} />
      </div>
      <div className={`text-3xl font-mono font-bold ${color}`}>{value}</div>
      {sub && <div className="text-xs font-mono text-white/30 mt-1">{sub}</div>}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-[#111113] border border-white/5 rounded-3xl p-6">
            <div className="h-4 bg-white/10 rounded w-20 mb-3 animate-pulse" />
            <div className="h-8 bg-white/10 rounded w-16 animate-pulse" />
            <div className="h-3 bg-white/5 rounded w-24 mt-2 animate-pulse" />
          </div>
        ))}
      </div>
      
      {/* Table Skeleton */}
      <div className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] text-xs font-mono text-white/30 uppercase tracking-wider px-6 py-3 border-b border-white/5">
          <span>Recruiter</span>
          <span>Company</span>
          <span className="text-right pr-4">Score</span>
          <span className="text-right pr-4">Date</span>
          <span />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto_auto] items-center px-6 py-4 border-b border-white/5">
            <div className="h-4 bg-white/10 rounded w-32 animate-pulse" />
            <div className="h-4 bg-white/10 rounded w-24 animate-pulse" />
            <div className="h-6 bg-white/10 rounded w-12 animate-pulse" />
            <div className="h-4 bg-white/10 rounded w-16 animate-pulse" />
            <div className="h-4 bg-white/10 rounded w-12 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorBanner({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-400" />
          <div>
            <p className="text-red-400 font-mono font-semibold">Failed to load dashboard data</p>
            <p className="text-red-300/70 font-mono text-sm">Please check your connection and try again.</p>
          </div>
        </div>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-sm rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Shield className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-xl font-mono font-semibold text-white mb-2">No assessments yet</h3>
      <p className="text-white/40 font-mono text-sm mb-6">Start by running your first security assessment</p>
      <Link
        href="/assess"
        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-mono text-sm rounded-xl transition-colors"
      >
        <PlusCircle className="w-4 h-4" />
        Start Assessment
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/dashboard/stats');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const assessments = stats?.recentAssessments ?? [];

  const filtered = assessments.filter(a => {
    const matchSearch =
      search === '' ||
      a.recruiterName.toLowerCase().includes(search.toLowerCase()) ||
      a.company.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || a.verdict === filter;
    return matchSearch && matchFilter;
  });

  const total = stats?.totalAssessments ?? 0;
  const critical = stats?.verdictCounts.critical ?? 0;
  const avgScore = stats?.averageScore ?? 0;
  const safe = stats?.verdictCounts.low_risk ?? 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <ErrorBanner onRetry={fetchData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-mono font-bold">Assessment Dashboard</h1>
            <p className="text-white/40 text-sm font-mono mt-1">Real-time security assessment statistics</p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 text-sm font-mono text-white/40 hover:text-white border border-white/10 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            icon={BarChart2} 
            label="Total Assessments" 
            value={total.toLocaleString()} 
            sub="all time" 
          />
          <StatCard 
            icon={Target} 
            label="Avg Score" 
            value={avgScore} 
            sub="global average" 
            color={avgScore >= 70 ? 'text-green-400' : avgScore >= 45 ? 'text-yellow-400' : 'text-red-400'} 
          />
          <StatCard 
            icon={XCircle} 
            label="Critical" 
            value={critical} 
            sub="total critical" 
            color={critical > 0 ? 'text-red-400' : 'text-white'}
            glow={critical > 0}
          />
          <StatCard 
            icon={CheckCircle} 
            label="Low Risk" 
            value={safe} 
            sub="total safe" 
            color={safe > 0 ? 'text-green-400' : 'text-white'} 
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            icon={AlertTriangle} 
            label="High Risk" 
            value={stats?.verdictCounts.high_risk ?? 0} 
            sub="total high risk" 
            color="text-orange-400" 
          />
          <StatCard 
            icon={TrendingUp} 
            label="Caution" 
            value={stats?.verdictCounts.caution ?? 0} 
            sub="total caution" 
            color="text-yellow-400" 
          />
          <StatCard 
            icon={Users} 
            label="Recent" 
            value={assessments.length} 
            sub="last 10 assessments" 
            color="text-blue-400" 
          />
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

          {filtered.length === 0 ? (
            <EmptyState />
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
                      {new Date(a.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
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

        {/* Footer */}
        {total > 10 && (
          <div className="text-center py-4">
            <p className="text-xs font-mono text-white/30">
              Showing 10 of {total.toLocaleString()} total assessments
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
