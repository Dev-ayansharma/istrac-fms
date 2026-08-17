import { X, Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useFileVersions } from '../hooks/useFileVersions'
import { formatFileSize } from '../lib/formatFileSize'
import { api } from '../lib/axios'

interface VersionHistoryPanelProps {
  fileId: string | null
  fileName: string
  onClose: () => void
}

export function VersionHistoryPanel({
  fileId,
  fileName,
  onClose,
}: VersionHistoryPanelProps) {
  const { data: versions, isLoading } = useFileVersions(fileId)

  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const isOpen = fileId !== null

  async function handleDownload(versionId: string) {
    if (!fileId || downloadingId) return

    setDownloadingId(versionId)

    try {
      const response = await api.get(
        `/files/${fileId}/versions/${versionId}/download`,
        {
          responseType: 'blob',
        },
      )

      const url = URL.createObjectURL(response.data)

      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()

      // Give the browser time to start the download.
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (error) {
      console.error('Failed to download file version:', error)
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 z-40
          transition-opacity
          ${
            isOpen
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }
        `}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full
          w-full max-w-sm
          bg-card
          border-l border-border-default
          z-50 shadow-2xl
          transition-transform duration-300
          ${
            isOpen
              ? 'translate-x-0'
              : 'translate-x-full'
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          <div className="min-w-0">
            <h2 className="text-text-primary font-medium">
              Version History
            </h2>

            <p className="text-text-muted text-xs truncate">
              {fileName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary shrink-0 ml-2"
            aria-label="Close version history"
          >
            <X size={20} />
          </button>
        </div>

        {/* Versions */}
        <div className="p-4 space-y-3 overflow-auto h-[calc(100%-73px)]">
          {isLoading && (
            <p className="text-text-muted text-sm">
              Loading...
            </p>
          )}

          {!isLoading &&
            (!versions || versions.length === 0) && (
              <p className="text-text-muted text-sm">
                No previous versions.
              </p>
            )}

          {versions?.map((version) => {
            const isDownloading =
              downloadingId === version.id

            return (
              <div
                key={version.id}
                className="
                  flex items-center justify-between
                  bg-surface rounded-md
                  px-3 py-3
                  border border-border-subtle
                "
              >
                <div className="min-w-0">
                  <p className="text-text-primary text-sm font-medium">
                    Version {version.versionNum}
                  </p>

                  <p className="text-text-muted text-xs mt-0.5">
                    {new Date(
                      version.createdAt,
                    ).toLocaleString()}
                  </p>

                  <p className="text-text-muted text-xs truncate">
                    {version.uploaderName ??
                      version.uploadedBy}{' '}
                    ·{' '}
                    {formatFileSize(version.sizeBytes)}
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleDownload(version.id)
                  }
                  disabled={downloadingId !== null}
                  className="
                    text-accent-light
                    hover:text-accent
                    disabled:opacity-50
                    shrink-0 ml-3
                  "
                  aria-label={`Download version ${version.versionNum}`}
                >
                  {isDownloading ? (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Download size={18} />
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}