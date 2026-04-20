# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: autonomous-agent.spec.ts >> Autonomous Agent Performance >> agent status updates in real-time
- Location: tests\autonomous-agent.spec.ts:295:7

# Error details

```
TimeoutError: page.click: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Start Agent")')
    - locator resolved to <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 flex-1">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    11 × waiting for element to be visible, enabled and stable
       - element is not enabled
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
          - generic [ref=e23]: thinking
          - generic [ref=e24]: TrustHire Sentinel
      - generic [ref=e25]:
        - generic [ref=e26]:
          - heading "Tasks Completed" [level=3] [ref=e28]
          - generic [ref=e29]:
            - generic [ref=e30]: "1"
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
            - generic [ref=e48]: 2s
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
                - button "Start Agent" [disabled]:
                  - img
                  - text: Start Agent
                - button "Stop Agent" [ref=e63] [cursor=pointer]:
                  - img [ref=e64]
                  - text: Stop Agent
              - generic [ref=e67]:
                - heading "Add Task" [level=4] [ref=e68]
                - generic [ref=e69]:
                  - generic [ref=e70]:
                    - text: Task Type
                    - combobox [ref=e71]:
                      - option "Security Analysis" [selected]
                      - option "Threat Hunting"
                      - option "Documentation"
                      - option "Learning"
                      - option "Reporting"
                  - generic [ref=e72]:
                    - text: Priority
                    - combobox [ref=e73]:
                      - option "Low"
                      - option "Medium" [selected]
                      - option "High"
                  - button "Add Task" [ref=e75] [cursor=pointer]:
                    - img [ref=e76]
                    - text: Add Task
              - generic [ref=e77]:
                - heading "Custom Command" [level=4] [ref=e78]
                - generic [ref=e79]:
                  - textbox "Enter custom command..." [ref=e80]
                  - button "Execute" [disabled]:
                    - img
                    - text: Execute
  - generic [ref=e82]:
    - button "Tools" [ref=e83] [cursor=pointer]:
      - img [ref=e85]
      - generic [ref=e87]: Tools
    - link "Home" [ref=e88]:
      - /url: /
      - img [ref=e90]
      - generic [ref=e93]: Home
    - link "Patterns" [ref=e94]:
      - /url: /patterns
      - img [ref=e96]
      - generic [ref=e100]: Patterns
    - link "Sandbox" [ref=e101]:
      - /url: /sandbox
      - img [ref=e103]
      - generic [ref=e105]: Sandbox
    - link "Monitor" [ref=e106]:
      - /url: /monitoring
      - img [ref=e108]
      - generic [ref=e110]: Monitor
    - button "More" [ref=e111] [cursor=pointer]:
      - img [ref=e113]
      - generic [ref=e114]: More
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
  - alert [ref=e116]
```

# Test source

