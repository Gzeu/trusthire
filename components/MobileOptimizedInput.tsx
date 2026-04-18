'use client';

import React from 'react';
import { useTouchOptimized } from '@/hooks/useTouchOptimized';

interface MobileOptimizedInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  error?: string;
  minTouchTarget?: number;
}

function MobileOptimizedInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error,
  minTouchTarget = 44,
}: MobileOptimizedInputProps) {
  const { getTouchOptimizedProps, triggerHaptic } = useTouchOptimized({
    minTouchTarget,
    enableSwipeGestures: false,
    enableHapticFeedback: true,
  });

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/70 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
          className={`
            w-full
            px-4 py-3 
            bg-white/5 border border-white/10 rounded-md 
            text-white placeholder-white/30 
            focus:outline-none focus:ring-2 focus:ring-red-500/50 
            focus:bg-white/10
            text-base
            md:text-lg
            transition-colors
            ${error ? 'border-red-500/50 bg-red-500/10' : ''}
          `}
          {...getTouchOptimizedProps() as any}
        />
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="text-red-400 text-sm">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileOptimizedInput;
