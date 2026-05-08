"use client";

import { useState } from "react";
import {
  Bell,
  ThumbsUp,
  MessageCircle,
  UserPlus,
  MessageSquare,
  CheckCheck,
  Flame,
} from "lucide-react";
import { getLevelInfo } from "@/lib/level";

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifType   = "like" | "comment" | "follow" | "chat_mention" | "reply";
type NotifFilter = "all" | NotifType;

interface Notification {
  id: string;
  type: NotifType;
  actor: string;
  actorLevel: number;
  message: string;
  context?: string;
  timeAgo: string;
  read: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────


const TYPE_CONFIG: Record<NotifType, { icon: React.ElementType; color: string; label: string }> = {
  like:         { icon: ThumbsUp,      color: "#CAFF5D", label: "Like"       },
  comment:      { icon: MessageCircle, color: "#60a5fa", label: "Comment"    },
  reply:        { icon: MessageCircle, color: "#60a5fa", label: "Reply"      },
  follow:       { icon: UserPlus,      color: "#c084fc", label: "Follow"     },
  chat_mention: { icon: MessageSquare, color: "#fb923c", label: "Chat"       },
};

const FILTER_TABS: { key: NotifFilter; label: string }[] = [
  { key: "all",          label: "All"      },
  { key: "like",         label: "Likes"    },
  { key: "comment",      label: "Comments" },
  { key: "follow",       label: "Follows"  },
  { key: "chat_mention", label: "Chat"     },
];

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_NOTIFS: Notification[] = [
  {
    id: "n1", type: "like", actor: "CryptoWhale88", actorLevel: 72,
    message: "liked your post.",
    context: "\"BTC Long +18% Entry Analysis\"",
    timeAgo: "5m ago", read: false,
  },
  {
    id: "n2", type: "comment", actor: "BTCmaxi", actorLevel: 91,
    message: "commented on your post.",
    context: "\"Shorting negative funding rate zones — agreed. When price breaks liquidation level, recovery strategy...\"",
    timeAgo: "22m ago", read: false,
  },
  {
    id: "n3", type: "follow", actor: "SolanaKing", actorLevel: 45,
    message: "started following you.",
    timeAgo: "1h ago", read: false,
  },
  {
    id: "n4", type: "chat_mention", actor: "TradeGuru_KR", actorLevel: 33,
    message: "mentioned you in chat.",
    context: "@You What do you think about entering BTC now?",
    timeAgo: "2h ago", read: true,
  },
  {
    id: "n5", type: "like", actor: "MarketOracle", actorLevel: 55,
    message: "liked your comment.",
    context: "\"Keep leverage low and set a clear stop loss...\"",
    timeAgo: "3h ago", read: true,
  },
  {
    id: "n6", type: "reply", actor: "BTCmaxi", actorLevel: 91,
    message: "replied to your comment.",
    context: "\"Exactly. Recovery strategy when price breaks the liquidation level is also important.\"",
    timeAgo: "5h ago", read: true,
  },
  {
    id: "n7", type: "follow", actor: "CryptoWhale88", actorLevel: 72,
    message: "started following you.",
    timeAgo: "1d ago", read: true,
  },
  {
    id: "n8", type: "like", actor: "NewbieTrader", actorLevel: 3,
    message: "liked your post.",
    context: "\"Fed FOMC Statement Analysis — Short-Term Impact on Crypto\"",
    timeAgo: "2d ago", read: true,
  },
];

// ─── NotifItem ────────────────────────────────────────────────────────────────

function NotifItem({ notif, onMarkRead }: { notif: Notification; onMarkRead: (id: string) => void }) {
  const { icon: Icon, color } = TYPE_CONFIG[notif.type];
  const actorColor = getLevelInfo(notif.actorLevel).color;

  return (
    <div
      className={`
        relative flex items-start gap-4 rounded-xl border p-4 transition-colors cursor-default
        ${notif.read
          ? "border-border-subtle bg-surface-1"
          : "border-primary/20 bg-surface-1"}
      `}
      onClick={() => !notif.read && onMarkRead(notif.id)}
      role={notif.read ? undefined : "button"}
      aria-label={notif.read ? undefined : "Mark as read"}
    >
      {/* Unread dot */}
      {!notif.read && (
        <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary" aria-label="Unread" />
      )}

      {/* Type icon */}
      <div
        className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        <Icon size={15} style={{ color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-text-secondary leading-snug">
          <span className="font-bold" style={{ color: actorColor }}>{notif.actor}</span>
          {" "}{notif.message}
        </p>
        {notif.context && (
          <p className="mt-1 text-[12px] text-text-disabled line-clamp-2 italic">
            {notif.context}
          </p>
        )}
        <p className="mt-1.5 text-[11px] text-text-disabled">{notif.timeAgo}</p>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2">
        <Bell size={20} className="text-text-disabled" />
      </div>
      <p className="text-[13px] text-text-secondary">No notifications.</p>
      <p className="text-[12px] text-text-disabled">You will receive notifications as you engage with the community.</p>
    </div>
  );
}

// ─── NotificationsPage ────────────────────────────────────────────────────────

export function NotificationsPage() {
  const [filter, setFilter] = useState<NotifFilter>("all");
  const [notifs, setNotifs] = useState<Notification[]>(MOCK_NOTIFS);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const filtered = filter === "all"
    ? notifs
    : notifs.filter((n) => n.type === filter || (filter === "comment" && n.type === "reply"));

  const markRead    = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <span className="flex items-center justify-center rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-text-inverse min-w-[22px]">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="mt-1 text-[13px] text-text-secondary">Community and chat activity notifications</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-2 text-[12px] font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-primary flex-shrink-0"
            aria-label="Mark all notifications as read"
          >
            <CheckCheck size={13} />
            Mark all read
          </button>
        )}
      </div>

      {/* Stats chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {(Object.entries(TYPE_CONFIG) as [NotifType, typeof TYPE_CONFIG[NotifType]][]).map(([type, { icon: Icon, color, label }]) => {
          const count = notifs.filter((n) => n.type === type).length;
          if (count === 0) return null;
          return (
            <div key={type} className="flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface-2 px-3 py-1">
              <Icon size={11} style={{ color }} />
              <span className="text-[11px] font-medium text-text-secondary">{label}</span>
              <span className="text-[11px] font-bold text-text-primary font-mono">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-border-subtle bg-surface-2 p-1 scrollbar-none" role="tablist">
        {FILTER_TABS.map(({ key, label }) => {
          const count = key === "all" ? notifs.length : notifs.filter((n) => n.type === key || (key === "comment" && n.type === "reply")).length;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={filter === key}
              onClick={() => setFilter(key)}
              className={`
                flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold transition-all
                ${filter === key
                  ? "bg-surface-1 text-text-primary shadow-sm"
                  : "text-text-tertiary hover:text-text-secondary"}
              `}
            >
              {label}
              {count > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${filter === key ? "bg-primary/15 text-primary" : "bg-surface-3 text-text-disabled"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notification list */}
      <div className="space-y-2" role="tabpanel">
        {filtered.length === 0
          ? <EmptyState />
          : filtered.map((n) => (
            <NotifItem key={n.id} notif={n} onMarkRead={markRead} />
          ))
        }
      </div>

      {/* Hot tip */}
      {unreadCount === 0 && notifs.length > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <Flame size={14} className="text-primary flex-shrink-0" />
          <p className="text-[12px] text-text-secondary">
            Post in the community or join chat to receive more notifications.
          </p>
        </div>
      )}
    </div>
  );
}
