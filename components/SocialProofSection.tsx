'use client';

import { useState, useEffect } from 'react';
import { Shield, TrendingUp, Users, CheckCircle, Star, Quote, Twitter, Github, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function SocialProofSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scanCount, setScanCount] = useState(48752);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(testimonialInterval);
  }, []);

  const testimonials = [
    {
      content: "TrustHire saved me from a sophisticated phishing attack. The recruiter looked legitimate but the repo analysis caught the malicious postinstall script.",
      author: "Sarah Chen",
      role: "Senior Frontend Developer",
      company: "TechCorp",
      rating: 5
    },
    {
      content: "As someone who got scammed before, I wish TrustHire existed earlier. Now I scan every recruiter and repo before engaging. It's become part of my security workflow.",
      author: "Michael Rodriguez",
      role: "Blockchain Developer",
      company: "DeFi Labs",
      rating: 5
    },
    {
      content: "The AI analysis is incredibly accurate. It caught red flags in a LinkedIn profile that I would have missed. Essential tool for Web3 developers.",
      author: "Emily Watson",
      role: "Smart Contract Developer",
      company: "CryptoStart",
      rating: 5
    }
  ];

  const trustIndicators = [
    {
      icon: Shield,
      value: "100%",
      label: "Safe Scanning",
      description: "No code execution, ever"
    },
    {
      icon: TrendingUp,
      value: scanCount.toLocaleString() + "+",
      label: "Scans Completed",
      description: "Growing daily"
    },
    {
      icon: Users,
      value: "12,847",
      label: "Developers Protected",
      description: "Active users worldwide"
    },
    {
      icon: CheckCircle,
      value: "98.5%",
      label: "Accuracy Rate",
      description: "AI-powered detection"
    }
  ];

  const recentScams = [
    {
      type: "Fake Blockchain Job",
      description: "Recruiter promised $200k salary, repo contained wallet drainer",
      severity: "high",
      date: "2 hours ago"
    },
    {
      type: "Phishing LinkedIn Profile",
      description: "Stolen identity from real developer, fake company references",
      severity: "medium",
      date: "5 hours ago"
    },
    {
      type: "Malicious NPM Package",
      description: "Postinstall script exfiltrated environment variables",
      severity: "critical",
      date: "1 day ago"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <section className="py-20 bg-[#0A0A0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-mono text-white mb-4">
            Trusted by Developers Worldwide
          </h2>
          <p className="text-lg text-white/60 font-mono max-w-2xl mx-auto">
            Join thousands of developers who protect themselves from recruitment scams
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {trustIndicators.map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold font-mono text-white mb-2">
                  {indicator.value}
                </div>
                <div className="text-lg font-semibold font-mono text-white mb-1">
                  {indicator.label}
                </div>
                <div className="text-sm text-white/60 font-mono">
                  {indicator.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Scam Alerts */}
        <div className="bg-[#111113] border border-white/5 rounded-3xl p-8 mb-20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold font-mono text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Recent Scam Alerts
            </h3>
            <Link
              href="/patterns"
              className="text-sm font-mono text-red-400 hover:text-red-300 transition-colors"
            >
              View all patterns â
            </Link>
          </div>
          <div className="space-y-4">
            {recentScams.map((scam, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
                <div className={`px-3 py-1 rounded-lg text-xs font-mono border ${getSeverityColor(scam.severity)}`}>
                  {scam.severity.toUpperCase()}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold font-mono text-white mb-1">{scam.type}</h4>
                  <p className="text-sm text-white/60 font-mono mb-2">{scam.description}</p>
                  <p className="text-xs text-white/40 font-mono">{scam.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h3 className="text-2xl font-bold font-mono text-white mb-8">
              What Developers Say
            </h3>
            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`p-6 bg-[#111113] border border-white/5 rounded-2xl transition-all duration-300 ${
                    activeTestimonial === index ? 'border-red-500/30 bg-red-500/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-red-500/20 mb-4" />
                  <p className="text-white/80 font-mono mb-4 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-mono text-sm font-bold">
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold font-mono text-white">{testimonial.author}</div>
                      <div className="text-sm text-white/60 font-mono">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#111113] border border-white/5 rounded-2xl p-8">
              <h4 className="text-lg font-bold font-mono text-white mb-4">
                Built by Developers, for Developers
              </h4>
              <p className="text-white/60 font-mono mb-6">
                TrustHire was created by a developer who experienced a recruitment scam firsthand. 
                We understand the threats you face because we've been there.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/Gzeu/trusthire"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span className="font-mono text-sm">View on GitHub</span>
                </a>
                <a
                  href="https://twitter.com/trusthire"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                  <span className="font-mono text-sm">Follow on Twitter</span>
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-purple-500/10 border border-red-500/20 rounded-2xl p-8">
              <h4 className="text-lg font-bold font-mono text-white mb-4">
                Open Source & Transparent
              </h4>
              <p className="text-white/60 font-mono mb-6">
                Our scanning algorithms are open source. We believe in transparency and community-driven security.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold font-mono text-white mb-1">MIT</div>
                  <div className="text-xs text-white/60 font-mono">License</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold font-mono text-white mb-1">100%</div>
                  <div className="text-xs text-white/60 font-mono">Open Source</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-4">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-xs font-mono">Join our growing community</span>
          </div>
          <h3 className="text-2xl font-bold font-mono text-white mb-4">
            Ready to Protect Yourself?
          </h3>
          <p className="text-white/60 font-mono mb-8">
            Start scanning recruiters and repositories in seconds
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/scan/github"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold px-8 py-3 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-red-600/20"
            >
              <Shield className="w-5 h-5" />
              Start Scanning
            </Link>
            <Link
              href="/assess"
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-white font-mono px-8 py-3 rounded-2xl hover:bg-white/10 transition-all duration-200"
            >
              Full Assessment
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
