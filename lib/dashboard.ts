import type { OutreachStatus, WorkspaceSnapshot } from "./types";
import { monthKey, monthLabel } from "./utils";

const STAGES: OutreachStatus[] = ["drafted", "sent", "replied", "won"];

export function buildDashboard(snapshot: WorkspaceSnapshot) {
  const pipeline = STAGES.map((status) => {
    const rows = snapshot.outreach.filter((item) => item.status === status);
    return {
      status,
      count: rows.length,
      valueCents: rows.reduce((sum, row) => sum + row.valueCents, 0),
    };
  });

  const now = new Date();
  const revenue = Array.from({ length: 6 }, (_, index) => {
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5 - index), 1));
    const key = `${start.getUTCFullYear()}-${start.getUTCMonth()}`;
    const wonCents = snapshot.outreach
      .filter((item) => item.status === "won" && item.wonAt && monthKey(item.wonAt) === key)
      .reduce((sum, item) => sum + item.valueCents, 0);
    return { label: monthLabel(start), wonCents };
  });

  const wonCents = snapshot.outreach.filter((item) => item.status === "won").reduce((sum, item) => sum + item.valueCents, 0);
  const open = snapshot.outreach.filter((item) => item.status !== "won");
  return {
    pipeline,
    revenue,
    shows: snapshot.shows.length,
    openCount: open.length,
    openCents: open.reduce((sum, item) => sum + item.valueCents, 0),
    wonCents,
    recent: snapshot.outreach.slice(0, 5),
  };
}
