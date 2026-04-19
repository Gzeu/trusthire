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
  resolved: boolean;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@trusthire.com',
    role: 'admin',
    avatar: '/avatars/john.jpg',
    status: 'online',
    lastActive: '2 minutes ago'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@trusthire.com',
    role: 'analyst',
    avatar: '/avatars/jane.jpg',
    status: 'online',
    lastActive: '5 minutes ago'
  },
  {
    id: '3',
    name: 'Mike Johnson',
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
    participants: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@trusthire.com',
        role: 'admin',
        avatar: '/avatars/john.jpg',
        status: 'online',
        lastActive: '2024-01-20T10:00:00Z'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@trusthire.com',
        role: 'analyst',
        avatar: '/avatars/jane.jpg',
        status: 'online',
        lastActive: '2024-01-20T09:30:00Z'
      }
    ],
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
        createdAt: '2024-01-15T10:00:00Z',
        resolved: false
      }
    ],
    messages: [
      {
        id: '1',
        userId: '1',
        userName: 'John Doe',
        content: 'Starting the security review process',
        timestamp: '2024-01-15T10:00:00Z'
      }
    ],
    isRealTime: true
  },
  {
    id: '2',
    name: 'Threat Analysis Workshop',
    description: 'Collaborative analysis of emerging threat patterns',
    participants: [mockTeamMembers[0], mockTeamMembers[2]],
    createdAt: '2024-01-18T14:00:00Z',
    status: 'active',
    sharedFindings: [],
    messages: [],
    isRealTime: true
  }
];

const mockFindings: SharedFinding[] = [
  {
    id: '1',
    type: 'threat',
    title: 'Suspicious Email Campaign',
    description: 'Mass email campaign targeting financial institutions',
    severity: 'high',
    evidence: ['Generic greetings', 'Urgent action required', 'Suspicious links'],
    recommendations: ['Block sender domains', 'Educate users', 'Update email filters'],
    createdBy: '1',
    createdAt: '2024-01-20T09:00:00Z',
    resolved: false
  },
  {
    id: '2',
    type: 'vulnerability',
    title: 'Outdated Software Dependencies',
    description: 'Critical vulnerabilities in third-party libraries',
    severity: 'critical',
    evidence: ['CVE-2024-1234', 'CVE-2024-5678'],
    recommendations: ['Update dependencies', 'Apply security patches', 'Review security policies'],
    createdBy: '2',
    createdAt: '2024-01-20T08:30:00Z',
    resolved: false
  }
];

