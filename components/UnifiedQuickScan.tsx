'use client';

import { useState } from 'react';
import { 
  Github, 
  Linkedin, 
  Search, 
  TrendingUp, 
  Shield, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Image, 
  Zap, 
  ArrowRight, 
  Loader2,
  PlusCircle
} from 'lucide-react';
import Link from 'next/link';

interface ScanOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  badge?: string;
  badgeColor?: string;
  placeholder: string;
  buttonText: string;
  buttonColor: string;
  href?: string;
  requiresInput?: boolean;
}

interface ScanResult {
  score?: number;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  metrics?: Array<{
    label: string;
    value: string | number;
    color: string;
  }>;
  details?: any;
}

interface UnifiedQuickScanProps {
  compact?: boolean;
  showResults?: boolean;
  onScanComplete?: (type: string, result: ScanResult) => void;
}

const scanOptions: ScanOption[] = [
  {
    id: 'github',
    title: 'GitHub Repository',
    description: 'Analyze repositories for malicious code and security vulnerabilities',
    icon: Github,
    iconColor: 'text-gray-400',
    placeholder: 'https://github.com/username/repository',
    buttonText: 'Scan Repository',
    buttonColor: 'bg-gray-600 hover:bg-gray-700',
    requiresInput: true
  },
  {
    id: 'linkedin',
    title: 'LinkedIn Profile',
    description: 'Verify recruiter authenticity and check for fake profiles',
    icon: Linkedin,
    iconColor: 'text-blue-400',
    placeholder: 'https://linkedin.com/in/username',
    buttonText: 'Verify Profile',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    requiresInput: true
  },
  {
    id: 'image',
    title: 'Reverse Image Search',
    description: 'Check profile pictures for fakes and verify authenticity',
    icon: Image,
    iconColor: 'text-purple-400',
    placeholder: 'Image URL or upload file',
    buttonText: 'Search Image',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    requiresInput: true
  },
  {
    id: 'forms',
    title: 'Google Forms',
    description: 'Analyze forms for phishing attempts and malicious content',
    icon: FileText,
    iconColor: 'text-green-400',
    placeholder: 'Google Form URL',
    buttonText: 'Analyze Form',
    buttonColor: 'bg-green-600 hover:bg-green-700',
    requiresInput: true
  },
  {
    id: 'url',
    title: 'URL Scanner',
    description: 'Check links for threats, malware, and phishing attempts',
    icon: Search,
    iconColor: 'text-orange-400',
    placeholder: 'https://example.com',
    buttonText: 'Scan URL',
    buttonColor: 'bg-orange-600 hover:bg-orange-700',
    requiresInput: true
  }
];

