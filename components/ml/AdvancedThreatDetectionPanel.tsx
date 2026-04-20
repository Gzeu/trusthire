/**
 * Advanced Threat Detection Panel 2026
 * State-of-the-art AI security interface for sophisticated scammer detection
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
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity,
  Eye,
  Brain,
  Mic,
  Wallet,
  Users,
  Globe,
  Zap,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';

interface ThreatVector {
  type: 'deepfake' | 'ai_voice' | 'synthetic_identity' | 'blockchain_scam' | 'ai_phishing' | 'social_engineering_2.0';
  sophistication: 'basic' | 'intermediate' | 'advanced' | 'expert';
  confidence: number;
  indicators: string[];
  mitigation: string[];
}

interface ThreatAnalysis {
  threatVectors: ThreatVector[];
  overallRisk: number;
  recommendations: string[];
  confidence: number;
}

interface MonitoringStats {
  totalTargets: number;
  activeTargets: number;
  totalAlerts: number;
  criticalAlerts: number;
  highRiskTargets: number;
  threatTrends: Array<{ type: string; count: number; trend: string }>;
}

export default function AdvancedThreatDetectionPanel() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ThreatAnalysis | null>(null);
  const [monitoringStats, setMonitoringStats] = useState<MonitoringStats | null>(null);
  const [activeTab, setActiveTab] = useState('detect');
  const [inputContent, setInputContent] = useState('');
  const [inputMedia, setInputMedia] = useState('');
  const [inputAudio, setInputAudio] = useState('');
  const [inputWallet, setInputWallet] = useState('');
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(false);

  useEffect(() => {
    fetchMonitoringStats();
    const interval = setInterval(fetchMonitoringStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMonitoringStats = async () => {
    try {
      const response = await fetch('/api/ml/monitoring/real-time?view=overview');
      const data = await response.json();
      if (data.success) {
        setMonitoringStats(data.data.statistics);
      }
    } catch (error) {
      console.error('Error fetching monitoring stats:', error);
    }
  };

  const handleAdvancedDetection = async () => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/ml/advanced-threats/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: inputContent || undefined,
          mediaUrl: inputMedia || undefined,
          audioUrl: inputAudio || undefined,
          walletAddress: inputWallet || undefined,
          realTimeMonitoring
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAnalysis(data.data.threatAnalysis);
      }
    } catch (error) {
      console.error('Error during advanced detection:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (risk: number) => {
    if (risk >= 0.9) return 'text-red-600';
    if (risk >= 0.7) return 'text-orange-600';
    if (risk >= 0.5) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getSeverityBg = (risk: number) => {
    if (risk >= 0.9) return 'bg-red-100';
    if (risk >= 0.7) return 'bg-orange-100';
    if (risk >= 0.5) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  const getSophisticationColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-red-500';
      case 'advanced': return 'bg-orange-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'basic': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'deepfake': return <Eye className="h-4 w-4" />;
      case 'ai_voice': return <Mic className="h-4 w-4" />;
      case 'synthetic_identity': return <Users className="h-4 w-4" />;
      case 'blockchain_scam': return <Wallet className="h-4 w-4" />;
      case 'ai_phishing': return <Globe className="h-4 w-4" />;
      case 'social_engineering_2.0': return <Brain className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-3 w-3 text-red-500" />;
      case 'decreasing': return <TrendingUp className="h-3 w-3 text-green-500 rotate-180" />;
      default: return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Threat Detection 2026</h2>
          <p className="text-muted-foreground">
            State-of-the-art AI security for sophisticated scammer detection
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={realTimeMonitoring ? "default" : "outline"}>
            {realTimeMonitoring ? "Monitoring Active" : "Monitoring Inactive"}
          </Badge>
          <Button
            variant={realTimeMonitoring ? "destructive" : "default"}
            size="sm"
            onClick={() => setRealTimeMonitoring(!realTimeMonitoring)}
          >
            <Activity className="h-4 w-4 mr-2" />
            {realTimeMonitoring ? "Stop" : "Start"} Real-time
          </Button>
        </div>
      </div>

      {/* Monitoring Statistics */}
      {monitoringStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Targets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monitoringStats.activeTargets}</div>
              <p className="text-xs text-muted-foreground">
                of {monitoringStats.totalTargets} total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monitoringStats.totalAlerts}</div>
              <p className="text-xs text-muted-foreground">
                {monitoringStats.criticalAlerts} critical
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">High Risk Targets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{monitoringStats.highRiskTargets}</div>
              <p className="text-xs text-muted-foreground">
                require immediate attention
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Threat Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {monitoringStats.threatTrends.slice(0, 3).map((trend, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="truncate">{trend.type}</span>
                    <div className="flex items-center space-x-1">
                      <span>{trend.count}</span>
                      {getTrendIcon(trend.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="detect">Advanced Detection</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
          <TabsTrigger value="analysis">Threat Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="detect" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Vector Threat Detection</CardTitle>
              <CardDescription>
                Analyze content, media, audio, wallet addresses, and social profiles for sophisticated threats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Content Analysis</label>
                  <textarea
                    className="w-full mt-1 p-2 border rounded-md"
                    rows={3}
                    placeholder="Enter text content for AI phishing and social engineering detection..."
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium">Media URL (Deepfake Detection)</label>
                    <input
                      type="text"
                      className="w-full mt-1 p-2 border rounded-md"
                      placeholder="https://example.com/video.mp4"
                      value={inputMedia}
                      onChange={(e) => setInputMedia(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Audio URL (AI Voice Detection)</label>
                    <input
                      type="text"
                      className="w-full mt-1 p-2 border rounded-md"
                      placeholder="https://example.com/audio.mp3"
                      value={inputAudio}
                      onChange={(e) => setInputAudio(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Wallet Address (Blockchain Scam Detection)</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                  value={inputWallet}
                  onChange={(e) => setInputWallet(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleAdvancedDetection} 
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing with Advanced AI...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Run Advanced Detection
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Threat Analysis Results</span>
                </CardTitle>
                <CardDescription>
                  Overall Risk: <span className={`font-bold ${getSeverityColor(analysis.overallRisk)}`}>
                    {Math.round(analysis.overallRisk * 100)}%
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overall Risk Level</span>
                    <span className={`text-sm font-bold ${getSeverityColor(analysis.overallRisk)}`}>
                      {analysis.overallRisk >= 0.9 ? 'CRITICAL' :
                       analysis.overallRisk >= 0.7 ? 'HIGH' :
                       analysis.overallRisk >= 0.5 ? 'MEDIUM' : 'LOW'}
                    </span>
                  </div>
                  <Progress value={analysis.overallRisk * 100} className="h-2" />
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Detected Threat Vectors</h4>
                  <div className="space-y-3">
                    {analysis.threatVectors.map((vector, index) => (
                      <div key={index} className={`p-3 rounded-lg ${getSeverityBg(vector.confidence)}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getThreatIcon(vector.type)}
                            <span className="font-medium">{vector.type.replace('_', ' ').toUpperCase()}</span>
                            <Badge className={getSophisticationColor(vector.sophistication)}>
                              {vector.sophistication}
                            </Badge>
                          </div>
                          <span className={`text-sm font-bold ${getSeverityColor(vector.confidence)}`}>
                            {Math.round(vector.confidence * 100)}%
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">Indicators:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {vector.indicators.map((indicator, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {indicator}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">Mitigation:</span>
                            <ul className="text-xs mt-1 space-y-1">
                              {vector.mitigation.map((mitigation, i) => (
                                <li key={i} className="flex items-start space-x-1">
                                  <CheckCircle className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                                  <span>{mitigation}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {analysis.recommendations.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Recommendations</h4>
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <ul className="space-y-1">
                            {analysis.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-red-600">â</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Threat Monitoring</CardTitle>
              <CardDescription>
                Continuous monitoring for sophisticated scammer activities across multiple vectors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Real-time Monitoring Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Monitor wallet addresses, social profiles, and threat patterns in real-time
                </p>
                <Button onClick={() => window.open('/monitoring', '_blank')}>
                  Open Monitoring Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Threat Intelligence Analysis</CardTitle>
              <CardDescription>
                Comprehensive analysis of emerging threat patterns and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Advanced Threat Intelligence</h3>
                <p className="text-muted-foreground mb-4">
                  AI-powered analysis of sophisticated attack patterns and threat actor behavior
                </p>
                <Button onClick={() => window.open('/intelligence', '_blank')}>
                  Open Intelligence Center
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
