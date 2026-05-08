"use client";

import { useState, useRef } from "react";
import {
  User, Upload, Shield, ChevronRight, Check, X, Ban, Flag, Trash2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlockedUser {
  id: string;
  nickname: string;
  level: number;
  blockedAt: string;
}

interface ReportedPost {
  id: string;
  title: string;
  reason: string;
  status: "under_review" | "deleted" | "dismissed";
  reportedAt: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_BLOCKED: BlockedUser[] = [
  { id: "b1", nickname: "SpamBot9000", level: 2, blockedAt: "Apr 18" },
  { id: "b2", nickname: "rug_puller_kr", level: 5, blockedAt: "Apr 10" },
];

const MOCK_REPORTED: ReportedPost[] = [
  { id: "r1", title: "Guaranteed 100% profit signal room — join now", reason: "Spam / Advertisement", status: "deleted",      reportedAt: "Apr 20" },
  { id: "r2", title: "BTC will definitely pump tomorrow (no basis)",  reason: "Misinformation",       status: "under_review", reportedAt: "Apr 22" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-1 p-6 space-y-5">
      <div>
        <h2 className="text-[15px] font-bold text-text-primary">{title}</h2>
        {description && (
          <p className="mt-0.5 text-[12px] text-text-secondary">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="border-t border-border-subtle/60" />;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? "bg-primary" : "bg-surface-3"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-text-primary">{label}</p>
        {description && (
          <p className="mt-0.5 text-[11px] text-text-disabled leading-relaxed">{description}</p>
        )}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ─── Profile Section ──────────────────────────────────────────────────────────

function ProfileSection() {
  const [nickname, setNickname] = useState("You");
  const [saved, setSaved] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarSrc(url);
  }

  return (
    <SectionCard title="Edit Profile" description="Change your nickname and profile image.">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative h-16 w-16 flex-shrink-0">
          <div className="h-16 w-16 overflow-hidden rounded-full bg-surface-3 ring-2 ring-border-subtle">
            {avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarSrc} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[22px] font-bold text-primary">
                Y
              </div>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[#0d0d0d] shadow-md hover:bg-primary/90 transition-colors"
            aria-label="Change profile image"
          >
            <Upload size={11} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-medium text-text-secondary">Profile Image</p>
          <p className="mt-0.5 text-[11px] text-text-disabled">JPG, PNG, GIF · Max 5MB</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 text-[11px] font-semibold text-primary hover:underline"
          >
            Change Image
          </button>
        </div>
      </div>

      <Divider />

      {/* Nickname */}
      <div className="space-y-2">
        <label className="block text-[12px] font-medium text-text-secondary" htmlFor="nickname-input">
          Nickname
        </label>
        <div className="flex gap-2">
          <input
            id="nickname-input"
            type="text"
            value={nickname}
            onChange={(e) => { setNickname(e.target.value); setSaved(false); }}
            maxLength={20}
            className="flex-1 rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-[13px] text-text-primary placeholder:text-text-disabled focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            placeholder="Enter nickname"
          />
          <button
            onClick={handleSave}
            disabled={!nickname.trim()}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-[12px] font-semibold transition-colors ${
              saved
                ? "bg-positive/20 text-positive"
                : "bg-primary text-[#0d0d0d] hover:bg-primary/90 disabled:opacity-40"
            }`}
          >
            {saved ? <><Check size={13} /> Saved!</> : "Save"}
          </button>
        </div>
        <p className="text-[11px] text-text-disabled">{nickname.length}/20</p>
      </div>
    </SectionCard>
  );
}

// ─── Privacy Section ──────────────────────────────────────────────────────────

function PrivacySection() {
  const [tradeHistoryPublic, setTradeHistoryPublic] = useState(true);
  const [levelBadgePublic, setLevelBadgePublic] = useState(true);

  return (
    <SectionCard
      title="Trading Performance Visibility"
      description="Configure what other traders can see on your profile."
    >
      <div className="rounded-xl border border-border-subtle bg-surface-2/50 p-1">
        <div className="flex items-start gap-3 rounded-lg bg-primary/5 px-3 py-2.5">
          <Shield size={14} className="mt-0.5 shrink-0 text-primary" />
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Public information will be visible to other users on your profile page.
            Private information will only be visible to you.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <ToggleRow
          label="Trade History & Holdings"
          description="Share open positions, recent closed positions, and 30-day returns publicly."
          checked={tradeHistoryPublic}
          onChange={() => setTradeHistoryPublic((v) => !v)}
        />
        <Divider />
        <ToggleRow
          label="Level & Badges"
          description="Share your current level, XP, and earned badges with other traders."
          checked={levelBadgePublic}
          onChange={() => setLevelBadgePublic((v) => !v)}
        />
      </div>
    </SectionCard>
  );
}

// ─── Management Section ───────────────────────────────────────────────────────

const STATUS_CONFIG = {
  under_review: { label: "Under Review", className: "bg-amber-500/15 text-amber-400" },
  deleted:      { label: "Deleted",      className: "bg-negative/15 text-negative" },
  dismissed:    { label: "Dismissed",    className: "bg-surface-3 text-text-disabled" },
} as const;

function ManagementSection() {
  const [blocked, setBlocked] = useState<BlockedUser[]>(MOCK_BLOCKED);
  const [reported] = useState<ReportedPost[]>(MOCK_REPORTED);
  const [managementTab, setManagementTab] = useState<"blocked" | "reported">("blocked");

  function unblock(id: string) {
    setBlocked((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <SectionCard title="Management" description="Manage blocked accounts and reported posts.">
      {/* Tab switcher */}
      <div className="flex gap-1 rounded-xl border border-border-subtle bg-surface-2 p-1">
        {([
          { key: "blocked",  label: "Blocked Accounts",    count: blocked.length },
          { key: "reported", label: "Reported & Deleted Posts", count: reported.length },
        ] as const).map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setManagementTab(key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold transition-all ${
              managementTab === key
                ? "bg-surface-1 text-text-primary shadow-sm"
                : "text-text-disabled hover:text-text-secondary"
            }`}
          >
            {label}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${managementTab === key ? "bg-primary/15 text-primary" : "bg-surface-3 text-text-disabled"}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Blocked accounts */}
      {managementTab === "blocked" && (
        <div className="space-y-2">
          {blocked.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-2">
                <Ban size={16} className="text-text-disabled" />
              </div>
              <p className="text-[12px] text-text-disabled">No blocked accounts.</p>
            </div>
          ) : (
            blocked.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-2 px-4 py-3"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-surface-3 text-[13px] font-bold text-text-disabled">
                  {user.nickname[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-text-primary">{user.nickname}</p>
                  <p className="text-[11px] text-text-disabled">Lv.{user.level} · Blocked on {user.blockedAt}</p>
                </div>
                <button
                  onClick={() => unblock(user.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-3 px-3 py-1.5 text-[11px] font-semibold text-text-secondary transition-colors hover:border-negative/40 hover:text-negative"
                >
                  <X size={11} /> Unblock
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Reported & deleted posts */}
      {managementTab === "reported" && (
        <div className="space-y-2">
          {reported.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-2">
                <Flag size={16} className="text-text-disabled" />
              </div>
              <p className="text-[12px] text-text-disabled">No reported posts.</p>
            </div>
          ) : (
            reported.map((post) => {
              const { label, className } = STATUS_CONFIG[post.status];
              return (
                <div
                  key={post.id}
                  className="rounded-xl border border-border-subtle bg-surface-2 px-4 py-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="flex-1 text-[13px] font-semibold text-text-primary line-clamp-1 leading-snug">
                      {post.title}
                    </p>
                    <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${className}`}>
                      {label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-text-disabled">
                    <span className="flex items-center gap-1">
                      <Flag size={10} /> Reason: {post.reason}
                    </span>
                    <span>·</span>
                    <span>{post.reportedAt}</span>
                    {post.status === "deleted" && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-negative">
                          <Trash2 size={10} /> Post deleted
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </SectionCard>
  );
}

// ─── SettingsPage ─────────────────────────────────────────────────────────────

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Settings</h1>
        <p className="mt-1 text-[13px] text-text-secondary">Profile · Visibility · Account Management</p>
      </div>

      <ProfileSection />
      <PrivacySection />
      <ManagementSection />
    </div>
  );
}
