"use client";
import { Card, CardTitle, CardValue, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatYears } from "@/lib/formatters";
import type { FireResults, FireProfile } from "@/types/fire";

interface Props { results: FireResults; profile: FireProfile; }

function statusBadge(progress: number) {
  if (progress >= 1) return <Badge variant="green">Achieved</Badge>;
  if (progress >= 0.5) return <Badge variant="yellow">Halfway</Badge>;
  return <Badge variant="red">In progress</Badge>;
}

export function FireSummaryCards({ results, profile }: Props) {
  const { numbers, progress, timeline } = results;

  const fireYear = timeline.fireDate ? timeline.fireDate.getFullYear() : null;
  const yearsFromNow = timeline.yearsToFire !== null ? Math.ceil(timeline.yearsToFire) : null;
  const fireProgressPct = Math.min(100, Math.round(progress.fireProgress * 100));
  const coastAtTargetPct = Math.min(100, Math.round((profile.currentAssets / numbers.coastFireAtTargetAge) * 100));

  return (
    <div className="space-y-4">

      {/* ── Row 1: Retirement Age · FIRE Number · Coast FIRE Today · Monthly Investment ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

        <Card>
          <CardTitle>Retirement Age</CardTitle>
          <CardValue className="text-[var(--fg)]">{profile.retirementAge}</CardValue>
          <CardDescription>Target age to stop working</CardDescription>
        </Card>

        <Card>
          <CardTitle>FIRE Number</CardTitle>
          <CardValue className="text-emerald-600 dark:text-emerald-400">{formatCurrency(numbers.fireNumber, true)}</CardValue>
          <CardDescription>
            Portfolio needed to retire permanently at {(profile.safeWithdrawalRate * 100).toFixed(1)}% withdrawal rate.
            In today&apos;s dollars.
          </CardDescription>
        </Card>

        <Card>
          <div className="flex items-start justify-between mb-1">
            <CardTitle>Coast FIRE Today</CardTitle>
            {statusBadge(progress.coastFireProgress)}
          </div>
          <CardValue className="text-indigo-600 dark:text-indigo-400">{formatCurrency(numbers.coastFireNumber, true)}</CardValue>
          <CardDescription>
            If you stopped contributing right now, compound growth alone would reach your FIRE number by age {profile.retirementAge}.
          </CardDescription>
        </Card>

        <Card>
          <CardTitle>Monthly Investment</CardTitle>
          <CardValue className="text-[var(--fg)]">{formatCurrency(profile.monthlyContribution)}</CardValue>
          <CardDescription>Current monthly contribution rate used in all projections below.</CardDescription>
        </Card>

      </div>

      {/* ── Row 2: Target Coasting Age · Coast Target at Target Age · Predicted Coast Age ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <Card>
          <CardTitle>Target Coasting Age</CardTitle>
          <CardValue className="text-[var(--fg)]">{profile.targetCoastAge}</CardValue>
          <CardDescription>
            The age you plan to stop making new contributions and let your portfolio grow on its own until retirement.
          </CardDescription>
        </Card>

        <Card>
          <CardTitle>Coast Target at Age {profile.targetCoastAge}</CardTitle>
          <CardValue className="text-indigo-600 dark:text-indigo-400">{formatCurrency(numbers.coastFireAtTargetAge, true)}</CardValue>
          <CardDescription>
            Amount needed by age {profile.targetCoastAge} so compound growth covers the rest of the way to retirement at age {profile.retirementAge}.
            In today&apos;s dollars.
          </CardDescription>
          <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--border)]">
            <div
              className="h-1.5 rounded-full bg-indigo-400 transition-all duration-500"
              style={{ width: `${coastAtTargetPct}%` }}
            />
          </div>
          <p className="text-xs text-[var(--fg-muted)] mt-1">{coastAtTargetPct}% of this target reached today</p>
        </Card>

        <Card className={
          timeline.predictedCoastAge !== null && timeline.predictedCoastAge <= profile.targetCoastAge
            ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20"
            : ""
        }>
          <CardTitle>Predicted Coast Age</CardTitle>
          {timeline.predictedCoastAge !== null ? (
            <>
              <CardValue className={
                timeline.predictedCoastAge <= profile.targetCoastAge
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }>
                Age {timeline.predictedCoastAge}
              </CardValue>
              <CardDescription>
                {timeline.predictedCoastAge <= profile.currentAge
                  ? "You can already coast. Your portfolio will reach your FIRE number by retirement with no new contributions needed."
                  : timeline.predictedCoastAge <= profile.targetCoastAge
                  ? `${timeline.predictedCoastAge - profile.currentAge} years from now — before your target coasting age. On track.`
                  : `${timeline.predictedCoastAge - profile.currentAge} years from now — ${timeline.predictedCoastAge - profile.targetCoastAge} years after your target coasting age.`
                }
              </CardDescription>
            </>
          ) : (
            <>
              <CardValue className="text-amber-600 dark:text-amber-400">Not on track</CardValue>
              <CardDescription>
                At your current savings and contribution rate, your portfolio will not reach the coast target of {formatCurrency(numbers.coastFireAtTargetAge, true)} by age {profile.targetCoastAge}.
              </CardDescription>
            </>
          )}
        </Card>

      </div>

      {/* ── Coast FIRE by age table ── */}
      <Card>
        <h3 className="text-sm font-semibold text-[var(--fg)] mb-3">Coast FIRE by Age</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-2 pr-4 align-top">
                  <p className="text-xs font-semibold text-[var(--fg)]">Age</p>
                  <p className="text-xs font-normal text-[var(--fg-muted)]">Your age</p>
                </th>
                <th className="pb-2 pr-4 align-top">
                  <p className="text-xs font-semibold text-[var(--fg)]">Coast Target</p>
                  <p className="text-xs font-normal text-[var(--fg-muted)]">Amount needed to stop contributing at this age and still reach FIRE by {profile.retirementAge}</p>
                </th>
                <th className="pb-2 pr-4 align-top">
                  <p className="text-xs font-semibold text-[var(--fg)]">Portfolio (at current rate)</p>
                  <p className="text-xs font-normal text-[var(--fg-muted)]">Projected value if you keep investing {formatCurrency(profile.monthlyContribution)}/mo</p>
                </th>
                <th className="pb-2 align-top">
                  <p className="text-xs font-semibold text-[var(--fg)]">Monthly Needed from This Age</p>
                  <p className="text-xs font-normal text-[var(--fg-muted)]">Monthly contribution required from this age to hit your coast target by age {profile.targetCoastAge}</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {timeline.coastByAge.map((pt) => (
                <tr
                  key={pt.age}
                  className={`border-b border-[var(--border)] last:border-0 ${pt.canCoast ? "bg-emerald-50/40 dark:bg-emerald-950/20" : ""}`}
                >
                  <td className="py-2 pr-4 font-medium text-[var(--fg)]">{pt.age}</td>
                  <td className="py-2 pr-4 text-[var(--fg-muted)]">{formatCurrency(pt.coastTarget, true)}</td>
                  <td className="py-2 pr-4 text-[var(--fg)]">{formatCurrency(pt.portfolio, true)}</td>
                  <td className="py-2">
                    {pt.monthlyNeeded === 0
                      ? <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">$0 &mdash; can coast</span>
                      : pt.monthlyNeeded === -1
                      ? <span className="text-xs text-[var(--fg-muted)]">&mdash;</span>
                      : <span className={`text-xs font-medium ${pt.monthlyNeeded <= profile.monthlyContribution ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                          {formatCurrency(pt.monthlyNeeded)}/mo
                        </span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Time to FIRE (milestone) ── */}
      <Card className="border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/30">
        <CardTitle className="text-base mb-3">Time to FIRE</CardTitle>

        {timeline.yearsToFire !== null ? (
          <>
            <div className="flex items-end gap-4 mb-2">
              <div>
                <p className="text-5xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
                  ~{fireYear}
                </p>
                <p className="text-sm text-[var(--fg-muted)] mt-1">
                  {yearsFromNow === 0
                    ? "You have already reached FIRE!"
                    : yearsFromNow === 1
                    ? "1 year from now"
                    : `${yearsFromNow} years from now`}
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
                {formatCurrency(profile.currentAssets, true)} saved &middot; {formatCurrency(numbers.fireNumber, true)} needed
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Not achievable on current trajectory</p>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-3 text-xs text-amber-700 dark:text-amber-400 space-y-1">
              {timeline.monthlyContribNeeded !== null && (
                <p>Increase monthly contributions to {formatCurrency(timeline.monthlyContribNeeded)}/mo</p>
              )}
              {timeline.expenseReductionNeeded !== null && (
                <p>Or reduce annual expenses by {formatCurrency(timeline.expenseReductionNeeded)}/yr</p>
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

      {/* ── Lean / Fat / Barista milestone cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Card>
          <div className="flex items-start justify-between mb-1">
            <CardTitle>Lean FIRE</CardTitle>
            {statusBadge(progress.leanFireProgress)}
          </div>
          <CardValue className="text-amber-600 dark:text-amber-400">{formatCurrency(numbers.leanFireNumber, true)}</CardValue>
          <CardDescription>
            5% withdrawal rate. Covers essentials with minimal luxuries, typically under $40k/yr.
            Good for those willing to live frugally in exchange for retiring much earlier.
          </CardDescription>
          <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--border)]">
            <div
              className="h-1.5 rounded-full bg-amber-400 transition-all duration-500"
              style={{ width: `${Math.min(100, progress.leanFireProgress * 100)}%` }}
            />
          </div>
          <p className="text-xs text-[var(--fg-muted)] mt-1">{Math.min(100, Math.round(progress.leanFireProgress * 100))}% there</p>
        </Card>

        <Card>
          <div className="flex items-start justify-between mb-1">
            <CardTitle>Fat FIRE</CardTitle>
            {statusBadge(progress.fatFireProgress)}
          </div>
          <CardValue className="text-purple-600 dark:text-purple-400">{formatCurrency(numbers.fatFireNumber, true)}</CardValue>
          <CardDescription>
            3% withdrawal rate. Travel, dining, hobbies — a comfortable lifestyle with no financial stress,
            typically $100k+/yr.
          </CardDescription>
          <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--border)]">
            <div
              className="h-1.5 rounded-full bg-purple-400 transition-all duration-500"
              style={{ width: `${Math.min(100, progress.fatFireProgress * 100)}%` }}
            />
          </div>
          <p className="text-xs text-[var(--fg-muted)] mt-1">{Math.min(100, Math.round(progress.fatFireProgress * 100))}% there</p>
        </Card>

        {(profile.baristaPartTimeIncome ?? 0) > 0 && (
          <Card>
            <CardTitle>Barista FIRE</CardTitle>
            <CardValue className="text-rose-600 dark:text-rose-400">{formatCurrency(numbers.baristaFireNumber, true)}</CardValue>
            <CardDescription>
              Semi-retirement: part-time income of {formatCurrency(profile.baristaPartTimeIncome!)}/yr covers daily expenses
              so you withdraw less from your portfolio. Requires a much smaller nest egg than full FIRE.
            </CardDescription>
          </Card>
        )}

      </div>

    </div>
  );
}
