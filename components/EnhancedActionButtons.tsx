'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Search, Database, Shield, ArrowRight, Sparkles } from 'lucide-react';

export default function EnhancedActionButtons() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const actionButtons = [
    {
      id: 'assessment',
      title: 'Start Free Assessment',
      description: 'Complete security analysis for recruiters and repositories',
      icon: ChevronRight,
      href: '/assess',
      color: 'bg-red-600 hover:bg-red-700',
      glowColor: 'hover:shadow-red-600/20',
      features: ['Identity analysis', 'Repository scanning', 'Risk scoring', 'Incident reports']
    },
    {
      id: 'threat-db',
      title: 'Browse Threat DB',
      description: 'Explore known scam patterns and attack vectors',
      icon: Database,
      href: '/patterns',
      color: 'bg-white/5 hover:bg-white/10 border border-white/10',
      glowColor: 'hover:shadow-white/10',
      features: ['20+ scam patterns', 'Real-time updates', 'Community driven', 'Searchable database']
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-20">
      {actionButtons.map((button) => {
        const Icon = button.icon;
        const isHovered = hoveredButton === button.id;
        
        return (
          <Link
            key={button.id}
            href={button.href}
            className={`
              relative group flex-1
              ${button.color} 
              text-white font-mono font-bold 
              px-8 py-6 rounded-xl 
              transition-all duration-300 ease-out
              transform hover:scale-105
              ${button.glowColor} hover:shadow-lg
              border border-transparent
              overflow-hidden
            `}
            onMouseEnter={() => setHoveredButton(button.id)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Button content */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`
                  w-6 h-6 rounded-lg 
                  flex items-center justify-center
                  ${button.id === 'assessment' ? 'bg-red-500/20' : 'bg-white/10'}
                `}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg mb-1">{button.title}</div>
                  <div className="text-xs text-white/60 font-normal">{button.description}</div>
                </div>
              </div>
              <ArrowRight className={`
                w-5 h-5 transition-all duration-300
                ${isHovered ? 'translate-x-1 opacity-100' : 'translate-x-0 opacity-60'}
              `} />
            </div>

            {/* Hover features showcase */}
            <div className={`
              absolute bottom-0 left-0 right-0
              bg-[#0A0A0B] border-t border-white/10
              transform translate-y-full
              group-hover:translate-y-0
              transition-transform duration-300 ease-out
              p-4
            `}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-mono text-white/60">What you get:</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {button.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <span className="text-xs text-white/80 font-mono">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent transform rotate-45 scale-150" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
