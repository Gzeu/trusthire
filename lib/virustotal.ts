const VT_API_KEY = process.env.VIRUSTOTAL_API_KEY
const VT_BASE = 'https://www.virustotal.com/api/v3'

export interface VTUrlResult {
  status: 'clean' | 'malicious' | 'suspicious' | 'pending' | 'undetected' | 'error' | 'no_key'
  malicious: number
  suspicious: number
  clean: number
  harmless: number
  undetected: number
  permalink?: string
  lastAnalysisDate?: string
}

export interface VTDomainResult {
  reputation: number
  malicious: number
  suspicious: number
  harmless: number
  clean: number
  categories: string[]
  creationDate?: number
  country?: string
  permalink?: string
  error?: string
}

function parseVTStats(stats: Record<string, number>): Omit<VTUrlResult, 'status' | 'permalink' | 'lastAnalysisDate'> {
  return {
    malicious: stats.malicious ?? 0,
    suspicious: stats.suspicious ?? 0,
    clean: (stats.harmless ?? 0) + (stats.undetected ?? 0),
    harmless: stats.harmless ?? 0,
    undetected: stats.undetected ?? 0
  }
}

function deriveStatus(malicious: number, suspicious: number): VTUrlResult['status'] {
  if (malicious > 0) return 'malicious'
  if (suspicious > 0) return 'suspicious'
  return 'clean'
}

export async function scanUrlVT(url: string): Promise<VTUrlResult> {
  if (!VT_API_KEY) {
    return { status: 'no_key', malicious: 0, suspicious: 0, clean: 0, harmless: 0, undetected: 0 }
  }

  try {
    const encoded = Buffer.from(url).toString('base64url').replace(/=+$/, '')

    // Try to get existing analysis first
    const existing = await fetch(`${VT_BASE}/urls/${encoded}`, {
      headers: { 'x-apikey': VT_API_KEY },
      signal: AbortSignal.timeout(8000)
    })

    if (existing.ok) {
      const data = await existing.json()
      const attrs = data.data?.attributes
      if (attrs?.last_analysis_stats) {
        const parsed = parseVTStats(attrs.last_analysis_stats)
        return {
          ...parsed,
          status: deriveStatus(parsed.malicious, parsed.suspicious),
          permalink: `https://www.virustotal.com/gui/url/${encoded}`,
          lastAnalysisDate: attrs.last_analysis_date
            ? new Date(attrs.last_analysis_date * 1000).toISOString()
            : undefined
        }
      }
    }

    // Submit for new scan
    const submitRes = await fetch(`${VT_BASE}/urls`, {
      method: 'POST',
      headers: {
        'x-apikey': VT_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `url=${encodeURIComponent(url)}`,
      signal: AbortSignal.timeout(8000)
    })

    if (!submitRes.ok) {
      return { status: 'error', malicious: 0, suspicious: 0, clean: 0, harmless: 0, undetected: 0 }
    }

    const submitData = await submitRes.json()
    const analysisId = submitData.data?.id
    if (!analysisId) return { status: 'error', malicious: 0, suspicious: 0, clean: 0, harmless: 0, undetected: 0 }

    // Poll up to 3 times
    for (let i = 0; i < 3; i++) {
      await new Promise(r => setTimeout(r, 3000))
      const res = await fetch(`${VT_BASE}/analyses/${analysisId}`, {
        headers: { 'x-apikey': VT_API_KEY },
        signal: AbortSignal.timeout(8000)
      })
      if (res.ok) {
        const data = await res.json()
        const attrs = data.data?.attributes
        if (attrs?.status === 'completed' && attrs?.stats) {
          const parsed = parseVTStats(attrs.stats)
          return {
            ...parsed,
            status: deriveStatus(parsed.malicious, parsed.suspicious),
            permalink: `https://www.virustotal.com/gui/url/${encoded}`
          }
        }
      }
    }

    return { status: 'pending', malicious: 0, suspicious: 0, clean: 0, harmless: 0, undetected: 0 }
  } catch {
    return { status: 'error', malicious: 0, suspicious: 0, clean: 0, harmless: 0, undetected: 0 }
  }
}

export async function checkDomainVT(domain: string): Promise<VTDomainResult> {
  if (!VT_API_KEY) {
    return { reputation: 0, malicious: 0, suspicious: 0, harmless: 0, clean: 0, categories: [], error: 'no_key' }
  }

  try {
    const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0].toLowerCase()
    const res = await fetch(`${VT_BASE}/domains/${cleanDomain}`, {
      headers: { 'x-apikey': VT_API_KEY },
      signal: AbortSignal.timeout(8000)
    })

    if (!res.ok) {
      return { reputation: 0, malicious: 0, suspicious: 0, harmless: 0, clean: 0, categories: [] }
    }

    const data = await res.json()
    const attrs = data.data?.attributes
    const stats = attrs?.last_analysis_stats ?? {}

    return {
      reputation: attrs?.reputation ?? 0,
      malicious: stats.malicious ?? 0,
      suspicious: stats.suspicious ?? 0,
      harmless: stats.harmless ?? 0,
      clean: (stats.harmless ?? 0) + (stats.undetected ?? 0),
      categories: attrs?.categories ? Object.values(attrs.categories) as string[] : [],
      creationDate: attrs?.creation_date,
      country: attrs?.country,
      permalink: `https://www.virustotal.com/gui/domain/${cleanDomain}`
    }
  } catch {
    return { reputation: 0, malicious: 0, suspicious: 0, harmless: 0, clean: 0, categories: [], error: 'fetch_failed' }
  }
}
