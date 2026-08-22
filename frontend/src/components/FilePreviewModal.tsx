import { useEffect } from 'react'
import { Modal, Button } from '.'
import { resolvePreviewKind } from '../lib/previewType'
import { useLogFileAccess } from '../hooks/useLogFileAccess'
import { PdfPreview } from './preview/PdfPreview'
import { ImagePreview } from './preview/ImagePreview'
import { VideoPreview, TextPreview, OfficePreview } from './preview/OtherPreviews'
import { api } from '../lib/axios'
import { formatFileSize } from '../lib/formatFileSize'

interface FilePreviewModalProps {
  file: { id: string; name: string; mimeType: string | null; sizeBytes: number | null } | null
  onClose: () => void
}

export function FilePreviewModal({ file, onClose }: FilePreviewModalProps) {
  const logAccess = useLogFileAccess()
  const isOpen = file !== null
  const kind = file ? resolvePreviewKind(file.mimeType) : 'unsupported'
  const fileUrl = file ? `${import.meta.env.VITE_API_URL}/files/${file.id}/download` : ''

  useEffect(() => {
    if (file) {
      // Every preview open logs to audit, per FE-033's acceptance criteria
      logAccess.mutate(file.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file?.id])

  async function handleDownload() {
    if (!file) return
    const response = await api.get(`/files/${file.id}/download`, { responseType: 'blob' })
    const url = URL.createObjectURL(response.data)
    const link = document.createElement('a')
    link.href = url
    link.download = file.name
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={file?.name ?? ''} size="lg">
      {file && (
        <>
          {/* Machine facts about what's on screen, before the render itself. */}
          <dl className="mb-4 grid grid-cols-2 gap-x-4 gap-y-2 border-b border-border-subtle pb-4 sm:grid-cols-3">
            <div className="min-w-0">
              <dt className="col-label">File</dt>
              <dd className="mt-1 truncate text-[13px] text-text-primary">{file.name}</dd>
            </div>

            <div>
              <dt className="col-label">Type</dt>
              <dd className="num mt-1 truncate text-[11px] text-text-secondary">
                {file.mimeType ?? '—'}
              </dd>
            </div>

            <div>
              <dt className="col-label">Size</dt>
              <dd className="num mt-1 text-[11px] text-text-secondary">
                {formatFileSize(file.sizeBytes)}
              </dd>
            </div>
          </dl>

          {kind === 'pdf' && <PdfPreview fileUrl={fileUrl} />}
          {kind === 'image' && <ImagePreview fileUrl={fileUrl} fileName={file.name} />}
          {kind === 'video' && <VideoPreview fileUrl={fileUrl} />}
          {kind === 'text' && <TextPreview fileUrl={fileUrl} mimeType={file.mimeType!} />}
          {kind === 'office' && (
            <OfficePreview fileName={file.name} sizeBytes={file.sizeBytes} onDownload={handleDownload} />
          )}
          {kind === 'unsupported' && (
            <div className="rounded-lg border border-border-subtle bg-surface px-6 py-12 text-center">
              <p className="num text-sm text-text-dim">NO RENDERER</p>

              <p className="mt-2 text-[13px] text-text-muted">
                This file type can't be previewed in the browser.
              </p>

              <div className="mt-5">
                <Button variant="primary" size="sm" onClick={handleDownload}>
                  Download
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  )
}
