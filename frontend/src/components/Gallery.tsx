import { useCms } from '../context/cmsContext'

interface GalleryItem { url: string; label: string; caption: string }

export function Gallery() {
  const { cmsBlocks } = useCms()
  const items = (cmsBlocks['gallery']?.items as GalleryItem[]) ?? []
  if (items.length === 0) return null

  return (
    <section
      id="gallery"
      className="border-b border-border-subtle bg-page py-20 sm:py-24"
      aria-labelledby="gallery-title"
    >
      <div className="shell">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow flex items-center gap-2.5 text-accent-light">
              <span aria-hidden="true" className="h-2.5 w-px bg-accent-light" />
              Platform overview
            </p>

            <h2
              id="gallery-title"
              className="display mt-5 max-w-xl text-3xl text-text-primary sm:text-[2.5rem]"
            >
              A clear view of your workspace.
            </h2>
          </div>

          <p className="max-w-sm text-[13px] leading-6 text-text-muted">
            Curated views and system information from the ISTRAC-FMS platform.
          </p>
        </div>

        {/* Each image sits in a plate: hairline frame, inset image, caption
            below the rule. Nothing here is clickable, so nothing pretends to be. */}
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <figure
              key={`${item.url}-${index}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-card shadow-card transition-colors duration-200 hover:border-border-default"
            >
              <div className="relative aspect-video overflow-hidden border-b border-border-subtle bg-page-soft">
                <div
                  aria-hidden="true"
                  className="graticule-fine absolute inset-0 opacity-40"
                />

                <img
                  src={item.url}
                  alt={item.label}
                  loading="lazy"
                  className="relative h-full w-full object-cover opacity-85 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>

              {item.caption && (
                <figcaption className="flex flex-1 flex-col gap-1.5 p-4">
                  <strong className="text-[13px] font-normal text-text-primary">
                    {item.label}
                  </strong>

                  <span className="text-xs leading-5 text-text-muted">
                    {item.caption}
                  </span>
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
