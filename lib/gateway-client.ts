// TrustHire Gateway Client
// Handles communication with KrakenD API Gateway

export interface GatewayRequest {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  headers?: Record<string, string>;
  userId?: string;
}

export interface GatewayResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  headers: Record<string, string>;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

export class GatewayClient {
  private baseURL: string;
  private apiKey?: string;

  constructor(config?: { baseURL?: string; apiKey?: string }) {
    this.baseURL = config?.baseURL || process.env.GATEWAY_URL || 'http://localhost:8080';
    this.apiKey = config?.apiKey || process.env.GATEWAY_API_KEY;
  }

  private getHeaders(userId?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    if (userId) {
      headers['X-User-ID'] = userId;
    }

    return headers;
  }

  private parseRateLimit(headers: Record<string, string>): RateLimitInfo {
    return {
      limit: parseInt(headers['x-rate-limit-limit'] || '0'),
      remaining: parseInt(headers['x-rate-limit-remaining'] || '0'),
      reset: parseInt(headers['x-rate-limit-reset'] || '0'),
    };
  }

  async request<T = any>(config: GatewayRequest): Promise<GatewayResponse<T> & { rateLimit?: RateLimitInfo }> {
    const { endpoint, method = 'GET', data, headers, userId } = config;
    
    const url = `${this.baseURL}${endpoint}`;
    const requestHeaders = { ...this.getHeaders(userId), ...headers };

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: data ? JSON.stringify(data) : undefined,
      });

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      return {
        data: response.ok ? responseData : undefined,
        error: !response.ok ? responseData?.error || 'Request failed' : undefined,
        status: response.status,
        headers: responseHeaders,
        rateLimit: this.parseRateLimit(responseHeaders),
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
        headers: {},
      };
    }
  }

  // Assessment endpoints
  async createAssessment(data: any, userId?: string) {
    return this.request({
      endpoint: '/assessment',
      method: 'POST',
      data,
      userId,
    });
  }

  // Sandbox analysis endpoints
  async analyzeCode(code: string, userId?: string) {
    return this.request({
      endpoint: '/sandbox/analyze',
      method: 'POST',
      data: { code },
      userId,
    });
  }

  // Scan endpoints
  async scanRepository(repoUrl: string, userId?: string) {
    return this.request({
      endpoint: '/scan/repo',
      method: 'POST',
      data: { repoUrl },
      userId,
    });
  }

  async scanUrl(url: string, userId?: string) {
    return this.request({
      endpoint: '/scan/url',
      method: 'POST',
      data: { url },
      userId,
    });
  }

  // Pattern endpoints
  async getPatterns() {
    return this.request({
      endpoint: '/patterns',
      method: 'GET',
    });
  }

  // Assessment endpoints
  async getRecentAssessments(userId?: string) {
    return this.request({
      endpoint: '/assessments/recent',
      method: 'GET',
      userId,
    });
  }

  // Report endpoints
  async createReport(data: any, userId?: string) {
    return this.request({
      endpoint: '/report',
      method: 'POST',
      data,
      userId,
    });
  }

  // Health check
  async healthCheck() {
    return this.request({
      endpoint: '/__health',
      method: 'GET',
    });
  }

  // Metrics endpoint
  async getMetrics() {
    return this.request({
      endpoint: '/__debug/metrics',
      method: 'GET',
    });
  }
}

// Singleton instance
export const gatewayClient = new GatewayClient();

// React hook for using gateway client
export function useGatewayClient() {
  return gatewayClient;
}

export default gatewayClient;
