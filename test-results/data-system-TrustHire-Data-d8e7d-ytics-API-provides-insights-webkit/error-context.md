# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: data-system.spec.ts >> TrustHire Data System - Real Data Testing >> analytics API provides insights
- Location: tests\data-system.spec.ts:83:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
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
        - link "AI Agent" [ref=e39]:
          - /url: /agent
          - img [ref=e40]
          - generic [ref=e50]: AI Agent
        - link "Start Assessment" [ref=e51]:
          - /url: /assess
          - img [ref=e52]
          - generic [ref=e54]: Start Assessment
  - generic [ref=e55]:
    - generic [ref=e58]:
      - generic [ref=e59]:
        - img [ref=e60]
        - generic [ref=e62]: LIVE PROTECTION
      - heading "Stop Recruitment Scam Attacks" [level=1] [ref=e63]:
        - text: Stop Recruitment
        - generic [ref=e64]: Scam Attacks
      - paragraph [ref=e65]: Web3's most advanced security tool for detecting fake recruiters, malicious repositories, and job scams before they compromise your development environment.
      - generic [ref=e66]:
        - link "Start Free Assessment" [ref=e67]:
          - /url: /assess
          - img [ref=e68]
          - text: Start Free Assessment
          - img [ref=e70]
        - button "How It Works" [ref=e72] [cursor=pointer]:
          - img [ref=e73]
          - text: How It Works
      - generic [ref=e76]:
        - generic [ref=e77]:
          - generic [ref=e78]: "0"
          - generic [ref=e79]: Assessments Run
        - generic [ref=e80]:
          - generic [ref=e81]: "0"
          - generic [ref=e82]: Threats Blocked
        - generic [ref=e83]:
          - generic [ref=e84]: "0"
          - generic [ref=e85]: Active Users
        - generic [ref=e86]:
          - generic [ref=e87]: 2.3s
          - generic [ref=e88]: Avg Response
    - generic [ref=e91]:
      - generic [ref=e92]:
        - heading "How Recruitment Scams Work" [level=2] [ref=e93]
        - paragraph [ref=e94]: Understanding the attack flow is your first line of defense
      - generic [ref=e95]:
        - generic [ref=e96]:
          - generic [ref=e97]: LinkedIn DM
          - img [ref=e98]
        - generic [ref=e100]:
          - generic [ref=e101]: Job Discussion
          - img [ref=e102]
        - generic [ref=e104]:
          - generic [ref=e105]: "\"Technical Review\" Repo"
          - img [ref=e106]
        - generic [ref=e108]:
          - generic [ref=e109]: npm install
          - img [ref=e110]
        - generic [ref=e112]:
          - generic [ref=e113]: Postinstall Script
          - img [ref=e114]
        - generic [ref=e117]: .env Exfiltrated
      - generic [ref=e118]:
        - generic [ref=e119]:
          - img [ref=e120]
          - text: Critical Risk
        - paragraph [ref=e122]: One malicious npm install can compromise your entire development environment, exposing API keys, wallet credentials, and sensitive data.
    - generic [ref=e124]:
      - generic [ref=e125]:
        - heading "Security Tools at Your Fingertips" [level=2] [ref=e126]
        - paragraph [ref=e127]: Professional-grade security analysis, designed for developers
      - generic [ref=e128]:
        - generic [ref=e130]:
          - img [ref=e132]
          - generic [ref=e135]:
            - heading "GitHub Repository Scan" [level=3] [ref=e136]
            - paragraph [ref=e137]: Instant analysis of any repository for malicious code patterns
            - generic [ref=e138]:
              - generic [ref=e139]: 2.3s avg
              - link "Try Now" [ref=e140]:
                - /url: /scan/github
                - text: Try Now
                - img [ref=e141]
        - generic [ref=e144]:
          - img [ref=e146]
          - generic [ref=e151]:
            - heading "LinkedIn Profile Check" [level=3] [ref=e152]
            - paragraph [ref=e153]: Verify recruiter authenticity and detect fake profiles
            - generic [ref=e154]:
              - generic [ref=e155]: 15+ signals
              - link "Try Now" [ref=e156]:
                - /url: /scan/linkedin
                - text: Try Now
                - img [ref=e157]
        - generic [ref=e160]:
          - img [ref=e162]
          - generic [ref=e165]:
            - heading "Reverse Image Search" [level=3] [ref=e166]
            - paragraph [ref=e167]: Check profile photos against known fakes and stock images
            - generic [ref=e168]:
              - generic [ref=e169]: 100M+ images
              - link "Try Now" [ref=e170]:
                - /url: /scan/image
                - text: Try Now
                - img [ref=e171]
        - generic [ref=e174]:
          - img [ref=e176]
          - generic [ref=e178]:
            - heading "Full Assessment" [level=3] [ref=e179]
            - paragraph [ref=e180]: Comprehensive security evaluation for complete peace of mind
            - generic [ref=e181]:
              - generic [ref=e182]: 5min total
              - link "Try Now" [ref=e183]:
                - /url: /assess
                - text: Try Now
                - img [ref=e184]
        - generic [ref=e187]:
          - img [ref=e189]
          - generic [ref=e199]:
            - heading "AI Agent" [level=3] [ref=e200]
            - paragraph [ref=e201]: Autonomous security agent with personality and learning capabilities
            - generic [ref=e202]:
              - generic [ref=e203]: Always learning
              - link "Try Now" [ref=e204]:
                - /url: /agent
                - text: Try Now
                - img [ref=e205]
    - generic [ref=e208]:
      - generic [ref=e209]:
        - heading "Why Developers Trust TrustHire" [level=2] [ref=e210]
        - paragraph [ref=e211]: Built by security experts, for the Web3 ecosystem
      - generic [ref=e212]:
        - generic [ref=e213]:
          - img [ref=e215]
          - generic [ref=e218]:
            - heading "Static Analysis Only" [level=3] [ref=e219]
            - paragraph [ref=e220]: We never execute code from analyzed repositories. All scans are completely safe.
            - generic [ref=e221]: Zero risk to your system
        - generic [ref=e222]:
          - img [ref=e224]
          - generic [ref=e226]:
            - heading "Lightning Fast" [level=3] [ref=e227]
            - paragraph [ref=e228]: Get comprehensive security assessments in under 2 minutes, not hours.
            - generic [ref=e229]: Save time, stay secure
        - generic [ref=e230]:
          - img [ref=e232]
          - generic [ref=e234]:
            - heading "Risk Scoring" [level=3] [ref=e235]
            - paragraph [ref=e236]: Clear, actionable risk scores with detailed explanations and recommendations.
            - generic [ref=e237]: Make informed decisions
        - generic [ref=e238]:
          - img [ref=e240]
          - generic [ref=e245]:
            - heading "Community Powered" [level=3] [ref=e246]
            - paragraph [ref=e247]: Leverage collective intelligence from thousands of security assessments.
            - generic [ref=e248]: Stronger protection together
    - generic [ref=e251]:
      - heading "Got a Repo Link from a Recruiter?" [level=2] [ref=e252]
      - paragraph [ref=e253]: Run a comprehensive security assessment in under 2 minutes before you clone anything. It could save your entire development environment.
      - generic [ref=e254]:
        - link "Run Free Assessment" [ref=e255]:
          - /url: /assess
          - img [ref=e256]
          - text: Run Free Assessment
          - img [ref=e258]
        - link "View Dashboard" [ref=e260]:
          - /url: /dashboard
          - img [ref=e261]
          - text: View Dashboard
      - paragraph [ref=e263]: TrustHire provides risk signals, not legal verdicts. See disclaimer for details.
