"use client";
import { NumericInput } from "@/components/ui/numeric-input";
import { HintText } from "@/components/ui/label";
import { FieldLabel } from "@/components/ui/info-tooltip";
import type { FireProfile } from "@/types/fire";

interface Props { profile: FireProfile; onChange: (patch: Partial<FireProfile>) => void; }

export function AssetsSection({ profile, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-[var(--fg)]">Assets &amp; Savings</h2>

      <div>
        <FieldLabel htmlFor="currentAssets" tooltip="Total value of all your investment accounts today: 401k, IRA, Roth IRA, brokerage. Do not include cash savings or checking account balances.">
          Invested Portfolio
        </FieldLabel>
        <NumericInput
          id="currentAssets"
          value={profile.currentAssets}
          onChange={(v) => onChange({ currentAssets: v })}
          min={0}
          prefix="$"
        />
        <HintText>401(k), IRA, Roth IRA, taxable brokerage. Anything invested for the long term.</HintText>
      </div>

      <div>
        <FieldLabel htmlFor="monthlyContribution" tooltip="How much you invest each month across all accounts. This is the most powerful lever for reaching FIRE faster.">
          Monthly Investment Contribution
        </FieldLabel>
        <NumericInput
          id="monthlyContribution"
          value={profile.monthlyContribution}
          onChange={(v) => onChange({ monthlyContribution: v })}
          min={0}
          prefix="$"
        />
      </div>
    </div>
  );
}
