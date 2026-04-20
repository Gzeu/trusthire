'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  Database, 
  FlaskConical, 
  Activity, 
  PlusCircle,
  Github,
  Linkedin,
  Search,
  Image,
  FileText,
  ChevronDown,
  Menu,
  X,
  Zap,
  Eye,
  AlertTriangle,
  Brain
} from 'lucide-react';

const quickTools = [
  { href: '/scan/github', label: 'GitHub Repo Scan', icon: Github, description: 'Analyze repositories for malicious code' },
  { href: '/scan/linkedin', label: 'LinkedIn Profile Check', icon: Linkedin, description: 'Verify recruiter authenticity' },
  { href: '/scan/image', label: 'Reverse Image Search', icon: Image, description: 'Check profile pictures for fakes' },
  { href: '/scan/forms', label: 'Google Forms Scan', icon: FileText, description: 'Analyze forms for phishing' },
  { href: '/scan/url', label: 'URL Scanner', icon: Search, description: 'Check links for threats' },
];

const mainNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/patterns', label: 'Patterns', icon: Database },
  { href: '/sandbox', label: 'Sandbox', icon: FlaskConical },
  { href: '/monitoring', label: 'Monitoring', icon: Activity },
  { href: '/agent', label: 'AI Agent', icon: Brain },
];

export default function EnhancedNavbar() {
  const pathname = usePathname();
  const [isQuickToolsOpen, setIsQuickToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0B]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-mono font-bold text-lg tracking-tight text-white">TrustHire</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Quick Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsQuickToolsOpen(!isQuickToolsOpen)}
                onMouseEnter={() => setIsQuickToolsOpen(true)}
                onMouseLeave={() => setIsQuickToolsOpen(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono transition-all duration-200 ${
                  pathname.startsWith('/scan') 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Quick Tools</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isQuickToolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isQuickToolsOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-80 bg-[#111113] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                  onMouseEnter={() => setIsQuickToolsOpen(true)}
                  onMouseLeave={() => setIsQuickToolsOpen(false)}
                >
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-mono text-white/50 uppercase tracking-wider mb-2">
                      Quick Scans
                    </div>
                    {quickTools.map((tool) => {
                      const Icon = tool.icon;
                      const toolActive = isActive(tool.href);
                      return (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                            toolActive 
                              ? 'bg-red-500/10 text-red-400' 
                              : 'text-white/70 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            toolActive ? 'bg-red-500/20' : 'bg-white/5'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="font-mono text-sm font-medium">{tool.label}</div>
                            <div className="font-mono text-xs text-white/50">{tool.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Main Navigation */}
            {mainNav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono transition-all duration-200 ${
                  isActive(href)
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}

            {/* CTA Button */}
            <Link
              href="/assess"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-mono px-6 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-red-600/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Start Assessment</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/5">
            <div className="py-4 space-y-2">
              {/* Quick Tools Section */}
              <div className="px-4">
                <div className="text-xs font-mono text-white/50 uppercase tracking-wider mb-3">
                  Quick Tools
                </div>
                <div className="space-y-1">
                  {quickTools.map((tool) => {
                    const Icon = tool.icon;
                    const toolActive = isActive(tool.href);
                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          toolActive 
                            ? 'bg-red-500/10 text-red-400' 
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          toolActive ? 'bg-red-500/20' : 'bg-white/5'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-mono text-sm font-medium">{tool.label}</div>
                          <div className="font-mono text-xs text-white/50">{tool.description}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Main Navigation */}
              <div className="px-4 pt-4">
                <div className="text-xs font-mono text-white/50 uppercase tracking-wider mb-3">
                  Navigation
                </div>
                <div className="space-y-1">
                  {mainNav.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive(href)
                          ? 'bg-white/10 text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-mono text-sm">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="px-4 pt-4">
                <Link
                  href="/assess"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-mono px-6 py-3 rounded-xl transition-all duration-200"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Start Assessment</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
