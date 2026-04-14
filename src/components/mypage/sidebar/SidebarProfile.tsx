"use client";

import { useState } from "react";
import Image from "next/image";

interface SidebarProfileProps {
  name?: string;
  email?: string;
  avatarUrl?: string;
}

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * 사이드바 상단 프로필 영역
 *
 * 스펙:
 *   - 아바타: 32×32px, border-radius 50%
 *   - 이미지 로드 실패 시 이니셜 폴백 (bg primary/10, text primary)
 *   - name: 14px/medium, text-text-primary, 1줄 ellipsis
 *   - email: 12px/regular, text-text-tertiary, 1줄 ellipsis
 *   - 패딩: px-4 py-5 / 하단 border-border-subtle
 */
export function SidebarProfile({ name, email, avatarUrl }: SidebarProfileProps) {
  const [imgError, setImgError] = useState(false);
  const showInitials = !avatarUrl || imgError;

  return (
    <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-5">
      {/* 아바타 */}
      <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-surface-2">
        {!showInitials ? (
          <Image
            src={avatarUrl!}
            alt={name ?? "profile"}
            fill
            sizes="32px"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-primary/10 text-[10px] font-semibold text-primary">
            {getInitials(name)}
          </span>
        )}
      </div>

      {/* 텍스트 */}
      <div className="min-w-0 flex-1">
        {name ? (
          <p className="truncate text-sm font-medium text-text-primary">{name}</p>
        ) : (
          <div className="mb-1 h-3.5 w-20 animate-pulse rounded bg-surface-3" />
        )}
        {email ? (
          <p className="truncate text-xs text-text-tertiary">{email}</p>
        ) : (
          <div className="h-3 w-32 animate-pulse rounded bg-surface-3" />
        )}
      </div>
    </div>
  );
}
