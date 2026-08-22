import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCms } from '../context/cmsContext'
import { Button } from '.'

interface BannerContent { title?: string; subtitle?: string; ctaText?: string; ctaHref?: string; visible?: boolean }

export function Banner() {
  const { cmsBlocks } = useCms()
  const banner = cmsBlocks['banner'] as BannerContent | undefined
  if (!banner?.visible) return null

  return (
    <section className="relative overflow-hidden border-b border-border-subtle bg-surface py-20 sm:py-24" aria-labelledby="banner-title">
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:52px_52px]" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative mx-auto flex w-[min(1280px,calc(100%-32px))] flex-col justify-between gap-8 rounded-xl border border-border-subtle bg-card/50 p-7 sm:p-9 lg:flex-row lg:items-center lg:p-10"><div><p className="mb-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-accent-light"><span className="h-1.5 w-1.5 rounded-full bg-accent-light" />READY WHEN YOU ARE</p>{banner.title && <h2 id="banner-title" className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-text-primary sm:text-4xl">{banner.title}</h2>}{banner.subtitle && <p className="mt-4 max-w-2xl text-sm leading-6 text-text-muted">{banner.subtitle}</p>}</div>{banner.ctaText && <Link to={banner.ctaHref ?? '/register'}><Button variant="primary" size="lg">{banner.ctaText}<ArrowRight size={17} /></Button></Link>}</div>
    </section>
  )
}
