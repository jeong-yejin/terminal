/** USD 금액 포맷 (소수점 2자리, 천 단위 콤마) */
export function formatUsd(value?: number): string {
  if (value === undefined || value === null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** 퍼센트 포맷 (+/- 부호 포함, 소수점 2자리) */
export function formatPct(value?: number): string {
  if (value === undefined || value === null) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}
