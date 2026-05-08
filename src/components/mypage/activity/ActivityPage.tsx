"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  ArrowUpRight,
  Briefcase,
  Hash,
  Megaphone,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type PostCategory = "journal" | "free" | "news";
type ActivityTab  = "posts" | "comments" | "saved";

interface MyPost {
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

interface MyComment {
  id: string;
  postTitle: string;
  content: string;
  timeAgo: string;
  likes: number;
}

interface SavedPost {
  id: string;
  category: PostCategory;
  title: string;
  author: string;
  timeAgo: string;
  likes: number;
  comments: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_META: Record<PostCategory, { emoji: string; label: string; icon: React.ElementType }> = {
  journal: { emoji: "💼", label: "Trading Journal", icon: Briefcase },
  free:    { emoji: "🆓", label: "Free Board",      icon: Hash },
  news:    { emoji: "🚨", label: "Info & News",     icon: Megaphone },
};

const TABS: { key: ActivityTab; label: string; icon: React.ElementType }[] = [
  { key: "posts",    label: "My Posts",    icon: MessageSquare },
  { key: "comments", label: "My Comments", icon: MessageCircle },
  { key: "saved",    label: "Saved",       icon: Bookmark },
];

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_POSTS: MyPost[] = [
  {
    id: "p1", category: "journal",
    title: "BTC Long +18% Entry Analysis",
    preview: "Entered long after confirming 91,200 support. Set 3:1 risk/reward and closed half the position.",
    timeAgo: "2h ago", likes: 24, comments: 7, scraps: 5, tickers: ["BTCUSDT"],
  },
  {
    id: "p2", category: "free",
    title: "Strategy: Shorting During Negative Funding Rates",
    preview: "When funding rate drops below -0.05%, entering a short position lets you earn the funding fee on top.",
    timeAgo: "1d ago", likes: 61, comments: 13, scraps: 18, tickers: ["ETHUSDT", "BTCUSDT"],
  },
  {
    id: "p3", category: "news",
    title: "Fed FOMC Statement Analysis — Short-Term Impact on Crypto",
    preview: "BTC up 3% after Powell's dovish remarks. Macro environment remains uncertain.",
    timeAgo: "3d ago", likes: 89, comments: 21, scraps: 32, tickers: ["BTCUSDT"],
  },
];

const MOCK_COMMENTS: MyComment[] = [
  { id: "c1", postTitle: "Is it safe to long Solana?", content: "Should be fine if you keep leverage low and set a clear stop. Check if the $142 support holds.", timeAgo: "30m ago", likes: 4 },
  { id: "c2", postTitle: "Bybit vs OKX Fee Comparison", content: "Factoring in rebates, trading through ReboundX is more favorable for actual net returns.", timeAgo: "5h ago", likes: 12 },
  { id: "c3", postTitle: "Scenarios After BTC Breaks 94k", content: "Previous ATH resistance zone — scaling out makes sense here. Expect extra momentum if new ATH is set.", timeAgo: "2d ago", likes: 8 },
];

const MOCK_SAVED: SavedPost[] = [
  { id: "s1", category: "journal", title: "BTC 10× Long +34% Recap — Lessons from a Bad Entry", author: "CryptoWhale88", timeAgo: "Apr 22", likes: 218, comments: 47 },
  { id: "s2", category: "free",    title: "How to Manage Psychology in Leveraged Positions", author: "BTCmaxi",         timeAgo: "Apr 20", likes: 134, comments: 29 },
  { id: "s3", category: "news",    title: "Crypto Market Structure Changes After ETF Approval", author: "MarketOracle",   timeAgo: "Apr 18", likes: 302, comments: 65 },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: PostCategory }) {
  const { emoji, label } = CATEGORY_META[category];
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border-subtle bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-text-secondary">
      {emoji} {label}
    </span>
  );
}

function PostCard({ post }: { post: MyPost }) {
  return (
    <article className="group flex flex-col gap-2 rounded-xl border border-border-subtle bg-surface-1 p-4 transition-colors hover:border-primary/30 hover:bg-surface-2/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="mb-1.5 flex items-center gap-2 flex-wrap">
            <CategoryBadge category={post.category} />
            {post.tickers.map((t) => (
              <span key={t} className="text-[10px] font-mono text-primary">#{t}</span>
            ))}
          </div>
          <h3 className="text-[14px] font-semibold text-text-primary leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="mt-1 text-[12px] text-text-secondary line-clamp-2 leading-relaxed">
            {post.preview}
          </p>
        </div>
        <Link href="/community" className="flex-shrink-0 flex items-center gap-0.5 text-[11px] text-text-tertiary hover:text-primary transition-colors mt-0.5">
          <ArrowUpRight size={13} />
        </Link>
      </div>
      <div className="flex items-center gap-4 pt-1 border-t border-border-subtle/50">
        <span className="text-[11px] text-text-disabled">{post.timeAgo}</span>
        <div className="flex items-center gap-3 ml-auto">
          <span className="flex items-center gap-1 text-[11px] text-text-tertiary"><ThumbsUp size={11} />{post.likes}</span>
          <span className="flex items-center gap-1 text-[11px] text-text-tertiary"><MessageCircle size={11} />{post.comments}</span>
          <span className="flex items-center gap-1 text-[11px] text-text-tertiary"><Bookmark size={11} />{post.scraps}</span>
        </div>
      </div>
    </article>
  );
}

