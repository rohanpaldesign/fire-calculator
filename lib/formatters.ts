export function formatCurrency(value: number, abbreviate = false): string {
  if (!isFinite(value)) return "—";
  if (abbreviate) {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}
export function formatPercent(value: number, decimals = 1): string { return `${(value * 100).toFixed(decimals)}%`; }
export function formatYears(years: number | null): string {
  if (years === null) return "Never (adjust inputs)";
  if (years <= 0) return "You're already there!";
  const wholeYears = Math.floor(years);
  const months = Math.round((years - wholeYears) * 12);
  if (months === 0) return `${wholeYears} yr${wholeYears !== 1 ? "s" : ""}`;
  if (wholeYears === 0) return `${months} mo`;
  return `${wholeYears} yr${wholeYears !== 1 ? "s" : ""} ${months} mo`;
}
export function formatYear(date: Date | null): string { return date ? date.getFullYear().toString() : "—"; }
