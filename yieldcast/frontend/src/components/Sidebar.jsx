import { useNavigate } from 'react-router-dom'
import { Mic2, LayoutDashboard, History, Settings, LogOut, Plus } from 'lucide-react'
import clsx from 'clsx'

const links = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard', active: true },
  { icon: <History className="w-4 h-4" />, label: 'Past Analyses', active: false },
  { icon: <Settings className="w-4 h-4" />, label: 'Settings', active: false },
]

export default function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-navy-900 border-r border-white/8 p-4">
      <div
        className="flex items-center gap-2 font-bold text-white cursor-pointer mb-8 px-2"
        onClick={() => navigate('/')}
      >
        <Mic2 className="w-5 h-5 text-emerald-500" />
        YieldCast
      </div>

      <button className="btn-primary flex items-center gap-2 text-sm py-2.5 mb-6">
        <Plus className="w-4 h-4" />
        New Analysis
      </button>

      <nav className="flex-1 space-y-1">
        {links.map((l) => (
          <div
            key={l.label}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all',
              l.active
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            )}
          >
            {l.icon}
            {l.label}
          </div>
        ))}
      </nav>

      <div className="border-t border-white/8 pt-4 mt-4">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer text-white/40 hover:text-white hover:bg-white/5 transition-all text-sm">
          <LogOut className="w-4 h-4" />
          Sign out
        </div>
      </div>
    </aside>
  )
}
