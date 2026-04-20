'use client';

import { useState, useEffect } from 'react';
import { 
  Brain, 
  Shield, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Globe, 
  Zap,
  Eye,
  BarChart3,
  Cpu,
  Database,
  Lock,
  RefreshCw
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalScans: 1247,
    threatsBlocked: 89,
    aiAccuracy: 97.3,
    responseTime: 124
  });

  const [activities, setActivities] = useState([
    { id: 1, type: 'threat', message: 'Suspicious login attempt blocked', time: '2 min ago', severity: 'high' },
    { id: 2, type: 'scan', message: 'Repository security scan completed', time: '5 min ago', severity: 'low' },
    { id: 3, type: 'ai', message: 'AI analysis finished for 3 candidates', time: '8 min ago', severity: 'info' },
    { id: 4, type: 'threat', message: 'Malware signature detected and neutralized', time: '12 min ago', severity: 'critical' }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        totalScans: prev.totalScans + Math.floor(Math.random() * 5),
        threatsBlocked: prev.threatsBlocked + (Math.random() > 0.9 ? 1 : 0),
        aiAccuracy: Math.min(99.9, prev.aiAccuracy + Math.random() * 0.1),
        responseTime: Math.max(50, prev.responseTime + (Math.random() - 0.5) * 10)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'threat': return AlertTriangle;
      case 'scan': return Eye;
      case 'ai': return Brain;
      default: return Activity;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Security Dashboard</h1>
            <p className="text-gray-400">Real-time autonomous security monitoring</p>
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-400/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Eye className="h-8 w-8 text-blue-400" />
                <Badge className="bg-blue-500 text-white">+12%</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{metrics.totalScans.toLocaleString()}</div>
              <div className="text-sm text-blue-300">Total Scans</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-600/20 to-red-800/20 border-red-400/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Shield className="h-8 w-8 text-red-400" />
                <Badge className="bg-red-500 text-white">+8%</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{metrics.threatsBlocked}</div>
              <div className="text-sm text-red-300">Threats Blocked</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-400/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Brain className="h-8 w-8 text-green-400" />
                <Badge className="bg-green-500 text-white">+2.1%</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{metrics.aiAccuracy}%</div>
              <div className="text-sm text-green-300">AI Accuracy</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-400/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Zap className="h-8 w-8 text-purple-400" />
                <Badge className="bg-purple-500 text-white">-15ms</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{metrics.responseTime}ms</div>
              <div className="text-sm text-purple-300">Response Time</div>
            </div>
          </Card>
        </div>

        {/* AI Status */}
        <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Cpu className="h-6 w-6 text-green-400 mr-3" />
                <h2 className="text-xl font-semibold text-white">AI Engine Status</h2>
              </div>
              <Badge className="bg-green-500 text-white">Operational</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">Active</div>
                <div className="text-sm text-gray-400">Autonomous Mode</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">24/7</div>
                <div className="text-sm text-gray-400">Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Activity Feed */}
        <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Activity className="h-6 w-6 text-blue-400 mr-3" />
                <h2 className="text-xl font-semibold text-white">Live Activity Feed</h2>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-400">Live</span>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors">
                    <div className={`p-2 rounded-lg ${getSeverityColor(activity.severity)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-white font-medium">{activity.message}</p>
                        <span className="text-sm text-gray-400">{activity.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={`capitalize ${getSeverityColor(activity.severity)}`}>
                          {activity.severity}
                        </Badge>
                        <Badge variant="outline" className="text-blue-400 border-blue-400">
                          {activity.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-24 flex-col">
            <Brain className="h-8 w-8 mb-2" />
            <span className="font-semibold">Start AI Analysis</span>
          </Button>
          
          <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white h-24 flex-col">
            <Shield className="h-8 w-8 mb-2" />
            <span className="font-semibold">Security Scan</span>
          </Button>
          
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-24 flex-col">
            <BarChart3 className="h-8 w-8 mb-2" />
            <span className="font-semibold">View Reports</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
