"use client";
import { NumericInput } from "@/components/ui/numeric-input";
import { HintText } from "@/components/ui/label";
import { FieldLabel } from "@/components/ui/info-tooltip";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import type { FireProfile } from "@/types/fire";

interface Props { profile: FireProfile; onChange: (patch: Partial<FireProfile>) => void; }

export function AssetsSection({ profile, onChange }: Props) {
  const maxSavable = profile.netIncome > 0
    ? Math.max(0, Math.round((profile.netIncome - profile.annualExpenses) / 12))
    : null;

  const isUsingMax = maxSavable !== null && Math.abs(profile.monthlyContribution - maxSavable) < 10;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-[var(--fg)]">Assets & Savings</h2>

      <div>
        <FieldLabel htmlFor="currentAssets" tooltip="Total value of all your investment accounts today — 401k, IRA, Roth IRA, brokerage. Don't include cash savings or checking account balances.">
          Current Invested Assets
        </FieldLabel>
        <NumericInput
          id="currentAssets"
          value={profile.currentAssets}
          onChange={(v) => onChange({ currentAssets: v })}
          min={0}
          prefix="$"
        />
        <HintText>401(k), IRA, Roth IRA, taxable brokerage — anything invested for the long term.</HintText>
      </div>

      <div>
        <FieldLabel htmlFor="monthlyContribution" tooltip="How much you invest each month across all accounts. This is the most powerful lever for reaching FIRE faster — a higher contribution rate means compounding works harder for you.">
          Monthly Investment Contribution
        </FieldLabel>
        <NumericInput
          id="monthlyContribution"
          value={profile.monthlyContribution}
          onChange={(v) => onChange({ monthlyContribution: v })}
          min={0}
          prefix="$"
        />
        {maxSavable !== null && (
          <div className="mt-1.5 flex items-center gap-2">
            <HintText className="mt-0">
              Based on your income &amp; expenses you could invest up to {formatCurrency(maxSavable)}/mo.
            </HintText>
            {!isUsingMax && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-emerald-600 dark:text-emerald-400 px-2 py-0.5 h-auto"
                onClick={() => onChange({ monthlyContribution: maxSavable })}
              >
                Use max →
              </Button>
            )}
          </div>
        )}
      </div>

      <div>
        <FieldLabel htmlFor="baristaIncome" tooltip="Annual income from part-time work in semi-retirement (e.g. a barista job, consulting, freelance). This reduces how large your portfolio needs to be — you only need your investments to cover the gap between this income and your expenses.">
          Part-time Income in Semi-Retirement <span className="text-[var(--fg-muted)] font-normal">(Barista FIRE)</span>
        </FieldLabel>
        <NumericInput
          id="baristaIncome"
          value={profile.baristaPartTimeIncome ?? 0}
          onChange={(v) => onChange({ baristaPartTimeIncome: v })}
          min={0}
          prefix="$"
          placeholder="0"
        />
        <HintText>Annual income from part-time work — reduces the portfolio you need. Leave at 0 to skip.</HintText>
      </div>
    </div>
  );
}
