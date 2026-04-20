# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: data-system.spec.ts >> TrustHire Data System - Error Handling >> handles malformed JSON
- Location: tests\data-system.spec.ts:483:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 400
Received: 429
```

# Test source

```ts
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
  441 |         filters: { type: 'recruitment' }
  442 |       }
  443 |     });
  444 | 
  445 |     expect(analyticsResponse.status()).toBe(200);
  446 |     const analyticsResult = await analyticsResponse.json();
  447 |     expect(analyticsResult.totalRecords).toBeGreaterThanOrEqual(5);
  448 |   });
  449 | });
  450 | 
  451 | test.describe('TrustHire Data System - Error Handling', () => {
  452 |   test('handles invalid data gracefully', async ({ page }) => {
  453 |     // Test with completely invalid data
  454 |     const response = await page.request.post('http://localhost:3000/api/data/collect', {
  455 |       headers: { 'Content-Type': 'application/json' },
  456 |       data: {
  457 |         type: 'invalid_type',
  458 |         data: {}
  459 |       }
  460 |     });
  461 | 
  462 |     // Should handle gracefully
  463 |     expect(response.status()).toBeLessThan(500);
  464 |   });
  465 | 
  466 |   test('handles missing required fields', async ({ page }) => {
  467 |     // Test with missing required fields
  468 |     const response = await page.request.post('http://localhost:3000/api/data/collect', {
  469 |       headers: { 'Content-Type': 'application/json' },
  470 |       data: {
  471 |         type: 'recruitment',
  472 |         data: {
  473 |           position: 'Software Developer'
  474 |           // Missing required fields like companyName, location, etc.
  475 |         }
  476 |       }
  477 |     });
  478 | 
  479 |     // Should handle gracefully
  480 |     expect(response.status()).toBeLessThan(500);
  481 |   });
  482 | 
  483 |   test('handles malformed JSON', async ({ page }) => {
  484 |     // Test with malformed JSON
  485 |     const response = await page.request.post('http://localhost:3000/api/data/collect', {
  486 |       headers: { 'Content-Type': 'application/json' },
  487 |       data: 'invalid json'
  488 |     });
  489 | 
  490 |     // Should handle gracefully
> 491 |     expect(response.status()).toBe(400);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  492 |   });
  493 | });
  494 | 
  495 | test.describe('TrustHire Data System - Performance', () => {
  496 |   test('API responses are fast', async ({ page }) => {
  497 |     const startTime = Date.now();
  498 |     
  499 |     const response = await page.request.post('http://localhost:3000/api/data/collect', {
  500 |       headers: { 'Content-Type': 'application/json' },
  501 |       data: {
  502 |         type: 'recruitment',
  503 |         data: {
  504 |           companyName: 'Performance Test Corp',
  505 |           position: 'Performance Developer',
  506 |           location: 'Bucharest, Romania',
  507 |           contactEmail: 'performance@test.ro',
  508 |           contactPhone: '+40-21-555-1234',
  509 |           website: 'https://performance-test.ro',
  510 |           requirements: ['Fast development'],
  511 |           postedDate: '2024-01-20',
  512 |           deadline: '2024-02-20',
  513 |           status: 'active',
  514 |           source: 'company_website',
  515 |           confidence: 0.9
  516 |         }
  517 |       }
  518 |     });
  519 | 
  520 |     const endTime = Date.now();
  521 |     const responseTime = endTime - startTime;
  522 |     
  523 |     expect(response.status()).toBe(200);
  524 |     expect(responseTime).toBeLessThan(1000); // Should be under 1 second
  525 |   });
  526 | 
  527 |   test('health check is fast', async ({ page }) => {
  528 |     const startTime = Date.now();
  529 |     
  530 |     const response = await page.request.get('http://localhost:3000/api/health/detailed');
  531 |     
  532 |     const endTime = Date.now();
  533 |     const responseTime = endTime - startTime;
  534 |     
  535 |     expect(response.status()).toBe(200);
  536 |     expect(responseTime).toBeLessThan(500); // Health check should be very fast
  537 |   });
  538 | });
  539 | 
```