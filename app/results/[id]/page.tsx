'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Shield, AlertTriangle, CheckCircle, XCircle, HelpCircle,
  Copy, Download, ExternalLink, ChevronRight, Loader2
} from 'lucide-react';
import type { AssessmentResult, RedFlag, WorkflowStep, RepoScanResult, DomainCheckResult } from '@/types';
import AIAnalysisCard from '@/components/AIAnalysisCard';

interface ExtendedAssessmentResult extends AssessmentResult {
  incidentReport?: string;
  domainChecks?: DomainCheckResult[];
}

const VERDICT_CONFIG = {
  low_risk: { label: 'Low Risk', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', hex: '#16A34A' },
  caution: { label: 'Caution', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', hex: '#CA8A04' },
  high_risk: { label: 'High Risk', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', hex: '#EA580C' },
  critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', hex: '#DC2626' },
};

const SEVERITY_CONFIG = {
  critical: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'CRITICAL' },
  red_flag: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'RED FLAG' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'WARNING' },
};

function ScoreGauge({ score, verdict }: { score: number; verdict: string }) {
  const config = VERDICT_CONFIG[verdict as keyof typeof VERDICT_CONFIG] ?? VERDICT_CONFIG.caution;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={r} fill="none" stroke="#1f1f23" strokeWidth="12" />
        <circle
          cx="80" cy="80" r={r} fill="none"
          stroke={config.hex}
          strokeWidth="12"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="text-center">
        <div className="text-4xl font-mono font-bold">{score}</div>
        <div className={`text-xs font-mono ${config.color}`}>{config.label}</div>
      </div>
    </div>
  );
}

