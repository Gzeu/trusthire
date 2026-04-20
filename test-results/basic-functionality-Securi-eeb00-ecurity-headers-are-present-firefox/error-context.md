# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: basic-functionality.spec.ts >> Security Features >> security headers are present
- Location: tests\basic-functionality.spec.ts:151:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: undefined
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
        - link "Start Assessment" [ref=e41] [cursor=pointer]:
          - /url: /assess
          - img [ref=e42]
          - generic [ref=e46]: Start Assessment
  - generic [ref=e47]:
    - generic [ref=e50]:
      - generic [ref=e51]:
        - img [ref=e52]
        - generic [ref=e54]: LIVE PROTECTION
      - heading "Stop Recruitment Scam Attacks" [level=1] [ref=e55]:
        - text: Stop Recruitment
        - generic [ref=e56]: Scam Attacks
      - paragraph [ref=e57]: Web3's most advanced security tool for detecting fake recruiters, malicious repositories, and job scams before they compromise your development environment.
      - generic [ref=e58]:
        - link "Start Free Assessment" [ref=e59] [cursor=pointer]:
          - /url: /assess
          - img [ref=e60]
          - text: Start Free Assessment
          - img [ref=e62]
        - button "How It Works" [ref=e64] [cursor=pointer]:
          - img [ref=e65]
          - text: How It Works
      - generic [ref=e68]:
        - generic [ref=e69]:
          - generic [ref=e70]: "0"
          - generic [ref=e71]: Assessments Run
        - generic [ref=e72]:
          - generic [ref=e73]: "0"
          - generic [ref=e74]: Threats Blocked
        - generic [ref=e75]:
          - generic [ref=e76]: "0"
          - generic [ref=e77]: Active Users
        - generic [ref=e78]:
          - generic [ref=e79]: 2.3s
          - generic [ref=e80]: Avg Response
    - generic [ref=e83]:
      - generic [ref=e84]:
        - heading "How Recruitment Scams Work" [level=2] [ref=e85]
        - paragraph [ref=e86]: Understanding the attack flow is your first line of defense
      - generic [ref=e87]:
        - generic [ref=e88]:
          - generic [ref=e89]: LinkedIn DM
          - img [ref=e90]
        - generic [ref=e92]:
          - generic [ref=e93]: Job Discussion
          - img [ref=e94]
        - generic [ref=e96]:
          - generic [ref=e97]: "\"Technical Review\" Repo"
          - img [ref=e98]
        - generic [ref=e100]:
          - generic [ref=e101]: npm install
          - img [ref=e102]
        - generic [ref=e104]:
          - generic [ref=e105]: Postinstall Script
          - img [ref=e106]
        - generic [ref=e109]: .env Exfiltrated
      - generic [ref=e110]:
        - generic [ref=e111]:
          - img [ref=e112]
          - text: Critical Risk
        - paragraph [ref=e116]: One malicious npm install can compromise your entire development environment, exposing API keys, wallet credentials, and sensitive data.
    - generic [ref=e118]:
      - generic [ref=e119]:
        - heading "Security Tools at Your Fingertips" [level=2] [ref=e120]
        - paragraph [ref=e121]: Professional-grade security analysis, designed for developers
      - generic [ref=e122]:
        - generic [ref=e124]:
          - img [ref=e126]
          - generic [ref=e129]:
            - heading "GitHub Repository Scan" [level=3] [ref=e130]
            - paragraph [ref=e131]: Instant analysis of any repository for malicious code patterns
            - generic [ref=e132]:
              - generic [ref=e133]: 2.3s avg
              - link "Try Now" [ref=e134] [cursor=pointer]:
                - /url: /scan/github
                - text: Try Now
                - img [ref=e135]
        - generic [ref=e138]:
          - img [ref=e140]
          - generic [ref=e145]:
            - heading "LinkedIn Profile Check" [level=3] [ref=e146]
            - paragraph [ref=e147]: Verify recruiter authenticity and detect fake profiles
            - generic [ref=e148]:
              - generic [ref=e149]: 15+ signals
              - link "Try Now" [ref=e150] [cursor=pointer]:
                - /url: /scan/linkedin
                - text: Try Now
                - img [ref=e151]
        - generic [ref=e154]:
          - img [ref=e156]
          - generic [ref=e159]:
            - heading "Reverse Image Search" [level=3] [ref=e160]
            - paragraph [ref=e161]: Check profile photos against known fakes and stock images
            - generic [ref=e162]:
              - generic [ref=e163]: 100M+ images
              - link "Try Now" [ref=e164] [cursor=pointer]:
                - /url: /scan/image
                - text: Try Now
                - img [ref=e165]
        - generic [ref=e168]:
          - img [ref=e170]
          - generic [ref=e172]:
            - heading "Full Assessment" [level=3] [ref=e173]
            - paragraph [ref=e174]: Comprehensive security evaluation for complete peace of mind
            - generic [ref=e175]:
              - generic [ref=e176]: 5min total
              - link "Try Now" [ref=e177] [cursor=pointer]:
                - /url: /assess
                - text: Try Now
                - img [ref=e178]
    - generic [ref=e181]:
      - generic [ref=e182]:
        - heading "Why Developers Trust TrustHire" [level=2] [ref=e183]
        - paragraph [ref=e184]: Built by security experts, for the Web3 ecosystem
      - generic [ref=e185]:
        - generic [ref=e186]:
          - img [ref=e188]
          - generic [ref=e191]:
            - heading "Static Analysis Only" [level=3] [ref=e192]
            - paragraph [ref=e193]: We never execute code from analyzed repositories. All scans are completely safe.
            - generic [ref=e194]: Zero risk to your system
        - generic [ref=e195]:
          - img [ref=e197]
          - generic [ref=e199]:
            - heading "Lightning Fast" [level=3] [ref=e200]
            - paragraph [ref=e201]: Get comprehensive security assessments in under 2 minutes, not hours.
            - generic [ref=e202]: Save time, stay secure
        - generic [ref=e203]:
          - img [ref=e205]
          - generic [ref=e210]:
            - heading "Risk Scoring" [level=3] [ref=e211]
            - paragraph [ref=e212]: Clear, actionable risk scores with detailed explanations and recommendations.
            - generic [ref=e213]: Make informed decisions
        - generic [ref=e214]:
          - img [ref=e216]
          - generic [ref=e221]:
            - heading "Community Powered" [level=3] [ref=e222]
            - paragraph [ref=e223]: Leverage collective intelligence from thousands of security assessments.
            - generic [ref=e224]: Stronger protection together
    - generic [ref=e227]:
      - heading "Got a Repo Link from a Recruiter?" [level=2] [ref=e228]
      - paragraph [ref=e229]: Run a comprehensive security assessment in under 2 minutes before you clone anything. It could save your entire development environment.
      - generic [ref=e230]:
        - link "Run Free Assessment" [ref=e231] [cursor=pointer]:
          - /url: /assess
          - img [ref=e232]
          - text: Run Free Assessment
          - img [ref=e234]
        - link "View Dashboard" [ref=e236] [cursor=pointer]:
          - /url: /dashboard
          - img [ref=e237]
          - text: View Dashboard
      - paragraph [ref=e242]: TrustHire provides risk signals, not legal verdicts. See disclaimer for details.
```

# Test source

```ts
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
> 156 |     expect(headers?.['x-frame-options']).toBeTruthy();
      |                                          ^ Error: expect(received).toBeTruthy()
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