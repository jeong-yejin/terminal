"use client";

import { useState } from "react";
import { MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { SymbolBar } from "@/components/trade/SymbolBar";
import { ChartArea } from "@/components/trade/ChartArea";
import { TradeBottomPanel } from "@/components/trade/TradeBottomPanel";
import { Orderbook } from "@/components/trade/Orderbook";
import { OrderForm } from "@/components/trade/OrderForm";
import { CommunityChat, type SharedPosition } from "@/components/trade/CommunityChat";
import { EXCHANGES, SYMBOLS, type ExchangeMeta, type SymbolMeta } from "@/components/trade/constants";

export default function TradePage() {
  const [exchange, setExchange]         = useState<ExchangeMeta>(EXCHANGES[1]);
  const [symbol, setSymbol]             = useState<SymbolMeta>(SYMBOLS[0]);
  const [isChatOpen, setIsChatOpen]     = useState(true);
  const [positionShare, setPositionShare] = useState<{ pos: SharedPosition; rev: number } | null>(null);

  const handleSharePosition = (pos: SharedPosition) => {
    setPositionShare({ pos, rev: Date.now() });
    setIsChatOpen(true);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col overflow-hidden bg-background">

      {/* ── Symbol bar ─────────────────────────────────────────── */}
      <SymbolBar
        exchange={exchange}
        symbol={symbol}
        onExchangeChange={setExchange}
        onSymbolChange={setSymbol}
      />

      {/* ── Main area ──────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 overflow-hidden">

        {/* Chart + bottom panel */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ChartArea symbol={symbol} primaryExchange={exchange} />
          <TradeBottomPanel onSharePosition={handleSharePosition} />
        </div>

        {/* Orderbook + order form */}
        <aside className="flex w-72 shrink-0 flex-col border-l border-border-subtle bg-surface-1 xl:w-80">
          <div className="min-h-0 flex-1 overflow-hidden">
            <Orderbook symbol={symbol} />
          </div>
          <div className="shrink-0 overflow-y-auto">
            <OrderForm symbol={symbol} />
          </div>
        </aside>

        {/* Community drawer */}
        <div
          className="flex shrink-0 overflow-hidden border-l border-border-subtle transition-[width] duration-300 ease-in-out"
          style={{ width: isChatOpen ? 284 : 0 }}
        >
          <div className="flex h-full w-[284px] shrink-0 flex-col">
            <CommunityChat
              positionShare={positionShare}
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        </div>

        {/* Toggle strip */}
        <button
          onClick={() => setIsChatOpen((v) => !v)}
          title={isChatOpen ? "Hide Community" : "Open Community"}
          className="flex w-6 shrink-0 flex-col items-center justify-start gap-3 border-l border-border-subtle bg-surface-1 py-4 text-text-disabled transition-colors hover:bg-surface-2 hover:text-text-secondary"
        >
          {isChatOpen ? (
            <ChevronRight size={12} />
          ) : (
            <>
              <ChevronLeft size={12} />
              <MessageSquare size={12} />
              <span className="[writing-mode:vertical-lr] rotate-180 text-[9px] font-semibold tracking-widest">
                CHAT
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
