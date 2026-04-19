// Security API Routes
// Rate limiting and connection validation endpoints

import { NextRequest, NextResponse } from 'next/server';
import { getRateLimiter } from '@/lib/security/rate-limiter';

// Check rate limit status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const ip = searchParams.get('ip');

    if (!key) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit key is required',
        code: 'MISSING_KEY'
      }, { status: 400 });
    }

    const rateLimiter = getRateLimiter();
    const result = rateLimiter.checkLimit(key || ip || 'default');

    return NextResponse.json({
      success: true,
      data: {
        key,
        allowed: result.allowed,
        limit: result.limit,
        remaining: result.remaining,
        resetTime: result.resetTime,
        retryAfter: result.retryAfter,
        penalty: result.penalty,
        metadata: result.metadata
      }
    });
  } catch (error) {
    console.error('Rate limit check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

// Configure rate limiting
export async function POST(request: NextRequest) {
  try {
    const { key, config } = await request.json();

    if (!key) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit key is required',
        code: 'MISSING_KEY'
      }, { status: 400 });
    }

    if (!config) {
      return NextResponse.json({
        success: false,
        error: 'Configuration is required',
        code: 'MISSING_CONFIG'
      }, { status: 400 });
    }

    const rateLimiter = getRateLimiter();
    const result = rateLimiter.checkLimit(key);

    return NextResponse.json({
      success: true,
      data: {
        key,
        allowed: result.allowed,
        limit: result.limit,
        remaining: result.remaining,
        resetTime: result.resetTime,
        retryAfter: result.retryAfter,
        penalty: result.penalty,
        metadata: result.metadata,
        config: {
          algorithm: config.algorithm || 'fixed_window',
          windowSize: config.windowSize || 60000,
          maxRequests: config.maxRequests || 100,
          burstLimit: config.burstLimit || 200,
          penaltyMultiplier: config.penaltyMultiplier || 2,
          skipSuccessfulRequests: config.skipSuccessfulRequests || true,
          keyGenerator: config.keyGenerator || 'ip',
          headers: config.headers || ['x-forwarded-for', 'x-real-ip'],
          ipWhitelist: config.ipWhitelist || [],
          skipPaths: config.skipPaths || ['/health', '/metrics', '/status'],
          skipMethods: config.skipMethods || ['OPTIONS', 'HEAD']
        }
      }
    });
  } catch (error) {
    console.error('Rate limit configuration error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}
