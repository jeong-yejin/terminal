import type { ReactNode } from "react";
import { Sidebar } from "@/components/mypage/sidebar/Sidebar";

interface MyPageLayoutProps {
  children: ReactNode;
}

/**
 * My Page 레이아웃
 * - 좌측 사이드바(240px) + 우측 콘텐츠 영역
 * - 모바일(<768px): 사이드바 하단 탭바로 전환
 */
export default function MyPageLayout({ children }: MyPageLayoutProps) {
  return (
    // 사이드바는 독립 rounded 카드 — 전체를 하나로 클립하지 않고 gap으로 분리
    <div className="flex min-h-screen gap-4 bg-background p-4">
      <Sidebar />
      <main className="flex-1 overflow-auto rounded-2xl bg-surface-1 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
