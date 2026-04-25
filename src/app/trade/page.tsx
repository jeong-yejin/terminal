"use client";

import { useState } from "react";
import { MessageSquare, X, Trophy } from "lucide-react";
import { SymbolBar } from "@/components/trade/SymbolBar";
import { ChartArea } from "@/components/trade/ChartArea";
import { TradeBottomPanel } from "@/components/trade/TradeBottomPanel";
import { Orderbook } from "@/components/trade/Orderbook";
import { OrderForm } from "@/components/trade/OrderForm";
import { BalancePanel } from "@/components/trade/BalancePanel";
import { CommunityChat, type SharedPosition } from "@/components/trade/CommunityChat";
import { RankingPanel } from "@/components/trade/RankingPanel";
import { ProfilePanel } from "@/components/trade/ProfilePanel";
import { EXCHANGES, SYMBOLS, type ExchangeMeta, type SymbolMeta } from "@/components/trade/constants";

// ─── Right panel state ────────────────────────────────────────────────────────

type RightPanel = "chat" | "ranking" | "profile" | null;

const MY_USER_ID = "me";

// ─── Session rebate strip ─────────────────────────────────────────────────────

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
      <button
        onClick={() => {}}
        className="flex items-center gap-1.5 text-text-secondary transition-colors hover:text-text-primary"
      >
        <Trophy size={11} className="text-primary/60" />
        Today&apos;s rank <span className="num-mono font-semibold text-text-primary">#{myRank}</span>
      </button>

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
  const [exchange, setExchange]             = useState<ExchangeMeta>(EXCHANGES[1]);
  const [symbol, setSymbol]                 = useState<SymbolMeta>(SYMBOLS[0]);
  const [rightPanel, setRightPanel]           = useState<RightPanel>("chat");
  const [profileUserId, setProfileUserId]     = useState<string | null>(null);
  const [profileOrigin, setProfileOrigin]     = useState<RightPanel>("chat");
  const [showRebateStrip, setShowRebateStrip] = useState(true);
  const [positionShare, setPositionShare]     = useState<{ pos: SharedPosition; rev: number } | null>(null);

  const handleSharePosition = (pos: SharedPosition) => {
    setPositionShare({ pos, rev: Date.now() });
    setRightPanel("chat");
  };

  const handleProfileClick = (userId: string) => {
    // Remember which panel we came from so closing returns there
    if (rightPanel !== "profile") setProfileOrigin(rightPanel);
    setProfileUserId(userId);
    setRightPanel("profile");
  };

  const handleCloseProfile = () => {
    setRightPanel(profileOrigin ?? "chat");
    setProfileUserId(null);
  };

  const isPanelOpen = rightPanel !== null;

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

        {/* Orderbook */}
        <aside className="flex w-48 shrink-0 flex-col overflow-hidden border-l border-border-subtle bg-surface-1">
          <Orderbook symbol={symbol} />
        </aside>

        {/* Order form + balance */}
        <aside className="flex w-[240px] shrink-0 flex-col overflow-y-auto border-l border-border-subtle bg-surface-1">
          <OrderForm symbol={symbol} />
          <BalancePanel />
        </aside>

        {/* Right panel slot — slides in/out */}
        <div
          className="shrink-0 overflow-hidden border-l border-border-subtle transition-[width] duration-300 ease-in-out"
          style={{ width: isPanelOpen ? 252 : 0 }}
        >
          <div className="flex h-full w-[252px] flex-col">
            {rightPanel === "chat" && (
              <CommunityChat
                positionShare={positionShare}
                onClose={() => setRightPanel(null)}
                onProfileClick={handleProfileClick}
              />
            )}
            {rightPanel === "ranking" && (
              <RankingPanel
                myUserId={MY_USER_ID}
                onClose={() => setRightPanel(null)}
                onProfileClick={handleProfileClick}
              />
            )}
            {rightPanel === "profile" && profileUserId && (
              <ProfilePanel
                userId={profileUserId}
                onClose={handleCloseProfile}
              />
            )}
          </div>
        </div>

        {/* Icon strip — always visible at far right */}
        <aside className="flex w-10 shrink-0 flex-col items-center gap-1 border-l border-border-subtle bg-surface-1 py-3">

          {/* Chat toggle */}
          <button
            onClick={() => setRightPanel(p => p === "chat" ? null : "chat")}
            title={rightPanel === "chat" ? "Close Chat" : "Open Chat"}
            className={`flex h-9 w-9 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg transition-colors focus-ring ${
              rightPanel === "chat"
                ? "bg-surface-3 text-text-primary"
                : "text-text-disabled hover:bg-surface-2 hover:text-text-secondary"
            }`}
          >
            <MessageSquare size={14} />
            <span className="text-[8px] font-semibold tracking-wide">Chat</span>
          </button>

          {/* Leaderboard toggle */}
          <button
            onClick={() => setRightPanel(p => p === "ranking" ? null : "ranking")}
            title={rightPanel === "ranking" ? "Close Ranking" : "Open Ranking"}
            className={`flex h-9 w-9 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg transition-colors focus-ring ${
              rightPanel === "ranking"
                ? "bg-surface-3 text-text-primary"
                : "text-text-disabled hover:bg-surface-2 hover:text-text-secondary"
            }`}
          >
            <Trophy size={14} />
            <span className="text-[8px] font-semibold tracking-wide">Rank</span>
          </button>
        </aside>
      </div>
    </div>
  );
}
