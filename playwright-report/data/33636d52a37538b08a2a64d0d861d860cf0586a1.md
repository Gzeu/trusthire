# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: data-system.spec.ts >> TrustHire Data System - Real Data Testing >> candidate data collection works
- Location: tests\data-system.spec.ts:309:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
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
  240 |       data: {
  241 |         type: 'recruitment',
  242 |         data: {
  243 |           companyName: 'Export Test Corp',
  244 |           position: 'Backend Developer',
  245 |           location: 'Timi\u0219oara, Romania',
  246 |           contactEmail: 'backend@export-test.ro',
  247 |           contactPhone: '+40-256-123-456',
  248 |           website: 'https://export-test.ro',
  249 |           requirements: ['Node.js', 'MongoDB'],
  250 |           postedDate: '2024-01-20',
  251 |           deadline: '2024-02-20',
  252 |           status: 'active',
  253 |           source: 'company_website',
  254 |           confidence: 0.91
  255 |         }
  256 |       }
  257 |     });
  258 | 
  259 |     // Test export endpoint
  260 |     const response = await page.request.post('http://localhost:3000/api/data/export', {
  261 |       headers: { 'Content-Type': 'application/json' },
  262 |       data: {
  263 |         format: 'json',
  264 |         filters: {
  265 |           type: 'recruitment',
  266 |           startDate: '2024-01-01',
  267 |           endDate: '2024-12-31'
  268 |         }
  269 |       }
  270 |     });
  271 | 
  272 |     expect(response.status()).toBe(200);
  273 |     const result = await response.json();
  274 |     expect(result.success).toBe(true);
  275 |     expect(result.format).toBe('json');
  276 |     expect(result).toHaveProperty('totalRecords');
  277 |     expect(result).toHaveProperty('exportUrl');
  278 |     expect(result).toHaveProperty('expiresAt');
  279 |   });
  280 | 
  281 |   test('company data collection works', async ({ page }) => {
  282 |     // Test company data collection
  283 |     const response = await page.request.post('http://localhost:3000/api/data/collect', {
  284 |       headers: { 'Content-Type': 'application/json' },
  285 |       data: {
  286 |         type: 'company',
  287 |         data: {
  288 |           companyName: 'DataSoft Romania',
  289 |           industry: 'Software Development',
  290 |           location: 'Cluj-Napoca, Romania',
  291 |           website: 'https://datasoft.ro',
  292 |           email: 'contact@datasoft.ro',
  293 |           phone: '+40-264-123-456',
  294 |           description: 'Leading software development company in Transylvania',
  295 |           foundedYear: 2018,
  296 |           employeeCount: '50-100',
  297 |           revenue: '$2M-$5M'
  298 |         }
  299 |       }
  300 |     });
  301 | 
  302 |     expect(response.status()).toBe(200);
  303 |     const result = await response.json();
  304 |     expect(result.success).toBe(true);
  305 |     expect(result.type).toBe('company');
  306 |     expect(result.id).toMatch(/^company_\d+_[a-z0-9]+$/);
  307 |   });
  308 | 
  309 |   test('candidate data collection works', async ({ page }) => {
  310 |     // Test candidate data collection
  311 |     const response = await page.request.post('http://localhost:3000/api/data/collect', {
  312 |       headers: { 'Content-Type': 'application/json' },
  313 |       data: {
  314 |         type: 'candidate',
  315 |         data: {
  316 |           personalInfo: {
  317 |             firstName: 'Ion',
  318 |             lastName: 'Popescu',
  319 |             email: 'ion.popescu@email.com',
  320 |             phone: '+40-722-123-456',
  321 |             location: 'Ia\u0219i, Romania'
  322 |           },
  323 |           professionalInfo: {
  324 |             currentPosition: 'Software Developer',
  325 |             experience: '3 years',
  326 |             skills: ['JavaScript', 'React', 'Node.js', 'Python'],
  327 |             education: 'Computer Science Degree',
  328 |             currentSalary: '60000 RON'
  329 |           },
  330 |           applicationInfo: {
  331 |             appliedPosition: 'Full Stack Developer',
  332 |             appliedCompany: 'TechCorp Solutions',
  333 |             appliedDate: '2024-01-20',
  334 |             status: 'under_review'
  335 |           }
  336 |         }
  337 |       }
  338 |     });
  339 | 
> 340 |     expect(response.status()).toBe(200);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  341 |     const result = await response.json();
  342 |     expect(result.success).toBe(true);
  343 |     expect(result.type).toBe('candidate');
  344 |     expect(result.id).toMatch(/^candidate_\d+_[a-z0-9]+$/);
  345 |   });
  346 | 
  347 |   test('data quality scoring works', async ({ page }) => {
  348 |     // Test with high quality data
  349 |     const highQualityResponse = await page.request.post('http://localhost:3000/api/data/validate', {
  350 |       headers: { 'Content-Type': 'application/json' },
  351 |       data: {
  352 |         action: 'validate',
  353 |         type: 'recruitment',
  354 |         data: {
  355 |           companyName: 'High Quality Corp',
  356 |           position: 'Senior Full Stack Developer',
  357 |           location: 'Bucharest, Romania',
  358 |           contactEmail: 'careers@highquality.ro',
  359 |           contactPhone: '+40-21-555-1234',
  360 |           website: 'https://highquality.ro',
  361 |           requirements: ['5+ years experience', 'React/Node.js expertise', 'English proficiency'],
  362 |           postedDate: '2024-01-20',
  363 |           deadline: '2024-02-20',
  364 |           status: 'active',
  365 |           source: 'company_website',
  366 |           confidence: 0.95,
  367 |           notes: 'Comprehensive job description with all details'
  368 |         }
  369 |       }
  370 |     });
  371 | 
  372 |     expect(highQualityResponse.status()).toBe(200);
  373 |     const highQualityResult = await highQualityResponse.json();
  374 |     expect(highQualityResult.result.qualityScore).toBeGreaterThan(0.8);
  375 |     expect(highQualityResult.result.confidence).toBeGreaterThan(0.8);
  376 | 
  377 |     // Test with low quality data
  378 |     const lowQualityResponse = await page.request.post('http://localhost:3000/api/data/validate', {
  379 |       headers: { 'Content-Type': 'application/json' },
  380 |       data: {
  381 |         action: 'validate',
  382 |         type: 'recruitment',
  383 |         data: {
  384 |           companyName: 'Test',
  385 |           position: 'Dev',
  386 |           location: 'Bucharest',
  387 |           contactEmail: 'test',
  388 |           status: 'active',
  389 |           source: 'website'
  390 |         }
  391 |       }
  392 |     });
  393 | 
  394 |     expect(lowQualityResponse.status()).toBe(200);
  395 |     const lowQualityResult = await lowQualityResponse.json();
  396 |     expect(lowQualityResult.result.qualityScore).toBeLessThan(0.6);
  397 |     expect(lowQualityResult.result.warnings.length).toBeGreaterThan(0);
  398 |   });
  399 | 
  400 |   test('system handles concurrent requests', async ({ page }) => {
  401 |     // Test concurrent data collection
  402 |     const promises = [];
  403 |     
  404 |     for (let i = 0; i < 5; i++) {
  405 |       promises.push(
  406 |         page.request.post('http://localhost:3000/api/data/collect', {
  407 |           headers: { 'Content-Type': 'application/json' },
  408 |           data: {
  409 |             type: 'recruitment',
  410 |             data: {
  411 |               companyName: `Concurrent Test Corp ${i}`,
  412 |               position: `Developer ${i}`,
  413 |               location: 'Bucharest, Romania',
  414 |               contactEmail: `test${i}@concurrent.ro`,
  415 |               contactPhone: '+40-21-555-1234',
  416 |               website: `https://concurrent${i}.ro`,
  417 |               requirements: ['JavaScript experience'],
  418 |               postedDate: '2024-01-20',
  419 |               deadline: '2024-02-20',
  420 |               status: 'active',
  421 |               source: 'company_website',
  422 |               confidence: 0.85
  423 |             }
  424 |           }
  425 |         })
  426 |       );
  427 |     }
  428 | 
  429 |     const responses = await Promise.all(promises);
  430 |     
  431 |     // All requests should succeed
  432 |     responses.forEach(response => {
  433 |       expect(response.status()).toBe(200);
  434 |     });
  435 | 
  436 |     // Check analytics to see all data was collected
  437 |     const analyticsResponse = await page.request.post('http://localhost:3000/api/data/analytics', {
  438 |       headers: { 'Content-Type': 'application/json' },
  439 |       data: {
  440 |         type: 'overview',
```