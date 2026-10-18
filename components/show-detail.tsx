"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { deleteShowAction, draftPitchAction, updateShowAction } from "@/lib/actions";
import type { AudienceProfile, BrandMatch, Show } from "@/lib/types";
import { formatNumber, money } from "@/lib/utils";

const STEPS = [
  "Reading the show",
  "Mapping listener intent",
  "Scoring brand fit",
  "Drafting the first pitches",
];

export function ShowDetail({
  show,
  audience,
  brands,
}: {
  show: Show;
  audience: AudienceProfile | null;
  brands: BrandMatch[];
}) {
  const router = useRouter();
  const [refinement, setRefinement] = useState("");
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [publishing, setPublishing] = useState(false);

  async function analyse() {
    setRunning(true);
    setStep(0);
    const timer = window.setInterval(() => setStep((value) => Math.min(value + 1, STEPS.length - 1)), 900);
    const response = await fetch("/api/analyse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        showId: show.id,
        title: show.title,
        creator: show.hostName,
        description: show.description,
        genre: show.category,
        rss_url: show.rssUrl || undefined,
        refinement: refinement || undefined,
      }),
    });
    window.clearInterval(timer);
    const data = (await response.json()) as { detail?: string; sample?: boolean; sample_label?: string };
    setRunning(false);
    if (!response.ok) {
      toast.error(data.detail ?? "Analysis failed");
      return;
    }
    if (data.sample) toast.message(data.sample_label ?? "Sample analysis");
    else toast.success("Audience profile and brand matches saved");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{show.category} · {show.location}</p>
          <h1 className="font-display text-4xl">{show.title}</h1>
          <p className="mt-1 text-sm">Hosted by {show.hostName}</p>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{show.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={publishing}
            onClick={async () => {
              setPublishing(true);
              const result = await updateShowAction(show.id, { kitPublished: !show.kitPublished });
              setPublishing(false);
              if (!result.ok) {
                toast.error(result.error);
                return;
              }
              toast.success(show.kitPublished ? "Media kit unpublished" : "Media kit is public");
              router.refresh();
            }}
          >
            {show.kitPublished ? "Unpublish kit" : "Publish kit"}
          </Button>
          {show.kitPublished ? (
            <Button variant="outline" asChild>
              <Link href={`/kit/${show.slug}`}>View kit</Link>
            </Button>
          ) : null}
          <Button
            variant="ghost"
            onClick={async () => {
              if (!window.confirm(`Delete ${show.title}? Pitches for this show go with it.`)) return;
              const result = await deleteShowAction(show.id);
              if (!result.ok) {
                toast.error(result.error);
                return;
              }
              toast.success("Show deleted");
              router.push("/shows");
              router.refresh();
            }}
          >
            Delete
          </Button>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <Stat label="Avg. downloads" value={formatNumber(show.avgDownloads)} />
        <Stat label="Episodes" value={`${show.episodeCount} · ${show.cadence}`} />
        <Stat label="Host-read mid-roll" value={money(show.midrollCents)} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Match brands</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={refinement}
            onChange={(event) => setRefinement(event.target.value)}
            placeholder='Optional constraint, e.g. "only tools an owner would buy this quarter"'
            aria-label="Analysis constraint"
          />
          <Button onClick={analyse} disabled={running} className="shrink-0">
            {running ? STEPS[step] : audience ? "Run again" : "Analyse audience"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid items-start gap-4 xl:grid-cols-2">
      {audience ? (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Audience profile</CardTitle>
            {audience.sample ? <Badge variant="gold">Sample profile</Badge> : <Badge variant="secondary">Saved</Badge>}
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Profile label="Age range" value={audience.ageRange} />
            <Profile label="Income" value={audience.incomeBracket} />
            <Profile label="Interests" value={audience.primaryInterests.join(", ")} />
            <Profile label="Values" value={audience.values} />
            <Profile label="How they buy" value={audience.purchaseBehaviour} />
            <Profile label="Themes" value={audience.contentThemes} />
            <Profile label="How they listen" value={audience.engagementStyle} />
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border border-dashed px-6 py-10 text-sm text-muted-foreground">
          No audience profile yet. Run an analysis to save one with this show.
        </div>
      )}

      <section className="space-y-3">
        <h2 className="font-display text-2xl">Brand matches</h2>
        {brands.length ? (
          <ul className="space-y-3">
            {brands.map((brand) => (
              <li key={brand.id} className="rounded-xl border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{brand.name}</p>
                    <p className="text-xs text-muted-foreground">{brand.category} · {brand.contact}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl text-primary">{brand.fitScore}</p>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Fit</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${brand.fitScore}%` }} />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{brand.reason}</p>
                <Button
                  size="sm"
                  className="mt-3"
                  variant="outline"
                  onClick={async () => {
                    const result = await draftPitchAction(show.id, brand.id);
                    if (!result.ok) {
                      toast.error(result.error);
                      return;
                    }
                    toast.success(result.sample ? "Sample pitch drafted" : "Pitch drafted");
                    router.push("/outreach");
                    router.refresh();
                  }}
                >
                  Draft pitch
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Brand matches appear here after an analysis.</p>
        )}
      </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

function Profile({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}
