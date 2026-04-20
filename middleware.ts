import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, addSecurityHeaders, logSecurityEvent } from '@/lib/security/api-security';

export function middleware(req: NextRequest) {
  const response = NextResponse.next();
  
  // Add security headers to all responses
  const secureHeaders = addSecurityHeaders({});
  Object.entries(secureHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Rate limiting for API routes
  if (req.nextUrl.pathname.startsWith('/api/data/')) {
    const endpoint = req.nextUrl.pathname.split('/')[3] || 'default';
    const rateLimitResult = rateLimit(req, `data-${endpoint}`);
    
    if (!rateLimitResult.success) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', {
        endpoint: req.nextUrl.pathname,
        resetTime: rateLimitResult.resetTime
      }, req);
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          resetTime: rateLimitResult.resetTime 
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Reset': rateLimitResult.resetTime?.toString() || '',
            ...addSecurityHeaders({})
          }
        }
      );
    }
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', '99');
  }
  
  // Log suspicious activity
  const userAgent = req.headers.get('user-agent') || '';
  if (userAgent.includes('bot') || userAgent.includes('crawler')) {
    logSecurityEvent('SUSPICIOUS_USER_AGENT', {
      userAgent
    }, req);
  }
  
  return response;
}

export const config = {
  matcher: [
    '/api/data/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
