import { useState } from 'react'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

export function ImagePreview({ fileUrl, fileName }: { fileUrl: string; fileName: string }) {
  const [zoom, setZoom] = useState(1)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="overflow-auto max-h-[60vh] border border-border-subtle rounded-md bg-page flex items-center justify-center">
        <img
          src={fileUrl}
          alt={fileName}
          style={{ transform: `scale(${zoom})`, transition: 'transform 0.15s' }}
          className="max-w-none"
        />
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))} className="text-text-secondary">
          <ZoomOut size={18} />
        </button>
        <span className="text-sm text-text-secondary w-12 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom((z) => Math.min(4, z + 0.25))} className="text-text-secondary">
          <ZoomIn size={18} />
        </button>
        <button onClick={() => setZoom(1)} className="text-text-secondary" aria-label="Reset zoom">
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  )
}