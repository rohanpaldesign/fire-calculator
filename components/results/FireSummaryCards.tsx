"use client";
import { Card, CardTitle, CardValue, CardDescription } from "@/components/ui/card";
import { EditableValue } from "@/components/ui/editable-value";
import { ProgressRing } from "./ProgressRing";
import { formatCurrency } from "@/lib/formatters";
import type { FireResults, FireProfile } from "@/types/fire";

interface Props {
  results: FireResults;
  profile: FireProfile;
  onChange?: (patch: Partial<FireProfile>) => void;
}

export function FireSummaryCards({ results, profile, onChange }: Props) {
  const { numbers, progress, timeline } = results;

  const fireYear = timeline.fireDate ? timeline.fireDate.getFullYear() : null;
  const yearsFromNow = timeline.yearsToFire !== null ? Math.ceil(timeline.yearsToFire) : null;
  const coastAtTargetPct = Math.min(100, Math.round((profile.currentAssets / numbers.coastFireAtTargetAge) * 100));

  return (
    <div className="space-y-4">

      {/* ── Row 1: Retirement Goal · Current Monthly Investment ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Card>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle>Retirement Goal</CardTitle>
              <CardValue className="text-[var(--fg)]">
                <EditableValue
                  value={profile.retirementAge}
                  display={String(profile.retirementAge)}
                  min={profile.currentAge + 2}
                  max={90}
                  onChange={(v) => onChange?.({ retirementAge: v })}
                  inputWidth="w-16"
                />
              </CardValue>
              <CardDescription>Target age to stop working</CardDescription>
              <div className="mt-3 pt-3 border-t border-[var(--border)]">
                <p className="text-xs font-semibold text-[var(--fg)] mb-0.5">FIRE Number</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(numbers.fireNumber, true)}</p>
                <p className="text-xs text-[var(--fg-muted)] mt-0.5">
                  Portfolio needed at {(profile.safeWithdrawalRate * 100).toFixed(1)}% SWR &middot; today&apos;s dollars
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <ProgressRing progress={progress.fireProgress} label="FIRE" size={90} />
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle>Current Monthly Investment</CardTitle>
          <CardValue className="text-[var(--fg)]">
            <EditableValue
              value={profile.monthlyContribution}
              display={formatCurrency(profile.monthlyContribution)}
              min={0}
              onChange={(v) => onChange?.({ monthlyContribution: v })}
              inputWidth="w-24"
            />
          </CardValue>
          <CardDescription>Current contribution rate. Both projections below assume this amount.</CardDescription>

          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[var(--border)]">

            {/* Predicted Coast Age */}
            <div>
              <p className="text-xs font-semibold text-[var(--fg)] mb-1">Predicted Coast Age</p>
              {timeline.predictedCoastAge !== null ? (
                <>
                  <p className={`text-xl font-bold ${timeline.predictedCoastAge <= profile.targetCoastAge ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                    Age {timeline.predictedCoastAge}
                  </p>
                  <p className="text-xs text-[var(--fg-muted)] mt-0.5">
                    {timeline.predictedCoastAge <= profile.currentAge
                      ? "Can coast now"
                      : timeline.predictedCoastAge <= profile.targetCoastAge
                      ? `${timeline.predictedCoastAge - profile.currentAge}yr \u00b7 on track`
                      : `${timeline.predictedCoastAge - profile.currentAge}yr \u00b7 ${timeline.predictedCoastAge - profile.targetCoastAge}yr late`}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400">-</p>
                  <p className="text-xs text-[var(--fg-muted)] mt-0.5">Not on track</p>
                </>
              )}
            </div>

            {/* Time to FIRE */}
            <div>
              <p className="text-xs font-semibold text-[var(--fg)] mb-1">Time to FIRE</p>
              {timeline.yearsToFire !== null ? (
                <>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">~{fireYear}</p>
                  <p className="text-xs text-[var(--fg-muted)] mt-0.5">
                    {timeline.fireAge !== null ? `Age ${timeline.fireAge} \u00b7 ` : ""}{yearsFromNow === 1 ? "1yr" : `${yearsFromNow}yr`}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400">-</p>
                  <p className="text-xs text-[var(--fg-muted)] mt-0.5">Not achievable</p>
                </>
              )}
            </div>

          </div>
        </Card>

      </div>

      {/* ── Row 2: Coast FIRE Today · Coast Goals ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Card>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle>Coast FIRE Today</CardTitle>
              <CardValue className="text-indigo-600 dark:text-indigo-400">{formatCurrency(numbers.coastFireNumber, true)}</CardValue>
              <CardDescription>
                If you stopped contributing right now, compound growth alone would reach your FIRE number by age {profile.retirementAge}.
              </CardDescription>
            </div>
            <div className="shrink-0">
              <ProgressRing progress={progress.coastFireProgress} label="Coast FIRE" size={90} />
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle>Coast Goals</CardTitle>
          <CardDescription>
            Your plan to stop contributing at age {profile.targetCoastAge} and let compound growth cover the rest to retirement at age {profile.retirementAge}.
          </CardDescription>
          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[var(--border)]">
            <div>
              <p className="text-xs font-semibold text-[var(--fg)] mb-0.5">Target Coasting Age</p>
              <EditableValue
                value={profile.targetCoastAge}
                display={String(profile.targetCoastAge)}
                min={profile.currentAge + 1}
                max={profile.retirementAge - 1}
                onChange={(v) => onChange?.({ targetCoastAge: v })}
                className="text-2xl font-bold text-[var(--fg)]"
                inputWidth="w-16"
              />
              <p className="text-xs text-[var(--fg-muted)] mt-0.5">Age to stop new contributions</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--fg)] mb-0.5">Coast Target at {profile.targetCoastAge}</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(numbers.coastFireAtTargetAge, true)}</p>
              <p className="text-xs text-[var(--fg-muted)] mt-0.5">Needed to coast to FIRE by {profile.retirementAge}</p>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-[var(--border)]">
                <div className="h-1.5 rounded-full bg-indigo-400 transition-all duration-500" style={{ width: `${coastAtTargetPct}%` }} />
              </div>
              <p className="text-xs text-[var(--fg-muted)] mt-0.5">{coastAtTargetPct}% reached today</p>
            </div>
          </div>
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
                <th className="pb-2 pr-4 align-top">
                  <p className="text-xs font-semibold text-[var(--fg)]">On-Track Goal</p>
                  <p className="text-xs font-normal text-[var(--fg-muted)]">What you should have at this age if investing the recommended amount to reach your coast target by age {profile.targetCoastAge}</p>
                </th>
                <th className="pb-2 align-top">
                  <p className="text-xs font-semibold text-[var(--fg)]">Annual Target Investment</p>
                  <p className="text-xs font-normal text-[var(--fg-muted)]">How much your portfolio needs to grow this year to be on track at the next age (contributions + returns)</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {timeline.coastByAge.map((pt, i) => {
                const nextBenchmark = i < timeline.coastByAge.length - 1 ? timeline.coastByAge[i + 1].onTrackBenchmark : null;
                const annualStep = nextBenchmark !== null ? nextBenchmark - pt.onTrackBenchmark : null;
                return (
                <tr
                  key={pt.age}
                  className={`border-b border-[var(--border)] last:border-0 ${pt.canCoast ? "bg-emerald-50/40 dark:bg-emerald-950/20" : ""}`}
                >
                  <td className="py-2 pr-4 font-medium text-[var(--fg)]">{pt.age}</td>
                  <td className="py-2 pr-4 text-[var(--fg-muted)]">{formatCurrency(pt.coastTarget, true)}</td>
                  <td className="py-2 pr-4 text-[var(--fg)]">{formatCurrency(pt.portfolio, true)}</td>
                  <td className="py-2 pr-4">
                    <p className={`text-xs font-medium ${pt.portfolio >= pt.onTrackBenchmark ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                      {formatCurrency(pt.onTrackBenchmark, true)}
                    </p>
                    <p className="text-xs text-[var(--fg-muted)]">
                      {pt.portfolio >= pt.onTrackBenchmark
                        ? `+${formatCurrency(pt.portfolio - pt.onTrackBenchmark, true)} ahead`
                        : `${formatCurrency(pt.onTrackBenchmark - pt.portfolio, true)} behind`}
                    </p>
                  </td>
                  <td className="py-2">
                    {annualStep !== null
                      ? <span className="text-xs font-medium text-[var(--fg)]">{formatCurrency(annualStep, true)}</span>
                      : <span className="text-xs text-[var(--fg-muted)]">-</span>
                    }
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>


    </div>
  );
}
