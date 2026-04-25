"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Pencil, ThumbsUp, ThumbsDown, MessageSquare, Bookmark, Flame, Gem,
  ChevronDown, X, Search, TrendingUp, Users, Hash, Bell,
  ArrowUp, ArrowDown, UserCircle2, MoreHorizontal, Link2,
  Flag, Ban, Check, Image as ImageIcon, Briefcase, AlertTriangle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Category   = "all" | "journal" | "free" | "news";
type FeedTab    = "all" | "hot" | "following" | "ticker";
type SortBy     = "latest" | "popular" | "comments";
type HotPeriod  = "24h" | "7d" | "all";
type ReportReason = "spam" | "false" | "other";

interface PositionSnap {
  symbol: string;
  side:   "Long" | "Short";
  lev:    number;
  pnlPct: number;
}

interface Reply {
  id:          string;
  author:      string;
  isAnonymous: boolean;
  level:       number;
  content:     string;
  timeAgo:     string;
  likes:       number;
}

interface Comment {
  id:          string;
  author:      string;
  isAnonymous: boolean;
  level:       number;
  content:     string;
  timeAgo:     string;
  likes:       number;
  replies:     Reply[];
}

interface UserProfile {
  id:          string;
  nickname:    string;
  level:       number;
  xp:          number;
  xpForNext:   number;
  joinDate:    string;
  volumeRange: string;
  posts:       number;
  followers:   number;
}

