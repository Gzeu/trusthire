'use client';

import { RepoScanResult } from '@/types';

export function RepoScanReport({ scan }: { scan: RepoScanResult }) {
  const riskColor =
    scan.riskLevel === 'critical' ? '#DC2626' :
    scan.riskLevel === 'warning' ? '#CA8A04' : '#16A34A';

  return (
    <div className="bg-[#0d0d0f] border border-[#1f1f23] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f23]">
        <span className="font-mono text-sm text-gray-300">repo scan report</span>
        <span
          className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded"
          style={{ color: riskColor, backgroundColor: `${riskColor}15` }}
        >
          {scan.riskLevel}
        </span>
      </div>

      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-[#1f1f23]">
        <Stat label="Repo Age" value={scan.repoAge !== undefined ? `${scan.repoAge}d` : 'N/A'} />
        <Stat label="Stars" value={scan.stars ?? 'N/A'} />
        <Stat label="Forks" value={scan.forks ?? 'N/A'} />
        <Stat label="Dangerous Scripts" value={scan.dangerousScripts.length} warn={scan.dangerousScripts.length > 0} />
      </div>

      {scan.dangerousScripts.length > 0 && (
        <div className="p-4 border-b border-[#1f1f23]">
          <p className="text-xs font-mono text-red-400 mb-2">⚡ LIFECYCLE SCRIPTS DETECTED</p>
          <div className="flex flex-wrap gap-2">
            {scan.dangerousScripts.map((s) => (
              <span key={s} className="font-mono text-xs bg-red-950 text-red-300 px-2 py-1 rounded border border-red-800">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {scan.patternMatches && scan.patternMatches.length > 0 && (
        <div className="p-4">
          <p className="text-xs font-mono text-orange-400 mb-3">🔍 DANGEROUS PATTERNS</p>
          <div className="flex flex-col gap-2">
            {scan.patternMatches.map((m, i) => (
              <div key={i} className="flex items-center justify-between font-mono text-xs bg-[#111113] rounded px-3 py-2">
                <span className="text-gray-300">{m.pattern}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">{m.file}</span>
                  <span
                    className="uppercase"
                    style={{
                      color: m.severity === 'critical' ? '#DC2626' :
                             m.severity === 'high' ? '#EA580C' : '#CA8A04'
                    }}
                  >
                    {m.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {scan.patternMatches?.length === 0 && scan.dangerousScripts.length === 0 && (
        <div className="p-4 text-center">
          <p className="text-sm text-green-400">✅ No dangerous patterns detected</p>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, warn }: { label: string; value: string | number; warn?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-500 font-mono">{label}</span>
      <span className={`text-sm font-mono font-bold ${warn ? 'text-red-400' : 'text-gray-200'}`}>
        {value}
      </span>
    </div>
  );
}
