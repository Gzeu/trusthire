'use client';

import { useState } from 'react';
import { Shield, Code, Link, Play, AlertTriangle, CheckCircle, Activity, PlusCircle } from 'lucide-react';

interface SandboxResult {
  success: boolean;
  type: string;
  result: any;
  timestamp: string;
}

export default function SandboxPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SandboxResult | null>(null);
  const [repoUrl, setRepoUrl] = useState('');
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');

  const analyzeRepository = async () => {
    if (!repoUrl) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/sandbox/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'repository', data: { repoUrl } })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeUrl = async () => {
    if (!url) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/sandbox/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'url', data: { url } })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeCode = async () => {
    if (!code) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/sandbox/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'code', data: { code, language: 'node' } })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeEmail = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/sandbox/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'email', data: { email } })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Header */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-red-500" />
              <span className="text-white font-mono text-sm">TrustHire Sandbox</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/"
                className="px-3 py-1.5 bg-white/5 border border-white/10 text-white font-mono text-xs rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Shield className="w-3 h-3" />
                Home
              </a>
              <a
                href="/monitoring"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs rounded-lg transition-colors flex items-center gap-2"
              >
                <Activity className="w-3 h-3" />
                Monitoring
              </a>
              <a
                href="/assess"
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-mono text-xs rounded-lg transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-3 h-3" />
                Assessment
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Vercel Sandbox Security Analysis
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Execute untrusted code and analyze repositories in isolated, secure environments
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <Code className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Secure Code Execution</h3>
            <p className="text-gray-400 text-sm">Run untrusted code in isolated Linux environments</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <Link className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Repository Analysis</h3>
            <p className="text-gray-400 text-sm">Scan GitHub repos for malicious patterns safely</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <Shield className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Zero Risk</h3>
            <p className="text-gray-400 text-sm">No exposure of environment variables or databases</p>
          </div>
        </div>

        {/* Analysis Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Repository Analysis */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-green-400" />
              Repository Analysis
            </h3>
            <input
              type="text"
              placeholder="GitHub repository URL"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 mb-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
            />
            <button
              onClick={analyzeRepository}
              disabled={loading || !repoUrl}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4" />
              Analyze Repository
            </button>
          </div>

          {/* URL Analysis */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Link className="w-5 h-5 text-blue-400" />
              URL Analysis
            </h3>
            <input
              type="text"
              placeholder="URL to analyze"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 mb-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
            <button
              onClick={analyzeUrl}
              disabled={loading || !url}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4" />
              Analyze URL
            </button>
          </div>

          {/* Code Execution */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              Code Execution
            </h3>
            <textarea
              placeholder="JavaScript code to execute"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 mb-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 h-24 resize-none"
            />
            <button
              onClick={executeCode}
              disabled={loading || !code}
              className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4" />
              Execute Code
            </button>
          </div>

          {/* Email Analysis */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-400" />
              Email Analysis
            </h3>
            <input
              type="email"
              placeholder="Recruiter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 mb-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
            />
            <button
              onClick={analyzeEmail}
              disabled={loading || !email}
              className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4" />
              Analyze Email
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                )}
                Analysis Results
              </h3>
              <span className="text-sm text-gray-400">{result.timestamp}</span>
            </div>
            
            <div className="bg-black/30 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-300 font-mono">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-6 mt-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">About Vercel Sandboxes</h3>
              <p className="text-gray-300 leading-relaxed">
                Vercel Sandboxes provide isolated Linux environments for executing untrusted code safely. 
                Each sandbox runs independently with no access to your environment variables, database connections, 
                or file system. Perfect for security analysis and code testing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
