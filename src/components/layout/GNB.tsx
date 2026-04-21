"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, ChevronDown } from "lucide-react";
import { useUser } from "@/hooks/useUser";

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

// ─── Nav links ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/trade",        label: "Trade" },
  { href: "/funding-rate", label: "Funding Rate" },
  { href: "/guide",        label: "Guide" },
] as const;

// ─── GNB ─────────────────────────────────────────────────────────────────────

export function GNB() {
  const pathname = usePathname();
  const { data: user } = useUser();
  const initial = user?.name?.trim()[0]?.toUpperCase() ?? "U";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border-subtle bg-surface-1/95 backdrop-blur-md">
      <div className="flex h-full items-center gap-4 px-4 md:px-5">

        {/* ── Left: Logo + Terminal badge ─────────────────────────────────── */}
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

        {/* Terminal badge */}
        <span className="hidden flex-shrink-0 rounded-full border border-border-subtle bg-surface-2 px-3 py-1 text-xs font-semibold text-text-primary sm:block">
          Terminal
        </span>

        {/* vertical divider */}
        <span className="hidden h-4 w-px flex-shrink-0 bg-border-subtle sm:block" aria-hidden="true" />

        {/* ── Center: Navigation ──────────────────────────────────────────── */}
        <nav className="hidden flex-1 items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "relative rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors focus-ring",
                  isActive
                    ? "text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
                {isActive && (
                  <span className="absolute inset-x-3.5 bottom-0 h-px bg-primary" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* spacer when nav is hidden */}
        <div className="flex-1 md:hidden" />

        {/* ── Right: Actions ──────────────────────────────────────────────── */}
        <div className="flex flex-shrink-0 items-center gap-2">

          {/* Deposit button */}
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

          {/* vertical divider */}
          <span className="hidden h-4 w-px bg-border-subtle sm:block" aria-hidden="true" />

          {/* Avatar */}
          <Link
            href="/mypage/overview"
            className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-info/20 text-xs font-bold text-info transition-colors hover:bg-info/30 focus-ring"
            aria-label="My page"
          >
            {initial}
          </Link>

          {/* vertical divider */}
          <span className="hidden h-4 w-px bg-border-subtle md:block" aria-hidden="true" />

          {/* Language selector */}
          <button
            className="hidden cursor-pointer items-center gap-1.5 rounded-full border border-border-subtle px-3 py-1.5 text-xs
              font-medium text-text-secondary transition-colors hover:border-border-normal hover:text-text-primary focus-ring md:flex"
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
