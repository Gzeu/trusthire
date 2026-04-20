# TrustHire API Documentation

## Overview

The TrustHire API provides comprehensive security operations capabilities through RESTful endpoints. All endpoints are built with Next.js 14 API routes and follow RESTful conventions.

## Base URL

```
Production: https://trusthire-git-main-gzeus-projects.vercel.app/api
Development: http://localhost:3000/api
```

## Authentication

### JWT Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

### API Key Authentication
Some endpoints support API key authentication:

```bash
X-API-Key: <your-api-key>
```

## Rate Limiting

All API endpoints are rate-limited to prevent abuse:

- **Default**: 100 requests per 15 minutes per IP
- **Authenticated**: 1000 requests per 15 minutes per user
- **Burst**: Up to 200 requests in burst scenarios

Rate limit headers are included in responses:
```bash
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully",
  "timestamp": "2026-04-19T12:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details"
  },
  "timestamp": "2026-04-19T12:00:00.000Z"
}
```

## API Endpoints

### Security Assessment

#### Create Assessment
```http
POST /api/assessment/create
```

Create a new security assessment for various targets.

**Request Body:**
```json
{
  "type": "github_repo" | "linkedin_profile" | "url_scan" | "email_analysis",
  "target": "https://github.com/user/repo" | "https://linkedin.com/in/profile",
  "options": {
    "deep_scan": true,
    "include_history": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "assessment_123",
    "status": "pending",
    "estimated_duration": 30
  }
}
```

#### Get Assessment
```http
GET /api/assessment/{id}
```

Retrieve assessment results by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "assessment_123",
    "status": "completed",
    "score": 85,
    "risk_level": "low",
    "findings": [
      {
        "type": "security_issue",
        "severity": "medium",
        "description": "Potential security vulnerability detected",
        "recommendation": "Review and update dependencies"
      }
    ],
    "completed_at": "2026-04-19T12:30:00.000Z"
  }
}
```

#### Get Recent Assessments
```http
GET /api/assessments/recent
```

Get recent assessments for the authenticated user.

**Query Parameters:**
- `limit`: Number of assessments to return (default: 10, max: 50)
- `status`: Filter by status (`pending`, `completed`, `failed`)

### AI Analysis

#### Advanced AI Analysis
```http
POST /api/ai/advanced-analyze
```

Perform advanced AI-powered security analysis.

**Request Body:**
```json
{
  "data": {
    "type": "code" | "text" | "url" | "file",
    "content": "Content to analyze",
    "options": {
      "models": ["threat_detection", "anomaly_detection"],
      "depth": "comprehensive"
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
      "threat_level": "medium",
      "confidence": 0.87,
      "findings": [
        {
          "type": "malicious_pattern",
          "confidence": 0.92,
          "description": "Suspicious code pattern detected",
          "location": "line 45-52"
        }
      ],
      "recommendations": [
        "Review suspicious code sections",
        "Implement additional security controls"
      ]
    }
  }
}
```

#### Simple AI Analysis
```http
POST /api/ai/analyze
```

Perform quick AI analysis.

**Request Body:**
```json
{
  "input": "Text or data to analyze",
  "type": "security" | "compliance" | "risk"
}
```

### Machine Learning

#### Get ML Models
```http
GET /api/ml/models
```

Get available machine learning models and their status.

**Response:**
```json
{
  "success": true,
  "data": {
    "models": [
      {
        "id": "threat_detection_v1",
        "name": "Threat Detection Model",
        "type": "classification",
        "status": "active",
        "accuracy": 0.95,
        "last_trained": "2026-04-15T10:00:00.000Z"
      }
    ]
  }
}
```

#### Train Model
```http
POST /api/ml/models/{id}/train
```

Trigger training for a specific ML model.

**Request Body:**
```json
{
  "training_data": "path/to/training/data",
  "parameters": {
    "epochs": 100,
    "batch_size": 32
  }
}
```

### Security Operations

#### Security Rate Limit Check
```http
GET /api/security/rate-limit
```

Check current rate limit status.

**Response:**
```json
{
  "success": true,
  "data": {
    "limit": 100,
    "remaining": 85,
    "reset_time": "2026-04-19T12:15:00.000Z",
    "retry_after": 30
  }
}
```

### Load Balancer

#### Health Check
```http
GET /api/load-balancer/health
```

Get load balancer and server health status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "servers": [
      {
        "id": "server_1",
        "status": "healthy",
        "connections": 25,
        "response_time": 120
      }
    ],
    "metrics": {
      "total_requests": 1000,
      "active_connections": 45,
      "average_response_time": 150
    }
  }
}
```

