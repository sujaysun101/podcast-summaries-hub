import { Logo } from "@/components/logo";
import type { PublicKit } from "@/lib/types";
import { formatNumber, money } from "@/lib/utils";

export function MediaKitView({ kit }: { kit: PublicKit }) {
  const { show, audience } = kit;
  const rates = [
    { label: "Pre-roll, 30 seconds", value: show.prerollCents },
    { label: "Host-read mid-roll, 60 seconds", value: show.midrollCents },
    { label: "Newsletter mention", value: show.newsletterCents },
  ];
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <header className="overflow-hidden rounded-2xl border bg-card">
        <div className="bg-primary/15 px-6 py-8">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Media kit</p>
          <h1 className="mt-2 font-display text-5xl">{show.title}</h1>
          <p className="mt-2 text-sm">Hosted by {show.hostName} · {show.location}</p>
        </div>
        <div className="grid gap-4 px-6 py-5 sm:grid-cols-3">
          <Fact label="Average downloads" value={formatNumber(show.avgDownloads)} />
          <Fact label="Cadence" value={`${show.cadence} · ${show.episodeCount} episodes`} />
          <Fact label="Category" value={show.category} />
        </div>
      </header>
      <p className="mt-8 text-base leading-relaxed">{show.description}</p>
      {audience ? (
        <section className="mt-8">
          <h2 className="font-display text-2xl">Who listens</h2>
          {audience.sample ? <p className="mt-1 text-xs text-muted-foreground">Sample profile — replace it with a live analysis before you send this page.</p> : null}
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <Fact label="Age range" value={audience.ageRange} />
            <Fact label="Income" value={audience.incomeBracket} />
            <Fact label="Interests" value={audience.primaryInterests.join(", ")} />
            <Fact label="Values" value={audience.values} />
            <Fact label="How they buy" value={audience.purchaseBehaviour} />
            <Fact label="How they listen" value={audience.engagementStyle} />
          </dl>
        </section>
      ) : null}
      <section className="mt-8">
        <h2 className="font-display text-2xl">Per episode</h2>
        <ul className="mt-4 divide-y rounded-xl border">
          {rates.map((rate) => (
            <li key={rate.label} className="flex items-center justify-between px-4 py-3 text-sm">
              <span>{rate.label}</span>
              <span className="font-medium">{money(rate.value)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">Rates are what the host entered for a single episode. Multi-episode packages are negotiated separately.</p>
      </section>
      <footer className="mt-12 flex items-center justify-between border-t pt-6 text-sm text-muted-foreground">
        <Logo />
        <span>Prepared for sponsors</span>
      </footer>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm">{value}</dd>
    </div>
  );
}
