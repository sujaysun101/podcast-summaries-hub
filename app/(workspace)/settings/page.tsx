import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { hasAiKey, aiModel } from "@/lib/ai";
import { hasClerkKeys } from "@/lib/flags";
import { store } from "@/lib/store";

export const metadata: Metadata = { title: "Settings" };

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-3 text-sm last:border-0">
      <span>{label}</span>
      <span className="text-right text-muted-foreground">{value}</span>
    </div>
  );
}

export default function SettingsPage() {
  const database = store.mode() === "postgres" ? "Postgres connected" : "In-memory demo";
  const ai = hasAiKey() ? `Live · ${aiModel()}` : "Sample responses";
  const clerk = hasClerkKeys() ? "Keys configured" : process.env.NODE_ENV === "production" ? "Not configured" : "Keyless in development";
  const limiter = process.env.UPSTASH_REDIS_REST_URL ? "Upstash" : "In-memory token bucket";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="font-display text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">What this deployment is using. Secret values stay on the server.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Connections</CardTitle>
          <CardDescription>Names live in .env.example. Values stay out of the page.</CardDescription>
        </CardHeader>
        <CardContent>
          <Row label="Database" value={database} />
          <Row label="Analysis" value={ai} />
          <Row label="Clerk" value={clerk} />
          <Row label="Rate limit" value={limiter} />
          <Row label="Token cap" value={process.env.AI_MAX_TOKENS || "2800, hard cap 4096"} />
        </CardContent>
      </Card>
    </div>
  );
}
