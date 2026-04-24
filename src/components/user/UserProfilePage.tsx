"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, TrendingUp, Shield, Trophy, Clock, BarChart2 } from "lucide-react";
import { getMockProfile, getLeaderboardEntry } from "@/lib/mock-users";

// ─── Level helpers ────────────────────────────────────────────────────────────

function getLevelColor(level: number): string {
  if (level >= 91) return "#FBBF24";
  if (level >= 61) return "#A855F7";
  if (level >= 31) return "#60A5FA";
  if (level >= 11) return "#22C55E";
  return "#737373";
}

function getLevelName(level: number): string {
  if (level >= 91) return "Legend";
  if (level >= 61) return "Elite";
  if (level >= 31) return "Pro";
  if (level >= 11) return "Expert";
  return "Trader";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatTile({
  label,
  value,
  valueClass = "text-text-primary",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border-subtle bg-surface-2 px-4 py-3">
      <span className="text-[10px] uppercase tracking-wider text-text-disabled">{label}</span>
      <span className={`text-[15px] font-bold font-mono ${valueClass}`}>{value}</span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-text-disabled">
        {children}
      </span>
      <div className="flex-1 border-t border-border-subtle/40" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UserProfilePage({ userId }: { userId: string }) {
  const router = useRouter();
  const [following, setFollowing] = useState(false);

  const profile = getMockProfile(userId);
  const lbEntry = getLeaderboardEntry(userId);

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-text-disabled">
        <Shield size={32} className="opacity-40" />
        <p className="text-sm">Trader not found</p>
        <button
          onClick={() => router.back()}
          className="text-xs text-text-secondary underline hover:text-text-primary"
        >
          Go back
        </button>
      </div>
    );
  }

  const levelColor = getLevelColor(profile.level);
  const levelName = getLevelName(profile.level);
  const xpInLevel = profile.xp % 1000;

  return (
    <div className="min-h-screen bg-background">
      {/* Sub-header */}
      <div className="sticky top-14 z-10 border-b border-border-subtle bg-surface-1/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[12px] text-text-disabled transition-colors hover:text-text-primary"
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <span className="text-[12px] font-semibold text-text-primary">Trader Profile</span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        {/* ── Hero card ── */}
        <div className="rounded-2xl border border-border-subtle bg-surface-1 p-5">
          {/* Avatar + name + follow */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface-3 text-[22px] font-bold ring-2 ring-border-subtle"
                style={{ color: levelColor }}
              >
                {profile.nickname[0].toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[16px] font-bold text-text-primary">{profile.nickname}</span>
                  {profile.isReferral && (
                    <span className="rounded bg-primary/20 px-1 py-0.5 text-[9px] font-bold text-primary">R</span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="text-[12px] font-bold" style={{ color: levelColor }}>
                    Lv.{profile.level}
                  </span>
                  <span className="text-[11px] text-text-disabled">{levelName}</span>
                </div>
                {lbEntry && (
                  <div className="mt-1 flex items-center gap-1">
                    <Trophy size={10} className="text-amber-400" />
                    <span className="text-[11px] text-text-secondary">Ranked #{lbEntry.rank}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Follow button — only for non-self */}
            {userId !== "me" && (
              <button
                onClick={() => setFollowing((f) => !f)}
                className={`rounded-lg px-4 py-1.5 text-[12px] font-semibold transition-colors ${
                  following
                    ? "border border-border-subtle bg-surface-2 text-text-secondary hover:border-negative/50 hover:text-negative"
                    : "bg-primary text-[#0d0d0d] hover:bg-primary/90"
                }`}
              >
                {following ? "Following" : "Follow"}
              </button>
            )}
          </div>

          {/* XP bar */}
          <div className="mt-5">
            <div className="mb-1 flex justify-between text-[10px]">
              <span className="text-text-disabled">XP Progress</span>
              <span className="font-mono font-bold" style={{ color: levelColor }}>
                {profile.xp.toLocaleString()} XP
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(xpInLevel / 10, 100)}%`,
                  backgroundColor: levelColor,
                }}
              />
            </div>
            <div className="mt-0.5 text-right text-[10px] text-text-disabled">
              {xpInLevel}/1000 to next level
            </div>
          </div>

          {/* Info row */}
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border-subtle/40 pt-4">
            {[
              { icon: <Clock size={11} />, label: "Joined",    value: profile.joinDate },
              { icon: <BarChart2 size={11} />, label: "Volume",  value: profile.volumeRange },
              { icon: <TrendingUp size={11} />, label: "Trades",  value: lbEntry ? lbEntry.trades.toLocaleString() : "—" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-text-disabled">
                  {icon}
                  {label}
                </div>
                <span className="text-[12px] font-semibold text-text-secondary">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Leaderboard stats ── */}
        {lbEntry && (
          <div className="rounded-2xl border border-border-subtle bg-surface-1 p-5">
            <SectionLabel>Performance Overview</SectionLabel>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatTile
                label="All-Time"
                value={`+${lbEntry.allTimePnl.toFixed(1)}%`}
                valueClass="text-positive"
              />
              <StatTile
                label="7-Day"
                value={`${lbEntry.weeklyPnl >= 0 ? "+" : ""}${lbEntry.weeklyPnl.toFixed(1)}%`}
                valueClass={lbEntry.weeklyPnl >= 0 ? "text-positive" : "text-negative"}
              />
              <StatTile
                label="30-Day"
                value={`${lbEntry.monthlyPnl >= 0 ? "+" : ""}${lbEntry.monthlyPnl.toFixed(1)}%`}
                valueClass={lbEntry.monthlyPnl >= 0 ? "text-positive" : "text-negative"}
              />
              <StatTile label="Win Rate" value={`${lbEntry.winRate.toFixed(1)}%`} />
            </div>
          </div>
        )}

        {/* ── P&L Details ── */}
        {!profile.statsOptIn ? (
          <div className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface-1 px-5 py-4 text-[12px] text-text-disabled">
            <Shield size={16} className="shrink-0 opacity-50" />
            This trader hasn&apos;t opted in to share their position &amp; P&L stats.
          </div>
        ) : (
          <div className="rounded-2xl border border-border-subtle bg-surface-1 p-5 space-y-5">
            {/* Open Position */}
            <div>
              <SectionLabel>Current Open Position</SectionLabel>
              {profile.openPosition ? (
                <div className="rounded-xl border border-border-subtle bg-surface-2 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-text-primary">
                        {profile.openPosition.symbol}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          profile.openPosition.side === "Long"
                            ? "bg-positive/15 text-positive"
                            : "bg-negative/15 text-negative"
                        }`}
                      >
                        {profile.openPosition.side}
                      </span>
                      <span className="rounded bg-surface-3 px-1.5 py-0.5 text-[10px] font-mono text-text-secondary">
                        {profile.openPosition.leverage}x
                      </span>
                    </div>
                    <span
                      className={`text-[15px] font-bold font-mono ${
                        profile.openPosition.currentPnlPct >= 0 ? "text-positive" : "text-negative"
                      }`}
                    >
                      {profile.openPosition.currentPnlPct >= 0 ? "+" : ""}
                      {profile.openPosition.currentPnlPct.toFixed(2)}%
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-text-disabled">
                    Entry price{" "}
                    <span className="font-mono text-text-secondary">
                      ${profile.openPosition.entryPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-[12px] text-text-disabled">No open position</p>
              )}
            </div>

            {/* 30-Day Stats */}
            <div>
              <SectionLabel>30-Day Stats</SectionLabel>
              <div className="grid grid-cols-2 gap-3">
                <StatTile label="Win Rate" value={`${profile.winRate30d?.toFixed(1) ?? "—"}%`} />
                <StatTile
                  label="Return"
                  value={`${(profile.pnl30d ?? 0) >= 0 ? "+" : ""}${profile.pnl30d?.toFixed(1) ?? "—"}%`}
                  valueClass={(profile.pnl30d ?? 0) >= 0 ? "text-positive" : "text-negative"}
                />
              </div>
            </div>

            {/* Recent Closed Trades */}
            {profile.recentTrades && profile.recentTrades.length > 0 && (
              <div>
                <SectionLabel>Recent Closed Positions</SectionLabel>
                <div className="overflow-hidden rounded-xl border border-border-subtle">
                  {/* Header */}
                  <div className="grid grid-cols-[1fr_64px_72px_80px] border-b border-border-subtle bg-surface-2 px-3 py-2 text-[10px] uppercase tracking-wider text-text-disabled">
                    <span>Symbol</span>
                    <span>Side</span>
                    <span>Date</span>
                    <span className="text-right">PnL</span>
                  </div>
                  {profile.recentTrades.map((t, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_64px_72px_80px] items-center border-b border-border-subtle/30 px-3 py-2.5 last:border-b-0 even:bg-surface-2/40"
                    >
                      <span className="text-[12px] font-mono font-semibold text-text-secondary">
                        {t.symbol.replace("USDT", "")}
                        <span className="text-[10px] font-normal text-text-disabled">/USDT</span>
                      </span>
                      <span
                        className={`text-[11px] font-semibold ${
                          t.side === "Long" ? "text-positive" : "text-negative"
                        }`}
                      >
                        {t.side}
                      </span>
                      <span className="text-[11px] text-text-disabled">{t.closedAt}</span>
                      <span
                        className={`text-right text-[12px] font-bold font-mono ${
                          t.pnlPct >= 0 ? "text-positive" : "text-negative"
                        }`}
                      >
                        {t.pnlPct >= 0 ? "+" : ""}
                        {t.pnlPct.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
