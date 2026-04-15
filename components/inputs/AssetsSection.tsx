"use client";
import { Input } from "@/components/ui/input";
import { Label, HintText } from "@/components/ui/label";
import type { FireProfile } from "@/types/fire";
interface Props { profile: FireProfile; onChange: (patch: Partial<FireProfile>) => void; }
export function AssetsSection({ profile, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-[var(--fg)]">Assets & Contributions</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="currentAssets">Current Invested Assets</Label>
          <Input id="currentAssets" type="number" min={0} prefix="$" value={profile.currentAssets} onChange={(e) => onChange({ currentAssets: parseFloat(e.target.value)||0 })} />
          <HintText>401(k), IRA, taxable brokerage, etc.</HintText>
        </div>
        <div>
          <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
          <Input id="monthlyContribution" type="number" min={0} prefix="$" value={profile.monthlyContribution} onChange={(e) => onChange({ monthlyContribution: parseFloat(e.target.value)||0 })} />
          <HintText>Amount invested each month</HintText>
        </div>
      </div>
      <div>
        <Label htmlFor="baristaIncome">Part-time Income (Barista FIRE)</Label>
        <Input id="baristaIncome" type="number" min={0} prefix="$" value={profile.baristaPartTimeIncome ?? 0} onChange={(e) => onChange({ baristaPartTimeIncome: parseFloat(e.target.value)||0 })} />
        <HintText>Annual income from part-time work in semi-retirement (optional)</HintText>
      </div>
    </div>
  );
}
