'use client';

import { useState, useEffect } from 'react';
import { Shield, Activity, Zap, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import PerformanceOptimizer from '@/components/PerformanceOptimizer';
import AccessibilityEnhancer from '@/components/AccessibilityEnhancer';
import CrossBrowserTester from '@/components/CrossBrowserTester';
import PerformanceMonitor from '@/components/PerformanceMonitor';

export default function EnhancedMonitoringPage() {
  const [activeTab, setActiveTab] = useState<'performance' | 'accessibility' | 'browser' | 'realtime'>('performance');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationScore, setOptimizationScore] = useState(0);

  const tabs = [
    {
      id: 'performance',
      label: 'Performance',
      icon: Zap,
      description: 'Optimize and monitor system performance'
    },
    {
      id: 'accessibility',
      label: 'Accessibility',
      icon: Shield,
      description: 'WCAG compliance and accessibility testing'
    },
    {
      id: 'browser',
      label: 'Browser',
      icon: Activity,
      description: 'Cross-browser compatibility testing'
    },
    {
      id: 'realtime',
      label: 'Real-time',
      icon: TrendingUp,
      description: 'Live performance monitoring'
    }
  ];

  const runFullOptimization = async () => {
    setIsOptimizing(true);
    
    // Simulate optimization process
    for (let i = 0; i <= 100; i += 10) {
      setOptimizationScore(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setIsOptimizing(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Navigation Header */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold font-mono text-white">TrustHire Monitoring</h1>
                <p className="text-xs text-white/60 font-mono">System optimization and performance tracking</p>
              </div>
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
                href="/assess"
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-mono text-xs rounded-lg transition-colors flex items-center gap-2"
              >
                <Zap className="w-3 h-3" />
                Assessment
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-mono text-white mb-4">
            System Optimization Center
          </h2>
          <p className="text-lg text-white/60 font-mono max-w-2xl mx-auto">
            Monitor, optimize, and enhance your TrustHire experience with advanced performance tools
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button
            onClick={runFullOptimization}
            disabled={isOptimizing}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-mono font-bold rounded-2xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isOptimizing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Optimizing System...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Run Full Optimization
              </>
            )}
          </button>
          
          {optimizationScore > 0 && (
            <div className="flex items-center gap-3 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-mono text-sm">Score: {optimizationScore}%</span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'performance' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold font-mono text-white mb-2">Performance Optimization</h3>
                <p className="text-sm text-white/60 font-mono">Analyze and optimize system performance metrics</p>
              </div>
              <PerformanceOptimizer />
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold font-mono text-white mb-2">Accessibility Enhancement</h3>
                <p className="text-sm text-white/60 font-mono">WCAG compliance testing and accessibility improvements</p>
              </div>
              <AccessibilityEnhancer />
            </div>
          )}

          {activeTab === 'browser' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold font-mono text-white mb-2">Cross-Browser Testing</h3>
                <p className="text-sm text-white/60 font-mono">Test compatibility across major browsers</p>
              </div>
              <CrossBrowserTester />
            </div>
          )}

          {activeTab === 'realtime' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold font-mono text-white mb-2">Real-time Monitoring</h3>
                <p className="text-sm text-white/60 font-mono">Live performance tracking and alerts</p>
              </div>
              <PerformanceMonitor />
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold font-mono text-white">System Health</h4>
                <p className="text-xs text-white/60 font-mono">All systems operational</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 font-mono">CPU Usage</span>
                <span className="text-sm text-green-400 font-mono">23%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 font-mono">Memory</span>
                <span className="text-sm text-green-400 font-mono">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 font-mono">Storage</span>
                <span className="text-sm text-green-400 font-mono">12%</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold font-mono text-white">Performance</h4>
                <p className="text-xs text-white/60 font-mono">Optimized for speed</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 font-mono">Page Load</span>
                <span className="text-sm text-blue-400 font-mono">1.2s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 font-mono">Response Time</span>
                <span className="text-sm text-blue-400 font-mono">89ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 font-mono">Uptime</span>
                <span className="text-sm text-blue-400 font-mono">99.9%</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold font-mono text-white">Security</h4>
                <p className="text-xs text-white/60 font-mono">All protections active</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 font-mono">Firewall</span>
                <span className="text-sm text-green-400 font-mono">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 font-mono">SSL Cert</span>
                <span className="text-sm text-green-400 font-mono">Valid</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 font-mono">Scans</span>
                <span className="text-sm text-purple-400 font-mono">48,752</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
