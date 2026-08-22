import type { ReactNode } from 'react'

interface PanelProps {
  /** Human label for the panel. Set in Lato, uppercase, small. */
  title?: string
  /** Machine-side context: counts, timestamps, ranges. Set in mono. */
  meta?: ReactNode
  /** Controls that belong to this panel, pinned to the header right. */
  actions?: ReactNode
  /** Drop the body padding — for panels that hold a table or a list. */
  flush?: boolean
  className?: string
  children: ReactNode
}

/**
 * The standard container for a titled region of a page.
 *
 * A hairline header strip carries the label and its machine-side meta, so
 * every panel in the app announces itself the same way and tables can sit
 * flush inside without a second frame around them.
 */
export function Panel({
  title,
  meta,
  actions,
  flush = false,
  className = '',
  children,
}: PanelProps) {
  const hasHeader = Boolean(title || meta || actions)

  return (
    <section
      className={`overflow-hidden rounded-xl border border-border-subtle bg-card shadow-card ${className}`}
    >
      {hasHeader && (
        <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border-subtle px-4 py-3">
          <div className="flex min-w-0 items-baseline gap-3">
            {title && (
              <h2 className="eyebrow shrink-0 text-text-secondary">{title}</h2>
            )}

            {meta && (
              <span className="num truncate text-[11px] text-text-dim">{meta}</span>
            )}
          </div>

          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}

      <div className={flush ? '' : 'p-4 sm:p-5'}>{children}</div>
    </section>
  )
}
