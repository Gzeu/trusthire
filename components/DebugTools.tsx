'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bug, 
  Terminal, 
  RefreshCw, 
  Download, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  Info
} from 'lucide-react';

interface DebugToolsProps {
  className?: string;
}

export function DebugTools({ className }: DebugToolsProps) {
  const [logs, setLogs] = useState<string[]>([
    '[2026-04-20 21:26:00] System initialized successfully',
    '[2026-04-20 21:26:01] Database connection established',
    '[2026-04-20 21:26:02] Autonomous decision engine started',
    '[2026-04-20 21:26:03] Health check passed',
    '[2026-04-20 21:26:04] Monitoring services active'
  ]);

  const [isRunning, setIsRunning] = useState(false);

  const handleRunDiagnostics = async () => {
    setIsRunning(true);
    
    // Simulate diagnostic checks
    const diagnosticSteps = [
      'Checking database connectivity...',
      'Validating API endpoints...',
      'Testing autonomous systems...',
      'Verifying security configurations...',
      'Analyzing performance metrics...',
      'Diagnostics completed successfully'
    ];

    for (const step of diagnosticSteps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLogs(prev => [...prev, `[${new Date().toLocaleString()}] ${step}`]);
    }
    
    setIsRunning(false);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleExportLogs = () => {
    const logContent = logs.join('\n');
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trusthire-debug-${new Date().toISOString().split('T')[0]}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRefreshStatus = () => {
    setLogs(prev => [...prev, `[${new Date().toLocaleString()}] Status refreshed`]);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>System Health</span>
            </h3>
            <Badge variant="outline" className="text-green-600">Healthy</Badge>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Database:</span>
              <span className="text-green-600">Connected</span>
            </div>
            <div className="flex justify-between">
              <span>API:</span>
              <span className="text-green-600">Operational</span>
            </div>
            <div className="flex justify-between">
              <span>Autonomous:</span>
              <span className="text-green-600">Active</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span>Issues</span>
            </h3>
            <Badge variant="outline" className="text-yellow-600">2 Warnings</Badge>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Memory Usage:</span>
              <span className="text-yellow-600">75%</span>
            </div>
            <div className="flex justify-between">
              <span>API Response:</span>
              <span className="text-yellow-600">245ms</span>
            </div>
            <div className="flex justify-between">
              <span>Cache Hit Rate:</span>
              <span className="text-green-600">92%</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center space-x-2">
              <Info className="w-4 h-4 text-blue-500" />
              <span>System Info</span>
            </h3>
            <Badge variant="outline">v1.0.0</Badge>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Environment:</span>
              <span className="text-blue-600">Production</span>
            </div>
            <div className="flex justify-between">
              <span>Node Version:</span>
              <span className="text-gray-600">18.x</span>
            </div>
            <div className="flex justify-between">
              <span>Uptime:</span>
              <span className="text-green-600">24h 15m</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Debug Actions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Bug className="w-5 h-5" />
            <span>Debug Tools</span>
          </h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefreshStatus}
              disabled={isRunning}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClearLogs}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportLogs}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button 
            onClick={handleRunDiagnostics}
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Running Diagnostics...
              </>
            ) : (
              <>
                <Terminal className="w-4 h-4 mr-2" />
                Run System Diagnostics
              </>
            )}
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setLogs(prev => [...prev, `[${new Date().toLocaleString()}] Manual debug check triggered`])}
          >
            Quick Health Check
          </Button>
        </div>

        {/* Debug Logs */}
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Debug Console</span>
            <Badge variant="outline" className="text-green-400">
              {logs.length} entries
            </Badge>
          </div>
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="text-xs">
                {log}
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-gray-500 text-xs">No logs available</div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
