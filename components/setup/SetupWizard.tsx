"use client";
import { useState } from "react";
import { NumericInput } from "@/components/ui/numeric-input";
import { HintText } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ExpensesSection } from "@/components/inputs/ExpensesSection";
import { RetirementExpensesSection } from "@/components/inputs/RetirementExpensesSection";
import { AssumptionsSection } from "@/components/inputs/AssumptionsSection";
import { X } from "lucide-react";
import type { FireProfile } from "@/types/fire";

interface Props {
  profile: FireProfile;
  onChange: (patch: Partial<FireProfile>) => void;
  onComplete: () => void;
  onClose?: () => void;
  isFirstTime?: boolean;
}

const STEPS = ["Personal", "Finances", "Assumptions"];

export function SetupWizard({ profile, onChange, onComplete, onClose, isFirstTime = false }: Props) {
  const [step, setStep] = useState(0);

  const safeTargetCoastAge = Math.max(
    profile.currentAge + 1,
    Math.min(profile.targetCoastAge, profile.retirementAge - 1),
  );

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else onComplete();
  }
  function back() { if (step > 0) setStep((s) => s - 1); }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
      <div className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[var(--fg)]">
              {isFirstTime ? "Set Up Your FIRE Plan" : "Edit All Inputs"}
            </h2>
            <p className="text-xs text-[var(--fg-muted)] mt-0.5">
              Step {step + 1} of {STEPS.length}: {STEPS[step]}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--border)] transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-[var(--fg-muted)]" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 px-6 pb-4 shrink-0">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                i <= step ? "bg-emerald-500" : "bg-[var(--border)]"
              }`}
            />
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 pb-2">

          {/* Step 1: Personal */}
          {step === 0 && (
            <div className="space-y-5 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--fg)] mb-1">Current Age</label>
                  <NumericInput
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
                  <label className="block text-sm font-medium text-[var(--fg)] mb-1">Target Retirement Age</label>
                  <NumericInput
                    value={profile.retirementAge}
                    onChange={(v) => {
                      const ret = Math.max(profile.currentAge + 2, Math.round(v));
                      onChange({ retirementAge: ret, targetCoastAge: Math.min(safeTargetCoastAge, ret - 1) });
                    }}
                    min={profile.currentAge + 2}
                    max={90}
                  />
                  <HintText>{profile.retirementAge - profile.currentAge} years from now</HintText>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--fg)] mb-1">Target Coasting Age</label>
                <p className="text-xs text-[var(--fg-muted)] mb-1.5">
                  The age at which you plan to stop making new contributions and let your portfolio grow on its own.
                </p>
                <NumericInput
                  value={profile.targetCoastAge}
                  onChange={(v) => {
                    const coast = Math.max(profile.currentAge + 1, Math.min(Math.round(v), profile.retirementAge - 1));
                    onChange({ targetCoastAge: coast });
                  }}
                  min={profile.currentAge + 1}
                  max={profile.retirementAge - 1}
                />
                <HintText>
                  Between age {profile.currentAge + 1} and {profile.retirementAge - 1} &middot;{" "}
                  {profile.targetCoastAge - profile.currentAge} years from now
                </HintText>
              </div>
            </div>
          )}

          {/* Step 2: Finances */}
          {step === 1 && (
            <div className="space-y-5 py-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--fg)] mb-1">Invested Portfolio</label>
                  <p className="text-xs text-[var(--fg-muted)] mb-1.5">
                    Total in 401(k), IRA, Roth IRA, brokerage. Anything invested for the long term.
                  </p>
                  <NumericInput
                    value={profile.currentAssets}
                    onChange={(v) => onChange({ currentAssets: v })}
                    min={0}
                    prefix="$"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--fg)] mb-1">Monthly Investment Contribution</label>
                  <p className="text-xs text-[var(--fg-muted)] mb-1.5">
                    How much you invest each month across all accounts.
                  </p>
                  <NumericInput
                    value={profile.monthlyContribution}
                    onChange={(v) => onChange({ monthlyContribution: v })}
                    min={0}
                    prefix="$"
                  />
                </div>
              </div>
              <hr className="border-[var(--border)]" />
              <ExpensesSection profile={profile} onChange={onChange} />
              <hr className="border-[var(--border)]" />
              <RetirementExpensesSection profile={profile} onChange={onChange} />
            </div>
          )}

          {/* Step 3: Assumptions */}
          {step === 2 && (
            <div className="py-2">
              <AssumptionsSection profile={profile} onChange={onChange} />
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-[var(--border)] shrink-0">
          {step > 0 ? (
            <Button variant="outline" onClick={back} className="flex-1">
              &larr; Back
            </Button>
          ) : (
            <div className="flex-1" />
          )}
          <Button onClick={next} className="flex-1">
            {step < STEPS.length - 1
              ? "Next \u2192"
              : isFirstTime
              ? "View My Results \u2192"
              : "Save & Close"}
          </Button>
        </div>

      </div>
    </div>
  );
}
