# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: autonomous-agent.spec.ts >> Autonomous Agent >> agent capabilities are displayed
- Location: tests\autonomous-agent.spec.ts:78:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Capabilities')
Expected: visible
Error: strict mode violation: locator('text=Capabilities') resolved to 2 elements:
    1) <p class="text-xl text-gray-600 max-w-2xl mx-auto">Advanced AI agent with personality, memory, and a…</p> aka getByText('Advanced AI agent with personality, memory, and autonomous security analysis')
    2) <p class="text-muted-foreground">Advanced AI agent with personality, memory, and a…</p> aka getByText('Advanced AI agent with personality, memory, and autonomous capabilities')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Capabilities')

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
  - generic [ref=e13]:
    - generic [ref=e14]:
      - heading "Autonomous AI Agent" [level=1] [ref=e15]
      - paragraph [ref=e16]: Advanced AI agent with personality, memory, and autonomous security analysis capabilities
    - generic [ref=e17]:
      - generic [ref=e18]:
        - generic [ref=e19]:
          - heading "Autonomous AI Agent" [level=2] [ref=e20]
          - paragraph [ref=e21]: Advanced AI agent with personality, memory, and autonomous capabilities
        - generic [ref=e22]:
          - generic [ref=e23]: idle
          - generic [ref=e24]: TrustHire Sentinel
      - generic [ref=e25]:
        - generic [ref=e26]:
          - heading "Tasks Completed" [level=3] [ref=e28]
          - generic [ref=e29]:
            - generic [ref=e30]: "0"
            - paragraph [ref=e31]: autonomous tasks
        - generic [ref=e32]:
          - heading "Analyses Performed" [level=3] [ref=e34]
          - generic [ref=e35]:
            - generic [ref=e36]: "0"
            - paragraph [ref=e37]: security analyses
        - generic [ref=e38]:
          - heading "Discoveries Made" [level=3] [ref=e40]
          - generic [ref=e41]:
            - generic [ref=e42]: "0"
            - paragraph [ref=e43]: new findings
        - generic [ref=e44]:
          - heading "Uptime" [level=3] [ref=e46]
          - generic [ref=e47]:
            - generic [ref=e48]: 0s
            - paragraph [ref=e49]: active time
      - generic [ref=e50]:
        - tablist [ref=e51]:
          - tab "Control" [selected] [ref=e52] [cursor=pointer]
          - tab "Personality" [ref=e53] [cursor=pointer]
          - tab "Memory" [ref=e54] [cursor=pointer]
          - tab "Analytics" [ref=e55] [cursor=pointer]
        - tabpanel "Control" [ref=e56]:
          - generic [ref=e57]:
            - generic [ref=e58]:
              - heading "Agent Control" [level=3] [ref=e59]
              - paragraph [ref=e60]: Start, stop, and control the autonomous agent
            - generic [ref=e61]:
              - generic [ref=e62]:
                - button "Start Agent" [ref=e63] [cursor=pointer]:
                  - img [ref=e64]
                  - text: Start Agent
                - button "Stop Agent" [disabled]:
                  - img
                  - text: Stop Agent
              - generic [ref=e66]:
                - heading "Add Task" [level=4] [ref=e67]
                - generic [ref=e68]:
                  - generic [ref=e69]:
                    - text: Task Type
                    - combobox [ref=e70]:
                      - option "Security Analysis" [selected]
                      - option "Threat Hunting"
                      - option "Documentation"
                      - option "Learning"
                      - option "Reporting"
                  - generic [ref=e71]:
                    - text: Priority
                    - combobox [ref=e72]:
                      - option "Low"
                      - option "Medium" [selected]
                      - option "High"
                  - button "Add Task" [ref=e74] [cursor=pointer]:
                    - img [ref=e75]
                    - text: Add Task
              - generic [ref=e76]:
                - heading "Custom Command" [level=4] [ref=e77]
                - generic [ref=e78]:
                  - textbox "Enter custom command..." [ref=e79]
                  - button "Execute" [disabled]:
                    - img
                    - text: Execute
  - generic [ref=e81]:
    - button "Tools" [ref=e82] [cursor=pointer]:
      - img [ref=e84]
      - generic [ref=e86]: Tools
    - link "Home" [ref=e87]:
      - /url: /
      - img [ref=e89]
      - generic [ref=e92]: Home
    - link "Patterns" [ref=e93]:
      - /url: /patterns
      - img [ref=e95]
      - generic [ref=e99]: Patterns
    - link "Sandbox" [ref=e100]:
      - /url: /sandbox
      - img [ref=e102]
      - generic [ref=e104]: Sandbox
    - link "Monitor" [ref=e105]:
      - /url: /monitoring
      - img [ref=e107]
      - generic [ref=e109]: Monitor
    - button "More" [ref=e110] [cursor=pointer]:
      - img [ref=e112]
      - generic [ref=e113]: More
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
  - alert [ref=e115]
