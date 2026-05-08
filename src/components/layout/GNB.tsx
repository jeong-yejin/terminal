"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, ChevronDown } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { getLevelInfo } from "@/lib/level";

// ─── ReboundX Logo SVG ────────────────────────────────────────────────────────

function ReboundXMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 1L18 5.5V14.5L10 19L2 14.5V5.5L10 1Z" fill="#CAFF5D" opacity="0.15" />
      <path d="M10 1L18 5.5V14.5L10 19L2 14.5V5.5L10 1Z" stroke="#CAFF5D" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 7H11.5C12.33 7 13 7.67 13 8.5C13 9.33 12.33 10 11.5 10H7V7Z" fill="#CAFF5D" />
      <path d="M7 10H11L13.5 13.5" stroke="#CAFF5D" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Rebate Chip ─────────────────────────────────────────────────────────────

function RebateChip({ amount }: { amount: number }) {
  return (
    <Link
      href="/mypage/performance"
      className="hidden items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary/20 focus-ring sm:flex"
      title="Today's earned rebate — click to view performance"
    >
      {/* pulsing live dot */}
      <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
      Today +${amount.toFixed(2)}
    </Link>
  );
}

// ─── Level Avatar with XP progress ring ──────────────────────────────────────

function LevelAvatar({
  level,
  xp,
  xpForNext,
}: {
  level: number;
  xp: number;
  xpForNext: number;
}) {
  const { color, title } = getLevelInfo(level);
  const pct   = Math.min(100, Math.round((xp / xpForNext) * 100));

  return (
    <Link
      href="/mypage/overview"
      title={`Lv.${level} ${title} — ${xp.toLocaleString()}/${xpForNext.toLocaleString()} XP`}
      className="group relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full focus-ring"
      aria-label="My page"
    >
      {/* XP conic ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(${color} ${pct}%, rgba(255,255,255,0.07) 0)`,
          padding: "2px",
        }}
      >
        <div
          className="flex h-full w-full items-center justify-center rounded-full bg-surface-1 text-[11px] font-extrabold transition-colors group-hover:bg-surface-2"
          style={{ color }}
        >
          {level}
        </div>
      </div>
    </Link>
  );
}

// ─── Nav links ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/trade",        label: "Trade" },
  { href: "/community",    label: "Community" },
  { href: "/funding-rate", label: "Funding Rate" },
  { href: "/guide",        label: "Guide" },
] as const;

// ─── Mock stats — replace with real user API data ─────────────────────────────
const MOCK_REBATE_TODAY = 12.40;
const MOCK_LEVEL        = 15;
const MOCK_XP           = 1240;
const MOCK_XP_NEXT      = 1500;

// ─── GNB ─────────────────────────────────────────────────────────────────────

export function GNB() {
  const pathname = usePathname();
  useUser(); // keep hook active for future user data

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border-subtle bg-surface-1/95 backdrop-blur-md">
      <div className="flex h-full items-center gap-4 px-4 md:px-5">

        {/* ── Logo + badge ─────────────────────────────────────────────── */}
        <Link
          href="/"
          className="flex flex-shrink-0 items-center gap-2 focus-ring rounded-sm"
          aria-label="ReboundX home"
        >
          <ReboundXMark size={22} />
          <span className="hidden text-sm font-bold tracking-widest text-text-primary sm:block">
            REBOUNDX
          </span>
        </Link>

        <span className="hidden flex-shrink-0 items-center rounded-full border border-border-subtle px-2.5 py-[3px] text-[10px] font-semibold uppercase tracking-[0.1em] text-text-disabled sm:flex">
          Terminal
        </span>

        <span className="hidden h-4 w-px flex-shrink-0 bg-border-ghost sm:block" aria-hidden="true" />

        {/* ── Nav ─────────────────────────────────────────────────────── */}
        <nav className="hidden flex-1 items-center md:flex" aria-label="Main navigation">
          <div className="flex items-center gap-0.5 rounded-full border border-border-subtle/60 bg-surface-1/60 p-[3px]">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150 focus-ring",
                    isActive
                      ? "bg-surface-2 text-text-primary shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
                      : "text-text-disabled hover:text-text-secondary",
                  ].join(" ")}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-[4px] left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-primary" aria-hidden="true" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="flex-1 md:hidden" />

        {/* ── Right actions ────────────────────────────────────────────── */}
        <div className="flex flex-shrink-0 items-center gap-2.5">

          {/* Live rebate chip */}
          <RebateChip amount={MOCK_REBATE_TODAY} />

          {/* Deposit */}
          <Link
            href="/mypage/history?section=transaction&tab=deposit"
            className="hidden items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-text-inverse
              transition-colors hover:bg-primary-strong focus-ring sm:flex"
          >
            Deposit
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          <span className="hidden h-4 w-px bg-border-ghost sm:block" aria-hidden="true" />

          {/* Level avatar with XP ring */}
          <LevelAvatar level={MOCK_LEVEL} xp={MOCK_XP} xpForNext={MOCK_XP_NEXT} />

          {/* Language */}
          <button
            className="hidden cursor-pointer items-center gap-1 rounded-full px-2 py-1.5 text-xs
              font-medium text-text-tertiary transition-colors hover:bg-surface-2 hover:text-text-primary focus-ring md:flex"
            aria-label="Select language"
          >
            <Globe size={12} aria-hidden />
            EN
            <ChevronDown size={10} aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}
