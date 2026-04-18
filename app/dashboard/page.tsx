'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Shield,
  BarChart2,
  Activity,
  XCircle,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  PlusCircle,
  AlertTriangle,
} from 'lucide-react';
import type { DashboardStats, RecentAssessment } from '@/app/api/dashboard/stats/route';

// ─── Verdict config ───────────────────────────────────────────────────────────

const VERDICT_CONFIG = {
  low_risk:  { label: 'Low Risk',  color: 'text-emerald-400',  bg: 'bg-emerald-500/10',  border: 'border-emerald-500/25', dot: 'bg-emerald-400' },
  caution:   { label: 'Caution',   color: 'text-yellow-400',   bg: 'bg-yellow-500/10',   border: 'border-yellow-500/25',  dot: 'bg-yellow-400' },
  high_risk: { label: 'High Risk', color: 'text-orange-400',   bg: 'bg-orange-500/10',   border: 'border-orange-500/25',  dot: 'bg-orange-400' },
  critical:  { label: 'Critical',  color: 'text-red-400',      bg: 'bg-red-500/10',      border: 'border-red-500/25',     dot: 'bg-red-500' },
} as const;

type VerdictKey = keyof typeof VERDICT_CONFIG;

function verdictCfg(v: string) {
  return VERDICT_CONFIG[v as VerdictKey] ?? VERDICT_CONFIG.caution;
}

// ─── Score colour helper ──────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 70) return 'text-emerald-400';
  if (score >= 45) return 'text-yellow-400';
  return 'text-red-400';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Coloured pill badge showing score + verdict dot */
function VerdictBadge({ score, verdict }: { score: number; verdict: string }) {
  const cfg = verdictCfg(verdict);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${cfg.bg} ${cfg.color} border ${cfg.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {score}
    </span>
  );
}

/** Top-level KPI card */
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = false,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  color?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-6 flex flex-col gap-4 transition-all duration-200 hover:border-white/10 ${
        accent
          ? 'bg-red-950/20 border-red-500/20'
          : 'bg-zinc-900/60 border-white/5'
      }`}
    >
      {/* Subtle glow for accent cards */}
      {accent && (
        <div className="pointer-events-none absolute -top-6 -right-6 w-24 h-24 rounded-full bg-red-600/10 blur-2xl" />
      )}

      <div className="flex items-center justify-between">
        <span className="text-white/30 text-[11px] font-mono uppercase tracking-widest">
          {label}
        </span>
        <div className={`p-2 rounded-xl ${accent ? 'bg-red-500/10' : 'bg-white/5'}`}>
          <Icon className={`w-4 h-4 ${accent ? 'text-red-400' : 'text-white/30'}`} />
        </div>
      </div>

      <div>
        <span className={`text-4xl font-mono font-bold tabular-nums ${color ?? 'text-white'}`}>
          {value}
        </span>
        {sub && (
          <p className="text-[11px] font-mono text-white/25 mt-1">{sub}</p>
        )}
      </div>
    </div>
  );
}

/** Shimmer skeleton block */
function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-white/5 ${className}`}
      aria-hidden="true"
    />
  );
}

/** Full loading state — mirrors the real layout */
function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-white/5 bg-zinc-900/60 p-6 space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            <Skeleton className="h-10 w-20" />
          </div>
        ))}
      </div>
      {/* Table rows */}
      <div className="rounded-3xl border border-white/5 bg-zinc-900/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <Skeleton className="h-3 w-48" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-white/5 flex items-center gap-4">
            <Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Empty state when no assessments exist */
function EmptyState() {
  return (
    <div className="rounded-3xl border border-white/5 bg-zinc-900/40 py-24 flex flex-col items-center gap-5 text-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center">
          <Shield className="w-8 h-8 text-white/20" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
          <span className="text-red-400 text-xs font-mono font-bold">0</span>
        </div>
      </div>
      <div>
        <h3 className="text-white font-mono font-semibold text-base">
          No assessments yet
        </h3>
        <p className="text-white/30 font-mono text-sm mt-1 max-w-[280px]">
          Run your first TrustHire assessment to see stats appear here.
        </p>
      </div>
      <Link
        href="/assess"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-mono font-semibold transition-colors duration-150"
      >
        <PlusCircle className="w-4 h-4" />
        Start Assessment
      </Link>
    </div>
  );
}

/** Error banner */
function ErrorBanner({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-950/20 px-5 py-4 flex items-center gap-3">
      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
      <span className="text-red-300 text-sm font-mono flex-1">
        Failed to load dashboard data.
      </span>
      <button
        onClick={onRetry}
        className="text-xs font-mono text-red-400 hover:text-red-300 underline transition-colors"
      >
        Retry
      </button>
    </div>
  );
}

