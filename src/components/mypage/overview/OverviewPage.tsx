"use client";

import { memo, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight, Unlink } from "lucide-react";
import { useOverview } from "@/hooks/useOverview";
import { useExchanges } from "@/hooks/useExchanges";
import type {
  BalanceDataPoint,
  ConnectedExchange,
  OpenPosition,
  ExchangeId,
} from "@/types/mypage";

// ─── Exchange metadata ────────────────────────────────────────────────────────

const EXCHANGE_COLORS: Record<string, string> = {
  bybit:   "#CAFF5D",
  okx:     "#A855F7",
  binance: "#22D3EE",
  bitget:  "#F59E0B",
};

const ALL_EXCHANGES: { id: ExchangeId; name: string }[] = [
  { id: "bybit",   name: "Bybit" },
  { id: "okx",     name: "OKX" },
  { id: "binance", name: "Binance" },
  { id: "bitget",  name: "Bitget" },
];

// ─── Formatters ───────────────────────────────────────────────────────────────

const NUM_FMT = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function fmtUsd(v?: number, dec = 2): string {
  if (v == null) return "—";
  if (dec === 2) return NUM_FMT.format(v);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  }).format(v);
}

function fmtMD(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${m}.${day}`;
}

// ─── ExchangeLogo ─────────────────────────────────────────────────────────────

function ExchangeLogo({ id, name, size = 28 }: { id: string; name: string; size?: number }) {
  const color = EXCHANGE_COLORS[id] ?? "#737373";
  return (
    <span
      className="inline-flex flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
      style={{ width: size, height: size, background: `${color}22`, color }}
    >
      {name[0]}
    </span>
  );
}

// ─── BalanceChart ─────────────────────────────────────────────────────────────

const CHART_W = 600;
const CHART_H = 96;
const PAD_X = 2;

function BalanceChart({ data }: { data: BalanceDataPoint[] }) {
  const values = useMemo(() => data.map((d) => d.totalUsd), [data]);

  const { linePath, areaPath } = useMemo(() => {
    if (values.length < 2) return { linePath: "", areaPath: "" };
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const xStep = (CHART_W - PAD_X * 2) / (values.length - 1);
    const pts = values.map((v, i) => ({
      x: PAD_X + i * xStep,
      y: CHART_H - 8 - ((v - min) / range) * (CHART_H - 20),
    }));
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    const area = `${line} L${pts[pts.length - 1].x.toFixed(1)},${CHART_H} L${PAD_X},${CHART_H} Z`;
    return { linePath: line, areaPath: area };
  }, [values]);

  const labelDates = useMemo(() => {
    if (data.length === 0) return [];
    const count = Math.min(7, data.length);
    return Array.from({ length: count }, (_, i) =>
      fmtMD(data[Math.round((i * (data.length - 1)) / (count - 1))].date)
    );
  }, [data]);

  if (values.length < 2) return null;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="w-full"
        style={{ height: 96 }}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CAFF5D" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#CAFF5D" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#chart-area)" />
        <path
          d={linePath}
          fill="none"
          stroke="#CAFF5D"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex items-center justify-between px-px pt-2">
        {labelDates.map((d, i) => (
          <span key={i} className="text-[10px] text-text-tertiary tabular-nums">
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── DonutChart ───────────────────────────────────────────────────────────────

const CX = 80, CY = 80, OUTER_R = 66, INNER_R = 47, GAP_DEG = 3;

function polar(deg: number, r: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function arcPath(start: number, end: number): string {
  const s1 = polar(start, OUTER_R);
  const e1 = polar(end, OUTER_R);
  const s2 = polar(end, INNER_R);
  const e2 = polar(start, INNER_R);
  const large = end - start > 180 ? 1 : 0;
  const f = (n: number) => n.toFixed(2);
  return [
    `M ${f(s1.x)} ${f(s1.y)}`,
    `A ${OUTER_R} ${OUTER_R} 0 ${large} 1 ${f(e1.x)} ${f(e1.y)}`,
    `L ${f(s2.x)} ${f(s2.y)}`,
    `A ${INNER_R} ${INNER_R} 0 ${large} 0 ${f(e2.x)} ${f(e2.y)}`,
    "Z",
  ].join(" ");
}

function DonutChart({ exchanges, total }: { exchanges: ConnectedExchange[]; total: number }) {
  const segments = useMemo(() => {
    let start = 0;
    return exchanges
      .filter((ex) => ex.totalUsd > 0)
      .map((ex) => {
        const sweep = total > 0 ? (ex.totalUsd / total) * 360 : 0;
        const half = GAP_DEG / 2;
        const path = sweep > GAP_DEG + 0.5 ? arcPath(start + half, start + sweep - half) : null;
        start += sweep;
        return { ex, path, color: EXCHANGE_COLORS[ex.id] ?? "#737373" };
      });
  }, [exchanges, total]);

  return (
    <svg viewBox="0 0 160 160" className="w-36 h-36 flex-shrink-0" aria-hidden="true">
      {total === 0 ? (
        <circle cx={CX} cy={CY} r={(OUTER_R + INNER_R) / 2} fill="none" stroke="#262626" strokeWidth={OUTER_R - INNER_R} />
      ) : (
        segments.map((s) => s.path ? <path key={s.ex.id} d={s.path} fill={s.color} /> : null)
      )}
      <text x={CX} y={CY - 7} textAnchor="middle" fontSize="11" fill="#737373" fontFamily="Manrope, sans-serif">
        Total
      </text>
      <text x={CX} y={CY + 11} textAnchor="middle" fontSize="13" fontWeight="600" fill="#FFFFFF" fontFamily="Manrope, sans-serif">
        {fmtUsd(total)}
      </text>
    </svg>
  );
}

// ─── TotalBalanceCard ─────────────────────────────────────────────────────────

const PERIODS = ["7D", "14D", "30D"] as const;
type Period = (typeof PERIODS)[number];

const PERIOD_DAYS: Record<Period, number> = { "7D": 7, "14D": 14, "30D": 30 };

const TotalBalanceCard = memo(function TotalBalanceCard({
  total,
  history,
  isLoading,
}: {
  total: string;
  history?: BalanceDataPoint[];
  isLoading: boolean;
}) {
  const [period, setPeriod] = useState<Period>("7D");

  const filtered = useMemo(() => {
    if (!history) return [];
    const days = PERIOD_DAYS[period];
    return history.slice(-days);
  }, [history, period]);

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-1 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CAFF5D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" />
            </svg>
          </span>
          <span className="text-label-1 font-semibold text-text-secondary">Total Balance</span>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-1 rounded-full border border-border-subtle bg-surface-2 p-0.5">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                period === p
                  ? "bg-surface-3 text-text-primary"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-9 w-48 animate-pulse rounded bg-surface-3" />
          <div className="h-24 w-full animate-pulse rounded bg-surface-3" />
        </div>
      ) : (
        <>
          <p className="mb-4 flex items-baseline gap-2">
            <span className="text-[32px] font-bold leading-none text-text-primary tabular-nums">
              {total}
            </span>
            <span className="text-base font-semibold text-primary">USDT</span>
          </p>
          <BalanceChart data={filtered} />
        </>
      )}
    </div>
  );
});

// ─── BalanceRatioCard ─────────────────────────────────────────────────────────

const BalanceRatioCard = memo(function BalanceRatioCard({
  exchanges,
  total,
  isLoading,
}: {
  exchanges?: ConnectedExchange[];
  total: number;
  isLoading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-1 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CAFF5D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" />
          </svg>
        </span>
        <span className="text-label-1 font-semibold text-text-secondary">Balance Ratio</span>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-6">
          <div className="h-36 w-36 animate-pulse rounded-full bg-surface-3" />
          <div className="space-y-3 flex-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-4 w-24 animate-pulse rounded bg-surface-3" />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <DonutChart exchanges={exchanges ?? []} total={total} />
          <ul className="space-y-2.5">
            {(exchanges ?? []).map((ex) => (
              <li key={ex.id} className="flex items-center gap-2.5">
                <span
                  className="h-3 w-3 flex-shrink-0 rounded-sm"
                  style={{ background: EXCHANGE_COLORS[ex.id] ?? "#737373" }}
                />
                <span className="text-sm font-medium text-text-secondary">{ex.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

// ─── OpenPositionsTable ───────────────────────────────────────────────────────

const POSITION_COLS = [
  "Symbol", "Side", "Qty", "Entry Price",
  "Market Price", "Liq. Price", "Unrealized P&L(ROI)", "Realized P&L",
];

const OpenPositionsTable = memo(function OpenPositionsTable({
  positions,
  exchangeLogoMap,
  isLoading,
}: {
  positions?: OpenPosition[];
  exchangeLogoMap: Record<string, string>;
  isLoading: boolean;
}) {
  return (
    <section className="rounded-2xl border border-border-subtle bg-surface-1 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-2">
            {/* crosshair / positions icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CAFF5D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="2" y1="12" x2="22" y2="12" /><line x1="12" y1="2" x2="12" y2="22" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </span>
          <span className="text-label-1 font-semibold text-text-primary">Open Positions</span>
        </div>
        <Link
          href="/mypage/history?section=trade&tab=position"
          className="text-primary hover:text-primary-strong transition-colors"
          aria-label="View all positions"
        >
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] border-collapse text-sm">
          <thead>
            <tr className="border-t border-border-subtle">
              {POSITION_COLS.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap bg-surface-2 px-4 py-2.5 text-left text-caption font-medium text-text-tertiary first:pl-5"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <tr key={i} className="border-t border-border-subtle">
                  {POSITION_COLS.map((_, j) => (
                    <td key={j} className="px-4 py-3 first:pl-5">
                      <div className="h-4 w-20 animate-pulse rounded bg-surface-2" />
                    </td>
                  ))}
                </tr>
              ))
            ) : !positions?.length ? (
              <tr>
                <td
                  colSpan={POSITION_COLS.length}
                  className="px-5 py-10 text-center text-sm text-text-secondary"
                >
                  No open positions.
                </td>
              </tr>
            ) : (
              positions.map((pos) => (
                <tr
                  key={pos.id}
                  className="border-t border-border-subtle transition-colors hover:bg-surface-2/40"
                >
                  {/* Symbol */}
                  <td className="pl-5 pr-4 py-3">
                    <div className="flex items-center gap-2">
                      <ExchangeLogo id={pos.exchangeId} name={exchangeLogoMap[pos.exchangeId] ?? pos.exchangeId} size={22} />
                      <span className="font-semibold text-text-primary">{pos.symbol}</span>
                    </div>
                  </td>
                  {/* Side */}
                  <td className="px-4 py-3 font-medium text-positive">
                    {pos.side === "long" ? "Buy/Long" : "Sell/Short"}
                  </td>
                  {/* Qty */}
                  <td className="px-4 py-3 tabular-nums text-text-secondary">{pos.quantity}</td>
                  {/* Entry Price */}
                  <td className="px-4 py-3 tabular-nums text-text-secondary">{fmtUsd(pos.entryPrice)}</td>
                  {/* Market Price */}
                  <td className="px-4 py-3 tabular-nums text-text-secondary">{fmtUsd(pos.marketPrice)}</td>
                  {/* Liq. Price */}
                  <td className="px-4 py-3 tabular-nums font-medium text-negative">{fmtUsd(pos.liqPrice)}</td>
                  {/* Unrealized P&L */}
                  <td className="px-4 py-3">
                    <span className="tabular-nums font-medium text-positive">
                      {fmtUsd(pos.unrealizedPnlUsd)}({pos.unrealizedPnlPct >= 0 ? "+" : ""}{pos.unrealizedPnlPct.toFixed(2)}%)
                    </span>
                    <br />
                    <span className="text-xs text-positive">
                      +{fmtUsd(pos.unrealizedBaseUsd, 0)} USD
                    </span>
                  </td>
                  {/* Realized P&L */}
                  <td className="px-4 py-3 tabular-nums text-text-secondary">
                    {fmtUsd(pos.realizedPnlUsd)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
});

// ─── ConnectedExchangesSection ────────────────────────────────────────────────

function ConnectedExchangesSection({ isLoading }: { isLoading: boolean }) {
  const { data: exchanges } = useExchanges();

  const connectedIds = useMemo(
    () => new Set((exchanges ?? []).filter((e) => e.status === "connected").map((e) => e.id)),
    [exchanges]
  );

  const connected = useMemo(
    () => (exchanges ?? []).filter((e) => e.status === "connected"),
    [exchanges]
  );

  const notConnected = useMemo(() => {
    const errored = (exchanges ?? []).filter((e) => e.status !== "connected");
    const missing = ALL_EXCHANGES.filter((ae) => !connectedIds.has(ae.id)).map((ae) => ({
      id: ae.id,
      name: ae.name,
      logoUrl: "",
      status: "disconnected" as const,
      connectedAt: "",
      apiKeyMasked: "",
    }));
    const ids = new Set(errored.map((e) => e.id));
    return [...errored, ...missing.filter((m) => !ids.has(m.id))];
  }, [exchanges, connectedIds]);

  return (
    <section className="rounded-2xl border border-border-subtle bg-surface-1 p-5">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CAFF5D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </span>
        <span className="text-label-1 font-semibold text-text-primary">Connected Exchanges</span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-surface-2" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Connected group */}
          {connected.length > 0 && (
            <>
              <span className="inline-block rounded-full bg-positive/10 px-2.5 py-0.5 text-xs font-semibold text-positive">
                Connected
              </span>
              <ul className="space-y-2">
                {connected.map((ex) => (
                  <li
                    key={ex.id}
                    className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-2 px-4 py-3"
                  >
                    <ExchangeLogo id={ex.id} name={ex.name} size={28} />
                    <span className="font-semibold text-text-primary">{ex.name}</span>
                    {ex.uid && (
                      <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
                        <span className="font-medium text-text-disabled">UID</span>
                        <span className="tabular-nums text-text-secondary">{ex.uid}</span>
                      </span>
                    )}
                    <button
                      className="ml-auto flex items-center gap-1.5 text-xs font-medium text-negative/80 hover:text-negative transition-colors"
                      aria-label={`Disconnect ${ex.name}`}
                    >
                      <Unlink size={12} />
                      Disconnect
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Not Connected group */}
          {notConnected.length > 0 && (
            <>
              <span className="inline-block rounded-full bg-cautionary/10 px-2.5 py-0.5 text-xs font-semibold text-cautionary">
                Not Connected
              </span>
              <ul className="space-y-2">
                {notConnected.map((ex) => (
                  <li
                    key={ex.id}
                    className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-2 px-4 py-3"
                  >
                    <ExchangeLogo id={ex.id} name={ex.name} size={28} />
                    <span className="font-semibold text-text-primary">{ex.name}</span>
                    <Link
                      href="/mypage/exchanges"
                      className="ml-auto flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-strong transition-colors"
                    >
                      Connect to Trade
                      <ArrowUpRight size={12} />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </section>
  );
}

// ─── OverviewPage ─────────────────────────────────────────────────────────────

export function OverviewPage() {
  const { data, isLoading, error, refetch } = useOverview();
  const handleRetry = useCallback(() => refetch(), [refetch]);

  const total = data?.summary.totalAssetUsd ?? 0;

  if (error) {
    return (
      <div role="alert" className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-sm text-text-secondary">Failed to load data.</p>
        <button
          onClick={handleRetry}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-text-inverse hover:bg-primary-strong transition-colors focus-ring"
        >
          Retry
        </button>
      </div>
    );
  }

  const exchangeLogoMap = useMemo(
    () =>
      Object.fromEntries(
        (data?.connectedExchanges ?? []).map((ex) => [ex.id, ex.name])
      ),
    [data]
  );

  return (
    <div className="space-y-4">
      {/* ── Row 1: Total Balance + Balance Ratio ─────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] xl:grid-cols-[3fr_2fr]">
        <TotalBalanceCard
          total={fmtUsd(data?.summary.totalAssetUsd)}
          history={data?.balanceHistory}
          isLoading={isLoading}
        />
        <BalanceRatioCard
          exchanges={data?.connectedExchanges}
          total={total}
          isLoading={isLoading}
        />
      </div>

      {/* ── Row 2: Open Positions ─────────────────────────────────────── */}
      <OpenPositionsTable
        positions={data?.openPositions}
        exchangeLogoMap={exchangeLogoMap}
        isLoading={isLoading}
      />

      {/* ── Row 3: Connected Exchanges ───────────────────────────────── */}
      <ConnectedExchangesSection isLoading={isLoading} />
    </div>
  );
}
