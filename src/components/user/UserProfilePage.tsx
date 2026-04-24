"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, TrendingUp, Shield, Trophy, Clock, BarChart2,
  ThumbsUp, MessageCircle, Bookmark,
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

const CATEGORY_META: Record<PostCategory, { emoji: string; label: string }> = {
  journal: { emoji: "💼", label: "Trading Journal" },
  free:    { emoji: "💬", label: "Free Board" },
  news:    { emoji: "🚨", label: "Info & News" },
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

function PostCard({ post }: { post: UserPost }) {
  const { emoji, label } = CATEGORY_META[post.category];
  return (
    <article className="flex flex-col gap-2 rounded-xl border border-border-subtle bg-surface-2 p-4 transition-colors hover:border-primary/20 hover:bg-surface-2/60">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-border-subtle bg-surface-3 px-2 py-0.5 text-[10px] font-medium text-text-secondary">
              {emoji} {label}
            </span>
            {post.tickers.map((t) => (
              <span key={t} className="text-[10px] font-mono text-primary">#{t}</span>
            ))}
          </div>
          <h3 className="text-[13px] font-semibold text-text-primary leading-snug line-clamp-1">
            {post.title}
          </h3>
          <p className="mt-1 text-[12px] text-text-secondary line-clamp-2 leading-relaxed">
            {post.preview}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 border-t border-border-subtle/40 pt-2">
        <span className="text-[11px] text-text-disabled">{post.timeAgo}</span>
        <div className="ml-auto flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px] text-text-disabled">
            <ThumbsUp size={11} />{post.likes}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-text-disabled">
            <MessageCircle size={11} />{post.comments}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-text-disabled">
            <Bookmark size={11} />{post.scraps}
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Posts Section ────────────────────────────────────────────────────────────

type PostFilter = "all" | PostCategory;

const FILTER_TABS: { key: PostFilter; label: string }[] = [
  { key: "all",     label: "All" },
  { key: "journal", label: "Journal" },
  { key: "free",    label: "Free" },
  { key: "news",    label: "News" },
];

function PostsSection({ posts }: { posts: UserPost[] }) {
  const [activeFilter, setActiveFilter] = useState<PostFilter>("all");

  const filtered = activeFilter === "all"
    ? posts
    : posts.filter((p) => p.category === activeFilter);

  const countFor = (key: PostFilter) =>
    key === "all" ? posts.length : posts.filter((p) => p.category === key).length;

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-1 p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-disabled">Posts</span>
          <div className="flex-1 border-t border-border-subtle/40" />
        </div>
        <span className="text-[11px] text-text-disabled">{posts.length} total</span>
      </div>

      {/* Category filter tabs */}
      {posts.length > 0 && (
        <div className="flex gap-1 rounded-xl border border-border-subtle bg-surface-2 p-1">
          {FILTER_TABS.map(({ key, label }) => {
            const count = countFor(key);
            const isActive = activeFilter === key;
            if (key !== "all" && count === 0) return null;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${
                  isActive
                    ? "bg-surface-1 text-text-primary shadow-sm"
                    : "text-text-disabled hover:text-text-secondary"
                }`}
              >
                {label}
                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                  isActive ? "bg-primary/15 text-primary" : "bg-surface-3 text-text-disabled"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Post list */}
      {posts.length === 0 ? (
        <p className="py-6 text-center text-[12px] text-text-disabled">No posts yet.</p>
      ) : filtered.length === 0 ? (
        <p className="py-4 text-center text-[12px] text-text-disabled">No posts in this category.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      )}
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
  const userPosts = getPostsForUser(profile.id, profile.nickname);

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
        {/* ── Posts ── */}
        <PostsSection posts={userPosts} />
      </div>
    </div>
  );
}
