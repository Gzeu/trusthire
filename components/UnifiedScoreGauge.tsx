'use client';

import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Activity, Zap } from 'lucide-react';

interface UnifiedScoreGaugeProps {
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
  // Legacy props for backward compatibility
  icon?: string;
  description?: string;
}

export default function UnifiedScoreGauge({
  score,
  maxScore = 100,
  label,
  sublabel,
  size = 'lg',
  animated = true,
  showDetails = true,
  riskLevel,
  metrics = [],
  // Legacy props
  icon,
  description
}: UnifiedScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Animation effect
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
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, animated]);

  // Calculate colors and risk level
  const percentage = (animatedScore / maxScore) * 100;
  const getColor = () => {
    if (riskLevel) {
      switch (riskLevel) {
        case 'low': return '#16A34A';
        case 'medium': return '#CA8A04';
        case 'high': return '#EA580C';
        case 'critical': return '#DC2626';
        default: return '#CA8A04';
      }
    }
    
    if (percentage >= 80) return '#16A34A';
    if (percentage >= 55) return '#CA8A04';
    if (percentage >= 30) return '#EA580C';
    return '#DC2626';
  };

  const getRiskLabel = () => {
    if (riskLevel) {
      switch (riskLevel) {
        case 'low': return 'LOW RISK';
        case 'medium': return 'CAUTION';
        case 'high': return 'HIGH RISK';
        case 'critical': return 'CRITICAL';
        default: return 'CAUTION';
      }
    }
    
    if (percentage >= 80) return 'LOW RISK';
    if (percentage >= 55) return 'CAUTION';
    if (percentage >= 30) return 'HIGH RISK';
    return 'CRITICAL';
  };

  const getRiskIcon = () => {
    const risk = riskLevel || (percentage >= 80 ? 'low' : percentage >= 55 ? 'medium' : percentage >= 30 ? 'high' : 'critical');
    switch (risk) {
      case 'low': return CheckCircle;
      case 'medium': return AlertTriangle;
      case 'high': return TrendingUp;
      case 'critical': return Shield;
      default: return AlertTriangle;
    }
  };

  const color = getColor();
  const riskLabel = getRiskLabel();
  const RiskIcon = getRiskIcon();

  // Size configurations
  const sizeConfig = {
    sm: { gauge: 120, strokeWidth: 8, fontSize: 'text-lg' },
    md: { gauge: 160, strokeWidth: 10, fontSize: 'text-xl' },
    lg: { gauge: 200, strokeWidth: 12, fontSize: 'text-2xl' },
    xl: { gauge: 240, strokeWidth: 14, fontSize: 'text-3xl' }
  };

  const config = sizeConfig[size];
  const radius = (config.gauge - 20) / 2;
  const circumference = radius * Math.PI;
  const progress = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Gauge */}
      <div 
        className="relative transition-transform duration-300 hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg width={config.gauge} height={config.gauge / 2 + 20} viewBox={`0 0 ${config.gauge} ${config.gauge / 2 + 20}`}>
          {/* Background arc */}
          <path
            d={`M 10 ${config.gauge / 2} A ${radius} ${radius} 0 0 1 ${config.gauge - 10} ${config.gauge / 2}`}
            fill="none"
            stroke="#1f1f23"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
          />
          
          {/* Progress arc */}
          <path
            d={`M 10 ${config.gauge / 2} A ${radius} ${radius} 0 0 1 ${config.gauge - 10} ${config.gauge / 2}`}
            fill="none"
            stroke={color}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Center content */}
          <text
            x={config.gauge / 2}
            y={config.gauge / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className={`${config.fontSize} font-mono font-bold fill-current`}
            style={{ fill: color }}
          >
            {animatedScore}
          </text>
        </svg>
        
        {/* Risk label */}
        <div className="absolute bottom-0 left-0 right-0 text-center">
          <div className="flex items-center gap-1 justify-center">
            <RiskIcon className="w-3 h-3" style={{ color }} />
            <span className="text-xs font-mono font-semibold" style={{ color }}>
              {riskLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="text-center">
        <h3 className="text-lg font-mono font-semibold text-white">{label}</h3>
        {sublabel && (
          <p className="text-sm text-white/60 font-mono">{sublabel}</p>
        )}
        {description && (
          <p className="text-xs text-white/40 font-mono mt-1">{description}</p>
        )}
      </div>

      {/* Metrics */}
      {showDetails && metrics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-md">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="text-xs font-mono text-white/60">{metric.label}</div>
              <div className="text-sm font-mono font-semibold" style={{ color: metric.color }}>
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hover details */}
      {isHovered && (
        <div className="absolute top-full mt-2 bg-[#111113] border border-white/10 rounded-lg p-3 shadow-lg z-10">
          <div className="text-xs font-mono text-white/60">Score Details</div>
          <div className="text-sm font-mono text-white">{animatedScore}/{maxScore}</div>
          <div className="text-xs font-mono" style={{ color }}>{percentage.toFixed(1)}%</div>
        </div>
      )}
    </div>
  );
}
