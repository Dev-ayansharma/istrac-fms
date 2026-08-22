import {
  File,
  FileText,
  Folder,
  Image,
  Video,
} from 'lucide-react'

interface FileIconProps {
  nodeType: 'FOLDER' | 'FILE'
  mimeType: string | null
  /** Grid views want a larger glyph than list rows. */
  size?: number
}

/**
 * Folders are accented because they can be entered; files are quiet because
 * the name beside them is what matters. Type is a shape difference only.
 */
const iconClassName = 'shrink-0 text-text-muted'

export function FileIcon({
  nodeType,
  mimeType,
  size = 16,
}: FileIconProps) {
  if (nodeType === 'FOLDER') {
    return (
      <Folder
        size={size}
        strokeWidth={1.7}
        aria-hidden="true"
        className="shrink-0 text-accent-light"
      />
    )
  }

  if (mimeType?.startsWith('image/')) {
    return <Image size={size} strokeWidth={1.7} aria-hidden="true" className={iconClassName} />
  }

  if (mimeType?.startsWith('video/')) {
    return <Video size={size} strokeWidth={1.7} aria-hidden="true" className={iconClassName} />
  }

  if (mimeType === 'application/pdf') {
    return <FileText size={size} strokeWidth={1.7} aria-hidden="true" className={iconClassName} />
  }

  return <File size={size} strokeWidth={1.7} aria-hidden="true" className={iconClassName} />
}
