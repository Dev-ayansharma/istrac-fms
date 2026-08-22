import { Bell } from 'lucide-react'
import { useCms } from '../context/cmsContext'
import { type AnnouncementContent } from '../types/cms'

const bgColorMap: Record<string, string> = {
  orange: 'border-warning/20 bg-warning/[0.08] text-warning',
  red: 'border-critical/20 bg-critical/[0.08] text-critical',
  navy: 'border-border-subtle bg-surface text-text-secondary',
}

export function AnnouncementBar() {
  const { cmsBlocks } = useCms()
  const announcement = cmsBlocks['announcements'] as unknown as AnnouncementContent | undefined
  if (!announcement?.visible || !announcement.text) return null

  const toneClass = bgColorMap[announcement.backgroundColor ?? 'navy'] ?? bgColorMap.navy

  return (
    <div role="status" className={`border-b px-4 py-2.5 font-sans text-xs ${toneClass}`}>
      <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-2 text-center"><Bell size={13} className="shrink-0" />{announcement.text}</div>
    </div>
  )
}