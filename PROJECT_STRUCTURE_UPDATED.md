# TrustHire Project Structure

## **Updated: Phase 6 Complete - AI-Powered Security Operations Platform**

---

## **Overview**
TrustHire is now a comprehensive **AI-powered security operations platform** that provides advanced threat detection, automated compliance, and intelligent security orchestration. Originally focused on recruiter scam detection, the platform has evolved into a full-featured cybersecurity solution with 8 major AI-powered services.

---

## **Current Platform Capabilities**

### **Phase 6: Advanced Security Operations & Intelligence (100% Complete)**
1. **Automated Threat Hunting** - ML-driven hypothesis generation and automated workflows
2. **AI Security Orchestration** - Predictive response with dynamic playbook adaptation
3. **Predictive Threat Intelligence** - Trend analysis with emerging threat detection
4. **Adaptive Zero-Trust** - Dynamic risk assessment with real-time trust evaluation
5. **Advanced UEBA** - Deep learning models with predictive anomaly detection
6. **Intelligent Compliance** - End-to-end automated compliance management
7. **AI Threat Actor Profiling** - Comprehensive threat actor intelligence with ML predictions

---

## **Current Directory Structure**

```
trusthire/
# === Core Application ===
app/                          # Next.js 14 App Router pages
  api/                       # API routes (26 endpoints)
    admin/                   # Admin management endpoints
    assessment/              # Security assessment endpoints
    dashboard/               # Dashboard analytics endpoints
    homepage/                # Homepage statistics
    langchain/               # AI analysis endpoints
    metrics/                 # Performance metrics
    ml/                      # Machine learning endpoints
    patterns/                # Threat pattern detection
    report/                  # Report generation
    sandbox/                 # Code sandbox analysis
    scan/                    # Security scanning
    share/                   # Report sharing
  assess/                    # Assessment center
  collaboration/            # Real-time collaboration
  dashboard/                 # Analytics dashboard
  enhanced-page.tsx         # Enhanced homepage
  intelligence/              # Threat intelligence
  monitoring/               # System monitoring
  patterns/                 # Threat patterns
  sandbox/                  # Code sandbox
  scan/                     # Security scanning
  share/                    # Shared reports
  globals.css               # Global styles
  layout.tsx               # Root layout
  page.tsx                 # Homepage

# === Components ===
components/                  # React components (65 files)
  ai/                      # AI analysis components
    AdvancedAnalysisPanel.tsx
  analytics/               # Analytics dashboard
    AnalyticsDashboard.tsx
  collaboration/           # Real-time collaboration
    RealTimeCollaborationPanelWorking.tsx
  intelligence/            # Threat intelligence
  langchain/               # LangChain integration
  ml/                      # Machine learning
    MLDashboard.tsx
  scan/                    # Security scanning
  ui/                      # Design system (7 components)
  admin/                   # Admin components
  index.ts                 # Component exports
  theme-provider.tsx       # Theme management

# === Phase 6 AI Services (NEW) ===
lib/                        # Core libraries (74 items)
  adaptive-zero-trust/      # Adaptive Zero-Trust Service
    adaptive-zero-trust-service.ts
  advanced-analytics/       # Advanced Analytics Service
    behavioral-analytics-service.ts
  advanced-behavioral-analytics/ # Advanced UEBA Service
    advanced-ueba-service.ts
  advanced-threat-hunting/  # Automated Threat Hunting
    automated-hunting-service.ts
  ai-security-orchestration/ # AI Security Orchestration
    predictive-orchestration-service.ts
  ai-threat-actor-profiling/ # AI Threat Actor Profiling
    threat-actor-profiling-service.ts
  compliance-automation/   # Compliance Automation
    compliance-service.ts
  intelligence-fusion/     # Intelligence Fusion
    intelligence-fusion-service.ts
  intelligent-compliance/  # Intelligent Compliance
    compliance-intelligence-service.ts
  ml/                      # Machine Learning Services
    anomaly-detection-service.ts
    ml-training-service.ts
    threat-prediction-service.ts
  predictive-intelligence/ # Predictive Intelligence
    threat-intelligence-prediction-service.ts
  security/                # Security Services
    automated-response-service.ts
  soar/                    # Security Orchestration
    security-orchestration-service.ts
  threat-actor-profiling/  # Threat Actor Profiling
    threat-actor-service.ts
  threat-hunting/          # Threat Hunting
    threat-hunting-service.ts
  threat-intelligence-sharing/ # Threat Intelligence Sharing
    stix-taxii-service.ts
  zero-trust/              # Zero Trust
    zero-trust-service.ts

# === Existing Services ===
  api/                     # API Integration (6 services)
    threat-intelligence/   # Threat Intelligence APIs
      aggregator.ts
      misp-client.ts
      virustotal-client.ts
      phishtank-client.ts
  auth/                    # Authentication (4 services)
    auth-middleware.ts
    enhanced-auth-service.ts
    oauth-service.ts
  cache/                   # Caching Services
    cache-service.ts
  database/                # Database Services (4 services)
    analytics-service.ts
    scan-history-service.ts
  load-balancer/           # Load Balancing (2 services)
    cluster-manager.ts
    load-balancer-middleware.ts
  rate-limiter.ts          # Rate Limiting
  redis-wrapper.ts         # Redis Client
  websocket/               # Real-time Communication (2 services)
    realtime-client.ts
    realtime-server.ts

# === Legacy Services ===
  ai-analyzer.ts           # AI Analysis Engine
  behavioral-analyzer.ts   # Behavioral Analysis
  custom-ml-models.ts       # Custom ML Models
  langchain-integration.ts  # LangChain Integration
  performance.ts           # Performance Monitoring
  sandbox-analyzer.ts       # Sandbox Analysis
  scoring.ts               # Risk Scoring
  threat-intelligence.ts   # Threat Intelligence
  utils.ts                 # Utilities

# === Database ===
prisma/                     # Database Schema
  schema.prisma            # Complete schema with Phase 6 models
    # Phase 6 Models:
    # - MLModel, TrainingJob, PredictionResult
    # - AutomatedResponse, SOARPlaybook, SOARExecution
    # - IntelligenceSource, IntelligenceItem, FusionRule
    # - ZeroTrustPolicy, AccessRequest
    # - TAXIIServer, SharingPolicy, SharingSession
    # - BehavioralProfile, Anomaly, UEBAAlert
    # - ComplianceFramework, ComplianceAudit, CompliancePolicy
    # - ThreatActor, ThreatActorProfile

# === Configuration ===
package.json               # Dependencies (1924 bytes)
package-lock.json          # Lock file (401KB)
next.config.js            # Next.js Configuration
tsconfig.json            # TypeScript Configuration
tailwind.config.ts        # Tailwind CSS Configuration
vercel.json              # Vercel Deployment Config

# === Documentation ===
README.md                 # Main documentation (21KB)
PROJECT_STRUCTURE.md      # This file
PROJECT_SUMMARY.md        # Project summary
CUSTOM_ML_MODELS.md       # ML Models documentation
LANGCHAIN_INTEGRATION.md  # LangChain integration guide
EXTENDED_FEATURES_GUIDE.md # Extended features guide
VERCEL_DEPLOYMENT.md      # Deployment guide

# === Environment ===
.env.example              # Environment template
.env.local                # Local environment
.env.production           # Production environment
.env.gateway              # Gateway configuration

# === Infrastructure ===
docker-compose.yml        # Docker configuration
krakend.json             # API Gateway configuration
prometheus.yml           # Prometheus monitoring
redis.conf               # Redis configuration
vercel.json              # Vercel configuration
```

