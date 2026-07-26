import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RankAura — Your AI Growth Engine",
  description: "We Help Grow Businesses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f3f5f7] antialiased">{children}</body>
    </html>
  );
}
