import { test, expect } from '@playwright/test';

test.describe('TrustHire Data System - Real Data Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('homepage loads and shows data system features', async ({ page }) => {
    await expect(page).toHaveTitle(/TrustHire/);
    
    // Check for data system elements
    await expect(page.locator('h1')).toBeVisible();
    
    // Look for data collection features
    const content = page.locator('body');
    await expect(content).toContainText('Data');
  });

  test('data collection API works with real data', async ({ page }) => {
    // Test data collection endpoint
    const response = await page.request.post('http://localhost:3000/api/data/collect', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        type: 'recruitment',
        data: {
          companyName: 'TechCorp Solutions',
          position: 'Senior Full Stack Developer',
          location: 'Bucharest, Romania',
          contactEmail: 'careers@techcorp.ro',
          contactPhone: '+40-21-555-1234',
          website: 'https://techcorp.ro',
          requirements: ['5+ years experience', 'React/Node.js expertise'],
          postedDate: '2024-01-20',
          deadline: '2024-02-20',
          status: 'active',
          source: 'company_website',
          confidence: 0.95,
          notes: 'Urgent position for growing team'
        }
      }
    });

    expect(response.status()).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.type).toBe('recruitment');
    expect(result.id).toMatch(/^rec_\d+_[a-z0-9]+$/);
  });

  test('data validation API works correctly', async ({ page }) => {
    // Test data validation endpoint
    const response = await page.request.post('http://localhost:3000/api/data/validate', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        action: 'validate',
        type: 'recruitment',
        data: {
          companyName: 'Test Company',
          position: 'Software Developer',
          location: 'Bucharest, Romania',
          contactEmail: 'test@company.com',
          contactPhone: '+40-21-123-4567',
          website: 'https://test.com',
          requirements: ['JavaScript experience'],
          postedDate: '2024-01-20',
          deadline: '2024-02-20',
          status: 'active',
          source: 'company_website'
        }
      }
    });

    expect(response.status()).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.action).toBe('validate');
    expect(result.type).toBe('recruitment');
    expect(result.result).toHaveProperty('isValid');
    expect(result.result).toHaveProperty('qualityScore');
    expect(result.result).toHaveProperty('confidence');
  });

  test('analytics API provides insights', async ({ page }) => {
    // First, add some data
    await page.request.post('http://localhost:3000/api/data/collect', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        type: 'recruitment',
        data: {
          companyName: 'Analytics Test Corp',
          position: 'Data Analyst',
          location: 'Cluj-Napoca, Romania',
          contactEmail: 'jobs@analytics-test.ro',
          contactPhone: '+40-264-123-456',
          website: 'https://analytics-test.ro',
          requirements: ['SQL experience', 'Python knowledge'],
          postedDate: '2024-01-20',
          deadline: '2024-02-20',
          status: 'active',
          source: 'company_website',
          confidence: 0.88
        }
      }
    });

    // Test analytics endpoint
    const response = await page.request.post('http://localhost:3000/api/data/analytics', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        type: 'overview',
        filters: {
          type: 'recruitment',
          startDate: '2024-01-01',
          endDate: '2024-12-31'
        }
      }
    });

    expect(response.status()).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.type).toBe('overview');
    expect(result.totalRecords).toBeGreaterThanOrEqual(1);
    expect(result.metrics).toHaveProperty('totalRecords');
    expect(result.metrics).toHaveProperty('averageConfidence');
    expect(result.metrics).toHaveProperty('qualityScore');
  });

  test('health check API monitors system', async ({ page }) => {
    // Test health check endpoint
    const response = await page.request.get('http://localhost:3000/api/health/detailed');
    
    expect(response.status()).toBe(200);
    const result = await response.json();
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('uptime');
    expect(result).toHaveProperty('memory');
    expect(result).toHaveProperty('apis');
    expect(result).toHaveProperty('database');
    
    // Check memory structure
    expect(result.memory).toHaveProperty('used');
    expect(result.memory).toHaveProperty('total');
    expect(result.memory).toHaveProperty('percentage');
    
    // Check API status
    expect(result.apis).toHaveProperty('collect');
    expect(result.apis).toHaveProperty('validate');
    expect(result.apis).toHaveProperty('analytics');
    expect(result.apis).toHaveProperty('export');
    
    // Check database status
    expect(result.database).toHaveProperty('connected');
    expect(result.database).toHaveProperty('records');
  });

  test('search API finds collected data', async ({ page }) => {
    // First, add searchable data
    await page.request.post('http://localhost:3000/api/data/collect', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        type: 'recruitment',
        data: {
          companyName: 'Search Test Company',
          position: 'React Developer',
          location: 'Ia\u0219i, Romania',
          contactEmail: 'react@search-test.ro',
          contactPhone: '+40-232-123-456',
          website: 'https://search-test.ro',
          requirements: ['React expertise', 'TypeScript knowledge'],
          postedDate: '2024-01-20',
          deadline: '2024-02-20',
          status: 'active',
          source: 'company_website',
          confidence: 0.92,
          notes: 'Frontend development position'
        }
      }
    });

    // Test search endpoint
    const response = await page.request.get('http://localhost:3000/api/data/collect?q=react&type=recruitment&limit=10');
    
    expect(response.status()).toBe(200);
    const result = await response.json();
    expect(result).toHaveProperty('results');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('query');
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('limit');
    
    // Check results structure
    if (result.results.length > 0) {
      expect(result.results[0]).toHaveProperty('id');
      expect(result.results[0]).toHaveProperty('type');
      expect(result.results[0]).toHaveProperty('searchable');
    }
  });

  test('data cleaning API processes data correctly', async ({ page }) => {
    // Test data cleaning endpoint
    const response = await page.request.post('http://localhost:3000/api/data/validate', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        action: 'clean',
        type: 'recruitment',
        data: {
          companyName: '  Test Company  ',
          position: 'software developer',
          location: 'bucharest, romania',
          contactEmail: 'test@company.com',
          contactPhone: '+40-21-123-4567',
          website: 'https://test.com',
          requirements: ['javascript experience'],
          postedDate: '2024-01-20',
          deadline: '2024-02-20',
          status: 'active',
          source: 'company_website'
        }
      }
    });

    expect(response.status()).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.action).toBe('clean');
    expect(result.type).toBe('recruitment');
    expect(result.result).toHaveProperty('processed');
    expect(result.result).toHaveProperty('duplicates');
    expect(result.result).toHaveProperty('standardized');
    expect(result.result).toHaveProperty('qualityIssues');
    expect(result.result).toHaveProperty('cleaned');
  });

  test('export API provides data download', async ({ page }) => {
    // Add some data first
    await page.request.post('http://localhost:3000/api/data/collect', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        type: 'recruitment',
        data: {
          companyName: 'Export Test Corp',
          position: 'Backend Developer',
          location: 'Timi\u0219oara, Romania',
          contactEmail: 'backend@export-test.ro',
          contactPhone: '+40-256-123-456',
          website: 'https://export-test.ro',
          requirements: ['Node.js', 'MongoDB'],
          postedDate: '2024-01-20',
          deadline: '2024-02-20',
          status: 'active',
          source: 'company_website',
          confidence: 0.91
        }
      }
    });

    // Test export endpoint
    const response = await page.request.post('http://localhost:3000/api/data/export', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        format: 'json',
        filters: {
          type: 'recruitment',
          startDate: '2024-01-01',
          endDate: '2024-12-31'
        }
      }
    });

    expect(response.status()).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.format).toBe('json');
    expect(result).toHaveProperty('totalRecords');
    expect(result).toHaveProperty('exportUrl');
    expect(result).toHaveProperty('expiresAt');
  });

  test('company data collection works', async ({ page }) => {
    // Test company data collection
    const response = await page.request.post('http://localhost:3000/api/data/collect', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        type: 'company',
        data: {
          companyName: 'DataSoft Romania',
          industry: 'Software Development',
          location: 'Cluj-Napoca, Romania',
          website: 'https://datasoft.ro',
          email: 'contact@datasoft.ro',
          phone: '+40-264-123-456',
          description: 'Leading software development company in Transylvania',
          foundedYear: 2018,
          employeeCount: '50-100',
          revenue: '$2M-$5M'
        }
      }
    });

    expect(response.status()).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.type).toBe('company');
    expect(result.id).toMatch(/^company_\d+_[a-z0-9]+$/);
  });

  test('candidate data collection works', async ({ page }) => {
    // Test candidate data collection
    const response = await page.request.post('http://localhost:3000/api/data/collect', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        type: 'candidate',
        data: {
          personalInfo: {
            firstName: 'Ion',
            lastName: 'Popescu',
            email: 'ion.popescu@email.com',
            phone: '+40-722-123-456',
            location: 'Ia\u0219i, Romania'
          },
          professionalInfo: {
            currentPosition: 'Software Developer',
            experience: '3 years',
            skills: ['JavaScript', 'React', 'Node.js', 'Python'],
            education: 'Computer Science Degree',
            currentSalary: '60000 RON'
          },
          applicationInfo: {
            appliedPosition: 'Full Stack Developer',
            appliedCompany: 'TechCorp Solutions',
            appliedDate: '2024-01-20',
            status: 'under_review'
          }
        }
      }
    });

    expect(response.status()).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.type).toBe('candidate');
    expect(result.id).toMatch(/^candidate_\d+_[a-z0-9]+$/);
  });

  test('data quality scoring works', async ({ page }) => {
    // Test with high quality data
    const highQualityResponse = await page.request.post('http://localhost:3000/api/data/validate', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        action: 'validate',
        type: 'recruitment',
        data: {
          companyName: 'High Quality Corp',
          position: 'Senior Full Stack Developer',
          location: 'Bucharest, Romania',
          contactEmail: 'careers@highquality.ro',
          contactPhone: '+40-21-555-1234',
          website: 'https://highquality.ro',
          requirements: ['5+ years experience', 'React/Node.js expertise', 'English proficiency'],
          postedDate: '2024-01-20',
          deadline: '2024-02-20',
          status: 'active',
          source: 'company_website',
          confidence: 0.95,
          notes: 'Comprehensive job description with all details'
        }
      }
    });

    expect(highQualityResponse.status()).toBe(200);
    const highQualityResult = await highQualityResponse.json();
    expect(highQualityResult.result.qualityScore).toBeGreaterThan(0.8);
    expect(highQualityResult.result.confidence).toBeGreaterThan(0.8);

    // Test with low quality data
    const lowQualityResponse = await page.request.post('http://localhost:3000/api/data/validate', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        action: 'validate',
        type: 'recruitment',
        data: {
          companyName: 'Test',
          position: 'Dev',
          location: 'Bucharest',
          contactEmail: 'test',
          status: 'active',
          source: 'website'
        }
      }
    });

    expect(lowQualityResponse.status()).toBe(200);
    const lowQualityResult = await lowQualityResponse.json();
    expect(lowQualityResult.result.qualityScore).toBeLessThan(0.6);
    expect(lowQualityResult.result.warnings.length).toBeGreaterThan(0);
  });

  test('system handles concurrent requests', async ({ page }) => {
    // Test concurrent data collection
    const promises = [];
    
    for (let i = 0; i < 5; i++) {
      promises.push(
        page.request.post('http://localhost:3000/api/data/collect', {
          headers: { 'Content-Type': 'application/json' },
          data: {
            type: 'recruitment',
            data: {
              companyName: `Concurrent Test Corp ${i}`,
              position: `Developer ${i}`,
              location: 'Bucharest, Romania',
              contactEmail: `test${i}@concurrent.ro`,
              contactPhone: '+40-21-555-1234',
              website: `https://concurrent${i}.ro`,
              requirements: ['JavaScript experience'],
              postedDate: '2024-01-20',
              deadline: '2024-02-20',
              status: 'active',
              source: 'company_website',
              confidence: 0.85
            }
          }
        })
      );
    }

    const responses = await Promise.all(promises);
    
    // All requests should succeed
    responses.forEach(response => {
      expect(response.status()).toBe(200);
    });

    // Check analytics to see all data was collected
    const analyticsResponse = await page.request.post('http://localhost:3000/api/data/analytics', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        type: 'overview',
        filters: { type: 'recruitment' }
      }
    });

    expect(analyticsResponse.status()).toBe(200);
    const analyticsResult = await analyticsResponse.json();
    expect(analyticsResult.totalRecords).toBeGreaterThanOrEqual(5);
  });
});

