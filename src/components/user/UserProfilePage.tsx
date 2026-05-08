"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, TrendingUp, Shield, Trophy, Clock, BarChart2,
  ThumbsUp, MessageCircle, Bookmark, Briefcase, MessageSquare, Bell,
} from "lucide-react";
import { getMockProfile, getLeaderboardEntry } from "@/lib/mock-users";
import { getLevelInfo } from "@/lib/level";
import { LevelBadge } from "@/components/LevelBadge";

// ─── Post types & mock data ───────────────────────────────────────────────────

type PostCategory = "journal" | "free" | "news";

interface UserPost {
  id: string;
  category: PostCategory;
  title: string;
  preview: string;
  timeAgo: string;
  likes: number;
  comments: number;
  scraps: number;
  tickers: string[];
}

const CATEGORY_META: Record<PostCategory, { label: string; icon: React.ReactNode }> = {
  journal: { label: "Trading Journal",    icon: <Briefcase size={11} /> },
  free:    { label: "General Discussion", icon: <MessageSquare size={11} /> },
  news:    { label: "News & Insights",    icon: <Bell size={11} /> },
};

const USER_POSTS: Record<string, UserPost[]> = {
  u3: [
    { id: "u3p1", category: "journal", title: "BTC Long 50x +23% — Entry Rationale", preview: "Entered long after confirming 89,200 support. 50x leverage but managed risk with 0.5% stop from entry.", timeAgo: "Apr 23", likes: 218, comments: 47, scraps: 31, tickers: ["BTCUSDT"] },
    { id: "u3p2", category: "journal", title: "SOL Long +22% Recap — Technical Analysis Review", preview: "Long after confirming 142 support. Scaled in at Fibonacci 0.618 retracement, closed full position at target 167.", timeAgo: "Apr 13", likes: 134, comments: 29, scraps: 18, tickers: ["SOLUSDT"] },
    { id: "u3p3", category: "free", title: "Bitcoin Long-Term Holder On-Chain Data Analysis", preview: "Historically, LTH SOPR dropping below 1.0 has been a strong buy signal. Sharing current figures here.", timeAgo: "Apr 10", likes: 302, comments: 65, scraps: 84, tickers: ["BTCUSDT"] },
    { id: "u3p4", category: "news", title: "ETF Flow Data — Weekly Briefing", preview: "BTC ETF net inflow of $1.2B this week. Institutional demand continues. Price support likely to hold.", timeAgo: "Apr 7", likes: 189, comments: 38, scraps: 52, tickers: ["BTCUSDT"] },
  ],
  u1: [
    { id: "u1p1", category: "journal", title: "BTC 20x Long +12% — 92,400 Entry Recap", preview: "Entered long after re-confirming support. Closed 1/2 at target 94,800, trailed stop on the rest.", timeAgo: "Apr 22", likes: 98, comments: 21, scraps: 14, tickers: ["BTCUSDT"] },
    { id: "u1p2", category: "free", title: "Strategy: Shorting During Negative Funding Rates", preview: "When funding rate drops below -0.05%, entering a short position can earn you the funding fee on top of the trade.", timeAgo: "Apr 18", likes: 61, comments: 13, scraps: 18, tickers: ["ETHUSDT", "BTCUSDT"] },
    { id: "u1p3", category: "news", title: "Fed FOMC Statement Analysis — Short-Term Impact on Crypto", preview: "BTC up 3% after Powell's dovish remarks. Macro environment remains uncertain.", timeAgo: "Apr 14", likes: 89, comments: 21, scraps: 32, tickers: ["BTCUSDT"] },
  ],
  u4: [
    { id: "u4p1", category: "journal", title: "ETH Long +8.1% — Entry After Confirming 2,450 Support", preview: "Entered long after ETH confirmed 2,450 support. Closed full position at target 2,650 — clean execution as planned.", timeAgo: "Apr 21", likes: 34, comments: 8, scraps: 6, tickers: ["ETHUSDT"] },
    { id: "u4p2", category: "free", title: "Leverage Risk Management Guide for Beginners", preview: "How to calculate position size so a single trade never loses more than 1% of your account.", timeAgo: "Apr 16", likes: 127, comments: 34, scraps: 45, tickers: [] },
  ],
  u2: [
    { id: "u2p1", category: "journal", title: "SOL Short Position Review — The Difficulty of Shorting Tops", preview: "Tried to short at the 145 top but stopped out on continued upside. Learned again how risky counter-trend selling at highs can be.", timeAgo: "Apr 19", likes: 23, comments: 9, scraps: 4, tickers: ["SOLUSDT"] },
  ],
};

