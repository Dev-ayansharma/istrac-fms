import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-page px-0 py-10 sm:pt-12">
      <div className="mx-auto w-[min(1280px,calc(100%-32px))]">
        <div className="flex flex-col justify-between gap-8 border-b border-border-subtle pb-8 sm:flex-row sm:items-center"><div><Link to="/" className="inline-flex items-center gap-3 text-text-primary"><span className="grid h-9 w-9 place-items-center rounded-lg border border-accent/25 bg-accent/10 text-accent-light"><span className="relative h-5 w-5"><span className="absolute left-0 top-2 h-px w-5 rotate-45 bg-current" /><span className="absolute left-0 top-2 h-px w-5 -rotate-45 bg-current" /></span></span><span className="text-sm font-semibold tracking-wide">ISTRAC<span className="text-accent-light">-FMS</span></span></Link><p className="mt-3 max-w-sm text-xs leading-6 text-text-dim">Secure and centralized file management for ISTRAC departments.</p></div><a href="#hero" className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted transition hover:text-text-primary">Back to top <ArrowUpRight size={15} /></a></div>
        <div className="flex flex-col justify-between gap-3 pt-5 text-[10px] tracking-wide text-text-dim sm:flex-row"><span>© 2026 ISTRAC-FMS. All rights reserved.</span><span>Secure • Controlled • Traceable</span></div>
      </div>
    </footer>
  )
}
