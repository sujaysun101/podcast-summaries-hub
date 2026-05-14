import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic2, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/8 bg-navy-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg text-white cursor-pointer" onClick={() => navigate('/')}>
          <Mic2 className="w-5 h-5 text-emerald-500" />
          YieldCast
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Stories</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="btn-ghost text-sm py-2 px-4">
            Log in
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-primary text-sm py-2 px-4">
            Get started free
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white/60 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-navy-900 border-t border-white/8 px-4 py-4 flex flex-col gap-4">
          <a href="#features" className="text-white/60 hover:text-white text-sm" onClick={() => setOpen(false)}>Features</a>
          <a href="#testimonials" className="text-white/60 hover:text-white text-sm" onClick={() => setOpen(false)}>Stories</a>
          <a href="#" className="text-white/60 hover:text-white text-sm">Pricing</a>
          <button onClick={() => navigate('/dashboard')} className="btn-primary text-sm mt-2">
            Get started free
          </button>
        </div>
      )}
    </nav>
  )
}
