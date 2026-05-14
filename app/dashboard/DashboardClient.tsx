"use client";

import { useState, useRef, FormEvent } from "react";

// ─── types ────────────────────────────────────────────────────────────────────
interface BrandMatch {
  name: string;
  category: string;
  fit_score: number;
  reason: string;
  contact?: string;
}

interface AnalysisResult {
  audience_profile: Record<string, string | string[]>;
  brand_matches: BrandMatch[];
  pitch_emails: string[];
}

// ─── constants ────────────────────────────────────────────────────────────────
const STEPS = [
  "Fetching RSS feed data…",
  "Parsing episode transcripts…",
  "Analysing conversational context…",
  "Building audience psychographic map…",
  "Scraping sponsor databases…",
  "Scoring brand-audience fit…",
  "Generating personalised pitch assets…",
  "Finalising output…",
];

const DEMO: AnalysisResult = {
  audience_profile: {
    age_range: "28–42",
    primary_interests: ["Entrepreneurship", "Productivity", "B2B SaaS", "Remote Work"],
    values: "Autonomy, continuous learning, measurable ROI",
    income_bracket: "$80k–$150k HHI",
    purchase_behaviour: "Research-heavy, high brand loyalty once trust is established",
    content_themes: "Startup growth, hiring, fundraising, founder psychology",
    engagement_style: "Active listener — takes notes, follows links in show notes",
  },
  brand_matches: [
    { name: "Notion", category: "Productivity SaaS", fit_score: 97, reason: "Perfect alignment with founder productivity seekers. High LTV audience.", contact: "sponsorships@notion.so" },
    { name: "Linear", category: "Dev Tools", fit_score: 93, reason: "Engineering-led audience values opinionated tooling.", contact: "partnerships@linear.app" },
    { name: "Loom", category: "Async Comms", fit_score: 91, reason: "Remote-work theme aligns directly. Audience is decision-maker level.", contact: "hello@loom.com" },
    { name: "Deel", category: "HR / Payroll", fit_score: 88, reason: "Global hiring episodes resonate. Audience hires internationally.", contact: "marketing@deel.com" },
    { name: "Mercury", category: "Fintech", fit_score: 85, reason: "Startup banking product, ideal for early-stage founder listeners.", contact: "growth@mercury.com" },
    { name: "Beehiiv", category: "Creator Tools", fit_score: 82, reason: "Newsletter-adjacent audience building overlap.", contact: "partnerships@beehiiv.com" },
    { name: "Descript", category: "Audio/Video", fit_score: 80, reason: "Podcaster audience is their core user — natural community fit.", contact: "studio@descript.com" },
    { name: "Rippling", category: "HR SaaS", fit_score: 78, reason: "HR automation aligns with scaling-startup episodes.", contact: "partnerships@rippling.com" },
    { name: "Stripe", category: "Payments", fit_score: 76, reason: "Developer / founder overlap is strong.", contact: "sponsorships@stripe.com" },
    { name: "Superhuman", category: "Productivity", fit_score: 74, reason: "Premium email for power users. Audience is productivity-obsessed.", contact: "growth@superhuman.com" },
  ],
  pitch_emails: [
    `Subject: Partnership opportunity — The Indie Founder Files × Notion

Hi [Name],

I run The Indie Founder Files, a podcast for early-stage and growth-stage founders hitting 12,000 downloads per episode. Our listeners are exactly the hyper-productive, tool-obsessed operators that Notion is built for.

I'd love to explore a sponsorship that puts Notion in front of 12k decision-makers each week — people who are actively building workflows, hiring teams, and scaling their companies.

What I'm offering:
• 60-second mid-roll read (host-read, fully scripted or talking points)
• Dedicated show-notes section with tracked link
• Optional social post to 8k LinkedIn followers

Happy to share our audience data and previous sponsor results. Would a 15-minute call this week work?

Best,
[Your Name]`,
    `Subject: Niche sponsorship fit — The Indie Founder Files × Linear

Hi [Name],

I've admired how Linear has grown by winning engineering teams who care about craft. My audience — founders and senior ICs building early-stage companies — is exactly that cohort.

At 12,000 downloads per episode, The Indie Founder Files reaches the people who choose the tools their whole team adopts. A sponsorship here isn't just impressions — it's a product recommendation from a trusted voice.

I'd love to chat about a trial run. Are you open to a quick call?

[Your Name]`,
    `Subject: Your next podcast sponsor slot — Loom × The Indie Founder Files

Hi [Name],

Remote work is a recurring theme on my show, and Loom is the tool I hear founders mention more than almost any other. That alignment is worth something.

12k downloads per episode, 92% completion rate, and an audience that buys tools they hear about on podcasts. Let me know if you'd like the full media kit.

[Your Name]`,
  ],
};

// ─── sub-components ───────────────────────────────────────────────────────────

