'use client';

import React, { useState, useCallback } from 'react';
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

export default function RealTimeCollaborationPanel() {
  const [activeSession, setActiveSession] = useState(null);
  const [isRealTimeMode, setIsRealTimeMode] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const currentUser = {
    id: '1',
    name: 'Alex Chen',
    email: 'alex@trusthire.com',
    role: 'admin',
    avatar: '/avatars/alex.jpg',
    status: 'online',
    lastActive: '2 minutes ago'
  };

  const mockSessions = [
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

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !activeSession) return;
    
    const messageData = {
      sessionId: activeSession?.id || '',
      userId: currentUser.id,
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setNewMessage('');
    console.log('Message sent:', messageData);
    
    setTimeout(() => {
      console.log('Message sent successfully');
    }, 100);
  }, [newMessage, activeSession]);

  const joinSession = useCallback((sessionId: string) => {
    const session = mockSessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSession(session);
      setIsRealTimeMode(session.isRealTime);
    }
  }, []);

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
                onClick={() => setActiveSession(mockSessions[0])}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Start Q2 Review Session
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
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
                            {session.participants?.length || 0} participants
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {session.sharedFindings?.length || 0} findings
                          </Badge>
                          <span className="text-xs font-mono text-white/40">
                            {new Date(session.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
