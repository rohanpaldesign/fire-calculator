import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";
interface InputProps extends InputHTMLAttributes<HTMLInputElement> { prefix?: string; suffix?: string; }
const Input = forwardRef<HTMLInputElement, InputProps>(({ className, prefix, suffix, ...props }, ref) => {
  if (prefix || suffix) {
    return (
      <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--bg-input)] focus-within:ring-2 focus-within:ring-emerald-500 overflow-hidden">
        {prefix && <span className="px-3 text-sm text-[var(--fg-muted)] select-none border-r border-[var(--border)] h-full flex items-center py-2">{prefix}</span>}
        <input ref={ref} className={cn("flex-1 bg-transparent px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus:outline-none", className)} {...props} />
        {suffix && <span className="px-3 text-sm text-[var(--fg-muted)] select-none border-l border-[var(--border)] h-full flex items-center py-2">{suffix}</span>}
      </div>
    );
  }
  return <input ref={ref} className={cn("w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500", className)} {...props} />;
});
Input.displayName = "Input";
export { Input };
