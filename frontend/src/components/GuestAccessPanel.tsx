import { LockKeyhole, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '.'

export function GuestAccessPanel() {
  return (
    <aside className="relative rounded-xl border border-border bg-surface/75 p-6 shadow-card backdrop-blur-xl sm:p-7" aria-labelledby="guest-access-title">
      <div className="absolute inset-0 rounded-xl border border-white/[0.025] pointer-events-none" />
      <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full border border-accent/20 bg-accent/10 text-accent-light"><LockKeyhole size={21} /></div>
      <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-accent-light">SECURE WORKSPACE</p>
      <h2 id="guest-access-title" className="mt-2 text-center text-xl font-semibold tracking-tight text-text-primary">Reports are not available</h2>
      <p className="mt-3 text-center text-sm leading-6 text-text-muted">Please login to view satellite operations reports, controlled resources and more.</p>
      <div className="mt-5 flex items-center gap-2 rounded-lg border border-nominal/15 bg-nominal/[0.04] px-3 py-2 text-xs text-text-muted"><ShieldCheck size={15} className="shrink-0 text-nominal" />Controlled workspace access</div>
      <Link to="/login" className="mt-4 block"><Button variant="primary" size="lg" className="w-full">Login</Button></Link>
      <p className="mt-4 text-center text-xs text-text-muted">Don't have an account? <Link to="/register" className="font-medium text-accent-light transition hover:text-white">Sign Up</Link></p>
    </aside>
  )
}
