import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'
import { computeSHA256, splitIntoChunks } from '../lib/fileUpload'
import { type UploadItem, CHUNK_THRESHOLD, CHUNK_SIZE } from '../types/upload'

interface UseFileUploadParams {
  departmentId: string
  parentId: string | null
}

export function useFileUpload({ departmentId, parentId }: UseFileUploadParams) {
  const [items, setItems] = useState<UploadItem[]>([])
  const queryClient = useQueryClient()

  function updateItem(id: string, patch: Partial<UploadItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }

  async function uploadSingleShot(item: UploadItem) {
    const formData = new FormData()
    formData.append('file', item.file)
    formData.append('departmentId', departmentId)
    if (parentId) formData.append('parentId', parentId)

    await api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        const pct = e.total ? Math.round((e.loaded / e.total) * 100) : 0
        updateItem(item.id, { progress: pct })
      },
    })
  }

  async function uploadChunked(item: UploadItem) {
    updateItem(item.id, { status: 'hashing' })
    const checksum = await computeSHA256(item.file)

    const chunks = splitIntoChunks(item.file, CHUNK_SIZE)
    updateItem(item.id, { status: 'uploading' })

    // Sequential, not parallel — matches Ch.6.1.2's "sequential" chunk upload spec,
    // and lets progress accurately reflect actual bytes sent rather than N racing requests
    for (let i = 0; i < chunks.length; i++) {
      const formData = new FormData()
      formData.append('chunk', chunks[i])
      formData.append('fileName', item.file.name)
      formData.append('chunkIndex', String(i))
      formData.append('totalChunks', String(chunks.length))
      formData.append('departmentId', departmentId)
      if (parentId) formData.append('parentId', parentId)

      await api.post('/files/upload/chunk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const pct = Math.round(((i + 1) / chunks.length) * 100)
      updateItem(item.id, { progress: pct })
    }

    await api.post('/files/upload/complete', {
      fileName: item.file.name,
      departmentId,
      parentId,
      checksum,
      totalChunks: chunks.length,
    })
  }

  const uploadFile = useCallback(async (item: UploadItem) => {
    try {
      if (item.file.size > CHUNK_THRESHOLD) {
        await uploadChunked(item)
      } else {
        await uploadSingleShot(item)
      }
      updateItem(item.id, { status: 'complete', progress: 100 })
      queryClient.invalidateQueries({ queryKey: ['dept-files'] })
    } catch (err) {
      updateItem(item.id, { status: 'error', error: 'Upload failed' })
    }
  }, [departmentId, parentId, queryClient])

  function addFiles(files: FileList | File[]) {
    const newItems: UploadItem[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: 'queued',
      progress: 0,
    }))
    setItems((prev) => [...prev, ...newItems])
    newItems.forEach((item) => uploadFile(item))
  }

  function reset() {
    setItems([])
  }

  return { items, addFiles, reset }
}