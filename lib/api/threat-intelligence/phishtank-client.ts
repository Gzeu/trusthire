// PhishTank API Client Integration
// Connects to PhishTank for phishing intelligence data

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface PhishTankEntry {
  id: string;
  url: string;
  phish_id: string;
  phish_detail_url: string;
  submission_date: string;
  verified: boolean;
  verification: boolean;
  online: boolean;
  target: string;
  country: string;
  details: string;
  submitter: string;
  title: string;
  author: string;
  ip: string;
  tags: string[];
}

export interface PhishTankConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
}

export class PhishTankClient {
  private axios: AxiosInstance;
  private config: PhishTankConfig;
  private requestCount = 0;
  private lastRequestTime = 0;

  constructor(config: PhishTankConfig) {
    this.config = config;
    this.axios = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: {
        'Authorization': config.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  private async makeRequest<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    // Rate limiting
    await this.checkRateLimit();
    
    try {
      const response = await this.axios.get(endpoint, config);
      this.lastRequestTime = Date.now();
      this.requestCount++;
      return response.data;
    } catch (error) {
      console.error(`PhishTank ${endpoint} error:`, error);
      throw new Error(`Failed to call PhishTank ${endpoint}: ${error.message}`);
    }
  }

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    // Reset counter if more than a minute has passed
    if (timeSinceLastRequest > 60000) { // 1 minute
      this.requestCount = 0;
    }
    
    // Check if we're approaching rate limits
    if (this.requestCount >= this.config.rateLimit.requestsPerMinute - 5) {
      console.warn('Approaching PhishTank rate limit');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Entry Management
  async getEntries(options: {
    limit?: number;
    page?: number;
    url?: string;
    is_valid?: boolean;
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
    try {
      const response = await this.makeRequest<{ entries: PhishTankEntry[]; total: number }>('/entries', {
        params: options
      });
      return response.data;
    } catch (error) {
      console.error('PhishTank getEntries error:', error);
      throw new Error(`Failed to fetch PhishTank entries: ${error.message}`);
    }
  }

  async getEntry(id: string): Promise<PhishTankEntry> {
    try {
      const response = await this.makeRequest<PhishTankEntry>(`/entries/${id}`);
      return response.data;
    } catch (error) {
      console.error('PhishTank getEntry error:', error);
      throw new Error(`Failed to get PhishTank entry: ${error.message}`);
    }
  }

  async createEntry(entry: Partial<PhishTankEntry>): Promise<PhishTankEntry> {
    try {
      const response = await this.axios.post('/entries', entry);
      return response.data;
    } catch (error) {
      console.error('PhishTank createEntry error:', error);
      throw new Error(`Failed to create PhishTank entry: ${error.message}`);
    }
  }

  async updateEntry(id: string, entry: Partial<PhishTankEntry>): Promise<PhishTankEntry> {
    try {
      const response = await this.axios.put(`/entries/${id}`, entry);
      return response.data;
    } catch (error) {
      console.error('PhishTank updateEntry error:', error);
      throw new Error(`Failed to update PhishTank entry: ${error.message}`);
    }
  }

  async deleteEntry(id: string): Promise<void> {
    try {
      await this.axios.delete(`/entries/${id}`);
    } catch (error) {
      console.error('PhishTank deleteEntry error:', error);
      throw new Error(`Failed to delete PhishTank entry: ${error.message}`);
    }
  }

  // Verification
  async verifyEntry(id: string): Promise<PhishTankEntry> {
    try {
      const response = await this.axios.get(`/entries/${id}/verify`);
      return response.data;
    } catch (error) {
      console.error('PhishTank verifyEntry error:', error);
      throw new Error(`Failed to verify PhishTank entry: ${error.message}`);
    }
  }

  // Search and Filtering
  async searchEntries(query: string, options: {
    limit?: number;
    page?: number;
    url?: string;
    target?: string;
    country?: string;
    tags?: string[];
    date_from?: string;
    date_to?: string;
    submitter?: string;
    author?: string;
    ip?: string;
  } = {}): Promise<PhishTankEntry[]> {
    try {
      const params: {
        query,
        limit: options.limit || 50,
        page: options.page || 1,
        url: options.url,
        target: options.target,
        country: options.country,
        tags: options.tags,
        date_from: options.date_from,
        date_to: options.date_to,
        submitter: options.submitter,
        author: options.author,
        ip: options.ip
      };

      const response = await this.makeRequest<PhishTankEntry[]>('/search', { params });
      return response.data;
    } catch (error) {
      console.error('PhishTank searchEntries error:', error);
      throw new Error(`Failed to search PhishTank entries: ${error.message}`);
    }
  }

  // Statistics and Analytics
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
    try {
      const response = await this.makeRequest('/statistics');
      return response.data;
    } catch (error) {
      console.error('PhishTank getStatistics error:', error);
      throw new Error(`Failed to get statistics from PhishTank: ${error.message}`);
    }
  }

  // Batch Operations
  async batchCreateEntries(entries: Partial<PhishTankEntry>[]): Promise<PhishTankEntry[]> {
    try {
      const response = await this.axios.post('/entries/batch', { entries });
      return response.data;
    } catch (error) {
      console.error('PhishTank batchCreateEntries error:', error);
      throw new Error(`Failed to batch create PhishTank entries: ${error.message}`);
    }
  }

  // Data Transformation
  transformToTrustHireFormat(entry: PhishTankEntry): {
    id: entry.id;
    name: entry.title || entry.url;
    source: 'PhishTank';
    type: 'phishing';
    severity: entry.verified ? 'low' : 'medium';
    confidence: 75; // PhishTank doesn't provide confidence, so we estimate
    timestamp: entry.submission_date;
    description: entry.details || entry.title || `Phishing entry: ${entry.url}`;
    indicators: {
      domains: [entry.url],
      ips: [entry.ip].filter(Boolean),
      hashes: [],
      urls: [entry.phish_detail_url].filter(Boolean)
    };
    tags: entry.tags || [];
    isActive: entry.verified || entry.online;
    isSubscribed: false
  };
}

// Singleton instance
let phishTankClient: PhishTankClient | null = null;

export function getPhishTankClient(): PhishTankClient {
  if (!phishTankClient) {
    const config: PhishTankConfig = {
      apiKey: process.env.PHISHTANK_API_KEY || '',
      baseUrl: 'https://phishtank.com/api/v2',
      timeout: 30000,
      maxRetries: 3,
      retryDelay: 1000,
      rateLimit: {
        requestsPerMinute: 10,
        requestsPerHour: 600,
        requestsPerDay: 10000
      }
    };
    
    phishTankClient = new PhishTankClient(config);
  }
  return phishTankClient;
}
