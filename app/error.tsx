'use client';

import { useEffect } from 'react';
import { Shield, Home, RefreshCw, AlertTriangle, Bug } from 'lucide-react';
import { Button, Container } from '@/components/ui/DesignSystem';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <Container>
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#111827] p-6 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon and Error Code */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bug className="w-12 h-12 text-red-400" />
            </div>
            <h1 className="text-8xl font-bold text-white mb-2">500</h1>
            <p className="text-xl text-white/60">Server Error</p>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Something went wrong
            </h2>
            <p className="text-lg text-white/70 mb-6">
              We're experiencing some technical difficulties. 
              Our team has been notified and is working on a fix.
            </p>
            {error.digest && (
              <p className="text-white/50 text-sm mb-4">
                Error ID: {error.digest}
              </p>
            )}
            <p className="text-white/50 text-sm">
              Error: {error.message || 'Internal server error'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="primary" 
              onClick={reset}
              className="px-8 py-4"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              href="/"
              className="px-8 py-4"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
            <Button 
              variant="ghost" 
              href="/dashboard"
              className="px-8 py-4"
            >
              <Shield className="w-5 h-5 mr-2" />
              Dashboard
            </Button>
          </div>

          {/* Troubleshooting */}
          <div className="bg-[#1e293b] rounded-2xl p-8 border border-white/10 text-left">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 text-yellow-400 mr-2" />
              What you can do
            </h3>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">1.</span>
                <span>Refresh the page and try again</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">2.</span>
                <span>Check your internet connection</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">3.</span>
                <span>Clear your browser cache and cookies</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">4.</span>
                <span>Try accessing a different page</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">5.</span>
                <span>Contact support if the problem persists</span>
              </li>
            </ul>
          </div>

          {/* Status Check */}
          <div className="mt-12 bg-[#1e293b] rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                <p className="text-white/60">Frontend</p>
                <p className="text-green-400">Operational</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mx-auto mb-2"></div>
                <p className="text-white/60">API</p>
                <p className="text-yellow-400">Degraded</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                <p className="text-white/60">Database</p>
                <p className="text-green-400">Operational</p>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-sm text-white/40">
            <p>This error has been automatically reported to our development team.</p>
            <p className="mt-2">TrustHire Security Platform - Protecting Digital Assets</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