```

# Test source

```ts
  1   | /**
  2   |  * Autonomous Agent Tests
  3   |  * Tests for the autonomous AI agent functionality
  4   |  */
  5   | 
  6   | import { test, expect } from '@playwright/test';
  7   | 
  8   | test.describe('Autonomous Agent', () => {
  9   |   test.beforeEach(async ({ page }) => {
  10  |     await page.goto('/agent');
  11  |   });
  12  | 
  13  |   test('agent page loads correctly', async ({ page }) => {
  14  |     await expect(page).toHaveTitle(/TrustHire/);
  15  |     await expect(page.locator('h1')).toContainText('Autonomous AI Agent');
  16  |     await expect(page.locator('text=Advanced AI agent with personality, memory, and autonomous capabilities')).toBeVisible();
  17  |   });
  18  | 
  19  |   test('agent control panel is visible', async ({ page }) => {
  20  |     await expect(page.locator('text=Agent Control')).toBeVisible();
  21  |     await expect(page.locator('button:has-text("Start Agent")')).toBeVisible();
  22  |     await expect(page.locator('button:has-text("Stop Agent")')).toBeVisible();
  23  |   });
  24  | 
  25  |   test('agent personality tab works', async ({ page }) => {
  26  |     await page.click('text=Personality');
  27  |     await expect(page.locator('text=Agent Personality')).toBeVisible();
  28  |     await expect(page.locator('text=Basic Information')).toBeVisible();
  29  |     await expect(page.locator('text=Personality Traits')).toBeVisible();
  30  |   });
  31  | 
  32  |   test('agent memory tab works', async ({ page }) => {
  33  |     await page.click('text=Memory');
  34  |     await expect(page.locator('text=Agent Memory')).toBeVisible();
  35  |     await expect(page.locator('text=Short-term Memory')).toBeVisible();
  36  |     await expect(page.locator('text=Long-term Memory')).toBeVisible();
  37  |     await expect(page.locator('text=Episodic Memory')).toBeVisible();
  38  |   });
  39  | 
  40  |   test('agent analytics tab works', async ({ page }) => {
  41  |     await page.click('text=Analytics');
  42  |     await expect(page.locator('text=Agent Analytics')).toBeVisible();
  43  |     await expect(page.locator('text=Performance Metrics')).toBeVisible();
  44  |     await expect(page.locator('text=Activity Timeline')).toBeVisible();
  45  |   });
  46  | 
  47  |   test('agent status displays correctly', async ({ page }) => {
  48  |     // Check if status badges are visible
  49  |     await expect(page.locator('[data-testid="agent-status"]')).toBeVisible();
  50  |     await expect(page.locator('[data-testid="agent-name"]')).toBeVisible();
  51  |   });
  52  | 
  53  |   test('add task functionality works', async ({ page }) => {
  54  |     await page.click('text=Add Task');
  55  |     
  56  |     // Check if task type dropdown is visible
  57  |     await expect(page.locator('select[name="taskType"]')).toBeVisible();
  58  |     
  59  |     // Check if priority dropdown is visible
  60  |     await expect(page.locator('select[name="priority"]')).toBeVisible();
  61  |     
  62  |     // Check if add button is visible
  63  |     await expect(page.locator('button:has-text("Add Task")')).toBeVisible();
  64  |   });
  65  | 
  66  |   test('custom command input works', async ({ page }) => {
  67  |     await expect(page.locator('input[placeholder*="custom command"]')).toBeVisible();
  68  |     await expect(page.locator('button:has-text("Execute")')).toBeVisible();
  69  |   });
  70  | 
  71  |   test('agent statistics display', async ({ page }) => {
  72  |     await expect(page.locator('text=Tasks Completed')).toBeVisible();
  73  |     await expect(page.locator('text=Analyses Performed')).toBeVisible();
  74  |     await expect(page.locator('text=Discoveries Made')).toBeVisible();
  75  |     await expect(page.locator('text=Uptime')).toBeVisible();
  76  |   });
  77  | 
  78  |   test('agent capabilities are displayed', async ({ page }) => {
  79  |     await page.click('text=Personality');
> 80  |     await expect(page.locator('text=Capabilities')).toBeVisible();
      |                                                     ^ Error: expect(locator).toBeVisible() failed
  81  |     
  82  |     // Check for specific capabilities
  83  |     await expect(page.locator('text=autonomous_analysis')).toBeVisible();
  84  |     await expect(page.locator('text=threat_detection')).toBeVisible();
  85  |     await expect(page.locator('text=vulnerability_scanning')).toBeVisible();
  86  |   });
  87  | });
  88  | 
  89  | test.describe('Autonomous Agent API', () => {
  90  |   test('agent status endpoint responds', async ({ request }) => {
  91  |     const response = await request.get('/api/ai/agent?view=status');
  92  |     expect(response.status()).toBe(200);
  93  |     
  94  |     const data = await response.json();
  95  |     expect(data.success).toBe(true);
  96  |     expect(data.data.agent).toBeDefined();
  97  |     expect(data.data.memory).toBeDefined();
  98  |   });
  99  | 
  100 |   test('agent personality endpoint responds', async ({ request }) => {
  101 |     const response = await request.get('/api/ai/agent?view=personality');
  102 |     expect(response.status()).toBe(200);
  103 |     
  104 |     const data = await response.json();
  105 |     expect(data.success).toBe(true);
  106 |     expect(data.data.personality).toBeDefined();
  107 |     expect(data.data.soul).toBeDefined();
  108 |     expect(data.data.capabilities).toBeDefined();
  109 |   });
  110 | 
  111 |   test('agent memory endpoint responds', async ({ request }) => {
  112 |     const response = await request.get('/api/ai/agent?view=memory');
  113 |     expect(response.status()).toBe(200);
  114 |     
  115 |     const data = await response.json();
  116 |     expect(data.success).toBe(true);
  117 |     expect(data.data.memory).toBeDefined();
  118 |     expect(data.data.statistics).toBeDefined();
  119 |   });
  120 | 
  121 |   test('agent statistics endpoint responds', async ({ request }) => {
  122 |     const response = await request.get('/api/ai/agent?view=statistics');
  123 |     expect(response.status()).toBe(200);
  124 |     
  125 |     const data = await response.json();
  126 |     expect(data.success).toBe(true);
  127 |     expect(data.data.statistics).toBeDefined();
  128 |     expect(data.data.performance).toBeDefined();
  129 |   });
  130 | 
  131 |   test('agent capabilities endpoint responds', async ({ request }) => {
  132 |     const response = await request.get('/api/ai/agent?view=capabilities');
  133 |     expect(response.status()).toBe(200);
  134 |     
  135 |     const data = await response.json();
  136 |     expect(data.success).toBe(true);
  137 |     expect(data.data.capabilities).toBeDefined();
  138 |     expect(data.data.supportedTaskTypes).toBeDefined();
  139 |   });
  140 | 
  141 |   test('start agent endpoint works', async ({ request }) => {
  142 |     const response = await request.post('/api/ai/agent', {
  143 |       data: { action: 'start' }
  144 |     });
  145 |     expect(response.status()).toBe(200);
  146 |     
  147 |     const data = await response.json();
  148 |     expect(data.success).toBe(true);
  149 |     expect(data.data.message).toContain('started successfully');
  150 |   });
  151 | 
  152 |   test('stop agent endpoint works', async ({ request }) => {
  153 |     const response = await request.post('/api/ai/agent', {
  154 |       data: { action: 'stop' }
  155 |     });
  156 |     expect(response.status()).toBe(200);
  157 |     
  158 |     const data = await response.json();
  159 |     expect(data.success).toBe(true);
  160 |     expect(data.data.message).toContain('stopped successfully');
  161 |   });
  162 | 
  163 |   test('add task endpoint works', async ({ request }) => {
  164 |     const response = await request.post('/api/ai/agent', {
  165 |       data: {
  166 |         action: 'add_task',
  167 |         taskType: 'security_analysis',
  168 |         priority: 'medium',
  169 |         data: { timestamp: new Date().toISOString() }
  170 |       }
  171 |     });
  172 |     expect(response.status()).toBe(200);
  173 |     
  174 |     const data = await response.json();
  175 |     expect(data.success).toBe(true);
  176 |     expect(data.data.taskId).toBeDefined();
  177 |     expect(data.data.message).toContain('Task added');
  178 |   });
  179 | 
  180 |   test('custom command endpoint works', async ({ request }) => {
```