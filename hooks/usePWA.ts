import { useEffect, useState } from 'react';

interface PWAConfig {
  enableInstallPrompt?: boolean;
  enableOfflineSupport?: boolean;
  enableCaching?: boolean;
}

export function usePWA(config: PWAConfig = {}) {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is running in standalone mode (PWA)
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator && (window.navigator as any).standalone)
    );

    // Check if app is installable
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      setIsInstallable(false);
      
      // Show install prompt
      (window as any).install?.();
    };

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
    });

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  // Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Caching strategy
  useEffect(() => {
    if (config.enableCaching && 'caches' in window) {
      // Cache important assets for offline use
      caches.open('trusthire-cache').then(cache => {
        cache.addAll([
          '/',
          '/assess',
          '/dashboard',
          '/patterns',
          '/sandbox'
        ]);
      });
    }
  }, [config.enableCaching]);

  return {
    isInstallable,
    isOffline,
    isStandalone,
    installApp: () => {
      if (isInstallable) {
        (window as any).install?.();
      }
    },
  };
}
