<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/VirusTotal-API-394EFF?style=flat-square" alt="VirusTotal" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="MIT License" />
</p>

<h1 align="center">🔐 TrustHire</h1>

<p align="center">
  <b>Security due diligence tool for developers.</b><br/>
  Evaluate recruiter credibility, detect hiring scams, and scan repos for malicious patterns<br/>
  before you clone or run anything.
</p>

<p align="center">
  Built for <strong>blockchain/Web3 developers</strong> — the primary targets of fake recruiter attacks.
</p>

---

## 🎯 What is TrustHire?

TrustHire is a **risk assessment platform** that helps developers verify the legitimacy of recruiters and job offers before engaging further or running any provided code.

Fake recruiting attacks are increasingly targeting Web3/blockchain developers. The typical attack vector:
1. A "recruiter" reaches out via LinkedIn/Telegram with a high-paying remote role
2. They share a GitHub repository as a "technical assessment"
3. The repo contains a `postinstall` script that silently executes when you run `npm install`
4. Your environment variables, wallet keys, and SSH keys are exfiltrated

TrustHire automates the detection of these patterns before you become a victim.

---

## ✨ Features

### 🕵️ Recruiter & Identity Scoring
- LinkedIn profile verification check
- Email domain analysis (corporate vs. generic/free email)
- Cross-reference claimed company vs. email domain
- Identity confidence scoring (0–25 pts)

### 🏢 Employer Legitimacy Analysis
- Domain reputation via **VirusTotal API**
- Brand spoofing detection (e.g., `coinbase-jobs.xyz`)
- Suspicious TLD detection (`.xyz`, `.tk`, `.ml`, etc.)
- Shortlink URL detection (bit.ly, tinyurl, etc.)
- Domain age estimation
- Employer legitimacy scoring (0–25 pts)

### 📋 Process Risk Detection
- Detects artificial urgency signals
- Flags wallet/seed phrase/KYC requests
- Flags "run code locally" pressure
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

### 📊 Scoring & Verdict Engine
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

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via Prisma ORM |
| Security APIs | VirusTotal API v3 |
| Code Scanning | GitHub REST API |
| Hosting | Vercel (recommended) |

---

## 📁 Project Structure

```
trusthire/
├── app/
│   ├── page.tsx                    # Home — assessment input form
│   ├── assess/
│   │   └── page.tsx                # Assess page — processing & progress
│   ├── results/
│   │   └── [id]/page.tsx           # Full results dashboard
│   └── api/
│       ├── assessment/
│       │   ├── create/route.ts     # POST — runs full assessment
│       │   └── [id]/route.ts       # GET — fetch assessment by ID
│       ├── scan/
│       │   ├── repo/route.ts       # POST — scan GitHub repository
│       │   └── url/route.ts        # POST — scan URL via VirusTotal
│       └── patterns/route.ts       # GET — known scam patterns DB
├── components/
│   ├── ScoreGauge.tsx              # Animated half-circle score arc
│   ├── ScoreCard.tsx               # Per-category score card
│   ├── RedFlagItem.tsx             # Red flag / warning display
│   ├── EvidencePanel.tsx           # Tabbed evidence browser
│   ├── WorkflowAdvisor.tsx         # Prioritized action steps
│   ├── RepoScanReport.tsx          # Repository scan results
│   ├── VirusTotalPanel.tsx         # VirusTotal scan results
│   ├── IncidentReportGenerator.tsx # Report copy/download + reporting links
│   └── ThemeToggle.tsx             # Dark/light mode toggle
├── lib/
│   ├── scoring.ts                  # Score calculation + red flag generation
│   ├── repoScanner.ts              # GitHub repo scanner (14 patterns)
│   ├── virustotal.ts               # VirusTotal API v3 integration
│   ├── domainChecker.ts            # Domain safety checks
│   ├── reportGenerator.ts          # Incident report text generator
│   ├── db.ts / prisma.ts           # Database client
│   └── utils.ts                    # Rate limiting, helpers
├── types/
│   └── index.ts                    # All TypeScript interfaces
├── prisma/
│   └── schema.prisma               # Assessment + ScamPattern models
└── .env.example                    # Environment variables template
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- VirusTotal API key (free at [virustotal.com/gui/join-us](https://www.virustotal.com/gui/join-us))

### 1. Clone & Install

```bash
git clone https://github.com/Gzeu/trusthire.git
cd trusthire
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/trusthire"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Required for URL scanning
VIRUSTOTAL_API_KEY="your_vt_api_key_here"

# Optional — increases GitHub API rate limit from 60 to 5000 req/hr
GITHUB_TOKEN="ghp_your_token_here"
```

### 3. Set Up Database

```bash
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

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

### `GET /api/patterns`

Returns known scam patterns from the community database.

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

MIT — see [LICENSE](./LICENSE).

---

<p align="center">
  Built by <a href="https://github.com/Gzeu">@Gzeu</a> · If this helped you avoid a scam, ⭐ the repo
</p>
