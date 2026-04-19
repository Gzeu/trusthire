// VirusTotal API Client for Real URL Analysis
// Provides real URL scanning instead of mock data

export interface VirusTotalFileReport {
  scan_id: string;
  resource: string;
  sha256: string;
  sha1: string;
  md5: string;
  scan_date: string;
  permalink: string;
  positives: number;
  total: number;
  verbose_msg: string;
  response_code: number;
  filescan_id: string | null;
  engines: Record<string, {
    detected: boolean;
    version: string;
    result: string;
    update: string;
  }>;
}

export interface VirusTotalURLReport {
  scan_id: string;
  resource: string;
  url: string;
  permalink: string;
  positives: number;
  total: number;
  scan_date: string;
  verbose_msg: string;
  response_code: number;
  engines: Record<string, {
    detected: boolean;
    result: string;
    category: string;
    update: string;
  }>;
}

export interface VirusTotalIPReport {
  asn: string;
  asn_owner: string;
  country: string;
  ip: string;
  last_seen: string;
  permalink: string;
  positives: number;
  resource: string;
  response_code: number;
  verbose_msg: string;
  engines: Record<string, {
    detected: boolean;
    result: string;
    update: string;
  }>;
}

export interface VirusTotalDomainReport {
  domain: string;
  last_seen: string;
  permalink: string;
  positives: number;
  response_code: string;
  verbose_msg: string;
  engines: Record<string, {
    detected: boolean;
    result: string;
    update: string;
  }>;
}

export class VirusTotalClient {
  private baseUrl: string;
  private apiKey: string | null;
  private headers: Record<string, string>;

  constructor(apiKey?: string) {
    this.baseUrl = 'https://www.virustotal.com/vtapi/v2';
    this.apiKey = apiKey || process.env.VIRUSTOTAL_API_KEY || null;
    this.headers = {
      'User-Agent': 'TrustHire-Security-Scanner'
    };
  }

