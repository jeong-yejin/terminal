"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SidebarProfile } from "./SidebarProfile";
import { SidebarNav } from "./SidebarNav";
import { useUser } from "@/hooks/useUser";

export function Sidebar() {
  const { data: user } = useUser();

  return (
    <aside className="relative hidden md:flex w-60 flex-col items-center overflow-hidden rounded-2xl bg-surface-2">
      <SidebarProfile
        name={user?.name}
        email={user?.email}
        avatarUrl={user?.avatarUrl}
        level={user?.level}
        xp={user?.xp}
        xpForNext={user?.xpForNext}
        rank={user?.rank}
        followers={user?.followers}
        posts={user?.posts}
      />
      <SidebarNav />

      {/* 하단 푸터 */}
      <div className="mt-auto w-full border-t border-border-subtle px-4 py-4 flex flex-col items-center">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-text-tertiary transition-colors hover:text-text-primary
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:rounded-sm focus-visible:outline-offset-2"
        >
          <ArrowLeft size={12} aria-hidden />
          <span>Back to</span>
        </Link>
        <p className="mt-1.5 text-sm font-bold tracking-widest text-text-primary">
          REBOUNDX
        </p>
      </div>
    </aside>
  );
}
