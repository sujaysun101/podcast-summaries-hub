"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { updateOutreachAction } from "@/lib/actions";
import { OUTREACH_STATUSES, type OutreachItem, type OutreachStatus } from "@/lib/types";
import { money } from "@/lib/utils";

const labels: Record<OutreachStatus, string> = {
  drafted: "Drafted",
  sent: "Sent",
  replied: "Replied",
  won: "Won",
};

export function OutreachBoard({ items }: { items: (OutreachItem & { showTitle: string })[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(items);
  const [active, setActive] = useState<(OutreachItem & { showTitle: string }) | null>(null);
  const [body, setBody] = useState("");

  async function move(id: string, status: OutreachStatus) {
    const previous = rows;
    setRows((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
    const result = await updateOutreachAction(id, { status });
    if (!result.ok) {
      setRows(previous);
      toast.error(result.error);
      return;
    }
    router.refresh();
  }

  if (!rows.length) {
    return (
      <EmptyState
        title="No pitches yet"
        body="Open a show, run a match, and draft a pitch. It lands in Drafted so you can move it when you actually send it."
        actionHref="/shows"
        actionLabel="Go to shows"
      />
    );
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-display text-3xl">Outreach</h1>
        <p className="mt-1 text-sm text-muted-foreground">Drag a card to the next stage, or use the stage buttons.</p>
      </header>
      <div className="grid gap-3 xl:grid-cols-4">
        {OUTREACH_STATUSES.map((status) => (
          <section
            key={status}
            className="rounded-xl border bg-muted/40 p-3"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              const id = event.dataTransfer.getData("text/plain");
              if (id) void move(id, status);
            }}
          >
            <header className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-medium">{labels[status]}</h2>
              <span className="text-xs text-muted-foreground">{rows.filter((item) => item.status === status).length}</span>
            </header>
            <ul className="space-y-2">
              {rows
                .filter((item) => item.status === status)
                .map((item) => (
                  <li
                    key={item.id}
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData("text/plain", item.id)}
                    className="cursor-grab rounded-lg border bg-card p-3 active:cursor-grabbing"
                  >
                    <button
                      className="w-full text-left"
                      onClick={() => {
                        setActive(item);
                        setBody(item.body);
                      }}
                    >
                      <p className="font-medium">{item.brandName}</p>
                      <p className="text-xs text-muted-foreground">{item.showTitle}</p>
                      <p className="mt-2 text-sm">{money(item.valueCents)}</p>
                    </button>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {OUTREACH_STATUSES.filter((next) => next !== status).map((next) => (
                        <Button key={next} size="sm" variant="ghost" className="h-7 px-2 text-[11px]" onClick={() => move(item.id, next)}>
                          {labels[next]}
                        </Button>
                      ))}
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{active?.brandName}</DialogTitle>
          </DialogHeader>
          {active ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{active.subject}</p>
              <Textarea value={body} onChange={(event) => setBody(event.target.value)} rows={12} aria-label="Pitch email" />
              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    const result = await updateOutreachAction(active.id, { body });
                    if (!result.ok) {
                      toast.error(result.error);
                      return;
                    }
                    setRows((current) => current.map((item) => (item.id === active.id ? { ...item, body } : item)));
                    toast.success("Pitch saved");
                    setActive(null);
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await navigator.clipboard.writeText(`Subject: ${active.subject}\n\n${body}`);
                    toast.success("Copied");
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
