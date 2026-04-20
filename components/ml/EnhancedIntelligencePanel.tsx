/**
 * Enhanced Intelligence Panel 2026
 * Advanced threat intelligence and prediction interface
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
  TrendingUp, 
  Users, 
  Shield, 
  AlertTriangle, 
  Eye, 
  Activity,
  Target,
  Globe,
  Zap,
  Clock,
  BarChart3,
  Radar,
  Database,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';

interface ThreatPrediction {
  id: string;
  threatType: string;
  probability: number;
  timeframe: string;
  confidence: number;
  indicators: string[];
  preventiveMeasures: string[];
  impact: string;
}

interface ThreatActor {
  id: string;
  alias: string[];
  sophistication: string;
  preferredMethods: string[];
  patterns: {
    attackFrequency: number;
    successRate: number;
    evolution: string;
  };
  attribution: {
    confidence: number;
    geoLocation: string[];
  };
}

interface ThreatTrend {
  id: string;
  name: string;
  category: string;
  riskScore: number;
  affectedPlatforms: string[];
  predictions: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
  };
}

interface IntelligenceOverview {
  intelligenceStatus: string;
  totalPredictions: number;
  activeActors: number;
  emergingTrends: number;
  zeroDayThreats: number;
  overallRiskLevel: string;
  intelligenceSources: Array<{
    name: string;
    enabled: boolean;
    lastUpdate: string;
  }>;
}

export default function EnhancedIntelligencePanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [intelligenceOverview, setIntelligenceOverview] = useState<IntelligenceOverview | null>(null);
  const [predictions, setPredictions] = useState<ThreatPrediction[]>([]);
  const [actors, setActors] = useState<ThreatActor[]>([]);
  const [trends, setTrends] = useState<ThreatTrend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('30d');
  const [selectedThreatType, setSelectedThreatType] = useState('all');

  useEffect(() => {
    fetchIntelligenceOverview();
    const interval = setInterval(fetchIntelligenceOverview, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchIntelligenceOverview = async () => {
    try {
      const response = await fetch('/api/ml/intelligence/enhanced?view=overview');
      const data = await response.json();
      if (data.success) {
        setIntelligenceOverview(data.data.overview);
      }
    } catch (error) {
      console.error('Error fetching intelligence overview:', error);
    }
  };

  const fetchPredictions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ml/intelligence/enhanced?view=predictions');
      const data = await response.json();
      if (data.success) {
        setPredictions(data.data.predictions);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ml/intelligence/enhanced?view=actors');
      const data = await response.json();
      if (data.success) {
        setActors(data.data.actors);
      }
    } catch (error) {
      console.error('Error fetching actors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrends = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/ml/intelligence/enhanced?view=trends&timeframe=${timeframe}`);
      const data = await response.json();
      if (data.success) {
        setTrends(data.data.trends);
      }
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateThreatReport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ml/intelligence/enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate_report',
          timeframe,
          includePredictions: true,
          includeActors: true,
          includeTrends: true,
          includeZeroDay: true
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Download the report
        const blob = new Blob([JSON.stringify(data.data.report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `threat-intelligence-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-600 bg-red-100';
      case 'HIGH': return 'text-orange-600 bg-orange-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSophisticationColor = (level: string) => {
    switch (level) {
      case 'organized_crime': return 'bg-red-500';
      case 'state_sponsored': return 'bg-purple-500';
      case 'professional': return 'bg-orange-500';
      case 'opportunist': return 'bg-yellow-500';
      case 'script_kiddie': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendCategoryColor = (category: string) => {
    switch (category) {
      case 'emerging': return 'text-red-600';
      case 'trending': return 'text-orange-600';
      case 'declining': return 'text-green-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Threat Intelligence 2026</h2>
          <p className="text-muted-foreground">
            Advanced AI-powered threat prediction and prevention system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={intelligenceOverview?.intelligenceStatus === 'active' ? "default" : "outline"}>
            {intelligenceOverview?.intelligenceStatus === 'active' ? "Intelligence Active" : "Intelligence Inactive"}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={generateThreatReport}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Intelligence Overview */}
      {intelligenceOverview && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold p-2 rounded ${getRiskLevelColor(intelligenceOverview.overallRiskLevel)}`}>
                {intelligenceOverview.overallRiskLevel}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{intelligenceOverview.totalPredictions}</div>
              <p className="text-xs text-muted-foreground">
                threat predictions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Threat Actors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{intelligenceOverview.activeActors}</div>
              <p className="text-xs text-muted-foreground">
                tracked actors
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Emerging Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{intelligenceOverview.emergingTrends}</div>
              <p className="text-xs text-muted-foreground">
                new trends
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Zero-Day Threats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{intelligenceOverview.zeroDayThreats}</div>
              <p className="text-xs text-muted-foreground">
                critical vulnerabilities
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="actors">Threat Actors</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Intelligence Sources</CardTitle>
              <CardDescription>
                Real-time threat intelligence gathering from multiple sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {intelligenceOverview?.intelligenceSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4" />
                      <span className="font-medium">{source.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={source.enabled ? "default" : "outline"}>
                        {source.enabled ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(source.lastUpdate).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Threat Predictions</CardTitle>
              <CardDescription>
                AI-powered threat prediction and probability analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button onClick={fetchPredictions} disabled={isLoading} size="sm">
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Timeframe:</label>
                  <select 
                    value={timeframe} 
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="7d">7 Days</option>
                    <option value="30d">30 Days</option>
                    <option value="90d">90 Days</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {predictions.slice(0, 10).map((prediction, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4" />
                        <span className="font-medium">{prediction.threatType.replace('_', ' ').toUpperCase()}</span>
                        <Badge className={getRiskLevelColor(prediction.impact)}>
                          {prediction.impact}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{Math.round(prediction.probability * 100)}%</div>
                        <div className="text-xs text-muted-foreground">probability</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Timeframe:</span>
                        <div>{prediction.timeframe}</div>
                      </div>
                      <div>
                        <span className="font-medium">Confidence:</span>
                        <div>{Math.round(prediction.confidence * 100)}%</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-sm font-medium">Indicators:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {prediction.indicators.slice(0, 3).map((indicator, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {indicator}
                          </Badge>
                        ))}
                        {prediction.indicators.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{prediction.indicators.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Threat Actors</CardTitle>
              <CardDescription>
                Advanced profiling and analysis of sophisticated threat actors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={fetchActors} disabled={isLoading} className="mb-4">
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Actors
              </Button>

              <div className="space-y-4">
                {actors.slice(0, 5).map((actor, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">{actor.alias[0] || 'Unknown Actor'}</span>
                        <Badge className={getSophisticationColor(actor.sophistication)}>
                          {actor.sophistication.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{Math.round(actor.attribution.confidence * 100)}%</div>
                        <div className="text-xs text-muted-foreground">confidence</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Attack Frequency:</span>
                        <div>{actor.patterns.attackFrequency} / month</div>
                      </div>
                      <div>
                        <span className="font-medium">Success Rate:</span>
                        <div>{Math.round(actor.patterns.successRate * 100)}%</div>
                      </div>
                      <div>
                        <span className="font-medium">Evolution:</span>
                        <div>{actor.patterns.evolution}</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-sm font-medium">Methods:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {actor.preferredMethods.slice(0, 4).map((method, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {method}
                          </Badge>
                        ))}
                        {actor.preferredMethods.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{actor.preferredMethods.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Threat Trends</CardTitle>
              <CardDescription>
                Emerging and evolving threat patterns analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <Button onClick={fetchTrends} disabled={isLoading} size="sm">
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh Trends
                </Button>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Analysis Period:</label>
                  <select 
                    value={timeframe} 
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {trends.slice(0, 8).map((trend, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-medium">{trend.name}</span>
                        <Badge className={getTrendCategoryColor(trend.category)}>
                          {trend.category.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{Math.round(trend.riskScore * 100)}%</div>
                        <div className="text-xs text-muted-foreground">risk score</div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="mb-2">
                        <span className="font-medium">Affected Platforms:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {trend.affectedPlatforms.map((platform, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Predictions:</span>
                        <ul className="mt-1 space-y-1">
                          <li><strong>Short-term:</strong> {trend.predictions.shortTerm}</li>
                          <li><strong>Medium-term:</strong> {trend.predictions.mediumTerm}</li>
                          <li><strong>Long-term:</strong> {trend.predictions.longTerm}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
