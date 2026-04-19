"use client";
import { useTheme } from "next-themes";
import { Sun, Moon, RotateCcw, User, Info } from "lucide-react";

export type AppTab = "results" | "whatif" | "relocate";
export const APP_TABS: { id: AppTab; label: string }[] = [
  { id: "results", label: "Calculator" },
  { id: "whatif", label: "What-If" },
  { id: "relocate", label: "Relocate" },
];

interface HeaderProps {
  onReset: () => void;
  onOpenMethodology?: () => void;
  showTabs?: boolean;
  activeTab?: AppTab;
  onTabChange?: (tab: AppTab) => void;
}

export function Header({ onReset, onOpenMethodology, showTabs, activeTab, onTabChange }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg)]">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Left: title + info */}
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-emerald-500 leading-none">FIRE Calculator</h1>
          <button
            onClick={onOpenMethodology}
            className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--border)] hover:bg-[var(--border)]/60 transition-colors"
            aria-label="How it's calculated"
          >
            <Info className="h-3.5 w-3.5 text-[var(--fg-muted)]" />
          </button>
        </div>

        {/* Right: tab group + action icons */}
        <div className="flex items-center gap-2">
          {showTabs && (() => {
            const activeIndex = APP_TABS.findIndex(t => t.id === activeTab);
            return (
              <div className="relative flex items-center rounded-lg bg-[var(--border)]/40 p-0.5">
                {/* Sliding pill */}
                <div
                  className="absolute inset-y-0.5 rounded-md bg-[var(--bg-card)] dark:bg-white/[0.1] shadow-sm pointer-events-none"
                  style={{
                    width: `calc((100% - 4px) / ${APP_TABS.length})`,
                    transform: `translateX(calc(${activeIndex * 100}% + 2px))`,
                    transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
                {APP_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange?.(tab.id)}
                    className={`relative z-10 flex-1 px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                      activeTab === tab.id ? "text-emerald-500" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            );
          })()}

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
  );
}
