'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Shield, AlertTriangle, CheckCircle, XCircle, ExternalLink, Download, Share2, Lock } from 'lucide-react';
import { Card, Button, Badge, Container, Skeleton } from '@/components/ui/DesignSystem';

interface SharedAssessment {
  id: string;
  recruiterName: string;
  company: string;
  position?: string;
  finalScore: number;
  verdict: 'low_risk' | 'caution' | 'high_risk' | 'critical';
  createdAt: string;
  shareToken: string;
  isPublic: boolean;
  analysis: {
    identityScore: number;
    repoScore: number;
    riskFactors: string[];
    warnings: string[];
    recommendations: string[];
  };
}

const VERDICT_CONFIG = {
  low_risk: { label: 'Low Risk', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', icon: CheckCircle },
  caution: { label: 'Caution', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/25', icon: AlertTriangle },
  high_risk: { label: 'High Risk', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/25', icon: AlertTriangle },
  critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/25', icon: XCircle },
} as const;

export default function SharedReportPage() {
  const params = useParams();
  const router = useRouter();
  const [assessment, setAssessment] = useState<SharedAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAssessment = async () => {
      try {
        const response = await fetch(`/api/share/${params.token}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Assessment not found or link has expired');
          } else if (response.status === 403) {
            setError('This assessment is no longer publicly accessible');
          } else {
            setError('Failed to load assessment');
          }
          return;
        }
        const data = await response.json();
        setAssessment(data);
      } catch (err) {
        setError('Failed to load assessment');
      } finally {
        setLoading(false);
      }
    };

    if (params.token) {
      loadAssessment();
    }
  }, [params.token]);

  const handleDownload = () => {
    if (!assessment) return;
    
    const reportData = {
      title: 'TrustHire Security Assessment Report',
      assessment: {
        recruiter: assessment.recruiterName,
        company: assessment.company,
        position: assessment.position,
        score: assessment.finalScore,
        verdict: assessment.verdict,
        date: assessment.createdAt,
      },
      analysis: assessment.analysis,
      generated: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trusthire-report-${assessment.shareToken}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!assessment) return;
    
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TrustHire Security Assessment',
          text: `Security assessment for ${assessment.recruiterName} at ${assessment.company}`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      // You could show a toast here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white">
        <Container size="md" className="py-10">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
            <Card className="p-8">
              <div className="space-y-6">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-12 w-24" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white">
        <Container size="md" className="py-10">
          <div className="text-center py-16">
            <Lock className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h1 className="text-2xl font-mono font-bold text-white mb-2">Assessment Not Available</h1>
            <p className="text-sm font-mono text-white/40 mb-6 max-w-md">{error}</p>
            <Button onClick={() => router.push('/')} variant="outline">
              Return to TrustHire
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  if (!assessment) return null;

  const verdictConfig = VERDICT_CONFIG[assessment.verdict];
  const VerdictIcon = verdictConfig.icon;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Container size="md" className="py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-red-500" />
            <span className="font-mono text-sm text-white/60">TrustHire Security Assessment</span>
          </div>
          <h1 className="text-3xl font-mono font-bold text-white mb-2">
            {assessment.recruiterName}
          </h1>
          <p className="text-lg font-mono text-white/60">
            {assessment.company} {assessment.position && `• ${assessment.position}`}
          </p>
        </div>

        {/* Score Card */}
        <Card className="mb-8 p-8" glow={assessment.verdict === 'critical' ? 'red' : assessment.verdict === 'low_risk' ? 'green' : undefined}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <VerdictIcon className={`w-8 h-8 ${verdictConfig.color}`} />
                <span className={`text-xl font-mono font-bold ${verdictConfig.color}`}>
                  {verdictConfig.label}
                </span>
              </div>
              <p className="text-sm font-mono text-white/40">
                Assessment completed on {new Date(assessment.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-mono font-bold text-white mb-1">
                {assessment.finalScore}
              </div>
              <p className="text-sm font-mono text-white/40">Risk Score</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">Identity Score</p>
              <p className="text-2xl font-mono font-bold text-white">{assessment.analysis.identityScore}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">Repository Score</p>
              <p className="text-2xl font-mono font-bold text-white">{assessment.analysis.repoScore}</p>
            </div>
          </div>
        </Card>

        {/* Analysis Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Risk Factors */}
          <Card className="p-6">
            <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Risk Factors
            </h3>
            <div className="space-y-2">
              {assessment.analysis.riskFactors.length > 0 ? (
                assessment.analysis.riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                    <p className="text-sm font-mono text-white/70">{factor}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm font-mono text-white/40">No significant risk factors detected</p>
              )}
            </div>
          </Card>

          {/* Warnings */}
          <Card className="p-6">
            <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              Warnings
            </h3>
            <div className="space-y-2">
              {assessment.analysis.warnings.length > 0 ? (
                assessment.analysis.warnings.map((warning, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                    <p className="text-sm font-mono text-white/70">{warning}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm font-mono text-white/40">No warnings detected</p>
              )}
            </div>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            Recommendations
          </h3>
          <div className="space-y-2">
            {assessment.analysis.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <p className="text-sm font-mono text-white/70">{recommendation}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleDownload} variant="outline" className="flex-1">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
          <Button onClick={handleShare} variant="outline" className="flex-1">
            <Share2 className="w-4 h-4" />
            Share Report
          </Button>
          <Button href="/" className="flex-1">
            <Shield className="w-4 h-4" />
            Run Your Own Assessment
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-xs font-mono text-white/30 mb-2">
            This report was generated by TrustHire security assessment tool
          </p>
          <p className="text-xs font-mono text-white/20">
            Share token: {assessment.shareToken}
          </p>
          <p className="text-xs font-mono text-white/20 mt-2">
            TrustHire provides risk signals, not legal verdicts. This is for informational purposes only.
          </p>
        </div>
      </Container>
    </div>
  );
}
