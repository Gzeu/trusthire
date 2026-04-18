// Behavioral Analysis for TrustHire
// Runtime monitoring and anomaly detection for code execution

export interface BehavioralPattern {
  type: 'network' | 'file_system' | 'process' | 'memory' | 'crypto';
  action: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suspicious: boolean;
  details: any;
}

export interface AnomalyDetection {
  anomalyType: string;
  confidence: number; // 0-100
  description: string;
  patterns: BehavioralPattern[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export interface RuntimeMonitor {
  startTime: number;
  duration: number;
  networkRequests: any[];
  fileOperations: any[];
  processCreations: any[];
  memoryUsage: any[];
  cryptoOperations: any[];
  anomalies: AnomalyDetection[];
}

export class BehavioralAnalyzer {
  private patterns: BehavioralPattern[] = [];
  private thresholds = {
    maxNetworkRequests: 10,
    maxFileOperations: 20,
    maxProcessCreations: 5,
    maxCryptoOperations: 3,
    maxMemoryUsage: 100 * 1024 * 1024, // 100MB
    suspiciousDomains: [
      'pastebin.com',
      'gist.github.com',
      'bit.ly',
      'tinyurl.com',
      't.me',
      'discord.com',
      'webhook.site',
      'ngrok.io',
    ],
    suspiciousFileExtensions: [
      '.exe', '.bat', '.cmd', '.scr', '.pif', '.com',
      '.vbs', '.js', '.jar', '.app', '.deb', '.rpm',
      '.dmg', '.pkg', '.msi', '.ps1', '.sh', '.py',
    ],
    suspiciousProcesses: [
      'powershell', 'cmd', 'bash', 'sh', 'python',
      'node', 'npm', 'curl', 'wget', 'nc', 'netcat',
      'ssh', 'scp', 'rsync', 'ftp', 'sftp',
    ],
  };

  // Start monitoring a code execution session
  startMonitoring(): RuntimeMonitor {
    return {
      startTime: Date.now(),
      duration: 0,
      networkRequests: [],
      fileOperations: [],
      processCreations: [],
      memoryUsage: [],
      cryptoOperations: [],
      anomalies: [],
    };
  }

  // Record network activity
  recordNetworkActivity(request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: string;
    responseStatus?: number;
  }): BehavioralPattern {
    const pattern: BehavioralPattern = {
      type: 'network',
      action: `HTTP ${request.method} to ${request.url}`,
      timestamp: Date.now(),
      severity: this.calculateNetworkSeverity(request),
      suspicious: this.isSuspiciousNetworkRequest(request),
      details: request,
    };

    this.patterns.push(pattern);
    return pattern;
  }

  // Record file system activity
  recordFileActivity(operation: {
    action: 'read' | 'write' | 'delete' | 'execute';
    path: string;
    content?: string;
    size?: number;
  }): BehavioralPattern {
    const pattern: BehavioralPattern = {
      type: 'file_system',
      action: `${operation.action} ${operation.path}`,
      timestamp: Date.now(),
      severity: this.calculateFileSeverity(operation),
      suspicious: this.isSuspiciousFileOperation(operation),
      details: operation,
    };

    this.patterns.push(pattern);
    return pattern;
  }

  // Record process creation
  recordProcessActivity(process: {
    command: string;
    args: string[];
    pid?: number;
    parentPid?: number;
  }): BehavioralPattern {
    const pattern: BehavioralPattern = {
      type: 'process',
      action: `Exec: ${process.command} ${process.args.join(' ')}`,
      timestamp: Date.now(),
      severity: this.calculateProcessSeverity(process),
      suspicious: this.isSuspiciousProcess(process),
      details: process,
    };

    this.patterns.push(pattern);
    return pattern;
  }

  // Record memory usage
  recordMemoryActivity(usage: {
    allocated: number;
    freed: number;
    total: number;
    heapUsed: number;
  }): BehavioralPattern {
    const pattern: BehavioralPattern = {
      type: 'memory',
      action: `Memory: ${usage.heapUsed}MB used, ${usage.total}MB total`,
      timestamp: Date.now(),
      severity: this.calculateMemorySeverity(usage),
      suspicious: usage.total > this.thresholds.maxMemoryUsage,
      details: usage,
    };

    this.patterns.push(pattern);
    return pattern;
  }

  // Record cryptographic operations
  recordCryptoActivity(operation: {
    algorithm: string;
    keySize?: number;
    operation: 'encrypt' | 'decrypt' | 'sign' | 'verify' | 'hash';
    data?: string;
  }): BehavioralPattern {
    const pattern: BehavioralPattern = {
      type: 'crypto',
      action: `Crypto: ${operation.algorithm} ${operation.operation}`,
      timestamp: Date.now(),
      severity: this.calculateCryptoSeverity(operation),
      suspicious: this.isSuspiciousCryptoOperation(operation),
      details: operation,
    };

    this.patterns.push(pattern);
    return pattern;
  }

  // Analyze patterns for anomalies
  analyzePatterns(monitor: RuntimeMonitor): AnomalyDetection[] {
    const anomalies: AnomalyDetection[] = [];

    // Analyze network behavior
    const networkAnomaly = this.analyzeNetworkBehavior(monitor);
    if (networkAnomaly) anomalies.push(networkAnomaly);

    // Analyze file system behavior
    const fileAnomaly = this.analyzeFileSystemBehavior(monitor);
    if (fileAnomaly) anomalies.push(fileAnomaly);

    // Analyze process behavior
    const processAnomaly = this.analyzeProcessBehavior(monitor);
    if (processAnomaly) anomalies.push(processAnomaly);

    // Analyze memory behavior
    const memoryAnomaly = this.analyzeMemoryBehavior(monitor);
    if (memoryAnomaly) anomalies.push(memoryAnomaly);

    // Analyze crypto behavior
    const cryptoAnomaly = this.analyzeCryptoBehavior(monitor);
    if (cryptoAnomaly) anomalies.push(cryptoAnomaly);

    // Analyze temporal patterns
    const temporalAnomaly = this.analyzeTemporalPatterns(monitor);
    if (temporalAnomaly) anomalies.push(temporalAnomaly);

    return anomalies;
  }

  // Complete monitoring session
  completeMonitoring(monitor: RuntimeMonitor): RuntimeMonitor {
    monitor.duration = Date.now() - monitor.startTime;
    monitor.anomalies = this.analyzePatterns(monitor);
    
    // Add all patterns to monitor
    monitor.networkRequests = this.patterns.filter(p => p.type === 'network');
    monitor.fileOperations = this.patterns.filter(p => p.type === 'file_system');
    monitor.processCreations = this.patterns.filter(p => p.type === 'process');
    monitor.memoryUsage = this.patterns.filter(p => p.type === 'memory');
    monitor.cryptoOperations = this.patterns.filter(p => p.type === 'crypto');

    return monitor;
  }

  // Private helper methods
  private calculateNetworkSeverity(request: any): 'low' | 'medium' | 'high' | 'critical' {
    if (this.isSuspiciousNetworkRequest(request)) return 'critical';
    if (request.url.includes('http://') && !request.url.includes('localhost')) return 'high';
    if (request.method === 'POST' && request.body) return 'medium';
    return 'low';
  }

  private isSuspiciousNetworkRequest(request: any): boolean {
    const url = request.url.toLowerCase();
    const domain = url.split('/')[2];
    
    return this.thresholds.suspiciousDomains.some(suspicious => 
      url.includes(suspicious) || domain?.includes(suspicious)
    ) || request.headers?.['user-agent']?.includes('curl') ||
           request.body?.includes('eval') || request.body?.includes('exec');
  }

  private calculateFileSeverity(operation: any): 'low' | 'medium' | 'high' | 'critical' {
    if (this.isSuspiciousFileOperation(operation)) return 'critical';
    if (operation.action === 'execute') return 'high';
    if (operation.action === 'write' && operation.size && operation.size > 1024 * 1024) return 'medium';
    return 'low';
  }

  private isSuspiciousFileOperation(operation: any): boolean {
    const path = operation.path.toLowerCase();
    const ext = path.split('.').pop();
    
    return this.thresholds.suspiciousFileExtensions.includes(`.${ext}`) ||
           path.includes('system32') || path.includes('etc') || path.includes('root') ||
           path.includes('password') || path.includes('key') || path.includes('secret');
  }

  private calculateProcessSeverity(process: any): 'low' | 'medium' | 'high' | 'critical' {
    if (this.isSuspiciousProcess(process)) return 'critical';
    if (process.args.some((arg: string) => arg.includes('eval') || arg.includes('exec'))) return 'high';
    if (process.args.length > 5) return 'medium';
    return 'low';
  }

  private isSuspiciousProcess(process: any): boolean {
    const command = process.command.toLowerCase();
    return this.thresholds.suspiciousProcesses.includes(command) ||
           process.args.some((arg: string) => 
             arg.includes('http') || arg.includes('curl') || arg.includes('wget')
           );
  }

  private calculateMemorySeverity(usage: any): 'low' | 'medium' | 'high' | 'critical' {
    if (usage.total > this.thresholds.maxMemoryUsage) return 'critical';
    if (usage.heapUsed > usage.total * 0.8) return 'high';
    if (usage.heapUsed > usage.total * 0.5) return 'medium';
    return 'low';
  }

  private calculateCryptoSeverity(operation: any): 'low' | 'medium' | 'high' | 'critical' {
    if (this.isSuspiciousCryptoOperation(operation)) return 'critical';
    if (operation.keySize && operation.keySize < 128) return 'high';
    if (operation.algorithm === 'unknown') return 'medium';
    return 'low';
  }

  private isSuspiciousCryptoOperation(operation: any): boolean {
    return operation.algorithm === 'unknown' ||
           operation.data?.includes('private') || operation.data?.includes('secret') ||
           operation.operation === 'encrypt' && !operation.keySize;
  }

  // Anomaly detection methods
  private analyzeNetworkBehavior(monitor: RuntimeMonitor): AnomalyDetection | null {
    const networkPatterns = this.patterns.filter(p => p.type === 'network');
    const suspiciousCount = networkPatterns.filter(p => p.suspicious).length;
    
    if (suspiciousCount > 0) {
      return {
        anomalyType: 'suspicious_network_activity',
        confidence: Math.min(100, suspiciousCount * 20),
        description: `Detected ${suspiciousCount} suspicious network requests`,
        patterns: networkPatterns.filter(p => p.suspicious),
        riskLevel: suspiciousCount > 2 ? 'critical' : 'high',
        recommendations: [
          'Review all network requests',
          'Block suspicious domains',
          'Monitor data exfiltration',
        ],
      };
    }

    if (networkPatterns.length > this.thresholds.maxNetworkRequests) {
      return {
        anomalyType: 'excessive_network_requests',
        confidence: 75,
        description: `Excessive network activity: ${networkPatterns.length} requests`,
        patterns: networkPatterns,
        riskLevel: 'medium',
        recommendations: [
          'Limit network access',
          'Review request patterns',
          'Implement rate limiting',
        ],
      };
    }

    return null;
  }

  private analyzeFileSystemBehavior(monitor: RuntimeMonitor): AnomalyDetection | null {
    const filePatterns = this.patterns.filter(p => p.type === 'file_system');
    const suspiciousCount = filePatterns.filter(p => p.suspicious).length;
    
    if (suspiciousCount > 0) {
      return {
        anomalyType: 'suspicious_file_operations',
        confidence: Math.min(100, suspiciousCount * 25),
        description: `Detected ${suspiciousCount} suspicious file operations`,
        patterns: filePatterns.filter(p => p.suspicious),
        riskLevel: suspiciousCount > 1 ? 'critical' : 'high',
        recommendations: [
          'Review file access patterns',
          'Block suspicious file types',
          'Monitor system directories',
        ],
      };
    }

    return null;
  }

  private analyzeProcessBehavior(monitor: RuntimeMonitor): AnomalyDetection | null {
    const processPatterns = this.patterns.filter(p => p.type === 'process');
    const suspiciousCount = processPatterns.filter(p => p.suspicious).length;
    
    if (suspiciousCount > 0) {
      return {
        anomalyType: 'suspicious_process_execution',
        confidence: Math.min(100, suspiciousCount * 30),
        description: `Detected ${suspiciousCount} suspicious process executions`,
        patterns: processPatterns.filter(p => p.suspicious),
        riskLevel: 'critical',
        recommendations: [
          'Block process creation',
          'Review command arguments',
          'Monitor system calls',
        ],
      };
    }

    return null;
  }

  private analyzeMemoryBehavior(monitor: RuntimeMonitor): AnomalyDetection | null {
    const memoryPatterns = this.patterns.filter(p => p.type === 'memory');
    const highMemoryCount = memoryPatterns.filter(p => p.severity === 'critical').length;
    
    if (highMemoryCount > 0) {
      return {
        anomalyType: 'excessive_memory_usage',
        confidence: Math.min(100, highMemoryCount * 20),
        description: `Detected ${highMemoryCount} high memory usage events`,
        patterns: memoryPatterns.filter(p => p.severity === 'critical'),
        riskLevel: 'medium',
        recommendations: [
          'Monitor memory allocation',
          'Implement memory limits',
          'Check for memory leaks',
        ],
      };
    }

    return null;
  }

  private analyzeCryptoBehavior(monitor: RuntimeMonitor): AnomalyDetection | null {
    const cryptoPatterns = this.patterns.filter(p => p.type === 'crypto');
    const suspiciousCount = cryptoPatterns.filter(p => p.suspicious).length;
    
    if (suspiciousCount > 0) {
      return {
        anomalyType: 'suspicious_crypto_operations',
        confidence: Math.min(100, suspiciousCount * 35),
        description: `Detected ${suspiciousCount} suspicious cryptographic operations`,
        patterns: cryptoPatterns.filter(p => p.suspicious),
        riskLevel: 'high',
        recommendations: [
          'Review encryption usage',
          'Check key management',
          'Monitor data encryption',
        ],
      };
    }

    return null;
  }

  private analyzeTemporalPatterns(monitor: RuntimeMonitor): AnomalyDetection | null {
    const timeWindows = 60000; // 1 minute windows
    const patterns = this.patterns;
    
    // Check for rapid successive operations
    for (let i = 0; i < patterns.length - 1; i++) {
      const timeDiff = patterns[i + 1].timestamp - patterns[i].timestamp;
      if (timeDiff < 1000 && patterns[i].severity === 'critical') { // Less than 1 second
        return {
          anomalyType: 'rapid_suspicious_activity',
          confidence: 85,
          description: 'Rapid succession of suspicious operations detected',
          patterns: patterns.slice(i, i + 2),
          riskLevel: 'critical',
          recommendations: [
            'Immediate investigation required',
            'Block further execution',
            'Analyze attack patterns',
          ],
        };
      }
    }

    return null;
  }

  // Clear patterns for new monitoring session
  clearPatterns(): void {
    this.patterns = [];
  }

  // Get summary statistics
  getStatistics(): {
    totalPatterns: number;
    suspiciousPatterns: number;
    patternsByType: Record<string, number>;
    patternsBySeverity: Record<string, number>;
  } {
    const suspiciousPatterns = this.patterns.filter(p => p.suspicious).length;
    const patternsByType: Record<string, number> = {};
    const patternsBySeverity: Record<string, number> = {};

    this.patterns.forEach(pattern => {
      patternsByType[pattern.type] = (patternsByType[pattern.type] || 0) + 1;
      patternsBySeverity[pattern.severity] = (patternsBySeverity[pattern.severity] || 0) + 1;
    });

    return {
      totalPatterns: this.patterns.length,
      suspiciousPatterns,
      patternsByType,
      patternsBySeverity,
    };
  }
}

// Singleton instance
export const behavioralAnalyzer = new BehavioralAnalyzer();

// React hook for using behavioral analyzer
export function useBehavioralAnalyzer() {
  return behavioralAnalyzer;
}

export default behavioralAnalyzer;
