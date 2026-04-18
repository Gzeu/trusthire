import { useEffect, useRef, useCallback } from 'react';

interface TouchConfig {
  minTouchTarget: number;
  enableSwipeGestures: boolean;
  enableHapticFeedback: boolean;
}

const DEFAULT_TOUCH_CONFIG: TouchConfig = {
  minTouchTarget: 44,
  enableSwipeGestures: true,
  enableHapticFeedback: true,
};

export function useTouchOptimized(config: Partial<TouchConfig> = {}) {
  const touchConfig = { ...DEFAULT_TOUCH_CONFIG, ...config };
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Haptic feedback for touch interactions
  const triggerHaptic = useCallback(() => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator && touchConfig.enableHapticFeedback) {
      navigator.vibrate(50); // Short vibration for touch feedback
    }
  }, [touchConfig.enableHapticFeedback]);

  // Touch event handlers with proper target sizing
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      triggerHaptic();
    }
  }, [triggerHaptic]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    if (touch && touchStartRef.current) {
      touchEndRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      // Detect swipe gestures
      if (touchConfig.enableSwipeGestures) {
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;
        const deltaTime = Date.now() - touchStartRef.current.time;

        // Horizontal swipe detection
        if (Math.abs(deltaX) > 50 && deltaTime < 300 && Math.abs(deltaY) < 50) {
          const swipeDirection = deltaX > 0 ? 'right' : 'left';
          window.dispatchEvent(new CustomEvent('swipe', { 
            detail: { direction: swipeDirection, velocity: Math.abs(deltaX) / deltaTime } 
          }));
        }

        // Vertical swipe detection
        if (Math.abs(deltaY) > 50 && deltaTime < 300 && Math.abs(deltaX) < 50) {
          const swipeDirection = deltaY > 0 ? 'down' : 'up';
          window.dispatchEvent(new CustomEvent('swipe', { 
            detail: { direction: swipeDirection, velocity: Math.abs(deltaY) / deltaTime } 
          }));
        }
      }
    }

    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [touchConfig.enableSwipeGestures, triggerHaptic]);

  // Apply touch-optimized styles to elements
  const getTouchOptimizedProps = useCallback((minSize: number = touchConfig.minTouchTarget) => ({
    style: {
      minHeight: `${minSize}px`,
      minWidth: `${minSize}px`,
      WebkitTapHighlightColor: 'transparent',
      WebkitTouchCallout: 'none',
      WebkitUserSelect: 'none',
      userSelect: 'none',
      touchAction: 'manipulation',
    },
    role: 'button',
    tabIndex: 0,
  }), [touchConfig.minTouchTarget]);

  return {
    handleTouchStart,
    handleTouchEnd,
    getTouchOptimizedProps,
    triggerHaptic,
    touchConfig,
  };
}
