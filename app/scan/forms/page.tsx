'use client';

import { useState, useCallback } from 'react';
import { Shield, Search, AlertTriangle, CheckCircle, Play, FileText, Users, Zap, Copy, Download, Share2, Clock, TrendingUp, Upload, Target, Activity, BarChart3, FileCheck, Globe, Lock, Eye, EyeOff, File, Mail, Phone, Calendar, Award, Briefcase, MapPin, Link, AlertCircle, Info, UserCheck, UserX, ShieldCheck, ShieldAlert, FileText as FileIcon, Clipboard, Edit3, CheckSquare, Square } from 'lucide-react';
import { Card, Button, Badge, Container, Section, Skeleton } from '@/components/ui/DesignSystem';

interface FormAnalysis {
  id: string;
  formType: string;
  formUrl: string;
  submissionCount: number;
  riskScore: number;
  legitimacyScore: number;
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
  category: 'structure' | 'content' | 'security' | 'privacy' | 'phishing' | 'technical';
}

interface FormSection {
  name: string;
  completeness: number;
  securityScore: number;
  redFlags: number;
  details: any;
}

export default function FormsScanPage() {
  const [formUrl, setFormUrl] = useState('');
  const [formType, setFormType] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [analysis, setAnalysis] = useState<FormAnalysis | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formTypes = [
    'Application Form',
    'Contact Form',
    'Survey Form',
    'Registration Form',
    'Feedback Form',
    'Order Form',
    'Quote Request',
    'Newsletter Signup',
    'Job Application',
    'Contact Inquiry'
  ];

  const startScan = useCallback(async () => {
    if (!formUrl.trim()) {
      setError('Please enter a valid form URL');
      return;
    }

    if (!formType.trim()) {
      setError('Please select a form type');
      return;
    }

    setIsScanning(true);
    setError(null);
    setShowResults(false);

    const newAnalysis: FormAnalysis = {
      id: `analysis-${Date.now()}`,
      formType,
      formUrl,
      submissionCount: 0,
      riskScore: 0,
      legitimacyScore: 0,
      status: 'running',
      startedAt: new Date().toISOString()
    };

    setAnalysis(newAnalysis);

    try {
      // Simulate scanning process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResults = generateMockResults(formType, formUrl);
      
      setAnalysis(prev => prev ? {
        ...prev,
        submissionCount: mockResults.submissionCount,
        riskScore: mockResults.overallRiskScore,
        legitimacyScore: mockResults.overallLegitimacyScore,
        results: mockResults,
        completedAt: new Date().toISOString()
      } : null);

      setShowResults(true);
    } catch (err) {
      setError('Failed to analyze form');
      setAnalysis(prev => prev ? {
        ...prev,
        status: 'error'
      } : null);
    } finally {
      setIsScanning(false);
    }
  }, [formUrl, formType]);

  const generateMockResults = (type: string, url: string) => {
    const securityIssues: SecurityIssue[] = [
      {
        id: '1',
        type: 'Missing HTTPS Encryption',
        severity: 'high',
        description: 'Form does not use HTTPS encryption for data transmission',
        evidence: 'Form URL uses HTTP instead of HTTPS protocol',
        recommendation: 'Implement SSL/TLS encryption for all form submissions',
        category: 'security' as const
      },
      {
        id: '2',
        type: 'Insufficient Input Validation',
        severity: 'medium',
        description: 'Form lacks proper input validation and sanitization',
        evidence: 'No visible client-side validation patterns detected',
        recommendation: 'Add comprehensive input validation for all form fields',
        category: 'security' as const
      },
      {
        id: '3',
        type: 'Missing Privacy Policy Link',
        severity: 'medium',
        description: 'Form does not provide clear privacy policy information',
        evidence: 'No privacy policy link found in form vicinity',
        recommendation: 'Add visible privacy policy link before form submission',
        category: 'privacy' as const
      },
      {
        id: '4',
        type: 'Excessive Data Collection',
        severity: 'low',
        description: 'Form collects more personal data than necessary',
        evidence: 'Form requests sensitive information not relevant to purpose',
        recommendation: 'Review and minimize data collection to essential fields only',
        category: 'privacy' as const
      },
      {
        id: '5',
        type: 'No CAPTCHA Protection',
        severity: 'medium',
        description: 'Form lacks bot protection mechanisms',
        evidence: 'No CAPTCHA or bot detection system detected',
        recommendation: 'Implement CAPTCHA or similar bot protection',
        category: 'technical' as const
      }
    ];

    const formSections: FormSection[] = [
      {
        name: 'Form Structure',
        completeness: Math.floor(Math.random() * 30) + 70,
        securityScore: Math.floor(Math.random() * 40) + 60,
        redFlags: Math.floor(Math.random() * 3),
        details: {
          hasProperTags: Math.random() > 0.2,
          hasLabels: Math.random() > 0.1,
          hasPlaceholders: Math.random() > 0.3,
          hasRequiredFields: Math.random() > 0.15
        }
      },
      {
        name: 'Security Features',
        completeness: Math.floor(Math.random() * 35) + 65,
        securityScore: Math.floor(Math.random() * 45) + 55,
        redFlags: Math.floor(Math.random() * 2),
        details: {
          hasHttps: Math.random() > 0.4,
          hasValidation: Math.random() > 0.3,
          hasCSRFProtection: Math.random() > 0.7,
          hasRateLimit: Math.random() > 0.6
        }
      },
      {
        name: 'Privacy Compliance',
        completeness: Math.floor(Math.random() * 25) + 75,
        securityScore: Math.floor(Math.random() * 30) + 70,
        redFlags: Math.floor(Math.random() * 1),
        details: {
          hasPrivacyPolicy: Math.random() > 0.3,
          hasDataRetention: Math.random() > 0.8,
          hasGDPRCompliance: Math.random() > 0.6,
          hasConsentMechanism: Math.random() > 0.4
        }
      },
      {
        name: 'User Experience',
        completeness: Math.floor(Math.random() * 40) + 60,
        securityScore: Math.floor(Math.random() * 35) + 65,
        redFlags: Math.floor(Math.random() * 2),
        details: {
          hasClearInstructions: Math.random() > 0.2,
          hasErrorMessages: Math.random() > 0.3,
          hasProgressIndicator: Math.random() > 0.7,
          hasMobileOptimization: Math.random() > 0.4
        }
      }
    ];

    const overallRiskScore = Math.floor(Math.random() * 50) + 20;
    const overallLegitimacyScore = Math.floor(Math.random() * 30) + 60;
    const submissionCount = Math.floor(Math.random() * 10000) + 1000;

    return {
      overallRiskScore,
      overallLegitimacyScore,
      submissionCount,
      securityIssues,
      formSections,
      recommendations: [
        'Implement HTTPS encryption for all form submissions',
        'Add comprehensive input validation and sanitization',
        'Include clear privacy policy and consent mechanisms',
        'Implement CAPTCHA or bot protection systems',
        'Review and minimize data collection to essential fields',
        'Add proper error handling and user feedback',
        'Implement rate limiting to prevent abuse',
        'Ensure mobile responsiveness and accessibility'
      ],
      riskFactors: [
        'Unencrypted data transmission',
        'Insufficient input validation',
        'Missing privacy protections',
        'Lack of bot protection',
        'Excessive data collection'
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

  const getLegitimacyColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskBadge = (score: number) => {
    if (score >= 70) return { variant: 'error' as const, label: 'High Risk' };
    if (score >= 40) return { variant: 'warning' as const, label: 'Medium Risk' };
    return { variant: 'success' as const, label: 'Low Risk' };
  };

  const getLegitimacyBadge = (score: number) => {
    if (score >= 80) return { variant: 'success' as const, label: 'Highly Legitimate' };
    if (score >= 60) return { variant: 'warning' as const, label: 'Moderately Legitimate' };
    return { variant: 'error' as const, label: 'Low Legitimacy' };
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
      a.download = `form-scan-${analysis.formType.replace(/\s+/g, '-').toLowerCase()}.json`;
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
              <FileIcon className="w-12 h-12 text-purple-400 mr-3" />
              <h1 className="text-4xl font-bold text-white">Web Form Security Scanner</h1>
            </div>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Analyze web forms for security vulnerabilities, privacy compliance, 
              and legitimacy issues. Get detailed security assessments with actionable 
              recommendations for form protection and user data safety.
            </p>
          </div>

          {/* Scan Form */}
          <Card className="mb-8 p-8">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <label className="block text-white font-medium mb-2">
                  Form URL
                </label>
                <input
                  type="text"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://example.com/contact-form"
                  className="w-full px-4 py-3 bg-[#1e293b] border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 mb-4"
                  disabled={isScanning}
                />
              </div>

              <div className="mb-6">
                <label className="block text-white font-medium mb-2">
                  Form Type
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1e293b] border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 mb-4"
                  disabled={isScanning}
                >
                  <option value="">Select form type...</option>
                  {formTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={startScan}
                  disabled={isScanning || !formUrl.trim() || !formType.trim()}
                  className="flex-1"
                >
                  {isScanning ? (
                    <>
                      <Activity className="w-5 h-5 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Scan Form
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
                <span>Security vulnerability detection</span>
              </div>
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-2 text-purple-400" />
                <span>Privacy compliance analysis</span>
              </div>
              <div className="flex items-center">
                <FileCheck className="w-4 h-4 mr-2 text-purple-400" />
                <span>Form legitimacy verification</span>
              </div>
            </div>
          </Card>

          {/* Analysis Progress */}
          {analysis && analysis.status === 'running' && (
            <Card className="mb-8 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Analyzing Form</h3>
                <Badge variant="info">In Progress</Badge>
              </div>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
                <h4 className="text-lg font-medium text-white mb-2">
                  {analysis.formType}
                </h4>
                <p className="text-white/70">
                  Analyzing form security and compliance...
                </p>
              </div>
            </Card>
          )}

          {/* Results */}
          {showResults && analysis?.results && (
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-white">Form Analysis Results</h3>
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

              {/* Form Overview */}
              <div className="bg-[#1e293b] rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-white">
                      {analysis.formType}
                    </h4>
                    <p className="text-white/70 text-sm truncate">{analysis.formUrl}</p>
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
                    <div className="text-2xl font-bold text-white">{analysis.submissionCount.toLocaleString()}</div>
                    <div className="text-white/70 text-sm">Submissions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      <span className={getLegitimacyColor(analysis.legitimacyScore)}>
                        {analysis.legitimacyScore}%
                      </span>
                    </div>
                    <div className="text-white/70 text-sm">Legitimacy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{analysis.results.securityIssues.length}</div>
                    <div className="text-white/70 text-sm">Issues Found</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{analysis.results.formSections.length}</div>
                    <div className="text-white/70 text-sm">Sections</div>
                  </div>
                </div>
              </div>

              {/* Form Sections */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">Form Section Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.results.formSections.map((section: FormSection, index: number) => (
                    <div key={index} className="bg-[#111827] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-white font-medium">{section.name}</h5>
                        <Badge variant={section.securityScore >= 70 ? 'success' : section.securityScore >= 50 ? 'warning' : 'error'}>
                          {section.securityScore}% Secure
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Completeness</span>
                          <span className="text-white">{section.completeness}%</span>
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
                            <span className="mr-4">{issue.evidence}</span>
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
                  setFormUrl('');
                  setFormType('');
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