```

# Test source

```ts
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
  117 |     });
  118 | 
  119 |     expect(response.status()).toBe(200);
  120 |     const result = await response.json();
> 121 |     expect(result.success).toBe(true);
      |                            ^ Error: expect(received).toBe(expected) // Object.is equality
  122 |     expect(result.type).toBe('overview');
  123 |     expect(result.totalRecords).toBeGreaterThanOrEqual(1);
  124 |     expect(result.metrics).toHaveProperty('totalRecords');
  125 |     expect(result.metrics).toHaveProperty('averageConfidence');
  126 |     expect(result.metrics).toHaveProperty('qualityScore');
  127 |   });
  128 | 
  129 |   test('health check API monitors system', async ({ page }) => {
  130 |     // Test health check endpoint
  131 |     const response = await page.request.get('http://localhost:3000/api/health/detailed');
  132 |     
  133 |     expect(response.status()).toBe(200);
  134 |     const result = await response.json();
  135 |     expect(result).toHaveProperty('status');
  136 |     expect(result).toHaveProperty('timestamp');
  137 |     expect(result).toHaveProperty('uptime');
  138 |     expect(result).toHaveProperty('memory');
  139 |     expect(result).toHaveProperty('apis');
  140 |     expect(result).toHaveProperty('database');
  141 |     
  142 |     // Check memory structure
  143 |     expect(result.memory).toHaveProperty('used');
  144 |     expect(result.memory).toHaveProperty('total');
  145 |     expect(result.memory).toHaveProperty('percentage');
  146 |     
  147 |     // Check API status
  148 |     expect(result.apis).toHaveProperty('collect');
  149 |     expect(result.apis).toHaveProperty('validate');
  150 |     expect(result.apis).toHaveProperty('analytics');
  151 |     expect(result.apis).toHaveProperty('export');
  152 |     
  153 |     // Check database status
  154 |     expect(result.database).toHaveProperty('connected');
  155 |     expect(result.database).toHaveProperty('records');
  156 |   });
  157 | 
  158 |   test('search API finds collected data', async ({ page }) => {
  159 |     // First, add searchable data
  160 |     await page.request.post('http://localhost:3000/api/data/collect', {
  161 |       headers: { 'Content-Type': 'application/json' },
  162 |       data: {
  163 |         type: 'recruitment',
  164 |         data: {
  165 |           companyName: 'Search Test Company',
  166 |           position: 'React Developer',
  167 |           location: 'Ia\u0219i, Romania',
  168 |           contactEmail: 'react@search-test.ro',
  169 |           contactPhone: '+40-232-123-456',
  170 |           website: 'https://search-test.ro',
  171 |           requirements: ['React expertise', 'TypeScript knowledge'],
  172 |           postedDate: '2024-01-20',
  173 |           deadline: '2024-02-20',
  174 |           status: 'active',
  175 |           source: 'company_website',
  176 |           confidence: 0.92,
  177 |           notes: 'Frontend development position'
  178 |         }
  179 |       }
  180 |     });
  181 | 
  182 |     // Test search endpoint
  183 |     const response = await page.request.get('http://localhost:3000/api/data/collect?q=react&type=recruitment&limit=10');
  184 |     
  185 |     expect(response.status()).toBe(200);
  186 |     const result = await response.json();
  187 |     expect(result).toHaveProperty('results');
  188 |     expect(result).toHaveProperty('total');
  189 |     expect(result).toHaveProperty('query');
  190 |     expect(result).toHaveProperty('type');
  191 |     expect(result).toHaveProperty('limit');
  192 |     
  193 |     // Check results structure
  194 |     if (result.results.length > 0) {
  195 |       expect(result.results[0]).toHaveProperty('id');
  196 |       expect(result.results[0]).toHaveProperty('type');
  197 |       expect(result.results[0]).toHaveProperty('searchable');
  198 |     }
  199 |   });
  200 | 
  201 |   test('data cleaning API processes data correctly', async ({ page }) => {
  202 |     // Test data cleaning endpoint
  203 |     const response = await page.request.post('http://localhost:3000/api/data/validate', {
  204 |       headers: { 'Content-Type': 'application/json' },
  205 |       data: {
  206 |         action: 'clean',
  207 |         type: 'recruitment',
  208 |         data: {
  209 |           companyName: '  Test Company  ',
  210 |           position: 'software developer',
  211 |           location: 'bucharest, romania',
  212 |           contactEmail: 'test@company.com',
  213 |           contactPhone: '+40-21-123-4567',
  214 |           website: 'https://test.com',
  215 |           requirements: ['javascript experience'],
  216 |           postedDate: '2024-01-20',
  217 |           deadline: '2024-02-20',
  218 |           status: 'active',
  219 |           source: 'company_website'
  220 |         }
  221 |       }
```