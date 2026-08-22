import { useState } from 'react'
import { LayoutGrid, List, ArrowUp, ArrowDown } from 'lucide-react'
import { useDeptFiles, useBulkDeleteFiles, useBulkTagFiles } from '../hooks/useDeptFiles'
import { useUIStore } from '../store/uiStore'
import { useToastStore } from '../store/toastStore'
import { formatFileSize } from '../lib/formatFileSize'

import { FileIcon } from './FileIcon'
import { BulkActionBar } from './BulkActionBar'
import { TagModal } from './TagModal'
import { UploadModal } from './UploadModal'
import { VersionHistoryPanel } from './VersionHistoryPanel'
import { FilePreviewModal } from './FilePreviewModal'
import { Card, Button } from '.'
import type { FileNode, SortField, SortDirection } from '../types/file'

interface FileBrowserProps {
  deptId: string
  parentId?: string | null
}

export function FileBrowser({ deptId, parentId = null }: FileBrowserProps) {
  const { fileViewMode, setFileViewMode } = useUIStore()
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [tagModalOpen, setTagModalOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [versionPanelFile, setVersionPanelFile] = useState<{ id: string; name: string } | null>(null)
  const [previewFile, setPreviewFile] = useState<FileNode | null>(null)

  const { data: filesData, isLoading } = useDeptFiles({ deptId, parentId, sortField, sortDirection })


  const bulkDelete = useBulkDeleteFiles()
  const bulkTag = useBulkTagFiles()
  const addToast = useToastStore((s) => s.addToast)

  function toggleSort(field: SortField) {
    if (field === sortField) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleBulkDelete() {
    bulkDelete.mutate(Array.from(selectedIds), {
      onSuccess: () => {
        addToast({ message: `${selectedIds.size} file(s) deleted`, variant: 'success' })
        setSelectedIds(new Set())
      },
      onError: () => addToast({ message: 'Bulk delete failed', variant: 'error' }),
    })
  }

  function handleBulkTag(tags: string[]) {
    bulkTag.mutate(
      { fileIds: Array.from(selectedIds), tags },
      {
        onSuccess: () => {
          addToast({ message: 'Tags applied', variant: 'success' })
          setSelectedIds(new Set())
          setTagModalOpen(false)
        },
        onError: () => addToast({ message: 'Bulk tag failed', variant: 'error' }),
      }
    )
  }

  function handleFileNameClick(e: React.MouseEvent, file: FileNode) {
    e.stopPropagation()
    if (file.nodeType === 'FILE') setPreviewFile(file)
  }

  function handleVersionClick(e: React.MouseEvent, file: FileNode) {
    e.stopPropagation()
    setVersionPanelFile({ id: file.id, name: file.name })
  }

  if (isLoading) return <p className="text-text-muted">Loading...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-3 text-sm">
          {(['name', 'sizeBytes', 'createdAt'] as SortField[]).map((field) => (
            <button
              key={field}
              onClick={() => toggleSort(field)}
              className={`flex items-center gap-1 ${sortField === field ? 'text-accent-light' : 'text-text-secondary'}`}
            >
              {field === 'name' ? 'Name' : field === 'sizeBytes' ? 'Size' : 'Date'}
              {sortField === field && (sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" onClick={() => setUploadModalOpen(true)}>
            Upload
          </Button>
          <div className="flex gap-1 bg-surface rounded-md p-1 border border-border-subtle">
            <button
              onClick={() => setFileViewMode('grid')}
              className={`p-1.5 rounded ${fileViewMode === 'grid' ? 'bg-card text-accent-light' : 'text-text-muted'}`}
              aria-label="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setFileViewMode('list')}
              className={`p-1.5 rounded ${fileViewMode === 'list' ? 'bg-card text-accent-light' : 'text-text-muted'}`}
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <BulkActionBar
        selectedCount={selectedIds.size}
        onDelete={handleBulkDelete}
        onTag={() => setTagModalOpen(true)}
        onClear={() => setSelectedIds(new Set())}
      />

      {filesData?.length === 0 && (
        <Card><p className="text-text-muted text-sm">This folder is empty.</p></Card>
      )}

      {fileViewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {filesData?.map((file) => (
            <Card
              key={file.id}
              variant="interactive"
              className={`relative ${selectedIds.has(file.id) ? 'border-accent' : ''}`}
            >
              <input
                type="checkbox"
                checked={selectedIds.has(file.id)}
                onChange={() => toggleSelect(file.id)}
                onClick={(e) => e.stopPropagation()}
                className="absolute top-2 right-2"
              />
              <div className="flex flex-col items-center gap-2 py-2">
                <FileIcon nodeType={file.nodeType} mimeType={file.mimeType} />
                <span
                  className="text-xs text-text-primary text-center truncate w-full cursor-pointer hover:text-accent-light"
                  onClick={(e) => handleFileNameClick(e, file)}
                >
                  {file.name}
                </span>
                <span className="text-xs text-text-muted">{formatFileSize(file.sizeBytes)}</span>
              </div>
              {file.nodeType === 'FILE' && (
                <button
                  onClick={(e) => handleVersionClick(e, file)}
                  className="absolute bottom-1 right-1 text-text-muted hover:text-accent-light text-xs px-1"
                  aria-label="Version history"
                >
                  v{file.versionCount ?? 1}
                </button>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {filesData?.map((file) => (
            <div
              key={file.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-md border ${
                selectedIds.has(file.id) ? 'border-accent bg-card' : 'border-transparent hover:bg-card'
              }`}
            >
              <input type="checkbox" checked={selectedIds.has(file.id)} onChange={() => toggleSelect(file.id)} />
              <FileIcon nodeType={file.nodeType} mimeType={file.mimeType} />
              <span
                className="flex-1 text-sm text-text-primary truncate cursor-pointer hover:text-accent-light"
                onClick={(e) => handleFileNameClick(e, file)}
              >
                {file.name}
              </span>
              <span className="text-xs text-text-muted w-20 text-right">{formatFileSize(file.sizeBytes)}</span>
              <span className="text-xs text-text-muted w-24 text-right">
                {new Date(file.createdAt).toLocaleDateString()}
              </span>
              {file.nodeType === 'FILE' && (
                <button
                  onClick={(e) => handleVersionClick(e, file)}
                  className="text-text-muted hover:text-accent-light text-xs w-8 text-right"
                  aria-label="Version history"
                >
                  v{file.versionCount ?? 1}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <TagModal
        isOpen={tagModalOpen}
        onClose={() => setTagModalOpen(false)}
        onConfirm={handleBulkTag}
        isSubmitting={bulkTag.isPending}
      />

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        departmentId={deptId}
        parentId={parentId}
      />

      <VersionHistoryPanel
        fileId={versionPanelFile?.id ?? null}
        fileName={versionPanelFile?.name ?? ''}
        onClose={() => setVersionPanelFile(null)}
      />

      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  )
}