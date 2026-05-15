import { useState, useRef } from 'react'
import { Link2, Upload, Mic2, ArrowRight, X } from 'lucide-react'
import clsx from 'clsx'

export default function InputModule({ onSubmit, loading }) {
  const [tab, setTab] = useState('rss')
  const [rssUrl, setRssUrl] = useState('')
  const [file, setFile] = useState(null)
  const [refinement, setRefinement] = useState('')
  const fileRef = useRef()

  const handleDrop = (e) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ rssUrl: tab === 'rss' ? rssUrl : null, file: tab === 'audio' ? file : null, refinement })
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-5">
      <div>
        <h2 className="text-lg font-bold text-white mb-1">Analyse Your Podcast</h2>
        <p className="text-white/45 text-sm">Paste your RSS feed or upload an audio file to get started.</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 p-1 bg-navy-900/80 rounded-xl">
        {[
          { id: 'rss', label: 'RSS Feed', icon: <Link2 className="w-3.5 h-3.5" /> },
          { id: 'audio', label: 'Audio File', icon: <Upload className="w-3.5 h-3.5" /> },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={clsx(
              'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all',
              tab === t.id ? 'bg-emerald-500 text-white shadow' : 'text-white/40 hover:text-white/70'
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'rss' ? (
        <div>
          <label className="text-xs text-white/50 font-medium uppercase tracking-wider block mb-2">RSS Feed URL</label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-navy-900 border border-white/10 rounded-xl px-4 focus-within:border-emerald-500/50 transition-colors">
              <Link2 className="w-4 h-4 text-white/30 flex-shrink-0" />
              <input
                type="url"
                value={rssUrl}
                onChange={(e) => setRssUrl(e.target.value)}
                placeholder="https://feeds.example.com/your-podcast"
                className="flex-1 bg-transparent py-3 text-sm text-white placeholder-white/25 outline-none"
                required={tab === 'rss'}
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-white/15 hover:border-emerald-500/40 rounded-xl p-8 text-center cursor-pointer transition-colors group"
        >
          <input
            ref={fileRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file ? (
            <div className="flex items-center justify-center gap-2 text-emerald-400">
              <Mic2 className="w-5 h-5" />
              <span className="text-sm font-medium">{file.name}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null) }}
                className="ml-1 text-white/30 hover:text-white/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-white/20 group-hover:text-emerald-400/50 mx-auto mb-3 transition-colors" />
              <p className="text-sm text-white/40">Drop an audio file here or <span className="text-emerald-400">browse</span></p>
              <p className="text-xs text-white/25 mt-1">MP3, WAV, M4A — max 500 MB</p>
            </>
          )}
        </div>
      )}

      {/* Refinement constraint */}
      <div>
        <label className="text-xs text-white/50 font-medium uppercase tracking-wider block mb-2">
          Focus constraint <span className="text-white/25 normal-case">(optional)</span>
        </label>
        <input
          type="text"
          value={refinement}
          onChange={(e) => setRefinement(e.target.value)}
          placeholder='e.g. "focus only on B2B SaaS and D2C productivity brands"'
          className="w-full bg-navy-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-emerald-500/50 transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading || (tab === 'rss' ? !rssUrl : !file)}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {loading ? 'Analysing…' : 'Analyse & Match Sponsors'}
        {!loading && <ArrowRight className="w-4 h-4" />}
      </button>
    </form>
  )
}
