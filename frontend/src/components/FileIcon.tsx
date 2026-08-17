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
}

const iconClassName = 'shrink-0 text-text-secondary'

export function FileIcon({
  nodeType,
  mimeType,
}: FileIconProps) {
  if (nodeType === 'FOLDER') {
    return (
      <Folder
        size={20}
        className="shrink-0 text-accent-light"
      />
    )
  }

  if (mimeType?.startsWith('image/')) {
    return <Image size={20} className={iconClassName} />
  }

  if (mimeType?.startsWith('video/')) {
    return <Video size={20} className={iconClassName} />
  }

  if (mimeType === 'application/pdf') {
    return <FileText size={20} className={iconClassName} />
  }

  return <File size={20} className={iconClassName} />
}