export default function RealTimeCollaborationPanelFixed() {
  const [isRealTime, setIsRealTime] = useState(true);
  const [activeSession, setActiveSession] = useState<CollaborationSession | null>(null);
  const [sessions, setSessions] = useState<CollaborationSession[]>(mockSessions);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [findings, setFindings] = useState<SharedFinding[]>(mockFindings);
  const [filter, setFilter] = useState<'all' | 'threats' | 'vulnerabilities' | 'patterns' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredFindings = findings.filter(finding => {
    const matchesFilter = filter === 'all' || 
      (filter === 'threats' && finding.type === 'threat') ||
      (filter === 'vulnerabilities' && finding.type === 'vulnerability') ||
      (filter === 'patterns' && finding.type === 'pattern') ||
      (filter === 'resolved' && finding.resolved);
    
    const matchesSearch = finding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      finding.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleJoinSession = (session: CollaborationSession) => {
    setActiveSession(session);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleLeaveSession = () => {
    setActiveSession(null);
  };

  const handleCreateSession = () => {
    const newSession: CollaborationSession = {
      id: Date.now().toString(),
      name: 'New Collaboration Session',
      description: 'Real-time security collaboration',
      participants: [teamMembers[0]],
      createdAt: new Date().toISOString(),
      status: 'active',
      sharedFindings: [],
      messages: [],
      isRealTime: true
    };
    
    setSessions([newSession, ...sessions]);
    setActiveSession(newSession);
  };

  const handleShareFinding = (finding: SharedFinding) => {
    if (activeSession) {
      const updatedSession = {
        ...activeSession,
        sharedFindings: [finding, ...activeSession.sharedFindings]
      };
      
      setSessions(sessions.map(s => s.id === activeSession.id ? updatedSession : s));
      setActiveSession(updatedSession);
    }
  };

  const handleExportFindings = () => {
    const dataToExport = activeSession ? activeSession.sharedFindings : filteredFindings;
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `findings-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Container className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">Real-time Collaboration</h1>
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleCreateSession}
            >
              <UserPlus size={16} className="mr-2" />
              New Session
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsRealTime(!isRealTime)}
            >
              {isRealTime ? <Eye size={16} className="mr-2" /> : <EyeOff size={16} className="mr-2" />}
              {isRealTime ? 'Real-time' : 'Archived'}
            </Button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search findings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#111113] border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filter === 'threats' ? 'primary' : 'outline'}
              onClick={() => setFilter('threats')}
              size="sm"
            >
              Threats
            </Button>
            <Button
              variant={filter === 'vulnerabilities' ? 'primary' : 'outline'}
              onClick={() => setFilter('vulnerabilities')}
              size="sm"
            >
              Vulnerabilities
            </Button>
            <Button
              variant={filter === 'resolved' ? 'primary' : 'outline'}
              onClick={() => setFilter('resolved')}
              size="sm"
            >
              Resolved
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">
                {activeSession ? activeSession.name : 'Available Sessions'}
              </h2>
              {activeSession && (
                <Button
                  variant="outline"
                  onClick={handleLeaveSession}
                  size="sm"
                >
                  Leave Session
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            ) : activeSession ? (
              <div className="space-y-4">
                <div className="bg-[#111113] p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-white">{activeSession.name}</h3>
                      <p className="text-sm text-gray-400">{activeSession.description}</p>
                    </div>
                    <Badge variant={activeSession.status === 'active' ? 'success' : 'default'}>
                      {activeSession.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users size={14} />
                    <span>{activeSession.participants.length} participants</span>
                    <Clock size={14} />
                    <span>{new Date(activeSession.createdAt).toLocaleDateString()}</span>
                    {activeSession.isRealTime && (
                      <Zap size={14} className="text-green-400" />
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-white">Shared Findings ({activeSession.sharedFindings.length})</h4>
                  {activeSession.sharedFindings.map((finding) => (
                    <Card key={finding.id} className="p-4 bg-[#111113]">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-white">{finding.title}</h5>
                          <p className="text-sm text-gray-400 mt-1">{finding.description}</p>
                        </div>
                        <Badge variant={finding.severity === 'critical' ? 'error' : finding.severity === 'high' ? 'warning' : 'info'}>
                          {finding.severity}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Eye size={14} />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 size={14} />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 bg-[#111113] cursor-pointer hover:bg-[#1a1a1c] transition-colors rounded-lg"
                    onClick={() => handleJoinSession(session)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{session.name}</h3>
                        <p className="text-sm text-gray-400">{session.description}</p>
                      </div>
                      <Badge variant={session.status === 'active' ? 'success' : 'default'}>
                        {session.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users size={14} />
                      <span>{session.participants.length} participants</span>
                      <Clock size={14} />
                      <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                      {session.isRealTime && (
                        <Zap size={14} className="text-green-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Team Members</h3>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#111113] rounded-full flex items-center justify-center">
                    <Users size={16} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">{member.name}</p>
                      <div className={`w-2 h-2 rounded-full ${
                        member.status === 'online' ? 'bg-green-400' :
                        member.status === 'busy' ? 'bg-yellow-400' : 'bg-gray-400'
                      }`} />
                    </div>
                    <p className="text-sm text-gray-400">{member.email}</p>
                    <p className="text-xs text-gray-500">{member.lastActive}</p>
                  </div>
                  <Badge variant="default" size="sm">
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                onClick={handleExportFindings}
                className="w-full justify-start"
              >
                <Download size={16} className="mr-2" />
                Export Findings
              </Button>
              <Button
                className="w-full justify-start"
              >
                <Filter size={16} className="mr-2" />
                Advanced Filters
              </Button>
              <Button
                className="w-full justify-start"
              >
                <Bell size={16} className="mr-2" />
                Notification Settings
              </Button>
              <Button
                className="w-full justify-start"
              >
                <Settings size={16} className="mr-2" />
                Session Settings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
