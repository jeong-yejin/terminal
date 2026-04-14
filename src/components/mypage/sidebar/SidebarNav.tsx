"use client";

import {
  LayoutDashboard,
  Wallet,
  History,
  BarChart2,
  Link2,
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
    label: "Assets",
    icon: Wallet,
  },
  {
    href: "/mypage/history",
    label: "History",
    icon: History,
  },
  {
    href: "/mypage/performance",
    label: "Performance",
    icon: BarChart2,
    devNote: "개발단 협의 필요",
  },
  {
    href: "/mypage/exchanges",
    label: "Exchanges",
    icon: Link2,
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
    <nav className="flex-1 py-2">
      <ul role="list" className="space-y-0.5 px-2">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem key={item.href} {...item} />
        ))}
      </ul>
    </nav>
  );
}
