// Enhanced Touch Event Types for Mobile Optimization
// These types extend native React touch events for better mobile support

interface EnhancedTouch extends Touch {
  readonly timestamp: number;
  readonly velocityX?: number;
  readonly velocityY?: number;
}

interface EnhancedTouchEvent extends React.TouchEvent {
  readonly velocityX?: number;
  readonly velocityY?: number;
  readonly duration?: number;
  readonly distance?: number;
}

interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  velocity: number;
  distance: number;
  duration: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface TouchTarget {
  readonly minTouchTarget: number;
  readonly enableHapticFeedback: boolean;
  readonly enableSwipeGestures: boolean;
}

interface FocusConfig {
  readonly enableAutoFocus: boolean;
  readonly trapFocusWithin?: string;
  readonly restoreFocusOnNavigation: boolean;
}

interface PWAConfig {
  readonly enableInstallPrompt: boolean;
  readonly enableOfflineSupport: boolean;
  readonly enableCaching: boolean;
}

export type {
  EnhancedTouch,
  EnhancedTouchEvent,
  SwipeGesture,
  TouchTarget,
  FocusConfig,
  PWAConfig
};
