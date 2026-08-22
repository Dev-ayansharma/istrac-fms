import { ArrowUpRight, Mail, Phone } from 'lucide-react'
import { useCms } from '../context/cmsContext'

interface ContactInfo { email?: string; phone?: string }

export function ContactSection() {
  const { cmsBlocks } = useCms()
  const contact = cmsBlocks['contact_info'] as ContactInfo | undefined
  if (!contact?.email && !contact?.phone) return null

  return (
    <section id="contact" className="bg-page py-20 sm:py-24" aria-labelledby="contact-title">
      <div className="mx-auto w-[min(1280px,calc(100%-32px))]"><div className="grid items-center gap-8 rounded-xl border border-border-subtle bg-card/70 p-6 shadow-card sm:p-8 lg:grid-cols-[1fr_0.9fr] lg:p-10"><div><p className="mb-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-accent-light"><span className="h-1.5 w-1.5 rounded-full bg-accent-light" />SUPPORT</p><h2 id="contact-title" className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-text-primary sm:text-4xl">Need help with ISTRAC-FMS?</h2><p className="mt-4 max-w-lg text-sm leading-7 text-text-muted">Reach the system support team for access assistance and platform queries.</p></div><div className="grid gap-2.5">{contact.email && <a href={`mailto:${contact.email}`} className="group grid grid-cols-[42px_1fr_auto] items-center gap-3 rounded-lg border border-border-subtle bg-surface/60 p-3.5 transition-all duration-200 hover:translate-x-1 hover:border-border-bright hover:bg-accent/[0.04]"><span className="grid h-10 w-10 place-items-center rounded-lg border border-accent/15 bg-accent/10 text-accent-light"><Mail size={18} /></span><span className="grid gap-1"><small className="text-[9px] uppercase tracking-[0.13em] text-text-dim">Email</small><strong className="break-all text-xs font-semibold text-text-secondary">{contact.email}</strong></span><ArrowUpRight size={16} className="text-text-dim transition group-hover:text-accent-light" /></a>}{contact.phone && <a href={`tel:${contact.phone}`} className="group grid grid-cols-[42px_1fr_auto] items-center gap-3 rounded-lg border border-border-subtle bg-surface/60 p-3.5 transition-all duration-200 hover:translate-x-1 hover:border-border-bright hover:bg-accent/[0.04]"><span className="grid h-10 w-10 place-items-center rounded-lg border border-accent/15 bg-accent/10 text-accent-light"><Phone size={18} /></span><span className="grid gap-1"><small className="text-[9px] uppercase tracking-[0.13em] text-text-dim">Phone</small><strong className="text-xs font-semibold text-text-secondary">{contact.phone}</strong></span><ArrowUpRight size={16} className="text-text-dim transition group-hover:text-accent-light" /></a>}</div></div></div>
    </section>
  )
}

