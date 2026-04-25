"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Flag, Heart, ChevronDown, X, AlertCircle } from "lucide-react";
import { MOCK_PROFILES } from "@/lib/mock-users";

// ─── Types ────────────────────────────────────────────────────────────────────

type Channel = "global" | "korean";

const EMOJI_REACTIONS = [
  { key: "🚀", label: "Bullish" },
  { key: "💀", label: "Bearish" },
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

const REPORT_CATEGORIES = ["Spam", "False Info", "Other"] as const;
type ReportCategory = (typeof REPORT_CATEGORIES)[number];


const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "m1", userId: "u3", nickname: "BTCmaxi",      level: 91, isReferral: false, content: "BTC holding 94k support nicely. Bulls in control", timestamp: new Date(Date.now() - 8*60000), reactions: { "🚀": ["u1","u2"] }, likes: ["u1","u4","u5"], type: "text", channel: "global" },
  { id: "m2", userId: "u1", nickname: "CryptoWhale88",level: 72, isReferral: false, content: "SOL could drop to 120. Be careful.",                 timestamp: new Date(Date.now() - 7*60000), reactions: { "💀": ["u3"] },       likes: [],              type: "text", channel: "korean" },
  { id: "m3", userId: "u2", nickname: "SolanaKing",   level: 45, isReferral: true,  content: "ETH breakout incoming. Load the bags.",              timestamp: new Date(Date.now() - 5*60000), reactions: { "💎": ["u1","u3","u4"]}, likes: ["u1"],          type: "text", channel: "global" },
  { id: "m4", userId: "u2", nickname: "SolanaKing",   level: 45, isReferral: true,  content: "",                                                   timestamp: new Date(Date.now() - 3*60000), reactions: { "🚀": ["u1","u3"], "💎": ["u4"] }, likes: ["u1","u3","u5"], type: "position", channel: "global", positionCard: { symbol: "ETHUSD", side: "Long", leverage: 10, entryPrice: 3200, currentPrice: 3350, unrealizedPnl: 468.75, unrealizedPct: 4.69 } },
  { id: "m5", userId: "u4", nickname: "TradeGuru_KR", level: 33, isReferral: true,  content: "If BTC breaks 95k I think we hit 100k.",             timestamp: new Date(Date.now() - 2*60000), reactions: {},                   likes: [],              type: "text", channel: "korean" },
  { id: "m6", userId: "u5", nickname: "DiaHands",     level:  8, isReferral: false, content: "Just entered my first BTC position! Excited",        timestamp: new Date(Date.now() -   60000), reactions: { "👀": ["u1"] },      likes: ["u2"],          type: "text", channel: "global" },
];

const MOCK_INCOMING = [
  { userId: "u1", nickname: "CryptoWhale88", level: 72, isReferral: false, content: "Watching BTC closely at 94k resistance", channel: "global" as Channel },
  { userId: "u4", nickname: "TradeGuru_KR",  level: 33, isReferral: true,  content: "ETH 3400 support confirmed. Going long.",  channel: "korean" as Channel },
  { userId: "u3", nickname: "BTCmaxi",       level: 91, isReferral: false, content: "Volume picking up. This is it!",           channel: "global" as Channel },
  { userId: "u5", nickname: "DiaHands",      level:  8, isReferral: false, content: "What is this pump in the middle of the night lol", channel: "korean" as Channel },
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
            Report submitted.<br />
            <span className="text-text-disabled">Repeated reports may restrict your activity.</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div className="w-56 rounded-xl border border-border-subtle bg-surface-2 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <span className="text-[12px] font-semibold text-text-primary">Report</span>
          <button onClick={onClose} className="text-text-disabled hover:text-text-secondary"><X size={14} /></button>
        </div>
        <div className="flex flex-col gap-1 p-3">
          {REPORT_CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setSelected(cat)}
              className={`rounded-lg px-3 py-2 text-left text-[12px] transition-colors ${selected === cat ? "bg-primary/20 text-primary" : "text-text-secondary hover:bg-surface-3"}`}
            >{cat}</button>
          ))}
          {selected === "Other" && (
            <textarea className="mt-1 h-16 w-full resize-none rounded-lg bg-surface-3 px-2.5 py-2 text-[11px] text-text-primary placeholder:text-text-disabled focus:outline-none"
              placeholder="Enter reason..." value={other} onChange={(e) => setOther(e.target.value)} />
          )}
          <button onClick={submit} disabled={!selected}
            className="mt-1 rounded-lg bg-primary py-1.5 text-[12px] font-semibold text-black transition-opacity disabled:opacity-40">
            Submit Report
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

