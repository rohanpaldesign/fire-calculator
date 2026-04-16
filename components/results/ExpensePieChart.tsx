"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { ExpenseCategories } from "@/types/fire";
import { formatCurrency } from "@/lib/formatters";
interface Props { categories: Partial<ExpenseCategories>; total: number; }
const COLORS = ["#10b981","#6366f1","#f59e0b","#ef4444","#8b5cf6","#64748b","#0ea5e9","#f97316","#84cc16","#ec4899","#14b8a6","#a855f7","#f43f5e","#06b6d4","#eab308"];
const LABELS: Record<keyof ExpenseCategories, string> = {
  housing: "Housing",
  utilities: "Utilities",
  groceries: "Groceries",
  dining: "Dining Out",
  healthcare: "Healthcare",
  medications: "Medications",
  transport: "Transport",
  travel: "Travel",
  hobbies: "Hobbies",
  clothing: "Clothing",
  personalCare: "Personal Care",
  subscriptions: "Subscriptions",
  gifts: "Gifts",
  homeMaintenance: "Home Maint.",
  other: "Other",
};
export default function ExpensePieChart({ categories, total }: Props) {
  const data = (Object.entries(categories) as [keyof ExpenseCategories, number][])
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: LABELS[k] ?? k, value: v }));
  if (data.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-[var(--fg-muted)] uppercase tracking-wide mb-3">Expense Breakdown</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(v) => formatCurrency(Number(v))} />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-xs text-center text-[var(--fg-muted)]">Total: {formatCurrency(total)}/yr · {formatCurrency(total / 12)}/mo</p>
    </div>
  );
}
