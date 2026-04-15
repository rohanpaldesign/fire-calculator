import { cn } from "@/lib/utils";
import { LabelHTMLAttributes } from "react";
export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("block text-sm font-medium text-[var(--fg)] mb-1", className)} {...props} />;
}
export function HintText({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-[var(--fg-muted)] mt-1", className)} {...props} />;
}
