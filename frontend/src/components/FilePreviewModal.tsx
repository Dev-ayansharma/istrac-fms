import { useEffect } from 'react'
import { Modal, Button } from '.'
import { resolvePreviewKind } from '../lib/previewType'
import { useLogFileAccess } from '../hooks/useLogFileAccess'
import { PdfPreview } from './preview/PdfPreview'
import { ImagePreview } from './preview/ImagePreview'
import { VideoPreview, TextPreview, OfficePreview } from './preview/OtherPreviews'
import { api } from '../lib/axios'

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
          {kind === 'pdf' && <PdfPreview fileUrl={fileUrl} />}
          {kind === 'image' && <ImagePreview fileUrl={fileUrl} fileName={file.name} />}
          {kind === 'video' && <VideoPreview fileUrl={fileUrl} />}
          {kind === 'text' && <TextPreview fileUrl={fileUrl} mimeType={file.mimeType!} />}
          {kind === 'office' && (
            <OfficePreview fileName={file.name} sizeBytes={file.sizeBytes} onDownload={handleDownload} />
          )}
          {kind === 'unsupported' && (
            <div className="text-center py-12">
              <p className="text-text-muted text-sm mb-4">Preview not supported for this file type.</p>
              <Button variant="primary" onClick={handleDownload}>Download</Button>
            </div>
          )}
        </>
      )}
    </Modal>
  )
}