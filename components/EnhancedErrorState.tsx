'use client';

import { AlertTriangle, RefreshCw, Shield, Info, X, ExternalLink, Bug } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  details?: string;
  type?: 'error' | 'warning' | 'info' | 'network';
  onRetry?: () => void;
  onDismiss?: () => void;
  retryText?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'card' | 'inline' | 'full';
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    icon?: React.ComponentType<any>;
  }>;
}

export default function EnhancedErrorState({
  title,
  message,
  details,
  type = 'error',
  onRetry,
  onDismiss,
  retryText = 'Try Again',
  showIcon = true,
  size = 'md',
  variant = 'card',
  actions = []
}: ErrorStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'error': return AlertTriangle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      case 'network': return ExternalLink;
      default: return AlertTriangle;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'error': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'info': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'network': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      default: return 'text-red-400 bg-red-500/10 border-red-500/20';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'p-4';
      case 'md': return 'p-6';
      case 'lg': return 'p-8';
      default: return 'p-6';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'card': return 'rounded-2xl border';
      case 'inline': return 'rounded-lg border';
      case 'full': return 'border-l-4';
      default: return 'rounded-2xl border';
    }
  };

  const Icon = getIcon();
  const colorClasses = getColorClasses();
  const sizeClasses = getSizeClasses();
  const variantClasses = getVariantClasses();

  const errorSuggestions = {
    error: [
      'Check your internet connection',
      'Verify the URL or input is correct',
      'Try refreshing the page'
    ],
    warning: [
      'Review the input data',
      'Check for missing required fields',
      'Consider alternative approaches'
    ],
    info: [
      'Read the documentation',
      'Check the examples',
      'Visit the help center'
    ],
    network: [
      'Check your internet connection',
      'Verify the server is accessible',
      'Try again in a few moments'
    ]
  };

  const suggestions = errorSuggestions[type] || errorSuggestions.error;

  if (variant === 'full') {
    return (
      <div className={`flex gap-4 ${colorClasses} ${variantClasses}`}>
        {showIcon && <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />}
        <div className="flex-1">
          {title && <h4 className="font-semibold font-mono mb-1">{title}</h4>}
          <p className="text-sm font-mono">{message}</p>
          {details && <p className="text-xs font-mono mt-2 opacity-70">{details}</p>}
          
          {/* Actions */}
          <div className="flex items-center gap-3 mt-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-mono transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                {retryText}
              </button>
            )}
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  action.variant === 'primary' 
                    ? 'bg-white/20 hover:bg-white/30' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {action.icon && <action.icon className="w-3 h-3" />}
                {action.label}
              </button>
            ))}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`${colorClasses} ${variantClasses} ${sizeClasses}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        {showIcon && (
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
            ${type === 'error' ? 'bg-red-500/20' : 
              type === 'warning' ? 'bg-yellow-500/20' : 
              type === 'info' ? 'bg-blue-500/20' : 
              'bg-orange-500/20'}
          `}>
            <Icon className="w-6 h-6" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          {title && (
            <h3 className="text-lg font-semibold font-mono text-white mb-2">
              {title}
            </h3>
          )}

          {/* Message */}
          <p className="text-white/80 font-mono text-sm mb-3">
            {message}
          </p>

          {/* Details */}
          {details && (
            <details className="mb-4">
              <summary className="cursor-pointer text-xs font-mono text-white/60 hover:text-white/80 transition-colors">
                Show technical details
              </summary>
              <div className="mt-2 p-3 bg-black/20 rounded-lg">
                <pre className="text-xs font-mono text-white/60 whitespace-pre-wrap">
                  {details}
                </pre>
              </div>
            </details>
          )}

          {/* Suggestions */}
          <div className="mb-4">
            <p className="text-xs font-mono text-white/60 mb-2">Suggestions:</p>
            <ul className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-white/40 mt-0.5">â¢</span>
                  <span className="text-xs font-mono text-white/70">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-mono transition-all duration-200 hover:scale-105"
              >
                <RefreshCw className="w-4 h-4" />
                {retryText}
              </button>
            )}
            
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all duration-200 hover:scale-105 ${
                  action.variant === 'primary'
                    ? 'bg-white/20 hover:bg-white/30 border border-white/30'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                {action.icon && <action.icon className="w-4 h-4" />}
                {action.label}
              </button>
            ))}

            {/* Debug Info */}
            {type === 'error' && (
              <button
                onClick={() => {
                  console.error('Error details:', { title, message, details });
                  alert('Error details logged to console. Check the dev tools.');
                }}
                className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono transition-all duration-200"
              >
                <Bug className="w-3 h-3" />
                Debug
              </button>
            )}
          </div>
        </div>

        {/* Dismiss */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

// Specialized Error Components
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <EnhancedErrorState
      type="network"
      title="Network Error"
      message="Unable to connect to the server. Please check your internet connection."
      details="The request to the server failed. This could be due to network issues, server downtime, or incorrect configuration."
      onRetry={onRetry}
      actions={[
        {
          label: 'Check Status',
          onClick: () => window.open('https://status.trusthire.dev', '_blank'),
          variant: 'secondary',
          icon: ExternalLink
        }
      ]}
    />
  );
}

export function ValidationError({ field, value, onRetry }: { 
  field: string; 
  value: string; 
  onRetry?: () => void 
}) {
  return (
    <EnhancedErrorState
      type="warning"
      title="Validation Error"
      message={`The ${field} field contains invalid data.`}
      details={`Invalid value: "${value}"\n\nPlease check the format and try again.`}
      onRetry={onRetry}
      retryText="Fix Input"
    />
  );
}

export function ScanError({ error, onRetry }: { 
  error: string; 
  onRetry?: () => void 
}) {
  return (
    <EnhancedErrorState
      type="error"
      title="Scan Failed"
      message="Unable to complete the security scan."
      details={error}
      onRetry={onRetry}
      actions={[
        {
          label: 'Report Issue',
          onClick: () => window.open('https://github.com/Gzeu/trusthire/issues', '_blank'),
          variant: 'secondary',
          icon: Bug
        }
      ]}
    />
  );
}

export function APIError({ endpoint, status, onRetry }: { 
  endpoint: string; 
  status: number; 
  onRetry?: () => void 
}) {
  return (
    <EnhancedErrorState
      type="error"
      title="API Error"
      message={`Request to ${endpoint} failed.`}
      details={`Status: ${status}\nEndpoint: ${endpoint}\nTimestamp: ${new Date().toISOString()}`}
      onRetry={onRetry}
      actions={[
        {
          label: 'View API Docs',
          onClick: () => window.open('https://docs.trusthire.dev/api', '_blank'),
          variant: 'secondary',
          icon: ExternalLink
        }
      ]}
    />
  );
}

// Inline Error Component
export function InlineError({ message, onDismiss }: { 
  message: string; 
  onDismiss?: () => void 
}) {
  return (
    <EnhancedErrorState
      message={message}
      type="warning"
      size="sm"
      variant="inline"
      showIcon={true}
      onDismiss={onDismiss}
    />
  );
}
