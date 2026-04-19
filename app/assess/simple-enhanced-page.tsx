'use client';

import { useState, useCallback } from 'react';
import { Shield, Search, AlertTriangle, CheckCircle, Play, FileText, Users, Zap, Copy, Download, Share2, Clock, TrendingUp } from 'lucide-react';
import { Card, Button, Badge, Container, Section, Skeleton } from '@/components/ui/DesignSystem';

interface QuickAssessment {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  duration: string;
  risk: 'low' | 'medium' | 'high';
}

const quickAssessments: QuickAssessment[] = [
  {
    id: 'github',
    title: 'GitHub Repository',
    description: 'Analyze any repository for malicious code patterns and security risks',
    icon: <FileText className="w-5 h-5" />,
    href: '/scan/github',
    duration: '~30s',
    risk: 'high'
  },
  {
    id: 'linkedin',
    title: 'LinkedIn Profile',
    description: 'Verify recruiter authenticity and detect fake profiles',
    icon: <Users className="w-5 h-5" />,
    href: '/scan/linkedin',
    duration: '~15s',
    risk: 'medium'
  },
  {
    id: 'url',
    title: 'URL Analysis',
    description: 'Check any URL for phishing, malware, and security issues',
    icon: <Search className="w-5 h-5" />,
    href: '/scan/url',
    duration: '~10s',
    risk: 'low'
  },
  {
    id: 'comprehensive',
    title: 'Full Assessment',
    description: 'Complete security evaluation with detailed reporting',
    icon: <Shield className="w-5 h-5" />,
    href: '/assess/comprehensive',
    duration: '~5min',
    risk: 'high'
  }
];

export default function SimpleEnhancedAssessPage() {
  const [selectedAssessment, setSelectedAssessment] = useState<string>('');

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Container size="lg" className="py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-red-500" />
            <Badge variant="error" className="animate-pulse">
              SECURITY ASSESSMENT
            </Badge>
          </div>
          <h1 className="text-4xl font-mono font-bold text-white mb-4">
            Security Assessment Center
          </h1>
          <p className="text-lg font-mono text-white/60 max-w-3xl">
            Choose an assessment type to analyze potential security threats. 
            All scans are performed in isolated environments for maximum safety.
          </p>
        </div>

        {/* Quick Assessment Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickAssessments.map((assessment) => (
            <div
              key={assessment.id}
              className={`p-6 cursor-pointer transition-all duration-200 rounded-3xl border ${
                selectedAssessment === assessment.id
                  ? 'border-red-500/50 bg-red-500/10 scale-105'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
              onClick={() => setSelectedAssessment(assessment.id)}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  assessment.risk === 'high' ? 'bg-red-500/20' :
                  assessment.risk === 'medium' ? 'bg-orange-500/20' : 'bg-emerald-500/20'
                }`}>
                  {assessment.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-mono font-semibold text-white mb-1">
                    {assessment.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className={`text-xs ${
                      assessment.risk === 'high' ? 'border-red-500 text-red-400' :
                      assessment.risk === 'medium' ? 'border-orange-500 text-orange-400' : 'border-emerald-500 text-emerald-400'
                    }`}>
                      {assessment.risk.toUpperCase()} RISK
                    </Badge>
                    <span className="text-xs font-mono text-white/40">
                      {assessment.duration}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm font-mono text-white/60 leading-relaxed">
                {assessment.description}
              </p>
            </div>
          ))}
        </div>

        {/* Selected Assessment Detail */}
        {selectedAssessment && (
          <Card className="p-8">
            <div className="text-center">
              <h2 className="text-xl font-mono font-semibold text-white mb-4">
                Ready to start: {quickAssessments.find(a => a.id === selectedAssessment)?.title}
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href={quickAssessments.find(a => a.id === selectedAssessment)?.href || '#'}>
                  <Play className="w-4 h-4 mr-2" />
                  Start Assessment
                </Button>
                <Button variant="secondary">
                  <Shield className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-mono font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Assessments
          </h2>
          <div className="space-y-3">
            {[
              { id: '1', type: 'GitHub Repository', risk: 'high', time: '2 hours ago' },
              { id: '2', type: 'LinkedIn Profile', risk: 'medium', time: '5 hours ago' },
              { id: '3', type: 'URL Analysis', risk: 'low', time: '1 day ago' }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-semibold ${
                    item.risk === 'high' ? 'bg-red-500/20 text-red-400' :
                    item.risk === 'medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {item.risk.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-mono text-white">{item.type}</p>
                    <p className="text-xs font-mono text-white/40">{item.time}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </Container>
    </div>
  );
}
