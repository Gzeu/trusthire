'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  User,
  MessageSquare,
  FileText,
  Activity
} from 'lucide-react';

interface AIAnalysisProps {
  data?: any;
  onAnalysis?: (type: string, data: any) => void;
}

export default function AIAnalysisPanel({ data, onAnalysis }: AIAnalysisProps) {
  const [activeTab, setActiveTab] = useState('communication');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>({});

  const handleAnalysis = async (type: string, analysisData: any) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data: analysisData }),
      });

      const result = await response.json();
      if (result.success) {
        setResults((prev: any) => ({ ...prev, [type]: result.data }));
        onAnalysis?.(type, result.data);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
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

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI-Powered Intelligence Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="communication" className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                Communication
              </TabsTrigger>
              <TabsTrigger value="threat" className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Threat Prediction
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-1">
                <User className="w-4 h-4" />
                Profile Analysis
              </TabsTrigger>
              <TabsTrigger value="behavioral" className="flex items-center gap-1">
                <Activity className="w-4 h-4" />
                Behavioral
              </TabsTrigger>
              <TabsTrigger value="intelligence" className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Intelligence
              </TabsTrigger>
            </TabsList>

            {/* Communication Analysis */}
            <TabsContent value="communication" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Recruiter Message
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-md"
                    rows={4}
                    placeholder="Paste the recruiter message here for AI analysis..."
                    onChange={(e) => data = { ...data, message: e.target.value }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Platform
                    </label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="linkedin">LinkedIn</option>
                      <option value="email">Email</option>
                      <option value="telegram">Telegram</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Sender Profile
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="Profile URL or description"
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => handleAnalysis('communication', data)}
                  disabled={isAnalyzing || !data?.message}
                  className="w-full"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Communication'}
                </Button>

                {results.communication && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">Legitimacy Score</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getSeverityColor(
                                results.communication.legitimacyScore > 70 ? 'low' :
                                results.communication.legitimacyScore > 40 ? 'medium' : 'high'
                              )}`}
                              style={{ width: `${results.communication.legitimacyScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {results.communication.legitimacyScore}%
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">Risk Level</h4>
                        <div className="flex items-center gap-2">
                          {getRiskIcon(results.communication.riskLevel)}
                          <span className="capitalize">{results.communication.riskLevel}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Red Flags</h4>
                      <div className="space-y-1">
                        {results.communication.redFlags?.map((flag: string, index: number) => (
                          <Badge key={index} variant="destructive" className="mr-2">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Recommendations</h4>
                      <ul className="text-sm space-y-1">
                        {results.communication.recommendations?.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Threat Prediction */}
            <TabsContent value="threat" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Repository URL
                  </label>
                  <input
                    type="url"
                    className="w-full p-2 border rounded-md"
                    placeholder="https://github.com/user/repo"
                    onChange={(e) => data = { ...data, repositoryUrl: e.target.value }}
                  />
                </div>

                <Button 
                  onClick={() => handleAnalysis('threat', data)}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? 'Predicting Threats...' : 'Predict Threats'}
                </Button>

                {results.threat && (
                  <div className="space-y-4">
                    {results.threat.map((threat: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium capitalize">{threat.threatType}</h4>
                            <Badge className={getSeverityColor(threat.impact)}>
                              {threat.probability}% confidence
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium">Timeline: </span>
                              <span className="capitalize">{threat.timeline}</span>
                            </div>
                            
                            <div>
                              <span className="text-sm font-medium">Impact: </span>
                              <span className="capitalize">{threat.impact}</span>
                            </div>

                            <div>
                              <h5 className="text-sm font-medium mb-1">Risk Factors:</h5>
                              <div className="flex flex-wrap gap-1">
                                {threat.riskFactors?.map((factor: string, i: number) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {factor}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h5 className="text-sm font-medium mb-1">Mitigation:</h5>
                              <ul className="text-sm space-y-1">
                                {threat.mitigation?.map((mit: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <Shield className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                    {mit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Profile Analysis */}
            <TabsContent value="profile" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Profile URL or Data
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-md"
                    rows={3}
                    placeholder="Profile URL or profile information..."
                    onChange={(e) => data = { ...data, profileData: { url: e.target.value } }}
                  />
                </div>

                <Button 
                  onClick={() => handleAnalysis('profile', data)}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? 'Analyzing Profile...' : 'Analyze Profile'}
                </Button>

                {results.profile && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">Authenticity Score</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getSeverityColor(
                                results.profile.authenticityScore > 70 ? 'low' :
                                results.profile.authenticityScore > 40 ? 'medium' : 'high'
                              )}`}
                              style={{ width: `${results.profile.authenticityScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {results.profile.authenticityScore}%
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">Verification Status</h4>
                        <div className="flex items-center gap-2">
                          {getRiskIcon(
                            results.profile.verificationStatus === 'verified' ? 'low' :
                            results.profile.verificationStatus === 'suspicious' ? 'high' :
                            results.profile.verificationStatus === 'fake' ? 'critical' : 'medium'
                          )}
                          <span className="capitalize">{results.profile.verificationStatus}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Red Flags</h4>
                      <div className="space-y-1">
                        {results.profile.redFlags?.map((flag: string, index: number) => (
                          <Badge key={index} variant="destructive" className="mr-2">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Behavioral Analysis */}
            <TabsContent value="behavioral" className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Behavioral analysis monitors code execution patterns to detect suspicious activity.
                  This would run during actual code execution in a secure environment.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <Button 
                  onClick={() => handleAnalysis('behavioral', {
                    simulatedData: {
                      networkRequests: [
                        { url: 'https://api.example.com/data', method: 'GET' },
                        { url: 'https://suspicious.com/steal', method: 'POST' }
                      ],
                      fileOperations: [
                        { action: 'read', path: '/etc/passwd' },
                        { action: 'write', path: '/tmp/malware.exe' }
                      ],
                      processCreations: [
                        { command: 'powershell', args: ['-exec', 'malware.ps1'] }
                      ]
                    }
                  })}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? 'Analyzing Behavior...' : 'Simulate Behavioral Analysis'}
                </Button>

                {results.behavioral && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <h4 className="font-medium">Duration</h4>
                        <p className="text-2xl font-bold">
                          {(results.behavioral.duration / 1000).toFixed(2)}s
                        </p>
                      </div>
                      <div className="text-center">
                        <h4 className="font-medium">Anomalies</h4>
                        <p className="text-2xl font-bold text-red-500">
                          {results.behavioral.anomalies.length}
                        </p>
                      </div>
                      <div className="text-center">
                        <h4 className="font-medium">Total Events</h4>
                        <p className="text-2xl font-bold">
                          {results.behavioral.networkRequests.length + 
                           results.behavioral.fileOperations.length + 
                           results.behavioral.processCreations.length}
                        </p>
                      </div>
                    </div>

                    {results.behavioral.anomalies.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Detected Anomalies</h4>
                        <div className="space-y-2">
                          {results.behavioral.anomalies.map((anomaly: any, index: number) => (
                            <Alert key={index} variant="destructive">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>{anomaly.anomalyType}</strong> - {anomaly.description}
                                <div className="mt-2">
                                  <strong>Confidence:</strong> {anomaly.confidence}%
                                </div>
                              </AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Threat Intelligence */}
            <TabsContent value="intelligence" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Code Content
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-md"
                    rows={4}
                    placeholder="Paste code to analyze against threat intelligence..."
                    onChange={(e) => data = { ...data, code: e.target.value }}
                  />
                </div>

                <Button 
                  onClick={() => handleAnalysis('threat_intelligence', data)}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? 'Analyzing Threats...' : 'Analyze with Threat Intelligence'}
                </Button>

                {results.threat_intelligence && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">Overall Risk</h4>
                        <div className="flex items-center gap-2">
                          {getRiskIcon(results.threat_intelligence.overallRisk)}
                          <span className="capitalize">{results.threat_intelligence.overallRisk}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">Risk Score</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getSeverityColor(
                                results.threat_intelligence.overallRisk
                              )}`}
                              style={{ width: `${results.threat_intelligence.riskScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {results.threat_intelligence.riskScore}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Threats Detected ({results.threat_intelligence.threatsDetected})</h4>
                      <div className="space-y-2">
                        {results.threat_intelligence.matches.map((match: any, index: number) => (
                          <Card key={index}>
                            <CardContent className="pt-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">{match.matchType}</span>
                                <Badge variant="outline">
                                  {match.confidence}% confidence
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{match.details}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
