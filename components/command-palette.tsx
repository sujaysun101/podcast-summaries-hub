"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Item = { href: string; label: string; hint: string };

export function CommandPalette({
  shows,
  open,
  onOpenChange,
}: {
  shows: { href: string; label: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpenChange, open]);

  const items = useMemo<Item[]>(() => {
    const base: Item[] = [
      { href: "/dashboard", label: "Dashboard", hint: "Pipeline and revenue" },
      { href: "/shows", label: "Shows", hint: "Saved shows" },
      { href: "/shows/new", label: "Add a show", hint: "New workspace" },
      { href: "/outreach", label: "Outreach", hint: "Kanban" },
      { href: "/settings", label: "Settings", hint: "Connections" },
      ...shows.map((show) => ({ href: show.href, label: show.label, hint: "Show" })),
    ];
    const q = query.trim().toLowerCase();
    return q ? base.filter((item) => item.label.toLowerCase().includes(q)) : base;
  }, [query, shows]);

  return (
    <Dialog
        open={open}
        onOpenChange={(next) => {
          onOpenChange(next);
          if (!next) setQuery("");
        }}
      >
      <DialogContent className="p-3" aria-label="Command palette">
        <DialogTitle className="sr-only">Jump to</DialogTitle>
        <Input
          autoFocus
          placeholder="Jump to a page or show"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search pages and shows"
        />
        <ul className="mt-2 max-h-72 overflow-auto">
          {items.map((item) => (
            <li key={item.href}>
              <button
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                onClick={() => {
                  onOpenChange(false);
                  setQuery("");
                  router.push(item.href);
                }}
              >
                <span>{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.hint}</span>
              </button>
            </li>
          ))}
          {!items.length ? <li className="px-3 py-6 text-center text-sm text-muted-foreground">Nothing matches.</li> : null}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
