export type PreviewKind = 'pdf' | 'image' | 'video' | 'text' | 'office' | 'unsupported'

const OFFICE_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.ms-excel',
]

const TEXT_MIME_TYPES = ['text/plain', 'text/csv', 'application/json', 'text/markdown']

export function resolvePreviewKind(mimeType: string | null): PreviewKind {
  if (!mimeType) return 'unsupported'
  if (mimeType === 'application/pdf') return 'pdf'
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (TEXT_MIME_TYPES.includes(mimeType)) return 'text'
  if (OFFICE_MIME_TYPES.includes(mimeType)) return 'office'
  return 'unsupported'
}