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