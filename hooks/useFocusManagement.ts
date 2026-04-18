import { useEffect, useRef, useState, useCallback } from 'react';

interface FocusConfig {
  restoreFocusOnNavigation?: boolean;
  trapFocusWithin?: string;
  enableAutoFocus?: boolean;
}

export function useFocusManagement(config: FocusConfig = {}) {
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
  const focusHistory = useRef<HTMLElement[]>([]);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap management
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!config.trapFocusWithin) return;

    const focusableElements = document.querySelectorAll(
      config.trapFocusWithin
    ) as NodeListOf<HTMLElement>;

    const currentIndex = Array.from(focusableElements).indexOf(activeElement || document.activeElement as HTMLElement);
    
    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          // Shift + Tab: go backwards
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
          const prevElement = focusableElements[prevIndex];
          if (prevElement) {
            prevElement.focus();
            setActiveElement(prevElement);
          }
        } else {
          // Tab: go forwards
          const nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
          const nextElement = focusableElements[nextIndex];
          if (nextElement) {
            nextElement.focus();
            setActiveElement(nextElement);
          }
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        // Escape: return to previous element
        if (previousFocusRef.current && previousFocusRef.current !== document.activeElement) {
          previousFocusRef.current.focus();
          setActiveElement(previousFocusRef.current);
        }
        break;
      
      case 'Enter':
        // Enter: trigger click on active element
        if (activeElement && activeElement instanceof HTMLElement) {
          activeElement.click();
        }
        break;
    }
  }, [activeElement, config.trapFocusWithin, previousFocusRef]);

  // Auto-focus management
  const setFocusToElement = useCallback((element: HTMLElement | null) => {
    if (!element || !config.enableAutoFocus) return;
    
    // Store current focus before changing
    if (document.activeElement) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
    
    // Add to focus history
    if (element && !focusHistory.current.includes(element)) {
      focusHistory.current.push(element);
      // Keep only last 10 elements in history
      if (focusHistory.current.length > 10) {
        focusHistory.current = focusHistory.current.slice(-10);
      }
    }
    
    element.focus();
    setActiveElement(element);
  }, [config.enableAutoFocus]);

  // Restore focus on navigation
  useEffect(() => {
    if (!config.restoreFocusOnNavigation) return;

    const handleNavigation = () => {
      if (activeElement && !document.contains(activeElement)) {
        // Element is no longer in DOM, restore focus to first available element in history
        const previousAvailableElement = focusHistory.current.reverse().find(el => document.contains(el));
        if (previousAvailableElement) {
          setFocusToElement(previousAvailableElement);
        }
      }
    };

    // Listen for navigation changes
    const observer = new MutationObserver(handleNavigation);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [activeElement, config.restoreFocusOnNavigation]);

  // Focus trap initialization
  useEffect(() => {
    if (!config.trapFocusWithin) return;

    const container = document.querySelector(config.trapFocusWithin) as HTMLElement;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    
    // Set initial focus to first focusable element
    const firstFocusable = container.querySelector('button, input, select, textarea, a[href]') as HTMLElement;
    if (firstFocusable) {
      setFocusToElement(firstFocusable);
    }

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, setFocusToElement, config.trapFocusWithin]);

  return {
    activeElement,
    setActiveElement,
    setFocusToElement,
    focusHistory: focusHistory.current,
  };
}
