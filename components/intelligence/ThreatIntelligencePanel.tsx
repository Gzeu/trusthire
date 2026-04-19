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
  ShieldAlert
} from 'lucide-react';
import { Card, Button, Badge, Container, Section, Skeleton } from '@/components/ui/DesignSystem';

interface ThreatFeed {
  id: string;
  name: string;
  source: string;
  type: 'malware' | 'phishing' | 'vulnerability' | 'apt' | 'ransomware';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  timestamp: string;
  description: string;
  indicators: {
    domains: string[];
    ips: string[];
    hashes: string[];
    urls: string[];
  };
  tags: string[];
  affectedSystems: string[];
  mitigation: string[];
  references: string[];
  isActive: boolean;
  isSubscribed: boolean;
}

interface ThreatMap {
  id: string;
  country: string;
  region: string;
  threatCount: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  topThreats: string[];
  lastUpdated: string;
}

interface ThreatTrend {
  date: string;
  threats: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
}

const mockThreatFeeds: ThreatFeed[] = [
  {
    id: '1',
    name: 'APT28 Cyber Espionage Campaign',
    source: 'MISP',
    type: 'apt',
    severity: 'critical',
    confidence: 95,
    timestamp: '2024-03-15T10:30:00Z',
    description: 'Advanced persistent threat group targeting government and military organizations with sophisticated malware and social engineering tactics.',
    indicators: {
      domains: ['malicious-domain.com', 'fake-gov-site.net'],
      ips: ['192.168.1.100', '10.0.0.50'],
      hashes: ['a1b2c3d4e5f6', 'f6e5d4c3b2a1'],
      urls: ['https://malicious-site.com/payload', 'http://fake-update.com']
    },
    tags: ['espionage', 'government', 'military', 'apt28'],
    affectedSystems: ['Windows', 'Linux', 'Network Infrastructure'],
    mitigation: ['Update antivirus signatures', 'Implement network segmentation', 'Enable multi-factor authentication'],
    references: ['https://threat-intel.com/apt28-analysis', 'https://cisa.gov/apt-advisory'],
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
    description: 'New variant of WannaCry ransomware targeting healthcare organizations with encryption of critical patient data.',
    indicators: {
      domains: ['ransomware-c2.com'],
      ips: ['203.0.113.1'],
      hashes: ['b2c3d4e5f6a7'],
      urls: ['https://ransomware-payment.com']
    },
    tags: ['ransomware', 'healthcare', 'encryption', 'wannacry'],
    affectedSystems: ['Windows Servers', 'Medical Devices', 'Database Systems'],
    mitigation: ['Backup critical data', 'Patch SMB vulnerabilities', 'Disable unnecessary services'],
    references: ['https://healthcare-cyber.gov/ransomware'],
    isActive: true,
    isSubscribed: false
  },
  {
    id: '3',
    name: 'Phishing Campaign Targeting Financial Institutions',
    source: 'PhishTank',
    type: 'phishing',
    severity: 'medium',
    confidence: 76,
    timestamp: '2024-03-13T09:15:00Z',
    description: 'Large-scale phishing campaign impersonating major banks to steal credentials and financial information.',
    indicators: {
      domains: ['fake-bank.com', 'phishing-site.net'],
      ips: ['198.51.100.1'],
      hashes: ['c3d4e5f6a7b8'],
      urls: ['https://fake-bank.com/login']
    },
    tags: ['phishing', 'financial', 'credentials', 'banking'],
    affectedSystems: ['Web Applications', 'Email Systems', 'User Devices'],
    mitigation: ['User education', 'Email filtering', 'Multi-factor authentication'],
    references: ['https://anti-phishing.org/campaigns'],
    isActive: false,
    isSubscribed: true
  }
];

