import { Loader2 } from 'lucide-react'

export default function LoadingState({ step, stepIndex, totalSteps }) {
  const pct = Math.round(((stepIndex + 1) / totalSteps) * 100)

  return (
    <div className="card p-10 flex flex-col items-center text-center animate-fade-in">
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-white/8" />
        <div
          className="absolute inset-0 rounded-full border-4 border-emerald-500 transition-all duration-500"
          style={{
            clipPath: `inset(0 ${100 - pct}% 0 0)`,
            borderColor: '#10b981',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-2">{step}</h3>
      <p className="text-white/40 text-sm">
        Step {stepIndex + 1} of {totalSteps}
      </p>

      {/* Step pills */}
      <div className="flex gap-1.5 mt-6">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i <= stepIndex ? 'bg-emerald-500 w-6' : 'bg-white/15 w-3'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
