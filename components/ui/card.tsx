import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm card-base", className)} {...props} />;
}
export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-sm font-semibold uppercase tracking-wide text-[var(--fg-muted)]", className)} {...props} />;
}
export function CardValue({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-2xl font-bold text-[var(--fg)] mt-1", className)} {...props} />;
}
export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-[var(--fg-muted)] mt-1", className)} {...props} />;
}
