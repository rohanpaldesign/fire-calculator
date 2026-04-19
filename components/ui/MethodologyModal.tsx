"use client";
import { X } from "lucide-react";

interface Props { open: boolean; onClose: () => void; }

export function MethodologyModal({ open, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
      <div className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--fg)]">How it&apos;s calculated</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--border)] transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-[var(--fg-muted)]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 text-sm text-[var(--fg-muted)]">
          <div>
            <p className="font-semibold text-[var(--fg)] mb-1">FIRE Number</p>
            <p>The portfolio you need to retire and sustain your lifestyle indefinitely at your chosen withdrawal rate.</p>
            <code className="block mt-2 bg-[var(--border)]/40 rounded-lg px-3 py-2 text-xs text-[var(--fg)]">
              FIRE Number = Annual Retirement Expenses ÷ Safe Withdrawal Rate
            </code>
            <p className="mt-2">At a 4% SWR, spending $60,000/yr requires a $1.5M portfolio.</p>
          </div>
          <div>
            <p className="font-semibold text-[var(--fg)] mb-1">Coast FIRE Number</p>
            <p>The amount you need <em>right now</em> so that (with zero further contributions) compound growth alone reaches your FIRE number by retirement.</p>
            <code className="block mt-2 bg-[var(--border)]/40 rounded-lg px-3 py-2 text-xs text-[var(--fg)]">
              Coast FIRE = FIRE Number ÷ (1 + real return)^years to retirement
            </code>
            <p className="mt-2">Once you hit your Coast number, every extra dollar invested just accelerates your date, but it&apos;s no longer required.</p>
          </div>
          <div>
            <p className="font-semibold text-[var(--fg)] mb-1">Real Return vs Nominal Return</p>
            <p>All projections use <strong className="text-[var(--fg)]">real (inflation-adjusted) return</strong>, so every dollar shown is in today&apos;s purchasing power. No mental inflation math needed.</p>
            <code className="block mt-2 bg-[var(--border)]/40 rounded-lg px-3 py-2 text-xs text-[var(--fg)]">
              Real Return = Nominal Return - Inflation Rate
            </code>
          </div>
          <div>
            <p className="font-semibold text-[var(--fg)] mb-1">Portfolio Growth</p>
            <p>Standard time-value-of-money with monthly compounding:</p>
            <code className="block mt-2 bg-[var(--border)]/40 rounded-lg px-3 py-2 text-xs text-[var(--fg)]">
              FV = PV x (1 + r/12)^n + C x ((1 + r/12)^n - 1) / (r/12)
            </code>
            <p className="mt-1.5 text-xs">PV = current portfolio · C = monthly contribution · r = annual real return · n = months</p>
          </div>
          <div>
            <p className="font-semibold text-[var(--fg)] mb-1">Lean, Fat &amp; Barista FIRE</p>
            <p>
              <strong className="text-[var(--fg)]">Lean FIRE</strong> uses a 5% SWR (leaner spending).{" "}
              <strong className="text-[var(--fg)]">Fat FIRE</strong> uses a 3% SWR (more cushion).{" "}
              <strong className="text-[var(--fg)]">Barista FIRE</strong> assumes part-time income covers some expenses, reducing the required portfolio size.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
