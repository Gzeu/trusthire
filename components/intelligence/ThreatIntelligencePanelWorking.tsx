'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  TrendingUp, 
  Globe, 
  Server,
  Activity,
  Target,
  Zap,
  Lock,
  Database,
  FileText,
  RefreshCw
} from 'lucide-react';

interface ThreatIntelligencePanelProps {
  className?: string;
}

export function ThreatIntelligencePanelWorking({ className }: ThreatIntelligencePanelProps) {
  const [threats, setThreats] = useState([
    {
      id: 1,
      type: 'Malware',
      severity: 'high',
      source: 'Dark Web',
      description: 'New ransomware variant targeting financial institutions',
      confidence: 0.95,
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'Phishing',
      severity: 'medium',
      source: 'Email Analysis',
      description: 'Sophisticated phishing campaign using legitimate domains',
      confidence: 0.87,
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      type: 'Vulnerability',
      severity: 'critical',
      source: 'CVE Database',
      description: 'Zero-day vulnerability in widely used web framework',
      confidence: 0.92,
      timestamp: '6 hours ago'
    }
  ]);

  const [indicators, setIndicators] = useState([
    { id: 1, type: 'IP Address', value: '192.168.1.100', severity: 'high', firstSeen: '1 day ago' },
    { id: 2, type: 'Domain', value: 'malicious-site.com', severity: 'critical', firstSeen: '2 days ago' },
    { id: 3, type: 'Hash', value: 'a1b2c3d4...', severity: 'medium', firstSeen: '3 days ago' }
  ]);

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    // Simulate real-time threat updates
    const interval = setInterval(() => {
      const randomEvent = Math.random();
      if (randomEvent < 0.2) {
        const newThreat = {
          id: Date.now(),
          type: ['Malware', 'Phishing', 'Vulnerability', 'DDoS'][Math.floor(Math.random() * 4)],
          severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
          source: ['Dark Web', 'Email Analysis', 'CVE Database', 'Network Traffic'][Math.floor(Math.random() * 4)],
          description: 'New threat detected by autonomous analysis',
          confidence: 0.8 + Math.random() * 0.2,
          timestamp: 'Just now'
        };
        setThreats(prev => [newThreat, ...prev.slice(0, 4)]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setScanProgress(i);
    }
    
    setIsScanning(false);
    setScanProgress(0);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'Malware': return <Lock className="w-4 h-4" />;
      case 'Phishing': return <Eye className="w-4 h-4" />;
      case 'Vulnerability': return <Server className="w-4 h-4" />;
      case 'DDoS': return <Activity className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Threat Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">Critical</span>
            </div>
            <span className="text-2xl font-bold text-red-600">
              {threats.filter(t => t.severity === 'critical').length}
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">High</span>
            </div>
            <span className="text-2xl font-bold text-orange-600">
              {threats.filter(t => t.severity === 'high').length}
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">Medium</span>
            </div>
            <span className="text-2xl font-bold text-yellow-600">
              {threats.filter(t => t.severity === 'medium').length}
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <span className="text-2xl font-bold text-gray-600">
              {threats.length}
            </span>
          </div>
        </Card>
      </div>

      {/* Scan Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Threat Intelligence Scanner</span>
          </h3>
          <Button 
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center space-x-2"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Scanning ({scanProgress}%)</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Start Scan</span>
              </>
            )}
          </Button>
        </div>

        {isScanning && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Dark Web Monitoring</span>
            <Badge variant="outline" className="text-green-600">Active</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-green-500" />
            <span>CVE Database</span>
            <Badge variant="outline" className="text-green-600">Updated</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-purple-500" />
            <span>Network Analysis</span>
            <Badge variant="outline" className="text-green-600">Running</Badge>
          </div>
        </div>
      </Card>

      {/* Recent Threats */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Recent Threats</span>
          </h3>
          <Badge variant="outline">{threats.length} active</Badge>
        </div>

        <div className="space-y-4">
          {threats.map((threat) => (
            <div key={threat.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center space-x-2">
                    {getThreatIcon(threat.type)}
                    <div>
                      <h4 className="text-sm font-semibold">{threat.type}</h4>
                      <p className="text-xs text-gray-500">{threat.source}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 mb-2">{threat.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Confidence: {(threat.confidence * 100).toFixed(0)}%</span>
                      <span>{threat.timestamp}</span>
                    </div>
                  </div>
                </div>
                <Badge className={getSeverityColor(threat.severity)}>
                  {threat.severity}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Indicators of Compromise */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Indicators of Compromise</span>
          </h3>
          <Button variant="outline" size="sm">
            Export All
          </Button>
        </div>

        <div className="space-y-3">
          {indicators.map((indicator) => (
            <div key={indicator.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Database className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{indicator.type}</p>
                  <p className="text-xs text-gray-500 font-mono">{indicator.value}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getSeverityColor(indicator.severity)}>
                  {indicator.severity}
                </Badge>
                <span className="text-xs text-gray-500">{indicator.firstSeen}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
