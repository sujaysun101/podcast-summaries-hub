import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardView } from "@/components/dashboard-view";
import { getViewer } from "@/lib/auth";
import { buildDashboard } from "@/lib/dashboard";
import { store } from "@/lib/store";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/sign-in");
  const snapshot = await store.snapshot(viewer.userId);
  const dashboard = buildDashboard(snapshot);
  const recent = dashboard.recent.map((item) => ({
    ...item,
    showTitle: snapshot.shows.find((show) => show.id === item.showId)?.title ?? "Show",
  }));

  return (
    <DashboardView
      shows={dashboard.shows}
      pipeline={dashboard.pipeline}
      revenue={dashboard.revenue}
      openCount={dashboard.openCount}
      openCents={dashboard.openCents}
      wonCents={dashboard.wonCents}
      recent={recent}
      empty={snapshot.shows.length === 0}
    />
  );
}
