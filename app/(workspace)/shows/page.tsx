import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { getViewer } from "@/lib/auth";
import { store } from "@/lib/store";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = { title: "Shows" };

export default async function ShowsPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/sign-in");
  const snapshot = await store.snapshot(viewer.userId);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Shows</h1>
          <p className="mt-1 text-sm text-muted-foreground">Each show keeps its audience profile, rate card, and brand list.</p>
        </div>
        <Button asChild>
          <Link href="/shows/new">Add a show</Link>
        </Button>
      </header>
      {snapshot.shows.length === 0 ? (
        <EmptyState
          title="No saved shows"
          body="Add the show you want to pitch from. The audience profile is stored with it."
          actionHref="/shows/new"
          actionLabel="Add a show"
        />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {snapshot.shows.map((show) => {
            const matches = snapshot.brands.filter((brand) => brand.showId === show.id).length;
            return (
              <li key={show.id}>
                <Link href={`/shows/${show.id}`} className="block rounded-xl border bg-card p-5 hover:bg-muted/40">
                  <p className="text-xs text-muted-foreground">{show.category}</p>
                  <h2 className="mt-1 font-display text-2xl">{show.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{show.hostName} · {formatNumber(show.avgDownloads)} downloads</p>
                  <p className="mt-4 text-xs text-muted-foreground">{matches} brand matches · {show.kitPublished ? "Kit public" : "Kit private"}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
