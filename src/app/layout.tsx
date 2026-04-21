import type { Metadata } from "next";
import "./globals.css";
import { GNB } from "@/components/layout/GNB";

export const metadata: Metadata = {
  title: "ReboundX Terminal",
  description: "Crypto trading rebate platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background font-sans text-text-primary antialiased">
        <GNB />
        {/* pt-14 = 56px GNB height */}
        <div className="pt-14">
          {children}
        </div>
      </body>
    </html>
  );
}
