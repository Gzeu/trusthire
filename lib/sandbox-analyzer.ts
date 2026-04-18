// Advanced Sandbox Code Analyzer
// Detects malicious patterns and provides detailed security analysis

import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

export interface SecurityIssue {
  type: 'critical' | 'high' | 'medium' | 'low' | 'info';
  severity: number; // 1-10 scale
  category: 'security' | 'privacy' | 'performance' | 'best-practice';
  title: string;
  description: string;
  location: string;
  line?: number;
  code?: string;
  recommendation: string;
  references?: string[];
}

export interface SandboxAnalysisResult {
  summary: {
    overallRisk: 'critical' | 'high' | 'medium' | 'low' | 'safe';
    riskScore: number; // 0-100
    issuesFound: number;
    categoriesAnalyzed: string[];
  };
  issues: SecurityIssue[];
  recommendations: string[];
  metadata: {
    filesAnalyzed: number;
    linesOfCode: number;
    executionTime: number;
    sandboxEnvironment: string;
  };
}

export class SandboxAnalyzer {
  private static readonly MALICIOUS_PATTERNS = [
    // Critical Security Issues
    {
      pattern: /process\.env\.[A-Z_]+/gi,
      type: 'critical' as const,
      severity: 10,
      category: 'security' as const,
      title: 'Environment Variable Exfiltration',
      description: 'Code attempts to access or export environment variables',
      recommendation: 'Remove all environment variable access and implement proper configuration management',
      references: []
    },
    {
      pattern: /(private|secret|key|mnemonic|wallet|seed|phrase)/gi,
      type: 'critical' as const,
      severity: 10,
      category: 'security' as const,
      title: 'Private Key or Wallet Access',
      description: 'Code attempts to access private keys, wallet seeds, or mnemonics',
      recommendation: 'Remove all private key handling and implement secure key management',
      references: []
    },
    {
      pattern: /eval\s*\(/gi,
      type: 'critical' as const,
      severity: 9,
      category: 'security' as const,
      title: 'Dynamic Code Execution',
      description: 'Use of eval() function allows dynamic code execution',
      recommendation: 'Replace eval() with safer alternatives or remove entirely',
      references: []
    },
    {
      pattern: /Function\s*\(\s*["'][^"']*["'][^)]*\)\s*\(/gi,
      type: 'critical' as const,
      severity: 9,
      category: 'security' as const,
      title: 'Function Constructor Abuse',
      description: 'Use of Function constructor can lead to code injection',
      recommendation: 'Remove Function constructor and use proper function definitions',
      references: []
    },
    {
      pattern: /child_process\.(exec|spawn|fork)/gi,
      type: 'critical' as const,
      severity: 10,
      category: 'security' as const,
      title: 'Child Process Execution',
      description: 'Code spawns external processes which can be exploited',
      recommendation: 'Remove child process execution or implement strict validation',
      references: []
    },
    {
      pattern: /(curl|wget|fetch|axios).*\+/gi,
      type: 'critical' as const,
      severity: 8,
      category: 'security' as const,
      title: 'Command Injection via HTTP Requests',
      description: 'HTTP requests used to inject shell commands',
      recommendation: 'Validate all user input and use parameterized queries',
      references: []
    },
    {
      pattern: /require\s*\(\s*["'][^"']*["'][^)]*\)\s*\(/gi,
      type: 'high' as const,
      severity: 7,
      category: 'security' as const,
      title: 'Dynamic Require with Concatenation',
      description: 'Dynamic require() with string concatenation can lead to path traversal',
      recommendation: 'Use static imports or implement proper path validation',
      references: []
    },
    {
      pattern: /(atob|btoa|Buffer\.from|Buffer\.alloc)/gi,
      type: 'high' as const,
      severity: 6,
      category: 'security' as const,
      title: 'Base64 Encoding/Decoding',
      description: 'Use of base64 encoding/decoding to obfuscate code',
      recommendation: 'Remove obfuscation and use clear, readable code',
      references: []
    },
    {
      pattern: /(crypto|createHash|createHmac)/gi,
      type: 'medium' as const,
      severity: 5,
      category: 'security' as const,
      title: 'Cryptographic Operations',
      description: 'Use of cryptographic functions without proper validation',
      recommendation: 'Implement proper key management and validation',
      references: []
    },
    {
      pattern: /(fs\.|path\.|os\.).*\s*\+\s*(["'][^"']*["'])/gi,
      type: 'medium' as const,
      severity: 4,
      category: 'security' as const,
      title: 'File System Access',
      description: 'File system operations without proper validation',
      recommendation: 'Validate all file paths and implement proper access controls',
      references: []
    },
    {
      pattern: /(setTimeout|setInterval)\s*\(\s*["'][^"']*["'][^)]*\)\s*\(/gi,
      type: 'medium' as const,
      severity: 4,
      category: 'security' as const,
      title: 'Timer-based Code Execution',
      description: 'Use of timers to execute code dynamically',
      recommendation: 'Remove dynamic code execution in timers',
      references: []
    },
    {
      pattern: /document\.(cookie|localStorage|sessionStorage)/gi,
      type: 'medium' as const,
      severity: 5,
      category: 'privacy' as const,
      title: 'Browser Storage Access',
      description: 'Access to browser storage mechanisms',
      recommendation: 'Implement proper data handling and privacy controls',
      references: []
    },
    {
      pattern: /(XMLHttpRequest|fetch)\s*\(\s*["'][^"']*["'][^)]*\)\s*\(/gi,
      type: 'low' as const,
      severity: 3,
      category: 'security' as const,
      title: 'Dynamic HTTP Request Construction',
      description: 'HTTP requests constructed with dynamic parameters',
      recommendation: 'Validate all URLs and implement proper request handling',
      references: []
    },
    {
      pattern: /(console\.log|console\.error|console\.warn)/gi,
      type: 'info' as const,
      severity: 1,
      category: 'best-practice' as const,
      title: 'Console Logging',
      description: 'Console logging in production code',
      recommendation: 'Remove or implement proper logging system',
      references: []
    }
  ];

  static async analyzeCode(codeContent: string, filePath: string): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];
    const lines = codeContent.split('\n');

