'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  Eye,
  Brain,
  Camera,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface MonitoringMetrics {
  totalAssessments: number;
  activeUsers: number;
  scamDetections: number;
  aiAnalyses: number;
  imageSearches: number;
  averageRiskScore: number;
  topThreats: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  platformUsage: Array<{
    platform: string;
    usage: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  recentActivity: Array<{
    id: string;
    type: 'assessment' | 'ai_analysis' | 'image_search';
    timestamp: string;
    riskLevel: string;
    status: 'completed' | 'failed' | 'pending';
  }>;
}

export default function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<MonitoringMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate fetching metrics (in production, this would call actual APIs)
  const fetchMetrics = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockMetrics: MonitoringMetrics = {
      totalAssessments: 1247,
      activeUsers: 89,
      scamDetections: 342,
      aiAnalyses: 856,
      imageSearches: 234,
      averageRiskScore: 42.3,
      topThreats: [
        { type: 'Fake Job Postings', count: 145, percentage: 42.4 },
        { type: 'Phishing Attempts', count: 98, percentage: 28.7 },
        { type: 'Identity Theft', count: 67, percentage: 19.6 },
        { type: 'Malicious Repos', count: 32, percentage: 9.3 }
      ],
      platformUsage: [
        { platform: 'LinkedIn', usage: 68, trend: 'up' },
        { platform: 'Email', usage: 45, trend: 'stable' },
        { platform: 'GitHub', usage: 23, trend: 'up' },
        { platform: 'Other', usage: 12, trend: 'down' }
      ],
      recentActivity: [
        {
          id: '1',
          type: 'assessment',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          riskLevel: 'high',
          status: 'completed'
        },
        {
          id: '2',
          type: 'ai_analysis',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          riskLevel: 'medium',
          status: 'completed'
        },
        {
          id: '3',
          type: 'image_search',
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          riskLevel: 'low',
          status: 'completed'
        },
        {
          id: '4',
          type: 'assessment',
          timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
          riskLevel: 'critical',
          status: 'completed'
        }
      ]
    };
    
    setMetrics(mockMetrics);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [timeRange, autoRefresh]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-white/40';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      default: return <Activity className="w-4 h-4 text-white/40" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assessment': return <Shield className="w-4 h-4 text-blue-400" />;
      case 'ai_analysis': return <Brain className="w-4 h-4 text-purple-400" />;
      case 'image_search': return <Camera className="w-4 h-4 text-green-400" />;
      default: return <Activity className="w-4 h-4 text-white/40" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      case 'stable': return <Activity className="w-4 h-4 text-yellow-400" />;
      default: return <Activity className="w-4 h-4 text-white/40" />;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#111113] border border-white/5 rounded-xl p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"></div>
          <p className="ml-3 text-white/60 font-mono text-sm">Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="bg-[#111113] border border-white/5 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white font-mono">Monitoring Dashboard</h3>
            <p className="text-sm text-white/60">Real-time system metrics and usage analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-lg font-mono text-sm transition-colors ${
              autoRefresh 
                ? 'bg-green-600 text-white' 
                : 'bg-white/10 text-white/60'
            }`}
          >
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-blue-400 font-mono">Total</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">{metrics.totalAssessments}</div>
          <div className="text-xs text-white/60 font-mono">Assessments</div>
        </div>
        
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-green-400" />
            <span className="text-xs text-green-400 font-mono">Active</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">{metrics.activeUsers}</div>
          <div className="text-xs text-white/60 font-mono">Users</div>
        </div>
        
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-xs text-red-400 font-mono">Detected</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">{metrics.scamDetections}</div>
          <div className="text-xs text-white/60 font-mono">Scams</div>
        </div>
        
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-purple-400 font-mono">AI</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">{metrics.aiAnalyses}</div>
          <div className="text-xs text-white/60 font-mono">Analyses</div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Camera className="w-5 h-5 text-green-400" />
            <span className="text-xs text-green-400 font-mono">Image</span>
          </div>
          <div className="text-xl font-mono font-bold text-white">{metrics.imageSearches}</div>
          <div className="text-xs text-white/60 font-mono">Reverse Searches</div>
        </div>
        
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <span className="text-xs text-yellow-400 font-mono">Avg Risk</span>
          </div>
          <div className="text-xl font-mono font-bold text-white">{metrics.averageRiskScore}%</div>
          <div className="text-xs text-white/60 font-mono">Risk Score</div>
        </div>
        
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-blue-400 font-mono">Health</span>
          </div>
          <div className="text-xl font-mono font-bold text-green-400">98.5%</div>
          <div className="text-xs text-white/60 font-mono">System Health</div>
        </div>
      </div>

      {/* Top Threats */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white font-mono mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          Top Threat Types
        </h4>
        <div className="space-y-3">
          {metrics.topThreats.map((threat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                  <span className="text-red-400 font-mono text-xs font-bold">{index + 1}</span>
                </div>
                <div>
                  <p className="text-white font-mono text-sm">{threat.type}</p>
                  <p className="text-white/60 font-mono text-xs">{threat.count} incidents</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-red-400 h-2 rounded-full"
                    style={{ width: `${threat.percentage}%` }}
                  ></div>
                </div>
                <span className="text-red-400 font-mono text-xs w-12 text-right">
                  {threat.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Usage */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white font-mono mb-4 flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-400" />
          Platform Usage
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metrics.platformUsage.map((platform, index) => (
            <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-mono text-sm">{platform.platform}</span>
                {getTrendIcon(platform.trend)}
              </div>
              <div className="text-xl font-mono font-bold text-white">{platform.usage}%</div>
              <div className="text-xs text-white/60 font-mono">Usage share</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h4 className="text-sm font-semibold text-white font-mono mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" />
          Recent Activity
        </h4>
        <div className="space-y-2">
          {metrics.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                {getActivityIcon(activity.type)}
                <div>
                  <p className="text-white font-mono text-sm capitalize">
                    {activity.type.replace('_', ' ')} #{activity.id}
                  </p>
                  <p className="text-white/60 font-mono text-xs">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-mono ${getRiskColor(activity.riskLevel)}`}>
                  {activity.riskLevel.toUpperCase()}
                </span>
                {getStatusIcon(activity.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
