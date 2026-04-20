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
    label: "Exchanges",
    icon: Building2,
  },
] as const;

export function SidebarNav() {
  return (
    <nav className="flex-1 w-full py-4">
      <ul role="list" className="w-full space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem key={item.href} {...item} />
        ))}
      </ul>
    </nav>
  );
}