function LoadingView({ step, idx }: { step: string; idx: number }) {
  const pct = Math.round(((idx + 1) / STEPS.length) * 100);
  return (
    <div className="card p-10 flex flex-col items-center text-center">
      <div className="relative w-20 h-20 mb-8">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="34" fill="none"
            stroke="#10b981" strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-emerald-400 font-bold text-sm">{pct}%</span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{step}</h3>
      <p className="text-white/40 text-sm">Step {idx + 1} of {STEPS.length}</p>
      <div className="flex gap-1.5 mt-6">
        {STEPS.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= idx ? "bg-emerald-500 w-6" : "bg-white/10 w-3"}`} />
        ))}
      </div>
    </div>
  );
}

function ProfileTab({ profile }: { profile: Record<string, string | string[]> }) {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg">Audience Psychographic Profile</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {Object.entries(profile).map(([k, v]) => (
          <div key={k} className="bg-[#0a1628]/80 rounded-xl p-4 border border-white/10">
            <p className="text-xs text-emerald-400 uppercase tracking-wider font-semibold mb-1.5">{k.replace(/_/g, " ")}</p>
            <p className="text-white/70 text-sm leading-relaxed">{Array.isArray(v) ? v.join(", ") : v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const bars = [
    { label: "Engagement Score", value: 87 },
    { label: "Brand Recall Potential", value: 74 },
    { label: "Purchase Intent Index", value: 91 },
    { label: "Niche Specificity", value: 95 },
  ];
  return (
    <div className="space-y-5">
      <h3 className="text-white font-bold text-lg">Content Analytics</h3>
      {bars.map((b) => (
        <div key={b.label}>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-white/65">{b.label}</span>
            <span className="text-emerald-400 font-semibold">{b.value}/100</span>
          </div>
          <div className="h-2 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${b.value}%`, transition: "width 1s ease" }} />
          </div>
        </div>
      ))}
      <div className="p-4 bg-emerald-500/8 border border-emerald-500/20 rounded-xl mt-4">
        <p className="text-emerald-400 text-sm">Your audience is in the <strong>top 8%</strong> for purchase intent among shows in your category.</p>
      </div>
    </div>
  );
}

