'use client';

import { Shield, Lock, Eye, Database, User, CheckCircle, AlertCircle } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            How we collect, use, and protect your information
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Last updated: April 2026
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Introduction */}
          <section className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-blue-400" />
              Our Commitment to Privacy
            </h2>
            <p className="text-gray-300 leading-relaxed">
              TrustHire takes your privacy seriously. This policy explains how we collect, use, 
              and protect your information when you use our security assessment platform. We are 
              committed to transparency and giving you control over your data.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-green-400" />
              Information We Collect
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Assessment Data</h3>
                <p className="text-gray-300">
                  When you create security assessments, we collect:
                </p>
                <ul className="mt-2 space-y-1 text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Recruiter information (name, company, contact details)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Repository URLs and analysis results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Domain names and security analysis data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Assessment scores and risk evaluations</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-2">Technical Data</h3>
                <p className="text-gray-300">
                  We automatically collect:
                </p>
                <ul className="mt-2 space-y-1 text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>IP address and general location</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Browser type and version</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Usage patterns and analytics</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-purple-400" />
              How We Use Your Information
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-white">Security Analysis</h4>
                  <p className="text-gray-300 text-sm">To provide risk assessments and detect potential threats</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-white">Service Improvement</h4>
                  <p className="text-gray-300 text-sm">To enhance our security algorithms and user experience</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-white">Research & Development</h4>
                  <p className="text-gray-300 text-sm">To improve scam detection capabilities (anonymized data only)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-white">Legal Compliance</h4>
                  <p className="text-gray-300 text-sm">To comply with legal obligations and protect our platform</p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Protection */}
          <section className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-yellow-400" />
              Data Protection & Security
            </h2>
            
            <div className="space-y-4">
              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                <h3 className="font-medium text-green-400 mb-2">Encryption & Storage</h3>
                <p className="text-gray-300 text-sm">
                  All data is encrypted in transit and at rest using industry-standard encryption protocols.
                </p>
              </div>
              
              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                <h3 className="font-medium text-green-400 mb-2">Access Control</h3>
                <p className="text-gray-300 text-sm">
                  Strict access controls and authentication mechanisms protect your information.
                </p>
              </div>
              
              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                <h3 className="font-medium text-green-400 mb-2">Regular Audits</h3>
                <p className="text-gray-300 text-sm">
                  We conduct regular security audits to maintain and improve our protection measures.
                </p>
              </div>
            </div>
          </section>

          {/* Third-Party Services */}
          <section className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-orange-400" />
              Third-Party Services
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">VirusTotal API</h3>
                <p className="text-gray-300 mb-2">
                  We use VirusTotal for domain reputation analysis:
                </p>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>Only domain names are shared (no personal data)</li>
                  <li>VirusTotal has its own privacy policy</li>
                  <li>No API keys or credentials are exposed</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">GitHub API</h3>
                <p className="text-gray-300 mb-2">
                  We use GitHub for repository analysis:
                </p>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>Only public repository information is accessed</li>
                  <li>No private repositories are accessed</li>
                  <li>Analysis is performed in isolated environments</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Vercel Infrastructure</h3>
                <p className="text-gray-300 mb-2">
                  Our platform runs on Vercel:
                </p>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>Secure cloud infrastructure</li>
                  <li>Compliant with security standards</li>
                  <li>Regular security updates and monitoring</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-400" />
              Your Rights & Choices
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-white">Access & Correction</h3>
                  <p className="text-gray-300 text-sm">
                    You can request access to or correction of your personal data.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-white">Data Deletion</h3>
                  <p className="text-gray-300 text-sm">
                    You can request deletion of your assessment data and personal information.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-white">Data Portability</h3>
                  <p className="text-gray-300 text-sm">
                    You can export your assessment data in a machine-readable format.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-white">Opt-out</h3>
                  <p className="text-gray-300 text-sm">
                    You can opt-out of data collection for analytics and research purposes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              Data Retention
            </h2>
            
            <div className="space-y-3 text-gray-300">
              <p>
                We retain assessment data for the following periods:
              </p>
              <ul className="space-y-1 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Active Assessments:</strong> 30 days after creation</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Analytics Data:</strong> 12 months (anonymized)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Account Information:</strong> Until account deletion</span>
                </li>
              </ul>
              <p className="text-sm mt-3">
                Data is automatically deleted after these periods unless legally required to retain longer.
              </p>
            </div>
          </section>

          {/* International Transfers */}
          <section className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
            <p className="text-gray-300 leading-relaxed">
              Your data may be transferred to and processed in countries outside your country of residence. 
              We ensure appropriate safeguards are in place for international data transfers, including 
              standard contractual clauses and adherence to GDPR requirements.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              TrustHire is not intended for children under 18 years of age. We do not knowingly collect 
              personal information from children. If we become aware that we have collected information 
              from a child, we will take steps to delete such information immediately.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes 
              by posting the new policy on this page and updating the "Last updated" date. 
              Significant changes will be highlighted through our platform notifications.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Contact Us</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                If you have questions about this Privacy Policy or want to exercise your rights, 
                please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> privacy@trusthire.app</p>
                <p><strong>GitHub:</strong> https://github.com/Gzeu/trusthire</p>
                <p><strong>Response Time:</strong> We respond to privacy requests within 30 days</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center text-gray-400 text-sm pt-8 border-t border-white/10">
            <p>This Privacy Policy is effective as of April 2026 and governs your use of TrustHire.</p>
            <p className="mt-2">By using TrustHire, you acknowledge that you have read and understood this policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
