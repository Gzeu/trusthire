# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security.spec.ts >> Security Features >> security headers are present
- Location: tests\security.spec.ts:28:7

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
          - generic [ref=e66]: "0"
          - generic [ref=e67]: Assessments Run
        - generic [ref=e68]:
          - generic [ref=e69]: "0"
          - generic [ref=e70]: Threats Blocked
        - generic [ref=e71]:
          - generic [ref=e72]: "0"
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
```

# Test source

```ts
  1   | /**
  2   |  * Security Tests
  3   |  * Comprehensive security testing for TrustHire
  4   |  */
  5   | 
  6   | import { test, expect } from '@playwright/test';
  7   | 
  8   | test.describe('Security Features', () => {
  9   |   test('no sensitive data in page source', async ({ page }) => {
  10  |     await page.goto('/');
  11  |     const content = await page.content();
  12  |     
  13  |     // Check for API keys
  14  |     expect(content).not.toMatch(/sk-[a-zA-Z0-9]{48}/);
  15  |     expect(content).not.toMatch(/gsk_[a-zA-Z0-9]{51}/);
  16  |     expect(content).not.toMatch(/at776tTr6OQvLXjVEQlNEpqv2l4MUEmM/);
  17  |     
  18  |     // Check for database credentials
  19  |     expect(content).not.toMatch(/password["\s]*[:=]/i);
  20  |     expect(content).not.toMatch(/mysql:\/\//i);
  21  |     expect(content).not.toMatch(/postgresql:\/\//i);
  22  |     
  23  |     // Check for private keys
  24  |     expect(content).not.toMatch(/-----BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----/);
  25  |     expect(content).not.toMatch(/-----BEGIN CERTIFICATE-----/);
  26  |   });
  27  | 
  28  |   test('security headers are present', async ({ page }) => {
  29  |     const response = await page.goto('/');
  30  |     const headers = response?.headers();
  31  |     
  32  |     // Check for security headers
> 33  |     expect(headers?.['x-frame-options']).toBeTruthy();
      |                                          ^ Error: expect(received).toBeTruthy()
  34  |     expect(headers?.['x-content-type-options']).toBeTruthy();
  35  |     expect(headers?.['x-xss-protection']).toBeTruthy();
  36  |     expect(headers?.['referrer-policy']).toBeTruthy();
  37  |     expect(headers?.['content-security-policy']).toBeTruthy();
  38  |   });
  39  | 
  40  |   test('forms have CSRF protection', async ({ page }) => {
  41  |     const forms = [
  42  |       '/assess',
  43  |       '/scan/url',
  44  |       '/scan/github',
  45  |       '/scan/linkedin',
  46  |       '/scan/forms'
  47  |     ];
  48  | 
  49  |     for (const formPath of forms) {
  50  |       await page.goto(formPath);
  51  |       const form = page.locator('form').first();
  52  |       
  53  |       if (await form.isVisible()) {
  54  |         // Check for CSRF token or similar protection
  55  |         const csrfToken = await page.locator('input[name*="csrf"], input[name*="token"]').first();
  56  |         if (await csrfToken.isVisible()) {
  57  |           expect(await csrfToken.getAttribute('value')).toBeTruthy();
  58  |         }
  59  |       }
  60  |     }
  61  |   });
  62  | 
  63  |   test('input validation works', async ({ page }) => {
  64  |     await page.goto('/assess');
  65  |     
  66  |     // Test URL validation
  67  |     const urlInput = page.locator('input[type="url"]');
  68  |     if (await urlInput.isVisible()) {
  69  |       // Try invalid URL
  70  |       await urlInput.fill('invalid-url');
  71  |       await page.click('button[type="submit"]');
  72  |       
  73  |       // Should show validation error
  74  |       await expect(page.locator('text=Please enter a valid URL')).toBeVisible();
  75  |     }
  76  |   });
  77  | 
  78  |   test('rate limiting works', async ({ request }) => {
  79  |     // Make multiple rapid requests to test rate limiting
  80  |     const promises = [];
  81  |     
  82  |     for (let i = 0; i < 10; i++) {
  83  |       promises.push(request.get('/api/health'));
  84  |     }
  85  |     
  86  |     const responses = await Promise.all(promises);
  87  |     
  88  |     // Most should succeed, but some might be rate limited
  89  |     const successCount = responses.filter(r => r.status() === 200).length;
  90  |     const rateLimitedCount = responses.filter(r => r.status() === 429).length;
  91  |     
  92  |     expect(successCount).toBeGreaterThan(0);
  93  |     // Rate limiting should kick in after several requests
  94  |     expect(rateLimitedCount).toBeGreaterThanOrEqual(0);
  95  |   });
  96  | 
  97  |   test('authentication endpoints are secure', async ({ request }) => {
  98  |     // Test login endpoint
  99  |     const loginResponse = await request.post('/api/auth/login', {
  100 |       data: { email: 'test@example.com', password: 'password' }
  101 |     });
  102 |     
  103 |     // Should either succeed with proper response or fail gracefully
  104 |     expect([200, 400, 401]).toContain(loginResponse.status());
  105 |     
  106 |     // Should not expose sensitive information in error messages
  107 |     if (loginResponse.status() >= 400) {
  108 |       const errorText = await loginResponse.text();
  109 |       expect(errorText).not.toMatch(/password/i);
  110 |       expect(errorText).not.toMatch(/secret/i);
  111 |       expect(errorText).not.toMatch(/token/i);
  112 |     }
  113 |   });
  114 | 
  115 |   test('file upload restrictions', async ({ page }) => {
  116 |     await page.goto('/assess');
  117 |     
  118 |     // Check if file upload is present and has restrictions
  119 |     const fileInput = page.locator('input[type="file"]');
  120 |     if (await fileInput.isVisible()) {
  121 |       // Check for file type restrictions
  122 |       const accept = await fileInput.getAttribute('accept');
  123 |       expect(accept).toBeTruthy();
  124 |       
  125 |       // Should not allow executable files
  126 |       expect(accept).not.toMatch(/\.exe/i);
  127 |       expect(accept).not.toMatch(/\.bat/i);
  128 |       expect(accept).not.toMatch(/\.sh/i);
  129 |     }
  130 |   });
  131 | 
  132 |   test('SQL injection protection', async ({ request }) => {
  133 |     const maliciousInputs = [
```