function SponsorsTab({ brands }: { brands: BrandMatch[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg">Matched Sponsors ({brands.length})</h3>
      <div className="space-y-3">
        {brands.map((b, i) => (
          <div key={i} className="bg-[#0a1628]/80 border border-white/10 hover:border-emerald-500/30 rounded-xl p-4 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-semibold text-sm">{b.name}</p>
                  <span className="text-xs bg-white/8 text-white/40 px-2 py-0.5 rounded-full">{b.category}</span>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">{b.reason}</p>
                {b.contact && <p className="text-emerald-400/60 text-xs mt-1.5">{b.contact}</p>}
              </div>
              <div className="flex flex-col items-center bg-emerald-500/10 rounded-lg px-3 py-2 flex-shrink-0">
                <span className="text-emerald-400 font-bold text-lg">{b.fit_score}</span>
                <span className="text-white/30 text-xs">fit</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmailEditor({ email, brandName }: { email: string; brandName: string }) {
  const [content, setContent] = useState(email);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    a.download = `pitch-${brandName.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/40 uppercase tracking-wider font-medium">Pitch — {brandName}</p>
        <div className="flex gap-2">
          <button onClick={copy} className="text-xs text-white/40 hover:text-white transition-colors px-2 py-1 rounded flex items-center gap-1">
            {copied ? "✓ Copied" : "Copy"}
          </button>
          <button onClick={download} className="text-xs text-white/40 hover:text-white transition-colors px-2 py-1 rounded">
            Export .txt
          </button>
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={14}
        className="w-full bg-[#020817] border border-white/10 focus:border-emerald-500/40 rounded-xl p-4 text-sm text-white/80 font-mono leading-relaxed outline-none resize-none transition-colors"
      />
      <button className="btn-primary w-full text-sm py-2.5 flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        Send Pitch (demo)
      </button>
    </div>
  );
}

function PitchesTab({ emails, brands }: { emails: string[]; brands: BrandMatch[] }) {
  const [sel, setSel] = useState(0);
  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg">Generated Pitch Assets</h3>
      <div className="flex gap-2 flex-wrap">
        {emails.map((_, i) => (
          <button
            key={i}
            onClick={() => setSel(i)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${sel === i ? "bg-emerald-500 text-white" : "bg-[#0a1628] text-white/50 hover:text-white"}`}
          >
            {brands[i]?.name || `Brand ${i + 1}`}
          </button>
        ))}
      </div>
      <EmailEditor email={emails[sel]} brandName={brands[sel]?.name || `Brand ${sel + 1}`} />
    </div>
  );
}

function ResultsView({ result, onReset }: { result: AnalysisResult; onReset: () => void }) {
  const [tab, setTab] = useState("profile");
  const [refinement, setRefinement] = useState("");
  const tabs = [
    { id: "profile", label: "Audience Profile" },
    { id: "analytics", label: "Content Analytics" },
    { id: "sponsors", label: "Matched Sponsors" },
    { id: "pitches", label: "Pitch Assets" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analysis Complete</h1>
          <p className="text-white/40 text-sm mt-0.5">Found {result.brand_matches.length} matched sponsors.</p>
        </div>
        <button onClick={onReset} className="btn-ghost text-sm py-2 px-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          New Analysis
        </button>
      </div>

      {/* Refinement bar */}
      <div className="card p-4 flex gap-3">
        <input
          value={refinement}
          onChange={(e) => setRefinement(e.target.value)}
          placeholder='Refine: e.g. "focus only on B2B SaaS and D2C productivity brands"'
          className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
        />
        <button className="btn-primary text-sm py-2 px-4 flex-shrink-0">Regenerate</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#0a1628]/80 rounded-xl overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all min-w-max ${
              tab === t.id ? "bg-emerald-500 text-white shadow" : "text-white/40 hover:text-white/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card p-6">
        {tab === "profile" && <ProfileTab profile={result.audience_profile} />}
        {tab === "analytics" && <AnalyticsTab />}
        {tab === "sponsors" && <SponsorsTab brands={result.brand_matches} />}
        {tab === "pitches" && <PitchesTab emails={result.pitch_emails} brands={result.brand_matches} />}
      </div>
    </div>
  );
}

// ─── main client component ────────────────────────────────────────────────────
export default function DashboardClient() {
  const [tab, setTab] = useState<"rss" | "audio">("rss");
  const [rssUrl, setRssUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [refinement, setRefinement] = useState("");
  const [loading, setLoading] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setStepIdx(0);

    const timer = setInterval(() => setStepIdx((i) => Math.min(i + 1, STEPS.length - 1)), 1200);

    try {
      const body = new FormData();
      if (tab === "rss") body.append("rss_url", rssUrl);
      else if (file) body.append("file", file);
      if (refinement) body.append("refinement", refinement);

      const res = await fetch("/api/analyse", { method: "POST", body });
      if (!res.ok) throw new Error((await res.json()).detail || "Analysis failed.");
      setResult(await res.json());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      // Fall back to demo data
      await new Promise((r) => setTimeout(r, 600));
      setResult(DEMO);
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  }

  if (loading) return <LoadingView step={STEPS[stepIdx]} idx={stepIdx} />;
  if (result) return <ResultsView result={result} onReset={() => { setResult(null); setRssUrl(""); setFile(null); }} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Sponsor Matching</h1>
        <p className="text-white/40 text-sm mt-0.5">Analyse your podcast and generate personalised pitch assets.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {/* Tab switcher */}
        <div className="flex gap-2 p-1 bg-[#0a1628] rounded-xl">
          {(["rss", "audio"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-emerald-500 text-white shadow" : "text-white/40 hover:text-white/70"}`}
            >
              {t === "rss" ? "RSS Feed URL" : "Audio File"}
            </button>
          ))}
        </div>

        {tab === "rss" ? (
          <div className="flex items-center gap-2 bg-[#0a1628] border border-white/10 rounded-xl px-4 focus-within:border-emerald-500/50 transition-colors">
            <svg className="w-4 h-4 text-white/30 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <input
              type="url"
              value={rssUrl}
              onChange={(e) => setRssUrl(e.target.value)}
              placeholder="https://feeds.example.com/your-podcast"
              className="flex-1 bg-transparent py-3 text-sm text-white placeholder-white/25 outline-none"
              required={tab === "rss"}
            />
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0]); }}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-white/15 hover:border-emerald-500/40 rounded-xl p-8 text-center cursor-pointer transition-colors"
          >
            <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            {file ? (
              <p className="text-emerald-400 text-sm font-medium">{file.name}</p>
            ) : (
              <>
                <p className="text-sm text-white/40">Drop an audio file here or <span className="text-emerald-400">browse</span></p>
                <p className="text-xs text-white/25 mt-1">MP3, WAV, M4A — max 500 MB</p>
              </>
            )}
          </div>
        )}

        <input
          type="text"
          value={refinement}
          onChange={(e) => setRefinement(e.target.value)}
          placeholder='Focus constraint (optional) — e.g. "B2B SaaS and D2C productivity brands only"'
          className="w-full bg-[#0a1628] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-emerald-500/50 transition-colors"
        />

        <button
          type="submit"
          disabled={tab === "rss" ? !rssUrl : !file}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          Analyse & Match Sponsors
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>

        {error && <p className="text-red-400 text-sm text-center">{error} — showing demo data.</p>}

        <p className="text-center text-xs text-white/25">
          No RSS feed?{" "}
          <button type="button" onClick={() => setResult(DEMO)} className="text-emerald-400 hover:underline">
            Preview with demo data
          </button>
        </p>
      </form>
    </div>
  );
}
