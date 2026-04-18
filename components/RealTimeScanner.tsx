'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Activity, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Globe, 
  Shield, 
  TrendingUp,
  Pause,
  Play,
  RotateCcw,
  Download,
  Wifi,
  Loader2
} from 'lucide-react';

interface ScanProgress {
  id: string;
  type: 'github' | 'linkedin' | 'image' | 'forms' | 'url';
  status: 'pending' | 'scanning' | 'completed' | 'error';
  progress: number;
  currentStep: string;
  totalSteps: number;
  startTime: number;
  estimatedTime: number;
  result?: any;
  error?: string;
}

interface RealTimeMetrics {
  activeScans: number;
  completedScans: number;
  averageScanTime: number;
  successRate: number;
  scansPerMinute: number;
}

export default function RealTimeScanner() {
  const [scans, setScans] = useState<ScanProgress[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    activeScans: 0,
    completedScans: 0,
    averageScanTime: 0,
    successRate: 100,
    scansPerMinute: 0
  });
  const [selectedScan, setSelectedScan] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const scanTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Mock WebSocket connection (in production, this would be a real WebSocket)
      const connectWebSocket = () => {
        try {
          const ws = new WebSocket('wss://api.trusthire.dev/scans');
          
          ws.onopen = () => {
            console.log('WebSocket connected');
          };
          
          ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            handleWebSocketMessage(data);
          };
          
          ws.onclose = () => {
            console.log('WebSocket disconnected');
            // Attempt to reconnect after 3 seconds
            setTimeout(connectWebSocket, 3000);
          };
          
          wsRef.current = ws;
        } catch (error) {
          console.log('WebSocket not available, using fallback');
        }
      };
      
      connectWebSocket();
    }
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      scanTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'scan_progress':
        updateScanProgress(data.scanId, data.progress, data.status);
        break;
      case 'scan_completed':
        completeScan(data.scanId, data.result);
        break;
      case 'scan_error':
        failScan(data.scanId, data.error);
        break;
      case 'metrics_update':
        setMetrics(data.metrics);
        break;
    }
  };

  const updateScanProgress = (scanId: string, progress: number, status: string) => {
    setScans(prev => prev.map(scan => 
      scan.id === scanId 
        ? { ...scan, progress, status: status as any }
        : scan
    ));
  };

  const completeScan = (scanId: string, result: any) => {
    setScans(prev => prev.map(scan => 
      scan.id === scanId 
        ? { ...scan, status: 'completed', progress: 100, result }
        : scan
    ));
    
    setMetrics(prev => ({
      ...prev,
      activeScans: Math.max(0, prev.activeScans - 1),
      completedScans: prev.completedScans + 1,
      averageScanTime: calculateAverageTime(prev.completedScans + 1),
      successRate: calculateSuccessRate(prev.completedScans + 1)
    }));
  };

  const failScan = (scanId: string, error: string) => {
    setScans(prev => prev.map(scan => 
      scan.id === scanId 
        ? { ...scan, status: 'error', error }
        : scan
    ));
    
    setMetrics(prev => ({
      ...prev,
      activeScans: Math.max(0, prev.activeScans - 1),
      successRate: calculateSuccessRate(prev.completedScans)
    }));
  };

  const calculateAverageTime = (completedCount: number) => {
    if (completedCount === 0) return 0;
    // Mock calculation - in production, this would be based on actual scan times
    return Math.round(15000 + Math.random() * 10000); // 15-25 seconds
  };

  const calculateSuccessRate = (completedCount: number) => {
    if (completedCount === 0) return 100;
    // Mock calculation - in production, this would be based on actual success/failure rates
    return Math.round(85 + Math.random() * 10); // 85-95%
  };

  const startScan = useCallback((type: ScanProgress['type'], target: string) => {
    const scanId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const scanSteps = {
      github: [
        'Fetching repository',
        'Analyzing files',
        'Scanning for malicious code',
        'Checking dependencies',
        'Generating report'
      ],
      linkedin: [
        'Fetching profile',
        'Analyzing activity',
        'Checking connections',
        'Verifying company',
        'Assessing authenticity'
      ],
      image: [
        'Analyzing image',
        'Reverse searching',
        'Checking for duplicates',
        'Verifying authenticity',
        'Generating report'
      ],
      forms: [
        'Fetching form',
        'Analyzing structure',
        'Checking for phishing',
        'Validating fields',
        'Generating report'
      ],
      url: [
        'Fetching URL',
        'Analyzing content',
        'Checking reputation',
        'Scanning for threats',
        'Generating report'
      ]
    };

    const newScan: ScanProgress = {
      id: scanId,
      type,
      status: 'scanning',
      progress: 0,
      currentStep: scanSteps[type][0],
      totalSteps: scanSteps[type].length,
      startTime: Date.now(),
      estimatedTime: 20000 // 20 seconds estimated
    };

    setScans(prev => [...prev, newScan]);
    setMetrics(prev => ({
      ...prev,
      activeScans: prev.activeScans + 1
    }));

    // Simulate real-time progress updates
    const steps = scanSteps[type];
    let currentStepIndex = 0;
    
    const updateProgress = () => {
      if (isPaused) {
        scanTimeoutsRef.current.set(scanId, setTimeout(updateProgress, 1000));
        return;
      }

      if (currentStepIndex < steps.length) {
        setScans(prev => prev.map(scan => 
          scan.id === scanId 
            ? { 
                ...scan, 
                currentStep: steps[currentStepIndex],
                progress: Math.round(((currentStepIndex + 1) / steps.length) * 100)
              }
            : scan
        ));
        
        currentStepIndex++;
        
        const stepTime = 2000 + Math.random() * 2000; // 2-4 seconds per step
        scanTimeoutsRef.current.set(scanId, setTimeout(updateProgress, stepTime));
      } else {
        // Scan completed
        completeScan(scanId, {
          type,
          target,
          timestamp: Date.now(),
          score: Math.round(70 + Math.random() * 30),
          risk: Math.random() > 0.7 ? 'low' : Math.random() > 0.3 ? 'medium' : 'high',
          details: generateMockResult(type)
        });
        
        scanTimeoutsRef.current.delete(scanId);
      }
    };

    scanTimeoutsRef.current.set(scanId, setTimeout(updateProgress, 1000));
  }, [isPaused]);

  const stopScan = useCallback((scanId: string) => {
    setScans(prev => prev.map(scan => 
      scan.id === scanId 
        ? { ...scan, status: 'pending', progress: 0 }
        : scan
    ));
    
    if (scanTimeoutsRef.current.has(scanId)) {
      clearTimeout(scanTimeoutsRef.current.get(scanId));
      scanTimeoutsRef.current.delete(scanId);
    }
    
    setMetrics(prev => ({
      ...prev,
      activeScans: Math.max(0, prev.activeScans - 1)
    }));
  }, []);

  const pauseAllScans = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeAllScans = useCallback(() => {
    setIsPaused(false);
  }, []);

  const generateMockResult = (type: string) => {
    const results = {
      github: {
        filesScanned: Math.floor(50 + Math.random() * 100),
        suspiciousFiles: Math.floor(Math.random() * 5),
        vulnerabilities: Math.floor(Math.random() * 3),
        dependencies: Math.floor(20 + Math.random() * 30)
      },
      linkedin: {
        profileAge: Math.floor(1 + Math.random() * 60),
        connections: Math.floor(50 + Math.random() * 500),
        postsCount: Math.floor(10 + Math.random() * 100),
        verificationStatus: Math.random() > 0.3 ? 'verified' : 'unverified'
      },
      image: {
        matchesFound: Math.floor(Math.random() * 20),
        platforms: Math.floor(2 + Math.random() * 4),
        confidence: Math.round(70 + Math.random() * 30),
        isStock: Math.random() > 0.7
      },
      forms: {
        fieldsCount: Math.floor(5 + Math.random() * 15),
        suspiciousFields: Math.floor(Math.random() * 3),
        phishingScore: Math.round(Math.random() * 100),
        sslStatus: Math.random() > 0.5 ? 'secure' : 'insecure'
      },
      url: {
        responseTime: Math.round(100 + Math.random() * 500),
        statusCode: Math.random() > 0.1 ? 200 : 404,
        reputationScore: Math.round(60 + Math.random() * 40),
        threatsDetected: Math.floor(Math.random() * 5)
      }
    };
    
    return (results as any)[type] || {};
  };

  const exportResults = useCallback(() => {
    const results = scans.filter(scan => scan.status === 'completed').map(scan => ({
      id: scan.id,
      type: scan.type,
      target: scan.result?.target || 'Unknown',
      score: scan.result?.score || 0,
      risk: scan.result?.risk || 'unknown',
      timestamp: scan.result?.timestamp || scan.startTime,
      details: scan.result?.details || {}
    }));

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trusthire-scan-results-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [scans]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'scanning': return 'text-blue-400';
      case 'error': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'scanning': return Loader2;
      case 'error': return AlertTriangle;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  return (
    <div className="bg-[#111113] border border-white/5 rounded-2xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-mono text-white">Real-Time Scanner</h3>
            <p className="text-sm text-white/60 font-mono">Live scanning with WebSocket updates</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={isPaused ? resumeAllScans : pauseAllScans}
            className={`flex items-center gap-2 px-4 py-2 font-mono text-sm rounded-xl transition-all duration-200 ${
              isPaused 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
            }`}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={exportResults}
            disabled={scans.filter(s => s.status === 'completed').length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-mono text-sm rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-white/60 font-mono">Active Scans</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{metrics.activeScans}</div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-xs text-white/60 font-mono">Completed</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{metrics.completedScans}</div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-white/60 font-mono">Avg Time</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{formatTime(metrics.averageScanTime)}</div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-white/60 font-mono">Success Rate</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{metrics.successRate}%</div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wifi className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-white/60 font-mono">Scans/Min</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{metrics.scansPerMinute}</div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold font-mono text-white mb-4">Start Real-Time Scan</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { type: 'github', label: 'GitHub', icon: 'repo' },
            { type: 'linkedin', label: 'LinkedIn', icon: 'profile' },
            { type: 'image', label: 'Image', icon: 'image' },
            { type: 'forms', label: 'Forms', icon: 'form' },
            { type: 'url', label: 'URL', icon: 'link' }
          ].map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => startScan(type as any, `sample-${type}`)}
              disabled={isScanning}
              className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 disabled:bg-white/5 disabled:opacity-50 border border-white/10 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="font-mono text-sm text-white">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Scans */}
      {scans.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold font-mono text-white">Active Scans</h4>
          <div className="space-y-3">
            {scans.map((scan) => {
              const StatusIcon = getStatusIcon(scan.status);
              return (
                <div
                  key={scan.id}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    selectedScan === scan.id ? 'border-blue-500/30 bg-blue-500/10' : 'border-white/10'
                  }`}
                  onClick={() => setSelectedScan(selectedScan === scan.id ? null : scan.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getStatusColor(scan.status)}`}>
                      <StatusIcon className={`w-5 h-5 ${scan.status === 'scanning' ? 'animate-spin' : ''}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h5 className="font-semibold font-mono text-white capitalize">{scan.type} Scan</h5>
                          <p className="text-xs text-white/60 font-mono">ID: {scan.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono px-2 py-1 rounded ${getStatusColor(scan.status)}`}>
                            {scan.status.toUpperCase()}
                          </span>
                          {scan.status === 'scanning' && (
                            <span className="text-xs text-blue-400 font-mono">
                              {scan.progress}%
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-white/60 font-mono">Current Step:</span>
                          <span className="text-xs text-white font-mono">{scan.currentStep}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              scan.status === 'completed' ? 'bg-green-400' :
                              scan.status === 'error' ? 'bg-red-400' :
                              scan.status === 'scanning' ? 'bg-blue-400' :
                              'bg-yellow-400'
                            }`}
                            style={{ width: `${scan.progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-white/60 font-mono">
                            Step {scan.currentStep ? scan.currentStep.split(' ')[0] : 0} of {scan.totalSteps}
                          </span>
                          <span className="text-xs text-white/60 font-mono">
                            {formatTime(Date.now() - scan.startTime)}
                          </span>
                        </div>
                      </div>
                      
                      {scan.error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <p className="text-red-400 font-mono text-sm">{scan.error}</p>
                        </div>
                      )}
                      
                      {scan.result && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-green-400 font-mono text-sm">Scan Completed</span>
                            <span className="text-white font-mono text-sm">Score: {scan.result.score}</span>
                          </div>
                          <p className="text-white/60 font-mono text-xs">
                            Risk Level: <span className="text-yellow-400">{scan.result.risk}</span>
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        {scan.status === 'scanning' && (
                          <button
                            onClick={() => stopScan(scan.id)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg font-mono text-sm transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Stop
                          </button>
                        )}
                        {scan.status === 'completed' && (
                          <button
                            onClick={() => {
                              const result = scan.result;
                              alert(`Scan Results:\nType: ${scan.type}\nScore: ${result.score}\nRisk: ${result.risk}\nDetails: ${JSON.stringify(result.details, null, 2)}`);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg font-mono text-sm transition-colors"
                          >
                            <Shield className="w-3 h-3" />
                            Details
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WebSocket Status */}
      <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-mono text-sm">
              {wsRef.current?.readyState === WebSocket.OPEN ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="text-xs text-blue-300 font-mono">
            Real-time updates {wsRef.current?.readyState === WebSocket.OPEN ? 'active' : 'offline'}
          </div>
        </div>
      </div>
    </div>
  );
}