```ts
  207 |     });
  208 |     expect(response.status()).toBe(200);
  209 |     
  210 |     const data = await response.json();
  211 |     expect(data.success).toBe(true);
  212 |     expect(data.data.message).toContain('personality updated');
  213 |   });
  214 | });
  215 | 
  216 | test.describe('Autonomous Agent Integration', () => {
  217 |   test('agent integrates with Mistral AI', async ({ page }) => {
  218 |     await page.goto('/agent');
  219 |     
  220 |     // Start the agent
  221 |     await page.click('button:has-text("Start Agent")');
  222 |     
  223 |     // Wait for agent to initialize
  224 |     await page.waitForTimeout(3000);
  225 |     
  226 |     // Add a task that requires AI analysis
  227 |     await page.click('text=Add Task');
  228 |     await page.selectOption('select[name="taskType"]', 'security_analysis');
  229 |     await page.selectOption('select[name="priority"]', 'high');
  230 |     await page.click('button:has-text("Add Task")');
  231 |     
  232 |     // Wait for task to be processed
  233 |     await page.waitForTimeout(5000);
  234 |     
  235 |     // Check if agent status changed
  236 |     const status = page.locator('[data-testid="agent-status"]');
  237 |     await expect(status).toBeVisible();
  238 |   });
  239 | 
  240 |   test('agent memory systems work', async ({ page }) => {
  241 |     await page.goto('/agent');
  242 |     await page.click('text=Memory');
  243 |     
  244 |     // Check if memory sections are visible
  245 |     await expect(page.locator('text=Short-term Memory')).toBeVisible();
  246 |     await expect(page.locator('text=Long-term Memory')).toBeVisible();
  247 |     await expect(page.locator('text=Episodic Memory')).toBeVisible();
  248 |     
  249 |     // Check if memory statistics are displayed
  250 |     await expect(page.locator('text=Conversations:')).toBeVisible();
  251 |     await expect(page.locator('text=Current Tasks:')).toBeVisible();
  252 |     await expect(page.locator('text=Recent Findings:')).toBeVisible();
  253 |   });
  254 | 
  255 |   test('agent learning functionality works', async ({ page }) => {
  256 |     await page.goto('/agent');
  257 |     
  258 |     // Add a learning task
  259 |     await page.click('text=Add Task');
  260 |     await page.selectOption('select[name="taskType"]', 'learning');
  261 |     await page.selectOption('select[name="priority"]', 'medium');
  262 |     await page.click('button:has-text("Add Task")');
  263 |     
  264 |     // Wait for learning to process
  265 |     await page.waitForTimeout(5000);
  266 |     
  267 |     // Check analytics for learning events
  268 |     await page.click('text=Analytics');
  269 |     await expect(page.locator('text=Learning Events')).toBeVisible();
  270 |   });
  271 | 
  272 |   test('agent error handling works', async ({ page }) => {
  273 |     await page.goto('/agent');
  274 |     
  275 |     // Try to add invalid task
  276 |     await page.click('text=Add Task');
  277 |     await page.click('button:has-text("Add Task")');
  278 |     
  279 |     // Should show validation error
  280 |     await expect(page.locator('text=Task type is required')).toBeVisible();
  281 |   });
  282 | });
  283 | 
  284 | test.describe('Autonomous Agent Performance', () => {
  285 |   test('agent page loads quickly', async ({ page }) => {
  286 |     const startTime = Date.now();
  287 |     await page.goto('/agent');
  288 |     await page.waitForLoadState('networkidle');
  289 |     const loadTime = Date.now() - startTime;
  290 |     
  291 |     // Page should load within 3 seconds
  292 |     expect(loadTime).toBeLessThan(3000);
  293 |   });
  294 | 
  295 |   test('agent status updates in real-time', async ({ page }) => {
  296 |     await page.goto('/agent');
  297 |     
  298 |     // Start monitoring status updates
  299 |     let statusCount = 0;
  300 |     page.on('response', response => {
  301 |       if (response.url().includes('/api/ai/agent')) {
  302 |         statusCount++;
  303 |       }
  304 |     });
  305 |     
  306 |     // Start agent and monitor
> 307 |     await page.click('button:has-text("Start Agent")');
      |                ^ TimeoutError: page.click: Timeout 10000ms exceeded.
  308 |     await page.waitForTimeout(10000);
  309 |     
  310 |     // Should have received status updates
  311 |     expect(statusCount).toBeGreaterThan(0);
  312 |   });
  313 | 
  314 |   test('agent handles multiple concurrent tasks', async ({ page }) => {
  315 |     await page.goto('/agent');
  316 |     
  317 |     // Add multiple tasks
  318 |     const tasks = [
  319 |       { type: 'security_analysis', priority: 'high' },
  320 |       { type: 'threat_hunting', priority: 'medium' },
  321 |       { type: 'documentation', priority: 'low' },
  322 |       { type: 'learning', priority: 'medium' }
  323 |     ];
  324 |     
  325 |     for (const task of tasks) {
  326 |       await page.click('text=Add Task');
  327 |       await page.selectOption('select[name="taskType"]', task.type);
  328 |       await page.selectOption('select[name="priority"]', task.priority);
  329 |       await page.click('button:has-text("Add Task")');
  330 |       await page.waitForTimeout(1000);
  331 |     }
  332 |     
  333 |     // Check if all tasks are queued
  334 |     await page.waitForTimeout(5000);
  335 |     await expect(page.locator('text=Current Tasks:')).toBeVisible();
  336 |   });
  337 | });
  338 | 
```