"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createShowAction } from "@/lib/actions";

type Lookup = { id: string; title: string; creator: string; feedUrl: string; genre: string };

const empty = {
  title: "",
  hostName: "",
  description: "",
  category: "",
  rssUrl: "",
  website: "",
  avgDownloads: "5000",
  episodeCount: "20",
  cadence: "Weekly",
  location: "",
};

export function ShowForm() {
  const router = useRouter();
  const [form, setForm] = useState(empty);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Lookup[]>([]);
  const [pending, setPending] = useState(false);
  const [looking, setLooking] = useState(false);

  function set<K extends keyof typeof empty>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function lookup() {
    setLooking(true);
    const response = await fetch(`/api/search?platform=podcast&q=${encodeURIComponent(query)}`);
    const data = (await response.json()) as { results?: Lookup[]; detail?: string };
    setLooking(false);
    if (!response.ok) {
      toast.error(data.detail ?? "Lookup failed");
      return;
    }
    setResults(data.results ?? []);
    if (!data.results?.length) toast.message(data.detail ?? "No shows matched that search.");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    const result = await createShowAction({
      ...form,
      avgDownloads: Number(form.avgDownloads),
      episodeCount: Number(form.episodeCount),
    });
    setPending(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Show saved");
    router.push(`/shows/${result.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4 rounded-xl border bg-card p-5">
        <div>
          <h1 className="font-display text-3xl">Add a show</h1>
          <p className="mt-1 text-sm text-muted-foreground">Save the show first. Audience matching runs on the next screen.</p>
        </div>
        <Field label="Show title" value={form.title} onChange={(value) => set("title", value)} required />
        <Field label="Host" value={form.hostName} onChange={(value) => set("hostName", value)} required />
        <div className="space-y-1.5">
          <Label htmlFor="description">What the show is actually about</Label>
          <Textarea id="description" value={form.description} onChange={(event) => set("description", event.target.value)} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category" value={form.category} onChange={(value) => set("category", value)} required />
          <Field label="Location" value={form.location} onChange={(value) => set("location", value)} />
          <Field label="Cadence" value={form.cadence} onChange={(value) => set("cadence", value)} />
          <Field label="Average downloads" value={form.avgDownloads} onChange={(value) => set("avgDownloads", value)} type="number" />
          <Field label="Episodes" value={form.episodeCount} onChange={(value) => set("episodeCount", value)} type="number" />
          <Field label="Website" value={form.website} onChange={(value) => set("website", value)} placeholder="https://" />
        </div>
        <Field label="RSS feed" value={form.rssUrl} onChange={(value) => set("rssUrl", value)} placeholder="https://example.com/feed.xml" />
        <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save show"}</Button>
      </div>
      <aside className="space-y-3 rounded-xl border bg-card p-5">
        <h2 className="font-display text-xl">Look up a podcast</h2>
        <p className="text-sm text-muted-foreground">Apple’s public podcast catalog. It fills the title, host, category, and RSS when a feed is listed.</p>
        <div className="flex gap-2">
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Show or host name" aria-label="Podcast search" />
          <Button type="button" variant="outline" onClick={lookup} disabled={looking || query.trim().length < 2}>
            {looking ? "…" : "Search"}
          </Button>
        </div>
        <ul className="space-y-2">
          {results.map((result) => (
            <li key={result.id}>
              <button
                type="button"
                className="w-full rounded-lg border px-3 py-2 text-left text-sm hover:bg-muted"
                onClick={() => {
                  set("title", result.title);
                  set("hostName", result.creator);
                  set("category", result.genre || form.category);
                  if (result.feedUrl) set("rssUrl", result.feedUrl);
                  if (!form.description) set("description", `${result.title} with ${result.creator}. Add a few sentences about who the episodes are for.`);
                }}
              >
                <span className="block font-medium">{result.title}</span>
                <span className="text-muted-foreground">{result.creator} · {result.genre}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} placeholder={placeholder} required={required} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
