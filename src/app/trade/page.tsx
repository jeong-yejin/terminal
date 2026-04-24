"use client";

import { useState } from "react";
import { MessageSquare, ChevronLeft, ChevronRight, X, Trophy } from "lucide-react";
import Link from "next/link";
import { SymbolBar } from "@/components/trade/SymbolBar";
import { ChartArea } from "@/components/trade/ChartArea";
import { TradeBottomPanel } from "@/components/trade/TradeBottomPanel";
import { Orderbook } from "@/components/trade/Orderbook";
import { OrderForm } from "@/components/trade/OrderForm";
import { BalancePanel } from "@/components/trade/BalancePanel";
import { CommunityChat, type SharedPosition } from "@/components/trade/CommunityChat";
import { EXCHANGES, SYMBOLS, type ExchangeMeta, type SymbolMeta } from "@/components/trade/constants";

// ─── Session rebate strip ─────────────────────────────────────────────────────
// Shown below SymbolBar — gives users continuous visibility of earned rebates

function SessionRebateStrip({ onDismiss }: { onDismiss: () => void }) {
  const sessionEarned = 8.20;
  const myRank        = 142;

  return (
    <div className="flex shrink-0 items-center gap-4 border-b border-primary/20 bg-primary/8 px-5 py-[7px] text-[12px]">

      {/* Earned this session */}
      <div className="flex items-center gap-2 font-medium text-primary">
        <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
        This session: <span className="num-mono font-bold">+${sessionEarned.toFixed(2)}</span> rebate earned
      </div>

      <span className="h-3 w-px bg-primary/20" aria-hidden="true" />

      {/* Today's rank */}
      <Link
        href="/mypage/performance"
        className="flex items-center gap-1.5 text-text-secondary transition-colors hover:text-text-primary"
      >
        <Trophy size={11} className="text-primary/60" />
        Today&apos;s rank <span className="num-mono font-semibold text-text-primary">#{myRank}</span>
      </Link>

      <span className="h-3 w-px bg-primary/20" aria-hidden="true" />

      {/* Effective fee reminder */}
      <span className="text-text-disabled">
        Effective fee <span className="num-mono font-bold text-primary">0.02%</span>
        <span className="text-text-disabled/60 ml-1">(after rebate)</span>
      </span>

      {/* Spacer + dismiss */}
      <button
        onClick={onDismiss}
        className="ml-auto cursor-pointer text-text-disabled transition-colors hover:text-text-secondary"
        aria-label="Dismiss rebate strip"
      >
        <X size={13} />
      </button>
    </div>
  );
}

// ─── Trade page ───────────────────────────────────────────────────────────────

export default function TradePage() {
  const [exchange, setExchange]           = useState<ExchangeMeta>(EXCHANGES[1]);
  const [symbol, setSymbol]               = useState<SymbolMeta>(SYMBOLS[0]);
  const [isChatOpen, setIsChatOpen]       = useState(true);
  const [showRebateStrip, setShowRebateStrip] = useState(true);
  const [positionShare, setPositionShare] = useState<{ pos: SharedPosition; rev: number } | null>(null);

  const handleSharePosition = (pos: SharedPosition) => {
    setPositionShare({ pos, rev: Date.now() });
    setIsChatOpen(true);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col overflow-hidden bg-background">

      {/* ── Symbol bar ─────────────────────────────────────────────────────── */}
      <SymbolBar
        exchange={exchange}
        symbol={symbol}
        onExchangeChange={setExchange}
        onSymbolChange={setSymbol}
      />

      {/* ── Session rebate strip ────────────────────────────────────────────── */}
      {showRebateStrip && (
        <SessionRebateStrip onDismiss={() => setShowRebateStrip(false)} />
      )}

      {/* ── Main area ──────────────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 overflow-hidden">

        {/* Chart + bottom panel */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ChartArea symbol={symbol} primaryExchange={exchange} />
          <TradeBottomPanel onSharePosition={handleSharePosition} />
        </div>

        {/* Orderbook + order form + balance */}
        <aside className="flex w-72 shrink-0 flex-col overflow-hidden border-l border-border-subtle bg-surface-1 xl:w-80">
          <div className="min-h-0 flex-1 overflow-hidden">
            <Orderbook symbol={symbol} />
          </div>
          <div className="shrink-0 overflow-y-auto" style={{ maxHeight: "58vh" }}>
            <OrderForm symbol={symbol} />
            <BalancePanel />
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
