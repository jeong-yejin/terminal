"use client";

import { Plus } from "lucide-react";

interface AddExchangeButtonProps {
  onSuccess?: () => void;
}

/**
 * 거래소 추가 버튼 (OAuth 방식)
 *
 * 동작:
 *   - 클릭 → OAuth 팝업 또는 리다이렉트
 *   - 완료 후 onSuccess() 호출 → 목록 리프레시
 *
 * 스펙:
 *   - height: 36px, bg-primary, text-white
 */
export function AddExchangeButton({ onSuccess }: AddExchangeButtonProps) {
  const handleAdd = () => {
    // TODO: OAuth 플로우 시작
    // e.g. window.location.href = `/api/exchanges/oauth/start`
    // 완료 후 onSuccess?.()
    onSuccess?.();
  };

  return (
    <button
      onClick={handleAdd}
      className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white
        hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <Plus size={16} aria-hidden="true" />
      거래소 추가
    </button>
  );
}
