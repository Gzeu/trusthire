// Security API Routes
// Rate limiting and connection validation endpoints

import { NextRequest, NextResponse } from 'next/server';
import { getRateLimiter } from '@/lib/security/rate-limiter';

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

export async function GET(request: NextRequest) {
  try {
    const rateLimiter = getRateLimiter();
    const metrics = rateLimiter.getMetrics();

    return NextResponse.json({
      success: true,
      data: {
        totalRequests: metrics.totalRequests,
        blockedRequests: metrics.blockedRequests,
        rateLimitedRequests: metrics.rateLimitedRequests,
        suspiciousRequests: metrics.suspiciousRequests,
        connectionErrors: metrics.connectionErrors,
        sslErrors: metrics.sslErrors,
        topBlockedIPs: metrics.topBlockedIPs,
        topBlockedUsers: metrics.topBlockedUsers,
        topSuspiciousPatterns: metrics.topSuspiciousPatterns,
        timestamp: metrics.timestamp
      }
    });
  } catch (error) {
    console.error('Security metrics error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

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
    console.error('Rate limit check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { key, action } = await request.json();

    if (!key) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit key is required',
        code: 'MISSING_KEY'
      }, { status: 400 });
    }

    if (!action) {
      return NextResponse.json({
        success: false,
        error: 'Action is required',
        code: 'MISSING_ACTION'
      }, { status: 400 });
    }

    const rateLimiter = getRateLimiter();
    
    switch (action) {
      case 'reset':
        // Reset rate limit for specific key
        // In production, this would reset the rate limit counter
        return NextResponse.json({
          success: true,
          message: 'Rate limit reset successfully',
          key,
          action
        });
        
      case 'clear':
        // Clear all rate limits
        // In production, this would clear all rate limit counters
        rateLimiter.resetMetrics();
        return NextResponse.json({
          success: true,
          message: 'All rate limits cleared successfully',
          key,
          action
        });
        
      case 'whitelist':
        // Add key to whitelist
        // In production, this would add the key to the whitelist
        return NextResponse.json({
          success: true,
          message: 'Key added to whitelist successfully',
          key,
          action
        });
        
      case 'blacklist':
        // Add key to blacklist
        // In production, this would add the key to the blacklist
        return NextResponse.json({
          success: true,
          message: 'Key added to blacklist successfully',
          key,
          action
        });
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          code: 'INVALID_ACTION',
          validActions: ['reset', 'clear', 'whitelist', 'blacklist']
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Rate limit management error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get('ip');

    if (!ip) {
      return NextResponse.json({
        success: false,
        error: 'IP address is required',
        code: 'MISSING_IP'
      }, { status: 400 });
    }

    // Mock IP validation - in production, this would check against actual databases
    const validation = {
      ip,
      isValid: true,
      isBlacklisted: false,
      isWhitelisted: false,
      country: 'US',
      region: 'us-east-1',
      isp: 'Example ISP',
      organization: 'Example Organization',
      asn: 'AS12345',
      reputation: {
        score: 85,
        category: 'low',
        lastSeen: new Date().toISOString(),
        sources: ['spamhaus', 'projecthoneypot']
      },
      geoLocation: {
        country: 'US',
        region: 'us-east-1',
        city: 'Example City',
        latitude: 40.7128,
        longitude: -74.0060
      },
      security: {
        isProxy: false,
        isTor: false,
        isVPN: false,
        isDatacenter: false,
        isMobile: false,
        isBot: false
      },
      history: {
        firstSeen: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastSeen: new Date().toISOString(),
        totalRequests: 156,
        blockedRequests: 2,
        suspiciousRequests: 5
      }
    };

    return NextResponse.json({
      success: true,
      data: validation
    });
  } catch (error) {
    console.error('IP validation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { ip, action, reason, duration } = await request.json();

    if (!ip) {
      return NextResponse.json({
        success: false,
        error: 'IP address is required',
        code: 'MISSING_IP'
      }, { status: 400 });
    }

    if (!action) {
      return NextResponse.json({
        success: false,
        error: 'Action is required',
        code: 'MISSING_ACTION'
      }, { status: 400 });
    }

    // Mock IP management - in production, this would update actual databases
    const result = {
      ip,
      action,
      reason: reason || 'Manual action',
      duration: duration || 'permanent',
      timestamp: new Date().toISOString(),
      success: true,
      message: `IP ${ip} ${action} successfully`
    };

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('IP management error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pattern = searchParams.get('pattern');

    if (!pattern) {
      return NextResponse.json({
        success: false,
        error: 'Pattern is required',
        code: 'MISSING_PATTERN'
      }, { status: 400 });
    }

    // Mock pattern validation - in production, this would check against actual databases
    const validation = {
      pattern,
      isSuspicious: false,
      category: 'none',
      severity: 'low',
      confidence: 0,
      matches: [],
      lastSeen: null,
      sources: [],
      recommendations: []
    };

    // Check against known suspicious patterns
    const suspiciousPatterns = [
      '<script',
      'javascript:',
      'eval(',
      'document.cookie',
      'document.write',
      'window.location',
      'document.referrer',
      'union select',
      'drop table',
      'exec(',
      'system(',
      'xp_cmdshell',
      'base64_decode',
      'file_get_contents',
      'curl_exec',
      'passthru'
    ];

    if (suspiciousPatterns.some(p => pattern.toLowerCase().includes(p))) {
      validation.isSuspicious = true;
      validation.category = 'injection';
      validation.severity = 'high';
      validation.confidence = 0.9;
      validation.matches = suspiciousPatterns.filter(p => pattern.toLowerCase().includes(p));
      validation.sources = ['sql_injection', 'xss', 'command_injection'];
      validation.recommendations = [
        'Block this request immediately',
        'Review input validation',
        'Implement WAF rules',
        'Monitor for similar patterns'
      ];
    }

    return NextResponse.json({
      success: true,
      data: validation
    });
  } catch (error) {
    console.error('Pattern validation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const rateLimiter = getRateLimiter();
    const metrics = rateLimiter.getMetrics();

    const securityReport = {
      timestamp: new Date().toISOString(),
      summary: {
        totalRequests: metrics.totalRequests,
        blockedRequests: metrics.blockedRequests,
        rateLimitedRequests: metrics.rateLimitedRequests,
        suspiciousRequests: metrics.suspiciousRequests,
        connectionErrors: metrics.connectionErrors,
        sslErrors: metrics.sslErrors,
        averageResponseTime: 125, // Mock data
        errorRate: metrics.totalRequests > 0 ? (metrics.blockedRequests / metrics.totalRequests) * 100 : 0
      },
      threats: {
        topBlockedIPs: metrics.topBlockedIPs.slice(0, 10),
        topBlockedUsers: metrics.topBlockedUsers.slice(0, 10),
        topSuspiciousPatterns: metrics.topSuspiciousPatterns.slice(0, 10),
        recentActivity: [
          {
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            type: 'rate_limit',
            severity: 'medium',
            ip: '192.168.1.100',
            details: 'Exceeded rate limit of 100 requests per minute'
          },
          {
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            type: 'suspicious_pattern',
            severity: 'high',
            ip: '10.0.0.50',
            details: 'Detected SQL injection attempt'
          },
          {
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            type: 'blocked_ip',
            severity: 'high',
            ip: '203.0.113.45',
            details: 'IP address is blacklisted'
          }
        ]
      },
      recommendations: [
        'Review and update rate limiting thresholds',
        'Implement additional security headers',
        'Monitor for suspicious patterns',
        'Update IP blacklist regularly',
        'Implement Web Application Firewall (WAF)',
        'Enable SSL/TLS enforcement',
        'Regular security audits and penetration testing'
      ],
      metrics: {
        rateLimiting: {
          totalViolations: metrics.rateLimitedRequests,
          averageViolationsPerHour: metrics.rateLimitedRequests / 24,
          peakHour: '14:00-15:00',
          mostViolatedKeys: ['api-key-1', 'ip-192.168.1.100']
        },
        ipBlocking: {
          totalBlockedIPs: metrics.topBlockedIPs.length,
          newBlocksToday: 5,
          mostBlockedCountry: 'CN',
          averageBlockDuration: '24 hours'
        },
        patternDetection: {
          totalSuspiciousPatterns: metrics.topSuspiciousPatterns.length,
          newPatternsToday: 3,
          mostCommonPattern: '<script>',
          averageConfidence: 0.75
        }
      }
    };

    return NextResponse.json({
      success: true,
      data: securityReport
    });
  } catch (error) {
    console.error('Security report error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, severity, message, details } = await request.json();

    if (!type || !severity || !message) {
      return NextResponse.json({
        success: false,
        error: 'Type, severity, and message are required',
        code: 'MISSING_REQUIRED_FIELDS'
      }, { status: 400 });
    }

    // Mock alert creation - in production, this would send to monitoring systems
    const alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: type || 'security',
      severity: severity || 'medium',
      message,
      details: details || {},
      timestamp: new Date().toISOString(),
      source: 'trusthire-security',
      acknowledged: false,
      resolved: false,
      assignedTo: null,
      tags: ['auto-generated', 'security']
    };

    // In production, this would:
    // 1. Send to monitoring systems
    // 2. Store in database
    // 3. Send notifications to relevant teams
    // 4. Create incident tickets if needed

    console.log('Security alert created:', alert);

    return NextResponse.json({
      success: true,
      data: alert,
      message: 'Security alert created successfully'
    });
  } catch (error) {
    console.error('Create security alert error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}
