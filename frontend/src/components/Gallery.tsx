import { ArrowUpRight } from 'lucide-react'
import { useCms } from '../context/cmsContext'

interface GalleryItem { url: string; label: string; caption: string }

export function Gallery() {
  const { cmsBlocks } = useCms()
  const items = (cmsBlocks['gallery']?.items as GalleryItem[]) ?? []
  if (items.length === 0) return null

  return (
    <section id="gallery" className="border-b border-border-subtle bg-page py-20 sm:py-24" aria-labelledby="gallery-title">
      <div className="mx-auto w-[min(1280px,calc(100%-32px))]">
        <div className="mb-9 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="mb-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-accent-light"><span className="h-1.5 w-1.5 rounded-full bg-accent-light" />PLATFORM OVERVIEW</p><h2 id="gallery-title" className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-text-primary sm:text-4xl">A clear view of your workspace.</h2></div><p className="max-w-md text-sm leading-6 text-text-muted">Curated views and system information from the ISTRAC-FMS platform.</p></div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => <figure key={`${item.url}-${index}`} className="group overflow-hidden rounded-xl border border-border-subtle bg-card/70 transition-all duration-300 hover:border-border-bright hover:shadow-card">
            <div className="relative aspect-video overflow-hidden bg-page-soft"><img src={item.url} alt={item.label} loading="lazy" className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" /><span className="absolute left-4 top-4 rounded-md border border-white/10 bg-page/60 px-2 py-1 font-mono text-[9px] text-text-secondary backdrop-blur">0{index + 1}</span><span className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-page/70 text-text-secondary backdrop-blur transition group-hover:text-white"><ArrowUpRight size={15} /></span></div>{item.caption && <figcaption className="grid gap-1 p-4"><strong className="text-sm text-text-primary">{item.label}</strong><span className="text-xs leading-5 text-text-muted">{item.caption}</span></figcaption>}</figure>)}
        </div>
      </div>
    </section>
  )
}
