'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Eye, 
  EyeOff, 
  Bell, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  Download,
  Upload,
  Filter,
  Search,
  UserPlus,
  Settings,
  Shield
} from 'lucide-react';
import { Card, Button, Badge, Container, Section, Skeleton } from '@/components/ui/DesignSystem';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
  avatar?: string;
  status: 'online' | 'offline' | 'busy';
  lastActive: string;
}

interface CollaborationSession {
  id: string;
  name: string;
  description: string;
  participants: TeamMember[];
  createdAt: string;
  status: 'active' | 'completed' | 'archived';
  sharedFindings: any[];
  messages: any[];
  isRealTime: boolean;
}

interface SharedFinding {
  id: string;
  type: 'threat' | 'vulnerability' | 'pattern' | 'recommendation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  evidence: string[];
  recommendations: string[];
  createdBy: string;
  createdAt: string;
  upvotes: number;
  resolved: boolean;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Chen',
    email: 'alex@trusthire.com',
    role: 'admin',
    avatar: '/avatars/alex.jpg',
    status: 'online',
    lastActive: '2 minutes ago'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@trusthire.com',
    role: 'analyst',
    avatar: '/avatars/sarah.jpg',
    status: 'online',
    lastActive: '5 minutes ago'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@trusthire.com',
    role: 'viewer',
    avatar: '/avatars/mike.jpg',
    status: 'offline',
    lastActive: '1 hour ago'
  }
];

const mockSessions: CollaborationSession[] = [
  {
    id: '1',
    name: 'Q2 2024 Security Review',
    description: 'Quarterly security assessment and threat analysis',
    participants: ['1', '2'],
    createdAt: '2024-01-15T10:00:00Z',
    status: 'completed',
    sharedFindings: [
      {
        id: '1',
        type: 'threat',
        title: 'New Phishing Pattern Detected',
        description: 'Identified sophisticated phishing attempts targeting Web3 developers',
        severity: 'high',
        evidence: ['Fake company websites', 'Urgent payment requests'],
        recommendations: ['Verify domain ownership', 'Check SSL certificates'],
        createdBy: '1',
        createdAt: '2024-01-15T14:30:00Z',
        upvotes: 12,
        resolved: true
      }
    ],
    messages: [
      {
        id: '1',
        userId: '1',
        content: 'Starting analysis of Q2 threat patterns',
        timestamp: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        userId: '2',
        content: 'Found 3 new phishing domains targeting crypto companies',
        timestamp: '2024-01-15T10:15:00Z'
      }
    ],
    isRealTime: false
  },
  {
    id: '2',
    name: 'Live Threat Monitoring',
    description: 'Real-time collaborative threat analysis and response',
    participants: ['1', '2', '3'],
    createdAt: '2024-03-10T09:00:00Z',
    status: 'active',
    sharedFindings: [
      {
        id: '2',
        type: 'vulnerability',
        title: 'Zero-day in Popular npm Package',
        description: 'Critical vulnerability discovered in widely-used package',
        severity: 'critical',
        evidence: ['Remote code execution', 'Package version 1.2.3'],
        recommendations: ['Immediate update required', 'Use alternative packages'],
        createdBy: '2',
        createdAt: '2024-03-10T09:15:00Z',
        upvotes: 8,
        resolved: false
      }
    ],
    messages: [
      {
        id: '1',
        userId: '1',
        content: 'New zero-day vulnerability detected in express package',
        timestamp: '2024-03-10T09:15:00Z'
      },
      {
        id: '2',
        userId: '2',
        content: 'Analyzing impact and developing patches',
        timestamp: '2024-03-10T09:20:00Z'
      },
      {
        id: '3',
        userId: '1',
        content: 'Team mobilized to address critical issue',
        timestamp: '2024-03-10T09:25:00Z'
      }
    ],
    isRealTime: true
  }
];

