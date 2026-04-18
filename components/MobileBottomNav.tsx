'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Github, 
  Linkedin, 
  Image, 
  FileText, 
  Search, 
  Shield, 
  Home, 
  Menu,
  X,
  Zap,
  Activity,
  Database,
  FlaskConical
} from 'lucide-react';

export default function MobileBottomNav() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  const quickTools = [
    { href: '/scan/github', label: 'GitHub', icon: Github },
    { href: '/scan/linkedin', label: 'LinkedIn', icon: Linkedin },
    { href: '/scan/image', label: 'Image', icon: Image },
    { href: '/scan/forms', label: 'Forms', icon: FileText },
  ];

  const mainNav = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/patterns', label: 'Patterns', icon: Database },
    { href: '/sandbox', label: 'Sandbox', icon: FlaskConical },
    { href: '/monitoring', label: 'Monitor', icon: Activity },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0A0A0B]/95 backdrop-blur-md border-t border-white/5 z-50">
        {/* Expanded Quick Tools */}
        {isExpanded && (
          <div className="absolute bottom-full left-0 right-0 bg-[#111113] border-t border-white/5 p-4">
            <div className="grid grid-cols-2 gap-3">
              {quickTools.map((tool) => {
                const Icon = tool.icon;
                const active = isActive(tool.href);
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setIsExpanded(false)}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                      ${active 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      active ? 'bg-red-500/20' : 'bg-white/5'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-mono text-sm font-medium">{tool.label}</div>
                      <div className="font-mono text-xs text-white/50">Quick Scan</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Navigation Bar */}
        <div className="flex items-center justify-around p-2">
          {/* Quick Tools Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200
              ${isExpanded ? 'bg-red-500/10 text-red-400' : 'text-white/60 hover:text-white'}
            `}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isExpanded ? 'bg-red-500/20' : 'bg-white/5'
            }`}>
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono">Tools</span>
          </button>

          {/* Main Navigation Items */}
          {mainNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200
                  ${active 
                    ? 'text-blue-400' 
                    : 'text-white/60 hover:text-white'
                  }
                `}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  active ? 'bg-blue-500/20' : 'bg-white/5'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono">{item.label}</span>
              </Link>
            );
          })}

          {/* Menu Button */}
          <button className="flex flex-col items-center gap-1 p-2 rounded-xl text-white/60 hover:text-white transition-all duration-200">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
              <Menu className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono">More</span>
          </button>
        </div>

        {/* Active Indicator */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>

      {/* Mobile Menu Overlay */}
      {isExpanded && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`
        lg:hidden fixed bottom-20 left-4 right-4 bg-[#111113] border border-white/10 rounded-2xl p-4 z-50
        transform transition-all duration-300 ease-out
        ${isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}
      `}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold font-mono text-white">Quick Tools</h3>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-2 text-white/60 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {quickTools.map((tool) => {
            const Icon = tool.icon;
            const active = isActive(tool.href);
            return (
              <Link
                key={tool.href}
                href={tool.href}
                onClick={() => setIsExpanded(false)}
                className={`
                  flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                  ${active 
                    ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  active ? 'bg-red-500/20' : 'bg-white/5'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-mono text-sm font-medium">{tool.label}</div>
                  <div className="font-mono text-xs text-white/50">Quick Scan</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
