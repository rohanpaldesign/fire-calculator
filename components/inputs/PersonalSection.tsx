"use client";
import { NumericInput } from "@/components/ui/numeric-input";
import { HintText } from "@/components/ui/label";
import type { FireProfile } from "@/types/fire";

interface Props { profile: FireProfile; onChange: (patch: Partial<FireProfile>) => void; }

export function PersonalSection({ profile, onChange }: Props) {
  const yearsToRetirement = profile.retirementAge - profile.currentAge;
  const safeTargetCoastAge = Math.max(profile.currentAge + 1, Math.min(profile.targetCoastAge, profile.retirementAge - 1));

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-[var(--fg)]">Personal</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="currentAge" className="block text-sm font-medium text-[var(--fg)] mb-1">Current Age</label>
          <NumericInput
            id="currentAge"
            value={profile.currentAge}
            onChange={(v) => {
              const age = Math.max(18, Math.min(80, Math.round(v)));
              onChange({
                currentAge: age,
                retirementAge: Math.max(profile.retirementAge, age + 2),
                targetCoastAge: Math.max(safeTargetCoastAge, age + 1),
              });
            }}
            min={18}
            max={80}
          />
        </div>
        <div>
          <label htmlFor="retirementAge" className="block text-sm font-medium text-[var(--fg)] mb-1">Target Retirement Age</label>
          <NumericInput
            id="retirementAge"
            value={profile.retirementAge}
            onChange={(v) => {
              const ret = Math.max(profile.currentAge + 2, Math.round(v));
              onChange({ retirementAge: ret, targetCoastAge: Math.min(safeTargetCoastAge, ret - 1) });
            }}
            min={profile.currentAge + 2}
            max={90}
          />
          {yearsToRetirement > 0 && (
            <HintText>{yearsToRetirement} years from now{profile.retirementAge < 60 ? " · Early retirement!" : ""}</HintText>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="targetCoastAge" className="block text-sm font-medium text-[var(--fg)] mb-1">Target Coasting Age</label>
        <p className="text-xs text-[var(--fg-muted)] mb-1.5">
          The age at which you plan to stop making new contributions and let your portfolio grow on its own.
        </p>
        <NumericInput
          id="targetCoastAge"
          value={profile.targetCoastAge}
          onChange={(v) => {
            const coast = Math.max(profile.currentAge + 1, Math.min(Math.round(v), profile.retirementAge - 1));
            onChange({ targetCoastAge: coast });
          }}
          min={profile.currentAge + 1}
          max={profile.retirementAge - 1}
        />
        <HintText>
          Must be between age {profile.currentAge + 1} and {profile.retirementAge - 1}.
          {profile.targetCoastAge < profile.retirementAge
            ? " " + (profile.targetCoastAge - profile.currentAge) + " years from now."
            : ""}
        </HintText>
      </div>
    </div>
  );
}
