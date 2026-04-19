'use client';

// ─── TrustHire Design System ─────────────────────────────────────────────────────
// Centralized design tokens and reusable components for consistency

export const DESIGN_TOKENS = {
  // Colors
  colors: {
    background: '#0A0A0B',
    surface: '#111113',
    surfaceLight: '#1A1A1C',
    border: 'rgba(255, 255, 255, 0.05)',
    borderHover: 'rgba(255, 255, 255, 0.1)',
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      tertiary: 'rgba(255, 255, 255, 0.4)',
      quaternary: 'rgba(255, 255, 255, 0.25)',
    },
    accent: {
      red: {
        50: 'rgba(239, 68, 68, 0.1)',
        100: 'rgba(239, 68, 68, 0.2)',
        500: '#EF4444',
        600: '#DC2626',
      },
      green: {
        50: 'rgba(34, 197, 94, 0.1)',
        100: 'rgba(34, 197, 94, 0.2)',
        400: '#22C55E',
      },
      yellow: {
        50: 'rgba(250, 204, 21, 0.1)',
        100: 'rgba(250, 204, 21, 0.2)',
        400: '#FACC15',
      },
      purple: {
        50: 'rgba(168, 85, 247, 0.1)',
        100: 'rgba(168, 85, 247, 0.2)',
        400: '#A855F7',
      },
    },
  },

  // Spacing
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    '3xl': '3rem',    // 48px
    '4xl': '4rem',    // 64px
  },

  // Border radius
  radius: {
    sm: '0.5rem',     // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.5rem',  // 24px - Standard for cards
  },

  // Typography
  typography: {
    fontFamily: 'Inter, ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glow: {
      red: '0 0 20px rgba(239, 68, 68, 0.3)',
      green: '0 0 20px rgba(34, 197, 94, 0.3)',
      yellow: '0 0 20px rgba(250, 204, 21, 0.3)',
      purple: '0 0 20px rgba(168, 85, 247, 0.3)',
    },
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// ─── Utility Classes ─────────────────────────────────────────────────────────────

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// ─── Core Components ────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'surface' | 'accent' | 'glass';
  hover?: boolean;
  glow?: 'red' | 'green' | 'yellow' | 'purple';
}

export function Card({ children, className, variant = 'default', hover = false, glow }: CardProps) {
  const baseClasses = `
    rounded-3xl border transition-all duration-200
    ${DESIGN_TOKENS.transitions.normal}
  `;

  const variantClasses = {
    default: `
      bg-[#111113] border-white/5
      ${hover ? 'hover:border-white/10 hover:bg-[#1A1A1C]' : ''}
    `,
    surface: `
      bg-[#0A0A0B] border-white/5
      ${hover ? 'hover:border-white/10' : ''}
    `,
    accent: `
      bg-red-950/20 border-red-500/20
      ${hover ? 'hover:border-red-500/30 hover:bg-red-950/30' : ''}
    `,
    glass: `
      bg-white/5 backdrop-blur-md border-white/10
      ${hover ? 'hover:bg-white/10 hover:border-white/20' : ''}
    `,
  };

  const glowClasses = glow ? `shadow-lg ${DESIGN_TOKENS.shadows.glow[glow]}` : '';

  return (
    <div className={cn(baseClasses, variantClasses[variant], glowClasses, className)}>
      {children}
    </div>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  href?: string;
  target?: string;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  onClick,
  href,
  target,
}: ButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-mono font-medium
    rounded-xl transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0B]
    disabled:opacity-50 disabled:cursor-not-allowed
    ${DESIGN_TOKENS.transitions.normal}
  `;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    primary: `
      bg-red-600 text-white hover:bg-red-700
      focus:ring-red-500 shadow-lg hover:shadow-red-600/20
      ${!disabled && 'hover:scale-105'}
    `,
    secondary: `
      bg-white/5 text-white/70 hover:text-white hover:bg-white/10
      border border-white/10 hover:border-white/20
    `,
    outline: `
      border border-white/20 text-white/70 hover:text-white hover:border-white/40
      bg-transparent
    `,
    ghost: `
      text-white/50 hover:text-white hover:bg-white/5
      bg-transparent
    `,
    danger: `
      bg-red-500/20 text-red-400 border border-red-500/30
      hover:bg-red-500/30 hover:border-red-500/40
    `,
  };

  const classes = cn(baseClasses, sizeClasses[size], variantClasses[variant], className);

  const content = (
    <>
      {loading && (
        <div className="w-4 h-4 border-2 border-current/20 rounded-full animate-spin border-t-current" />
      )}
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={classes}
        onClick={disabled ? undefined : onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={classes}
      onClick={disabled ? undefined : onClick}
      disabled={disabled || loading}
    >
      {content}
    </button>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({ children, className, variant = 'default', size = 'md', dot = false }: BadgeProps) {
  const baseClasses = `
    inline-flex items-center gap-1.5
    font-mono font-bold
    rounded-full border
  `;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantClasses = {
    default: 'bg-white/10 text-white/70 border-white/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25',
    error: 'bg-red-500/10 text-red-400 border-red-500/25',
    info: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
  };

  const dotColors = {
    default: 'bg-white/40',
    success: 'bg-emerald-400',
    warning: 'bg-yellow-400',
    error: 'bg-red-500',
    info: 'bg-purple-400',
  };

  return (
    <span className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}

interface SkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
}

export function Skeleton({ className = '', lines = 1, height = '1rem' }: SkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse rounded-lg bg-white/5',
            className,
            height === '1rem' ? 'h-4' : height
          )}
          style={{ 
            width: lines > 1 ? `${Math.random() * 40 + 60}%` : '100%',
            animationDelay: `${i * 100}ms`
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: ButtonProps['variant'];
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#111113] border border-white/5 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-mono font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm font-mono text-white/40 max-w-md mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant={action.variant || 'primary'}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// ─── Layout Components ──────────────────────────────────────────────────────────

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Container({ children, className, size = 'lg' }: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}>
      {children}
    </div>
  );
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Section({ children, className, spacing = 'lg' }: SectionProps) {
  const spacingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-20',
  };

  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {children}
    </section>
  );
}
