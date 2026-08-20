import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications, useMarkAllRead, useMarkRead } from '../hooks/useNotifications'
import { Button, Card } from '../components'

const TABS = ['All', 'Unread', 'Files', 'System', 'Approvals'] as const

function groupByDate(items: { createdAt: string, readAt: string | null,id : number ,message : string}[]) {
  const groups: Record<string, typeof items> = {}
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()

  items.forEach((item) => {
    const d = new Date(item.createdAt).toDateString()
    const label = d === today ? 'Today' : d === yesterday ? 'Yesterday' : new Date(item.createdAt).toLocaleDateString()
    groups[label] = [...(groups[label] ?? []), item]
  })
  return groups
}

export function NotificationsPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<(typeof TABS)[number]>('All')
  const category = tab === 'All' || tab === 'Unread' ? undefined : tab

  const { data, fetchNextPage, hasNextPage } = useNotifications(category)
  const markAllRead = useMarkAllRead()
  const markRead = useMarkRead()

  let items = data?.pages.flatMap((p) => p.data) ?? []
  if (tab === 'Unread') items = items.filter((i) => !i.readAt)

  const grouped = groupByDate(items)

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Notifications</h1>
        <Button variant="outline" size="sm" onClick={() => markAllRead.mutate()}>Mark all read</Button>
      </div>

      <div className="flex gap-1 border-b border-border-subtle">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 text-sm border-b-2 ${tab === t ? 'border-accent text-accent-light' : 'border-transparent text-text-secondary'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {Object.entries(grouped).map(([date, group]) => (
        <div key={date}>
          <p className="text-xs text-text-muted mb-2">{date}</p>
          <div className="space-y-1">
            {group.map((n) => (
              <Card
                key={n.id}
                variant="interactive"
                className={!n.readAt ? 'border-accent/40' : ''}
                onClick={() => { markRead.mutate(n.id); navigate('/dashboard/files') }}
              >
                <p className="text-text-primary text-sm">{n.message}</p>
                <p className="text-text-muted text-xs mt-1">{new Date(n.createdAt).toLocaleTimeString()}</p>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {hasNextPage && (
        <Button variant="outline" onClick={() => fetchNextPage()}>Load more</Button>
      )}
    </div>
  )
}