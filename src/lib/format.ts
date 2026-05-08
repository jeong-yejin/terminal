// Cache Intl.NumberFormat instance at module scope — recreating on every call burdens GC
const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Format USD amount (2 decimal places, thousands separator) */
export function formatUsd(value?: number): string {
  if (value == null) return "—";
  return usdFormatter.format(value);
}

/** Format percentage (with +/- sign, 2 decimal places) */
export function formatPct(value?: number): string {
  if (value == null) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}