interface Post {
  id:          string;
  category:    Exclude<Category, "all">;
  title:       string;
  preview:     string;
  author:      string;
  isAnonymous: boolean;
  level:       number;
  timeAgo:     string;
  likes:       number;
  comments:    number;
  scraps:      number;
  tickers:     string[];
  isBest:      boolean;
  isHot:       boolean;
  position:    PositionSnap | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MY_LEVEL = 15;
const MY_NICKNAME = "SolanaKing";

const MOCK_POSITION: PositionSnap = {
  symbol: "BTCUSDT", side: "Long", lev: 10, pnlPct: 12.4,
};

// ─── Category metadata ───────────────────────────────────────────────────────

const CATEGORY_META: Record<Exclude<Category, "all">, { label: string }> = {
  journal: { label: "Trading Journal" },
  free:    { label: "Free Board"      },
  news:    { label: "Info & News"     },
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_POSTS: Post[] = [
  {
    id: "p1", category: "journal",
    title: "BTC 10× Long +34% Recap — Wrong Entry But Here's What I Learned",
    preview: "Honestly my first entry was completely off. Longed at 94k, got stopped out, re-entered at 92k and that ended up being right. Really hit home how crucial risk management is...",
    author: "CryptoWhale88", isAnonymous: false, level: 72,
    timeAgo: "2h ago", likes: 87, comments: 23, scraps: 14,
    tickers: ["$BTC"], isBest: true, isHot: false,
    position: { symbol: "BTCUSDT", side: "Long", lev: 10, pnlPct: 34.2 },
  },
  {
    id: "p2", category: "news",
    title: "Fed Rate Hold Official — Crypto Market Reaction & Short-Term Scenarios",
    preview: "The FOMC meeting today confirmed a rate hold as expected. BTC spiked 2.3% immediately after the announcement then pulled back. Here's what the decision means and my 2-week BTC price forecast...",
    author: "BTCmaxi", isAnonymous: false, level: 91,
    timeAgo: "4h ago", likes: 134, comments: 48, scraps: 61,
    tickers: ["$BTC", "$ETH", "$SOL"], isBest: true, isHot: false,
    position: null,
  },
  {
    id: "p3", category: "journal",
    title: "3 Liquidations This Month — Embarrassing but Sharing My Losses",
    preview: "Embarrassing to share but here goes. Got liquidated three times this month using high leverage. Total loss around -$2,400. Has anyone been through something similar? How do you manage the mental side...",
    author: "Anonymous Trader", isAnonymous: true, level: 8,
    timeAgo: "6h ago", likes: 52, comments: 41, scraps: 6,
    tickers: [], isBest: true, isHot: false,
    position: null,
  },
  {
    id: "p4", category: "news",
    title: "Binance New Listing — TRUMP Perpetual Futures Open Tomorrow",
    preview: "According to Binance's official announcement, TRUMP perpetual futures open tomorrow at 12:00 UTC. Initial max leverage 20×, both cross and isolated margin supported...",
    author: "TradeGuru_KR", isAnonymous: false, level: 33,
    timeAgo: "7h ago", likes: 34, comments: 17, scraps: 9,
    tickers: ["$BTC"], isBest: false, isHot: true,
    position: null,
  },
  {
    id: "p5", category: "free",
    title: "When's Alt Season... BTC Dominance Just Broke 58%",
    preview: "BTC dominance hit 58% — what's the basis for people saying alts will pump from here? Personally I think we need one more BTC correction below 60k before alt season kicks in...",
    author: "SolanaKing", isAnonymous: false, level: 45,
    timeAgo: "9h ago", likes: 18, comments: 73, scraps: 3,
    tickers: ["$BTC", "$ETH"], isBest: false, isHot: true,
    position: null,
  },
  {
    id: "p6", category: "journal",
    title: "SOL Long Entered — $160 Support Confirmed",
    preview: "Entered long on SOL after confirming $160 support. Target $185, stop at $155. Funding rate is low and RSI looks decent so feeling cautiously good about this one...",
    author: "DiaHands", isAnonymous: false, level: 8,
    timeAgo: "12h ago", likes: 7, comments: 9, scraps: 1,
    tickers: ["$SOL"], isBest: false, isHot: false,
    position: { symbol: "SOLUSDT", side: "Long", lev: 5, pnlPct: 8.4 },
  },
  {
    id: "p7", category: "news",
    title: "ETH $3800 Resistance Analysis — Breakout Conditions Mapped Out",
    preview: "ETH has been hovering around $3800 for days. Technically, a break above this level leaves no resistance until $4200. Here are the breakout conditions and the failure scenario...",
    author: "Anonymous Trader", isAnonymous: true, level: 61,
    timeAgo: "1d ago", likes: 24, comments: 31, scraps: 12,
    tickers: ["$ETH"], isBest: false, isHot: true,
    position: null,
  },
  {
    id: "p8", category: "free",
    title: "Tried ReboundX Rebate for the First Time — The Difference Is Real",
    preview: "Was trading directly on Bybit before switching to ReboundX Terminal and the monthly fee savings are bigger than I expected. Based on $30M monthly volume the math works out to...",
    author: "MoonMission", isAnonymous: false, level: 21,
    timeAgo: "2d ago", likes: 4, comments: 6, scraps: 2,
    tickers: [], isBest: false, isHot: false,
    position: null,
  },
];

const MOCK_COMMENTS: Record<string, Comment[]> = {
  p1: [
    {
      id: "c1", author: "ETHbull_kr", isAnonymous: false, level: 31,
      content: "Re-entering after a 94k stop-out takes serious conviction. Most people just give up... what's your risk management rule?",
      timeAgo: "1h ago", likes: 12,
      replies: [
        { id: "r1", author: "CryptoWhale88", isAnonymous: false, level: 72, content: "I never risk more than 2% of total equity on a single trade. Keeps my head straight even when I get stopped out.", timeAgo: "58m ago", likes: 8 },
      ],
    },
    {
      id: "c2", author: "Anonymous Trader", isAnonymous: true, level: 12,
      content: "Had a similar setup and came out profitable too. The hard part is staying consistent with it.",
      timeAgo: "45m ago", likes: 5,

      replies: [],
    },
  ],
  p3: [
    {
      id: "c3", author: "Moonrider", isAnonymous: false, level: 18,
      content: "Thanks for sharing. Went through the same thing... setting a hard stop-loss rule in advance was the single biggest thing that helped me.",
      timeAgo: "5h ago", likes: 19,
      replies: [],
    },
  ],
};

const MOCK_PROFILES: Record<string, UserProfile> = {
  CryptoWhale88: { id: "CryptoWhale88", nickname: "CryptoWhale88", level: 72, xp: 3820, xpForNext: 5000, joinDate: "2023.03", volumeRange: "$2M – $5M / mo", posts: 47, followers: 213 },
  BTCmaxi:       { id: "BTCmaxi",       nickname: "BTCmaxi",       level: 91, xp: 9200, xpForNext: 10000, joinDate: "2022.11", volumeRange: "$10M+ / mo",   posts: 132, followers: 891 },
  TradeGuru_KR:  { id: "TradeGuru_KR",  nickname: "TradeGuru_KR",  level: 33, xp: 780,  xpForNext: 1000, joinDate: "2024.01", volumeRange: "$500K – $1M / mo", posts: 28, followers: 67 },
  SolanaKing:    { id: "SolanaKing",    nickname: "SolanaKing",    level: 45, xp: 2100, xpForNext: 3000, joinDate: "2023.07", volumeRange: "$1M – $2M / mo", posts: 19, followers: 104 },
  DiaHands:      { id: "DiaHands",      nickname: "DiaHands",      level: 8,  xp: 320,  xpForNext: 500,  joinDate: "2024.06", volumeRange: "$100K – $300K / mo", posts: 5, followers: 11 },
  MoonMission:   { id: "MoonMission",   nickname: "MoonMission",   level: 21, xp: 950,  xpForNext: 1500, joinDate: "2023.12", volumeRange: "$300K – $700K / mo", posts: 12, followers: 33 },
  ETHbull_kr:    { id: "ETHbull_kr",    nickname: "ETHbull_kr",    level: 31, xp: 680,  xpForNext: 1000, joinDate: "2024.02", volumeRange: "$500K – $1M / mo", posts: 21, followers: 58 },
  Moonrider:     { id: "Moonrider",     nickname: "Moonrider",     level: 18, xp: 560,  xpForNext: 1000, joinDate: "2024.03", volumeRange: "$200K – $500K / mo", posts: 8, followers: 24 },
};

const TRENDING_TICKERS = [
  { symbol: "$BTC", price: 69_234, change: 2.34 },
  { symbol: "$ETH", price: 3_782,  change: -1.12 },
  { symbol: "$SOL", price: 178,    change: 4.21 },
  { symbol: "$BNB", price: 594,    change: 1.05 },
];

// ─── Level style ──────────────────────────────────────────────────────────────

function getLevelStyle(level: number) {
  if (level >= 91) return { text: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-400/30" };
  if (level >= 61) return { text: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/30" };
  if (level >= 31) return { text: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-400/30"  };
  if (level >= 11) return { text: "text-positive",   bg: "bg-positive/10",   border: "border-positive/30"  };
  return              { text: "text-text-disabled", bg: "bg-surface-3",     border: "border-border-subtle" };
}

function getLevelName(level: number) {
  if (level >= 91) return "Legend";
  if (level >= 61) return "Elite";
  if (level >= 31) return "Pro";
  if (level >= 11) return "Expert";
  return "Trader";
}

function LevelBadge({ level }: { level: number }) {
  const { text } = getLevelStyle(level);
  return <span className={`text-[10px] font-bold leading-none ${text}`}>Lv.{level}</span>;
}

const CATEGORY_ICON: Record<Exclude<Category, "all">, React.ReactNode> = {
  journal: <Briefcase size={11} />,
  free:    <MessageSquare size={11} />,
  news:    <Bell size={11} />,
};

function CategoryBadge({ category }: { category: Exclude<Category, "all"> }) {
  const meta = CATEGORY_META[category];
  return (
    <span className="flex items-center gap-1 text-[11px] font-medium text-text-tertiary">
      {CATEGORY_ICON[category]}
      <span>{meta.label}</span>
    </span>
  );
}

// ─── Position card preview ────────────────────────────────────────────────────

function PositionCardPreview({ pos }: { pos: PositionSnap }) {
  const isLong = pos.side === "Long";
  return (
    <div className={`flex items-center gap-3 rounded-md px-3 py-2 text-[12px] ${
      isLong ? "bg-positive/[0.06]" : "bg-negative/[0.06]"
    }`}>
      <span className="font-bold text-text-secondary">{pos.symbol}</span>
      <span className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${
        isLong ? "bg-positive/10 text-positive" : "bg-negative/10 text-negative"
      }`}>
        {pos.side} {pos.lev}×
      </span>
      <span className={`num-mono ml-auto font-bold ${isLong ? "text-positive" : "text-negative"}`}>
        {pos.pnlPct > 0 ? "+" : ""}{pos.pnlPct.toFixed(2)}%
      </span>
    </div>
  );
}

// ─── Report modal ─────────────────────────────────────────────────────────────

function ReportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [reason, setReason] = useState<ReportReason>("spam");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => setSubmitted(true);

  useEffect(() => {
    if (!open) { setSubmitted(false); setReason("spam"); }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[360px] rounded-2xl border border-border-subtle bg-surface-1 shadow-2xl">

        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <h2 className="text-[14px] font-bold text-text-primary">Report</h2>
          <button onClick={onClose} className="text-text-disabled transition-colors hover:text-text-secondary">
            <X size={16} />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 px-5 py-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-positive/15">
              <Check size={20} className="text-positive" />
            </div>
            <p className="text-[14px] font-bold text-text-primary">Report submitted</p>
            <p className="text-center text-[12px] leading-relaxed text-text-disabled">
              We&apos;ll review this and act according to our community guidelines. Thank you.
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-lg bg-surface-2 px-5 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface-3"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 p-5">
            <p className="text-[12px] text-text-disabled">Select a reason.</p>
            {(["spam", "false", "other"] as ReportReason[]).map(r => {
              const labels: Record<ReportReason, string> = {
                spam:  "Spam / Ads",
                false: "False Information",
                other: "Other",
              };
              return (
                <label key={r} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border-subtle bg-surface-2 px-3 py-2.5 transition-colors hover:bg-surface-3">
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      reason === r ? "border-primary" : "border-border-subtle"
                    }`}
                  >
                    {reason === r && <div className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <span
                    className={`text-[13px] font-medium ${reason === r ? "text-text-primary" : "text-text-secondary"}`}
                    onClick={() => setReason(r)}
                  >
                    {labels[r]}
                  </span>
                </label>
              );
            })}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button onClick={onClose} className="rounded-lg border border-border-subtle px-4 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:text-text-primary">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-negative/90 px-5 py-2 text-[13px] font-bold text-white transition-colors hover:bg-negative"
              >
                Submit Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Post menu ────────────────────────────────────────────────────────────────

function PostMenu({ onReport }: { onReport: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => { setCopied(false); setOpen(false); }, 1200);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-text-disabled opacity-0 transition-opacity group-hover:opacity-100 hover:bg-surface-2 hover:text-text-secondary"
        aria-label="More options"
      >
        <MoreHorizontal size={14} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 w-40 rounded-xl border border-border-subtle bg-surface-2 py-1 shadow-xl">
          <button
            onClick={(e) => { e.stopPropagation(); handleCopy(); }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-[12px] text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary"
          >
            {copied ? <Check size={12} className="text-positive" /> : <Link2 size={12} />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onReport(); }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-[12px] text-text-secondary transition-colors hover:bg-surface-3 hover:text-negative"
          >
            <Flag size={12} />
            Report
          </button>
          <div className="my-1 h-px bg-border-ghost" />
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-[12px] text-text-disabled transition-colors hover:bg-surface-3 hover:text-negative"
          >
            <Ban size={12} />
            Block User
          </button>
        </div>
      )}
    </div>
  );
}

// ─── User profile popup ───────────────────────────────────────────────────────

function UserProfilePopup({
  profile,
  onClose,
}: {
  profile: UserProfile;
  onClose: () => void;
}) {
  const { text } = getLevelStyle(profile.level);
  const [following, setFollowing] = useState(false);
  const pct = Math.min(100, Math.round((profile.xp / profile.xpForNext) * 100));

  return (
    <div className="absolute left-0 top-full z-40 mt-2 w-[260px] overflow-hidden rounded-2xl border border-border-subtle bg-surface-1 shadow-2xl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-border-ghost px-4 py-2.5">
        <span className="text-[12px] font-semibold text-text-secondary">Profile</span>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="text-text-disabled transition-colors hover:text-text-secondary"
        >
          <X size={13} />
        </button>
      </div>

      <div className="flex flex-col gap-0 px-4 pt-3 pb-4">

        {/* ── Avatar + name + follow ── */}
        <div className="mb-3 flex items-center gap-2.5">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-3 text-[14px] font-bold ${text}`}>
            {profile.nickname[0].toUpperCase()}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="truncate text-[13px] font-bold text-text-primary">{profile.nickname}</p>
            <p className={`text-[11px] font-semibold ${text}`}>
              Lv.{profile.level} <span className="font-normal text-text-disabled">{getLevelName(profile.level)}</span>
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setFollowing(v => !v); }}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-bold transition-colors ${
              following
                ? "border border-border-subtle bg-surface-2 text-text-secondary hover:bg-surface-3"
                : "bg-accent-primary text-primary hover:bg-primary/20"
            }`}
          >
            {following ? "Following" : "Follow"}
          </button>
        </div>

        {/* ── XP bar ── */}
        <div className="mb-3">
          <div className="mb-1.5 flex items-center justify-between text-[10px]">
            <span className="text-text-disabled">XP</span>
            <span className={`num-mono font-semibold ${text}`}>{profile.xp.toLocaleString()} XP</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${pct}%`, background: `rgb(var(--color-primary-normal))` }}
            />
          </div>
          <p className="mt-1 text-right text-[10px] text-text-disabled">
            {profile.xp.toLocaleString()}/{profile.xpForNext.toLocaleString()} to next level
          </p>
        </div>

        {/* ── Divider ── */}
        <div className="mb-3 h-px bg-border-ghost" />

        {/* ── Info rows — no outer box, dividers only ── */}
        <div className="mb-3 flex flex-col">
          {[
            { label: "Joined",           value: profile.joinDate },
            { label: "Est. Volume",      value: profile.volumeRange },
            { label: "Posts",            value: String(profile.posts) },
            { label: "Followers",        value: String(profile.followers) },
          ].map(({ label, value }) => (
            <div key={label} className="info-row">
              <span className="info-row-label">{label}</span>
              <span className="num-mono info-row-value text-[12px]">{value}</span>
            </div>
          ))}
        </div>

        {/* ── View profile link ── */}
        <Link
          href={`/user/${profile.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border-subtle py-2 text-[12px] font-medium text-text-secondary transition-colors hover:border-primary/30 hover:bg-surface-2 hover:text-text-primary"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}

// ─── Author button with profile popup ─────────────────────────────────────────

function AuthorButton({
  author,
  isAnonymous,
  level,
}: {
  author: string;
  isAnonymous: boolean;
  level: number;
}) {
  const [showProfile, setShowProfile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const profile = isAnonymous ? null : MOCK_PROFILES[author] ?? null;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex items-center gap-1.5">
      {isAnonymous ? (
        <UserCircle2 size={13} className="text-text-disabled" />
      ) : (
        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-surface-3 text-[9px] font-bold text-text-secondary">
          {author[0]}
        </div>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!isAnonymous && profile) setShowProfile(v => !v);
        }}
        className={`text-[12px] font-semibold text-text-secondary ${
          !isAnonymous && profile ? "hover:text-text-primary hover:underline underline-offset-2 cursor-pointer" : "cursor-default"
        }`}
      >
        {author}
      </button>
      <LevelBadge level={level} />

      {showProfile && profile && (
        <UserProfilePopup profile={profile} onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}

// ─── Comment item ─────────────────────────────────────────────────────────────

function CommentItem({
  comment,
  depth = 0,
}: {
  comment: Comment | Reply;
  depth?: number;
}) {
  const [liked, setLiked] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyAnon, setReplyAnon] = useState(false);
  const isComment = "replies" in comment;

  const MAX_CHARS = 500;

  return (
    <div className={`flex gap-2.5 ${depth > 0 ? "ml-7 border-l border-border-ghost pl-3" : ""}`}>
      {/* Avatar */}
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-3 text-[10px] font-bold text-text-secondary">
        {comment.isAnonymous ? "?" : comment.author[0]}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {/* Author + time */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-text-secondary">{comment.author}</span>
          <LevelBadge level={comment.level} />
          <span className="ml-auto text-[11px] text-text-disabled">{comment.timeAgo}</span>
        </div>

        {/* Content */}
        <p className="text-[13px] leading-relaxed text-text-primary">{comment.content}</p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLiked(v => !v)}
            className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${
              liked ? "text-primary" : "text-text-disabled hover:text-text-secondary"
            }`}
          >
            <ThumbsUp size={11} />
            <span className="num-mono">{comment.likes + (liked ? 1 : 0)}</span>
          </button>

          {isComment && depth === 0 && (
            <button
              onClick={() => setShowReply(v => !v)}
              className="text-[11px] text-text-disabled transition-colors hover:text-text-secondary"
            >
              Reply
            </button>
          )}
        </div>

        {/* Reply input */}
        {isComment && showReply && (
          <div className="mt-1 flex flex-col gap-2 rounded-lg border border-border-subtle bg-surface-2 p-2.5">
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Write a reply (max 500 chars)"
              rows={2}
              className="w-full resize-none bg-transparent text-[12px] leading-relaxed text-text-primary outline-none placeholder:text-text-disabled"
            />
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-text-disabled">
                <div
                  onClick={() => setReplyAnon((v) => !v)}
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border transition-colors ${
                    replyAnon ? "border-primary bg-primary" : "border-border-subtle"
                  }`}
                  role="checkbox"
                  aria-checked={replyAnon}
                >
                  {replyAnon && <Check size={8} color="#0A0A0A" strokeWidth={2.5} />}
                </div>
                Anon
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-text-disabled">{replyText.length}/{MAX_CHARS}</span>
                <button
                  onClick={() => { setShowReply(false); setReplyText(""); }}
                  className="text-[11px] text-text-disabled transition-colors hover:text-text-secondary"
                >
                  Cancel
                </button>
                <button
                  disabled={!replyText.trim()}
                  className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-bold text-text-inverse transition-colors hover:bg-primary-strong disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Nested replies */}
        {isComment && comment.replies.length > 0 && (
          <div className="mt-1 flex flex-col gap-3">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} depth={1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Comment section ──────────────────────────────────────────────────────────

function CommentSection({ postId, count }: { postId: string; count: number }) {
  const [text, setText]     = useState("");
  const [anon, setAnon]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const comments = MOCK_COMMENTS[postId] ?? [];
  const MAX_CHARS = 500;

  const handleSubmit = () => {
    if (!text.trim()) return;
    setSubmitted(true);
    setText("");
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="mt-1 border-t border-border-ghost pt-3">
      <p className="mb-3 text-[12px] font-bold text-text-secondary">{count} Comments</p>

      {/* Write area */}
      <div className="mb-4 rounded-lg border border-border-subtle bg-surface-2 p-3 focus-within:border-primary/30 transition-colors">
        <textarea
          value={text}
          onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Write a comment (max 500 chars)"
          rows={2}
          className="w-full resize-none bg-transparent text-[13px] leading-relaxed text-text-primary outline-none placeholder:text-text-disabled"
        />
        <div className="mt-2 flex items-center justify-between border-t border-border-ghost pt-2">
          <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-text-disabled">
            <div
              onClick={() => setAnon(v => !v)}
              className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border transition-colors ${
                anon ? "border-primary bg-primary" : "border-border-subtle"
              }`}
              role="checkbox"
              aria-checked={anon}
            >
              {anon && <Check size={8} color="#0A0A0A" strokeWidth={2.5} />}
            </div>
            Post anonymously
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-text-disabled">{text.length}/{MAX_CHARS}</span>
            <button
              onClick={handleSubmit}
              disabled={!text.trim()}
              className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[12px] font-bold text-text-inverse transition-colors hover:bg-primary-strong disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitted ? <><Check size={11} /> Posted</> : "Post"}
            </button>
          </div>
        </div>
      </div>

      {/* Comment list */}
      {comments.length > 0 ? (
        <div className="flex flex-col gap-4">
          {comments.map(c => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1.5 py-6 text-center">
          <MessageSquare size={20} className="text-text-disabled" />
          <p className="text-[12px] text-text-disabled">Be the first to comment</p>
        </div>
      )}
    </div>
  );
}

// ─── Post card ────────────────────────────────────────────────────────────────

function PostCard({
  post,
  onLike,
  onReport,
}: {
  post: Post;
  onLike: (id: string) => void;
  onReport: (id: string) => void;
}) {
  const [liked,        setLiked]        = useState(false);
  const [disliked,     setDisliked]     = useState(false);
  const [scrapped,     setScrapped]     = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disliked) setDisliked(false);
    setLiked(v => !v);
    if (!liked) onLike(post.id);
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) { setLiked(false); }
    setDisliked(v => !v);
  };

  return (
    <article
      className={`group relative flex cursor-pointer flex-col gap-3 border-b border-border-ghost px-5 py-4 transition-colors last:border-b-0 ${
        post.isBest ? "bg-primary/[0.035] hover:bg-primary/[0.06]" : "hover:bg-surface-2/40"
      }`}
    >
      {post.isBest && (
        <span
          className="absolute left-0 top-0 h-full w-[2px] bg-primary"
          aria-hidden="true"
        />
      )}

      {/* ── Top meta row ── */}
      <div className="flex flex-wrap items-center gap-2">
        {post.isBest && (
          <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2 py-[2px] text-[10px] font-bold text-primary">
            <Gem size={9} /> Best
          </span>
        )}
        {post.isHot && !post.isBest && (
          <span className="flex items-center gap-1 rounded-full bg-orange-500/15 px-2 py-[2px] text-[10px] font-bold text-orange-400">
            <Flame size={9} /> Hot
          </span>
        )}

        <CategoryBadge category={post.category} />
        <span className="h-3 w-px bg-border-ghost" aria-hidden />

        <AuthorButton
          author={post.author}
          isAnonymous={post.isAnonymous}
          level={post.level}
        />

        <span className="ml-auto text-[11px] text-text-disabled">{post.timeAgo}</span>
        <PostMenu onReport={() => onReport(post.id)} />
      </div>

      {/* ── Title ── */}
      <h3 className="text-[14px] font-bold leading-snug text-text-primary transition-colors group-hover:text-primary">
        {post.title}
      </h3>

      {/* ── Preview ── */}
      <p className="line-clamp-2 text-[12px] leading-relaxed text-text-tertiary">
        {post.preview}
      </p>

      {/* ── Position card ── */}
      {post.position && <PositionCardPreview pos={post.position} />}

      {/* ── Ticker tags ── */}
      {post.tickers.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.tickers.map(t => (
            <span key={t} className="rounded-full border border-primary/20 bg-primary/8 px-2 py-[2px] text-[11px] font-bold text-primary">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* ── Interaction row ── */}
      <div className="flex items-center gap-4 border-t border-border-ghost pt-2.5">
        {/* Like */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors ${
            liked ? "text-primary" : "text-text-disabled hover:text-text-secondary"
          }`}
        >
          <ThumbsUp size={13} />
          <span className="num-mono">{post.likes + (liked ? 1 : 0)}</span>
        </button>

        {/* Dislike — no count shown */}
        <button
          onClick={handleDislike}
          className={`flex items-center gap-1 text-[12px] transition-colors ${
            disliked ? "text-negative" : "text-text-disabled hover:text-text-secondary"
          }`}
          title="Dislike"
        >
          <ThumbsDown size={13} />
        </button>

        {/* Comments */}
        <button
          onClick={(e) => { e.stopPropagation(); setShowComments(v => !v); }}
          className={`flex items-center gap-1.5 text-[12px] transition-colors ${
            showComments ? "text-text-primary" : "text-text-disabled hover:text-text-secondary"
          }`}
        >
          <MessageSquare size={13} />
          <span className="num-mono">{post.comments}</span>
        </button>

        {/* Scrap */}
        <button
          onClick={(e) => { e.stopPropagation(); setScrapped(v => !v); }}
          className={`flex items-center gap-1.5 text-[12px] transition-colors ${
            scrapped ? "text-primary" : "text-text-disabled hover:text-text-secondary"
          }`}
        >
          <Bookmark size={13} />
          <span className="num-mono">{post.scraps + (scrapped ? 1 : 0)}</span>
        </button>
      </div>

      {/* ── Comment section ── */}
      {showComments && (
        <CommentSection postId={post.id} count={post.comments} />
      )}
    </article>
  );
}

// ─── Write modal ──────────────────────────────────────────────────────────────

function WriteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [category,     setCategory]     = useState<Exclude<Category, "all">>("journal");
  const [title,        setTitle]        = useState("");
  const [body,         setBody]         = useState("");
  const [isAnon,       setIsAnon]       = useState(false);
  const [ticker,       setTicker]       = useState("");
  const [tickers,      setTickers]      = useState<string[]>([]);
  const [showCatDrop,  setShowCatDrop]  = useState(false);
  const [images,       setImages]       = useState<string[]>([]);
  const [imageError,   setImageError]   = useState(false);
  const [attachPos,    setAttachPos]    = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Level restriction: Lv.6+ required for journal / news
  const isRestricted = MY_LEVEL < 6 && category !== "free";
  const canSubmit = title.trim() && body.trim() && !isRestricted;

  const addTicker = () => {
    const clean = ticker.trim().toUpperCase().replace(/^\$/, "");
    if (clean && !tickers.includes(`$${clean}`)) {
      setTickers(t => [...t, `$${clean}`]);
    }
    setTicker("");
  };

  const handleAddImage = () => {
    if (images.length >= 5) { setImageError(true); return; }
    // Mock: add placeholder
    setImages(prev => [...prev, `img_${prev.length + 1}`]);
    setImageError(false);
  };

  const handleRemoveImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setImageError(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 flex w-full max-w-[640px] flex-col rounded-2xl border border-border-subtle bg-surface-1 shadow-2xl max-h-[90vh]">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border-subtle px-5 py-4">
          <h2 className="text-[15px] font-bold text-text-primary">New Post</h2>
          <button onClick={onClose} className="text-text-disabled transition-colors hover:text-text-secondary">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto p-5">

          {/* Level restriction warning */}
          {isRestricted && (
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-400/30 bg-amber-400/8 px-3.5 py-3">
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-400" />
              <div className="flex flex-col gap-0.5">
                <p className="text-[12px] font-bold text-amber-400">Level Restriction</p>
                <p className="text-[12px] text-text-secondary leading-relaxed">
                  Trading Journal and Info &amp; News require <span className="font-bold text-amber-400">Lv.6</span> or above.
                  Your level: <span className="font-bold text-text-primary">Lv.{MY_LEVEL}</span>
                </p>
                <p className="text-[11px] text-text-disabled mt-0.5">Free Board is open to all levels.</p>
              </div>
            </div>
          )}

          {/* Category */}
          <div className="relative">
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-text-disabled">
              Category
            </label>
            <button
              onClick={() => setShowCatDrop(v => !v)}
              className="flex w-full items-center justify-between rounded-lg border border-border-subtle bg-surface-2 px-3 py-2.5 text-[13px] font-medium text-text-primary transition-colors hover:bg-surface-3"
            >
              <span className="flex items-center gap-1.5">{CATEGORY_ICON[category]} {CATEGORY_META[category].label}</span>
              <ChevronDown size={14} className={`text-text-tertiary transition-transform ${showCatDrop ? "rotate-180" : ""}`} />
            </button>
            {showCatDrop && (
              <div className="absolute top-full z-10 mt-1 w-full rounded-xl border border-border-subtle bg-surface-2 py-1 shadow-xl">
                {(Object.entries(CATEGORY_META) as [Exclude<Category, "all">, typeof CATEGORY_META["journal"]][]).map(([key, meta]) => {
                  const locked = MY_LEVEL < 6 && key !== "free";
                  return (
                    <button
                      key={key}
                      onClick={() => { if (!locked) { setCategory(key); setShowCatDrop(false); } }}
                      className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-[13px] transition-colors ${
                        locked
                          ? "cursor-not-allowed text-text-disabled"
                          : category === key
                          ? "font-bold text-text-primary hover:bg-surface-3"
                          : "text-text-secondary hover:bg-surface-3"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {CATEGORY_ICON[key]} {meta.label}
                      </span>
                      {locked && <span className="text-[10px] text-amber-400/70">Lv.6+</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-text-disabled">Title</label>
            <div className="flex items-center rounded-lg border border-border-subtle bg-surface-2 px-3 focus-within:border-primary/40 transition-colors">
              <input
                type="text"
                maxLength={100}
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter a title (max 100 chars)"
                className="flex-1 bg-transparent py-2.5 text-[13px] text-text-primary outline-none placeholder:text-text-disabled"
              />
              <span className="ml-2 shrink-0 text-[11px] text-text-disabled">{title.length}/100</span>
            </div>
          </div>

          {/* Body */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-text-disabled">Body</label>
            <div className="rounded-lg border border-border-subtle bg-surface-2 focus-within:border-primary/40 transition-colors">
              <textarea
                maxLength={10000}
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Write your post (Markdown supported, max 10,000 chars)"
                rows={6}
                className="w-full resize-none bg-transparent px-3 py-2.5 text-[13px] leading-relaxed text-text-primary outline-none placeholder:text-text-disabled"
              />
              <div className="flex justify-end border-t border-border-ghost px-3 py-1.5">
                <span className="text-[11px] text-text-disabled">{body.length}/10,000</span>
              </div>
            </div>
          </div>

          {/* Image attachment */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-text-disabled">
              Attach Images <span className="normal-case font-normal text-text-disabled/60">(max 5)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {images.map((img, idx) => (
                <div key={img} className="relative h-16 w-16 rounded-lg border border-border-subtle bg-surface-2 overflow-hidden">
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon size={20} className="text-text-disabled" />
                  </div>
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-background/90 text-text-secondary hover:text-negative"
                  >
                    <X size={9} />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button
                  onClick={handleAddImage}
                  className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border-subtle bg-surface-2 text-text-disabled transition-colors hover:border-primary/40 hover:text-text-secondary"
                >
                  <ImageIcon size={16} />
                  <span className="text-[9px]">Add</span>
                </button>
              )}
            </div>
            {imageError && (
              <p className="mt-1.5 text-[11px] text-negative">You can attach up to 5 images.</p>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" multiple />
          </div>

          {/* Position card attachment */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-text-disabled">
              Attach Position
            </label>
            <button
              onClick={() => setAttachPos(v => !v)}
              className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-[13px] font-medium transition-colors ${
                attachPos
                  ? "border-primary/30 bg-primary/8 text-primary"
                  : "border-border-subtle bg-surface-2 text-text-secondary hover:bg-surface-3"
              }`}
            >
              <Briefcase size={14} />
              <span>{attachPos ? "Position attached" : "Attach current position card"}</span>
              {attachPos && <X size={12} className="ml-auto" onClick={(e) => { e.stopPropagation(); setAttachPos(false); }} />}
            </button>
            {attachPos && (
              <div className="mt-2">
                <PositionCardPreview pos={MOCK_POSITION} />
              </div>
            )}
          </div>

          {/* Ticker tags */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-text-disabled">Ticker Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {tickers.map(t => (
                <span key={t} className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/8 px-2.5 py-1 text-[11px] font-bold text-primary">
                  {t}
                  <button onClick={() => setTickers(ts => ts.filter(x => x !== t))} className="hover:text-primary/60">
                    <X size={9} />
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1 rounded-full border border-border-subtle bg-surface-2 px-2.5 py-1">
                <span className="text-[11px] text-text-disabled">$</span>
                <input
                  value={ticker}
                  onChange={e => setTicker(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTicker(); } }}
                  placeholder="BTC, ETH…"
                  className="w-20 bg-transparent text-[11px] text-text-primary outline-none placeholder:text-text-disabled"
                />
                <button onClick={addTicker} className="text-[11px] font-bold text-primary hover:text-primary-strong">
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Anonymous */}
          <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border-subtle bg-surface-2 px-3 py-2.5">
            <div
              onClick={() => setIsAnon(v => !v)}
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border transition-colors ${
                isAnon ? "border-primary bg-primary" : "border-border-subtle"
              }`}
              role="checkbox"
              aria-checked={isAnon}
              tabIndex={0}
              onKeyDown={e => e.key === " " && setIsAnon(v => !v)}
            >
              {isAnon && <Check size={10} color="#0A0A0A" strokeWidth={2.5} />}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-medium text-text-primary">Post anonymously</span>
              <span className="text-[11px] text-text-disabled">Shown as &quot;Anonymous Trader&quot; instead of your nickname (level badge still visible)</span>
            </div>
          </label>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border-subtle px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-border-subtle px-4 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            Cancel
          </button>
          <button
            disabled={!canSubmit}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-[13px] font-bold text-text-inverse transition-colors hover:bg-primary-strong disabled:opacity-40 disabled:cursor-not-allowed"
            title={isRestricted ? "Requires Lv.6 or above to post" : undefined}
          >
            Post
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Category sidebar ────────────────────────────────────────────────────────

function CategorySidebar({
  active,
  onChange,
  counts,
}: {
  active: Category;
  onChange: (c: Category) => void;
  counts: Record<Category, number>;
}) {
  return (
    <aside className="flex w-[200px] shrink-0 flex-col gap-1">
      <p className="section-label mb-2 px-3">Categories</p>

      <button
        onClick={() => onChange("all")}
        className={`flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
          active === "all" ? "bg-surface-2 font-bold text-text-primary" : "text-text-tertiary hover:bg-surface-1 hover:text-text-secondary"
        }`}
      >
        <span className="flex items-center gap-2"><Hash size={14} className="shrink-0" />All</span>
        <span className="num-mono text-[11px] text-text-disabled">{counts.all}</span>
      </button>

      {(Object.entries(CATEGORY_META) as [Exclude<Category, "all">, typeof CATEGORY_META["journal"]][]).map(([key, meta]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
            active === key ? "bg-surface-2 font-bold text-text-primary" : "text-text-tertiary hover:bg-surface-1 hover:text-text-secondary"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-text-disabled">{CATEGORY_ICON[key]}</span>
            <span className="leading-none">{meta.label}</span>
          </span>
          <span className="num-mono text-[11px] text-text-disabled">{counts[key]}</span>
        </button>
      ))}

      <div className="my-3 divider-ghost" />

      <p className="section-label mb-2 px-3">My Activity</p>
      {["My Posts", "Saved Posts"].map(label => (
        <button key={label} className="rounded-lg px-3 py-2 text-left text-[13px] text-text-disabled transition-colors hover:bg-surface-1 hover:text-text-secondary">
          {label}
        </button>
      ))}

      <div className="my-3 divider-ghost" />

      <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] text-text-disabled">
        <Users size={13} />
        <span>Online</span>
        <span className="num-mono ml-auto font-bold text-positive">47</span>
      </div>
    </aside>
  );
}

// ─── Hot sidebar ──────────────────────────────────────────────────────────────

function HotSidebar({ posts }: { posts: Post[] }) {
  const hotPosts = posts
    .filter(p => p.isBest || p.isHot)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5);

  return (
    <aside className="w-[240px] shrink-0">
      <div className="panel">

        {/* Hot Posts */}
        <div className="panel-section">
          <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-text-disabled">
            <Flame size={12} className="text-orange-400" /> Hot Posts
          </h3>
          <div className="flex flex-col">
            {hotPosts.map((p, i) => (
              <div
                key={p.id}
                className="group flex cursor-pointer gap-2.5 py-2"
                style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : undefined }}
              >
                <span className={`num-mono mt-0.5 w-4 shrink-0 text-[11px] font-bold ${
                  i === 0 ? "text-primary" : "text-text-disabled"
                }`}>
                  {i + 1}
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="line-clamp-2 text-[12px] font-medium leading-snug text-text-secondary transition-colors group-hover:text-text-primary">
                    {p.title}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-text-disabled">
                    <ThumbsUp size={10} />
                    <span className="num-mono">{p.likes}</span>
                    <span className="text-border-ghost">·</span>
                    <span>{p.timeAgo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Tickers */}
        <div className="panel-section">
          <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-text-disabled">
            <TrendingUp size={12} className="text-primary" /> Trending
          </h3>
          <div className="flex flex-col">
            {TRENDING_TICKERS.map((t, i) => (
              <div
                key={t.symbol}
                className="flex cursor-pointer items-center justify-between py-1.5 transition-colors hover:opacity-80"
                style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : undefined }}
              >
                <span className="text-[12px] font-bold text-primary">{t.symbol}</span>
                <div className="flex items-center gap-2">
                  <span className="num-mono text-[12px] text-text-secondary">${t.price.toLocaleString()}</span>
                  <span className={`num-mono flex items-center gap-0.5 text-[11px] font-bold ${t.change >= 0 ? "text-positive" : "text-negative"}`}>
                    {t.change >= 0 ? <ArrowUp size={8} /> : <ArrowDown size={8} />}
                    {Math.abs(t.change).toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
}

// ─── Tabs + Hot period filter ─────────────────────────────────────────────────

const TABS: { key: FeedTab; label: string }[] = [
  { key: "all",       label: "All"       },
  { key: "hot",       label: "Hot"       },
  { key: "following", label: "Following" },
  { key: "ticker",    label: "$Ticker"   },
];

const HOT_PERIODS: { key: HotPeriod; label: string }[] = [
  { key: "24h", label: "24h" },
  { key: "7d",  label: "7d"  },
  { key: "all", label: "All" },
];

const SORTS: { key: SortBy; label: string }[] = [
  { key: "latest",   label: "Latest"        },
  { key: "popular",  label: "Popular"       },
  { key: "comments", label: "Most Comments" },
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const [category,     setCategory]     = useState<Category>("all");
  const [tab,          setTab]          = useState<FeedTab>("all");
  const [hotPeriod,    setHotPeriod]    = useState<HotPeriod>("24h");
  const [sortBy,       setSortBy]       = useState<SortBy>("latest");
  const [search,       setSearch]       = useState("");
  const [showWrite,    setShowWrite]    = useState(false);
  const [posts,        setPosts]        = useState<Post[]>(MOCK_POSTS);
  const [showSortDrop, setShowSortDrop] = useState(false);
  const [reportPostId, setReportPostId] = useState<string | null>(null);

  const handleLike = (id: string) => {
    setPosts(ps => ps.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  // Filter + sort
  const filtered = useMemo(() => {
    let result = [...posts];

    if (category !== "all") result = result.filter(p => p.category === category);
    if (tab === "hot")       result = result.filter(p => p.isBest || p.isHot);
    if (tab === "following") result = []; // no followed users yet

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.preview.toLowerCase().includes(q) ||
        p.tickers.some(t => t.toLowerCase().includes(q))
      );
    }

    if (sortBy === "popular")  result.sort((a, b) => b.likes - a.likes);
    if (sortBy === "comments") result.sort((a, b) => b.comments - a.comments);

    return result;
  }, [posts, category, tab, search, sortBy]);

  const bestPosts    = filtered.filter(p => p.isBest);
  const regularPosts = filtered.filter(p => !p.isBest);

  const counts = useMemo<Record<Category, number>>(() => ({
    all:     posts.length,
    journal: posts.filter(p => p.category === "journal").length,
    free:    posts.filter(p => p.category === "free").length,
    news:    posts.filter(p => p.category === "news").length,
  }), [posts]);

  const currentSortLabel = SORTS.find(s => s.key === sortBy)?.label ?? "Latest";

  return (
    <div className="min-h-[calc(100vh-56px)] bg-background pt-14">
      <div className="mx-auto max-w-[1400px] px-4 py-6">
        <div className="flex gap-6">

          {/* ── Left sidebar ── */}
          <div className="hidden lg:block">
            <div className="sticky top-[80px]">
              <CategorySidebar active={category} onChange={setCategory} counts={counts} />
            </div>
          </div>

          {/* ── Main feed ── */}
          <main className="flex min-w-0 flex-1 flex-col gap-4">

            {/* Unified toolbar */}
            <div className="panel">
              <div className="flex items-center gap-3 px-3 py-2.5">
                <div className="flex gap-[2px]">
                  {TABS.map(t => (
                    <button
                      key={t.key}
                      onClick={() => setTab(t.key)}
                      className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                        tab === t.key
                          ? "bg-surface-3 font-bold text-text-primary"
                          : "text-text-disabled hover:text-text-tertiary"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <span className="h-5 w-px bg-border-ghost" aria-hidden />

                <div className="flex flex-1 items-center gap-2 focus-within:text-text-primary">
                  <Search size={13} className="shrink-0 text-text-disabled" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by keyword, $ticker, or nickname…"
                    className="flex-1 bg-transparent text-[13px] text-text-primary outline-none placeholder:text-text-disabled"
                  />
                </div>

                <span className="h-5 w-px bg-border-ghost" aria-hidden />

                <div className="relative">
                  <button
                    onClick={() => setShowSortDrop(v => !v)}
                    className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
                  >
                    {currentSortLabel}
                    <ChevronDown size={12} className={`transition-transform ${showSortDrop ? "rotate-180" : ""}`} />
                  </button>
                  {showSortDrop && (
                    <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-xl border border-border-subtle bg-surface-2 py-1 shadow-xl">
                      {SORTS.map(s => (
                        <button
                          key={s.key}
                          onClick={() => { setSortBy(s.key); setShowSortDrop(false); }}
                          className={`flex w-full items-center px-3 py-2 text-[13px] transition-colors hover:bg-surface-3 ${
                            sortBy === s.key ? "font-bold text-text-primary" : "text-text-secondary"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowWrite(true)}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-[13px] font-bold text-text-inverse transition-colors hover:bg-primary-strong"
                >
                  <Pencil size={13} />
                  Write
                </button>
              </div>

              {/* Hot period filter — shown only when tab === "hot" */}
              {tab === "hot" && (
                <div className="flex items-center gap-2 border-t border-border-ghost px-5 py-2.5">
                  <span className="text-[11px] uppercase tracking-wider text-text-disabled">Period</span>
                  {HOT_PERIODS.map(p => (
                    <button
                      key={p.key}
                      onClick={() => setHotPeriod(p.key)}
                      className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                        hotPeriod === p.key
                          ? "bg-primary text-text-inverse"
                          : "text-text-secondary hover:bg-surface-2"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Following empty state */}
            {tab === "following" ? (
              <div className="panel flex flex-col items-center justify-center gap-4 py-24 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-2">
                  <Bell size={24} className="text-text-disabled" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-[15px] font-bold text-text-secondary">You haven&apos;t followed any traders yet</p>
                  <p className="text-[13px] text-text-disabled">Follow other traders to see their posts here</p>
                </div>
                <button
                  onClick={() => setTab("all")}
                  className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-2 px-4 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary"
                >
                  View All Posts
                </button>
              </div>
            ) : (
              <>
                {/* Best posts */}
                {bestPosts.length > 0 && tab !== "hot" && (
                  <div className="panel">
                    <div className="flex items-center gap-2 border-b border-border-ghost px-5 py-3">
                      <Gem size={12} className="text-primary" />
                      <span className="section-label text-primary">Best Posts</span>
                      <span className="text-[10px] text-text-disabled">— 50+ likes</span>
                    </div>
                    {bestPosts.map(p => (
                      <PostCard key={p.id} post={p} onLike={handleLike} onReport={setReportPostId} />
                    ))}
                  </div>
                )}

                {/* Regular / hot list */}
                {(tab === "hot" ? filtered : regularPosts).length > 0 ? (
                  <div className="panel">
                    {bestPosts.length > 0 && tab !== "hot" && (
                      <div className="flex items-center gap-2 border-b border-border-ghost px-5 py-3">
                        <span className="section-label">Latest Posts</span>
                      </div>
                    )}
                    {(tab === "hot" ? filtered : regularPosts).map(p => (
                      <PostCard key={p.id} post={p} onLike={handleLike} onReport={setReportPostId} />
                    ))}
                  </div>
                ) : bestPosts.length === 0 && (
                  <div className="panel flex flex-col items-center justify-center gap-3 py-20 text-center">
                    <MessageSquare size={32} className="text-text-disabled" />
                    <p className="text-[14px] font-medium text-text-tertiary">No posts yet</p>
                    <p className="text-[12px] text-text-disabled">Be the first to post</p>
                    <button
                      onClick={() => setShowWrite(true)}
                      className="mt-2 flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-bold text-text-inverse transition-colors hover:bg-primary-strong"
                    >
                      <Pencil size={13} />
                      Write
                    </button>
                  </div>
                )}
              </>
            )}
          </main>

          {/* ── Right sidebar ── */}
          <div className="hidden xl:block">
            <div className="sticky top-[80px]">
              <HotSidebar posts={posts} />
            </div>
          </div>
        </div>
      </div>

      <WriteModal open={showWrite} onClose={() => setShowWrite(false)} />
      <ReportModal open={reportPostId !== null} onClose={() => setReportPostId(null)} />
    </div>
  );
}
