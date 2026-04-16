'use client';

interface ScoreCardProps {
  label: string;
  score: number;
  max?: number;
  icon: string;
  description?: string;
}

export function ScoreCard({ label, score, max = 25, icon, description }: ScoreCardProps) {
  const pct = (score / max) * 100;
  const color =
    pct >= 70 ? '#16A34A' :
    pct >= 40 ? '#CA8A04' :
    pct >= 20 ? '#EA580C' : '#DC2626';

  return (
    <div className="bg-[#111113] border border-[#1f1f23] rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-medium text-gray-300">{label}</span>
        </div>
        <span className="font-mono text-lg font-bold" style={{ color }}>
          {score}<span className="text-gray-500 text-sm">/{max}</span>
        </span>
      </div>
      <div className="w-full bg-[#1f1f23] rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}
