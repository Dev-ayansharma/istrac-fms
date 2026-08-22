import { useState, useEffect, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import { ChevronLeft, ChevronRight } from 'lucide-react'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

interface PdfPreviewProps {
  fileUrl: string
}

export function PdfPreview({ fileUrl }: PdfPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null)
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    pdfjsLib.getDocument({ url: fileUrl }).promise.then((doc) => {
      if (cancelled) return
      setPdfDoc(doc)
      setNumPages(doc.numPages)
      setIsLoading(false)
    })
    return () => { cancelled = true }
  }, [fileUrl])

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return
    pdfDoc.getPage(pageNum).then((page) => {
      const viewport = page.getViewport({ scale: 1.3 })
      const canvas = canvasRef.current!
      const context = canvas.getContext('2d')!
      canvas.height = viewport.height
      canvas.width = viewport.width
      page.render({ canvasContext: context, viewport, canvas })
    })
  }, [pdfDoc, pageNum])

  if (isLoading) return <p className="num text-xs text-text-dim">Loading PDF…</p>

  return (
    <div className="flex flex-col gap-3">
      <div className="flex max-h-[60vh] justify-center overflow-auto rounded-lg border border-border-subtle bg-page">
        <canvas ref={canvasRef} />
      </div>

      {/* Page transport */}
      <div className="flex items-center justify-center">
        <div className="flex items-center overflow-hidden rounded-md border border-border-default">
          <button
            type="button"
            onClick={() => setPageNum((p) => Math.max(1, p - 1))}
            disabled={pageNum <= 1}
            aria-label="Previous page"
            className="p-1.5 text-text-muted transition-colors duration-150 hover:bg-card-hover hover:text-text-primary disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft size={14} strokeWidth={2} />
          </button>

          <span aria-hidden="true" className="w-px self-stretch bg-border-default" />

          <span className="num px-3 text-[11px] text-text-secondary">
            {pageNum} <span className="text-text-dim">/</span> {numPages}
          </span>

          <span aria-hidden="true" className="w-px self-stretch bg-border-default" />

          <button
            type="button"
            onClick={() => setPageNum((p) => Math.min(numPages, p + 1))}
            disabled={pageNum >= numPages}
            aria-label="Next page"
            className="p-1.5 text-text-muted transition-colors duration-150 hover:bg-card-hover hover:text-text-primary disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}