function ScoreCard({ label, score, icon }: { label: string; score: number; icon: string }) {
  const pct = (score / 25) * 100;
  const color = pct >= 80 ? 'bg-green-500' : pct >= 55 ? 'bg-yellow-500' : pct >= 30 ? 'bg-orange-500' : 'bg-red-500';
  return (
    <div className="bg-[#111113] border border-white/5 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-mono text-white/60">{icon} {label}</span>
        <span className="text-lg font-mono font-bold">{score}<span className="text-white/30 text-sm">/25</span></span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<ExtendedAssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'green' | 'warnings' | 'redflags' | 'missing'>('redflags');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem(`assessment_${params.id}`) : null;
    if (stored) {
      setData(JSON.parse(stored));
      setLoading(false);
      return;
    }
    fetch(`/api/assessment/${params.id}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  const copyReport = () => {
    if (!data?.incidentReport) return;
    const fullReport = generateFullReport();
    navigator.clipboard.writeText(fullReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReport = () => {
    if (!data) return;
    const fullReport = generateFullReport();
    const blob = new Blob([fullReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trusthire-report-${data.id}.txt`;
    a.click();
  };

  const generateFullReport = () => {
    if (!data) return '';
    
    const report = `
TRUSTHIRE SECURITY ASSESSMENT REPORT
=====================================

Assessment ID: ${data.id}
Date: ${new Date(data.createdAt).toLocaleString()}
Recruiter: ${data.recruiterName} @ ${data.company}

FINAL SCORE: ${data.finalScore}/100
VERDICT: ${data.verdict.toUpperCase()}

SCORE BREAKDOWN:
================
Identity Confidence: ${data.scores?.identityConfidence ?? 0}/25
Employer Legitimacy: ${data.scores?.employerLegitimacy ?? 0}/25
Process Legitimacy: ${data.scores?.processLegitimacy ?? 0}/25
Technical Safety: ${data.scores?.technicalSafety ?? 0}/25

RISK FLAGS:
===========
${data.redFlags?.map(flag => `
[${flag.severity.toUpperCase()}] ${flag.signal}
Category: ${flag.category}
Explanation: ${flag.explanation}
Recommendation: ${flag.recommendation}
`).join('\n---\n') || 'No risk flags detected.'}

POSITIVE SIGNALS:
================
${data.greenSignals?.join('\n') || 'No positive signals detected.'}

MISSING EVIDENCE:
=================
${data.missingEvidence?.join('\n') || 'No missing evidence items.'}

RECOMMENDED ACTIONS:
====================
${data.workflowAdvice?.map(step => `${step.action}: ${step.description}`).join('\n') || 'No specific actions required.'}

TECHNICAL ANALYSIS:
==================
${data.repoScans?.map(scan => `
Repository: ${scan.repoUrl}
Risk Level: ${scan.riskLevel}
Dangerous Scripts: ${scan.dangerousScripts.join(', ') || 'None'}
Suspicious Files: ${scan.patternMatches.map(p => p.file).join(', ') || 'None'}
`).join('\n') || 'No repositories analyzed.'}

DOMAIN ANALYSIS:
================
${data.domainChecks?.map(check => `
Domain: ${check.domain}
Risk Flags: ${check.riskFlags.join(', ') || 'None'}
Suspicious TLD: ${check.hasSuspiciousTLD ? 'Yes' : 'No'}
Brand Spoofing: ${check.isBrandSpoofing ? 'Yes' : 'No'}
`).join('\n') || 'No domains analyzed.'}

---
This report was generated by TrustHire Security Assessment Tool.
For more information, visit: https://trusthire-five.vercel.app

DISCLAIMER: This assessment provides risk signals based on heuristic analysis
and does not constitute legal evidence of wrongdoing. Always conduct proper
due diligence before making employment decisions.
    `.trim();
    
    return report;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto mb-4" />
          <p className="font-mono text-white/40">Analyzing...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-white/40 mb-4">Assessment not found.</p>
          <Link href="/assess" className="text-red-400 font-mono text-sm hover:underline">Start new assessment</Link>
        </div>
      </div>
    );
  }

  const verdict = data.verdict ?? 'caution';
  const vConfig = VERDICT_CONFIG[verdict as keyof typeof VERDICT_CONFIG] ?? VERDICT_CONFIG.caution;
  const criticalFlags = data.redFlags?.filter((f) => f.severity === 'critical') ?? [];
  const warningFlags = data.redFlags?.filter((f) => f.severity !== 'critical') ?? [];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-500" />
          <span className="font-mono font-bold">TrustHire</span>
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={copyReport} className="flex items-center gap-2 text-sm font-mono text-white/50 hover:text-white border border-white/10 px-3 py-2 rounded-lg transition-colors">
            <Copy className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy Report'}
          </button>
          <button onClick={downloadReport} className="flex items-center gap-2 text-sm font-mono text-white/50 hover:text-white border border-white/10 px-3 py-2 rounded-lg transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <Link href="/assess" className="text-sm font-mono bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
            New Assessment
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Hero score */}
        <div className={`${vConfig.bg} border ${vConfig.border} rounded-2xl p-8`}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ScoreGauge score={data.finalScore} verdict={verdict} />
            <div className="flex-1 text-center md:text-left">
              <div className={`inline-flex items-center gap-2 ${vConfig.bg} border ${vConfig.border} rounded-full px-4 py-1.5 mb-4`}>
                <span className={`text-sm font-mono font-bold ${vConfig.color}`}>{vConfig.label}</span>
              </div>
              <h1 className="text-2xl font-mono font-bold mb-2">{data.recruiterName} @ {data.company}</h1>
              {criticalFlags.length > 0 ? (
                <p className="text-red-400 font-mono text-sm">
                  ⚠️ {criticalFlags.length} critical flag{criticalFlags.length > 1 ? 's' : ''} detected.
                  {data.repoScans?.some((r) => r.riskLevel === 'critical') && ' Do not run this code locally.'}
                </p>
              ) : warningFlags.length > 0 ? (
                <p className="text-yellow-400 font-mono text-sm">{warningFlags.length} warning{warningFlags.length > 1 ? 's' : ''} detected. Proceed with caution.</p>
              ) : (
                <p className="text-green-400 font-mono text-sm">No major flags detected. Standard due diligence recommended.</p>
              )}
            </div>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ScoreCard label="Identity Confidence" score={data.scores?.identityConfidence ?? 0} icon="👤" />
          <ScoreCard label="Employer Legitimacy" score={data.scores?.employerLegitimacy ?? 0} icon="🏢" />
          <ScoreCard label="Process Legitimacy" score={data.scores?.processLegitimacy ?? 0} icon="📋" />
          <ScoreCard label="Technical Safety" score={data.scores?.technicalSafety ?? 0} icon="🔐" />
        </div>

        {/* Evidence panel */}
        <div className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden">
          <div className="flex border-b border-white/5">
            {([
              { key: 'redflags', label: `🚨 Red Flags (${data.redFlags?.filter(f => f.severity !== 'warning').length ?? 0})` },
              { key: 'warnings', label: `⚠️ Warnings (${data.redFlags?.filter(f => f.severity === 'warning').length ?? 0})` },
              { key: 'green', label: `✅ Green Signals (${data.greenSignals?.length ?? 0})` },
              { key: 'missing', label: `❓ Missing Proof (${data.missingEvidence?.length ?? 0})` },
            ] as const).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                className={`flex-1 px-4 py-3 text-xs font-mono transition-colors ${
                  activeTab === key ? 'bg-white/5 text-white border-b-2 border-red-500' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="p-6 space-y-3 min-h-[200px]">
            {activeTab === 'redflags' && (
              data.redFlags?.filter(f => f.severity !== 'warning').length === 0
                ? <Empty text="No red flags detected." />
                : data.redFlags?.filter(f => f.severity !== 'warning').map((flag, i) => <RedFlagCard key={i} flag={flag} />)
            )}
            {activeTab === 'warnings' && (
              data.redFlags?.filter(f => f.severity === 'warning').length === 0
                ? <Empty text="No warnings detected." />
                : data.redFlags?.filter(f => f.severity === 'warning').map((flag, i) => <RedFlagCard key={i} flag={flag} />)
            )}
            {activeTab === 'green' && (
              (data.greenSignals?.length ?? 0) === 0
                ? <Empty text="No positive signals detected." />
                : data.greenSignals?.map((s, i) => <GreenCard key={i} signal={s} />)
            )}
            {activeTab === 'missing' && (
              (data.missingEvidence?.length ?? 0) === 0
                ? <Empty text="No missing evidence items." />
                : data.missingEvidence?.map((m, i) => <MissingCard key={i} item={m} />)
            )}
          </div>
        </div>

        {/* Repo scans */}
        {(data.repoScans?.length ?? 0) > 0 && (
          <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
            <h2 className="font-mono font-bold mb-4 flex items-center gap-2">
              <span className="text-white/50 text-sm">🔎</span> Repository Scan Results
            </h2>
            {data.repoScans?.map((scan, i) => <RepoScanCard key={i} scan={scan} />)}
          </div>
        )}

        {/* Domain checks */}
        {(data.domainChecks?.length ?? 0) > 0 && (
          <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
            <h2 className="font-mono font-bold mb-4"><span className="text-white/50 text-sm">Domain & URL Analysis</span></h2>
            {data.domainChecks?.map((check, i) => <DomainCard key={i} check={check} />)}
          </div>
        )}

        {/* AI Analysis */}
        <AIAnalysisCard 
          analysis={(data as any).aiAnalysis} 
          isLoading={false}
        />

        {/* Workflow advisor */}
        {(data.workflowAdvice?.length ?? 0) > 0 && (
          <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
            <h2 className="font-mono font-bold mb-4">Recommended Actions</h2>
            <div className="space-y-3">
              {data.workflowAdvice?.map((step, i) => <WorkflowCard key={i} step={step} index={i} />)}
            </div>
          </div>
        )}

        {/* Incident report */}
        <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono font-bold">📄 Incident Report</h2>
            <div className="flex gap-2">
              <button onClick={copyReport} className="flex items-center gap-1.5 text-xs font-mono text-white/50 hover:text-white border border-white/10 px-3 py-1.5 rounded transition-colors">
                <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={downloadReport} className="flex items-center gap-1.5 text-xs font-mono text-white/50 hover:text-white border border-white/10 px-3 py-1.5 rounded transition-colors">
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
          <pre className="text-xs font-mono text-white/60 bg-[#0A0A0B] rounded-lg p-4 overflow-auto max-h-64 whitespace-pre-wrap">
            {data.incidentReport}
          </pre>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Report to GitHub', url: 'https://github.com/contact/report-abuse' },
              { label: 'Report to LinkedIn', url: 'https://www.linkedin.com/help/linkedin/answer/a1339724' },
              { label: 'Report to DNSC (RO)', url: 'https://dnsc.ro' },
              { label: 'Report to CISA (US)', url: 'https://www.cisa.gov/report' },
            ].map(({ label, url }) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono text-white/40 hover:text-red-400 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> {label}
              </a>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-white/20 text-xs font-mono pb-8">
          TrustHire provides risk signals, not legal verdicts. Scores are heuristic-based and do not constitute evidence of wrongdoing.
          <Link href="/disclaimer" className="text-white/30 hover:text-white/50 ml-2 underline">Full disclaimer</Link>
        </p>
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-white/30 text-sm font-mono text-center py-8">{text}</p>;
}

function RedFlagCard({ flag }: { flag: RedFlag }) {
  const cfg = SEVERITY_CONFIG[flag.severity as keyof typeof SEVERITY_CONFIG] ?? SEVERITY_CONFIG.warning;
  const Icon = cfg.icon;
  return (
    <div className={`${cfg.bg} border ${cfg.border} rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.color}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-mono font-bold ${cfg.color}`}>{cfg.label}</span>
            <span className="text-xs font-mono text-white/30">{flag.category}</span>
          </div>
          <p className="text-sm font-mono text-white/80 mb-1">{flag.signal}</p>
          <p className="text-xs text-white/50 mb-2">{flag.explanation}</p>
          <p className="text-xs text-white/40 italic">→ {flag.recommendation}</p>
        </div>
      </div>
    </div>
  );
}

function GreenCard({ signal }: { signal: string }) {
  return (
    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <CheckCircle className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-mono text-white/80">{signal}</p>
        </div>
      </div>
    </div>
  );
}

function MissingCard({ item }: { item: string }) {
  return (
    <div className="bg-white/3 border border-white/10 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <HelpCircle className="w-4 h-4 mt-0.5 text-white/40 flex-shrink-0" />
        <div>
          <p className="text-sm font-mono text-white/70">{item}</p>
        </div>
      </div>
    </div>
  );
}

function WorkflowCard({ step, index }: { step: WorkflowStep; index: number }) {
  const priorityColors = {
    urgent: 'text-red-400 bg-red-500/10 border-red-500/20',
    high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    low: 'text-green-400 bg-green-500/10 border-green-500/20',
  };

  // Debug logging
  console.log('WorkflowCard step:', step, 'index:', index);
  
  // Validate step structure
  if (!step || typeof step !== 'object') {
    console.error('Invalid step object:', step);
    return (
      <div className="flex items-start gap-4">
        <div className="w-7 h-7 bg-white/5 border border-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-xs font-mono text-white/40">{index + 1}</span>
        </div>
        <div className="flex-1">
          <p className="text-xs text-red-400">Invalid workflow step data</p>
        </div>
      </div>
    );
  }

  // Validate required properties
  if (!step.action || !step.description || !step.priority) {
    console.error('Missing required step properties:', step);
    return (
      <div className="flex items-start gap-4">
        <div className="w-7 h-7 bg-white/5 border border-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-xs font-mono text-white/40">{index + 1}</span>
        </div>
        <div className="flex-1">
          <p className="text-xs text-yellow-400">Incomplete workflow step data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4">
      <div className="w-7 h-7 bg-white/5 border border-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-xs font-mono text-white/40">{index + 1}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-mono font-bold">{String(step.action)}</span>
          <span className={`text-xs font-mono px-2 py-0.5 rounded border ${priorityColors[step.priority]}`}>
            {String(step.priority).toUpperCase()}
          </span>
        </div>
        <p className="text-xs text-white/50">{String(step.description)}</p>
      </div>
    </div>
  );
}

function RepoScanCard({ scan }: { scan: RepoScanResult }) {
  const riskColor = scan.riskLevel === 'critical' ? 'border-red-500/30 bg-red-500/5' : scan.riskLevel === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-green-500/30 bg-green-500/5';
  return (
    <div className={`border rounded-lg p-4 mb-3 ${riskColor}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-white/60 truncate">{scan.repoUrl}</span>
        <span className={`text-xs font-mono px-2 py-0.5 rounded ${
          scan.riskLevel === 'critical' ? 'bg-red-500/20 text-red-400' :
          scan.riskLevel === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-green-500/20 text-green-400'
        }`}>{scan.riskLevel?.toUpperCase()}</span>
      </div>
      {scan.error && <p className="text-xs text-white/40 font-mono">{scan.error}</p>}
      {scan.repoAge !== undefined && (
        <p className="text-xs font-mono text-white/50 mb-2">Repo age: {scan.repoAge} days | Stars: {scan.stars} | Forks: {scan.forks}</p>
      )}
      {scan.dangerousScripts?.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-mono text-red-400 mb-1">🚨 Dangerous lifecycle scripts:</p>
          {scan.dangerousScripts.map((s: string) => (
            <code key={s} className="block text-xs font-mono bg-red-500/10 text-red-300 px-2 py-1 rounded mb-1">{s}</code>
          ))}
        </div>
      )}
      {scan.patternMatches?.length > 0 && (
        <div>
          <p className="text-xs font-mono text-orange-400 mb-1">⚠️ Dangerous patterns ({scan.patternMatches.length}):</p>
          {scan.patternMatches.slice(0, 5).map((m, i) => (
            <div key={i} className="text-xs font-mono text-white/50 mb-0.5">
              <span className="text-orange-400">{m.pattern}</span> in <span className="text-white/40">{m.file}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DomainCard({ check }: { check: DomainCheckResult }) {
  const hasFlags = check.riskFlags?.length > 0;
  return (
    <div className={`border rounded-lg p-4 mb-3 ${
      hasFlags ? 'border-red-500/20 bg-red-500/5' : 'border-white/10 bg-white/3'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-white/70">{check.domain}</span>
        {check.vtMalicious !== undefined && check.vtMalicious > 0 && (
          <span className="text-xs font-mono bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
            VT: {check.vtMalicious} malicious
          </span>
        )}
      </div>
      {check.riskFlags?.map((flag, i) => (
        <p key={i} className="text-xs font-mono text-red-400 mb-0.5">⚠️ {flag}</p>
      ))}
      {!hasFlags && <p className="text-xs font-mono text-green-400">✓ No domain risk flags detected</p>}
    </div>
  );
}
