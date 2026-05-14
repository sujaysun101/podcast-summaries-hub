import { useNavigate } from 'react-router-dom'
import { Mic2, Brain, Mail, ArrowRight, Star, Zap, TrendingUp, Shield } from 'lucide-react'
import Navbar from '../components/Navbar'

const features = [
  {
    icon: <Brain className="w-7 h-7 text-emerald-400" />,
    title: 'Psychographic Audience Analysis',
    description:
      'We ingest your RSS feed and transcripts, then map the deep interests, values, and buying behaviours of your listeners — not just demographics.',
    bullets: ['Content theme extraction', 'Listener persona generation', 'Engagement signal scoring'],
  },
  {
    icon: <TrendingUp className="w-7 h-7 text-emerald-400" />,
    title: 'AI Brand Matching & Lead Gen',
    description:
      'Our model cross-references your audience profile against thousands of brands actively looking for niche podcast placements — no cold Googling required.',
    bullets: ['Real-time brand database scan', 'Fit-score ranking (0–100)', 'Direct decision-maker contacts'],
  },
  {
    icon: <Mail className="w-7 h-7 text-emerald-400" />,
    title: 'Personalised Pitch Decks & Outreach',
    description:
      'Generate a full sponsor pitch deck and bespoke cold emails for each matched brand in seconds. Edit inline, export as PDF, or send directly.',
    bullets: ['One-click pitch deck PDF', 'Per-brand email personalisation', 'Follow-up sequence drafts'],
  },
]

const testimonials = [
  {
    name: 'Priya Menon',
    handle: '@priyacasts',
    show: 'The Indie Founder Files',
    downloads: '12k / ep',
    quote:
      'I landed a $4,800/month sponsorship within two weeks of using YieldCast. The pitch email it wrote was better than anything I could have drafted myself.',
    stars: 5,
  },
  {
    name: 'Marcus Webb',
    handle: '@marcusaudio',
    show: 'Dark Matter Finance',
    downloads: '28k / ep',
    quote:
      'The audience psychographic report alone is worth the subscription. I finally had data to back up why my listeners convert better than a show 10× my size.',
    stars: 5,
  },
  {
    name: 'Chiara Romano',
    handle: '@chiarawave',
    show: 'Slow Burn Wellness',
    downloads: '7k / ep',
    quote:
      "I used to spend 6 hours a week chasing sponsors. YieldCast cut that to 20 minutes. The brand matches are scarily accurate for my niche.",
    stars: 5,
  },
]

const stats = [
  { value: '$2.4M', label: 'Sponsorship revenue unlocked' },
  { value: '340+', label: 'Independent shows onboarded' },
  { value: '18 days', label: 'Avg. time to first deal' },
  { value: '94%', label: 'Brand match accuracy rate' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-navy-950 overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-24 px-4 flex flex-col items-center text-center">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-4 py-1.5 text-emerald-400 text-sm font-medium mb-8 animate-fade-in">
          <Zap className="w-3.5 h-3.5" />
          Now in public beta — 14 days free
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight max-w-4xl animate-slide-up">
          Stop pitching cold.{' '}
          <span className="text-emerald-400">Start closing sponsors.</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed animate-slide-up">
          YieldCast analyses your podcast content, profiles your audience, matches you with niche brands, and writes
          the pitch — so you can monetise the engaged community you&apos;ve already built.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-slide-up">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary flex items-center gap-2 text-base px-8 py-4"
          >
            Generate Your First Pitch Deck
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="btn-ghost flex items-center gap-2 text-base">
            <Mic2 className="w-4 h-4" />
            See a live demo
          </button>
        </div>

        {/* Stats strip */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-emerald-400">{s.value}</span>
              <span className="text-white/50 text-sm mt-1 text-center">{s.label}</span>
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
              Three steps from transcript
              <br />
              <span className="text-white/50">to signed deal.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="card p-7 group hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition-colors">
                  {f.icon}
                </div>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Step {i + 1}</span>
                <h3 className="text-xl font-bold text-white mt-2 mb-3">{f.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed mb-5">{f.description}</p>
                <ul className="space-y-2">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-white/70">
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

      {/* Social Proof */}
      <section id="testimonials" className="py-24 px-4 bg-navy-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">Creator stories</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Built for shows like yours.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-7 flex flex-col">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                  ))}
                </div>
                <p className="text-white/75 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 pt-5 border-t border-white/8 flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/40 text-xs mt-0.5">{t.show}</p>
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

      {/* CTA Banner */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card p-12 relative overflow-hidden glow-emerald">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
            <Shield className="w-10 h-10 text-emerald-400 mx-auto mb-5" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Your audience is already worth
              <span className="text-emerald-400"> more than you think.</span>
            </h2>
            <p className="text-white/55 mb-8 text-lg">
              Stop leaving sponsorship revenue on the table because you don&apos;t have time to pitch. Let the AI do the work.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary flex items-center gap-2 mx-auto text-base px-8 py-4"
            >
              Generate Your First Pitch Deck
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-white/30 text-xs mt-4">No credit card required · 14-day free trial</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-sm">
          <div className="flex items-center gap-2 font-bold text-white/60">
            <Mic2 className="w-5 h-5 text-emerald-500" />
            YieldCast
          </div>
          <p>© 2025 YieldCast. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
