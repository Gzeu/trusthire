'use client';

import Link from 'next/link';
import { Shield, AlertTriangle, Search, FileText, ChevronRight, Lock, Eye, Zap } from 'lucide-react';
import EnhancedHeroSection from '@/components/EnhancedHeroSection';
import EnhancedQuickScanCards from '@/components/EnhancedQuickScanCards';
import EnhancedActionButtons from '@/components/EnhancedActionButtons';
import SocialProofSection from '@/components/SocialProofSection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Enhanced Hero Section */}
      <EnhancedHeroSection />

      {/* Enhanced Quick Scan Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <EnhancedQuickScanCards />
      </section>

      {/* Enhanced Action Buttons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <EnhancedActionButtons />
      </section>

      {/* Social Proof Section */}
      <SocialProofSection />

      {/* Attack flow */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-[#111113] border border-white/5 rounded-2xl p-8">
          <p className="text-white/40 text-xs font-mono mb-6 uppercase tracking-widest">Documented attack flow</p>
          <div className="flex flex-wrap items-center gap-3">
            {[
              'LinkedIn DM',
              'Job discussion (salary, remote)',
              '"Technical review" repo',
              'npm install',
              'postinstall script runs',
              '.env exfiltrated ð',
            ].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-3">
                <div className={`px-3 py-1.5 rounded font-mono text-sm ${
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
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Eye,
              title: 'Identity Analysis',
              desc: 'Evaluate recruiter profile consistency across 4 trust dimensions',
            },
            {
              icon: Search,
              title: 'Repo Scanner',
              desc: 'Static analysis for postinstall hooks, eval, env exfiltration â no code execution',
            },
            {
              icon: AlertTriangle,
              title: 'Red Flag Detector',
              desc: '20+ social engineering patterns specific to Web3 hiring scams',
            },
            {
              icon: FileText,
              title: 'Incident Reports',
              desc: 'Generate structured reports for GitHub, LinkedIn, DNSC, CISA',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-[#111113] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
              <Icon className="w-5 h-5 text-red-500 mb-4" />
              <h3 className="font-mono font-bold mb-2">{title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <blockquote className="border-l-2 border-red-500 pl-6">
          <p className="text-white/60 text-lg italic leading-relaxed">
            &ldquo;The attack is simple: fake recruiter, real-looking repo,
            one npm install, and your .env is gone.&rdquo;
          </p>
          <footer className="text-white/30 text-sm font-mono mt-3">â Real case, blockchain developer, 2026</footer>
        </blockquote>
      </section>

      {/* Principles */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Lock, title: 'No code executed', desc: 'All scanning is purely static. We never run code from analyzed repositories.' },
            { icon: Eye, title: 'No data stored by default', desc: 'Input is processed in-session. History is opt-in only.' },
            { icon: Zap, title: 'Risk signals, not verdicts', desc: 'We report confidence levels and missing evidence â never accusations.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-white/50" />
              </div>
              <div>
                <h4 className="font-mono font-semibold mb-1">{title}</h4>
                <p className="text-white/40 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center bg-[#111113] border border-white/5 rounded-3xl p-12">
          <h2 className="text-3xl font-mono font-bold mb-4">Got a repo link from a recruiter?</h2>
          <p className="text-white/40 mb-8">Run a full assessment in under 2 minutes before you clone anything.</p>
          <Link
            href="/assess"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold px-10 py-4 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-red-600/20 transform hover:scale-105 text-lg"
          >
            Run Free Assessment <ChevronRight className="w-5 h-5" />
          </Link>
          <p className="text-white/20 text-xs font-mono mt-6">
            TrustHire provides risk signals, not legal verdicts. See disclaimer.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-500" />
            <span className="font-mono text-sm text-white/40">TrustHire â Security due diligence for developers</span>
          </div>
          <div className="flex gap-6">
            <Link href="/disclaimer" className="text-white/30 text-xs font-mono hover:text-white/60 transition-colors">Disclaimer</Link>
            <Link href="/privacy" className="text-white/30 text-xs font-mono hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="/monitoring" className="text-white/30 text-xs font-mono hover:text-white/60 transition-colors">Monitoring</Link>
            <a href="https://github.com/Gzeu/trusthire" target="_blank" rel="noopener noreferrer" className="text-white/30 text-xs font-mono hover:text-white/60 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
