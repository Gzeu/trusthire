'use client';

import { Loader2, RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface UnifiedLoadingProps {
  type?: 'spinner' | 'skeleton' | 'pulse' | 'dots' | 'progress';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  text?: string;
  progress?: number;
  showPercentage?: boolean;
}

interface LoadingSkeletonProps {
  lines?: number;
  height?: string;
  className?: string;
}

interface LoadingCardProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<any>;
  type?: 'loading' | 'error' | 'success' | 'empty';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function UnifiedLoading({ 
  type = 'spinner', 
  size = 'md', 
  color = 'text-white', 
  text,
  progress,
  showPercentage = false
}: UnifiedLoadingProps) {
  const sizeConfig = {
    sm: { w: 4, h: 4, text: 'text-sm' },
    md: { w: 6, h: 6, text: 'text-base' },
    lg: { w: 8, h: 8, text: 'text-lg' },
    xl: { w: 12, h: 12, text: 'text-xl' }
  };

  const config = sizeConfig[size];

  const renderLoadingType = () => {
    switch (type) {
      case 'spinner':
        return (
          <Loader2 className={`w-${config.w} h-${config.h} animate-spin ${color}`} />
        );
      
      case 'pulse':
        return (
          <div className={`w-${config.w} h-${config.h} bg-current rounded-full ${color} animate-pulse`} />
        );
      
      case 'dots':
        return (
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 bg-current rounded-full ${color} animate-bounce`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
      
      case 'progress':
        return (
          <div className="w-full max-w-xs">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-mono ${color}`}>Loading...</span>
              {showPercentage && progress !== undefined && (
                <span className={`text-xs font-mono ${color}`}>{Math.round(progress)}%</span>
              )}
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${progress || 0}%`,
                  backgroundColor: color.replace('text-', '#').replace('white', '#ffffff')
                }}
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {renderLoadingType()}
      {text && (
        <span className={`text-sm font-mono ${color}`}>
          {text}
        </span>
      )}
    </div>
  );
}

export function LoadingSkeleton({ lines = 3, height = 'h-4', className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${height} bg-white/10 rounded animate-pulse`}
          style={{
            width: `${Math.random() * 40 + 60}%`, // Random width between 60-100%
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
}

export function LoadingCard({ 
  title, 
  description, 
  icon: Icon, 
  type = 'loading', 
  action 
}: LoadingCardProps) {
  const getTypeConfig = () => {
    switch (type) {
      case 'loading':
        return {
          icon: Loader2,
          iconColor: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30'
        };
      
      case 'error':
        return {
          icon: XCircle,
          iconColor: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30'
        };
      
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30'
        };
      
      case 'empty':
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30'
        };
      
      default:
        return {
          icon: Loader2,
          iconColor: 'text-gray-400',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/30'
        };
    }
  };

  const config = getTypeConfig();
  const TypeIcon = config.icon;

  return (
    <div className="bg-[#111113] border border-white/5 rounded-2xl p-8 text-center">
      <div className={`w-16 h-16 ${config.bgColor} ${config.borderColor} border rounded-2xl flex items-center justify-center mx-auto mb-4`}>
        <TypeIcon className={`w-8 h-8 ${config.iconColor} ${type === 'loading' ? 'animate-spin' : ''}`} />
      </div>
      
      {title && (
        <h3 className="text-lg font-mono font-semibold text-white mb-2">
          {title}
        </h3>
      )}
      
      {description && (
        <p className="text-sm text-white/60 font-mono mb-6">
          {description}
        </p>
      )}
      
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-mono rounded-xl transition-colors mx-auto"
        >
          {action.label}
        </button>
      )}
      
      {Icon && !title && !description && !action && (
        <div className={`w-12 h-12 ${config.bgColor} ${config.borderColor} border rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${config.iconColor} ${type === 'loading' ? 'animate-spin' : ''}`} />
        </div>
      )}
    </div>
  );
}

// Predefined loading states for common use cases
export const LoadingStates = {
  // Page loading
  Page: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B]">
      <UnifiedLoading type="spinner" size="lg" text="Loading page..." />
    </div>
  ),

  // Data loading
  Data: (text = 'Loading data...') => (
    <UnifiedLoading type="spinner" size="md" text={text} />
  ),

  // Content loading
  Content: (text = 'Loading content...') => (
    <div className="flex items-center justify-center py-12">
      <UnifiedLoading type="dots" size="md" text={text} />
    </div>
  ),

  // Form submission
  Form: () => (
    <UnifiedLoading type="spinner" size="md" text="Submitting..." />
  ),

  // File upload
  Upload: (progress?: number) => (
    <UnifiedLoading 
      type="progress" 
      size="md" 
      text="Uploading file..." 
      progress={progress}
      showPercentage={!!progress}
    />
  ),

  // Search loading
  Search: () => (
    <UnifiedLoading type="dots" size="sm" text="Searching..." />
  ),

  // Error state
  Error: (message = 'Something went wrong', onRetry?: () => void) => (
    <LoadingCard
      type="error"
      title="Error"
      description={message}
      action={onRetry ? { label: 'Try Again', onClick: onRetry } : undefined}
    />
  ),

  // Empty state
  Empty: (message = 'No data available', action?: { label: string; onClick: () => void }) => (
    <LoadingCard
      type="empty"
      title="No Data"
      description={message}
      action={action}
    />
  ),

  // Success state
  Success: (message = 'Operation completed successfully') => (
    <LoadingCard
      type="success"
      title="Success"
      description={message}
    />
  )
};
