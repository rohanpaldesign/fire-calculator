"use client";
interface Props { progress: number; label: string; size?: number; }
export function ProgressRing({ progress, label, size=120 }: Props) {
  const pct = Math.min(progress, 1);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - pct);
  const color = pct >= 1 ? "#10b981" : pct >= 0.5 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--border)" strokeWidth={8} />
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} style={{transition:"stroke-dashoffset 0.6s ease"}} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-lg font-bold" style={{ color }}>{progress >= 1 ? "✓" : `${Math.round(progress*100)}%`}</p>
        </div>
      </div>
      <p className="text-xs text-[var(--fg-muted)] text-center leading-tight max-w-[80px]">{label}</p>
    </div>
  );
}
