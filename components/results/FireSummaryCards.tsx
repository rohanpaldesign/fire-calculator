"use client";
import { Card, CardTitle, CardValue, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { formatCurrency, formatYears, formatYear } from "@/lib/formatters";
import type { FireResults, FireProfile } from "@/types/fire";

interface Props { results: FireResults; profile: FireProfile; }

function statusBadge(progress: number) {
  if (progress >= 1) return <Badge variant="green">Achieved ✓</Badge>;
  if (progress >= 0.5) return <Badge variant="yellow">Halfway</Badge>;
  return <Badge variant="red">In progress</Badge>;
}

export function FireSummaryCards({ results, profile }: Props) {
  const { numbers, progress, timeline } = results;
  return (
    <div className="space-y-4">
      <Card className="border-emerald-200 dark:border-emerald-800">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <CardTitle>Your FIRE Number</CardTitle>
            <InfoTooltip content="The total portfolio value needed to retire permanently. Calculated as Annual Expenses ÷ Safe Withdrawal Rate. Once you hit this, your investments generate enough to cover your spending — forever." />
          </div>
          {statusBadge(progress.fireProgress)}
        </div>
        <CardValue className="text-3xl text-emerald-600 dark:text-emerald-400">{formatCurrency(numbers.fireNumber)}</CardValue>
        <CardDescription>{(profile.safeWithdrawalRate * 100).toFixed(1)}% SWR · {formatCurrency(profile.annualExpenses)}/yr expenses</CardDescription>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-[var(--fg-muted)]">Progress</p>
            <p className="font-semibold text-[var(--fg)]">{Math.min(100, Math.round(progress.fireProgress * 100))}% <span className="text-xs font-normal text-[var(--fg-muted)]">({formatCurrency(profile.currentAssets, true)} of {formatCurrency(numbers.fireNumber, true)})</span></p>
          </div>
          <div>
            <p className="text-xs text-[var(--fg-muted)]">Time to FIRE</p>
            <p className="font-semibold text-[var(--fg)]">{formatYears(timeline.yearsToFire)} {timeline.fireDate && <span className="text-xs font-normal text-[var(--fg-muted)]">(~{formatYear(timeline.fireDate)})</span>}</p>
          </div>
        </div>
        {timeline.yearsToFire === null && (
          <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-3 text-xs text-amber-700 dark:text-amber-400 space-y-1">
            <p className="font-semibold">FIRE not achievable on current trajectory</p>
            {timeline.monthlyContribNeeded !== null && <p>→ Increase monthly contributions to {formatCurrency(timeline.monthlyContribNeeded)}/mo</p>}
            {timeline.expenseReductionNeeded !== null && <p>→ Or reduce annual expenses by {formatCurrency(timeline.expenseReductionNeeded)}/yr</p>}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <CardTitle>Coast FIRE</CardTitle>
              <InfoTooltip content="You've saved enough that — even without adding another dollar — compound growth alone will reach your full FIRE number by your target retirement age. You can 'coast' without investing more." />
            </div>
            {statusBadge(progress.coastFireProgress)}
          </div>
          <CardValue className="text-indigo-600 dark:text-indigo-400">{formatCurrency(numbers.coastFireNumber, true)}</CardValue>
          <CardDescription>Invest this today and stop contributing — portfolio grows to FIRE by age {profile.retirementAge}</CardDescription>
          {timeline.coastFireAchievedAge !== null && timeline.coastFireAchievedAge <= profile.currentAge && <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">You&apos;ve already hit Coast FIRE!</p>}
          {timeline.coastFireAchievedAge !== null && timeline.coastFireAchievedAge > profile.currentAge && <p className="mt-2 text-xs text-[var(--fg-muted)]">You&apos;ll hit Coast FIRE at age {timeline.coastFireAchievedAge}</p>}
        </Card>

        <Card>
          <div className="flex items-center gap-1.5 mb-1">
            <CardTitle>Lean FIRE</CardTitle>
            <InfoTooltip content="Financial independence on a lean budget — roughly $40k/yr or less. Enough to cover essentials with minimal luxuries. Great for those willing to live frugally in exchange for retiring much earlier." />
          </div>
          <CardValue className="text-amber-600 dark:text-amber-400">{formatCurrency(numbers.leanFireNumber, true)}</CardValue>
          <CardDescription>5% SWR · frugal lifestyle (~$40k/yr)</CardDescription>
          <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--border)]"><div className="h-1.5 rounded-full bg-amber-400 transition-all duration-500" style={{ width: `${Math.min(100, progress.leanFireProgress * 100)}%` }} /></div>
          <p className="text-xs text-[var(--fg-muted)] mt-1">{Math.min(100, Math.round(progress.leanFireProgress * 100))}% there</p>
        </Card>

        <Card>
          <div className="flex items-center gap-1.5 mb-1">
            <CardTitle>Fat FIRE</CardTitle>
            <InfoTooltip content="Financial independence with a comfortable, generous lifestyle — typically $100k+/yr. Enough for travel, dining out, hobbies, and no financial stress. Requires a larger portfolio than standard FIRE." />
          </div>
          <CardValue className="text-purple-600 dark:text-purple-400">{formatCurrency(numbers.fatFireNumber, true)}</CardValue>
          <CardDescription>3% SWR · comfortable lifestyle (~$100k+/yr)</CardDescription>
          <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--border)]"><div className="h-1.5 rounded-full bg-purple-400 transition-all duration-500" style={{ width: `${Math.min(100, progress.fatFireProgress * 100)}%` }} /></div>
          <p className="text-xs text-[var(--fg-muted)] mt-1">{Math.min(100, Math.round(progress.fatFireProgress * 100))}% there</p>
        </Card>

        {(profile.baristaPartTimeIncome ?? 0) > 0 && (
          <Card>
            <div className="flex items-center gap-1.5 mb-1">
              <CardTitle>Barista FIRE</CardTitle>
              <InfoTooltip content="Semi-retirement: you work part-time (like a barista) to cover daily expenses, while your portfolio handles the rest. You need a much smaller nest egg because you're not withdrawing everything from investments." />
            </div>
            <CardValue className="text-rose-600 dark:text-rose-400">{formatCurrency(numbers.baristaFireNumber, true)}</CardValue>
            <CardDescription>Part-time income covers {formatCurrency(profile.baristaPartTimeIncome!)}/yr of expenses</CardDescription>
          </Card>
        )}
      </div>
    </div>
  );
}