function getPostsForUser(userId: string, nickname: string): UserPost[] {
  return USER_POSTS[userId] ?? USER_POSTS[nickname] ?? [];
}

// ─── Level helpers ────────────────────────────────────────────────────────────


// ─── Stat tile — borderless; dividers come from the panel ─────────────────────

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
    <div className="stat-tile">
      <span className="stat-tile-label">{label}</span>
      <span className={`stat-tile-value ${valueClass}`}>{value}</span>
    </div>
  );
}

// ─── Section label (within a panel-section) ──────────────────────────────────

function SectionLabel({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="section-label">{children}</span>
      {right}
    </div>
  );
}

// ─── Post row — borderless; divider at bottom ────────────────────────────────

function PostRow({ post }: { post: UserPost }) {
  const { icon, label } = CATEGORY_META[post.category];
  return (
    <article className="list-row cursor-pointer group">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-[11px] font-medium text-text-tertiary">
          {icon}
          <span>{label}</span>
        </span>
        {post.tickers.map((t) => (
          <span key={t} className="num-mono text-[10px] font-semibold text-primary">
            #{t}
          </span>
        ))}
        <span className="ml-auto text-[11px] text-text-disabled">{post.timeAgo}</span>
      </div>
      <div>
        <h3 className="text-[13px] font-semibold leading-snug text-text-primary transition-colors group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-text-tertiary">
          {post.preview}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1 text-[11px] text-text-disabled">
          <ThumbsUp size={11} />
          <span className="num-mono">{post.likes}</span>
        </span>
        <span className="flex items-center gap-1 text-[11px] text-text-disabled">
          <MessageCircle size={11} />
          <span className="num-mono">{post.comments}</span>
        </span>
        <span className="flex items-center gap-1 text-[11px] text-text-disabled">
          <Bookmark size={11} />
          <span className="num-mono">{post.scraps}</span>
        </span>
      </div>
    </article>
  );
}

// ─── Posts filter pills — lightweight (no outer card) ─────────────────────────

type PostFilter = "all" | PostCategory;

const FILTER_TABS: { key: PostFilter; label: string }[] = [
  { key: "all",     label: "All" },
  { key: "journal", label: "Journal" },
  { key: "free",    label: "Free" },
  { key: "news",    label: "News" },
];

