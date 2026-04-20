'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Brain, 
  Shield, 
  Zap, 
  BarChart3, 
  Users, 
  Globe, 
  Lock,
  Activity,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Bot,
  Cpu,
  Database,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const [stats, setStats] = useState({
    totalScans: 0,
    threatsDetected: 0,
    aiAnalyses: 0,
    uptime: '99.9%'
  });

  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Simulate real-time stats
    const interval = setInterval(() => {
      setStats(prev => ({
        totalScans: prev.totalScans + Math.floor(Math.random() * 3),
        threatsDetected: prev.threatsDetected + (Math.random() > 0.8 ? 1 : 0),
        aiAnalyses: prev.aiAnalyses + Math.floor(Math.random() * 2),
        uptime: prev.uptime
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze candidates, code repositories, and security threats with unprecedented accuracy.',
      gradient: 'from-blue-600 to-purple-600'
    },
    {
      icon: Shield,
      title: 'Autonomous Security',
      description: 'Self-healing security protocols that automatically detect, analyze, and neutralize threats in real-time.',
      gradient: 'from-green-600 to-teal-600'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process hundreds of candidates and security scans in minutes with our optimized autonomous engine.',
      gradient: 'from-yellow-600 to-orange-600'
    },
    {
      icon: Bot,
      title: 'Intelligent Automation',
      description: 'Smart workflows that learn and adapt to your organization\'s unique security needs.',
      gradient: 'from-purple-600 to-pink-600'
    }
  ];

  const metrics = [
    { label: 'Total Scans', value: stats.totalScans.toLocaleString(), icon: Eye, change: '+12%' },
    { label: 'Threats Detected', value: stats.threatsDetected.toString(), icon: Shield, change: '+8%' },
    { label: 'AI Analyses', value: stats.aiAnalyses.toLocaleString(), icon: Brain, change: '+25%' },
    { label: 'System Uptime', value: stats.uptime, icon: Activity, change: 'Stable' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-3xl opacity-50" />
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
                  <Brain className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              TrustHire
              <span className="block text-2xl sm:text-3xl lg:text-4xl mt-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Autonomous Security System
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Revolutionary AI-powered security and candidate analysis platform that autonomously protects your organization 
              while identifying top talent with unprecedented accuracy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold">
                <Sparkles className="mr-2 h-5 w-5" />
                Start AI Analysis
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Dashboard
              </Button>
            </div>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="h-8 w-8 text-blue-400" />
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        {metric.change}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                    <div className="text-sm text-gray-400">{metric.label}</div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Advanced AI Capabilities
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Cutting-edge artificial intelligence powers every aspect of security and talent analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <div className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Experience AI Power
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See our autonomous system in action with real-time analysis
            </p>
          </div>

          <Card className="bg-white/5 backdrop-blur-md border-white/10 max-w-4xl mx-auto">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-full text-white text-sm font-medium mb-4">
                  <Cpu className="mr-2 h-4 w-4" />
                  AI Engine Active
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Try Autonomous Analysis</h3>
                <p className="text-gray-300 mb-6">
                  Enter any candidate profile, repository URL, or security threat to see instant AI analysis
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10 justify-center"
                  onClick={() => setIsScanning(true)}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Analyze Candidate
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10 justify-center"
                  onClick={() => setIsScanning(true)}
                >
                  <Globe className="mr-2 h-5 w-5" />
                  Scan Repository
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10 justify-center"
                  onClick={() => setIsScanning(true)}
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Security Check
                </Button>
              </div>

              {isScanning && (
                <div className="mt-6 p-4 bg-blue-600/20 border border-blue-400/30 rounded-lg">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3" />
                    <span className="text-blue-300">AI analysis in progress...</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Revolutionize Your Security?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of organizations using TrustHire's autonomous AI to protect their assets 
                and find exceptional talent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                  <Lock className="mr-2 h-5 w-5" />
                  Enterprise Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Brain className="h-8 w-8 text-blue-400 mr-3" />
              <span className="text-xl font-bold text-white">TrustHire</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2026 TrustHire Autonomous Security System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
