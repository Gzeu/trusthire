// Analytics Dashboard Component
// Comprehensive analytics dashboard with charts and metrics

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Download,
  Calendar,
  Filter,
  AlertTriangle,
  CheckSquare
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

interface DashboardMetrics {
  overview: {
    totalScans: number;
    activeUsers: number;
    avgScanDuration: number;
    successRate: number;
  };
  trends: {
    dailyScans: Array<{ date: string; count: number }>;
    scanTypes: Array<{ type: string; count: number }>;
    userGrowth: Array<{ date: string; users: number }>;
  };
  performance: {
    apiResponseTime: number;
    cacheHitRate: number;
    errorRate: number;
    systemHealth: 'healthy' | 'warning' | 'critical';
  };
}

interface MetricCard {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
  description: string;
}

const AnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard metrics
  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/analytics/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Refresh metrics
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMetrics();
  }, [fetchMetrics]);

  // Export data
  const handleExport = useCallback(async () => {
    try {
      const response = await fetch('/api/analytics/export');
      if (!response.ok) {
        throw new Error('Failed to export data');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to export data:', err);
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  // Format metrics for display
  const formatMetricCards = useCallback((): MetricCard[] => {
    if (!metrics) return [];

    const { overview, performance } = metrics;

    return [
      {
        title: 'Total Scans',
        value: overview.totalScans.toLocaleString(),
        change: 12.5, // Mock change - would come from comparison data
        changeType: 'increase',
        icon: <Activity className="w-5 h-5" />,
        color: 'blue',
        description: 'Scans completed in selected period'
      },
      {
        title: 'Active Users',
        value: overview.activeUsers.toLocaleString(),
        change: 8.2,
        changeType: 'increase',
        icon: <Users className="w-5 h-5" />,
        color: 'green',
        description: 'Unique users in selected period'
      },
      {
        title: 'Avg Duration',
        value: `${(overview.avgScanDuration / 1000).toFixed(1)}s`,
        change: -5.3,
        changeType: 'decrease',
        icon: <Clock className="w-5 h-5" />,
        color: 'yellow',
        description: 'Average scan completion time'
      },
      {
        title: 'Success Rate',
        value: `${overview.successRate.toFixed(1)}%`,
        change: 2.1,
        changeType: 'increase',
        icon: <CheckCircle className="w-5 h-5" />,
        color: 'emerald',
        description: 'Percentage of successful scans'
      }
    ];
  }, [metrics]);

  // Get system health status
  const getSystemHealthStatus = useCallback(() => {
    if (!metrics) return null;

    const { performance } = metrics;
    const statusConfig = {
      healthy: { color: 'text-green-600', bg: 'bg-green-100', icon: CheckSquare },
      warning: { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: AlertTriangle },
      critical: { color: 'text-red-600', bg: 'bg-red-100', icon: XCircle }
    };

    const config = statusConfig[performance.systemHealth];
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {performance.systemHealth.charAt(0).toUpperCase() + performance.systemHealth.slice(1)}
      </div>
    );
  }, [metrics]);

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 mb-2">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const metricCards = formatMetricCards();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor your security scanning performance and user engagement</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Time Range Selector */}
            <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                  timeRange === '7d' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  timeRange === '30d' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeRange('90d')}
                className={`px-3 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                  timeRange === '90d' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                90 Days
              </button>
            </div>

            {/* Actions */}
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* System Health Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {getSystemHealthStatus()}
            <div className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 bg-${card.color}-100 rounded-lg text-${card.color}-600`}>
                {card.icon}
              </div>
              {card.change && (
                <div className={`flex items-center text-sm font-medium ${
                  card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.changeType === 'increase' ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(card.change)}%
                </div>
              )}
            </div>
            
            <div className="mb-2">
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <div className="text-sm text-gray-600">{card.title}</div>
            </div>
            
            <div className="text-xs text-gray-500">{card.description}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Scans Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Scans</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={metrics?.trends.dailyScans || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value) => [value, 'Scans']}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Scan Types Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metrics?.trends.scanTypes || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent, name }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {(metrics?.trends.scanTypes || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Scans']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics?.trends.userGrowth || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value) => [value, 'Users']}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">API Response Time</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {metrics?.performance.apiResponseTime}ms
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Cache Hit Rate</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {metrics?.performance.cacheHitRate}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Error Rate</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {metrics?.performance.errorRate}%
              </span>
            </div>

            {/* Performance Bars */}
            <div className="pt-4 border-t border-gray-200">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Response Time</span>
                    <span className="text-gray-900">{metrics?.performance.apiResponseTime}ms</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${Math.min((metrics?.performance.apiResponseTime || 0) / 10, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Cache Hit Rate</span>
                    <span className="text-gray-900">{metrics?.performance.cacheHitRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${metrics?.performance.cacheHitRate || 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Error Rate</span>
                    <span className="text-gray-900">{metrics?.performance.errorRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${metrics?.performance.errorRate || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
