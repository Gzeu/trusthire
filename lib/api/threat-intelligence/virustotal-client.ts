// VirusTotal API Client Integration
// Connects to VirusTotal for malware analysis and threat intelligence

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface VirusTotalFileReport {
  sha256: string;
  sha1: string;
  md5: string;
  ssdeep: string;
  scan_date: string;
  positives: number;
  total: number;
  permalink: string;
  submission_names: string[];
  tags: string[];
  threat_names: string[];
  threat_labels: string[];
  additional_info: Record<string, any>;
}

export interface VirusTotalDomainReport {
  domain: string;
  scan_date: string;
  positives: number;
  total: number;
  permalink: string;
  submission_names: string[];
  tags: string[];
  threat_names: string[];
  threat_labels: string[];
  additional_info: Record<string, any>;
}

export interface VirusTotalURLReport {
  url: string;
  scan_date: string;
  positives: number;
  total: number;
  permalink: string;
  submission_names: string[];
  tags: string[];
  threat_names: string[];
  threat_labels: string[];
  additional_info: Record<string, any>;
}

export interface VirusTotalIPReport {
  ip: string;
  scan_date: string;
  positives: number;
  total: number;
  permalink: string;
  submission_names: string[];
  tags: string[];
  threat_names: string[];
  threat_labels: string[];
  additional_info: Record<string, any>;
}

export interface VirusTotalConfig {
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

export class VirusTotalClient {
  private axios: AxiosInstance;
  private config: VirusTotalConfig;
  private requestCount = 0;
  private lastRequestTime = 0;

  constructor(config: VirusTotalConfig) {
    this.config = config;
    this.axios = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: {
        'x-apikey': config.apiKey,
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
      console.error(`VirusTotal ${endpoint} error:`, error);
      throw new Error(`Failed to call VirusTotal ${endpoint}: ${error.message}`);
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
      console.warn('Approaching VirusTotal rate limit');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // File Analysis
  async scanFile(file: Buffer | string, options: {
    allinfo?: boolean;
    scan?: boolean;
    upload?: boolean;
    analyses?: string[];
  } = {}): Promise<VirusTotalFileReport> {
    try {
      const formData = new FormData();
      
      if (typeof file === 'string') {
        formData.append('file', new Blob([file]));
      } else {
        formData.append('file', file);
      }
      
      if (options.allinfo) formData.append('allinfo', '1');
      if (options.scan) formData.append('scan', '1');
      if (options.upload) formData.append('upload', '1');
      
      if (options.analyses) {
        options.analyses.forEach(analysis => {
          formData.append('analyses[]', analysis);
        });
      }

      const response = await this.axios.post('/file/scan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 300000 // 5 minutes for file uploads
      });

      return response.data;
    } catch (error) {
      console.error('VirusTotal scanFile error:', error);
      throw new Error(`Failed to scan file with VirusTotal: ${error.message}`);
    }
  }

  // URL Analysis
  async scanUrl(url: string, options: {
    allinfo?: boolean;
    scan?: boolean;
    upload?: boolean;
  } = {}): Promise<VirusTotalURLReport> {
    try {
      const params: any = {
        url: url,
        allinfo: options.allinfo ? '1' : '0',
        scan: options.scan ? '1' : '0',
        upload: options.upload ? '1' : '0'
      };

      const response = await this.axios.post('/url/scan', params);
      return response.data;
    } catch (error) {
      console.error('VirusTotal scanUrl error:', error);
      throw new Error(`Failed to scan URL with VirusTotal: ${error.message}`);
    }
  }

  // IP Analysis
  async scanIP(ip: string, options: {
    allinfo?: boolean;
    scan?: boolean;
  } = {}): Promise<VirusTotalIPReport> {
    try {
      const params: any = {
        ip: ip,
        allinfo: options.allinfo ? '1' : '0',
        scan: options.scan ? '1' : '0'
      };

      const response = await this.axios.post('/ip-address/scan', params);
      return response.data;
    } catch (error) {
      console.error('VirusTotal scanIP error:', error);
      throw new Error(`Failed to scan IP with VirusTotal: ${error.message}`);
    }
  }

  // Domain Analysis
  async scanDomain(domain: string, options: {
    allinfo?: boolean;
    scan?: boolean;
  } = {}): Promise<VirusTotalDomainReport> {
    try {
      const params: any = {
        domain: domain,
        allinfo: options.allinfo ? '1' : '0',
        scan: options.scan ? '1' : '0'
      };

      const response = await this.axios.post('/domain/scan', params);
      return response.data;
    } catch (error) {
      console.error('VirusTotal scanDomain error:', error);
      throw new Error(`Failed to scan domain with VirusTotal: ${error.message}`);
    }
  }

  // Report Retrieval
  async getFileReport(resourceId: string): Promise<VirusTotalFileReport> {
    try {
      const response = await this.makeRequest<VirusTotalFileReport>(`/file/report/${resourceId}`);
      return response;
    } catch (error) {
      console.error('VirusTotal getFileReport error:', error);
      throw new Error(`Failed to get file report from VirusTotal: ${error.message}`);
    }
  }

  async getURLReport(resourceId: string): Promise<VirusTotalURLReport> {
    try {
      const response = await this.makeRequest<VirusTotalURLReport>(`/url/report/${resourceId}`);
      return response;
    } catch (error) {
      console.error('VirusTotal getURLReport error:', error);
      throw new Error(`Failed to get URL report from VirusTotal: ${error.message}`);
    }
  }

  async getIPReport(resourceId: string): Promise<VirusTotalIPReport> {
    try {
      const response = await this.makeRequest<VirusTotalIPReport>(`/ip-address/report/${resourceId}`);
      return response;
    } catch (error) {
      console.error('VirusTotal getIPReport error:', error);
      throw new Error(`Failed to get IP report from VirusTotal: ${error.message}`);
    }
  }

  async getDomainReport(resourceId: string): Promise<VirusTotalDomainReport> {
    try {
      const response = await this.makeRequest<VirusTotalDomainReport>(`/domain/report/${resourceId}`);
      return response;
    } catch (error) {
      console.error('VirusTotal getDomainReport error:', error);
      throw new Error(`Failed to get domain report from VirusTotal: ${error.message}`);
    }
  }

  // Comments and Notes
  async addComment(resourceId: string, comment: string): Promise<void> {
    try {
      const response = await this.axios.post(`/comments/${resourceId}`, {
        comment: comment,
        date: new Date().toISOString()
      });
    } catch (error) {
      console.error('VirusTotal addComment error:', error);
      throw new Error(`Failed to add comment to VirusTotal: ${error.message}`);
    }
  }

  // Search and Filtering
  async searchFiles(query: string, options: {
    limit?: number;
    page?: number;
    only?: string;
    positives?: string;
    negatives?: string;
    modifier?: string;
    date?: string;
  } = {}): Promise<any> {
    try {
      const params = {
        query,
        limit: options.limit || 50,
        page: options.page || 1,
        only: options.only,
        positives: options.positives,
        negatives: options.negatives,
        modifier: options.modifier,
        date: options.date
      };

      const response = await this.makeRequest('/file/search', { params });
      return response.data;
    } catch (error) {
      console.error('VirusTotal searchFiles error:', error);
      throw new Error(`Failed to search files with VirusTotal: ${error.message}`);
    }
  }

  // Statistics and Analytics
  async getStatistics(): Promise<{
    total_files: number;
    total_urls: number;
    total_ips: number;
    total_domains: number;
    recent_scans: {
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
      console.error('VirusTotal getStatistics error:', error);
      throw new Error(`Failed to get statistics from VirusTotal: ${error.message}`);
    }
  }

  // Batch Operations
  async batchScanFiles(files: Array<{ file: Buffer | string; name: string }>): Promise<any> {
    try {
      const formData = new FormData();
      
      files.forEach((fileObj, index) => {
        if (typeof fileObj.file === 'string') {
          formData.append(`file${index}`, new Blob([fileObj.file]));
        } else {
          formData.append(`file${index}`, fileObj.file);
        }
        formData.append(`filename${index}`, fileObj.name);
      });

      const response = await this.axios.post('/file/scan/batch', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 600000 // 10 minutes for batch uploads
      });

      return response.data;
    } catch (error) {
      console.error('VirusTotal batchScanFiles error:', error);
      throw new Error(`Failed to batch scan files with VirusTotal: ${error.message}`);
    }
  }

