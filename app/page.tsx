import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, ClerkLoaded } from "@clerk/nextjs";


const features = [
  {
    step: "01",
    title: "Psychographic Audience Analysis",
    description:
      "We ingest your RSS feed and recent transcripts, then map the deep interests, values, and buying behaviours of your listeners — not just age and gender.",
    bullets: ["Content theme extraction", "Listener persona generation", "Engagement signal scoring"],
  },
  {
    step: "02",
    title: "AI Brand Matching & Lead Gen",
    description:
      "Our model cross-references your audience profile against thousands of brands actively looking for niche podcast placements. No cold Googling required.",
    bullets: ["Real-time brand database scan", "Fit-score ranking 0–100", "Direct decision-maker contacts"],
  },
  {
    step: "03",
    title: "Personalised Pitch Decks & Outreach",
    description:
      "Generate a full sponsor pitch and bespoke cold emails for each matched brand in seconds. Edit inline, export as text, or send directly.",
    bullets: ["Per-brand email personalisation", "Follow-up sequence drafts", "One-click export"],
  },
];

const testimonials = [
  {
    name: "Priya Menon",
    show: "The Indie Founder Files",
    downloads: "12k / ep",
    quote:
      "I landed a $4,800/month sponsorship within two weeks. The pitch email YieldCast wrote was better than anything I could have drafted myself.",
  },
  {
    name: "Marcus Webb",
    show: "Dark Matter Finance",
    downloads: "28k / ep",
    quote:
      "The audience psychographic report alone is worth the subscription. I finally had data to back up why my listeners convert better than a show 10× my size.",
  },
  {
    name: "Chiara Romano",
    show: "Slow Burn Wellness",
    downloads: "7k / ep",
    quote:
      "I used to spend 6 hours a week chasing sponsors. YieldCast cut that to 20 minutes. The brand matches are scarily accurate for my niche.",
  },
];

const stats = [
  { value: "$2.4M", label: "Sponsorship revenue unlocked" },
  { value: "340+", label: "Independent shows onboarded" },
  { value: "18 days", label: "Avg. time to first deal" },
  { value: "94%", label: "Brand match accuracy" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020817] overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[#020817]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
            YieldCast
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Stories</a>
          </div>
          <div className="flex items-center gap-3">
            <ClerkLoaded>
              <SignInButton mode="redirect">
                <button className="btn-ghost text-sm py-2 px-4">Log in</button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <button className="btn-primary text-sm py-2 px-4">Get started free</button>
              </SignUpButton>
              <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
            </ClerkLoaded>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-24 px-4 flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)" }} />

        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-4 py-1.5 text-emerald-400 text-sm font-medium mb-8">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Now in public beta — 14 days free
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight max-w-4xl">
          Stop pitching cold.{" "}
          <span className="text-emerald-400">Start closing sponsors.</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-white/55 max-w-2xl leading-relaxed">
          YieldCast analyses your podcast content, profiles your audience, matches you with niche brands,
          and writes the pitch — so you can monetise the engaged community you&apos;ve already built.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
            Generate Your First Pitch Deck
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <button className="btn-ghost flex items-center gap-2 text-base">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            See a live demo
          </button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-3xl">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-emerald-400">{s.value}</span>
              <span className="text-white/40 text-sm mt-1 text-center">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Three steps from transcript{" "}
              <span className="text-white/40">to signed deal.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.step} className="card p-7 group hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1">
                <span className="text-4xl font-black text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors">{f.step}</span>
                <h3 className="text-xl font-bold text-white mt-3 mb-3">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-5">{f.description}</p>
                <ul className="space-y-2">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-white/65">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 bg-[#0a1628]/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">Creator stories</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Built for shows like yours.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-7 flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-emerald-400 fill-emerald-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/35 text-xs mt-0.5">{t.show}</p>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-medium">
                    {t.downloads}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card p-12 relative overflow-hidden" style={{ boxShadow: "0 0 80px -20px rgba(16,185,129,0.2)" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Your audience is already worth{" "}
              <span className="text-emerald-400">more than you think.</span>
            </h2>
            <p className="text-white/50 mb-8 text-lg">
              Stop leaving sponsorship revenue on the table because you don&apos;t have time to pitch. Let the AI do the work.
            </p>
            <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4">
              Generate Your First Pitch Deck
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <p className="text-white/25 text-xs mt-4">No credit card required · 14-day free trial</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-sm">
          <div className="font-bold text-white/50 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
            YieldCast
          </div>
          <p>© 2025 YieldCast. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
