# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: data-system.spec.ts >> TrustHire Data System - Real Data Testing >> search API finds collected data
- Location: tests\data-system.spec.ts:158:7

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
  121 |     expect(result.success).toBe(true);
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
> 185 |     expect(response.status()).toBe(200);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
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
  222 |     });
  223 | 
  224 |     expect(response.status()).toBe(200);
  225 |     const result = await response.json();
  226 |     expect(result.success).toBe(true);
  227 |     expect(result.action).toBe('clean');
  228 |     expect(result.type).toBe('recruitment');
  229 |     expect(result.result).toHaveProperty('processed');
  230 |     expect(result.result).toHaveProperty('duplicates');
  231 |     expect(result.result).toHaveProperty('standardized');
  232 |     expect(result.result).toHaveProperty('qualityIssues');
  233 |     expect(result.result).toHaveProperty('cleaned');
  234 |   });
  235 | 
  236 |   test('export API provides data download', async ({ page }) => {
  237 |     // Add some data first
  238 |     await page.request.post('http://localhost:3000/api/data/collect', {
  239 |       headers: { 'Content-Type': 'application/json' },
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
```