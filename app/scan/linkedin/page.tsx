'use client';

import { useState, useCallback } from 'react';
import { Shield, Search, AlertTriangle, CheckCircle, Play, FileText, Users, Zap, Copy, Download, Share2, Clock, TrendingUp, Upload, Target, Activity, BarChart3, FileCheck, Globe, Lock, Eye, EyeOff, User, Mail, Phone, Calendar, Award, Briefcase, MapPin, Link, AlertCircle, Info, UserCheck, UserX, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Card, Button, Badge, Container, Section, Skeleton } from '@/components/ui/DesignSystem';

interface LinkedInAnalysis {
  id: string;
  profileUrl: string;
  profileName: string;
  headline: string;
  location: string;
  connections: number;
  followers: number;
  riskScore: number;
  authenticityScore: number;
  status: 'pending' | 'running' | 'completed' | 'error';
  results?: any;
  startedAt?: string;
  completedAt?: string;
}

interface RedFlag {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: string;
  recommendation: string;
  category: 'profile' | 'connections' | 'experience' | 'education' | 'skills' | 'activity';
}

interface ProfileSection {
  name: string;
  authenticity: number;
  completeness: number;
  redFlags: number;
  details: any;
}

export default function LinkedInScanPage() {
  const [profileUrl, setProfileUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [analysis, setAnalysis] = useState<LinkedInAnalysis | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseLinkedInUrl = (url: string) => {
    const regex = /linkedin\.com\/in\/([^\/\?#]+)/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const startScan = useCallback(async () => {
    if (!profileUrl.trim()) {
      setError('Please enter a valid LinkedIn profile URL');
      return;
    }

    const profileId = parseLinkedInUrl(profileUrl);
    if (!profileId) {
      setError('Invalid LinkedIn profile URL format');
      return;
    }

    setIsScanning(true);
    setError(null);
    setShowResults(false);

    const newAnalysis: LinkedInAnalysis = {
      id: `analysis-${Date.now()}`,
      profileUrl: profileUrl,
      profileName: profileId,
      headline: 'Security analysis in progress...',
      location: 'Unknown',
      connections: 0,
      followers: 0,
      riskScore: 0,
      authenticityScore: 0,
      status: 'running',
      startedAt: new Date().toISOString()
    };

    setAnalysis(newAnalysis);

    try {
      // Simulate scanning process
      await new Promise(resolve => setTimeout(resolve, 2500));

      const mockResults = generateMockResults(profileId);
      
      setAnalysis(prev => prev ? {
        ...prev,
        profileName: profileId,
        headline: 'Security Professional | Cybersecurity Expert',
        location: 'San Francisco, CA',
        connections: Math.floor(Math.random() * 2000) + 500,
        followers: Math.floor(Math.random() * 500) + 100,
        riskScore: mockResults.overallRiskScore,
        authenticityScore: mockResults.overallAuthenticityScore,
        results: mockResults,
        completedAt: new Date().toISOString()
      } : null);

      setShowResults(true);
    } catch (err) {
      setError('Failed to analyze LinkedIn profile');
      setAnalysis(prev => prev ? {
        ...prev,
        status: 'error'
      } : null);
    } finally {
      setIsScanning(false);
    }
  }, [profileUrl]);

  const generateMockResults = (profileId: string) => {
    const redFlags: RedFlag[] = [
      {
        id: '1',
        type: 'Profile Photo Analysis',
        severity: 'medium',
        description: 'Profile photo appears to be AI-generated or stock image',
        evidence: 'Unnatural facial features, inconsistent lighting',
        recommendation: 'Request video call or additional photo verification'
      },
      {
        id: '2',
        type: 'Connection Network Anomaly',
        severity: 'high',
        description: 'Unusual connection pattern with many fake or bot accounts',
        evidence: 'High percentage of connections with incomplete profiles',
        recommendation: 'Manually verify key connections before engagement'
      },
      {
        id: '3',
        type: 'Experience Timeline Gaps',
        severity: 'medium',
        description: 'Significant gaps in employment history',
        evidence: '2+ year gaps between positions without explanation',
        recommendation: 'Request clarification on career timeline gaps'
      },
      {
        id: '4',
        type: 'Skill Endorsement Anomaly',
        severity: 'low',
        description: 'High number of endorsements from unknown connections',
        evidence: 'Endorsements primarily from connections with no interaction history',
        recommendation: 'Verify skills through practical assessment or references'
      },
      {
        id: '5',
        type: 'Activity Pattern Analysis',
        severity: 'medium',
        description: 'Inconsistent posting and engagement patterns',
        evidence: 'Burst activity followed by long periods of inactivity',
        recommendation: 'Monitor for automated or scheduled posting behavior'
      }
    ];

    const profileSections: ProfileSection[] = [
      {
        name: 'Basic Information',
        authenticity: Math.floor(Math.random() * 30) + 70,
        completeness: Math.floor(Math.random() * 40) + 60,
        redFlags: Math.floor(Math.random() * 3),
        details: {
          hasProfilePhoto: true,
          hasHeadline: true,
          hasLocation: true,
          hasSummary: Math.random() > 0.3
        }
      },
      {
        name: 'Experience',
        authenticity: Math.floor(Math.random() * 40) + 60,
        completeness: Math.floor(Math.random() * 50) + 50,
        redFlags: Math.floor(Math.random() * 2),
        details: {
          totalPositions: Math.floor(Math.random() * 5) + 2,
          hasDescriptions: Math.random() > 0.2,
          hasDates: Math.random() > 0.1,
          hasCompanies: Math.random() > 0.15
        }
      },
      {
        name: 'Education',
        authenticity: Math.floor(Math.random() * 25) + 75,
        completeness: Math.floor(Math.random() * 35) + 65,
        redFlags: Math.floor(Math.random() * 1),
        details: {
          totalEducation: Math.floor(Math.random() * 3) + 1,
          hasInstitutions: Math.random() > 0.1,
          hasDegrees: Math.random() > 0.05,
          hasDates: Math.random() > 0.2
        }
      },
      {
        name: 'Skills & Endorsements',
        authenticity: Math.floor(Math.random() * 35) + 65,
        completeness: Math.floor(Math.random() * 45) + 55,
        redFlags: Math.floor(Math.random() * 2),
        details: {
          totalSkills: Math.floor(Math.random() * 20) + 10,
          totalEndorsements: Math.floor(Math.random() * 100) + 50,
          hasRecommendations: Math.random() > 0.4
        }
      },
      {
        name: 'Network Quality',
        authenticity: Math.floor(Math.random() * 30) + 70,
        completeness: Math.floor(Math.random() * 40) + 60,
        redFlags: Math.floor(Math.random() * 3),
        details: {
          totalConnections: Math.floor(Math.random() * 2000) + 500,
          mutualConnections: Math.floor(Math.random() * 100) + 20,
          followerRatio: Math.random() * 0.3 + 0.1
        }
      }
    ];

    const overallRiskScore = Math.floor(Math.random() * 40) + 20;
    const overallAuthenticityScore = Math.floor(Math.random() * 30) + 60;

    return {
      overallRiskScore,
      overallAuthenticityScore,
      redFlags,
      profileSections,
      recommendations: [
        'Verify profile through multiple communication channels',
        'Check for consistency across professional networks',
        'Request video verification for high-risk interactions',
        'Cross-reference employment history with company records',
        'Monitor for unusual activity patterns',
        'Validate key professional connections independently',
        'Be cautious of urgent requests or pressure tactics',
        'Use secure communication channels for sensitive information'
      ],
      riskFactors: [
        'Incomplete or inconsistent profile information',
        'Unusual connection patterns',
        'Generic or stock profile photos',
        'Employment timeline inconsistencies',
        'High number of endorsements from unknown sources'
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

  const getAuthenticityColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskBadge = (score: number) => {
    if (score >= 70) return { variant: 'error' as const, label: 'High Risk' };
    if (score >= 40) return { variant: 'warning' as const, label: 'Medium Risk' };
    return { variant: 'success' as const, label: 'Low Risk' };
  };

  const getAuthenticityBadge = (score: number) => {
    if (score >= 80) return { variant: 'success' as const, label: 'Highly Authentic' };
    if (score >= 60) return { variant: 'warning' as const, label: 'Moderately Authentic' };
    return { variant: 'error' as const, label: 'Low Authenticity' };
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
      a.download = `linkedin-scan-${analysis.profileName}.json`;
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
              <Users className="w-12 h-12 text-purple-400 mr-3" />
              <h1 className="text-4xl font-bold text-white">LinkedIn Profile Security Scanner</h1>
            </div>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Analyze LinkedIn profiles for authenticity, detect fake accounts, 
              and identify potential recruitment scams. Get detailed verification reports 
              with risk assessments and security recommendations.
            </p>
          </div>

          {/* Scan Form */}
          <Card className="mb-8 p-8">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <label className="block text-white font-medium mb-2">
                  LinkedIn Profile URL
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="flex-1 px-4 py-3 bg-[#1e293b] border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                    disabled={isScanning}
                  />
                  <Button
                    variant="primary"
                    onClick={startScan}
                    disabled={isScanning || !profileUrl.trim()}
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
                        Scan Profile
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
                  <UserCheck className="w-4 h-4 mr-2 text-purple-400" />
                  <span>Profile authenticity verification</span>
                </div>
                <div className="flex items-center">
                  <ShieldAlert className="w-4 h-4 mr-2 text-purple-400" />
                  <span>Fake account detection</span>
                </div>
                <div className="flex items-center">
                  <UserX className="w-4 h-4 mr-2 text-purple-400" />
                  <span>Recruitment scam analysis</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Analysis Progress */}
          {analysis && analysis.status === 'running' && (
            <Card className="mb-8 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Analyzing Profile</h3>
                <Badge variant="info">In Progress</Badge>
              </div>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
                <h4 className="text-lg font-medium text-white mb-2">
                  {analysis.profileName}
                </h4>
                <p className="text-white/70">
                  Analyzing profile authenticity and security risks...
                </p>
              </div>
            </Card>
          )}

          {/* Results */}
          {showResults && analysis?.results && (
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-white">Profile Analysis Results</h3>
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

              {/* Profile Overview */}
              <div className="bg-[#1e293b] rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-white">
                      {analysis.profileName}
                    </h4>
                    <p className="text-white/70">{analysis.headline}</p>
                    <p className="text-white/60 text-sm">{analysis.location}</p>
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
                    <div className="text-2xl font-bold text-white">{analysis.connections}</div>
                    <div className="text-white/70 text-sm">Connections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{analysis.followers}</div>
                    <div className="text-white/70 text-sm">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      <span className={getAuthenticityColor(analysis.authenticityScore)}>
                        {analysis.authenticityScore}%
                      </span>
                    </div>
                    <div className="text-white/70 text-sm">Authenticity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{analysis.results.redFlags.length}</div>
                    <div className="text-white/70 text-sm">Red Flags</div>
                  </div>
                </div>
              </div>

              {/* Profile Sections */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">Profile Section Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.results.profileSections.map((section: ProfileSection, index: number) => (
                    <div key={index} className="bg-[#111827] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-white font-medium">{section.name}</h5>
                        <Badge variant={section.authenticity >= 80 ? 'success' : section.authenticity >= 60 ? 'warning' : 'error'}>
                          {section.authenticity}% Authentic
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

              {/* Red Flags */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">Security Red Flags</h4>
                <div className="space-y-3">
                  {analysis.results.redFlags.map((flag: RedFlag) => (
                    <div key={flag.id} className="bg-[#111827] rounded-lg p-4 border-l-4 border-red-500">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(flag.severity)}`}>
                              {flag.severity.toUpperCase()}
                            </span>
                            <h5 className="text-white font-medium ml-3">{flag.type}</h5>
                          </div>
                          <p className="text-white/80 mb-2">{flag.description}</p>
                          <div className="text-sm text-white/60 mb-3">
                            <span className="mr-4">🔍 {flag.evidence}</span>
                            <span className="mr-4">📁 {flag.category}</span>
                          </div>
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
                            <strong>Recommendation:</strong> {flag.recommendation}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">Common Risk Factors</h4>
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
                  setProfileUrl('');
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
