import { useEffect, useRef, useCallback, useState } from 'react';

interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  velocity: number;
  distance: number;
}

interface SwipeConfig {
  threshold: number;
  restraint: number;
  timeThreshold: number;
}

const DEFAULT_SWIPE_CONFIG: SwipeConfig = {
  threshold: 50,
  restraint: 100,
  timeThreshold: 300,
};

export function useSwipeGestures(config: Partial<SwipeConfig> = {}) {
  const swipeConfig = { ...DEFAULT_SWIPE_CONFIG, ...config };
  const [swipeGesture, setSwipeGesture] = useState<SwipeGesture | null>(null);
  
  const startTouch = useRef<{ x: number; y: number; time: number } | null>(null);
  const isTracking = useRef(false);

  const handleTouchStart = useCallback((e: any) => {
    const touch = e.touches[0];
    if (touch && touch.touches.length === 1) {
      startTouch.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      isTracking.current = true;
    }
  }, []);

  const handleTouchMove = useCallback((e: any) => {
    if (!isTracking.current || !startTouch.current) return;
    
    const touch = e.touches[0];
    if (touch) {
      const deltaX = touch.clientX - startTouch.current.x;
      const deltaY = touch.clientY - startTouch.current.y;
      const deltaTime = Date.now() - startTouch.current.time;

      // Provide real-time feedback during swipe
      if (Math.abs(deltaX) > swipeConfig.threshold / 2 || Math.abs(deltaY) > swipeConfig.threshold / 2) {
        const progress = Math.min(Math.abs(deltaX), Math.abs(deltaY)) / swipeConfig.threshold;
        window.dispatchEvent(new CustomEvent('swipe-progress', {
          detail: { progress, direction: Math.abs(deltaX) > Math.abs(deltaY) ? (deltaX > 0 ? 'horizontal' : 'vertical') : 'none' }
        }));
      }
    }
  }, [swipeConfig.threshold]);

  const handleTouchEnd = useCallback((e: any) => {
    if (!isTracking.current || !startTouch.current) {
      return;
    }

    const touch = e.changedTouches[0];
    if (touch) {
      const deltaX = touch.clientX - startTouch.current.x;
      const deltaY = touch.clientY - startTouch.current.y;
      const deltaTime = Date.now() - startTouch.current.time;

      // Determine if this is a valid swipe
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
      const isVerticalSwipe = Math.abs(deltaY) > Math.abs(deltaX);

      if (deltaTime <= swipeConfig.timeThreshold) {
        if (isHorizontalSwipe && Math.abs(deltaX) >= swipeConfig.threshold) {
          const direction = deltaX > 0 ? 'right' : 'left';
          const velocity = Math.abs(deltaX) / deltaTime;
          const distance = Math.abs(deltaX);
          
          setSwipeGesture({ direction, velocity, distance });
          
          // Fire custom events for different components
          if (direction === 'left') {
            window.dispatchEvent(new CustomEvent('swipe-left', { detail: { velocity, distance } }));
          } else if (direction === 'right') {
            window.dispatchEvent(new CustomEvent('swipe-right', { detail: { velocity, distance } }));
          }
        } else if (isVerticalSwipe && Math.abs(deltaY) >= swipeConfig.threshold) {
          const direction = deltaY > 0 ? 'down' : 'up';
          const velocity = Math.abs(deltaY) / deltaTime;
          const distance = Math.abs(deltaY);
          
          setSwipeGesture({ direction, velocity, distance });
          
          if (direction === 'up') {
            window.dispatchEvent(new CustomEvent('swipe-up', { detail: { velocity, distance } }));
          } else if (direction === 'down') {
            window.dispatchEvent(new CustomEvent('swipe-down', { detail: { velocity, distance } }));
          }
        }
      }
    }

    // Reset tracking
    startTouch.current = null;
    isTracking.current = false;
    
    // Clear: swipe gesture after a short delay
    setTimeout(() => setSwipeGesture(null), 100);
  }, [swipeConfig.threshold, swipeConfig.timeThreshold]);

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      startTouch.current = null;
      isTracking.current = false;
    };
  }, []);

  return {
    swipeGesture,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
