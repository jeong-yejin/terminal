"use client";

import type { ExchangeAsset, AssetPair, FuturesAssetPair } from "@/types/mypage";
import { formatUsd, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";

interface AssetTableProps {
  data?: ExchangeAsset[];
  isLoading?: boolean;
}

/**
 * 거래소별 자산 테이블
 *
 * 섹션:
 *   - Funding Account  — 입출금 대기 잔고
 *   - Spot Account     — 현물 보유 자산
 *   - Futures Account  — 선물 증거금 (Unrealized P&L + Margin Type 컬럼 추가)
 */
export function AssetTable({ data, isLoading }: AssetTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl border border-border-subtle bg-surface-1" />
        ))}
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="rounded-xl border border-border-subtle bg-surface-1 p-8 text-center">
        <p className="text-sm text-text-secondary">No assets held.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((exchange) => (
        <div
          key={exchange.exchangeId}
          className="overflow-hidden rounded-xl border border-border-subtle bg-surface-1"
        >
          {/* 거래소 헤더 */}
          <div className="flex items-center justify-between border-b border-border-subtle bg-surface-2 px-4 py-3">
            <span className="text-sm font-semibold text-text-primary">
              {exchange.exchangeName}
            </span>
            <div className="flex gap-4 text-xs text-text-tertiary">
              <span>Funding <strong className="text-text-secondary">{formatUsd(exchange.fundingTotalUsd)}</strong></span>
              <span>Spot <strong className="text-text-secondary">{formatUsd(exchange.spotTotalUsd ?? 0)}</strong></span>
              <span>Futures <strong className="text-text-secondary">{formatUsd(exchange.futuresTotalUsd ?? 0)}</strong></span>
            </div>
          </div>

          <SpotAccountSection title="Funding Account" pairs={exchange.fundingAccount} />
          <SpotAccountSection title="Spot Account" pairs={exchange.spotAccount ?? []} />
          <FuturesAccountSection pairs={exchange.futuresAccount ?? []} />
        </div>
      ))}
    </div>
  );
}

// ─── Spot / Funding Account ───────────────────────────────────────────────────

function SpotAccountSection({
  title,
  pairs,
}: {
  title: string;
  pairs: AssetPair[];
}) {
  if (!pairs.length) return null;
  const hasChange = pairs.some((p) => p.changePct24h !== undefined);

  return (
    <div>
      <p className="px-4 py-2 text-xs font-medium text-text-tertiary">{title}</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-2/30">
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-text-tertiary">Symbol</th>
            {hasChange && (
              <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-text-tertiary">24h</th>
            )}
            <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-text-tertiary">Value (USD)</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map((pair) => (
            <tr key={pair.symbol} className="border-b border-white/10 last:border-0">
              <td className="px-4 py-2.5 font-medium text-text-primary">{pair.symbol}</td>
              {hasChange && (
                <td className={cn(
                  "px-4 py-2.5 text-right tabular-nums text-xs",
                  pair.changePct24h === undefined ? "text-text-tertiary" :
                  pair.changePct24h >= 0 ? "text-positive" : "text-negative"
                )}>
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
    </div>
  );
}

// ─── Futures Account ──────────────────────────────────────────────────────────

function FuturesAccountSection({ pairs }: { pairs: FuturesAssetPair[] }) {
  if (!pairs.length) return null;

  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-2">
        <p className="text-xs font-medium text-text-tertiary">Futures Account</p>
        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
          PERP
        </span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-2/30">
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-text-tertiary">Symbol</th>
            <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-text-tertiary">Margin</th>
            <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-text-tertiary">Unrealized P&L</th>
            <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-text-tertiary">Value (USD)</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map((pair) => {
            const pnl = pair.unrealizedPnlUsd;
            const pnlPositive = pnl !== undefined && pnl >= 0;
            return (
              <tr key={pair.symbol} className="border-b border-white/10 last:border-0">
                <td className="px-4 py-2.5 font-medium text-text-primary">{pair.symbol}</td>
                <td className="px-4 py-2.5 text-center">
                  {pair.marginType ? (
                    <span className={cn(
                      "inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold",
                      pair.marginType === "cross"
                        ? "bg-surface-3 text-text-secondary"
                        : "bg-surface-3 text-text-tertiary"
                    )}>
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
    </div>
  );
}
