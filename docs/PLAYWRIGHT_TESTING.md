# Playwright Testing Guide

## Overview

This document provides comprehensive information about the Playwright testing setup for the TrustHire security platform. Playwright is used for end-to-end testing, API testing, and security validation.

## Setup

### Installation

Playwright is already installed as a development dependency. To install the browsers:

```bash
npm run test:install
```

### Configuration

The Playwright configuration is located in `playwright.config.ts` and includes:

- **Multi-browser testing**: Chrome, Firefox, Safari (WebKit)
- **Mobile testing**: Chrome Mobile, Safari Mobile
- **Parallel execution**: Tests run in parallel for faster execution
- **Retry logic**: Automatic retries on CI
- **Reporting**: HTML, JSON, and JUnit reports
- **Screenshots & Videos**: Automatic capture on failure
- **Trace collection**: Detailed execution traces for debugging

## Test Structure

### Test Files

```
tests/
  basic-functionality.spec.ts    # Core application functionality
  autonomous-agent.spec.ts        # Autonomous AI agent testing
  security.spec.ts                 # Security and vulnerability testing
  global-setup.ts                  # Global test setup
  global-teardown.ts               # Global test cleanup
```

### Test Categories

#### 1. Basic Functionality Tests
- Homepage loading and navigation
- Page accessibility and responsiveness
- Form functionality and validation
- API endpoint health checks
- Error handling and user experience

#### 2. Autonomous Agent Tests
- Agent page loading and UI functionality
- Agent control panel operations
- Memory system validation
- API endpoint testing for agent operations
- Integration with Mistral AI and OpenClaw
- Performance and real-time updates

#### 3. Security Tests
- Security headers validation
- XSS and SQL injection protection
- CSRF protection and form validation
- Rate limiting and authentication
- Input sanitization and data protection
- Access control and authorization

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode (visible browser)
npm run test:headed

# Debug tests
npm run test:debug

# View test report
npm run test:report
```

### Running Specific Tests

```bash
# Run specific test file
npx playwright test tests/basic-functionality.spec.ts

# Run tests with specific pattern
npx playwright test --grep "Agent"

# Run tests in specific browser
npx playwright test --project=chromium
```

### CI/CD Integration

```bash
# Run tests in CI mode
CI=true npm test

