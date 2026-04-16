'use client';

import { WorkflowStep } from '@/types';

const actionConfig: Record<string, { icon: string; color: string }> = {
  safe_to_proceed: { icon: '✅', color: '#16A34A' },
  request_more_proof: { icon: '📋', color: '#CA8A04' },
  do_not_run_locally: { icon: '🚫', color: '#DC2626' },
  use_vm_sandbox: { icon: '🔒', color: '#EA580C' },
  report_profile: { icon: '🚩', color: '#DC2626' },
  report_repository: { icon: '⚠️', color: '#DC2626' },
  rotate_secrets: { icon: '🔑', color: '#EA580C' },
  stop_interaction: { icon: '🛑', color: '#DC2626' },
};

const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };

export function WorkflowAdvisor({ steps }: { steps: WorkflowStep[] }) {
  const sorted = [...steps].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((step, i) => {
        const cfg = actionConfig[step.action] ?? { icon: '•', color: '#888' };
        return (
          <div
            key={i}
            className="flex items-start gap-3 bg-[#111113] border border-[#1f1f23] rounded-lg p-4"
          >
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{ backgroundColor: `${cfg.color}20`, border: `1px solid ${cfg.color}40` }}
            >
              {cfg.icon}
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-mono font-bold tracking-widest uppercase"
                  style={{ color: cfg.color }}
                >
                  {step.priority}
                </span>
              </div>
              <p className="text-sm text-gray-200">{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
