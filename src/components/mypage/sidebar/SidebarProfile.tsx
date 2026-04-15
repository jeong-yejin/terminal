"use client";

import { useState } from "react";
import Image from "next/image";

interface SidebarProfileProps {
  name?: string;
  email?: string;
  avatarUrl?: string;
}

export function SidebarProfile({ name, email, avatarUrl }: SidebarProfileProps) {
  const [imgError, setImgError] = useState(false);
  const showInitials = !avatarUrl || imgError;

  return (
    <div className="flex flex-col items-center gap-2 px-4 py-4 w-full">
      {/* 아바타 - 크게, 중앙 정렬 */}
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-positive">
        {!showInitials ? (
          <Image
            src={avatarUrl!}
            alt={name ?? "profile"}
            fill
            sizes="56px"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-positive text-sm font-semibold text-white" />
        )}
      </div>

      {/* 텍스트 - 중앙 정렬 */}
      <div className="text-center">
        {name ? (
          <p className="text-sm font-semibold text-text-primary">{name}</p>
        ) : (
          <div className="mb-1 h-3.5 w-20 animate-pulse rounded bg-surface-3" />
        )}
        {email ? (
          <p className="text-xs text-text-tertiary">{email}</p>
        ) : (
          <div className="h-3 w-32 animate-pulse rounded bg-surface-3" />
        )}
      </div>
    </div>
  );
}
