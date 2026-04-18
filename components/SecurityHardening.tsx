'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  Lock, 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Globe, 
  Ban,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Zap,
  Activity,
  Database,
  Wifi,
  Server,
  FileText
} from 'lucide-react';

interface SecurityConfig {
  rateLimiting: {
    enabled: boolean;
    requestsPerMinute: number;
    burstLimit: number;
    blockDuration: number;
  };
  authentication: {
    requireAuth: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
  };
  dataProtection: {
    encryptionEnabled: boolean;
    dataRetention: number;
    anonymizeData: boolean;
    gdprCompliant: boolean;
  };
  apiSecurity: {
    requireApiKey: boolean;
    corsEnabled: boolean;
    allowedOrigins: string[];
    rateLimitPerIP: number;
  };
  monitoring: {
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    alertThreshold: number;
    enableRealTimeAlerts: boolean;
    retentionDays: number;
  };
}

interface SecurityEvent {
  id: string;
  type: 'rate_limit' | 'auth_failure' | 'suspicious_activity' | 'data_breach' | 'system_alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  source: string;
  description: string;
  details: any;
  resolved: boolean;
}

interface SecurityMetrics {
  totalRequests: number;
  blockedRequests: number;
  activeSessions: number;
  securityScore: number;
  threatsBlocked: number;
  uptime: number;
}