const mockThreatMaps: ThreatMap[] = [
  {
    id: '1',
    country: 'United States',
    region: 'North America',
    threatCount: 1247,
    severity: 'high',
    topThreats: ['APT28', 'WannaCry', 'Phishing Campaign'],
    lastUpdated: '2024-03-15T12:00:00Z'
  },
  {
    id: '2',
    country: 'Russia',
    region: 'Eastern Europe',
    threatCount: 892,
    severity: 'critical',
    topThreats: ['APT29', 'Ransomware', 'DDoS'],
    lastUpdated: '2024-03-15T11:30:00Z'
  },
  {
    id: '3',
    country: 'China',
    region: 'Asia',
    threatCount: 756,
    severity: 'high',
    topThreats: ['APT41', 'Supply Chain', 'Espionage'],
    lastUpdated: '2024-03-15T10:45:00Z'
  }
];

const mockThreatTrends: ThreatTrend[] = [
  { date: '2024-03-01', threats: 145, severity: 'medium', category: 'phishing' },
  { date: '2024-03-02', threats: 167, severity: 'high', category: 'malware' },
  { date: '2024-03-03', threats: 189, severity: 'high', category: 'ransomware' },
  { date: '2024-03-04', threats: 134, severity: 'medium', category: 'apt' },
  { date: '2024-03-05', threats: 201, severity: 'critical', category: 'vulnerability' },
  { date: '2024-03-06', threats: 178, severity: 'high', category: 'phishing' },
  { date: '2024-03-07', threats: 156, severity: 'medium', category: 'malware' }
];

