import { VTUrlResult, VTDomainResult } from '@/types';

const VT_API_KEY = process.env.VIRUSTOTAL_API_KEY || '';
const VT_BASE = 'https://www.virustotal.com/api/v3';

function parseUrlStats(attrs: Record<string, unknown>): VTUrlResult {
  const stats = (attrs.last_analysis_stats as Record<string, number>) || {};
  const malicious = stats.malicious ?? 0;
  const suspicious = stats.suspicious ?? 0;
  const clean = (stats.harmless ?? 0) + (stats.undetected ?? 0);
  const status =
    malicious > 0 ? 'malicious' :
    suspicious > 0 ? 'suspicious' :
    clean > 0 ? 'clean' : 'undetected';

  return {
    status,
    malicious,
    suspicious,
    clean,
    permalink: `https://www.virustotal.com/gui/url/${attrs.id as string}`,
  };
}

export async function scanUrl(url: string): Promise<VTUrlResult> {
  if (!VT_API_KEY) return { status: 'error', malicious: 0, suspicious: 0, clean: 0 };

  try {
    const encoded = Buffer.from(url).toString('base64url').replace(/=/g, '');

    // Try existing analysis first
    const existing = await fetch(`${VT_BASE}/urls/${encoded}`, {
      headers: { 'x-apikey': VT_API_KEY },
    });

    if (existing.ok) {
      const data = await existing.json();
      return parseUrlStats({ ...data.data.attributes, id: data.data.id });
    }

    // Submit new scan
    const submit = await fetch(`${VT_BASE}/urls`, {
      method: 'POST',
      headers: {
        'x-apikey': VT_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `url=${encodeURIComponent(url)}`,
    });

    if (!submit.ok) return { status: 'error', malicious: 0, suspicious: 0, clean: 0 };

    const submitData = await submit.json();
    const analysisId = submitData.data.id;

    // Poll up to 3 times
    for (let i = 0; i < 3; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const result = await fetch(`${VT_BASE}/analyses/${analysisId}`, {
        headers: { 'x-apikey': VT_API_KEY },
      });
      if (result.ok) {
        const rd = await result.json();
        if (rd.data.attributes.status === 'completed') {
          return parseUrlStats({ ...rd.data.attributes.stats, id: analysisId });
        }
      }
    }

    return { status: 'pending', malicious: 0, suspicious: 0, clean: 0 };
  } catch {
    return { status: 'error', malicious: 0, suspicious: 0, clean: 0 };
  }
}

export async function checkDomain(domain: string): Promise<VTDomainResult> {
  if (!VT_API_KEY) return { reputation: 0, malicious: 0, categories: [] };

  try {
    const res = await fetch(`${VT_BASE}/domains/${domain}`, {
      headers: { 'x-apikey': VT_API_KEY },
    });
    if (!res.ok) return { reputation: 0, malicious: 0, categories: [] };

    const data = await res.json();
    const attrs = data.data.attributes;
    const stats = attrs.last_analysis_stats || {};

    return {
      reputation: attrs.reputation ?? 0,
      malicious: stats.malicious ?? 0,
      suspicious: stats.suspicious ?? 0,
      categories: Object.values(attrs.categories ?? {}) as string[],
      creationDate: attrs.creation_date,
      country: attrs.country,
    };
  } catch {
    return { reputation: 0, malicious: 0, categories: [] };
  }
}
