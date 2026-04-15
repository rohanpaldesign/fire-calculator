"use client";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export function SelectTrigger({ className, children, ...props }: SelectPrimitive.SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger className={cn("flex w-full items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-emerald-500 data-[placeholder]:text-[var(--fg-muted)]", className)} {...props}>
      {children}
      <SelectPrimitive.Icon><ChevronDown className="h-4 w-4 text-[var(--fg-muted)]" /></SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}
export function SelectContent({ className, children, ...props }: SelectPrimitive.SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className={cn("z-50 min-w-[8rem] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-card)] shadow-lg", className)} position="popper" sideOffset={4} {...props}>
        <SelectPrimitive.Viewport className="p-1 max-h-64 overflow-auto">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}
export function SelectItem({ className, children, ...props }: SelectPrimitive.SelectItemProps) {
  return (
    <SelectPrimitive.Item className={cn("relative flex cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm text-[var(--fg)] outline-none data-[highlighted]:bg-emerald-50 dark:data-[highlighted]:bg-emerald-900/20", className)} {...props}>
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator><Check className="h-3.5 w-3.5 text-emerald-500" /></SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
