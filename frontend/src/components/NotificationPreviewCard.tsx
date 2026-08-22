import { Bell } from 'lucide-react'
import { Panel } from '.'

interface NotificationPreviewCardProps {
  message: string
  target: 'all' | 'departments'
  departmentNames: string[]
}

/**
 * Shows the notice in the same frame the recipient will see it in — an accent
 * edge, the message, then the machine detail underneath.
 */
export function NotificationPreviewCard({
  message,
  target,
  departmentNames,
}: NotificationPreviewCardProps) {
  return (
    <Panel
      title="Preview"
      meta={
        <span className="num text-[10px] text-text-dim">
          as recipients will see it
        </span>
      }
      flush
    >
      <div className="flex items-start gap-3 border-l-2 border-l-accent px-4 py-3.5">
        <Bell
          size={14}
          strokeWidth={1.7}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-accent-light"
        />

        <div className="min-w-0 flex-1">
          <p
            className={`break-words text-[13px] leading-6 ${
              message ? 'text-text-primary' : 'text-text-dim'
            }`}
          >
            {message || 'Your message will appear here…'}
          </p>

          <div className="mt-3 border-t border-border-subtle pt-3">
            <p className="col-label">Recipients</p>

            <p className="mt-1 text-[11px] leading-5 text-text-secondary">
              {target === 'all'
                ? 'All users'
                : departmentNames.length > 0
                  ? departmentNames.join(', ')
                  : 'No departments selected'}
            </p>
          </div>
        </div>
      </div>
    </Panel>
  )
}
