# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: data-system.spec.ts >> TrustHire Data System - Real Data Testing >> homepage loads and shows data system features
- Location: tests\data-system.spec.ts:8:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('body')
Expected substring: "Data"
Received string:    "TrustHireQuick ToolsDashboardPatternsSandboxMonitoringAI AgentStart AssessmentLIVE PROTECTIONStop RecruitmentScam AttacksWeb3's most advanced security tool for detecting fake recruiters, malicious repositories, and job scams before they compromise your development environment.Start Free AssessmentHow It Works0Assessments Run0Threats Blocked0Active Users2.3sAvg ResponseHow Recruitment Scams WorkUnderstanding the attack flow is your first line of defenseLinkedIn DMJob Discussion\"Technical Review\" Reponpm installPostinstall Script.env ExfiltratedCritical RiskOne malicious npm install can compromise your entire development environment, exposing API keys, wallet credentials, and sensitive data.Security Tools at Your FingertipsProfessional-grade security analysis, designed for developersGitHub Repository ScanInstant analysis of any repository for malicious code patterns2.3s avgTry NowLinkedIn Profile CheckVerify recruiter authenticity and detect fake profiles15+ signalsTry NowReverse Image SearchCheck profile photos against known fakes and stock images100M+ imagesTry NowFull AssessmentComprehensive security evaluation for complete peace of mind5min totalTry NowAI AgentAutonomous security agent with personality and learning capabilitiesAlways learningTry NowWhy Developers Trust TrustHireBuilt by security experts, for the Web3 ecosystemStatic Analysis OnlyWe never execute code from analyzed repositories. All scans are completely safe.Zero risk to your systemLightning FastGet comprehensive security assessments in under 2 minutes, not hours.Save time, stay secureRisk ScoringClear, actionable risk scores with detailed explanations and recommendations.Make informed decisionsCommunity PoweredLeverage collective intelligence from thousands of security assessments.Stronger protection togetherGot a Repo Link from a Recruiter?Run a comprehensive security assessment in under 2 minutes before you clone anything. It could save your entire development environment.Run Free AssessmentView DashboardTrustHire provides risk signals, not legal verdicts. See disclaimer for details.ToolsHomePatternsSandboxMonitorMoreQuick ToolsGitHubQuick ScanLinkedInQuick ScanImageQuick ScanFormsQuick Scan"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('body')
    8 × locator resolved to <body class="__className_f367f3 antialiased">…</body>
      - unexpected value "TrustHireQuick ToolsDashboardPatternsSandboxMonitoringAI AgentStart AssessmentLIVE PROTECTIONStop RecruitmentScam AttacksWeb3's most advanced security tool for detecting fake recruiters, malicious repositories, and job scams before they compromise your development environment.Start Free AssessmentHow It Works0Assessments Run0Threats Blocked0Active Users2.3sAvg ResponseHow Recruitment Scams WorkUnderstanding the attack flow is your first line of defenseLinkedIn DMJob Discussion"Technical Review" Reponpm installPostinstall Script.env ExfiltratedCritical RiskOne malicious npm install can compromise your entire development environment, exposing API keys, wallet credentials, and sensitive data.Security Tools at Your FingertipsProfessional-grade security analysis, designed for developersGitHub Repository ScanInstant analysis of any repository for malicious code patterns2.3s avgTry NowLinkedIn Profile CheckVerify recruiter authenticity and detect fake profiles15+ signalsTry NowReverse Image SearchCheck profile photos against known fakes and stock images100M+ imagesTry NowFull AssessmentComprehensive security evaluation for complete peace of mind5min totalTry NowAI AgentAutonomous security agent with personality and learning capabilitiesAlways learningTry NowWhy Developers Trust TrustHireBuilt by security experts, for the Web3 ecosystemStatic Analysis OnlyWe never execute code from analyzed repositories. All scans are completely safe.Zero risk to your systemLightning FastGet comprehensive security assessments in under 2 minutes, not hours.Save time, stay secureRisk ScoringClear, actionable risk scores with detailed explanations and recommendations.Make informed decisionsCommunity PoweredLeverage collective intelligence from thousands of security assessments.Stronger protection togetherGot a Repo Link from a Recruiter?Run a comprehensive security assessment in under 2 minutes before you clone anything. It could save your entire development environment.Run Free AssessmentView DashboardTrustHire provides risk signals, not legal verdicts. See disclaimer for details.ToolsHomePatternsSandboxMonitorMoreQuick ToolsGitHubQuick ScanLinkedInQuick ScanImageQuick ScanFormsQuick Scan"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e4]:
      - link "TrustHire" [ref=e5] [cursor=pointer]:
        - /url: /
        - img [ref=e7]
        - generic [ref=e9]: TrustHire
      - generic [ref=e10]:
        - button "Quick Tools" [ref=e12] [cursor=pointer]:
          - img [ref=e13]
          - generic [ref=e15]: Quick Tools
          - img [ref=e16]
        - link "Dashboard" [ref=e18] [cursor=pointer]:
          - /url: /dashboard
          - img [ref=e19]
          - generic [ref=e24]: Dashboard
        - link "Patterns" [ref=e25] [cursor=pointer]:
          - /url: /patterns
          - img [ref=e26]
          - generic [ref=e30]: Patterns
        - link "Sandbox" [ref=e31] [cursor=pointer]:
          - /url: /sandbox
          - img [ref=e32]
          - generic [ref=e36]: Sandbox
        - link "Monitoring" [ref=e37] [cursor=pointer]:
          - /url: /monitoring
          - img [ref=e38]
          - generic [ref=e40]: Monitoring
        - link "AI Agent" [ref=e41] [cursor=pointer]:
          - /url: /agent
          - img [ref=e42]
          - generic [ref=e52]: AI Agent
        - link "Start Assessment" [ref=e53] [cursor=pointer]:
          - /url: /assess
          - img [ref=e54]
          - generic [ref=e58]: Start Assessment
  - generic [ref=e59]:
    - generic [ref=e62]:
      - generic [ref=e63]:
        - img [ref=e64]
        - generic [ref=e66]: LIVE PROTECTION
      - heading "Stop Recruitment Scam Attacks" [level=1] [ref=e67]:
        - text: Stop Recruitment
        - generic [ref=e68]: Scam Attacks
      - paragraph [ref=e69]: Web3's most advanced security tool for detecting fake recruiters, malicious repositories, and job scams before they compromise your development environment.
      - generic [ref=e70]:
        - link "Start Free Assessment" [ref=e71] [cursor=pointer]:
          - /url: /assess
          - img [ref=e72]
          - text: Start Free Assessment
          - img [ref=e74]
        - button "How It Works" [ref=e76] [cursor=pointer]:
          - img [ref=e77]
          - text: How It Works
      - generic [ref=e80]:
        - generic [ref=e81]:
          - generic [ref=e82]: "0"
          - generic [ref=e83]: Assessments Run
        - generic [ref=e84]:
          - generic [ref=e85]: "0"
          - generic [ref=e86]: Threats Blocked
        - generic [ref=e87]:
          - generic [ref=e88]: "0"
          - generic [ref=e89]: Active Users
        - generic [ref=e90]:
          - generic [ref=e91]: 2.3s
          - generic [ref=e92]: Avg Response
    - generic [ref=e95]:
      - generic [ref=e96]:
        - heading "How Recruitment Scams Work" [level=2] [ref=e97]
        - paragraph [ref=e98]: Understanding the attack flow is your first line of defense
      - generic [ref=e99]:
        - generic [ref=e100]:
          - generic [ref=e101]: LinkedIn DM
          - img [ref=e102]
        - generic [ref=e104]:
          - generic [ref=e105]: Job Discussion
          - img [ref=e106]
        - generic [ref=e108]:
          - generic [ref=e109]: "\"Technical Review\" Repo"
          - img [ref=e110]
        - generic [ref=e112]:
          - generic [ref=e113]: npm install
          - img [ref=e114]
        - generic [ref=e116]:
          - generic [ref=e117]: Postinstall Script
          - img [ref=e118]
        - generic [ref=e121]: .env Exfiltrated
      - generic [ref=e122]:
        - generic [ref=e123]:
          - img [ref=e124]
          - text: Critical Risk
        - paragraph [ref=e128]: One malicious npm install can compromise your entire development environment, exposing API keys, wallet credentials, and sensitive data.
    - generic [ref=e130]:
      - generic [ref=e131]:
        - heading "Security Tools at Your Fingertips" [level=2] [ref=e132]
        - paragraph [ref=e133]: Professional-grade security analysis, designed for developers
      - generic [ref=e134]:
        - generic [ref=e136]:
          - img [ref=e138]
          - generic [ref=e141]:
            - heading "GitHub Repository Scan" [level=3] [ref=e142]
            - paragraph [ref=e143]: Instant analysis of any repository for malicious code patterns
            - generic [ref=e144]:
              - generic [ref=e145]: 2.3s avg
              - link "Try Now" [ref=e146] [cursor=pointer]:
                - /url: /scan/github
                - text: Try Now
                - img [ref=e147]
        - generic [ref=e150]:
          - img [ref=e152]
          - generic [ref=e157]:
            - heading "LinkedIn Profile Check" [level=3] [ref=e158]
            - paragraph [ref=e159]: Verify recruiter authenticity and detect fake profiles
            - generic [ref=e160]:
              - generic [ref=e161]: 15+ signals
              - link "Try Now" [ref=e162] [cursor=pointer]:
                - /url: /scan/linkedin
                - text: Try Now
                - img [ref=e163]
        - generic [ref=e166]:
          - img [ref=e168]
          - generic [ref=e171]:
            - heading "Reverse Image Search" [level=3] [ref=e172]
            - paragraph [ref=e173]: Check profile photos against known fakes and stock images
            - generic [ref=e174]:
              - generic [ref=e175]: 100M+ images
              - link "Try Now" [ref=e176] [cursor=pointer]:
                - /url: /scan/image
                - text: Try Now
                - img [ref=e177]
        - generic [ref=e180]:
          - img [ref=e182]
          - generic [ref=e184]:
            - heading "Full Assessment" [level=3] [ref=e185]
            - paragraph [ref=e186]: Comprehensive security evaluation for complete peace of mind
            - generic [ref=e187]:
              - generic [ref=e188]: 5min total
              - link "Try Now" [ref=e189] [cursor=pointer]:
                - /url: /assess
                - text: Try Now
                - img [ref=e190]
        - generic [ref=e193]:
          - img [ref=e195]
          - generic [ref=e205]:
            - heading "AI Agent" [level=3] [ref=e206]
            - paragraph [ref=e207]: Autonomous security agent with personality and learning capabilities
            - generic [ref=e208]:
              - generic [ref=e209]: Always learning
              - link "Try Now" [ref=e210] [cursor=pointer]:
                - /url: /agent
                - text: Try Now
                - img [ref=e211]
    - generic [ref=e214]:
      - generic [ref=e215]:
        - heading "Why Developers Trust TrustHire" [level=2] [ref=e216]
        - paragraph [ref=e217]: Built by security experts, for the Web3 ecosystem
      - generic [ref=e218]:
        - generic [ref=e219]:
          - img [ref=e221]
          - generic [ref=e224]:
            - heading "Static Analysis Only" [level=3] [ref=e225]
            - paragraph [ref=e226]: We never execute code from analyzed repositories. All scans are completely safe.
            - generic [ref=e227]: Zero risk to your system
        - generic [ref=e228]:
          - img [ref=e230]
          - generic [ref=e232]:
            - heading "Lightning Fast" [level=3] [ref=e233]
            - paragraph [ref=e234]: Get comprehensive security assessments in under 2 minutes, not hours.
            - generic [ref=e235]: Save time, stay secure
        - generic [ref=e236]:
          - img [ref=e238]
          - generic [ref=e243]:
            - heading "Risk Scoring" [level=3] [ref=e244]
            - paragraph [ref=e245]: Clear, actionable risk scores with detailed explanations and recommendations.
            - generic [ref=e246]: Make informed decisions
        - generic [ref=e247]:
          - img [ref=e249]
          - generic [ref=e254]:
            - heading "Community Powered" [level=3] [ref=e255]
            - paragraph [ref=e256]: Leverage collective intelligence from thousands of security assessments.
            - generic [ref=e257]: Stronger protection together
    - generic [ref=e260]:
      - heading "Got a Repo Link from a Recruiter?" [level=2] [ref=e261]
      - paragraph [ref=e262]: Run a comprehensive security assessment in under 2 minutes before you clone anything. It could save your entire development environment.
      - generic [ref=e263]:
        - link "Run Free Assessment" [ref=e264] [cursor=pointer]:
          - /url: /assess
          - img [ref=e265]
          - text: Run Free Assessment
          - img [ref=e267]
        - link "View Dashboard" [ref=e269] [cursor=pointer]:
          - /url: /dashboard
          - img [ref=e270]
          - text: View Dashboard
      - paragraph [ref=e275]: TrustHire provides risk signals, not legal verdicts. See disclaimer for details.
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('TrustHire Data System - Real Data Testing', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('http://localhost:3000');
  6   |   });
  7   | 
  8   |   test('homepage loads and shows data system features', async ({ page }) => {
  9   |     await expect(page).toHaveTitle(/TrustHire/);
  10  |     
  11  |     // Check for data system elements
  12  |     await expect(page.locator('h1')).toBeVisible();
  13  |     
  14  |     // Look for data collection features
  15  |     const content = page.locator('body');
> 16  |     await expect(content).toContainText('Data');
      |                           ^ Error: expect(locator).toContainText(expected) failed
  17  |   });
  18  | 
  19  |   test('data collection API works with real data', async ({ page }) => {
  20  |     // Test data collection endpoint
  21  |     const response = await page.request.post('http://localhost:3000/api/data/collect', {
  22  |       headers: { 'Content-Type': 'application/json' },
  23  |       data: {
  24  |         type: 'recruitment',
  25  |         data: {
  26  |           companyName: 'TechCorp Solutions',
  27  |           position: 'Senior Full Stack Developer',
  28  |           location: 'Bucharest, Romania',
  29  |           contactEmail: 'careers@techcorp.ro',
  30  |           contactPhone: '+40-21-555-1234',
  31  |           website: 'https://techcorp.ro',
  32  |           requirements: ['5+ years experience', 'React/Node.js expertise'],
  33  |           postedDate: '2024-01-20',
  34  |           deadline: '2024-02-20',
  35  |           status: 'active',
  36  |           source: 'company_website',
  37  |           confidence: 0.95,
  38  |           notes: 'Urgent position for growing team'
  39  |         }
  40  |       }
  41  |     });
  42  | 
  43  |     expect(response.status()).toBe(200);
  44  |     const result = await response.json();
  45  |     expect(result.success).toBe(true);
  46  |     expect(result.type).toBe('recruitment');
  47  |     expect(result.id).toMatch(/^rec_\d+_[a-z0-9]+$/);
  48  |   });
  49  | 
  50  |   test('data validation API works correctly', async ({ page }) => {
  51  |     // Test data validation endpoint
  52  |     const response = await page.request.post('http://localhost:3000/api/data/validate', {
  53  |       headers: { 'Content-Type': 'application/json' },
  54  |       data: {
  55  |         action: 'validate',
  56  |         type: 'recruitment',
  57  |         data: {
  58  |           companyName: 'Test Company',
  59  |           position: 'Software Developer',
  60  |           location: 'Bucharest, Romania',
  61  |           contactEmail: 'test@company.com',
  62  |           contactPhone: '+40-21-123-4567',
  63  |           website: 'https://test.com',
  64  |           requirements: ['JavaScript experience'],
  65  |           postedDate: '2024-01-20',
  66  |           deadline: '2024-02-20',
  67  |           status: 'active',
  68  |           source: 'company_website'
  69  |         }
  70  |       }
  71  |     });
  72  | 
  73  |     expect(response.status()).toBe(200);
  74  |     const result = await response.json();
  75  |     expect(result.success).toBe(true);
  76  |     expect(result.action).toBe('validate');
  77  |     expect(result.type).toBe('recruitment');
  78  |     expect(result.result).toHaveProperty('isValid');
  79  |     expect(result.result).toHaveProperty('qualityScore');
  80  |     expect(result.result).toHaveProperty('confidence');
  81  |   });
  82  | 
  83  |   test('analytics API provides insights', async ({ page }) => {
  84  |     // First, add some data
  85  |     await page.request.post('http://localhost:3000/api/data/collect', {
  86  |       headers: { 'Content-Type': 'application/json' },
  87  |       data: {
  88  |         type: 'recruitment',
  89  |         data: {
  90  |           companyName: 'Analytics Test Corp',
  91  |           position: 'Data Analyst',
  92  |           location: 'Cluj-Napoca, Romania',
  93  |           contactEmail: 'jobs@analytics-test.ro',
  94  |           contactPhone: '+40-264-123-456',
  95  |           website: 'https://analytics-test.ro',
  96  |           requirements: ['SQL experience', 'Python knowledge'],
  97  |           postedDate: '2024-01-20',
  98  |           deadline: '2024-02-20',
  99  |           status: 'active',
  100 |           source: 'company_website',
  101 |           confidence: 0.88
  102 |         }
  103 |       }
  104 |     });
  105 | 
  106 |     // Test analytics endpoint
  107 |     const response = await page.request.post('http://localhost:3000/api/data/analytics', {
  108 |       headers: { 'Content-Type': 'application/json' },
  109 |       data: {
  110 |         type: 'overview',
  111 |         filters: {
  112 |           type: 'recruitment',
  113 |           startDate: '2024-01-01',
  114 |           endDate: '2024-12-31'
  115 |         }
  116 |       }
```