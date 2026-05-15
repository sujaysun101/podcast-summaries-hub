"use client";

import { useState } from "react";

const ENV_VARS = [
  { key: "ANTHROPIC_API_KEY", label: "Anthropic API Key", description: "Powers the AI analysis, audience profiling, and pitch generation.", required: true, link: "https://console.anthropic.com" },
  { key: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", label: "Clerk Publishable Key", description: "Enables user authentication. Get from the Clerk dashboard.", required: true, link: "https://dashboard.clerk.com" },
  { key: "CLERK_SECRET_KEY", label: "Clerk Secret Key", description: "Server-side Clerk key. Never expose this publicly.", required: true, link: "https://dashboard.clerk.com" },
];

const SEARCH_TIPS = [
  { platform: "YouTube", color: "#FF0000", note: "Search is powered by the Piped open-source proxy — no API key required. If results fail, the proxy may be temporarily down." },
  { platform: "Podcasts", color: "#1DB954", note: "Search uses Apple's iTunes Podcast API — completely free, no key required, returns podcasts from all platforms." },
  { platform: "Rumble", color: "#85C742", note: "Search uses Rumble's public search page. Results may be limited depending on content availability." },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-xs text-white/30 hover:text-emerald-400 transition-colors px-2 py-1 rounded hover:bg-white/5"
    >
      {copied ? "✓" : "Copy"}
    </button>
  );
}

export default function SettingsClient() {
  const [showEnv, setShowEnv] = useState(false);

  const envTemplate = ENV_VARS.map((v) => `${v.key}=your_${v.key.toLowerCase()}_here`).join("\n") +
    "\nNEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in\nNEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up\nNEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard\nNEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-0.5">Configuration and environment setup.</p>
      </div>

      {/* Environment Variables */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Environment Variables</h2>
          <span className="text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20">Set in Vercel dashboard</span>
        </div>
        <p className="text-white/45 text-xs leading-relaxed">
          These keys must be added to your Vercel project&apos;s Environment Variables (not in code). Go to
          <span className="text-emerald-400"> Vercel → Project → Settings → Environment Variables</span>.
        </p>

        <div className="space-y-3">
          {ENV_VARS.map((v) => (
            <div key={v.key} className="bg-[#0a1628] rounded-xl p-4 border border-white/8">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-emerald-400 text-xs font-mono">{v.key}</code>
                    {v.required && <span className="text-xs text-red-400/70 bg-red-500/10 px-1.5 py-0.5 rounded font-medium">Required</span>}
                  </div>
                  <p className="text-white/45 text-xs leading-relaxed">{v.description}</p>
                </div>
                <a href={v.link} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-emerald-400/60 hover:text-emerald-400 transition-colors whitespace-nowrap flex-shrink-0">
                  Get key →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#020817] rounded-xl p-4 border border-white/8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-white/40 font-medium uppercase tracking-wider">.env.local template</p>
            <div className="flex gap-2">
              <CopyButton text={envTemplate} />
              <button onClick={() => setShowEnv(!showEnv)} className="text-xs text-white/30 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5">
                {showEnv ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {showEnv && (
            <pre className="text-xs text-white/55 font-mono leading-relaxed whitespace-pre-wrap">{envTemplate}</pre>
          )}
        </div>
      </div>

      {/* Search platform info */}
      <div className="card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">Search Integrations</h2>
        <div className="space-y-3">
          {SEARCH_TIPS.map((t) => (
            <div key={t.platform} className="flex gap-3 bg-[#0a1628] rounded-xl p-3.5 border border-white/8">
              <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: t.color }} />
              <div>
                <p className="text-white text-sm font-medium mb-0.5">{t.platform}</p>
                <p className="text-white/45 text-xs leading-relaxed">{t.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="card p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white">About YieldCast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[["Version", "1.0.0"], ["Model", "Claude Opus"], ["Framework", "Next.js 14"], ["Auth", "Clerk v7"]].map(([l, v]) => (
            <div key={l} className="bg-[#0a1628] rounded-xl p-3 border border-white/8">
              <p className="text-white/35 text-xs mb-1">{l}</p>
              <p className="text-white text-sm font-medium">{v}</p>
            </div>
          ))}
        </div>
        <div className="pt-2 border-t border-white/8">
          <p className="text-white/25 text-xs">History is stored in your browser&apos;s localStorage. Clearing browser data will remove it. No podcast data is stored on our servers.</p>
        </div>
      </div>
    </div>
  );
}
