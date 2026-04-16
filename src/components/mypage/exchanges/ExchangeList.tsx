"use client";

import Image from "next/image";
import type { ExchangeConnection } from "@/types/mypage";
import { cn } from "@/lib/utils";
import { disconnectExchange } from "@/lib/api/exchanges";

interface ExchangeListProps {
  exchanges?: ExchangeConnection[];
  isLoading?: boolean;
  onDisconnect?: () => void;
  onReconnect?: () => void;
}

const STATUS_META: Record<
  ExchangeConnection["status"],
  { label: string; badge: string }
> = {
  connected:    { label: "Connected",    badge: "bg-positive/10 text-positive" },
  disconnected: { label: "Disconnected", badge: "bg-surface-3 text-text-tertiary" },
  error:        { label: "Error",        badge: "bg-negative/10 text-negative" },
};

/**
 * My Exchanges — 연동 거래소 목록
 *
 * 각 항목: logo · name · UID · status badge · connect / reconnect / disconnect CTA
 *
 * 접근성:
 *   - role="list" / role="listitem"
 *   - 버튼에 aria-label (거래소명 포함)
 *   - confirm dialog before disconnect
 */
export function ExchangeList({
  exchanges,
  isLoading,
  onDisconnect,
  onReconnect,
}: ExchangeListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Loading exchanges">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-border-subtle bg-surface-1"
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
          Click "Add Exchange" above to connect via API key.
        </p>
      </div>
    );
  }

  return (
    <ul role="list" className="space-y-3">
      {exchanges.map((exchange) => {
        const meta = STATUS_META[exchange.status];
        const isConnected = exchange.status === "connected";
        const needsConnect = exchange.status === "disconnected" || exchange.status === "error";

        return (
          <li
            key={exchange.id}
            role="listitem"
            className="rounded-xl border border-border-subtle bg-surface-1 px-5 py-4"
          >
            <div className="flex flex-wrap items-center gap-4">

              {/* ── Logo ── */}
              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-surface-2">
                <Image
                  src={exchange.logoUrl}
                  alt={`${exchange.name} logo`}
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </div>

              {/* ── Info ── */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">
                    {exchange.name}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium",
                      meta.badge
                    )}
                    aria-label={`Status: ${meta.label}`}
                  >
                    {meta.label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-text-tertiary">
                  {exchange.uid && (
                    <span>
                      UID: <span className="font-mono text-text-secondary">{exchange.uid}</span>
                    </span>
                  )}
                  <span>
                    API Key:{" "}
                    <span className="font-mono text-text-secondary">
                      {exchange.apiKeyMasked}
                    </span>
                  </span>
                  <span>
                    Connected on{" "}
                    {new Date(exchange.connectedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* ── Actions ── */}
              <div className="flex items-center gap-2">
                {needsConnect && (
                  <button
                    onClick={() => onReconnect?.()}
                    aria-label={`${exchange.status === "error" ? "Reconnect" : "Connect"} ${exchange.name}`}
                    className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-text-inverse
                      hover:bg-primary-strong focus-ring
                      disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {exchange.status === "error" ? "Reconnect" : "Connect"}
                  </button>
                )}

                {isConnected && (
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
                    className="rounded-md border border-negative/40 px-3 py-1.5 text-xs font-medium text-negative
                      hover:bg-negative/10 focus-ring transition-colors"
                  >
                    Disconnect
                  </button>
                )}
              </div>

            </div>
          </li>
        );
      })}
    </ul>
  );
}
