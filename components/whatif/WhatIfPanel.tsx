"use client";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatYears, formatPercent } from "@/lib/formatters";
import { calcFireResults, calcAutoRetirementExpenses } from "@/lib/calculations";
import type { FireProfile, FireResults } from "@/types/fire";

interface Props { profile: FireProfile; baseResults: FireResults; }

export function WhatIfPanel({ profile, baseResults }: Props) {
  const baseRetirementExpenses = profile.retirementExpensesMode === "auto"
    ? calcAutoRetirementExpenses(profile)
    : profile.retirementExpenses;

  const [monthlyContrib, setMonthlyContrib] = useState(profile.monthlyContribution);
  const [retirementExpenses, setRetirementExpenses] = useState(baseRetirementExpenses);
  const [realReturn, setRealReturn] = useState(profile.realReturn);

  const whatIfResults = calcFireResults(profile, { monthlyContribution: monthlyContrib, retirementExpenses, realReturn });
  const baseYears = baseResults.timeline.yearsToFire;
  const whatIfYears = whatIfResults.timeline.yearsToFire;
  const delta = baseYears !== null && whatIfYears !== null ? whatIfYears - baseYears : null;
  const deltaLabel = delta === null ? "—" : delta < -0.1 ? Math.abs(delta).toFixed(1) + " yrs sooner" : delta > 0.1 ? delta.toFixed(1) + " yrs later" : "No change";
  const deltaVariant = delta === null ? "muted" : delta < -0.1 ? "green" : delta > 0.1 ? "red" : "muted";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--fg)]">What-If Analysis</h2>
        <p className="text-sm text-[var(--fg-muted)] mt-0.5">Move the sliders to see how changes affect your FIRE date. These do not save to your profile.</p>
      </div>
      <Card className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[var(--fg-muted)] uppercase tracking-wide font-semibold">Adjusted FIRE Timeline</p>
          <p className="text-2xl font-bold text-[var(--fg)] mt-0.5">{formatYears(whatIfYears)}</p>
          <p className="text-xs text-[var(--fg-muted)] mt-0.5">Base: {formatYears(baseYears)}</p>
        </div>
        <Badge variant={deltaVariant} className="text-sm px-3 py-1">{deltaLabel}</Badge>
      </Card>
      <div className="space-y-6">
        <SliderRow
          label="Monthly Contribution"
          value={monthlyContrib}
          min={0}
          max={Math.max(10000, profile.monthlyContribution * 3)}
          step={100}
          format={(v) => formatCurrency(v) + "/mo"}
          baseline={profile.monthlyContribution}
          onChange={setMonthlyContrib}
        />
        <SliderRow
          label="Retirement Expenses"
          value={retirementExpenses}
          min={Math.max(5000, baseRetirementExpenses * 0.3)}
          max={baseRetirementExpenses * 2}
          step={1000}
          format={(v) => formatCurrency(v) + "/yr"}
          baseline={baseRetirementExpenses}
          onChange={setRetirementExpenses}
        />
        <SliderRow
          label="Expected Real Return"
          value={realReturn}
          min={0.02}
          max={0.15}
          step={0.005}
          format={(v) => formatPercent(v)}
          baseline={profile.realReturn}
          onChange={setRealReturn}
        />
      </div>
      <Card>
        <h3 className="text-sm font-semibold text-[var(--fg)] mb-3">Scenario Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[var(--fg-muted)] border-b border-[var(--border)]">
                <th className="text-left py-2 pr-4">Metric</th>
                <th className="text-right py-2 pr-4">Your Plan</th>
                <th className="text-right py-2">What-If</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              <Row label="FIRE Number" base={formatCurrency(baseResults.numbers.fireNumber, true)} whatif={formatCurrency(whatIfResults.numbers.fireNumber, true)} />
              <Row label="Time to FIRE" base={formatYears(baseResults.timeline.yearsToFire)} whatif={formatYears(whatIfResults.timeline.yearsToFire)} highlight />
              <Row label="Coast FIRE Number" base={formatCurrency(baseResults.numbers.coastFireNumber, true)} whatif={formatCurrency(whatIfResults.numbers.coastFireNumber, true)} />
              <Row label="Monthly Contribution" base={formatCurrency(profile.monthlyContribution)} whatif={formatCurrency(monthlyContrib)} />
              <Row label="Retirement Expenses" base={formatCurrency(baseRetirementExpenses) + "/yr"} whatif={formatCurrency(retirementExpenses) + "/yr"} />
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function SliderRow({ label, value, min, max, step, format, baseline, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; baseline: number; onChange: (v: number) => void;
}) {
  const delta = value - baseline;
  const pct = baseline !== 0 ? (delta / baseline) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-[var(--fg)]">{label}</label>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--fg)]">{format(value)}</span>
          {Math.abs(pct) > 0.5 && (
            <Badge variant={pct > 0 ? "green" : "red"} className="text-xs">
              {pct > 0 ? "+" : ""}{pct.toFixed(0)}%
            </Badge>
          )}
        </div>
      </div>
      <Slider min={min} max={max} step={step} value={[value]} onValueChange={([v]) => onChange(v)} />
      <div className="flex justify-between text-xs text-[var(--fg-muted)] mt-0.5">
        <span>{format(min)}</span><span>Base: {format(baseline)}</span><span>{format(max)}</span>
      </div>
    </div>
  );
}

function Row({ label, base, whatif, highlight }: { label: string; base: string; whatif: string; highlight?: boolean }) {
  return (
    <tr className={highlight ? "font-semibold" : ""}>
      <td className="py-2 pr-4 text-[var(--fg-muted)] text-xs">{label}</td>
      <td className="py-2 pr-4 text-right text-[var(--fg)] text-xs">{base}</td>
      <td className={"py-2 text-right text-xs " + (base !== whatif ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-[var(--fg)]")}>{whatif}</td>
    </tr>
  );
}
