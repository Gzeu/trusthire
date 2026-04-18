import { prisma } from '@/lib/prisma';

export type BlacklistEntry = {
  id: string;
  type: string;
  value: string;
  reason: string;
  addedBy: string;
  reportCount: number;
  createdAt: Date;
};

let cache: BlacklistEntry[] | null = null;
let cacheExpiresAt = 0;

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function getBlacklist(): Promise<BlacklistEntry[]> {
  const now = Date.now();
  if (cache && now < cacheExpiresAt) {
    return cache;
  }
  
  try {
    const entries = await prisma.blacklist.findMany({
      orderBy: { createdAt: 'desc' },
    });
    cache = entries as BlacklistEntry[];
    cacheExpiresAt = now + CACHE_TTL_MS;
    return cache;
  } catch (error) {
    console.warn('Blacklist database not available, using empty cache:', error);
    cache = [];
    cacheExpiresAt = now + CACHE_TTL_MS;
    return cache;
  }
}

export async function isBlacklisted(
  value: string
): Promise<{ hit: boolean; reason?: string; type?: string }> {
  const list = await getBlacklist();
  const normalized = value.toLowerCase().trim();
  const entry = list.find((e) => e.value.toLowerCase().trim() === normalized);
  if (entry) {
    return { hit: true, reason: entry.reason, type: entry.type };
  }
  return { hit: false };
}

export async function refreshBlacklist(): Promise<void> {
  cache = null;
  cacheExpiresAt = 0;
  try {
    await getBlacklist();
  } catch (error) {
    console.warn('Failed to refresh blacklist cache:', error);
  }
}
