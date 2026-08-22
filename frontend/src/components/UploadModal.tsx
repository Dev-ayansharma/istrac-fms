import { useRef, useState, type JSX } from 'react'
import {
  Upload,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react'

import { Modal, Button } from '.'
import { useFileUpload } from '../hooks/useFileUpload'
import { formatFileSize } from '../lib/formatFileSize'
import type { UploadStatus } from '../types/upload'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  departmentId: string
  parentId: string | null
}

const statusIcon: Record<UploadStatus, JSX.Element> = {
  queued: (
    <Loader2
      size={14}
      strokeWidth={1.8}
      className="animate-spin text-text-dim"
    />
  ),

  hashing: (
    <Loader2
      size={14}
      strokeWidth={1.8}
      className="animate-spin text-accent-light"
    />
  ),

  uploading: (
    <Loader2
      size={14}
      strokeWidth={1.8}
      className="animate-spin text-accent-light"
    />
  ),

  complete: (
    <CheckCircle2
      size={14}
      strokeWidth={1.8}
      className="text-nominal"
    />
  ),

  error: (
    <XCircle
      size={14}
      strokeWidth={1.8}
      className="text-critical"
    />
  ),
}

/** Machine-readable status, shown next to the icon so state is never colour-only. */
const statusLabel: Record<UploadStatus, string> = {
  queued: 'QUEUED',
  hashing: 'HASHING',
  uploading: 'UPLOADING',
  complete: 'DONE',
  error: 'FAILED',
}

export function UploadModal({
  isOpen,
  onClose,
  departmentId,
  parentId,
}: UploadModalProps) {
  const { items, addFiles, reset } = useFileUpload({
    departmentId,
    parentId,
  })

  const [isDragging, setIsDragging] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
    }
  }

  function handleClose() {
    reset()
    setIsDragging(false)
    onClose()
  }

  const allComplete =
    items.length > 0 &&
    items.every(
      (item) =>
        item.status === 'complete' ||
        item.status === 'error',
    )

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload files"
      size="lg"
    >
      {/* Drop zone — a real button, so it's reachable without a mouse. */}
      <button
        type="button"
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative block w-full overflow-hidden rounded-lg border border-dashed px-6 py-10 text-center transition-colors duration-150 ${
          isDragging
            ? 'border-accent bg-accent/[0.06]'
            : 'border-border-default bg-surface hover:border-border-bright hover:bg-card-hover'
        }`}
      >
        <span
          aria-hidden="true"
          className="graticule-fine absolute inset-0 opacity-50"
        />

        <span className="relative block">
          <Upload
            size={20}
            strokeWidth={1.6}
            aria-hidden="true"
            className={`mx-auto transition-colors duration-150 ${
              isDragging ? 'text-accent-light' : 'text-text-muted'
            }`}
          />

          <span className="mt-3 block text-[13px] text-text-secondary">
            Drag files here, or click to browse
          </span>

          <span className="num mt-1.5 block text-[10px] tracking-wide text-text-dim">
            &gt; 10 MB uploads in chunks automatically
          </span>
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          if (e.target.files) {
            addFiles(e.target.files)
            e.target.value = ''
          }
        }}
      />

      {/* Queue */}
      {items.length > 0 && (
        <div className="mt-5 overflow-hidden rounded-lg border border-border-subtle">
          <div className="flex items-center justify-between gap-4 border-b border-border-subtle bg-surface px-3 py-2">
            <span className="col-label">Queue</span>
            <span className="num text-[10px] text-text-dim">
              {items.length} {items.length === 1 ? 'file' : 'files'}
            </span>
          </div>

          <div className="max-h-64 divide-y divide-border-subtle overflow-auto">
            {items.map((item) => (
              <div key={item.id} className="px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="shrink-0">
                    {statusIcon[item.status]}
                  </span>

                  <span className="min-w-0 flex-1 truncate text-[13px] text-text-primary">
                    {item.file.name}
                  </span>

                  <span className="num shrink-0 text-[10px] text-text-dim">
                    {formatFileSize(item.file.size)}
                  </span>

                  <span
                    className={`num w-[72px] shrink-0 text-right text-[10px] tracking-wide ${
                      item.status === 'error'
                        ? 'text-critical'
                        : item.status === 'complete'
                          ? 'text-nominal'
                          : 'text-text-muted'
                    }`}
                  >
                    {statusLabel[item.status]}
                  </span>
                </div>

                {/* Progress — a hairline, not a pill. */}
                <div className="mt-2 h-px w-full bg-border-subtle">
                  <div
                    className={`h-px transition-all duration-300 ${
                      item.status === 'error'
                        ? 'bg-critical'
                        : item.status === 'complete'
                          ? 'bg-nominal'
                          : 'bg-accent'
                    }`}
                    style={{
                      width: `${item.progress}%`,
                    }}
                  />
                </div>

                {item.status === 'error' && (
                  <p className="mt-1.5 text-[11px] text-critical">
                    {item.error}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-5 flex justify-end border-t border-border-subtle pt-4">
        <Button
          variant={allComplete ? 'primary' : 'outline'}
          size="sm"
          onClick={handleClose}
        >
          {allComplete ? 'Done' : 'Close'}
        </Button>
      </div>
    </Modal>
  )
}
