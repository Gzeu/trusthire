'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Clock, 
  User, 
  Send,
  FileText,
  Activity,
  Bell,
  CheckCircle,
  Download
} from 'lucide-react';

interface CollaborationPanelProps {
  className?: string;
}

export function RealTimeCollaborationPanelWorking({ className }: CollaborationPanelProps) {
  const [activeUsers, setActiveUsers] = useState([
    { id: 1, name: 'Sarah Chen', status: 'active', avatar: 'SC' },
    { id: 2, name: 'Mike Johnson', status: 'active', avatar: 'MJ' },
    { id: 3, name: 'Emily Davis', status: 'away', avatar: 'ED' }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, user: 'Sarah Chen', message: 'Just completed the threat analysis report', time: '2 min ago' },
    { id: 2, user: 'Mike Johnson', message: 'Found a potential vulnerability in the system', time: '5 min ago' },
    { id: 3, user: 'Emily Davis', message: 'Security assessment is ready for review', time: '10 min ago' }
  ]);

  const [sharedDocuments, setSharedDocuments] = useState([
    { id: 1, title: 'Q1 Security Report', sharedBy: 'Sarah Chen', time: '1 hour ago' },
    { id: 2, title: 'Threat Intelligence Summary', sharedBy: 'Mike Johnson', time: '2 hours ago' },
    { id: 3, title: 'Compliance Checklist', sharedBy: 'Emily Davis', time: '3 hours ago' }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      const randomEvent = Math.random();
      if (randomEvent < 0.3) {
        // Simulate new message
        const sampleMessages = [
          'System update completed successfully',
          'New security patch available',
          'Database backup finished',
          'Performance optimization applied'
        ];
        const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
        const randomUser = activeUsers[Math.floor(Math.random() * activeUsers.length)];
        
        setMessages(prev => [{
          id: Date.now(),
          user: randomUser.name,
          message: randomMessage,
          time: 'Just now'
        }, ...prev.slice(0, 4)]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [activeUsers]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages(prev => [{
        id: Date.now(),
        user: 'You',
        message: newMessage,
        time: 'Just now'
      }, ...prev]);
      setNewMessage('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <Badge variant="outline" className="text-blue-600">
          {activeUsers.filter(u => u.status === 'active').length} active users
        </Badge>
      </div>

      {/* Active Users */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Team Members</span>
          </h3>
          <Button variant="outline" size="sm">
            <User className="w-4 h-4 mr-2" />
            Invite
          </Button>
        </div>
        
        <div className="space-y-3">
          {activeUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {user.avatar}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.status}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Team Chat */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Team Chat</span>
          </h3>
          <Badge variant="outline">{messages.length} messages</Badge>
        </div>

        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-medium text-xs">
                {message.user.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm font-medium">{message.user}</p>
                  <p className="text-xs text-gray-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{message.time}</span>
                  </p>
                </div>
                <p className="text-sm text-gray-700">{message.message}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Shared Documents */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Shared Documents</span>
          </h3>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        <div className="space-y-3">
          {sharedDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">{doc.title}</p>
                  <p className="text-xs text-gray-500">
                    Shared by {doc.sharedBy} · {doc.time}
                  </p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm">
                  <Activity className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Activity Feed */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Recent Activity</span>
          </h3>
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">Security assessment completed</p>
              <p className="text-xs text-gray-500">Sarah Chen · 5 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">Threat analysis report generated</p>
              <p className="text-xs text-gray-500">Mike Johnson · 15 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <Bell className="w-5 h-5 text-yellow-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">New security alert detected</p>
              <p className="text-xs text-gray-500">System · 30 minutes ago</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
