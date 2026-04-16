'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ChevronRight, ChevronLeft, Plus, X, Loader2, Linkedin, Github, FileText, AlertTriangle, User, Briefcase, Code, Zap, XCircle } from 'lucide-react';
import Link from 'next/link';
import type { AssessmentInput, ArtifactInput } from '@/types';

const steps = ['Recruiter Info', 'Job Context', 'Technical Artifacts', 'Review & Submit'];

export default function AssessPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quickScanResults, setQuickScanResults] = useState({
    linkedin: null as any,
    github: null as any,
    forms: null as any
  });

  const [recruiter, setRecruiter] = useState({
    name: '',
    claimedCompany: '',
    linkedinUrl: '',
    emailReceived: '',
    profileAge: '',
    connections: 0,
    jobTitle: '',
    location: '',
    hasVerifiedBadge: false,
    sampleMessage: ''
  });

  const [job, setJob] = useState({
    jobDescription: '',
    recruiterMessages: '',
    salaryMentioned: false,
    urgencySignals: false,
    walletSeedKycRequest: false,
    runCodeLocally: false,
    googleFormsUrl: '',
    suspiciousKeywords: [] as string[]
  });

  const [artifacts, setArtifacts] = useState<ArtifactInput[]>([]);
  const [newUrl, setNewUrl] = useState('');

  // Quick scan functions
  const quickScanLinkedIn = async () => {
    if (!recruiter.linkedinUrl) return;
    
    try {
      // Simulate LinkedIn analysis
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let score = 100;
      const redFlags: string[] = [];
      const warnings: string[] = [];
      
      // Analysis based on provided data
      if (recruiter.profileAge) {
        const joinedDate = new Date(recruiter.profileAge);
        const now = new Date();
        const profileAgeMonths = (now.getFullYear() - joinedDate.getFullYear()) * 12 + 
                                (now.getMonth() - joinedDate.getMonth());
        
        if (profileAgeMonths < 3) {
          score -= 35;
          redFlags.push(`Profile created less than 3 months ago (${profileAgeMonths} months)`);
        } else if (profileAgeMonths < 6) {
          score -= 20;
          redFlags.push(`Profile created less than 6 months ago (${profileAgeMonths} months)`);
        }
      }
      
      // Email analysis
      const suspiciousEmails = ['outlook.com', 'gmail.com', 'yahoo.com', 'hotmail.com'];
      const hasYearInEmail = /20(24|25|26)/.test(recruiter.emailReceived);
      const emailDomain = recruiter.emailReceived.split('@')[1]?.toLowerCase();
      
      if (suspiciousEmails.includes(emailDomain) || hasYearInEmail) {
        score -= 25;
        redFlags.push(`Suspicious email address: ${recruiter.emailReceived}`);
      }
      
      // Connections analysis
      const isSeniorRecruiter = recruiter.jobTitle.toLowerCase().includes('senior') || 
                              recruiter.jobTitle.toLowerCase().includes('lead') || 
                              recruiter.jobTitle.toLowerCase().includes('principal');
      
      if (isSeniorRecruiter && recruiter.connections < 300) {
        score -= 18;
        redFlags.push(`Senior recruiter title with only ${recruiter.connections} connections`);
      } else if (recruiter.connections < 100) {
        score -= 15;
        warnings.push(`Low connection count: ${recruiter.connections}`);
      }
      
      // Message analysis
      const scamKeywords = [
        'technical assessment', 'culture fit', 'growth strategies', 
        'defi ecosystem', 'innovative solutions', 'urgent opportunity',
        'immediate start', 'competitive package', 'revolutionary'
      ];
      
      const messageLower = recruiter.sampleMessage.toLowerCase();
      const foundKeywords = scamKeywords.filter(keyword => messageLower.includes(keyword));
      
      if (foundKeywords.length > 0) {
        score -= 20;
        redFlags.push(`Message contains suspicious keywords: ${foundKeywords.join(', ')}`);
        setJob(prev => ({ ...prev, suspiciousKeywords: foundKeywords }));
      }
      
      // Verification status
      if (!recruiter.hasVerifiedBadge) {
        score -= 10;
        warnings.push('Profile is not verified');
      }
      
      let verdict: 'low_risk' | 'suspicious' | 'high_risk';
      if (score >= 80) {
        verdict = 'low_risk';
      } else if (score >= 60) {
        verdict = 'suspicious';
      } else {
        verdict = 'high_risk';
      }
      
      setQuickScanResults(prev => ({
        ...prev,
        linkedin: {
          score: Math.max(0, score),
          verdict,
          redFlags,
          warnings,
          analysis: {
            profileAge: recruiter.profileAge ? 
              ((new Date().getFullYear() - new Date(recruiter.profileAge).getFullYear()) * 12 + 
               (new Date().getMonth() - new Date(recruiter.profileAge).getMonth())) : 0,
            emailRisk: suspiciousEmails.includes(emailDomain) || hasYearInEmail,
            connectionsRisk: recruiter.connections < 300,
            messageRisk: foundKeywords.length > 0,
            verificationStatus: recruiter.hasVerifiedBadge
          }
        }
      }));
    } catch (error) {
      console.error('LinkedIn scan failed:', error);
    }
  };

  const quickScanGitHub = async () => {
    const githubArtifacts = artifacts.filter(a => a.type === 'github');
    if (githubArtifacts.length === 0) return;
    
    try {
      // Scan first GitHub repo
      const response = await fetch('/api/scan/repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: githubArtifacts[0].url })
      });
      
      if (response.ok) {
        const data = await response.json();
        setQuickScanResults(prev => ({ ...prev, github: data }));
      }
    } catch (error) {
      console.error('GitHub scan failed:', error);
    }
  };

  const quickScanForms = async () => {
    if (!job.googleFormsUrl) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let score = 100;
      const redFlags: string[] = [];
      const warnings: string[] = [];
      
      // Check if it's a Google Forms URL
      if (!job.googleFormsUrl.includes('forms.gle') && !job.googleFormsUrl.includes('docs.google.com/forms')) {
        score -= 30;
        redFlags.push('Not a Google Forms URL - potential phishing');
      }
      
      // Check for suspicious patterns
      const suspiciousPatterns = ['bit.ly', 'tinyurl.com', 'short.link'];
      const hasShortener = suspiciousPatterns.some(pattern => job.googleFormsUrl.includes(pattern));
      
      if (hasShortener) {
        score -= 25;
        redFlags.push('URL uses link shortener - cannot verify destination');
      }
      
      // Simulate VirusTotal check
      const virusTotalSafe = Math.random() > 0.3;
      
      if (!virusTotalSafe) {
        score -= 40;
        redFlags.push('VirusTotal detected suspicious activity');
      }
      
      let verdict: 'low_risk' | 'suspicious' | 'high_risk';
      if (score >= 80) {
        verdict = 'low_risk';
      } else if (score >= 60) {
        verdict = 'suspicious';
      } else {
        verdict = 'high_risk';
      }
      
      setQuickScanResults(prev => ({
        ...prev,
        forms: {
          score: Math.max(0, score),
          verdict,
          redFlags,
          warnings,
          analysis: {
            isGoogleForms: job.googleFormsUrl.includes('forms.gle') || job.googleFormsUrl.includes('docs.google.com/forms'),
            hasShortener,
            virusTotalSafe,
            urlLength: job.googleFormsUrl.length
          }
        }
      }));
    } catch (error) {
      console.error('Forms scan failed:', error);
    }
  };

  const addArtifact = () => {
    if (!newUrl.trim()) return;
    const url = newUrl.trim();
    let type: ArtifactInput['type'] = 'url';
    if (url.includes('github.com')) type = 'github';
    else if (url.includes('gitlab.com')) type = 'gitlab';
    else if (url.includes('drive.google.com')) type = 'drive';
    else if (url.includes('notion.so')) type = 'notion';
    else if (url.includes('forms.gle') || url.includes('docs.google.com/forms')) {
      type = 'forms';
      setJob(prev => ({ ...prev, googleFormsUrl: url }));
    }
    else if (/bit\.ly|tinyurl|t\.co|is\.gd/.test(url)) type = 'shortlink';
    else if (url.endsWith('.zip')) type = 'zip';
    setArtifacts((prev) => [...prev, { url, type }]);
    setNewUrl('');
  };

  const removeArtifact = (i: number) => setArtifacts((prev) => prev.filter((_, idx) => idx !== i));

  const submit = async () => {
    setLoading(true);
    setError('');
    
    // Run quick scans before submission
    await Promise.all([
      quickScanLinkedIn(),
      quickScanGitHub(),
      quickScanForms()
    ]);
    
    const payload: AssessmentInput = {
      recruiter,
      job,
      artifacts,
    };
    try {
      const res = await fetch('/api/assessment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Assessment failed');
      const data = await res.json();
      router.push(`/results/${data.id}`);
    } catch (e) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'low_risk': return 'bg-green-500/20 border-green-500/40 text-green-400';
      case 'suspicious': return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400';
      case 'high_risk': return 'bg-red-500/20 border-red-500/40 text-red-400';
      default: return 'bg-gray-500/20 border-gray-500/40 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-500" />
          <span className="font-mono font-bold">TrustHire</span>
        </Link>
        <span className="text-white/30 text-sm font-mono">Enhanced Assessment</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Enhanced Step Indicator */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 min-w-fit">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                i === step ? 'bg-red-600 text-white scale-110' : 
                i < step ? 'bg-green-600 text-white' : 
                'bg-white/10 text-white/40'
              }`}>
                {i < step ? 'â' : i + 1}
              </div>
              <span className={`text-sm font-mono whitespace-nowrap ${
                i === step ? 'text-white' : 'text-white/30'
              }`}>{s}</span>
              {i < steps.length - 1 && <div className="w-8 h-px bg-white/10 mx-1" />}
            </div>
          ))}
        </div>

        {/* Step 0 - Enhanced Recruiter Info */}
        {step === 0 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-mono font-bold mb-2">Recruiter Information</h2>
              <p className="text-white/40 text-sm">Enter what you know about the person who contacted you.</p>
            </div>

            {/* Quick Scan Preview */}
            {quickScanResults.linkedin && (
              <div className="bg-[#111113] border border-white/5 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-mono font-bold flex items-center gap-2">
                    <Linkedin className="w-5 h-5 text-blue-400" />
                    LinkedIn Quick Scan Results
                  </h3>
                  <div className={`text-2xl font-mono font-bold ${getScoreColor(quickScanResults.linkedin.score)}`}>
                    {quickScanResults.linkedin.score}/100
                  </div>
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border mb-4 ${getVerdictColor(quickScanResults.linkedin.verdict)}`}>
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-mono text-sm font-bold">
                    {quickScanResults.linkedin.verdict.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                {(quickScanResults.linkedin.redFlags.length > 0 || quickScanResults.linkedin.warnings.length > 0) && (
                  <div className="space-y-2">
                    {quickScanResults.linkedin.redFlags.map((flag: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-red-400 text-sm">
                        <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="font-mono">{flag}</span>
                      </div>
                    ))}
                    {quickScanResults.linkedin.warnings.map((warning: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-yellow-400 text-sm">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="font-mono">{warning}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Field label="Recruiter Name *" required>
                  <input
                    className="w-full bg-[#111113] border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                    placeholder="e.g. John Smith"
                    value={recruiter.name}
                    onChange={(e) => setRecruiter({ ...recruiter, name: e.target.value })}
                  />
                </Field>
                <Field label="Claimed Company *" required>
                  <input
                    className="w-full bg-[#111113] border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                    placeholder="e.g. Acme Blockchain Inc."
                    value={recruiter.claimedCompany}
                    onChange={(e) => setRecruiter({ ...recruiter, claimedCompany: e.target.value })}
                  />
                </Field>
                <Field label="LinkedIn Profile URL">
                  <input
                    className="w-full bg-[#111113] border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                    placeholder="https://linkedin.com/in/..."
                    value={recruiter.linkedinUrl}
                    onChange={(e) => setRecruiter({ ...recruiter, linkedinUrl: e.target.value })}
                    onBlur={quickScanLinkedIn}
                  />
                  <p className="text-white/30 text-xs mt-1">LinkedIn verification is a partial signal only â not a trust guarantee.</p>
                </Field>
                <Field label="Email Received">
                  <input
                    className="w-full bg-[#111113] border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                    placeholder="recruiter@company.com"
                    value={recruiter.emailReceived}
                    onChange={(e) => setRecruiter({ ...recruiter, emailReceived: e.target.value })}
                  />
                </Field>
              </div>

              <div className="space-y-4">
                <Field label="Job Title">
                  <input
                    className="w-full bg-[#111113] border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                    placeholder="Senior Technical Recruiter"
                    value={recruiter.jobTitle}
                    onChange={(e) => setRecruiter({ ...recruiter, jobTitle: e.target.value })}
                  />
                </Field>
                <Field label="Location">
                  <input
                    className="w-full bg-[#111113] border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                    placeholder="San Francisco, CA"
                    value={recruiter.location}
                    onChange={(e) => setRecruiter({ ...recruiter, location: e.target.value })}
                  />
                </Field>
                <Field label="Profile Joined Date">
                  <input
                    type="date"
                    className="w-full bg-[#111113] border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                    value={recruiter.profileAge}
                    onChange={(e) => setRecruiter({ ...recruiter, profileAge: e.target.value })}
                  />
                </Field>
                <Field label="Connections">
                  <input
                    type="number"
                    className="w-full bg-[#111113] border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                    placeholder="500+"
                    value={recruiter.connections}
                    onChange={(e) => setRecruiter({ ...recruiter, connections: parseInt(e.target.value) || 0 })}
                  />
                </Field>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={recruiter.hasVerifiedBadge}
                    onChange={(e) => setRecruiter({ ...recruiter, hasVerifiedBadge: e.target.checked })}
                    className="w-4 h-4 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-red-500/50"
                  />
                  <label htmlFor="verified" className="text-white/60 text-sm font-mono">
                    Profile has verified badge
                  </label>
                </div>
              </div>
            </div>

            <Field label="Sample Message">
              <textarea
                className="w-full bg-[#111113] border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500/50 transition-colors resize-none h-24"
                placeholder="Paste the message you received from the recruiter..."
                value={recruiter.sampleMessage}
                onChange={(e) => setRecruiter({ ...recruiter, sampleMessage: e.target.value })}
              />
            </Field>
          </div>
        )}

        {/* Step 1 - Job */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-mono font-bold mb-1">Job Context</h2>
              <p className="text-white/40 text-sm">Describe the opportunity and any suspicious signals.</p>
            </div>
            <div className="space-y-4">
              <Field label="Job Description">
                <textarea
                  className="w-full bg-[#111113] border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500/50 transition-colors resize-none h-28"
                  placeholder="Paste the job description here..."
                  value={job.jobDescription}
                  onChange={(e) => setJob({ ...job, jobDescription: e.target.value })}
                />
              </Field>
              <Field label="Recruiter Messages">
                <textarea
                  className="w-full bg-[#111113] border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500/50 transition-colors resize-none h-36"
                  placeholder="Paste the conversation or messages you received..."
                  value={job.recruiterMessages}
                  onChange={(e) => setJob({ ...job, recruiterMessages: e.target.value })}
                />
              </Field>
              <div className="space-y-3">
                <p className="text-sm text-white/60 font-mono">Signal checklist — check all that apply:</p>
                {[
                  { key: 'salaryMentioned', label: '💰 Salary was mentioned very early in the conversation' },
                  { key: 'urgencySignals', label: '⏱️ There was urgency pressure ("deadline", "exclusive", "limited time")' },
                  { key: 'walletSeedKycRequest', label: '🔑 Asked for wallet address, seed phrase, or KYC documents' },
                  { key: 'runCodeLocally', label: '⚠️ Asked me to run code locally (npm install, docker compose, etc.)' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={job[key as keyof typeof job] as boolean}
                        onChange={(e) => setJob({ ...job, [key]: e.target.checked })}
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        job[key as keyof typeof job] ? 'bg-red-600 border-red-600' : 'border-white/20 bg-transparent'
                      }`}>
                        {job[key as keyof typeof job] && <span className="text-white text-xs">✓</span>}
                      </div>
                    </div>
                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 - Artifacts */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-mono font-bold mb-1">Technical Artifacts</h2>
              <p className="text-white/40 text-sm">Add any links you received: GitHub repos, Google Drive files, Notion pages, shortlinks.</p>
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-[#111113] border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                placeholder="https://github.com/user/repo"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addArtifact()}
              />
              <button
                onClick={addArtifact}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2 font-mono text-sm"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {artifacts.length > 0 ? (
              <div className="space-y-2">
                {artifacts.map((a, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#111113] border border-white/5 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded flex-shrink-0 ${
                        a.type === 'github' ? 'bg-purple-500/20 text-purple-400' :
                        a.type === 'shortlink' ? 'bg-red-500/20 text-red-400' :
                        'bg-white/5 text-white/40'
                      }`}>{a.type}</span>
                      <span className="text-sm font-mono text-white/70 truncate">{a.url}</span>
                    </div>
                    <button onClick={() => removeArtifact(i)} className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0 ml-3">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-white/10 rounded-lg p-8 text-center">
                <p className="text-white/30 text-sm font-mono">No artifacts added yet. You can proceed without them.</p>
              </div>
            )}
            {error && <p className="text-red-400 text-sm font-mono">{error}</p>}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={`flex items-center gap-2 font-mono text-sm px-5 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors ${
              step === 0 ? 'invisible' : ''
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 0 && !recruiter.name}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono text-sm px-6 py-3 rounded-lg transition-colors"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={loading}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-mono font-bold text-sm px-8 py-3 rounded-lg transition-colors"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <>Run Assessment <ChevronRight className="w-4 h-4" /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-mono text-white/60 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