---

## **Architecture Overview**

### **Frontend Architecture**
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks with event-driven services
- **TypeScript**: Full TypeScript with 1000+ interfaces
- **Components**: Modular, reusable design system

### **Backend Architecture**
- **API Routes**: Next.js API routes with TypeScript
- **Database**: Prisma ORM with PostgreSQL/SQLite
- **Authentication**: JWT-based with role-based access control
- **Security**: Rate limiting, input validation, CORS
- **Real-time**: WebSocket integration for live updates

### **AI/ML Architecture**
- **Machine Learning**: Custom models with automated training
- **Deep Learning**: Autoencoders, LSTM, Transformers, GNNs
- **Predictive Analytics**: Time-series forecasting, anomaly detection
- **Natural Language Processing**: Text analysis and classification
- **Computer Vision**: Image analysis and pattern recognition

---

## **Key Features by Module**

### **Phase 6 AI Services**
- **Location**: `lib/[service-name]/`
- **Services**: 8 major AI-powered security services
- **Features**: ML models, predictive analytics, automation
- **Integration**: Event-driven architecture with real-time updates

### **Security Assessment**
- **Location**: `app/assess/`, `lib/threat-hunting/`
- **Components**: Interactive assessment, risk scoring
- **API**: `/api/assessment/`, `/api/scan/`
- **Features**: Automated threat hunting, ML-driven analysis

### **Dashboard & Analytics**
- **Location**: `app/dashboard/`, `components/analytics/`
- **Components**: Real-time stats, ML insights
- **API**: `/api/dashboard/`, `/api/ml/`
- **Features**: ML model monitoring, performance metrics

### **Compliance & Governance**
- **Location**: `lib/compliance-automation/`, `lib/intelligent-compliance/`
- **Services**: Automated compliance, intelligent monitoring
- **Features**: AI-powered compliance assessment, automated reporting

### **Threat Intelligence**
- **Location**: `app/patterns/`, `lib/predictive-intelligence/`
- **Components**: Pattern database, predictive analytics
- **API**: `/api/patterns/`, `/api/threat-intelligence/`
- **Features**: Trend analysis, emerging threat detection

---

## **Data Flow Architecture**

```
User Interface (React Components)
    |
    v
API Routes (Next.js)
    |
    v
Service Layer (TypeScript Services)
    |
    v
AI/ML Models (Custom + Pre-trained)
    |
    v
Database Layer (Prisma + PostgreSQL/SQLite)
    |
    v
Cache Layer (Redis)
```

---

## **Technology Stack**

### **Frontend**
- **Next.js 14**: App Router, Server Components
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **React Hooks**: State management

