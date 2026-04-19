'use client';

import { useState, useCallback } from 'react';
import { Shield, Search, AlertTriangle, CheckCircle, Play, FileText, Users, Zap, Copy, Download, Share2, Clock, TrendingUp, Upload, Target, Activity, BarChart3, FileCheck, Globe, Lock, Eye, EyeOff, GitBranch, Package, Code, AlertCircle, Info } from 'lucide-react';
import { Card, Button, Badge, Container, Section, Skeleton } from '@/components/ui/DesignSystem';

interface GitHubAnalysis {
  id: string;
  repository: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  lastUpdated: string;
  riskScore: number;
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
  file: string;
  line?: number;
  recommendation: string;
  cwe?: string;
}

interface Dependency {
  name: string;
  version: string;
  vulnerabilities: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  lastUpdated: string;
}

export default function GitHubScanPage() {
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [analysis, setAnalysis] = useState<GitHubAnalysis | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseGitHubUrl = (url: string) => {
    const regex = /github\.com\/([^\/]+)\/([^\/\?#]+)/i;
    const match = url.match(regex);
    if (match) {
      return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
    }
    return null;
  };

  const startScan = useCallback(async () => {
    if (!repositoryUrl.trim()) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }

    const parsed = parseGitHubUrl(repositoryUrl);
    if (!parsed) {
      setError('Invalid GitHub repository URL format');
      return;
    }

    setIsScanning(true);
    setError(null);
    setShowResults(false);

    const newAnalysis: GitHubAnalysis = {
      id: `analysis-${Date.now()}`,
      repository: parsed.repo,
      owner: parsed.owner,
      description: 'Security analysis in progress...',
      stars: Math.floor(Math.random() * 10000) + 100,
      forks: Math.floor(Math.random() * 5000) + 50,
      language: 'TypeScript',
      lastUpdated: new Date().toISOString(),
      riskScore: 0,
      status: 'running',
      startedAt: new Date().toISOString()
    };

    setAnalysis(newAnalysis);

    try {
      // Simulate scanning process
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockResults = generateMockResults(parsed.owner, parsed.repo);
      
      setAnalysis(prev => prev ? {
        ...prev,
        status: 'completed',
        riskScore: mockResults.overallRiskScore,
        results: mockResults,
        completedAt: new Date().toISOString()
      } : null);

      setShowResults(true);
    } catch (err) {
      setError('Failed to analyze repository');
      setAnalysis(prev => prev ? {
        ...prev,
        status: 'error'
      } : null);
    } finally {
      setIsScanning(false);
    }
  }, [repositoryUrl]);

  const generateMockResults = (owner: string, repo: string) => {
    const issues: SecurityIssue[] = [
      {
        id: '1',
        type: 'SQL Injection',
        severity: 'high',
        description: 'Potential SQL injection vulnerability in database query',
        file: 'src/api/users.ts',
        line: 45,
        recommendation: 'Use parameterized queries or prepared statements',
        cwe: 'CWE-89'
      },
      {
        id: '2',
        type: 'Cross-Site Scripting (XSS)',
        severity: 'medium',
        description: 'Unsanitized user input in template rendering',
        file: 'src/components/Profile.tsx',
        line: 23,
        recommendation: 'Sanitize user input before rendering',
        cwe: 'CWE-79'
      },
      {
        id: '3',
        type: 'Hardcoded Secrets',
        severity: 'critical',
        description: 'API key found in source code',
        file: 'src/config/database.ts',
        line: 12,
        recommendation: 'Use environment variables for secrets',
        cwe: 'CWE-798'
      },
      {
        id: '4',
        type: 'Insecure Deserialization',
        severity: 'high',
        description: 'Unsafe deserialization of user data',
        file: 'src/utils/parser.ts',
        line: 67,
        recommendation: 'Validate and sanitize serialized data',
        cwe: 'CWE-502'
      },
      {
        id: '5',
        type: 'Broken Authentication',
        severity: 'medium',
        description: 'Weak password policy implementation',
        file: 'src/auth/password.ts',
        line: 34,
        recommendation: 'Implement strong password requirements',
        cwe: 'CWE-521'
      }
    ];

    const dependencies: Dependency[] = [
      {
        name: 'express',
        version: '4.18.2',
        vulnerabilities: 3,
        severity: 'medium',
        lastUpdated: '2024-01-15'
      },
      {
        name: 'lodash',
        version: '4.17.21',
        vulnerabilities: 1,
        severity: 'low',
        lastUpdated: '2024-01-10'
      },
      {
        name: 'axios',
        version: '1.6.0',
        vulnerabilities: 2,
        severity: 'medium',
        lastUpdated: '2024-01-08'
      },
      {
        name: 'jsonwebtoken',
        version: '9.0.2',
        vulnerabilities: 0,
        severity: 'low',
        lastUpdated: '2024-01-20'
      }
    ];

    const overallRiskScore = Math.floor(Math.random() * 40) + 30;

    return {
      overallRiskScore,
      issues,
      dependencies,
      metrics: {
        totalFiles: Math.floor(Math.random() * 500) + 100,
        linesOfCode: Math.floor(Math.random() * 50000) + 10000,
        testCoverage: Math.floor(Math.random() * 40) + 60,
        codeQuality: Math.floor(Math.random() * 30) + 70,
        securityScore: 100 - overallRiskScore,
        maintainabilityIndex: Math.floor(Math.random() * 20) + 75
      },
      recommendations: [
        'Update vulnerable dependencies to latest versions',
        'Implement input validation for all user inputs',
        'Use environment variables for sensitive configuration',
        'Add comprehensive logging and monitoring',
        'Implement proper error handling',
        'Add security headers to HTTP responses',
        'Regular security audits and penetration testing',
        'Implement rate limiting for API endpoints'
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

  const getRiskBadge = (score: number) => {
    if (score >= 70) return { variant: 'error' as const, label: 'High Risk' };
    if (score >= 40) return { variant: 'warning' as const, label: 'Medium Risk' };
    return { variant: 'success' as const, label: 'Low Risk' };
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
      a.download = `github-scan-${analysis.owner}-${analysis.repository}.json`;
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
              <GitBranch className="w-12 h-12 text-purple-400 mr-3" />
              <h1 className="text-4xl font-bold text-white">GitHub Repository Security Scanner</h1>
            </div>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Analyze any GitHub repository for security vulnerabilities, 
              dependency issues, and code quality problems. Get detailed reports 
              with actionable recommendations.
            </p>
          </div>

          {/* Scan Form */}
          <Card className="mb-8 p-8">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <label className="block text-white font-medium mb-2">
                  GitHub Repository URL
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={repositoryUrl}
                    onChange={(e) => setRepositoryUrl(e.target.value)}
                    placeholder="https://github.com/owner/repository"
                    className="flex-1 px-4 py-3 bg-[#1e293b] border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                    disabled={isScanning}
                  />
                  <Button
                    variant="primary"
                    onClick={startScan}
                    disabled={isScanning || !repositoryUrl.trim()}
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
                        Scan Repository
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
                  <Shield className="w-4 h-4 mr-2 text-purple-400" />
                  <span>Security vulnerability detection</span>
                </div>
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-2 text-purple-400" />
                  <span>Dependency analysis</span>
                </div>
                <div className="flex items-center">
                  <Code className="w-4 h-4 mr-2 text-purple-400" />
                  <span>Code quality assessment</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Analysis Progress */}
          {analysis && analysis.status === 'running' && (
            <Card className="mb-8 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Analyzing Repository</h3>
                <Badge variant="info">In Progress</Badge>
              </div>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
                <h4 className="text-lg font-medium text-white mb-2">
                  {analysis.owner}/{analysis.repository}
                </h4>
                <p className="text-white/70">
                  Scanning for security vulnerabilities and code issues...
                </p>
              </div>
            </Card>
          )}

          {/* Results */}
          {showResults && analysis?.results && (
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-white">Security Analysis Results</h3>
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

              {/* Repository Info */}
              <div className="bg-[#1e293b] rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-white">
                      {analysis.owner}/{analysis.repository}
                    </h4>
                    <p className="text-white/70">Repository Overview</p>
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
                    <div className="text-2xl font-bold text-white">{analysis.stars}</div>
                    <div className="text-white/70 text-sm">Stars</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{analysis.forks}</div>
                    <div className="text-white/70 text-sm">Forks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{analysis.results.metrics.totalFiles}</div>
                    <div className="text-white/70 text-sm">Files</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{analysis.results.metrics.testCoverage}%</div>
                    <div className="text-white/70 text-sm">Test Coverage</div>
                  </div>
                </div>
              </div>

              {/* Security Issues */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">Security Issues Found</h4>
                <div className="space-y-3">
                  {analysis.results.issues.map((issue: SecurityIssue) => (
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
                          <div className="text-sm text-white/60">
                            <span className="mr-4">📁 {issue.file}</span>
                            {issue.line && <span>📍 Line {issue.line}</span>}
                            {issue.cwe && <span className="ml-4">🔍 {issue.cwe}</span>}
                          </div>
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
                            <strong>Recommendation:</strong> {issue.recommendation}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dependencies */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">Dependency Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.results.dependencies.map((dep: Dependency, index: number) => (
                    <div key={index} className="bg-[#111827] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-white font-medium">{dep.name}</h5>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(dep.severity)}`}>
                          {dep.vulnerabilities} {dep.vulnerabilities === 1 ? 'vulnerability' : 'vulnerabilities'}
                        </span>
                      </div>
                      <div className="text-sm text-white/60">
                        <span className="mr-4">Version: {dep.version}</span>
                        <span>Updated: {dep.lastUpdated}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">Code Quality Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-[#111827] rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {analysis.results.metrics.linesOfCode.toLocaleString()}
                    </div>
                    <div className="text-white/70 text-sm">Lines of Code</div>
                  </div>
                  <div className="bg-[#111827] rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {analysis.results.metrics.codeQuality}%
                    </div>
                    <div className="text-white/70 text-sm">Code Quality</div>
                  </div>
                  <div className="bg-[#111827] rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {analysis.results.metrics.maintainabilityIndex}
                    </div>
                    <div className="text-white/70 text-sm">Maintainability Index</div>
                  </div>
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
                  setRepositoryUrl('');
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
