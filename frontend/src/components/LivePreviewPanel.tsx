import { Monitor, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { usePreviewRefresh } from '../context/PreviewRefreshContext'

type ViewportMode = 'desktop' | 'mobile'
const viewportWidths: Record<ViewportMode, string> = { desktop: '100%', mobile: '390px' }

export function LivePreviewPanel() {
  const [viewport, setViewport] = useState<ViewportMode>('desktop')
  const { refreshKey } = usePreviewRefresh()

  return (
    <div className="flex flex-col h-full border border-border-subtle rounded-lg overflow-hidden bg-surface">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle bg-card">
        <span className="text-xs text-text-muted">Live Preview</span>
        <div className="flex gap-1 bg-surface rounded-md p-1 border border-border-subtle">
          <button onClick={() => setViewport('desktop')} className={`p-1.5 rounded ${viewport === 'desktop' ? 'bg-card text-accent-light' : 'text-text-muted'}`} aria-label="Desktop width">
            <Monitor size={14} />
          </button>
          <button onClick={() => setViewport('mobile')} className={`p-1.5 rounded ${viewport === 'mobile' ? 'bg-card text-accent-light' : 'text-text-muted'}`} aria-label="Mobile width">
            <Smartphone size={14} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-page flex justify-center p-4">
        <iframe
          key={refreshKey}
          src="/"
          title="Landing page preview"
          style={{ width: viewportWidths[viewport], height: '100%', border: 'none' }}
          className="bg-page transition-all duration-200"
        />
      </div>
    </div>
  )
}