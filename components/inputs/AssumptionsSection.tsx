"use client";
import { NumericInput } from "@/components/ui/numeric-input";
import { HintText } from "@/components/ui/label";
import { FieldLabel } from "@/components/ui/info-tooltip";
import type { FireProfile } from "@/types/fire";

interface Props { profile: FireProfile; onChange: (patch: Partial<FireProfile>) => void; }

const PRESETS = [
  { label: "Conservative", nominalReturn: 0.06, inflation: 0.03, swr: 0.035 },
  { label: "Moderate", nominalReturn: 0.08, inflation: 0.03, swr: 0.04 },
  { label: "Aggressive", nominalReturn: 0.10, inflation: 0.03, swr: 0.04 },
] as const;

export function AssumptionsSection({ profile, onChange }: Props) {
  const currentPreset = PRESETS.find(
    (p) =>
      Math.abs(p.nominalReturn - profile.nominalReturn) < 0.005 &&
      Math.abs(p.inflation - profile.inflationRate) < 0.005 &&
      Math.abs(p.swr - profile.safeWithdrawalRate) < 0.005,
  );

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-[var(--fg)]">Growth Assumptions</h2>

      <div>
        <FieldLabel tooltip="Quick starting points. Conservative uses 6% return (bonds-heavy), Moderate 8% (balanced), Aggressive 10% (stock-heavy, S&P 500 historical average).">
          Quick Presets
        </FieldLabel>
        <div className="flex gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => onChange({
                nominalReturn: p.nominalReturn,
                inflationRate: p.inflation,
                safeWithdrawalRate: p.swr,
                realReturn: p.nominalReturn - p.inflation,
              })}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                currentPreset?.label === p.label
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                  : "border-[var(--border)] text-[var(--fg-muted)] hover:border-emerald-300"
              }`}
            >
              {p.label}
              <span className="block text-[10px] opacity-70">{(p.nominalReturn * 100).toFixed(0)}% return</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel htmlFor="nominalReturn" tooltip="Expected average annual investment return before accounting for inflation. The S&P 500 has historically averaged ~10% per year. Used to project portfolio growth in dollar terms.">
            Expected Annual Return
          </FieldLabel>
          <NumericInput
            id="nominalReturn"
            value={profile.nominalReturn * 100}
            onChange={(pct) => {
              const nominal = pct / 100;
              onChange({ nominalReturn: nominal, realReturn: nominal - profile.inflationRate });
            }}
            min={0}
            max={30}
            decimals={1}
            suffix="%"
          />
          <HintText>Nominal (before inflation). S&P 500 historical avg ~10%.</HintText>
        </div>
        <div>
          <FieldLabel htmlFor="inflation" tooltip="The expected annual rise in prices. The US Federal Reserve targets 2%. Recent years have averaged closer to 3%. Higher inflation erodes your purchasing power.">
            Inflation Rate
          </FieldLabel>
          <NumericInput
            id="inflation"
            value={profile.inflationRate * 100}
            onChange={(pct) => {
              const inflation = pct / 100;
              onChange({ inflationRate: inflation, realReturn: profile.nominalReturn - inflation });
            }}
            min={0}
            max={20}
            decimals={1}
            suffix="%"
          />
          <HintText>Fed long-run target is 2%. Recent avg ~3%.</HintText>
        </div>
        <div>
          <FieldLabel tooltip="Annual return minus inflation: what your portfolio actually earns in today's dollars. Used to calculate your FIRE and Coast FIRE numbers in current purchasing power.">
            Real Return
          </FieldLabel>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            {(profile.realReturn * 100).toFixed(1)}%
            <span className="text-xs text-[var(--fg-muted)] font-normal ml-1">(nominal − inflation)</span>
          </div>
          <HintText>Used to calculate FIRE &amp; Coast FIRE numbers in today&apos;s dollars.</HintText>
        </div>
        <div>
          <FieldLabel htmlFor="swr" tooltip="What percentage of your portfolio you withdraw each year in retirement. The classic '4% Rule' from the Trinity Study suggests 4% survives 30+ years. Use 3.5% for a longer horizon or extra safety margin.">
            Safe Withdrawal Rate
          </FieldLabel>
          <NumericInput
            id="swr"
            value={profile.safeWithdrawalRate * 100}
            onChange={(pct) => onChange({ safeWithdrawalRate: pct / 100 })}
            min={1}
            max={10}
            decimals={1}
            suffix="%"
          />
          <HintText>4% = classic rule. 3.5% = conservative. FIRE # = Expenses ÷ SWR.</HintText>
        </div>
      </div>
    </div>
  );
}
