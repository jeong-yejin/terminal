"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowDownToLine, ArrowLeftRight, ArrowUpToLine, TrendingUp, ExternalLink } from "lucide-react";
import { useAssets } from "@/hooks/useAssets";
import { formatUsd, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";
import { getWithdrawUrl } from "@/lib/exchangeUrls";
import { DepositModal } from "./DepositModal";
import type { FuturesAssetPair } from "@/types/mypage";

interface AssetDetailPageProps {
  exchangeId: string;
}

/**
 * Asset Detail page (|2.1|)
 *
 * Shows Funding and Trading account balances for one specific exchange.
 *
 * Action buttons (WCAG-compliant placement — at point of use, not buried in menus):
 *   - Trade:    opens trading interface for this exchange
 *   - Transfer: moves funds between Funding ↔ Trading accounts
 *   - Deposit:  navigates to deposit flow for the Funding account
 */
export function AssetDetailPage({ exchangeId }: AssetDetailPageProps) {
  const [showQuantity, setShowQuantity] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const { data: allData, isLoading } = useAssets("all");
  const exchange = allData?.find((e) => e.exchangeId === exchangeId);

  if (isLoading) {
    return (
      <div aria-busy="true" aria-label="Loading assets" role="status" className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-2" />
        <div className="h-64 animate-pulse rounded-xl border border-border-subtle bg-surface-1" />
      </div>
    );
  }

  if (!exchange) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-sm text-text-secondary">Exchange not found.</p>
        <Link
          href="/mypage/assets"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-text-inverse
            hover:bg-primary-strong focus-ring"
        >
          Back to Assets
        </Link>
      </div>
    );
  }

  const grandTotal = exchange.fundingTotalUsd + (exchange.spotTotalUsd ?? 0) + (exchange.futuresTotalUsd ?? 0);

  // M2: connection status indicator
  const statusColor =
    exchange.status === "connected" ? "bg-green-500" :
    exchange.status === "error"     ? "bg-red-500" :
    exchange.status === "disconnected" ? "bg-yellow-400" :
    "bg-text-tertiary/40";
  const statusLabel = exchange.status ?? "status unknown";
  const syncedAt = exchange.lastSyncedAt
    ? new Date(exchange.lastSyncedAt).toLocaleString("en-US", {
        hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short",
      })
    : null;

  return (
    <div className="space-y-6">

      {/* ── Back link — M3: min-h-[44px] WCAG 2.5.5 touch target ── */}
      <Link
        href="/mypage/assets"
        className="inline-flex min-h-[44px] items-center gap-1.5 px-1 text-xs text-text-tertiary
          hover:text-text-primary focus-ring"
        aria-label="Back to Assets overview"
      >
        <ArrowLeft size={13} aria-hidden />
        Back to Assets
      </Link>

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">
            {exchange.exchangeName}
          </h1>

          {/* M2: connection status + last sync */}
          <div className="mt-1 flex items-center gap-1.5">
            <span className={cn("h-1.5 w-1.5 rounded-full", statusColor)} aria-hidden />
            <span className="text-xs text-text-tertiary capitalize">{statusLabel}</span>
            {syncedAt && (
              <span className="text-xs text-text-tertiary">· Synced {syncedAt}</span>
            )}
          </div>

          {/* S1: Grand Total as prominent number — not a chip badge */}
          <p
            className="mt-2 text-2xl font-semibold tabular-nums text-text-primary"
            aria-label="Total balance"
          >
            {formatUsd(grandTotal)}
          </p>
          <p className="mt-0.5 text-xs text-text-tertiary">Total balance</p>
        </div>

        {/*
          ── Action buttons — placed adjacent to balance info for task proximity.
          All buttons meet WCAG 2.5.5 (min-h-[44px]).
        */}
        <div className="flex items-center gap-2">

          {/* S4: Trade — enter trading interface for this exchange */}
          <Link
            href={`/trade?exchange=${exchangeId}`}
            className="flex items-center gap-1.5 rounded-md min-h-[44px] px-3 py-2.5
              border border-border-subtle text-sm font-medium text-text-secondary
              hover:border-primary/40 hover:text-text-primary focus-ring transition-colors"
            title="Open trading interface for this exchange"
            aria-label={`Trade on ${exchange.exchangeName}`}
          >
            <TrendingUp size={15} aria-hidden />
            Trade
          </Link>

          {/* Transfer — 서비스 내부 (계좌 간 이체) */}
          <Link
            href={`/mypage/history?section=transaction&tab=transfer&exchange=${exchangeId}`}
            className="flex items-center gap-1.5 rounded-md min-h-[44px] px-3 py-2.5
              border border-border-subtle text-sm font-medium text-text-secondary
              hover:border-primary/40 hover:text-text-primary focus-ring transition-colors"
            title="Move funds between Funding · Spot · Futures accounts"
            aria-label={`Transfer funds on ${exchange.exchangeName}`}
          >
            <ArrowLeftRight size={15} aria-hidden />
            Transfer
          </Link>

          {/* Withdraw — 거래소 외부 처리 (external link) */}
          <a
            href={getWithdrawUrl(exchangeId)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md min-h-[44px] px-3 py-2.5
              border border-border-subtle text-sm font-medium text-text-secondary
              hover:border-primary/40 hover:text-text-primary focus-ring transition-colors"
            title={`Withdraw on ${exchange.exchangeName} (opens exchange website)`}
            aria-label={`Withdraw from ${exchange.exchangeName} — opens exchange website`}
          >
            <ArrowUpToLine size={15} aria-hidden />
            Withdraw
            <ExternalLink size={11} className="text-text-tertiary" aria-hidden />
          </a>

          {/* Deposit — 서비스 내부 (primary CTA) */}
          <button
            onClick={() => setDepositOpen(true)}
            className="flex items-center gap-1.5 rounded-md bg-primary min-h-[44px] px-3 py-2.5
              text-sm font-semibold text-text-inverse hover:bg-primary-strong focus-ring"
            title="Add external funds to your Funding account"
            aria-label={`Deposit to ${exchange.exchangeName} Funding account`}
          >
            <ArrowDownToLine size={15} aria-hidden />
            Deposit
          </button>
        </div>
      </div>

      {/* 🟢 Quantity column toggle — default hidden per UX recommendation */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowQuantity((v) => !v)}
          className="text-xs text-text-tertiary hover:text-text-primary focus-ring
            underline-offset-2 hover:underline"
          aria-pressed={showQuantity}
        >
          {showQuantity ? "Hide quantity" : "Show quantity"}
        </button>
      </div>

      {/* ── Funding Account ── */}
      <AccountSection
        title="Funding Account"
        pairs={exchange.fundingAccount}
        totalUsd={exchange.fundingTotalUsd}
        sectionId={`${exchangeId}-funding`}
        showQuantity={showQuantity}
      />

      {/* ── Spot Account ── */}
      <AccountSection
        title="Spot Account"
        pairs={exchange.spotAccount ?? []}
        totalUsd={exchange.spotTotalUsd ?? 0}
        sectionId={`${exchangeId}-spot`}
        showQuantity={showQuantity}
      />

      {/* ── Futures Account ── */}
      <FuturesAccountSection
        pairs={exchange.futuresAccount ?? []}
        totalUsd={exchange.futuresTotalUsd ?? 0}
        sectionId={`${exchangeId}-futures`}
        showQuantity={showQuantity}
      />

      <DepositModal
        exchangeId={exchange.exchangeId}
        exchangeName={exchange.exchangeName}
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
      />
    </div>
  );
}

