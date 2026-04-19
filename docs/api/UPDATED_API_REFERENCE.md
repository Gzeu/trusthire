# TrustHire API Reference - Updated

## Overview

This document provides comprehensive API reference for the TrustHire security operations platform. All endpoints include enhanced error handling, input validation, rate limiting, and performance monitoring.

## Base URL

- **Production**: `https://trusthire-git-main-gzeus-projects.vercel.app`
- **Development**: `http://localhost:3000`

## Authentication

Currently, most endpoints work with anonymous sessions. User authentication is available via JWT tokens for enhanced features.

### Headers

```http
Content-Type: application/json
X-Request-ID: auto-generated
X-Response-Time: response-time-ms
X-RateLimit-Limit: requests-per-window
X-RateLimit-Remaining: remaining-requests
X-RateLimit-Reset: unix-timestamp
```

## Error Handling

All errors follow a consistent format:

```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "statusCode": 400,
  "timestamp": "2026-04-19T15:30:00.000Z",
  "requestId": "req_1234567890_abcdef",
  "details": {
    "validationErrors": [
      {
        "field": "recruiter.name",
        "message": "Name is required",
        "code": "too_small"
      }
    ]
  }
}
```

### Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `AUTHENTICATION_ERROR` - Authentication required
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `EXTERNAL_SERVICE_ERROR` - Third-party service failure
- `INTERNAL_ERROR` - Server error

## Core Endpoints

### 1. Assessment Management

#### Create Assessment

```http
POST /api/assessment/create
```

**Enhanced Features:**
- Comprehensive input validation with Zod schemas
- Rate limiting: 10 requests per minute
- Performance tracking
- Detailed error messages

**Request Body:**
```json
{
  "recruiter": {
    "name": "John Doe",
    "claimedCompany": "Coinbase",
    "linkedinUrl": "https://linkedin.com/in/johndoe",
    "emailReceived": "john@coinbase.com",
    "jobTitle": "Senior Recruiter",
    "recruiterMessages": "Hi, we have an urgent opportunity..."
  },
  "job": {
    "jobDescription": "Senior Solidity Developer position...",
    "salaryMentioned": true,
    "urgencySignals": false,
    "walletSeedKycRequest": false,
    "runCodeLocally": true
  },
  "artifacts": [
    {
      "type": "github",
      "url": "https://github.com/user/repo"
    },
    {
      "type": "url",
      "url": "https://company-careers.com"
    }
  ]
}
```

**Response:**
```json
{
  "id": "assessment_id",
  "shareToken": "share_token",
  "createdAt": "2026-04-19T15:30:00.000Z",
  "recruiterName": "John Doe",
  "company": "Coinbase",
  "scores": {
    "identityConfidence": 15,
    "employerLegitimacy": 20,
    "processLegitimacy": 18,
    "technicalSafety": 22
  },
  "finalScore": 75,
  "verdict": "caution",
  "redFlags": [...],
  "greenSignals": [...],
  "missingEvidence": [...],
  "workflowAdvice": [...],
  "repoScans": [...],
  "domainChecks": [...],
  "incidentReport": "...",
  "aiAnalysis": {
    "riskAssessment": {...},
    "summary": {...}
  }
}
```

#### Get Assessment

```http
GET /api/assessment/[id]
```

**Response:** Full assessment object with all analysis results.

### 2. Repository Scanning

#### Scan Repository

```http
POST /api/scan/repo
```

**Enhanced Features:**
- Input validation for GitHub URLs
- Rate limiting: 20 requests per minute
- Error handling for private/invalid repos
- Performance tracking

**Request Body:**
```json
{
  "url": "https://github.com/user/repository"
}
```

**Response:**
```json
{
  "repoUrl": "https://github.com/user/repository",
  "repoAge": 365,
  "stars": 150,
  "forks": 25,
  "hasPackageJson": true,
  "dangerousScripts": ["postinstall"],
  "patternMatches": [
    {
      "pattern": "eval\\(.*\\)",
      "severity": "critical",
      "file": "index.js",
      "line": 15
    }
  ],
  "riskLevel": "warning",
  "error": null
}
```

### 3. URL Security Analysis

#### Scan URL

```http
POST /api/scan/url
```

**Request Body:**
```json
{
  "url": "https://suspicious-domain.xyz"
}
```

**Response:**
```json
{
  "url": "https://suspicious-domain.xyz",
  "domain": "suspicious-domain.xyz",
  "hasSuspiciousTLD": true,
  "isBrandSpoofing": true,
  "isShortlink": false,
  "domainAgeYears": 0.1,
  "vtMalicious": 5,
  "vtReputation": 10,
  "vtCategories": ["malicious", "phishing"],
  "riskFlags": ["New domain", "Suspicious TLD", "Brand spoofing"]
}
```

## AI-Powered Analysis

