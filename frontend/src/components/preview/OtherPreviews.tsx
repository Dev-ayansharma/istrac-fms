import { useState, useEffect } from 'react'
import { Download, FileText } from 'lucide-react'
import { Button } from '..'
import { formatFileSize } from '../../lib/formatFileSize'

export function VideoPreview({ fileUrl }: { fileUrl: string }) {
  return (
    <video
      controls
      className="max-h-[60vh] w-full rounded-lg border border-border-subtle bg-page"
    >
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
    <div className="max-h-[60vh] overflow-auto rounded-lg border border-border-subtle bg-page">
      {isCsv ? (
        <table className="num w-full text-[11px]">
          <tbody className="divide-y divide-border-subtle">
            {content.split('\n').map((row, i) => (
              <tr key={i} className="transition-colors duration-150 hover:bg-card-hover">
                {row.split(',').map((cell, j) => (
                  <td
                    key={j}
                    className="border-r border-border-subtle px-2.5 py-1.5 text-text-secondary last:border-r-0"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <pre className="num p-4 text-[11px] leading-relaxed whitespace-pre-wrap text-text-secondary">
          {content}
        </pre>
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
    <div className="rounded-lg border border-border-subtle bg-surface px-6 py-12 text-center">
      <FileText
        size={28}
        strokeWidth={1.4}
        aria-hidden="true"
        className="mx-auto text-text-dim"
      />

      <p className="mt-4 truncate text-[13px] text-text-primary">{fileName}</p>

      <p className="num mt-1.5 text-[11px] text-text-dim">
        {formatFileSize(sizeBytes)}
      </p>

      <p className="mt-3 text-[13px] text-text-muted">
        This format can't be rendered in the browser.
      </p>

      <div className="mt-5">
        <Button variant="primary" size="sm" onClick={onDownload}>
          <Download size={13} strokeWidth={2} />
          Download to view
        </Button>
      </div>
    </div>
  )
}
