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
  ArrowRight
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string;
  description?: string;
}

interface QuickTool {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

const quickTools: QuickTool[] = [
  { href: '/scan/github', label: 'GitHub Repo Scan', icon: Github, description: 'Analyze repositories for malicious code' },
  { href: '/scan/linkedin', label: 'LinkedIn Profile Check', icon: Linkedin, description: 'Verify recruiter authenticity' },
  { href: '/scan/image', label: 'Reverse Image Search', icon: Image, description: 'Check profile pictures for fakes' },
  { href: '/scan/forms', label: 'Google Forms Scan', icon: FileText, description: 'Analyze forms for phishing' },
  { href: '/scan/url', label: 'URL Scanner', icon: Search, description: 'Check links for threats' },
];

const mainNav: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/patterns', label: 'Patterns', icon: Database },
  { href: '/sandbox', label: 'Sandbox', icon: FlaskConical },
  { href: '/monitoring', label: 'Monitoring', icon: Activity },
];

interface UnifiedNavbarProps {
  variant?: 'default' | 'enhanced' | 'compact';
  showQuickTools?: boolean;
  mobileOnly?: boolean;
}

export default function UnifiedNavbar({ 
  variant = 'enhanced', 
  showQuickTools = true,
  mobileOnly = false 
}: UnifiedNavbarProps) {
  const pathname = usePathname();
  const [isQuickToolsOpen, setIsQuickToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  // Default simple navbar
  if (variant === 'default') {
    return (
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Shield className="w-5 h-5 text-red-500" />
            <span className="font-mono font-bold text-base tracking-tight text-white">TrustHire</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {mainNav.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-mono transition-colors ${
                    active
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <Link
            href="/assess"
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-mono px-4 py-2 rounded-md transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Assess
          </Link>
        </div>
      </nav>
    );
  }

  // Enhanced navbar with quick tools
  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0B]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-mono font-bold text-lg tracking-tight text-white">TrustHire</span>
          </Link>

          {/* Desktop Navigation */}
          {!mobileOnly && (
            <div className="hidden lg:flex items-center gap-8">
              {/* Main Nav */}
              <div className="flex items-center gap-1">
                {mainNav.map(({ href, label, icon: Icon, badge }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all duration-200 ${
                        active
                          ? 'bg-white/10 text-white shadow-lg'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                      {badge && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Quick Tools Dropdown */}
              {showQuickTools && (
                <div className="relative">
                  <button
                    onClick={() => setIsQuickToolsOpen(!isQuickToolsOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all duration-200 ${
                      isQuickToolsOpen
                        ? 'bg-red-600 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>Quick Tools</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isQuickToolsOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {isQuickToolsOpen && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-[#111113] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                      <div className="p-2">
                        {quickTools.map((tool) => {
                          const Icon = tool.icon;
                          return (
                            <Link
                              key={tool.href}
                              href={tool.href}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                              onClick={() => setIsQuickToolsOpen(false)}
                            >
                              <div className={`w-8 h-8 ${tool.href.includes('github') ? 'bg-gray-500/20' : 
                                tool.href.includes('linkedin') ? 'bg-blue-500/20' : 
                                tool.href.includes('image') ? 'bg-purple-500/20' : 
                                tool.href.includes('forms') ? 'bg-green-500/20' : 
                                tool.href.includes('url') ? 'bg-orange-500/20' : 'bg-red-500/20'} rounded-lg flex items-center justify-center`}>
                                <Icon className={`w-4 h-4 ${tool.href.includes('github') ? 'text-gray-400' : 
                                  tool.href.includes('linkedin') ? 'text-blue-400' : 
                                  tool.href.includes('image') ? 'text-purple-400' : 
                                  tool.href.includes('forms') ? 'text-green-400' : 
                                  tool.href.includes('url') ? 'text-orange-400' : 'text-red-400'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-mono text-white group-hover:text-red-400">
                                  {tool.label}
                                </div>
                                <div className="text-xs text-white/50 font-mono">
                                  {tool.description}
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-red-400" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* CTA Button */}
            {!mobileOnly && (
              <Link
                href="/assess"
                className="hidden sm:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-mono px-4 py-2 rounded-lg transition-colors shadow-lg"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Assessment</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#111113] border-t border-white/10 shadow-2xl">
            <div className="p-4 space-y-2">
              {/* Main Nav */}
              {mainNav.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-mono transition-colors ${
                      active
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                );
              })}

              {/* Quick Tools */}
              {showQuickTools && (
                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs font-mono text-white/50 uppercase tracking-wider mb-3">Quick Tools</div>
                  {quickTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-mono text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tool.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* CTA */}
              <div className="pt-4 border-t border-white/10">
                <Link
                  href="/assess"
                  className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white text-sm font-mono px-4 py-3 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
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
