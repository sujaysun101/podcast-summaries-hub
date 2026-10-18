"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, AudioLines, Mail, Waypoints } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: AudioLines,
    title: "An audience profile that sounds like the show",
    body: "YieldCast reads the description and recent episodes, then writes who listens, what they buy, and how they pay attention.",
  },
  {
    icon: Waypoints,
    title: "Brand fits with a score and a reason",
    body: "Each match names the overlap. A 90 means the product already belongs in the conversation, not that the category is adjacent.",
  },
  {
    icon: Mail,
    title: "A pitch you can move",
    body: "Draft the email, then track it from drafted to sent, replied, and won. The dashboard charts that pipeline.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/kit/kitchen-ledger" className="hidden px-3 text-muted-foreground hover:text-foreground sm:inline">
            Sample kit
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Create account</Link>
          </Button>
        </nav>
      </header>
      <main>
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 md:pt-24">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">For independent podcasters</p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] md:text-7xl">
              Match sponsors to the show you already make.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              YieldCast keeps a show’s audience profile, ranks brand fits, drafts the pitch, and tracks the reply. The work stays in one desk.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Open the workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/kit/kitchen-ledger">Read a media kit</Link>
              </Button>
            </div>
          </motion.div>
        </section>
        <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-20 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 * index }}
                className="rounded-2xl border bg-card p-6"
              >
                <Icon className="h-5 w-5 text-primary" aria-hidden />
                <h2 className="mt-4 font-display text-2xl">{feature.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
              </motion.article>
            );
          })}
        </section>
      </main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground">
          <Logo />
          <p>Sponsor matching for shows that are too specific for a template.</p>
        </div>
      </footer>
    </div>
  );
}
