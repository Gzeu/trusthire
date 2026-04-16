'use client';

import { useState } from 'react';
import { AssessmentResult } from '@/types';
import { generateIncidentReport } from '@/lib/reportGenerator';

export function IncidentReportGenerator({ assessment }: { assessment: AssessmentResult }) {
  const [copied, setCopied] = useState(false);
  const report = generateIncidentReport(assessment);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trusthire-report-${assessment.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">Auto-generated incident report — ready to share</p>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="text-xs font-mono px-3 py-1.5 rounded border border-[#1f1f23] hover:border-gray-500 transition-colors"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="text-xs font-mono px-3 py-1.5 rounded border border-[#1f1f23] hover:border-gray-500 transition-colors"
          >
            Download .txt
          </button>
        </div>
      </div>

      <pre className="bg-[#0d0d0f] border border-[#1f1f23] rounded-lg p-4 text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
        {report}
      </pre>

      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-500 font-mono">Report to:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'GitHub Abuse', url: 'https://github.com/contact/report-abuse' },
            { label: 'LinkedIn Report', url: 'https://www.linkedin.com/help/linkedin/answer/a1340567' },
            { label: 'DNSC (Romania)', url: 'https://dnsc.ro' },
            { label: 'CISA (USA)', url: 'https://www.cisa.gov/report' },
            { label: 'IC3 (FBI)', url: 'https://www.ic3.gov' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono px-3 py-1.5 rounded border border-blue-900 text-blue-400 hover:border-blue-500 transition-colors"
            >
              {link.label} →
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
