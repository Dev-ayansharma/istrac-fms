import { useCms } from '../context/cmsContext'
import {type AnnouncementContent } from '../types/cms'

const bgColorMap: Record<string, string> = {
  orange: 'bg-orange-500',
  red: 'bg-red-600',
  navy: 'bg-navy-900',
}

export function AnnouncementBar() {
  const { cmsBlocks } = useCms()
  const announcement = cmsBlocks['announcements'] as unknown as AnnouncementContent | undefined

  // Toggleable — if admin has hidden it, or there's no content yet, render nothing at all
  if (!announcement?.visible || !announcement.text) {
    return null
  }

  const bgClass = bgColorMap[announcement.backgroundColor ?? 'navy'] ?? 'bg-navy-900'

  return (
    <div className={`${bgClass} text-white text-sm text-center py-2 px-4 font-sans`}>
      {announcement.text}
    </div>
  )
}