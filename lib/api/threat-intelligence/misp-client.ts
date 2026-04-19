// MISP (Malware Information Sharing Platform) Client Integration
// Connects to MISP instances for real-time threat intelligence data

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface MISPEvent {
  id: string;
  uuid: string;
  info: string;
  timestamp: string;
  published: boolean;
  threat_level: 'high' | 'medium' | 'low';
  analysis: string;
  tags: string[];
  attributes: Record<string, any>;
}

export interface MISPAttribute {
  type: string;
  value: string;
  category: string;
  to_ids: string[];
  distribution: string;
  timestamp: string;
  comment: string;
}

export interface MISPSighting {
  id: string;
  uuid: string;
  event_id: string;
  org_id: string;
  source: string;
  date: string;
  sighting_of_attribute: MISPAttribute[];
}

export interface MISPConfig {
  url: string;
  apiKey: string;
  verifySsl: boolean;
  timeout: number;
  organization?: string;
  maxRetries: number;
  retryDelay: number;
}

export class MISPClient {
  private axios: AxiosInstance;
  private config: MISPConfig;

  constructor(config: MISPConfig) {
    this.config = config;
    this.axios = axios.create({
      baseURL: config.url,
      timeout: config.timeout,
      headers: {
        'Authorization': config.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  // Event Management
  async getEvents(options: {
    limit?: number;
    page?: number;
    tags?: string[];
    threat_level?: string;
    date_from?: string;
    date_to?: string;
    published?: boolean;
  } = {}): Promise<{ events: MISPEvent[]; total: number }> {
    try {
      const response = await this.axios.get('/events', {
        params: options
      });
      return response.data;
    } catch (error) {
      console.error('MISP getEvents error:', error);
      throw new Error(`Failed to fetch MISP events: ${error.message}`);
    }
  }

  async createEvent(event: Partial<MISPEvent>): Promise<MISPEvent> {
    try {
      const response = await this.axios.post('/events', event);
      return response.data;
    } catch (error) {
      console.error('MISP createEvent error:', error);
      throw new Error(`Failed to create MISP event: ${error.message}`);
    }
  }

  async updateEvent(id: string, event: Partial<MISPEvent>): Promise<MISPEvent> {
    try {
      const response = await this.axios.put(`/events/${id}`, event);
      return response.data;
    } catch (error) {
      console.error('MISP updateEvent error:', error);
      throw new Error(`Failed to update MISP event: ${error.message}`);
    }
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      await this.axios.delete(`/events/${id}`);
    } catch (error) {
      console.error('MISP deleteEvent error:', error);
      throw new Error(`Failed to delete MISP event: ${error.message}`);
    }
  }

  // Sightings Management
  async getSightings(options: {
    limit?: number;
    page?: number;
    event_id?: string;
    org_id?: string;
    date_from?: string;
    date_to?: string;
  } = {}): Promise<{ sightings: MISPSighting[]; total: number }> {
    try {
      const response = await this.axios.get('/sightings', {
        params: options
      });
      return response.data;
    } catch (error) {
      console.error('MISP getSightings error:', error);
      throw new Error(`Failed to fetch MISP sightings: ${error.message}`);
    }
  }

  async createSighting(sighting: Partial<MISPSighting>): Promise<MISPSighting> {
    try {
      const response = await this.axios.post('/sightings', sighting);
      return response.data;
    } catch (error) {
      console.error('MISP createSighting error:', error);
      throw new Error(`Failed to create MISP sighting: ${error.message}`);
    }
  }

  // Attributes Management
  async getAttributes(eventId: string): Promise<MISPAttribute[]> {
    try {
      const response = await this.axios.get(`/events/${eventId}/attributes`);
      return response.data;
    } catch (error) {
      console.error('MISP getAttributes error:', error);
      throw new Error(`Failed to fetch MISP attributes: ${error.message}`);
    }
  }

  async addAttribute(eventId: string, attribute: Partial<MISPAttribute>): Promise<MISPAttribute> {
    try {
      const response = await this.axios.post(`/events/${eventId}/attributes`, attribute);
      return response.data;
    } catch (error) {
      console.error('MISP addAttribute error:', error);
      throw new Error(`Failed to add MISP attribute: ${error.message}`);
    }
  }

  // Search and Filtering
  async searchEvents(query: string, options: {
    limit?: number;
    type?: string;
    category?: string;
    tags?: string[];
  } = {}): Promise<MISPEvent[]> {
    try {
      const response = await this.axios.get('/events/restSearch', {
        params: {
          value: query,
          limit: options.limit || 50,
          type: options.type,
          category: options.category,
          tags: options.tags
        }
      });
      return response.data;
    } catch (error) {
      console.error('MISP searchEvents error:', error);
      throw new Error(`Failed to search MISP events: ${error.message}`);
    }
  }

  // Statistics and Analytics
  async getStatistics(): Promise<{
    total_events: number;
    total_sightings: number;
    events_by_threat_level: Record<string, number>;
    events_by_type: Record<string, number>;
    recent_activity: {
      last_24h: number;
      last_7d: number;
      last_30d: number;
    };
  }> {
    try {
      const response = await this.axios.get('/statistics');
      return response.data;
    } catch (error) {
      console.error('MISP getStatistics error:', error);
      throw new Error(`Failed to fetch MISP statistics: ${error.message}`);
    }
  }

  // Health Check
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    response_time: number;
    timestamp: string;
    details?: Record<string, any>;
  }> {
    const startTime = Date.now();
    try {
      const response = await this.axios.get('/health', {
        timeout: 5000
      });
      return {
        ...response.data,
        response_time: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        response_time: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        details: { error: error.message }
      };
    }
  }

  // Batch Operations
  async batchCreateEvents(events: Partial<MISPEvent>[]): Promise<MISPEvent[]> {
    try {
      const response = await this.axios.post('/events/batch', { events });
      return response.data;
    } catch (error) {
      console.error('MISP batchCreateEvents error:', error);
      throw new Error(`Failed to batch create MISP events: ${error.message}`);
    }
  }

  // Real-time Updates (Webhook Support)
  setupWebhook(endpoint: string, secret: string): void {
    // This would typically be implemented server-side
    // Client would register webhook endpoint with MISP
    console.log(`Webhook setup for endpoint: ${endpoint}`);
  }

  // Data Transformation
  transformToTrustHireFormat(mispEvent: MISPEvent): {
    id: string;
    name: string;
    source: 'MISP';
    type: 'malware' | 'phishing' | 'vulnerability' | 'apt' | 'ransomware';
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    timestamp: string;
    description: string;
    indicators: {
      domains: string[];
      ips: string[];
      hashes: string[];
      urls: string[];
    };
    tags: string[];
    isActive: boolean;
    isSubscribed: boolean;
  } {
    // Extract relevant data from MISP event
    const threatType = this.mapThreatType(mispEvent.info);
    const threatLevel = this.mapThreatLevel(mispEvent.threat_level);
    
    return {
      id: mispEvent.uuid || mispEvent.id,
      name: mispEvent.info,
      source: 'MISP',
      type: threatType,
      severity: threatLevel,
      confidence: this.calculateConfidence(mispEvent),
      timestamp: mispEvent.timestamp,
      description: mispEvent.analysis || mispEvent.info,
      indicators: this.extractIndicators(mispEvent),
      tags: mispEvent.tags || [],
      isActive: !mispEvent.published,
      isSubscribed: false // Will be determined by user preferences
    };
  }

  private mapThreatType(info: string): 'malware' | 'phishing' | 'vulnerability' | 'apt' | 'ransomware' {
    const lowerInfo = info.toLowerCase();
    if (lowerInfo.includes('malware') || lowerInfo.includes('trojan')) return 'malware';
    if (lowerInfo.includes('phishing') || lowerInfo.includes('spoofing')) return 'phishing';
    if (lowerInfo.includes('vulnerability') || lowerInfo.includes('cve')) return 'vulnerability';
    if (lowerInfo.includes('apt') || lowerInfo.includes('advanced persistent')) return 'apt';
    if (lowerInfo.includes('ransomware') || lowerInfo.includes('encrypt')) return 'ransomware';
    return 'malware'; // Default
  }

  private mapThreatLevel(level: string): 'low' | 'medium' | 'high' | 'critical' {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('critical')) return 'critical';
    if (lowerLevel.includes('high')) return 'high';
    if (lowerLevel.includes('medium')) return 'medium';
    return 'low';
  }

  private calculateConfidence(event: MISPEvent): number {
    // Calculate confidence based on MISP event data
    let confidence = 50; // Base confidence
    
    if (event.analysis && event.analysis.length > 0) {
      confidence += 20;
    }
    
    if (event.tags && event.tags.length > 0) {
      confidence += 15;
    }
    
    if (event.attributes && event.attributes.length > 0) {
      confidence += 15;
    }
    
    return Math.min(confidence, 100);
  }

  private extractIndicators(event: MISPEvent): {
    domains: string[];
    ips: string[];
    hashes: string[];
    urls: string[];
    
    // Extract IOCs from event attributes
    if (event.attributes) {
      event.attributes.forEach(attr => {
        switch (attr.type) {
          case 'domain':
            if (typeof attr.value === 'string') {
              this.domains.push(attr.value);
            }
            break;
          case 'ip':
            if (typeof attr.value === 'string') {
              this.ips.push(attr.value);
            }
            break;
          case 'hash':
            if (typeof attr.value === 'string') {
              this.hashes.push(attr.value);
            }
            break;
          case 'url':
            if (typeof attr.value === 'string') {
              this.urls.push(attr.value);
            }
            break;
        }
      });
    }
    
    return {
      domains: this.domains,
      ips: this.ips,
      hashes: this.hashes,
      urls: this.urls
    };
  }
}

// Singleton instance
let mispClient: MISPClient | null = null;

export function getMISPClient(): MISPClient {
  if (!mispClient) {
    const config: MISPConfig = {
      url: process.env.MISP_URL || 'https://misp.example.com',
      apiKey: process.env.MISP_API_KEY || '',
      verifySsl: process.env.MISP_VERIFY_SSL !== 'false',
      timeout: parseInt(process.env.MISP_TIMEOUT || '30000'),
      organization: process.env.MISP_ORGANIZATION,
      maxRetries: 3,
      retryDelay: 1000
    };
    
    mispClient = new MISPClient(config);
  }
  return mispClient;
}
