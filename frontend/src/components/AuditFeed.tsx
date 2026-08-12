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
    <Card>
      <h3 className="text-sm font-medium text-text-primary mb-3">Recent Activity</h3>
      {isLoading && <p className="text-text-muted text-sm">Loading...</p>}
      {!isLoading && (!entries || entries.length === 0) && (
        <p className="text-text-muted text-sm">No recent activity.</p>
      )}
      <ul className="space-y-3">
        {entries?.map((entry) => (
          <li key={entry.id} className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">
              {actionLabels[entry.action] ?? entry.action}
            </span>
            <span className="text-text-muted text-xs">{timeAgo(entry.createdAt)}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}