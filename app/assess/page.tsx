'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ChevronRight, ChevronLeft, Plus, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { AssessmentInput, ArtifactInput } from '@/types';

const steps = ['Recruiter Info', 'Job Context', 'Technical Artifacts'];

export default function AssessPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [recruiter, setRecruiter] = useState({
    name: '',
    claimedCompany: '',
    linkedinUrl: '',
    emailReceived: '',
  });

  const [job, setJob] = useState({
    jobDescription: '',
    recruiterMessages: '',
    salaryMentioned: false,
    urgencySignals: false,
    walletSeedKycRequest: false,
    runCodeLocally: false,
  });

  const [artifacts, setArtifacts] = useState<ArtifactInput[]>([]);
  const [newUrl, setNewUrl] = useState('');

  const addArtifact = () => {
    if (!newUrl.trim()) return;
    const url = newUrl.trim();
    let type: ArtifactInput['type'] = 'url';
    if (url.includes('github.com')) type = 'github';
    else if (url.includes('gitlab.com')) type = 'gitlab';
    else if (url.includes('drive.google.com')) type = 'drive';
    else if (url.includes('notion.so')) type = 'notion';
    else if (/bit\.ly|tinyurl|t\.co|is\.gd/.test(url)) type = 'shortlink';
    else if (url.endsWith('.zip')) type = 'zip';
    setArtifacts((prev) => [...prev, { url, type }]);
    setNewUrl('');
  };

  const removeArtifact = (i: number) => setArtifacts((prev) => prev.filter((_, idx) => idx !== i));

  const submit = async () => {
    setLoading(true);
    setError('');
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

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-500" />
          <span className="font-mono font-bold">TrustHire</span>
        </Link>
        <span className="text-white/30 text-sm font-mono">New Assessment</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                i === step ? 'bg-red-600 text-white' : i < step ? 'bg-green-600 text-white' : 'bg-white/10 text-white/40'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-mono hidden sm:block ${
                i === step ? 'text-white' : 'text-white/30'
              }`}>{s}</span>
              {i < steps.length - 1 && <div className="w-8 h-px bg-white/10 mx-1" />}
            </div>
          ))}
        </div>

        {/* Step 0 - Recruiter */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-mono font-bold mb-1">Recruiter Information</h2>
              <p className="text-white/40 text-sm">Enter what you know about the person who contacted you.</p>
            </div>
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
                />
                <p className="text-white/30 text-xs mt-1">LinkedIn verification is a partial signal only — not a trust guarantee.</p>
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