export default function ThreatIntelligencePanel() {
  const [threatFeeds, setThreatFeeds] = useState<ThreatFeed[]>(mockThreatFeeds);
  const [threatMaps, setThreatMaps] = useState<ThreatMap[]>(mockThreatMaps);
  const [threatTrends, setThreatTrends] = useState<ThreatTrend[]>(mockThreatTrends);
  const [selectedFeed, setSelectedFeed] = useState<ThreatFeed | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedFeeds, setExpandedFeeds] = useState<Set<string>>(new Set());
  const [showIndicators, setShowIndicators] = useState(true);

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

  const filteredFeeds = useCallback(() => {
    return threatFeeds.filter(feed => {
      const matchesFilter = selectedFilter === 'all' || feed.type === selectedFilter;
      const matchesSearch = searchQuery === '' || 
        feed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feed.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feed.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesFilter && matchesSearch;
    });
  }, [threatFeeds, selectedFilter, searchQuery]);

  const toggleFeedExpansion = useCallback((feedId: string) => {
    const newExpanded = new Set(expandedFeeds);
    if (newExpanded.has(feedId)) {
      newExpanded.delete(feedId);
    } else {
      newExpanded.add(feedId);
    }
    setExpandedFeeds(newExpanded);
  }, [expandedFeeds]);

  const refreshThreatData = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate API call to refresh threat intelligence data
    setTimeout(() => {
      setIsRefreshing(false);
      // In real implementation, this would fetch fresh data from threat intelligence APIs
      console.log('Threat intelligence data refreshed');
    }, 2000);
  }, []);

  const exportThreatData = useCallback(() => {
    const exportData = {
      threatFeeds: filteredFeeds(),
      threatMaps,
      threatTrends,
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
  }, [filteredFeeds, threatMaps, threatTrends, selectedFilter, searchQuery]);

  const subscribeToFeed = useCallback((feedId: string) => {
    setThreatFeeds(prev => prev.map(feed => 
      feed.id === feedId ? { ...feed, isSubscribed: !feed.isSubscribed } : feed
    ));
  }, []);

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
                <span className="text-lg font-mono font-bold text-white">{threatFeeds.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-white/60">Active Threats</span>
                <span className="text-lg font-mono font-bold text-red-400">
                  {threatFeeds.filter(f => f.isActive).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-white/60">Critical Severity</span>
                <span className="text-lg font-mono font-bold text-red-400">
                  {threatFeeds.filter(f => f.severity === 'critical').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-white/60">Subscribed Feeds</span>
                <span className="text-lg font-mono font-bold text-purple-400">
                  {threatFeeds.filter(f => f.isSubscribed).length}
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
              {threatMaps.slice(0, 3).map((map) => (
                <div key={map.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-mono font-semibold text-white">
                        {map.country}
                      </span>
                    </div>
                    <Badge variant={map.severity} className="text-xs">
                      {map.severity}
                    </Badge>
                  </div>
                  <div className="text-xs font-mono text-white/60">
                    {map.threatCount} threats
                  </div>
                </div>
              ))}
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
                  Threat Intelligence Feeds ({filteredFeeds().length})
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
                {filteredFeeds().map((feed) => (
                  <Card
                    key={feed.id}
                    className={`p-6 cursor-pointer transition-all duration-200 ${
                      selectedFeed?.id === feed.id
                        ? 'border-purple-500/50 bg-purple-500/10 scale-105'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                    onClick={() => setSelectedFeed(feed)}
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
                          <Badge variant={feed.severity}>
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
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            subscribeToFeed(feed.id);
                          }}
                        >
                          {feed.isSubscribed ? (
                            <Ban className="w-4 h-4" />
                          ) : (
                            <Bell className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFeedExpansion(feed.id);
                          }}
                        >
                          {expandedFeeds.has(feed.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedFeeds.has(feed.id) && (
                      <div className="border-t border-white/10 pt-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Affected Systems */}
                          <div>
                            <h5 className="text-sm font-mono font-semibold text-white mb-2 flex items-center gap-2">
                              <Server className="w-4 h-4" />
                              Affected Systems
                            </h5>
                            <div className="space-y-1">
                              {feed.affectedSystems.map((system) => (
                                <div key={system} className="text-xs font-mono text-white/60">
                                  {system}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Mitigation */}
                          <div>
                            <h5 className="text-sm font-mono font-semibold text-white mb-2 flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Mitigation
                            </h5>
                            <div className="space-y-1">
                              {feed.mitigation.map((step) => (
                                <div key={step} className="text-xs font-mono text-white/60">
                                  {step}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Indicators */}
                        {showIndicators && (
                          <div className="mt-4">
                            <h5 className="text-sm font-mono font-semibold text-white mb-2 flex items-center gap-2">
                              <Hash className="w-4 h-4" />
                              Indicators of Compromise
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {Object.entries(feed.indicators).map(([key, values]) => (
                                <div key={key}>
                                  <h6 className="text-xs font-mono font-semibold text-white/80 mb-1">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                  </h6>
                                  <div className="space-y-1">
                                    {values.map((value) => (
                                      <div key={value} className="text-xs font-mono text-white/60 font-mono">
                                        {value}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* References */}
                        <div className="mt-4">
                          <h5 className="text-sm font-mono font-semibold text-white mb-2 flex items-center gap-2">
                            <Link className="w-4 h-4" />
                            References
                          </h5>
                          <div className="space-y-1">
                            {feed.references.map((ref) => (
                              <div key={ref} className="text-xs font-mono text-blue-400">
                                {ref}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Selected Feed Details */}
            {selectedFeed && (
              <Card className="p-6">
                <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Threat Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-mono font-semibold text-white mb-2">
                      {selectedFeed.name}
                    </h4>
                    <p className="text-sm font-mono text-white/60 mb-3">
                      {selectedFeed.description}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={selectedFeed.severity}>
                        {selectedFeed.severity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {selectedFeed.confidence}% confidence
                      </Badge>
                    </div>
                  </div>

                  {/* Quick Actions */}
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
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Threat Intel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Threat Trends */}
            <Card className="p-6">
              <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Threat Trends (7 Days)
              </h3>
              <div className="space-y-3">
                {threatTrends.map((trend) => (
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
                      <Badge variant={trend.severity} className="text-xs">
                        {trend.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
