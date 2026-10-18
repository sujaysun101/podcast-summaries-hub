"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PipelineChart, RevenueChart } from "@/components/charts";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { importDemoAction } from "@/lib/actions";
import type { OutreachItem, Show } from "@/lib/types";
import { money } from "@/lib/utils";

type PipelinePoint = { status: string; count: number; valueCents: number };
type RevenuePoint = { label: string; wonCents: number };

export function DashboardView({
  shows,
  pipeline,
  revenue,
  openCount,
  openCents,
  wonCents,
  recent,
  empty,
}: {
  shows: number;
  pipeline: PipelinePoint[];
  revenue: RevenuePoint[];
  openCount: number;
  openCents: number;
  wonCents: number;
  recent: (OutreachItem & { showTitle: string })[];
  empty: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (empty) {
    return (
      <div className="space-y-4">
        <header>
          <h1 className="font-display text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pipeline, won packages, and the shows you are pitching from.</p>
        </header>
        <EmptyState
          title="No shows in this workspace yet"
          body="Add a show to profile the audience and start a pitch list, or load the sample workspace to click through a full desk."
          actionHref="/shows/new"
          actionLabel="Add a show"
        />
        <div className="flex justify-center">
          <Button
            variant="outline"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const result = await importDemoAction();
              setLoading(false);
              if (!result.ok) {
                toast.error(result.error);
                return;
              }
              toast.success("Sample workspace loaded");
              router.refresh();
            }}
          >
            {loading ? "Loading sample…" : "Load sample workspace"}
          </Button>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Shows", value: String(shows) },
    { label: "Open pitches", value: String(openCount) },
    { label: "Open pipeline", value: money(openCents) },
    { label: "Won packages", value: money(wonCents) },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Where each pitch sits, and what has already closed.</p>
        </div>
        <Button asChild>
          <Link href="/shows/new">Add a show</Link>
        </Button>
      </header>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline</CardTitle>
            <CardDescription>Proposed package value in each stage.</CardDescription>
          </CardHeader>
          <CardContent>
            <PipelineChart data={pipeline} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Won revenue</CardTitle>
            <CardDescription>Closed packages by the month they were marked won.</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenue} />
          </CardContent>
        </Card>
      </section>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Latest pitches</CardTitle>
            <CardDescription>Move them on the outreach board.</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/outreach">Open board</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {recent.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div>
                  <p className="font-medium">{item.brandName}</p>
                  <p className="text-muted-foreground">{item.showTitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span>{money(item.valueCents)}</span>
                  <Badge variant="secondary">{item.status}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export type DashboardShow = Show;
