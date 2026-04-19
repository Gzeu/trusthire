'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Globe, 
  Database, 
  Activity, 
  Filter,
  Search,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Clock,
  MapPin,
  Target,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  ChevronRight,
  ChevronDown,
  Calendar,
  Hash,
  Link,
  FileText,
  Cpu,
  Server,
  Wifi,
  Lock,
  Unlock,
  Ban,
  ShieldAlert,
  Bell
} from 'lucide-react';
import { Card, Button, Badge, Container, Section, Skeleton } from '@/components/ui/DesignSystem';

export default function ThreatIntelligencePanel() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showIndicators, setShowIndicators] = useState(true);

  const mockThreatFeeds = [
    {
      id: '1',
      name: 'APT28 Cyber Espionage Campaign',
      source: 'MISP',
      type: 'apt',
      severity: 'critical',
      confidence: 95,
      timestamp: '2024-03-15T10:30:00Z',
      description: 'Advanced persistent threat group targeting government organizations.',
      tags: ['espionage', 'government', 'apt28'],
      isActive: true,
      isSubscribed: true
    },
    {
      id: '2',
      name: 'WannaCry Ransomware Variant',
      source: 'VirusTotal',
      type: 'ransomware',
      severity: 'high',
      confidence: 88,
      timestamp: '2024-03-14T15:45:00Z',
      description: 'New variant targeting healthcare organizations with encryption.',
      tags: ['ransomware', 'healthcare', 'encryption'],
      isActive: true,
      isSubscribed: false
    },
    {
      id: '3',
      name: 'Phishing Campaign Targeting Banks',
      source: 'PhishTank',
      type: 'phishing',
      severity: 'medium',
      confidence: 76,
      timestamp: '2024-03-13T09:15:00Z',
      description: 'Large-scale phishing campaign impersonating major banks.',
      tags: ['phishing', 'financial', 'credentials'],
      isActive: false,
      isSubscribed: true
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/25';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/25';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/25';
      case 'low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/25';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'malware': return <Cpu className="w-4 h-4" />;
      case 'phishing': return <Globe className="w-4 h-4" />;
      case 'vulnerability': return <ShieldAlert className="w-4 h-4" />;
      case 'apt': return <Target className="w-4 h-4" />;
      case 'ransomware': return <Lock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'malware': return 'text-purple-400 bg-purple-500/10 border-purple-500/25';
      case 'phishing': return 'text-blue-400 bg-blue-500/10 border-blue-500/25';
      case 'vulnerability': return 'text-orange-400 bg-orange-500/10 border-orange-500/25';
      case 'apt': return 'text-red-400 bg-red-500/10 border-red-500/25';
      case 'ransomware': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/25';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/25';
    }
  };

  const refreshThreatData = useCallback(async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      console.log('Threat intelligence data refreshed');
    }, 2000);
  }, []);

  const exportThreatData = useCallback(() => {
    const exportData = {
      threatFeeds: mockThreatFeeds,
      exportedAt: new Date().toISOString(),
      filters: {
        type: selectedFilter,
        search: searchQuery
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat-intelligence-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [selectedFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Container size="lg" className="py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-purple-500" />
            <Badge variant="info" className="animate-pulse">
              THREAT INTELLIGENCE
            </Badge>
          </div>
          <h1 className="text-4xl font-mono font-bold text-white mb-4">
            Enhanced Threat Intelligence Integration
          </h1>
          <p className="text-lg font-mono text-white/60 max-w-3xl">
            Real-time threat intelligence feeds from multiple sources with advanced analytics,
            geographic mapping, and automated threat detection capabilities.
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Search and Filter */}
          <Card className="p-6">
            <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search & Filter
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search threats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#111113] border border-white/10 rounded-xl text-white font-mono text-sm placeholder-white/40 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {['all', 'malware', 'phishing', 'vulnerability', 'apt', 'ransomware'].map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedFilter === filter ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedFilter(filter)}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Threat Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-white/60">Total Threats</span>
                <span className="text-lg font-mono font-bold text-white">{mockThreatFeeds.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-white/60">Active Threats</span>
                <span className="text-lg font-mono font-bold text-red-400">
                  {mockThreatFeeds.filter(f => f.isActive).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-white/60">Critical Severity</span>
                <span className="text-lg font-mono font-bold text-red-400">
                  {mockThreatFeeds.filter(f => f.severity === 'critical').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-white/60">Subscribed Feeds</span>
                <span className="text-lg font-mono font-bold text-purple-400">
                  {mockThreatFeeds.filter(f => f.isSubscribed).length}
                </span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Actions
            </h3>
            <div className="space-y-3">
              <Button
                onClick={refreshThreatData}
                disabled={isRefreshing}
                className="w-full"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              <Button
                onClick={exportThreatData}
                variant="secondary"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button
                onClick={() => setShowIndicators(!showIndicators)}
                variant="ghost"
                className="w-full"
              >
                {showIndicators ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showIndicators ? 'Hide Indicators' : 'Show Indicators'}
              </Button>
            </div>
          </Card>

          {/* Geographic Overview */}
          <Card className="p-6">
            <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Geographic Threats
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-mono font-semibold text-white">
                      United States
                    </span>
                  </div>
                  <Badge variant="high" className="text-xs">
                    High
                  </Badge>
                </div>
                <div className="text-xs font-mono text-white/60">
                  1,247 threats
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-mono font-semibold text-white">
                      Russia
                    </span>
                  </div>
                  <Badge variant="error" className="text-xs">
                    Critical
                  </Badge>
                </div>
                <div className="text-xs font-mono text-white/60">
                  892 threats
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Threat Feeds */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Threat Intelligence Feeds ({mockThreatFeeds.length})
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="info" className="animate-pulse">
                    LIVE
                  </Badge>
                  <span className="text-xs font-mono text-white/40">
                    Last updated: {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Feeds List */}
              <div className="space-y-4">
                {mockThreatFeeds.map((feed) => (
                  <Card
                    key={feed.id}
                    className="p-6 cursor-pointer transition-all duration-200 border-white/10 bg-white/5 hover:border-white/20"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${getTypeColor(feed.type)}`}>
                            {getTypeIcon(feed.type)}
                          </div>
                          <div>
                            <h4 className="font-mono font-semibold text-white mb-1">
                              {feed.name}
                            </h4>
                            <p className="text-sm font-mono text-white/60">
                              {feed.source} - {new Date(feed.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-mono text-white/80 mb-3">
                          {feed.description}
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant={feed.severity === 'critical' ? 'error' : feed.severity === 'high' ? 'warning' : feed.severity === 'medium' ? 'default' : 'success'}>
                            {feed.severity}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {feed.confidence}% confidence
                          </Badge>
                          {feed.isActive && (
                            <Badge variant="success" className="animate-pulse">
                              ACTIVE
                            </Badge>
                          )}
                          {feed.isSubscribed && (
                            <Badge variant="info">
                              SUBSCRIBED
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {feed.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Threat Trends */}
            <Card className="p-6">
              <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Threat Trends (7 Days)
              </h3>
              <div className="space-y-3">
                {[
                  { date: '2024-03-15', category: 'phishing', threats: 145, severity: 'medium' },
                  { date: '2024-03-14', category: 'malware', threats: 167, severity: 'high' },
                  { date: '2024-03-13', category: 'ransomware', threats: 189, severity: 'high' },
                  { date: '2024-03-12', category: 'apt', threats: 134, severity: 'medium' },
                  { date: '2024-03-11', category: 'vulnerability', threats: 201, severity: 'critical' }
                ].map((trend) => (
                  <div key={trend.date} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${getSeverityColor(trend.severity)}`} />
                      <div>
                        <div className="text-sm font-mono font-semibold text-white">
                          {trend.category}
                        </div>
                        <div className="text-xs font-mono text-white/40">
                          {new Date(trend.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-white">
                        {trend.threats}
                      </div>
                      <Badge variant={trend.severity === 'critical' ? 'error' : trend.severity === 'high' ? 'warning' : trend.severity === 'medium' ? 'default' : 'success'} className="text-xs">
                        {trend.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button className="w-full">
                  <Target className="w-4 h-4 mr-2" />
                  Create Alert Rule
                </Button>
                <Button variant="secondary" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="ghost" className="w-full">
                  <Bell className="w-4 h-4 mr-2" />
                  Share Threat Intel
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
