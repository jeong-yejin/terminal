"use client";

import type { ExchangeAsset } from "@/types/mypage";
import { formatUsd, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";

interface AssetTableProps {
  data?: ExchangeAsset[];
  isLoading?: boolean;
}

/**
 * 거래소별 자산 테이블
 *
 * 구성:
 *   - 거래소 헤더 (이름 + Funding total / Trading total)
 *   - Funding Account 섹션 → 페어별 행
 *   - Trading Account 섹션 → 페어별 행
 *
 * 컬럼: Symbol / Value (USD) / 24h (데이터 있을 때만)
 *
 * 빈 상태: "보유 자산이 없습니다"
 * 로딩: 스켈레톤 행 3개
 */
export function AssetTable({ data, isLoading }: AssetTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-surface-1 border border-border-subtle" />
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
              <span>Trading <strong className="text-text-secondary">{formatUsd(exchange.tradingTotalUsd)}</strong></span>
            </div>
          </div>

          {/* Funding Account */}
          <AccountSection title="Funding Account" pairs={exchange.fundingAccount} />

          {/* Trading Account */}
          <AccountSection title="Trading Account" pairs={exchange.tradingAccount} />
        </div>
      ))}
    </div>
  );
}

function AccountSection({
  title,
  pairs,
}: {
  title: string;
  pairs: ExchangeAsset["fundingAccount"];
}) {
  if (!pairs.length) return null;

  const hasChange = pairs.some((p) => p.changePct24h !== undefined);

  return (
    <div>
      <p className="px-4 py-2 text-xs font-medium text-text-tertiary">{title}</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-2/30">
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-text-tertiary">
              Symbol
            </th>
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
            <tr key={pair.symbol} className="border-b border-white/10 last:border-0">
              <td className="px-4 py-2.5 font-medium text-text-primary">{pair.symbol}</td>
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
    </div>
  );
}
