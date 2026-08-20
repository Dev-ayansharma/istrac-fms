import { useState, useEffect } from 'react'
import { Download, FileText } from 'lucide-react'
import { Button } from '..'
import { formatFileSize } from '../../lib/formatFileSize'

export function VideoPreview({ fileUrl }: { fileUrl: string }) {
  return (
    <video controls className="max-h-[60vh] w-full rounded-md">
      <source src={fileUrl} />
      Your browser does not support video playback.
    </video>
  )
}

export function TextPreview({ fileUrl, mimeType }: { fileUrl: string; mimeType: string }) {
  const [content, setContent] = useState('')

  useEffect(() => {
    fetch(fileUrl).then((r) => r.text()).then(setContent)
  }, [fileUrl])

  const isCsv = mimeType === 'text/csv'

  return (
    <div className="max-h-[60vh] overflow-auto bg-surface border border-border-subtle rounded-md p-4">
      {isCsv ? (
        <table className="text-xs font-mono w-full">
          <tbody>
            {content.split('\n').map((row, i) => (
              <tr key={i} className="border-b border-border-subtle">
                {row.split(',').map((cell, j) => (
                  <td key={j} className="px-2 py-1 text-text-primary">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <pre className="text-xs font-mono text-text-primary whitespace-pre-wrap">{content}</pre>
      )}
    </div>
  )
}

export function OfficePreview({ fileName, sizeBytes, onDownload }: {
  fileName: string
  sizeBytes: number | null
  onDownload: () => void
}) {

  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <FileText size={48} className="text-text-muted" />
      <div className="text-center">
        <p className="text-text-primary font-medium">{fileName}</p>
        <p className="text-text-muted text-sm">{formatFileSize(sizeBytes)}</p>
        <p className="text-text-muted text-xs mt-1">Preview not available for this file type</p>
      </div>
      <Button variant="primary" onClick={onDownload}>
        <span className="flex items-center gap-1.5"><Download size={14} /> Download to view</span>
      </Button>
    </div>
  )
}