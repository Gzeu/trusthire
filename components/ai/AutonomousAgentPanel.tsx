/**
 * Autonomous Agent Panel
 * Control interface for the autonomous AI agent
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Play, 
  Pause, 
  Settings, 
  Activity,
  Zap,
  Target,
  Database,
  Heart,
  BarChart3,
  FileText,
  Users,
  RefreshCw,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  HardDrive
} from 'lucide-react';

interface AgentStatus {
  id: string;
  personality: {
    name: string;
    role: string;
    expertise: string[];
    communicationStyle: string;
    traits: {
      analytical: number;
      creative: number;
      cautious: number;
      proactive: number;
      detailOriented: number;
    };
    preferences: {
      reportFormat: string;
      analysisDepth: string;
      automationLevel: string;
    };
  };
  memory: any;
  soul: any;
  capabilities: string[];
  status: string;
  currentTask?: string;
  statistics: {
    tasksCompleted: number;
    analysesPerformed: number;
    discoveriesMade: number;
    errorsEncountered: number;
    learningEvents: number;
    uptime: number;
  };
}

export default function AutonomousAgentPanel() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [activeTab, setActiveTab] = useState('control');
  const [customCommand, setCustomCommand] = useState('');
  const [selectedTaskType, setSelectedTaskType] = useState('security_analysis');
  const [selectedPriority, setSelectedPriority] = useState('medium');

  useEffect(() => {
    fetchAgentStatus();
    const interval = setInterval(fetchAgentStatus, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAgentStatus = async () => {
    try {
      const response = await fetch('/api/ai/agent?view=status');
      const data = await response.json();
      if (data.success) {
        setAgentStatus(data.data.agent);
      }
    } catch (error) {
      console.error('Error fetching agent status:', error);
    }
  };

  const startAgent = async () => {
    setIsStarting(true);
    try {
      const response = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'start' }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchAgentStatus();
      }
    } catch (error) {
      console.error('Error starting agent:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const stopAgent = async () => {
    setIsStopping(true);
    try {
      const response = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'stop' }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchAgentStatus();
      }
    } catch (error) {
      console.error('Error stopping agent:', error);
    } finally {
      setIsStopping(false);
    }
  };

  const addTask = async () => {
    try {
      const response = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_task',
          taskType: selectedTaskType,
          priority: selectedPriority,
          data: { timestamp: new Date().toISOString() }
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Task added:', data.data.taskId);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const executeCustomCommand = async () => {
    if (!customCommand.trim()) return;

    try {
      const response = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'custom_command',
          data: {
            command: customCommand,
            parameters: {},
            context: { timestamp: new Date().toISOString() }
          }
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCustomCommand('');
        console.log('Command queued:', data.data.taskId);
      }
    } catch (error) {
      console.error('Error executing custom command:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'bg-gray-100 text-gray-800';
      case 'thinking': return 'bg-blue-100 text-blue-800';
      case 'analyzing': return 'bg-purple-100 text-purple-800';
      case 'reporting': return 'bg-green-100 text-green-800';
      case 'learning': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatUptime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Autonomous AI Agent</h2>
          <p className="text-muted-foreground">
            Advanced AI agent with personality, memory, and autonomous capabilities
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(agentStatus?.status || 'idle')}>
            {agentStatus?.status || 'Unknown'}
          </Badge>
          <Badge variant="outline">
            {agentStatus?.personality.name || 'TrustHire Sentinel'}
          </Badge>
        </div>
      </div>

      {/* Agent Statistics */}
      {agentStatus && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agentStatus.statistics.tasksCompleted}</div>
              <p className="text-xs text-muted-foreground">
                autonomous tasks
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Analyses Performed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agentStatus.statistics.analysesPerformed}</div>
              <p className="text-xs text-muted-foreground">
                security analyses
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Discoveries Made</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{agentStatus.statistics.discoveriesMade}</div>
              <p className="text-xs text-muted-foreground">
                new findings
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatUptime(agentStatus.statistics.uptime)}
              </div>
              <p className="text-xs text-muted-foreground">
                active time
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="control">Control</TabsTrigger>
          <TabsTrigger value="personality">Personality</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="control" className="space-y-4">
          <Card className="trusthire-card">
            <CardHeader>
              <CardTitle className="text-gradient">Agent Control</CardTitle>
              <CardDescription>
                Start, stop, and control the autonomous agent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={startAgent} 
                  disabled={isStarting || agentStatus?.status === 'thinking' || agentStatus?.status === 'analyzing'}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {isStarting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Starting Agent...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Agent
                    </>
                  )}
                </button>
                <button 
                  onClick={stopAgent} 
                  disabled={isStopping || agentStatus?.status === 'idle'}
                  className="btn-secondary flex-1 disabled:opacity-50"
                >
                  {isStopping ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Stopping Agent...
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Stop Agent
                    </>
                  )}
                </button>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Add Task</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Task Type</label>
                    <select 
                      value={selectedTaskType} 
                      onChange={(e) => setSelectedTaskType(e.target.value)}
                      className="w-full mt-1 border rounded px-3 py-2"
                    >
                      <option value="security_analysis">Security Analysis</option>
                      <option value="threat_hunting">Threat Hunting</option>
                      <option value="documentation">Documentation</option>
                      <option value="learning">Learning</option>
                      <option value="reporting">Reporting</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <select 
                      value={selectedPriority} 
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="w-full mt-1 border rounded px-3 py-2"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addTask} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Custom Command</h4>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter custom command..."
                    value={customCommand}
                    onChange={(e) => setCustomCommand(e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <Button onClick={executeCustomCommand} disabled={!customCommand.trim()}>
                    <Zap className="h-4 w-4 mr-2" />
                    Execute
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Personality</CardTitle>
              <CardDescription>
                View and modify the agent's personality and traits
              </CardDescription>
            </CardHeader>
            <CardContent>
              {agentStatus && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Name:</span>
                        <p className="font-medium">{agentStatus.personality.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Role:</span>
                        <p className="font-medium">{agentStatus.personality.role}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Communication:</span>
                        <p className="font-medium">{agentStatus.personality.communicationStyle}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Automation Level:</span>
                        <p className="font-medium">{agentStatus.personality.preferences.automationLevel}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Personality Traits</h4>
                    <div className="space-y-3">
                      {Object.entries(agentStatus.personality.traits).map(([trait, value]) => (
                        <div key={trait}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium capitalize">{trait.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-sm text-muted-foreground">{Math.round(value * 100)}%</span>
                          </div>
                          <Progress value={value * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {agentStatus.personality.expertise.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Capabilities</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {agentStatus.capabilities.map((capability, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                          <Brain className="h-4 w-4" />
                          <span className="text-sm">{capability.replace('_', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Memory</CardTitle>
              <CardDescription>
                View the agent's memory systems and stored knowledge
              </CardDescription>
            </CardHeader>
            <CardContent>
              {agentStatus && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <HardDrive className="h-4 w-4" />
                        <h4 className="font-medium">Short-term Memory</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Conversations:</span>
                          <span>{agentStatus.memory.shortTerm.conversations.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Current Tasks:</span>
                          <span>{agentStatus.memory.shortTerm.currentTasks.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Recent Findings:</span>
                          <span>{agentStatus.memory.shortTerm.recentFindings.length}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Database className="h-4 w-4" />
                        <h4 className="font-medium">Long-term Memory</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Patterns:</span>
                          <span>{agentStatus.memory.longTerm.patterns.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Knowledge:</span>
                          <span>{agentStatus.memory.longTerm.knowledge.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Relationships:</span>
                          <span>{agentStatus.memory.longTerm.relationships.length}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Heart className="h-4 w-4" />
                        <h4 className="font-medium">Episodic Memory</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Experiences:</span>
                          <span>{agentStatus.memory.episodic.experiences.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Recent Findings</h4>
                    <div className="space-y-2">
                      {agentStatus.memory.shortTerm.recentFindings.slice(0, 5).map((finding: any, index) => (
                        <div key={index} className="p-3 border rounded">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-medium">{finding.type}</span>
                            <Badge variant="outline" className="text-xs">
                              {Math.round(finding.confidence * 100)}%
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{finding.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Analytics</CardTitle>
              <CardDescription>
                Performance metrics and analytics for the autonomous agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              {agentStatus && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Performance Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Tasks Completed</span>
                          <span className="font-bold">{agentStatus.statistics.tasksCompleted}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Success Rate</span>
                          <span className="font-bold text-green-600">
                            {Math.round((1 - agentStatus.statistics.errorsEncountered / Math.max(agentStatus.statistics.tasksCompleted, 1)) * 100)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Discovery Rate</span>
                          <span className="font-bold text-purple-600">
                            {Math.round((agentStatus.statistics.discoveriesMade / Math.max(agentStatus.statistics.analysesPerformed, 1)) * 100)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Learning Events</span>
                          <span className="font-bold text-blue-600">{agentStatus.statistics.learningEvents}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-4">Activity Timeline</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">Uptime: {formatUptime(agentStatus.statistics.uptime)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4" />
                          <span className="text-sm">Status: {agentStatus.status}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4" />
                          <span className="text-sm">Current Task: {agentStatus.currentTask || 'None'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-4">Capability Utilization</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {agentStatus.capabilities.map((capability, index) => (
                        <div key={index} className="text-center p-3 border rounded">
                          <div className="flex flex-col items-center space-y-1">
                            <Brain className="h-6 w-6" />
                            <span className="text-xs">{capability.replace('_', ' ')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
