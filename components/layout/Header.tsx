"use client";
import { useTheme } from "next-themes";
import { Sun, Moon, RotateCcw, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
interface HeaderProps { onReset: () => void; }
export function Header({ onReset }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-emerald-500" />
          <div>
            <h1 className="text-lg font-bold text-[var(--fg)] leading-none">FIRE Calculator</h1>
            <p className="text-xs text-[var(--fg-muted)]">Financial Independence, Retire Early</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onReset} className="text-[var(--fg-muted)] hover:text-[var(--fg)]">
            <RotateCcw className="h-4 w-4 mr-1" />Reset
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
