import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { clerkUiEnabled } from "@/lib/flags";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "YieldCast — sponsor matching for independent shows",
    template: "%s · YieldCast",
  },
  description: "Profile a podcast audience, rank brand fits, draft the pitch, and track who replied.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "YieldCast",
    description: "Sponsor matching for independent podcasters.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const inner = (
    <html lang="en" className={`dark ${outfit.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
  if (!clerkUiEnabled()) return inner;
  return <ClerkProvider>{inner}</ClerkProvider>;
}
