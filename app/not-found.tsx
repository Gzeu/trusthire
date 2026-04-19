'use client';

import Link from 'next/link';
import { Shield, Home, Search, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button, Container } from '@/components/ui/DesignSystem';

export default function NotFound() {
  return (
    <Container>
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#111827] p-6 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon and Error Code */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-12 h-12 text-purple-400" />
            </div>
            <h1 className="text-8xl font-bold text-white mb-2">404</h1>
            <p className="text-xl text-white/60">Page Not Found</p>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Oops! This page doesn't exist
            </h2>
            <p className="text-lg text-white/70 mb-6">
              The page you're looking for might have been removed, had its name changed, 
              or is temporarily unavailable.
            </p>
            <p className="text-white/50">
              Error Code: 404 - Resource not found
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="primary" 
              href="/"
              className="px-8 py-4"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
            <Button 
              variant="outline" 
              href="/scan/github"
              className="px-8 py-4"
            >
              <Search className="w-5 h-5 mr-2" />
              Try Scanner
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="px-8 py-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="bg-[#1e293b] rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6">Looking for something?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link 
                href="/scan/github" 
                className="flex items-center p-4 bg-[#111827] rounded-lg hover:bg-[#2a2a2d] transition-colors group"
              >
                <Shield className="w-6 h-6 text-purple-400 mr-3 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="text-white font-medium">GitHub Scanner</p>
                  <p className="text-white/60 text-sm">Analyze repository security</p>
                </div>
              </Link>
              <Link 
                href="/scan/linkedin" 
                className="flex items-center p-4 bg-[#111827] rounded-lg hover:bg-[#2a2a2d] transition-colors group"
              >
                <Shield className="w-6 h-6 text-purple-400 mr-3 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="text-white font-medium">LinkedIn Scanner</p>
                  <p className="text-white/60 text-sm">Verify profile authenticity</p>
                </div>
              </Link>
              <Link 
                href="/scan/forms" 
                className="flex items-center p-4 bg-[#111827] rounded-lg hover:bg-[#2a2a2d] transition-colors group"
              >
                <Shield className="w-6 h-6 text-purple-400 mr-3 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="text-white font-medium">Forms Scanner</p>
                  <p className="text-white/60 text-sm">Check form security</p>
                </div>
              </Link>
              <Link 
                href="/scan/url" 
                className="flex items-center p-4 bg-[#111827] rounded-lg hover:bg-[#2a2a2d] transition-colors group"
              >
                <Shield className="w-6 h-6 text-purple-400 mr-3 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="text-white font-medium">URL Scanner</p>
                  <p className="text-white/60 text-sm">Analyze URL safety</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-sm text-white/40">
            <p>If you believe this is an error, please contact our support team.</p>
            <p className="mt-2">TrustHire Security Platform - Protecting Digital Assets</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
