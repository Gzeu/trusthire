'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Brain, 
  Settings, 
  Database, 
  Play, 
  MessageSquare, 
  Shield, 
  Search,
  Zap,
  BarChart3,
  Clock,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { Card, Button, Badge, Container, Section, Skeleton } from '@/components/ui/DesignSystem';

interface AnalysisResult {
  id: string;
  type: 'threat_pattern' | 'code_analysis' | 'social_engineering' | 'malicious_intent';
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  evidence: string[];
  recommendations: string[];
  metadata: {
    modelUsed: string;
    processingTime: number;
    tokensConsumed: number;
  };
}

interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'groq' | 'claude' | 'local';
  model: string;
  capabilities: string[];
  maxTokens: number;
  costPerToken: number;
}

const aiModels: AIModel[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    model: 'gpt-4-turbo',
    capabilities: ['text-analysis', 'pattern-recognition', 'threat-detection', 'code-review'],
    maxTokens: 4096,
    costPerToken: 0.00001
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'claude',
    model: 'claude-3-sonnet-20240229',
    capabilities: ['security-analysis', 'threat-intelligence', 'code-audit', 'vulnerability-detection'],
    maxTokens: 4096,
    costPerToken: 0.000015
  },
  {
    id: 'groq-mixtral',
    name: 'Groq Mixtral',
    provider: 'groq',
    model: 'mixtral-8x7b',
    capabilities: ['fast-analysis', 'pattern-matching', 'threat-scoring', 'real-time-detection'],
    maxTokens: 8192,
    costPerToken: 0.00000025
  }
];

const analysisTypes = [
  {
    id: 'threat_pattern',
    name: 'Threat Pattern Detection',
    description: 'Identify known scam patterns and attack vectors',
    icon: <AlertTriangle className="w-5 h-5" />
  },
  {
    id: 'code_analysis',
    name: 'Code Security Analysis',
    description: 'Deep static analysis for malicious patterns',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: 'social_engineering',
    name: 'Social Engineering Detection',
    description: 'Analyze psychological manipulation tactics',
    icon: <Brain className="w-5 h-5" />
  },
  {
    id: 'malicious_intent',
    name: 'Malicious Intent Analysis',
    description: 'Detect harmful intentions in messages',
    icon: <Target className="w-5 h-5" />
  }
];

export default function AdvancedAnalysisPanel() {
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4-turbo');
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>('threat_pattern');
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);

  const runAnalysis = useCallback(async () => {
    if (!input.trim()) return;
    
    setIsAnalyzing(true);
    setResults([]);
    
    try {
      const response = await fetch('/api/ai/advanced-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          analysisType: selectedAnalysis,
          input: input,
          sessionId: `session-${Date.now()}`
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setResults(result.data.results);
        setAnalysisHistory(prev => [result.data, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedModel, selectedAnalysis, input]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/25';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/25';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/25';
      case 'low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/25';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-emerald-400';
    if (confidence >= 70) return 'text-yellow-400';
    if (confidence >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Container size="lg" className="py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-purple-500" />
            <Badge variant="info" className="animate-pulse">
              ADVANCED AI ANALYSIS
            </Badge>
          </div>
          <h1 className="text-4xl font-mono font-bold text-white mb-4">
            AI-Powered Security Analysis
          </h1>
          <p className="text-lg font-mono text-white/60 max-w-3xl">
            Advanced threat detection using multiple AI models for comprehensive security assessment.
            Choose your analysis model and type for optimal results.
          </p>
        </div>

        {/* Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Model Selection */}
          <Card className="p-6">
            <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              AI Model Selection
            </h3>
            <div className="space-y-3">
              {aiModels.map((model) => (
                <div
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedModel === model.id
                      ? 'border-purple-500/50 bg-purple-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-mono font-semibold text-white">{model.name}</h4>
                        <p className="text-xs font-mono text-white/60">{model.provider}</p>
                      </div>
                    </div>
                    <Badge variant="default" className="text-xs">
                      {model.maxTokens.toLocaleString()} tokens
                    </Badge>
                  </div>
                  <div className="text-sm font-mono text-white/70">
                    {model.capabilities.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Analysis Type Selection */}
          <Card className="p-6">
            <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Analysis Type
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {analysisTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setSelectedAnalysis(type.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedAnalysis === type.id
                      ? 'border-blue-500/50 bg-blue-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {type.icon}
                    <div>
                      <h4 className="font-mono font-semibold text-white">{type.name}</h4>
                      <p className="text-xs font-mono text-white/60">{type.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Input Section */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Analysis Input
          </h3>
          <div className="space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter recruitment message, code, or content to analyze..."
              className="w-full h-32 p-4 bg-[#111113] border border-white/10 rounded-xl text-white font-mono text-sm placeholder-white/40 focus:outline-none focus:border-purple-500/50 resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="text-sm font-mono text-white/40">
                {input.length} characters
              </div>
              <Button
                onClick={runAnalysis}
                disabled={isAnalyzing || !input.trim()}
                loading={isAnalyzing}
                className="flex-1"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <Card className="p-6" glow="purple">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Analysis Results
              </h2>
              <div className="flex items-center gap-3">
                <Badge variant="info">
                  {results.length} threats detected
                </Badge>
                <Badge variant="default">
                  {aiModels.find(m => m.id === selectedModel)?.name || 'AI Model'}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={result.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge className={getSeverityColor(result.severity)}>
                        {result.severity.toUpperCase()}
                      </Badge>
                      <div className="text-sm">
                        <span className="font-mono font-semibold text-white">{result.confidence}%</span>
                        <span className="text-white/60 ml-2">confidence</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-mono font-semibold text-white">{result.title}</h3>
                  </div>
                  <p className="text-sm font-mono text-white/80 mb-3 leading-relaxed">
                    {result.description}
                  </p>
                  
                  {/* Evidence */}
                  {result.evidence.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-mono font-semibold text-red-400 mb-2">Evidence:</h4>
                      <div className="space-y-1">
                        {result.evidence.map((evidence, i) => (
                          <div key={i} className="p-2 rounded-lg bg-red-500/10 border border-red-500/25">
                            <p className="text-xs font-mono text-red-300">{evidence}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {result.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-mono font-semibold text-emerald-400 mb-2">Recommendations:</h4>
                      <div className="space-y-1">
                        {result.recommendations.map((rec, i) => (
                          <div key={i} className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
                            <p className="text-xs font-mono text-emerald-300">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs font-mono text-white/40 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-4">
                      <span>Model: {result.metadata.modelUsed}</span>
                      <span>•</span>
                      <span>Time: {result.metadata.processingTime}s</span>
                      <span>•</span>
                      <span>Tokens: {result.metadata.tokensConsumed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Analysis History */}
        {analysisHistory.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-mono font-semibold text-white flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Analysis History
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setAnalysisHistory([])}>
                <RefreshCw className="w-3 h-3 mr-1" />
                Clear History
              </Button>
            </div>
            <div className="space-y-2">
              {analysisHistory.slice(0, 5).map((analysis, index) => (
                <div key={analysis.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex-1">
                    <p className="text-sm font-mono text-white/80">
                      {analysis.results[0]?.title || 'AI Analysis'} - {analysis.results.length} threats
                    </p>
                    <p className="text-xs font-mono text-white/40">
                      {new Date(analysis.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {aiModels.find(m => m.id === analysis.model)?.name || 'AI'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </Container>
    </div>
  );
}
