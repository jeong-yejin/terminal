import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReboundX",
  description: "Crypto trading rebate platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="eng" className="dark">
      <body className="bg-background font-sans text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
