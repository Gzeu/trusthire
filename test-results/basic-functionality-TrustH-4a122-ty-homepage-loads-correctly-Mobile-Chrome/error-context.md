# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: basic-functionality.spec.ts >> TrustHire Basic Functionality >> homepage loads correctly
- Location: tests\basic-functionality.spec.ts:13:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h1')
Expected substring: "TrustHire"
Received string:    "Stop RecruitmentScam Attacks"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('h1')
    8 × locator resolved to <h1 class="text-5xl md:text-6xl font-mono font-bold tracking-tight mb-6">…</h1>
      - unexpected value "Stop RecruitmentScam Attacks"

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
      - button [ref=e10] [cursor=pointer]:
        - img [ref=e11]
  - generic [ref=e12]:
    - generic [ref=e15]:
      - generic [ref=e16]:
        - img [ref=e17]
        - generic [ref=e19]: LIVE PROTECTION
      - heading "Stop Recruitment Scam Attacks" [level=1] [ref=e20]:
        - text: Stop Recruitment
        - generic [ref=e21]: Scam Attacks
      - paragraph [ref=e22]: Web3's most advanced security tool for detecting fake recruiters, malicious repositories, and job scams before they compromise your development environment.
      - generic [ref=e23]:
        - link "Start Free Assessment" [ref=e24] [cursor=pointer]:
          - /url: /assess
          - img [ref=e25]
          - text: Start Free Assessment
          - img [ref=e27]
        - button "How It Works" [ref=e29] [cursor=pointer]:
          - img [ref=e30]
          - text: How It Works
      - generic [ref=e33]:
        - generic [ref=e34]:
          - generic [ref=e35]: 1,247
          - generic [ref=e36]: Assessments Run
        - generic [ref=e37]:
          - generic [ref=e38]: "89"
          - generic [ref=e39]: Threats Blocked
        - generic [ref=e40]:
          - generic [ref=e41]: "342"
          - generic [ref=e42]: Active Users
        - generic [ref=e43]:
          - generic [ref=e44]: 2.3s
          - generic [ref=e45]: Avg Response
    - generic [ref=e48]:
      - generic [ref=e49]:
        - heading "How Recruitment Scams Work" [level=2] [ref=e50]
        - paragraph [ref=e51]: Understanding the attack flow is your first line of defense
      - generic [ref=e52]:
        - generic [ref=e53]:
          - generic [ref=e54]: LinkedIn DM
          - img [ref=e55]
        - generic [ref=e57]:
          - generic [ref=e58]: Job Discussion
          - img [ref=e59]
        - generic [ref=e61]:
          - generic [ref=e62]: "\"Technical Review\" Repo"
          - img [ref=e63]
        - generic [ref=e65]:
          - generic [ref=e66]: npm install
          - img [ref=e67]
        - generic [ref=e69]:
          - generic [ref=e70]: Postinstall Script
          - img [ref=e71]
        - generic [ref=e74]: .env Exfiltrated
      - generic [ref=e75]:
        - generic [ref=e76]:
          - img [ref=e77]
          - text: Critical Risk
        - paragraph [ref=e79]: One malicious npm install can compromise your entire development environment, exposing API keys, wallet credentials, and sensitive data.
    - generic [ref=e81]:
      - generic [ref=e82]:
        - heading "Security Tools at Your Fingertips" [level=2] [ref=e83]
        - paragraph [ref=e84]: Professional-grade security analysis, designed for developers
      - generic [ref=e85]:
        - generic [ref=e87]:
          - img [ref=e89]
          - generic [ref=e92]:
            - heading "GitHub Repository Scan" [level=3] [ref=e93]
            - paragraph [ref=e94]: Instant analysis of any repository for malicious code patterns
            - generic [ref=e95]:
              - generic [ref=e96]: 2.3s avg
              - link "Try Now" [ref=e97] [cursor=pointer]:
                - /url: /scan/github
                - text: Try Now
                - img [ref=e98]
        - generic [ref=e101]:
          - img [ref=e103]
          - generic [ref=e108]:
            - heading "LinkedIn Profile Check" [level=3] [ref=e109]
            - paragraph [ref=e110]: Verify recruiter authenticity and detect fake profiles
            - generic [ref=e111]:
              - generic [ref=e112]: 15+ signals
              - link "Try Now" [ref=e113] [cursor=pointer]:
                - /url: /scan/linkedin
                - text: Try Now
                - img [ref=e114]
        - generic [ref=e117]:
          - img [ref=e119]
          - generic [ref=e122]:
            - heading "Reverse Image Search" [level=3] [ref=e123]
            - paragraph [ref=e124]: Check profile photos against known fakes and stock images
            - generic [ref=e125]:
              - generic [ref=e126]: 100M+ images
              - link "Try Now" [ref=e127] [cursor=pointer]:
                - /url: /scan/image
                - text: Try Now
                - img [ref=e128]
        - generic [ref=e131]:
          - img [ref=e133]
          - generic [ref=e135]:
            - heading "Full Assessment" [level=3] [ref=e136]
            - paragraph [ref=e137]: Comprehensive security evaluation for complete peace of mind
            - generic [ref=e138]:
              - generic [ref=e139]: 5min total
              - link "Try Now" [ref=e140] [cursor=pointer]:
                - /url: /assess
                - text: Try Now
                - img [ref=e141]
    - generic [ref=e144]:
      - generic [ref=e145]:
        - heading "Why Developers Trust TrustHire" [level=2] [ref=e146]
        - paragraph [ref=e147]: Built by security experts, for the Web3 ecosystem
      - generic [ref=e148]:
        - generic [ref=e149]:
          - img [ref=e151]
          - generic [ref=e154]:
            - heading "Static Analysis Only" [level=3] [ref=e155]
            - paragraph [ref=e156]: We never execute code from analyzed repositories. All scans are completely safe.
            - generic [ref=e157]: Zero risk to your system
        - generic [ref=e158]:
          - img [ref=e160]
          - generic [ref=e162]:
            - heading "Lightning Fast" [level=3] [ref=e163]
            - paragraph [ref=e164]: Get comprehensive security assessments in under 2 minutes, not hours.
            - generic [ref=e165]: Save time, stay secure
        - generic [ref=e166]:
          - img [ref=e168]
          - generic [ref=e170]:
            - heading "Risk Scoring" [level=3] [ref=e171]
            - paragraph [ref=e172]: Clear, actionable risk scores with detailed explanations and recommendations.
            - generic [ref=e173]: Make informed decisions
        - generic [ref=e174]:
          - img [ref=e176]
          - generic [ref=e181]:
            - heading "Community Powered" [level=3] [ref=e182]
            - paragraph [ref=e183]: Leverage collective intelligence from thousands of security assessments.
            - generic [ref=e184]: Stronger protection together
    - generic [ref=e187]:
      - heading "Got a Repo Link from a Recruiter?" [level=2] [ref=e188]
      - paragraph [ref=e189]: Run a comprehensive security assessment in under 2 minutes before you clone anything. It could save your entire development environment.
      - generic [ref=e190]:
        - link "Run Free Assessment" [ref=e191] [cursor=pointer]:
          - /url: /assess
          - img [ref=e192]
          - text: Run Free Assessment
          - img [ref=e194]
        - link "View Dashboard" [ref=e196] [cursor=pointer]:
          - /url: /dashboard
          - img [ref=e197]
          - text: View Dashboard
      - paragraph [ref=e199]: TrustHire provides risk signals, not legal verdicts. See disclaimer for details.
  - generic [ref=e201]:
    - generic [ref=e203]:
      - generic [ref=e204]: Step 1 of 4
      - button [ref=e205] [cursor=pointer]:
        - img [ref=e206]
    - generic [ref=e211]:
      - generic [ref=e212]:
        - img [ref=e214]
        - generic [ref=e216]:
          - heading "Welcome to TrustHire" [level=2] [ref=e217]
          - paragraph [ref=e218]: Your security shield against recruitment scams and malicious code attacks
      - generic [ref=e219]:
        - paragraph [ref=e222]: We analyze recruiters and repositories without executing any code
        - paragraph [ref=e225]: All scans are static analysis only - completely safe
        - paragraph [ref=e228]: Your data is private by default
      - button "Next" [ref=e236] [cursor=pointer]:
        - text: Next
        - img [ref=e237]
  - generic [ref=e240]:
    - button "Tools" [ref=e241] [cursor=pointer]:
      - img [ref=e243]
      - generic [ref=e245]: Tools
    - link "Home" [ref=e246] [cursor=pointer]:
      - /url: /
      - img [ref=e248]
      - generic [ref=e251]: Home
    - link "Patterns" [ref=e252] [cursor=pointer]:
      - /url: /patterns
      - img [ref=e254]
      - generic [ref=e258]: Patterns
    - link "Sandbox" [ref=e259] [cursor=pointer]:
      - /url: /sandbox
      - img [ref=e261]
      - generic [ref=e263]: Sandbox
    - link "Monitor" [ref=e264] [cursor=pointer]:
      - /url: /monitoring
      - img [ref=e266]
      - generic [ref=e268]: Monitor
    - button "More" [ref=e269] [cursor=pointer]:
      - img [ref=e271]
      - generic [ref=e272]: More
  - generic:
    - generic:
      - heading "Quick Tools" [level=3]
      - button:
        - img
    - generic:
      - link "GitHub Quick Scan":
        - /url: /scan/github
        - generic:
          - img
        - generic:
          - generic: GitHub
          - generic: Quick Scan
      - link "LinkedIn Quick Scan":
        - /url: /scan/linkedin
        - generic:
          - img
        - generic:
          - generic: LinkedIn
          - generic: Quick Scan
      - link "Image Quick Scan":
        - /url: /scan/image
        - generic:
          - img
        - generic:
          - generic: Image
          - generic: Quick Scan
      - link "Forms Quick Scan":
        - /url: /scan/forms
        - generic:
          - img
        - generic:
          - generic: Forms
          - generic: Quick Scan
  - alert [ref=e274]
