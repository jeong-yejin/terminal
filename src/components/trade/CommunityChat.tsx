"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { Send, Flag, Heart, ChevronDown, X, AlertCircle, Trophy, Medal } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Channel  = "global" | "korean";
type MainView = "chat" | "leaderboard";
type LbPeriod = "all" | "weekly" | "monthly";

const EMOJI_REACTIONS = [
  { key: "🚀", label: "Bullish" },
  { key: "🐻", label: "Bearish" },
  { key: "🔥", label: "Hot" },
  { key: "💎", label: "Diamond" },
  { key: "👀", label: "Watch" },
  { key: "😂", label: "Lol" },
] as const;

type EmojiKey = (typeof EMOJI_REACTIONS)[number]["key"];

export type SharedPosition = {
  symbol: string;
  side: "Long" | "Short";
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
  unrealizedPct: number;
};

type ChatMessage = {
  id: string;
  userId: string;
  nickname: string;
  level: number;
  isReferral: boolean;
  content: string;
  timestamp: Date;
  reactions: Partial<Record<EmojiKey, string[]>>;
  likes: string[];
  positionCard?: SharedPosition;
  type: "text" | "position";
  channel: Channel;
};

type UserProfile = {
  id: string;
  nickname: string;
  level: number;
  isReferral: boolean;
  joinDate: string;
  lastActive: string;
  volumeRange: string;
  xp: number;
};

