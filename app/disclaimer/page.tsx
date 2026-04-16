'use client';

import { Shield, AlertTriangle, Info, CheckCircle, ExternalLink } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Disclaimer & Terms of Use
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Important information about TrustHire security assessment tool
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Important Notice */}
          <section className="bg-red-500/5 border border-red-500/20 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-red-400 mb-2">Important Notice</h2>
                <p className="text-gray-300 leading-relaxed">
                  TrustHire is a security assessment tool designed to help identify potential recruitment scams and 
                  malicious activities. This tool provides risk assessments based on available data patterns, 
                  but should not be considered as definitive proof of malicious intent.
                </p>
              </div>
            </div>
          </section>

          {/* What We Do */}
          <section className="bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-green-400 mb-3">What TrustHire Does</h2>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Analyzes recruitment patterns and identifies red flags</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Scans GitHub repositories for malicious code patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Checks domain reputation using VirusTotal API</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provides risk scores and security recommendations</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Limitations */}
          <section className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-yellow-400 mb-3">Limitations & Disclaimers</h2>
                <div className="space-y-3 text-gray-300">
                  <p>
                    <strong className="text-white">Not Legal Advice:</strong> TrustHire assessments are not legal advice 
                    and should not be used as the sole basis for legal decisions.
                  </p>
                  <p>
                    <strong className="text-white">False Positives:</strong> Our system may generate false positives. 
                    Always conduct additional due diligence.
                  </p>
                  <p>
                    <strong className="text-white">False Negatives:</strong> Some malicious activities may not be detected. 
                    Stay vigilant and use multiple security layers.
                  </p>
                  <p>
                    <strong className="text-white">Data Accuracy:</strong> We rely on third-party APIs (VirusTotal, GitHub) 
                    and their data accuracy affects our assessments.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* User Responsibility */}
          <section className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-400 mb-3">User Responsibility</h2>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Use TrustHire as one tool in your security assessment toolkit</span>
              </p>
              <p className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Conduct independent research and verification</span>
              </p>
              <p className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Consult with security professionals for high-risk situations</span>
              </p>
              <p className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Report suspicious activities to appropriate authorities</span>
              </p>
            </div>
          </section>

          {/* Privacy */}
          <section className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-purple-400 mb-3">Privacy & Data</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                <strong className="text-white">Data Collection:</strong> We only collect data necessary for security assessments 
                and do not share personal information with third parties.
              </p>
              <p>
                <strong className="text-white">Assessment Storage:</strong> Assessment results are stored securely and can be 
                deleted upon request.
              </p>
              <p>
                <strong className="text-white">Third-party Services:</strong> We use VirusTotal and GitHub APIs for data enrichment. 
                Their privacy policies apply to data processed through their services.
              </p>
            </div>
          </section>

          {/* No Warranty */}
          <section className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-400 mb-3">No Warranty</h2>
            <p className="text-gray-300 leading-relaxed">
              TrustHire is provided "as is" without any warranties, express or implied. We make no guarantees 
              about the accuracy, reliability, or completeness of our security assessments. Users assume full 
              responsibility for their use of this tool and any decisions made based on its output.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-400 mb-3">Contact & Support</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                For questions about this disclaimer, bug reports, or security concerns, please contact us 
                through our GitHub repository.
              </p>
              <div className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                <ExternalLink className="w-4 h-4" />
                <a href="https://github.com/Gzeu/trusthire" target="_blank" rel="noopener noreferrer">
                  GitHub Repository
                </a>
              </div>
            </div>
          </section>

          {/* Last Updated */}
          <div className="text-center text-gray-400 text-sm pt-8 border-t border-white/10">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <p className="mt-2">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
