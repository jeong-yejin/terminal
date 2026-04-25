"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ArrowUpRight } from "lucide-react";
import { getMockProfile, type UserProfile } from "@/lib/mock-users";

interface ProfilePanelProps {
  userId: string;
  onClose: () => void;
}

const TIER_COLOR: Record<string, string> = {
  Legend: "text-amber-400",
  Elite:  "text-purple-400",
  Pro:    "text-blue-400",
  Expert: "text-positive",
  Trader: "text-text-tertiary",
};

function tierOf(level: number): string {
  if (level >= 91) return "Legend";
  if (level >= 61) return "Elite";
  if (level >= 31) return "Pro";
  if (level >= 11) return "Expert";
  return "Trader";
}

function fmtJoin(date: string): string {
  // "2024-01-15" → "2024.01"
  const [y, m] = date.split("-");
  return y && m ? `${y}.${m}` : date;
}

function Avatar({ label }: { label: string }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f4c4b0] to-[#e89b8a] text-[16px] font-bold text-black/70">
      {label[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

function StubState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full w-full flex-col bg-surface-1">
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border-subtle px-3">
        <span className="text-[12px] font-semibold text-text-primary">Profile</span>
        <button
          onClick={onClose}
          className="rounded p-1 text-text-disabled transition-colors hover:bg-surface-2 hover:text-text-secondary focus-ring"
          aria-label="Close profile"
        >
          <X size={13} />
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center p-4 text-center text-[11px] text-text-disabled">
        Profile unavailable.
      </div>
    </div>
  );
}

export function ProfilePanel({ userId, onClose }: ProfilePanelProps) {
  const [following, setFollowing] = useState(false);
  const profile: UserProfile | null = getMockProfile(userId);

  if (!profile) return <StubState onClose={onClose} />;

  const tier       = tierOf(profile.level);
  const tierColor  = TIER_COLOR[tier] ?? "text-text-tertiary";
  const xpInLevel  = profile.xp % 1000;
  const xpPct      = Math.min(100, Math.round((xpInLevel / 1000) * 100));
  const op         = profile.openPosition;
  const trades     = profile.recentTrades ?? [];
  const isSelf     = profile.id === "me";

  return (
    <div className="flex h-full w-full flex-col bg-surface-1">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border-subtle px-3">
        <span className="text-[12px] font-semibold text-text-primary">Profile</span>
        <button
          onClick={onClose}
          className="rounded p-1 text-text-disabled transition-colors hover:bg-surface-2 hover:text-text-secondary focus-ring"
          aria-label="Close profile"
        >
          <X size={13} />
        </button>
      </div>

      {/* ── Scroll body ─────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">

        {/* Identity */}
        <div className="flex items-center gap-3">
          <Avatar label={profile.nickname} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-bold text-text-primary">
              {isSelf ? "Me" : `{${profile.nickname}}`}
            </div>
            <div className={`mt-0.5 text-[11px] font-semibold ${tierColor}`}>{tier}</div>
          </div>
          {!isSelf && (
            <button
              onClick={() => setFollowing((v) => !v)}
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold transition-colors focus-ring ${
                following
                  ? "bg-surface-3 text-text-secondary hover:bg-surface-3/80"
                  : "border border-primary/40 text-primary hover:bg-primary/10"
              }`}
            >
              {following ? "Following" : "Follow"}
            </button>
          )}
        </div>

        {/* XP */}
        <div>
          <div className="flex items-end justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-disabled">XP</span>
            <span className="text-[11px] font-bold num-mono text-primary">
              {profile.xp.toLocaleString()} XP
            </span>
          </div>
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#a1e53c] via-[#caff5d] to-[#edff9f] transition-all"
              style={{ width: `${xpPct}%` }}
            />
          </div>
          <div className="mt-1 text-right text-[10px] text-text-disabled num-mono">
            {xpInLevel}/1000 to next level
          </div>
        </div>

        {/* Meta list */}
        <div className="flex flex-col rounded-lg border border-border-subtle bg-surface-2/60">
          {[
            { label: "Joined",      value: fmtJoin(profile.joinDate) },
            { label: "Last Active", value: fmtJoin(profile.lastActive) },
            { label: "Volume",      value: profile.volumeRange },
          ].map(({ label, value }, i, arr) => (
            <div
              key={label}
              className={`flex items-center justify-between px-3 py-2 text-[11px] ${
                i < arr.length - 1 ? "border-b border-border-ghost" : ""
              }`}
            >
              <span className="text-text-disabled">{label}</span>
              <span className="font-medium text-text-secondary num-mono">{value}</span>
            </div>
          ))}
        </div>

        {/* Current Open Position */}
        {profile.statsOptIn ? (
          <>
            <section className="flex flex-col gap-2">
              <p className="section-label">Current Open Position</p>
              {op ? (
                <div className="flex items-center gap-2.5 rounded-lg border border-border-subtle bg-surface-2/60 px-3 py-2.5">
                  <div className="h-5 w-5 shrink-0 rounded-full bg-gradient-to-br from-[#1b1f30] to-[#0a0d16] ring-1 ring-border-subtle" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-text-primary">
                        {op.symbol.replace("USDT", "/USDT")}
                      </span>
                      <span className={`rounded px-1 py-px text-[9px] font-bold ${
                        op.side === "Long" ? "bg-positive/15 text-positive" : "bg-negative/15 text-negative"
                      }`}>
                        {op.side} {op.leverage}x
                      </span>
                    </div>
                    <div className="mt-0.5 text-[10px] text-text-disabled num-mono">
                      Entry {op.entryPrice.toLocaleString()}
                    </div>
                  </div>
                  <div className={`shrink-0 text-right text-[12px] font-bold num-mono ${
                    op.currentPnlPct >= 0 ? "text-positive" : "text-negative"
                  }`}>
                    {op.currentPnlPct >= 0 ? "+" : ""}{op.currentPnlPct.toFixed(2)}%
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-border-subtle bg-surface-2/60 px-3 py-2.5 text-[10px] text-text-disabled">
                  No open position
                </div>
              )}
            </section>

            {/* 30-Day Stats */}
            <section className="flex flex-col gap-2">
              <p className="section-label">30-Day Stats</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1 rounded-lg border border-border-subtle bg-surface-2/60 px-3 py-2.5">
                  <span className="text-[10px] text-text-disabled">Win Rate</span>
                  <span className="text-[14px] font-bold text-text-primary num-mono">
                    {profile.winRate30d?.toFixed(1)}%
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border border-border-subtle bg-surface-2/60 px-3 py-2.5">
                  <span className="text-[10px] text-text-disabled">Return</span>
                  <span className={`text-[14px] font-bold num-mono ${
                    (profile.pnl30d ?? 0) >= 0 ? "text-positive" : "text-negative"
                  }`}>
                    {(profile.pnl30d ?? 0) >= 0 ? "+" : ""}
                    {profile.pnl30d?.toFixed(1)}%
                  </span>
                </div>
              </div>
            </section>

            {/* Recent Closed */}
            {trades.length > 0 && (
              <section className="flex flex-col gap-2">
                <p className="section-label">Recent Closed</p>
                <div className="flex flex-col rounded-lg border border-border-subtle bg-surface-2/60">
                  {trades.map((t, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 px-3 py-2 text-[11px] ${
                        i < trades.length - 1 ? "border-b border-border-ghost" : ""
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          t.side === "Long" ? "bg-positive" : "bg-negative"
                        }`}
                        aria-hidden
                      />
                      <span className="font-semibold text-text-primary num-mono">
                        {t.symbol.replace("USDT", "/USDT")}
                      </span>
                      <span className={`rounded px-1 py-px text-[9px] font-bold ${
                        t.side === "Long" ? "bg-positive/15 text-positive" : "bg-negative/15 text-negative"
                      }`}>
                        {t.side} 10x
                      </span>
                      <span className="ml-auto text-[10px] text-text-disabled">({t.closedAt})</span>
                      <span className={`w-14 text-right text-[11px] font-bold num-mono ${
                        t.pnlPct >= 0 ? "text-positive" : "text-negative"
                      }`}>
                        {t.pnlPct >= 0 ? "+" : ""}{t.pnlPct.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="rounded-lg border border-border-subtle bg-surface-2/60 px-3 py-3 text-[10px] leading-relaxed text-text-disabled">
            Position &amp; P&amp;L stats are opt-in — this trader hasn&apos;t shared their stats.
          </div>
        )}
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-border-subtle p-3">
        <Link
          href={`/user/${profile.id}`}
          className="flex w-full items-center justify-center gap-1 rounded-lg border border-primary/30 py-2 text-[12px] font-bold text-primary transition-colors hover:bg-primary/10 focus-ring"
        >
          View Profile
          <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  );
}
