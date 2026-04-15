"use client";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";

interface InfoTooltipProps {
  content: string;
  side?: "top" | "right" | "bottom" | "left";
}

export function InfoTooltip({ content, side = "top" }: InfoTooltipProps) {
  return (
    <Tooltip.Root delayDuration={200}>
      <Tooltip.Trigger asChild>
        <button
          type="button"
          aria-label="More info"
          className="inline-flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] focus:outline-none"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side={side}
          sideOffset={5}
          className="z-50 max-w-[240px] rounded-lg bg-[var(--fg)] px-3 py-2 text-xs leading-snug text-[var(--bg)] shadow-lg"
        >
          {content}
          <Tooltip.Arrow className="fill-[var(--fg)]" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

interface FieldLabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  tooltip?: string;
  className?: string;
}

export function FieldLabel({ htmlFor, children, tooltip, className }: FieldLabelProps) {
  return (
    <div className={`flex items-center gap-1 mb-1 ${className ?? ""}`}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-[var(--fg)]"
      >
        {children}
      </label>
      {tooltip && <InfoTooltip content={tooltip} />}
    </div>
  );
}
