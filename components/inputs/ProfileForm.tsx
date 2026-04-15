"use client";
import { PersonalSection } from "./PersonalSection";
import { IncomeSection } from "./IncomeSection";
import { ExpensesSection } from "./ExpensesSection";
import { AssetsSection } from "./AssetsSection";
import { AssumptionsSection } from "./AssumptionsSection";
import { Button } from "@/components/ui/button";
import type { FireProfile } from "@/types/fire";
import { ArrowRight } from "lucide-react";
interface Props { profile: FireProfile; onChange: (patch: Partial<FireProfile>) => void; onViewResults: () => void; }
export function ProfileForm({ profile, onChange, onViewResults }: Props) {
  return (
    <div className="space-y-8">
      <PersonalSection profile={profile} onChange={onChange} />
      <hr className="border-[var(--border)]" />
      <IncomeSection profile={profile} onChange={onChange} />
      <hr className="border-[var(--border)]" />
      <ExpensesSection profile={profile} onChange={onChange} />
      <hr className="border-[var(--border)]" />
      <AssetsSection profile={profile} onChange={onChange} />
      <hr className="border-[var(--border)]" />
      <AssumptionsSection profile={profile} onChange={onChange} />
      <div className="pt-2">
        <Button onClick={onViewResults} size="lg" className="w-full sm:w-auto">
          Calculate My FIRE Number <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
