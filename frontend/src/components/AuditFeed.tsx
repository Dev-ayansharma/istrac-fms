import { Activity } from 'lucide-react'
import { useRecentAuditLog } from '../hooks/useRecentAuditLog'
import { Card } from '.'

const actionLabels: Record<string, string> = {
  FILE_UPLOAD: 'uploaded a file',
  FILE_DOWNLOAD: 'downloaded a file',
  USER_APPROVED: 'approved a user',
  USER_REJECTED: 'rejected a user',
}

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diffMs / 60000)

  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`

  const hrs = Math.floor(mins / 60)

  if (hrs < 24) return `${hrs}h ago`

  return `${Math.floor(hrs / 24)}d ago`
}

export function AuditFeed() {
  const { data: entries, isLoading } = useRecentAuditLog()

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-accent/10 bg-accent/10 text-accent-light">
            <Activity size={15} strokeWidth={1.8} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              Recent Activity
            </h3>
            <p className="text-[10px] text-text-muted">
              Latest system events
            </p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="w-32 h-3 rounded bg-card-hover animate-pulse" />
              <div className="w-12 h-3 rounded bg-card-hover animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && (!entries || entries.length === 0) && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex items-center justify-center w-9 h-9 mb-2 rounded-full bg-card-hover text-text-muted">
            <Activity size={16} />
          </div>

          <p className="text-xs text-text-muted">
            No recent activity.
          </p>
        </div>
      )}

      {!isLoading && entries && entries.length > 0 && (
        <ul className="divide-y divide-border-subtle/50">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center min-w-0 gap-2.5">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent" />

                <span className="text-xs truncate text-text-secondary">
                  {actionLabels[entry.action] ?? entry.action}
                </span>
              </div>

              <span className="flex-shrink-0 text-[10px] text-text-muted">
                {timeAgo(entry.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}