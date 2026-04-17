"use client";
import dynamic from "next/dynamic";
import { FireSummaryCards } from "./FireSummaryCards";
import { ProgressRing } from "./ProgressRing";
import { Card } from "@/components/ui/card";
import type { FireResults, FireProfile } from "@/types/fire";
const PortfolioChart = dynamic(() => import("./PortfolioChart"), { ssr: false });
const ExpensePieChart = dynamic(() => import("./ExpensePieChart"), { ssr: false });
interface Props { results: FireResults; profile: FireProfile; }
export function ResultsDashboard({ results, profile }: Props) {
  const { progress, timeline } = results;
  const hasCategories = Object.values(profile.expenseCategories ?? {}).some((v) => (v ?? 0) > 0);

  return (
    <div className="space-y-6">

      <Card>
        <h3 className="text-sm font-semibold text-[var(--fg-muted)] uppercase tracking-wide mb-4">FIRE Progress Overview</h3>
        <div className="flex flex-wrap justify-around gap-4">
          <ProgressRing progress={progress.fireProgress} label="FIRE" />
          <ProgressRing progress={progress.coastFireProgress} label="Coast FIRE" />
          <ProgressRing progress={progress.leanFireProgress} label="Lean FIRE" />
          <ProgressRing progress={progress.fatFireProgress} label="Fat FIRE" />
        </div>
      </Card>

      <FireSummaryCards results={results} profile={profile} />

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
