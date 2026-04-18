'use client';

import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Activity, Zap } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  label: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showDetails?: boolean;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  metrics?: Array<{
    label: string;
    value: string | number;
    color: string;
  }>;
}

export default function EnhancedScoreGauge({
  score,
  maxScore = 100,
  label,
  sublabel,
  size = 'lg',
  animated = true,
  showDetails = true,
  riskLevel,
  metrics = []
}: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!animated) {
      setAnimatedScore(score);
      return;
    }

    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, animated]);

  const percentage = (animatedScore / maxScore) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-32 h-32';
      case 'md': return 'w-48 h-48';
      case 'lg': return 'w-64 h-64';
      case 'xl': return 'w-80 h-80';
      default: return 'w-64 h-64';
    }
  };

  const getTextSizes = () => {
    switch (size) {
      case 'sm': return 'text-2xl';
      case 'md': return 'text-3xl';
      case 'lg': return 'text-4xl';
      case 'xl': return 'text-5xl';
      default: return 'text-4xl';
    }
  };

  const getRiskColor = () => {
    if (riskLevel) {
      switch (riskLevel) {
        case 'low': return 'text-green-400';
        case 'medium': return 'text-yellow-400';
        case 'high': return 'text-orange-400';
        case 'critical': return 'text-red-400';
        default: return 'text-blue-400';
      }
    }
    
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    if (percentage >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getGaugeColor = () => {
    if (riskLevel) {
      switch (riskLevel) {
        case 'low': return '#16A34A';
        case 'medium': return '#CA8A04';
        case 'high': return '#EA580C';
        case 'critical': return '#DC2626';
        default: return '#3B82F6';
      }
    }
    
    if (percentage >= 80) return '#16A34A';
    if (percentage >= 60) return '#CA8A04';
    if (percentage >= 40) return '#EA580C';
    return '#DC2626';
  };

  const getRiskIcon = () => {
    if (riskLevel === 'critical') return AlertTriangle;
    if (riskLevel === 'high') return AlertTriangle;
    if (riskLevel === 'medium') return Activity;
    return CheckCircle;
  };

  const getRiskLabel = () => {
    if (riskLevel) {
      switch (riskLevel) {
        case 'low': return 'LOW RISK';
        case 'medium': return 'MEDIUM RISK';
        case 'high': return 'HIGH RISK';
        case 'critical': return 'CRITICAL';
        default: return 'SAFE';
      }
    }
    
    if (percentage >= 80) return 'LOW RISK';
    if (percentage >= 60) return 'MEDIUM RISK';
    if (percentage >= 40) return 'HIGH RISK';
    return 'CRITICAL';
  };

  const Icon = getRiskIcon();

  return (
    <div className="flex flex-col items-center">
      {/* Main Gauge */}
      <div 
        className={`
          relative ${getSizeClasses()}
          transition-all duration-300 ease-out
          ${isHovered ? 'scale-105' : 'scale-100'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Circle */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-white/10"
          />
        </svg>

        {/* Progress Circle */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke={getGaugeColor()}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(var(--color), 0.3))'
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`font-bold font-mono ${getTextSizes()} ${getRiskColor()}`}>
            {Math.round(animatedScore)}
          </div>
          <div className="text-xs text-white/60 font-mono">/ {maxScore}</div>
        </div>

        {/* Risk Indicator */}
        <div className="absolute -top-2 -right-2 bg-[#111113] border border-white/20 rounded-full p-2">
          <Icon className={`w-4 h-4 ${getRiskColor()}`} />
        </div>
      </div>

      {/* Labels */}
      <div className="text-center mt-4">
        <h3 className="text-lg font-semibold font-mono text-white mb-1">{label}</h3>
        {sublabel && (
          <p className="text-sm text-white/60 font-mono">{sublabel}</p>
        )}
      </div>

      {/* Risk Badge */}
      <div className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border
        ${riskLevel === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
          riskLevel === 'high' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
          riskLevel === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
          'bg-green-500/10 text-green-400 border-green-500/30'}
      `}>
        <Icon className="w-3 h-3" />
        <span>{getRiskLabel()}</span>
      </div>

      {/* Detailed Metrics */}
      {showDetails && metrics.length > 0 && (
        <div className={`
          mt-6 p-4 bg-[#111113] border border-white/5 rounded-2xl
          transition-all duration-300
          ${isHovered ? 'border-white/10' : ''}
        `}>
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className={`text-lg font-bold font-mono ${metric.color}`}>
                  {metric.value}
                </div>
                <div className="text-xs text-white/60 font-mono">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hover Details */}
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/80 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-white font-mono text-sm mb-2">
                Risk Assessment
              </div>
              <div className={`text-lg font-bold font-mono ${getRiskColor()}`}>
                {getRiskLabel()}
              </div>
              <div className="text-xs text-white/60 font-mono mt-1">
                Score: {Math.round(animatedScore)}/{maxScore}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
