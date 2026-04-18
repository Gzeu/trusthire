'use client';

import { useState } from 'react';
import { Github, Linkedin, Search, TrendingUp, Shield, Clock, Users, CheckCircle, AlertTriangle, FileText, Image, Zap, ArrowRight, Loader2 } from 'lucide-react';

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

const ScanCard: React.FC<ScanCardProps> = ({
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
  isScanning = false,
  result,
  error,
  metrics
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleScan = () => {
    if (inputValue.trim() && !isScanning) {
      onScan(inputValue.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  return (
    <div className={`
      relative bg-[#111113] border border-white/5 rounded-2xl p-6
      transition-all duration-300 ease-out
      ${isHovered ? 'border-white/10 shadow-lg shadow-white/5' : ''}
      ${isScanning ? 'ring-2 ring-blue-500/20' : ''}
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            transition-all duration-300
            ${isHovered ? 'scale-110' : ''}
          `}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold font-mono text-white mb-1">{title}</h3>
            <p className="text-sm text-white/60 font-mono">{description}</p>
          </div>
        </div>
        {badge && (
          <span className={`px-2 py-1 rounded-lg text-xs font-mono ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isScanning}
            className={`
              w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
              text-white placeholder-white/40 font-mono text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
              transition-all duration-200
              ${isScanning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}
            `}
          />
          {inputValue && !isScanning && (
            <button
              onClick={() => setInputValue('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleScan}
          disabled={isScanning || !inputValue.trim()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
            font-mono text-sm font-medium transition-all duration-200
            ${isScanning || !inputValue.trim()
              ? 'bg-white/5 text-white/40 cursor-not-allowed'
              : `${buttonColor} text-white hover:shadow-lg transform hover:scale-[1.02]`
            }
          `}
        >
          {isScanning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Scanning...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <p className="text-red-400 text-sm font-mono">{error}</p>
          </div>
        )}

        {/* Result State */}
        {result && !error && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <p className="text-green-400 text-sm font-mono">Scan completed successfully</p>
            </div>
            
            {metrics && (
              <div className="grid grid-cols-2 gap-3">
                {metrics.map((metric, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-xl">
                    <div className={`text-lg font-bold font-mono ${metric.color}`}>
                      {metric.value}
                    </div>
                    <div className="text-xs text-white/60 font-mono">{metric.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function EnhancedQuickScanCards() {
  const [scans, setScans] = useState({
    github: { isScanning: false, result: null, error: '' },
    linkedin: { isScanning: false, result: null, error: '' },
    forms: { isScanning: false, result: null, error: '' },
    image: { isScanning: false, result: null, error: '' }
  } as {
    github: { isScanning: boolean; result: { metrics: Array<{ label: string; value: string | number; color: string }> } | null; error: string };
    linkedin: { isScanning: boolean; result: { metrics: Array<{ label: string; value: string | number; color: string }> } | null; error: string };
    forms: { isScanning: boolean; result: { metrics: Array<{ label: string; value: string | number; color: string }> } | null; error: string };
    image: { isScanning: boolean; result: { metrics: Array<{ label: string; value: string | number; color: string }> } | null; error: string };
  });

  const handleScan = async (type: keyof typeof scans, url: string) => {
    setScans(prev => ({
      ...prev,
      [type]: { ...prev[type], isScanning: true, error: '', result: null }
    }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock results
      const mockResults = {
        github: {
          metrics: [
            { label: 'Risk Score', value: 'Low', color: 'text-green-400' },
            { label: 'Files Scanned', value: '47', color: 'text-white' }
          ]
        },
        linkedin: {
          metrics: [
            { label: 'Risk Score', value: 'Medium', color: 'text-yellow-400' },
            { label: 'Profile Age', value: '2.3 years', color: 'text-white' }
          ]
        },
        forms: {
          metrics: [
            { label: 'Risk Score', value: 'High', color: 'text-red-400' },
            { label: 'Suspicious Fields', value: '3', color: 'text-white' }
          ]
        },
        image: {
          metrics: [
            { label: 'Matches Found', value: '12', color: 'text-yellow-400' },
            { label: 'Platforms', value: '5', color: 'text-white' }
          ]
        }
      };

      setScans(prev => ({
        ...prev,
        [type]: { ...prev[type], isScanning: false, result: mockResults[type as keyof typeof mockResults] }
      }));
    } catch (error) {
      setScans(prev => ({
        ...prev,
        [type]: { ...prev[type], isScanning: false, error: 'Scan failed. Please try again.' }
      }));
    }
  };

  const scanCards = [
    {
      title: 'GitHub Repo Scan',
      description: 'Analyze repositories for malicious code patterns',
      icon: Github,
      iconColor: 'text-green-400',
      badge: 'Popular',
      badgeColor: 'bg-green-500/10 text-green-400 border border-green-500/20',
      placeholder: 'https://github.com/user/repo',
      buttonText: 'Scan Repository',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      onScan: (url: string) => handleScan('github', url),
      isScanning: scans.github.isScanning,
      result: scans.github.result,
      error: scans.github.error,
      metrics: scans.github.result?.metrics
    },
    {
      title: 'LinkedIn Profile Check',
      description: 'Verify recruiter authenticity and profile consistency',
      icon: Linkedin,
      iconColor: 'text-blue-400',
      badge: 'AI-Powered',
      badgeColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      placeholder: 'https://linkedin.com/in/recruiter',
      buttonText: 'Check Profile',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      onScan: (url: string) => handleScan('linkedin', url),
      isScanning: scans.linkedin.isScanning,
      result: scans.linkedin.result,
      error: scans.linkedin.error,
      metrics: scans.linkedin.result?.metrics
    },
    {
      title: 'Google Forms Scan',
      description: 'Analyze forms for phishing and data collection',
      icon: FileText,
      iconColor: 'text-purple-400',
      placeholder: 'https://forms.gle/...',
      buttonText: 'Scan Form',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      onScan: (url: string) => handleScan('forms', url),
      isScanning: scans.forms.isScanning,
      result: scans.forms.result,
      error: scans.forms.error,
      metrics: scans.forms.result?.metrics
    },
    {
      title: 'Reverse Image Search',
      description: 'Check profile pictures for fakes and stock photos',
      icon: Image,
      iconColor: 'text-orange-400',
      placeholder: 'Upload image or enter image URL',
      buttonText: 'Search Image',
      buttonColor: 'bg-orange-600 hover:bg-orange-700',
      onScan: (url: string) => handleScan('image', url),
      isScanning: scans.image.isScanning,
      result: scans.image.result,
      error: scans.image.error,
      metrics: scans.image.result?.metrics
    }
  ];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold font-mono text-white mb-4">
          Quick Security Scans
        </h2>
        <p className="text-lg text-white/60 font-mono max-w-2xl mx-auto">
          Verify recruiters, repositories, and forms in seconds with our AI-powered tools
        </p>
      </div>

      {/* Scan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {scanCards.map((card) => (
          <ScanCard key={card.title} {...card} />
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="flex items-center justify-center gap-8 text-sm text-white/40 font-mono">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span>No code executed</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Results in seconds</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>50,000+ scans completed</span>
        </div>
      </div>
    </div>
  );
}
