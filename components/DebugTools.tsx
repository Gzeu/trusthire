'use client';

import React, { useState } from 'react';
import { 
  Bug, 
  Terminal, 
  Activity, 
  Database, 
  Cpu, 
  MemoryStick,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Info,
  RefreshCw,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';

interface DebugInfo {
  system: {
    userAgent: string;
    platform: string;
    language: string;
    cookieEnabled: boolean;
    onLine: boolean;
    screenResolution: string;
    colorDepth: number;
    timezone: string;
  };
  performance: {
    memory: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
    timing: {
      navigationStart: number;
      loadEventEnd: number;
      domContentLoaded: number;
      firstPaint: number;
    };
    network: {
      effectiveType: string;
      downlink: number;
      rtt: number;
    };
  };
  application: {
    version: string;
    buildTime: string;
    environment: string;
    features: {
      aiAnalysis: boolean;
      imageSearch: boolean;
      langChain: boolean;
      langSmith: boolean;
    };
    apis: {
      assessment: boolean;
      ai: boolean;
      scan: boolean;
      patterns: boolean;
    };
  };
  errors: Array<{
    timestamp: string;
    message: string;
    stack?: string;
    level: 'error' | 'warning' | 'info';
  }>;
}

export default function DebugTools() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const collectDebugInfo = async (): Promise<DebugInfo> => {
    const performance = (window.performance as any);
    const memory = performance.memory || {};
    const navigation = performance.navigation || {};
    const timing = performance.timing || {};
    const network = (navigator as any).connection || {};

    // Test API endpoints
    const apiTests = await testAPIEndpoints();

    // Collect recent errors from console
    const errors = collectConsoleErrors();

    return {
      system: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        screenResolution: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      performance: {
        memory: {
          usedJSHeapSize: memory.usedJSHeapSize || 0,
          totalJSHeapSize: memory.totalJSHeapSize || 0,
          jsHeapSizeLimit: memory.jsHeapSizeLimit || 0
        },
        timing: {
          navigationStart: timing.navigationStart || 0,
          loadEventEnd: timing.loadEventEnd || 0,
          domContentLoaded: timing.domContentLoadedEventEnd || 0,
          firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
        },
        network: {
          effectiveType: network.effectiveType || 'unknown',
          downlink: network.downlink || 0,
          rtt: network.rtt || 0
        }
      },
      application: {
        version: '1.0.0',
        buildTime: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        features: {
          aiAnalysis: true,
          imageSearch: true,
          langChain: true,
          langSmith: !!process.env.LANGSMITH_API_KEY
        },
        apis: apiTests
      },
      errors
    };
  };

  const testAPIEndpoints = async () => {
    const endpoints = {
      assessment: false,
      ai: false,
      scan: false,
      patterns: false
    };

    try {
      // Test assessment API
      const assessmentResponse = await fetch('/api/health').then(r => r.ok).catch(() => false);
      endpoints.assessment = assessmentResponse;

      // Test AI API
      const aiResponse = await fetch('/api/ai/analyze', { 
        method: 'POST',
        body: JSON.stringify({ type: 'test', data: {} }),
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.ok).catch(() => false);
      endpoints.ai = aiResponse;

      // Test scan API
      const scanResponse = await fetch('/api/scan/repo', {
        method: 'POST',
        body: JSON.stringify({ url: 'https://github.com/test/test' }),
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.ok).catch(() => false);
      endpoints.scan = scanResponse;

      // Test patterns API
      const patternsResponse = await fetch('/api/patterns').then(r => r.ok).catch(() => false);
      endpoints.patterns = patternsResponse;
    } catch (error) {
      console.error('API test error:', error);
    }

    return endpoints;
  };

  const collectConsoleErrors = () => {
    // This would need to be implemented with error tracking
    // For now, return empty array
    return [];
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const info = await collectDebugInfo();
      setDebugInfo(info);
    } catch (error) {
      console.error('Failed to collect debug info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!debugInfo) return;

    const dataStr = JSON.stringify(debugInfo, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trusthire-debug-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(2) + 's';
  };

  React.useEffect(() => {
    handleRefresh();
  }, []);

  React.useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(handleRefresh, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  if (!debugInfo) {
    return (
      <div className="bg-[#111113] border border-white/5 rounded-xl p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"></div>
          <p className="ml-3 text-white/60 font-mono text-sm">Loading debug information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111113] border border-white/5 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
            <Bug className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white font-mono">Debug Tools</h3>
            <p className="text-sm text-white/60">System diagnostics and troubleshooting</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 text-white/40 hover:text-white/60 transition-colors"
          >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={handleExport}
            className="p-2 text-white/40 hover:text-white/60 transition-colors"
            title="Export debug information"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 text-white/40 hover:text-white/60 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${
              autoRefresh 
                ? 'bg-green-600 text-white' 
                : 'bg-white/10 text-white/60'
            }`}
          >
            Auto-refresh
          </button>
        </div>
      </div>

      {/* Quick Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-blue-400 font-mono">System</span>
          </div>
          <div className="text-lg font-mono font-bold text-white">
            {debugInfo.system.platform}
          </div>
          <div className="text-xs text-white/60 font-mono">
            {debugInfo.system.onLine ? 'Online' : 'Offline'}
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <MemoryStick className="w-5 h-5 text-green-400" />
            <span className="text-xs text-green-400 font-mono">Memory</span>
          </div>
          <div className="text-lg font-mono font-bold text-white">
            {formatBytes(debugInfo.performance.memory.usedJSHeapSize)}
          </div>
          <div className="text-xs text-white/60 font-mono">
            of {formatBytes(debugInfo.performance.memory.totalJSHeapSize)}
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Wifi className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-purple-400 font-mono">Network</span>
          </div>
          <div className="text-lg font-mono font-bold text-white">
            {debugInfo.performance.network.effectiveType}
          </div>
          <div className="text-xs text-white/60 font-mono">
            {debugInfo.performance.network.downlink} Mbps
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-yellow-400" />
            <span className="text-xs text-yellow-400 font-mono">APIs</span>
          </div>
          <div className="text-lg font-mono font-bold text-white">
            {Object.values(debugInfo.application.apis).filter(Boolean).length}/4
          </div>
          <div className="text-xs text-white/60 font-mono">
            endpoints healthy
          </div>
        </div>
      </div>

      {/* API Status */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white font-mono mb-4 flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          API Endpoint Status
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(debugInfo.application.apis).map(([endpoint, status]) => (
            <div key={endpoint} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <span className="text-white font-mono text-sm capitalize">{endpoint}</span>
              {status ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feature Status */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white font-mono mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-purple-400" />
          Feature Status
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(debugInfo.application.features).map(([feature, enabled]) => (
            <div key={feature} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <span className="text-white font-mono text-sm capitalize">{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
              {enabled ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <div className="space-y-6">
          {/* System Information */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-sm font-semibold text-white font-mono mb-3">System Information</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/60 font-mono">User Agent:</span>
                <span className="text-white font-mono max-w-xs truncate">{debugInfo.system.userAgent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 font-mono">Platform:</span>
                <span className="text-white font-mono">{debugInfo.system.platform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 font-mono">Language:</span>
                <span className="text-white font-mono">{debugInfo.system.language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 font-mono">Screen Resolution:</span>
                <span className="text-white font-mono">{debugInfo.system.screenResolution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 font-mono">Color Depth:</span>
                <span className="text-white font-mono">{debugInfo.system.colorDepth} bit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 font-mono">Timezone:</span>
                <span className="text-white font-mono">{debugInfo.system.timezone}</span>
              </div>
            </div>
          </div>

          {/* Performance Information */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-sm font-semibold text-white font-mono mb-3">Performance Information</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/60 font-mono">Used Memory:</span>
                <span className="text-white font-mono">{formatBytes(debugInfo.performance.memory.usedJSHeapSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 font-mono">Total Memory:</span>
                <span className="text-white font-mono">{formatBytes(debugInfo.performance.memory.totalJSHeapSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 font-mono">Memory Limit:</span>
                <span className="text-white font-mono">{formatBytes(debugInfo.performance.memory.jsHeapSizeLimit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 font-mono">Load Time:</span>
                <span className="text-white font-mono">{formatTime(debugInfo.performance.timing.loadEventEnd - debugInfo.performance.timing.navigationStart)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 font-mono">DOM Content Loaded:</span>
                <span className="text-white font-mono">{formatTime(debugInfo.performance.timing.domContentLoaded - debugInfo.performance.timing.navigationStart)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 font-mono">First Paint:</span>
                <span className="text-white font-mono">{formatTime(debugInfo.performance.timing.firstPaint)}</span>
              </div>
            </div>
          </div>

          {/* Application Information */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-sm font-semibold text-white font-mono mb-3">Application Information</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/60 font-mono">Version:</span>
                <span className="text-white font-mono">{debugInfo.application.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 font-mono">Environment:</span>
                <span className="text-white font-mono">{debugInfo.application.environment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 font-mono">Build Time:</span>
                <span className="text-white font-mono">{new Date(debugInfo.application.buildTime).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
