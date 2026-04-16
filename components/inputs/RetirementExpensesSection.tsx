"use client";
import { useState } from "react";
import { NumericInput } from "@/components/ui/numeric-input";
import { HintText } from "@/components/ui/label";
import { FieldLabel, InfoTooltip } from "@/components/ui/info-tooltip";
import { formatCurrency } from "@/lib/formatters";
import {
  calcAutoRetirementExpenses,
  calcLocationComfortEstimate,
  RETIREMENT_CATEGORY_MULTIPLIERS,
} from "@/lib/calculations";
import { getColForState } from "@/lib/cost-of-living";
import type { FireProfile, ExpenseCategories } from "@/types/fire";
import { ChevronDown, ChevronUp, Sparkles, PencilLine, TrendingDown, TrendingUp, Minus } from "lucide-react";

interface Props { profile: FireProfile; onChange: (patch: Partial<FireProfile>) => void; }

const RETIREMENT_CATEGORIES: {
  key: keyof ExpenseCategories;
  label: string;
  icon: string;
  tooltip: string;
}[] = [
  { key: "housing",         label: "Housing (rent/mortgage)", icon: "🏠", tooltip: "Rent or mortgage payment in retirement. May be lower if your mortgage is paid off, or higher if you downsize to a new mortgage." },
  { key: "utilities",       label: "Utilities",               icon: "💡", tooltip: "Electricity, gas, water, trash, internet. Spending more time at home may increase utility bills slightly." },
  { key: "groceries",       label: "Groceries",               icon: "🛒", tooltip: "Food at home. Tends to stay similar or increase slightly as you cook more at home instead of eating out for lunch." },
  { key: "dining",          label: "Dining Out",              icon: "🍽️", tooltip: "Restaurants, takeout, coffee shops. Many retirees find this increases since they have more time to go out." },
  { key: "healthcare",      label: "Healthcare & Insurance",  icon: "🏥", tooltip: "The big one for early retirees. Without employer insurance, you may pay hundreds to over a thousand per month for a plan. Budget generously here until Medicare at 65." },
  { key: "medications",     label: "Prescriptions & Meds",   icon: "💊", tooltip: "Prescription drugs, OTC medications, supplements. Tends to increase with age." },
  { key: "transport",       label: "Transportation",          icon: "🚗", tooltip: "Car payment, gas, insurance, maintenance, transit. Drops significantly without a daily commute." },
  { key: "travel",          label: "Travel & Vacations",      icon: "✈️", tooltip: "Flights, hotels, cruises, road trips. One of the biggest increases for most retirees who finally have time to explore." },
  { key: "hobbies",         label: "Hobbies & Entertainment", icon: "🎯", tooltip: "Sports, arts, music, fitness, events, streaming. More free time means more spending here." },
  { key: "clothing",        label: "Clothing",                icon: "👕", tooltip: "Clothes, shoes, accessories. Usually drops without work attire needs." },
  { key: "personalCare",    label: "Personal Care",           icon: "💆", tooltip: "Haircuts, grooming, gym, spa, beauty. Tends to stay similar." },
  { key: "subscriptions",   label: "Subscriptions & Tech",    icon: "📱", tooltip: "Streaming, software, news, cloud storage, phone plan." },
  { key: "gifts",           label: "Gifts & Charity",         icon: "🎁", tooltip: "Birthday and holiday gifts, charitable donations, church giving." },
  { key: "homeMaintenance", label: "Home Maintenance",        icon: "🔧", tooltip: "Repairs, renovations, lawn care, HOA fees, cleaning. Budget 1-2% of home value per year." },
  { key: "other",           label: "Other / Miscellaneous",   icon: "📦", tooltip: "Pet care, professional fees, anything not covered above." },
];

