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

/**
 * Slide-over log of a file's revisions. Reads as a strip chart: revision number
 * on a fixed left rail, human detail in the middle, one action on the right.
 */
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
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-page/85 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-label="Version history"
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-border-default bg-card transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-border-subtle bg-surface px-4 py-3">
          <div className="min-w-0">
            <h2 className="eyebrow text-text-secondary">
              Version history
            </h2>

            <p className="num mt-1.5 truncate text-[13px] text-text-primary">
              {fileName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="-mr-1 shrink-0 rounded-md p-1 text-text-muted transition-colors duration-150 hover:bg-card-hover hover:text-text-primary"
            aria-label="Close version history"
          >
            <X size={15} strokeWidth={1.8} />
          </button>
        </header>

        {/* Versions */}
        <div className="min-h-0 flex-1 overflow-auto">
          {isLoading && (
            <p className="num px-4 py-4 text-xs text-text-dim">
              Loading…
            </p>
          )}

          {!isLoading &&
            (!versions || versions.length === 0) && (
              <div className="px-4 py-14 text-center">
                <p className="num text-sm text-text-dim">—</p>

                <p className="mt-2 text-[13px] text-text-muted">
                  No previous versions.
                </p>
              </div>
            )}

          <div className="divide-y divide-border-subtle">
            {versions?.map((version) => {
              const isDownloading =
                downloadingId === version.id

              return (
                <div
                  key={version.id}
                  className="flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-card-hover"
                >
                  {/* Revision rail */}
                  <span className="num w-9 shrink-0 border-r border-border-subtle pr-3 text-[13px] text-accent-light">
                    v{version.versionNum}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="num text-[11px] text-text-secondary">
                      {new Date(
                        version.createdAt,
                      ).toLocaleString()}
                    </p>

                    <p className="mt-1 truncate text-[11px] text-text-dim">
                      {version.uploaderName ??
                        version.uploadedBy}
                      <span className="num">
                        {' · '}
                        {formatFileSize(version.sizeBytes)}
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleDownload(version.id)
                    }
                    disabled={downloadingId !== null}
                    className="shrink-0 rounded-md p-1.5 text-text-muted transition-colors duration-150 hover:bg-card-hover hover:text-accent-light disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Download version ${version.versionNum}`}
                  >
                    {isDownloading ? (
                      <Loader2
                        size={15}
                        strokeWidth={1.8}
                        className="animate-spin"
                      />
                    ) : (
                      <Download size={15} strokeWidth={1.8} />
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