// ─── Main Dashboard page ──────────────────────────────────────────────────────

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(false);

    try {
      const res = await fetch('/api/dashboard/stats');
      if (!res.ok) throw new Error('Non-2xx response');
      const data: DashboardStats = await res.json();
      setStats(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const recent: RecentAssessment[] = stats?.recent ?? [];

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-mono font-bold tracking-tight">
              Assessment Dashboard
            </h1>
            <p className="text-white/35 text-sm font-mono mt-1">
              Security overview · all-time statistics
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* New assessment CTA */}
            <Link
              href="/assess"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white/70 hover:text-white text-sm font-mono border border-white/8 transition-colors duration-150"
            >
              <PlusCircle className="w-4 h-4" />
              New
            </Link>

            {/* Refresh button */}
            <button
              onClick={() => load(true)}
              disabled={refreshing || loading}
              aria-label="Refresh dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono border border-white/8 bg-zinc-900 text-white/40 hover:text-white hover:border-white/15 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* ── Error banner ─────────────────────────────────────────────────── */}
        {error && <ErrorBanner onRetry={() => load()} />}

        {/* ── Loading skeleton / real content ─────────────────────────────── */}
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* ── Stat cards ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={BarChart2}
                label="Total"
                value={stats?.total ?? 0}
                sub="assessments run"
              />
              <StatCard
                icon={Activity}
                label="Avg Score"
                value={stats?.avgScore ?? 0}
                sub="global average"
                color={scoreColor(stats?.avgScore ?? 0)}
              />
              <StatCard
                icon={XCircle}
                label="Critical"
                value={stats?.byVerdict.critical ?? 0}
                sub="high-danger flags"
                accent={(stats?.byVerdict.critical ?? 0) > 0}
                color={(stats?.byVerdict.critical ?? 0) > 0 ? 'text-red-400' : 'text-white'}
              />
              <StatCard
                icon={CheckCircle}
                label="Low Risk"
                value={stats?.byVerdict.low_risk ?? 0}
                sub="safe recruiters"
                color={(stats?.byVerdict.low_risk ?? 0) > 0 ? 'text-emerald-400' : 'text-white'}
              />
            </div>

            {/* ── Recent assessments table ────────────────────────────────── */}
            {recent.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="rounded-3xl border border-white/5 bg-zinc-900/50 overflow-hidden">
                {/* Table header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                  <span className="text-white/40 text-xs font-mono uppercase tracking-widest">
                    Recent Assessments
                  </span>
                  <span className="text-white/20 text-xs font-mono">
                    last {recent.length}
                  </span>
                </div>

                {/* Column headers – hidden on mobile, visible md+ */}
                <div className="hidden md:grid grid-cols-[1fr_1fr_100px_110px_60px] text-[11px] font-mono text-white/20 uppercase tracking-widest px-6 py-2 border-b border-white/5">
                  <span>Recruiter</span>
                  <span>Company</span>
                  <span className="text-right">Score</span>
                  <span className="text-right">Date</span>
                  <span />
                </div>

                {/* Rows */}
                <div className="divide-y divide-white/5">
                  {recent.map((a) => {
                    const cfg = verdictCfg(a.verdict);
                    const date = new Date(a.createdAt).toLocaleDateString('ro-RO', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    });

                    return (
                      <div
                        key={a.id}
                        className="group flex flex-col gap-2 md:grid md:grid-cols-[1fr_1fr_100px_110px_60px] md:items-center px-6 py-4 hover:bg-white/[0.02] transition-colors duration-150"
                      >
                        {/* Recruiter */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                          <span className="font-mono text-sm text-white truncate">
                            {a.recruiterName}
                          </span>
                        </div>

                        {/* Company */}
                        <span className="font-mono text-sm text-white/45 truncate pl-[18px] md:pl-0">
                          {a.company}
                        </span>

                        {/* Score badge */}
                        <div className="flex md:justify-end pl-[18px] md:pl-0">
                          <VerdictBadge score={a.finalScore} verdict={a.verdict} />
                        </div>

                        {/* Date */}
                        <span className="font-mono text-xs text-white/25 pl-[18px] md:pl-0 md:text-right">
                          {date}
                        </span>

                        {/* View link */}
                        <div className="flex md:justify-end pl-[18px] md:pl-0">
                          <Link
                            href={`/results/${a.id}`}
                            className="inline-flex items-center gap-1 text-xs font-mono text-white/25 hover:text-red-400 group-hover:text-white/40 transition-colors duration-150"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                {(stats?.total ?? 0) > 10 && (
                  <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-white/20 text-xs font-mono">
                      Showing 10 of {stats?.total} total assessments
                    </span>
                    <Link
                      href="/assess"
                      className="text-xs font-mono text-red-400/70 hover:text-red-400 transition-colors duration-150"
                    >
                      New assessment →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
