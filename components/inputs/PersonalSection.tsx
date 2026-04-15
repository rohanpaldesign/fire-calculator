"use client";
import { NumericInput } from "@/components/ui/numeric-input";
import { HintText } from "@/components/ui/label";
import { FieldLabel } from "@/components/ui/info-tooltip";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { COL_DATA_BY_NAME } from "@/lib/cost-of-living";
import type { FireProfile, USState } from "@/types/fire";

interface Props { profile: FireProfile; onChange: (patch: Partial<FireProfile>) => void; }

export function PersonalSection({ profile, onChange }: Props) {
  const yearsToRetirement = profile.retirementAge - profile.currentAge;
  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-[var(--fg)]">Personal</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel htmlFor="currentAge" tooltip="Your current age. Used to calculate how many years until you reach FIRE.">
            Current Age
          </FieldLabel>
          <NumericInput
            id="currentAge"
            value={profile.currentAge}
            onChange={(v) => {
              const age = Math.max(18, Math.min(80, Math.round(v)));
              onChange({ currentAge: age, retirementAge: Math.max(profile.retirementAge, age + 1) });
            }}
            min={18}
            max={80}
          />
        </div>
        <div>
          <FieldLabel htmlFor="retirementAge" tooltip="The age you want to stop working. Early FIRE targets age 35–50; traditional retirement is 65.">
            Target Retirement Age
          </FieldLabel>
          <NumericInput
            id="retirementAge"
            value={profile.retirementAge}
            onChange={(v) => onChange({ retirementAge: Math.max(profile.currentAge + 1, Math.round(v)) })}
            min={profile.currentAge + 1}
            max={90}
          />
          {yearsToRetirement > 0 && (
            <HintText>{yearsToRetirement} years from now{profile.retirementAge < 60 ? " · Early retirement!" : ""}</HintText>
          )}
        </div>
      </div>

      <div>
        <FieldLabel tooltip="How you file your taxes. Married filing jointly typically has lower effective tax rates.">
          Filing Status
        </FieldLabel>
        <div className="flex gap-3">
          {(["single", "married"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange({ filingStatus: s })}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                profile.filingStatus === s
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                  : "border-[var(--border)] text-[var(--fg-muted)] hover:border-emerald-300"
              }`}
            >
              {s === "single" ? "Single" : "Married / MFJ"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="location" tooltip="Your US state. Affects cost-of-living adjustments and state income tax estimates.">
          State
        </FieldLabel>
        <Select value={profile.location} onValueChange={(v) => onChange({ location: v as USState })}>
          <SelectTrigger id="location"><SelectValue placeholder="Select state" /></SelectTrigger>
          <SelectContent>
            {COL_DATA_BY_NAME.map((s) => (
              <SelectItem key={s.state} value={s.state}>{s.name} ({s.state})</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <HintText>Used for take-home estimation and cost-of-living comparison.</HintText>
      </div>
    </div>
  );
}
