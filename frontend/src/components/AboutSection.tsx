import { ArrowUpRight, Check } from 'lucide-react'
import { useCms } from '../context/cmsContext'

interface OrganizationOverview { text?: string }

const ASSURANCES = [
  'Permission-aware access',
  'Traceable file activity',
  'Department-scoped resources',
]

export function AboutSection() {
  const { cmsBlocks } = useCms()
  const overview = cmsBlocks['org_overview'] as OrganizationOverview | undefined
  if (!overview?.text) return null

  return (
    <section
      id="about"
      className="border-b border-border-subtle bg-page-soft py-20 sm:py-24"
      aria-labelledby="about-title"
    >
      <div className="shell grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        {/* Station plate. Everything here is drawn with rules — a graticule,
            a crosshair and the fix, the way it appears on a tracking chart. */}
        <div
          className="relative aspect-square w-full max-w-[420px] overflow-hidden rounded-xl border border-border-subtle bg-card shadow-card"
          aria-hidden="true"
        >
          <div className="graticule-fine absolute inset-0 opacity-50" />

          <div className="absolute inset-y-0 left-1/2 w-px bg-border-default" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-border-default" />

          <div className="absolute inset-[16%] rounded-full border border-dashed border-accent/20" />
          <div className="absolute inset-[30%] rounded-full border border-border-default" />

          {/* The fix itself, at the intersection. */}
          <div className="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
          <div className="animate-pulse-slow absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/30" />

          <span className="num absolute top-4 left-4 text-[10px] text-text-dim">
            13.03°N
          </span>
          <span className="num absolute right-4 bottom-4 text-[10px] text-text-dim">
            77.51°E
          </span>

          <div className="absolute bottom-4 left-4">
            <p className="eyebrow text-text-secondary">ISTRAC</p>
            <p className="num mt-1 text-[10px] text-text-dim">BENGALURU</p>
          </div>
        </div>

        <div className="max-w-2xl">
          <p className="eyebrow flex items-center gap-2.5 text-accent-light">
            <span aria-hidden="true" className="h-2.5 w-px bg-accent-light" />
            About the platform
          </p>

          <h2
            id="about-title"
            className="display mt-5 text-3xl text-text-primary sm:text-[2.5rem]"
          >
            Information infrastructure for mission support.
          </h2>

          <p className="mt-7 text-[15px] leading-8 text-text-secondary">
            {overview.text}
          </p>

          <ul className="mt-8 grid gap-3 border-t border-border-subtle pt-7">
            {ASSURANCES.map((assurance) => (
              <li
                key={assurance}
                className="flex items-center gap-2.5 text-[13px] text-text-secondary"
              >
                <Check
                  size={14}
                  strokeWidth={2.2}
                  className="shrink-0 text-nominal"
                  aria-hidden="true"
                />
                {assurance}
              </li>
            ))}
          </ul>

          <a
            className="group mt-8 inline-flex items-center gap-2 text-[13px] text-accent-light transition-colors duration-150 hover:text-text-primary"
            href="#contact"
          >
            Contact support
            <ArrowUpRight
              size={14}
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>
    </section>
  )
}
