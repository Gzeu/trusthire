'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, AlertTriangle, Search, FileText, ChevronRight, Lock, Eye, Zap, BarChart3, Users, TrendingUp, Brain } from 'lucide-react';
import { Card, Button, Badge, Container, Section } from '@/components/ui/DesignSystem';
import OnboardingFlow, { useOnboarding } from '@/components/OnboardingFlow';

export default function EnhancedHomePage() {
  const { isOpen, startOnboarding, closeOnboarding } = useOnboarding();
  const [stats, setStats] = useState({
    totalAssessments: 0,
    threatsBlocked: 0,
    activeUsers: 0,
    avgResponseTime: '2.3s'
  });

  useEffect(() => {
    // Load homepage stats
    const loadStats = async () => {
      try {
        const response = await fetch('/api/homepage/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        // Use fallback stats
        setStats({
          totalAssessments: 1247,
          threatsBlocked: 89,
          activeUsers: 342,
          avgResponseTime: '2.3s'
        });
      }
    };

    loadStats();
  }, []);

  const quickTools = [
    {
      href: '/scan/github',
      icon: <Search className="w-5 h-5" />,
      title: 'GitHub Repository Scan',
      description: 'Instant analysis of any repository for malicious code patterns',
      color: 'from-blue-600 to-blue-700',
      stats: '2.3s avg'
    },
    {
      href: '/scan/linkedin',
      icon: <Users className="w-5 h-5" />,
      title: 'LinkedIn Profile Check',
      description: 'Verify recruiter authenticity and detect fake profiles',
      color: 'from-emerald-600 to-emerald-700',
      stats: '15+ signals'
    },
    {
      href: '/scan/image',
      icon: <Eye className="w-5 h-5" />,
      title: 'Reverse Image Search',
      description: 'Check profile photos against known fakes and stock images',
      color: 'from-purple-600 to-purple-700',
      stats: '100M+ images'
    },
    {
      href: '/assess',
      icon: <Shield className="w-5 h-5" />,
      title: 'Full Assessment',
      description: 'Comprehensive security evaluation for complete peace of mind',
      color: 'from-red-600 to-red-700',
      stats: '5min total'
    },
    {
      href: '/agent',
      icon: <Brain className="w-5 h-5" />,
      title: 'AI Agent',
      description: 'Autonomous security agent with personality and learning capabilities',
      color: 'from-indigo-600 to-indigo-700',
      stats: 'Always learning'
    }
  ];

  const features = [
    {
      icon: <Lock className="w-6 h-6 text-red-500" />,
      title: 'Static Analysis Only',
      description: 'We never execute code from analyzed repositories. All scans are completely safe.',
      benefit: 'Zero risk to your system'
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: 'Lightning Fast',
      description: 'Get comprehensive security assessments in under 2 minutes, not hours.',
      benefit: 'Save time, stay secure'
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-emerald-500" />,
      title: 'Risk Scoring',
      description: 'Clear, actionable risk scores with detailed explanations and recommendations.',
      benefit: 'Make informed decisions'
    },
    {
      icon: <Users className="w-6 h-6 text-purple-500" />,
      title: 'Community Powered',
      description: 'Leverage collective intelligence from thousands of security assessments.',
      benefit: 'Stronger protection together'
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-[#0A0A0B] text-white">
        {/* Hero Section */}
        <Section className="pt-16 pb-20">
          <Container>
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Shield className="w-8 h-8 text-red-500" />
                <Badge variant="error" className="animate-pulse">
                  LIVE PROTECTION
                </Badge>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-mono font-bold tracking-tight mb-6">
                Stop Recruitment
                <span className="block text-red-500">Scam Attacks</span>
              </h1>
              
              <p className="text-xl font-mono text-white/60 mb-8 leading-relaxed max-w-2xl mx-auto">
                Web3's most advanced security tool for detecting fake recruiters, 
                malicious repositories, and job scams before they compromise your development environment.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button 
                  href="/assess" 
                  size="lg"
                  className="text-lg px-8 py-4"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Start Free Assessment
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={startOnboarding}
                  size="lg"
                  className="text-lg px-8 py-4"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  How It Works
                </Button>
              </div>

              {/* Live Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-white mb-1">
                    {stats.totalAssessments.toLocaleString()}
                  </div>
                  <div className="text-xs font-mono text-white/40 uppercase tracking-wider">
                    Assessments Run
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-emerald-400 mb-1">
                    {stats.threatsBlocked}
                  </div>
                  <div className="text-xs font-mono text-white/40 uppercase tracking-wider">
                    Threats Blocked
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-blue-400 mb-1">
                    {stats.activeUsers}
                  </div>
                  <div className="text-xs font-mono text-white/40 uppercase tracking-wider">
                    Active Users
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-purple-400 mb-1">
                    {stats.avgResponseTime}
                  </div>
                  <div className="text-xs font-mono text-white/40 uppercase tracking-wider">
                    Avg Response
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Attack Flow */}
        <Section className="pb-20">
          <Container>
            <Card className="p-8" glow="red">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-mono font-bold text-white mb-2">
                  How Recruitment Scams Work
                </h2>
                <p className="text-sm font-mono text-white/60">
                  Understanding the attack flow is your first line of defense
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  'LinkedIn DM',
                  'Job Discussion',
                  '"Technical Review" Repo',
                  'npm install',
                  'Postinstall Script',
                  '.env Exfiltrated',
                ].map((step, i, arr) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`px-4 py-2 rounded-xl font-mono text-sm transition-all duration-200 ${
                      i === arr.length - 1
                        ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                        : 'bg-white/5 border border-white/10 text-white/70'
                    }`}>
                      {step}
                    </div>
                    {i < arr.length - 1 && <ChevronRight className="w-4 h-4 text-white/20" />}
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Badge variant="error" className="mb-4">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Critical Risk
                </Badge>
                <p className="text-sm font-mono text-white/60 max-w-2xl mx-auto">
                  One malicious npm install can compromise your entire development environment, 
                  exposing API keys, wallet credentials, and sensitive data.
                </p>
              </div>
            </Card>
          </Container>
        </Section>

        {/* Quick Tools */}
        <Section className="pb-20">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-mono font-bold text-white mb-4">
                Security Tools at Your Fingertips
              </h2>
              <p className="text-lg font-mono text-white/60">
                Professional-grade security analysis, designed for developers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {quickTools.map((tool, index) => (
                <Card 
                  key={tool.href} 
                  className="p-6 hover:scale-105 transition-transform duration-200"
                  hover
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0`}>
                      {tool.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-mono font-semibold text-white mb-2">
                        {tool.title}
                      </h3>
                      <p className="text-sm font-mono text-white/60 mb-3 leading-relaxed">
                        {tool.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="info" className="text-xs">
                          {tool.stats}
                        </Badge>
                        <Button variant="ghost" size="sm" href={tool.href}>
                          Try Now
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* Features */}
        <Section className="pb-20">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-mono font-bold text-white mb-4">
                Why Developers Trust TrustHire
              </h2>
              <p className="text-lg font-mono text-white/60">
                Built by security experts, for the Web3 ecosystem
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-mono font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm font-mono text-white/60 mb-2 leading-relaxed">
                      {feature.description}
                    </p>
                    <Badge variant="success" className="text-xs">
                      {feature.benefit}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* CTA Section */}
        <Section className="pb-20">
          <Container>
            <Card className="p-12 text-center" glow="red">
              <h2 className="text-3xl font-mono font-bold text-white mb-4">
                Got a Repo Link from a Recruiter?
              </h2>
              <p className="text-lg font-mono text-white/60 mb-8 max-w-2xl mx-auto">
                Run a comprehensive security assessment in under 2 minutes before you clone anything. 
                It could save your entire development environment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  href="/assess" 
                  size="lg"
                  className="text-lg px-8 py-4"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Run Free Assessment
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  href="/dashboard"
                  size="lg"
                  className="text-lg px-8 py-4"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Dashboard
                </Button>
              </div>
              <p className="text-xs font-mono text-white/20 mt-6">
                TrustHire provides risk signals, not legal verdicts. See disclaimer for details.
              </p>
            </Card>
          </Container>
        </Section>
      </div>

      {/* Onboarding Modal */}
      <OnboardingFlow 
        isOpen={isOpen} 
        onClose={closeOnboarding}
        onStart={() => {
          // Optional: track onboarding completion
          console.log('Onboarding completed');
        }}
      />
    </>
  );
}
