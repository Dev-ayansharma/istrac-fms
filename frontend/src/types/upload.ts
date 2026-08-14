export type UploadStatus = 'queued' | 'hashing' | 'uploading' | 'complete' | 'error'

export interface UploadItem {
  id: string
  file: File
  status: UploadStatus
  progress: number // 0-100
  error?: string
}

export const CHUNK_THRESHOLD = 10 * 1024 * 1024 // 10MB — architecture doc Ch.6.1.2
export const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB per chunk, default