export function RetirementExpensesSection({ profile, onChange }: Props) {
  const mode = profile.retirementExpensesMode;
  const [showCatBreakdown, setShowCatBreakdown] = useState(false);

  const autoEstimate = calcAutoRetirementExpenses(profile);
  const autoMonthly = Math.round(autoEstimate / 12);

  const colData = getColForState(profile.location);
  const locationEstimate = colData ? calcLocationComfortEstimate(colData.colIndex) : null;
  const locationMonthly = locationEstimate ? Math.round(locationEstimate / 12) : null;

  const retCats = profile.retirementExpenseCategories ?? {};
  const manualCatTotal = Object.values(retCats).reduce((s, v) => s + (v ?? 0), 0);
  const manualMonthlyTotal = Math.round(manualCatTotal / 12);

  const hasCurCats = profile.expenseCategories
    ? Object.values(profile.expenseCategories).some((v) => (v ?? 0) > 0)
    : false;

  const updateRetCat = (key: keyof ExpenseCategories, monthly: number) => {
    const updated = { ...retCats, [key]: monthly * 12 };
    const newTotal = Object.values(updated).reduce((s, v) => s + (v ?? 0), 0);
    onChange({ retirementExpenseCategories: updated, retirementExpenses: newTotal });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-[var(--fg)]">Retirement Expenses</h2>
        <InfoTooltip content="How much you expect to spend each month in retirement. Often different from today — no commute costs but higher healthcare. Used to calculate your FIRE number." />
      </div>
      <p className="text-xs text-[var(--fg-muted)] -mt-2">
        What you spend in retirement sets your FIRE target. This can differ a lot from your current spending.
      </p>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange({ retirementExpensesMode: "auto" })}
          className={"flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium border transition-colors " + (
            mode === "auto"
              ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
              : "border-[var(--border)] text-[var(--fg-muted)] hover:border-emerald-300"
          )}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Auto-Estimate
        </button>
        <button
          type="button"
          onClick={() => onChange({ retirementExpensesMode: "manual" })}
          className={"flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium border transition-colors " + (
            mode === "manual"
              ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
              : "border-[var(--border)] text-[var(--fg-muted)] hover:border-emerald-300"
          )}
        >
          <PencilLine className="h-3.5 w-3.5" />
          Enter Manually
        </button>
      </div>

      <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 px-3 py-2 text-xs text-blue-700 dark:text-blue-300">
        Enter amounts in <strong>today&apos;s dollars</strong> — do not adjust for future inflation.
        The calculator handles inflation ({(profile.inflationRate * 100).toFixed(1)}%/yr) automatically.
      </div>

      {/* AUTO MODE */}
      {mode === "auto" && (
        <div className="space-y-4">
          <div>
            <FieldLabel tooltip="Retirement spending as a percentage of your current spending. 80% is a common rule of thumb — lower work-related costs offset by more leisure.">
              Retirement Lifestyle Factor
            </FieldLabel>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={50}
                max={150}
                step={5}
                value={Math.round(profile.retirementLifestyleFactor * 100)}
                onChange={(e) => {
                  const factor = parseInt(e.target.value) / 100;
                  onChange({ retirementLifestyleFactor: factor });
                }}
                className="flex-1 accent-emerald-500"
              />
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 w-12 text-right">
                {Math.round(profile.retirementLifestyleFactor * 100)}%
              </span>
            </div>
            <div className="flex justify-between text-[10px] text-[var(--fg-muted)] mt-0.5">
              <span>50% (Very lean)</span>
              <span>80% (Common rule)</span>
              <span>150% (More spending)</span>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4">
            <p className="text-xs text-emerald-600 dark:text-emerald-500 font-medium mb-1">Estimated Retirement Expenses</p>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              {formatCurrency(autoMonthly)}/mo
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">
              {formatCurrency(autoEstimate)}/yr = {(profile.annualExpenses > 0 ? (autoEstimate / profile.annualExpenses * 100) : 0).toFixed(0)}% of your current spending
            </p>
          </div>

          {locationMonthly && colData && (
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-[var(--border)] p-3 text-xs">
              <p className="font-medium text-[var(--fg)] mb-1">Location benchmark: {colData.name}</p>
              <p className="text-[var(--fg-muted)]">
                Comfortable single-person retirement in your state costs approximately{" "}
                <span className="font-semibold text-[var(--fg)]">{formatCurrency(locationMonthly)}/mo</span>{" "}
                ({formatCurrency(locationEstimate!)}/yr) based on CoL-adjusted national data.
              </p>
              <p className="text-[var(--fg-muted)] mt-1">
                Your estimate is{" "}
                {autoEstimate > locationEstimate!
                  ? <span className="text-amber-600 dark:text-amber-400">{formatCurrency(autoEstimate - locationEstimate!)} above</span>
                  : <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(locationEstimate! - autoEstimate)} below</span>
                }{" "}
                this benchmark.
              </p>
            </div>
          )}

          {hasCurCats && (
            <button
              type="button"
              onClick={() => setShowCatBreakdown((v) => !v)}
              className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
            >
              {showCatBreakdown ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {showCatBreakdown ? "Hide" : "Show"} category-by-category retirement breakdown
            </button>
          )}
          {hasCurCats && showCatBreakdown && (
            <div className="space-y-1.5 text-xs">
              <p className="text-[var(--fg-muted)] font-medium mb-2">Based on your current expense breakdown:</p>
              {(Object.entries(RETIREMENT_CATEGORY_MULTIPLIERS) as [keyof ExpenseCategories, { multiplier: number; label: string }][]).map(([key, { multiplier, label }]) => {
                const current = profile.expenseCategories?.[key] ?? 0;
                if (current === 0) return null;
                const retired = Math.round(current * multiplier);
                const delta = retired - current;
                const Icon = multiplier > 1.05 ? TrendingUp : multiplier < 0.95 ? TrendingDown : Minus;
                const color = multiplier > 1.05 ? "text-amber-600 dark:text-amber-400" : multiplier < 0.95 ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--fg-muted)]";
                return (
                  <div key={key} className="flex items-center justify-between py-1 border-b border-[var(--border)]">
                    <div className="flex items-center gap-1.5">
                      <Icon className={"h-3 w-3 " + color} />
                      <span className="text-[var(--fg-muted)] capitalize">{key}</span>
                      <span className="text-[var(--fg-muted)] opacity-60">({label})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--fg-muted)]">{formatCurrency(Math.round(current / 12))}/mo</span>
                      <span className="text-[var(--fg-muted)]">→</span>
                      <span className={"font-medium " + color}>{formatCurrency(Math.round(retired / 12))}/mo</span>
                      <span className={color}>{delta > 0 ? "+" : ""}{formatCurrency(Math.round(delta / 12))}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MANUAL MODE */}
      {mode === "manual" && (
        <div className="space-y-4">
          <p className="text-xs text-[var(--fg-muted)]">
            Enter each retirement expense category. All values are monthly.
            These can differ significantly from your current expenses.
          </p>
          <div className="space-y-3">
            {RETIREMENT_CATEGORIES.map(({ key, label, icon, tooltip }) => {
              const currentAnnual = profile.expenseCategories?.[key] ?? 0;
              const currentMonthly = Math.round(currentAnnual / 12);
              const retMonthly = Math.round((retCats[key] ?? 0) / 12);
              const suggested = currentMonthly > 0
                ? Math.round(currentMonthly * (RETIREMENT_CATEGORY_MULTIPLIERS[key]?.multiplier ?? 1))
                : null;
              return (
                <div key={key}>
                  <FieldLabel htmlFor={"ret-" + key} tooltip={tooltip} className="text-xs font-normal">
                    <span className="text-sm">{icon} {label}</span>
                  </FieldLabel>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1">
                      <NumericInput
                        id={"ret-" + key}
                        value={retMonthly}
                        onChange={(v) => updateRetCat(key, v)}
                        min={0}
                        prefix="$"
                        suffix="/mo"
                      />
                    </div>
                    {suggested !== null && retMonthly !== suggested && (
                      <button
                        type="button"
                        onClick={() => updateRetCat(key, suggested)}
                        className="text-[10px] text-emerald-600 dark:text-emerald-400 whitespace-nowrap hover:underline"
                      >
                        Use {formatCurrency(suggested)}/mo →
                      </button>
                    )}
                  </div>
                  {currentMonthly > 0 && (
                    <p className="text-[10px] text-[var(--fg-muted)] mt-0.5">
                      Current: {formatCurrency(currentMonthly)}/mo
                      {retMonthly > 0 && retMonthly !== currentMonthly && (
                        <span className={retMonthly > currentMonthly ? " text-amber-600 dark:text-amber-400" : " text-emerald-600 dark:text-emerald-400"}>
                          {" "}({retMonthly > currentMonthly ? "+" : ""}{formatCurrency(retMonthly - currentMonthly)}/mo vs today)
                        </span>
                      )}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {manualMonthlyTotal > 0 && (
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4">
              <p className="text-xs text-emerald-600 dark:text-emerald-500 font-medium mb-1">Total Retirement Expenses</p>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                {formatCurrency(manualMonthlyTotal)}/mo
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">
                {formatCurrency(manualCatTotal)}/yr
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
