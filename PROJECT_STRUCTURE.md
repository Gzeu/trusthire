# TrustHire Project Structure

## 📁 Root Directory Structure

```
trusthire/
├── app/                          # Next.js 14 App Router pages
│   ├── api/                     # API routes
│   │   ├── admin/              # Admin endpoints
│   │   ├── assessment/         # Assessment management
│   │   ├── collaboration/       # Collaboration features
│   │   │   ├── reviews/         # Review management
│   │   │   ├── comments/        # Comment system
│   │   │   ├── team/            # Team sharing
│   │   │   └── websocket/       # Real-time events
│   │   ├── dashboard/          # Dashboard stats
│   │   ├── homepage/           # Homepage statistics
│   │   ├── langchain/           # AI analysis endpoints
│   │   ├── metrics/            # Performance metrics
│   │   ├── ml/                 # Machine learning endpoints
│   │   │   ├── threats/         # Threat detection
│   │   │   ├── behavior/        # Behavioral analysis
│   │   │   └── models/          # Model management
│   │   ├── patterns/            # Pattern detection
│   │   ├── report/             # Report generation
│   │   ├── sandbox/            # Code sandbox analysis
│   │   ├── scan/               # Security scanning
│   │   └── share/              # Report sharing
│   ├── assess/                  # Assessment center
│   │   ├── page.tsx           # Main assessment page
│   │   └── simple-enhanced-page.tsx
│   ├── dashboard/               # Dashboard page
│   │   ├── page.tsx           # Main dashboard
│   │   └── enhanced-page.tsx   # Enhanced dashboard
│   ├── monitoring/              # System monitoring
│   │   ├── page.tsx           # Main monitoring page
│   │   └── enhanced-page.tsx   # Enhanced monitoring
│   ├── patterns/               # Threat patterns
│   │   ├── page.tsx           # Main patterns page
│   │   └── enhanced-page.tsx   # Enhanced patterns
│   ├── sandbox/                # Code sandbox
│   │   ├── page.tsx           # Main sandbox page
│   │   └── enhanced-page.tsx   # Enhanced sandbox
│   ├── share/                  # Shared reports
│   │   └── [token]/
│   │       └── page.tsx       # Public report view
│   ├── globals.css             # Global styles
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Homepage
│   └── enhanced-page.tsx       # Enhanced homepage
├── components/                  # React components
│   ├── ui/                  # Design system components
│   │   ├── DesignSystem.tsx   # Main design system
│   │   └── LazyImage.tsx     # Performance optimized images
│   ├── EnhancedNavbar.tsx      # Navigation component
│   ├── OnboardingFlow.tsx     # User onboarding
│   └── [various components]  # All other UI components
├── lib/                      # Utility libraries
│   ├── collaboration/         # Collaboration system
│   │   ├── review-system.ts  # Review management
│   ├── ml/                   # Machine learning
│   │   ├── model-manager.ts   # ML model management
│   │   ├── custom-threat-detector.ts  # Threat detection
│   │   ├── behavioral-analyzer.ts    # Behavioral analysis
│   ├── real-time/            # Real-time features
│   │   ├── websocket-manager.ts     # WebSocket management
│   ├── performance.ts        # Performance utilities
│   ├── prisma.ts           # Database client
│   ├── rateLimit.ts        # Rate limiting
│   └── [other utilities]  # Helper functions
├── prisma/                   # Database schema
│   └── schema.prisma        # Database definition
├── public/                   # Static assets
└── [config files]           # Various config files
```

## 🏗️ Architecture Overview

### **Frontend Architecture**
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks (useState, useEffect, useCallback)
- **TypeScript**: Full TypeScript implementation
- **Components**: Modular, reusable design system

### **Backend Architecture**
- **API Routes**: Next.js API routes with TypeScript
- **Database**: Prisma ORM with Turso SQLite
- **Authentication**: Session-based with rate limiting
- **Security**: Input validation, sanitization, CORS
- **AI Integration**: LangChain + Groq for advanced analysis

### **Key Features by Module**

#### **🛡️ Security Assessment**
- **Location**: `app/assess/`
- **Components**: Interactive assessment selection, risk scoring
- **API**: `/api/assessment/`, `/api/scan/`
- **Features**: GitHub repo analysis, LinkedIn verification, URL scanning

#### **📊 Dashboard & Analytics**
- **Location**: `app/dashboard/`
- **Components**: Real-time stats, metrics visualization
- **API**: `/api/dashboard/stats/`, `/api/metrics/`
- **Features**: Auto-refresh, trend analysis, report history

#### **🔍 Threat Intelligence**
- **Location**: `app/patterns/`
- **Components**: Pattern database, search/filter system
- **API**: `/api/patterns/`
- **Features**: Scam pattern detection, risk indicators, prevention tips

#### **🧪 Secure Sandbox**
- **Location**: `app/sandbox/`
- **Components**: Multiple isolation environments, code analysis
- **API**: `/api/sandbox/analyze/`
- **Features**: Isolated containers, VM emulation, WebAssembly

