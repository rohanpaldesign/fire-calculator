"use client";
import { Input } from "@/components/ui/input";
import { Label, HintText } from "@/components/ui/label";
import type { FireProfile } from "@/types/fire";
interface Props { profile: FireProfile; onChange: (patch: Partial<FireProfile>) => void; }
export function AssumptionsSection({ profile, onChange }: Props) {
  const handleReturn = (nominal: number) => onChange({ nominalReturn: nominal, realReturn: nominal - profile.inflationRate });
  const handleInflation = (inflation: number) => onChange({ inflationRate: inflation, realReturn: profile.nominalReturn - inflation });
  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-[var(--fg)]">Assumptions</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nominalReturn">Expected Annual Return</Label>
          <Input id="nominalReturn" type="number" min={0} max={30} step={0.1} prefix="%" value={(profile.nominalReturn*100).toFixed(1)} onChange={(e)=>handleReturn((parseFloat(e.target.value)||10)/100)} />
          <HintText>Nominal (before inflation). Default: 10%</HintText>
        </div>
        <div>
          <Label htmlFor="inflation">Inflation Rate</Label>
          <Input id="inflation" type="number" min={0} max={20} step={0.1} prefix="%" value={(profile.inflationRate*100).toFixed(1)} onChange={(e)=>handleInflation((parseFloat(e.target.value)||3)/100)} />
          <HintText>Default: 3%</HintText>
        </div>
        <div>
          <Label>Real Return (auto-calculated)</Label>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--fg-muted)]">{(profile.realReturn*100).toFixed(1)}% (nominal − inflation)</div>
        </div>
        <div>
          <Label htmlFor="swr">Safe Withdrawal Rate</Label>
          <Input id="swr" type="number" min={0.1} max={10} step={0.1} prefix="%" value={(profile.safeWithdrawalRate*100).toFixed(1)} onChange={(e)=>onChange({ safeWithdrawalRate:(parseFloat(e.target.value)||4)/100 })} />
          <HintText>4% is the classic rule. 3.5% is more conservative.</HintText>
        </div>
      </div>
    </div>
  );
}
