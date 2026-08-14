import { useRef, useState, type JSX } from 'react'
import { Upload, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Modal, Button } from '.'
import { useFileUpload } from '../hooks/useFileUpload'
import { formatFileSize } from '../lib/formatFileSize'
import type{ UploadStatus } from '../types/upload'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  departmentId: string
  parentId: string | null
}

const statusIcon: Record<UploadStatus, JSX.Element> = {
  queued: <Loader2 size={16} className="text-text-muted animate-spin" />,
  hashing: <Loader2 size={16} className="text-accent-light animate-spin" />,
  uploading: <Loader2 size={16} className="text-accent-light animate-spin" />,
  complete: <CheckCircle2 size={16} className="text-nominal" />,
  error: <XCircle size={16} className="text-critical" />,
}

export function UploadModal({ isOpen, onClose, departmentId, parentId }: UploadModalProps) {
  const { items, addFiles, reset } = useFileUpload({ departmentId, parentId })
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
  }

  function handleClose() {
    reset()
    onClose()
  }

  const allComplete = items.length > 0 && items.every((it) => it.status === 'complete' || it.status === 'error')

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload files" size="lg">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-accent bg-accent/5' : 'border-border-default hover:border-border-default/70'
        }`}
      >
        <Upload size={28} className="mx-auto text-text-muted mb-2" />
        <p className="text-text-secondary text-sm">Drag files here, or click to browse</p>
        <p className="text-text-muted text-xs mt-1">Files over 10MB upload in chunks automatically</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {items.length > 0 && (
        <div className="mt-4 space-y-2 max-h-64 overflow-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 bg-surface rounded-md px-3 py-2">
              {statusIcon[item.status]}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-primary truncate">{item.file.name}</span>
                  <span className="text-text-muted shrink-0 ml-2">{formatFileSize(item.file.size)}</span>
                </div>
                <div className="h-1 bg-border-subtle rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${item.status === 'error' ? 'bg-critical' : 'bg-accent'}`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                {item.status === 'error' && <span className="text-critical text-xs">{item.error}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end mt-4">
        <Button variant={allComplete ? 'primary' : 'outline'} onClick={handleClose}>
          {allComplete ? 'Done' : 'Close'}
        </Button>
      </div>
    </Modal>
  )
}