#### **📤 Shareable Reports**
- **Location**: `app/share/[token]/`
- **Components**: Professional UI, mobile-responsive design, analytics dashboard
- **API**: `/api/share/generate`, `/api/share/[token]`, `/api/share/[token]/view`
- **Features**: 
  - Secure token generation with 30-day expiration
  - Privacy controls (public/private sharing)
  - Real-time view tracking and analytics
  - Custom messaging for shared reports
  - PDF export functionality
  - Rate limiting (5 req/min) for security
  - Integration with assessment results page

#### **Advanced ML Models**
- **Location**: `lib/ml/`
- **Components**: Model manager, threat detector, behavioral analyzer
- **API**: `/api/ml/threats/detect`, `/api/ml/behavior/analyze`, `/api/ml/models`
- **Features**:
  - Custom threat detection with 6 advanced patterns
  - Behavioral analysis and anomaly detection
  - Predictive analytics for threat trends
  - Model training and evaluation
  - Real-time risk scoring
  - Pattern recognition engine

#### **Real-time Collaboration**
- **Location**: `lib/collaboration/`, `lib/real-time/`
- **Components**: Review system, team sharing, WebSocket manager
- **API**: `/api/collaboration/reviews/create`, `/api/collaboration/comments/add`, `/api/collaboration/team/share`
- **Features**:
  - Collaborative assessment reviews with assignments
  - Threaded comment system with reactions
  - Team sharing with granular permissions
  - Real-time WebSocket notifications
  - Review workflow management
  - Activity tracking and analytics

## 🎨 Design System

### **Core Components** (`components/ui/DesignSystem.tsx`)
```typescript
interface DesignSystem {
  // Colors
  colors: {
    primary: string;      // red-500
    secondary: string;    // blue-500
    accent: string;       // purple-500
    success: string;      // emerald-500
    warning: string;      // yellow-500
    error: string;        // red-500
    info: string;         // blue-500
  };
  
  // Typography
  typography: {
    fontFamily: string;
    fontSize: Record<string, string>;
    fontWeight: Record<string, string>;
    lineHeight: Record<string, string>;
  };
  
  // Spacing & Sizing
  spacing: Record<string, string>;
  radius: Record<string, string>;
  shadows: Record<string, string>;
}
```

### **Reusable Components**
- **Card**: Consistent styling, glow effects, hover states
- **Button**: Multiple variants (primary, secondary, ghost, danger)
- **Badge**: Status indicators, color-coded variants
- **Skeleton**: Loading states, shimmer effects
- **EmptyState**: User guidance, call-to-action
- **Container**: Responsive layout containers
- **Section**: Content sections with consistent spacing

## 🔧 Technology Stack

### **Frontend**
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Framer Motion**: Animations and transitions

### **Backend**
- **Node.js**: Runtime environment
- **Prisma**: Type-safe database ORM
- **Turso SQLite**: Serverless database
- **Redis**: Caching and session storage
- **Groq**: AI/ML model integration
- **LangChain**: Advanced AI orchestration

### **Infrastructure**
- **Vercel**: Deployment platform
- **Turso**: Serverless SQLite database
- **Vercel KV**: Edge caching
- **Cloudflare**: CDN and security

## 📱 Page Routing Structure

### **Static Pages**
```typescript
/                           # Homepage (enhanced)
/dashboard               # Dashboard (enhanced)
/patterns               # Threat patterns (enhanced)
/monitoring              # System monitoring (enhanced)
/sandbox                 # Code sandbox (enhanced)
/privacy                 # Privacy policy
/disclaimer              # Legal disclaimer
```

### **Dynamic Pages**
```typescript
/assess                  # Assessment center
/share/[token]           # Public report sharing
/results/[id]            # Assessment results
/api/*                   # API routes (49 total)
```

### **API Endpoints Summary**
```typescript
# ML & AI (6 endpoints)
/api/ml/threats/detect       # Advanced threat detection
/api/ml/behavior/analyze    # Behavioral analysis
/api/ml/models              # Model management
/api/ai/analyze             # AI analysis
/api/ai/advanced-analyze    # Advanced AI analysis
/api/langchain/analyze      # LangChain integration

# Collaboration (6 endpoints)
/api/collaboration/reviews/create    # Collaborative reviews
/api/collaboration/comments/add     # Comment system
/api/collaboration/team/share         # Team sharing
/api/collaboration/websocket/events   # Real-time events

# Core Security (30+ endpoints)
/api/assessment/*        # Assessment management
/api/scan/*               # Security scanning
/api/share/*              # Report sharing
/api/admin/*              # Admin functions
```

## 🔐 Security Implementation

### **API Security**
- **Rate Limiting**: Per-IP and per-endpoint limits
- **Input Validation**: Zod schema validation
- **CORS Configuration**: Proper cross-origin handling
- **SQL Injection Prevention**: Prisma ORM protection
- **XSS Protection**: Input sanitization and CSP headers

