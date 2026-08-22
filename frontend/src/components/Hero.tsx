import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCms } from '../context/cmsContext'
import { type HeroContent } from '../types/cms'
import { Button } from '.'
import { GuestAccessPanel } from './GuestAccessPanel'

export function Hero() {
  const { cmsBlocks, isLoading } = useCms()
  const hero = cmsBlocks['hero'] as unknown as HeroContent | undefined

  if (isLoading) {
    return <section className="mx-auto min-h-[620px] w-[min(1280px,calc(100%-32px))] animate-pulse bg-card/60" aria-label="Loading hero" />
  }

  return (
    <section id="hero" className="relative isolate overflow-hidden border-b border-border-subtle bg-page" aria-labelledby="hero-title">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_35%,rgba(22,131,255,0.15),transparent_32rem)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,0.06),transparent_26rem)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:50px_50px]" />

      <div className="mx-auto grid min-h-[650px] w-[min(1280px,calc(100%-32px))] items-center gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-20 lg:py-24">
        <div className="relative z-10">
          <p className="mb-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-light"><span className="h-1.5 w-1.5 rounded-full bg-accent-light shadow-[0_0_12px_rgba(76,163,255,0.8)]" />WELCOME TO ISTRAC-FMS</p>
          <h1 id="hero-title" className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-text-primary sm:text-6xl lg:text-[4.75rem]">{hero?.title ?? 'Spacecraft Operations Area'}</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">{hero?.subtitle ?? 'Centralized, permission-controlled file management for ISTRAC departments.'}</p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Link to="/register"><Button variant="primary" size="lg">{hero?.ctaText ?? 'Request Access'}<ArrowRight size={17} /></Button></Link>
            <a href="#features" className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-text-secondary transition hover:text-text-primary">Explore platform <ArrowRight size={15} /></a>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-xs text-text-muted">
            <span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-accent-light" />Permission-aware</span>
            <span className="inline-flex items-center gap-2"><LockKeyhole size={15} className="text-accent-light" />Controlled access</span>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[390px]">
          <div className="absolute -inset-20 -z-10 rounded-full bg-accent/10 blur-3xl" />
          <GuestAccessPanel />
        </div>
      </div>
    </section>
  )
}
