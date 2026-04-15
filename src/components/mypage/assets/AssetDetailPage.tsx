"use client";

import Link from "next/link";
import { ArrowLeft, ArrowDownToLine, ArrowLeftRight } from "lucide-react";
import { useAssets } from "@/hooks/useAssets";
import { formatUsd } from "@/lib/format";

interface AssetDetailPageProps {
  exchangeId: string;
}

/**
 * Asset Detail page (|2.1|)
 *
 * Shows Funding and Trading account balances for one specific exchange.
 *
 * Action buttons (WCAG-compliant placement — at point of use, not buried in menus):
 *   - Deposit: header area → initiates deposit flow for the Funding account
 *   - Transfer: header area → moves funds between Funding ↔ Trading accounts
 */
export function AssetDetailPage({ exchangeId }: AssetDetailPageProps) {
  const { data: allData, isLoading } = useAssets("all");
  const exchange = allData?.find((e) => e.exchangeId === exchangeId);

  if (isLoading) {
    return (
      <div className="space-y-4">
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

  const grandTotal = exchange.fundingTotalUsd + exchange.tradingTotalUsd;

  return (
    <div className="space-y-6">

      {/* ── Back link ── */}
      <Link
        href="/mypage/assets"
        className="inline-flex items-center gap-1.5 text-xs text-text-tertiary
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
          {/* Balance summary badges */}
          <div className="mt-2 flex flex-wrap gap-2 text-xs" aria-label="Balance summary">
            <span className="rounded-lg bg-surface-2 px-3 py-1.5 text-text-secondary">
              Funding{" "}
              <strong className="text-text-primary">{formatUsd(exchange.fundingTotalUsd)}</strong>
            </span>
            <span className="rounded-lg bg-surface-2 px-3 py-1.5 text-text-secondary">
              Trading{" "}
              <strong className="text-text-primary">{formatUsd(exchange.tradingTotalUsd)}</strong>
            </span>
            <span className="rounded-lg border border-primary/30 bg-accent-primary px-3 py-1.5 text-text-secondary">
              Total{" "}
              <strong className="text-primary">{formatUsd(grandTotal)}</strong>
            </span>
          </div>
        </div>

        {/*
          ── Action buttons — placed in the header, adjacent to the asset info,
          so users can immediately act after viewing their balance (WCAG 3.2.4 /
          consistent navigation + task proximity principle).
        */}
        <div className="flex items-center gap-2">
          {/* Transfer: move funds between Funding ↔ Trading */}
          <Link
            href={`/mypage/history?section=transaction&tab=transfer`}
            className="flex items-center gap-1.5 rounded-md border border-border-subtle
              px-3 py-2 text-sm font-medium text-text-secondary
              hover:border-primary/40 hover:text-text-primary
              focus-ring transition-colors"
            aria-label={`Transfer funds on ${exchange.exchangeName}`}
          >
            <ArrowLeftRight size={15} aria-hidden />
            Transfer
          </Link>

          {/* Deposit: add funds to Funding account */}
          <button
            onClick={() => {
              // TODO: navigate to exchange-specific deposit flow
              // e.g. window.open(`https://${exchangeId}.com/deposit`, '_blank')
            }}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2
              text-sm font-semibold text-text-inverse
              hover:bg-primary-strong focus-ring"
            aria-label={`Deposit to ${exchange.exchangeName} Funding account`}
          >
            <ArrowDownToLine size={15} aria-hidden />
            Deposit
          </button>
        </div>
      </div>

      {/* ── Funding Account ── */}
      <AccountSection
        title="Funding Account"
        pairs={exchange.fundingAccount}
        totalUsd={exchange.fundingTotalUsd}
        sectionId={`${exchangeId}-funding`}
      />

      {/* ── Trading Account ── */}
      <AccountSection
        title="Trading Account"
        pairs={exchange.tradingAccount}
        totalUsd={exchange.tradingTotalUsd}
        sectionId={`${exchangeId}-trading`}
      />

    </div>
  );
}

// ─── AccountSection ───────────────────────────────────────────────────────────

interface AccountSectionProps {
  title: string;
  pairs: Array<{ symbol: string; quantity: number; valueUsd: number }>;
  totalUsd: number;
  sectionId: string;
}

function AccountSection({ title, pairs, totalUsd, sectionId }: AccountSectionProps) {
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
                <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-text-tertiary">
                  Quantity
                </th>
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
                  <td className="px-4 py-2.5 text-right tabular-nums text-text-secondary">
                    {pair.quantity}
                  </td>
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
