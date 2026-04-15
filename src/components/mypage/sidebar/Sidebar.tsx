"use client";

import { ArrowLeft } from "lucide-react";
import { SidebarProfile } from "./SidebarProfile";
import { SidebarNav } from "./SidebarNav";

// TODO: 실제 서비스에서는 Auth context / session에서 가져옵니다
const MOCK_USER = {
  name: "{Username}",
  email: "[Mail Address]",
  avatarUrl: "",
};

export function Sidebar() {
  return (
    // Figma 스펙: bg-[#262626] flex flex-col rounded-[16px] shrink-0 items-start relative
    <aside className="relative hidden md:flex w-60 flex flex-col items-center overflow-hidden rounded-2xl bg-surface-2">
      <SidebarProfile
        name={MOCK_USER.name}
        email={MOCK_USER.email}
        avatarUrl={MOCK_USER.avatarUrl}
      />
      <SidebarNav />

      {/* 하단 푸터 */}
      <div className="mt-auto w-full border-t border-border-subtle px-4 py-4 flex flex-col items-center">
        <button className="flex items-center gap-1.5 text-xs text-text-tertiary transition-colors hover:text-text-primary">
          <ArrowLeft size={12} />
          <span>Back to</span>
        </button>
        <p className="mt-1.5 text-sm font-bold tracking-widest text-text-primary">
          REBOUNDX
        </p>
      </div>
    </aside>
  );
}
