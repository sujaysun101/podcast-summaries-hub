"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Menu, Mic2, Search, Send, Settings } from "lucide-react";
import { useState } from "react";
import { CommandPalette } from "@/components/command-palette";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/shows", label: "Shows", icon: Mic2 },
  { href: "/outreach", label: "Outreach", icon: Send },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1" aria-label="Workspace">
      {links.map((link) => {
        const active = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
              active ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  children,
  shows,
  clerk,
  banner,
}: {
  children: React.ReactNode;
  shows: { href: string; label: string }[];
  clerk: boolean;
  banner?: string;
}) {
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r bg-sidebar px-3 py-4 lg:flex">
        <Link href="/" className="px-2 py-1">
          <Logo />
        </Link>
        <div className="mt-6 flex-1">
          <NavLinks />
        </div>
        <p className="px-3 text-xs text-muted-foreground">Sponsor desk for independent shows.</p>
      </aside>
      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur md:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent aria-label="Navigation">
              <Logo className="mb-6" />
              <NavLinks onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <Button variant="outline" size="sm" className="hidden text-muted-foreground sm:inline-flex" onClick={() => setPalette(true)}>
            <Search className="h-3.5 w-3.5" />
            Search
            <kbd className="rounded border px-1 text-[10px]">⌘K</kbd>
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {clerk ? (
              <UserMenu />
            ) : (
              <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">Demo host</span>
            )}
          </div>
        </header>
        {banner ? (
          <p className="border-b bg-accent/40 px-4 py-2 text-center text-xs text-accent-foreground md:px-8">{banner}</p>
        ) : null}
        <main className="px-4 py-6 md:px-8">{children}</main>
      </div>
      <CommandPalette shows={shows} open={palette} onOpenChange={setPalette} />
    </div>
  );
}