### **Authentication & Authorization**
- **Session Management**: Secure HTTP-only cookies
- **CSRF Protection**: SameSite cookie attributes
- **Token Security**: JWT with expiration and refresh
- **Role-Based Access**: Admin vs user permissions

## 📊 Database Schema

### **Core Models** (Prisma)
```prisma
model Assessment {
  id          String   @id @default(cuid())
  recruiterName String
  repositoryUrl String?
  verdict       Verdict
  riskScore    Int
  issues       Json
  recommendations Json
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  shareToken   String?  @unique
  isPublic     Boolean   @default(false)
}

model AssessmentShare {
  id                      String   @id @default(cuid())
  assessmentId            String
  token                   String   @unique
  isPublic                Boolean  @default(false)
  includeDetails          Boolean  @default(true)
  includeRecommendations  Boolean  @default(true)
  customMessage           String?
  createdAt               DateTime @default(now())
  expiresAt               DateTime @default(datetime('now', '+30 days'))
  viewCount               Int      @default(0)
  lastViewedAt            DateTime?
  
  assessment Assessment @relation(fields: [assessmentId], references: [id])
}

model BlacklistedRecruiter {
  id        String   @id @default(cuid())
  name      String
  email     String?
  reason    String
  evidence  Json?
  createdAt DateTime @default(now())
}
```

## 🚀 Deployment Configuration

### **Environment Variables**
```env
# Database
DATABASE_URL="file:./dev.db"
TURSO_AUTH_TOKEN="..."
TURSO_DATABASE_URL="..."

# AI/ML
GROQ_API_KEY="..."
OPENAI_API_KEY="..."

# Security
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="..."

# External APIs
VIRUSTOTAL_API_KEY="..."

# Performance
REDIS_URL="..."
```

### **Build Process**
```bash
# Development
npm run dev

# Build
npm run build

# Production deployment
vercel --prod
```

## 🧪 Testing Strategy

### **Frontend Testing**
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Cypress for user flows
- **E2E Tests**: Playwright for critical paths
- **Visual Regression**: Percy for UI consistency

### **Backend Testing**
- **API Tests**: Jest + Supertest
- **Database Tests**: Prisma test environment
- **Security Tests**: OWASP ZAP integration
- **Performance Tests**: Artillery for load testing

## 📈 Performance Optimization

### **Frontend Optimizations**
- **Code Splitting**: Route-based and component-based
- **Image Optimization**: Next.js Image + lazy loading
- **Bundle Analysis**: Webpack Bundle Analyzer
- **Caching Strategy**: SWR + Redis + CDN

### **Backend Optimizations**
- **Database Indexing**: Strategic query optimization
- **Connection Pooling**: Prisma connection management
- **API Response Caching**: Redis with TTL
- **Edge Caching**: Vercel Edge Functions

## 🔧 Development Workflow

### **Git Workflow**
```yaml
name: TrustHire CI/CD
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test
      - run: npm run build
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
```

### **Development Guidelines**
- **Code Style**: ESLint + Prettier configuration
- **Type Safety**: Strict TypeScript mode
- **Commit Convention**: Conventional Commits
- **Branch Strategy**: GitFlow (main, develop, feature/*)
- **PR Process**: Automated checks + manual review

---

## 📋 Development Tasks

### **Current Status**: Production Ready + Advanced AI Features
- [x] Design system implementation
- [x] Enhanced dashboard with real-time updates
- [x] Comprehensive assessment center
- [x] Threat intelligence patterns
- [x] Secure sandbox environments
- [x] Shareable reports system
  - [x] Secure token generation
  - [x] Professional share UI
  - [x] View tracking analytics
  - [x] PDF export functionality
  - [x] Rate limiting & security
- [x] Advanced ML Model Integration (NEW)
  - [x] Custom threat detection models
  - [x] Behavioral analysis engine
  - [x] Predictive analytics system
  - [x] Model management infrastructure
  - [x] 6 advanced threat patterns
  - [x] Real-time anomaly detection
- [x] Real-time Collaboration Features (NEW)
  - [x] WebSocket real-time infrastructure
  - [x] Collaborative assessment reviews
  - [x] Team sharing with permissions
  - [x] Threaded comment system
  - [x] Assignment workflow management
  - [x] Real-time notifications
- [x] User onboarding flow
- [x] Performance optimizations
- [x] TypeScript strict mode
- [x] Production deployment ready

### **Next Phase Opportunities**
- [ ] Mobile app development
- [ ] API rate limiting enhancements
- [ ] Advanced analytics dashboard
- [ ] Internationalization (i18n)
- [ ] Accessibility audit and improvements
- [ ] Voice-based threat analysis
- [ ] Blockchain integration for verification

---

**TrustHire is a comprehensive, enterprise-grade security platform built with modern web technologies and best practices. The architecture supports scalability, maintainability, and rapid feature development.**
