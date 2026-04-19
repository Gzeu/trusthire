// Simple test file for utility functions
// Run with: node -r ts-node/register __tests__/utils.test.ts

import { 
  cn, 
  getRateLimitKey, 
  checkRateLimit, 
  extractDomain, 
  isGenericEmail 
} from '../lib/utils';

// Simple test runner
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`✓ ${message}`);
}

function test(name: string, fn: () => void) {
  console.log(`\nTesting: ${name}`);
  try {
    fn();
  } catch (error) {
    console.error(`✗ ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Test cases
test('cn - should merge class names correctly', () => {
  assert(cn('foo', 'bar') === 'foo bar', 'merges simple classes');
  assert(cn('foo', null, 'bar') === 'foo bar', 'handles null values');
  assert(cn('foo', undefined, 'bar') === 'foo bar', 'handles undefined values');
  assert(cn('foo', '', 'bar') === 'foo bar', 'handles empty strings');
});

test('cn - should handle conditional classes', () => {
  assert(cn('base', true && 'active') === 'base active', 'handles true condition');
  assert(cn('base', false && 'active') === 'base', 'handles false condition');
  assert(cn('base', 'condition' && 'true') === 'base true', 'handles truthy condition');
});

test('getRateLimitKey - should extract IP from x-forwarded-for header', () => {
  const mockReq = {
    headers: {
      get: (name: string) => {
        if (name === 'x-forwarded-for') return '192.168.1.1, 10.0.0.1';
        return null;
      }
    }
  } as Request;
  
  assert(getRateLimitKey(mockReq) === 'ratelimit:192.168.1.1', 'extracts first IP from forwarded header');
});

test('getRateLimitKey - should fallback to unknown when no IP headers', () => {
  const mockReq = {
    headers: {
      get: () => null
    }
  } as Request;
  
  assert(getRateLimitKey(mockReq) === 'ratelimit:unknown', 'fallback to unknown');
});

test('checkRateLimit - should allow first request', () => {
  // Clear rate limit map
  (global as any).rateLimitMap = new Map();
  assert(checkRateLimit('test-key', 5, 60000) === true, 'allows first request');
});

test('checkRateLimit - should allow requests within limit', () => {
  (global as any).rateLimitMap = new Map();
  checkRateLimit('test-key', 5, 60000);
  checkRateLimit('test-key', 5, 60000);
  assert(checkRateLimit('test-key', 5, 60000) === true, 'allows requests within limit');
});

test('checkRateLimit - should block requests exceeding limit', () => {
  (global as any).rateLimitMap = new Map();
  // Use up the limit
  for (let i = 0; i < 5; i++) {
    checkRateLimit('test-key', 5, 60000);
  }
  assert(checkRateLimit('test-key', 5, 60000) === false, 'blocks requests exceeding limit');
});

test('extractDomain - should extract domain from email', () => {
  assert(extractDomain('user@example.com') === 'example.com', 'extracts simple domain');
  assert(extractDomain('test@sub.domain.co.uk') === 'sub.domain.co.uk', 'extracts complex domain');
});

test('extractDomain - should handle edge cases', () => {
  assert(extractDomain('user@') === '', 'handles empty domain');
  assert(extractDomain('@domain.com') === 'domain.com', 'handles missing username');
  assert(extractDomain('nodomain') === '', 'handles no @ symbol');
});

test('isGenericEmail - should identify generic email providers', () => {
  assert(isGenericEmail('user@gmail.com') === true, 'identifies Gmail');
  assert(isGenericEmail('test@yahoo.com') === true, 'identifies Yahoo');
  assert(isGenericEmail('user@hotmail.com') === true, 'identifies Hotmail');
  assert(isGenericEmail('test@outlook.com') === true, 'identifies Outlook');
  assert(isGenericEmail('user@protonmail.com') === true, 'identifies ProtonMail');
  assert(isGenericEmail('test@icloud.com') === true, 'identifies iCloud');
});

test('isGenericEmail - should identify corporate emails', () => {
  assert(isGenericEmail('user@company.com') === false, 'identifies corporate domain');
  assert(isGenericEmail('test@startup.io') === false, 'identifies startup domain');
  assert(isGenericEmail('user@enterprise.co') === false, 'identifies enterprise domain');
});

test('isGenericEmail - should handle case insensitivity', () => {
  assert(isGenericEmail('user@GMAIL.COM') === true, 'handles uppercase Gmail');
  assert(isGenericEmail('test@YAHOO.COM') === true, 'handles uppercase Yahoo');
});

console.log('\nAll tests completed!');
