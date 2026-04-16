'use client';

import { RedFlag } from '@/types';

const severityConfig = {
  critical: { color: '#DC2626', bg: '#DC262615', icon: '🚨', label: 'CRITICAL' },
  red_flag: { color: '#EA580C', bg: '#EA580C15', icon: '⚠️', label: 'RED FLAG' },
  warning: { color: '#CA8A04', bg: '#CA8A0415', icon: '⚡', label: 'WARNING' },
};

export function RedFlagItem({ flag }: { flag: RedFlag }) {
  const cfg = severityConfig[flag.severity];
  return (
    <div
      className="rounded-lg border p-4 flex flex-col gap-2"
      style={{ borderColor: cfg.color, backgroundColor: cfg.bg }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{cfg.icon}</span>
          <span className="font-mono text-xs font-bold tracking-widest" style={{ color: cfg.color }}>
            {cfg.label}
          </span>
          <span className="text-xs text-gray-400 uppercase tracking-wide">· {flag.category}</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-gray-100">{flag.signal}</p>
      <p className="text-xs text-gray-400">{flag.explanation}</p>
      <div className="flex items-start gap-1.5 mt-1">
        <span className="text-xs text-blue-400">→</span>
        <p className="text-xs text-blue-400">{flag.recommendation}</p>
      </div>
    </div>
  );
}
