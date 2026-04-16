'use client';

import { useState } from 'react';
import { Github, Linkedin, Search, TrendingUp, Shield, Clock, Users, CheckCircle, AlertTriangle } from 'lucide-react';

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
  const [activeScan, setActiveScan] = useState<'github' | 'linkedin' | null>(null);
  
  // Mock scan results for demonstration
  const [githubResult, setGithubResult] = useState<any>(null);
  const [linkedinResult, setLinkedinResult] = useState<any>(null);
  const [githubError, setGithubError] = useState('');
  const [linkedinError, setLinkedinError] = useState('');

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
      // Mock LinkedIn scan logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockResult = {
        score: Math.floor(Math.random() * 100),
        verdict: Math.random() > 0.5 ? 'low_risk' : 'suspicious',
        redFlags: Math.random() > 0.6 ? ['New profile (< 3 months)'] : [],
        warnings: Math.random() > 0.7 ? ['Low connection count'] : []
      };
      setLinkedinResult(mockResult);
    } catch (error) {
      setLinkedinError('Profile analysis failed');
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
        setUrl(githubUrl);
        handleGithubScan();
      } else {
        setUrl(linkedinUrl);
        handleLinkedinScan();
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
            value={title.includes('GitHub') ? githubUrl : linkedinUrl}
            onChange={(e) => title.includes('GitHub') ? setGithubUrl(e.target.value) : setLinkedinUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleScan()}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/40 font-mono focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all"
            disabled={isScanning}
          />
        </div>

        {/* Scan Button */}
        <button
          onClick={handleScan}
          disabled={isScanning || !url.trim()}
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
              <button className="text-xs bg-red-600 hover:bg-red-700 text-white font-mono px-3 py-2 rounded transition-colors">
                Run Full Assessment
              </button>
              <button 
                onClick={() => setShowResult(false)}
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
    <div className="grid lg:grid-cols-2 gap-6 mb-20">
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
    </div>
  );
}