test.describe('TrustHire Data System - Error Handling', () => {
  test('handles invalid data gracefully', async ({ page }) => {
    // Test with completely invalid data
    const response = await page.request.post('http://localhost:3000/api/data/collect', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        type: 'invalid_type',
        data: {}
      }
    });

    // Should handle gracefully
    expect(response.status()).toBeLessThan(500);
  });

  test('handles missing required fields', async ({ page }) => {
    // Test with missing required fields
    const response = await page.request.post('http://localhost:3000/api/data/collect', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        type: 'recruitment',
        data: {
          position: 'Software Developer'
          // Missing required fields like companyName, location, etc.
        }
      }
    });

    // Should handle gracefully
    expect(response.status()).toBeLessThan(500);
  });

  test('handles malformed JSON', async ({ page }) => {
    // Test with malformed JSON
    const response = await page.request.post('http://localhost:3000/api/data/collect', {
      headers: { 'Content-Type': 'application/json' },
      data: 'invalid json'
    });

    // Should handle gracefully
    expect(response.status()).toBe(400);
  });
});

test.describe('TrustHire Data System - Performance', () => {
  test('API responses are fast', async ({ page }) => {
    const startTime = Date.now();
    
    const response = await page.request.post('http://localhost:3000/api/data/collect', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        type: 'recruitment',
        data: {
          companyName: 'Performance Test Corp',
          position: 'Performance Developer',
          location: 'Bucharest, Romania',
          contactEmail: 'performance@test.ro',
          contactPhone: '+40-21-555-1234',
          website: 'https://performance-test.ro',
          requirements: ['Fast development'],
          postedDate: '2024-01-20',
          deadline: '2024-02-20',
          status: 'active',
          source: 'company_website',
          confidence: 0.9
        }
      }
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(1000); // Should be under 1 second
  });

  test('health check is fast', async ({ page }) => {
    const startTime = Date.now();
    
    const response = await page.request.get('http://localhost:3000/api/health/detailed');
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(500); // Health check should be very fast
  });
});
