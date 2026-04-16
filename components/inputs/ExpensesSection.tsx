"use client";
import { useState } from "react";
import { NumericInput } from "@/components/ui/numeric-input";
import { HintText } from "@/components/ui/label";
import { FieldLabel } from "@/components/ui/info-tooltip";
import type { FireProfile, ExpenseCategories } from "@/types/fire";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface Props { profile: FireProfile; onChange: (patch: Partial<FireProfile>) => void; }

const CATEGORIES: { key: keyof ExpenseCategories; label: string; icon: string; tooltip: string }[] = [
  { key: "housing",         label: "Housing (rent/mortgage)",  icon: "🏠", tooltip: "Rent, mortgage payment, renters or homeowners insurance, HOA fees." },
  { key: "utilities",       label: "Utilities",                icon: "💡", tooltip: "Electricity, gas, water, trash, internet." },
  { key: "groceries",       label: "Groceries",                icon: "🛒", tooltip: "Food at home — grocery stores, farmers markets, meal kits." },
  { key: "dining",          label: "Dining Out",               icon: "🍽️", tooltip: "Restaurants, takeout, coffee shops, bars." },
  { key: "healthcare",      label: "Healthcare",               icon: "🏥", tooltip: "Health insurance premiums (your share), copays, prescriptions, gym membership." },
  { key: "medications",     label: "Prescriptions & Meds",    icon: "💊", tooltip: "Prescription drugs, OTC medications, supplements." },
  { key: "transport",       label: "Transportation",           icon: "🚗", tooltip: "Car payment, gas, insurance, maintenance, public transit, rideshare." },
  { key: "travel",          label: "Travel & Vacations",       icon: "✈️", tooltip: "Flights, hotels, road trips, vacation spending." },
  { key: "hobbies",         label: "Hobbies & Entertainment",  icon: "🎯", tooltip: "Sports, arts, music, fitness, events, streaming services." },
  { key: "clothing",        label: "Clothing",                 icon: "👕", tooltip: "Clothes, shoes, accessories." },
  { key: "personalCare",    label: "Personal Care",            icon: "💆", tooltip: "Haircuts, grooming, gym, spa, beauty products." },
  { key: "subscriptions",   label: "Subscriptions & Tech",     icon: "📱", tooltip: "Software, news, streaming, cloud storage, phone plan." },
  { key: "gifts",           label: "Gifts & Charity",          icon: "🎁", tooltip: "Birthday and holiday gifts, charitable donations." },
  { key: "homeMaintenance", label: "Home Maintenance",         icon: "🔧", tooltip: "Repairs, renovations, lawn care, HOA fees, cleaning supplies." },
  { key: "other",           label: "Other / Miscellaneous",    icon: "📦", tooltip: "Pet care, professional fees, anything not covered above." },
];

export function ExpensesSection({ profile, onChange }: Props) {
  const [showCats, setShowCats] = useState(false);
  const cats = profile.expenseCategories ?? {};

  const monthlyExpenses = Math.round(profile.annualExpenses / 12);
  const fireNumber = profile.annualExpenses / profile.safeWithdrawalRate;

  const syncTotalFromCats = (key: keyof ExpenseCategories, monthlyValue: number) => {
    const annualValue = monthlyValue * 12;
    const updated = { ...cats, [key]: annualValue };
    const newAnnualTotal = Object.values(updated).reduce((s, v) => s + (v ?? 0), 0);
    onChange({ expenseCategories: updated, annualExpenses: newAnnualTotal > 0 ? newAnnualTotal : profile.annualExpenses });
  };

  const catMonthlyTotal = Object.values(cats).reduce((s, v) => s + (v ?? 0), 0) / 12;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-[var(--fg)]">Current Monthly Expenses</h2>

      <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 px-3 py-2 text-xs text-blue-700 dark:text-blue-300">
        Enter amounts in <strong>today&apos;s dollars</strong> — do not adjust for inflation.
        Inflation ({(profile.inflationRate * 100).toFixed(1)}%/yr) is applied automatically in all projections.
      </div>

      <div>
        <FieldLabel htmlFor="monthlyExpenses" tooltip="Your total monthly spending — rent, food, subscriptions, everything. This directly sets your FIRE number: the more you spend, the more you need to save.">
          Monthly Expenses
        </FieldLabel>
        <NumericInput
          id="monthlyExpenses"
          value={monthlyExpenses}
          onChange={(v) => onChange({ annualExpenses: v * 12 })}
          min={0}
          prefix="$"
          suffix="/mo"
        />
        <HintText>
          = {formatCurrency(profile.annualExpenses)}/yr · FIRE number ~{formatCurrency(fireNumber, true)} at {(profile.safeWithdrawalRate * 100).toFixed(1)}% SWR
        </HintText>
      </div>

      <button
        type="button"
        onClick={() => setShowCats((v) => !v)}
        className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
      >
        {showCats ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {showCats ? "Hide" : "Break down"} by category (optional — enables smarter retirement estimate)
      </button>

      {showCats && (
        <div className="space-y-3 pt-1">
          {CATEGORIES.map(({ key, label, icon, tooltip }) => (
            <div key={key}>
              <FieldLabel htmlFor={`cat-${key}`} tooltip={tooltip} className="text-xs font-normal">
                <span className="text-sm">{icon} {label}</span>
              </FieldLabel>
              <NumericInput
                id={`cat-${key}`}
                value={Math.round((cats[key] ?? 0) / 12)}
                onChange={(v) => syncTotalFromCats(key, v)}
                min={0}
                prefix="$"
                suffix="/mo"
              />
            </div>
          ))}
          {catMonthlyTotal > 0 && (
            <div className={`flex items-center justify-between text-xs font-medium p-2 rounded-lg ${
              Math.abs(catMonthlyTotal - monthlyExpenses) < 50
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
            }`}>
              <span>Category total</span>
              <span>{formatCurrency(catMonthlyTotal)}/mo {Math.abs(catMonthlyTotal - monthlyExpenses) < 50 ? "✓ matches" : "→ total updated"}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