export default function RealTimeCollaborationPanel() {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isRealTimeMode, setIsRealTimeMode] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'threats' | 'vulnerabilities' | 'patterns' | 'resolved'>('all');
  const [showNotifications, setShowNotifications] = useState(true);

  const currentUser = {
    id: '1',
    name: 'Alex Chen',
    email: 'alex@trusthire.com',
    role: 'admin',
    avatar: '/avatars/alex.jpg',
    status: 'online',
    lastActive: '2 minutes ago'
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/25';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/25';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/25';
      case 'low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/25';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'threat': return 'text-red-400 bg-red-500/10 border-red-500/25';
      case 'vulnerability': return 'text-orange-400 bg-orange-500/10 border-orange-500/25';
      case 'pattern': return 'text-purple-400 bg-purple-500/10 border-purple-500/25';
      case 'recommendation': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/25';
    }
  };

  const filteredFindings = useCallback((session: CollaborationSession) => {
    if (!session) return [];
    
    return session.sharedFindings.filter(finding => {
      if (selectedFilter === 'all') return true;
      return finding.type === selectedFilter;
    });
  }, [selectedFilter]);

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !activeSession) return;
    
    const messageData = {
      sessionId: activeSession.id,
      userId: currentUser.id,
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    // Simulate real-time message sending
    setNewMessage('');
    
    // In a real implementation, this would send via WebSocket or Server-Sent Events
    console.log('Sending message:', messageData);
    
    // Show success feedback
    setTimeout(() => {
      // This would be a toast notification in real implementation
      console.log('Message sent successfully');
    }, 100);
  }, [newMessage, activeSession]);

  const createNewSession = useCallback(() => {
    const newSession: CollaborationSession = {
      id: `session-${Date.now()}`,
      name: `New Session ${new Date().toLocaleString()}`,
      description: 'Real-time collaborative analysis session',
      participants: [currentUser],
      createdAt: new Date().toISOString(),
      status: 'active',
      sharedFindings: [],
      messages: [],
      isRealTime: true
    };
    
    setActiveSession(newSession);
    setIsRealTimeMode(true);
  }, []);

  const joinSession = useCallback((sessionId: string) => {
    const session = mockSessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSession(session);
      setIsRealTimeMode(session.isRealTime);
    }
  }, []);

  const getSessionMessages = useCallback((sessionId: string) => {
    const session = mockSessions.find(s => s.id === sessionId);
    return session?.messages || [];
  }, []);

  const activeSessionFindings = activeSession ? filteredFindings(activeSession) : [];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Container size="lg" className="py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6 text-purple-500" />
            <Badge variant="info" className="animate-pulse">
              REAL-TIME COLLABORATION
            </Badge>
          </div>
          <h1 className="text-4xl font-mono font-bold text-white mb-4">
            Real-Time Security Collaboration
          </h1>
          <p className="text-lg font-mono text-white/60 max-w-3xl">
            Collaborate with your team in real-time to analyze and respond to security threats.
            Share findings, discuss patterns, and coordinate responses instantly.
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Real-time Toggle */}
          <Card className="p-6">
            <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Real-time Mode
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono text-white/60">
                Enable real-time collaboration for instant team coordination
              </p>
              <Button
                onClick={() => setIsRealTimeMode(!isRealTimeMode)}
                variant={isRealTimeMode ? 'default' : 'secondary'}
                className="flex items-center gap-2"
              >
                {isRealTimeMode ? (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Real-time On</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>Real-time Off</span>
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Session Management */}
          <Card className="p-6">
            <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Active Session
            </h3>
            <div className="space-y-4">
              <Button
                onClick={createNewSession}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Start New Session
              </Button>
              
              {activeSession && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-mono font-semibold text-white">
                        {activeSession.name}
                      </h4>
                      <p className="text-sm font-mono text-white/60">
                        {activeSession.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={activeSession.isRealTime ? 'success' : 'default'}>
                          {activeSession.isRealTime ? 'Live' : 'Archived'}
                        </Badge>
                        <span className="text-xs font-mono text-white/40">
                          {activeSession.participants.length} participants
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveSession(null)}
                    >
                      Leave Session
                    </Button>
                  </div>
                  
                  {/* Session Messages */}
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {getSessionMessages(activeSession.id).map((message) => (
                      <div key={message.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <span className="text-sm font-mono font-semibold text-purple-400">
                              {message.userId === currentUser.id ? 'You' : 'Team'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div>
                            <p className="text-sm font-mono text-white/90">
                              {message.content}
                            </p>
                            <p className="text-xs font-mono text-white/40">
                              {new Date(message.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>
          </Card>

          {/* Team Members */}
          <Card className="p-6">
            <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Members
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockTeamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <span className="text-lg font-mono font-bold text-white">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div>
                      <h4 className="font-mono font-semibold text-white">
                        {member.name}
                      </h4>
                      <p className="text-sm font-mono text-white/60">
                        {member.email}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={member.status === 'online' ? 'success' : 'default'}>
                          {member.status}
                        </Badge>
                        <span className="text-xs font-mono text-white/40">
                          Last active: {member.lastActive}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sessions List */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Collaboration Sessions
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFilter('all')}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filter
                </Button>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex items-center gap-2 mb-4">
                {['all', 'threats', 'vulnerabilities', 'patterns', 'resolved'].map((filter) => (
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

              {/* Sessions List */}
              <div className="space-y-4">
                {mockSessions.map((session) => (
                  <Card
                    key={session.id}
                    onClick={() => joinSession(session.id)}
                    className={`p-6 cursor-pointer transition-all duration-200 ${
                      activeSession?.id === session.id
                        ? 'border-purple-500/50 bg-purple-500/10 scale-105'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-mono font-semibold text-white mb-2">
                          {session.name}
                        </h4>
                        <p className="text-sm font-mono text-white/60 mb-3">
                          {session.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant={session.isRealTime ? 'success' : 'default'}>
                            {session.isRealTime ? 'Live' : 'Archived'}
                          </Badge>
                          <span className="text-xs font-mono text-white/40">
                            {session.participants.length} participants
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {session.sharedFindings.length} findings
                          </Badge>
                          <span className="text-xs font-mono text-white/40">
                            {new Date(session.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Preview of Findings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {session.sharedFindings.slice(0, 4).map((finding) => (
                        <div key={finding.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-2 h-2 rounded-full ${getTypeColor(finding.type)}`}>
                              <span className="text-xs font-mono font-bold text-white">
                                {finding.type.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h5 className="font-mono font-semibold text-white mb-1">
                                {finding.title}
                              </h5>
                              <p className="text-sm font-mono text-white/80">
                                {finding.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Metadata */}
                        <div className="flex items-center justify-between text-xs font-mono text-white/40">
                          <div className="flex items-center gap-4">
                            <span>By {finding.createdBy}</span>
                            <span>•</span>
                            <span>{new Date(finding.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <Badge variant={finding.resolved ? 'success' : 'warning'}>
                              {finding.resolved ? 'Resolved' : 'Open'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>{finding.upvotes} votes</span>
                            <Button variant="ghost" size="sm">
                              <TrendingUp className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Active Session Details */}
          <div className="lg:col-span-1">
            {activeSession && (
              <Card className="p-6">
                <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Active Session: {activeSession.name}
                </h3>
                
                {/* Real-time Message Input */}
                {activeSession.isRealTime && (
                  <div className="mb-6">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message here... (supports @mentions for team members)"
                        className="w-full h-24 p-4 bg-[#111113] border border-white/10 rounded-xl text-white font-mono text-sm placeholder-white/40 focus:outline-none focus:border-purple-500/50 resize-none"
                        rows={3}
                      />
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-xs font-mono text-white/40">
                          {newMessage.length}/500 characters
                        </div>
                        <Button
                          onClick={sendMessage}
                          disabled={!newMessage.trim() || !activeSession}
                          loading={false}
                          className="flex items-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Send Message
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Session Findings */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-mono font-semibold text-white flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Shared Findings ({activeSessionFindings.length})
                    </h4>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFilter('all')}
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Clear Filter
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                      onClick={() => {
                          // Export findings functionality
                          const findingsData = activeSessionFindings.map(f => ({
                            ...f,
                            exportedAt: new Date().toISOString()
                          }));
                          
                          const blob = new Blob([JSON.stringify(findingsData, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${activeSession.name}_findings_${Date.now()}.json`;
                          document.body.appendChild(a);
                          a.click();
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Findings
                      </Button>
                    </div>
                  </div>

                  {/* Findings List */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredFindings(activeSession).map((finding) => (
                      <div key={finding.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-2 h-2 rounded-full ${getTypeColor(finding.type)}`}>
                            <span className="text-xs font-mono font-bold text-white">
                              {finding.type.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div>
                              <h5 className="font-mono font-semibold text-white mb-1">
                                {finding.title}
                              </h5>
                              <p className="text-sm font-mono text-white/80">
                                {finding.description}
                              </p>
                            </div>
                            <div className="flex items-center justify-between text-xs font-mono text-white/40">
                              <span>By {finding.createdBy}</span>
                              <span>•</span>
                              <span>{new Date(finding.createdAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <Badge variant={finding.resolved ? 'success' : 'warning'}>
                                {finding.resolved ? 'Resolved' : 'Open'}
                              </Badge>
                              <div className="flex items-center gap-2">
                                <span>{finding.upvotes} votes</span>
                                <Button variant="ghost" size="sm">
                                  <TrendingUp className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
}
