import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCms } from '../context/cmsContext'
import { type HeroContent } from '../types/cms'
import { Button } from '.'
import { GuestAccessPanel } from './GuestAccessPanel'

export function Hero() {
  const { cmsBlocks, isLoading } = useCms()
  const hero = cmsBlocks['hero'] as unknown as HeroContent | undefined

  if (isLoading) {
    return (
      <section
        aria-label="Loading"
        className="border-b border-border-subtle bg-page"
      >
        <div className="shell grid min-h-[600px] items-center gap-12 py-20 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5">
            <div className="h-2.5 w-40 rounded-xs bg-card-hover" />
            <div className="h-14 w-full max-w-2xl rounded-sm bg-card-hover" />
            <div className="h-14 w-3/4 max-w-xl rounded-sm bg-card-hover" />
            <div className="h-4 w-full max-w-lg rounded-xs bg-card" />
          </div>
          <div className="h-80 rounded-xl border border-border-subtle bg-card" />
        </div>
      </section>
    )
  }

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden border-b border-border-subtle bg-page"
      aria-labelledby="hero-title"
    >
      {/* Atmosphere: a station graticule and the curve of the horizon, drawn
          in hairlines. No imagery, nothing to load, nothing to glow. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="graticule absolute inset-0 [mask-image:radial-gradient(ellipse_at_65%_40%,black,transparent_75%)]" />

        {/* Limb of the Earth, cropped by the section. */}
        <div className="absolute -right-[38%] -bottom-[62%] aspect-square w-[115%] rounded-full border border-accent/[0.18] sm:-right-[28%] sm:w-[92%]" />
        <div className="absolute -right-[36%] -bottom-[60%] aspect-square w-[115%] rounded-full border border-border-subtle sm:-right-[26%] sm:w-[92%]" />

        {/* Orbit crossing the limb at a shallow angle. */}
        <div className="absolute -right-[42%] -bottom-[70%] aspect-square w-[130%] -rotate-12 rounded-full border border-dashed border-accent/[0.10] sm:-right-[32%] sm:w-[104%]" />
      </div>

      <div className="shell grid min-h-[600px] items-center gap-14 py-20 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-20 lg:py-28">
        <div className="relative">
          <p className="eyebrow animate-rise flex items-center gap-2.5 text-accent-light">
            <span aria-hidden="true" className="h-2.5 w-px bg-accent-light" />
            Welcome to ISTRAC-FMS
          </p>

          <h1
            id="hero-title"
            className="display animate-rise mt-6 max-w-3xl text-[2.6rem] text-text-primary sm:text-6xl lg:text-[4.5rem]"
            style={{ animationDelay: '60ms' }}
          >
            {hero?.title ?? 'Spacecraft Operations Area'}
          </h1>

          <p
            className="animate-rise mt-7 max-w-xl text-base leading-7 text-text-secondary sm:text-[17px] sm:leading-8"
            style={{ animationDelay: '120ms' }}
          >
            {hero?.subtitle ??
              'Centralized, permission-controlled file management for ISTRAC departments.'}
          </p>

          <div
            className="animate-rise mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: '180ms' }}
          >
            <Link to="/register">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                {hero?.ctaText ?? 'Request access'}
                <ArrowRight size={15} strokeWidth={2} />
              </Button>
            </Link>

            <a
              href="#features"
              className="group inline-flex items-center justify-center gap-2 px-1 py-2 text-[13px] text-text-secondary transition-colors duration-150 hover:text-text-primary"
            >
              See what it does
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
          </div>

          {/* Station identity, in the form it appears in every log. */}
          <dl
            className="animate-rise mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border-subtle pt-6"
            style={{ animationDelay: '240ms' }}
          >
            <div>
              <dt className="eyebrow text-text-dim">Station</dt>
              <dd className="num mt-1.5 text-xs text-text-secondary">BENGALURU · BLR</dd>
            </div>

            <span aria-hidden="true" className="h-8 w-px bg-border-subtle" />

            <div>
              <dt className="eyebrow text-text-dim">Coordinates</dt>
              <dd className="num mt-1.5 text-xs text-text-secondary">13.03°N 77.51°E</dd>
            </div>

            <span aria-hidden="true" className="hidden h-8 w-px bg-border-subtle sm:block" />

            <div>
              <dt className="eyebrow text-text-dim">Reference</dt>
              <dd className="num mt-1.5 text-xs text-text-secondary">UTC</dd>
            </div>
          </dl>
        </div>

        <div
          className="animate-rise relative mx-auto w-full max-w-[380px]"
          style={{ animationDelay: '140ms' }}
        >
          <GuestAccessPanel />
        </div>
      </div>
    </section>
  )
}
