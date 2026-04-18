"use client";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatYears } from "@/lib/formatters";
import { calcRelocationOpportunities } from "@/lib/calculations";
import { COL_DATA_UNIQUE, getColForState } from "@/lib/cost-of-living";
import type { FireProfile, FireResults, RelocationOpportunity } from "@/types/fire";
import { MapPin, TrendingDown, TrendingUp } from "lucide-react";
import { COL_DATA_BY_NAME } from "@/lib/cost-of-living";
import type { USState } from "@/types/fire";
interface Props {
  profile: FireProfile;
  baseResults: FireResults;
  onChange: (patch: Partial<FireProfile>) => void;
}
export function RelocationPanel({ profile, baseResults, onChange }: Props) {
  const [showAll, setShowAll] = useState(false);
  const opportunities = useMemo(()=>calcRelocationOpportunities(profile,COL_DATA_UNIQUE,baseResults.timeline.yearsToFire),[profile,baseResults.timeline.yearsToFire]);
  const currentState = getColForState(profile.location);
  const topOpps = opportunities.filter((o)=>o.yearsToFireDelta<-0.5).slice(0,3);
  const displayList = showAll ? opportunities : opportunities.slice(0,15);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--fg)]">Relocation Analysis</h2>
        <p className="text-sm text-[var(--fg-muted)] mt-0.5">How much sooner could you retire by moving to a lower cost-of-living state?</p>
      </div>

      <div>
        <label className="text-sm font-medium text-[var(--fg)] block mb-1">Your Current State</label>
        <select
          value={profile.location}
          onChange={(e) => onChange({ location: e.target.value as USState })}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          {COL_DATA_BY_NAME.map((s) => (
            <option key={s.state} value={s.state}>{s.name}</option>
          ))}
        </select>
      </div>

      {currentState && (
        <Card className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-emerald-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[var(--fg)]">{currentState.name} (Current)</p>
            <p className="text-xs text-[var(--fg-muted)]">CoL Index: {currentState.colIndex} · {formatCurrency(profile.annualExpenses)}/yr · FIRE in {formatYears(baseResults.timeline.yearsToFire)}</p>
          </div>
        </Card>
      )}
      {topOpps.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--fg-muted)] uppercase tracking-wide mb-3">Top Relocation Opportunities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {topOpps.map((opp,i)=><OppCard key={opp.targetState} opp={opp} rank={i+1} />)}
          </div>
        </div>
      )}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[var(--fg)]">All States Comparison</h3>
          <p className="text-xs text-[var(--fg-muted)]">Sorted by years saved</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="text-[var(--fg-muted)] border-b border-[var(--border)]">
              <th className="text-left py-2 pr-3">State</th><th className="text-right py-2 pr-3">CoL</th>
              <th className="text-right py-2 pr-3">Adj. Expenses</th><th className="text-right py-2 pr-3">$/yr saved</th>
              <th className="text-right py-2 pr-3">Time to FIRE</th><th className="text-right py-2">Delta</th>
            </tr></thead>
            <tbody className="divide-y divide-[var(--border)]">
              {displayList.map((opp)=>(
                <tr key={opp.targetState} className="hover:bg-[var(--bg-input)] transition-colors">
                  <td className="py-1.5 pr-3 font-medium text-[var(--fg)]">{opp.targetStateName}</td>
                  <td className="py-1.5 pr-3 text-right text-[var(--fg-muted)]">{opp.colIndex.toFixed(0)}</td>
                  <td className="py-1.5 pr-3 text-right text-[var(--fg)]">{formatCurrency(opp.adjustedExpenses,true)}/yr</td>
                  <td className="py-1.5 pr-3 text-right"><span className={opp.expenseSavingsPerYear>0?"text-emerald-600 dark:text-emerald-400":"text-red-500"}>{opp.expenseSavingsPerYear>0?"+":""}{formatCurrency(opp.expenseSavingsPerYear,true)}</span></td>
                  <td className="py-1.5 pr-3 text-right text-[var(--fg)]">{formatYears(opp.yearsToFire)}</td>
                  <td className="py-1.5 text-right"><DeltaBadge delta={opp.yearsToFireDelta} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!showAll && opportunities.length>15 && <button onClick={()=>setShowAll(true)} className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 hover:underline">Show all {opportunities.length} states</button>}
      </Card>
      <p className="text-xs text-[var(--fg-muted)] italic">Cost-of-living indices based on MERIC 2024 data. Actual savings depend on your specific spending patterns.</p>
    </div>
  );
}
function OppCard({ opp, rank }: { opp: RelocationOpportunity; rank: number }) {
  return (
    <Card className="border-emerald-200 dark:border-emerald-800">
      <div className="flex items-start justify-between mb-1"><span className="text-xs text-[var(--fg-muted)] font-medium">#{rank} Pick</span><Badge variant="green">{Math.abs(opp.yearsToFireDelta).toFixed(1)} yrs sooner</Badge></div>
      <p className="font-bold text-[var(--fg)]">{opp.targetStateName}</p>
      <p className="text-xs text-[var(--fg-muted)] mt-0.5">CoL Index: {opp.colIndex.toFixed(0)}</p>
      <div className="mt-2 space-y-0.5 text-xs">
        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><TrendingDown className="h-3 w-3" />Save {formatCurrency(opp.expenseSavingsPerYear,true)}/yr</div>
        <div className="flex items-center gap-1 text-[var(--fg-muted)]"><TrendingUp className="h-3 w-3" />FIRE in {formatYears(opp.yearsToFire)}</div>
      </div>
    </Card>
  );
}
function DeltaBadge({ delta }: { delta: number }) {
  if (Math.abs(delta)<0.1) return <span className="text-[var(--fg-muted)]">-</span>;
  return <span className={`font-semibold ${delta<0?"text-emerald-600 dark:text-emerald-400":"text-red-500"}`}>{delta<0?"":"+"}{delta.toFixed(1)} yrs</span>;
}
