'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, AlertTriangle, ChevronRight, TrendingUp, Users, CheckCircle, ArrowRight, Zap, Github, Linkedin, Search, Image, FileText } from 'lucide-react';

export default function EnhancedHeroSection() {
  const [scanCount, setScanCount] = useState(48752);
  const [activeDemo, setActiveDemo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const demoInterval = setInterval(() => {
      setActiveDemo(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(demoInterval);
  }, []);

  const quickTools = [
    { icon: Github, label: 'GitHub Scan', href: '/scan/github' },
    { icon: Linkedin, label: 'LinkedIn Check', href: '/scan/linkedin' },
    { icon: Image, label: 'Image Search', href: '/scan/image' },
    { icon: FileText, label: 'Forms Scan', href: '/scan/forms' },
  ];

  const demoSteps = [
    {
      title: '1. Paste Link',
      description: 'GitHub repo, LinkedIn profile, or form URL',
      icon: <Search className="w-5 h-5" />
    },
    {
      title: '2. AI Analysis',
      description: 'Deep scan for malicious patterns and red flags',
      icon: <Zap className="w-5 h-5" />
    },
    {
      title: '3. Get Results',
      description: 'Risk score and actionable security insights',
      icon: <Shield className="w-5 h-5" />
    }
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-purple-500/5" />
      <div className="absolute inset-0 opacity-20">
            <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <g fill="none" fillRule="evenodd">
                <g fill="#9C92AC" fillOpacity="0.05">
                  <circle cx="30" cy="30" r="2"/>
                </g>
              </g>
            </svg>
          </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
        {/* Alert Banner */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 backdrop-blur-sm">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs font-mono">Blockchain/Web3 hiring scams are rising</span>
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold font-mono leading-tight mb-6">
            <span className="text-white">Verify recruiters</span>
            <br />
            <span className="text-red-500">before you </span>
            <span className="text-white/30">npm install</span>
          </h1>

          <p className="text-xl text-white/60 max-w-3xl mx-auto mb-8 leading-relaxed font-mono">
            A recruiter sent you a GitHub repo. The badge looks legit. The salary is great.
            <br />
            <strong className="text-white/80">One postinstall script later &mdash; your .env is gone.</strong>
          </p>

          {/* Quick Tools */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {quickTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.label}
                  href={tool.href}
                  className="group flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <Icon className="w-4 h-4 text-white/70 group-hover:text-white" />
                  <span className="text-sm font-mono text-white/70 group-hover:text-white">{tool.label}</span>
                  <ArrowRight className="w-3 h-3 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/assess"
              className="group inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-mono font-bold px-8 py-4 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-red-600/20 transform hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              <span>Start Full Assessment</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/scan/github"
              className="group inline-flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 text-white font-mono rounded-2xl hover:bg-white/10 transition-all duration-200"
            >
              <Search className="w-5 h-5" />
              <span>Quick Scan</span>
            </Link>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <span className="ml-2 text-3xl font-bold font-mono text-white">{scanCount.toLocaleString()}+</span>
            </div>
            <p className="text-sm text-white/60 font-mono">Security scans completed</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-blue-400" />
              <span className="ml-2 text-3xl font-bold font-mono text-white">12,847</span>
            </div>
            <p className="text-sm text-white/60 font-mono">Developers protected</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6 text-purple-400" />
              <span className="ml-2 text-3xl font-bold font-mono text-white">98.5%</span>
            </div>
            <p className="text-sm text-white/60 font-mono">Accuracy rate</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-[#111113] border border-white/5 rounded-3xl p-8">
          <h2 className="text-2xl font-bold font-mono text-white text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {demoSteps.map((step, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-500 ${
                  activeDemo === index ? 'scale-105' : 'scale-100 opacity-70'
                }`}
              >
                <div className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4
                  transition-all duration-300
                  ${activeDemo === index 
                    ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500/30' 
                    : 'bg-white/5 text-white/60'
                  }
                `}>
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold font-mono text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/60 font-mono">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
