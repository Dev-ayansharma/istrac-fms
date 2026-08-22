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
    <section
      id="features"
      className="border-b border-border-subtle bg-page-soft py-20 sm:py-24"
      aria-labelledby="features-title"
    >
      <div className="shell">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow flex items-center gap-2.5 text-accent-light">
              <span aria-hidden="true" className="h-2.5 w-px bg-accent-light" />
              Core capabilities
            </p>

            <h2
              id="features-title"
              className="display mt-5 max-w-xl text-3xl text-text-primary sm:text-[2.5rem]"
            >
              Built for secure file management.
            </h2>
          </div>

          <p className="max-w-sm text-[13px] leading-6 text-text-muted">
            Everything your teams need to manage institutional files with
            confidence.
          </p>
        </div>

        {/* A spec sheet rather than a row of cards: the columns are divided by
            hairlines, so the set reads as one specification. */}
        <div className="mt-10 grid divide-y divide-border-subtle overflow-hidden rounded-xl border border-border-subtle bg-card shadow-card md:grid-cols-3 md:divide-x md:divide-y-0">
          {visibleItems.map((item, index) => {
            const Icon = ICONS[item.icon] ?? CheckCircle2

            return (
              <article
                key={`${item.title}-${index}`}
                className="group p-6 transition-colors duration-150 hover:bg-card-hover sm:p-7"
              >
                <Icon
                  size={20}
                  strokeWidth={1.6}
                  className="text-accent-light"
                  aria-hidden="true"
                />

                <h3 className="mt-7 text-[15px] text-text-primary">{item.title}</h3>

                <p className="mt-2.5 text-[13px] leading-6 text-text-muted">
                  {item.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