  // Data Transformation
  transformToTrustHireFormat(fileReport: VirusTotalFileReport): {
    id: fileReport.sha256 || fileReport.md5;
    name: fileReport.submission_names?.[0] || 'Unknown File';
    source: 'VirusTotal';
    type: this.mapThreatType(fileReport.threat_labels);
    severity: this.mapThreatLevel(fileReport.positives > 0 ? 'high' : 'low');
    confidence: Math.round((fileReport.positives / fileReport.total) * 100);
    timestamp: fileReport.scan_date;
    description: `File analysis completed. ${fileReport.positives}/${fileReport.total} detections found.`;
    indicators: {
      domains: [],
      ips: [],
      hashes: [fileReport.sha256, fileReport.md5, fileReport.sha1],
      urls: []
    };
    tags: fileReport.tags || [];
    isActive: true;
    isSubscribed: false
  };

  private mapThreatType(threatLabels: string[]): 'malware' | 'phishing' | 'vulnerability' | 'apt' | 'ransomware' {
    const lowerLabels = threatLabels.map(label => label.toLowerCase());
    
    if (lowerLabels.some(label => label.includes('malware') || label.includes('trojan'))) return 'malware';
    if (lowerLabels.some(label => label.includes('phishing') || label.includes('spoofing'))) return 'phishing';
    if (lowerLabels.some(label => label.includes('vulnerability') || label.includes('cve'))) return 'vulnerability';
    if (lowerLabels.some(label => label.includes('apt') || label.includes('advanced persistent'))) return 'apt';
    if (lowerLabels.some(label => label.includes('ransomware') || label.includes('encrypt'))) return 'ransomware';
    
    return 'malware'; // Default
  }

  private mapThreatLevel(positives: number, total: number): 'low' | 'medium' | 'high' | 'critical' {
    const ratio = positives / total;
    
    if (ratio >= 0.7) return 'critical';
    if (ratio >= 0.4) return 'high';
    if (ratio >= 0.2) return 'medium';
    return 'low';
  }
}

// Singleton instance
let virusTotalClient: VirusTotalClient | null = null;

export function getVirusTotalClient(): VirusTotalClient {
  if (!virusTotalClient) {
    const config: VirusTotalConfig = {
      apiKey: process.env.VIRUSTOTAL_API_KEY || '',
      baseUrl: 'https://www.virustotal.com/vtapi/v3',
      timeout: 30000,
      maxRetries: 3,
      retryDelay: 1000,
      rateLimit: {
        requestsPerMinute: 4,
        requestsPerHour: 240,
        requestsPerDay: 5000
      }
    };
    
    virusTotalClient = new VirusTotalClient(config);
  }
  return virusTotalClient;
}
