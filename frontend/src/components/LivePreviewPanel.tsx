import { Monitor, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { usePreviewRefresh } from '../context/PreviewRefreshContext'

type ViewportMode = 'desktop' | 'mobile'

const viewportWidths: Record<ViewportMode, string> = {
  desktop: '100%',
  mobile: '390px',
}

/**
 * The live page, framed like an instrument screen: hairline header, the
 * current width called out in mono, and the viewport transport on the right.
 */
export function LivePreviewPanel() {
  const [viewport, setViewport] = useState<ViewportMode>('desktop')
  const { refreshKey } = usePreviewRefresh()

  return (
    <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-xl border border-border-subtle bg-card shadow-card lg:min-h-0">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border-subtle px-4 py-3">
        <div className="flex min-w-0 items-baseline gap-3">
          <h2 className="eyebrow shrink-0 text-text-secondary">
            Live preview
          </h2>

          <span className="num truncate text-[11px] text-text-dim">
            {viewportWidths[viewport]}
          </span>
        </div>

        {/* Viewport controls */}
        <div className="flex shrink-0 items-center overflow-hidden rounded-md border border-border-subtle">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            aria-label="Desktop width"
            aria-pressed={viewport === 'desktop'}
            className={`p-1.5 transition-colors duration-150 ${
              viewport === 'desktop'
                ? 'bg-accent/10 text-accent-light'
                : 'text-text-dim hover:bg-card-hover hover:text-text-primary'
            }`}
          >
            <Monitor size={14} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            onClick={() => setViewport('mobile')}
            aria-label="Mobile width"
            aria-pressed={viewport === 'mobile'}
            className={`border-l border-border-subtle p-1.5 transition-colors duration-150 ${
              viewport === 'mobile'
                ? 'bg-accent/10 text-accent-light'
                : 'text-text-dim hover:bg-card-hover hover:text-text-primary'
            }`}
          >
            <Smartphone size={14} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      {/* Preview area */}
      <div className="graticule flex flex-1 justify-center overflow-auto bg-page p-4">
        <iframe
          key={refreshKey}
          src="/"
          title="Landing page preview"
          style={{
            width: viewportWidths[viewport],
            height: '100%',
            border: 'none',
          }}
          className="rounded-md bg-page shadow-card-lg transition-all duration-200"
        />
      </div>
    </div>
  )
}
