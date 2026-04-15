"use client";
import { Input } from "@/components/ui/input";
import { Label, HintText } from "@/components/ui/label";
import type { FireProfile } from "@/types/fire";
interface Props { profile: FireProfile; onChange: (patch: Partial<FireProfile>) => void; }
export function IncomeSection({ profile, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-[var(--fg)]">Income</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="grossIncome">Gross Annual Income</Label>
          <Input id="grossIncome" type="number" min={0} prefix="$" value={profile.grossIncome} onChange={(e) => onChange({ grossIncome: parseFloat(e.target.value)||0 })} />
          <HintText>Before taxes</HintText>
        </div>
        <div>
          <Label htmlFor="netIncome">Net Annual Income</Label>
          <Input id="netIncome" type="number" min={0} prefix="$" value={profile.netIncome} onChange={(e) => onChange({ netIncome: parseFloat(e.target.value)||0 })} />
          <HintText>Take-home after taxes</HintText>
        </div>
      </div>
      {profile.netIncome > 0 && profile.annualExpenses > 0 && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          Savings rate: {(((profile.netIncome - profile.annualExpenses) / profile.netIncome) * 100).toFixed(1)}% — saving ${((profile.netIncome - profile.annualExpenses) / 12).toFixed(0)}/mo after expenses
        </p>
      )}
    </div>
  );
}
