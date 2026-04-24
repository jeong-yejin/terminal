"use client";

import {
  LayoutDashboard,
  Wallet,
  Clock,
  Building2,
  BarChart2,
  MessageSquare,
  Users,
  Bell,
  Settings,
} from "lucide-react";
import { SidebarNavItem } from "./SidebarNavItem";

const NAV_SECTIONS = [
  {
    label: "Trading",
    items: [
      { href: "/mypage/overview",     label: "Overview",    icon: LayoutDashboard },
      { href: "/mypage/assets",       label: "Asset",       icon: Wallet },
      { href: "/mypage/history",      label: "History",     icon: Clock },
      { href: "/mypage/exchanges",    label: "Exchanges",   icon: Building2 },
      { href: "/mypage/performance",  label: "Performance", icon: BarChart2 },
    ],
  },
  {
    label: "Community",
    items: [
      { href: "/mypage/activity",      label: "Activity",      icon: MessageSquare },
      { href: "/mypage/social",        label: "Social",        icon: Users },
      { href: "/mypage/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/mypage/settings", label: "Settings", icon: Settings },
    ],
  },
] as const;

export function SidebarNav() {
  return (
    <nav className="flex-1 w-full py-2" aria-label="My page navigation">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label} className="mb-2">
          <p className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-text-disabled">
            {section.label}
          </p>
          <ul role="list" className="w-full space-y-0.5">
            {section.items.map((item) => (
              <SidebarNavItem key={item.href} {...item} />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
