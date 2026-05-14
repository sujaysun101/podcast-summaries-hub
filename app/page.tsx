"use client";

import { useState } from "react";

type Chapter = { timestamp: string; title: string; summary: string };
type Clip = { title: string; startTimestamp: string; endTimestamp: string; clip: string };

type PodcastResult = {
  summary: string;
  chapters: Chapter[];
  showNotes: string;
  keyInsights: string[];
  quotes: string[];
  tweetThread: string[];
  linkedinPost: string;
  shortClips: Clip[];
  seoTitle: string;
  seoDescription: string;
  tags: string[];
};

type Tab = "summary" | "chapters" | "shownotes" | "social" | "clips";

export default function Home() {
  const [podcastName, setPodcastName] = useState("");
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PodcastResult | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("summary");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!transcript.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/process-podcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, podcastName, episodeTitle }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setActiveTab("summary");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "summary", label: "Summary" },
    { id: "chapters", label: "Chapters" },
    { id: "shownotes", label: "Show Notes" },
    { id: "social", label: "Social" },
    { id: "clips", label: "Clips" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-8 px-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight">🎙️ Podcast Summaries Hub</h1>
          <p className="mt-1 text-amber-100 text-sm">
            Turn any podcast transcript into chapters, show notes, social clips, and tweet threads — instantly.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Input form */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-amber-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Podcast Name
                </label>
                <input
                  type="text"
                  value={podcastName}
                  onChange={(e) => setPodcastName(e.target.value)}
                  placeholder="e.g. Lex Fridman Podcast"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Episode Title
                </label>
                <input
                  type="text"
                  value={episodeTitle}
                  onChange={(e) => setEpisodeTitle(e.target.value)}
                  placeholder="e.g. #400 - The Future of AI"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transcript <span className="text-red-400">*</span>
              </label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste your full podcast transcript here..."
                rows={10}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !transcript.trim()}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-amber-600 hover:to-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Episode...
                </>
              ) : (
                "⚡ Process Episode"
              )}
            </button>
          </form>
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl shadow-md border border-amber-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? "border-b-2 border-amber-500 text-amber-600 bg-amber-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Summary Tab */}
              {activeTab === "summary" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Episode Summary</h2>
                    <p className="text-gray-700 leading-relaxed">{result.summary}</p>
                  </div>
                  {result.keyInsights?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Key Insights</h3>
                      <ul className="space-y-2">
                        {result.keyInsights.map((insight, i) => (
                          <li key={i} className="flex gap-2 text-sm text-gray-700">
                            <span className="text-amber-500 font-bold mt-0.5">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.quotes?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Memorable Quotes</h3>
                      <div className="space-y-3">
                        {result.quotes.map((quote, i) => (
                          <blockquote
                            key={i}
                            className="border-l-4 border-amber-400 pl-4 italic text-gray-600 text-sm"
                          >
                            &ldquo;{quote}&rdquo;
                          </blockquote>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.tags?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-amber-100 text-amber-700 text-xs font-medium px-3 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.seoTitle && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm">SEO Title</h3>
                      <p className="text-gray-700 text-sm">{result.seoTitle}</p>
                      <h3 className="font-semibold text-gray-800 mb-1 mt-3 text-sm">SEO Description</h3>
                      <p className="text-gray-600 text-sm">{result.seoDescription}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Chapters Tab */}
              {activeTab === "chapters" && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Chapters</h2>
                  <div className="space-y-3">
                    {result.chapters?.map((ch, i) => (
                      <div
                        key={i}
                        className="flex gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100"
                      >
                        <span className="text-amber-600 font-mono text-sm font-semibold mt-0.5 whitespace-nowrap">
                          {ch.timestamp}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{ch.title}</p>
                          <p className="text-gray-600 text-sm mt-0.5">{ch.summary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Show Notes Tab */}
              {activeTab === "shownotes" && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Show Notes</h2>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                      {result.showNotes}
                    </pre>
                  </div>
                </div>
              )}

              {/* Social Tab */}
              {activeTab === "social" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-3">Tweet Thread</h2>
                    <div className="space-y-3">
                      {result.tweetThread?.map((tweet, i) => (
                        <div
                          key={i}
                          className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-sm text-gray-800"
                        >
                          <span className="text-sky-400 font-bold text-xs mr-2">{i + 1}/</span>
                          {tweet}
                        </div>
                      ))}
                    </div>
                  </div>
                  {result.linkedinPost && (
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-3">LinkedIn Post</h2>
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {result.linkedinPost}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Clips Tab */}
              {activeTab === "clips" && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Short Clips</h2>
                  <div className="space-y-4">
                    {result.shortClips?.map((clip, i) => (
                      <div
                        key={i}
                        className="border border-orange-100 rounded-xl overflow-hidden"
                      >
                        <div className="bg-orange-50 px-4 py-2 flex items-center gap-3">
                          <span className="text-orange-600 font-semibold text-sm">{clip.title}</span>
                          <span className="text-gray-400 text-xs">
                            {clip.startTimestamp} → {clip.endTimestamp}
                          </span>
                        </div>
                        <div className="px-4 py-3">
                          <p className="text-sm text-gray-700 italic leading-relaxed">&ldquo;{clip.clip}&rdquo;</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
