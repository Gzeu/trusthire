'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, LayoutDashboard, Database, FlaskConical, PlusCircle, Activity } from 'lucide-react';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/patterns', label: 'Patterns', icon: Database },
  { href: '/sandbox', label: 'Sandbox', icon: FlaskConical },
  { href: '/monitoring', label: 'Monitoring', icon: Activity },
];

export default function Navbar() {
  const pathname = usePathname();

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
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
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
          <PlusCircle className="w-3.5 h-3.5" />
          Start Assessment
        </Link>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex items-center gap-1 px-6 pb-3 overflow-x-auto">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono whitespace-nowrap transition-colors ${
                active
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
