'use client';

import { useMemo } from 'react';

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

export function ScoreGauge({ score, size = 160 }: ScoreGaugeProps) {
  const radius = (size - 20) / 2;
  const circumference = radius * Math.PI; // half circle
  const progress = useMemo(() => {
    const pct = Math.min(100, Math.max(0, score)) / 100;
    return circumference - pct * circumference;
  }, [score, circumference]);

  const color = useMemo(() => {
    if (score >= 80) return '#16A34A';
    if (score >= 55) return '#CA8A04';
    if (score >= 30) return '#EA580C';
    return '#DC2626';
  }, [score]);

  const label = useMemo(() => {
    if (score >= 80) return 'LOW RISK';
    if (score >= 55) return 'CAUTION';
    if (score >= 30) return 'HIGH RISK';
    return 'CRITICAL';
  }, [score]);

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        {/* Background arc */}
        <path
          d={`M 10 ${cy} A ${radius} ${radius} 0 0 1 ${size - 10} ${cy}`}
          fill="none"
          stroke="#1f1f23"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d={`M 10 ${cy} A ${radius} ${radius} 0 0 1 ${size - 10} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        {/* Score text */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fill={color}
          fontSize="28"
          fontWeight="700"
          fontFamily="monospace"
        >
          {score}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fill="#666"
          fontSize="10"
          fontFamily="monospace"
          letterSpacing="2"
        >
          / 100
        </text>
      </svg>
      <span
        className="text-xs font-bold tracking-widest px-3 py-1 rounded-full border font-mono"
        style={{ color, borderColor: color, backgroundColor: `${color}15` }}
      >
        {label}
      </span>
    </div>
  );
}
