"use client";
import { useEffect } from "react";
import { NumericInput } from "@/components/ui/numeric-input";
import { Label, HintText } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { estimateTaxBreakdown } from "@/lib/tax-estimates";
import type { FireProfile } from "@/types/fire";
import { Info } from "lucide-react";

interface Props { profile: FireProfile; onChange: (patch: Partial<FireProfile>) => void; }

export function IncomeSection({ profile, onChange }: Props) {
  const breakdown = estimateTaxBreakdown(profile.grossIncome, profile.location, profile.filingStatus);

  // Auto-calculate take-home whenever gross, state, or filing status changes
  useEffect(() => {
    if (profile.autoTakeHome && profile.grossIncome > 0) {
      onChange({ netIncome: breakdown.netIncome });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.grossIncome, profile.location, profile.filingStatus, profile.autoTakeHome]);

  const savingsPerMonth = profile.netIncome > 0 && profile.annualExpenses > 0
    ? Math.max(0, (profile.netIncome - profile.annualExpenses) / 12)
    : null;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-[var(--fg)]">Income</h2>

      <div>
        <Label htmlFor="grossIncome">Gross Annual Income</Label>
        <NumericInput
          id="grossIncome"
          value={profile.grossIncome}
          onChange={(v) => onChange({ grossIncome: v })}
          min={0}
          prefix="$"
        />
        <HintText>Your total income before taxes (salary, bonuses, etc.)</HintText>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <Label htmlFor="netIncome" className="mb-0">Net (Take-Home) Income</Label>
          <button
            type="button"
            onClick={() => onChange({ autoTakeHome: !profile.autoTakeHome })}
            className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
              profile.autoTakeHome
                ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                : "border-[var(--border)] text-[var(--fg-muted)] hover:border-emerald-300"
            }`}
          >
            {profile.autoTakeHome ? "Auto ✓" : "Manual"}
          </button>
        </div>
        <NumericInput
          id="netIncome"
          value={profile.netIncome}
          onChange={(v) => onChange({ netIncome: v, autoTakeHome: false })}
          min={0}
          prefix="$"
          disabled={profile.autoTakeHome}
        />

        {/* Tax breakdown when auto mode is on */}
        {profile.autoTakeHome && profile.grossIncome > 0 && (
          <div className="mt-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-[var(--border)] p-3 text-xs space-y-1">
            <div className="flex items-center gap-1 text-[var(--fg-muted)] mb-1.5">
              <Info className="h-3 w-3" />
              <span className="font-medium">Estimated taxes ({(breakdown.effectiveRate * 100).toFixed(1)}% effective)</span>
            </div>
            <div className="flex justify-between"><span className="text-[var(--fg-muted)]">Federal income tax</span><span className="text-[var(--fg)]">−{formatCurrency(breakdown.federalTax)}</span></div>
            <div className="flex justify-between"><span className="text-[var(--fg-muted)]">FICA (SS + Medicare)</span><span className="text-[var(--fg)]">−{formatCurrency(breakdown.ficaTax)}</span></div>
            <div className="flex justify-between"><span className="text-[var(--fg-muted)]">State ({profile.location})</span><span className="text-[var(--fg)]">−{formatCurrency(breakdown.stateTax)}</span></div>
            <div className="flex justify-between font-semibold border-t border-[var(--border)] pt-1 mt-1">
              <span className="text-[var(--fg)]">Take-home</span>
              <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(breakdown.netIncome)}</span>
            </div>
            <p className="text-[var(--fg-muted)] italic pt-0.5">Estimates only — actual taxes vary. Click &quot;Manual&quot; to override.</p>
          </div>
        )}
      </div>

      {/* Savings rate and monthly surplus */}
      {savingsPerMonth !== null && (
        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                Savings rate: {(((profile.netIncome - profile.annualExpenses) / profile.netIncome) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">
                {formatCurrency(savingsPerMonth)}/mo available to invest after expenses
              </p>
            </div>
            {profile.monthlyContribution < savingsPerMonth * 0.9 && (
              <Badge variant="yellow">Under-investing</Badge>
            )}
            {profile.monthlyContribution >= savingsPerMonth * 0.9 && (
              <Badge variant="green">On track</Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
