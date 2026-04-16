import { checkDomainVT } from './virustotal'

export interface DomainCheckResult {
  domain: string
  hasSuspiciousTLD: boolean
  isBrandSpoofing: boolean
  isShortlink: boolean
  domainAgeYears?: number
  vtMalicious: number
  vtSuspicious: number
  vtReputation: number
  vtCategories: string[]
  vtPermalink?: string
  riskFlags: string[]
  riskLevel: 'safe' | 'warning' | 'critical'
}

const SUSPICIOUS_TLDS = ['.xyz', '.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.click', '.online', '.site', '.icu']
const SHORTLINK_DOMAINS = ['bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'goo.gl', 'ow.ly', 'buff.ly', 'rebrand.ly', 'short.io', 'tiny.cc']
const CRYPTO_BRANDS = ['coinbase', 'binance', 'kraken', 'ledger', 'metamask', 'opensea', 'uniswap', 'compound', 'aave', 'chainlink', 'phantom', 'trustwallet']
const LEGIT_DOMAINS = ['coinbase.com', 'binance.com', 'kraken.com', 'ledger.com', 'metamask.io', 'opensea.io']

export async function checkDomain(rawUrl: string): Promise<DomainCheckResult> {
  const domain = rawUrl.replace(/^https?:\/\//, '').split('/')[0].toLowerCase()

  const hasSuspiciousTLD = SUSPICIOUS_TLDS.some(tld => domain.endsWith(tld))
  const isShortlink = SHORTLINK_DOMAINS.some(s => domain === s || domain.endsWith('.' + s))

  const isBrandSpoofing = CRYPTO_BRANDS.some(brand => {
    if (!domain.includes(brand)) return false
    return !LEGIT_DOMAINS.some(legit => domain === legit)
  })

  let domainAgeYears: number | undefined
  try {
    const whoisRes = await fetch(
      `https://api.domainsdb.info/v1/domains/search?domain=${domain}&limit=1`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (whoisRes.ok) {
      const data = await whoisRes.json()
      const created = data.domains?.[0]?.create_date
      if (created) {
        domainAgeYears = Math.floor((Date.now() - new Date(created).getTime()) / (86400000 * 365))
      }
    }
  } catch { /* ignore */ }

  const vtResult = await checkDomainVT(domain)

  const riskFlags: string[] = []
  if (hasSuspiciousTLD) riskFlags.push(`Suspicious TLD: .${domain.split('.').pop()}`)
  if (isBrandSpoofing) riskFlags.push('Possible crypto brand spoofing')
  if (isShortlink) riskFlags.push('Shortlink — real destination hidden')
  if (vtResult.malicious > 0) riskFlags.push(`VirusTotal: ${vtResult.malicious} engines flagged malicious`)
  if (vtResult.suspicious > 0) riskFlags.push(`VirusTotal: ${vtResult.suspicious} engines flagged suspicious`)
  if (vtResult.reputation < -10) riskFlags.push(`Low VirusTotal reputation score: ${vtResult.reputation}`)
  if (domainAgeYears !== undefined && domainAgeYears < 1) riskFlags.push('Domain less than 1 year old')

  let riskLevel: 'safe' | 'warning' | 'critical' = 'safe'
  if (vtResult.malicious > 0 || isBrandSpoofing || isShortlink) riskLevel = 'critical'
  else if (hasSuspiciousTLD || vtResult.suspicious > 0 || (domainAgeYears !== undefined && domainAgeYears < 1)) riskLevel = 'warning'

  return {
    domain,
    hasSuspiciousTLD,
    isBrandSpoofing,
    isShortlink,
    domainAgeYears,
    vtMalicious: vtResult.malicious,
    vtSuspicious: vtResult.suspicious,
    vtReputation: vtResult.reputation,
    vtCategories: vtResult.categories,
    vtPermalink: vtResult.permalink,
    riskFlags,
    riskLevel
  }
}
