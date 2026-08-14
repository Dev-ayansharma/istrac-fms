import { Folder, File, FileText, Image, Video } from 'lucide-react'

export function FileIcon({ nodeType, mimeType }: { nodeType: 'FOLDER' | 'FILE'; mimeType: string | null }) {
  if (nodeType === 'FOLDER') return <Folder size={20} className="text-accent-light" />
  if (mimeType?.startsWith('image/')) return <Image size={20} className="text-text-secondary" />
  if (mimeType?.startsWith('video/')) return <Video size={20} className="text-text-secondary" />
  if (mimeType === 'application/pdf') return <FileText size={20} className="text-text-secondary" />
  return <File size={20} className="text-text-secondary" />
}