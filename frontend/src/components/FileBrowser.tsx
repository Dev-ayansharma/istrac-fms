import { useState } from 'react'
import { LayoutGrid, List, ArrowUp, ArrowDown } from 'lucide-react'

import {
  useDeptFiles,
  useBulkDeleteFiles,
  useBulkTagFiles,
} from '../hooks/useDeptFiles'

import { useUIStore } from '../store/uiStore'
import { useToastStore } from '../store/toastStore'
import { formatFileSize } from '../lib/formatFileSize'

import { FileIcon } from '../components/FileIcon'
import { BulkActionBar } from '../components/BulkActionBar'
import { TagModal } from '../components/TagModal'
import { Button, Card } from '../components'

import type { SortField, SortDirection } from '../types/file'

import { UploadModal } from './UploadModal'
import { VersionHistoryPanel } from './VersionHistoryPanel'

interface FileBrowserProps {
  deptId: string
  parentId?: string | null
}

export function FileBrowser({
  deptId,
  parentId = null,
}: FileBrowserProps) {
  const { fileViewMode, setFileViewMode } = useUIStore()
  const addToast = useToastStore((state) => state.addToast)

  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] =
    useState<SortDirection>('asc')

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [tagModalOpen, setTagModalOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  const [versionPanelFile, setVersionPanelFile] = useState<{
    id: string
    name: string
  } | null>(null)

  const {
    data: files,
    isLoading,
  } = useDeptFiles({
    deptId,
    parentId,
    sortField,
    sortDirection,
  })

  const bulkDelete = useBulkDeleteFiles()
  const bulkTag = useBulkTagFiles()

  function toggleSort(field: SortField) {
    if (field === sortField) {
      setSortDirection((direction) =>
        direction === 'asc' ? 'desc' : 'asc',
      )
      return
    }

    setSortField(field)
    setSortDirection('asc')
  }

  function toggleSelect(id: string) {
    setSelectedIds((previous) => {
      const next = new Set(previous)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }

  function handleBulkDelete() {
    const ids = Array.from(selectedIds)

    bulkDelete.mutate(ids, {
      onSuccess: () => {
        addToast(`${ids.length} file(s) deleted`, 'success')
        setSelectedIds(new Set())
      },
      onError: () => {
        addToast('Bulk delete failed', 'error')
      },
    })
  }

  function handleBulkTag(tags: string[]) {
    const ids = Array.from(selectedIds)

    bulkTag.mutate(
      {
        fileIds: ids,
        tags,
      },
      {
        onSuccess: () => {
          addToast('Tags applied', 'success')
          setSelectedIds(new Set())
          setTagModalOpen(false)
        },
        onError: () => {
          addToast('Bulk tag failed', 'error')
        },
      },
    )
  }

  function openVersionHistory(
    id: string,
    name: string,
    nodeType: string,
  ) {
    if (nodeType !== 'FILE') return

    setVersionPanelFile({
      id,
      name,
    })
  }

  if (isLoading) {
    return (
      <p className="text-text-muted">
        Loading...
      </p>
    )
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3">
        {/* Sorting */}
        <div className="flex gap-3 text-sm">
          {(['name', 'sizeBytes', 'createdAt'] as SortField[]).map(
            (field) => (
              <button
                key={field}
                onClick={() => toggleSort(field)}
                className={`flex items-center gap-1 ${
                  sortField === field
                    ? 'text-accent-light'
                    : 'text-text-secondary'
                }`}
              >
                {field === 'name'
                  ? 'Name'
                  : field === 'sizeBytes'
                    ? 'Size'
                    : 'Date'}

                {sortField === field &&
                  (sortDirection === 'asc' ? (
                    <ArrowUp size={12} />
                  ) : (
                    <ArrowDown size={12} />
                  ))}
              </button>
            ),
          )}
        </div>

        {/* View mode + Upload */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-surface rounded-md p-1 border border-border-subtle">
            <button
              onClick={() => setFileViewMode('grid')}
              className={`p-1.5 rounded ${
                fileViewMode === 'grid'
                  ? 'bg-card text-accent-light'
                  : 'text-text-muted'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid size={16} />
            </button>

            <button
              onClick={() => setFileViewMode('list')}
              className={`p-1.5 rounded ${
                fileViewMode === 'list'
                  ? 'bg-card text-accent-light'
                  : 'text-text-muted'
              }`}
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setUploadModalOpen(true)}
          >
            Upload
          </Button>
        </div>
      </div>

      {/* Bulk actions */}
      <BulkActionBar
        selectedCount={selectedIds.size}
        onDelete={handleBulkDelete}
        onTag={() => setTagModalOpen(true)}
        onClear={() => setSelectedIds(new Set())}
      />

      {/* Empty state */}
      {(!files || files.length === 0) && (
        <Card>
          <p className="text-text-muted text-sm">
            This folder is empty.
          </p>
        </Card>
      )}

      {/* Grid view */}
      {fileViewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {files?.map((file) => (
            <Card
              key={file.id}
              variant="interactive"
              className={`relative ${
                selectedIds.has(file.id)
                  ? 'border-accent'
                  : ''
              }`}
            >
              <input
                type="checkbox"
                checked={selectedIds.has(file.id)}
                onChange={() => toggleSelect(file.id)}
                onClick={(event) => event.stopPropagation()}
                className="absolute top-2 right-2"
                aria-label={`Select ${file.name}`}
              />

              <button
                type="button"
                onClick={() =>
                  openVersionHistory(
                    file.id,
                    file.name,
                    file.nodeType,
                  )
                }
                className="w-full flex flex-col items-center gap-2 py-2"
              >
                <FileIcon
                  nodeType={file.nodeType}
                  mimeType={file.mimeType}
                />

                <span className="text-xs text-text-primary text-center truncate w-full">
                  {file.name}
                </span>

                <span className="text-xs text-text-muted">
                  {formatFileSize(file.sizeBytes)}
                </span>
              </button>
            </Card>
          ))}
        </div>
      ) : (
        /* List view */
        <div className="space-y-1">
          {files?.map((file) => (
            <div
              key={file.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-md border ${
                selectedIds.has(file.id)
                  ? 'border-accent bg-card'
                  : 'border-transparent hover:bg-card'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedIds.has(file.id)}
                onChange={() => toggleSelect(file.id)}
                aria-label={`Select ${file.name}`}
              />

              <FileIcon
                nodeType={file.nodeType}
                mimeType={file.mimeType}
              />

              <span className="flex-1 text-sm text-text-primary truncate">
                {file.name}
              </span>

              <span className="text-xs text-text-muted w-20 text-right">
                {formatFileSize(file.sizeBytes)}
              </span>

              <span className="text-xs text-text-muted w-24 text-right">
                {new Date(file.createdAt).toLocaleDateString()}
              </span>

              {file.nodeType === 'FILE' && (
                <button
                  type="button"
                  onClick={() =>
                    setVersionPanelFile({
                      id: file.id,
                      name: file.name,
                    })
                  }
                  className="text-xs text-accent-light hover:underline"
                >
                  Versions
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tag modal */}
      <TagModal
        isOpen={tagModalOpen}
        onClose={() => setTagModalOpen(false)}
        onConfirm={handleBulkTag}
        isSubmitting={bulkTag.isPending}
      />

      {/* Upload modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        departmentId={deptId}
        parentId={parentId}
      />

      {/* Version history */}
      <VersionHistoryPanel
        fileId={versionPanelFile?.id ?? null}
        fileName={versionPanelFile?.name ?? ''}
        onClose={() => setVersionPanelFile(null)}
      />
    </div>
  )
}