### 4. LangChain Security Analysis

```http
POST /api/langchain/analyze
```

**Features:**
- Multi-chain security analysis
- Context-aware threat detection
- Advanced pattern recognition

**Request Body:**
```json
{
  "chainId": "security",
  "inputs": {
    "input": "Suspicious recruiter message content...",
    "context": {
      "type": "recruiter_messages",
      "platform": "assessment"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "threatLevel": "medium",
      "confidence": 0.85,
      "indicators": ["urgency_language", "off_platform_request"]
    },
    "redFlags": [
      {
        "type": "communication",
        "severity": "high",
        "description": "Urgency language detected"
      }
    ],
    "greenFlags": [...],
    "recommendations": [...]
  },
  "metadata": {
    "chainId": "security",
    "processingTime": 1250,
    "modelVersion": "1.0.0"
  }
}
```

### 5. AI Message Analysis

```http
POST /api/ai/analyze
```

**Request Body:**
```json
{
  "recruiterMessages": [
    "Hi, we have an urgent senior developer position...",
    "The role offers $200k+ and remote work..."
  ],
  "context": {
    "type": "recruiter_messages",
    "platform": "assessment"
  }
}
```

## Security & Monitoring

### 6. Rate Limit Status

```http
GET /api/security/rate-limit
```

**Response:**
```json
{
  "status": "active",
  "config": {
    "windowMs": 60000,
    "maxRequests": 10
  },
  "current": {
    "remaining": 7,
    "resetTime": 1713546600000,
    "retryAfter": 45
  }
}
```

### 7. Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-04-19T15:30:00.000Z",
  "version": "1.0.0",
  "uptime": 86400,
  "checks": {
    "database": "healthy",
    "external_apis": "healthy",
    "cache": "healthy",
    "ai_services": "healthy"
  },
  "metrics": {
    "memory_usage": 134217728,
    "cpu_usage": 15000000,
    "active_requests": 3,
    "error_rate": 0.5
  }
}
```

### 8. Performance Metrics

```http
GET /api/metrics
```

**Query Parameters:**
- `format`: `json` | `prometheus` (default: json)
- `since`: Unix timestamp for filtering

**Response (JSON):**
```json
{
  "timestamp": 1713546600000,
  "metrics": [
    {
      "name": "request_duration",
      "value": 250,
      "unit": "ms",
      "timestamp": 1713546600000,
      "tags": {
        "method": "POST",
        "status_class": "success"
      }
    }
  ],
  "systemHealth": {
    "memory": {...},
    "cpu": {...},
    "uptime": 86400,
    "activeRequests": 3,
    "errorRate": 0.5,
    "avgResponseTime": 245
  }
}
```

## Authentication Endpoints

### 9. User Registration

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "company": "Acme Corp"
}
```

### 10. User Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token",
      "expiresIn": 3600
    }
  }
}
```

### 11. Token Refresh

```http
POST /api/auth/refresh
```

## Analytics & Reporting

### 12. Get Analytics Data

```http
GET /api/analytics/analytics
```

**Query Parameters:**
- `type`: `scans` | `users` | `threats` | `performance`
- `period`: `hour` | `day` | `week` | `month`
- `limit`: Number of records (default: 100)

### 13. Generate Report

```http
POST /api/report
```

**Request Body:**
```json
{
  "assessmentId": "assessment_id",
  "format": "pdf",
  "includeEvidence": true
}
```

## Threat Intelligence

### 14. Get Threat Intelligence

```http
GET /api/intelligence/threats
```

**Query Parameters:**
- `type`: `malware` | `phishing` | `vulnerability` | `threat_actor`
- `severity`: `low` | `medium` | `high` | `critical`
- `limit`: Number of records (default: 50)

### 15. Submit Threat Intelligence

```http
POST /api/intelligence/submit
```

**Request Body:**
```json
{
  "type": "phishing",
  "title": "New crypto recruitment scam",
  "description": "Detailed description of the threat...",
  "indicators": [
    {
      "type": "email",
      "value": "recruiter@suspicious-domain.com"
    }
  ],
  "confidence": 0.9,
  "source": "manual"
}
```

## Advanced Features

### 16. Behavioral Analysis

```http
GET /api/analytics/behavior/[entityId]
```

**Response:**
```json
{
  "entityId": "user_123",
  "entityType": "user",
  "riskScore": 0.35,
  "confidence": 0.8,
  "lastUpdated": "2026-04-19T15:30:00.000Z",
  "behaviorPatterns": [
    {
      "pattern": "login_anomaly",
      "frequency": 0.1,
      "riskImpact": "medium"
    }
  ],
  "riskFactors": [
    {
      "factor": "unusual_access_times",
      "weight": 0.3
    }
  ],
  "recommendations": [
    "Enable multi-factor authentication",
    "Review recent login activity"
  ]
}
```

### 17. Zero-Trust Assessment

```http
POST /api/security/zero-trust/assess
```

**Request Body:**
```json
{
  "userId": "user_123",
  "resource": "admin_panel",
  "context": {
    "ipAddress": "192.168.1.100",
    "userAgent": "Mozilla/5.0...",
    "location": "US-West",
    "device": "desktop"
  }
}
```

## Rate Limiting

All endpoints are subject to rate limiting based on their category:

| Endpoint Category | Limit | Window | Purpose |
|-----------------|-------|--------|---------|
| Assessment | 10 requests | 1 minute | Prevent abuse of analysis features |
| Scanning | 20 requests | 1 minute | Allow moderate scanning activity |
| AI Analysis | 5 requests | 1 minute | Control costs of AI services |
| Authentication | 5 requests | 15 minutes | Prevent brute force attacks |
| General | 100 requests | 1 minute | Allow normal API usage |
| Admin | 2 requests | 1 minute | Strict limits for admin functions |

## Performance Monitoring

The API includes comprehensive performance monitoring:

### Metrics Tracked
- Request duration by endpoint and status
- Error rates and types
- Database operation performance
- Cache hit/miss ratios
- External API response times
- Memory and CPU usage

### Monitoring Endpoints
- `/api/metrics` - Raw metrics data
- `/api/health` - System health status
- Response headers include timing information

## SDK Integration

### JavaScript/TypeScript

```typescript
import { TrustHireAPI } from '@trusthire/sdk';

