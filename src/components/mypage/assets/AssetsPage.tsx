"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, TrendingUp, Wallet, ArrowDownToLine } from "lucide-react";
import { useAssets } from "@/hooks/useAssets";
import { formatUsd } from "@/lib/format";
import { DepositModal } from "./DepositModal";

/**
 * Asset overview page (|2|)
 *
 * Layout:
 *   - Grand total / Funding total / Trading total summary cards
 *   - Per-exchange summary cards (→ detail page at /mypage/assets/[exchangeId])
 *     Each card has a quick Deposit action so users can fund without navigating deeper.
 *
 * Deposit button placement: inline in the exchange card row, at the point
 * where users are scanning their balances — the natural trigger for depositing
 * (WCAG success criterion 3.2.4 — consistent + contextual placement).
 */
export function AssetsPage() {
  const { data, isLoading } = useAssets("all");
  const [depositTarget, setDepositTarget] = useState<{ id: string; name: string } | null>(null);

  const totalFunding = data?.reduce((s, e) => s + e.fundingTotalUsd, 0) ?? 0;
  const totalTrading = data?.reduce((s, e) => s + e.tradingTotalUsd, 0) ?? 0;
  const grandTotal = totalFunding + totalTrading;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-text-primary">Asset</h1>

      {/* ── Total summary cards ────────────────────────────────────── */}
      <section aria-labelledby="asset-summary-heading">
        <h2 id="asset-summary-heading" className="sr-only">
          Asset Summary
        </h2>

        {isLoading ? (
          <div
            aria-busy="true"
            aria-label="Loading assets"
            role="status"
            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-xl border border-border-subtle bg-surface-1"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Grand Total — gradient border highlight */}
            <div className="rounded-xl p-[1px] bg-gradient-to-b from-primary/20 to-primary/60">
              <div className="h-full rounded-xl bg-surface-1 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-primary">
                    <Wallet size={14} className="text-primary" aria-hidden />
                  </div>
                  <span className="text-caption font-medium text-text-tertiary">
                    Total Assets
                  </span>
                </div>
                <p className="text-[22px] font-bold text-text-primary tabular-nums">
                  {formatUsd(grandTotal)}
                </p>
                <p className="mt-0.5 text-xs text-primary">USDT</p>
              </div>
            </div>

            {/* Funding Total */}
            <div className="rounded-xl border border-border-subtle bg-surface-1 p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2">
                  <Wallet size={14} className="text-text-secondary" aria-hidden />
                </div>
                <span className="text-caption font-medium text-text-tertiary">
                  Total Funding
                </span>
              </div>
              <p className="text-[22px] font-semibold text-text-primary tabular-nums">
                {formatUsd(totalFunding)}
              </p>
              <p className="mt-0.5 text-xs text-text-tertiary">USDT</p>
            </div>

            {/* Trading Total */}
            <div className="rounded-xl border border-border-subtle bg-surface-1 p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2">
                  <TrendingUp size={14} className="text-text-secondary" aria-hidden />
                </div>
                <span className="text-caption font-medium text-text-tertiary">
                  Total Trading
                </span>
              </div>
              <p className="text-[22px] font-semibold text-text-primary tabular-nums">
                {formatUsd(totalTrading)}
              </p>
              <p className="mt-0.5 text-xs text-text-tertiary">USDT</p>
            </div>
          </div>
        )}
      </section>

      {/* ── Per-exchange cards ─────────────────────────────────────── */}
      <section aria-labelledby="exchange-list-heading">
        <h2
          id="exchange-list-heading"
          className="mb-3 text-caption font-medium uppercase tracking-wider text-text-tertiary"
        >
          Connected Exchanges
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl border border-border-subtle bg-surface-1"
              />
            ))}
          </div>
        ) : !data?.length ? (
          <div className="rounded-xl border border-border-subtle bg-surface-1 p-10 text-center">
            <p className="text-sm text-text-secondary">No exchanges connected.</p>
            <p className="mt-1 text-xs text-text-tertiary">
              Connect an exchange from the{" "}
              <Link
                href="/mypage/exchanges"
                className="font-medium text-primary hover:text-primary-strong focus-ring"
              >
                My Exchanges
              </Link>{" "}
              menu.
            </p>
          </div>
        ) : (
          <ul role="list" className="space-y-3">
            {data.map((exchange) => {
              const total = exchange.fundingTotalUsd + exchange.tradingTotalUsd;
              const topAssets = [...exchange.fundingAccount, ...exchange.tradingAccount]
                .sort((a, b) => b.valueUsd - a.valueUsd)
                .slice(0, 3);

              return (
                <li key={exchange.exchangeId}>
                  <div className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-1 px-4 py-3
                    transition-colors hover:border-primary/30">

                    {/* ── Detail link (occupies most of the row) ── */}
                    <Link
                      href={`/mypage/assets/${exchange.exchangeId}`}
                      className="group flex min-w-0 flex-1 items-center gap-4
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:rounded-lg focus-visible:outline-offset-2"
                      aria-label={`View ${exchange.exchangeName} asset details`}
                    >
                      {/* Exchange name + top assets */}
                      <div className="min-w-[110px]">
                        <p className="text-sm font-semibold text-text-primary">
                          {exchange.exchangeName}
                        </p>
                        <p className="mt-0.5 text-xs text-text-tertiary">
                          {topAssets.map((a) => a.symbol).join(" · ") || "—"}
                        </p>
                      </div>

                      {/* Funding / Trading breakdown */}
                      <div className="flex flex-1 gap-6 text-xs">
                        <div>
                          <p className="text-text-tertiary">Funding</p>
                          <p className="mt-0.5 font-medium tabular-nums text-text-secondary">
                            {formatUsd(exchange.fundingTotalUsd)}
                          </p>
                        </div>
                        <div>
                          <p className="text-text-tertiary">Trading</p>
                          <p className="mt-0.5 font-medium tabular-nums text-text-secondary">
                            {formatUsd(exchange.tradingTotalUsd)}
                          </p>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="text-right">
                        <p className="text-xs text-text-tertiary">Total</p>
                        <p className="mt-0.5 text-sm font-semibold tabular-nums text-text-primary">
                          {formatUsd(total)}
                        </p>
                      </div>

                      <ChevronRight
                        size={15}
                        className="flex-shrink-0 text-text-tertiary transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>

                    {/* ── Deposit button — right side, separated from the nav link
                        so it's a distinct action and doesn't confuse keyboard/
                        screen-reader users (WCAG 1.3.1, 2.4.6) ── */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDepositTarget({
                          id: exchange.exchangeId,
                          name: exchange.exchangeName,
                        });
                      }}
                      className="flex-shrink-0 flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5
                        text-xs font-semibold text-text-inverse
                        hover:bg-primary-strong focus-ring"
                      aria-label={`Deposit to ${exchange.exchangeName}`}
                    >
                      <ArrowDownToLine size={13} aria-hidden />
                      Deposit
                    </button>

                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Deposit modal ───────────────────────────────────────────── */}
      {depositTarget && (
        <DepositModal
          exchangeId={depositTarget.id}
          exchangeName={depositTarget.name}
          open={true}
          onClose={() => setDepositTarget(null)}
        />
      )}
    </div>
  );
}