// ─── Community Chat ───────────────────────────────────────────────────────────

export function CommunityChat({
  positionShare,
  onClose,
  onProfileClick,
}: {
  positionShare?: { pos: SharedPosition; rev: number } | null;
  onClose?: () => void;
  onProfileClick?: (userId: string) => void;
}) {
  const [channel, setChannel]               = useState<Channel>("global");
  const [messages, setMessages]             = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput]                   = useState("");
  const [isAtBottom, setIsAtBottom]         = useState(true);
  const [newMsgCount, setNewMsgCount]       = useState(0);
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
  }, [positionShare, channel]);

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

  return (
    <div className="relative flex h-full w-full flex-col bg-surface-1">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border-subtle px-2">
        {/* Channel tabs */}
        <div className="flex items-center gap-0.5 rounded-lg border border-border-subtle bg-surface-2 p-0.5">
          {(["global", "korean"] as Channel[]).map((ch) => (
            <button key={ch} onClick={() => { setChannel(ch); setNewMsgCount(0); }}
              className={`rounded-md px-2.5 py-1 text-[10px] font-medium transition-colors ${channel === ch ? "bg-surface-3 text-text-primary shadow-sm" : "text-text-disabled hover:text-text-secondary"}`}>
              #{ch === "global" ? "Global" : "KR"}
            </button>
          ))}
        </div>

        {/* Chat label */}
        <span className="flex-1 text-[11px] font-semibold text-text-secondary">Live Chat</span>

        {/* Close */}
        {onClose && (
          <button onClick={onClose} title="Hide Chat"
            className="rounded p-1 text-text-disabled transition-colors hover:bg-surface-2 hover:text-text-secondary">
            <X size={13} />
          </button>
        )}
      </div>

      {/* ── Message list ─────────────────────────────────────────── */}
      <div ref={listRef} className="relative min-h-0 flex-1 overflow-y-auto">
        {filteredMessages.length === 0 && (
          <div className="flex h-full items-center justify-center text-[12px] text-text-disabled">No messages yet.</div>
        )}
        {filteredMessages.map((msg) => (
          <MessageItem key={msg.id} msg={msg} myUserId={MY_USER_ID}
            onReact={handleReact} onLike={handleLike}
            onReport={(id) => setReportMsgId(id)}
            onProfileClick={(id) => onProfileClick?.(id)} />
        ))}
        {!isAtBottom && newMsgCount > 0 && (
          <button onClick={scrollToBottom}
            className="sticky bottom-2 mx-auto flex w-fit items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-black shadow-lg">
            <ChevronDown size={12} />{newMsgCount} new
          </button>
        )}
      </div>

      {/* ── Input ────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-border-subtle bg-surface-1 p-2">
        {isBlocked ? (
          <div className="rounded-lg bg-cautionary/10 px-3 py-2.5 text-center text-[11px] text-cautionary">
            {cooldownUntil && Date.now() < cooldownUntil ? `Cooldown: ${cooldownLeft}s remaining` : "Message limit reached. Try again shortly."}
          </div>
        ) : (
          <>
            <div className="relative">
              <textarea value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={`Message #${channel === "global" ? "global" : "KR"}...`}
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

      {/* ── Report modal ─────────────────────────────────────────── */}
      {reportMsgId && <ReportModal onClose={() => setReportMsgId(null)} />}
    </div>
  );
}
