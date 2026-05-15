"use client";

import { useEffect, useState } from "react";

interface HistoryEntry {
  _savedAt: number;
  _meta?: { title: string; creator: string; thumbnail: string; platform: string };
  audience_profile: Record<string, string | string[]>;
  brand_matches: { name: string; fit_score: number; category: string }[];
}

export default function HistoryClient() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("yc_history");
      if (raw) setEntries(JSON.parse(raw));
    } catch {}
  }, []);

  const remove = (idx: number) => {
    const updated = entries.filter((_, i) => i !== idx);
    setEntries(updated);
    localStorage.setItem("yc_history", JSON.stringify(updated));
  };

  const clearAll = () => {
    setEntries([]);
    localStorage.removeItem("yc_history");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">History</h1>
          <p className="text-white/40 text-sm mt-0.5">Your past analyses — stored locally in this browser.</p>
        </div>
        {entries.length > 0 && (
          <button onClick={clearAll} className="text-xs text-white/30 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/5 border border-white/10 hover:border-red-500/20">
            Clear all
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-white/8 rounded-2xl gap-3">
          <svg className="w-10 h-10 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-white/30 text-sm">No analyses yet. Run your first search from the Dashboard.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, i) => (
            <div key={i} className="card overflow-hidden">
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/2 transition-colors"
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                {entry._meta?.thumbnail && (
                  <img src={entry._meta.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-white/5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{entry._meta?.title || "Untitled Analysis"}</p>
                  <p className="text-white/35 text-xs mt-0.5">{entry._meta?.creator} · {entry._meta?.platform}</p>
                  <p className="text-white/25 text-xs mt-0.5">{new Date(entry._savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-emerald-400 font-bold text-sm">{entry.brand_matches?.length ?? 0}</p>
                    <p className="text-white/30 text-xs">sponsors</p>
                  </div>
                  <svg className={`w-4 h-4 text-white/30 transition-transform ${expanded === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {expanded === i && (
                <div className="border-t border-white/8 p-4 space-y-4">
                  {/* Top brand matches */}
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-medium">Top Matched Sponsors</p>
                    <div className="space-y-2">
                      {(entry.brand_matches || []).slice(0, 5).map((b, j) => (
                        <div key={j} className="flex items-center gap-3 bg-[#0a1628]/60 rounded-lg px-3 py-2">
                          <span className="text-emerald-400 font-bold text-sm w-5 text-center">{j + 1}</span>
                          <span className="text-white text-sm flex-1">{b.name}</span>
                          <span className="text-white/30 text-xs">{b.category}</span>
                          <span className="text-emerald-400 font-semibold text-sm">{b.fit_score}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audience highlights */}
                  {entry.audience_profile && (
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-medium">Audience Snapshot</p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(entry.audience_profile).slice(0, 4).map(([k, v]) => (
                          <div key={k} className="bg-[#0a1628]/60 rounded-lg p-2.5">
                            <p className="text-xs text-emerald-400/70 uppercase font-medium mb-0.5">{k.replace(/_/g, " ")}</p>
                            <p className="text-white/60 text-xs leading-relaxed">{Array.isArray(v) ? v.slice(0, 3).join(", ") : String(v).slice(0, 60)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button onClick={() => remove(i)} className="text-xs text-white/25 hover:text-red-400 transition-colors">
                    Remove from history
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