# Generate report for CI
CI=true npm run test:report
```

## Test Coverage

### Functional Coverage

- **Homepage**: Loading, navigation, content display
- **Assessment Pages**: URL scanning, GitHub integration, LinkedIn scanning
- **Dashboard**: Analytics, metrics, real-time updates
- **Intelligence Center**: Threat analysis, pattern recognition
- **Monitoring**: Real-time threat monitoring, alerts
- **Collaboration**: Team sharing, reviews, comments
- **Agent Interface**: Autonomous agent control and monitoring

### API Coverage

- **Health Endpoints**: `/api/health`, `/api/metrics`
- **Assessment APIs**: `/api/assessment/*`
- **Scanning APIs**: `/api/scan/*`
- **AI APIs**: `/api/ai/*`, `/api/ml/*`
- **Collaboration APIs**: `/api/collaboration/*`
- **Security APIs**: `/api/auth/*`, `/api/security/*`

### Security Coverage

- **Input Validation**: XSS, SQL injection, malicious payloads
- **Authentication**: Login, session management, access control
- **Data Protection**: Sensitive data exposure, CSRF protection
- **Headers**: Security headers, CSP, HSTS
- **Rate Limiting**: API endpoint protection
- **Error Handling**: Information disclosure prevention

## Writing Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('specific test case', async ({ page }) => {
    // Test implementation
    await page.goto('/page');
    await expect(page.locator('element')).toBeVisible();
  });
});
```

### Best Practices

1. **Use descriptive test names**: Clearly state what is being tested
2. **Group related tests**: Use `test.describe()` for logical grouping
3. **Use locators**: Prefer semantic locators over CSS selectors
4. **Wait for elements**: Use proper waiting strategies
5. **Clean up after tests**: Ensure tests don't leave side effects
6. **Test multiple browsers**: Ensure cross-browser compatibility

### Example Test

```typescript
test.describe('User Authentication', () => {
  test('user can login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('login fails with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
});
```

## Debugging

### Using Test Runner UI

```bash
npm run test:ui
```

The UI provides:
- **Live debugging**: Step through tests in real-time
- **DOM inspection**: Examine page structure
- **Console access**: View browser console logs
- **Network monitoring**: Inspect network requests
- **Timeline view**: Visualize test execution

### Using Debug Mode

```bash
npm run test:debug
```

Debug mode provides:
- **Breakpoints**: Pause execution at specific points
- **Variable inspection**: Examine test variables
- **Step execution**: Execute tests line by line
- **Console access**: Debug in browser console

### Trace Files

Trace files are automatically generated for failed tests and can be viewed with:

```bash
npx playwright show-trace test-results/trace.zip
```

## Continuous Integration

### GitHub Actions

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:install
      - run: npm test
      - uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### Environment Variables

```bash
# CI environment
CI=true

# Test timeout
PLAYWRIGHT_TIMEOUT=60000

# Test retries
PLAYWRIGHT_RETRIES=2
```

## Troubleshooting

### Common Issues

1. **Browser Installation**: Run `npm run test:install`
2. **Port Conflicts**: Ensure port 3000 is available
3. **Timeout Errors**: Increase timeout in `playwright.config.ts`
4. **Flaky Tests**: Add proper waiting strategies
5. **CI Failures**: Check CI logs for specific error messages

### Debug Steps

1. **Run tests locally**: `npm test`
2. **Use UI mode**: `npm run test:ui`
3. **Check logs**: Review test output and browser console
4. **Examine traces**: Look at trace files for failed tests
5. **Validate setup**: Ensure application is running correctly

### Performance Optimization

1. **Parallel execution**: Tests run in parallel by default
2. **Test isolation**: Each test runs in a fresh browser context
3. **Resource cleanup**: Proper cleanup after each test
4. **Selective testing**: Run only relevant tests for changes

## Maintenance

### Regular Tasks

1. **Update Playwright**: `npm update @playwright/test`
2. **Update browsers**: `npm run test:install`
3. **Review test coverage**: Ensure adequate test coverage
4. **Update test data**: Keep test data current and relevant
5. **Monitor flaky tests**: Identify and fix unstable tests

### Test Data Management

- **Test isolation**: Each test should be independent
- **Data cleanup**: Clean up test data after execution
- **Environment consistency**: Use consistent test environments
- **Mock external services**: Use mocks for external dependencies

## Security Testing

### Security Test Categories

1. **Input Validation**: Test for XSS, SQL injection, and other injection attacks
2. **Authentication**: Test login flows, session management, and access control
3. **Authorization**: Test role-based access and permission checks
4. **Data Protection**: Test for sensitive data exposure and proper encryption
5. **Rate Limiting**: Test API rate limiting and DoS protection
6. **Headers**: Test security headers and CSP policies

### Security Test Examples

```typescript
test('SQL injection protection', async ({ request }) => {
  const maliciousInput = "'; DROP TABLE users; --";
  
  const response = await request.post('/api/endpoint', {
    data: { input: maliciousInput }
  });
  
  expect(response.status()).not.toBe(500);
  const responseText = await response.text();
  expect(responseText).not.toMatch(/sql/i);
});

test('XSS protection', async ({ page }) => {
  await page.goto('/form');
  
  const xssPayload = '<script>alert("XSS")</script>';
  await page.fill('textarea', xssPayload);
  await page.click('button[type="submit"]');
  
  // Should not execute JavaScript
  const alerts = [];
  page.on('dialog', () => alerts.push('alert'));
  
  expect(alerts.length).toBe(0);
});
```

## Reporting

### Report Types

1. **HTML Report**: Interactive web-based report
2. **JSON Report**: Machine-readable test results
3. **JUnit Report**: CI/CD integration format
4. **Video Recordings**: Visual evidence of test execution
5. **Screenshots**: Screenshots of test failures

### Report Access

```bash
# View HTML report
npm run test:report

# Access JSON data
cat test-results/results.json

# View JUnit XML
cat test-results/results.xml
```

## Future Enhancements

### Planned Improvements

1. **Visual Testing**: Add visual regression testing
2. **API Testing**: Expand API test coverage
3. **Performance Testing**: Add performance and load testing
4. **Accessibility Testing**: Add comprehensive accessibility tests
5. **Mobile Testing**: Expand mobile device coverage

### Test Automation

1. **Scheduled Tests**: Run tests automatically on schedule
2. **Parallel Pipelines**: Run tests in parallel CI/CD pipelines
3. **Test Analytics**: Track test metrics and trends
4. **Alerting**: Notify on test failures
5. **Integration**: Integrate with project management tools

This comprehensive testing setup ensures the TrustHire platform maintains high quality, security, and reliability across all features and components.
