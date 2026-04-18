'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Globe, 
  Activity, 
  BarChart3, 
  PieChart, 
  Calendar,
  Eye,
  MousePointer,
  Download,
  Share2,
  Zap,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  Filter,
  RefreshCw,
  Settings,
  FileText
} from 'lucide-react';

interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
  averageSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  retentionRate: number;
}

interface PageMetrics {
  pageViews: number;
  uniquePageViews: number;
  avgTimeOnPage: number;
  exitRate: number;
  topPages: Array<{
    path: string;
    views: number;
    avgTime: number;
    bounceRate: number;
  }>;
}

interface ScanMetrics {
  totalScans: number;
  successfulScans: number;
  failedScans: number;
  avgScanTime: number;
  scanTypes: Record<string, number>;
  scanFrequency: Array<{
    date: string;
    count: number;
  }>;
}

interface UserBehavior {
  clickEvents: number;
  formSubmissions: number;
  downloads: number;
  shares: number;
  featureUsage: Record<string, number>;
  userJourney: Array<{
    step: string;
    users: number;
    dropoffRate: number;
  }>;
}

export default function UserAnalytics() {
  const [timeRange, setTimeRange] = useState<'1d' | '7d' | '30d' | '90d'>('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [userMetrics, setUserMetrics] = useState<UserMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    returningUsers: 0,
    averageSessionDuration: 0,
    bounceRate: 0,
    conversionRate: 0,
    retentionRate: 0
  });
  const [pageMetrics, setPageMetrics] = useState<PageMetrics>({
    pageViews: 0,
    uniquePageViews: 0,
    avgTimeOnPage: 0,
    exitRate: 0,
    topPages: []
  });
  const [scanMetrics, setScanMetrics] = useState<ScanMetrics>({
    totalScans: 0,
    successfulScans: 0,
    failedScans: 0,
    avgScanTime: 0,
    scanTypes: {},
    scanFrequency: []
  });
  const [userBehavior, setUserBehavior] = useState<UserBehavior>({
    clickEvents: 0,
    formSubmissions: 0,
    downloads: 0,
    shares: 0,
    featureUsage: {},
    userJourney: []
  });

  // Generate mock analytics data
  useEffect(() => {
    const generateMockData = () => {
      const baseUsers = 1000;
      const multiplier = timeRange === '1d' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      
      setUserMetrics({
        totalUsers: baseUsers * multiplier,
        activeUsers: Math.floor(baseUsers * multiplier * 0.3),
        newUsers: Math.floor(baseUsers * multiplier * 0.1),
        returningUsers: Math.floor(baseUsers * multiplier * 0.2),
        averageSessionDuration: 180 + Math.random() * 120, // 3-5 minutes
        bounceRate: 25 + Math.random() * 15, // 25-40%
        conversionRate: 15 + Math.random() * 10, // 15-25%
        retentionRate: 70 + Math.random() * 20 // 70-90%
      });

      setPageMetrics({
        pageViews: baseUsers * multiplier * 3,
        uniquePageViews: baseUsers * multiplier * 2,
        avgTimeOnPage: 45 + Math.random() * 30, // 45-75 seconds
        exitRate: 20 + Math.random() * 10, // 20-30%
        topPages: [
          { path: '/', views: baseUsers * multiplier * 1.5, avgTime: 120, bounceRate: 20 },
          { path: '/scan/github', views: baseUsers * multiplier * 0.8, avgTime: 180, bounceRate: 15 },
          { path: '/scan/linkedin', views: baseUsers * multiplier * 0.6, avgTime: 150, bounceRate: 25 },
          { path: '/assess', views: baseUsers * multiplier * 0.4, avgTime: 300, bounceRate: 10 },
          { path: '/patterns', views: baseUsers * multiplier * 0.3, avgTime: 90, bounceRate: 35 }
        ]
      });

      setScanMetrics({
        totalScans: baseUsers * multiplier * 0.5,
        successfulScans: Math.floor(baseUsers * multiplier * 0.45),
        failedScans: Math.floor(baseUsers * multiplier * 0.05),
        avgScanTime: 15 + Math.random() * 10, // 15-25 seconds
        scanTypes: {
          github: Math.floor(baseUsers * multiplier * 0.2),
          linkedin: Math.floor(baseUsers * multiplier * 0.15),
          image: Math.floor(baseUsers * multiplier * 0.08),
          forms: Math.floor(baseUsers * multiplier * 0.05),
          url: Math.floor(baseUsers * multiplier * 0.02)
        },
        scanFrequency: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          count: Math.floor(baseUsers * multiplier * 0.07 * (0.5 + Math.random()))
        }))
      });

      setUserBehavior({
        clickEvents: baseUsers * multiplier * 5,
        formSubmissions: Math.floor(baseUsers * multiplier * 0.3),
        downloads: Math.floor(baseUsers * multiplier * 0.1),
        shares: Math.floor(baseUsers * multiplier * 0.05),
        featureUsage: {
          'quickScan': Math.floor(baseUsers * multiplier * 0.4),
          'fullAssessment': Math.floor(baseUsers * multiplier * 0.15),
          'patternSearch': Math.floor(baseUsers * multiplier * 0.1),
          'monitoring': Math.floor(baseUsers * multiplier * 0.05),
          'export': Math.floor(baseUsers * multiplier * 0.02)
        },
        userJourney: [
          { step: 'Homepage', users: baseUsers * multiplier, dropoffRate: 0 },
          { step: 'Quick Scan', users: baseUsers * multiplier * 0.7, dropoffRate: 30 },
          { step: 'View Results', users: baseUsers * multiplier * 0.5, dropoffRate: 28 },
          { step: 'Export Results', users: baseUsers * multiplier * 0.15, dropoffRate: 70 },
          { step: 'Full Assessment', users: baseUsers * multiplier * 0.08, dropoffRate: 47 }
        ]
      });
    };

    generateMockData();
  }, [timeRange]);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Data would be refetched here
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exportAnalytics = useCallback(() => {
    const data = {
      userMetrics,
      pageMetrics,
      scanMetrics,
      userBehavior,
      timeRange,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trusthire-analytics-${timeRange}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [userMetrics, pageMetrics, scanMetrics, userBehavior, timeRange]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const getChangeIndicator = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    if (change > 0) return { value: `+${change.toFixed(1)}%`, color: 'text-green-400' };
    if (change < 0) return { value: `${change.toFixed(1)}%`, color: 'text-red-400' };
    return { value: '0%', color: 'text-gray-400' };
  };

  return (
    <div className="bg-[#111113] border border-white/5 rounded-2xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-mono text-white">User Analytics</h3>
            <p className="text-sm text-white/60 font-mono">Real-time user behavior and engagement metrics</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:bg-white/5 disabled:opacity-50 text-white font-mono text-sm rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-mono text-sm rounded-xl transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* User Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-white/60 font-mono">Total Users</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{formatNumber(userMetrics.totalUsers)}</div>
          <div className="text-xs text-green-400 font-mono">+12.5% from last period</div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-xs text-white/60 font-mono">Active Users</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{formatNumber(userMetrics.activeUsers)}</div>
          <div className="text-xs text-green-400 font-mono">+8.3% from last period</div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-white/60 font-mono">Avg Session</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{formatDuration(userMetrics.averageSessionDuration)}</div>
          <div className="text-xs text-red-400 font-mono">-2.1% from last period</div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-white/60 font-mono">Conversion Rate</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{userMetrics.conversionRate.toFixed(1)}%</div>
          <div className="text-xs text-green-400 font-mono">+5.7% from last period</div>
        </div>
      </div>

      {/* Scan Analytics */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold font-mono text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-400" />
          Scan Analytics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-xl p-6">
            <h5 className="font-semibold font-mono text-white mb-4">Scan Overview</h5>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 font-mono">Total Scans</span>
                <span className="text-sm font-mono text-white">{formatNumber(scanMetrics.totalScans)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 font-mono">Success Rate</span>
                <span className="text-sm font-mono text-green-400">
                  {((scanMetrics.successfulScans / scanMetrics.totalScans) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 font-mono">Avg Scan Time</span>
                <span className="text-sm font-mono text-white">{formatDuration(scanMetrics.avgScanTime)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-6">
            <h5 className="font-semibold font-mono text-white mb-4">Scan Types Distribution</h5>
            <div className="space-y-2">
              {Object.entries(scanMetrics.scanTypes).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-white/60 font-mono capitalize">{type}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-white/10 rounded-full h-2">
                      <div 
                        className="h-full bg-orange-400 rounded-full"
                        style={{ width: `${(count / scanMetrics.totalScans) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono text-white">{formatNumber(count)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User Journey */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold font-mono text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-400" />
          User Journey Analysis
        </h4>
        <div className="bg-white/5 rounded-xl p-6">
          <div className="space-y-4">
            {userBehavior.userJourney.map((step, index) => (
              <div key={step.step} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-400 font-mono text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-white">{step.step}</span>
                    <span className="text-sm text-white/60 font-mono">
                      {formatNumber(step.users)} users ({((step.users / userBehavior.userJourney[0].users) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div 
                        className="h-full bg-blue-400 rounded-full"
                        style={{ width: `${(step.users / userBehavior.userJourney[0].users) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/60 font-mono">
                      Dropoff: {step.dropoffRate}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Usage */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold font-mono text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-400" />
          Feature Usage
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-xl p-6">
            <h5 className="font-semibold font-mono text-white mb-4">Most Used Features</h5>
            <div className="space-y-3">
              {Object.entries(userBehavior.featureUsage)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([feature, count]) => (
                  <div key={feature} className="flex justify-between items-center">
                    <span className="text-sm text-white/60 font-mono capitalize">{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-sm font-mono text-white">{formatNumber(count)}</span>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-6">
            <h5 className="font-semibold font-mono text-white mb-4">User Actions</h5>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 font-mono flex items-center gap-2">
                  <MousePointer className="w-3 h-3" />
                  Click Events
                </span>
                <span className="text-sm font-mono text-white">{formatNumber(userBehavior.clickEvents)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 font-mono flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  Form Submissions
                </span>
                <span className="text-sm font-mono text-white">{formatNumber(userBehavior.formSubmissions)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 font-mono flex items-center gap-2">
                  <Download className="w-3 h-3" />
                  Downloads
                </span>
                <span className="text-sm font-mono text-white">{formatNumber(userBehavior.downloads)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 font-mono flex items-center gap-2">
                  <Share2 className="w-3 h-3" />
                  Shares
                </span>
                <span className="text-sm font-mono text-white">{formatNumber(userBehavior.shares)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold font-mono text-white mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-green-400" />
          Top Pages
        </h4>
        <div className="bg-white/5 rounded-xl p-6">
          <div className="space-y-3">
            {pageMetrics.topPages.map((page, index) => (
              <div key={page.path} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center">
                    <span className="text-green-400 font-mono text-xs">{index + 1}</span>
                  </div>
                  <div>
                    <span className="font-mono text-white">{page.path}</span>
                    <div className="text-xs text-white/60 font-mono">
                      {formatNumber(page.views)} views · {formatDuration(page.avgTime)} avg
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono text-white">{page.bounceRate.toFixed(1)}%</div>
                  <div className="text-xs text-white/60 font-mono">bounce rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
        <h4 className="text-lg font-semibold font-mono text-white mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-400" />
          Key Insights
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <div>
              <p className="text-sm font-mono text-white">High user engagement</p>
              <p className="text-xs text-white/60 font-mono">Users spend an average of {formatDuration(userMetrics.averageSessionDuration)} on the platform</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-sm font-mono text-white">Drop-off at export stage</p>
              <p className="text-xs text-white/60 font-mono">70% of users drop off when attempting to export results</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <div>
              <p className="text-sm font-mono text-white">Popular scan types</p>
              <p className="text-xs text-white/60 font-mono">GitHub scans account for 40% of all scan activities</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-sm font-mono text-white">Low conversion to full assessment</p>
              <p className="text-xs text-white/60 font-mono">Only 8% of users proceed to full assessment after quick scan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
