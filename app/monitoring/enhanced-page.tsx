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

  const runOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationScore(0);
    
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const scores = [85, 90, 88, 92];
    const finalScore = scores[Math.floor(Math.random() * scores.length)];
    
    setOptimizationScore(finalScore);
    setIsOptimizing(false);
  };

  const tabs = [
    { id: 'performance', label: 'Performance', icon: Activity },
    { id: 'accessibility', label: 'Accessibility', icon: Shield },
    { id: 'browser', label: 'Browser', icon: Zap },
    { id: 'realtime', label: 'Real-time', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-mono text-white mb-2">Enhanced Monitoring</h1>
          <p className="text-lg text-white/70 font-mono">Advanced system monitoring and optimization tools</p>
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
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'}
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
              <div className="mb-4">
                <button
                  onClick={runOptimization}
                  disabled={isOptimizing}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-mono rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOptimizing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 rounded-full animate-spin" />
                      <span>Optimizing System...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Run Full Optimization</span>
                    </>
                  )}
                </button>
                {optimizationScore > 0 && (
                  <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <span className="text-green-400 font-mono">Optimization Complete</span>
                    </div>
                    <div className="text-sm text-green-400 font-mono">
                      Score: <span className="text-lg font-bold">{optimizationScore}</span>
                    </div>
                  </div>
                )}
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
                <p className="text-sm text-white/60 font-mono">Live performance tracking and alert system</p>
              </div>
              <PerformanceMonitor />
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          </div>

          <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold font-mono text-white">Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60 font-mono">CPU Usage</span>
                    <span className="text-sm text-blue-400 font-mono">23%</span>
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
            </div>
          </div>

          <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold font-mono text-white">Page Load</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60 font-mono">Load Time</span>
                    <span className="text-sm text-blue-400 font-mono">1.2s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60 font-mono">Response Time</span>
                    <span className="text-sm text-blue-400 font-mono">89ms</span>
                  </div>
                </div>
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
      </div>
    </div>
  );
}
