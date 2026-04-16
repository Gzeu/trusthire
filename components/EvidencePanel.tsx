'use client';

import { useState } from 'react';
import { RedFlag } from '@/types';
import { RedFlagItem } from './RedFlagItem';

interface EvidencePanelProps {
  greenSignals: string[];
  warnings: RedFlag[];
  redFlags: RedFlag[];
  missingEvidence: string[];
}

export function EvidencePanel({ greenSignals, warnings, redFlags, missingEvidence }: EvidencePanelProps) {
  const [active, setActive] = useState<'green' | 'warnings' | 'flags' | 'missing'>('flags');

  const tabs = [
    { key: 'flags' as const, label: '🚨 Red Flags', count: redFlags.length, color: '#DC2626' },
    { key: 'warnings' as const, label: '⚠️ Warnings', count: warnings.length, color: '#CA8A04' },
    { key: 'green' as const, label: '✅ Green', count: greenSignals.length, color: '#16A34A' },
    { key: 'missing' as const, label: '❓ Missing', count: missingEvidence.length, color: '#6B7280' },
  ];

  return (
    <div className="flex flex-col gap-0">
      {/* Tab bar */}
      <div className="flex border-b border-[#1f1f23] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-mono whitespace-nowrap transition-colors ${
              active === tab.key
                ? 'border-b-2 text-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
            style={active === tab.key ? { borderBottomColor: tab.color } : {}}
          >
            {tab.label}
            <span
              className="px-1.5 py-0.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: `${tab.color}20`, color: tab.color }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {active === 'flags' && (
          redFlags.length === 0
            ? <Empty text="No critical red flags detected." />
            : redFlags.map((f, i) => <RedFlagItem key={i} flag={f} />)
        )}
        {active === 'warnings' && (
          warnings.length === 0
            ? <Empty text="No warnings detected." />
            : warnings.map((f, i) => <RedFlagItem key={i} flag={f} />)
        )}
        {active === 'green' && (
          greenSignals.length === 0
            ? <Empty text="No positive signals detected." />
            : greenSignals.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>{s}</span>
                </div>
              ))
        )}
        {active === 'missing' && (
          missingEvidence.length === 0
            ? <Empty text="No missing evidence." />
            : missingEvidence.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-gray-500 mt-0.5">?</span>
                  <span>{s}</span>
                </div>
              ))
        )}
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-sm text-gray-500 text-center py-4">{text}</p>;
}
