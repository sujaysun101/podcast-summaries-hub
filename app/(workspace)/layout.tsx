import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getViewer } from "@/lib/auth";
import { clerkUiEnabled } from "@/lib/flags";
import { store } from "@/lib/store";

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  const viewer = await getViewer();
  if (!viewer) redirect("/sign-in");
  const snapshot = await store.snapshot(viewer.userId);
  const banner = viewer.demoData
    ? "Demo data — stored in memory for this process. Set DATABASE_URL to keep it in Postgres."
    : viewer.mode === "preview"
      ? "Preview workspace. Clerk keys are not set, so sign-in is not required."
      : undefined;

  return (
    <AppShell
      clerk={clerkUiEnabled()}
      banner={banner}
      shows={snapshot.shows.map((show) => ({ href: `/shows/${show.id}`, label: show.title }))}
    >
      {children}
    </AppShell>
  );
}
