"use client";

import { useState } from "react";
import Image from "next/image";
import type { UserProfile } from "@/types/mypage";
import { getLevelInfo } from "@/lib/level";
import { LevelBadge } from "@/components/LevelBadge";

type ProfileProps = Partial<Pick<UserProfile, "name" | "email" | "avatarUrl" | "level" | "xp" | "xpForNext" | "rank" | "followers" | "posts">>;

export function SidebarProfile({ name, email, avatarUrl, level = 1, xp = 0, xpForNext = 1000, rank, followers = 0, posts = 0 }: ProfileProps) {
  const [imgError, setImgError] = useState(false);
  const showInitials = !avatarUrl || imgError;
  const initial = name?.trim().charAt(0).toUpperCase() ?? "";
  const { color } = getLevelInfo(level);
  const xpPct = Math.min(100, Math.round((xp / xpForNext) * 100));

  return (
    <div className="flex flex-col items-center gap-3 px-4 py-5 w-full">
      {/* Avatar with level ring */}
      <div className="relative h-14 w-14 flex-shrink-0">
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: `conic-gradient(${color} ${xpPct * 3.6}deg, transparent 0deg)`, padding: 2 }}
        >
          <div className="h-full w-full rounded-full bg-surface-2" />
        </div>
        <div className="absolute inset-[3px] overflow-hidden rounded-full bg-surface-3">
          {!showInitials ? (
            <Image
              src={avatarUrl!}
              alt={name ?? "profile"}
              fill
              sizes="50px"
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-text-primary">
              {initial}
            </span>
          )}
        </div>
      </div>

      {/* Name + level badge */}
      <div className="text-center w-full">
        {name ? (
          <p className="text-sm font-semibold text-text-primary">{name}</p>
        ) : (
          <div className="mx-auto mb-1 h-3.5 w-20 animate-pulse rounded bg-surface-3" />
        )}

        {/* Level badge */}
        <div className="mt-1 flex items-center justify-center gap-1.5">
          <LevelBadge level={level} />
          {email && <span className="hidden" />}
        </div>

        {/* XP bar */}
        <div className="mt-2.5 w-full px-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-medium text-text-disabled uppercase tracking-wider">XP</span>
            <span className="text-[9px] font-mono text-text-disabled">
              {xp.toLocaleString()} / {xpForNext.toLocaleString()}
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${xpPct}%`, background: color }}
            />
          </div>
        </div>

        {/* Stats row: rank · followers · posts */}
        <div className="mt-3 grid grid-cols-3 divide-x divide-border-subtle rounded-xl border border-border-subtle bg-surface-3 text-center">
          <div className="py-2">
            <p className="text-[10px] text-text-disabled">Rank</p>
            <p className="mt-0.5 text-[12px] font-bold text-text-primary font-mono">
              {rank != null ? `#${rank}` : "—"}
            </p>
          </div>
          <div className="py-2">
            <p className="text-[10px] text-text-disabled">Followers</p>
            <p className="mt-0.5 text-[12px] font-bold text-text-primary font-mono">{followers}</p>
          </div>
          <div className="py-2">
            <p className="text-[10px] text-text-disabled">Posts</p>
            <p className="mt-0.5 text-[12px] font-bold text-text-primary font-mono">{posts}</p>
          </div>
        </div>

        {email && (
          <p className="mt-2 text-[11px] text-text-tertiary truncate w-full">{email}</p>
        )}
      </div>
    </div>
  );
}
