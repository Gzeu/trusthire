import Link from 'next/link';
import { Shield, AlertTriangle, Search, FileText, ChevronRight, Lock, Eye, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-red-500" />
          <span className="font-mono font-bold text-lg tracking-tight">TrustHire</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/patterns" className="text-sm text-white/50 hover:text-white transition-colors font-mono">
            Threat DB
          </Link>
          <Link
            href="/assess"
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-mono px-4 py-2 rounded transition-colors"
          >
            Start Assessment
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-400 text-xs font-mono">Blockchain/Web3 hiring scams are rising</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold font-mono leading-tight mb-6">
          Know who you&apos;re dealing with
          <br />
          <span className="text-red-500">before you </span>
          <span className="text-white/30">npm install</span>
        </h1>

        <p className="text-white/50 text-xl max-w-2xl mb-10 leading-relaxed">
          A recruiter sent you a GitHub repo. The badge looks legit. The salary is great.
          <br />
          <strong className="text-white/80">One postinstall script later — your .env is gone.</strong>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link
            href="/assess"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold px-8 py-4 rounded-lg transition-colors text-lg"
          >
            Start Free Assessment <ChevronRight className="w-5 h-5" />
          </Link>
          <Link
            href="/patterns"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono px-8 py-4 rounded-lg transition-colors text-lg"
          >
            Browse Threat DB
          </Link>
        </div>

        {/* Attack flow */}
        <div className="bg-[#111113] border border-white/5 rounded-xl p-8 mb-20">
          <p className="text-white/40 text-xs font-mono mb-6 uppercase tracking-widest">Documented attack flow</p>
          <div className="flex flex-wrap items-center gap-3">
            {[
              'LinkedIn DM',
              'Job discussion (salary, remote)',
              '"Technical review" repo',
              'npm install',
              'postinstall script runs',
              '.env exfiltrated 🚨',
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

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {[
            {
              icon: Eye,
              title: 'Identity Analysis',
              desc: 'Evaluate recruiter profile consistency across 4 trust dimensions',
            },
            {
              icon: Search,
              title: 'Repo Scanner',
              desc: 'Static analysis for postinstall hooks, eval, env exfiltration — no code execution',
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
            <div key={title} className="bg-[#111113] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors">
              <Icon className="w-5 h-5 text-red-500 mb-4" />
              <h3 className="font-mono font-bold mb-2">{title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <blockquote className="border-l-2 border-red-500 pl-6 mb-20">
          <p className="text-white/60 text-lg italic leading-relaxed">
            &ldquo;The attack is simple: fake recruiter, real-looking repo,
            one npm install, and your .env is gone.&rdquo;
          </p>
          <footer className="text-white/30 text-sm font-mono mt-3">— Real case, blockchain developer, 2026</footer>
        </blockquote>

        {/* Principles */}
        <div className="grid md:grid-cols-3 gap-4 mb-20">
          {[
            { icon: Lock, title: 'No code executed', desc: 'All scanning is purely static. We never run code from analyzed repositories.' },
            { icon: Eye, title: 'No data stored by default', desc: 'Input is processed in-session. History is opt-in only.' },
            { icon: Zap, title: 'Risk signals, not verdicts', desc: 'We report confidence levels and missing evidence — never accusations.' },
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

        {/* CTA */}
        <div className="text-center bg-[#111113] border border-white/5 rounded-2xl p-12">
          <h2 className="text-3xl font-mono font-bold mb-4">Got a repo link from a recruiter?</h2>
          <p className="text-white/40 mb-8">Run a full assessment in under 2 minutes before you clone anything.</p>
          <Link
            href="/assess"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold px-10 py-4 rounded-lg transition-colors text-lg"
          >
            Run Free Assessment <ChevronRight className="w-5 h-5" />
          </Link>
          <p className="text-white/20 text-xs font-mono mt-6">
            TrustHire provides risk signals, not legal verdicts. See disclaimer.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-500" />
          <span className="font-mono text-sm text-white/40">TrustHire — Security due diligence for developers</span>
        </div>
        <div className="flex gap-6">
          <Link href="/disclaimer" className="text-white/30 text-xs font-mono hover:text-white/60 transition-colors">Disclaimer</Link>
          <Link href="/privacy" className="text-white/30 text-xs font-mono hover:text-white/60 transition-colors">Privacy</Link>
          <a href="https://github.com/Gzeu/trusthire" target="_blank" rel="noopener noreferrer" className="text-white/30 text-xs font-mono hover:text-white/60 transition-colors">GitHub</a>
        </div>
      </footer>
    </main>
  );
}
