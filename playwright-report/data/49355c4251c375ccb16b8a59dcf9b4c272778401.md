# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: basic-functionality.spec.ts >> TrustHire Basic Functionality >> navigation works correctly
- Location: tests\basic-functionality.spec.ts:19:7

# Error details

```
TimeoutError: page.click: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('text=Dashboard')
    - locator resolved to 2 elements. Proceeding with the first one: <span>Dashboard</span>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - performing click action
    - <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">…</div> intercepts pointer events
  - retrying click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">…</div> intercepts pointer events
  - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">…</div> intercepts pointer events
    - retrying click action
      - waiting 100ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">…</div> intercepts pointer events
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e4]:
      - link "TrustHire" [ref=e5]:
        - /url: /
        - img [ref=e7]
        - generic [ref=e9]: TrustHire
      - generic [ref=e10]:
        - button "Quick Tools" [ref=e12] [cursor=pointer]:
          - img [ref=e13]
          - generic [ref=e15]: Quick Tools
          - img [ref=e16]
        - link "Dashboard" [ref=e18]:
          - /url: /dashboard
          - img [ref=e19]
          - generic [ref=e24]: Dashboard
        - link "Patterns" [ref=e25]:
          - /url: /patterns
          - img [ref=e26]
          - generic [ref=e30]: Patterns
        - link "Sandbox" [ref=e31]:
          - /url: /sandbox
          - img [ref=e32]
          - generic [ref=e34]: Sandbox
        - link "Monitoring" [ref=e35]:
          - /url: /monitoring
          - img [ref=e36]
          - generic [ref=e38]: Monitoring
        - link "Start Assessment" [ref=e39]:
          - /url: /assess
          - img [ref=e40]
          - generic [ref=e42]: Start Assessment
  - generic [ref=e43]:
    - generic [ref=e46]:
      - generic [ref=e47]:
        - img [ref=e48]
        - generic [ref=e50]: LIVE PROTECTION
      - heading "Stop Recruitment Scam Attacks" [level=1] [ref=e51]:
        - text: Stop Recruitment
        - generic [ref=e52]: Scam Attacks
      - paragraph [ref=e53]: Web3's most advanced security tool for detecting fake recruiters, malicious repositories, and job scams before they compromise your development environment.
      - generic [ref=e54]:
        - link "Start Free Assessment" [ref=e55]:
          - /url: /assess
          - img [ref=e56]
          - text: Start Free Assessment
          - img [ref=e58]
        - button "How It Works" [ref=e60] [cursor=pointer]:
          - img [ref=e61]
          - text: How It Works
      - generic [ref=e64]:
        - generic [ref=e65]:
          - generic [ref=e66]: 1,247
          - generic [ref=e67]: Assessments Run
        - generic [ref=e68]:
          - generic [ref=e69]: "89"
          - generic [ref=e70]: Threats Blocked
        - generic [ref=e71]:
          - generic [ref=e72]: "342"
          - generic [ref=e73]: Active Users
        - generic [ref=e74]:
          - generic [ref=e75]: 2.3s
          - generic [ref=e76]: Avg Response
    - generic [ref=e79]:
      - generic [ref=e80]:
        - heading "How Recruitment Scams Work" [level=2] [ref=e81]
        - paragraph [ref=e82]: Understanding the attack flow is your first line of defense
      - generic [ref=e83]:
        - generic [ref=e84]:
          - generic [ref=e85]: LinkedIn DM
          - img [ref=e86]
        - generic [ref=e88]:
          - generic [ref=e89]: Job Discussion
          - img [ref=e90]
        - generic [ref=e92]:
          - generic [ref=e93]: "\"Technical Review\" Repo"
          - img [ref=e94]
        - generic [ref=e96]:
          - generic [ref=e97]: npm install
          - img [ref=e98]
        - generic [ref=e100]:
          - generic [ref=e101]: Postinstall Script
          - img [ref=e102]
        - generic [ref=e105]: .env Exfiltrated
      - generic [ref=e106]:
        - generic [ref=e107]:
          - img [ref=e108]
          - text: Critical Risk
        - paragraph [ref=e110]: One malicious npm install can compromise your entire development environment, exposing API keys, wallet credentials, and sensitive data.
    - generic [ref=e112]:
      - generic [ref=e113]:
        - heading "Security Tools at Your Fingertips" [level=2] [ref=e114]
        - paragraph [ref=e115]: Professional-grade security analysis, designed for developers
      - generic [ref=e116]:
        - generic [ref=e118]:
          - img [ref=e120]
          - generic [ref=e123]:
            - heading "GitHub Repository Scan" [level=3] [ref=e124]
            - paragraph [ref=e125]: Instant analysis of any repository for malicious code patterns
            - generic [ref=e126]:
              - generic [ref=e127]: 2.3s avg
              - link "Try Now" [ref=e128]:
                - /url: /scan/github
                - text: Try Now
                - img [ref=e129]
        - generic [ref=e132]:
          - img [ref=e134]
          - generic [ref=e139]:
            - heading "LinkedIn Profile Check" [level=3] [ref=e140]
            - paragraph [ref=e141]: Verify recruiter authenticity and detect fake profiles
            - generic [ref=e142]:
              - generic [ref=e143]: 15+ signals
              - link "Try Now" [ref=e144]:
                - /url: /scan/linkedin
                - text: Try Now
                - img [ref=e145]
        - generic [ref=e148]:
          - img [ref=e150]
          - generic [ref=e153]:
            - heading "Reverse Image Search" [level=3] [ref=e154]
            - paragraph [ref=e155]: Check profile photos against known fakes and stock images
            - generic [ref=e156]:
              - generic [ref=e157]: 100M+ images
              - link "Try Now" [ref=e158]:
                - /url: /scan/image
                - text: Try Now
                - img [ref=e159]
        - generic [ref=e162]:
          - img [ref=e164]
          - generic [ref=e166]:
            - heading "Full Assessment" [level=3] [ref=e167]
            - paragraph [ref=e168]: Comprehensive security evaluation for complete peace of mind
            - generic [ref=e169]:
              - generic [ref=e170]: 5min total
              - link "Try Now" [ref=e171]:
                - /url: /assess
                - text: Try Now
                - img [ref=e172]
    - generic [ref=e175]:
      - generic [ref=e176]:
        - heading "Why Developers Trust TrustHire" [level=2] [ref=e177]
        - paragraph [ref=e178]: Built by security experts, for the Web3 ecosystem
      - generic [ref=e179]:
        - generic [ref=e180]:
          - img [ref=e182]
          - generic [ref=e185]:
            - heading "Static Analysis Only" [level=3] [ref=e186]
            - paragraph [ref=e187]: We never execute code from analyzed repositories. All scans are completely safe.
            - generic [ref=e188]: Zero risk to your system
        - generic [ref=e189]:
          - img [ref=e191]
          - generic [ref=e193]:
            - heading "Lightning Fast" [level=3] [ref=e194]
            - paragraph [ref=e195]: Get comprehensive security assessments in under 2 minutes, not hours.
            - generic [ref=e196]: Save time, stay secure
        - generic [ref=e197]:
          - img [ref=e199]
          - generic [ref=e201]:
            - heading "Risk Scoring" [level=3] [ref=e202]
            - paragraph [ref=e203]: Clear, actionable risk scores with detailed explanations and recommendations.
            - generic [ref=e204]: Make informed decisions
        - generic [ref=e205]:
          - img [ref=e207]
          - generic [ref=e212]:
            - heading "Community Powered" [level=3] [ref=e213]
            - paragraph [ref=e214]: Leverage collective intelligence from thousands of security assessments.
            - generic [ref=e215]: Stronger protection together
    - generic [ref=e218]:
      - heading "Got a Repo Link from a Recruiter?" [level=2] [ref=e219]
      - paragraph [ref=e220]: Run a comprehensive security assessment in under 2 minutes before you clone anything. It could save your entire development environment.
      - generic [ref=e221]:
        - link "Run Free Assessment" [ref=e222]:
          - /url: /assess
          - img [ref=e223]
          - text: Run Free Assessment
          - img [ref=e225]
        - link "View Dashboard" [ref=e227]:
          - /url: /dashboard
          - img [ref=e228]
          - text: View Dashboard
      - paragraph [ref=e230]: TrustHire provides risk signals, not legal verdicts. See disclaimer for details.
  - generic [ref=e232]:
    - generic [ref=e234]:
      - generic [ref=e235]: Step 1 of 4
      - button [ref=e236] [cursor=pointer]:
        - img [ref=e237]
    - generic [ref=e242]:
      - generic [ref=e243]:
        - img [ref=e245]
        - generic [ref=e247]:
          - heading "Welcome to TrustHire" [level=2] [ref=e248]
          - paragraph [ref=e249]: Your security shield against recruitment scams and malicious code attacks
      - generic [ref=e250]:
        - paragraph [ref=e253]: We analyze recruiters and repositories without executing any code
        - paragraph [ref=e256]: All scans are static analysis only - completely safe
        - paragraph [ref=e259]: Your data is private by default
      - button "Next" [ref=e267] [cursor=pointer]:
        - text: Next
        - img [ref=e268]
  - alert [ref=e270]
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
  15  |     await expect(page.locator('h1')).toContainText('TrustHire');
  16  |     await expect(page.locator('body')).toBeVisible();
  17  |   });
  18  | 
  19  |   test('navigation works correctly', async ({ page }) => {
  20  |     // Test navigation to dashboard
> 21  |     await page.click('text=Dashboard');
      |                ^ TimeoutError: page.click: Timeout 10000ms exceeded.
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
  116 |     
  117 |     expect(errors.length).toBe(0);
  118 |   });
  119 | });
  120 | 
  121 | test.describe('API Endpoints', () => {
```