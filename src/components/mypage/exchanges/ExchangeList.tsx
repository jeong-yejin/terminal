"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Unlink } from "lucide-react";
import type { ExchangeConnection } from "@/types/mypage";
import { cn } from "@/lib/utils";
import { disconnectExchange } from "@/lib/api/exchanges";
import { ConnectExchangeModal } from "./ConnectExchangeModal";

const EXCHANGE_BRAND_BG: Record<string, string> = {
  bybit:   "#15192a",
  binance: "#f0b90b",
};

const SYMBOL_LOGO: Record<string, string> = {
  binance: "/logos/symbol/icon=binance.svg",
  bybit:   "/logos/symbol/icon=bybit.svg",
  okx:     "/logos/symbol/icon=okx.svg",
};

const STATUS_META: Record<
  ExchangeConnection["status"],
  { label: string; badge: string }
> = {
  connected:    { label: "Connected",     badge: "bg-primary/10 text-[#b3e84e]" },
  disconnected: { label: "Not Connected", badge: "bg-cautionary/10 text-cautionary" },
  error:        { label: "Error",         badge: "bg-negative/10 text-negative" },
};

interface ExchangeListProps {
  exchanges?: ExchangeConnection[];
  isLoading?: boolean;
  onDisconnect?: () => void;
  onReconnect?: () => void;
}

export function ExchangeList({
  exchanges,
  isLoading,
  onDisconnect,
  onReconnect,
}: ExchangeListProps) {
  const [connectingExchange, setConnectingExchange] =
    useState<ExchangeConnection | null>(null);

  if (isLoading) {
    return (
      <div className="flex gap-3" aria-busy="true" aria-label="Loading exchanges">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-[104px] flex-1 animate-pulse rounded-xl border border-border-subtle bg-surface-1"
          />
        ))}
      </div>
    );
  }

  if (!exchanges?.length) {
    return (
      <div className="rounded-xl border border-border-subtle bg-surface-1 p-10 text-center">
        <p className="text-sm text-text-secondary">No exchanges connected.</p>
        <p className="mt-1 text-xs text-text-tertiary">
          Go to Settings to connect via API key.
        </p>
      </div>
    );
  }

  return (
    <>
      <div role="list" className="flex gap-3 w-full">
        {exchanges.map((exchange) => {
          const meta = STATUS_META[exchange.status];
          const isConnected = exchange.status === "connected";
          const brandBg = EXCHANGE_BRAND_BG[exchange.id] ?? "transparent";

          return (
            <div
              key={exchange.id}
              role="listitem"
              className="flex flex-1 flex-col gap-6 rounded-xl border border-border-subtle bg-surface-1 px-4 py-4 drop-shadow-[0px_1px_2px_rgba(255,255,255,0.08)] min-w-0"
            >
              {/* Exchange name + status badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-border-ghost"
                    style={{ backgroundColor: brandBg }}
                  >
                    <Image
                      src={SYMBOL_LOGO[exchange.id] ?? exchange.logoUrl}
                      alt={`${exchange.name} logo`}
                      width={14}
                      height={14}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-body-3 font-bold text-text-primary whitespace-nowrap">
                    {exchange.name}
                  </span>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center justify-center rounded-md px-1",
                    "text-[12px] leading-[18px] font-bold tracking-[0.18px] whitespace-nowrap",
                    meta.badge
                  )}
                  aria-label={`Status: ${meta.label}`}
                >
                  {meta.label}
                </span>
              </div>

              {/* UID + action button */}
              <div className="flex items-center justify-between">
                <div>
                  {isConnected && exchange.uid && (
                    <div className="flex items-center gap-2 text-label-1 tracking-[0.14px]">
                      <span className="text-text-tertiary">UID</span>
                      <span className="font-bold text-text-primary">{exchange.uid}</span>
                    </div>
                  )}
                </div>

                {isConnected ? (
                  <button
                    onClick={async () => {
                      if (
                        window.confirm(
                          `Disconnect ${exchange.name}? This will remove all associated API keys.`
                        )
                      ) {
                        try {
                          await disconnectExchange(exchange.id);
                          onDisconnect?.();
                        } catch {
                          alert("Failed to disconnect. Please try again.");
                        }
                      }
                    }}
                    aria-label={`Disconnect ${exchange.name}`}
                    className="flex items-center gap-1 text-caption font-bold text-text-disabled tracking-[0.18px] hover:text-text-secondary transition-colors"
                  >
                    <Unlink size={12} aria-hidden="true" />
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => setConnectingExchange(exchange)}
                    aria-label={`Connect ${exchange.name} to trade`}
                    className="flex items-center gap-1 text-caption font-bold text-primary tracking-[0.18px] hover:text-primary/80 transition-colors"
                  >
                    Connect to Trade
                    <ArrowRight size={12} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {connectingExchange && (
        <ConnectExchangeModal
          exchange={connectingExchange}
          onClose={() => setConnectingExchange(null)}
          onSuccess={() => {
            setConnectingExchange(null);
            onReconnect?.();
          }}
        />
      )}
    </>
  );
}
