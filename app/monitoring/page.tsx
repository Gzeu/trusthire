'use client';

import { useState } from 'react';
import MonitoringDashboard from '@/components/MonitoringDashboard';
import DebugTools from '@/components/DebugTools';
import { 
  BarChart3, 
  Bug, 
  Settings, 
  Activity,
  Shield,
  Brain,
  Camera,
  Terminal
} from 'lucide-react';

export default function MonitoringPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'debug' | 'settings'>('dashboard');

  const tabs = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: <BarChart3 className="w-4 h-4" />,
      description: 'Real-time metrics and analytics'
    },
    {
      id: 'debug' as const,
      label: 'Debug Tools',
      icon: <Bug className="w-4 h-4" />,
      description: 'System diagnostics and troubleshooting'
    },
    {
      id: 'settings' as const,
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      description: 'Configuration and preferences'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white font-mono">TrustHire Monitoring</h1>
                <p className="text-white/60 font-mono">System monitoring, debugging, and analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/"
                className="px-4 py-2 bg-white/5 border border-white/10 text-white font-mono text-sm rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Back to Main
              </a>
              <a
                href="/assess"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-mono text-sm rounded-lg transition-colors flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                Quick Assessment
              </a>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-[#111113] border border-white/5 rounded-lg p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          <p className="text-white/40 font-mono text-sm mt-2">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'dashboard' && (
            <div>
              <MonitoringDashboard />
              
              {/* Additional Dashboard Components */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* AI Analysis Stats */}
                <div className="bg-[#111113] border border-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white font-mono">AI Analysis Stats</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-mono font-bold text-purple-400">856</div>
                      <div className="text-xs text-white/60 font-mono">Total Analyses</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-mono font-bold text-green-400">94.2%</div>
                      <div className="text-xs text-white/60 font-mono">Success Rate</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-mono font-bold text-blue-400">1.2s</div>
                      <div className="text-xs text-white/60 font-mono">Avg Response</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-mono font-bold text-yellow-400">87%</div>
                      <div className="text-xs text-white/60 font-mono">Accuracy</div>
                    </div>
                  </div>
                </div>

                {/* Image Search Stats */}
                <div className="bg-[#111113] border border-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Camera className="w-4 h-4 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white font-mono">Image Search Stats</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-mono font-bold text-green-400">234</div>
                      <div className="text-xs text-white/60 font-mono">Total Searches</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-mono font-bold text-orange-400">67</div>
                      <div className="text-xs text-white/60 font-mono">Suspicious Found</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-mono font-bold text-blue-400">89%</div>
                      <div className="text-xs text-white/60 font-mono">Yandex Usage</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-mono font-bold text-purple-400">11%</div>
                      <div className="text-xs text-white/60 font-mono">Google Usage</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'debug' && (
            <div>
              <DebugTools />
              
              {/* Additional Debug Components */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* System Logs */}
                <div className="bg-[#111113] border border-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <Terminal className="w-4 h-4 text-orange-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white font-mono">System Logs</h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      { level: 'info', message: 'Application started successfully', time: '2 mins ago' },
                      { level: 'warning', message: 'High memory usage detected', time: '5 mins ago' },
                      { level: 'error', message: 'API endpoint timeout', time: '12 mins ago' },
                      { level: 'info', message: 'User session created', time: '15 mins ago' }
                    ].map((log, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded text-xs">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            log.level === 'error' ? 'bg-red-400' :
                            log.level === 'warning' ? 'bg-yellow-400' : 'bg-green-400'
                          }`}></div>
                          <span className="text-white font-mono">{log.message}</span>
                        </div>
                        <span className="text-white/40 font-mono">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-[#111113] border border-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white font-mono">Performance Metrics</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 font-mono text-sm">CPU Usage</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-white/10 rounded-full h-2">
                          <div className="bg-blue-400 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <span className="text-blue-400 font-mono text-sm">45%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 font-mono text-sm">Memory Usage</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-white/10 rounded-full h-2">
                          <div className="bg-green-400 h-2 rounded-full" style={{ width: '67%' }}></div>
                        </div>
                        <span className="text-green-400 font-mono text-sm">67%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 font-mono text-sm">Disk Usage</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-white/10 rounded-full h-2">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '23%' }}></div>
                        </div>
                        <span className="text-yellow-400 font-mono text-sm">23%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 font-mono text-sm">Network I/O</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-white/10 rounded-full h-2">
                          <div className="bg-purple-400 h-2 rounded-full" style={{ width: '12%' }}></div>
                        </div>
                        <span className="text-purple-400 font-mono text-sm">12%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-[#111113] border border-white/5 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gray-500/20 rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white font-mono">Settings & Configuration</h3>
              </div>
              
              <div className="space-y-6">
                {/* Feature Toggles */}
                <div>
                  <h4 className="text-sm font-semibold text-white font-mono mb-4">Feature Toggles</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-mono text-sm">AI Analysis</p>
                        <p className="text-white/60 font-mono text-xs">Enable AI-powered threat detection</p>
                      </div>
                      <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-mono text-xs">
                        Enabled
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-mono text-sm">Reverse Image Search</p>
                        <p className="text-white/60 font-mono text-xs">Enable image verification features</p>
                      </div>
                      <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-mono text-xs">
                        Enabled
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-mono text-sm">LangSmith Integration</p>
                        <p className="text-white/60 font-mono text-xs">Enable production monitoring</p>
                      </div>
                      <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-mono text-xs">
                        Enabled
                      </button>
                    </div>
                  </div>
                </div>

                {/* API Configuration */}
                <div>
                  <h4 className="text-sm font-semibold text-white font-mono mb-4">API Configuration</h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-mono text-sm">Groq API</span>
                        <span className="text-green-400 font-mono text-xs">Connected</span>
                      </div>
                      <p className="text-white/60 font-mono text-xs">Model: mixtral-8x7b-32768</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-mono text-sm">VirusTotal API</span>
                        <span className="text-green-400 font-mono text-xs">Connected</span>
                      </div>
                      <p className="text-white/60 font-mono text-xs">Requests: 1,247 / 10,000</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-mono text-sm">LangSmith API</span>
                        <span className="text-green-400 font-mono text-xs">Connected</span>
                      </div>
                      <p className="text-white/60 font-mono text-xs">Traces: 856 active</p>
                    </div>
                  </div>
                </div>

                {/* System Settings */}
                <div>
                  <h4 className="text-sm font-semibold text-white font-mono mb-4">System Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-mono text-sm">Auto-refresh</p>
                        <p className="text-white/60 font-mono text-xs">Automatically refresh monitoring data</p>
                      </div>
                      <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-mono text-xs">
                        30s
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-mono text-sm">Log Level</p>
                        <p className="text-white/60 font-mono text-xs">Minimum log level to display</p>
                      </div>
                      <select className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-lg text-white font-mono text-xs">
                        <option>Info</option>
                        <option>Warning</option>
                        <option>Error</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
