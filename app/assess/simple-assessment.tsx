'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Upload, Plus, Trash2, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import type { RecruiterInput, JobInput, ArtifactInput } from '@/types';

export default function SimpleAssessmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

  // Single state object for all data
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

  // Add new artifact
  const addArtifact = () => {
    setFormData(prev => ({
      ...prev,
      artifacts: [...prev.artifacts, {
        type: 'github',
        url: ''
      }]
    }));
  };

  // Remove artifact
  const removeArtifact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      artifacts: prev.artifacts.filter((_, i) => i !== index)
    }));
  };

  // Update artifact
  const updateArtifact = (index: number, field: keyof ArtifactInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      artifacts: prev.artifacts.map((artifact, i) => 
        i === index ? { ...artifact, [field]: value } : artifact
      )
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/assessment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create assessment');
      }

      const data = await response.json();
      setAssessmentId(data.id);
      
      // Redirect to results
      router.push(`/results/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill with sample data for testing
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
        jobDescription: 'We are seeking a Senior Developer with 5+ years of experience in React, Node.js, and cloud technologies. You will work on cutting-edge projects and have the opportunity for rapid career growth.',
        salaryMentioned: true,
        urgencySignals: true,
        walletSeedKycRequest: false,
        runCodeLocally: false
      },
      artifacts: [
        {
          type: 'github',
          url: 'https://github.com/example/test-repo'
        }
      ]
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">TrustHire Assessment</h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Complete recruitment scam detection in one simple step. AI-powered analysis with Groq integration.
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Groq AI Enabled
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Shield className="h-3 w-3 mr-1" />
              VirusTotal Scanning
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recruitment Risk Assessment</h2>
              <button 
                type="button" 
                onClick={quickFill}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Quick Fill Sample Data
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Recruiter Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Recruiter Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="recruiter-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Recruiter Name *
                    </label>
                    <input
                      id="recruiter-name"
                      type="text"
                      value={formData.recruiter.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                        ...prev,
                        recruiter: { ...prev.recruiter, name: e.target.value }
                      }))}
                      placeholder="John Smith"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="recruiter-company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company *
                    </label>
                    <input
                      id="recruiter-company"
                      type="text"
                      value={formData.recruiter.claimedCompany}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                        ...prev,
                        recruiter: { ...prev.recruiter, claimedCompany: e.target.value }
                      }))}
                      placeholder="Tech Corp Inc"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="recruiter-title" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title
                    </label>
                    <input
                      id="recruiter-title"
                      type="text"
                      value={formData.recruiter.jobTitle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                        ...prev,
                        recruiter: { ...prev.recruiter, jobTitle: e.target.value }
                      }))}
                      placeholder="Senior Developer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="recruiter-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="recruiter-email"
                      type="email"
                      value={formData.recruiter.emailReceived}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                        ...prev,
                        recruiter: { ...prev.recruiter, emailReceived: e.target.value }
                      }))}
                      placeholder="john.smith@company.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="recruiter-linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn Profile
                    </label>
                    <input
                      id="recruiter-linkedin"
                      type="url"
                      value={formData.recruiter.linkedinUrl}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                        ...prev,
                        recruiter: { ...prev.recruiter, linkedinUrl: e.target.value }
                      }))}
                      placeholder="https://linkedin.com/in/johnsmith"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="recruiter-message" className="block text-sm font-medium text-gray-700 mb-1">
                    Sample Message
                  </label>
                  <textarea
                    id="recruiter-message"
                    value={formData.recruiter.sampleMessage}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({
                      ...prev,
                      recruiter: { ...prev.recruiter, sampleMessage: e.target.value }
                    }))}
                    placeholder="Paste the message you received from the recruiter..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Job Context */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  Job Context
                </h3>
                
                <div>
                  <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description *
                  </label>
                  <textarea
                    id="job-description"
                    value={formData.job.jobDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({
                      ...prev,
                      job: { ...prev.job, jobDescription: e.target.value }
                    }))}
                    placeholder="Describe the job role and responsibilities..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Warning Signs */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Warning Signs (Check if applicable)</label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.job.salaryMentioned}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                          ...prev,
                          job: { ...prev.job, salaryMentioned: e.target.checked }
                        }))}
                        className="rounded"
                      />
                      <span className="text-sm">Salary mentioned</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.job.urgencySignals}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                          ...prev,
                          job: { ...prev.job, urgencySignals: e.target.checked }
                        }))}
                        className="rounded"
                      />
                      <span className="text-sm">Urgent hiring / Immediate start required</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.job.walletSeedKycRequest}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                          ...prev,
                          job: { ...prev.job, walletSeedKycRequest: e.target.checked }
                        }))}
                        className="rounded"
                      />
                      <span className="text-sm">Requests wallet/seed phrase</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.job.runCodeLocally}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                          ...prev,
                          job: { ...prev.job, runCodeLocally: e.target.checked }
                        }))}
                        className="rounded"
                      />
                      <span className="text-sm">Requests code execution</span>
                    </label>
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
                  <button 
                    type="button" 
                    onClick={addArtifact} 
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Artifact
                  </button>
                </div>

                {formData.artifacts.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No artifacts added</p>
                    <p className="text-sm text-gray-500">Add GitHub repositories, code files, or other technical resources</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.artifacts.map((artifact, index) => (
                      <div key={index} className="flex gap-4 items-end">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                          <select
                            value={artifact.type}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateArtifact(index, 'type', e.target.value as ArtifactInput['type'])}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">URL/Path *</label>
                          <input
                            type="text"
                            value={artifact.url}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateArtifact(index, 'url', e.target.value)}
                            placeholder="https://github.com/user/repo"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeArtifact(index)}
                          className="p-2 text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 text-lg bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5" />
                      Start Assessment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-sm text-gray-600">Groq AI analyzes patterns and provides risk assessment</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Multi-Layer Security</h3>
            <p className="text-sm text-gray-600">VirusTotal scanning and code analysis</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Instant Results</h3>
            <p className="text-sm text-gray-600">Get comprehensive risk assessment in seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
}
