'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="text-xs font-mono px-3 py-1.5 rounded border border-[#1f1f23] hover:border-gray-500 transition-colors text-gray-400 hover:text-gray-200"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '☀ light' : '◑ dark'}
    </button>
  );
}
