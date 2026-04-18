"use client";
import { useState, useRef, useEffect } from "react";
import { Pencil } from "lucide-react";

interface Props {
  value: number;
  onChange: (v: number) => void;
  display: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  inputWidth?: string;
}

export function EditableValue({
  value,
  onChange,
  display,
  min,
  max,
  step = 1,
  className = "",
  inputWidth = "w-24",
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setDraft(String(value));
      setTimeout(() => { inputRef.current?.focus(); inputRef.current?.select(); }, 0);
    }
  }, [editing, value]);

  function commit() {
    const num = parseFloat(draft.replace(/[,$\s]/g, ""));
    if (!isNaN(num)) {
      let v = num;
      if (min !== undefined) v = Math.max(min, v);
      if (max !== undefined) v = Math.min(max, v);
      onChange(Math.round(v));
    }
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        value={draft}
        min={min}
        max={max}
        step={step}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); commit(); }
          if (e.key === "Escape") { e.preventDefault(); setEditing(false); }
        }}
        className={`${inputWidth} rounded border border-emerald-400 bg-[var(--bg-card)] px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${className}`}
      />
    );
  }

  return (
    <button
      type="button"
      title="Click to edit"
      onClick={() => setEditing(true)}
      className={`group inline-flex items-center gap-1.5 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left ${className}`}
    >
      {display}
      <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity shrink-0" />
    </button>
  );
}
