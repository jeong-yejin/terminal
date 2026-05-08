"use client";

import { getLevelInfo } from "@/lib/level";

interface Props {
  level: number;
  className?: string;
}

export function LevelBadge({ level, className = "" }: Props) {
  const { title, color, bgColor, hasBorder, borderColor } = getLevelInfo(level);
  return (
    <span
      className={`inline-flex items-center rounded-[4px] px-1 text-[12px] font-bold leading-[1.5] whitespace-nowrap ${className}`}
      style={{
        color,
        backgroundColor: bgColor,
        border: hasBorder ? `1px solid ${borderColor}` : undefined,
      }}
    >
      Lv.{level}&nbsp;{title}
    </span>
  );
}