    lines.forEach((line, index) => {
      SandboxAnalyzer.MALICIOUS_PATTERNS.forEach(pattern => {
        const matches = line.match(pattern.pattern);
        if (matches) {
          issues.push({
            type: pattern.type,
            severity: pattern.severity,
            category: pattern.category,
            title: pattern.title,
            description: pattern.description,
            location: `${filePath}:${index + 1}`,
            line: index + 1,
            code: line.trim(),
            recommendation: pattern.recommendation,
            references: pattern.references || []
          });
        }
      });
    });

    return issues;
  }

  static async analyzeFile(filePath: string): Promise<SecurityIssue[]> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return await SandboxAnalyzer.analyzeCode(content, filePath);
    } catch (error) {
      return [{
        type: 'medium' as const,
        severity: 5,
        category: 'security' as const,
        title: 'File Access Error',
        description: `Could not read file: ${error}`,
        location: filePath,
        recommendation: 'Check file permissions and path',
        references: []
      }];
    }
  }

  static async analyzeDirectory(dirPath: string, extensions: string[] = ['.js', '.ts', '.jsx', '.tsx', '.json']): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];
    
    try {
      const files = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const file of files) {
        if (file.isFile()) {
          const ext = path.extname(file.name).toLowerCase();
          if (extensions.includes(ext)) {
            const filePath = path.join(dirPath, file.name);
            const fileIssues = await SandboxAnalyzer.analyzeFile(filePath);
            issues.push(...fileIssues);
          }
        }
      }
    } catch (error) {
      issues.push({
        type: 'medium' as const,
        severity: 5,
        category: 'security' as const,
        title: 'Directory Access Error',
        description: `Could not read directory: ${error}`,
        location: dirPath,
        recommendation: 'Check directory permissions and path',
        references: []
      });
    }

    return issues;
  }

  static generateDetailedReport(issues: SecurityIssue[]): SandboxAnalysisResult {
    const criticalIssues = issues.filter(i => i.type === 'critical');
    const highIssues = issues.filter(i => i.type === 'high');
    const mediumIssues = issues.filter(i => i.type === 'medium');
    const lowIssues = issues.filter(i => i.type === 'low');
    const infoIssues = issues.filter(i => i.type === 'info');

    // Calculate risk score
    const riskScore = Math.min(100, issues.reduce((sum, issue) => sum + (issue.severity * 10), 0));
    
    // Determine overall risk
    let overallRisk: SandboxAnalysisResult['summary']['overallRisk'] = 'safe';
    if (criticalIssues.length > 0) overallRisk = 'critical';
    else if (highIssues.length > 0) overallRisk = 'high';
    else if (mediumIssues.length > 2) overallRisk = 'medium';
    else if (lowIssues.length > 3) overallRisk = 'low';

    // Generate recommendations
    const recommendations = [
      ...Array.from(new Set(issues.map(i => i.recommendation))),
      'Implement comprehensive input validation',
      'Use static analysis tools before execution',
      'Review all external dependencies',
      'Implement proper error handling and logging'
    ];

    // Categories analyzed
    const categoriesAnalyzed = Array.from(new Set(issues.map(i => i.category))) as string[];

    return {
      summary: {
        overallRisk,
        riskScore,
        issuesFound: issues.length,
        categoriesAnalyzed
      },
      issues,
      recommendations,
      metadata: {
        filesAnalyzed: issues.length,
        linesOfCode: issues.reduce((sum, i) => sum + (i.line || 0), 0),
        executionTime: Date.now(),
        sandboxEnvironment: 'Vercel Sandbox Node.js'
      }
    };
  }

  static formatSecurityReport(result: SandboxAnalysisResult): string {
    const { summary, issues, recommendations, metadata } = result;
    
    let report = `🛡️ TRUSTHIRE SANDBOX SECURITY ANALYSIS REPORT\n`;
    report += `Generated: ${new Date(metadata.executionTime).toISOString()}\n`;
    report += `Environment: ${metadata.sandboxEnvironment}\n`;
    report += `Files Analyzed: ${metadata.filesAnalyzed}\n`;
    report += `Lines of Code: ${metadata.linesOfCode}\n\n`;

    // Executive Summary
    report += `📊 EXECUTIVE SUMMARY\n`;
    report += `Overall Risk Level: ${summary.overallRisk.toUpperCase()}\n`;
    report += `Risk Score: ${summary.riskScore}/100\n`;
    report += `Issues Found: ${summary.issuesFound}\n`;
    report += `Categories Analyzed: ${summary.categoriesAnalyzed.join(', ')}\n\n`;

    // Risk Assessment
    report += `⚠️ RISK ASSESSMENT\n`;
    if (summary.overallRisk === 'critical') {
      report += `🔴 CRITICAL: Immediate threat detected! Do NOT execute this code!\n`;
    } else if (summary.overallRisk === 'high') {
      report += `🟠 HIGH RISK: Serious security concerns! Exercise extreme caution!\n`;
    } else if (summary.overallRisk === 'medium') {
      report += `🟡 MEDIUM RISK: Security issues present! Review before execution!\n`;
    } else if (summary.overallRisk === 'low') {
      report += `🟢 LOW RISK: Minor issues found! Proceed with caution!\n`;
    } else {
      report += `✅ SAFE: No significant threats detected!\n`;
    }
    report += `\n`;

    // Critical Issues First
    const criticalIssues = issues.filter(i => i.type === 'critical');
    if (criticalIssues.length > 0) {
      report += `🚨 CRITICAL SECURITY ISSUES (${criticalIssues.length})\n`;
      criticalIssues.forEach((issue, index) => {
        report += `${index + 1}. ${issue.title}\n`;
        report += `   Location: ${issue.location}\n`;
        report += `   Description: ${issue.description}\n`;
        report += `   Recommendation: ${issue.recommendation}\n`;
        if (issue.code) {
          report += `   Code: ${issue.code.substring(0, 100)}...\n`;
        }
        report += `\n`;
      });
    }

    // High Risk Issues
    const highIssues = issues.filter(i => i.type === 'high');
    if (highIssues.length > 0) {
      report += `⚠️ HIGH RISK ISSUES (${highIssues.length})\n`;
      highIssues.forEach((issue, index) => {
        report += `${index + 1}. ${issue.title}\n`;
        report += `   Location: ${issue.location}\n`;
        report += `   Description: ${issue.description}\n`;
        report += `   Recommendation: ${issue.recommendation}\n`;
        report += `\n`;
      });
    }

    // All Issues Summary
    report += `📋 DETAILED FINDINGS\n`;
    issues.forEach((issue, index) => {
      const emoji = issue.type === 'critical' ? '🔴' : 
                   issue.type === 'high' ? '🟠' : 
                   issue.type === 'medium' ? '🟡' : 
                   issue.type === 'low' ? '🟢' : 'ℹ️';
      
      report += `${index + 1}. ${emoji} [${issue.type.toUpperCase()}] ${issue.title}\n`;
      report += `   Location: ${issue.location}\n`;
      report += `   Severity: ${issue.severity}/10\n`;
      report += `   Category: ${issue.category}\n`;
      report += `   Description: ${issue.description}\n`;
      report += `   Recommendation: ${issue.recommendation}\n`;
      report += `\n`;
    });

    // Recommendations
    report += `🎯 SECURITY RECOMMENDATIONS\n`;
    recommendations.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`;
    });
    report += `\n`;

    // Next Steps
    report += `📝 NEXT STEPS\n`;
    report += `1. IMMEDIATE ACTION: ${summary.overallRisk === 'critical' || summary.overallRisk === 'high' ? 
      'STOP - Do NOT execute this code!' : 
      'Review all findings before proceeding'}\n`;
    report += `2. DEVELOPER ACTION: Contact security team for review\n`;
    report += `3. CODE REVIEW: Conduct thorough security review\n`;
    report += `4. ALTERNATIVE: Consider using verified, secure alternatives\n`;

    return report;
  }

  static async executeInSandbox(command: string, timeout: number = 30000): Promise<{ success: boolean; output: string; error?: string }> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const child = exec(command, {
        timeout,
        encoding: 'utf-8'
      });

      let output = '';
      let error = '';

      child.stdout?.on('data', (data) => {
        output += data;
      });

      child.stderr?.on('data', (data) => {
        error += data;
      });

      child.on('close', (code) => {
        const executionTime = Date.now() - startTime;
        
        if (code === 0) {
          resolve({
            success: true,
            output,
            error: undefined
          });
        } else {
          resolve({
            success: false,
            output,
            error: `Process exited with code ${code}${error ? ': ' + error : ''}`
          });
        }
      });

      child.on('error', (err) => {
        resolve({
          success: false,
          output: '',
          error: err.message
        });
      });
    });
  }
}

export default SandboxAnalyzer;
