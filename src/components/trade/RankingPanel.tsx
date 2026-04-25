"use client";

import { useState } from "react";
import { X, Trophy, Medal } from "lucide-react";
import { LEADERBOARD_DATA, type LeaderboardEntry } from "@/lib/mock-users";

type Period = "weekly" | "monthly" | "all";

interface RankingPanelProps {
  myUserId: string;
  onClose: () => void;
  onProfileClick: (userId: string) => void;
}

const TIER_COLOR: Record<string, string> = {
  Trader:   "text-amber-400",
  Elite:    "text-purple-400",
  Regular:  "text-text-tertiary",
  Expert:   "text-positive",
  Pro:      "text-blue-400",
  Veteran:  "text-text-tertiary",
  Master:   "text-text-tertiary",
  Whale:    "text-cautionary",
  Newcomer: "text-text-tertiary",
  Rookie:   "text-text-tertiary",
};

const PNL_KEY: Record<Period, keyof LeaderboardEntry> = {
  weekly: "weeklyPnl",
  monthly: "monthlyPnl",
  all: "allTimePnl",
};

function RankMark({ rank }: { rank: number }) {
  if (rank === 1) {
    return <Trophy size={14} className="text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]" />;
  }
  if (rank === 2) return <Medal size={14} className="text-slate-300" />;
  if (rank === 3) return <Medal size={14} className="text-amber-600" />;
  return <span className="text-[11px] font-bold text-text-disabled">{rank}</span>;
}

function Avatar({ label, size = 28 }: { label: string; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f4c4b0] to-[#e89b8a] text-[11px] font-bold text-black/70"
      style={{ width: size, height: size }}
    >
      {label[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

export function RankingPanel({ myUserId, onClose, onProfileClick }: RankingPanelProps) {
  const [period, setPeriod] = useState<Period>("weekly");

  const sorted = [...LEADERBOARD_DATA]
    .sort((a, b) => (b[PNL_KEY[period]] as number) - (a[PNL_KEY[period]] as number))
    .map((e, i) => ({ ...e, rank: i + 1 }));

  const myEntry = sorted.find((e) => e.userId === myUserId);

  return (
    <div className="flex h-full w-full flex-col bg-surface-1">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border-subtle px-3">
        <span className="text-[12px] font-semibold text-text-primary">Ranking</span>
        <button
          onClick={onClose}
          className="rounded p-1 text-text-disabled transition-colors hover:bg-surface-2 hover:text-text-secondary focus-ring"
          aria-label="Close ranking panel"
        >
          <X size={13} />
        </button>
      </div>

      {/* ── Period tabs ─────────────────────────────────────────── */}
      <div className="flex shrink-0 items-center gap-1 border-b border-border-subtle px-3 py-2">
        {(["weekly", "monthly", "all"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
              period === p
                ? "bg-surface-3 text-text-primary"
                : "text-text-disabled hover:text-text-secondary"
            }`}
          >
            {p === "weekly" ? "Weekly" : p === "monthly" ? "Month" : "All Time"}
          </button>
        ))}
      </div>

      {/* ── List ────────────────────────────────────────────────── */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {sorted.map((entry) => {
          const pnl       = entry[PNL_KEY[period]] as number;
          const isMe      = entry.userId === myUserId;
          const tierColor = TIER_COLOR[entry.tier] ?? "text-text-tertiary";

          return (
            <button
              key={entry.userId}
              onClick={() => onProfileClick(entry.userId)}
              className={`flex w-full items-center gap-2.5 border-l-2 px-3 py-2 text-left transition-colors ${
                isMe
                  ? "border-primary bg-gradient-to-r from-primary/[0.12] via-primary/[0.06] to-transparent"
                  : "border-transparent hover:bg-surface-2/60"
              }`}
            >
              {/* Rank / trophy */}
              <div className="flex w-4 shrink-0 items-center justify-center">
                <RankMark rank={entry.rank} />
              </div>

              {/* Avatar */}
              <Avatar label={entry.nickname} />

              {/* Info block */}
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] font-semibold leading-tight text-text-primary">
                  {isMe ? "Me" : `{${entry.nickname}}`}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[10px] leading-tight">
                  <span className={`font-semibold ${tierColor}`}>{entry.tier}</span>
                  <span className="text-text-disabled num-mono">{entry.winRate.toFixed(1)}% WR</span>
                </div>
                <div className="mt-0.5 text-[10px] leading-tight text-text-disabled num-mono">
                  {entry.trades.toLocaleString()} trades
                </div>
              </div>

              {/* PnL */}
              <div
                className={`shrink-0 text-[13px] font-bold num-mono ${
                  pnl >= 0 ? "text-positive" : "text-negative"
                }`}
              >
                {pnl >= 0 ? "+" : ""}
                {pnl.toFixed(1)}%
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Sticky "Me" footer ─────────────────────────────────── */}
      {myEntry && (
        <button
          onClick={() => onProfileClick(myEntry.userId)}
          className="flex shrink-0 items-center gap-2.5 border-t border-border-subtle bg-surface-2 px-3 py-2.5 text-left transition-colors hover:bg-surface-3"
        >
          <span className="w-4 text-center text-[11px] font-bold text-text-primary">
            #{myEntry.rank}
          </span>
          <Avatar label="M" size={24} />
          <span className="flex-1 text-[12px] font-semibold text-text-primary">Me</span>
          <span
            className={`text-[13px] font-bold num-mono ${
              (myEntry[PNL_KEY[period]] as number) >= 0 ? "text-positive" : "text-negative"
            }`}
          >
            {(myEntry[PNL_KEY[period]] as number) >= 0 ? "+" : ""}
            {(myEntry[PNL_KEY[period]] as number).toFixed(1)}%
          </span>
        </button>
      )}
    </div>
  );
}
