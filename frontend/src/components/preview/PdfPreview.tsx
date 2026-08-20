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

  if (isLoading) return <p className="text-text-muted text-sm">Loading PDF...</p>

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="overflow-auto max-h-[60vh] border border-border-subtle rounded-md">
        <canvas ref={canvasRef} />
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPageNum((p) => Math.max(1, p - 1))}
          disabled={pageNum <= 1}
          className="text-text-secondary disabled:opacity-30"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm text-text-secondary">Page {pageNum} of {numPages}</span>
        <button
          onClick={() => setPageNum((p) => Math.min(numPages, p + 1))}
          disabled={pageNum >= numPages}
          className="text-text-secondary disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}