type LeaderboardEntry = {
  rank: number;
  userId: string;
  nickname: string;
  level: number;
  isReferral: boolean;
  xp: number;
  volumeRange: string;
  winRate: number;
  weeklyPnl: number;
  monthlyPnl: number;
  allTimePnl: number;
  trades: number;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const MY_USER_ID           = "me";
const MY_NICKNAME          = "You";
const MY_LEVEL             = 15;
const IS_NEW_USER          = false;
const HIGHLIGHT_THRESHOLD  = 10;
const MAX_CHARS            = 280;
const RATE_LIMIT_PER_MIN   = 100;
const NEW_USER_RATE_LIMIT  = 10;
const SPAM_WINDOW_MS       = 5000;
const SPAM_MAX_REPEAT      = 3;
const COOLDOWN_MS          = 30000;

const REPORT_CATEGORIES = ["스팸", "허위 정보", "기타"] as const;
type ReportCategory = (typeof REPORT_CATEGORIES)[number];

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PROFILES: Record<string, UserProfile> = {
  u1: { id: "u1", nickname: "CryptoWhale88", level: 72, isReferral: false, joinDate: "2024-01-15", lastActive: "2026-04-21", volumeRange: "$1M–$5M",    xp: 18400 },
  u2: { id: "u2", nickname: "SolanaKing",    level: 45, isReferral: true,  joinDate: "2024-06-03", lastActive: "2026-04-21", volumeRange: "$100K–$500K", xp: 7200  },
  u3: { id: "u3", nickname: "BTCmaxi",       level: 91, isReferral: false, joinDate: "2023-03-22", lastActive: "2026-04-21", volumeRange: "$5M+",        xp: 42000 },
  u4: { id: "u4", nickname: "TradeGuru_KR",  level: 33, isReferral: true,  joinDate: "2025-02-10", lastActive: "2026-04-20", volumeRange: "$50K–$100K",  xp: 3800  },
  u5: { id: "u5", nickname: "DiaHands",      level: 8,  isReferral: false, joinDate: "2026-03-01", lastActive: "2026-04-21", volumeRange: "$1K–$10K",    xp: 420   },
  me: { id: "me", nickname: "You",           level: MY_LEVEL, isReferral: false, joinDate: "2026-04-01", lastActive: "2026-04-21", volumeRange: "$10K–$50K", xp: 1240 },
};

const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { rank: 1, userId: "u3", nickname: "BTCmaxi",       level: 91, isReferral: false, xp: 42000, volumeRange: "$5M+",        winRate: 68.4, weeklyPnl: 24.8,  monthlyPnl: 87.3,  allTimePnl: 412.7, trades: 1840 },
  { rank: 2, userId: "u1", nickname: "CryptoWhale88", level: 72, isReferral: false, xp: 18400, volumeRange: "$1M–$5M",    winRate: 61.2, weeklyPnl: 18.3,  monthlyPnl: 54.1,  allTimePnl: 231.4, trades: 976  },
  { rank: 3, userId: "u2", nickname: "SolanaKing",    level: 45, isReferral: true,  xp: 7200,  volumeRange: "$100K–$500K",winRate: 55.8, weeklyPnl: 12.1,  monthlyPnl: 31.7,  allTimePnl: 148.9, trades: 542  },
  { rank: 4, userId: "u4", nickname: "TradeGuru_KR",  level: 33, isReferral: true,  xp: 3800,  volumeRange: "$50K–$100K", winRate: 52.3, weeklyPnl:  9.4,  monthlyPnl: 22.8,  allTimePnl:  88.2, trades: 318  },
  { rank: 5, userId: "lb5", nickname: "VolatilityKing",level:28, isReferral: false, xp: 2900,  volumeRange: "$50K–$100K", winRate: 49.1, weeklyPnl:  7.2,  monthlyPnl: 18.1,  allTimePnl:  61.3, trades: 284  },
  { rank: 6, userId: "lb6", nickname: "MoonMission",  level: 21, isReferral: true,  xp: 2100,  volumeRange: "$10K–$50K",  winRate: 47.8, weeklyPnl:  5.8,  monthlyPnl: 14.5,  allTimePnl:  43.7, trades: 201  },
  { rank: 7, userId: "lb7", nickname: "EthMaximalist",level: 19, isReferral: false, xp: 1750,  volumeRange: "$10K–$50K",  winRate: 46.3, weeklyPnl:  4.1,  monthlyPnl: 11.2,  allTimePnl:  31.9, trades: 167  },
  { rank: 8, userId: "me",  nickname: "You",          level: 15, isReferral: false, xp: 1240,  volumeRange: "$10K–$50K",  winRate: 44.7, weeklyPnl:  3.3,  monthlyPnl:  8.6,  allTimePnl:  22.1, trades: 124  },
  { rank: 9, userId: "u5",  nickname: "DiaHands",     level:  8, isReferral: false, xp: 420,   volumeRange: "$1K–$10K",   winRate: 41.2, weeklyPnl:  1.9,  monthlyPnl:  4.2,  allTimePnl:   9.8, trades:  58  },
  { rank:10, userId: "lb10",nickname: "NewbieTrader", level:  3, isReferral: true,  xp: 180,   volumeRange: "$1K–$10K",   winRate: 38.9, weeklyPnl:  0.8,  monthlyPnl:  1.7,  allTimePnl:   3.2, trades:  22  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "m1", userId: "u3", nickname: "BTCmaxi",      level: 91, isReferral: false, content: "BTC holding 94k support nicely. Bulls in control", timestamp: new Date(Date.now() - 8*60000), reactions: { "🚀": ["u1","u2"] }, likes: ["u1","u4","u5"], type: "text", channel: "global" },
  { id: "m2", userId: "u1", nickname: "CryptoWhale88",level: 72, isReferral: false, content: "솔라나 120까지 빠질 수도 있음. 조심하세요",           timestamp: new Date(Date.now() - 7*60000), reactions: { "🐻": ["u3"] },       likes: [],              type: "text", channel: "korean" },
  { id: "m3", userId: "u2", nickname: "SolanaKing",   level: 45, isReferral: true,  content: "ETH breakout incoming. Load the bags.",              timestamp: new Date(Date.now() - 5*60000), reactions: { "💎": ["u1","u3","u4"]}, likes: ["u1"],          type: "text", channel: "global" },
  { id: "m4", userId: "u2", nickname: "SolanaKing",   level: 45, isReferral: true,  content: "",                                                   timestamp: new Date(Date.now() - 3*60000), reactions: { "🚀": ["u1","u3"], "💎": ["u4"] }, likes: ["u1","u3","u5"], type: "position", channel: "global", positionCard: { symbol: "ETHUSD", side: "Long", leverage: 10, entryPrice: 3200, currentPrice: 3350, unrealizedPnl: 468.75, unrealizedPct: 4.69 } },
  { id: "m5", userId: "u4", nickname: "TradeGuru_KR", level: 33, isReferral: true,  content: "비트 95k 돌파하면 10만달러 간다고 봅니다",             timestamp: new Date(Date.now() - 2*60000), reactions: {},                   likes: [],              type: "text", channel: "korean" },
  { id: "m6", userId: "u5", nickname: "DiaHands",     level:  8, isReferral: false, content: "Just entered my first BTC position! Excited",        timestamp: new Date(Date.now() -   60000), reactions: { "👀": ["u1"] },      likes: ["u2"],          type: "text", channel: "global" },
];

