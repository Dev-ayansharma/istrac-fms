import { ArrowUpRight, Building2, ShieldCheck } from 'lucide-react'
import { useCms } from '../context/cmsContext'

interface OrganizationOverview { text?: string }

export function AboutSection() {
  const { cmsBlocks } = useCms()
  const overview = cmsBlocks['org_overview'] as OrganizationOverview | undefined
  if (!overview?.text) return null

  return (
    <section id="about" className="border-b border-border-subtle bg-page-soft py-20 sm:py-24" aria-labelledby="about-title">
      <div className="mx-auto grid w-[min(1280px,calc(100%-32px))] items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="relative grid aspect-square max-w-[440px] place-items-center overflow-hidden rounded-xl border border-border-subtle bg-card [background-image:radial-gradient(circle,rgba(22,131,255,0.10),transparent_58%)]" aria-hidden="true">
          <div className="absolute inset-[12%] rounded-full border border-dashed border-accent/10" /><div className="absolute inset-y-0 left-1/2 w-px bg-accent/[0.07]" /><div className="absolute inset-x-0 top-1/2 h-px bg-accent/[0.07]" />
          <span className="absolute left-6 top-6 font-mono text-[9px] tracking-widest text-text-dim">13.04° N</span><span className="absolute bottom-6 right-6 font-mono text-[9px] tracking-widest text-text-dim">77.58° E</span>
          <div className="relative grid h-36 w-36 place-items-center content-center gap-1 rounded-full border border-accent/20 bg-page/75 text-accent-light shadow-[0_0_70px_rgba(22,131,255,0.10)]"><Building2 size={32} strokeWidth={1.3} /><span className="text-xs font-extrabold tracking-[0.18em]">ISTRAC</span><small className="font-mono text-[8px] tracking-[0.12em] text-text-dim">FMS / 01</small></div>
        </div>
        <div className="max-w-2xl"><p className="mb-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-accent-light"><span className="h-1.5 w-1.5 rounded-full bg-accent-light" />ABOUT THE PLATFORM</p><h2 id="about-title" className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-text-primary sm:text-4xl">Information infrastructure for mission support.</h2><p className="mt-6 text-base leading-8 text-text-secondary">{overview.text}</p><div className="mt-7 grid gap-3 text-sm text-text-secondary"><span className="inline-flex items-center gap-2"><ShieldCheck size={17} className="text-accent-light" />Permission-aware access</span><span className="inline-flex items-center gap-2"><ShieldCheck size={17} className="text-accent-light" />Traceable file activity</span><span className="inline-flex items-center gap-2"><ShieldCheck size={17} className="text-accent-light" />Department-scoped resources</span></div><a className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent-light transition hover:text-white" href="#contact">Contact support <ArrowUpRight size={16} /></a></div>
      </div>
    </section>
  )
}
