"use client";
import dynamic from "next/dynamic";
import { FireSummaryCards } from "./FireSummaryCards";
import { Card } from "@/components/ui/card";
import { EditableValue } from "@/components/ui/editable-value";
import { formatCurrency } from "@/lib/formatters";
import { calcAutoRetirementExpenses } from "@/lib/calculations";
import type { FireResults, FireProfile } from "@/types/fire";
const PortfolioChart = dynamic(() => import("./PortfolioChart"), { ssr: false });
const ExpensePieChart = dynamic(() => import("./ExpensePieChart"), { ssr: false });

interface Props {
  results: FireResults;
  profile: FireProfile;
  onChange: (patch: Partial<FireProfile>) => void;
  onEditAll: () => void;
}

export function ResultsDashboard({ results, profile, onChange, onEditAll }: Props) {
  const { timeline } = results;
  const hasCategories = Object.values(profile.expenseCategories ?? {}).some((v) => (v ?? 0) > 0);

  const effectiveRetirementExpenses = profile.retirementExpensesMode === "auto"
    ? calcAutoRetirementExpenses(profile)
    : profile.retirementExpenses;

  return (
    <div className="space-y-6">

      {/* Quick Inputs bar */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[var(--fg-muted)]">Portfolio:</span>
          <EditableValue
            value={profile.currentAssets}
            display={formatCurrency(profile.currentAssets, true)}
            min={0}
            onChange={(v) => onChange({ currentAssets: v })}
            className="font-semibold text-[var(--fg)]"
            inputWidth="w-28"
          />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[var(--fg-muted)]">Current Expenses:</span>
          <EditableValue
            value={profile.annualExpenses}
            display={formatCurrency(profile.annualExpenses, true)}
            min={0}
            onChange={(v) => onChange({ annualExpenses: v })}
            className="font-semibold text-[var(--fg)]"
            inputWidth="w-28"
          />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[var(--fg-muted)]">Retirement Expenses:</span>
          <EditableValue
            value={effectiveRetirementExpenses}
            display={formatCurrency(effectiveRetirementExpenses, true)}
            min={0}
            onChange={(v) => onChange({ retirementExpenses: v, retirementExpensesMode: "manual" })}
            className={`font-semibold ${profile.retirementExpensesMode === "auto" ? "text-[var(--fg-muted)]" : "text-[var(--fg)]"}`}
            inputWidth="w-28"
          />
          {profile.retirementExpensesMode === "auto" && (
            <span className="text-xs text-[var(--fg-muted)] italic">auto</span>
          )}
        </div>
        <button
          onClick={onEditAll}
          className="ml-auto text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] underline underline-offset-2 transition-colors"
        >
          Edit All Inputs
        </button>
      </div>

      <FireSummaryCards results={results} profile={profile} onChange={onChange} />

      <Card>
        <PortfolioChart
          data={timeline.projectedPortfolioByYear}
          fireDate={timeline.fireDate}
          coastFireAchievedAge={timeline.coastFireAchievedAge}
          currentAge={profile.currentAge}
        />
      </Card>

      {hasCategories && (
        <Card>
          <ExpensePieChart categories={profile.expenseCategories!} total={profile.annualExpenses} />
        </Card>
      )}

      <Card className="text-xs text-[var(--fg-muted)] space-y-1">
        <p className="font-semibold text-[var(--fg)] text-sm mb-2">Assumptions used</p>
        <p>Real return: {(profile.realReturn * 100).toFixed(1)}% &middot; Nominal: {(profile.nominalReturn * 100).toFixed(1)}% &middot; Inflation: {(profile.inflationRate * 100).toFixed(1)}%</p>
        <p>SWR: {(profile.safeWithdrawalRate * 100).toFixed(1)}% &middot; FIRE = Annual Expenses / SWR &middot; Coast FIRE = FIRE / (1+r)^years</p>
        <p className="italic pt-1">Projections are estimates for planning purposes. Not financial advice.</p>
      </Card>
    </div>
  );
}
