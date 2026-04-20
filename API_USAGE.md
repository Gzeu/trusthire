# TrustHire Data System - API Usage Documentation

## 🚀 Production API Documentation

### **🌐 Base URL**
```
Production: https://trusthire-hvaqhrlle-gzeus-projects.vercel.app
Development: http://localhost:3000
```

---

## 🔐 Authentication

### **API Key Required (Production)**
All API endpoints require authentication in production environment.

#### **Headers:**
```http
X-API-Key: your-production-api-key
Content-Type: application/json
```

#### **Environment Variables:**
```bash
# Production (.env.production)
API_KEY="your-production-api-key-here"
JWT_SECRET="your-production-jwt-secret-here"

# Development (.env.local)
API_KEY="your-development-api-key-here"
JWT_SECRET="your-development-jwt-secret-here"
```

---

## 📊 Data Collection API

### **POST /api/data/collect**
Collect real recruitment, company, and candidate data.

#### **Request Body:**
```json
{
  "type": "recruitment" | "company" | "candidate",
  "data": {
    // Data object based on type
  }
}
```

#### **Recruitment Data Example:**
```json
{
  "type": "recruitment",
  "data": {
    "companyName": "Tech Corp",
    "position": "Senior Software Engineer",
    "location": "Bucharest, Romania",
    "contactEmail": "careers@techcorp.com",
    "contactPhone": "+40-21-123-4567",
    "website": "https://techcorp.com",
    "requirements": [
      "5+ years experience",
      "Computer Science degree",
      "React/Node.js experience"
    ],
    "postedDate": "2024-01-15",
    "deadline": "2024-02-15",
    "status": "active",
    "source": "company_website",
    "confidence": 0.9,
    "notes": "Senior position with competitive salary"
  }
}
```

#### **Company Data Example:**
```json
{
  "type": "company",
  "data": {
    "companyName": "Tech Corp",
    "industry": "Software Development",
    "location": "Bucharest, Romania",
    "website": "https://techcorp.com",
    "email": "info@techcorp.com",
    "phone": "+40-21-123-4567",
    "description": "Leading software development company",
    "foundedYear": 2015,
    "employeeCount": "50-100",
    "revenue": "$5M-$10M"
  }
}
```

#### **Candidate Data Example:**
```json
{
  "type": "candidate",
  "data": {
    "personalInfo": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@email.com",
      "phone": "+40-21-123-4567",
      "location": "Bucharest, Romania"
    },
    "professionalInfo": {
      "currentPosition": "Software Engineer",
      "experience": "5 years",
      "skills": ["JavaScript", "React", "Node.js", "Python"],
      "education": "Computer Science Degree",
      "currentSalary": "80000 EUR"
    },
    "applicationInfo": {
      "appliedPosition": "Senior Software Engineer",
      "appliedCompany": "Tech Corp",
      "appliedDate": "2024-01-15",
      "status": "under_review"
    }
  }
}
```

#### **Response:**
```json
{
  "success": true,
  "id": "rec_1640678900123_abc123def",
  "type": "recruitment",
  "message": "Data collected successfully",
  "record": {
    "id": "rec_1640678900123_abc123def",
    "type": "recruitment",
    "data": { /* collected data */ },
    "metadata": {
      "source": "api_request",
      "confidence": 0.9,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "tags": ["recruitment", "job_posting"]
    }
  }
}
```

---

## 🔍 Data Validation API

### **POST /api/data/validate**
Validate and clean data with quality scoring.

#### **Request Body:**
```json
{
  "action": "validate" | "clean",
  "type": "recruitment" | "company" | "candidate",
  "data": { /* data object */ },
  "options": {
    "strict": true,
    "qualityThreshold": 0.8
  }
}
```

#### **Validation Response:**
```json
{
  "success": true,
  "action": "validate",
  "type": "recruitment",
  "result": {
    "isValid": true,
    "errors": [],
    "warnings": ["Missing salary information"],
    "qualityScore": 0.85,
    "confidence": 0.85
  }
}
```

#### **Cleaning Response:**
```json
{
  "success": true,
  "action": "clean",
  "type": "recruitment",
  "result": {
    "processed": 1,
    "duplicates": 0,
    "standardized": { /* cleaned data */ },
    "qualityIssues": [],
    "cleaned": { /* cleaned data */ }
  }
}
```

---

## 📈 Data Analytics API

### **POST /api/data/analytics**
Generate analytics and reports on collected data.

#### **Request Body:**
```json
{
  "type": "overview" | "trends" | "quality",
  "filters": {
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "type": "recruitment",
    "source": "api_request"
  }
}
```

#### **Overview Response:**
```json
{
  "success": true,
  "type": "overview",
  "totalRecords": 1250,
  "dateRange": "2024-01-01 to 2024-12-31",
  "metrics": {
    "totalRecords": 1250,
    "averageConfidence": 0.87,
    "qualityScore": 0.82,
    "sourceDistribution": {
      "api_request": 850,
      "web_form": 300,
      "import": 100
    },
    "statusDistribution": {
      "active": 800,
      "closed": 350,
      "filled": 100
    }
  },
  "trends": {
    "topPositions": [
      { "position": "Software Engineer", "count": 245 },
      { "position": "Data Analyst", "count": 189 },
      { "position": "Product Manager", "count": 156 }
    ],
    "topLocations": [
      { "location": "Bucharest", "count": 423 },
      { "location": "Cluj-Napoca", "count": 234 },
      { "location": "Iași", "count": 189 }
    ],
    "topCompanies": [
      { "company": "Tech Corp", "count": 67 },
      { "company": "DataSoft", "count": 45 },
      { "company": "Endava", "count": 38 }
    ]
  },
  "quality": {
    "high": 950,
    "medium": 250,
    "low": 50,
    "issues": [
      { "type": "recruitment", "count": 25, "description": "Missing salary info" },
      { "type": "company", "count": 15, "description": "Incomplete contact info" }
    ]
  }
}
```

