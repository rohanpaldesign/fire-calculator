"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, RotateCcw, User, Info, X } from "lucide-react";

export type AppTab = "results" | "whatif" | "relocate";
export const APP_TABS: { id: AppTab; label: string }[] = [
  { id: "results", label: "Calculator" },
  { id: "whatif", label: "What-If" },
  { id: "relocate", label: "Relocate" },
];

interface HeaderProps {
  onReset: () => void;
  showTabs?: boolean;
  activeTab?: AppTab;
  onTabChange?: (tab: AppTab) => void;
}

export function Header({ onReset, showTabs, activeTab, onTabChange }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [showMethodology, setShowMethodology] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* Left: title + info */}
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-emerald-500 leading-none">FIRE Calculator</h1>
            <button
              onClick={() => setShowMethodology(true)}
              className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--border)] hover:bg-[var(--border)]/60 transition-colors"
              aria-label="How it&apos;s calculated"
            >
              <Info className="h-3.5 w-3.5 text-[var(--fg-muted)]" />
            </button>
          </div>

          {/* Right: tab group + action icons */}
          <div className="flex items-center gap-2">
            {showTabs && (
              <div className="flex items-center rounded-lg bg-[var(--border)]/40 p-0.5">
                {APP_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange?.(tab.id)}
                    className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-[var(--bg-card)] text-emerald-500 shadow-sm"
                        : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--border)] hover:bg-[var(--border)]/60 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5 text-[var(--fg-muted)]" /> : <Moon className="h-3.5 w-3.5 text-[var(--fg-muted)]" />}
            </button>

            <button
              onClick={onReset}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--border)] hover:bg-[var(--border)]/60 transition-colors"
              aria-label="Reset profile"
            >
              <RotateCcw className="h-3.5 w-3.5 text-[var(--fg-muted)]" />
            </button>

            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--border)] opacity-50 cursor-not-allowed"
              aria-label="Profile (coming soon)"
              disabled
            >
              <User className="h-3.5 w-3.5 text-[var(--fg-muted)]" />
            </button>
          </div>

        </div>
      </header>

      {/* Methodology modal */}
      {showMethodology && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <div className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0 border-b border-[var(--border)]">
              <h2 className="text-lg font-bold text-[var(--fg)]">How it&apos;s calculated</h2>
              <button
                onClick={() => setShowMethodology(false)}
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
                  Real Return = Nominal Return − Inflation Rate
                </code>
              </div>
              <div>
                <p className="font-semibold text-[var(--fg)] mb-1">Portfolio Growth</p>
                <p>Standard time-value-of-money with monthly compounding:</p>
                <code className="block mt-2 bg-[var(--border)]/40 rounded-lg px-3 py-2 text-xs text-[var(--fg)]">
                  FV = PV × (1 + r/12)^n + C × ((1 + r/12)^n − 1) / (r/12)
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
      )}
    </>
  );
}
