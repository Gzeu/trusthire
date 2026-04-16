import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const FALLBACK_PATTERNS = [
  {
    id: '1',
    category: 'fake_recruiter',
    description: 'LinkedIn recruiter with new account offering high-paying blockchain role, sends GitHub repo for "technical review"',
    indicators: ['Account < 3 months old', 'No mutual connections', 'Generic job description', 'Repo with postinstall script'],
    ecosystem: 'blockchain',
    verified: true,
  },
  {
    id: '2',
    category: 'malicious_repo',
    description: 'npm package with postinstall script that exfiltrates process.env to external server',
    indicators: ['postinstall in package.json', 'fetch(process.env)', 'Domain registered < 1 week ago'],
    ecosystem: 'web3',
    verified: true,
  },
  {
    id: '3',
    category: 'social_engineering',
    description: 'Recruiter creates artificial urgency: "We have another candidate, decide by tomorrow"',
    indicators: ['Urgency language', 'Short deadline', 'Pressure to skip due diligence'],
    ecosystem: 'general',
    verified: true,
  },
  {
    id: '4',
    category: 'phishing',
    description: 'Email from coinbase-careers.net (not coinbase.com) requesting wallet verification',
    indicators: ['Domain mismatch', 'Brand spoofing', 'Wallet/seed request'],
    ecosystem: 'defi',
    verified: true,
  },
  {
    id: '5',
    category: 'malicious_repo',
    description: 'DeFi trading bot repo with obfuscated eval() call that runs base64-encoded payload on startup',
    indicators: ['eval() in source', 'Buffer.from base64', 'child_process.exec', 'Targets crypto wallets'],
    ecosystem: 'defi',
    verified: true,
  },
];

export async function GET() {
  try {
    const patterns = await prisma.scamPattern.findMany({
      where: { verified: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json(patterns.length > 0 ? patterns : FALLBACK_PATTERNS);
  } catch {
    return NextResponse.json(FALLBACK_PATTERNS);
  }
}
