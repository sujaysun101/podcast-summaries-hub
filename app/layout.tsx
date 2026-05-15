import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "YieldCast — AI Sponsor Matching for Podcasters",
  description: "Stop pitching cold. YieldCast analyses your podcast, profiles your audience, matches you with niche brands, and writes the pitch.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
