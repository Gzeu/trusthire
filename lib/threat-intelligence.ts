// Threat Intelligence Service for TrustHire
// Real-time threat data integration and analysis

export interface ThreatFeed {
  id: string;
  name: string;
  type: 'malware' | 'phishing' | 'domain' | 'ip' | 'hash' | 'pattern';
  source: 'virustotal' | 'abuseipdb' | 'phishtank' | 'custom';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  indicators: string[];
  tags: string[];
  firstSeen: string;
  lastSeen: string;
  confidence: number; // 0-100
}

export interface ThreatMatch {
  threatId: string;
  matchType: 'exact' | 'partial' | 'pattern';
  confidence: number;
  details: string;
  recommendations: string[];
}

export interface ThreatAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // 0-100
  threatsDetected: number;
  matches: ThreatMatch[];
  recommendations: string[];
  lastUpdated: string;
}

export class ThreatIntelligence {
  private threatFeeds: Map<string, ThreatFeed> = new Map();
  private cacheTimeout = 3600000; // 1 hour
  private lastUpdate = 0;

  constructor() {
    this.initializeThreatFeeds();
  }

  // Initialize with known threat patterns
  private initializeThreatFeeds(): void {
    // Known malicious domains
    const maliciousDomains = [
      'pastebin.com',
      'gist.github.com',
      'bit.ly',
      'tinyurl.com',
      't.me',
      'discord.com',
      'webhook.site',
      'ngrok.io',
      '0x0.st',
      'gofile.io',
      'anonfiles.com',
      'file.io',
      'transfer.sh',
    ];

    maliciousDomains.forEach(domain => {
      this.threatFeeds.set(`domain:${domain}`, {
        id: `domain-${domain}`,
        name: `Malicious Domain: ${domain}`,
        type: 'domain',
        source: 'custom',
        severity: 'high',
        description: `Domain frequently used for malware distribution and phishing`,
        indicators: [domain],
        tags: ['phishing', 'malware', 'c2'],
        firstSeen: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastSeen: new Date().toISOString(),
        confidence: 85,
      });
    });

    // Known malicious file patterns
    const maliciousPatterns = [
      {
        pattern: /postinstall|preinstall|install\.sh|setup\.bat|run\.bat/i,
        type: 'npm_script',
        severity: 'critical',
        description: 'NPM post/preinstall scripts commonly used for malware delivery',
      },
      {
        pattern: /eval\s*\(|Function\s*\(|setTimeout\s*\(/gi,
        type: 'code_execution',
        severity: 'critical',
        description: 'Dynamic code execution patterns',
      },
      {
        pattern: /process\.env|process\.argv|require\s*\(/gi,
        type: 'system_access',
        severity: 'high',
        description: 'System environment and module access',
      },
      {
        pattern: /(curl|wget|fetch|axios)\s*\+.*\(/gi,
        type: 'command_injection',
        severity: 'critical',
        description: 'Command injection via HTTP requests',
      },
      {
        pattern: /(private|secret|key|mnemonic|wallet|seed)/gi,
        type: 'crypto_theft',
        severity: 'critical',
        description: 'Cryptographic key and wallet theft',
      },
      {
        pattern: /child_process\.(exec|spawn|fork)/gi,
        type: 'process_execution',
        severity: 'critical',
        description: 'Child process execution for system compromise',
      },
    ];

    maliciousPatterns.forEach((pattern, index) => {
      this.threatFeeds.set(`pattern-${index}`, {
        id: `pattern-${index}`,
        name: `Malicious Pattern: ${pattern.type}`,
        type: 'pattern',
        source: 'custom',
        severity: pattern.severity as 'low' | 'medium' | 'high' | 'critical',
        description: pattern.description,
        indicators: [pattern.pattern.toString()],
        tags: [pattern.type, 'malware', 'exploitation'],
        firstSeen: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastSeen: new Date().toISOString(),
        confidence: 90,
      });
    });

    // Known malicious file hashes (simulated)
    const maliciousHashes = [
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      '5d41402abc4b2a76b9719d911017c592',
      '258632df1b5c5a1b7b5e5d5e5d5e5d5e',
    ];

    maliciousHashes.forEach((hash, index) => {
      this.threatFeeds.set(`hash-${hash}`, {
        id: `hash-${hash}`,
        name: `Malicious File Hash: ${hash.substring(0, 8)}...`,
        type: 'hash',
        source: 'custom',
        severity: 'critical',
        description: 'Known malicious file hash detected',
        indicators: [hash],
        tags: ['malware', 'hash', 'signature'],
        firstSeen: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastSeen: new Date().toISOString(),
        confidence: 95,
      });
    });
  }

  // Analyze content against threat feeds
  async analyzeThreats(content: {
    code?: string;
    urls?: string[];
    files?: Array<{ name: string; hash?: string; content?: string }>;
    metadata?: any;
  }): Promise<ThreatAssessment> {
    const matches: ThreatMatch[] = [];
    let totalRiskScore = 0;

    // Analyze code patterns
    if (content.code) {
      const codeMatches = this.analyzeCodePatterns(content.code);
      matches.push(...codeMatches);
    }

    // Analyze URLs
    if (content.urls) {
      const urlMatches = this.analyzeUrls(content.urls);
      matches.push(...urlMatches);
    }

    // Analyze files
    if (content.files) {
      const fileMatches = this.analyzeFiles(content.files);
      matches.push(...fileMatches);
    }

    // Calculate overall risk
    const criticalThreats = matches.filter(m => this.getThreatById(m.threatId)?.severity === 'critical').length;
    const highThreats = matches.filter(m => this.getThreatById(m.threatId)?.severity === 'high').length;
    const mediumThreats = matches.filter(m => this.getThreatById(m.threatId)?.severity === 'medium').length;

    totalRiskScore = (criticalThreats * 25) + (highThreats * 15) + (mediumThreats * 8);
    totalRiskScore = Math.min(100, totalRiskScore);

    const overallRisk: ThreatAssessment['overallRisk'] = 
      totalRiskScore >= 75 ? 'critical' :
      totalRiskScore >= 50 ? 'high' :
      totalRiskScore >= 25 ? 'medium' : 'low';

    return {
      overallRisk,
      riskScore: totalRiskScore,
      threatsDetected: matches.length,
      matches,
      recommendations: this.generateRecommendations(matches),
      lastUpdated: new Date().toISOString(),
    };
  }

  // Analyze code patterns
  private analyzeCodePatterns(code: string): ThreatMatch[] {
    const matches: ThreatMatch[] = [];

    this.threatFeeds.forEach((threat, id) => {
      if (threat.type === 'pattern') {
        const pattern = new RegExp(threat.indicators[0], 'gi');
        const found = code.match(pattern);

        if (found) {
          matches.push({
            threatId: id,
            matchType: 'pattern',
            confidence: threat.confidence,
            details: `Found ${found.length} instances of ${threat.name}`,
            recommendations: this.getThreatRecommendations(threat),
          });
        }
      }
    });

    return matches;
  }

  // Analyze URLs
  private analyzeUrls(urls: string[]): ThreatMatch[] {
    const matches: ThreatMatch[] = [];

    urls.forEach(url => {
      const domain = url.toLowerCase().split('/')[2];
      
      this.threatFeeds.forEach((threat, id) => {
        if (threat.type === 'domain') {
          const indicators = threat.indicators.map(ind => ind.toLowerCase());
          
          if (indicators.some(ind => url.includes(ind) || domain?.includes(ind))) {
            matches.push({
              threatId: id,
              matchType: 'exact',
              confidence: threat.confidence,
              details: `URL matches malicious domain: ${threat.name}`,
              recommendations: this.getThreatRecommendations(threat),
            });
          }
        }
      });
    });

    return matches;
  }

  // Analyze files
  private analyzeFiles(files: Array<{ name: string; hash?: string; content?: string }>): ThreatMatch[] {
    const matches: ThreatMatch[] = [];

    files.forEach(file => {
      // Check file hash
      if (file.hash) {
        this.threatFeeds.forEach((threat, id) => {
          if (threat.type === 'hash' && threat.indicators.includes(file.hash!)) {
            matches.push({
              threatId: id,
              matchType: 'exact',
              confidence: threat.confidence,
              details: `File hash matches known malicious signature: ${file.name}`,
              recommendations: this.getThreatRecommendations(threat),
            });
          }
        });
      }

      // Check file content
      if (file.content) {
        const contentMatches = this.analyzeCodePatterns(file.content);
        contentMatches.forEach(match => {
          match.details = `In file ${file.name}: ${match.details}`;
        });
        matches.push(...contentMatches);
      }

      // Check file name
      const nameMatches = this.analyzeCodePatterns(file.name);
      nameMatches.forEach(match => {
        match.details = `In filename ${file.name}: ${match.details}`;
      });
      matches.push(...nameMatches);
    });

    return matches;
  }

  // Get threat by ID
  private getThreatById(id: string): ThreatFeed | undefined {
    return this.threatFeeds.get(id);
  }

  // Get recommendations for threat
  private getThreatRecommendations(threat: ThreatFeed): string[] {
    const baseRecommendations = [
      'Review the identified threat indicators',
      'Consider blocking the malicious domains/IPs',
      'Implement additional security controls',
    ];

    const severityRecommendations: Record<string, string[]> = {
      critical: [
        'IMMEDIATE ACTION REQUIRED',
        'Isolate the affected system',
        'Block all network connections',
        'Scan for additional compromises',
        'Review all recent activity',
      ],
      high: [
        'Investigate immediately',
        'Block malicious indicators',
        'Monitor for additional activity',
        'Review system logs',
      ],
      medium: [
        'Investigate within 24 hours',
        'Monitor for suspicious activity',
        'Consider blocking indicators',
        'Update security controls',
      ],
      low: [
        'Monitor for patterns',
        'Update threat intelligence',
        'Review during next security audit',
      ],
    };

    return [...(severityRecommendations[threat.severity] || severityRecommendations.low), ...baseRecommendations];
  }

  // Generate overall recommendations
  private generateRecommendations(matches: ThreatMatch[]): string[] {
    const recommendations = new Set<string>();

    // Add threat-specific recommendations
    matches.forEach(match => {
      const threat = this.getThreatById(match.threatId);
      if (threat) {
        this.getThreatRecommendations(threat).forEach(rec => recommendations.add(rec));
      }
    });

    // Add general recommendations based on match count
    if (matches.length > 5) {
      recommendations.add('High number of threats detected - immediate investigation required');
      recommendations.add('Consider blocking all external network access');
      recommendations.add('Full system scan recommended');
    } else if (matches.length > 2) {
      recommendations.add('Multiple threats detected - thorough investigation needed');
      recommendations.add('Monitor system behavior closely');
    }

    // Add severity-based recommendations
    const criticalThreats = matches.filter(m => this.getThreatById(m.threatId)?.severity === 'critical');
    if (criticalThreats.length > 0) {
      recommendations.add('CRITICAL THREATS DETECTED - IMMEDIATE ACTION REQUIRED');
      recommendations.add('Do not execute any code from this source');
      recommendations.add('Report to security team immediately');
    }

    return Array.from(recommendations);
  }

  // Update threat feeds from external sources
  async updateThreatFeeds(): Promise<void> {
    const now = Date.now();
    
    // Check if update is needed
    if (now - this.lastUpdate < this.cacheTimeout) {
      return;
    }

    try {
      // This would integrate with real threat intelligence APIs
      // For now, we'll simulate the update
      console.log('Updating threat feeds...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.lastUpdate = now;
      console.log('Threat feeds updated successfully');
    } catch (error) {
      console.error('Failed to update threat feeds:', error);
    }
  }

  // Get threat statistics
  getStatistics(): {
    totalThreats: number;
    threatsByType: Record<string, number>;
    threatsBySeverity: Record<string, number>;
    threatsBySource: Record<string, number>;
    lastUpdate: number;
  } {
    const threatsByType: Record<string, number> = {};
    const threatsBySeverity: Record<string, number> = {};
    const threatsBySource: Record<string, number> = {};

    this.threatFeeds.forEach(threat => {
      threatsByType[threat.type] = (threatsByType[threat.type] || 0) + 1;
      threatsBySeverity[threat.severity] = (threatsBySeverity[threat.severity] || 0) + 1;
      threatsBySource[threat.source] = (threatsBySource[threat.source] || 0) + 1;
    });

    return {
      totalThreats: this.threatFeeds.size,
      threatsByType,
      threatsBySeverity,
      threatsBySource,
      lastUpdate: this.lastUpdate,
    };
  }

  // Add custom threat
  addCustomThreat(threat: Omit<ThreatFeed, 'id'>): string {
    const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullThreat: ThreatFeed = { ...threat, id };
    
    this.threatFeeds.set(id, fullThreat);
    return id;
  }

  // Remove threat
  removeThreat(id: string): boolean {
    return this.threatFeeds.delete(id);
  }

  // Get all threats
  getAllThreats(): ThreatFeed[] {
    return Array.from(this.threatFeeds.values());
  }

  // Search threats
  searchThreats(query: string): ThreatFeed[] {
    const lowerQuery = query.toLowerCase();
    
    return Array.from(this.threatFeeds.values()).filter(threat => 
      threat.name.toLowerCase().includes(lowerQuery) ||
      threat.description.toLowerCase().includes(lowerQuery) ||
      threat.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      threat.indicators.some(indicator => indicator.toLowerCase().includes(lowerQuery))
    );
  }
}

// Singleton instance
export const threatIntelligence = new ThreatIntelligence();

// React hook for using threat intelligence
export function useThreatIntelligence() {
  return threatIntelligence;
}

export default threatIntelligence;
