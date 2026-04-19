'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  AlertTriangle, 
  Check, 
  Eye, 
  Calendar,
  User,
  Link2,
  Download,
  Share2,
  Clock,
  Info
} from 'lucide-react';

interface ShareData {
  id: string;
  assessmentId: string;
  isPublic: boolean;
  includeDetails: boolean;
  includeRecommendations: boolean;
  customMessage?: string;
  createdAt: string;
  expiresAt: string;
  viewCount: number;
  lastViewedAt?: string;
  assessment: {
    recruiter: {
      name: string;
      claimedCompany: string;
      linkedinUrl?: string;
    };
    job: {
      jobDescription?: string;
      salaryMentioned: boolean;
      urgencySignals: boolean;
    };
    verdict: {
      overallScore: number;
      riskLevel: string;
      recommendation: string;
    };
    redFlags: Array<{
      type: string;
      description: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
    }>;
  };
}

export default function SharePage() {
  const params = useParams();
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (params.token) {
      fetchShareData(params.token as string);
    }
  }, [params.token]);

  const fetchShareData = async (token: string) => {
    try {
      const response = await fetch(`/api/share/${token}`);
      const data = await response.json();

      if (response.ok) {
        setShareData(data);
        
        // Increment view count
        await fetch(`/api/share/${token}/view`, { method: 'POST' });
      } else {
        if (data.error === 'Share link expired') {
          setExpired(true);
        } else {
          setError(data.error || 'Failed to load shared assessment');
        }
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getRiskLevelBadge = (score: number) => {
    if (score >= 80) return { label: 'Low Risk', variant: 'default' as const };
    if (score >= 60) return { label: 'Medium Risk', variant: 'secondary' as const };
    if (score >= 40) return { label: 'High Risk', variant: 'destructive' as const };
    return { label: 'Critical Risk', variant: 'destructive' as const };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-yellow-500';
      case 'medium': return 'text-orange-500';
      case 'high': return 'text-red-500';
      case 'critical': return 'text-red-600';
      default: return 'text-zinc-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-zinc-400">Loading shared assessment...</p>
        </div>
      </div>
    );
  }

  if (error || expired) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 border-zinc-800 bg-zinc-900/50">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-red-400">
              {expired ? 'Share Link Expired' : 'Assessment Not Found'}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {expired 
                ? 'This share link has expired. Share links are valid for 30 days.'
                : 'The assessment you\'re looking for doesn\'t exist or has been removed.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Return to TrustHire
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!shareData) return null;

  const riskBadge = getRiskLevelBadge(shareData.assessment.verdict.overallScore);

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-purple-500" />
              <h1 className="text-xl font-bold text-zinc-100">TrustHire Assessment</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{shareData.viewCount} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Expires {new Date(shareData.expiresAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Custom Message */}
            {shareData.customMessage && (
              <Card className="border-purple-800/30 bg-purple-900/20">
                <CardHeader>
                  <CardTitle className="text-purple-300 text-sm">Shared Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-200 text-sm">{shareData.customMessage}</p>
                </CardContent>
              </Card>
            )}

            {/* Assessment Overview */}
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-zinc-100">Assessment Overview</CardTitle>
                <CardDescription className="text-zinc-400">
                  Security analysis results for {shareData.assessment.recruiter.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Recruiter Info */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-zinc-300">Recruiter Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-zinc-500">Name:</span>
                      <span className="ml-2 text-zinc-300">{shareData.assessment.recruiter.name}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Company:</span>
                      <span className="ml-2 text-zinc-300">{shareData.assessment.recruiter.claimedCompany}</span>
                    </div>
                  </div>
                </div>

                {/* Risk Score */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                  <div>
                    <p className="text-sm text-zinc-400">Overall Risk Score</p>
                    <p className={`text-3xl font-bold ${getRiskLevelColor(shareData.assessment.verdict.overallScore)}`}>
                      {shareData.assessment.verdict.overallScore}/100
                    </p>
                  </div>
                  <Badge variant={riskBadge.variant} className="text-sm px-3 py-1">
                    {riskBadge.label}
                  </Badge>
                </div>

                {/* Red Flags */}
                {shareData.includeDetails && shareData.assessment.redFlags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-zinc-300">Security Issues Detected</h4>
                    <div className="space-y-2">
                      {shareData.assessment.redFlags.map((flag, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/30 border border-zinc-700">
                          <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(flag.severity)}`}></div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-zinc-300 capitalize">{flag.type}</span>
                              <Badge variant="outline" className="text-xs">
                                {flag.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-zinc-400">{flag.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {shareData.includeRecommendations && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-zinc-300">Recommendations</h4>
                    <div className="p-3 rounded-lg bg-green-900/20 border border-green-800/30">
                      <p className="text-sm text-green-300">{shareData.assessment.verdict.recommendation}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-zinc-100">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    onClick={() => window.location.href = '/'}
                    variant="outline"
                    className="justify-start"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Run Your Own Assessment
                  </Button>
                  <Button
                    onClick={() => {
                      const shareUrl = window.location.href;
                      navigator.clipboard.writeText(shareUrl);
                      alert('Link copied to clipboard!');
                    }}
                    variant="outline"
                    className="justify-start"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share This Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* TrustHire Info */}
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-zinc-100">About TrustHire</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-zinc-400">
                  TrustHire is an AI-powered security platform that helps developers 
                  identify fake recruiters, malicious repositories, and hiring scams in the Web3 ecosystem.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-zinc-300">AI-powered analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-zinc-300">Real-time threat detection</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-zinc-300">Comprehensive security checks</span>
                  </div>
                </div>
                <Button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Share Info */}
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-zinc-100">Share Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Shared:</span>
                    <span className="text-zinc-300">{new Date(shareData.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Visibility:</span>
                    <span className="text-zinc-300">{shareData.isPublic ? 'Public' : 'Private'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Views:</span>
                    <span className="text-zinc-300">{shareData.viewCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Expires:</span>
                    <span className="text-zinc-300">{new Date(shareData.expiresAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-purple-800/30 bg-purple-900/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm text-purple-300 font-medium">
                      Security Notice
                    </p>
                    <p className="text-xs text-purple-400">
                      This shared assessment contains sensitive security information. 
                      Verify the source before taking any action based on these results.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
