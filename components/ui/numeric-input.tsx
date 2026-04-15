"use client";
// NumericInput: solves the #1 UX bug — "|| fallback" preventing users from clearing fields.
// Uses local string state while editing; commits valid numbers on change; reverts on blur if invalid.

import { useState, useEffect, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface NumericInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  decimals?: number;  // decimal places for display + parsing
  prefix?: string;    // left label (e.g. "$", "%")
  suffix?: string;    // right label (e.g. "/yr", "%")
  id?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

function fmt(value: number, decimals: number): string {
  if (!isFinite(value)) return "0";
  return decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
}

function clamp(n: number, min?: number, max?: number): number {
  if (min !== undefined && n < min) return min;
  if (max !== undefined && n > max) return max;
  return n;
}

export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  ({ value, onChange, min, max, decimals = 0, prefix, suffix, id, className, placeholder, disabled }, ref) => {
    const [display, setDisplay] = useState(fmt(value, decimals));
    const [focused, setFocused] = useState(false);

    // Sync display when value changes externally (reset, auto-fill) — only when not focused
    useEffect(() => {
      if (!focused) setDisplay(fmt(value, decimals));
    }, [value, focused, decimals]);

    function handleChange(raw: string) {
      // Allow: digits, one dot (if decimals>0), leading minus (though we use min=0 for most)
      // Strip anything that can't be part of a valid number
      let cleaned = raw.replace(/[^0-9.-]/g, "");
      // Only allow one dot
      const dotIdx = cleaned.indexOf(".");
      if (dotIdx !== -1) cleaned = cleaned.slice(0, dotIdx + 1) + cleaned.slice(dotIdx + 1).replace(/\./g, "");
      setDisplay(cleaned);

      const num = parseFloat(cleaned);
      // Commit to profile immediately if valid (don't wait for blur)
      // But don't commit if the string is mid-edit (ends with "." or is empty)
      if (!isNaN(num) && cleaned !== "" && !cleaned.endsWith(".")) {
        onChange(clamp(num, min, max));
      }
    }

    function handleBlur() {
      setFocused(false);
      const num = parseFloat(display);
      if (isNaN(num) || display.trim() === "") {
        // Revert to last committed value
        setDisplay(fmt(value, decimals));
      } else {
        const clamped = clamp(num, min, max);
        onChange(clamped);
        setDisplay(fmt(clamped, decimals));
      }
    }

    const inputEl = (
      <input
        ref={ref}
        id={id}
        type="text"
        inputMode={decimals > 0 ? "decimal" : "numeric"}
        value={display}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "flex-1 min-w-0 bg-transparent px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed",
          !prefix && !suffix && "w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] focus:ring-2 focus:ring-emerald-500",
          className,
        )}
      />
    );

    if (prefix || suffix) {
      return (
        <div className={cn(
          "flex items-center rounded-lg border border-[var(--border)] bg-[var(--bg-input)] focus-within:ring-2 focus-within:ring-emerald-500 overflow-hidden",
          disabled && "opacity-60",
        )}>
          {prefix && (
            <span className="shrink-0 px-3 text-sm text-[var(--fg-muted)] select-none border-r border-[var(--border)] py-2 bg-[var(--bg-input)]">
              {prefix}
            </span>
          )}
          {inputEl}
          {suffix && (
            <span className="shrink-0 px-3 text-sm text-[var(--fg-muted)] select-none border-l border-[var(--border)] py-2 bg-[var(--bg-input)]">
              {suffix}
            </span>
          )}
        </div>
      );
    }
    return inputEl;
  },
);
NumericInput.displayName = "NumericInput";
