"use client";

import { memo, useMemo, useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useOverview } from "@/hooks/useOverview";
import type { BalanceDataPoint } from "@/types/mypage";

// ─── Sparkline ────────────────────────────────────────────────────────────────

const SPARK_W = 400;
const SPARK_H = 48;

function buildLinePath(values: number[]): string {
  if (values.length < 2) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const xStep = SPARK_W / (values.length - 1);
  return values
    .map((v, i) => {
      const x = (i * xStep).toFixed(1);
      const y = (SPARK_H - ((v - min) / range) * (SPARK_H - 6) - 3).toFixed(1);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

function buildAreaPath(values: number[]): string {
  const line = buildLinePath(values);
  if (!line) return "";
  const lastX = ((values.length - 1) * (SPARK_W / (values.length - 1))).toFixed(1);
  return `${line} L${lastX},${SPARK_H} L0,${SPARK_H} Z`;
}

function Sparkline({ data }: { data?: BalanceDataPoint[] }) {
  const values = useMemo(() => data?.map((d) => d.totalUsd) ?? [], [data]);
  if (values.length < 2) return null;

  return (
    <svg
      viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
      role="img"
      aria-label="14-day balance trend chart"
      className="w-full"
      style={{ height: SPARK_H }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(202 255 93)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="rgb(202 255 93)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={buildAreaPath(values)} fill="url(#spark-fill)" />
      <path
        d={buildLinePath(values)}
        fill="none"
        stroke="rgb(202 255 93)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Formatters ───────────────────────────────────────────────────────────────

const NUM_FMT = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function fmtUsd(v?: number): string {
  if (v == null) return "—";
  return NUM_FMT.format(v);
}

function fmtPct(v?: number): string {
  if (v == null) return "—";
  const sign = v >= 0 ? "+" : "";
  return `${sign}${v.toFixed(2)}%`;
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  valueColor?: "default" | "positive" | "negative";
  action: { label: string; href: string };
  isLoading?: boolean;
}

const MetricCard = memo(function MetricCard({
  label, value, unit, valueColor = "default", action, isLoading,
}: MetricCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border-subtle bg-surface-1 p-5">
        <div className="h-3 w-28 animate-pulse rounded bg-surface-3" />
        <div className="mt-3 h-8 w-36 animate-pulse rounded bg-surface-3" />
        <div className="mt-auto pt-4">
          <div className="h-3 w-20 animate-pulse rounded bg-surface-3" />
        </div>
      </div>
    );
  }

  const valueClass =
    valueColor === "positive"
      ? "text-positive"
      : valueColor === "negative"
      ? "text-negative"
      : "text-text-primary";

  return (
    <div className="flex flex-col rounded-xl border border-border-subtle bg-surface-1 p-5">
      <p className="text-caption font-medium uppercase tracking-wider text-text-tertiary">
        {label}
      </p>

      <p className="mt-2 flex items-baseline gap-1.5">
        <span className={`text-[22px] font-semibold leading-tight tabular-nums ${valueClass}`}>
          {value}
        </span>
        {unit && (
          <span className="text-sm font-medium text-primary">{unit}</span>
        )}
      </p>

      <div className="mt-auto pt-4">
        <Link
          href={action.href}
          className="inline-flex items-center gap-1 text-label-2 font-medium text-text-disabled
            transition-colors hover:text-text-primary
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:rounded-sm focus-visible:outline-offset-2"
        >
          {action.label}
          <ArrowUpRight size={13} aria-hidden />
        </Link>
      </div>
    </div>
  );
});

// ─── ExchangeStatusBar ────────────────────────────────────────────────────────

function ExchangeStatusBar({
  exchanges,
  isLoading,
}: {
  exchanges?: ReturnType<typeof useOverview>["data"] extends { connectedExchanges: infer T } ? T : never;
  isLoading: boolean;
}) {
  return (
    <div
      className="rounded-xl border border-border-subtle bg-surface-1 px-5 py-4"
      aria-labelledby="exchange-bar-heading"
    >
      <p
        id="exchange-bar-heading"
        className="mb-3 text-caption font-medium uppercase tracking-wider text-text-tertiary"
      >
        Connected Exchanges
      </p>

      {isLoading ? (
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-28 animate-pulse rounded-lg bg-surface-2" />
          ))}
        </div>
      ) : !exchanges?.length ? (
        <p className="text-sm text-text-secondary">
          No exchanges connected.{" "}
          <Link
            href="/mypage/exchanges"
            className="font-medium text-primary hover:text-primary-strong focus-ring"
          >
            Add one →
          </Link>
        </p>
      ) : (
        <ul
          className="flex flex-wrap gap-2"
          role="list"
          aria-label="Exchange connection status"
        >
          {exchanges.map((ex) => {
            const isError = ex.status === "error";
            return (
              <li
                key={ex.id}
                className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm ${
                  isError
                    ? "border-negative/30 bg-negative/5"
                    : "border-border-subtle bg-surface-2"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 flex-shrink-0 rounded-full ${
                    isError ? "bg-negative" : "bg-positive"
                  }`}
                />
                <span className="font-medium text-text-primary">{ex.name}</span>
                <span
                  className={`text-xs ${isError ? "text-negative" : "text-positive"}`}
                  aria-label={`${ex.name}: ${isError ? "Error" : "Connected"}`}
                >
                  {isError ? "Error" : "Connected"}
                </span>
                {isError && (
                  <Link
                    href="/mypage/exchanges"
                    className="ml-0.5 text-xs font-medium text-primary hover:text-primary-strong
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:rounded-sm"
                    aria-label={`Reconnect ${ex.name}`}
                  >
                    Reconnect →
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ─── RecentActivitySection ────────────────────────────────────────────────────

function RecentActivitySection({
  openPositions,
  isLoading,
}: {
  openPositions: number;
  isLoading: boolean;
}) {
  return (
    <div
      className="rounded-xl border border-border-subtle bg-surface-1 px-5 py-5"
      aria-labelledby="activity-heading"
    >
      <p
        id="activity-heading"
        className="mb-4 text-caption font-medium uppercase tracking-wider text-text-tertiary"
      >
        {!isLoading && openPositions > 0 ? "My Positions" : "Recent Trades"}
      </p>

      {isLoading ? (
        <div className="space-y-2.5" aria-busy="true" aria-label="Loading activity">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-9 animate-pulse rounded-lg bg-surface-2" />
          ))}
        </div>
      ) : openPositions > 0 ? (
        <div className="space-y-2">
          <p className="text-sm text-text-secondary">
            You have{" "}
            <span className="font-semibold text-text-primary">{openPositions}</span>{" "}
            open {openPositions === 1 ? "position" : "positions"}.
          </p>
          <Link
            href="/mypage/history?section=trade&tab=position"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary
              hover:text-primary-strong focus-ring"
          >
            View all positions <ArrowUpRight size={14} aria-hidden />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <p className="text-sm text-text-secondary">No open positions right now.</p>
          <p className="text-xs text-text-tertiary">
            Explore markets to find your next opportunity.
          </p>
          <Link
            href="#"
            className="mt-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-text-inverse
              hover:bg-primary-strong focus-ring"
            aria-label="Explore markets to start trading"
          >
            Explore Markets
          </Link>
        </div>
      )}
    </div>
  );
}

// ─── OverviewPage ─────────────────────────────────────────────────────────────

export function OverviewPage() {
  const { data, isLoading, error, refetch } = useOverview();
  const handleRetry = useCallback(() => refetch(), [refetch]);

  const m = useMemo(() => {
    const s = data?.summary;
    const pct = s?.pnl24hPct ?? 0;
    return {
      totalBalance: fmtUsd(s?.totalAssetUsd),
      availableBalance: fmtUsd(s?.availableBalanceUsd),
      pnl24h: fmtPct(pct),
      pnl24hPositive: pct >= 0,
      todayChange: fmtPct(pct),
      openPositions: s?.openPositionsCount ?? 0,
    };
  }, [data]);

  if (error) {
    return (
      <div role="alert" className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-sm text-text-secondary">Failed to load data.</p>
        <button
          onClick={handleRetry}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-text-inverse
            hover:bg-primary-strong focus-ring"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* ── Row 1: Total Balance + Sparkline ─────────────────────── */}
      <section aria-labelledby="total-balance-heading">
        <div className="rounded-xl p-[1px] bg-gradient-to-b from-primary/10 to-primary/60">
          <div className="rounded-xl bg-surface-1 px-6 pt-6 pb-4">
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-4 w-32 animate-pulse rounded bg-surface-3" />
                <div className="h-10 w-64 animate-pulse rounded bg-surface-3" />
                <div className="mt-2 h-12 w-full animate-pulse rounded bg-surface-3" />
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p
                      id="total-balance-heading"
                      className="text-caption font-medium uppercase tracking-wider text-text-tertiary"
                    >
                      Total Balance
                    </p>
                    <p className="mt-1 flex items-baseline gap-2">
                      <span className="text-[32px] font-bold leading-tight text-text-primary tabular-nums">
                        {m.totalBalance}
                      </span>
                      <span className="text-lg font-semibold text-primary">USDT</span>
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      m.pnl24hPositive
                        ? "bg-positive/10 text-positive"
                        : "bg-negative/10 text-negative"
                    }`}
                    role="status"
                    aria-live="polite"
                    aria-label={`Today's change: ${m.todayChange}`}
                  >
                    {m.pnl24hPositive ? "↑" : "↓"} Today {m.todayChange}
                  </span>
                </div>

                {/* Sparkline */}
                <div className="mt-5" aria-hidden="true">
                  <Sparkline data={data?.balanceHistory} />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Row 2: Available Balance · 24H P&L · Open Positions ──── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" role="list" aria-label="Key metrics">
        <div role="listitem">
          <MetricCard
            label="Available Balance"
            value={m.availableBalance}
            unit="USDT"
            isLoading={isLoading}
            action={{ label: "Transfer", href: "/mypage/history?section=transaction&tab=transfer" }}
          />
        </div>
        <div role="listitem">
          <MetricCard
            label="24H P&L"
            value={m.pnl24h}
            valueColor={isLoading ? "default" : m.pnl24hPositive ? "positive" : "negative"}
            isLoading={isLoading}
            action={{ label: "Trade History", href: "/mypage/history?section=trade&tab=order" }}
          />
        </div>
        <div role="listitem">
          <MetricCard
            label="Open Positions"
            value={isLoading ? "—" : m.openPositions === 0 ? "None" : String(m.openPositions)}
            isLoading={isLoading}
            action={
              m.openPositions > 0
                ? { label: "View Positions", href: "/mypage/history?section=trade&tab=position" }
                : { label: "Start Trading", href: "#" }
            }
          />
        </div>
      </div>

      {/* ── Row 3: Connected Exchanges ───────────────────────────── */}
      <ExchangeStatusBar
        exchanges={data?.connectedExchanges}
        isLoading={isLoading}
      />

      {/* ── Row 4: Recent Activity / My Positions ────────────────── */}
      <RecentActivitySection
        openPositions={m.openPositions}
        isLoading={isLoading}
      />

    </div>
  );
}
