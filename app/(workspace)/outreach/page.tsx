import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OutreachBoard } from "@/components/outreach-board";
import { getViewer } from "@/lib/auth";
import { store } from "@/lib/store";

export const metadata: Metadata = { title: "Outreach" };

export default async function OutreachPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/sign-in");
  const snapshot = await store.snapshot(viewer.userId);
  const items = snapshot.outreach.map((item) => ({
    ...item,
    showTitle: snapshot.shows.find((show) => show.id === item.showId)?.title ?? "Show",
  }));
  return <OutreachBoard items={items} />;
}
