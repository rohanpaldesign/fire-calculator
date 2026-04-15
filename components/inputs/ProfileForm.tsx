"use client";
import { PersonalSection } from "./PersonalSection";
import { IncomeSection } from "./IncomeSection";
import { ExpensesSection } from "./ExpensesSection";
import { RetirementExpensesSection } from "./RetirementExpensesSection";
import { AssetsSection } from "./AssetsSection";
import { AssumptionsSection } from "./AssumptionsSection";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatYears } from "@/lib/formatters";
import type { FireProfile, FireResults } from "@/types/fire";
import { ArrowRight, TrendingUp } from "lucide-react";

interface Props {
  profile: FireProfile;
  results: FireResults;
  onChange: (patch: Partial<FireProfile>) => void;
  onViewResults: () => void;
}

export function ProfileForm({ profile, results, onChange, onViewResults }: Props) {
  const { numbers, progress, timeline } = results;

  return (
    <div className="space-y-8">
      <PersonalSection profile={profile} onChange={onChange} />
      <hr className="border-[var(--border)]" />
      <IncomeSection profile={profile} onChange={onChange} />
      <hr className="border-[var(--border)]" />
      <ExpensesSection profile={profile} onChange={onChange} />
      <hr className="border-[var(--border)]" />
      <RetirementExpensesSection profile={profile} onChange={onChange} />
      <hr className="border-[var(--border)]" />
      <AssetsSection profile={profile} onChange={onChange} />
      <hr className="border-[var(--border)]" />
      <AssumptionsSection profile={profile} onChange={onChange} />

      {/* Live FIRE preview */}
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Live FIRE Preview</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <PreviewStat label="FIRE Number" value={formatCurrency(numbers.fireNumber, true)} />
          <PreviewStat label="Coast FIRE" value={formatCurrency(numbers.coastFireNumber, true)} />
          <PreviewStat label="Time to FIRE" value={formatYears(timeline.yearsToFire)} />
          <PreviewStat
            label="Progress"
            value={Math.min(100, Math.round(progress.fireProgress * 100)) + "%"}
          />
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-emerald-200 dark:bg-emerald-800">
          <div
            className="h-2 rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: Math.min(100, progress.fireProgress * 100) + "%" }}
          />
        </div>
      </div>

      <Button onClick={onViewResults} size="lg" className="w-full">
        View Full Results and Charts
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-emerald-600 dark:text-emerald-500">{label}</p>
      <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">{value}</p>
    </div>
  );
}