const MOCK_INCOMING = [
  { userId: "u1", nickname: "CryptoWhale88", level: 72, isReferral: false, content: "Watching BTC closely at 94k resistance", channel: "global" as Channel },
  { userId: "u4", nickname: "TradeGuru_KR",  level: 33, isReferral: true,  content: "ETH 3400 지지 확인. 롱 들어갑니다",        channel: "korean" as Channel },
  { userId: "u3", nickname: "BTCmaxi",       level: 91, isReferral: false, content: "Volume picking up. This is it!",           channel: "global" as Channel },
  { userId: "u5", nickname: "DiaHands",      level:  8, isReferral: false, content: "새벽에 무슨 급등이에요",                     channel: "korean" as Channel },
  { userId: "u2", nickname: "SolanaKing",    level: 45, isReferral: true,  content: "SOL looking strong above 160",             channel: "global" as Channel },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLevelStyle(level: number) {
  if (level >= 91) return { text: "text-amber-400",   glow: true,  bg: "bg-amber-400",   ring: "ring-amber-400/40" };
  if (level >= 61) return { text: "text-purple-400",  glow: false, bg: "bg-purple-400",  ring: "ring-purple-400/30" };
  if (level >= 31) return { text: "text-blue-400",    glow: false, bg: "bg-blue-400",    ring: "ring-blue-400/30" };
  if (level >= 11) return { text: "text-positive",    glow: false, bg: "bg-positive",    ring: "ring-positive/30" };
  return                  { text: "text-text-disabled",glow: false, bg: "bg-text-disabled",ring: "ring-transparent" };
}

function LevelBadge({ level, isReferral }: { level: number; isReferral: boolean }) {
  const { text, glow } = getLevelStyle(level);
  return (
    <span className="flex items-center gap-0.5">
      <span className={`text-[10px] font-bold leading-none ${text} ${glow ? "drop-shadow-[0_0_5px_rgba(251,191,36,0.9)]" : ""}`}>
        Lv.{level}
      </span>
      {isReferral && (
        <span className="ml-0.5 rounded bg-primary/20 px-0.5 text-[9px] font-bold text-primary">R</span>
      )}
    </span>
  );
}

function fmtTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function fmtNum(n: number, dec = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

// ─── Profile Popup ────────────────────────────────────────────────────────────

function ProfilePopup({ profile, onClose }: { profile: UserProfile; onClose: () => void }) {
  const { text, glow, bg } = getLevelStyle(profile.level);
  const xpInLevel = profile.xp % 1000;
  return (
    <div className="absolute inset-0 z-50 flex flex-col border-l border-border-subtle bg-surface-2 shadow-2xl">
      <div className="flex shrink-0 items-center justify-between border-b border-border-subtle px-4 py-3">
        <span className="text-[12px] font-semibold text-text-primary">Profile</span>
        <button onClick={onClose} className="text-text-disabled hover:text-text-secondary"><X size={14} /></button>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-3 text-[20px] font-bold text-text-secondary ring-2 ring-border-subtle">
            {profile.nickname[0].toUpperCase()}
          </div>
          <div>
            <div className="text-[13px] font-semibold text-text-primary">{profile.nickname}</div>
            <LevelBadge level={profile.level} isReferral={profile.isReferral} />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-[10px]">
            <span className="text-text-disabled">XP Progress</span>
            <span className={`font-mono font-bold ${text} ${glow ? "drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]" : ""}`}>
              {profile.xp.toLocaleString()} XP
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
            <div className={`h-full rounded-full ${bg} transition-all`} style={{ width: `${Math.min(xpInLevel / 10, 100)}%` }} />
          </div>
          <div className="mt-0.5 text-right text-[10px] text-text-disabled">{xpInLevel}/1000 to next level</div>
        </div>
        <div className="flex flex-col gap-2.5">
          {[
            { label: "Joined",      value: profile.joinDate },
            { label: "Last Active", value: profile.lastActive },
            { label: "Volume",      value: profile.volumeRange },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-[11px]">
              <span className="text-text-disabled">{label}</span>
              <span className="text-text-secondary">{value}</span>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border-subtle/50 bg-surface-3 p-3 text-[10px] leading-relaxed text-text-disabled">
          📊 Position & P&L stats are opt-in — available in Phase 2
        </div>
      </div>
    </div>
  );
}

// ─── Position Card ────────────────────────────────────────────────────────────

function PositionCardDisplay({ card }: { card: SharedPosition }) {
  const isLong = card.side === "Long";
  const pnlPos = card.unrealizedPnl >= 0;
  return (
    <div className="mt-1.5 overflow-hidden rounded-lg border border-border-subtle bg-surface-3">
      <div className={`h-0.5 w-full ${isLong ? "bg-positive" : "bg-negative"}`} />
      <div className="p-2.5 text-[11px]">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-bold text-text-primary">{card.symbol}</span>
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${isLong ? "bg-positive/15 text-positive" : "bg-negative/15 text-negative"}`}>
            {card.side} {card.leverage}x
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span className="text-text-disabled">Entry</span>
          <span className="text-right font-mono text-text-secondary">{fmtNum(card.entryPrice)}</span>
          <span className="text-text-disabled">Mark</span>
          <span className="text-right font-mono text-text-secondary">{fmtNum(card.currentPrice)}</span>
          <span className="text-text-disabled">PnL</span>
          <span className={`text-right font-mono font-bold ${pnlPos ? "text-positive" : "text-negative"}`}>
            {pnlPos ? "+" : ""}{fmtNum(card.unrealizedPnl)} ({pnlPos ? "+" : ""}{card.unrealizedPct.toFixed(2)}%)
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Report Modal ─────────────────────────────────────────────────────────────

function ReportModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<ReportCategory | null>(null);
  const [other, setOther]       = useState("");
  const [done, setDone]         = useState(false);

  const submit = () => { if (!selected) return; setDone(true); setTimeout(onClose, 2500); };

  if (done) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border-subtle bg-surface-2 px-6 py-5 text-center shadow-2xl">
          <AlertCircle size={20} className="text-primary" />
          <p className="text-[12px] leading-relaxed text-text-secondary">
            신고가 접수되었습니다.<br />
            <span className="text-text-disabled">누적 신고 시 활동이 제한될 수 있습니다.</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div className="w-56 rounded-xl border border-border-subtle bg-surface-2 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <span className="text-[12px] font-semibold text-text-primary">신고</span>
          <button onClick={onClose} className="text-text-disabled hover:text-text-secondary"><X size={14} /></button>
        </div>
        <div className="flex flex-col gap-1 p-3">
          {REPORT_CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setSelected(cat)}
              className={`rounded-lg px-3 py-2 text-left text-[12px] transition-colors ${selected === cat ? "bg-primary/20 text-primary" : "text-text-secondary hover:bg-surface-3"}`}
            >{cat}</button>
          ))}
          {selected === "기타" && (
            <textarea className="mt-1 h-16 w-full resize-none rounded-lg bg-surface-3 px-2.5 py-2 text-[11px] text-text-primary placeholder:text-text-disabled focus:outline-none"
              placeholder="사유를 입력하세요..." value={other} onChange={(e) => setOther(e.target.value)} />
          )}
          <button onClick={submit} disabled={!selected}
            className="mt-1 rounded-lg bg-primary py-1.5 text-[12px] font-semibold text-black transition-opacity disabled:opacity-40">
            신고하기
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Message Item ─────────────────────────────────────────────────────────────

function MessageItem({ msg, myUserId, onReact, onLike, onReport, onProfileClick }: {
  msg: ChatMessage;
  myUserId: string;
  onReact: (msgId: string, emoji: EmojiKey) => void;
  onLike: (msgId: string) => void;
  onReport: (msgId: string) => void;
  onProfileClick: (userId: string) => void;
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hoveredEmoji, setHoveredEmoji]       = useState<EmojiKey | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const isHighlighted = msg.likes.length >= HIGHLIGHT_THRESHOLD;
  const iLiked        = msg.likes.includes(myUserId);
  const { text: levelText, glow } = getLevelStyle(msg.level);

  useEffect(() => {
    if (!showEmojiPicker) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setShowEmojiPicker(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmojiPicker]);

  const reactionsEntries = Object.entries(msg.reactions) as [EmojiKey, string[]][];

  return (
    <div className={`group relative px-3 py-1.5 transition-colors hover:bg-surface-2/50 ${isHighlighted ? "border-l-2 border-primary bg-primary/5" : ""}`}>
      <div className="flex items-center gap-1.5">
        <button onClick={() => onProfileClick(msg.userId)}
          className={`text-[11px] font-semibold hover:underline ${levelText} ${glow ? "drop-shadow-[0_0_5px_rgba(251,191,36,0.9)]" : ""}`}>
          {msg.nickname}
        </button>
        <LevelBadge level={msg.level} isReferral={msg.isReferral} />
        <span className="ml-auto shrink-0 text-[10px] text-text-disabled">{fmtTime(msg.timestamp)}</span>
      </div>

      {msg.type === "text" && msg.content && (
        <p className="mt-0.5 break-words text-[12px] leading-relaxed text-text-secondary">{msg.content}</p>
      )}
      {msg.type === "position" && msg.positionCard && <PositionCardDisplay card={msg.positionCard} />}

      {(reactionsEntries.some(([, u]) => u.length > 0) || msg.likes.length > 0) && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1">
          {reactionsEntries.map(([emoji, users]) => {
            if (!users.length) return null;
            const iReacted = users.includes(myUserId);
            return (
              <div key={emoji} className="relative">
                <button onClick={() => onReact(msg.id, emoji)}
                  onMouseEnter={() => setHoveredEmoji(emoji)} onMouseLeave={() => setHoveredEmoji(null)}
                  className={`flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[11px] transition-colors ${iReacted ? "border-primary/50 bg-primary/10 text-primary" : "border-border-subtle bg-surface-2 text-text-secondary hover:border-primary/30"}`}>
                  {emoji}<span className="text-[10px] tabular-nums">{users.length}</span>
                </button>
                {hoveredEmoji === emoji && (
                  <div className="absolute bottom-full left-0 z-30 mb-1 whitespace-nowrap rounded-lg border border-border-subtle bg-surface-3 px-2 py-1 text-[10px] text-text-secondary shadow-xl">
                    {users.map(id => MOCK_PROFILES[id]?.nickname ?? id).join(", ")}
                  </div>
                )}
              </div>
            );
          })}
          {msg.likes.length > 0 && (
            <button onClick={() => onLike(msg.id)}
              className={`flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[11px] transition-colors ${iLiked ? "border-red-500/50 bg-red-500/10 text-red-400" : "border-border-subtle bg-surface-2 text-text-disabled hover:text-red-400"}`}>
              ❤<span className="text-[10px] tabular-nums">{msg.likes.length}</span>
            </button>
          )}
        </div>
      )}

      {/* Hover actions */}
      <div className="absolute right-2 top-1 hidden items-center gap-0.5 rounded-lg border border-border-subtle bg-surface-2 px-0.5 py-0.5 shadow-lg group-hover:flex">
        <div className="relative" ref={pickerRef}>
          <button onClick={() => setShowEmojiPicker((v) => !v)}
            className="rounded p-1 text-[12px] text-text-disabled hover:bg-surface-3 hover:text-text-secondary">😊</button>
          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 z-40 mb-1 flex gap-0.5 rounded-lg border border-border-subtle bg-surface-2 p-1.5 shadow-2xl">
              {EMOJI_REACTIONS.map(({ key, label }) => (
                <button key={key} onClick={() => { onReact(msg.id, key); setShowEmojiPicker(false); }} title={label}
                  className="rounded p-1 text-[15px] transition-colors hover:bg-surface-3">{key}</button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => onLike(msg.id)} title="Like"
          className={`rounded p-1 transition-colors ${iLiked ? "text-red-400" : "text-text-disabled hover:bg-surface-3 hover:text-red-400"}`}>
          <Heart size={11} />
        </button>
        {msg.userId !== myUserId && (
          <button onClick={() => onReport(msg.id)} title="Report"
            className="rounded p-1 text-text-disabled transition-colors hover:bg-surface-3 hover:text-cautionary">
            <Flag size={11} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

const RANK_ICONS: Record<number, ReactNode> = {
  1: <Trophy size={13} className="text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]" />,
  2: <Medal  size={13} className="text-slate-300" />,
  3: <Medal  size={13} className="text-amber-600" />,
};

function LeaderboardView({ onProfileClick }: { onProfileClick: (userId: string) => void }) {
  const [period, setPeriod] = useState<LbPeriod>("weekly");

  const pnlKey: Record<LbPeriod, keyof LeaderboardEntry> = {
    all: "allTimePnl", weekly: "weeklyPnl", monthly: "monthlyPnl",
  };

  const sorted = [...LEADERBOARD_DATA].sort((a, b) => {
    const ka = pnlKey[period];
    return (b[ka] as number) - (a[ka] as number);
  }).map((e, i) => ({ ...e, rank: i + 1 }));

  const myEntry = sorted.find(e => e.userId === MY_USER_ID);

  return (
    <div className="flex h-full flex-col">
      {/* Period tabs */}
      <div className="flex shrink-0 items-center gap-1 border-b border-border-subtle px-3 py-2">
        {(["weekly", "monthly", "all"] as LbPeriod[]).map((p) => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`rounded-md px-2.5 py-1 text-[10px] font-medium transition-colors ${period === p ? "bg-surface-3 text-text-primary" : "text-text-disabled hover:text-text-secondary"}`}>
            {p === "all" ? "All Time" : p === "weekly" ? "Weekly" : "Monthly"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {sorted.map((entry) => {
          const pnl     = entry[pnlKey[period]] as number;
          const isMe    = entry.userId === MY_USER_ID;
          const { text: lvText, glow } = getLevelStyle(entry.level);

          return (
            <div key={entry.userId}
              className={`flex items-center gap-2 px-3 py-2 transition-colors hover:bg-surface-2/60 ${isMe ? "border-l-2 border-primary bg-primary/5" : "border-l-2 border-transparent"}`}>
              {/* Rank */}
              <div className="flex w-5 shrink-0 items-center justify-center">
                {RANK_ICONS[entry.rank] ?? (
                  <span className="text-[11px] font-bold text-text-disabled">{entry.rank}</span>
                )}
              </div>

              {/* Avatar */}
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-3 text-[11px] font-bold text-text-secondary ring-1 ${getLevelStyle(entry.level).ring}`}>
                {entry.nickname[0].toUpperCase()}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <button onClick={() => onProfileClick(entry.userId)}
                  className={`block truncate text-[11px] font-semibold hover:underline ${lvText} ${glow ? "drop-shadow-[0_0_5px_rgba(251,191,36,0.9)]" : ""}`}>
                  {entry.nickname}
                </button>
                <div className="flex items-center gap-1.5">
                  <LevelBadge level={entry.level} isReferral={entry.isReferral} />
                  <span className="text-[10px] text-text-disabled">·</span>
                  <span className="text-[10px] text-text-disabled">{entry.winRate}% WR</span>
                </div>
              </div>

              {/* PnL */}
              <div className="shrink-0 text-right">
                <div className={`text-[12px] font-bold tabular-nums ${pnl >= 0 ? "text-positive" : "text-negative"}`}>
                  {pnl >= 0 ? "+" : ""}{pnl.toFixed(1)}%
                </div>
                <div className="text-[10px] text-text-disabled">{entry.trades} trades</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* My ranking sticky footer */}
      {myEntry && (
        <div className="shrink-0 border-t border-border-subtle bg-surface-2 px-3 py-2">
          <div className="mb-1 text-[10px] text-text-disabled">Your ranking</div>
          <div className="flex items-center gap-2">
            <span className="w-5 text-center text-[11px] font-bold text-primary">#{myEntry.rank}</span>
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-3 text-[10px] font-bold text-text-secondary">
              Y
            </div>
            <div className="flex-1 text-[11px] text-text-primary">You</div>
            <div className="text-right">
              <span className={`text-[12px] font-bold tabular-nums ${(myEntry[pnlKey[period]] as number) >= 0 ? "text-positive" : "text-negative"}`}>
                {(myEntry[pnlKey[period]] as number) >= 0 ? "+" : ""}{(myEntry[pnlKey[period]] as number).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Community Chat ───────────────────────────────────────────────────────────

export function CommunityChat({
  positionShare,
  onClose,
}: {
  positionShare?: { pos: SharedPosition; rev: number } | null;
  onClose?: () => void;
}) {
  const [mainView, setMainView]             = useState<MainView>("chat");
  const [channel, setChannel]               = useState<Channel>("global");
  const [messages, setMessages]             = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput]                   = useState("");
  const [isAtBottom, setIsAtBottom]         = useState(true);
  const [newMsgCount, setNewMsgCount]       = useState(0);
  const [profileUserId, setProfileUserId]   = useState<string | null>(null);
  const [reportMsgId, setReportMsgId]       = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil]   = useState<number | null>(null);
  const [cooldownLeft, setCooldownLeft]     = useState(0);
  const [rateLimitHit, setRateLimitHit]     = useState(false);

  const listRef        = useRef<HTMLDivElement>(null);
  const recentMsgs     = useRef<number[]>([]);
  const recentContent  = useRef<{ content: string; time: number }[]>([]);
  const msgCounter     = useRef(200);
  const processedRevs  = useRef<Set<number>>(new Set());
  const prevCountRef   = useRef(0);

  const filteredMessages = messages.filter((m) => m.channel === channel);

  /* cooldown countdown */
  useEffect(() => {
    if (!cooldownUntil) return;
    const tick = setInterval(() => {
      const left = Math.ceil((cooldownUntil - Date.now()) / 1000);
      if (left <= 0) { setCooldownUntil(null); setCooldownLeft(0); }
      else setCooldownLeft(left);
    }, 500);
    return () => clearInterval(tick);
  }, [cooldownUntil]);

  /* mock WebSocket */
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      const mock = MOCK_INCOMING[i % MOCK_INCOMING.length];
      setMessages((prev) => [...prev, { id: `ws-${Date.now()}-${i}`, ...mock, timestamp: new Date(), reactions: {}, likes: [], type: "text" }]);
      i++;
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  /* scroll tracking */
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const handler = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
      setIsAtBottom(atBottom);
      if (atBottom) setNewMsgCount(0);
    };
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, []);

  /* auto-scroll / new-msg badge */
  useEffect(() => {
    if (filteredMessages.length === prevCountRef.current) return;
    prevCountRef.current = filteredMessages.length;
    const el = listRef.current;
    if (!el) return;
    if (isAtBottom) { el.scrollTop = el.scrollHeight; setNewMsgCount(0); }
    else setNewMsgCount((n) => n + 1);
  }, [filteredMessages.length, isAtBottom]);

  /* position card share */
  useEffect(() => {
    if (!positionShare || processedRevs.current.has(positionShare.rev)) return;
    processedRevs.current.add(positionShare.rev);
    setMessages((prev) => [...prev, {
      id: `pos-${Date.now()}`, userId: MY_USER_ID, nickname: MY_NICKNAME, level: MY_LEVEL,
      isReferral: false, content: "", timestamp: new Date(), reactions: {}, likes: [],
      type: "position", channel, positionCard: positionShare.pos,
    }]);
    if (mainView !== "chat") setMainView("chat");
  }, [positionShare, channel, mainView]);

  const scrollToBottom = () => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    setNewMsgCount(0);
  };

  const handleReact = useCallback((msgId: string, emoji: EmojiKey) => {
    setMessages((prev) => prev.map((m) => {
      if (m.id !== msgId) return m;
      const cur     = m.reactions[emoji] ?? [];
      const updated = cur.includes(MY_USER_ID) ? cur.filter((id) => id !== MY_USER_ID) : [...cur, MY_USER_ID];
      return { ...m, reactions: { ...m.reactions, [emoji]: updated } };
    }));
  }, []);

  const handleLike = useCallback((msgId: string) => {
    setMessages((prev) => prev.map((m) => {
      if (m.id !== msgId) return m;
      const liked = m.likes.includes(MY_USER_ID);
      return { ...m, likes: liked ? m.likes.filter((id) => id !== MY_USER_ID) : [...m.likes, MY_USER_ID] };
    }));
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || trimmed.length > MAX_CHARS) return;
    if (/https?:\/\/|www\./i.test(trimmed)) return;

    if (cooldownUntil && Date.now() < cooldownUntil) return;
    const now = Date.now();
    recentMsgs.current = recentMsgs.current.filter((t) => now - t < 60000);
    if (recentMsgs.current.length >= (IS_NEW_USER ? NEW_USER_RATE_LIMIT : RATE_LIMIT_PER_MIN)) {
      setRateLimitHit(true); setTimeout(() => setRateLimitHit(false), 3000); return;
    }
    const spamWindow = recentContent.current.filter((r) => now - r.time < SPAM_WINDOW_MS);
    if (spamWindow.filter((r) => r.content === trimmed).length >= SPAM_MAX_REPEAT - 1) {
      setCooldownUntil(Date.now() + COOLDOWN_MS); setCooldownLeft(30); return;
    }

    recentMsgs.current.push(now);
    recentContent.current = [...recentContent.current.slice(-20), { content: trimmed, time: now }];
    setMessages((prev) => [...prev, {
      id: `m-${++msgCounter.current}`, userId: MY_USER_ID, nickname: MY_NICKNAME, level: MY_LEVEL,
      isReferral: false, content: trimmed, timestamp: new Date(), reactions: {}, likes: [], type: "text", channel,
    }]);
    setInput("");
  };

  const charLeft  = MAX_CHARS - input.length;
  const isBlocked = (!!cooldownUntil && Date.now() < cooldownUntil) || rateLimitHit;
  const profile   = profileUserId ? (MOCK_PROFILES[profileUserId] ?? null) : null;

  return (
    <div className="relative flex h-full w-full flex-col bg-surface-1">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex h-10 shrink-0 items-center gap-0 border-b border-border-subtle px-2">
        {/* View tabs */}
        <div className="flex items-center gap-0.5 rounded-lg border border-border-subtle bg-surface-2 p-0.5">
          {(["chat", "leaderboard"] as MainView[]).map((v) => (
            <button key={v} onClick={() => setMainView(v)}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-medium transition-colors ${mainView === v ? "bg-surface-3 text-text-primary shadow-sm" : "text-text-disabled hover:text-text-secondary"}`}>
              {v === "chat" ? "Chat" : <><Trophy size={10} className="inline" /> Board</>}
            </button>
          ))}
        </div>

        {/* Channel tabs (chat only) */}
        {mainView === "chat" && (
          <div className="ml-1.5 flex items-center gap-0.5 rounded-lg border border-border-subtle bg-surface-2 p-0.5">
            {(["global", "korean"] as Channel[]).map((ch) => (
              <button key={ch} onClick={() => { setChannel(ch); setNewMsgCount(0); }}
                className={`rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors ${channel === ch ? "bg-surface-3 text-text-primary shadow-sm" : "text-text-disabled hover:text-text-secondary"}`}>
                #{ch === "global" ? "Global" : "KR"}
              </button>
            ))}
          </div>
        )}

        {/* Close */}
        {onClose && (
          <button onClick={onClose} title="Hide Community"
            className="ml-auto rounded p-1 text-text-disabled transition-colors hover:bg-surface-2 hover:text-text-secondary">
            <X size={13} />
          </button>
        )}
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      {mainView === "leaderboard" ? (
        <LeaderboardView onProfileClick={(id) => setProfileUserId(id)} />
      ) : (
        <>
          {/* Message list */}
          <div ref={listRef} className="relative min-h-0 flex-1 overflow-y-auto">
            {filteredMessages.length === 0 && (
              <div className="flex h-full items-center justify-center text-[12px] text-text-disabled">No messages yet.</div>
            )}
            {filteredMessages.map((msg) => (
              <MessageItem key={msg.id} msg={msg} myUserId={MY_USER_ID}
                onReact={handleReact} onLike={handleLike}
                onReport={(id) => setReportMsgId(id)}
                onProfileClick={(id) => setProfileUserId(id)} />
            ))}
            {!isAtBottom && newMsgCount > 0 && (
              <button onClick={scrollToBottom}
                className="sticky bottom-2 mx-auto flex w-fit items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-black shadow-lg">
                <ChevronDown size={12} />{newMsgCount} new
              </button>
            )}
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-border-subtle bg-surface-1 p-2">
            {isBlocked ? (
              <div className="rounded-lg bg-cautionary/10 px-3 py-2.5 text-center text-[11px] text-cautionary">
                {cooldownUntil && Date.now() < cooldownUntil ? `쿨다운 ${cooldownLeft}초 남음` : "메시지 제한. 잠시 후 다시 시도하세요."}
              </div>
            ) : (
              <>
                <div className="relative">
                  <textarea value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={`#${channel === "global" ? "global" : "한국어"} 에 입력...`}
                    maxLength={MAX_CHARS} rows={2}
                    className="w-full resize-none rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 pr-8 text-[12px] text-text-primary placeholder:text-text-disabled focus:border-primary/50 focus:outline-none" />
                  <button onClick={handleSend} disabled={!input.trim() || input.length > MAX_CHARS}
                    className="absolute bottom-2 right-2 rounded p-1 text-text-disabled transition-colors hover:text-primary disabled:opacity-30">
                    <Send size={12} />
                  </button>
                </div>
                <div className={`mt-1 text-right text-[10px] ${charLeft <= 30 ? "text-cautionary" : "text-text-disabled"}`}>{charLeft}</div>
              </>
            )}
          </div>
        </>
      )}

      {/* ── Profile overlay ─────────────────────────────────────── */}
      {profile && <ProfilePopup profile={profile} onClose={() => setProfileUserId(null)} />}

      {/* ── Report modal ─────────────────────────────────────────── */}
      {reportMsgId && <ReportModal onClose={() => setReportMsgId(null)} />}
    </div>
  );
}
