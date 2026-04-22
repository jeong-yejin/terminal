"use client";

import { memo, useMemo, useState, useCallback, useEffect, useRef } from "react";
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
};

const ALL_EXCHANGES: { id: ExchangeId; name: string }[] = [
  { id: "bybit",   name: "Bybit" },
  { id: "okx",     name: "OKX" },
  { id: "binance", name: "Binance" },
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

function fmtPct(v: number): string {
  return `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;
}

function fmtMD(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${m}.${day}`;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useScrollReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("is-visible"); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
}

function useMagnetic(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      el.style.transform = `translate(${(dx * 0.022).toFixed(2)}px, ${(dy * 0.022).toFixed(2)}px)`;
    };
    const onLeave = () => {
      el.style.transition = "transform 400ms cubic-bezier(0.34,1.56,0.64,1)";
      el.style.transform  = "";
      setTimeout(() => { el.style.transition = ""; }, 420);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [ref]);
}

// ─── ExchangeLogo ─────────────────────────────────────────────────────────────

function ExchangeLogo({ id, name, size = 28 }: { id: string; name: string; size?: number }) {
  const color = EXCHANGE_COLORS[id] ?? "#737373";
  return (
    <span
      className="inline-flex flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
      style={{ width: size, height: size, background: `${color}22`, color, border: `1px solid ${color}33` }}
    >
      {name[0]}
    </span>
  );
}

// ─── BalanceChart ─────────────────────────────────────────────────────────────

const CHART_W = 600;
const CHART_H = 100;
const PAD_X   = 2;

