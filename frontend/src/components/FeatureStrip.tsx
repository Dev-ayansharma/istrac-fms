import { CheckCircle2, Shield, Search, Clock, type LucideIcon } from 'lucide-react'
import { useCms } from '../context/cmsContext'

interface FeatureItem { icon: string; title: string; description: string; visible: boolean }
const ICONS: Record<string, LucideIcon> = { Shield, Search, Clock }

export function FeatureStrip() {
  const { cmsBlocks } = useCms()
  const items = (cmsBlocks['feature_strip']?.items as FeatureItem[]) ?? []
  const visibleItems = items.filter((item) => item.visible)
  if (visibleItems.length === 0) return null

  return (
    <section id="features" className="border-b border-border-subtle bg-page-soft py-20 sm:py-24" aria-labelledby="features-title">
      <div className="mx-auto w-[min(1280px,calc(100%-32px))]">
        <div className="mb-9 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div><p className="mb-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-accent-light"><span className="h-1.5 w-1.5 rounded-full bg-accent-light" />CORE CAPABILITIES</p><h2 id="features-title" className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-text-primary sm:text-4xl">Built for secure file management.</h2></div>
          <p className="max-w-md text-sm leading-6 text-text-muted">Everything your teams need to manage institutional files with confidence.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {visibleItems.map((item, index) => {
            const Icon = ICONS[item.icon] ?? CheckCircle2
            return <article key={`${item.title}-${index}`} className="group relative overflow-hidden rounded-xl border border-border-subtle bg-card/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-border-bright hover:bg-card-hover hover:shadow-card-hover sm:p-6">
              <span className="absolute right-5 top-5 font-mono text-[9px] tracking-wider text-text-dim">0{index + 1}</span>
              <div className="mb-10 grid h-11 w-11 place-items-center rounded-lg border border-accent/20 bg-accent/10 text-accent-light transition-all duration-300 group-hover:border-accent/40 group-hover:bg-accent/15 group-hover:shadow-glow"><Icon size={21} strokeWidth={1.8} /></div>
              <h3 className="text-base font-semibold text-text-primary">{item.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">{item.description}</p>
              <span className="absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accent/80 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
            </article>
          })}
        </div>
      </div>
    </section>
  )
}

