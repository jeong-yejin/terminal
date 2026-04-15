"use client";

import {
  LayoutDashboard,
  Wallet,
  Clock,
  Building2,
} from "lucide-react";
import { SidebarNavItem } from "./SidebarNavItem";

const NAV_ITEMS = [
  {
    href: "/mypage/overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/mypage/assets",
    label: "Asset",
    icon: Wallet,
  },
  {
    href: "/mypage/history",
    label: "History",
    icon: Clock,
  },
  {
    href: "/mypage/exchanges",
    label: "My Exchanges",
    icon: Building2,
  },
] as const;

/**
 * 사이드바 메뉴 리스트
 *
 * 스펙:
 *   - 메뉴 아이템 높이: 44px
 *   - 아이콘: 18×18px, color-icon-secondary
 *   - 라벨: font-body-sm/medium, color-text-secondary
 *   - 활성 상태: bg-surface-2, color-text-primary, left accent bar 2px color-primary
 *   - hover: bg-surface-2/60
 *   - 패딩: px-4
 */
export function SidebarNav() {
  return (
    <nav className="flex-1 w-full py-4">
      {/* px 없음 — 각 아이템이 사이드바 전체 너비를 차지 */}
      <ul role="list" className="w-full space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem key={item.href} {...item} />
        ))}
      </ul>
    </nav>
  );
}
