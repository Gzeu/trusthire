import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRateLimitKey(req: Request): string {
  const forwarded = (req.headers as Headers).get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return `ratelimit:${ip}`;
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

export function extractDomain(email: string): string {
  return email.split('@')[1] || '';
}

export function isGenericEmail(email: string): boolean {
  const generic = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'protonmail.com', 'icloud.com'];
  return generic.includes(extractDomain(email).toLowerCase());
}