export default function UnifiedQuickScan({ 
  compact = false, 
  showResults = true,
  onScanComplete 
}: UnifiedQuickScanProps) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [scanning, setScanning] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, ScanResult>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (scanId: string, value: string) => {
    setInputs(prev => ({ ...prev, [scanId]: value }));
    // Clear error when user starts typing
    if (errors[scanId]) {
      setErrors(prev => ({ ...prev, [scanId]: '' }));
    }
  };

  const handleScan = async (scanId: string) => {
    const input = inputs[scanId];
    if (!input?.trim()) {
      setErrors(prev => ({ 
        ...prev, 
        [scanId]: `Please enter a valid ${scanOptions.find(s => s.id === scanId)?.title.toLowerCase()}` 
      }));
      return;
    }

    setScanning(prev => ({ ...prev, [scanId]: true }));
    setErrors(prev => ({ ...prev, [scanId]: '' }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result based on scan type
      const mockResult: ScanResult = {
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        riskLevel: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
        metrics: [
          { label: 'Threats Found', value: Math.floor(Math.random() * 5), color: '#DC2626' },
          { label: 'Safety Score', value: Math.floor(Math.random() * 30) + 70, color: '#16A34A' },
          { label: 'Confidence', value: `${Math.floor(Math.random() * 20) + 80}%`, color: '#CA8A04' }
        ]
      };

      setResults(prev => ({ ...prev, [scanId]: mockResult }));
      onScanComplete?.(scanId, mockResult);
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        [scanId]: 'Scan failed. Please try again.' 
      }));
    } finally {
      setScanning(prev => ({ ...prev, [scanId]: false }));
    }
  };

  const ScanCard = ({ option }: { option: ScanOption }) => {
    const Icon = option.icon;
    const isScanning = scanning[option.id];
    const hasResult = results[option.id];
    const hasError = errors[option.id];

    return (
      <div className={`
        bg-[#111113] border border-white/5 rounded-xl p-6
        transition-all duration-300 hover:border-white/10
        ${isScanning ? 'ring-2 ring-blue-500/20' : ''}
        ${hasResult ? 'ring-2 ring-green-500/20' : ''}
        ${hasError ? 'ring-2 ring-red-500/20' : ''}
      `}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${option.iconColor}/20 rounded-lg flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${option.iconColor}`} />
            </div>
            <div>
              <h3 className="text-lg font-mono font-semibold text-white">{option.title}</h3>
              <p className="text-xs text-white/60 font-mono mt-1">{option.description}</p>
            </div>
          </div>
          {option.badge && (
            <span className={`text-xs font-mono px-2 py-1 rounded-full ${option.badgeColor || 'bg-blue-500/20'} ${option.badgeColor?.includes('text') ? '' : 'text-white'}`}>
              {option.badge}
            </span>
          )}
        </div>

        {/* Input */}
        {option.requiresInput && (
          <div className="mb-4">
            <input
              type="text"
              placeholder={option.placeholder}
              value={inputs[option.id] || ''}
              onChange={(e) => handleInputChange(option.id, e.target.value)}
              disabled={isScanning}
              className={`
                w-full bg-[#1f1f23] border border-white/10 rounded-lg px-4 py-3
                text-sm font-mono text-white placeholder-white/40
                focus:outline-none focus:border-red-500/50 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                ${hasError ? 'border-red-500/50' : ''}
              `}
            />
            {hasError && (
              <p className="text-xs text-red-400 font-mono mt-2">{errors[option.id]}</p>
            )}
          </div>
        )}

        {/* Action */}
        <div className="flex items-center gap-3">
          {option.requiresInput ? (
            <button
              onClick={() => handleScan(option.id)}
              disabled={isScanning}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3
                font-mono text-sm font-medium rounded-lg transition-colors
                ${option.buttonColor}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  {option.buttonText}
                </>
              )}
            </button>
          ) : option.href ? (
            <Link
              href={option.href}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3
                font-mono text-sm font-medium rounded-lg transition-colors
                ${option.buttonColor}
              `}
            >
              {option.buttonText}
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : null}
        </div>

        {/* Results */}
        {showResults && hasResult && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-white/60">Scan Results</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono font-bold text-white">
                  {results[option.id].score}
                </span>
                <span className={`text-xs font-mono px-2 py-1 rounded ${
                  results[option.id].riskLevel === 'low' ? 'bg-green-500/20 text-green-400' :
                  results[option.id].riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  results[option.id].riskLevel === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {results[option.id].riskLevel?.toUpperCase()}
                </span>
              </div>
            </div>
            
            {results[option.id].metrics && (
              <div className="grid grid-cols-3 gap-2">
                {results[option.id].metrics?.map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs font-mono text-white/60">{metric.label}</div>
                    <div className="text-sm font-mono font-semibold" style={{ color: metric.color }}>
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (compact) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scanOptions.slice(0, 3).map(option => (
          <ScanCard key={option.id} option={option} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-mono font-bold text-white mb-2">Quick Security Scans</h2>
        <p className="text-white/60 font-mono">Instant analysis for multiple threat vectors</p>
      </div>

      {/* Scan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scanOptions.map(option => (
          <ScanCard key={option.id} option={option} />
        ))}
      </div>

      {/* Advanced Options */}
      <div className="text-center">
        <Link
          href="/assess"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-mono text-sm font-medium rounded-xl transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Advanced Assessment
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