export default function SecurityHardening() {
  const [config, setConfig] = useState<SecurityConfig>({
    rateLimiting: {
      enabled: true,
      requestsPerMinute: 100,
      burstLimit: 150,
      blockDuration: 300
    },
    authentication: {
      requireAuth: true,
      sessionTimeout: 3600,
      maxLoginAttempts: 5,
      lockoutDuration: 900
    },
    dataProtection: {
      encryptionEnabled: true,
      dataRetention: 90,
      anonymizeData: true,
      gdprCompliant: true
    },
    apiSecurity: {
      requireApiKey: true,
      corsEnabled: true,
      allowedOrigins: ['https://trusthire-five.vercel.app'],
      rateLimitPerIP: 50
    },
    monitoring: {
      logLevel: 'info',
      alertThreshold: 80,
      enableRealTimeAlerts: true,
      retentionDays: 30
    }
  });

  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalRequests: 0,
    blockedRequests: 0,
    activeSessions: 0,
    securityScore: 95,
    threatsBlocked: 0,
    uptime: 99.9
  });

  const [isConfiguring, setIsConfiguring] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'config' | 'events' | 'metrics'>('config');

  // Generate mock security events
  useEffect(() => {
    const mockEvents: SecurityEvent[] = [
      {
        id: 'evt_1',
        type: 'rate_limit',
        severity: 'medium',
        timestamp: Date.now() - 300000,
        source: '192.168.1.100',
        description: 'Rate limit exceeded for IP address',
        details: { requests: 125, limit: 100, duration: '1 minute' },
        resolved: true
      },
      {
        id: 'evt_2',
        type: 'auth_failure',
        severity: 'high',
        timestamp: Date.now() - 600000,
        source: 'user@example.com',
        description: 'Multiple failed login attempts',
        details: { attempts: 6, maxAllowed: 5, lockout: true },
        resolved: false
      },
      {
        id: 'evt_3',
        type: 'suspicious_activity',
        severity: 'medium',
        timestamp: Date.now() - 900000,
        source: 'api/scanner',
        description: 'Unusual scan pattern detected',
        details: { scans: 50, timeWindow: '5 minutes', pattern: 'repetitive' },
        resolved: true
      }
    ];

    setEvents(mockEvents);

    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 10),
        blockedRequests: prev.blockedRequests + (Math.random() > 0.9 ? 1 : 0),
        activeSessions: Math.max(0, prev.activeSessions + (Math.random() > 0.8 ? 1 : -1)),
        securityScore: Math.max(80, Math.min(100, prev.securityScore + (Math.random() - 0.5) * 2)),
        threatsBlocked: prev.threatsBlocked + (Math.random() > 0.95 ? 1 : 0)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateConfig = useCallback((section: keyof SecurityConfig, updates: Partial<SecurityConfig[keyof SecurityConfig]>) => {
    setConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
  }, []);

  const applySecurityConfig = useCallback(async () => {
    setIsConfiguring(true);
    
    try {
      // Simulate API call to apply security configuration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      alert('Security configuration applied successfully!');
    } catch (error) {
      console.error('Failed to apply security config:', error);
      alert('Failed to apply security configuration');
    } finally {
      setIsConfiguring(false);
    }
  }, []);

  const resetToDefaults = useCallback(() => {
    setConfig({
      rateLimiting: {
        enabled: true,
        requestsPerMinute: 100,
        burstLimit: 150,
        blockDuration: 300
      },
      authentication: {
        requireAuth: true,
        sessionTimeout: 3600,
        maxLoginAttempts: 5,
        lockoutDuration: 900
      },
      dataProtection: {
        encryptionEnabled: true,
        dataRetention: 90,
        anonymizeData: true,
        gdprCompliant: true
      },
      apiSecurity: {
        requireApiKey: true,
        corsEnabled: true,
        allowedOrigins: ['https://trusthire-five.vercel.app'],
        rateLimitPerIP: 50
      },
      monitoring: {
        logLevel: 'info',
        alertThreshold: 80,
        enableRealTimeAlerts: true,
        retentionDays: 30
      }
    });
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'rate_limit': return Zap;
      case 'auth_failure': return Key;
      case 'suspicious_activity': return AlertTriangle;
      case 'data_breach': return Database;
      case 'system_alert': return Server;
      default: return Shield;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="bg-[#111113] border border-white/5 rounded-2xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-mono text-white">Security Hardening</h3>
            <p className="text-sm text-white/60 font-mono">Advanced security configuration and monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-mono text-sm rounded-xl transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={applySecurityConfig}
            disabled={isConfiguring}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 text-white font-mono text-sm rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
          >
            {isConfiguring ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Apply Config
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { id: 'config', label: 'Configuration', icon: Settings },
          { id: 'events', label: 'Security Events', icon: AlertTriangle },
          { id: 'metrics', label: 'Metrics', icon: Activity }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm transition-all duration-200
                ${isActive 
                  ? 'bg-red-600 text-white' 
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

      {/* Configuration Tab */}
      {selectedTab === 'config' && (
        <div className="space-y-6">
          {/* Rate Limiting */}
          <div className="bg-white/5 rounded-xl p-6">
            <h4 className="text-lg font-semibold font-mono text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              Rate Limiting
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-mono text-white/70">Enable Rate Limiting</label>
                <input
                  type="checkbox"
                  checked={config.rateLimiting.enabled}
                  onChange={(e) => updateConfig('rateLimiting', { enabled: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-mono text-white/70">Requests/Minute</label>
                <input
                  type="number"
                  value={config.rateLimiting.requestsPerMinute}
                  onChange={(e) => updateConfig('rateLimiting', { requestsPerMinute: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white font-mono text-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-mono text-white/70">Burst Limit</label>
                <input
                  type="number"
                  value={config.rateLimiting.burstLimit}
                  onChange={(e) => updateConfig('rateLimiting', { burstLimit: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white font-mono text-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-mono text-white/70">Block Duration (s)</label>
                <input
                  type="number"
                  value={config.rateLimiting.blockDuration}
                  onChange={(e) => updateConfig('rateLimiting', { blockDuration: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Authentication */}
          <div className="bg-white/5 rounded-xl p-6">
            <h4 className="text-lg font-semibold font-mono text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-green-400" />
              Authentication
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-mono text-white/70">Require Authentication</label>
                <input
                  type="checkbox"
                  checked={config.authentication.requireAuth}
                  onChange={(e) => updateConfig('authentication', { requireAuth: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-mono text-white/70">Session Timeout (s)</label>
                <input
                  type="number"
                  value={config.authentication.sessionTimeout}
                  onChange={(e) => updateConfig('authentication', { sessionTimeout: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white font-mono text-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-mono text-white/70">Max Login Attempts</label>
                <input
                  type="number"
                  value={config.authentication.maxLoginAttempts}
                  onChange={(e) => updateConfig('authentication', { maxLoginAttempts: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white font-mono text-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-mono text-white/70">Lockout Duration (s)</label>
                <input
                  type="number"
                  value={config.authentication.lockoutDuration}
                  onChange={(e) => updateConfig('authentication', { lockoutDuration: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="bg-white/5 rounded-xl p-6">
            <h4 className="text-lg font-semibold font-mono text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              Data Protection
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-mono text-white/70">Enable Encryption</label>
                <input
                  type="checkbox"
                  checked={config.dataProtection.encryptionEnabled}
                  onChange={(e) => updateConfig('dataProtection', { encryptionEnabled: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-mono text-white/70">Data Retention (days)</label>
                <input
                  type="number"
                  value={config.dataProtection.dataRetention}
                  onChange={(e) => updateConfig('dataProtection', { dataRetention: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white font-mono text-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-mono text-white/70">Anonymize Data</label>
                <input
                  type="checkbox"
                  checked={config.dataProtection.anonymizeData}
                  onChange={(e) => updateConfig('dataProtection', { anonymizeData: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-mono text-white/70">GDPR Compliant</label>
                <input
                  type="checkbox"
                  checked={config.dataProtection.gdprCompliant}
                  onChange={(e) => updateConfig('dataProtection', { gdprCompliant: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
              </div>
            </div>
          </div>

          {/* API Security */}
          <div className="bg-white/5 rounded-xl p-6">
            <h4 className="text-lg font-semibold font-mono text-white mb-4 flex items-center gap-2">
              <Wifi className="w-5 h-5 text-orange-400" />
              API Security
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-mono text-white/70">Require API Key</label>
                <input
                  type="checkbox"
                  checked={config.apiSecurity.requireApiKey}
                  onChange={(e) => updateConfig('apiSecurity', { requireApiKey: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-mono text-white/70">Enable CORS</label>
                <input
                  type="checkbox"
                  checked={config.apiSecurity.corsEnabled}
                  onChange={(e) => updateConfig('apiSecurity', { corsEnabled: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-mono text-white/70">Rate Limit/IP</label>
                <input
                  type="number"
                  value={config.apiSecurity.rateLimitPerIP}
                  onChange={(e) => updateConfig('apiSecurity', { rateLimitPerIP: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white font-mono text-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-mono text-white/70">API Key</label>
                <div className="flex items-center gap-2">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value="sk_live_1234567890abcdef"
                    readOnly
                    className="w-32 px-2 py-1 bg-white/10 border border-white/20 rounded text-white font-mono text-sm"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-1 text-white/60 hover:text-white"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Events Tab */}
      {selectedTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold font-mono text-white">Recent Security Events</h4>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60 font-mono">Total Events: {events.length}</span>
              <span className="text-sm text-white/60 font-mono">Unresolved: {events.filter(e => !e.resolved).length}</span>
            </div>
          </div>
          
          {events.map((event) => {
            const Icon = getEventIcon(event.type);
            return (
              <div key={event.id} className={`p-4 rounded-xl border ${getSeverityColor(event.severity)}`}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold font-mono text-white">{event.description}</h5>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-1 rounded border">
                          {event.severity.toUpperCase()}
                        </span>
                        {event.resolved && (
                          <span className="text-xs font-mono px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                            RESOLVED
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/60 font-mono mb-2">
                      <span>Source: {event.source}</span>
                      <span>Type: {event.type.replace('_', ' ')}</span>
                      <span>{formatTimestamp(event.timestamp)}</span>
                    </div>
                    <div className="text-xs text-white/70 font-mono">
                      <strong>Details:</strong> {JSON.stringify(event.details, null, 2)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Metrics Tab */}
      {selectedTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-white/60 font-mono">Total Requests</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">{metrics.totalRequests.toLocaleString()}</div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Ban className="w-4 h-4 text-red-400" />
                <span className="text-xs text-white/60 font-mono">Blocked Requests</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">{metrics.blockedRequests.toLocaleString()}</div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-xs text-white/60 font-mono">Active Sessions</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">{metrics.activeSessions}</div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-white/60 font-mono">Security Score</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">{metrics.securityScore}%</div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-white/60 font-mono">Threats Blocked</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">{metrics.threatsBlocked}</div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-4 h-4 text-green-400" />
                <span className="text-xs text-white/60 font-mono">Uptime</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">{metrics.uptime}%</div>
            </div>
          </div>

          {/* Security Score Visualization */}
          <div className="bg-white/5 rounded-xl p-6">
            <h4 className="text-lg font-semibold font-mono text-white mb-4">Security Score Breakdown</h4>
            <div className="space-y-3">
              {[
                { name: 'Rate Limiting', score: 90, color: 'bg-blue-500' },
                { name: 'Authentication', score: 95, color: 'bg-green-500' },
                { name: 'Data Protection', score: 88, color: 'bg-purple-500' },
                { name: 'API Security', score: 92, color: 'bg-orange-500' },
                { name: 'Monitoring', score: 96, color: 'bg-red-500' }
              ].map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-white">{item.name}</span>
                    <span className="text-sm font-mono text-white/60">{item.score}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
