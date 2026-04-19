// PhishTank Client
// Mock implementation for deployment

export interface PhishTankEntry {
  url: string;
  phish_id: string;
  submission_time: string;
  verified: boolean;
  verification_time: string;
  target: string;
  details: string;
  submitter: string;
}

export class PhishTankClient {
  private apiKey: string;
  private baseUrl: string;
  private requestCount: number;
  private lastRequestTime: number;

  constructor(apiKey: string, baseUrl: string = 'https://checkurl.phishtank.com') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.requestCount = 0;
    this.lastRequestTime = 0;
  }

  private async makeRequest(endpoint: string, config: any = {}): Promise<any> {
    // Rate limiting
    await this.checkRateLimit();
    
    try {
      // Mock implementation
      const mockData = this.getMockData(endpoint);
      this.lastRequestTime = Date.now();
      this.requestCount++;
      return mockData;
    } catch (error) {
      console.error(`PhishTank ${endpoint} error:`, error);
      throw new Error(`Failed to call PhishTank ${endpoint}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    // Reset counter if more than a minute has passed
    if (timeSinceLastRequest > 60000) { // 1 minute
      this.requestCount = 0;
    }
    
    // Check if we've exceeded the rate limit (200 requests per minute)
    if (this.requestCount >= 200) {
      const waitTime = 60000 - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.requestCount = 0;
    }
  }

  // Entry Management
  async getEntries(options: {
    limit?: number;
    page?: number;
    verified?: boolean;
    target?: string;
    country?: string;
    tags?: string[];
    date_from?: string;
    date_to?: string;
    submitter?: string;
    author?: string;
    ip?: string;
  } = {}): Promise<{ entries: PhishTankEntry[]; total: number }> {
    // Mock implementation
    const mockEntries: PhishTankEntry[] = [
      {
        url: 'https://fake-bank-login.com',
        phish_id: '12345',
        submission_time: '2024-01-15T10:00:00Z',
        verified: true,
        verification_time: '2024-01-15T12:30:00Z',
        target: 'Bank of America',
        details: 'Sophisticated phishing campaign targeting bank customers',
        submitter: 'security-team'
      },
      {
        url: 'https://paypal-security-check.com',
        phish_id: '12346',
        submission_time: '2024-01-14T15:20:00Z',
        verified: true,
        verification_time: '2024-01-14T18:45:00Z',
        target: 'PayPal',
        details: 'PayPal account verification phishing attempt',
        submitter: 'user-123'
      }
    ];

    return {
      entries: mockEntries.slice(0, options.limit || 10),
      total: mockEntries.length
    };
  }

  async createEntry(entry: Partial<PhishTankEntry>): Promise<PhishTankEntry> {
    // Mock implementation
    const newEntry: PhishTankEntry = {
      url: entry.url || '',
      phish_id: `phish-${Date.now()}`,
      submission_time: new Date().toISOString(),
      verified: false,
      verification_time: '',
      target: entry.target || 'Unknown',
      details: entry.details || '',
      submitter: entry.submitter || 'anonymous'
    };

    return newEntry;
  }

  async updateEntry(id: string, entry: Partial<PhishTankEntry>): Promise<PhishTankEntry> {
    // Mock implementation
    return this.getEntries({ limit: 1 }).then(result => {
      const existingEntry = result.entries[0];
      if (existingEntry) {
        return { ...existingEntry, ...entry };
      }
      throw new Error('Entry not found');
    });
  }

  async deleteEntry(id: string): Promise<void> {
    // Mock implementation
    console.log(`Mock: Deleting PhishTank entry ${id}`);
  }

  // Verification
  async verifyEntry(id: string): Promise<PhishTankEntry> {
    // Mock implementation
    return this.getEntries({ limit: 1 }).then(result => {
      const entry = result.entries[0];
      if (entry) {
        return {
          ...entry,
          verified: true,
          verification_time: new Date().toISOString()
        };
      }
      throw new Error('Entry not found');
    });
  }

  // Search and Filtering
  async searchEntries(query: string, options: {
    limit?: number;
    target?: string;
    verified?: boolean;
    tags?: string[];
  } = {}): Promise<PhishTankEntry[]> {
    // Mock implementation
    return this.getEntries(options).then(result => {
      return result.entries.filter(entry => 
        entry.url.toLowerCase().includes(query.toLowerCase()) ||
        entry.target.toLowerCase().includes(query.toLowerCase()) ||
        entry.details.toLowerCase().includes(query.toLowerCase())
      );
    });
  }

  // Statistics
  async getStatistics(): Promise<{
    total_entries: number;
    entries_by_status: Record<string, number>;
    entries_by_target: Record<string, number>;
    entries_by_country: Record<string, number>;
    recent_submissions: {
      last_24h: number;
      last_7d: number;
      last_30d: number;
    };
    api_usage: {
      requests_today: number;
      requests_this_month: number;
      requests_this_year: number;
    };
  }> {
    // Mock implementation
    return {
      total_entries: 15420,
      entries_by_status: {
        verified: 12350,
        unverified: 3070
      },
      entries_by_target: {
        'Bank of America': 2340,
        'PayPal': 1890,
        'Chase': 1560,
        'Wells Fargo': 1230,
        'Other': 8400
      },
      entries_by_country: {
        'US': 8900,
        'UK': 2340,
        'Canada': 1560,
        'Australia': 1230,
        'Other': 1390
      },
      recent_submissions: {
        last_24h: 45,
        last_7d: 234,
        last_30d: 890
      },
      api_usage: {
        requests_today: 156,
        requests_this_month: 3420,
        requests_this_year: 41560
      }
    };
  }

  // Health Check
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    response_time: number;
    timestamp: string;
    details?: Record<string, any>;
  }> {
    // Mock implementation
    return {
      status: 'healthy',
      response_time: 120,
      timestamp: new Date().toISOString(),
      details: {
        api_version: '1.0',
        rate_limit: '200/minute',
        total_entries: 15420
      }
    };
  }

  // IOC Extraction
  extractIOCs(entry: PhishTankEntry): {
    urls: string[];
    domains: string[];
    ips: string[];
    hashes: string[];
  } {
    // Mock IOC extraction
    const urls = [entry.url];
    const domains = [new URL(entry.url).hostname];
    const ips: string[] = [];
    const hashes: string[] = [];

    return { urls, domains, ips, hashes };
  }

  // Batch Operations
  async batchCreateEntries(entries: Partial<PhishTankEntry>[]): Promise<PhishTankEntry[]> {
    // Mock implementation
    return Promise.all(entries.map(entry => this.createEntry(entry)));
  }

  // Transform to TrustHire format
  transformToTrustHireFormat(entry: PhishTankEntry): any {
    return {
      id: entry.phish_id,
      name: `Phishing: ${entry.target}`,
      source: 'PhishTank',
      type: 'phishing',
      severity: entry.verified ? 'medium' : 'low',
      description: entry.details,
      indicators: {
        domains: [new URL(entry.url).hostname],
        ips: [],
        hashes: [],
        urls: [entry.url]
      },
      tags: ['phishing', entry.target.toLowerCase()],
      confidence: entry.verified ? 0.85 : 0.65,
      firstSeen: entry.submission_time,
      lastSeen: entry.verification_time || entry.submission_time,
      metadata: {
        originalSource: 'PhishTank',
        sourceId: entry.phish_id,
        verified: entry.verified,
        target: entry.target,
        submitter: entry.submitter
      }
    };
  }

  private getMockData(endpoint: string): any {
    // Mock data based on endpoint
    switch (endpoint) {
      case 'entries':
        return {
          entries: [
            {
              url: 'https://fake-bank-login.com',
              phish_id: '12345',
              submission_time: '2024-01-15T10:00:00Z',
              verified: true,
              verification_time: '2024-01-15T12:30:00Z',
              target: 'Bank of America',
              details: 'Sophisticated phishing campaign',
              submitter: 'security-team'
            }
          ],
          total: 1
        };
      case 'statistics':
        return {
          total_entries: 15420,
          entries_by_status: { verified: 12350, unverified: 3070 },
          entries_by_target: { 'Bank of America': 2340, 'PayPal': 1890 },
          recent_submissions: { last_24h: 45, last_7d: 234, last_30d: 890 },
          api_usage: { requests_today: 156, requests_this_month: 3420 }
        };
      default:
        return {};
    }
  }
}

// Singleton instance
let phishTankClient: PhishTankClient | null = null;

export function getPhishTankClient(apiKey?: string, baseUrl?: string): PhishTankClient {
  if (!phishTankClient) {
    const key = apiKey || process.env.PHISHTANK_API_KEY || 'mock-api-key';
    const url = baseUrl || process.env.PHISHTANK_BASE_URL || 'https://checkurl.phishtank.com';
    phishTankClient = new PhishTankClient(key, url);
  }
  return phishTankClient;
}
