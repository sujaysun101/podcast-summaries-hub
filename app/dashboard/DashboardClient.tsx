"use client";

import { useState, useRef, useCallback } from "react";

// ─── types ─────────────────────────────────────────────────────────────────
type Platform = "youtube" | "spotify" | "rumble";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  creator: string;
  platform: Platform;
  url: string;
  duration?: string;
  metadata?: Record<string, string>;
}

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
  _meta?: { title: string; creator: string; thumbnail: string; platform: string };
}

// ─── constants ──────────────────────────────────────────────────────────────
const STEPS = [
  "Fetching content metadata…",
  "Parsing topic & theme signals…",
  "Analysing conversational context…",
  "Building psychographic listener map…",
  "Cross-referencing sponsor database…",
  "Scoring brand-audience fit…",
  "Drafting personalised pitch assets…",
  "Finalising output…",
];

const PLATFORMS = [
  { id: "youtube" as Platform, label: "YouTube", color: "#FF0000", icon: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" },
  { id: "spotify" as Platform, label: "Podcasts", color: "#1DB954", icon: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" },
  { id: "rumble" as Platform, label: "Rumble", color: "#85C742", icon: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.5 10.5l-5 3a.5.5 0 01-.5-.866V9.366a.5.5 0 01.5-.866l5 3a.5.5 0 010 .866z" },
];

const DEMO: AnalysisResult = {
  _meta: { title: "The Indie Founder Files", creator: "Priya Menon", thumbnail: "", platform: "youtube" },
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
    { name: "Loom", category: "Async Comms", fit_score: 91, reason: "Remote-work theme aligns directly. Decision-maker level audience.", contact: "hello@loom.com" },
    { name: "Deel", category: "HR / Payroll", fit_score: 88, reason: "Global hiring episodes resonate. Audience hires internationally.", contact: "marketing@deel.com" },
    { name: "Mercury", category: "Fintech", fit_score: 85, reason: "Startup banking, ideal for early-stage founder listeners.", contact: "growth@mercury.com" },
    { name: "Beehiiv", category: "Creator Tools", fit_score: 82, reason: "Newsletter-adjacent audience overlap.", contact: "partnerships@beehiiv.com" },
    { name: "Descript", category: "Audio/Video", fit_score: 80, reason: "Podcaster audience is their core user.", contact: "studio@descript.com" },
    { name: "Rippling", category: "HR SaaS", fit_score: 78, reason: "HR automation aligns with scaling-startup episodes.", contact: "partnerships@rippling.com" },
    { name: "Stripe", category: "Payments", fit_score: 76, reason: "Developer / founder overlap is strong.", contact: "sponsorships@stripe.com" },
    { name: "Superhuman", category: "Productivity", fit_score: 74, reason: "Premium email for power users — productivity-obsessed audience.", contact: "growth@superhuman.com" },
  ],
  pitch_emails: [
    `Subject: Partnership opportunity — The Indie Founder Files × Notion\n\nHi [Name],\n\nI run The Indie Founder Files, a podcast for growth-stage founders hitting 12,000 downloads per episode. Our listeners are the hyper-productive operators that Notion is built for.\n\nI'd love to explore a sponsorship that puts Notion in front of 12k decision-makers each week.\n\nWhat I'm offering:\n• 60-second mid-roll read (host-read)\n• Dedicated show-notes section with tracked link\n• Optional social post to 8k LinkedIn followers\n\nWould a 15-minute call this week work?\n\nBest,\n[Your Name]`,
    `Subject: Niche fit — The Indie Founder Files × Linear\n\nHi [Name],\n\nMy audience — founders and senior ICs at early-stage companies — are exactly the people who choose the tools their whole team adopts.\n\nAt 12,000 downloads per episode, a sponsorship here is a product recommendation from a trusted voice, not just impressions.\n\nOpen to a quick call?\n\n[Your Name]`,
    `Subject: Sponsor slot — The Indie Founder Files × Loom\n\nHi [Name],\n\nRemote work is a recurring theme on my show, and Loom is the tool founders mention more than almost any other.\n\n12k downloads per episode, 92% completion rate, decision-maker audience. Happy to share the full media kit.\n\n[Your Name]`,
  ],
};

// ─── helpers ────────────────────────────────────────────────────────────────
function saveToHistory(result: AnalysisResult) {
  try {
    const history = JSON.parse(localStorage.getItem("yc_history") || "[]");
    history.unshift({ ...result, _savedAt: Date.now() });
    localStorage.setItem("yc_history", JSON.stringify(history.slice(0, 20)));
  } catch {}
}

// ─── sub-components ─────────────────────────────────────────────────────────

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-white/55">{label}</span>
        <span className="text-emerald-400 font-semibold">{value}</span>
      </div>
      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function EmailEditor({ email, brandName }: { email: string; brandName: string }) {
  const [content, setContent] = useState(email);
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    a.download = `pitch-${brandName.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40 font-medium uppercase tracking-wider">Pitch — {brandName}</span>
        <div className="flex gap-1">
          <button onClick={copy} className="text-xs text-white/40 hover:text-emerald-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/5">{copied ? "✓ Copied" : "Copy"}</button>
          <button onClick={download} className="text-xs text-white/40 hover:text-emerald-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/5">Export</button>
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={12}
        className="w-full bg-[#020817] border border-white/10 focus:border-emerald-500/30 rounded-xl p-4 text-sm text-white/80 font-mono leading-relaxed outline-none resize-none transition-colors"
      />
      <button className="btn-primary w-full text-sm py-2.5 flex items-center justify-center gap-2">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        Send Pitch
      </button>
    </div>
  );
}

function ResultsView({ result, onReset }: { result: AnalysisResult; onReset: () => void }) {
  const [tab, setTab] = useState("profile");
  const [emailIdx, setEmailIdx] = useState(0);
  const [refinement, setRefinement] = useState("");
  const { audience_profile: ap, brand_matches: brands, pitch_emails: emails, _meta } = result;

  const TABS = [
    { id: "profile", label: "Audience Profile" },
    { id: "analytics", label: "Analytics" },
    { id: "sponsors", label: `Sponsors (${brands.length})` },
    { id: "pitches", label: "Pitch Assets" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Content header */}
      {_meta?.title && (
        <div className="card p-4 flex items-center gap-4">
          {_meta.thumbnail && (
            <img src={_meta.thumbnail} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-white/5" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{_meta.title}</p>
            <p className="text-white/40 text-xs">{_meta.creator} · {_meta.platform}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-full font-medium">
              {brands.length} matches
            </span>
            <button onClick={onReset} className="text-xs text-white/30 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
              ← New search
            </button>
          </div>
        </div>
      )}

      {/* Refinement */}
      <div className="flex gap-2">
        <input
          value={refinement}
          onChange={(e) => setRefinement(e.target.value)}
          placeholder='Refine: "focus only on B2B SaaS and D2C productivity brands"'
          className="flex-1 bg-[#0a1628] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-emerald-500/30 transition-colors"
        />
        <button className="btn-primary text-sm py-2.5 px-4 flex-shrink-0">Regenerate</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#0a1628] rounded-xl">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${tab === t.id ? "bg-emerald-500 text-white" : "text-white/40 hover:text-white/70"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="card p-5">
        {tab === "profile" && (
          <div className="grid sm:grid-cols-2 gap-3">
            {Object.entries(ap).map(([k, v]) => (
              <div key={k} className="bg-[#0a1628]/80 rounded-xl p-3 border border-white/8">
                <p className="text-xs text-emerald-400 uppercase tracking-wider font-semibold mb-1">{k.replace(/_/g, " ")}</p>
                <p className="text-white/70 text-sm leading-relaxed">{Array.isArray(v) ? v.join(", ") : v}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "analytics" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[["Eng. Score", 87], ["Recall Potential", 74], ["Purchase Intent", 91], ["Niche Specificity", 95]].map(([l, v]) => (
                <div key={l} className="bg-[#0a1628] rounded-xl p-3 text-center border border-white/8">
                  <p className="text-2xl font-black text-emerald-400">{v}</p>
                  <p className="text-white/40 text-xs mt-0.5">{l}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <StatBar label="Engagement Score" value={87} />
              <StatBar label="Brand Recall Potential" value={74} />
              <StatBar label="Purchase Intent Index" value={91} />
              <StatBar label="Niche Specificity" value={95} />
              <StatBar label="Conversion Likelihood" value={83} />
            </div>
            <div className="p-3 bg-emerald-500/8 border border-emerald-500/20 rounded-xl">
              <p className="text-emerald-400 text-xs">Top <strong>8%</strong> for purchase intent in your category. Audience LTV estimated at <strong>$4,200+</strong>/listener.</p>
            </div>
          </div>
        )}

        {tab === "sponsors" && (
          <div className="space-y-2">
            {brands.map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-[#0a1628]/80 rounded-xl border border-white/8 hover:border-emerald-500/25 transition-all group">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 flex-shrink-0 text-xs font-black text-emerald-400">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white font-semibold text-sm">{b.name}</p>
                    <span className="text-xs text-white/30 bg-white/5 px-1.5 py-0.5 rounded-md">{b.category}</span>
                  </div>
                  <p className="text-white/45 text-xs leading-relaxed">{b.reason}</p>
                  {b.contact && <p className="text-emerald-400/50 text-xs mt-1">{b.contact}</p>}
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-emerald-400 font-black text-lg leading-none">{b.fit_score}</p>
                  <p className="text-white/25 text-xs">fit</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "pitches" && (
          <div className="space-y-3">
            <div className="flex gap-1.5 flex-wrap">
              {emails.map((_, i) => (
                <button key={i} onClick={() => setEmailIdx(i)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${emailIdx === i ? "bg-emerald-500 text-white" : "bg-[#0a1628] text-white/50 hover:text-white"}`}>
                  {brands[i]?.name || `Brand ${i + 1}`}
                </button>
              ))}
            </div>
            <EmailEditor email={emails[emailIdx]} brandName={brands[emailIdx]?.name || `Brand ${emailIdx + 1}`} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Search card ─────────────────────────────────────────────────────────────
