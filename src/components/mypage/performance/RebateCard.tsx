"use client";

import { formatUsd } from "@/lib/format";

interface RebateCardProps {
  totalReceived?: number;
  estimated?: number;
  totalFee?: number;
  isLoading?: boolean;
}

/**
 * Rebate summary card
 * ReboundX core value: expose fee rebates in the context of performance
 *
 * ⚠️ Dev confirmation needed: rebate data integration method
 */
export function RebateCard({ totalReceived, estimated, totalFee, isLoading }: RebateCardProps) {
  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-xl bg-surface-1 border border-border-subtle" />;
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-1 p-5">
      <h2 className="mb-4 text-sm font-medium text-text-secondary">Rebate & Fees</h2>
      <div className="space-y-4">
        <div>
          <p className="text-xs text-text-tertiary">Total Rebate Received</p>
          <p className="mt-0.5 text-xl font-semibold text-positive">
            +{formatUsd(totalReceived)}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-tertiary">Est. Next Rebate</p>
          <p className="mt-0.5 text-base font-medium text-text-primary">
            {formatUsd(estimated)}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-tertiary">Total Fee Paid</p>
          <p className="mt-0.5 text-sm text-text-secondary">{formatUsd(totalFee)}</p>
        </div>
      </div>
    </div>
  );
}
