'use client';

import { VTUrlResult, VTDomainResult } from '@/types';

interface VTEntry {
  url: string;
  urlResult?: VTUrlResult;
  domainResult?: VTDomainResult;
}

export function VirusTotalPanel({ entries }: { entries: VTEntry[] }) {
  if (!entries || entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry, i) => (
        <VTCard key={i} entry={entry} />
      ))}
    </div>
  );
}

function VTCard({ entry }: { entry: VTEntry }) {
  const { url, urlResult, domainResult } = entry;

  const statusColor =
    urlResult?.status === 'malicious' ? '#DC2626' :
    urlResult?.status === 'suspicious' ? '#EA580C' :
    urlResult?.status === 'clean' ? '#16A34A' : '#666';

  const statusLabel =
    urlResult?.status === 'malicious' ? '🚨 MALICIOUS' :
    urlResult?.status === 'suspicious' ? '⚠️ SUSPICIOUS' :
    urlResult?.status === 'clean' ? '✅ CLEAN' :
    urlResult?.status === 'pending' ? '⏳ SCANNING...' : '❓ UNSCANNED';

  return (
    <div className="bg-[#0d0d0f] border border-[#1f1f23] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f23]">
        <span className="font-mono text-xs text-gray-500 truncate max-w-[60%]">{url}</span>
        <span
          className="text-xs font-mono font-bold"
          style={{ color: statusColor }}
        >
          {statusLabel}
        </span>
      </div>

      <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        {urlResult && (
          <>
            <VTStat label="Malicious" value={urlResult.malicious} color={urlResult.malicious > 0 ? '#DC2626' : '#16A34A'} />
            <VTStat label="Suspicious" value={urlResult.suspicious} color={urlResult.suspicious > 0 ? '#EA580C' : '#888'} />
            <VTStat label="Clean" value={urlResult.clean} color="#16A34A" />
          </>
        )}

        {domainResult && (
          <>
            <VTStat label="Domain Rep" value={domainResult.reputation} color={domainResult.reputation < 0 ? '#DC2626' : '#16A34A'} />
            {domainResult.creationDate && (
              <VTStat
                label="Domain Age"
                value={`${Math.floor((Date.now() / 1000 - domainResult.creationDate) / (86400 * 365))}y`}
                color="#888"
              />
            )}
          </>
        )}
      </div>

      {domainResult?.categories && domainResult.categories.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1">
          {domainResult.categories.slice(0, 4).map((c, i) => (
            <span key={i} className="text-xs font-mono bg-[#1f1f23] text-gray-400 px-2 py-0.5 rounded">
              {c}
            </span>
          ))}
        </div>
      )}

      {urlResult?.permalink && (
        <div className="px-4 pb-3">
          <a
            href={urlResult.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-blue-400 hover:underline"
          >
            → View full VirusTotal report
          </a>
        </div>
      )}
    </div>
  );
}

function VTStat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-500 font-mono">{label}</span>
      <span className="text-sm font-mono font-bold" style={{ color }}>{value}</span>
    </div>
  );
}
