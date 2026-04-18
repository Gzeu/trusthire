'use client';

import { Loader2, Shield, Zap, AlertTriangle, Activity } from 'lucide-react';

interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'dots' | 'pulse';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  submessage?: string;
  progress?: number;
  showProgress?: boolean;
  variant?: 'default' | 'scan' | 'analysis' | 'security';
}

interface SkeletonProps {
  lines?: number;
  height?: string;
  className?: string;
}

interface ProgressIndicatorProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  color?: 'red' | 'blue' | 'green' | 'purple';
  animated?: boolean;
}

export function Skeleton({ lines = 3, height = 'h-4', className = '' }: SkeletonProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, index) => (
        <div
          key={index}
          className={`${height} bg-white/5 rounded animate-pulse`}
          style={{
            animationDelay: `${index * 0.1}s`,
            width: index === lines - 1 ? '60%' : '100%'
          }}
        />
      ))}
    </div>
  );
}

export function ProgressIndicator({ 
  value, 
  max = 100, 
  size = 'md', 
  showPercentage = true, 
  color = 'blue',
  animated = true 
}: ProgressIndicatorProps) {
  const percentage = (value / max) * 100;
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-1';
      case 'md': return 'h-2';
      case 'lg': return 'h-3';
      default: return 'h-2';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'red': return 'bg-red-500';
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'purple': return 'bg-purple-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="w-full">
      {showPercentage && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-white/60 font-mono">Progress</span>
          <span className="text-xs text-white font-mono">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-white/10 rounded-full ${getSizeClasses()}`}>
        <div
          className={`
            ${getSizeClasses()} ${getColorClasses()} rounded-full
            ${animated ? 'transition-all duration-500 ease-out' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function EnhancedLoadingState({
  type = 'spinner',
  size = 'md',
  message,
  submessage,
  progress,
  showProgress = false,
  variant = 'default'
}: LoadingStateProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'md': return 'w-8 h-8';
      case 'lg': return 'w-12 h-12';
      case 'xl': return 'w-16 h-16';
      default: return 'w-8 h-8';
    }
  };

  const getVariantIcon = () => {
    switch (variant) {
      case 'scan': return Shield;
      case 'analysis': return Activity;
      case 'security': return AlertTriangle;
      default: return Zap;
    }
  };

  const getVariantColor = () => {
    switch (variant) {
      case 'scan': return 'text-blue-400';
      case 'analysis': return 'text-purple-400';
      case 'security': return 'text-red-400';
      default: return 'text-white';
    }
  };

  const Icon = getVariantIcon();
  const iconColor = getVariantColor();

  if (type === 'skeleton') {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/5 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-white/5 rounded animate-pulse w-1/2" />
          </div>
        </div>
        <Skeleton lines={3} />
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className="flex items-center justify-center space-x-2">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 bg-white/40 rounded-full animate-pulse`}
            style={{
              animationDelay: `${index * 0.2}s`,
              animationDuration: '1.4s'
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <div className={`w-16 h-16 bg-gradient-to-br from-red-500 to-purple-500 rounded-full animate-pulse`} />
          <Icon className={`absolute inset-0 m-auto w-8 h-8 ${iconColor}`} />
        </div>
        {message && (
          <div className="mt-4 text-center">
            <p className="text-white font-mono text-sm">{message}</p>
            {submessage && <p className="text-white/60 font-mono text-xs mt-1">{submessage}</p>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Loading Icon */}
      <div className="relative">
        <div className={`${getSizeClasses()} rounded-full bg-white/5 flex items-center justify-center`}>
          {type === 'spinner' ? (
            <Loader2 className={`w-full h-full ${iconColor} animate-spin`} />
          ) : (
            <Icon className={`w-full h-full ${iconColor} animate-pulse`} />
          )}
        </div>
        
        {/* Animated Ring */}
        <div className={`absolute inset-0 ${getSizeClasses()} rounded-full border-2 border-transparent border-t-current ${iconColor} animate-spin`} />
      </div>

      {/* Messages */}
      {message && (
        <div className="text-center">
          <p className="text-white font-mono text-sm">{message}</p>
          {submessage && <p className="text-white/60 font-mono text-xs mt-1">{submessage}</p>}
        </div>
      )}

      {/* Progress Bar */}
      {showProgress && progress !== undefined && (
        <div className="w-full max-w-xs">
          <ProgressIndicator value={progress} color="blue" showPercentage />
        </div>
      )}

      {/* Additional Loading Elements */}
      {variant === 'scan' && (
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-blue-400 animate-pulse" />
          <span className="text-blue-400 font-mono text-xs">Scanning repository...</span>
        </div>
      )}

      {variant === 'analysis' && (
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="text-purple-400 font-mono text-xs">AI analysis in progress...</span>
        </div>
      )}

      {variant === 'security' && (
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
          <span className="text-red-400 font-mono text-xs">Security check running...</span>
        </div>
      )}
    </div>
  );
}

// Specialized Loading Components
export function CardSkeleton() {
  return (
    <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/5 rounded-xl animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-white/5 rounded animate-pulse w-32" />
            <div className="h-3 bg-white/5 rounded animate-pulse w-24" />
          </div>
        </div>
        <div className="h-6 bg-white/5 rounded-full animate-pulse w-16" />
      </div>
      <div className="space-y-3">
        <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
        <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(items)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-3 bg-white/5 rounded-xl">
          <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-white/5 rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-white/5">
        {[...Array(columns)].map((_, index) => (
          <div key={index} className="flex-1 p-4">
            <div className="h-4 bg-white/5 rounded animate-pulse" />
          </div>
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="flex border-b border-white/5 last:border-b-0">
          {[...Array(columns)].map((_, colIndex) => (
            <div key={colIndex} className="flex-1 p-4">
              <div className="h-3 bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
