import { DomainCheckResult } from '@/types';
import { checkDomain as vtCheckDomain } from './virustotal';

const SUSPICIOUS_TLDS = ['.xyz', '.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.click', '.work', '.loan', '.date'];
const SHORTLINKS = ['bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'goo.gl', 'ow.ly', 'buff.ly', 'rebrand.ly', 'short.io'];
const BRAND_KEYWORDS = [
  'coinbase', 'binance', 'kraken', 'ledger', 'metamask', 'opensea',
  'uniswap', 'compound', 'aave', 'chainlink', 'solana', 'ethereum',
  'polygon', 'arbitrum', 'bybit', 'okx', 'kucoin', 'huobi',
];

export async function checkDomainSafety(rawUrl: string): Promise<DomainCheckResult> {
  let domain = rawUrl.toLowerCase();
  try {
    domain = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`).hostname;
  } catch {
    domain = rawUrl.replace(/^https?:\/\//, '').split('/')[0];
  }

  const hasSuspiciousTLD = SUSPICIOUS_TLDS.some((tld) => domain.endsWith(tld));
  const isShortlink = SHORTLINKS.some((s) => domain === s || domain.endsWith(`.${s}`));
  const isBrandSpoofing = BRAND_KEYWORDS.some((brand) => {
    const hasBrand = domain.includes(brand);
    const isLegit = domain === `${brand}.com` || domain === `www.${brand}.com`;
    return hasBrand && !isLegit;
  });

  // VirusTotal domain check
  const vtResult = await vtCheckDomain(domain);

  const riskFlags: string[] = [];
  if (hasSuspiciousTLD) riskFlags.push(`Suspicious TLD: ${domain.split('.').pop()}`);
  if (isBrandSpoofing) riskFlags.push('Possible brand/domain spoofing');
  if (isShortlink) riskFlags.push('Shortlink — destination unknown');
  if (vtResult.malicious > 0) riskFlags.push(`VirusTotal: ${vtResult.malicious} engines flagged as malicious`);
  if (vtResult.reputation < -10) riskFlags.push(`Low VirusTotal reputation score: ${vtResult.reputation}`);

  return {
    domain,
    hasSuspiciousTLD,
    isBrandSpoofing,
    isShortlink,
    domainAgeYears: vtResult.creationDate
      ? Math.floor((Date.now() / 1000 - vtResult.creationDate) / (86400 * 365))
      : null,
    vtMalicious: vtResult.malicious,
    vtReputation: vtResult.reputation,
    vtCategories: vtResult.categories,
    riskFlags,
  };
}
