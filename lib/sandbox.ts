import { scanGithubRepo } from './repoScanner';
import { checkDomainReputation, isShorteningService, hasSuspiciousTLD } from './domainReputation';
import { validateEmailWithAPI } from './emailValidator';

interface AdvancedAnalysisResult {
  securityScore: number;
  threats: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    evidence?: string;
  }>;
  recommendations: string[];
  metadata: {
    analysisTime: number;
    sandboxUsed: string;
    techniques: string[];
  };
  // Optional extended data for specific analysis types
  repoAnalysis?: any;
  domainReputation?: any;
  emailValidation?: any;
}

export class SandboxService {
  // Enhanced repository analysis with real security scanning
  static async analyzeRepository(repoUrl: string): Promise<AdvancedAnalysisResult> {
    const startTime = Date.now();
    
    try {
      // Use existing repo scanner for deep analysis
      const repoAnalysis = await scanGithubRepo(repoUrl);
      
      const threats: AdvancedAnalysisResult['threats'] = [];
      const recommendations: string[] = [];
      let securityScore = 100;

      // Analyze dangerous scripts
      if (repoAnalysis.dangerousScripts.length > 0) {
        threats.push({
          type: 'dangerous_lifecycle_scripts',
          severity: 'critical',
          description: `Dangerous npm scripts detected: ${repoAnalysis.dangerousScripts.join(', ')}`,
          evidence: repoAnalysis.dangerousScripts.join(', ')
        });
        securityScore -= 30;
        recommendations.push('Never run npm install on repositories with dangerous lifecycle scripts');
      }

      // Analyze pattern matches
      repoAnalysis.patternMatches.forEach(match => {
        const severityMap = {
          'critical': 'critical' as const,
          'high': 'high' as const,
          'medium': 'medium' as const,
          'low': 'low' as const
        };

        threats.push({
          type: match.pattern,
          severity: severityMap[match.severity],
          description: `Suspicious code pattern: ${match.pattern} in ${match.file}${match.line ? `:${match.line}` : ''}`,
          evidence: `${match.file}${match.line ? `:${match.line}` : ''}`
        });

        // Adjust score based on severity
        const scoreImpact = {
          'critical': 25,
          'high': 15,
          'medium': 8,
          'low': 3
        };
        securityScore -= scoreImpact[match.severity];
      });

      // Analyze repository metadata
      if (repoAnalysis.repoAge && repoAnalysis.repoAge < 7) {
        threats.push({
          type: 'new_repository',
          severity: 'high',
          description: `Repository created only ${repoAnalysis.repoAge} days ago`,
          evidence: `${repoAnalysis.repoAge} days old`
        });
        securityScore -= 20;
        recommendations.push('Be cautious of very new repositories with no history');
      }

      if ((repoAnalysis.stars || 0) === 0 && (repoAnalysis.forks || 0) === 0) {
        threats.push({
          type: 'no_community_trust',
          severity: 'medium',
          description: 'No stars or forks - no community validation',
          evidence: '0 stars, 0 forks'
        });
        securityScore -= 10;
        recommendations.push('Look for repositories with community validation (stars/forks)');
      }

      // Risk level assessment
      if (repoAnalysis.riskLevel === 'critical') {
        threats.push({
          type: 'overall_risk',
          severity: 'critical',
          description: 'Repository classified as critical risk',
          evidence: repoAnalysis.riskLevel
        });
        securityScore = Math.min(securityScore, 20);
      }

      const analysisTime = Date.now() - startTime;

      return {
        securityScore: Math.max(0, securityScore),
        threats,
        recommendations: [
          ...recommendations,
          'Always review code manually before execution',
          'Use isolated environments for testing',
          'Verify repository owner identity'
        ],
        metadata: {
          analysisTime,
          sandboxUsed: 'TrustHire Advanced Security Scanner',
          techniques: [
            'Static Code Analysis',
            'Pattern Matching',
            'Repository Metadata Analysis',
            'Dependency Scanning',
            'Security Threat Detection'
          ]
        },
        repoAnalysis
      };

    } catch (error) {
      return {
        securityScore: 0,
        threats: [{
          type: 'analysis_failed',
          severity: 'critical',
          description: `Repository analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        recommendations: ['Manual review required'],
        metadata: {
          analysisTime: Date.now() - startTime,
          sandboxUsed: 'TrustHire Security Scanner',
          techniques: ['Error Handling']
        }
      };
    }
  }

  // Enhanced code execution with comprehensive pattern detection
  static async executePatternDetection(code: string, language: 'node' | 'python' | 'bash' = 'node'): Promise<AdvancedAnalysisResult> {
    const startTime = Date.now();
    
    const threats: AdvancedAnalysisResult['threats'] = [];
    const recommendations: string[] = [];
    let securityScore = 100;

    // Advanced pattern detection
    const criticalPatterns = [
      { pattern: /eval\s*\(/, type: 'code_injection', desc: 'Dynamic code execution (eval)' },
      { pattern: /new\s+Function\s*\(/, type: 'code_injection', desc: 'Dynamic function creation' },
      { pattern: /child_process\.(exec|spawn)/, type: 'command_execution', desc: 'System command execution' },
      { pattern: /process\.env\./, type: 'environment_access', desc: 'Environment variable access' },
      { pattern: /fs\.(read|write|unlink)/, type: 'file_system_access', desc: 'File system access' },
      { pattern: /require\s*\(\s*['"`][^'"`]*['"`]\s*\)/, type: 'dynamic_import', desc: 'Dynamic module loading' },
      { pattern: /Buffer\.from\s*\([^)]*,\s*['"`]base64['"`]\)/, type: 'obfuscation', desc: 'Base64 decoding' },
      { pattern: /atob\s*\(/, type: 'obfuscation', desc: 'Base64 decoding' },
      { pattern: /document\.write\s*\(/, type: 'dom_manipulation', desc: 'DOM manipulation' },
      { pattern: /innerHTML\s*=/, type: 'dom_manipulation', desc: 'DOM manipulation' }
    ];

    // Language-specific patterns
    const languagePatterns = {
      node: [
        { pattern: /child_process/, type: 'command_execution', desc: 'Node.js child process' },
        { pattern: /net\.connect|http\.request/, type: 'network_access', desc: 'Network access' },
        { pattern: /crypto\.(createHash|createHmac)/, type: 'crypto_usage', desc: 'Cryptographic operations' }
      ],
      python: [
        { pattern: /subprocess\.(run|call|Popen)/, type: 'command_execution', desc: 'Python subprocess execution' },
        { pattern: /os\.system|os\.popen/, type: 'command_execution', desc: 'OS command execution' },
        { pattern: /exec\s*\(|eval\s*\(/, type: 'code_injection', desc: 'Python code execution' },
        { pattern: /urllib\.request|requests\./, type: 'network_access', desc: 'Network requests' }
      ],
      bash: [
        { pattern: /curl|wget/, type: 'network_access', desc: 'Network download' },
        { pattern: /\|\s*(ba)?sh/, type: 'command_injection', desc: 'Shell command chaining' },
        { pattern: />\s*\/dev\/null|2>&1/, type: 'output_redirection', desc: 'Output redirection' }
      ]
    };

    // Check all patterns
    [...criticalPatterns, ...(languagePatterns[language] || [])].forEach(({ pattern, type, desc }) => {
      if (pattern.test(code)) {
        const severityMap: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
          'code_injection': 'critical',
          'command_execution': 'critical',
          'environment_access': 'high',
          'file_system_access': 'high',
          'network_access': 'medium',
          'obfuscation': 'high',
          'dom_manipulation': 'medium',
          'crypto_usage': 'medium',
          'dynamic_import': 'medium',
          'output_redirection': 'low'
        };

        threats.push({
          type,
          severity: severityMap[type] || 'medium',
          description: desc,
          evidence: `Pattern detected in ${language} code`
        });

        const scoreImpact = {
          'critical': 25,
          'high': 15,
          'medium': 8,
          'low': 3
        };
        securityScore -= scoreImpact[severityMap[type] || 'medium'];
      }
    });

    // Code quality checks
    if (code.length > 10000) {
      threats.push({
        type: 'large_code_size',
        severity: 'medium',
        description: 'Large code block may contain obfuscated content',
        evidence: `${code.length} characters`
      });
      securityScore -= 10;
    }

    const singleLineRatio = code.split('\n').length / code.length;
    if (singleLineRatio < 0.0001) { // Very few newlines
      threats.push({
        type: 'minified_code',
        severity: 'high',
        description: 'Code appears to be minified or obfuscated',
        evidence: 'Low newline ratio'
      });
      securityScore -= 20;
    }

    const analysisTime = Date.now() - startTime;

    return {
      securityScore: Math.max(0, securityScore),
      threats,
      recommendations: [
        ...recommendations,
        'Review code in isolated environment',
        'Use syntax highlighting to identify suspicious patterns',
        'Never execute untrusted code directly'
      ],
      metadata: {
        analysisTime,
        sandboxUsed: 'TrustHire Code Security Analyzer',
        techniques: [
          'Static Pattern Analysis',
          'Language-Specific Detection',
          'Code Quality Assessment',
          'Security Threat Scoring'
        ]
      }
    };
  }

  // Enhanced URL analysis with domain reputation
  static async analyzeUrlSafely(url: string): Promise<AdvancedAnalysisResult> {
    const startTime = Date.now();
    
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      
      // Get domain reputation
      const domainRep = await checkDomainReputation(domain);
      
      const threats: AdvancedAnalysisResult['threats'] = [];
      const recommendations: string[] = [];
      let securityScore = 100;

      // Domain reputation threats
      if (domainRep.isBlacklisted) {
        threats.push({
          type: 'blacklisted_domain',
          severity: 'critical',
          description: 'Domain is blacklisted by security services',
          evidence: domain
        });
        securityScore -= 50;
      }

      if (domainRep.riskScore > 70) {
        threats.push({
          type: 'high_risk_domain',
          severity: 'high',
          description: `Domain has high risk score: ${domainRep.riskScore}`,
          evidence: `Risk score: ${domainRep.riskScore}`
        });
        securityScore -= 30;
      }

      // URL structure analysis
      if (isShorteningService(domain)) {
        threats.push({
          type: 'url_shortener',
          severity: 'medium',
          description: 'URL uses shortening service - destination hidden',
          evidence: domain
        });
        securityScore -= 15;
        recommendations.push('Expand short URLs before accessing');
      }

      if (hasSuspiciousTLD(domain)) {
        threats.push({
          type: 'suspicious_tld',
          severity: 'medium',
          description: 'Domain uses suspicious top-level domain',
          evidence: domain.split('.').pop()
        });
        securityScore -= 20;
      }

      // Path analysis
      const suspiciousPaths = ['/download', '/install', '/setup', '/run', '/exec'];
      if (suspiciousPaths.some(path => urlObj.pathname.toLowerCase().includes(path))) {
        threats.push({
          type: 'suspicious_path',
          severity: 'medium',
          description: 'URL path contains suspicious keywords',
          evidence: urlObj.pathname
        });
        securityScore -= 15;
      }

      // Protocol analysis
      if (urlObj.protocol !== 'https:') {
        threats.push({
          type: 'insecure_protocol',
          severity: 'medium',
          description: 'URL uses insecure protocol',
          evidence: urlObj.protocol
        });
        securityScore -= 10;
        recommendations.push('Prefer HTTPS URLs');
      }

      // Add domain-specific recommendations
      recommendations.push(...domainRep.recommendations);

      const analysisTime = Date.now() - startTime;

      return {
        securityScore: Math.max(0, securityScore),
        threats,
        recommendations: [
          ...recommendations,
          'Always verify URLs before clicking',
          'Use URL expansion tools for shortened links',
          'Check domain reputation before accessing'
        ],
        metadata: {
          analysisTime,
          sandboxUsed: 'TrustHire URL Security Analyzer',
          techniques: [
            'Domain Reputation Analysis',
            'URL Structure Analysis',
            'Security Database Lookup',
            'Threat Intelligence'
          ]
        },
        domainReputation: domainRep
      };

    } catch (error) {
      return {
        securityScore: 0,
        threats: [{
          type: 'invalid_url',
          severity: 'critical',
          description: `Invalid URL format: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        recommendations: ['Please provide a valid URL'],
        metadata: {
          analysisTime: Date.now() - startTime,
          sandboxUsed: 'TrustHire URL Security Analyzer',
          techniques: ['URL Validation']
        }
      };
    }
  }

  // New: Email analysis for recruitment verification
  static async analyzeEmail(email: string): Promise<AdvancedAnalysisResult> {
    const startTime = Date.now();
    
    const emailValidation = await validateEmailWithAPI(email);
    
    const threats: AdvancedAnalysisResult['threats'] = [];
    const recommendations: string[] = [];
    let securityScore = 100;

    if (!emailValidation.isValid) {
      threats.push({
        type: 'invalid_email',
        severity: 'critical',
        description: 'Email format is invalid',
        evidence: email
      });
      securityScore -= 50;
    }

    if (emailValidation.isDisposable) {
      threats.push({
        type: 'disposable_email',
        severity: 'high',
        description: 'Disposable email address detected',
        evidence: emailValidation.domain
      });
      securityScore -= 30;
      recommendations.push('Legitimate recruiters use permanent email addresses');
    }

    if (emailValidation.isFree) {
      threats.push({
        type: 'free_email_provider',
        severity: 'medium',
        description: 'Free email provider used',
        evidence: emailValidation.domain
      });
      securityScore -= 15;
      recommendations.push('Verify recruiter through official company channels');
    }

    // Add email-specific recommendations
    recommendations.push(...emailValidation.recommendations);

    const analysisTime = Date.now() - startTime;

    return {
      securityScore: Math.max(0, securityScore),
      threats,
      recommendations: [
        ...recommendations,
        'Always verify recruiter identity through official channels',
        'Request video calls for verification',
        'Check company website for contact information'
      ],
      metadata: {
        analysisTime,
        sandboxUsed: 'TrustHire Email Security Analyzer',
        techniques: [
          'Email Format Validation',
          'Domain Reputation Check',
          'Disposable Email Detection',
          'Provider Analysis'
        ]
      },
      emailValidation
    };
  }

  // Real sandbox integration (for future implementation)
  static async createRealSandbox() {
    // This would use @vercel/sandbox when properly configured
    return {
      runCommand: async (cmd: string, args: string[]) => {
        return {
          stdout: () => `Secure execution: ${cmd} ${args.join(' ')}`,
          stderr: () => '',
          exitCode: 0,
        };
      },
      stop: async () => {
        console.log('Sandbox stopped');
      },
    };
  }
}
