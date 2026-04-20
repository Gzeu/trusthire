'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Cpu, 
  Database, 
  HardDrive, 
  MemoryStick,
  Network,
  Server,
  TrendingUp,
  Zap
} from 'lucide-react';

interface MonitoringDashboardProps {
  className?: string;
}

export function MonitoringDashboard({ className }: MonitoringDashboardProps) {
  const [metrics, setMetrics] = useState({
    cpu: 45,
    memory: 62,
    disk: 38,
    network: 23,
    uptime: '99.9%',
    activeConnections: 156,
    responseTime: 124,
    errorRate: 0.02
  });

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'High memory usage detected', time: '2 min ago' },
    { id: 2, type: 'info', message: 'Database backup completed', time: '15 min ago' },
    { id: 3, type: 'success', message: 'System health check passed', time: '1 hour ago' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 8)),
        disk: Math.max(0, Math.min(100, prev.disk + (Math.random() - 0.5) * 2)),
        network: Math.max(0, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
        responseTime: Math.max(50, prev.responseTime + (Math.random() - 0.5) * 20)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-500';
    if (value >= thresholds.warning) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">CPU</span>
            </div>
            <span className={`text-lg font-bold ${getStatusColor(metrics.cpu, { warning: 70, critical: 90 })}`}>
              {metrics.cpu.toFixed(1)}%
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${metrics.cpu}%` }}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MemoryStick className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Memory</span>
            </div>
            <span className={`text-lg font-bold ${getStatusColor(metrics.memory, { warning: 75, critical: 90 })}`}>
              {metrics.memory.toFixed(1)}%
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${metrics.memory}%` }}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Disk</span>
            </div>
            <span className={`text-lg font-bold ${getStatusColor(metrics.disk, { warning: 80, critical: 95 })}`}>
              {metrics.disk.toFixed(1)}%
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${metrics.disk}%` }}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Network className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">Network</span>
            </div>
            <span className={`text-lg font-bold ${getStatusColor(metrics.network, { warning: 70, critical: 85 })}`}>
              {metrics.network.toFixed(1)}%
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${metrics.network}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">Response Time</span>
            </div>
            <span className="text-lg font-bold text-gray-700">
              {metrics.responseTime}ms
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Average response time</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Uptime</span>
            </div>
            <span className="text-lg font-bold text-green-600">
              {metrics.uptime}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">System availability</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Connections</span>
            </div>
            <span className="text-lg font-bold text-gray-700">
              {metrics.activeConnections}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Active database connections</p>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Recent Alerts</span>
          </h3>
          <Badge variant="outline">{alerts.length} active</Badge>
        </div>
        
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <p className="text-sm font-medium">{alert.message}</p>
                <p className="text-xs text-gray-500 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{alert.time}</span>
                </p>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