function PostsFilter({
  active,
  onChange,
  counts,
}: {
  active: PostFilter;
  onChange: (k: PostFilter) => void;
  counts: Record<PostFilter, number>;
}) {
  return (
    <div className="flex items-center gap-1">
      {FILTER_TABS.map(({ key, label }) => {
        if (key !== "all" && counts[key] === 0) return null;
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`period-pill ${isActive ? "active" : ""}`}
          >
            {label}
            <span className={`num-mono ml-1 ${isActive ? "text-primary" : "text-text-disabled"}`}>
              {counts[key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UserProfilePage({ userId }: { userId: string }) {
  const router = useRouter();
  const [following, setFollowing] = useState(false);
  const [postFilter, setPostFilter] = useState<PostFilter>("all");

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

  const { color: levelColor } = getLevelInfo(profile.level);
  const xpInLevel = profile.xp % 1000;
  const userPosts = getPostsForUser(profile.id, profile.nickname);

  const filteredPosts =
    postFilter === "all"
      ? userPosts
      : userPosts.filter((p) => p.category === postFilter);

  const postCounts: Record<PostFilter, number> = {
    all:     userPosts.length,
    journal: userPosts.filter((p) => p.category === "journal").length,
    free:    userPosts.filter((p) => p.category === "free").length,
    news:    userPosts.filter((p) => p.category === "news").length,
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-background">
      {/* ── Sub-header ─────────────────────────────────────────── */}
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

      <div className="mx-auto max-w-2xl px-4 py-6">

        {/* ── Unified Profile Panel ──
            Previously 3 cards (Hero / Performance / P&L) now merged into one
            panel with divider-separated sections. Information reads as a
            single subject instead of disconnected tiles. */}
        <div className="panel">

          {/* Section 1 — Identity + XP + facts */}
          <div className="panel-section">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface-3 text-[22px] font-bold ring-2 ring-border-subtle"
                  style={{ color: levelColor }}
                >
                  {profile.nickname[0].toUpperCase()}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <img src={getLevelInfo(profile.level).badge} alt="" aria-hidden className="h-[18px] w-[18px] shrink-0" />
                    <span className="text-[16px] font-bold text-text-primary">{profile.nickname}</span>
                    {profile.isReferral && (
                      <span className="rounded bg-primary/20 px-1 py-0.5 text-[9px] font-bold text-primary">R</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <LevelBadge level={profile.level} />
                    {lbEntry && (
                      <>
                        <span className="text-[11px] text-text-disabled">·</span>
                        <span className="flex items-center gap-1 text-[11px] text-text-secondary">
                          <Trophy size={10} className="text-amber-400" />
                          #{lbEntry.rank}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {userId !== "me" && (
                <button
                  onClick={() => setFollowing((f) => !f)}
                  className={`rounded-lg px-4 py-1.5 text-[12px] font-semibold transition-colors ${
                    following
                      ? "border border-border-subtle bg-surface-2 text-text-secondary hover:border-negative/50 hover:text-negative"
                      : "bg-primary text-text-inverse hover:bg-primary-strong"
                  }`}
                >
                  {following ? "Following" : "Follow"}
                </button>
              )}
            </div>

            {/* XP progress — integrated, no separate card */}
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-[10px]">
                <span className="text-text-disabled">XP Progress</span>
                <span className="num-mono font-bold" style={{ color: levelColor }}>
                  {xpInLevel}/1000 → Lv.{profile.level + 1}
                </span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-surface-3">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(xpInLevel / 10, 100)}%`,
                    backgroundColor: levelColor,
                  }}
                />
              </div>
            </div>

            {/* Inline facts strip */}
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px]">
              <span className="flex items-center gap-1.5 text-text-disabled">
                <Clock size={11} />
                Joined
                <span className="font-semibold text-text-secondary">{profile.joinDate}</span>
              </span>
              <span className="flex items-center gap-1.5 text-text-disabled">
                <BarChart2 size={11} />
                Volume
                <span className="num-mono font-semibold text-text-secondary">{profile.volumeRange}</span>
              </span>
              {lbEntry && (
                <span className="flex items-center gap-1.5 text-text-disabled">
                  <TrendingUp size={11} />
                  Trades
                  <span className="num-mono font-semibold text-text-secondary">
                    {lbEntry.trades.toLocaleString()}
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Section 2 — Performance overview */}
          {lbEntry && (
            <div className="panel-section">
              <SectionLabel>Performance</SectionLabel>
              <div className="grid grid-cols-4 gap-x-2">
                {[
                  { label: "All-Time", value: `+${lbEntry.allTimePnl.toFixed(1)}%`, cls: "text-positive" },
                  { label: "7-Day", value: `${lbEntry.weeklyPnl >= 0 ? "+" : ""}${lbEntry.weeklyPnl.toFixed(1)}%`, cls: lbEntry.weeklyPnl >= 0 ? "text-positive" : "text-negative" },
                  { label: "30-Day", value: `${lbEntry.monthlyPnl >= 0 ? "+" : ""}${lbEntry.monthlyPnl.toFixed(1)}%`, cls: lbEntry.monthlyPnl >= 0 ? "text-positive" : "text-negative" },
                  { label: "Win Rate", value: `${lbEntry.winRate.toFixed(1)}%`, cls: "text-text-primary" },
                ].map(({ label, value, cls }, i) => (
                  <div
                    key={label}
                    className="flex flex-col gap-1.5 py-2"
                    style={i > 0 ? { borderLeft: "1px solid rgba(255,255,255,0.06)", paddingLeft: "0.75rem" } : undefined}
                  >
                    <span className="stat-tile-label">{label}</span>
                    <span className={`stat-tile-value ${cls}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3 — P&L details (opt-in) */}
          {!profile.statsOptIn ? (
            <div className="panel-section">
              <div className="flex items-center gap-3 text-[12px] text-text-disabled">
                <Shield size={14} className="shrink-0 opacity-60" />
                This trader hasn&apos;t opted in to share position &amp; P&amp;L stats.
              </div>
            </div>
          ) : (
            <>
              {/* Open position */}
              <div className="panel-section">
                <SectionLabel>Current Open Position</SectionLabel>
                {profile.openPosition ? (
                  <div className={`flex items-center justify-between rounded-md px-3 py-2.5 ${
                    profile.openPosition.side === "Long" ? "bg-positive/[0.06]" : "bg-negative/[0.06]"
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-text-primary">
                        {profile.openPosition.symbol}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          profile.openPosition.side === "Long"
                            ? "bg-positive/10 text-positive"
                            : "bg-negative/10 text-negative"
                        }`}
                      >
                        {profile.openPosition.side} {profile.openPosition.leverage}x
                      </span>
                      <span className="num-mono text-[11px] text-text-disabled">
                        @ ${profile.openPosition.entryPrice.toLocaleString()}
                      </span>
                    </div>
                    <span
                      className={`num-mono text-[15px] font-bold ${
                        profile.openPosition.currentPnlPct >= 0 ? "text-positive" : "text-negative"
                      }`}
                    >
                      {profile.openPosition.currentPnlPct >= 0 ? "+" : ""}
                      {profile.openPosition.currentPnlPct.toFixed(2)}%
                    </span>
                  </div>
                ) : (
                  <p className="text-[12px] text-text-disabled">No open position</p>
                )}
              </div>

              {/* 30-Day stats */}
              <div className="panel-section">
                <SectionLabel>30-Day Stats</SectionLabel>
                <div className="grid grid-cols-2">
                  <div className="flex flex-col gap-1.5 py-1">
                    <span className="stat-tile-label">Win Rate</span>
                    <span className="stat-tile-value">{profile.winRate30d?.toFixed(1) ?? "—"}%</span>
                  </div>
                  <div className="flex flex-col gap-1.5 py-1" style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", paddingLeft: "1rem" }}>
                    <span className="stat-tile-label">Return</span>
                    <span className={`stat-tile-value ${(profile.pnl30d ?? 0) >= 0 ? "text-positive" : "text-negative"}`}>
                      {(profile.pnl30d ?? 0) >= 0 ? "+" : ""}{profile.pnl30d?.toFixed(1) ?? "—"}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent closed — table inside section, no nested card */}
              {profile.recentTrades && profile.recentTrades.length > 0 && (
                <div className="panel-section">
                  <SectionLabel>Recent Closed</SectionLabel>
                  <div className="-mx-5">
                    <div className="grid grid-cols-[1fr_64px_80px_80px] px-5 pb-2 text-[10px] font-medium uppercase tracking-wider text-text-disabled">
                      <span>Symbol</span>
                      <span>Side</span>
                      <span>Date</span>
                      <span className="text-right">PnL</span>
                    </div>
                    {profile.recentTrades.map((t, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[1fr_64px_80px_80px] items-center px-5 py-2 text-[12px] transition-colors hover:bg-surface-2/40"
                        style={{
                          borderTop: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <span className="num-mono font-semibold text-text-secondary">
                          {t.symbol.replace("USDT", "")}
                          <span className="font-normal text-text-disabled">/USDT</span>
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
                          className={`num-mono text-right font-bold ${
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
            </>
          )}

          {/* Section 4 — Posts (integrated as final panel section) */}
          <div className="panel-section">
            <SectionLabel
              right={
                userPosts.length > 0 ? (
                  <PostsFilter active={postFilter} onChange={setPostFilter} counts={postCounts} />
                ) : null
              }
            >
              Posts
              <span className="ml-2 num-mono font-normal normal-case text-text-disabled">
                ({userPosts.length})
              </span>
            </SectionLabel>

            {userPosts.length === 0 ? (
              <p className="py-6 text-center text-[12px] text-text-disabled">No posts yet.</p>
            ) : filteredPosts.length === 0 ? (
              <p className="py-4 text-center text-[12px] text-text-disabled">
                No posts in this category.
              </p>
            ) : (
              <div className="-mt-1">
                {filteredPosts.map((post) => (
                  <PostRow key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