```

# Test source

```ts
  1   | /**
  2   |  * Basic Functionality Tests
  3   |  * Core tests for TrustHire application
  4   |  */
  5   | 
  6   | import { test, expect } from '@playwright/test';
  7   | 
  8   | test.describe('TrustHire Basic Functionality', () => {
  9   |   test.beforeEach(async ({ page }) => {
  10  |     await page.goto('/');
  11  |   });
  12  | 
  13  |   test('homepage loads correctly', async ({ page }) => {
  14  |     await expect(page).toHaveTitle(/TrustHire/);
> 15  |     await expect(page.locator('h1')).toContainText('TrustHire');
      |                                      ^ Error: expect(locator).toContainText(expected) failed
  16  |     await expect(page.locator('body')).toBeVisible();
  17  |   });
  18  | 
  19  |   test('navigation works correctly', async ({ page }) => {
  20  |     // Test navigation to dashboard
  21  |     await page.click('text=Dashboard');
  22  |     await expect(page).toHaveURL(/dashboard/);
  23  |     await expect(page.locator('h1')).toContainText('Dashboard');
  24  | 
  25  |     // Test navigation to assessment
  26  |     await page.click('text=Assess');
  27  |     await expect(page).toHaveURL(/assess/);
  28  |     await expect(page.locator('h1')).toContainText('Assessment');
  29  |   });
  30  | 
  31  |   test('assessment page loads', async ({ page }) => {
  32  |     await page.goto('/assess');
  33  |     
  34  |     // Check if assessment form is present
  35  |     await expect(page.locator('form')).toBeVisible();
  36  |     await expect(page.locator('input[type="url"]')).toBeVisible();
  37  |     await expect(page.locator('button[type="submit"]')).toBeVisible();
  38  |   });
  39  | 
  40  |   test('scan pages are accessible', async ({ page }) => {
  41  |     const scanPages = [
  42  |       '/scan/url',
  43  |       '/scan/github',
  44  |       '/scan/linkedin',
  45  |       '/scan/forms'
  46  |     ];
  47  | 
  48  |     for (const scanPage of scanPages) {
  49  |       await page.goto(scanPage);
  50  |       await expect(page.locator('h1')).toBeVisible();
  51  |       await expect(page.locator('form')).toBeVisible();
  52  |     }
  53  |   });
  54  | 
  55  |   test('intelligence page loads', async ({ page }) => {
  56  |     await page.goto('/intelligence');
  57  |     
  58  |     await expect(page).toHaveURL(/intelligence/);
  59  |     await expect(page.locator('h1')).toContainText('Intelligence');
  60  |     await expect(page.locator('body')).toBeVisible();
  61  |   });
  62  | 
  63  |   test('monitoring page loads', async ({ page }) => {
  64  |     await page.goto('/monitoring');
  65  |     
  66  |     await expect(page).toHaveURL(/monitoring/);
  67  |     await expect(page.locator('h1')).toContainText('Monitoring');
  68  |     await expect(page.locator('body')).toBeVisible();
  69  |   });
  70  | 
  71  |   test('collaboration page loads', async ({ page }) => {
  72  |     await page.goto('/collaboration');
  73  |     
  74  |     await expect(page).toHaveURL(/collaboration/);
  75  |     await expect(page.locator('h1')).toContainText('Collaboration');
  76  |     await expect(page.locator('body')).toBeVisible();
  77  |   });
  78  | 
  79  |   test('agent page loads', async ({ page }) => {
  80  |     await page.goto('/agent');
  81  |     
  82  |     await expect(page).toHaveURL(/agent/);
  83  |     await expect(page.locator('h1')).toContainText('Autonomous AI Agent');
  84  |     await expect(page.locator('body')).toBeVisible();
  85  |   });
  86  | 
  87  |   test('responsive design works', async ({ page }) => {
  88  |     // Test mobile viewport
  89  |     await page.setViewportSize({ width: 375, height: 667 });
  90  |     await expect(page.locator('body')).toBeVisible();
  91  |     
  92  |     // Test tablet viewport
  93  |     await page.setViewportSize({ width: 768, height: 1024 });
  94  |     await expect(page.locator('body')).toBeVisible();
  95  |     
  96  |     // Test desktop viewport
  97  |     await page.setViewportSize({ width: 1920, height: 1080 });
  98  |     await expect(page.locator('body')).toBeVisible();
  99  |   });
  100 | 
  101 |   test('API health check', async ({ page }) => {
  102 |     const response = await page.goto('/api/health');
  103 |     expect(response).toBeTruthy();
  104 |   });
  105 | 
  106 |   test('page loads without errors', async ({ page }) => {
  107 |     // Check for any JavaScript errors
  108 |     const errors = [];
  109 |     
  110 |     page.on('pageerror', error => {
  111 |       errors.push(error.message);
  112 |     });
  113 | 
  114 |     await page.goto('/');
  115 |     await page.waitForLoadState('networkidle');
```