"use client";
import { Card, CardTitle, CardValue, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { formatCurrency, formatYears } from "@/lib/formatters";
import type { FireResults, FireProfile } from "@/types/fire";

interface Props { results: FireResults; profile: FireProfile; }

function statusBadge(progress: number) {
  if (progress >= 1) return <Badge variant="green">Achieved ✓</Badge>;
  if (progress >= 0.5) return <Badge variant="yellow">Halfway</Badge>;
  return <Badge variant="red">In progress</Badge>;
}

export function FireSummaryCards({ results, profile }: Props) {
  const { numbers, progress, timeline } = results;

  const fireYear = timeline.fireDate ? timeline.fireDate.getFullYear() : null;
  const yearsFromNow = timeline.yearsToFire !== null ? Math.ceil(timeline.yearsToFire) : null;
  const fireProgressPct = Math.min(100, Math.round(progress.fireProgress * 100));

  const portfolioAtFire = numbers.portfolioAtFireDate ?? numbers.portfolioAtRetirementAge;
  const portfolioVsTarget = portfolioAtFire - numbers.nominalFireNumber;
  const portfolioOnTrack = portfolioAtFire >= numbers.nominalFireNumber;

  return (
    <div className="space-y-4">

      {/* ── Hero: Time to FIRE ── */}
      <Card className="border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/30">
        <div className="flex items-center gap-1.5 mb-3">
          <CardTitle className="text-base">Time to FIRE</CardTitle>
          <InfoTooltip content="How many years until your invested portfolio reaches your FIRE number — the point where you can live off investment returns indefinitely without ever working again." />
        </div>

        {timeline.yearsToFire !== null ? (
          <>
            <div className="flex items-end gap-4 mb-2">
              <div>
                <p className="text-5xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
                  ~{fireYear}
                </p>
                <p className="text-sm text-[var(--fg-muted)] mt-1">
                  {yearsFromNow === 0 ? "You have already reached FIRE!" : yearsFromNow === 1 ? "1 year from now" : `${yearsFromNow} years from now`}
                </p>
              </div>
              {timeline.fireAge !== null && (
                <div className="pb-1">
                  <p className="text-xs text-[var(--fg-muted)]">Age at FIRE</p>
                  <p className="text-2xl font-bold text-[var(--fg)]">{timeline.fireAge}</p>
                </div>
              )}
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-xs text-[var(--fg-muted)] mb-1">
                <span>Progress to FIRE</span>
                <span>{fireProgressPct}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-[var(--border)]">
                <div
                  className="h-2.5 rounded-full bg-emerald-500 transition-all duration-700"
                  style={{ width: `${fireProgressPct}%` }}
                />
              </div>
              <p className="text-xs text-[var(--fg-muted)] mt-1">
                {formatCurrency(profile.currentAssets, true)} saved · {formatCurrency(numbers.fireNumber, true)} needed
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Not achievable on current trajectory</p>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-3 text-xs text-amber-700 dark:text-amber-400 space-y-1">
              {timeline.monthlyContribNeeded !== null && (
                <p>→ Increase monthly contributions to {formatCurrency(timeline.monthlyContribNeeded)}/mo</p>
              )}
              {timeline.expenseReductionNeeded !== null && (
                <p>→ Or reduce annual expenses by {formatCurrency(timeline.expenseReductionNeeded)}/yr</p>
              )}
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-[var(--fg-muted)] mb-1">
                <span>Progress</span>
                <span>{fireProgressPct}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--border)]">
                <div className="h-2 rounded-full bg-emerald-400 transition-all duration-700" style={{ width: `${fireProgressPct}%` }} />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* ── FIRE Number + Portfolio at FIRE ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-1.5 mb-1">
            <CardTitle>FIRE Number</CardTitle>
            <InfoTooltip content="The portfolio size needed to retire permanently. Calculated as Annual Retirement Expenses divided by your Safe Withdrawal Rate." />
          </div>
          <CardValue className="text-emerald-600 dark:text-emerald-400">{formatCurrency(numbers.fireNumber, true)}</CardValue>
          <CardDescription>in today&apos;s dollars · {(profile.safeWithdrawalRate * 100).toFixed(1)}% SWR</CardDescription>
          <div className="mt-2 pt-2 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--fg-muted)]">Inflation-adjusted target</p>
            <p className="text-base font-semibold text-[var(--fg)]">{formatCurrency(numbers.nominalFireNumber, true)}</p>
            <p className="text-xs text-[var(--fg-muted)]">in {fireYear ?? "future"} dollars</p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-1.5 mb-1">
            <CardTitle>Portfolio at FIRE Date</CardTitle>
            <InfoTooltip content="Projected value of your portfolio when you reach FIRE, based on your current assets, monthly contributions, and nominal investment return. Shown in future (nominal) dollars." />
          </div>
          <CardValue className={portfolioOnTrack ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>
            {formatCurrency(portfolioAtFire, true)}
          </CardValue>
          <CardDescription>projected nominal value</CardDescription>
          <div className="mt-2 pt-2 border-t border-[var(--border)]">
            <p className={`text-xs font-medium ${portfolioOnTrack ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
              {portfolioOnTrack
                ? `+${formatCurrency(portfolioVsTarget, true)} above target`
                : `${formatCurrency(Math.abs(portfolioVsTarget), true)} below target`}
            </p>
            <p className="text-xs text-[var(--fg-muted)]">vs {formatCurrency(numbers.nominalFireNumber, true)} inflation-adjusted target</p>
          </div>
        </Card>
      </div>

      {/* ── Milestone cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <CardTitle>Coast FIRE</CardTitle>
              <InfoTooltip content="You have saved enough that — even without adding another dollar — compound growth alone will reach your full FIRE number by your target retirement age." />
            </div>
            {statusBadge(progress.coastFireProgress)}
          </div>
          <CardValue className="text-indigo-600 dark:text-indigo-400">{formatCurrency(numbers.coastFireNumber, true)}</CardValue>
          <CardDescription>Stop contributing today and coast to FIRE by age {profile.retirementAge}</CardDescription>
          {timeline.coastFireAchievedAge !== null && timeline.coastFireAchievedAge <= profile.currentAge && (
            <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">You&apos;ve already hit Coast FIRE!</p>
          )}
          {timeline.coastFireAchievedAge !== null && timeline.coastFireAchievedAge > profile.currentAge && (
            <p className="mt-2 text-xs text-[var(--fg-muted)]">Coast FIRE reached at age {timeline.coastFireAchievedAge}</p>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-1.5 mb-1">
            <CardTitle>Lean FIRE</CardTitle>
            <InfoTooltip content="Financial independence on a lean budget — roughly 40k/yr or less. Enough to cover essentials with minimal luxuries. Great for those willing to live frugally in exchange for retiring much earlier." />
          </div>
          <CardValue className="text-amber-600 dark:text-amber-400">{formatCurrency(numbers.leanFireNumber, true)}</CardValue>
          <CardDescription>5% SWR · frugal lifestyle (~$40k/yr)</CardDescription>
          <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--border)]">
            <div className="h-1.5 rounded-full bg-amber-400 transition-all duration-500" style={{ width: `${Math.min(100, progress.leanFireProgress * 100)}%` }} />
          </div>
          <p className="text-xs text-[var(--fg-muted)] mt-1">{Math.min(100, Math.round(progress.leanFireProgress * 100))}% there</p>
        </Card>

        <Card>
          <div className="flex items-center gap-1.5 mb-1">
            <CardTitle>Fat FIRE</CardTitle>
            <InfoTooltip content="Financial independence with a comfortable, generous lifestyle — typically $100k+/yr. Enough for travel, dining out, hobbies, and no financial stress. Requires a larger portfolio than standard FIRE." />
          </div>
          <CardValue className="text-purple-600 dark:text-purple-400">{formatCurrency(numbers.fatFireNumber, true)}</CardValue>
          <CardDescription>3% SWR · comfortable lifestyle (~$100k+/yr)</CardDescription>
          <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--border)]">
            <div className="h-1.5 rounded-full bg-purple-400 transition-all duration-500" style={{ width: `${Math.min(100, progress.fatFireProgress * 100)}%` }} />
          </div>
          <p className="text-xs text-[var(--fg-muted)] mt-1">{Math.min(100, Math.round(progress.fatFireProgress * 100))}% there</p>
        </Card>

        {(profile.baristaPartTimeIncome ?? 0) > 0 && (
          <Card>
            <div className="flex items-center gap-1.5 mb-1">
              <CardTitle>Barista FIRE</CardTitle>
              <InfoTooltip content="Semi-retirement: part-time work covers daily expenses, while your portfolio covers the rest. You need a much smaller nest egg because you are not withdrawing everything from investments." />
            </div>
            <CardValue className="text-rose-600 dark:text-rose-400">{formatCurrency(numbers.baristaFireNumber, true)}</CardValue>
            <CardDescription>Part-time income covers {formatCurrency(profile.baristaPartTimeIncome!)}/yr of expenses</CardDescription>
          </Card>
        )}
      </div>
    </div>
  );
}
