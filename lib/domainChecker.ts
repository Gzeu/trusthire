import { DomainCheckResult } from '@/types';
import { checkDomain as vtCheckDomain } from './virustotal';

const SUSPICIOUS_TLDS = [
  '.xyz', '.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.click', '.work', '.loan', '.date',
  '.monster', '.fit', '.country', '.stream', '.download', '.xin', '.vip', '.party', '.review',
  '.science', '.trade', '.accountant', '.racing', '.zip', '.mov'
];

const SHORTLINKS = ['bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'goo.gl', 'ow.ly', 'buff.ly', 'rebrand.ly', 'short.io'];

const BRAND_KEYWORDS = [
  'coinbase', 'binance', 'kraken', 'ledger', 'metamask', 'opensea',
  'uniswap', 'compound', 'aave', 'chainlink', 'solana', 'ethereum',
  'polygon', 'arbitrum', 'bybit', 'okx', 'kucoin', 'huobi', 'multiversx',
  'xportal', 'near', 'phantom', 'trustwallet', 'tron', 'avalanche', 'sui'
];

const SUSPICIOUS_KEYWORDS = [
  'career', 'jobs', 'recruit', 'talent', 'verify', 'kyc', 'wallet', 'bonus', 'claim', 'airdrop'
];

function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b.charAt(i - 1) === a.charAt(j - 1)
        ? matrix[i - 1][j - 1]
        : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
}

export async function checkDomainSafety(rawUrl: string): Promise<DomainCheckResult> {
  let domain = rawUrl.toLowerCase();
  try {
    domain = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`).hostname.toLowerCase();
  } catch {
    domain = rawUrl.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
  }

  const hasSuspiciousTLD = SUSPICIOUS_TLDS.some((tld) => domain.endsWith(tld));
  const isShortlink = SHORTLINKS.some((s) => domain === s || domain.endsWith(`.${s}`));

  const isBrandSpoofing = BRAND_KEYWORDS.some((brand) => {
    const base = domain.replace(/^www\./, '').split('.')[0];
    const hasBrand = domain.includes(brand);
    const typoLike = levenshtein(base, brand) <= 2 && base !== brand;
    const isLegit = domain === `${brand}.com` || domain === `www.${brand}.com`;
    return (hasBrand || typoLike) && !isLegit;
  });

  const suspiciousKeywordHit = SUSPICIOUS_KEYWORDS.some((keyword) => domain.includes(keyword));
  const excessiveHyphens = (domain.match(/-/g) || []).length >= 2;
  const excessiveDigits = (domain.match(/\d/g) || []).length >= 3;

  const vtResult = await vtCheckDomain(domain);

  const riskFlags: string[] = [];
  if (hasSuspiciousTLD) riskFlags.push(`Suspicious TLD: ${domain.split('.').pop()}`);
  if (isBrandSpoofing) riskFlags.push('Possible brand/domain spoofing or typosquatting');
  if (isShortlink) riskFlags.push('Shortlink — destination unknown');
  if (suspiciousKeywordHit) riskFlags.push('Suspicious recruiting/phishing keyword in domain');
  if (excessiveHyphens) riskFlags.push('Excessive hyphens in domain');
  if (excessiveDigits) riskFlags.push('Excessive digits in domain');
  if (vtResult.malicious > 0) riskFlags.push(`VirusTotal: ${vtResult.malicious} engines flagged as malicious`);
  if ((vtResult.suspicious || 0) > 0) riskFlags.push(`VirusTotal: ${vtResult.suspicious} engines flagged as suspicious`);
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
