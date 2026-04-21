<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-PostgreSQL-394EFF?style=flat-square&logo=postgresql&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Vercel_Sandbox-000000?style=flat-square&logo=vercel" alt="Vercel Sandbox" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="MIT License" />
  <img src="https://img.shields.io/badge/version-1.0.0-blue?style=flat-square" alt="Version 1.0.0" />
  <img src="https://img.shields.io/badge/Phase%206-Complete-brightgreen?style=flat-square" alt="Phase 6 Complete" />
  <a href="https://trusthire.vercel.app"><img src="https://trusthire.vercel.app/api/badge/Gzeu/trusthire" alt="TrustHire" /></a>
</p>

<h1 align="center">🛡️ TrustHire - AI-Powered Security Operations Platform</h1>

<p align="center">
  <b>Advanced cybersecurity platform with AI-driven threat detection, automated compliance, and intelligent security orchestration.</b><br/>
  Complete security operations automation with 8 major AI-powered services.<br/>
  From recruiter scam detection to enterprise-grade security intelligence.
</p>

<p align="center">
  <strong>Production Live:</strong> <a href="https://trusthire-git-main-gzeus-projects.vercel.app">https://trusthire-git-main-gzeus-projects.vercel.app</a>
</p>

<p align="center">
  Built for <strong>blockchain/Web3 developers</strong> â the primary targets of fake recruiter attacks.
</p>

<p align="center">
  <strong>Current Status:</strong> 
  <span style="color: green;">✅ Phase 6 Complete: Advanced Security Operations & Intelligence</span><br/>
  <span style="color: blue;">🚀 8 Major AI Services Deployed</span><br/>
  <span style="color: purple;">📊 1000+ TypeScript Interfaces</span><br/>
  <span style="color: orange;">🏢 Enterprise-Ready Architecture</span><br/>
  <span style="color: red;">🔒 Production Deployed & Fully Documented</span>
</p>

---

## 🛡️ What is TrustHire?

TrustHire is a **comprehensive AI-powered security operations platform** that has evolved from a simple recruiter scam detection tool into a full-featured cybersecurity solution. The platform leverages advanced machine learning, predictive analytics, and intelligent automation to provide organizations with complete security operations capabilities.

### **Evolution Journey**
- **Phase 1**: Basic scam detection for recruiters
- **Phase 2**: Enhanced analytics and database persistence
- **Phase 3**: Authentication and authorization system
- **Phase 4**: Advanced analytics and ML integration
- **Phase 5**: Load balancing and security enhancements
- **Phase 6**: Advanced Security Operations & Intelligence 

### **Original Purpose (Still Supported)**
Fake recruiting attacks are increasingly targeting Web3/blockchain developers. The typical attack vector:
1. A "recruiter" reaches out via LinkedIn/Telegram with a high-paying remote role
2. They share a GitHub repository as a "technical assessment"
3. The repo contains a `postinstall` script that silently executes when you run `npm install`
4. Your environment variables, wallet keys, and SSH keys are exfiltrated

TrustHire automates the detection of these patterns while providing enterprise-grade security operations capabilities.

---

## 🚀 Phase 6: Advanced Security Operations & Intelligence (100% Complete)

### **🤖 8 Major AI-Powered Services**

#### **1. Automated Threat Hunting**
- **ML-driven hypothesis generation** with automated workflows
- **MITRE ATT&CK integration** for comprehensive threat coverage
- **Automated query execution** and results processing
- **Real-time threat hunting** with intelligent prioritization

#### **2. AI Security Orchestration**
- **Predictive response** with dynamic playbook adaptation
- **Automated incident orchestration** with AI decision-making
- **Dynamic playbook generation** based on threat intelligence
- **Real-time response coordination** and escalation

#### **3. Predictive Threat Intelligence**
- **Trend analysis** with emerging threat detection
- **Intelligence correlation** and automated fusion
- **Predictive analytics** for threat forecasting
- **Automated intelligence sharing** and distribution

#### **4. Adaptive Zero-Trust**
- **Dynamic risk assessment** with real-time trust evaluation
- **Contextual access control** with adaptive policies
- **Continuous verification** and monitoring
- **Automated policy adaptation** based on behavior

