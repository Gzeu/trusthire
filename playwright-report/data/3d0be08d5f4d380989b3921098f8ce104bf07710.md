# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: basic-functionality.spec.ts >> TrustHire Basic Functionality >> page loads without errors
- Location: tests\basic-functionality.spec.ts:106:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 2
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
        - link "Start Free Assessment" [ref=e24]:
          - /url: /assess
          - img [ref=e25]
          - text: Start Free Assessment
          - img [ref=e27]
        - button "How It Works" [ref=e29] [cursor=pointer]:
          - img [ref=e30]
          - text: How It Works
      - generic [ref=e33]:
        - generic [ref=e34]:
          - generic [ref=e35]: "0"
          - generic [ref=e36]: Assessments Run
        - generic [ref=e37]:
          - generic [ref=e38]: "0"
          - generic [ref=e39]: Threats Blocked
        - generic [ref=e40]:
          - generic [ref=e41]: "0"
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
              - link "Try Now" [ref=e97]:
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
              - link "Try Now" [ref=e113]:
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
              - link "Try Now" [ref=e127]:
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
              - link "Try Now" [ref=e140]:
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
        - link "Run Free Assessment" [ref=e191]:
          - /url: /assess
          - img [ref=e192]
          - text: Run Free Assessment
          - img [ref=e194]
        - link "View Dashboard" [ref=e196]:
          - /url: /dashboard
          - img [ref=e197]
          - text: View Dashboard
      - paragraph [ref=e199]: TrustHire provides risk signals, not legal verdicts. See disclaimer for details.
  - generic [ref=e201]:
    - button "Tools" [ref=e202] [cursor=pointer]:
      - img [ref=e204]
      - generic [ref=e206]: Tools
    - link "Home" [ref=e207]:
      - /url: /
      - img [ref=e209]
      - generic [ref=e212]: Home
    - link "Patterns" [ref=e213]:
      - /url: /patterns
      - img [ref=e215]
      - generic [ref=e219]: Patterns
    - link "Sandbox" [ref=e220]:
      - /url: /sandbox
      - img [ref=e222]
      - generic [ref=e224]: Sandbox
    - link "Monitor" [ref=e225]:
      - /url: /monitoring
      - img [ref=e227]
      - generic [ref=e229]: Monitor
    - button "More" [ref=e230] [cursor=pointer]:
      - img [ref=e232]
      - generic [ref=e233]: More
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
```

# Test source

```ts
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
  116 |     
> 117 |     expect(errors.length).toBe(0);
      |                           ^ Error: expect(received).toBe(expected) // Object.is equality
  118 |   });
  119 | });
  120 | 
  121 | test.describe('API Endpoints', () => {
  122 |   test('health endpoint responds', async ({ request }) => {
  123 |     const response = await request.get('/api/health');
  124 |     expect(response.status()).toBe(200);
  125 |   });
  126 | 
  127 |   test('metrics endpoint responds', async ({ request }) => {
  128 |     const response = await request.get('/api/metrics');
  129 |     expect(response.status()).toBe(200);
  130 |   });
  131 | 
  132 |   test('patterns endpoint responds', async ({ request }) => {
  133 |     const response = await request.get('/api/patterns');
  134 |     expect(response.status()).toBe(200);
  135 |   });
  136 | });
  137 | 
  138 | test.describe('Security Features', () => {
  139 |   test('no sensitive data in page source', async ({ page }) => {
  140 |     await page.goto('/');
  141 |     const content = await page.content();
  142 |     
  143 |     // Check for API keys
  144 |     expect(content).not.toMatch(/sk-[a-zA-Z0-9]{48}/);
  145 |     expect(content).not.toMatch(/gsk_[a-zA-Z0-9]{51}/);
  146 |     
  147 |     // Check for passwords
  148 |     expect(content).not.toMatch(/password["\s]*[:=]/i);
  149 |   });
  150 | 
  151 |   test('security headers are present', async ({ page }) => {
  152 |     const response = await page.goto('/');
  153 |     const headers = response?.headers();
  154 |     
  155 |     // Check for security headers
  156 |     expect(headers?.['x-frame-options']).toBeTruthy();
  157 |     expect(headers?.['x-content-type-options']).toBeTruthy();
  158 |   });
  159 | 
  160 |   test('forms have CSRF protection', async ({ page }) => {
  161 |     await page.goto('/assess');
  162 |     const form = page.locator('form');
  163 |     
  164 |     if (await form.isVisible()) {
  165 |       // Check for CSRF token or similar protection
  166 |       const csrfToken = await page.locator('input[name*="csrf"], input[name*="token"]').first();
  167 |       expect(csrfToken).toBeTruthy();
  168 |     }
  169 |   });
  170 | });
  171 | 
```