const client = new TrustHireAPI({
  baseURL: 'https://trusthire-git-main-gzeus-projects.vercel.app',
  apiKey: 'your-api-key'
});

// Create assessment
const assessment = await client.assessments.create({
  recruiter: { ... },
  job: { ... },
  artifacts: [ ... ]
});

// Scan repository
const scanResult = await client.scanning.scanRepository({
  url: 'https://github.com/user/repo'
});
```

### Python

```python
from trusthire import TrustHireClient

client = TrustHireClient(
    base_url='https://trusthire-git-main-gzeus-projects.vercel.app',
    api_key='your-api-key'
)

# Create assessment
assessment = client.assessments.create({
    'recruiter': { ... },
    'job': { ... },
    'artifacts': [ ... ]
})
```

## Webhooks

### Configure Webhooks

```http
POST /api/webhooks/configure
```

**Request Body:**
```json
{
  "url": "https://your-app.com/webhooks/trusthire",
  "events": [
    "assessment.completed",
    "threat.detected",
    "system.alert"
  ],
  "secret": "webhook_secret_key",
  "active": true
}
```

### Webhook Events

**Assessment Completed:**
```json
{
  "event": "assessment.completed",
  "timestamp": "2026-04-19T15:30:00.000Z",
  "data": {
    "assessmentId": "assessment_123",
    "finalScore": 75,
    "verdict": "caution",
    "threats": [...]
  }
}
```

## Error Response Examples

### Validation Error
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Input validation failed",
  "statusCode": 400,
  "timestamp": "2026-04-19T15:30:00.000Z",
  "requestId": "req_1234567890_abcdef",
  "details": {
    "validationErrors": [
      {
        "field": "recruiter.name",
        "message": "Name must be less than 100 characters",
        "code": "too_big"
      }
    ]
  }
}
```

### Rate Limit Error
```json
{
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Rate limit exceeded. Try again in 45 seconds.",
  "statusCode": 429,
  "timestamp": "2026-04-19T15:30:00.000Z",
  "requestId": "req_1234567890_abcdef",
  "details": {
    "limit": 10,
    "remaining": 0,
    "resetTime": 1713546600000,
    "retryAfter": 45
  }
}
```

## Best Practices

### 1. Error Handling
- Always check the `code` field in error responses
- Implement exponential backoff for rate limit errors
- Log request IDs for debugging

### 2. Performance
- Use response time headers for monitoring
- Cache assessment results when appropriate
- Batch requests when possible

### 3. Security
- Never expose API keys in client-side code
- Use HTTPS for all API calls
- Validate webhook signatures

### 4. Rate Limiting
- Respect rate limit headers
- Implement client-side rate limiting
- Use appropriate retry strategies

## Changelog

### v2.0.0 (Current)
- Added comprehensive error handling
- Implemented performance monitoring
- Enhanced input validation
- Added AI-powered analysis endpoints
- Improved rate limiting
- Added webhook support

### v1.0.0 (Legacy)
- Basic assessment endpoints
- Simple repository scanning
- Limited error handling

## Support

- **Documentation**: https://docs.trusthire.com
- **Status Page**: https://status.trusthire.com
- **Support**: support@trusthire.com
- **GitHub Issues**: https://github.com/Gzeu/trusthire/issues

---

*Last updated: April 19, 2026*
