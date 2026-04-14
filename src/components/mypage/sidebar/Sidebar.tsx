"use client";

import { SidebarProfile } from "./SidebarProfile";
import { SidebarNav } from "./SidebarNav";

// TODO: 실제 서비스에서는 Auth context / session에서 가져옵니다
const MOCK_USER = {
  name: "Yejin Jeong",
  email: "yejin@reboundx.io",
  avatarUrl: "https://lh3.googleusercontent.com/a/default-user=s96-c",
};

/**
 * My Page 사이드바
 *
 * Layout:
 *   - 너비: 240px (고정, desktop)
 *   - 모바일(<768px): hidden → 하단 탭바(MobileTabBar)로 대체
 *   - 배경: color-surface-1 (#171717)
 *   - 우측 border: 1px solid color-border-subtle (rgba(255,255,255,0.20))
 */
export function Sidebar() {
  return (
    <aside className="hidden md:flex w-60 flex-shrink-0 flex-col border-r border-border-subtle bg-surface-1">
      <SidebarProfile
        name={MOCK_USER.name}
        email={MOCK_USER.email}
        avatarUrl={MOCK_USER.avatarUrl}
      />
      <SidebarNav />
    </aside>
  );
}
