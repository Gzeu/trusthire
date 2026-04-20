'use client';

import { useState } from 'react';
import { 
  Brain, 
  User, 
  Code, 
  Shield, 
  Search, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Eye,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AssessPage() {
  const [activeTab, setActiveTab] = useState('candidate');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnalysis = async (type: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResults = {
      candidate: {
        score: 87,
        riskLevel: 'Low',
        strengths: ['Strong technical background', 'Consistent experience', 'Verified credentials'],
        concerns: ['Limited recent projects'],
        recommendation: 'Proceed with interview process'
      },
      repository: {
        securityScore: 92,
        issues: [],
        qualityMetrics: {
          codeQuality: 'Excellent',
          documentation: 'Good',
          testing: 'Adequate'
        },
        recommendation: 'Repository is secure and well-maintained'
      },
      security: {
        threatLevel: 'Minimal',
        vulnerabilities: [],
        complianceScore: 96,
        recommendations: ['Enable 2FA', 'Regular security audits']
      }
    };

    setResults(mockResults[type]);
    setIsAnalyzing(false);
  };

  const tabs = [
    { id: 'candidate', label: 'Candidate Analysis', icon: User },
    { id: 'repository', label: 'Repository Scan', icon: Code },
    { id: 'security', label: 'Security Assessment', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">AI Analysis Center</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive AI-powered analysis for candidates, repositories, and security threats
          </p>
        </div>

        {/* Analysis Type Tabs */}
        <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 mb-8">
          <div className="flex space-x-1 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Analysis Input */}
        <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 mb-8">
          <div className="p-8">
            {activeTab === 'candidate' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Candidate Information
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    rows={4}
                    placeholder="Enter candidate details, resume, or profile information..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <FileText className="h-4 w-4 inline mr-2" />
                      Resume Upload
                    </label>
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Click to upload resume</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Search className="h-4 w-4 inline mr-2" />
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'repository' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Code className="h-4 w-4 inline mr-2" />
                    Repository URL
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="https://github.com/username/repository"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Eye className="h-4 w-4 inline mr-2" />
                      Analysis Depth
                    </label>
                    <select className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                      <option value="basic">Basic Scan</option>
                      <option value="comprehensive">Comprehensive Analysis</option>
                      <option value="security">Security Focus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <BarChart3 className="h-4 w-4 inline mr-2" />
                      Include Metrics
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center text-sm text-gray-300">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Code Quality Analysis
                      </label>
                      <label className="flex items-center text-sm text-gray-300">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Security Vulnerabilities
                      </label>
                      <label className="flex items-center text-sm text-gray-300">
                        <input type="checkbox" className="mr-2" />
                        Performance Metrics
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Shield className="h-4 w-4 inline mr-2" />
                    Security Scan Type
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                    <option value="network">Network Security</option>
                    <option value="application">Application Security</option>
                    <option value="infrastructure">Infrastructure Security</option>
                    <option value="compliance">Compliance Check</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Search className="h-4 w-4 inline mr-2" />
                      Target Domain/IP
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="example.com or 192.168.1.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Zap className="h-4 w-4 inline mr-2" />
                      Scan Intensity
                    </label>
                    <select className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                      <option value="quick">Quick Scan</option>
                      <option value="standard">Standard Analysis</option>
                      <option value="deep">Deep Inspection</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => handleAnalysis(activeTab)}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                    AI Analysis in Progress...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-5 w-5" />
                    Start AI Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Results */}
        {results && activeTab === 'candidate' && (
          <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Candidate Analysis Results</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">{results.candidate.score}</div>
                  <div className="text-sm text-gray-300 mb-1">Overall Score</div>
                  <Badge className="bg-green-500 text-white">Low Risk</Badge>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">{results.candidate.strengths.length}</div>
                  <div className="text-sm text-gray-300 mb-1">Key Strengths</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">{results.candidate.concerns.length}</div>
                  <div className="text-sm text-gray-300 mb-1">Areas to Review</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {results.candidate.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center text-green-300">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                    Concerns
                  </h3>
                  <ul className="space-y-2">
                    {results.candidate.concerns.map((concern, index) => (
                      <li key={index} className="flex items-center text-yellow-300">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-600/20 border border-blue-400/30 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Recommendation</h3>
                <p className="text-blue-200">{results.candidate.recommendation}</p>
              </div>
            </div>
          </Card>
        )}

        {results && activeTab === 'repository' && (
          <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Repository Analysis Results</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Security Score</h3>
                  <div className="text-4xl font-bold text-green-400 mb-2">{results.repository.securityScore}</div>
                  <div className="text-sm text-gray-300">Out of 100</div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Issues Found</h3>
                  <div className="text-4xl font-bold text-green-400 mb-2">{results.repository.issues.length}</div>
                  <div className="text-sm text-gray-300">Critical/High/Medium/Low</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Quality Metrics</h3>
                <div className="space-y-3">
                  {Object.entries(results.repository.qualityMetrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-gray-300 capitalize">{key}:</span>
                      <Badge className={
                        value === 'Excellent' ? 'bg-green-500 text-white' :
                        value === 'Good' ? 'bg-blue-500 text-white' :
                        'bg-yellow-500 text-white'
                      }>
                        {value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-600/20 border border-green-400/30 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Recommendation</h3>
                <p className="text-green-200">{results.repository.recommendation}</p>
              </div>
            </div>
          </Card>
        )}

        {results && activeTab === 'security' && (
          <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Security Assessment Results</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">{results.security.threatLevel}</div>
                  <div className="text-sm text-gray-300 mb-1">Threat Level</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">{results.security.vulnerabilities.length}</div>
                  <div className="text-sm text-gray-300 mb-1">Vulnerabilities</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">{results.security.complianceScore}</div>
                  <div className="text-sm text-gray-300 mb-1">Compliance Score</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Security Recommendations</h3>
                <ul className="space-y-2">
                  {results.security.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-center text-blue-300">
                      <Shield className="h-4 w-4 mr-2" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
