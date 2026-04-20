"use client";

import { ExchangeList } from "./ExchangeList";
import { AddExchangeButton } from "./AddExchangeButton";
import { useExchanges } from "@/hooks/useExchanges";

export function ExchangesPage() {
  const { data, isLoading, refetch } = useExchanges();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Exchanges</h1>
          <p className="mt-0.5 text-sm text-text-tertiary">
            Connect and manage your exchange accounts
          </p>
        </div>
        <AddExchangeButton onSuccess={refetch} />
      </div>

      <ExchangeList
        exchanges={data}
        isLoading={isLoading}
        onDisconnect={refetch}
        onReconnect={refetch}
      />
    </div>
  );
}
