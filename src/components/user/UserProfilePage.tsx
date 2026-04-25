"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, TrendingUp, Shield, Trophy, Clock, BarChart2,
  ThumbsUp, MessageCircle, Bookmark, Briefcase, MessageSquare, Bell,
} from "lucide-react";
import { getMockProfile, getLeaderboardEntry } from "@/lib/mock-users";

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
  journal: { label: "Trading Journal", icon: <Briefcase size={11} /> },
  free:    { label: "Free Board",      icon: <MessageSquare size={11} /> },
  news:    { label: "Info & News",     icon: <Bell size={11} /> },
};

const USER_POSTS: Record<string, UserPost[]> = {
  u3: [
    { id: "u3p1", category: "journal", title: "BTC Long 50x +23% 진입 근거 정리", preview: "89,200 지지 확인 후 롱 진입. 50배 레버리지지만 진입가 기준 손절 0.5%로 리스크 관리 철저히 했습니다.", timeAgo: "Apr 23", likes: 218, comments: 47, scraps: 31, tickers: ["BTCUSDT"] },
    { id: "u3p2", category: "journal", title: "SOL Long +22% 리캡 — 기술적 분석 복기", preview: "142 지지 확인 후 롱. 피보나치 0.618 되돌림 구간에서 분할 매수, 목표가 167 달성 후 전량 정리.", timeAgo: "Apr 13", likes: 134, comments: 29, scraps: 18, tickers: ["SOLUSDT"] },
    { id: "u3p3", category: "free", title: "비트코인 장기 홀더 온체인 데이터 분석", preview: "LTH SOPR 지표가 1.0 이하로 내려온 구간은 역사적으로 강력한 매수 시그널이었습니다. 현재 수치 공유합니다.", timeAgo: "Apr 10", likes: 302, comments: 65, scraps: 84, tickers: ["BTCUSDT"] },
    { id: "u3p4", category: "news", title: "ETF 자금 유입 데이터 — 주간 브리핑", preview: "이번 주 BTC ETF 순유입 $1.2B 기록. 기관 수요 지속되는 중. 가격 지지력 유지될 가능성 높음.", timeAgo: "Apr 7", likes: 189, comments: 38, scraps: 52, tickers: ["BTCUSDT"] },
  ],
  u1: [
    { id: "u1p1", category: "journal", title: "BTC 20x Long +12% — 92,400 진입 회고", preview: "지지선 재확인 후 롱 진입. 목표가 94,800에서 1/2 정리, 나머지는 트레일링 스탑으로 대응했습니다.", timeAgo: "Apr 22", likes: 98, comments: 21, scraps: 14, tickers: ["BTCUSDT"] },
    { id: "u1p2", category: "free", title: "펀딩비 음수 구간에서 숏 잡는 전략 공유", preview: "펀딩비가 -0.05% 이하일 때 숏 포지션 진입하면 이자 수익까지 챙길 수 있습니다.", timeAgo: "Apr 18", likes: 61, comments: 13, scraps: 18, tickers: ["ETHUSDT", "BTCUSDT"] },
    { id: "u1p3", category: "news", title: "연준 FOMC 발언 분석 — 크립토 단기 영향", preview: "파월 의장 비둘기파 발언 이후 BTC 3% 상승. 매크로 환경은 여전히 불확실합니다.", timeAgo: "Apr 14", likes: 89, comments: 21, scraps: 32, tickers: ["BTCUSDT"] },
  ],
  u4: [
    { id: "u4p1", category: "journal", title: "ETH Long +8.1% — 2,450 지지 확인 후 진입", preview: "이더리움 2,450 구간 지지 확인 후 롱. 목표가 2,650에서 전량 정리, 계획대로 실행한 깔끔한 트레이드.", timeAgo: "Apr 21", likes: 34, comments: 8, scraps: 6, tickers: ["ETHUSDT"] },
    { id: "u4p2", category: "free", title: "초보자를 위한 레버리지 리스크 관리 가이드", preview: "1회 트레이드에 계좌의 1% 이상 손실 나지 않도록 포지션 사이즈 계산하는 방법을 정리했습니다.", timeAgo: "Apr 16", likes: 127, comments: 34, scraps: 45, tickers: [] },
  ],
  u2: [
    { id: "u2p1", category: "journal", title: "SOL 숏 포지션 리뷰 — 고점 잡기의 어려움", preview: "145 고점에서 숏 진입 시도했으나 추가 상승으로 손절. 고점 매도는 역추세 전략이라 리스크가 크다는 걸 다시 배웠습니다.", timeAgo: "Apr 19", likes: 23, comments: 9, scraps: 4, tickers: ["SOLUSDT"] },
  ],
};

function getPostsForUser(userId: string, nickname: string): UserPost[] {
  return USER_POSTS[userId] ?? USER_POSTS[nickname] ?? [];
}

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

  const levelColor = getLevelColor(profile.level);
  const levelName = getLevelName(profile.level);
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
                    <span className="text-[16px] font-bold text-text-primary">{profile.nickname}</span>
                    {profile.isReferral && (
                      <span className="rounded bg-primary/20 px-1 py-0.5 text-[9px] font-bold text-primary">R</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-bold" style={{ color: levelColor }}>
                      Lv.{profile.level}
                    </span>
                    <span className="text-[11px] text-text-disabled">· {levelName}</span>
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
