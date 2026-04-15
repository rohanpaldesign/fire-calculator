"use client";
import { useState } from "react";
import { NumericInput } from "@/components/ui/numeric-input";
import { Label, HintText } from "@/components/ui/label";
import type { FireProfile, ExpenseCategories } from "@/types/fire";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface Props { profile: FireProfile; onChange: (patch: Partial<FireProfile>) => void; }

const CATEGORIES: { key: keyof ExpenseCategories; label: string; icon: string }[] = [
  { key:"housing", label:"Housing (rent/mortgage)", icon:"🏠" },
  { key:"food", label:"Food & Groceries", icon:"🛒" },
  { key:"transport", label:"Transportation", icon:"🚗" },
  { key:"healthcare", label:"Healthcare", icon:"🏥" },
  { key:"entertainment", label:"Entertainment & Leisure", icon:"🎬" },
  { key:"other", label:"Other", icon:"📦" },
];

export function ExpensesSection({ profile, onChange }: Props) {
  const [showCats, setShowCats] = useState(false);
  const cats = profile.expenseCategories ?? {};
  const catTotal = Object.values(cats).reduce((s,v)=>s+(v??0), 0);

  const updateCat = (key: keyof ExpenseCategories, value: number) => {
    const updated = { ...cats, [key]: value };
    onChange({ expenseCategories: updated });
  };

  // Auto-sync total from categories if categories are being used
  const syncTotalFromCats = (key: keyof ExpenseCategories, value: number) => {
    const updated = { ...cats, [key]: value };
    const newTotal = Object.values(updated).reduce((s,v)=>s+(v??0), 0);
    onChange({ expenseCategories: updated, annualExpenses: newTotal > 0 ? newTotal : profile.annualExpenses });
  };

  const monthlyExpenses = profile.annualExpenses / 12;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-[var(--fg)]">Annual Expenses</h2>

      <div>
        <Label htmlFor="annualExpenses">Total Annual Expenses</Label>
        <NumericInput
          id="annualExpenses"
          value={profile.annualExpenses}
          onChange={(v) => onChange({ annualExpenses: v })}
          min={0}
          prefix="$"
        />
        <HintText>
          {formatCurrency(monthlyExpenses)}/mo · This directly sets your FIRE number ({formatCurrency(profile.annualExpenses / profile.safeWithdrawalRate, true)} at {(profile.safeWithdrawalRate*100).toFixed(1)}% SWR)
        </HintText>
      </div>

      <button
        type="button"
        onClick={()=>setShowCats(v=>!v)}
        className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
      >
        {showCats ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {showCats ? "Hide" : "Break down"} by category (optional — auto-sums total)
      </button>

      {showCats && (
        <div className="space-y-3 pt-1">
          {CATEGORIES.map(({key, label, icon}) => (
            <div key={key}>
              <Label htmlFor={`cat-${key}`} className="text-xs font-normal">{icon} {label}</Label>
              <NumericInput
                id={`cat-${key}`}
                value={cats[key]??0}
                onChange={(v) => syncTotalFromCats(key, v)}
                min={0}
                prefix="$"
              />
            </div>
          ))}
          {catTotal > 0 && (
            <div className={`flex items-center justify-between text-xs font-medium p-2 rounded-lg ${
              Math.abs(catTotal-profile.annualExpenses)<100
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
            }`}>
              <span>Category total</span>
              <span>{formatCurrency(catTotal)}/yr {Math.abs(catTotal-profile.annualExpenses)<100 ? "✓ matches" : "→ total updated"}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