function BalanceChart({ data }: { data: BalanceDataPoint[] }) {
  const values = useMemo(() => data.map((d) => d.totalUsd), [data]);

  const { linePath, areaPath } = useMemo(() => {
    if (values.length < 2) return { linePath: "", areaPath: "" };
    const min   = Math.min(...values);
    const max   = Math.max(...values);
    const range = max - min || 1;
    const xStep = (CHART_W - PAD_X * 2) / (values.length - 1);
    const pts   = values.map((v, i) => ({
      x: PAD_X + i * xStep,
      y: CHART_H - 10 - ((v - min) / range) * (CHART_H - 22),
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
        style={{ height: 100 }}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#CAFF5D" stopOpacity="0.28" />
            <stop offset="70%"  stopColor="#CAFF5D" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#CAFF5D" stopOpacity="0.00" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#chart-area)" />
        <path
          d={linePath}
          fill="none"
          stroke="#CAFF5D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="chart-line"
          style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
        />
      </svg>
      <div className="flex items-center justify-between px-px pt-1.5">
        {labelDates.map((d, i) => (
          <span key={i} className="num-mono text-[10px] text-text-tertiary">
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── DonutChart ───────────────────────────────────────────────────────────────

const CX = 80, CY = 80, OUTER_R = 66, INNER_R = 48, GAP_DEG = 3;

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
        const half  = GAP_DEG / 2;
        const path  = sweep > GAP_DEG + 0.5 ? arcPath(start + half, start + sweep - half) : null;
        start += sweep;
        return { ex, path, color: EXCHANGE_COLORS[ex.id] ?? "#737373", pct: total > 0 ? (ex.totalUsd / total) * 100 : 0 };
      });
  }, [exchanges, total]);

  return (
    <svg viewBox="0 0 160 160" className="w-32 h-32 flex-shrink-0" aria-hidden="true">
      {total === 0 ? (
        <circle cx={CX} cy={CY} r={(OUTER_R + INNER_R) / 2} fill="none" stroke="#262626" strokeWidth={OUTER_R - INNER_R} />
      ) : (
        segments.map((s, i) =>
          s.path ? (
            <path
              key={s.ex.id}
              d={s.path}
              fill={s.color}
              style={{ opacity: 0, animation: `reveal-up 300ms cubic-bezier(0.16,1,0.3,1) ${i * 80}ms both` }}
            />
          ) : null
        )
      )}
      <text x={CX} y={CY - 8}  textAnchor="middle" fontSize="10" fill="#737373" fontFamily="Manrope, sans-serif" fontWeight="500">
        Total
      </text>
      <text x={CX} y={CY + 10} textAnchor="middle" fontSize="12" fontWeight="700" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace">
        {fmtUsd(total)}
      </text>
    </svg>
  );
}

// ─── TotalBalanceCard ─────────────────────────────────────────────────────────

const PERIODS = ["7D", "14D", "30D"] as const;
type Period   = (typeof PERIODS)[number];
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
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);
  useMagnetic(ref);

  const filtered = useMemo(() => {
    if (!history) return [];
    return history.slice(-PERIOD_DAYS[period]);
  }, [history, period]);

  return (
    <div
      ref={ref}
      className="reveal magnetic-card rounded-2xl border border-border-subtle bg-surface-1"
      style={{ "--stagger": "0" } as React.CSSProperties}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-surface-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CAFF5D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" />
            </svg>
          </span>
          <span className="text-label-1 font-semibold text-text-secondary">Total Balance</span>
          {/* Live indicator */}
          <span className="live-dot" aria-label="Live" />
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-0.5 rounded-full border border-border-subtle bg-surface-2 p-0.5">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`period-pill ${period === p ? "active" : ""}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-5 pb-5">
        {isLoading ? (
          <div className="space-y-3">
            <div className="skeleton h-9 w-44" />
            <div className="skeleton h-[100px] w-full" />
          </div>
        ) : (
          <>
            <p className="mb-4 flex items-baseline gap-2.5">
              <span className="num-mono text-[36px] font-bold leading-none text-text-primary">
                {total}
              </span>
              <span className="text-sm font-semibold text-primary tracking-wide">USDT</span>
            </p>
            <BalanceChart data={filtered} />
          </>
        )}
      </div>
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
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);
  useMagnetic(ref);

  return (
    <div
      ref={ref}
      className="reveal magnetic-card rounded-2xl border border-border-subtle bg-surface-1"
      style={{ "--stagger": "1" } as React.CSSProperties}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-2.5 px-5 pt-5 pb-4">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-surface-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CAFF5D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
          </svg>
        </span>
        <span className="text-label-1 font-semibold text-text-secondary">Balance Ratio</span>
      </div>

      {/* ── Content ── */}
      <div className="px-5 pb-5">
        {isLoading ? (
          <div className="flex items-center gap-5">
            <div className="skeleton h-32 w-32 rounded-full" />
            <div className="flex-1 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-3.5" style={{ width: `${70 - i * 12}%` }} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <DonutChart exchanges={exchanges ?? []} total={total} />
            <ul className="flex-1 space-y-3">
              {(exchanges ?? []).map((ex, i) => {
                const pct = total > 0 ? (ex.totalUsd / total) * 100 : 0;
                const color = EXCHANGE_COLORS[ex.id] ?? "#737373";
                return (
                  <li
                    key={ex.id}
                    className="dense-row"
                    style={{ "--row-index": i } as React.CSSProperties}
                  >
                    {/* Color stripe + name row */}
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="h-2.5 w-2.5 flex-shrink-0 rounded-sm"
                        style={{ background: color }}
                      />
                      <span className="text-[13px] font-medium text-text-secondary">{ex.name}</span>
                      <span className="num-mono ml-auto text-[11px] text-text-tertiary">
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                    {/* Amount */}
                    <div className="pl-[18px]">
                      <span className="num-mono text-[13px] font-semibold text-text-primary">
                        {fmtUsd(ex.totalUsd)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
});

// ─── OpenPositionsTable ───────────────────────────────────────────────────────

const POSITION_COLS = [
  "Symbol", "Side", "Qty", "Entry", "Market", "Liq. Price", "Unrealized P&L", "Realized P&L",
];

const SideBadge = ({ side }: { side: "long" | "short" }) =>
  side === "long" ? (
    <span className="inline-flex items-center rounded-md bg-positive/10 px-2 py-0.5 text-[11px] font-semibold text-positive">
      Long
    </span>
  ) : (
    <span className="inline-flex items-center rounded-md bg-negative/10 px-2 py-0.5 text-[11px] font-semibold text-negative">
      Short
    </span>
  );

const OpenPositionsTable = memo(function OpenPositionsTable({
  positions,
  exchangeLogoMap,
  isLoading,
}: {
  positions?: OpenPosition[];
  exchangeLogoMap: Record<string, string>;
  isLoading: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  return (
    <section
      ref={ref}
      className="reveal rounded-2xl border border-border-subtle bg-surface-1 overflow-hidden"
      style={{ "--stagger": "2" } as React.CSSProperties}
    >
      {/* ── Section header ── */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-surface-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CAFF5D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="2" y1="12" x2="22" y2="12" /><line x1="12" y1="2" x2="12" y2="22" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </span>
          <span className="text-label-1 font-semibold text-text-primary">Open Positions</span>
          {positions && positions.length > 0 && (
            <span className="num-mono inline-flex items-center rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-text-tertiary">
              {positions.length}
            </span>
          )}
        </div>
        <Link
          href="/mypage/history?section=trade&tab=position"
          className="flex items-center gap-1 text-[12px] font-medium text-text-tertiary transition-colors hover:text-primary focus-ring rounded"
          aria-label="View all positions"
        >
          View all <ArrowUpRight size={13} />
        </Link>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr className="divider-ghost">
              {POSITION_COLS.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap bg-surface-2 px-4 py-2.5 text-left text-[11px] font-medium text-text-tertiary first:pl-5 tracking-wide uppercase"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="divider-ghost">
                  {POSITION_COLS.map((_, j) => (
                    <td key={j} className="px-4 py-3.5 first:pl-5">
                      <div className="skeleton h-3.5" style={{ width: j === 0 ? 80 : 56 }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : !positions?.length ? (
              <tr>
                <td
                  colSpan={POSITION_COLS.length}
                  className="px-5 py-12 text-center text-[13px] text-text-secondary"
                >
                  No open positions at this time.
                </td>
              </tr>
            ) : (
              positions.map((pos, rowIdx) => (
                <tr
                  key={pos.id}
                  className="dense-row divider-ghost transition-colors hover:bg-surface-2/30 group"
                  style={{ "--row-index": rowIdx } as React.CSSProperties}
                >
                  {/* Symbol */}
                  <td className="pl-5 pr-4 py-3.5">
                    <div className="flex items-center gap-2 transition-transform duration-150 group-hover:translate-x-0.5">
                      <ExchangeLogo
                        id={pos.exchangeId}
                        name={exchangeLogoMap[pos.exchangeId] ?? pos.exchangeId}
                        size={22}
                      />
                      <span className="num-mono text-[13px] font-semibold text-text-primary">
                        {pos.symbol}
                      </span>
                    </div>
                  </td>
                  {/* Side */}
                  <td className="px-4 py-3.5">
                    <SideBadge side={pos.side} />
                  </td>
                  {/* Qty */}
                  <td className="px-4 py-3.5 num-mono text-[13px] text-text-secondary">
                    {pos.quantity}
                  </td>
                  {/* Entry */}
                  <td className="px-4 py-3.5 num-mono text-[13px] text-text-secondary">
                    {fmtUsd(pos.entryPrice)}
                  </td>
                  {/* Market */}
                  <td className="px-4 py-3.5 num-mono text-[13px] text-text-secondary">
                    {fmtUsd(pos.marketPrice)}
                  </td>
                  {/* Liq. Price */}
                  <td className="px-4 py-3.5 num-mono text-[13px] font-medium text-negative">
                    {fmtUsd(pos.liqPrice)}
                  </td>
                  {/* Unrealized P&L */}
                  <td className="px-4 py-3.5">
                    <span className={`num-mono block text-[13px] font-semibold ${pos.unrealizedPnlUsd >= 0 ? "text-positive" : "text-negative"}`}>
                      {fmtUsd(pos.unrealizedPnlUsd)}
                      <span className="ml-1.5 text-[11px] font-medium opacity-80">
                        ({fmtPct(pos.unrealizedPnlPct)})
                      </span>
                    </span>
                    <span className="num-mono text-[11px] text-positive opacity-70">
                      +{fmtUsd(pos.unrealizedBaseUsd, 0)} USD
                    </span>
                  </td>
                  {/* Realized P&L */}
                  <td className="px-4 py-3.5 num-mono text-[13px] text-text-secondary">
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
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

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
    const missing  = ALL_EXCHANGES.filter((ae) => !connectedIds.has(ae.id)).map((ae) => ({
      id: ae.id, name: ae.name, logoUrl: "", status: "disconnected" as const,
      connectedAt: "", apiKeyMasked: "",
    }));
    const ids = new Set(errored.map((e) => e.id));
    return [...errored, ...missing.filter((m) => !ids.has(m.id))];
  }, [exchanges, connectedIds]);

  return (
    <section
      ref={ref}
      className="reveal rounded-2xl border border-border-subtle bg-surface-1 p-5"
      style={{ "--stagger": "3" } as React.CSSProperties}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-surface-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CAFF5D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
          </svg>
        </span>
        <span className="text-label-1 font-semibold text-text-primary">Connected Exchanges</span>
      </div>

      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-12 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {connected.length > 0 && (
            <div className="space-y-2">
              <span className="badge-connected">Connected</span>
              <ul className="space-y-2 pt-1">
                {connected.map((ex, i) => (
                  <li
                    key={ex.id}
                    className="dense-row hover-lime-ring flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-2 px-4 py-3 cursor-default"
                    style={{ "--row-index": i } as React.CSSProperties}
                  >
                    <ExchangeLogo id={ex.id} name={ex.name} size={28} />
                    <span className="font-semibold text-[13px] text-text-primary">{ex.name}</span>
                    {ex.uid && (
                      <span className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-text-disabled">UID</span>
                        <span className="num-mono text-[11px] text-text-secondary">{ex.uid}</span>
                      </span>
                    )}
                    <button
                      className="ml-auto flex items-center gap-1.5 text-[11px] font-medium text-negative/60 hover:text-negative transition-colors cursor-pointer"
                      aria-label={`Disconnect ${ex.name}`}
                    >
                      <Unlink size={11} />
                      Disconnect
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {notConnected.length > 0 && (
            <div className="space-y-2">
              <span className="badge-disconnected">Not Connected</span>
              <ul className="space-y-2 pt-1">
                {notConnected.map((ex, i) => (
                  <li
                    key={ex.id}
                    className="dense-row hover-lime-ring flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-2 px-4 py-3"
                    style={{ "--row-index": i } as React.CSSProperties}
                  >
                    <ExchangeLogo id={ex.id} name={ex.name} size={28} />
                    <span className="font-semibold text-[13px] text-text-secondary">{ex.name}</span>
                    <Link
                      href="/mypage/exchanges"
                      className="ml-auto flex items-center gap-1 text-[12px] font-semibold text-primary hover:text-primary-strong transition-colors focus-ring rounded"
                    >
                      Connect <ArrowUpRight size={12} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
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

  const exchangeLogoMap = useMemo(
    () => Object.fromEntries((data?.connectedExchanges ?? []).map((ex) => [ex.id, ex.name])),
    [data]
  );

  if (error) {
    return (
      <div role="alert" className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-[13px] text-text-secondary">Failed to load dashboard data.</p>
        <button
          onClick={handleRetry}
          className="rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-text-inverse hover:bg-primary-strong transition-colors focus-ring cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Row 1: Asymmetric — Balance (wide) + Ratio (narrower) ───────────── */}
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

      {/* ── Row 2: Open Positions ────────────────────────────────────────────── */}
      <OpenPositionsTable
        positions={data?.openPositions}
        exchangeLogoMap={exchangeLogoMap}
        isLoading={isLoading}
      />

      {/* ── Row 3: Connected Exchanges ───────────────────────────────────────── */}
      <ConnectedExchangesSection isLoading={isLoading} />
    </div>
  );
}