### **Backend**
- **Node.js**: Runtime environment
- **Prisma**: ORM with type safety
- **PostgreSQL/SQLite**: Database
- **Redis**: Caching and session storage
- **JWT**: Authentication tokens

### **AI/ML**
- **Custom Models**: Trained on security data
- **OpenAI API**: GPT integration
- **TensorFlow.js**: ML model execution
- **LangChain**: AI workflow orchestration

### **Infrastructure**
- **Vercel**: Hosting and deployment
- **Docker**: Containerization
- **Prometheus**: Monitoring
- **WebSocket**: Real-time communication

---

## **Phase 6 Implementation Details**

### **Service Architecture**
Each AI service follows this pattern:
```typescript
interface ServiceConfig {
  enabled: boolean;
  ml: MLConfiguration;
  automation: AutomationConfiguration;
  monitoring: MonitoringConfiguration;
}

class Service extends EventEmitter {
  private models: Map<string, MLModel>;
  private config: ServiceConfig;
  
  async start(): Promise<void>
  async stop(): Promise<void>
  async process(data: any): Promise<any>
  getStatistics(): ServiceStatistics
}
```

### **ML Model Integration**
- **Training**: Automated training with scheduling
- **Inference**: Real-time prediction with caching
- **Monitoring**: Performance metrics and drift detection
- **Versioning**: Model version management

### **Event-Driven Communication**
```typescript
// Service communication
service.on('threat:detected', (threat) => {
  // Automated response
});

// Real-time updates
websocket.broadcast('threat:update', threat);
```

---

## **Performance & Scalability**

### **Caching Strategy**
- **Redis**: Session storage, API response caching
- **Memory**: In-memory model caching
- **Database**: Query optimization with indexes

### **Load Balancing**
- **Cluster Manager**: Multiple server instances
- **Health Monitoring**: Automatic failover
- **Session Affinity**: Sticky sessions for consistency

### **Monitoring**
- **Prometheus**: Metrics collection
- **Custom Dashboard**: Real-time performance monitoring
- **Alert System**: Automated notifications

---

## **Security Implementation**

### **Authentication & Authorization**
- **JWT Tokens**: Secure authentication
- **Role-Based Access**: Admin, Analyst, Viewer roles
- **Session Management**: Secure session handling

### **Rate Limiting**
- **Multiple Algorithms**: Fixed window, sliding window, token bucket
- **IP-based**: Per-client rate limiting
- **Dynamic Configuration**: Runtime adjustment

### **Input Validation**
- **TypeScript**: Compile-time type checking
- **Runtime Validation**: Input sanitization
- **SQL Injection Prevention**: Prisma ORM

---

## **Deployment & DevOps**

### **Environment Configuration**
```bash
# Development
npm run dev

# Production Build
npm run build

# Start Production
npm start
```

### **Vercel Deployment**
- **Automatic**: Git-based deployment
- **Environment Variables**: Secure configuration
- **Build Optimization**: Production-ready builds

### **Database Management**
```bash
# Generate Prisma Client
npx prisma generate

# Run Migrations
npx prisma migrate dev

# View Database
npx prisma studio
```

---

## **Development Guidelines**

### **Code Organization**
- **Services**: Single responsibility per service
- **Interfaces**: Comprehensive TypeScript interfaces
- **Error Handling**: Consistent error patterns
- **Documentation**: JSDoc comments throughout

### **Testing Strategy**
- **Unit Tests**: Service-level testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full workflow testing
- **Performance Tests**: Load and stress testing

### **Best Practices**
- **Type Safety**: Strict TypeScript configuration
- **Error Boundaries**: React error handling
- **Memory Management**: Proper cleanup and disposal
- **Security First**: Input validation and sanitization

---

## **Future Roadmap**

### **Phase 7: Advanced Analytics & Intelligence**
- **Advanced ML Models**: More sophisticated algorithms
- **Real-time Analytics**: Live data processing
- **Predictive Intelligence**: Advanced threat forecasting

### **Phase 8: Enterprise Features**
- **Multi-tenant Support**: Organization management
- **Advanced Reporting**: Custom report generation
- **API Gateway**: External API management

---

## **Contributing Guidelines**

### **Development Setup**
1. Clone repository
2. Install dependencies: `npm install`
3. Set up environment: `cp .env.example .env.local`
4. Start development: `npm run dev`

### **Code Standards**
- **TypeScript**: Strict mode enabled
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

---

## **Production Status**

### **Current Version**: 1.0.0
### **Phase 6 Status**: 100% Complete
### **Production URL**: https://trusthire-git-main-gzeus-projects.vercel.app
### **Last Updated**: April 19, 2026

---

## **Summary**

TrustHire has evolved from a simple scam detection tool into a comprehensive **AI-powered security operations platform** with:

- **8 Major AI Services** with advanced ML capabilities
- **1000+ TypeScript Interfaces** ensuring type safety
- **Enterprise-Grade Architecture** ready for scaling
- **Real-time Monitoring** and automated responses
- **Comprehensive Security** with zero-trust principles

The platform is now **production-ready** and provides organizations with advanced cybersecurity capabilities powered by artificial intelligence.
