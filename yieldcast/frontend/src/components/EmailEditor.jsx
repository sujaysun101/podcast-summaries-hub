import { useState } from 'react'
import { Copy, Check, Download, Send } from 'lucide-react'

export default function EmailEditor({ initialContent, brandName }) {
  const [content, setContent] = useState(
    typeof initialContent === 'string'
      ? initialContent
      : JSON.stringify(initialContent, null, 2)
  )
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const download = () => {
    const blob = new Blob([content], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `pitch-${brandName?.toLowerCase().replace(/\s+/g, '-') || 'brand'}.txt`
    a.click()
  }

  const mockSend = () => {
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/50 uppercase tracking-wider font-medium">
          Pitch email — {brandName}
        </p>
        <div className="flex gap-2">
          <button
            onClick={copy}
            className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors px-2 py-1 rounded"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={download}
            className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors px-2 py-1 rounded"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={14}
        className="w-full bg-navy-950 border border-white/10 focus:border-emerald-500/40 rounded-xl p-4 text-sm text-white/80 font-mono leading-relaxed outline-none resize-none transition-colors"
        spellCheck={false}
      />

      <button
        onClick={mockSend}
        className={`btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5 ${sent ? 'bg-emerald-600' : ''}`}
      >
        {sent ? (
          <>
            <Check className="w-4 h-4" />
            Sent! (demo mode)
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Pitch Email
          </>
        )}
      </button>
    </div>
  )
}
