import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getVerdictColor(verdict: string): string {
  switch (verdict) {
    case 'critical': return 'text-risk-critical'
    case 'high_risk': return 'text-risk-high'
    case 'caution': return 'text-risk-caution'
    case 'low_risk': return 'text-risk-low'
    default: return 'text-muted-foreground'
  }
}

export function getVerdictBg(verdict: string): string {
  switch (verdict) {
    case 'critical': return 'bg-red-600/10 border-red-600/30 text-red-400'
    case 'high_risk': return 'bg-orange-600/10 border-orange-600/30 text-orange-400'
    case 'caution': return 'bg-yellow-600/10 border-yellow-600/30 text-yellow-400'
    case 'low_risk': return 'bg-green-600/10 border-green-600/30 text-green-400'
    default: return 'bg-muted'
  }
}

export function getVerdictLabel(verdict: string): string {
  switch (verdict) {
    case 'critical': return '🚨 CRITICAL'
    case 'high_risk': return '⚠️ HIGH RISK'
    case 'caution': return '⚡ CAUTION'
    case 'low_risk': return '✅ LOW RISK'
    default: return 'UNKNOWN'
  }
}

export function scoreToVerdict(score: number): string {
  if (score >= 80) return 'low_risk'
  if (score >= 55) return 'caution'
  if (score >= 30) return 'high_risk'
  return 'critical'
}

export function extractDomain(email: string): string | null {
  const match = email.match(/@([^@]+)$/)
  return match ? match[1].toLowerCase() : null
}

export function isGenericEmail(email: string): boolean {
  const genericDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'protonmail.com', 'icloud.com', 'aol.com', 'mail.com'
  ]
  const domain = extractDomain(email)
  return domain ? genericDomains.includes(domain) : false
}

export function isShortlink(url: string): boolean {
  const shortDomains = [
    'bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'goo.gl',
    'ow.ly', 'buff.ly', 'rebrand.ly', 'shorturl.at', 'tiny.cc'
  ]
  try {
    const domain = new URL(url).hostname
    return shortDomains.some(s => domain.includes(s))
  } catch {
    return false
  }
}

export function extractGithubRepo(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/\s?#]+)/)
  if (!match) return null
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') }
}

export function formatScore(score: number): string {
  return Math.max(0, Math.min(100, score)).toString()
}

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
