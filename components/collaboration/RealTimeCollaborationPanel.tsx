'use client';

import React, { useState, useCallback } from 'react';

interface CollaborationSession {
  id: string;
  name: string;
  description: string;
  participants: string[];
  createdAt: string;
  status: string;
  sharedFindings: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    severity: string;
    discoveredBy: string;
    timestamp: string;
    verified: boolean;
    iocs: string[];
  }>;
  isRealTime: boolean;
}
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
  const [activeSession, setActiveSession] = useState<CollaborationSession | null>(null);
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
          description: 'Sophisticated phishing campaign targeting financial institutions',
          severity: 'high',
          discoveredBy: '1',
          timestamp: '2024-01-15T10:30:00Z',
          verified: true,
          iocs: ['suspicious-domain.com', 'malicious-ip-address']
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
          <p className="text-gray-400 text-lg">
            Collaborate with your security team in real-time to analyze threats and share findings
          </p>
        </div>

        {/* Session Controls */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="primary"
                onClick={() => console.log('Create new session')}
              >
                <UserPlus size={16} className="mr-2" />
                New Session
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsRealTimeMode(!isRealTimeMode)}
              >
                {isRealTimeMode ? <Eye size={16} className="mr-2" /> : <EyeOff size={16} className="mr-2" />}
                {isRealTimeMode ? 'Real-time' : 'Archived'}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isRealTimeMode ? 'success' : 'default'}>
                {isRealTimeMode ? 'Live' : 'Offline'}
              </Badge>
            </div>
          </div>

          {/* Session List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {mockSessions.map((session) => (
              <Card key={session.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{session.name}</h3>
                    <Badge variant={session.status === 'completed' ? 'success' : 'warning'}>
                      {session.status}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{session.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-400">{session.participants.length} participants</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => joinSession(session.id)}
                    >
                      Join
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Active Session */}
        {activeSession && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Area */}
            <div className="lg:col-span-2">
              <Card className="h-[600px]">
                <div className="p-6 border-b border-gray-800">
                  <h2 className="text-xl font-semibold text-white mb-2">{activeSession.name}</h2>
                  <p className="text-gray-400 text-sm">{activeSession.description}</p>
                </div>
                
                <div className="p-6 h-[400px] overflow-y-auto">
                  <div className="space-y-4">
                    {/* Mock messages */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                        A
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-800 rounded-lg p-3">
                          <p className="text-white">Welcome to the session!</p>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">Alex Chen · 2 min ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-800">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <MessageSquare size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Participants */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Participants</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                        A
                      </div>
                      <div>
                        <p className="text-white text-sm">Alex Chen</p>
                        <p className="text-green-400 text-xs">Online</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Shared Findings */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Shared Findings</h3>
                  <div className="space-y-3">
                    {activeSession.sharedFindings?.map((finding: any) => (
                      <div key={finding.id} className="border-l-2 border-red-500 pl-3">
                        <p className="text-white text-sm font-medium">{finding.title}</p>
                        <p className="text-gray-400 text-xs">{finding.description}</p>
                        <Badge variant="warning" className="mt-1">
                          {finding.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!activeSession && (
          <Card className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Active Session</h3>
            <p className="text-gray-400 mb-6">
              Select a session from the list above or create a new one to start collaborating
            </p>
            <Button variant="primary" onClick={() => console.log('Create new session')}>
              <UserPlus size={16} className="mr-2" />
              Create New Session
            </Button>
          </Card>
        )}
      </Container>
    </div>
  );
}
