'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Database, ArrowLeft, Home, BarChart3 } from 'lucide-react';

export default function AgentPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main page after 3 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icon and Message */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Database className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Moved</h1>
          <p className="text-xl text-gray-600 mb-6">
            The agent functionality has been moved to the main TrustHire Data System.
          </p>
          <p className="text-lg text-gray-500 mb-8">
            You will be redirected automatically in 3 seconds...
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <BarChart3 className="w-5 h-5" />
            Dashboard
          </button>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Information Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">TrustHire Data System</h2>
          <div className="text-left space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="text-gray-900 font-medium">Real Data Collection</p>
                <p className="text-gray-600 text-sm mt-1">Collect and process real recruitment, company, and candidate data</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="text-gray-900 font-medium">Data Validation</p>
                <p className="text-gray-600 text-sm mt-1">Validate and clean data with quality scoring</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <div>
                <p className="text-gray-900 font-medium">Analytics & Export</p>
                <p className="text-gray-600 text-sm mt-1">Generate insights and export data in multiple formats</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
              <div>
                <p className="text-gray-900 font-medium">Enterprise Security</p>
                <p className="text-gray-600 text-sm mt-1">API authentication, rate limiting, and monitoring</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available API Endpoints:</h3>
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

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">
              For complete API documentation, see:
            </p>
            <a 
              href="/API_USAGE.md" 
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              target="_blank"
            >
              API_USAGE.md
            </a>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-sm text-gray-500">
          <p className="mb-2">TrustHire has been simplified to focus on real data processing.</p>
          <p className="font-medium">TrustHire Data System - Real Data Collection & Processing</p>
        </div>
      </div>
    </div>
  );
}
