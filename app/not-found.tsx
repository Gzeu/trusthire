'use client';

import Link from 'next/link';
import { Database, Home, BarChart3, FileText, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        {/* Icon and Error Code */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Database className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-9xl font-bold text-gray-900 mb-2">404</h1>
          <p className="text-2xl text-gray-600">Page Not Found</p>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Oops! This page doesn't exist
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            The page you're looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
          <p className="text-gray-500">
            Error Code: 404 - Resource not found
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link 
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <BarChart3 className="w-5 h-5" />
            Dashboard
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Helpful Links - Real Data System */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Looking for TrustHire Data System?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              href="/dashboard" 
              className="flex flex-col items-center p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
            >
              <BarChart3 className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <p className="text-gray-900 font-medium">Data Dashboard</p>
                <p className="text-gray-600 text-sm mt-1">View analytics and metrics</p>
              </div>
            </Link>
            <Link 
              href="/test-api.html" 
              className="flex flex-col items-center p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
            >
              <Database className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <p className="text-gray-900 font-medium">API Test</p>
                <p className="text-gray-600 text-sm mt-1">Test data collection</p>
              </div>
            </Link>
            <Link 
              href="/" 
              className="flex flex-col items-center p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
            >
              <Home className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <p className="text-gray-900 font-medium">Home</p>
                <p className="text-gray-600 text-sm mt-1">Main page</p>
              </div>
            </Link>
            <Link 
              href="/scan/github" 
              className="flex flex-col items-center p-6 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors group"
            >
              <FileText className="w-8 h-8 text-orange-600 mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <p className="text-gray-900 font-medium">Scanner</p>
                <p className="text-gray-600 text-sm mt-1">Repository analysis</p>
              </div>
            </Link>
          </div>
        </div>

        {/* API Endpoints Info */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Available API Endpoints:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-mono rounded">POST</span>
              <code className="text-sm text-gray-700">/api/data/collect</code>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-mono rounded">POST</span>
              <code className="text-sm text-gray-700">/api/data/validate</code>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-mono rounded">POST</span>
              <code className="text-sm text-gray-700">/api/data/analytics</code>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-mono rounded">POST</span>
              <code className="text-sm text-gray-700">/api/data/export</code>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-sm text-gray-500">
          <p className="mb-2">If you believe this is an error, please check our available endpoints above.</p>
          <p className="font-medium">TrustHire Data System - Real Data Collection & Processing</p>
        </div>
      </div>
    </div>
  );
}
