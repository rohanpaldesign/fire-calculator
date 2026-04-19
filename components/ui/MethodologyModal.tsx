"use client";
import { X } from "lucide-react";

interface Props { open: boolean; onClose: () => void; }

export function MethodologyModal({ open, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
      <div className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--fg)]">FIRE and Coast FIRE</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--border)] transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-[var(--fg-muted)]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-sm text-[var(--fg-muted)]">

          <div>
            <p className="font-semibold text-[var(--fg)] text-base mb-2">FIRE</p>
            <p className="mb-3">
              FIRE stands for <strong className="text-[var(--fg)]">Financial Independence, Retire Early</strong>. The idea is simple: save and invest enough that your portfolio grows faster than you spend it, so you never need to work again.
            </p>
            <p className="mb-3">
              The key number is your <strong className="text-[var(--fg)]">FIRE number</strong> — the portfolio size where you can safely live off investment returns alone. It depends on how much you spend each year and your safe withdrawal rate (the percentage you draw down annually).
            </p>
            <code className="block bg-[var(--border)]/40 rounded-lg px-4 py-3 text-xs text-[var(--fg)]">
              FIRE Number = Annual Expenses / Safe Withdrawal Rate
            </code>
            <p className="mt-3 text-xs">
              At a 4% withdrawal rate, spending $60,000/yr means you need $1.5M invested. The 4% rule is based on historical data showing a diversified portfolio can sustain that rate for 30+ years.
            </p>
          </div>

          <div className="border-t border-[var(--border)] pt-6">
            <p className="font-semibold text-[var(--fg)] text-base mb-2">Coast FIRE</p>
            <p className="mb-3">
              Coast FIRE is when you have enough invested that you can <strong className="text-[var(--fg)]">stop contributing entirely</strong> and still reach your full FIRE number by retirement — purely through compound growth.
            </p>
            <p className="mb-3">
              Think of it as crossing a threshold where your money works hard enough on its own. You still need income to cover living expenses, but you no longer need to invest any of it.
            </p>
            <code className="block bg-[var(--border)]/40 rounded-lg px-4 py-3 text-xs text-[var(--fg)]">
              Coast FIRE Number = FIRE Number / (1 + annual return)^years to retirement
            </code>
            <p className="mt-3 text-xs">
              The further you are from retirement, the lower your Coast FIRE number — more time means more compounding. This is why starting early is so powerful.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