#### **5. Advanced UEBA (User and Entity Behavior Analytics)**
- **Deep learning models** for complex behavioral pattern analysis
- **Predictive anomaly detection** before occurrence
- **Multi-entity correlation** with graph-based analysis
- **Dynamic baseline learning** with drift detection

#### **6. Intelligent Compliance**
- **AI-powered compliance monitoring** and automated assessment
- **Intelligent policy enforcement** with ML-driven risk scoring
- **Automated audit trail generation** and compliance reporting
- **Predictive compliance risk assessment** and remediation

#### **7. AI Threat Actor Profiling**
- **Comprehensive threat actor intelligence** with behavioral analysis
- **Predictive capability assessment** with ML models
- **Automated attribution confidence scoring**
- **ML-driven threat actor evolution prediction**

#### **8. Advanced Analytics & Intelligence**
- **Machine learning models** for threat classification and prediction
- **Real-time analytics** with comprehensive monitoring
- **Advanced behavioral analysis** and pattern recognition
- **Intelligent reporting** and visualization

---

## Features

### Quick Scan Features (Homepage)
### � Quick Scan Features (Homepage)
- **Quick GitHub Scan** - Instant repository security analysis
- **Quick LinkedIn Check** - Real-time recruiter profile analysis with advanced details
- **Quick Google Forms Scan** - Security analysis for form URLs with VirusTotal integration
- **Real-time Scoring** - Immediate risk assessment with color-coded results
- **Advanced LinkedIn Analysis** - Profile age, connections, email verification, message keywords
- **3-Column Layout** - Side-by-side scanning interface

### ��️ Enhanced Recruiter & Identity Scoring
- LinkedIn profile verification check with **advanced detail inputs**
- Email domain analysis (corporate vs. generic/free email)
- Profile age analysis (<3 months = high risk)
- Connections verification (senior recruiter <300 = suspicious)
- Message keyword detection ("technical assessment", "culture fit", etc.)
- Verification badge status check
- Cross-reference claimed company vs. email domain
- Identity confidence scoring (0–25 pts)

### 🏢 Employer Legitimacy Analysis
- Domain reputation via **VirusTotal API**
- Brand spoofing detection (e.g., `coinbase-jobs.xyz`)
- Suspicious TLD detection (`.xyz`, `.tk`, `.ml`, etc.)
- Shortlink URL detection (bit.ly, tinyurl, etc.)
- Domain age estimation
- **Google Forms security analysis** with phishing detection
- Employer legitimacy scoring (0–25 pts)

### 📋 Enhanced Process Risk Detection
- Detects artificial urgency signals
- Flags wallet/seed phrase/KYC requests
- Flags "run code locally" pressure
- **Suspicious keywords auto-detection** in recruiter messages
- Evaluates job description quality and specificity
- Process legitimacy scoring (0–25 pts)

### 🔬 Repository Security Scanner
- Scans `package.json` for **dangerous lifecycle scripts** (`postinstall`, `preinstall`, `prepare`, `prepack`)
- Detects **14 malicious code patterns**:
  - `eval()` execution
  - `child_process.exec()` calls
  - Environment variable exfiltration via `fetch`/`axios`
  - `JSON.stringify(process.env)` dumps
  - Private key access patterns (`PRIVATE_KEY`, `SEED`, `MNEMONIC`, `AWS_SECRET`)
  - `curl | bash` / `wget | bash` patterns
  - Dynamic `require()`, base64 decoding, obfuscated hex
- Repository age and stars/forks analysis
- Technical safety scoring (0–25 pts)

### 🎯 Simplified Assessment Flow (Single-Step Process)
- **Unified Form** - Complete assessment in one comprehensive interface
- **All Data Visible** - Recruiter info, job context, and technical artifacts on one page

### 🤖 AI-Powered Scam Detection (NEW)
- **LangChain Integration** - Advanced AI analysis with multi-chain support
- **Message Pattern Recognition** - Detects urgency language, off-platform requests, crypto payment mentions
- **Context-Aware Analysis** - Platform-aware scam detection
- **Multi-LLM Support** - LangChain + Groq for comprehensive coverage
- **Real-time Processing** - Instant AI-powered threat assessment
- **Confidence Scoring** - Sophisticated risk level calculation
- **LangSmith Monitoring** - Production-ready debugging and tracing

