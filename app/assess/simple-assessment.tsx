'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Upload, Plus, Trash2, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import type { RecruiterInput, JobInput, ArtifactInput } from '@/types';
import { useTouchOptimized } from '@/hooks/useTouchOptimized';
import { useFocusManagement } from '@/hooks/useFocusManagement';

export default function SimpleAssessmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Initialize mobile optimization hooks
  const { getTouchOptimizedProps, triggerHaptic } = useTouchOptimized({
    minTouchTarget: 44,
    enableSwipeGestures: true,
    enableHapticFeedback: true,
  });
  
  const { setFocusToElement, activeElement } = useFocusManagement({
    enableAutoFocus: true,
    trapFocusWithin: '.assessment-form',
  });

  const [formData, setFormData] = useState({
    recruiter: {
      name: '',
      claimedCompany: '',
      jobTitle: '',
      emailReceived: '',
      linkedinUrl: '',
      sampleMessage: '',
      recruiterMessages: ''
    } as RecruiterInput,
    job: {
      jobDescription: '',
      salaryMentioned: false,
      urgencySignals: false,
      walletSeedKycRequest: false,
      runCodeLocally: false
    } as JobInput,
    artifacts: [] as ArtifactInput[]
  });

  const addArtifact = () => {
    setFormData(prev => ({
      ...prev,
      artifacts: [...prev.artifacts, { type: 'github', url: '' }]
    }));
  };

  const removeArtifact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      artifacts: prev.artifacts.filter((_, i) => i !== index)
    }));
  };

  const updateArtifact = (index: number, field: keyof ArtifactInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      artifacts: prev.artifacts.map((artifact, i) =>
        i === index ? { ...artifact, [field]: value } : artifact
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/assessment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create assessment');
      }
      const data = await response.json();
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`assessment_${data.id}`, JSON.stringify(data));
      }
      router.push(`/results/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const quickFill = () => {
    setFormData({
      recruiter: {
        name: 'John Smith',
        claimedCompany: 'Tech Corp Inc',
        jobTitle: 'Senior Developer',
        emailReceived: 'john.smith@techcorp.com',
        linkedinUrl: 'https://linkedin.com/in/johnsmith',
        sampleMessage: 'We are looking for talented developers to join our innovative team. This is an urgent opportunity with competitive compensation.',
        recruiterMessages: 'Initial contact with job offer details'
      },
      job: {
        jobDescription: 'We are seeking a Senior Developer with 5+ years of experience in React, Node.js, and cloud technologies.',
        salaryMentioned: true,
        urgencySignals: true,
        walletSeedKycRequest: false,
        runCodeLocally: false
      },
      artifacts: [{ type: 'github', url: 'https://github.com/example/test-repo' }]
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs font-mono">AI-Powered Risk Assessment</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold font-mono leading-tight mb-6">
            Complete Security Analysis
          </h1>
          <p className="text-white/50 text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Evaluate recruiter identity, repository safety, and job legitimacy in one unified workflow.
          </p>
          <div className="flex items-center justify-center gap-4">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-500/20 border border-green-500/40 text-green-400">
              <CheckCircle className="h-3 w-3 mr-1" />
              Groq AI Active
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500/20 border border-blue-500/40 text-blue-400">
              <Shield className="h-3 w-3 mr-1" />
              VirusTotal Scanning
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-400 mr-2" />
              <span className="text-red-400">{error}</span>
            </div>
          </div>
        )}

        <div className="bg-[#111113] border border-white/5 rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold font-mono text-white">Risk Assessment Form</h2>
            <button
              type="button"
              onClick={quickFill}
              className="px-3 py-1.5 text-sm border border-white/10 rounded-md hover:bg-white/5 text-white/70 hover:text-white transition-colors font-mono"
            >
              Quick Fill Sample
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Recruiter Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Recruiter Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="recruiter-name" className="block text-sm font-medium text-white/70 mb-1">Recruiter Name *</label>
                  <input
                    id="recruiter-name"
                    type="text"
                    placeholder="Recruiter name"
                    value={formData.recruiter.name}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, recruiter: { ...prev.recruiter, name: e.target.value } }));
                      triggerHaptic(); // Haptic feedback on input
                    }}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder-white/30 min-h-[44px]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="recruiter-company" className="block text-sm font-medium text-white/70 mb-1">Company *</label>
                  <input
                    id="recruiter-company"
                    type="text"
                    placeholder="Company name"
                    value={formData.recruiter.claimedCompany}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, recruiter: { ...prev.recruiter, claimedCompany: e.target.value } }));
                      triggerHaptic(); // Haptic feedback on input
                    }}
                    {...getTouchOptimizedProps()}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder-white/30"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="recruiter-title" className="block text-sm font-medium text-white/70 mb-1">Job Title</label>
                  <input id="recruiter-title" type="text" value={formData.recruiter.jobTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, recruiter: { ...prev.recruiter, jobTitle: e.target.value } as RecruiterInput }))}
                    placeholder="Senior Developer"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-white/30" />
                </div>
                <div>
                  <label htmlFor="recruiter-email" className="block text-sm font-medium text-white/70 mb-1">Email</label>
                  <input id="recruiter-email" type="email" value={formData.recruiter.emailReceived}
                    onChange={(e) => setFormData(prev => ({ ...prev, recruiter: { ...prev.recruiter, emailReceived: e.target.value } as RecruiterInput }))}
                    onChange={(e) => setFormData(prev => ({ ...prev, recruiter: { ...prev.recruiter, emailReceived: e.target.value } }))}
                    placeholder="john.smith@company.com"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-white/30" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="recruiter-linkedin" className="block text-sm font-medium text-white/70 mb-1">LinkedIn Profile</label>
                  <input id="recruiter-linkedin" type="url" value={formData.recruiter.linkedinUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, recruiter: { ...prev.recruiter, linkedinUrl: e.target.value } }))}
                    placeholder="https://linkedin.com/in/johnsmith"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-white/30" />
                </div>
              </div>
              <div>
                <label htmlFor="recruiter-message" className="block text-sm font-medium text-white/70 mb-1">Sample Message</label>
                <textarea id="recruiter-message" value={formData.recruiter.sampleMessage}
                  onChange={(e) => setFormData(prev => ({ ...prev, recruiter: { ...prev.recruiter, sampleMessage: e.target.value } }))}
                  placeholder="Paste the message you received from the recruiter..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-white/30" />
              </div>
            </div>

            {/* Job Context */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                Job Context
              </h3>
              <div>
                <label htmlFor="job-description" className="block text-sm font-medium text-white/70 mb-1">Job Description *</label>
                <textarea id="job-description" value={formData.job.jobDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, job: { ...prev.job, jobDescription: e.target.value } }))}
                  placeholder="Describe the job role and responsibilities..."
                  rows={4}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-white/30"
                  required />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/70">Warning Signs (Check if applicable)</label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { key: 'salaryMentioned', label: 'Salary mentioned' },
                    { key: 'urgencySignals', label: 'Urgent hiring / Immediate start required' },
                    { key: 'walletSeedKycRequest', label: 'Requests wallet/seed phrase' },
                    { key: 'runCodeLocally', label: 'Requests code execution' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center space-x-2">
                      <input type="checkbox"
                        checked={formData.job[key as keyof JobInput] as boolean}
                        onChange={(e) => setFormData(prev => ({ ...prev, job: { ...prev.job, [key]: e.target.checked } }))}
                        className="rounded bg-white/10 border-white/20 text-red-500 focus:ring-2 focus:ring-red-500" />
                      <span className="text-sm text-white/70">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Technical Artifacts */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  Technical Artifacts
                </h3>
                <button type="button" onClick={addArtifact}
                  className="px-3 py-1.5 text-sm border border-white/10 rounded-md hover:bg-white/5 text-white/70 hover:text-white transition-colors font-mono flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Add Artifact
                </button>
              </div>
              {formData.artifacts.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-lg">
                  <Upload className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40">No artifacts added</p>
                  <p className="text-sm text-white/20">Add GitHub repositories, code files, or other technical resources</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.artifacts.map((artifact, index) => (
                    <div key={index} className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-white/70 mb-1">Type</label>
                        <select value={artifact.type}
                          onChange={(e) => updateArtifact(index, 'type', e.target.value as ArtifactInput['type'])}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white">
                          <option value="github">GitHub Repository</option>
                          <option value="gitlab">GitLab Repository</option>
                          <option value="url">Website/URL</option>
                          <option value="zip">ZIP File</option>
                          <option value="drive">Google Drive</option>
                          <option value="notion">Notion Page</option>
                          <option value="shortlink">Shortlink</option>
                          <option value="forms">Google Forms</option>
                        </select>
                      </div>
                      <div className="flex-2">
                        <label className="block text-sm font-medium text-white/70 mb-1">URL/Path *</label>
                        <input type="text" value={artifact.url}
                          onChange={(e) => updateArtifact(index, 'url', e.target.value)}
                          placeholder="https://github.com/user/repo"
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-white/30"
                          required />
                      </div>
                      <button type="button" onClick={() => removeArtifact(index)}
                        className="p-2 text-red-400 hover:text-red-300 border border-red-500/30 rounded-md hover:bg-red-500/10 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-center pt-6">
              <button type="submit" disabled={loading}
                className="px-8 py-3 text-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-mono transition-colors rounded-lg">
                {loading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing with AI...</>
                ) : (
                  <><Shield className="h-5 w-5" /> Start Assessment</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#111113] border border-white/5 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="font-semibold mb-2 text-white font-mono">AI-Powered Analysis</h3>
            <p className="text-sm text-white/40 leading-relaxed">Groq AI analyzes patterns and provides risk assessment</p>
          </div>
          <div className="bg-[#111113] border border-white/5 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="font-semibold mb-2 text-white font-mono">Multi-Layer Security</h3>
            <p className="text-sm text-white/40 leading-relaxed">VirusTotal scanning and code analysis</p>
          </div>
          <div className="bg-[#111113] border border-white/5 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="font-semibold mb-2 text-white font-mono">Instant Results</h3>
            <p className="text-sm text-white/40 leading-relaxed">Get comprehensive risk assessment in seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
}
