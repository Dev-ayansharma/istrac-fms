import { Bell } from 'lucide-react'
import { useCms } from '../context/cmsContext'
import { type AnnouncementContent } from '../types/cms'

const bgColorMap: Record<string, string> = {
  orange: 'border-warning/20 bg-warning/[0.07] text-warning',
  red: 'border-critical/20 bg-critical/[0.07] text-critical',
  navy: 'border-border-subtle bg-surface text-text-secondary',
}

export function AnnouncementBar() {
  const { cmsBlocks } = useCms()
  const announcement = cmsBlocks['announcements'] as unknown as AnnouncementContent | undefined
  if (!announcement?.visible || !announcement.text) return null

  const toneClass = bgColorMap[announcement.backgroundColor ?? 'navy'] ?? bgColorMap.navy

  return (
    /* An annunciator strip: a tinted band with a tone-coloured edge, tagged so
       it reads as a station notice rather than marketing copy. */
    <div role="status" className={`relative border-b font-sans ${toneClass}`}>
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.5 bg-current opacity-70" />

      <div className="shell flex items-center gap-3 py-2.5">
        <Bell size={12} strokeWidth={2} className="shrink-0" aria-hidden="true" />

        <span className="eyebrow shrink-0 opacity-80">Notice</span>

        <span aria-hidden="true" className="hidden h-2.5 w-px bg-current opacity-25 sm:block" />

        <p className="min-w-0 text-xs leading-5">{announcement.text}</p>
      </div>
    </div>
  )
}
