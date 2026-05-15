"use client";

import { ExchangeList } from "./ExchangeList";
import { useExchanges } from "@/hooks/useExchanges";

export function ExchangesPage() {
  const { data, isLoading, refetch } = useExchanges();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-display-h5 font-bold text-text-primary tracking-[-0.005em]">
          Exchanges
        </h1>
        <p className="text-body-3 text-text-tertiary">
          Manage your connected exchanges and check their connection status.
        </p>
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
