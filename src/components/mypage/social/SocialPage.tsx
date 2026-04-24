"use client";

import { useState } from "react";
import { Users, UserCheck, UserPlus, Trophy } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SocialTab = "followers" | "following";

interface SocialUser {
  id: string;
  nickname: string;
  level: number;
  xp: number;
  posts: number;
  winRate30d?: number;
  volumeRange: string;
  isReferral: boolean;
  isFollowing: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getLevelStyle(level: number) {
  if (level >= 91) return { color: "#fbbf24", label: "Legend" };
  if (level >= 61) return { color: "#c084fc", label: "Elite" };
  if (level >= 31) return { color: "#60a5fa", label: "Pro" };
  if (level >= 11) return { color: "#CAFF5D", label: "Expert" };
  return { color: "#737373", label: "Trader" };
}

function Avatar({ nickname, level, size = 40 }: { nickname: string; level: number; size?: number }) {
  const { color } = getLevelStyle(level);
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center rounded-full font-bold text-sm"
      style={{
        width: size, height: size,
        background: `${color}20`,
        color,
        border: `2px solid ${color}50`,
        fontSize: size * 0.38,
      }}
    >
      {nickname.charAt(0).toUpperCase()}
    </div>
  );
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_FOLLOWERS: SocialUser[] = [
  { id: "f1", nickname: "CryptoWhale88", level: 72, xp: 18400, posts: 41, winRate30d: 61.2, volumeRange: "$1M–$5M", isReferral: false, isFollowing: true },
  { id: "f2", nickname: "BTCmaxi",        level: 91, xp: 42000, posts: 128, winRate30d: 68.4, volumeRange: "$5M+",      isReferral: false, isFollowing: false },
  { id: "f3", nickname: "TradeGuru_KR",  level: 33, xp: 4100,  posts: 17, winRate30d: 52.1, volumeRange: "$10K–$50K", isReferral: true,  isFollowing: true },
  { id: "f4", nickname: "SolanaKing",    level: 45, xp: 7200,  posts: 9,  volumeRange: "$100K–$500K", isReferral: true, isFollowing: false },
];

const MOCK_FOLLOWING: SocialUser[] = [
  { id: "g1", nickname: "CryptoWhale88", level: 72, xp: 18400, posts: 41, winRate30d: 61.2, volumeRange: "$1M–$5M", isReferral: false, isFollowing: true },
  { id: "g2", nickname: "TradeGuru_KR",  level: 33, xp: 4100,  posts: 17, winRate30d: 52.1, volumeRange: "$10K–$50K", isReferral: true, isFollowing: true },
  { id: "g3", nickname: "MarketOracle",  level: 55, xp: 9800,  posts: 64, winRate30d: 58.7, volumeRange: "$500K–$1M", isReferral: false, isFollowing: true },
];

// ─── UserCard ─────────────────────────────────────────────────────────────────

function UserCard({ user, showUnfollow }: { user: SocialUser; showUnfollow: boolean }) {
  const [following, setFollowing] = useState(user.isFollowing);
  const { color, label } = getLevelStyle(user.level);

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border-subtle bg-surface-1 p-4 transition-colors hover:bg-surface-2/30">
      <Avatar nickname={user.nickname} level={user.level} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[14px] font-semibold text-text-primary truncate">{user.nickname}</span>
          {user.isReferral && (
            <span className="inline-flex items-center rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold text-primary">
              REF
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
          >
            Lv.{user.level} {label}
          </span>
          <span className="text-[11px] text-text-disabled">{user.volumeRange}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-3">
          <span className="text-[11px] text-text-tertiary">
            <span className="font-semibold text-text-secondary">{user.posts}</span> posts
          </span>
          {user.winRate30d != null && (
            <span className="flex items-center gap-1 text-[11px] text-text-tertiary">
              <Trophy size={10} className="text-primary" />
              <span className="font-semibold text-text-secondary">{user.winRate30d.toFixed(1)}%</span> win rate
            </span>
          )}
          <span className="text-[11px] text-text-disabled font-mono">
            {(user.xp / 1000).toFixed(1)}k XP
          </span>
        </div>
      </div>

      <button
        onClick={() => setFollowing((v) => !v)}
        aria-label={following ? `Unfollow ${user.nickname}` : `Follow ${user.nickname}`}
        className={`
          flex-shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold transition-all
          ${following
            ? "border border-border-subtle bg-surface-2 text-text-secondary hover:border-negative/40 hover:text-negative"
            : "bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25"}
        `}
      >
        {following ? <UserCheck size={13} /> : <UserPlus size={13} />}
        {following ? (showUnfollow ? "Unfollow" : "Following") : "Follow"}
      </button>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: SocialTab }) {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2">
        <Users size={20} className="text-text-disabled" />
      </div>
      <p className="text-[13px] text-text-secondary">
        {tab === "followers" ? "아직 팔로워가 없습니다." : "팔로잉하는 트레이더가 없습니다."}
      </p>
      <p className="text-[12px] text-text-disabled">
        {tab === "followers"
          ? "커뮤니티에 글을 작성해보세요."
          : "우수한 트레이더를 팔로우하고 인사이트를 얻으세요."}
      </p>
    </div>
  );
}

// ─── SocialPage ───────────────────────────────────────────────────────────────

export function SocialPage() {
  const [tab, setTab] = useState<SocialTab>("followers");

  const list = tab === "followers" ? MOCK_FOLLOWERS : MOCK_FOLLOWING;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Social</h1>
        <p className="mt-1 text-[13px] text-text-secondary">팔로워 및 팔로잉 트레이더 관리</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Followers", value: MOCK_FOLLOWERS.length, icon: Users },
          { label: "Following", value: MOCK_FOLLOWING.length, icon: UserCheck },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-1 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2">
              <Icon size={15} className="text-primary" />
            </div>
            <div>
              <p className="text-[20px] font-bold text-text-primary font-mono">{value}</p>
              <p className="text-[11px] text-text-disabled">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-xl border border-border-subtle bg-surface-2 p-1" role="tablist">
        {(["followers", "following"] as SocialTab[]).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`
              flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-[12px] font-semibold capitalize transition-all
              ${tab === t
                ? "bg-surface-1 text-text-primary shadow-sm"
                : "text-text-tertiary hover:text-text-secondary"}
            `}
          >
            {t}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === t ? "bg-primary/15 text-primary" : "bg-surface-3 text-text-disabled"}`}>
              {t === "followers" ? MOCK_FOLLOWERS.length : MOCK_FOLLOWING.length}
            </span>
          </button>
        ))}
      </div>

      {/* User list */}
      <div className="space-y-2" role="tabpanel">
        {list.length === 0
          ? <EmptyState tab={tab} />
          : list.map((u) => (
            <UserCard key={u.id} user={u} showUnfollow={tab === "following"} />
          ))
        }
      </div>
    </div>
  );
}