function CommentCard({ comment }: { comment: MyComment }) {
  return (
    <article className="rounded-xl border border-border-subtle bg-surface-1 p-4 transition-colors hover:bg-surface-2/30">
      <p className="mb-2 text-[11px] font-medium text-text-disabled line-clamp-1">
        in: <span className="text-primary/80">"{comment.postTitle}"</span>
      </p>
      <p className="text-[13px] text-text-secondary leading-relaxed">{comment.content}</p>
      <div className="mt-2.5 flex items-center gap-3 border-t border-border-subtle/50 pt-2">
        <span className="text-[11px] text-text-disabled">{comment.timeAgo}</span>
        <span className="flex items-center gap-1 text-[11px] text-text-tertiary ml-auto"><ThumbsUp size={11} />{comment.likes}</span>
      </div>
    </article>
  );
}

function SavedCard({ post }: { post: SavedPost }) {
  return (
    <article className="group flex items-start gap-3 rounded-xl border border-border-subtle bg-surface-1 p-4 transition-colors hover:border-primary/30 hover:bg-surface-2/30">
      <div className="flex-1 min-w-0">
        <div className="mb-1.5 flex items-center gap-2">
          <CategoryBadge category={post.category} />
        </div>
        <h3 className="text-[14px] font-semibold text-text-primary leading-snug line-clamp-1 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="mt-1 text-[11px] text-text-disabled">by {post.author} · {post.timeAgo}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className="flex items-center gap-1 text-[11px] text-text-tertiary"><ThumbsUp size={11} />{post.likes}</span>
        <span className="flex items-center gap-1 text-[11px] text-text-tertiary"><MessageCircle size={11} />{post.comments}</span>
      </div>
    </article>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: ActivityTab }) {
  const config = {
    posts:    { icon: MessageSquare, message: "No posts yet.", action: "Write your first post", href: "/community" },
    comments: { icon: MessageCircle, message: "No comments yet.", action: "Browse the community", href: "/community" },
    saved:    { icon: Bookmark,      message: "No saved posts.", action: "See popular posts", href: "/community" },
  }[tab];
  const Icon = config.icon;
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2">
        <Icon size={20} className="text-text-disabled" />
      </div>
      <p className="text-[13px] text-text-secondary">{config.message}</p>
      <Link
        href={config.href}
        className="flex items-center gap-1.5 rounded-lg border border-primary/40 px-4 py-2 text-[12px] font-semibold text-primary transition-colors hover:bg-primary/10"
      >
        {config.action} <ArrowUpRight size={13} />
      </Link>
    </div>
  );
}

// ─── ActivityPage ─────────────────────────────────────────────────────────────

export function ActivityPage() {
  const [tab, setTab] = useState<ActivityTab>("posts");

  const counts: Record<ActivityTab, number> = {
    posts:    MOCK_POSTS.length,
    comments: MOCK_COMMENTS.length,
    saved:    MOCK_SAVED.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Activity</h1>
        <p className="mt-1 text-[13px] text-text-secondary">Your activity history in the community</p>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 rounded-xl border border-border-subtle bg-surface-2 p-1" role="tablist">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`
              flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold transition-all
              ${tab === key
                ? "bg-surface-1 text-text-primary shadow-sm"
                : "text-text-tertiary hover:text-text-secondary"}
            `}
          >
            <Icon size={14} />
            {label}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === key ? "bg-primary/15 text-primary" : "bg-surface-3 text-text-disabled"}`}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-3" role="tabpanel">
        {tab === "posts" && (
          MOCK_POSTS.length === 0
            ? <EmptyState tab="posts" />
            : MOCK_POSTS.map((p) => <PostCard key={p.id} post={p} />)
        )}
        {tab === "comments" && (
          MOCK_COMMENTS.length === 0
            ? <EmptyState tab="comments" />
            : MOCK_COMMENTS.map((c) => <CommentCard key={c.id} comment={c} />)
        )}
        {tab === "saved" && (
          MOCK_SAVED.length === 0
            ? <EmptyState tab="saved" />
            : MOCK_SAVED.map((s) => <SavedCard key={s.id} post={s} />)
        )}
      </div>
    </div>
  );
}
