'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Target
} from 'lucide-react';

interface LangChainPanelProps {
  sessionId?: string;
}

export default function LangChainPanel({ sessionId = 'default' }: LangChainPanelProps) {
  const [activeTab, setActiveTab] = useState('agent');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>({});
  const [tools, setTools] = useState<any[]>([]);
  const [chains, setChains] = useState<any[]>([]);

  const handleAgentAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/langchain/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'agent_assessment',
          data: {
            request: "Analyze this recruitment message for security threats: 'Exciting opportunity! Apply now with your resume and GitHub link. Immediate hire available!'",
            context: { sessionId }
          }
        }),
      });

      const result = await response.json();
      if (result.success) {
        setResults((prev: any) => ({ ...prev, agent: result.data }));
      }
    } catch (error) {
      console.error('Agent analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChainAnalysis = async (chainId: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/langchain/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chain_analysis',
          data: {
            chainId,
            inputs: {
              message: "Great opportunity for senior developer position!",
              context: { platform: 'linkedin' }
            }
          }
        }),
      });

      const result = await response.json();
      if (result.success) {
        setResults((prev: any) => ({ ...prev, [chainId]: result.data }));
      }
    } catch (error) {
      console.error('Chain analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRAGAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/langchain/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'rag_analysis',
          data: {
            question: "What are the common signs of recruitment scams?"
          }
        }),
      });

      const result = await response.json();
      if (result.success) {
        setResults((prev: any) => ({ ...prev, rag: result.data }));
      }
    } catch (error) {
      console.error('RAG analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadTools = async () => {
    try {
      const response = await fetch('/api/langchain/analyze?type=tools');
      const result = await response.json();
      if (result.success) {
        setTools(result.data);
      }
    } catch (error) {
      console.error('Failed to load tools:', error);
    }
  };

  const loadChains = async () => {
    try {
      const response = await fetch('/api/langchain/analyze?type=chains');
      const result = await response.json();
      if (result.success) {
        setChains(result.data);
      }
    } catch (error) {
      console.error('Failed to load chains:', error);
    }
  };

  React.useEffect(() => {
    loadTools();
    loadChains();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            LangChain Integration - Advanced AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="agent" className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                AI Agent
              </TabsTrigger>
              <TabsTrigger value="chains" className="flex items-center gap-1">
                <Settings className="w-4 h-4" />
                Chains
              </TabsTrigger>
              <TabsTrigger value="rag" className="flex items-center gap-1">
                <Search className="w-4 h-4" />
                RAG
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                Tools
              </TabsTrigger>
              <TabsTrigger value="benchmark" className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                Benchmark
              </TabsTrigger>
            </TabsList>

            {/* AI Agent Tab */}
            <TabsContent value="agent" className="space-y-4">
              <Card>
                <CardContent className="pt-4">
                  <h4 className="font-medium mb-4">Security Analysis Agent</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Advanced AI agent with multiple tools for comprehensive security analysis
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Security Assessment Request
                      </label>
                      <textarea
                        className="w-full p-3 border rounded-md"
                        rows={3}
                        placeholder="Enter security assessment request..."
                        defaultValue="Analyze this recruitment message for security threats: 'Exciting opportunity! Apply now with your resume and GitHub link. Immediate hire available!'"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleAgentAnalysis}
                      disabled={isAnalyzing}
                      className="w-full"
                    >
                      {isAnalyzing ? (
                        <>
                          <Play className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing with AI Agent...
                        </>
                      ) : (
                        <>
                          <Target className="w-4 h-4 mr-2" />
                          Run Security Agent
                        </>
                      )}
                    </Button>

                    {results.agent && (
                      <div className="mt-4 p-4 border rounded-lg">
                        <h5 className="font-medium mb-2">Agent Analysis Results</h5>
                        <div className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded">
                          {typeof results.agent === 'string' ? results.agent : JSON.stringify(results.agent, null, 2)}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <h5 className="font-medium mb-3">Agent Capabilities</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Sandbox Analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Threat Lookup</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Communication Analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">Profile Verification</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Chains Tab */}
            <TabsContent value="chains" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {chains.map((chain) => (
                  <Card key={chain.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          <span className="font-medium">{chain.name}</span>
                        </div>
                        <Badge variant="outline">{chain.id}</Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{chain.description}</p>
                      
                      <Button 
                        onClick={() => handleChainAnalysis(chain.id)}
                        disabled={isAnalyzing}
                        className="w-full"
                        size="sm"
                      >
                        {isAnalyzing ? (
                          <>
                            <Play className="w-3 h-3 mr-1 animate-spin" />
                            Running Chain...
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 mr-1" />
                            Run Chain
                          </>
                        )}
                      </Button>

                      {results[chain.id] && (
                        <div className="mt-3 p-3 border rounded text-sm bg-gray-50">
                          {typeof results[chain.id] === 'string' ? 
                            results[chain.id].substring(0, 200) + '...' : 
                            JSON.stringify(results[chain.id], null, 2).substring(0, 200) + '...'
                          }
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* RAG Tab */}
            <TabsContent value="rag" className="space-y-4">
              <Card>
                <CardContent className="pt-4">
                  <h4 className="font-medium mb-4">Retrieval-Augmented Generation</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    AI analysis enhanced with document retrieval and contextual knowledge
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Question for RAG Analysis
                      </label>
                      <textarea
                        className="w-full p-3 border rounded-md"
                        rows={2}
                        placeholder="Ask a security-related question..."
                        defaultValue="What are the common signs of recruitment scams?"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleRAGAnalysis}
                      disabled={isAnalyzing}
                      className="w-full"
                    >
                      {isAnalyzing ? (
                        <>
                          <Search className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing with RAG...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Run RAG Analysis
                        </>
                      )}
                    </Button>

                    {results.rag && (
                      <div className="mt-4 p-4 border rounded-lg">
                        <h5 className="font-medium mb-2">RAG Analysis Results</h5>
                        <div className="text-sm bg-gray-50 p-3 rounded">
                          {results.rag}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <h5 className="font-medium mb-3">RAG Capabilities</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Document Retrieval</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Context-Aware Responses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Knowledge Integration</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="space-y-4">
              <Card>
                <CardContent className="pt-4">
                  <h4 className="font-medium mb-4">Available AI Tools</h4>
                  <div className="space-y-3">
                    {tools.map((tool) => (
                      <div key={tool.name} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">{tool.name}</span>
                          </div>
                          <Badge variant="outline">Tool</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{tool.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Benchmark Tab */}
            <TabsContent value="benchmark" className="space-y-4">
              <Card>
                <CardContent className="pt-4">
                  <h4 className="font-medium mb-4">Performance Benchmark</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Test chain performance and compare execution times
                  </p>
                  
                  <div className="space-y-4">
                    {chains.map((chain) => (
                      <div key={chain.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{chain.name}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              fetch(`/api/langchain/analyze?type=benchmark&chainId=${chain.id}&iterations=5&inputs=${encodeURIComponent('{"message":"test","context":{}}')}`)
                                .then(res => res.json())
                                .then(data => {
                                  setResults((prev: any) => ({ ...prev, [`benchmark_${chain.id}`]: data.data }));
                                });
                            }}
                          >
                            <BarChart3 className="w-3 h-3 mr-1" />
                            Benchmark
                          </Button>
                        </div>
                        
                        {results[`benchmark_${chain.id}`] && (
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>Average Time:</span>
                              <span>{results[`benchmark_${chain.id}`].averageTime?.toFixed(2)}ms</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Min Time:</span>
                              <span>{results[`benchmark_${chain.id}`].minTime}ms</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Max Time:</span>
                              <span>{results[`benchmark_${chain.id}`].maxTime}ms</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
