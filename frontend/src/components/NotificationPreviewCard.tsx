import { Bell } from 'lucide-react'
import { Card } from '.'

interface NotificationPreviewCardProps {
  message: string
  target: 'all' | 'departments'
  departmentNames: string[]
}

export function NotificationPreviewCard({
  message,
  target,
  departmentNames,
}: NotificationPreviewCardProps) {
  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Notification Preview
          </p>

          <p className="mt-0.5 text-[10px] text-text-muted">
            Live preview
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-nominal-bg px-2 py-1 text-[10px] font-medium text-nominal">
          <span className="h-1.5 w-1.5 rounded-full bg-nominal" />
          Preview
        </span>
      </div>

      {/* Notification */}
      <div className="rounded-lg border border-border-subtle bg-surface p-3 transition-colors hover:border-border-default">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent-light">
            <Bell size={16} />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <p className="break-words text-sm leading-relaxed text-text-primary">
              {message || 'Your message will appear here...'}
            </p>

            {/* Target */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wide text-text-muted">
                Recipient:
              </span>

              <span className="text-xs text-text-secondary">
                {target === 'all'
                  ? 'All users'
                  : departmentNames.length > 0
                    ? departmentNames.join(', ')
                    : 'No departments selected'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}