  private async makeRequest<T>(url: string): Promise<T> {
    try {
      if (!this.apiKey) {
        throw new Error('VirusTotal API key not configured. Please set VIRUSTOTAL_API_KEY environment variable.');
      }

      const response = await fetch(url, {
        headers: this.headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`VirusTotal API Error: ${response.status} - ${errorData.verbose_msg || response.statusText}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.error('VirusTotal API request failed:', error);
      throw error;
    }
  }

  async scanFile(fileHash: string): Promise<VirusTotalFileReport> {
    const url = `${this.baseUrl}/file/report?apikey=${this.apiKey}&resource=${fileHash}`;
    return this.makeRequest<VirusTotalFileReport>(url);
  }

  async scanURL(url: string): Promise<VirusTotalURLReport> {
    const encodedUrl = encodeURIComponent(url);
    const apiUrl = `${this.baseUrl}/url/report?apikey=${this.apiKey}&resource=${encodedUrl}`;
    return this.makeRequest<VirusTotalURLReport>(apiUrl);
  }

  async scanIP(ip: string): Promise<VirusTotalIPReport> {
    const url = `${this.baseUrl}/ip-address/report?apikey=${this.apiKey}&ip=${ip}`;
    return this.makeRequest<VirusTotalIPReport>(url);
  }

  async scanDomain(domain: string): Promise<VirusTotalDomainReport> {
    const url = `${this.baseUrl}/domain/report?apikey=${this.apiKey}&domain=${domain}`;
    return this.makeRequest<VirusTotalDomainReport>(url);
  }

  async getFileReport(fileHash: string, allInfo = false): Promise<VirusTotalFileReport> {
    const url = `${this.baseUrl}/file/report?apikey=${this.apiKey}&resource=${fileHash}&allinfo=${allInfo}`;
    return this.makeRequest<VirusTotalFileReport>(url);
  }

  async getURLReport(url: string, allInfo = false): Promise<VirusTotalURLReport> {
    const encodedUrl = encodeURIComponent(url);
    const apiUrl = `${this.baseUrl}/url/report?apikey=${this.apiKey}&resource=${encodedUrl}&allinfo=${allInfo}`;
    return this.makeRequest<VirusTotalURLReport>(apiUrl);
  }

  async getIPReport(ip: string): Promise<VirusTotalIPReport> {
    const url = `${this.baseUrl}/ip-address/report?apikey=${this.apiKey}&ip=${ip}`;
    return this.makeRequest<VirusTotalIPReport>(url);
  }

  async getDomainReport(domain: string): Promise<VirusTotalDomainReport> {
    const url = `${this.baseUrl}/domain/report?apikey=${this.apiKey}&domain=${domain}`;
    return this.makeRequest<VirusTotalDomainReport>(url);
  }

  // Helper methods for analysis
  analyzeFileReport(report: VirusTotalFileReport): {
    isMalicious: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    threatTypes: string[];
    recommendations: string[];
  } {
    const isMalicious = report.positives > 0;
    const ratio = report.positives / report.total;
    
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (ratio === 0) riskLevel = 'low';
    else if (ratio <= 0.1) riskLevel = 'medium';
    else if (ratio <= 0.3) riskLevel = 'high';
    else riskLevel = 'critical';

    const threatTypes: string[] = [];
    for (const [engine, result] of Object.entries(report.engines)) {
      if (result.detected) {
        threatTypes.push(`${engine}: ${result.result}`);
      }
    }

    const recommendations: string[] = [];
    if (isMalicious) {
      recommendations.push('Isolate and quarantine the file immediately');
      recommendations.push('Scan all systems that may have accessed this file');
      recommendations.push('Update antivirus signatures and perform full system scan');
      recommendations.push('Report to security team for incident response');
    } else {
      recommendations.push('File appears clean, but continue monitoring');
      recommendations.push('Keep antivirus software updated');
      recommendations.push('Implement file integrity monitoring');
    }

    return {
      isMalicious,
      riskLevel,
      threatTypes,
      recommendations
    };
  }

  analyzeURLReport(report: VirusTotalURLReport): {
    isMalicious: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    threatTypes: string[];
    recommendations: string[];
  } {
    const isMalicious = report.positives > 0;
    const ratio = report.positives / report.total;
    
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (ratio === 0) riskLevel = 'low';
    else if (ratio <= 0.1) riskLevel = 'medium';
    else if (ratio <= 0.3) riskLevel = 'high';
    else riskLevel = 'critical';

    const threatTypes: string[] = [];
    for (const [engine, result] of Object.entries(report.engines)) {
      if (result.detected) {
        threatTypes.push(`${engine}: ${result.result}`);
      }
    }

    const recommendations: string[] = [];
    if (isMalicious) {
      recommendations.push('Block access to this URL immediately');
      recommendations.push('Add URL to security blacklist');
      recommendations.push('Scan all systems that accessed this URL');
      recommendations.push('Educate users about phishing and malicious URLs');
      recommendations.push('Review web filtering and DNS settings');
    } else {
      recommendations.push('URL appears clean, but monitor for changes');
      recommendations.push('Implement web filtering and URL scanning');
      recommendations.push('Educate users about URL safety');
    }

    return {
      isMalicious,
      riskLevel,
      threatTypes,
      recommendations
    };
  }

  analyzeIPReport(report: VirusTotalIPReport): {
    isMalicious: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    threatTypes: string[];
    recommendations: string[];
    geoInfo: {
      country: string;
      asn: string;
      asnOwner: string;
    };
  } {
    const isMalicious = report.positives > 0;
    const ratio = report.positives / Object.keys(report.engines).length;
    
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (ratio === 0) riskLevel = 'low';
    else if (ratio <= 0.1) riskLevel = 'medium';
    else if (ratio <= 0.3) riskLevel = 'high';
    else riskLevel = 'critical';

    const threatTypes: string[] = [];
    for (const [engine, result] of Object.entries(report.engines)) {
      if (result.detected) {
        threatTypes.push(`${engine}: ${result.result}`);
      }
    }

    const recommendations: string[] = [];
    if (isMalicious) {
      recommendations.push('Block this IP address immediately');
      recommendations.push('Add IP to firewall blacklist');
      recommendations.push('Monitor all traffic from this IP');
      recommendations.push('Review logs for any connections from this IP');
      recommendations.push('Consider implementing IP reputation filtering');
    } else {
      recommendations.push('IP appears clean, but monitor for changes');
      recommendations.push('Implement IP reputation monitoring');
      recommendations.push('Review network traffic patterns');
    }

    return {
      isMalicious,
      riskLevel,
      threatTypes,
      recommendations,
      geoInfo: {
        country: report.country,
        asn: report.asn,
        asnOwner: report.asn_owner
      }
    };
  }

  analyzeDomainReport(report: VirusTotalDomainReport): {
    isMalicious: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    threatTypes: string[];
    recommendations: string[];
  } {
    const isMalicious = report.positives > 0;
    const ratio = report.positives / Object.keys(report.engines).length;
    
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (ratio === 0) riskLevel = 'low';
    else if (ratio <= 0.1) riskLevel = 'medium';
    else if (ratio <= 0.3) riskLevel = 'high';
    else riskLevel = 'critical';

    const threatTypes: string[] = [];
    for (const [engine, result] of Object.entries(report.engines)) {
      if (result.detected) {
        threatTypes.push(`${engine}: ${result.result}`);
      }
    }

    const recommendations: string[] = [];
    if (isMalicious) {
      recommendations.push('Block this domain immediately');
      recommendations.push('Add domain to DNS blacklist');
      recommendations.push('Review all subdomains and related domains');
      recommendations.push('Monitor for domain registration changes');
      recommendations.push('Educate users about this malicious domain');
    } else {
      recommendations.push('Domain appears clean, but monitor for changes');
      recommendations.push('Implement DNS filtering and monitoring');
      recommendations.push('Review domain registration details');
    }

    return {
      isMalicious,
      riskLevel,
      threatTypes,
      recommendations
    };
  }

  // Check if client is authenticated
  isAuthenticated(): boolean {
    return !!this.apiKey;
  }

  // Get API key status
  getAPIKeyStatus(): {
    configured: boolean;
    masked: string | null;
  } {
    if (!this.apiKey) {
      return { configured: false, masked: null };
    }
    
    const masked = this.apiKey.substring(0, 8) + '...' + this.apiKey.substring(this.apiKey.length - 4);
    return { configured: true, masked };
  }
}

// Singleton instance
export const virusTotalClient = new VirusTotalClient();
