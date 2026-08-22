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
    <section
      className="relative isolate overflow-hidden border-b border-border-subtle bg-surface"
      aria-labelledby="banner-title"
    >
      {/* Station mesh, fading out toward the right so the call to action sits
          on a quiet field. */}
      <div
        aria-hidden="true"
        className="graticule pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:linear-gradient(to_right,black,transparent_70%)]"
      />

      <div className="shell py-20 sm:py-24">
        <div className="flex flex-col justify-between gap-9 border-l-2 border-l-accent pl-6 sm:pl-8 lg:flex-row lg:items-end lg:gap-16">
          <div>
            <p className="eyebrow text-accent-light">Ready when you are</p>

            {banner.title && (
              <h2
                id="banner-title"
                className="display mt-5 max-w-2xl text-3xl text-text-primary sm:text-[2.5rem]"
              >
                {banner.title}
              </h2>
            )}

            {banner.subtitle && (
              <p className="mt-5 max-w-xl text-sm leading-7 text-text-secondary">
                {banner.subtitle}
              </p>
            )}
          </div>

          {banner.ctaText && (
            <Link to={banner.ctaHref ?? '/register'} className="shrink-0">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                {banner.ctaText}
                <ArrowRight size={15} strokeWidth={2} />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

