'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Zap, 
  Globe, 
  Eye, 
  RotateCw, 
  Maximize2, 
  Move3d,
  Layers,
  Target,
  TrendingUp
} from 'lucide-react';

interface ThreatPoint {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  position: { x: number; y: number; z: number };
  timestamp: Date;
  description: string;
  confidence: number;
  metadata?: any;
}

interface ThreatConnection {
  source: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  strength: number;
  type: string;
  confidence: number;
  lastSeen: Date;
}

interface VisualizationData {
  threats: ThreatPoint[];
  connections: ThreatConnection[];
  metrics: {
    totalThreats: number;
    activeAlerts: number;
    averageResponseTime: number;
    userEngagement: number;
    systemPerformance: number;
  };
  filters: {
    severity: string[];
    category: string[];
    timeframe: string;
    location: string;
    platform: string;
  };
  timeRange: {
    start: Date;
    end: Date;
    label: string;
  };
}

interface ARInteraction {
  id: string;
  type: string;
  timestamp: Date;
  user: string;
  action: string;
  element: string;
  coordinates: { x: number; y: number; z: number };
  metadata?: any;
}

export default function SecurityVisualization() {
  const [data, setData] = useState<VisualizationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedThreat, setSelectedThreat] = useState<ThreatPoint | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'network' | 'timeline'>('3d');
  const [isVRMode, setIsVRMode] = useState(false);
  const [interactions, setInteractions] = useState<ARInteraction[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: VisualizationData = {
        threats: generateMockThreats(),
        connections: generateMockConnections(),
        metrics: {
          totalThreats: 127,
          activeAlerts: 8,
          averageResponseTime: 2.3,
          userEngagement: 87,
          systemPerformance: 94
        },
        filters: {
          severity: ['critical', 'high', 'medium', 'low'],
          category: ['phishing', 'malware', 'impersonation', 'data_breach'],
          timeframe: '24h',
          location: 'global',
          platform: 'all'
        },
        timeRange: {
          start: new Date(Date.now() - 24 * 60 * 60 * 1000),
          end: new Date(),
          label: 'Last 24 Hours'
        }
      };
      
      setData(mockData);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Generate mock threats
  const generateMockThreats = (): ThreatPoint[] => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: `threat_${i}`,
      type: ['phishing', 'malware', 'impersonation', 'data_breach'][Math.floor(Math.random() * 4)],
      severity: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)] as any,
      position: {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10,
        z: Math.random() * 5
      },
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      description: `Security threat detected in ${['recruitment', 'development', 'infrastructure'][Math.floor(Math.random() * 3)]}`,
      confidence: 0.6 + Math.random() * 0.4,
      metadata: {
        platform: ['LinkedIn', 'GitHub', 'Email', 'Slack'][Math.floor(Math.random() * 4)],
        source: ['automated_scanner', 'user_report', 'intelligence_feed'][Math.floor(Math.random() * 3)],
        impact: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)]
      }
    }));
  };

  // Generate mock connections
  const generateMockConnections = (): ThreatConnection[] => {
    return Array.from({ length: 30 }, (_, i) => ({
      source: {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10,
        z: Math.random() * 5
      },
      target: {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10,
        z: Math.random() * 5
      },
      strength: Math.random() * 0.8 + 0.2,
      type: ['similarity', 'causation', 'correlation'][Math.floor(Math.random() * 3)],
      confidence: Math.random() * 0.7 + 0.3,
      lastSeen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
    }));
  };

  // Handle AR interaction
  const handleARInteraction = (interaction: Partial<ARInteraction>) => {
    const newInteraction: ARInteraction = {
      id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: interaction.type || 'click',
      timestamp: new Date(),
      user: 'current_user',
      action: interaction.action || 'interact',
      element: interaction.element || 'threat_point',
      coordinates: interaction.coordinates || { x: 0, y: 0, z: 0 },
      metadata: interaction.metadata
    };
    
    setInteractions(prev => [...prev, newInteraction]);
    console.log('AR Interaction:', newInteraction);
  };

  // Render 3D visualization
  const render3DVisualization = () => {
    if (!canvasRef.current || !data) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up 3D projection
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 30;

    // Draw threat points
    data.threats.forEach(threat => {
      const x = centerX + threat.position.x * scale;
      const y = centerY + threat.position.y * scale;
      const size = 5 + threat.position.z * 2;

      // Draw threat point
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      
      // Color based on severity
      switch (threat.severity) {
        case 'critical':
          ctx.fillStyle = '#ef4444';
          break;
        case 'high':
          ctx.fillStyle = '#f97316';
          break;
        case 'medium':
          ctx.fillStyle = '#eab308';
          break;
        default:
          ctx.fillStyle = '#22c55e';
      }
      
      ctx.fill();
      
      // Draw label
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(threat.type, x, y - size - 15);
    });

    // Draw connections
    data.connections.forEach(connection => {
      const sourceX = centerX + connection.source.x * scale;
      const sourceY = centerY + connection.source.y * scale;
      const targetX = centerX + connection.target.x * scale;
      const targetY = centerY + connection.target.y * scale;

      ctx.beginPath();
      ctx.moveTo(sourceX, sourceY);
      ctx.lineTo(targetX, targetY);
      ctx.strokeStyle = `rgba(59, 130, 246, ${connection.confidence * 0.5})`;
      ctx.lineWidth = connection.strength * 3;
      ctx.stroke();
    });

    return null;
  };

  // Render network graph
  const renderNetworkGraph = () => {
    if (!data) return null;

    const nodes = data.threats.map(threat => ({
      id: threat.id,
      label: threat.type,
      x: Math.random() * 800,
      y: Math.random() * 600,
      color: getSeverityColor(threat.severity),
      size: 10 + Math.random() * 20,
      metadata: threat
    }));

    const links = data.connections.map(conn => ({
      source: `threat_${Math.floor(Math.random() * data.threats.length)}`,
      target: `threat_${Math.floor(Math.random() * data.threats.length)}`,
      value: conn.strength,
      color: `rgba(59, 130, 246, ${conn.confidence * 0.3})`
    }));

    return (
      <div className="w-full h-full bg-gray-900 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Network Graph</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('3d')}
              className={`px-4 py-2 rounded ${viewMode === '3d' ? 'bg-blue-600' : 'bg-gray-700'} text-white`}
            >
              <Move3d className="w-4 h-4 inline mr-2" />
              3D View
            </button>
            <button
              onClick={() => setViewMode('network')}
              className={`px-4 py-2 rounded ${viewMode === 'network' ? 'bg-blue-600' : 'bg-gray-700'} text-white`}
            >
              <Layers className="w-4 h-4 inline mr-2" />
              Network View
            </button>
          </div>
        </div>
        
        <div className="relative w-full h-96 bg-gray-800 rounded-lg overflow-hidden">
          {nodes.map(node => (
            <div
              key={node.id}
              className="absolute w-4 h-4 rounded-full cursor-pointer hover:scale-110 transition-transform"
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                backgroundColor: node.color,
                width: `${node.size}px`,
                height: `${node.size}px`
              }}
              onClick={() => setSelectedThreat(data.threats.find(t => t.id === node.id) || null)}
              title={node.metadata.description}
            />
          ))}
          
          {links.map((link, index) => {
            const sourceNode = nodes.find(n => n.id === link.source);
            const targetNode = nodes.find(n => n.id === link.target);
            
            if (!sourceNode || !targetNode) return null;
            
            const x1 = sourceNode.x + sourceNode.size / 2;
            const y1 = sourceNode.y + sourceNode.size / 2;
            const x2 = targetNode.x + targetNode.size / 2;
            const y2 = targetNode.y + targetNode.size / 2;
            
            return (
              <svg
                key={index}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ overflow: 'visible' }}
              >
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={link.color}
                  strokeWidth={link.value * 2}
                  strokeOpacity={0.6}
                />
              </svg>
            );
          })}
        </div>
      </div>
    );
  };

  // Render timeline view
  const renderTimeline = () => {
    if (!data) return null;

    const sortedThreats = [...data.threats].sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );

    return (
      <div className="w-full h-full bg-gray-900 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Timeline View</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('3d')}
              className={`px-4 py-2 rounded ${viewMode === '3d' ? 'bg-blue-600' : 'bg-gray-700'} text-white`}
            >
              <Move3d className="w-4 h-4 inline mr-2" />
              3D View
            </button>
            <button
              onClick={() => setViewMode('network')}
              className={`px-4 py-2 rounded ${viewMode === 'network' ? 'bg-blue-600' : 'bg-gray-700'} text-white`}
            >
              <Layers className="w-4 h-4 inline mr-2" />
              Network View
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded ${viewMode === 'timeline' ? 'bg-blue-600' : 'bg-gray-700'} text-white`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Timeline View
            </button>
          </div>
        </div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {sortedThreats.map((threat, index) => (
            <div
              key={threat.id}
              className={`flex items-center p-4 rounded-lg border-l-4 ${
                threat.severity === 'critical' ? 'bg-red-900 border-red-500' :
                threat.severity === 'high' ? 'bg-orange-900 border-orange-500' :
                threat.severity === 'medium' ? 'bg-yellow-900 border-yellow-500' :
                'bg-gray-800 border-gray-600'
              }`}
              onClick={() => setSelectedThreat(threat)}
            >
              <div className="flex-shrink-0 mr-4">
                <div className={`w-3 h-3 rounded-full ${
                  threat.severity === 'critical' ? 'bg-red-500' :
                  threat.severity === 'high' ? 'bg-orange-500' :
                  threat.severity === 'medium' ? 'bg-yellow-500' :
                  'bg-gray-500'
                }`} />
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-semibold">{threat.type}</h3>
                    <p className="text-gray-300 text-sm mt-1">{threat.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-gray-400 text-xs">
                        <Globe className="w-3 h-3 inline mr-1" />
                        {threat.metadata?.platform || 'Unknown'}
                      </span>
                      <span className="text-gray-400 text-xs">
                        <Target className="w-3 h-3 inline mr-1" />
                        {threat.metadata?.source || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-gray-400 text-xs">
                      {threat.timestamp.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-xs">
                      Confidence: {(threat.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      default: return '#22c55e';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <RotateCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading security visualization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Shield className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-bold">AR/VR Security Visualization</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsVRMode(!isVRMode)}
              className={`px-4 py-2 rounded flex items-center gap-2 ${
                isVRMode ? 'bg-purple-600' : 'bg-gray-700'
              } text-white`}
            >
              <Eye className="w-4 h-4" />
              {isVRMode ? 'VR Mode' : 'AR Mode'}
            </button>
            
            <button
              onClick={() => window.open('/api/threat-intelligence?type=stats', '_blank')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Live Stats
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Dashboard */}
      {data && (
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{data.metrics.totalThreats}</div>
                <div className="text-gray-400 text-sm">Total Threats</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{data.metrics.activeAlerts}</div>
                <div className="text-gray-400 text-sm">Active Alerts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{data.metrics.averageResponseTime}s</div>
                <div className="text-gray-400 text-sm">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{data.metrics.systemPerformance}%</div>
                <div className="text-gray-400 text-sm">System Performance</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Visualization */}
      <div className="flex-1 relative" ref={containerRef}>
        {viewMode === '3d' && (
          <div className="w-full h-full relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="w-full h-full"
              onClick={(e) => {
                const rect = canvasRef.current?.getBoundingClientRect();
                if (rect) {
                  handleARInteraction({
                    coordinates: {
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                      z: 0
                    }
                  });
                }
              }}
            />
            {render3DVisualization()}
          </div>
        )}
        
        {viewMode === 'network' && renderNetworkGraph()}
        {viewMode === 'timeline' && renderTimeline()}
        
        {/* Selected Threat Details */}
        {selectedThreat && (
          <div className="absolute top-4 right-4 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-white">Threat Details</h3>
              <button
                onClick={() => setSelectedThreat(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-gray-400 text-sm">Type:</span>
                <span className="text-white ml-2">{selectedThreat.type}</span>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Severity:</span>
                <span className={`ml-2 font-semibold ${
                  selectedThreat.severity === 'critical' ? 'text-red-400' :
                  selectedThreat.severity === 'high' ? 'text-orange-400' :
                  selectedThreat.severity === 'medium' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {selectedThreat.severity.toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Confidence:</span>
                <span className="text-white ml-2">{(selectedThreat.confidence * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Description:</span>
                <p className="text-white mt-1">{selectedThreat.description}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Detected:</span>
                <span className="text-white ml-2">{selectedThreat.timestamp.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <button
                onClick={() => handleARInteraction({
                  type: 'investigate',
                  element: 'threat_details',
                  metadata: { threatId: selectedThreat.id }
                })}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                <Zap className="w-4 h-4 inline mr-2" />
                Investigate Threat
              </button>
            </div>
          </div>
        )}
        
        {/* Interaction History */}
        {interactions.length > 0 && (
          <div className="absolute bottom-4 left-4 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-3 max-h-48 overflow-y-auto">
            <h4 className="text-sm font-semibold text-white mb-2">Recent Interactions</h4>
            <div className="space-y-1">
              {interactions.slice(-5).map(interaction => (
                <div key={interaction.id} className="text-xs text-gray-300">
                  <span className="text-gray-500">
                    {interaction.timestamp.toLocaleTimeString()} - 
                  </span>
                  {interaction.action} on {interaction.element}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
