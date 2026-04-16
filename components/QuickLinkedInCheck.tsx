'use client';

import { useState } from 'react';
import { Linkedin, Search, Loader2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface LinkedInProfileData {
  url: string;
  joinedDate: string;
  connections: number;
  jobTitle: string;
  location: string;
  email: string;
  sampleMessage: string;
  hasVerifiedBadge: boolean;
}

interface LinkedInAnalysisResult {
  score: number;
  verdict: 'low_risk' | 'suspicious' | 'high_risk';
  redFlags: string[];
  warnings: string[];
  analysis: {
    profileAge: number;
    emailRisk: boolean;
    connectionsRisk: boolean;
    messageRisk: boolean;
    verificationStatus: boolean;
  };
}

export default function QuickLinkedInCheck() {
  const [profileData, setProfileData] = useState<LinkedInProfileData>({
    url: '',
    joinedDate: '',
    connections: 0,
    jobTitle: '',
    location: '',
    email: '',
    sampleMessage: '',
    hasVerifiedBadge: false
  });
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<LinkedInAnalysisResult | null>(null);
  const [scanError, setScanError] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const analyzeLinkedInProfile = (data: LinkedInProfileData): LinkedInAnalysisResult => {
    let score = 100;
    const redFlags: string[] = [];
    const warnings: string[] = [];

    // Calculate profile age in months
    const joinedDate = new Date(data.joinedDate);
    const now = new Date();
    const profileAgeMonths = (now.getFullYear() - joinedDate.getFullYear()) * 12 + 
                            (now.getMonth() - joinedDate.getMonth());

    // Profile age scoring
    if (profileAgeMonths < 3) {
      score -= 35;
      redFlags.push(`Profile created less than 3 months ago (${profileAgeMonths} months)`);
    } else if (profileAgeMonths < 6) {
      score -= 20;
      redFlags.push(`Profile created less than 6 months ago (${profileAgeMonths} months)`);
    }

    // Email analysis
    const suspiciousEmails = ['outlook.com', 'gmail.com', 'yahoo.com', 'hotmail.com'];
    const hasYearInEmail = /20(24|25|26)/.test(data.email);
    const emailDomain = data.email.split('@')[1]?.toLowerCase();
    
    if (suspiciousEmails.includes(emailDomain) || hasYearInEmail) {
      score -= 25;
      redFlags.push(`Suspicious email address: ${data.email}`);
    }

    // Connections analysis
    const isSeniorRecruiter = data.jobTitle.toLowerCase().includes('senior') || 
                            data.jobTitle.toLowerCase().includes('lead') || 
                            data.jobTitle.toLowerCase().includes('principal');
    
    if (isSeniorRecruiter && data.connections < 300) {
      score -= 18;
      redFlags.push(`Senior recruiter title with only ${data.connections} connections`);
    } else if (data.connections < 100) {
      score -= 15;
      warnings.push(`Low connection count: ${data.connections}`);
    }

    // Message analysis
    const scamKeywords = [
      'technical assessment', 'culture fit', 'growth strategies', 
      'defi ecosystem', 'innovative solutions', 'urgent opportunity',
      'immediate start', 'competitive package', 'revolutionary'
    ];
    
    const messageLower = data.sampleMessage.toLowerCase();
    const foundKeywords = scamKeywords.filter(keyword => messageLower.includes(keyword));
    
    if (foundKeywords.length > 0) {
      score -= 20;
      redFlags.push(`Message contains suspicious keywords: ${foundKeywords.join(', ')}`);
    }

    // Verification status
    if (!data.hasVerifiedBadge) {
      score -= 10;
      warnings.push('Profile is not verified');
    }

    // Location vs email mismatch
    const romanianIndicators = ['romania', 'bucharest', 'cluj', 'timisoara'];
    const brazilianIndicators = ['brazil', 'são paulo', 'rio', 'brasilia'];
    
    const locationLower = data.location.toLowerCase();
    const hasRomanianLocation = romanianIndicators.some(indicator => locationLower.includes(indicator));
    const hasBrazilianLocation = brazilianIndicators.some(indicator => locationLower.includes(indicator));
    const hasRomanianEmail = data.email.toLowerCase().includes('.ro');
    
    if (hasBrazilianLocation && hasRomanianEmail) {
      warnings.push('Location (Brazil) vs email domain (.ro) mismatch');
    }

    // Generic bio warning
    if (!data.jobTitle || data.jobTitle.length < 10) {
      warnings.push('Generic or missing job title');
    }

    // Determine verdict
    let verdict: 'low_risk' | 'suspicious' | 'high_risk';
    if (score >= 80) {
      verdict = 'low_risk';
    } else if (score >= 60) {
      verdict = 'suspicious';
    } else {
      verdict = 'high_risk';
    }

    return {
      score: Math.max(0, score),
      verdict,
      redFlags,
      warnings,
      analysis: {
        profileAge: profileAgeMonths,
        emailRisk: suspiciousEmails.includes(emailDomain) || hasYearInEmail,
        connectionsRisk: isSeniorRecruiter ? data.connections < 300 : data.connections < 100,
        messageRisk: foundKeywords.length > 0,
        verificationStatus: data.hasVerifiedBadge
      }
    };
  };

  const handleQuickCheck = async () => {
    if (!profileData.url.trim()) return;
    
    setIsScanning(true);
    setScanError('');
    setScanResult(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = analyzeLinkedInProfile(profileData);
      setScanResult(result);
      setShowDetails(true);
    } catch (error) {
      setScanError('Profile analysis failed');
    } finally {
      setIsScanning(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'low_risk': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'suspicious': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'high_risk': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'low_risk': return CheckCircle;
      case 'suspicious': return AlertTriangle;
      case 'high_risk': return XCircle;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="bg-[#111113] border border-white/5 rounded-xl p-8">
      <div className="flex items-center gap-2 mb-6">
        <Linkedin className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-mono font-bold">Quick LinkedIn Profile Check</h2>
        <span className="text-xs bg-purple-500/20 border border-purple-500/40 text-purple-400 px-2 py-1 rounded font-mono">NEW</span>
      </div>
      
      <p className="text-white/60 mb-6">
        Paste a LinkedIn recruiter profile URL for instant risk analysis. No signup required.
      </p>

      {/* Profile URL Input */}
      <div className="mb-6">
        <div className="relative">
          <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={profileData.url}
            onChange={(e) => setProfileData(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://linkedin.com/in/recruiter-profile"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/40 font-mono focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
            disabled={isScanning}
          />
        </div>
      </div>

      {/* Expandable Details */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-purple-400 text-sm font-mono hover:text-purple-300 transition-colors mb-4"
      >
        {showDetails ? 'Hide' : 'Show'} additional details
      </button>

      {showDetails && (
        <div className="space-y-4 mb-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-white/40 text-xs font-mono mb-1 block">Joined Date</label>
              <input
                type="date"
                value={profileData.joinedDate}
                onChange={(e) => setProfileData(prev => ({ ...prev, joinedDate: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50"
                disabled={isScanning}
              />
            </div>
            <div>
              <label className="text-white/40 text-xs font-mono mb-1 block">Connections</label>
              <input
                type="number"
                value={profileData.connections}
                onChange={(e) => setProfileData(prev => ({ ...prev, connections: parseInt(e.target.value) || 0 }))}
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
              value={profileData.jobTitle}
              onChange={(e) => setProfileData(prev => ({ ...prev, jobTitle: e.target.value }))}
              placeholder="Senior Technical Recruiter"
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50"
              disabled={isScanning}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-white/40 text-xs font-mono mb-1 block">Location</label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="San Francisco, CA"
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50"
                disabled={isScanning}
              />
            </div>
            <div>
              <label className="text-white/40 text-xs font-mono mb-1 block">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="recruiter@company.com"
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50"
                disabled={isScanning}
              />
            </div>
          </div>

          <div>
            <label className="text-white/40 text-xs font-mono mb-1 block">Sample Message (Optional)</label>
            <textarea
              value={profileData.sampleMessage}
              onChange={(e) => setProfileData(prev => ({ ...prev, sampleMessage: e.target.value }))}
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
              checked={profileData.hasVerifiedBadge}
              onChange={(e) => setProfileData(prev => ({ ...prev, hasVerifiedBadge: e.target.checked }))}
              className="w-4 h-4 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-purple-500/50"
              disabled={isScanning}
            />
            <label htmlFor="verified" className="text-white/60 text-sm font-mono">
              Profile has verified badge
            </label>
          </div>
        </div>
      )}

      {/* Check Button */}
      <button
        onClick={handleQuickCheck}
        disabled={isScanning || !profileData.url.trim()}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-white/10 disabled:border-white/20 text-white font-mono font-bold px-6 py-3 rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isScanning ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing Profile...
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            Check Profile
          </>
        )}
      </button>

      {/* Results */}
      {scanResult && (
        <div className="mt-6 bg-[#0A0A0B] border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono font-bold">Profile Analysis</h3>
            <div className={`text-2xl font-mono font-bold ${getScoreColor(scanResult.score)}`}>
              {scanResult.score}/100
            </div>
          </div>

          {/* Verdict */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border mb-4 ${getVerdictColor(scanResult.verdict)}`}>
            {(() => {
              const Icon = getVerdictIcon(scanResult.verdict);
              return <Icon className="w-4 h-4" />;
            })()}
            <span className="font-mono text-sm font-bold">
              {scanResult.verdict.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Metrics */}
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className={`text-lg font-mono font-bold ${
                scanResult.analysis.profileAge < 3 ? 'text-red-400' : 
                scanResult.analysis.profileAge < 6 ? 'text-orange-400' : 'text-green-400'
              }`}>
                {scanResult.analysis.profileAge}mo
              </div>
              <div className="text-xs text-white/40 font-mono">Profile Age</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-mono font-bold ${
                scanResult.redFlags.length > 0 ? 'text-red-400' : 
                scanResult.warnings.length > 0 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {scanResult.redFlags.length}
              </div>
              <div className="text-xs text-white/40 font-mono">Red Flags</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-mono font-bold ${
                scanResult.analysis.verificationStatus ? 'text-green-400' : 'text-orange-400'
              }`}>
                {scanResult.analysis.verificationStatus ? 'YES' : 'NO'}
              </div>
              <div className="text-xs text-white/40 font-mono">Verified</div>
            </div>
          </div>

          {/* Issues */}
          {(scanResult.redFlags.length > 0 || scanResult.warnings.length > 0) && (
            <div className="border-t border-white/10 pt-4">
              <p className="text-white/60 text-sm mb-2">Issues found:</p>
              <ul className="space-y-1">
                {scanResult.redFlags.map((flag, i) => (
                  <li key={i} className="text-red-400 text-sm font-mono flex items-start gap-2">
                    <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {flag}
                  </li>
                ))}
                {scanResult.warnings.map((warning, i) => (
                  <li key={i} className="text-yellow-400 text-sm font-mono flex items-start gap-2">
                    <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <a
              href="/assess"
              className="text-xs bg-purple-600 hover:bg-purple-700 text-white font-mono px-3 py-2 rounded transition-colors"
            >
              Run Full Assessment
            </a>
            <button
              onClick={() => {
                setScanResult(null);
                setProfileData({
                  url: '',
                  joinedDate: '',
                  connections: 0,
                  jobTitle: '',
                  location: '',
                  email: '',
                  sampleMessage: '',
                  hasVerifiedBadge: false
                });
              }}
              className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono px-3 py-2 rounded transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {scanError && (
        <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm font-mono">â {scanError}</p>
        </div>
      )}
    </div>
  );
}