### Dashboard & Analytics

#### Dashboard Stats
```http
GET /api/dashboard/stats
```

Get dashboard statistics and metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "assessments": {
      "total": 1250,
      "today": 45,
      "this_week": 280
    },
    "threats": {
      "detected": 89,
      "blocked": 76,
      "false_positives": 13
    },
    "performance": {
      "average_response_time": 1.2,
      "uptime": 99.9,
      "error_rate": 0.1
    }
  }
}
```

#### Analytics Dashboard
```http
GET /api/analytics/dashboard
```

Get comprehensive analytics data.

**Response:**
```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "metric": "threats_detected",
        "data": [
          {"date": "2026-04-15", "value": 12},
          {"date": "2026-04-16", "value": 18}
        ]
      }
    ],
    "top_threats": [
      {
        "type": "phishing",
        "count": 45,
        "percentage": 35.2
      }
    ]
  }
}
```

#### Threat Analysis
```http
POST /api/analytics/threat-analysis
```

Perform advanced threat analysis.

**Request Body:**
```json
{
  "threat_data": {
    "type": "malware",
    "indicators": ["suspicious_ip", "malicious_domain"],
    "timeline": "24h"
  }
}
```

### Authentication

#### Login
```http
POST /api/auth/login
```

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "role": "analyst"
    },
    "expires_in": 3600
  }
}
```

#### Enhanced Authentication
```http
POST /api/auth/enhanced
```

Enhanced authentication with MFA support.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "mfa_code": "123456"
}
```

### Scanning

#### Repository Scan
```http
POST /api/scan/repo
```

Scan GitHub repository for security issues.

**Request Body:**
```json
{
  "repository": "https://github.com/user/repo",
  "options": {
    "deep_scan": true,
    "include_dependencies": true
  }
}
```

#### URL Scan
```http
POST /api/scan/url
```

Scan URL for malicious content.

**Request Body:**
```json
{
  "url": "https://example.com/suspicious-page",
  "options": {
    "follow_redirects": true,
    "check_ssl": true
  }
}
```

### Reporting

#### Generate Report
```http
POST /api/report
```

Generate security assessment report.

**Request Body:**
```json
{
  "assessment_id": "assessment_123",
  "format": "pdf" | "json" | "html",
  "options": {
    "include_recommendations": true,
    "detailed_findings": true
  }
}
```

### Sharing

#### Generate Share Link
```http
POST /api/share/generate
```

Generate a secure share link for an assessment.

**Request Body:**
```json
{
  "assessmentId": "assessment_123",
  "settings": {
    "isPublic": true,
    "includeDetails": true,
    "includeRecommendations": true,
    "customMessage": "Check out this security assessment"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "abc123def456",
    "url": "https://trusthire.example.com/share/abc123def456",
    "expiresAt": "2026-05-19T12:00:00.000Z"
  }
}
```

#### Get Shared Report
```http
GET /api/share/{token}
```

Access shared assessment report.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "share_123",
    "assessmentId": "assessment_123",
    "isPublic": true,
    "includeDetails": true,
    "includeRecommendations": true,
    "customMessage": "Check out this security assessment",
    "createdAt": "2026-04-19T12:00:00.000Z",
    "expiresAt": "2026-05-19T12:00:00.000Z",
    "viewCount": 15,
    "lastViewedAt": "2026-04-20T08:30:00.000Z",
    "assessment": {
      "recruiter": {
        "name": "John Doe",
        "claimedCompany": "TechCorp",
        "linkedinUrl": "https://linkedin.com/in/johndoe"
      },
      "verdict": {
        "overallScore": 85,
        "riskLevel": "low",
        "recommendation": "Safe to proceed with standard verification"
      },
      "redFlags": [...]
    }
  }
}
```

