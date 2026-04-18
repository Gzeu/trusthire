const store = new Map<string, { count: number; reset: number }>();

export function checkRateLimit(ip: string, max = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = store.get(ip);
  if (!entry || entry.reset < now) {
    store.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

export function getClientIp(req: Request): string {
  return (
    (req.headers as any).get?.('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}
