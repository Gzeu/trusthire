import { NextRequest } from 'next/server';

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  'data-collect': { windowMs: 60 * 1000, maxRequests: 10 }, // 10 requests per minute
  'data-validate': { windowMs: 60 * 1000, maxRequests: 20 }, // 20 requests per minute
  'data-analytics': { windowMs: 60 * 1000, maxRequests: 30 }, // 30 requests per minute
  'data-export': { windowMs: 60 * 1000, maxRequests: 5 }, // 5 requests per minute
  'default': { windowMs: 60 * 1000, maxRequests: 100 }, // 100 requests per minute
};

export function rateLimit(req: NextRequest, endpoint: string = 'default'): { success: boolean; resetTime?: number } {
  const clientIp = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS.default;
  
  const now = Date.now();
  const key = `${clientIp}:${endpoint}`;
  
  const existing = rateLimitStore.get(key);
  
  if (!existing || now > existing.resetTime) {
    // New window or expired window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    });
    return { success: true };
  }
  
  if (existing.count >= config.maxRequests) {
    return { 
      success: false, 
      resetTime: existing.resetTime 
    };
  }
  
  // Increment count
  existing.count++;
  return { success: true };
}

export function sanitizeInput(data: any): any {
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Basic XSS prevention
      sanitized[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => sanitizeInput(item));
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

export function validateApiKey(req: NextRequest): boolean {
  const apiKey = req.headers.get('x-api-key');
  const validApiKey = process.env.API_KEY;
  
  // In production, always require API key
  if (process.env.NODE_ENV === 'production') {
    return apiKey === validApiKey;
  }
  
  // In development, allow without API key
  return true;
}

export function addSecurityHeaders(headers: Record<string, string>): Record<string, string> {
  return {
    ...headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
    ...headers
  };
}

export function logSecurityEvent(event: string, details: any, req: NextRequest): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ip: req.ip || req.headers.get('x-forwarded-for') || 'unknown',
    userAgent: req.headers.get('user-agent') || 'unknown',
    details,
    url: req.url
  };
  
  console.log('SECURITY:', JSON.stringify(logEntry));
  
  // In production, send to logging service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Implement production logging service
  }
}
