# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: basic-functionality.spec.ts >> TrustHire Basic Functionality >> assessment page loads
- Location: tests\basic-functionality.spec.ts:31:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('form')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('form')

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
  - generic [ref=e44]:
    - generic [ref=e45]:
      - generic [ref=e46]:
        - img [ref=e47]
        - generic [ref=e49]: SECURITY ASSESSMENT
      - heading "Security Assessment Center" [level=1] [ref=e50]
      - paragraph [ref=e51]: Choose an assessment type to analyze potential security threats. All scans are performed in isolated environments for maximum safety.
    - generic [ref=e52]:
      - generic [ref=e53] [cursor=pointer]:
        - generic [ref=e54]:
          - img [ref=e56]
          - generic [ref=e59]:
            - heading "GitHub Repository" [level=3] [ref=e60]
            - generic [ref=e61]:
              - generic [ref=e62]: HIGH RISK
              - generic [ref=e63]: ~30s
        - paragraph [ref=e64]: Analyze any repository for malicious code patterns and security risks
      - generic [ref=e65] [cursor=pointer]:
        - generic [ref=e66]:
          - img [ref=e68]
          - generic [ref=e73]:
            - heading "LinkedIn Profile" [level=3] [ref=e74]
            - generic [ref=e75]:
              - generic [ref=e76]: MEDIUM RISK
              - generic [ref=e77]: ~15s
        - paragraph [ref=e78]: Verify recruiter authenticity and detect fake profiles
      - generic [ref=e79] [cursor=pointer]:
        - generic [ref=e80]:
          - img [ref=e82]
          - generic [ref=e85]:
            - heading "URL Analysis" [level=3] [ref=e86]
            - generic [ref=e87]:
              - generic [ref=e88]: LOW RISK
              - generic [ref=e89]: ~10s
        - paragraph [ref=e90]: Check any URL for phishing, malware, and security issues
      - generic [ref=e91] [cursor=pointer]:
        - generic [ref=e92]:
          - img [ref=e94]
          - generic [ref=e96]:
            - heading "Full Assessment" [level=3] [ref=e97]
            - generic [ref=e98]:
              - generic [ref=e99]: HIGH RISK
              - generic [ref=e100]: ~5min
        - paragraph [ref=e101]: Complete security evaluation with detailed reporting
    - generic [ref=e102]:
      - heading "Recent Assessments" [level=2] [ref=e103]:
        - img [ref=e104]
        - text: Recent Assessments
      - generic [ref=e107]:
        - generic [ref=e108]:
          - generic [ref=e109]:
            - generic [ref=e110]: HIGH
            - generic [ref=e111]:
              - paragraph [ref=e112]: GitHub Repository
              - paragraph [ref=e113]: 2 hours ago
          - button "View Details" [ref=e114] [cursor=pointer]
        - generic [ref=e115]:
          - generic [ref=e116]:
            - generic [ref=e117]: MEDIUM
            - generic [ref=e118]:
              - paragraph [ref=e119]: LinkedIn Profile
              - paragraph [ref=e120]: 5 hours ago
          - button "View Details" [ref=e121] [cursor=pointer]
        - generic [ref=e122]:
          - generic [ref=e123]:
            - generic [ref=e124]: LOW
            - generic [ref=e125]:
              - paragraph [ref=e126]: URL Analysis
              - paragraph [ref=e127]: 1 day ago
          - button "View Details" [ref=e128] [cursor=pointer]
  - alert [ref=e129]
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
> 35  |     await expect(page.locator('form')).toBeVisible();
      |                                        ^ Error: expect(locator).toBeVisible() failed
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
```