#### Track Share View
```http
POST /api/share/{token}/view
```

Track when a shared assessment is viewed (increments view count).

**Response:**
```json
{
  "success": true,
  "data": {
    "viewCount": 16,
    "lastViewedAt": "2026-04-20T12:00:00.000Z"
  }
}
```

#### Export Assessment PDF
```http
GET /api/assessment/{id}/report
```

Export assessment as downloadable PDF report.

**Response:**
```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="trusthire-report-assessment_123.pdf"

[PDF binary data]
```

### Sandbox

#### Analyze Code
```http
POST /api/sandbox/analyze
```

Analyze code in secure sandbox environment.

**Request Body:**
```json
{
  "code": "console.log('Hello World');",
  "language": "javascript",
  "options": {
    "timeout": 30,
    "memory_limit": "256MB"
  }
}
```

### LangChain Integration

#### Analyze with LangChain
```http
POST /api/langchain/analyze
```

Perform analysis using LangChain AI models.

**Request Body:**
```json
{
  "input": "Text to analyze",
  "chain_type": "security_analysis",
  "options": {
    "temperature": 0.1,
    "max_tokens": 1000
  }
}
```

### Homepage & Metrics

#### Homepage Stats
```http
GET /api/homepage/stats
```

Get homepage statistics.

#### System Metrics
```http
GET /api/metrics
```

Get system performance metrics.

### Admin

#### Blacklist Management
```http
GET /api/admin/blacklist
POST /api/admin/blacklist
DELETE /api/admin/blacklist/{id}
```

Manage IP/domain blacklist.

#### Reports Management
```http
GET /api/admin/reports
POST /api/admin/reports
```

Manage system reports.

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `INVALID_REQUEST` | Invalid request format | 400 |
| `UNAUTHORIZED` | Authentication required | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `RATE_LIMIT_EXCEEDED` | Rate limit exceeded | 429 |
| `INTERNAL_ERROR` | Server error | 500 |
| `SERVICE_UNAVAILABLE` | Service temporarily unavailable | 503 |

## SDK Examples

### JavaScript/TypeScript
```typescript
import { TrustHireAPI } from '@trusthire/client';

const client = new TrustHireAPI({
  baseURL: 'https://trusthire-git-main-gzeus-projects.vercel.app/api',
  token: 'your-jwt-token'
});

// Create assessment
const assessment = await client.assessments.create({
  type: 'github_repo',
  target: 'https://github.com/user/repo'
});

// Get results
const results = await client.assessments.get(assessment.id);
```

### Python
```python
from trusthire import TrustHireClient

client = TrustHireClient(
    base_url='https://trusthire-git-main-gzeus-projects.vercel.app/api',
    token='your-jwt-token'
)

# Create assessment
assessment = client.assessments.create(
    type='github_repo',
    target='https://github.com/user/repo'
)

# Get results
results = client.assessments.get(assessment.id)
```

## Webhooks

TrustHire supports webhooks for real-time notifications:

### Configure Webhook
```http
POST /api/webhooks
```

**Request Body:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["assessment.completed", "threat.detected"],
  "secret": "webhook-secret"
}
```

### Webhook Payload
```json
{
  "event": "assessment.completed",
  "data": {
    "assessment_id": "assessment_123",
    "status": "completed",
    "score": 85
  },
  "timestamp": "2026-04-19T12:00:00.000Z",
  "signature": "sha256=..."
}
```

## Rate Limiting by Endpoint

| Endpoint | Rate Limit | Burst |
|----------|-------------|-------|
| `/api/assessment/*` | 100/hour | 200 |
| `/api/ai/*` | 50/hour | 100 |
| `/api/ml/*` | 25/hour | 50 |
| `/api/scan/*` | 200/hour | 400 |
| `/api/auth/*` | 10/minute | 20 |

## Support

- **Documentation**: [TrustHire Docs](https://docs.trusthire.com)
- **GitHub Issues**: [Report Issues](https://github.com/Gzeu/trusthire/issues)
- **Community**: [Discussions](https://github.com/Gzeu/trusthire/discussions)

---

*Last updated: April 19, 2026*
