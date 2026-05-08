import type { ReactNode } from "react";
import { Sidebar } from "@/components/mypage/sidebar/Sidebar";

interface MyPageLayoutProps {
  children: ReactNode;
}

/**
 * My Page layout
 * - Left sidebar (240px) + right content area
 * - Mobile (<768px): sidebar switches to bottom tab bar
 */
export default function MyPageLayout({ children }: MyPageLayoutProps) {
  return (
    // Sidebar is an independent rounded card — separated with gap, not clipped as one
    <div className="flex min-h-[calc(100vh-56px)] gap-4 bg-background p-4">
      <Sidebar />
      <main className="flex-1 overflow-auto rounded-2xl bg-surface-1 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
