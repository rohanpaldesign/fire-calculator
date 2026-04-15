"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label, HintText } from "@/components/ui/label";
import type { FireProfile, ExpenseCategories } from "@/types/fire";
import { ChevronDown, ChevronUp } from "lucide-react";
interface Props { profile: FireProfile; onChange: (patch: Partial<FireProfile>) => void; }
const CATEGORIES: { key: keyof ExpenseCategories; label: string }[] = [
  { key:"housing", label:"Housing (rent/mortgage)" }, { key:"food", label:"Food & Groceries" },
  { key:"transport", label:"Transportation" }, { key:"healthcare", label:"Healthcare" },
  { key:"entertainment", label:"Entertainment & Leisure" }, { key:"other", label:"Other" },
];
export function ExpensesSection({ profile, onChange }: Props) {
  const [showCats, setShowCats] = useState(false);
  const cats = profile.expenseCategories ?? {};
  const catTotal = Object.values(cats).reduce((s,v)=>s+(v??0),0);
  const updateCat = (key: keyof ExpenseCategories, value: number) => onChange({ expenseCategories: { ...cats, [key]: value } });
  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-[var(--fg)]">Expenses</h2>
      <div>
        <Label htmlFor="annualExpenses">Annual Expenses</Label>
        <Input id="annualExpenses" type="number" min={0} prefix="$" value={profile.annualExpenses} onChange={(e) => onChange({ annualExpenses: parseFloat(e.target.value)||0 })} />
        <HintText>Total yearly spending — this determines your FIRE number.</HintText>
      </div>
      <button type="button" onClick={()=>setShowCats(v=>!v)} className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
        {showCats ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {showCats ? "Hide" : "Add"} expense breakdown (optional)
      </button>
      {showCats && (
        <div className="space-y-3 pt-1">
          {CATEGORIES.map(({key,label}) => (
            <div key={key}>
              <Label htmlFor={`cat-${key}`} className="text-xs font-normal">{label}</Label>
              <Input id={`cat-${key}`} type="number" min={0} prefix="$" value={cats[key]??0} onChange={(e)=>updateCat(key, parseFloat(e.target.value)||0)} />
            </div>
          ))}
          {catTotal > 0 && (
            <p className={`text-xs font-medium ${Math.abs(catTotal-profile.annualExpenses)<100?"text-emerald-600 dark:text-emerald-400":"text-amber-600 dark:text-amber-400"}`}>
              Category total: ${catTotal.toLocaleString()} {Math.abs(catTotal-profile.annualExpenses)<100?"✓":`(${catTotal>profile.annualExpenses?"+":""}${(catTotal-profile.annualExpenses).toLocaleString()} vs total)`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
