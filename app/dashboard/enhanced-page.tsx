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
  TrendingUp,
  Users,
  Clock,
  Zap,
  Eye,
} from 'lucide-react';
import { Card, Button, Badge, Skeleton, EmptyState, Container } from '@/components/ui/DesignSystem';
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

// ─── Enhanced Components ───────────────────────────────────────────────────────

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  variant?: 'default' | 'accent' | 'success' | 'warning';
  loading?: boolean;
}

function MetricCard({ title, value, subtitle, icon, trend, variant = 'default', loading }: MetricCardProps) {
  const variantStyles = {
    default: '',
    accent: 'border-red-500/20 bg-red-950/20',
    success: 'border-emerald-500/20 bg-emerald-950/20',
    warning: 'border-yellow-500/20 bg-yellow-950/20',
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-8 rounded-xl" />
          </div>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${variantStyles[variant]}`} hover>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-white tabular-nums">{value}</span>
            {trend && (
              <div className={`flex items-center gap-1 text-xs font-mono ${
                trend.direction === 'up' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                <TrendingUp className={`w-3 h-3 ${trend.direction === 'down' ? 'rotate-180' : ''}`} />
                {trend.value}%
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-xs font-mono text-white/30 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="p-2 rounded-xl bg-white/5">
          {icon}
        </div>
      </div>
    </Card>
  );
}

interface AssessmentRowProps {
  assessment: RecentAssessment;
  index: number;
}

function AssessmentRow({ assessment, index }: AssessmentRowProps) {
  const cfg = verdictCfg(assessment.verdict);
  const date = new Date(assessment.createdAt).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div 
      className="group flex flex-col gap-3 md:grid md:grid-cols-[1fr_1fr_120px_120px_80px] md:items-center p-4 rounded-2xl hover:bg-white/[0.02] transition-all duration-200 border border-transparent hover:border-white/5"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Recruiter */}
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
        <div className="min-w-0">
          <p className="font-mono text-sm text-white truncate">{assessment.recruiterName}</p>
          <p className="font-mono text-xs text-white/30 truncate">{assessment.company}</p>
        </div>
      </div>

      {/* Company (hidden on mobile, shown on desktop) */}
      <div className="hidden md:block">
        <p className="font-mono text-sm text-white/60 truncate">{assessment.company}</p>
      </div>

      {/* Score Badge */}
      <div className="flex md:justify-end">
        <Badge variant={assessment.verdict === 'low_risk' ? 'success' : assessment.verdict === 'critical' ? 'error' : 'default'} dot>
          {assessment.finalScore}
        </Badge>
      </div>

      {/* Date */}
      <div className="flex md:justify-end">
        <span className="font-mono text-xs text-white/30">{date}</span>
      </div>

      {/* Actions */}
      <div className="flex md:justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          href={`/results/${assessment.id}`}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Eye className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          href={`/share/${assessment.shareToken}`}
          target="_blank"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────

export default function EnhancedDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(false);

    try {
      const res = await fetch('/api/dashboard/stats');
      if (!res.ok) throw new Error('Non-2xx response');
      const data: DashboardStats = await res.json();
      setStats(data);
      setLastRefresh(new Date());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => load(true), 30000);
    return () => clearInterval(interval);
  }, [load]);

  const recent: RecentAssessment[] = stats?.recent ?? [];

  if (error) {
    return (
      <Container size="lg" className="py-10">
        <div className="text-center py-16">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-mono font-semibold text-white mb-2">Failed to load dashboard</h2>
          <p className="text-sm font-mono text-white/40 mb-6">Please check your connection and try again</p>
          <Button onClick={() => load()} loading={refreshing}>
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#111827] p-6 text-white">
        <Container size="lg" className="py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-mono font-bold tracking-tight mb-2">
              Security Dashboard
            </h1>
            <div className="flex items-center gap-4 text-sm font-mono text-white/40">
              <span>Real-time monitoring</span>
              <span>•</span>
              <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" href="/assess">
              <PlusCircle className="w-4 h-4" />
              New Assessment
            </Button>
            <Button
              variant="ghost"
              onClick={() => load(true)}
              disabled={refreshing}
              loading={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Total Assessments"
            value={stats?.total ?? 0}
            subtitle="All time"
            icon={<BarChart2 className="w-5 h-5 text-white/60" />}
            loading={loading}
          />
          <MetricCard
            title="Average Score"
            value={stats?.avgScore ?? 0}
            subtitle="Risk score"
            icon={<Activity className="w-5 h-5 text-white/60" />}
            variant={stats?.avgScore && stats.avgScore >= 70 ? 'success' : stats?.avgScore && stats.avgScore < 45 ? 'warning' : 'default'}
            loading={loading}
          />
          <MetricCard
            title="Critical Risks"
            value={stats?.byVerdict.critical ?? 0}
            subtitle="Need attention"
            icon={<XCircle className="w-5 h-5 text-red-400" />}
            variant={(stats?.byVerdict.critical ?? 0) > 0 ? 'warning' : 'default'}
            loading={loading}
          />
          <MetricCard
            title="Safe Recruiters"
            value={stats?.byVerdict.low_risk ?? 0}
            subtitle="Verified"
            icon={<CheckCircle className="w-5 h-5 text-emerald-400" />}
            variant={(stats?.byVerdict.low_risk ?? 0) > 0 ? 'success' : 'default'}
            loading={loading}
          />
        </div>

        {/* Recent Assessments */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-mono font-semibold text-white mb-1">Recent Assessments</h2>
                <p className="text-sm font-mono text-white/40">
                  {recent.length === 0 ? 'No assessments yet' : `Last ${recent.length} assessments`}
                </p>
              </div>
              {recent.length > 0 && (
                <Badge variant="info" dot>
                  Live
                </Badge>
              )}
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 border border-white/5 rounded-2xl">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recent.length === 0 ? (
              <EmptyState
                icon={<Shield className="w-8 h-8 text-white/20" />}
                title="No assessments yet"
                description="Run your first security assessment to see detailed results and insights here."
                action={{
                  label: 'Start Assessment',
                  onClick: () => window.location.href = '/assess',
                  variant: 'primary'
                }}
              />
            ) : (
              <div className="space-y-2">
                {recent.map((assessment, index) => (
                  <AssessmentRow
                    key={assessment.id}
                    assessment={assessment}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>

          {recent.length > 0 && (
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs font-mono text-white/30">
                Showing {recent.length} of {stats?.total} total assessments
              </span>
              <Button variant="ghost" size="sm" href="/assess">
                View All
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <Card className="p-4 hover" glow="purple">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="font-mono text-sm font-medium text-white">Quick Scan</p>
                <p className="font-mono text-xs text-white/40">Fast repository check</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover" glow="green">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="font-mono text-sm font-medium text-white">Team Access</p>
                <p className="font-mono text-xs text-white/40">Share reports</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover" glow="yellow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="font-mono text-sm font-medium text-white">History</p>
                <p className="font-mono text-xs text-white/40">View all scans</p>
              </div>
            </div>
          </Card>
        </div>
      </Container>
      </div>
    </Container>
  );
}
