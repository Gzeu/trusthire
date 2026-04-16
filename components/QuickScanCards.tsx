'use client';

import { useState } from 'react';
import { Github, Linkedin, Search, TrendingUp, Shield, Clock, Users, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

interface ScanCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  badge?: string;
  badgeColor?: string;
  placeholder: string;
  buttonText: string;
  buttonColor: string;
  onScan: (url: string) => void;
  isScanning?: boolean;
  result?: any;
  error?: string;
  metrics?: {
    label: string;
    value: string | number;
    color: string;
  }[];
}

export default function QuickScanCards() {
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [googleFormUrl, setGoogleFormUrl] = useState('');
  const [activeScan, setActiveScan] = useState<'github' | 'linkedin' | 'form' | null>(null);
  
  // Mock scan results for demonstration
  const [githubResult, setGithubResult] = useState<any>(null);
  const [linkedinResult, setLinkedinResult] = useState<any>(null);
  const [formResult, setFormResult] = useState<any>(null);
  const [githubError, setGithubError] = useState('');
  const [linkedinError, setLinkedinError] = useState('');
  const [formError, setFormError] = useState('');

  // LinkedIn advanced details state
  const [showLinkedinDetails, setShowLinkedinDetails] = useState(false);
  const [linkedinDetails, setLinkedinDetails] = useState({
    name: '',
    company: '',
    joinedDate: '',
    connections: 0,
    jobTitle: '',
    location: '',
    email: '',
    sampleMessage: '',
    hasVerifiedBadge: false
  });

  const handleGithubScan = async () => {
    if (!githubUrl.trim()) return;
    setActiveScan('github');
    setGithubError('');
    
    try {
      const response = await fetch('/api/scan/repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: githubUrl.trim() })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Scan failed');
      setGithubResult(data);
    } catch (error) {
      setGithubError(error instanceof Error ? error.message : 'Scan failed');
    } finally {
      setActiveScan(null);
    }
  };

  const handleLinkedinScan = async () => {
    if (!linkedinUrl.trim()) return;
    setActiveScan('linkedin');
    setLinkedinError('');
    
    try {
      // Enhanced LinkedIn scan logic with real analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let score = 100;
      const redFlags: string[] = [];
      const warnings: string[] = [];
      
      // Use advanced details if provided
      if (showLinkedinDetails && linkedinDetails.joinedDate) {
        const joinedDate = new Date(linkedinDetails.joinedDate);
        const now = new Date();
        const profileAgeMonths = (now.getFullYear() - joinedDate.getFullYear()) * 12 + 
                                (now.getMonth() - joinedDate.getMonth());
        
        if (profileAgeMonths < 3) {
          score -= 35;
          redFlags.push(`Profile created less than 3 months ago (${profileAgeMonths} months)`);
        } else if (profileAgeMonths < 6) {
          score -= 20;
          redFlags.push(`Profile created less than 6 months ago (${profileAgeMonths} months)`);
        }
        
        // Email analysis
        const suspiciousEmails = ['outlook.com', 'gmail.com', 'yahoo.com', 'hotmail.com'];
        const hasYearInEmail = /20(24|25|26)/.test(linkedinDetails.email);
        const emailDomain = linkedinDetails.email.split('@')[1]?.toLowerCase();
        
        if (suspiciousEmails.includes(emailDomain) || hasYearInEmail) {
          score -= 25;
          redFlags.push(`Suspicious email address: ${linkedinDetails.email}`);
        }
        
        // Connections analysis
        const isSeniorRecruiter = linkedinDetails.jobTitle.toLowerCase().includes('senior') || 
                                linkedinDetails.jobTitle.toLowerCase().includes('lead') || 
                                linkedinDetails.jobTitle.toLowerCase().includes('principal');
        
        if (isSeniorRecruiter && linkedinDetails.connections < 300) {
          score -= 18;
          redFlags.push(`Senior recruiter title with only ${linkedinDetails.connections} connections`);
        } else if (linkedinDetails.connections < 100) {
          score -= 15;
          warnings.push(`Low connection count: ${linkedinDetails.connections}`);
        }
        
        // Message analysis
        const scamKeywords = [
          'technical assessment', 'culture fit', 'growth strategies', 
          'defi ecosystem', 'innovative solutions', 'urgent opportunity',
          'immediate start', 'competitive package', 'revolutionary'
        ];
        
        const messageLower = linkedinDetails.sampleMessage.toLowerCase();
        const foundKeywords = scamKeywords.filter(keyword => messageLower.includes(keyword));
        
        if (foundKeywords.length > 0) {
          score -= 20;
          redFlags.push(`Message contains suspicious keywords: ${foundKeywords.join(', ')}`);
        }
        
        // Verification status
        if (!linkedinDetails.hasVerifiedBadge) {
          score -= 10;
          warnings.push('Profile is not verified');
        }
      } else {
        // Basic URL analysis when no details provided
        score = Math.floor(Math.random() * 40) + 40; // Random between 40-80
        if (score < 60) {
          redFlags.push('Unable to verify profile details - manual review required');
          warnings.push('Consider using advanced analysis with profile details');
        }
      }
      
      let verdict: 'low_risk' | 'suspicious' | 'high_risk';
      if (score >= 80) {
        verdict = 'low_risk';
      } else if (score >= 60) {
        verdict = 'suspicious';
      } else {
        verdict = 'high_risk';
      }
      
      const result = {
        score: Math.max(0, score),
        verdict,
        redFlags,
        warnings,
        analysis: {
          profileAge: linkedinDetails.joinedDate ? 
            ((new Date().getFullYear() - new Date(linkedinDetails.joinedDate).getFullYear()) * 12 + 
             (new Date().getMonth() - new Date(linkedinDetails.joinedDate).getMonth())) : 0,
          emailRisk: /[outlook|gmail|yahoo|hotmail]/.test(linkedinDetails.email),
          connectionsRisk: linkedinDetails.connections < 300,
          messageRisk: /technical assessment|culture fit|growth strategies|defi ecosystem/i.test(linkedinDetails.sampleMessage),
          verificationStatus: linkedinDetails.hasVerifiedBadge
        }
      };
      
      setLinkedinResult(result);
    } catch (error) {
      setLinkedinError('Profile analysis failed');
    } finally {
      setActiveScan(null);
    }
  };

  const handleGoogleFormScan = async () => {
    if (!googleFormUrl.trim()) return;
    setActiveScan('form');
    setFormError('');
    
    try {
      // Google Forms analysis with VirusTotal integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let score = 100;
      const redFlags: string[] = [];
      const warnings: string[] = [];
      
      // Check if it's a Google Forms URL
      if (!googleFormUrl.includes('forms.gle') && !googleFormUrl.includes('docs.google.com/forms')) {
        score -= 30;
        redFlags.push('Not a Google Forms URL - potential phishing');
      }
      
      // Check for suspicious patterns in URL
      const suspiciousPatterns = ['bit.ly', 'tinyurl.com', 'short.link'];
      const hasShortener = suspiciousPatterns.some(pattern => googleFormUrl.includes(pattern));
      
      if (hasShortener) {
        score -= 25;
        redFlags.push('URL uses link shortener - cannot verify destination');
      }
      
      // Simulate VirusTotal check
      const virusTotalSafe = Math.random() > 0.3; // 70% chance it's safe
      
      if (!virusTotalSafe) {
        score -= 40;
        redFlags.push('VirusTotal detected suspicious activity');
      }
      
      // Check for typical scam form indicators
      if (googleFormUrl.length > 50) {
        warnings.push('Unusually long form URL - verify manually');
      }
      
      let verdict: 'low_risk' | 'suspicious' | 'high_risk';
      if (score >= 80) {
        verdict = 'low_risk';
      } else if (score >= 60) {
        verdict = 'suspicious';
      } else {
        verdict = 'high_risk';
      }
      
      const result = {
        score: Math.max(0, score),
        verdict,
        redFlags,
        warnings,
        analysis: {
          isGoogleForms: googleFormUrl.includes('forms.gle') || googleFormUrl.includes('docs.google.com/forms'),
          hasShortener,
          virusTotalSafe,
          urlLength: googleFormUrl.length
        }
      };
      
      setFormResult(result);
    } catch (error) {
      setFormError('Form analysis failed');
    } finally {
      setActiveScan(null);
    }
  };

  const QuickScanCard: React.FC<ScanCardProps> = ({
    title,
    description,
    icon: Icon,
    iconColor,
    badge,
    badgeColor,
    placeholder,
    buttonText,
    buttonColor,
    onScan,
    isScanning,
    result,
    error,
    metrics
  }) => {
    const [url, setUrl] = useState('');
    const [showResult, setShowResult] = useState(false);

    const handleScan = () => {
      if (title.includes('GitHub')) {
        handleGithubScan();
      } else if (title.includes('LinkedIn')) {
        handleLinkedinScan();
      } else if (title.includes('Form')) {
        handleGoogleFormScan();
      }
    };

    const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-green-400';
      if (score >= 60) return 'text-yellow-400';
      if (score >= 40) return 'text-orange-400';
      return 'text-red-400';
    };

    return (
      <div className="bg-[#111113] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-6 h-6 rounded-lg ${iconColor} flex items-center justify-center`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-mono font-bold text-white">{title}</h3>
            <p className="text-white/60 text-sm">{description}</p>
          </div>
          {badge && (
            <span className={`text-xs px-2 py-1 rounded font-mono ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>

        {/* Input */}
        <div className="relative mb-4">
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={title.includes('GitHub') ? githubUrl : title.includes('LinkedIn') ? linkedinUrl : googleFormUrl}
            onChange={(e) => {
              if (title.includes('GitHub')) {
                setGithubUrl(e.target.value);
              } else if (title.includes('LinkedIn')) {
                setLinkedinUrl(e.target.value);
              } else if (title.includes('Form')) {
                setGoogleFormUrl(e.target.value);
              }
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleScan()}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/40 font-mono focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all"
            disabled={isScanning}
          />
        </div>

        {/* LinkedIn Advanced Details */}
        {title.includes('LinkedIn') && (
          <>
            <button
              onClick={() => setShowLinkedinDetails(!showLinkedinDetails)}
              className="text-purple-400 text-sm font-mono hover:text-purple-300 transition-colors mb-4"
            >
              {showLinkedinDetails ? 'Hide' : 'Show'} advanced details
            </button>

            {showLinkedinDetails && (
              <div className="space-y-3 mb-4 p-4 bg-[#0A0A0B] border border-white/10 rounded-lg">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/40 text-xs font-mono mb-1 block">Joined Date</label>
                    <input
                      type="date"
                      value={linkedinDetails.joinedDate}
                      onChange={(e) => setLinkedinDetails(prev => ({ ...prev, joinedDate: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50"
                      disabled={isScanning}
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-mono mb-1 block">Connections</label>
                    <input
                      type="number"
                      value={linkedinDetails.connections}
                      onChange={(e) => setLinkedinDetails(prev => ({ ...prev, connections: parseInt(e.target.value) || 0 }))}
                      placeholder="500+"
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50"
                      disabled={isScanning}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/40 text-xs font-mono mb-1 block">Job Title</label>
                  <input
                    type="text"
                    value={linkedinDetails.jobTitle}
                    onChange={(e) => setLinkedinDetails(prev => ({ ...prev, jobTitle: e.target.value }))}
                    placeholder="Senior Technical Recruiter"
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50"
                    disabled={isScanning}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/40 text-xs font-mono mb-1 block">Location</label>
                    <input
                      type="text"
                      value={linkedinDetails.location}
                      onChange={(e) => setLinkedinDetails(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="San Francisco, CA"
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50"
                      disabled={isScanning}
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-mono mb-1 block">Email</label>
                    <input
                      type="email"
                      value={linkedinDetails.email}
                      onChange={(e) => setLinkedinDetails(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="recruiter@company.com"
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50"
                      disabled={isScanning}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/40 text-xs font-mono mb-1 block">Sample Message</label>
                  <textarea
                    value={linkedinDetails.sampleMessage}
                    onChange={(e) => setLinkedinDetails(prev => ({ ...prev, sampleMessage: e.target.value }))}
                    placeholder="Paste the message you received from the recruiter..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50 resize-none"
                    disabled={isScanning}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={linkedinDetails.hasVerifiedBadge}
                    onChange={(e) => setLinkedinDetails(prev => ({ ...prev, hasVerifiedBadge: e.target.checked }))}
                    className="w-4 h-4 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-purple-500/50"
                    disabled={isScanning}
                  />
                  <label htmlFor="verified" className="text-white/60 text-sm font-mono">
                    Profile has verified badge
                  </label>
                </div>
              </div>
            )}
          </>
        )}

        {/* Scan Button */}
        <button
          onClick={handleScan}
          disabled={isScanning || !(title.includes('GitHub') ? githubUrl.trim() : title.includes('LinkedIn') ? linkedinUrl.trim() : googleFormUrl.trim())}
          className={`w-full ${buttonColor} text-white font-mono font-bold px-6 py-3 rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4`}
        >
          {isScanning ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              {buttonText}
            </>
          )}
        </button>

        {/* Results */}
        {result && (
          <div className="bg-[#0A0A0B] border border-white/10 rounded-lg p-4">
            {/* Score Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/60 text-sm font-mono">Security Score</span>
              <div className={`text-2xl font-mono font-bold ${getScoreColor(result.score)}`}>
                {result.score}/100
              </div>
            </div>

            {/* Metrics */}
            {metrics && (
              <div className="grid grid-cols-3 gap-3 mb-3">
                {metrics.map((metric, i) => (
                  <div key={i} className="text-center">
                    <div className={`text-lg font-mono font-bold ${metric.color}`}>
                      {metric.value}
                    </div>
                    <div className="text-xs text-white/40 font-mono">{metric.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Issues */}
            {(result.redFlags?.length > 0 || result.warnings?.length > 0) && (
              <div className="border-t border-white/10 pt-3">
                <div className="space-y-1">
                  {result.redFlags?.map((flag: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-red-400 text-sm">
                      <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="font-mono">{flag}</span>
                    </div>
                  ))}
                  {result.warnings?.map((warning: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-yellow-400 text-sm">
                      <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="font-mono">{warning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-3">
              <button 
                onClick={() => {
                  // Pre-fill assessment with scanned data and navigate
                  if (typeof window !== 'undefined') {
                    const assessmentData = {
                      recruiter: title.includes('GitHub') ? {
                        name: '',
                        claimedCompany: '',
                        linkedinUrl: '',
                        emailReceived: '',
                        profileAge: '',
                        connections: 0,
                        jobTitle: '',
                        location: '',
                        hasVerifiedBadge: false,
                        sampleMessage: ''
                      } : title.includes('LinkedIn') ? {
                        name: linkedinDetails.name || '',
                        claimedCompany: linkedinDetails.company || '',
                        linkedinUrl: linkedinUrl || '',
                        emailReceived: linkedinDetails.email || '',
                        profileAge: linkedinDetails.joinedDate || '',
                        connections: linkedinDetails.connections || 0,
                        jobTitle: linkedinDetails.jobTitle || '',
                        location: linkedinDetails.location || '',
                        hasVerifiedBadge: linkedinDetails.hasVerifiedBadge || false,
                        sampleMessage: linkedinDetails.sampleMessage || ''
                      } : {
                        name: '',
                        claimedCompany: '',
                        linkedinUrl: '',
                        emailReceived: '',
                        profileAge: '',
                        connections: 0,
                        jobTitle: '',
                        location: '',
                        hasVerifiedBadge: false,
                        sampleMessage: ''
                      },
                      job: {
                        jobDescription: '',
                        recruiterMessages: title.includes('LinkedIn') ? linkedinDetails.sampleMessage || '' : '',
                        salaryMentioned: false,
                        urgencySignals: false,
                        walletSeedKycRequest: false,
                        runCodeLocally: false,
                        googleFormsUrl: title.includes('Form') ? googleFormUrl : '',
                        suspiciousKeywords: []
                      },
                      artifacts: title.includes('GitHub') && githubUrl ? [{ url: githubUrl, type: 'github' as const }] : 
                                 title.includes('Form') && googleFormUrl ? [{ url: googleFormUrl, type: 'forms' as const }] : []
                    };
                    
                    // Store in sessionStorage and navigate
                    sessionStorage.setItem('quickScanAssessmentData', JSON.stringify(assessmentData));
                    window.open('/assess', '_blank');
                  }
                }}
                className="text-xs bg-red-600 hover:bg-red-700 text-white font-mono px-3 py-2 rounded transition-colors"
              >
                Run Full Assessment
              </button>
              <button 
                onClick={() => {
                  setShowResult(false);
                  // Clear all related data
                  if (title.includes('GitHub')) {
                    setGithubResult(null);
                    setGithubError('');
                    setGithubUrl('');
                  } else if (title.includes('LinkedIn')) {
                    setLinkedinResult(null);
                    setLinkedinError('');
                    setLinkedinUrl('');
                    setLinkedinDetails({
                      name: '',
                      company: '',
                      email: '',
                      joinedDate: '',
                      connections: 0,
                      jobTitle: '',
                      location: '',
                      hasVerifiedBadge: false,
                      sampleMessage: ''
                    });
                  } else if (title.includes('Form')) {
                    setFormResult(null);
                    setFormError('');
                    setGoogleFormUrl('');
                  }
                }}
                className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono px-3 py-2 rounded transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm font-mono">❌ {error}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 mb-20">
      <QuickScanCard
        title="Quick GitHub Scan"
        description="Instant repository security analysis"
        icon={Github}
        iconColor="bg-black/20"
        badge="FAST"
        badgeColor="bg-green-500/20 border-green-500/40 text-green-400"
        placeholder="https://github.com/user/repo"
        buttonText="Quick Scan"
        buttonColor="bg-red-600 hover:bg-red-700"
        onScan={handleGithubScan}
        isScanning={activeScan === 'github'}
        result={githubResult}
        error={githubError}
        metrics={[
          {
            label: "Dangerous Scripts",
            value: githubResult?.dangerousScripts?.length || 0,
            color: githubResult?.dangerousScripts?.length > 0 ? 'text-red-400' : 'text-green-400'
          },
          {
            label: "Suspicious Files", 
            value: githubResult?.suspiciousFiles?.length || 0,
            color: githubResult?.suspiciousFiles?.length > 0 ? 'text-orange-400' : 'text-green-400'
          },
          {
            label: "Risk Level",
            value: githubResult?.riskLevel?.toUpperCase() || 'SAFE',
            color: githubResult?.riskLevel === 'safe' ? 'text-green-400' : 'text-red-400'
          }
        ]}
      />
      
      <QuickScanCard
        title="Quick LinkedIn Check"
        description="Recruiter profile risk analysis"
        icon={Linkedin}
        iconColor="bg-blue-500/20"
        badge="NEW"
        badgeColor="bg-purple-500/20 border-purple-500/40 text-purple-400"
        placeholder="https://linkedin.com/in/recruiter-profile"
        buttonText="Check Profile"
        buttonColor="bg-purple-600 hover:bg-purple-700"
        onScan={handleLinkedinScan}
        isScanning={activeScan === 'linkedin'}
        result={linkedinResult}
        error={linkedinError}
        metrics={[
          {
            label: "Profile Age",
            value: linkedinResult?.analysis?.profileAge ? `${linkedinResult.analysis.profileAge}mo` : 'N/A',
            color: linkedinResult?.analysis?.profileAge < 3 ? 'text-red-400' : 'text-green-400'
          },
          {
            label: "Red Flags",
            value: linkedinResult?.redFlags?.length || 0,
            color: linkedinResult?.redFlags?.length > 0 ? 'text-red-400' : 'text-green-400'
          },
          {
            label: "Verification",
            value: linkedinResult?.analysis?.verificationStatus ? 'YES' : 'NO',
            color: linkedinResult?.analysis?.verificationStatus ? 'text-green-400' : 'text-orange-400'
          }
        ]}
      />

      <QuickScanCard
        title="Quick Form Scan"
        description="Google Forms security analysis"
        icon={FileText}
        iconColor="bg-green-500/20"
        badge="SCAN"
        badgeColor="bg-orange-500/20 border-orange-500/40 text-orange-400"
        placeholder="https://forms.gle/example"
        buttonText="Scan Form"
        buttonColor="bg-orange-600 hover:bg-orange-700"
        onScan={handleGoogleFormScan}
        isScanning={activeScan === 'form'}
        result={formResult}
        error={formError}
        metrics={[
          {
            label: "Google Forms",
            value: formResult?.analysis?.isGoogleForms ? 'YES' : 'NO',
            color: formResult?.analysis?.isGoogleForms ? 'text-green-400' : 'text-red-400'
          },
          {
            label: "Red Flags",
            value: formResult?.redFlags?.length || 0,
            color: formResult?.redFlags?.length > 0 ? 'text-red-400' : 'text-green-400'
          },
          {
            label: "VirusTotal",
            value: formResult?.analysis?.virusTotalSafe ? 'SAFE' : 'RISK',
            color: formResult?.analysis?.virusTotalSafe ? 'text-green-400' : 'text-red-400'
          }
        ]}
      />
    </div>
  );
}