### 📊 LangChain Features
- **Security Analysis Chains** - Specialized workflows for threat detection
- **AI Agents** - Multi-tool security analysis agents
- **RAG System** - Retrieval-Augmented Generation with document context
- **Memory Management** - Conversation context and session preservation
- **Performance Monitoring** - Built-in benchmarking and optimization
- **Enterprise Tracing** - LangSmith integration for production monitoring

### 📊 LangChain Features
- **Security Analysis Chains** - Specialized workflows for threat detection
- **AI Agents** - Multi-tool security analysis agents
- **RAG System** - Retrieval-Augmented Generation with document context
- **Memory Management** - Conversation context and session preservation
- **Performance Monitoring** - Built-in benchmarking and optimization
- **Enterprise Tracing** - LangSmith integration for production monitoring
- **Real-time Analysis** - Instant AI-powered risk assessment with Groq integration
- **Instant Results** - Complete report generation without multi-step navigation
- **Enhanced UX** - Reduced friction and faster completion time

### � Shareable Reports (NEW)
- **Secure Share Links** - Generate unique tokens for assessment sharing
- **30-Day Expiration** - Automatic security lifecycle management
- **Privacy Controls** - Public/private sharing with granular settings
- **View Analytics** - Real-time engagement tracking and metrics
- **Professional UI** - Beautiful, mobile-responsive share pages
- **PDF Export** - Downloadable assessment reports for documentation
- **Rate Limiting** - 5 requests/minute abuse protection
- **Custom Messages** - Personalized sharing context for recipients

### � Scoring & Verdict Engine
| Score | Verdict | Meaning |
|-------|---------|------------------------------------------------------------|
| 80–100 | 🟢 LOW RISK | Safe to proceed with standard caution |
| 55–79 | 🟡 CAUTION | Request more verification before proceeding |
| 30–54 | 🟠 HIGH RISK | Strong indicators of suspicious activity |
| 0–29 | 🔴 CRITICAL | Clear red flags — stop interaction immediately |

### 📄 Incident Report Generator
- Auto-generates a structured incident report (copy or `.txt` download)
- Includes all flags, recommendations, and direct links to reporting platforms:
  - GitHub Abuse
  - LinkedIn Report
  - DNSC (Romania)
  - CISA (USA)
  - FBI IC3

### 🔗 Shareable Results
- Each assessment gets a unique share token
- Results are shareable via `/results/[id]` — useful for community warnings

### 📱 Mobile-First Design (NEW)
- **Touch Optimization**: 44px minimum touch targets (WCAG compliance)
- **Haptic Feedback**: Tactile confirmation on mobile interactions
- **Swipe Gestures**: 4-direction gesture detection for enhanced UX
- **Focus Management**: WCAG 2.1 AA compliant keyboard navigation
- **Responsive Design**: Optimized for all screen sizes
- **PWA Support**: Install prompts and offline detection

### 🔌 Advanced Features (NEW)
- **Turso SQLite Database**: Production-ready serverless database
- **Real-time Updates**: Custom event system for live data
- **Data Visualization**: Custom SVG charts (no external dependencies)
- **Accessibility**: Screen reader support and semantic HTML
- **Performance**: Edge-optimized with fast loading times

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS |
| Database | PostgreSQL/SQLite with Prisma ORM |
| Caching | Redis |
| Security APIs | VirusTotal API v3, OpenAI API, LangChain |
| AI/ML | Custom ML Models, Deep Learning, Transformers |
| Code Scanning | GitHub REST API |
| Authentication | JWT with Role-Based Access Control |
| Load Balancing | Custom Load Balancer with Multiple Algorithms |
| Real-time | WebSocket Integration |
| Sandboxes | Vercel Sandboxes |
| Monitoring | Prometheus, Grafana |
| Deployment | Vercel, Docker, Kubernetes |
| Mobile UX | Touch optimization, Haptic feedback |
| Accessibility | WCAG 2.1 AA compliance |

---

## 📁 Project Structure