// ─── AccountSection ───────────────────────────────────────────────────────────

interface AccountSectionProps {
  title: string;
  pairs: Array<{ symbol: string; quantity: number; valueUsd: number; changePct24h?: number }>;
  totalUsd: number;
  sectionId: string;
  showQuantity: boolean;
}

function AccountSection({ title, pairs, totalUsd, sectionId, showQuantity }: AccountSectionProps) {
  // S3: only render 24h column when at least one pair has the data
  const hasChange = pairs.some((p) => p.changePct24h !== undefined);

  return (
    <section aria-labelledby={`${sectionId}-heading`}>
      <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-1">
        {/* Section header */}
        <div className="flex items-center justify-between border-b border-border-subtle bg-surface-2 px-4 py-3">
          <h2
            id={`${sectionId}-heading`}
            className="text-sm font-semibold text-text-primary"
          >
            {title}
          </h2>
          <span className="text-xs text-text-tertiary">
            Total{" "}
            <strong className="text-text-secondary">{formatUsd(totalUsd)}</strong>
          </span>
        </div>

        {!pairs.length ? (
          <p className="px-4 py-8 text-center text-sm text-text-secondary">
            No assets in this account.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-2/30">
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-text-tertiary">
                  Symbol
                </th>
                {showQuantity && (
                  <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-text-tertiary">
                    Quantity
                  </th>
                )}
                {/* S3: 24h change column */}
                {hasChange && (
                  <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-text-tertiary">
                    24h
                  </th>
                )}
                <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-text-tertiary">
                  Value (USD)
                </th>
              </tr>
            </thead>
            <tbody>
              {pairs.map((pair) => (
                <tr
                  key={pair.symbol}
                  className="border-b border-white/10 transition-colors hover:bg-surface-2/30 last:border-0"
                >
                  <td className="px-4 py-2.5 font-medium text-text-primary">
                    {pair.symbol}
                  </td>
                  {showQuantity && (
                    <td className="px-4 py-2.5 text-right tabular-nums text-text-secondary">
                      {pair.quantity}
                    </td>
                  )}
                  {hasChange && (
                    <td
                      className={cn(
                        "px-4 py-2.5 text-right tabular-nums text-xs",
                        pair.changePct24h === undefined ? "text-text-tertiary" :
                        pair.changePct24h >= 0              ? "text-green-500" : "text-red-400"
                      )}
                    >
                      {pair.changePct24h !== undefined ? formatPct(pair.changePct24h) : "—"}
                    </td>
                  )}
                  <td className="px-4 py-2.5 text-right font-medium tabular-nums text-text-primary">
                    {formatUsd(pair.valueUsd)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

// ─── FuturesAccountSection ────────────────────────────────────────────────────

interface FuturesAccountSectionProps {
  pairs: FuturesAssetPair[];
  totalUsd: number;
  sectionId: string;
  showQuantity: boolean;
}

function FuturesAccountSection({ pairs, totalUsd, sectionId, showQuantity }: FuturesAccountSectionProps) {
  return (
    <section aria-labelledby={`${sectionId}-heading`}>
      <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-1">
        {/* Section header */}
        <div className="flex items-center justify-between border-b border-border-subtle bg-surface-2 px-4 py-3">
          <div className="flex items-center gap-2">
            <h2
              id={`${sectionId}-heading`}
              className="text-sm font-semibold text-text-primary"
            >
              Futures Account
            </h2>
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              PERP
            </span>
          </div>
          <span className="text-xs text-text-tertiary">
            Total{" "}
            <strong className="text-text-secondary">{formatUsd(totalUsd)}</strong>
          </span>
        </div>

        {!pairs.length ? (
          <p className="px-4 py-8 text-center text-sm text-text-secondary">
            No assets in this account.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-2/30">
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-text-tertiary">
                  Symbol
                </th>
                {showQuantity && (
                  <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-text-tertiary">
                    Quantity
                  </th>
                )}
                <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-text-tertiary">
                  Margin
                </th>
                <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-text-tertiary">
                  Unrealized P&L
                </th>
                <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-text-tertiary">
                  Value (USD)
                </th>
              </tr>
            </thead>
            <tbody>
              {pairs.map((pair) => {
                const pnl = pair.unrealizedPnlUsd;
                const pnlPositive = pnl !== undefined && pnl >= 0;
                return (
                  <tr
                    key={pair.symbol}
                    className="border-b border-white/10 transition-colors hover:bg-surface-2/30 last:border-0"
                  >
                    <td className="px-4 py-2.5 font-medium text-text-primary">
                      {pair.symbol}
                    </td>
                    {showQuantity && (
                      <td className="px-4 py-2.5 text-right tabular-nums text-text-secondary">
                        {pair.quantity}
                      </td>
                    )}
                    <td className="px-4 py-2.5 text-center">
                      {pair.marginType ? (
                        <span className="inline-block rounded bg-surface-3 px-1.5 py-0.5 text-[10px] font-semibold text-text-secondary">
                          {pair.marginType.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-xs text-text-tertiary">—</span>
                      )}
                    </td>
                    <td className={cn(
                      "px-4 py-2.5 text-right tabular-nums text-xs font-medium",
                      pnl === undefined ? "text-text-tertiary" :
                      pnlPositive ? "text-positive" : "text-negative"
                    )}>
                      {pnl !== undefined ? `${pnlPositive ? "+" : ""}${formatUsd(pnl)}` : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium tabular-nums text-text-primary">
                      {formatUsd(pair.valueUsd)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
