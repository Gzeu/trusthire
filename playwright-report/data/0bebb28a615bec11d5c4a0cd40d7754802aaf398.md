# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: autonomous-agent.spec.ts >> Autonomous Agent Integration >> agent error handling works
- Location: tests\autonomous-agent.spec.ts:272:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Task type is required')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Task type is required')

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
  - generic [ref=e48]:
    - generic [ref=e49]:
      - heading "Autonomous AI Agent" [level=1] [ref=e50]
      - paragraph [ref=e51]: Advanced AI agent with personality, memory, and autonomous security analysis capabilities
    - generic [ref=e52]:
      - generic [ref=e53]:
        - generic [ref=e54]:
          - heading "Autonomous AI Agent" [level=2] [ref=e55]
          - paragraph [ref=e56]: Advanced AI agent with personality, memory, and autonomous capabilities
        - generic [ref=e57]:
          - generic [ref=e58]: thinking
          - generic [ref=e59]: TrustHire Sentinel
      - generic [ref=e60]:
        - generic [ref=e61]:
          - heading "Tasks Completed" [level=3] [ref=e63]
          - generic [ref=e64]:
            - generic [ref=e65]: "1"
            - paragraph [ref=e66]: autonomous tasks
        - generic [ref=e67]:
          - heading "Analyses Performed" [level=3] [ref=e69]
          - generic [ref=e70]:
            - generic [ref=e71]: "0"
            - paragraph [ref=e72]: security analyses
        - generic [ref=e73]:
          - heading "Discoveries Made" [level=3] [ref=e75]
          - generic [ref=e76]:
            - generic [ref=e77]: "0"
            - paragraph [ref=e78]: new findings
        - generic [ref=e79]:
          - heading "Uptime" [level=3] [ref=e81]
          - generic [ref=e82]:
            - generic [ref=e83]: 2s
            - paragraph [ref=e84]: active time
      - generic [ref=e85]:
        - tablist [ref=e86]:
          - tab "Control" [selected] [ref=e87] [cursor=pointer]
          - tab "Personality" [ref=e88] [cursor=pointer]
          - tab "Memory" [ref=e89] [cursor=pointer]
          - tab "Analytics" [ref=e90] [cursor=pointer]
        - tabpanel "Control" [ref=e91]:
          - generic [ref=e92]:
            - generic [ref=e93]:
              - heading "Agent Control" [level=3] [ref=e94]
              - paragraph [ref=e95]: Start, stop, and control the autonomous agent
            - generic [ref=e96]:
              - generic [ref=e97]:
                - button "Start Agent" [disabled]:
                  - img
                  - text: Start Agent
                - button "Stop Agent" [ref=e98] [cursor=pointer]:
                  - img [ref=e99]
                  - text: Stop Agent
              - generic [ref=e102]:
                - heading "Add Task" [level=4] [ref=e103]
                - generic [ref=e104]:
                  - generic [ref=e105]:
                    - text: Task Type
                    - combobox [ref=e106]:
                      - option "Security Analysis" [selected]
                      - option "Threat Hunting"
                      - option "Documentation"
                      - option "Learning"
                      - option "Reporting"
                  - generic [ref=e107]:
                    - text: Priority
                    - combobox [ref=e108]:
                      - option "Low"
                      - option "Medium" [selected]
                      - option "High"
                  - button "Add Task" [active] [ref=e110] [cursor=pointer]:
                    - img [ref=e111]
                    - text: Add Task
              - generic [ref=e114]:
                - heading "Custom Command" [level=4] [ref=e115]
                - generic [ref=e116]:
                  - textbox "Enter custom command..." [ref=e117]
                  - button "Execute" [disabled]:
                    - img
                    - text: Execute
  - alert [ref=e118]
```

# Test source

```ts
  180 |   test('custom command endpoint works', async ({ request }) => {
  181 |     const response = await request.post('/api/ai/agent', {
  182 |       data: {
  183 |         action: 'custom_command',
  184 |         data: {
  185 |           command: 'Test command',
  186 |           parameters: {},
  187 |           context: { timestamp: new Date().toISOString() }
  188 |         }
  189 |       }
  190 |     });
  191 |     expect(response.status()).toBe(200);
  192 |     
  193 |     const data = await response.json();
  194 |     expect(data.success).toBe(true);
  195 |     expect(data.data.taskId).toBeDefined();
  196 |     expect(data.data.command).toBe('Test command');
  197 |   });
  198 | 
  199 |   test('update personality endpoint works', async ({ request }) => {
  200 |     const response = await request.post('/api/ai/agent', {
  201 |       data: {
  202 |         action: 'update_personality',
  203 |         personalityUpdates: {
  204 |           traits: { analytical: 0.95, creative: 0.8 }
  205 |         }
  206 |       }
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
> 280 |     await expect(page.locator('text=Task type is required')).toBeVisible();
      |                                                              ^ Error: expect(locator).toBeVisible() failed
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
  307 |     await page.click('button:has-text("Start Agent")');
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