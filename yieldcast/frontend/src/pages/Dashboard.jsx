import { useState } from 'react'
import { RefreshCw, AlertCircle } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import InputModule from '../components/InputModule'
import LoadingState from '../components/LoadingState'
import ResultsTabs from '../components/ResultsTabs'
import { useAnalysis } from '../hooks/useAnalysis'

// Demo result shown when backend is not connected
const DEMO_RESULT = {
  audience_profile: {
    age_range: '28–42',
    primary_interests: ['Entrepreneurship', 'Productivity', 'B2B SaaS', 'Remote Work'],
    values: 'Autonomy, continuous learning, measurable ROI',
    income_bracket: '$80k–$150k HHI',
    purchase_behaviour: 'Research-heavy, high brand loyalty once trust established',
    content_themes: 'Startup growth, hiring, fundraising, founder psychology',
    engagement_style: 'Active listener — takes notes, follows links in show notes',
  },
  brand_matches: [
    { name: 'Notion', category: 'Productivity SaaS', fit_score: 97, reason: 'Perfect alignment with founder productivity seekers. High LTV audience.', contact: 'sponsorships@notion.so' },
    { name: 'Linear', category: 'Dev Tools', fit_score: 93, reason: 'Engineering-led audience values opinionated tooling. Fast-growing brand.', contact: 'partnerships@linear.app' },
    { name: 'Loom', category: 'Async Comms', fit_score: 91, reason: 'Remote-work theme aligns directly. Audience is decision-maker level.', contact: 'hello@loom.com' },
    { name: 'Deel', category: 'HR / Payroll', fit_score: 88, reason: 'Global hiring episodes resonate. Audience hires internationally.', contact: 'marketing@deel.com' },
    { name: 'Mercury', category: 'Fintech / Banking', fit_score: 85, reason: 'Startup banking product, ideal for early-stage founder listeners.', contact: 'growth@mercury.com' },
    { name: 'Beehiiv', category: 'Creator Tools', fit_score: 82, reason: 'Newsletter-adjacent audience building overlap. Strong creator economy fit.', contact: 'partnerships@beehiiv.com' },
    { name: 'Descript', category: 'Audio/Video Editing', fit_score: 80, reason: 'Podcaster audience is their core user — natural community fit.', contact: 'studio@descript.com' },
    { name: 'Rippling', category: 'HR SaaS', fit_score: 78, reason: 'HR automation aligns with scaling-startup episodes.', contact: 'partnerships@rippling.com' },
    { name: 'Stripe', category: 'Payments', fit_score: 76, reason: 'Developer / founder overlap is strong. Payment infrastructure is relevant.', contact: 'sponsorships@stripe.com' },
    { name: 'Superhuman', category: 'Productivity', fit_score: 74, reason: 'Premium email for power users. Audience is productivity-obsessed.', contact: 'growth@superhuman.com' },
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

I believe we can drive meaningful trials. Happy to share our audience data and previous sponsor results.

Would a 15-minute call this week work?

Best,
[Your Name]
The Indie Founder Files`,
    `Subject: A niche sponsorship fit — The Indie Founder Files × Linear

Hi [Name],

I've admired how Linear has grown by winning engineering teams who care about craft. My audience — founders and senior ICs building early-stage companies — is exactly that cohort.

At 12,000 downloads per episode, The Indie Founder Files reaches the people who choose the tools their whole team adopts. A sponsorship here isn't just impressions — it's a product recommendation from a trusted voice.

I'd love to chat about a trial run. Are you open to a quick call?

[Your Name]`,
  ],
}

export default function Dashboard() {
  const { loading, step, stepIndex, totalSteps, result, error, analyse } = useAnalysis()
  const [showDemo, setShowDemo] = useState(false)
  const displayResult = result || (showDemo ? DEMO_RESULT : null)

  const handleSubmit = (params) => {
    // If no backend, fall through to demo after timeout
    analyse(params).catch(() => {})
    // Show demo after a delay if no real backend is reachable
    setTimeout(() => {
      if (!result) setShowDemo(true)
    }, 10000)
  }

  return (
    <div className="flex min-h-screen bg-navy-950">
      <Sidebar />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Sponsor Matching</h1>
              <p className="text-white/40 text-sm mt-0.5">Analyse your podcast and generate personalised pitch assets.</p>
            </div>
            {displayResult && (
              <button
                onClick={() => { setShowDemo(false) }}
                className="btn-ghost flex items-center gap-2 text-sm py-2"
              >
                <RefreshCw className="w-4 h-4" />
                New Analysis
              </button>
            )}
          </div>

          {/* Input */}
          {!loading && !displayResult && (
            <InputModule onSubmit={handleSubmit} loading={loading} />
          )}

          {/* Loading */}
          {loading && (
            <LoadingState step={step} stepIndex={stepIndex} totalSteps={totalSteps} />
          )}

          {/* Error */}
          {error && !loading && !displayResult && (
            <div className="card p-5 border-red-500/20 bg-red-500/5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium text-sm">{error}</p>
                <button
                  onClick={() => setShowDemo(true)}
                  className="text-xs text-white/40 hover:text-white mt-2 underline"
                >
                  Load demo result instead
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          {displayResult && !loading && (
            <ResultsTabs result={displayResult} />
          )}

          {/* Demo prompt when idle */}
          {!loading && !displayResult && !error && (
            <div className="text-center pt-4">
              <button
                onClick={() => setShowDemo(true)}
                className="text-xs text-white/30 hover:text-emerald-400 transition-colors underline"
              >
                Preview with demo data instead
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
