"use client";

import { useState } from "react";
import { ExchangeSelector } from "./ExchangeSelector";
import { AssetTable } from "./AssetTable";
import { DepositEntryPoint } from "./DepositEntryPoint";
import { useAssets } from "@/hooks/useAssets";

/**
 * Assets 페이지
 *
 * 동선: 거래소 선택 → Funding/Trading 잔고 확인 → 입금 진입
 *
 * 개발 확인 필요:
 *   - 거래소 API에서 Funding/Trading 계좌 분리 지원 여부
 */
export function AssetsPage() {
  const [selectedExchangeId, setSelectedExchangeId] = useState<string>("all");
  const { data, isLoading } = useAssets(selectedExchangeId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Assets</h1>

        <DepositEntryPoint exchangeId={selectedExchangeId} />
      </div>

      <ExchangeSelector
        value={selectedExchangeId}
        onChange={setSelectedExchangeId}
        exchanges={data?.map((e) => ({ id: e.exchangeId, name: e.exchangeName }))}
      />

      <AssetTable data={data} isLoading={isLoading} />
    </div>
  );
}
