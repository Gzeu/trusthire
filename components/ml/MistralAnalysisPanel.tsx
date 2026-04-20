/**
 * Mistral AI Analysis Panel
 * Advanced AI-powered security analysis using Mistral models
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Code, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Zap,
  FileText,
  Users,
  BarChart3,
  Settings,
  RefreshCw,
  TrendingUp,
  Eye,
  Target
} from 'lucide-react';

interface MistralOverview {
  status: string;
  model: string;
  apiKey: string;
  totalRequests: number;
  successRate: number;
  averageTokens: number;
  mostUsedModel: string;
  capabilities: string[];
  supportedModels: string[];
}

interface SecurityAnalysis {
  threatLevel: string;
  confidence: number;
  indicators: string[];
  reasoning: string;
  recommendations: string[];
  riskFactors: Array<{
    factor: string;
    severity: string;
    description: string;
  }>;
  complianceIssues: Array<{
    standard: string;
    severity: string;
    description: string;
    remediation: string;
  }>;
}

export default function MistralAnalysisPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState<MistralOverview | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SecurityAnalysis | null>(null);
  const [content, setContent] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [analysisType, setAnalysisType] = useState('threat_detection');

  useEffect(() => {
    fetchMistralOverview();
    const interval = setInterval(fetchMistralOverview, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMistralOverview = async () => {
    try {
      const response = await fetch('/api/ml/mistral/analyze?view=overview');
      const data = await response.json();
      if (data.success) {
        setOverview(data.data.overview);
      }
    } catch (error) {
      console.error('Error fetching Mistral overview:', error);
    }
  };

  const performSecurityAnalysis = async () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ml/mistral/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'security_analysis',
          content,
          analysisType
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAnalysis(data.data.analysis);
      }
    } catch (error) {
      console.error('Error performing security analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performCodeAnalysis = async () => {
    if (!code.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ml/mistral/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'code_analysis',
          code,
          language
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Handle code analysis results
        console.log('Code analysis result:', data.data.codeAnalysis);
      }
    } catch (error) {
      console.error('Error performing code analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const detectSocialEngineering = async () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ml/mistral/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'social_engineering',
          content,
          context: {
            platform: 'email',
            senderInfo: 'unknown'
          }
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Social engineering result:', data.data.socialEngineeringAnalysis);
      }
    } catch (error) {
      console.error('Error detecting social engineering:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mistral AI Analysis</h2>
          <p className="text-muted-foreground">
            Advanced AI-powered security analysis using Mistral models
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={overview?.status === 'active' ? "default" : "outline"}>
            {overview?.status === 'active' ? "Mistral Active" : "Mistral Inactive"}
          </Badge>
          <Badge variant="outline">
            {overview?.model || 'Loading...'}
          </Badge>
        </div>
      </div>

      {/* Mistral Overview */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.totalRequests}</div>
              <p className="text-xs text-muted-foreground">
                processed requests
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(overview.successRate)}%</div>
              <p className="text-xs text-muted-foreground">
                successful analyses
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.averageTokens}</div>
              <p className="text-xs text-muted-foreground">
                tokens per request
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">API Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${overview.apiKey === 'configured' ? 'text-green-600' : 'text-red-600'}`}>
                {overview.apiKey === 'configured' ? 'Configured' : 'Not Set'}
              </div>
              <p className="text-xs text-muted-foreground">
                API key status
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Security Analysis</TabsTrigger>
          <TabsTrigger value="code">Code Analysis</TabsTrigger>
          <TabsTrigger value="social">Social Engineering</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mistral Capabilities</CardTitle>
              <CardDescription>
                Advanced AI models for comprehensive security analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {overview?.capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Brain className="h-4 w-4" />
                    <span className="font-medium">{capability}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div>
                <h4 className="font-medium mb-2">Supported Models</h4>
                <div className="flex flex-wrap gap-2">
                  {overview?.supportedModels.map((model, index) => (
                    <Badge key={index} variant="outline">
                      {model}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Analysis</CardTitle>
              <CardDescription>
                AI-powered threat detection and risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Analysis Type</label>
                <select 
                  value={analysisType} 
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="threat_detection">Threat Detection</option>
                  <option value="behavioral_analysis">Behavioral Analysis</option>
                  <option value="risk_assessment">Risk Assessment</option>
                  <option value="compliance_check">Compliance Check</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Content to Analyze</label>
                <textarea
                  className="w-full mt-1 p-3 border rounded-md"
                  rows={6}
                  placeholder="Enter content for security analysis..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <Button 
                onClick={performSecurityAnalysis} 
                disabled={isAnalyzing || !content.trim()}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing with Mistral AI...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Analyze Security
                  </>
                )}
              </Button>

              {analysis && (
                <div className="space-y-4 mt-6">
                  <div className={`p-4 rounded-lg ${getThreatLevelColor(analysis.threatLevel)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Threat Level: {analysis.threatLevel.toUpperCase()}</span>
                      <span className="text-sm">{Math.round(analysis.confidence * 100)}% confidence</span>
                    </div>
                    <Progress value={analysis.confidence * 100} className="h-2" />
                  </div>

                  {analysis.indicators.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Indicators</h4>
                      <div className="space-y-1">
                        {analysis.indicators.map((indicator, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            <span className="text-sm">{indicator}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Recommendations</h4>
                      <div className="space-y-1">
                        {analysis.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Code Security Analysis</CardTitle>
              <CardDescription>
                AI-powered vulnerability detection and security assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Programming Language</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="e.g., javascript, python, java (optional)"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Code to Analyze</label>
                <textarea
                  className="w-full mt-1 p-3 border rounded-md font-mono text-sm"
                  rows={8}
                  placeholder="Enter code for security analysis..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <Button 
                onClick={performCodeAnalysis} 
                disabled={isAnalyzing || !code.trim()}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Code...
                  </>
                ) : (
                  <>
                    <Code className="h-4 w-4 mr-2" />
                    Analyze Code Security
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Engineering Detection</CardTitle>
              <CardDescription>
                AI-powered detection of manipulation tactics and social engineering
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Content to Analyze</label>
                <textarea
                  className="w-full mt-1 p-3 border rounded-md"
                  rows={6}
                  placeholder="Enter email, message, or content for social engineering analysis..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <Button 
                onClick={detectSocialEngineering} 
                disabled={isAnalyzing || !content.trim()}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Detecting Social Engineering...
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Detect Social Engineering
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
