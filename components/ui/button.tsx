import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?:"primary"|"ghost"|"outline"; size?:"sm"|"md"|"lg"; }
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant="primary", size="md", ...props }, ref) => (
  <button ref={ref} className={cn("inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
    variant==="primary"&&"bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-500",
    variant==="ghost"&&"hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--fg)]",
    variant==="outline"&&"border border-[var(--border)] hover:bg-slate-50 dark:hover:bg-slate-800 text-[var(--fg)]",
    size==="sm"&&"text-sm px-3 py-1.5", size==="md"&&"text-sm px-4 py-2", size==="lg"&&"text-base px-5 py-2.5",
    className)} {...props} />
));
Button.displayName = "Button";
export { Button };
