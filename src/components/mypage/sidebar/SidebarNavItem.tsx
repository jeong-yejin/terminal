"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  devNote?: string;
}

/**
 * 사이드바 개별 메뉴 아이템
 *
 * 상태별 스타일:
 *   - default  : text-text-secondary, icon color-icon-secondary
 *   - hover    : bg-surface-2/60, text-text-primary
 *   - active   : bg-surface-2, text-text-primary, left border 2px color-primary
 *   - focus    : outline-2 outline-offset-2 outline-primary (키보드 접근성)
 *
 * 접근성:
 *   - aria-current="page" 활성 페이지 표시
 *   - 아이콘 aria-hidden="true" (라벨 텍스트로 충분)
 */
export function SidebarNavItem({
  href,
  label,
  icon: Icon,
  devNote,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <li className="w-full">
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          // w-full + 좌우 패딩으로 edge-to-edge 하이라이트, rounded 제거
          "group relative flex h-14 w-full items-center gap-3 px-4 text-sm font-medium transition-colors",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-text-secondary hover:bg-primary/5 hover:text-text-primary"
        )}
      >
        <Icon
          aria-hidden="true"
          size={18}
          className={cn(
            "flex-shrink-0 transition-colors",
            isActive ? "text-primary" : "text-icon-secondary group-hover:text-text-primary"
          )}
        />
        <span>{label}</span>

        {devNote && process.env.NODE_ENV === "development" && (
          <span className="ml-auto rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-yellow-400">
            DEV
          </span>
        )}
      </Link>
    </li>
  );
}
