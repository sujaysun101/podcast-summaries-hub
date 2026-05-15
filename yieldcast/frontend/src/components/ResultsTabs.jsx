import { useState } from 'react'
import { BarChart2, Users, Mail, Star, ExternalLink, Copy, Check } from 'lucide-react'
import clsx from 'clsx'
import EmailEditor from './EmailEditor'

const TABS = [
  { id: 'profile', label: 'Audience Profile', icon: <Users className="w-4 h-4" /> },
  { id: 'analytics', label: 'Content Analytics', icon: <BarChart2 className="w-4 h-4" /> },
  { id: 'sponsors', label: 'Matched Sponsors', icon: <Star className="w-4 h-4" /> },
  { id: 'pitches', label: 'Pitch Assets', icon: <Mail className="w-4 h-4" /> },
]

function ProfileTab({ profile }) {
  const entries = Object.entries(profile || {})
  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-white font-bold text-lg">Audience Psychographic Profile</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {entries.map(([key, value]) => (
          <div key={key} className="bg-navy-900/60 rounded-xl p-4 border border-white/8">
            <p className="text-xs text-emerald-400 uppercase tracking-wider font-semibold mb-1.5">
              {key.replace(/_/g, ' ')}
            </p>
            <p className="text-white/75 text-sm leading-relaxed">
              {Array.isArray(value) ? value.join(', ') : String(value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnalyticsTab({ profile }) {
  const traits = [
    { label: 'Engagement Score', value: 87 },
    { label: 'Brand Recall Potential', value: 74 },
    { label: 'Purchase Intent Index', value: 91 },
    { label: 'Niche Specificity', value: 95 },
  ]
  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-white font-bold text-lg">Content Analytics</h3>
      <div className="space-y-3">
        {traits.map((t) => (
          <div key={t.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white/70">{t.label}</span>
              <span className="text-emerald-400 font-semibold">{t.value}/100</span>
            </div>
            <div className="h-2 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                style={{ width: `${t.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 bg-emerald-500/8 border border-emerald-500/20 rounded-xl">
        <p className="text-emerald-400 text-sm font-medium">
          Your audience scores in the <strong>top 8%</strong> for purchase intent among shows in your category.
        </p>
      </div>
    </div>
  )
}

function SponsorsTab({ brands }) {
  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-white font-bold text-lg">Matched Sponsors ({brands?.length || 0})</h3>
      <div className="space-y-3">
        {(brands || []).map((b, i) => (
          <div key={i} className="bg-navy-900/60 border border-white/8 hover:border-emerald-500/30 rounded-xl p-4 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-semibold text-sm">{b.name}</p>
                  {b.category && (
                    <span className="text-xs bg-navy-800 text-white/40 px-2 py-0.5 rounded-full">{b.category}</span>
                  )}
                </div>
                <p className="text-white/50 text-xs leading-relaxed">{b.reason}</p>
                {b.contact && (
                  <p className="text-emerald-400/70 text-xs mt-2 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    {b.contact}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-center bg-emerald-500/10 rounded-lg px-3 py-2 flex-shrink-0">
                <span className="text-emerald-400 font-bold text-lg">{b.fit_score ?? '—'}</span>
                <span className="text-white/30 text-xs">fit</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PitchesTab({ emails, brands }) {
  const [selected, setSelected] = useState(0)
  const items = emails || []

  if (!items.length) return (
    <div className="text-white/40 text-sm text-center py-10">No pitch emails generated.</div>
  )

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-white font-bold text-lg">Generated Pitch Assets</h3>
      <div className="flex gap-2 flex-wrap">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={clsx(
              'text-xs px-3 py-1.5 rounded-lg font-medium transition-all',
              selected === i ? 'bg-emerald-500 text-white' : 'bg-navy-900 text-white/50 hover:text-white'
            )}
          >
            {brands?.[i]?.name || `Brand ${i + 1}`}
          </button>
        ))}
      </div>
      <EmailEditor
        initialContent={items[selected]}
        brandName={brands?.[selected]?.name || `Brand ${selected + 1}`}
      />
    </div>
  )
}

export default function ResultsTabs({ result }) {
  const [active, setActive] = useState('profile')

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-navy-900/60 rounded-xl overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
              active === t.id ? 'bg-emerald-500 text-white shadow' : 'text-white/40 hover:text-white/70'
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="card p-6">
        {active === 'profile' && <ProfileTab profile={result.audience_profile} />}
        {active === 'analytics' && <AnalyticsTab profile={result.audience_profile} />}
        {active === 'sponsors' && <SponsorsTab brands={result.brand_matches} />}
        {active === 'pitches' && <PitchesTab emails={result.pitch_emails} brands={result.brand_matches} />}
      </div>
    </div>
  )
}
