import { Monitor, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { usePreviewRefresh } from '../context/PreviewRefreshContext'

type ViewportMode = 'desktop' | 'mobile'

const viewportWidths: Record<ViewportMode, string> = {
  desktop: '100%',
  mobile: '390px',
}

export function LivePreviewPanel() {
  const [viewport, setViewport] = useState<ViewportMode>('desktop')
  const { refreshKey } = usePreviewRefresh()

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border-subtle bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle bg-card px-3 py-2">
        <span className="text-xs font-medium text-text-secondary">
          Live Preview
        </span>

        {/* Viewport controls */}
        <div className="flex items-center gap-1 rounded-md border border-border-subtle bg-surface p-1">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            aria-label="Desktop width"
            className={`rounded p-1.5 transition-colors ${
              viewport === 'desktop'
                ? 'bg-card text-accent-light'
                : 'text-text-muted hover:bg-card hover:text-text-primary'
            }`}
          >
            <Monitor size={14} />
          </button>

          <button
            type="button"
            onClick={() => setViewport('mobile')}
            aria-label="Mobile width"
            className={`rounded p-1.5 transition-colors ${
              viewport === 'mobile'
                ? 'bg-card text-accent-light'
                : 'text-text-muted hover:bg-card hover:text-text-primary'
            }`}
          >
            <Smartphone size={14} />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex flex-1 justify-center overflow-auto bg-page p-4">
        <iframe
          key={refreshKey}
          src="/"
          title="Landing page preview"
          style={{
            width: viewportWidths[viewport],
            height: '100%',
            border: 'none',
          }}
          className="bg-page transition-all duration-200"
        />
      </div>
    </div>
  )
}