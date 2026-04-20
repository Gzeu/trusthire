'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Database,
  Shield,
  Activity,
  BarChart3,
  Settings,
  User
} from 'lucide-react';

interface MobileBottomNavProps {
  notifications?: number;
}

export function MobileBottomNav({ notifications = 0 }: MobileBottomNavProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Analysis', href: '/assess', icon: Brain },
    { name: 'Database', href: '/data', icon: Database },
    { name: 'Security', href: '/security', icon: Shield },
    { name: 'Activity', href: '/activity', icon: Activity },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-5 gap-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                active
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.name === 'Dashboard' && notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
      
      {/* Additional navigation items */}
      <div className="grid grid-cols-2 gap-1 border-t border-gray-100">
        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
            pathname === '/settings'
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs mt-1">Settings</span>
        </Link>
        
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
            pathname === '/profile'
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
}

export default MobileBottomNav;
