'use client';

import { useState, useCallback } from 'react';
import { Shield, Search, AlertTriangle, CheckCircle, Play, FileText, Users, Zap, Copy, Download, Share2, Clock, TrendingUp, Upload, Target, Activity, BarChart3, FileCheck, Globe, Lock, Eye, EyeOff, Link, AlertCircle, Info, UserCheck, UserX, ShieldCheck, ShieldAlert, Globe2, Wifi, WifiOff, Smartphone, Monitor, Server, Database, Cloud } from 'lucide-react';
import { Card, Button, Badge, Container, Section, Skeleton } from '@/components/ui/DesignSystem';

interface URLAnalysis {
  id: string;
  url: string;
  domain: string;
  ip: string;
  country: string;
  riskScore: number;
  trustScore: number;
  status: 'pending' | 'running' | 'completed' | 'error';
  results?: any;
  startedAt?: string;
  completedAt?: string;
}

interface SecurityIssue {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: string;
  recommendation: string;
  category: 'malware' | 'phishing' | 'privacy' | 'technical' | 'reputation' | 'network';
}

interface URLSection {
  name: string;
  trustScore: number;
  securityScore: number;
  redFlags: number;
  details: any;
}

export default function URLScanPage() {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [analysis, setAnalysis] = useState<URLAnalysis | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseURL = (urlString: string) => {
    try {
      const urlObj = new URL(urlString);
      return {
        domain: urlObj.hostname,
        protocol: urlObj.protocol,
        path: urlObj.pathname,
        search: urlObj.search
      };
    } catch {
      return null;
    }
  };

  const startScan = useCallback(async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    const parsed = parseURL(url);
    if (!parsed) {
      setError('Invalid URL format');
      return;
    }

    setIsScanning(true);
    setError(null);
    setShowResults(false);

    const newAnalysis: URLAnalysis = {
      id: `analysis-${Date.now()}`,
      url: url,
      domain: parsed.domain,
      ip: '192.168.1.100',
      country: 'United States',
      riskScore: 0,
      trustScore: 0,
      status: 'running',
      startedAt: new Date().toISOString()
    };

    setAnalysis(newAnalysis);

    try {
      // Simulate scanning process
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockResults = generateMockResults(parsed.domain, url);
      
      setAnalysis(prev => prev ? {
        ...prev,
        ...mockResults.urlInfo,
        riskScore: mockResults.overallRiskScore,
        trustScore: mockResults.overallTrustScore,
        results: mockResults,
        completedAt: new Date().toISOString()
      } : null);

      setShowResults(true);
    } catch (err) {
      setError('Failed to analyze URL');
      setAnalysis(prev => prev ? {
        ...prev,
        status: 'error'
      } : null);
    } finally {
      setIsScanning(false);
    }
  }, [url]);

  const generateMockResults = (domain: string, fullUrl: string) => {
    const securityIssues: SecurityIssue[] = [
      {
        id: '1',
        type: 'SSL Certificate Issues',
        severity: 'high',
        description: 'SSL certificate is expired or self-signed',
        evidence: 'Certificate validation failed during HTTPS handshake',
        recommendation: 'Renew SSL certificate with a trusted certificate authority',
        category: 'technical' as const
      },
      {
        id: '2',
        type: 'Suspicious Domain Registration',
        severity: 'medium',
        description: 'Domain was recently registered with privacy protection',
        evidence: 'Domain age less than 30 days with WHOIS privacy protection',
        recommendation: 'Exercise caution with recently registered domains',
        category: 'reputation' as const
      },
      {
        id: '3',
        type: 'Malware Detection',
        severity: 'critical',
        description: 'URL is associated with known malware distribution',
        evidence: 'Multiple security engines detected malicious content',
        recommendation: 'Block access to this URL immediately',
        category: 'malware' as const
      },
      {
        id: '4',
        type: 'Phishing Indicators',
        severity: 'high',
        description: 'URL contains characteristics common in phishing attacks',
        evidence: 'Domain mimics legitimate brand with slight variations',
        recommendation: 'Verify the legitimate URL and report this phishing attempt',
        category: 'phishing' as const
      },
      {
        id: '5',
        type: 'Privacy Policy Missing',
        severity: 'low',
        description: 'No privacy policy found on the website',
        evidence: 'Crawling did not locate privacy policy or terms of service',
        recommendation: 'Verify data handling practices before providing information',
        category: 'privacy' as const
      }
    ];

    const urlSections: URLSection[] = [
      {
        name: 'Domain Information',
        trustScore: Math.floor(Math.random() * 40) + 60,
        securityScore: Math.floor(Math.random() * 35) + 65,
        redFlags: Math.floor(Math.random() * 2),
        details: {
          domainAge: Math.floor(Math.random() * 3650) + 30,
          registrar: 'GoDaddy',
          hasSSL: Math.random() > 0.3,
          hasDMARC: Math.random() > 0.6
        }
      },
      {
        name: 'Network Security',
        trustScore: Math.floor(Math.random() * 30) + 70,
        securityScore: Math.floor(Math.random() * 40) + 60,
        redFlags: Math.floor(Math.random() * 3),
        details: {
          ipReputation: Math.random() > 0.2,
          hasFirewall: Math.random() > 0.5,
          ddosProtection: Math.random() > 0.4,
          serverLocation: 'United States'
        }
      },
      {
        name: 'Content Analysis',
        trustScore: Math.floor(Math.random() * 35) + 65,
        securityScore: Math.floor(Math.random() * 45) + 55,
        redFlags: Math.floor(Math.random() * 2),
        details: {
          hasMalware: Math.random() > 0.8,
          hasPhishing: Math.random() > 0.7,
          hasSuspiciousScripts: Math.random() > 0.3,
          hasAdultContent: Math.random() > 0.9
        }
      },
      {
        name: 'Reputation Analysis',
        trustScore: Math.floor(Math.random() * 25) + 75,
        securityScore: Math.floor(Math.random() * 30) + 70,
        redFlags: Math.floor(Math.random() * 1),
        details: {
          blacklisted: Math.random() > 0.9,
          searchEnginePenalties: Math.random() > 0.8,
          userReports: Math.floor(Math.random() * 100),
          positiveReviews: Math.floor(Math.random() * 500) + 100
        }
      }
    ];

    const overallRiskScore = Math.floor(Math.random() * 60) + 20;
    const overallTrustScore = Math.floor(Math.random() * 40) + 50;

    return {
      overallRiskScore,
      overallTrustScore,
      urlInfo: {
        ip: '192.168.1.100',
        country: 'United States',
        city: 'San Francisco',
        isp: 'Cloudflare',
        organization: 'Cloudflare Inc.'
      },
      securityIssues,
      urlSections,
      recommendations: [
        'Verify SSL certificate validity and renewal status',
        'Check domain age and registration details',
        'Scan with multiple antivirus engines',
        'Look for phishing indicators and brand impersonation',
        'Verify privacy policy and data handling practices',
        'Check blacklists and reputation databases',
        'Analyze network security configurations',
        'Review user reports and community feedback'
      ],
      riskFactors: [
        'Expired or invalid SSL certificates',
        'Recently registered domains with privacy protection',
        'Known malware or phishing associations',
        'Suspicious URL patterns and structures',
        'Lack of proper security configurations'
      ]
    };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getTrustColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskBadge = (score: number) => {
    if (score >= 70) return { variant: 'error' as const, label: 'High Risk' };
    if (score >= 40) return { variant: 'warning' as const, label: 'Medium Risk' };
    return { variant: 'success' as const, label: 'Low Risk' };
  };

  const getTrustBadge = (score: number) => {
    if (score >= 80) return { variant: 'success' as const, label: 'Highly Trusted' };
    if (score >= 60) return { variant: 'warning' as const, label: 'Moderately Trusted' };
    return { variant: 'error' as const, label: 'Low Trust' };
  };

  const copyResults = () => {
    if (analysis?.results) {
      const resultsJson = JSON.stringify(analysis.results, null, 2);
      navigator.clipboard.writeText(resultsJson);
    }
  };

  const downloadResults = () => {
    if (analysis?.results) {
      const resultsJson = JSON.stringify(analysis.results, null, 2);
      const blob = new Blob([resultsJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `url-scan-${analysis.domain.replace(/\./g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Container>
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#111827] p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Link className="w-12 h-12 text-purple-400 mr-3" />
              <h1 className="text-4xl font-bold text-white">URL Security Scanner</h1>
            </div>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Analyze URLs for security threats, malware, phishing attempts, and 
              reputation issues. Get comprehensive security assessments with detailed 
              risk analysis and safety recommendations.
            </p>
          </div>

          {/* Scan Form */}
          <Card className="mb-8 p-8">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <label className="block text-white font-medium mb-2">
                  URL to Scan
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/page"
                    className="flex-1 px-4 py-3 bg-[#1e293b] border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                    disabled={isScanning}
                  />
                  <Button
                    variant="primary"
                    onClick={startScan}
                    disabled={isScanning || !url.trim()}
                    className="px-6 py-3"
                  >
                    {isScanning ? (
                      <>
                        <Activity className="w-5 h-5 mr-2 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Scan URL
                      </>
                    )}
                  </Button>
                </div>
                {error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    {error}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/70">
                <div className="flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2 text-purple-400" />
                  <span>Malware detection</span>
                </div>
                <div className="flex items-center">
                  <ShieldAlert className="w-4 h-4 mr-2 text-purple-400" />
                  <span>Phishing analysis</span>
                </div>
                <div className="flex items-center">
                  <Globe2 className="w-4 h-4 mr-2 text-purple-400" />
                  <span>Reputation check</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Analysis Progress */}
          {analysis && analysis.status === 'running' && (
            <Card className="mb-8 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Analyzing URL</h3>
                <Badge variant="info">In Progress</Badge>
              </div>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
                <h4 className="text-lg font-medium text-white mb-2">
                  {analysis.domain}
                </h4>
                <p className="text-white/70">
                  Scanning for security threats and reputation issues...
                </p>
              </div>
            </Card>
          )}

          {/* Results */}
          {showResults && analysis?.results && (
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-white">URL Analysis Results</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyResults}>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadResults}>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>

              {/* URL Overview */}
              <div className="bg-[#1e293b] rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-white">
                      {analysis.domain}
                    </h4>
                    <p className="text-white/70 text-sm truncate">{analysis.url}</p>
                    <div className="text-white/60 text-sm mt-1">
                      {analysis.ip} · {analysis.country}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white mb-1">
                      <span className={getRiskColor(analysis.riskScore)}>
                        {analysis.riskScore}
                      </span>
                      <span className="text-white/50">/100</span>
                    </div>
                    <Badge {...getRiskBadge(analysis.riskScore)}>
                      {getRiskBadge(analysis.riskScore).label}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      <span className={getTrustColor(analysis.trustScore)}>
                        {analysis.trustScore}%
                      </span>
                    </div>
                    <div className="text-white/70 text-sm">Trust Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{analysis.results.securityIssues.length}</div>
                    <div className="text-white/70 text-sm">Issues Found</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{analysis.results.urlSections.length}</div>
                    <div className="text-white/70 text-sm">Sections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{analysis.results.recommendations.length}</div>
                    <div className="text-white/70 text-sm">Recommendations</div>
                  </div>
                </div>
              </div>

              {/* URL Sections */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">URL Section Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.results.urlSections.map((section: URLSection, index: number) => (
                    <div key={index} className="bg-[#111827] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-white font-medium">{section.name}</h5>
                        <Badge variant={section.trustScore >= 70 ? 'success' : section.trustScore >= 50 ? 'warning' : 'error'}>
                          {section.trustScore}% Trusted
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Security Score</span>
                          <span className="text-white">{section.securityScore}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Red Flags</span>
                          <span className="text-red-400">{section.redFlags}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Issues */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">Security Issues</h4>
                <div className="space-y-3">
                  {analysis.results.securityIssues.map((issue: SecurityIssue) => (
                    <div key={issue.id} className="bg-[#111827] rounded-lg p-4 border-l-4 border-red-500">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                              {issue.severity.toUpperCase()}
                            </span>
                            <h5 className="text-white font-medium ml-3">{issue.type}</h5>
                          </div>
                          <p className="text-white/80 mb-2">{issue.description}</p>
                          <div className="text-sm text-white/60 mb-3">
                            <span className="mr-4">Evidence: {issue.evidence}</span>
                            <span className="mr-4">Category: {issue.category}</span>
                          </div>
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
                            <strong>Recommendation:</strong> {issue.recommendation}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">Risk Factors</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.results.riskFactors.map((factor: string, index: number) => (
                    <div key={index} className="flex items-start p-3 bg-[#111827] rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-white/80">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">Security Recommendations</h4>
                <div className="space-y-2">
                  {analysis.results.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start p-3 bg-[#111827] rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-white/80">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => {
                  setAnalysis(null);
                  setShowResults(false);
                  setUrl('');
                }}>
                  <Eye className="w-4 h-4 mr-1" />
                  New Scan
                </Button>
                <Button variant="primary" onClick={() => window.print()}>
                  <FileText className="w-4 h-4 mr-1" />
                  Print Report
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Container>
  );
}
