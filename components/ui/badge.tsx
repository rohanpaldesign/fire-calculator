import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> { variant?:"green"|"yellow"|"red"|"blue"|"muted"; }
export function Badge({ className, variant="muted", ...props }: BadgeProps) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
    variant==="green"&&"bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    variant==="yellow"&&"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    variant==="red"&&"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    variant==="blue"&&"bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    variant==="muted"&&"bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    className)} {...props} />;
}