```
trusthire/
├── app/
│   ├── page.tsx                    # Home — hero section and overview
│   ├── assess/
│   │   └── page.tsx                # Main security assessment tool
│   ├── results/
│   │   └── [id]/page.tsx           # Assessment results dashboard
│   ├── patterns/
│   │   └── page.tsx                # Scam patterns database
│   ├── sandbox/
│   │   └── page.tsx                # Vercel Sandboxes demo
│   ├── intelligence/
│   │   └── page.tsx                # Threat intelligence dashboard
│   ├── collaboration/
│   │   └── page.tsx                # Real-time collaboration
│   ├── monitoring/
│   │   └── page.tsx                # System monitoring dashboard
│   ├── privacy/
│   │   └── page.tsx                # Privacy policy page
│   ├── disclaimer/
│   │   └── page.tsx                # Terms and conditions
│   └── api/
│       ├── assessment/
│       │   ├── create/route.ts     # POST — runs full assessment
│       │   └── [id]/route.ts       # GET — fetch assessment by ID
│       ├── scan/
│       │   ├── repo/route.ts       # POST — scan GitHub repository
│       │   └── url/route.ts        # POST — scan URL via VirusTotal
│       ├── sandbox/
│       │   └── analyze/route.ts    # POST — sandbox analysis endpoint
│       ├── ai/
│       │   └── analyze/route.ts    # POST — AI-powered message analysis
│       ├── langchain/
│       │   └── analyze/route.ts    # POST — LangChain security analysis
│       ├── auth/
│       │   ├── login/route.ts       # POST — JWT authentication
│       │   ├── register/route.ts     # POST — User registration
│       │   └── refresh/route.ts     # POST — Token refresh
│       ├── analytics/
│       │   ├── threat-analysis/route.ts # POST — ML threat analysis
│       │   └── analytics/route.ts   # GET — Analytics data
│       ├── security/
│       │   └── rate-limit/route.ts  # GET/POST — Rate limiting
│       ├── load-balancer/
│       │   └── health/route.ts     # GET — Load balancer status
│       └── report/
│           └── route.ts            # POST — Generate incident report endpoint
├── components/
│   ├── ScoreGauge.tsx              # Animated half-circle score arc
│   ├── ScoreCard.tsx               # Per-category score card
│   ├── RedFlagItem.tsx             # Red flag / warning display
│   ├── EvidencePanel.tsx           # Tabbed evidence browser
│   ├── WorkflowAdvisor.tsx         # Prioritized action steps
│   ├── RepoScanReport.tsx          # Repository scan results
│   ├── VirusTotalPanel.tsx         # VirusTotal scan results
│   ├── IncidentReportGenerator.tsx # Report copy/download + reporting links
│   ├── ThreatIntelligencePanel.tsx # Threat intelligence interface
│   ├── RealTimeCollaborationPanel.tsx # Collaboration interface
│   └── ThemeToggle.tsx             # Dark/light mode toggle
├── lib/
│   ├── scoring.ts                  # Score calculation + red flag generation
│   ├── repoScanner.ts              # GitHub repo scanner (14 patterns)
│   ├── virustotal.ts               # VirusTotal API v3 integration
│   ├── domainChecker.ts            # Domain safety checks
│   ├── reportGenerator.ts          # Incident report text generator
│   ├── auth/
│   │   ├── authentication-service.ts # JWT authentication service
│   │   └── auth-middleware.ts     # Security middleware
│   ├── security/
│   │   ├── rate-limiter.ts        # Advanced rate limiting
│   │   └── security-middleware.ts # Security middleware
│   ├── load-balancer/
│   │   ├── cluster-manager.ts     # Load balancing cluster
│   │   └── load-balancer-middleware.ts # Load balancer middleware
│   ├── advanced-analytics/
│   │   └── advanced-ueba-service.ts # UEBA and analytics
│   ├── adaptive-zero-trust/
│   │   └── adaptive-zero-trust-service.ts # Zero-trust security
│   ├── api/threat-intelligence/
│   │   ├── misp-client.ts        # MISP integration
│   │   ├── virustotal-client.ts   # VirusTotal client
│   │   ├── phishtank-client.ts   # PhishTank client
│   │   └── aggregator.ts        # Threat intelligence aggregator
│   ├── database/
│   │   └── threat-intelligence-service.ts # Database persistence
│   ├── websocket/
│   │   ├── realtime-client.ts     # WebSocket client
│   │   └── realtime-server.ts     # WebSocket server
│   ├── db.ts / prisma.ts           # Database client
│   └── utils.ts                    # Rate limiting, helpers
├── types/
│   └── index.ts                    # All TypeScript interfaces
├── docs/
│   ├── README.md                   # Documentation overview
│   ├── api/README.md              # API documentation
│   ├── phase6/README.md           # Phase 6 AI services
│   ├── deployment/README.md        # Deployment guide
│   ├── faq.md                     # Frequently asked questions
│   └── troubleshooting.md         # Troubleshooting guide
├── public/
│   ├── favicon.ico                 # Browser tab icon
│   ├── robots.txt                  # SEO instructions
│   ├── manifest.json              # PWA manifest
│   └── sitemap.xml                # SEO sitemap
├── prisma/
│   └── schema.prisma               # Complete database schema
├── hooks/
│   └── useWebSocket.ts            # React WebSocket hook
└── .env.example                    # Environment variables template
```