function SearchCard({ item, onAnalyse, loading }: { item: SearchResult; onAnalyse: (item: SearchResult) => void; loading: boolean }) {
  return (
    <div className="group relative bg-[#0a1628] border border-white/8 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all duration-200">
      <div className="relative aspect-video bg-white/5 overflow-hidden">
        {item.thumbnail ? (
          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white/15" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        )}
        {item.duration && (
          <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">{item.duration}</span>
        )}
      </div>
      <div className="p-3">
        <p className="text-white text-sm font-medium line-clamp-2 leading-snug mb-1">{item.title}</p>
        <p className="text-white/40 text-xs truncate">{item.creator}</p>
        <button
          onClick={() => onAnalyse(item)}
          disabled={loading}
          className="mt-3 w-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/25 hover:border-transparent text-xs font-semibold py-2 rounded-lg transition-all duration-200 disabled:opacity-40"
        >
          {loading ? "Analysing…" : "Analyse for Sponsors →"}
        </button>
      </div>
    </div>
  );
}

// ─── Loading view ────────────────────────────────────────────────────────────
function LoadingView({ step, idx }: { step: string; idx: number }) {
  const pct = Math.round(((idx + 1) / STEPS.length) * 100);
  return (
    <div className="card p-10 flex flex-col items-center text-center">
      <div className="relative w-16 h-16 mb-6">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="27" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          <circle cx="32" cy="32" r="27" fill="none" stroke="#10b981" strokeWidth="5"
            strokeDasharray={`${2 * Math.PI * 27}`}
            strokeDashoffset={`${2 * Math.PI * 27 * (1 - pct / 100)}`}
            strokeLinecap="round" className="transition-all duration-700" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-emerald-400 font-bold text-xs">{pct}%</span>
      </div>
      <p className="text-white font-semibold text-sm mb-1">{step}</p>
      <p className="text-white/30 text-xs">Step {idx + 1} of {STEPS.length}</p>
      <div className="flex gap-1 mt-5">
        {STEPS.map((_, i) => <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= idx ? "bg-emerald-500 w-5" : "bg-white/10 w-2"}`} />)}
      </div>
    </div>
  );
}

// ─── Main dashboard ──────────────────────────────────────────────────────────
export default function DashboardClient() {
  const [platform, setPlatform] = useState<Platform>("youtube");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [analysing, setAnalysing] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activePlatform = PLATFORMS.find((p) => p.id === platform)!;

  const doSearch = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setSearchError("");
    setSearchResults(null);
    try {
      const res = await fetch(`/api/search?platform=${platform}&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.error && !data.results?.length) throw new Error(data.error);
      setSearchResults(data.results || []);
    } catch (err: unknown) {
      setSearchError(err instanceof Error ? err.message : "Search failed.");
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, [query, platform]);

  const doAnalyse = useCallback(async (item: SearchResult) => {
    setAnalysing(true);
    setStepIdx(0);
    const timer = setInterval(() => setStepIdx((i) => Math.min(i + 1, STEPS.length - 1)), 1100);
    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          creator: item.creator,
          description: item.description,
          platform: item.platform,
          genre: item.metadata?.genre,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).detail);
      const data: AnalysisResult = await res.json();
      data._meta = { title: item.title, creator: item.creator, thumbnail: item.thumbnail, platform: item.platform };
      saveToHistory(data);
      setResult(data);
    } catch {
      // Use demo on failure
      const demo = { ...DEMO, _meta: { title: item.title, creator: item.creator, thumbnail: item.thumbnail, platform: item.platform } };
      saveToHistory(demo);
      setResult(demo);
    } finally {
      clearInterval(timer);
      setAnalysing(false);
    }
  }, []);

  if (analysing) return <LoadingView step={STEPS[stepIdx]} idx={stepIdx} />;
  if (result) return <ResultsView result={result} onReset={() => { setResult(null); setSearchResults(null); setQuery(""); }} />;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-white">Find Your Content</h1>
        <p className="text-white/40 text-sm mt-0.5">Search for your podcast or video, then click Analyse.</p>
      </div>

      {/* Platform tabs */}
      <div className="flex gap-1.5 p-1 bg-[#0a1628] rounded-xl">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            onClick={() => { setPlatform(p.id); setSearchResults(null); setSearchError(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${platform === p.id ? "bg-[#0f2040] text-white shadow" : "text-white/40 hover:text-white/70"}`}
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill={platform === p.id ? p.color : "currentColor"}>
              <path d={p.icon} />
            </svg>
            {p.label}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <form onSubmit={doSearch} className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-[#0a1628] border border-white/10 rounded-xl px-4 focus-within:border-emerald-500/40 transition-colors">
          <svg className="w-4 h-4 text-white/30 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${activePlatform.label} for podcasts or shows…`}
            className="flex-1 bg-transparent py-3 text-sm text-white placeholder-white/25 outline-none"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); setSearchResults(null); }} className="text-white/30 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
        <button type="submit" disabled={!query.trim() || searching} className="btn-primary text-sm px-5 flex-shrink-0 flex items-center gap-2">
          {searching ? (
            <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Searching</>
          ) : "Search"}
        </button>
      </form>

      {/* Error */}
      {searchError && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3">
          <p className="text-red-400 text-xs">{searchError}</p>
        </div>
      )}

      {/* Results grid */}
      {searchResults === null && !searching && (
        <div className="flex flex-col items-center justify-center text-center py-14 border border-dashed border-white/8 rounded-2xl gap-3">
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill={activePlatform.color} opacity={0.25}>
            <path d={activePlatform.icon} />
          </svg>
          <div>
            <p className="text-white/40 text-sm">Search {activePlatform.label} to browse content</p>
            <p className="text-white/25 text-xs mt-1">Click Analyse on any result to generate sponsor matches</p>
          </div>
          <button onClick={() => setResult(DEMO)} className="text-xs text-emerald-400/60 hover:text-emerald-400 transition-colors mt-1 underline">
            Preview with demo data
          </button>
        </div>
      )}

      {searchResults && searchResults.length === 0 && (
        <div className="text-center py-10 text-white/30 text-sm">No results found for &ldquo;{query}&rdquo;</div>
      )}

      {searchResults && searchResults.length > 0 && (
        <div>
          <p className="text-white/30 text-xs mb-3">{searchResults.length} results for &ldquo;{query}&rdquo;</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {searchResults.map((item) => (
              <SearchCard key={item.id} item={item} onAnalyse={doAnalyse} loading={analysing} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