---

## 📤 Data Export API

### **POST /api/data/export**
Export filtered data in multiple formats.

#### **Request Body:**
```json
{
  "format": "csv" | "json" | "excel",
  "filters": {
    "type": "recruitment",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "quality": "high",
    "source": "api_request"
  }
}
```

#### **Response:**
```json
{
  "success": true,
  "format": "csv",
  "filters": { /* applied filters */ },
  "totalRecords": 850,
  "exportUrl": "https://trusthire-hvaqhrlle-gzeus-projects.vercel.app/api/data/export/download/export_20240120_123456.csv",
  "expiresAt": "2024-01-20T12:00:00.000Z",
  "downloadUrl": "https://trusthire-hvaqhrlle-gzeus-projects.vercel.app/api/data/export/download/export_20240120_123456.csv"
}
```

---

## 🔍 Search API

### **GET /api/data/collect?q=query&type=recruitment**
Search through collected data.

#### **Query Parameters:**
- `q` (string): Search query
- `type` (string): Filter by data type
- `limit` (number): Maximum results (default: 50)

#### **Response:**
```json
{
  "results": [
    {
      "id": "rec_1640678900123_abc123def",
      "type": "recruitment",
      "searchable": {
        "title": "Software Engineer at Tech Corp",
        "description": "Job posting for Software Engineer position",
        "keywords": ["software", "engineer", "tech", "corp"]
      }
    }
  ],
  "total": 1,
  "query": "software engineer",
  "type": "recruitment",
  "limit": 50
}
```

---

## 🏥 Health Check API

### **GET /api/health/detailed**
Comprehensive system health status.

#### **Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 86400000,
  "memory": {
    "used": 45,
    "total": 512,
    "percentage": 8.8
  },
  "apis": {
    "collect": true,
    "validate": true,
    "analytics": true,
    "export": true
  },
  "database": {
    "connected": true,
    "records": 1250
  }
}
```

---

## 🚨 Rate Limiting

### **Limits per Endpoint:**
- **Data Collection**: 10 requests per minute
- **Data Validation**: 20 requests per minute
- **Data Analytics**: 30 requests per minute
- **Data Export**: 5 requests per minute
- **Default**: 100 requests per minute

### **Rate Limit Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642678800
```

### **Rate Limit Exceeded Response:**
```json
{
  "error": "Rate limit exceeded",
  "resetTime": 1642678800
}
```

---

## 🔐 Security Headers

All API responses include security headers:

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
```

---

## 📝 Error Handling

### **Standard Error Response:**
```json
{
  "error": "Error description",
  "status": 400 | 401 | 429 | 500,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### **Common Error Codes:**
- **400 Bad Request**: Invalid JSON, missing required fields
- **401 Unauthorized**: Missing or invalid API key
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server**: Server error

---

## 🚀 Quick Start Examples

### **cURL Examples:**
```bash
# Collect recruitment data
curl -X POST https://trusthire-hvaqhrlle-gzeus-projects.vercel.app/api/data/collect \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"type": "recruitment", "data": {"companyName": "Tech Corp", "position": "Software Engineer"}}'

# Get analytics overview
curl -X POST https://trusthire-hvaqhrlle-gzeus-projects.vercel.app/api/data/analytics \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"type": "overview", "filters": {"type": "recruitment"}}'

# Export data as CSV
curl -X POST https://trusthire-hvaqhrlle-gzeus-projects.vercel.app/api/data/export \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"format": "csv", "filters": {"type": "recruitment"}}'

# Search data
curl "https://trusthire-hvaqhrlle-gzeus-projects.vercel.app/api/data/collect?q=software%20engineer&type=recruitment&limit=10" \
  -H "X-API-Key: your-api-key"

# Health check
curl "https://trusthire-hvaqhrlle-gzeus-projects.vercel.app/api/health/detailed" \
  -H "X-API-Key: your-api-key"
```

### **JavaScript/Node.js Example:**
```javascript
const API_BASE = 'https://trusthire-hvaqhrlle-gzeus-projects.vercel.app';
const API_KEY = 'your-production-api-key';

// Collect data
async function collectData(data) {
  const response = await fetch(`${API_BASE}/api/data/collect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    },
    body: JSON.stringify({
      type: 'recruitment',
      data: data
    })
  });
  
  return response.json();
}

// Get analytics
async function getAnalytics(filters) {
  const response = await fetch(`${API_BASE}/api/data/analytics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    },
    body: JSON.stringify({
      type: 'overview',
      filters: filters
    })
  });
  
  return response.json();
}
```

---

## 📞 Support

### **Documentation:**
- **API Reference**: This document
- **Deployment Guide**: `DEPLOYMENT_VERIFICATION.md`
- **Environment Setup**: `.env.production.example`

### **Contact:**
For production support and API key requests, contact the development team.

---

## 🎯 TrustHire Data System

**Focus: Real Data Collection, Validation, and Processing**
**Security: Enterprise-grade protection and monitoring**
**Performance: Optimized for production scalability**
**Architecture: Simplified, maintainable, and documented**

**Production URL**: https://trusthire-hvaqhrlle-gzeus-projects.vercel.app