---

## ð Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ or SQLite 3.0+
- Redis 6.0+ (optional, for caching)
- OpenAI API key (for AI services)
- VirusTotal API key (free at [virustotal.com/gui/join-us](https://www.virustotal.com/gui/join-us))
- Vercel account (for deployment)
- Docker (for containerized deployment)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gzeu/trusthire.git
   cd trusthire
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/trusthire"
   # Or for SQLite
   # DATABASE_URL="file:./dev.db"
   
   # Redis (optional)
   REDIS_URL="redis://localhost:6379"
   
   # Security APIs
   VIRUSTOTAL_API_KEY="your_vt_api_key_here"
   OPENAI_API_KEY="your_openai_api_key_here"
   
   # Authentication
   JWT_SECRET="your-super-secret-jwt-key"
   
   # Application
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Setup database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

### **Phase 6 Services**
After starting the application, you'll have access to:
- **8 AI-Powered Security Services** in the dashboard
- **Real-time Threat Intelligence** with live feeds
- **Advanced Analytics** with ML-powered insights
- **Collaboration Tools** for team security operations
- **Comprehensive Monitoring** with system health checks

### Production Deployment

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Configure environment variables**
4. **Deploy automatically**

**Live Demo**: https://trusthire-git-main-gzeus-projects.vercel.app

Open [http://localhost:3000](http://localhost:3000).

---

## 📚 Documentation

### **Comprehensive Documentation**
- **[Main Documentation](./docs/README.md)** - Complete documentation overview
- **[API Documentation](./docs/api/README.md)** - 30 API endpoints with examples
- **[Phase 6 AI Services](./docs/phase6/README.md)** - Detailed AI services documentation
- **[Deployment Guide](./docs/deployment/README.md)** - Complete deployment instructions
- **[FAQ](./docs/faq.md)** - 100+ frequently asked questions
- **[Troubleshooting](./docs/troubleshooting.md)** - Detailed troubleshooting guide

### **Quick Links**
- **[Project Structure](./PROJECT_STRUCTURE_UPDATED.md)** - Updated project structure
- **[Getting Started](./docs/README.md#getting-started)** - Quick start guide
- **[API Reference](./docs/api/README.md#api-endpoints)** - All API endpoints
- **[Phase 6 Services](./docs/phase6/README.md#ai-services)** - AI services overview
- **[Deployment Options](./docs/deployment/README.md#deployment-options)** - Deployment methods

---

## 🚀 Production Features

### **Enterprise-Ready Capabilities**
- **✅ 8 AI-Powered Security Services** - Complete security automation
- **✅ Real-time Threat Intelligence** - Live threat feeds from multiple sources
- **✅ Advanced Analytics** - ML-powered insights and predictions
- **✅ Authentication & Authorization** - JWT-based security with RBAC
- **✅ Load Balancing** - High availability with automatic failover
- **✅ Rate Limiting** - Advanced security with multiple algorithms
- **✅ WebSocket Integration** - Real-time communication
- **✅ Comprehensive Monitoring** - System health and performance metrics
- **✅ Database Persistence** - Scalable data storage with caching
- **✅ API Integration** - MISP, VirusTotal, PhishTank integration
- **✅ Collaboration Tools** - Real-time team collaboration
- **✅ PWA Support** - Progressive Web App capabilities
- **✅ SEO Optimized** - Complete sitemap and meta tags

### **Security Features**
- **🔒 JWT Authentication** - Secure token-based authentication
- **🛡️ Role-Based Access Control** - Granular permissions
- **🚦 Advanced Rate Limiting** - Multiple algorithms with burst protection
- **🔐 SSL/TLS Enforcement** - Secure communication
- **📊 Security Monitoring** - Real-time security metrics
- **🚨 Alert System** - Automated threat notifications
- **🔍 Pattern Detection** - Advanced suspicious pattern recognition

### **Performance & Scalability**
- **⚡ High Performance** - Optimized for enterprise scale
- **🔄 Auto-scaling** - Dynamic resource allocation
- **💾 Intelligent Caching** - Multi-level caching strategy
- **📈 Load Balancing** - 5 different algorithms
- **🗄️ Database Optimization** - Indexed queries and connection pooling
- **📊 Performance Monitoring** - Real-time metrics and alerting

---

## 🔌 API Reference

### `POST /api/assessment/create`

Runs a full security assessment.

**Request body:**
```json
{
  "recruiter": {
    "name": "John Doe",
    "claimedCompany": "Coinbase",
    "linkedinUrl": "https://linkedin.com/in/...",
    "emailReceived": "john@coinbase-jobs.xyz",
    "recruiterMessages": "Hi, we have an urgent role..."
  },
  "job": {
    "jobDescription": "Senior Solidity Developer...",
    "salaryMentioned": true,
    "urgencySignals": true,
    "walletSeedKycRequest": false,
    "runCodeLocally": true
  },
  "artifacts": [
    { "type": "github", "url": "https://github.com/user/repo" },
    { "type": "url", "url": "https://coinbase-jobs.xyz" }
  ]
}
```

**Response:** Full `AssessmentResult` object with score, verdict, red flags, and scan results.

### `GET /api/assessment/[id]`

Fetch a stored assessment by ID.

### `POST /api/scan/repo`

Scan a single GitHub repository.
```json
{ "url": "https://github.com/user/repo" }
```

### `POST /api/scan/url`

Scan a URL via VirusTotal.
```json
{ "url": "https://suspicious-domain.xyz" }
```

```json
{
  "type": "repository|url|code",
  "data": {
    "repoUrl": "https://github.com/user/repo",
    "url": "https://example.com",
    "code": "console.log('test');",
    "language": "node"
  }
}
```

### `POST /api/ai/analyze`

AI-powered recruiter message analysis for advanced scam detection.

```json
{
  "recruiterMessages": ["Hi, we have an urgent role...", "Apply now with your resume..."],
  "context": {
    "type": "recruiter_messages",
    "platform": "assessment"
  }
}
```

### `POST /api/langchain/analyze`

Advanced LangChain security analysis with multi-chain support.

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

---

## ð¡ Vercel Sandboxes Integration

### What are Sandboxes?

Vercel Sandboxes provide isolated Linux environments for secure code execution. Perfect for:
- **Repository Analysis**: Clone and scan repos safely
- **Code Testing**: Execute suspicious code in isolation
- **URL Verification**: Test domains without risk
- **Pattern Detection**: Analyze code patterns securely

### Setup Instructions

1. **Install Sandbox CLI**
   ```bash
   npm i -g sandbox
   sandbox login
   ```

2. **Create Sandbox**
   ```bash
   sandbox create --timeout 15m
   ```

3. **Execute Commands**
   ```bash
   sandbox exec sb_abc123 "git clone https://github.com/user/repo.git"
   sandbox exec sb_abc123 "node analyze-repo.js"
   ```

### Demo Implementation

The `/sandbox` page provides a complete demo of sandbox capabilities:
- **Repository Analysis**: Safe GitHub repo scanning
- **URL Testing**: Domain safety verification
- **Code Execution**: Pattern detection in isolation

---

## 🗃️ Data Models

### `Assessment`
Stores each completed assessment with all scores, flags, and scan data.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | CUID identifier |
| `sessionId` | String | Anonymous session ID |
| `recruiterName` | String | Target recruiter name |
| `company` | String | Claimed company |
| `finalScore` | Int | 0–100 trust score |
| `verdict` | String | `low_risk` / `caution` / `high_risk` / `critical` |
| `inputData` | JSON | Original assessment input |
| `scoreData` | JSON | Per-category score breakdown |
| `redFlags` | JSON | All detected red flags |
| `vtResults` | JSON | VirusTotal scan results |
| `repoScans` | JSON | Repository scan results |
| `shareToken` | String | Unique share token |

### `ScamPattern`
Community-reported scam patterns.

---

## 🔍 How the Scanner Works

### Repository Scanner
1. Fetches repo metadata from GitHub API (age, stars, forks)
2. Downloads and parses `package.json` — checks all `scripts` keys against a blocklist of dangerous lifecycle hooks
3. Fetches common entry-point files (`index.js`, `src/index.ts`, `server.js`, `postinstall.js`, etc.)
4. Runs 14 regex patterns against each file to detect malicious constructs
5. Aggregates to a risk level: `safe` / `warning` / `critical`

### Domain Checker
1. Normalizes URL to domain
2. Checks against suspicious TLD list
3. Checks for brand keyword spoofing (crypto exchanges, wallets, DeFi protocols)
4. Detects shortlinks
5. Queries VirusTotal domain endpoint for reputation + malicious vendor count
6. Estimates domain age from VT creation date

---

## 🔐 Security & Privacy

- **No authentication required** — assessments are stored with an anonymous session ID
- **Shareable by token only** — results are not publicly listed
- **No PII stored** — only recruiter names/companies and scan results
- **Rate limiting** — built-in in-memory rate limiting on assessment creation
- **GitHub API** — used read-only to fetch public repo contents. No writes.

---

## 🤝 Contributing

Contributions welcome — especially:
- New malicious code patterns (`lib/repoScanner.ts`)
- New brand spoofing keywords (`lib/domainChecker.ts`)
- Community scam pattern reports via `/api/patterns`
- UI improvements and translations

```bash
# Fork → branch → PR
git checkout -b feat/new-pattern
# Make changes
git commit -m "feat: add new exfiltration pattern"
git push origin feat/new-pattern
```

---

## 📜 License

### For Developers
- **Prevention**: Detect scams before victimization
- **Education**: Learn about common attack vectors
- **Evidence**: Generate reports for authorities
- **Community**: Share warnings with others

### For Organizations
- **Security**: Protect development teams
- **Compliance**: Security due diligence tools
- **Training**: Educational resources
- **Threat Intel**: Community-driven database

### Real-World Impact
- **Credential Protection**: Prevent .env and key theft
- **Financial Security**: Avoid wallet and fund loss
- **Reputation Protection**: Prevent compromised systems
- **Community Safety**: Share threat intelligence

---

## ð¡ Production Features

### Live Application
- **URL**: https://trusthire-five.vercel.app
- **Status**: Production ready with all features
- **Pages**: 7 complete pages with full functionality
- **APIs**: 7 endpoints for comprehensive analysis

### All Pages Available
- **Homepage** (`/`) - Hero section and overview
- **Assessment Tool** (`/assess`) - Main security assessment
- **Results Dashboard** (`/results/[id]`) - Detailed reports
- **Threat Database** (`/patterns`) - Scam patterns library
- **Sandbox Demo** (`/sandbox`) - Vercel Sandboxes showcase
- **Privacy Policy** (`/privacy`) - Data protection
- **Disclaimer** (`/disclaimer`) - Legal terms

---

## ð Support & Community

### Getting Help
- **Documentation**: Complete guides and examples
- **GitHub Issues**: Bug reports and feature requests
- **Community**: Contribute patterns and improvements
- **Security**: Report security issues privately

### Contact
- **GitHub**: https://github.com/Gzeu/trusthire
- **Live Demo**: https://trusthire-five.vercel.app
- **Issues**: https://github.com/Gzeu/trusthire/issues

---

## ð License

MIT License - see [LICENSE](./LICENSE) for details.

---

<p align="center">
  <strong>TrustHire - Protecting developers from recruitment scams</strong>
</p>

<p align="center">
  <a href="https://trusthire-five.vercel.app">Live Demo</a> ·
  <a href="https://github.com/Gzeu/trusthire">GitHub</a> ·
  <a href="https://vercel.com/docs/concepts/functions/serverless-functions">Vercel Functions</a> ·
  <a href="https://vercel.com/docs/vercel-sandbox">Vercel Sandboxes</a>
</p>

<p align="center">
  Built with <a href="https://nextjs.org/">Next.js</a>, <a href="https://www.turso.tech/">Turso</a>, and <a href="https://vercel.com/">Vercel</a>
</p>

<p align="center">
  If this helped you avoid a scam, consider <a href="https://github.com/Gzeu/trusthire">starring the repo</a> or contributing to the community database.
</p>

---
*Last updated: April 20, 2026*
