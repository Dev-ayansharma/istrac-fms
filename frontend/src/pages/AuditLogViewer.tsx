import { useState } from 'react'
import { ChevronDown, ChevronRight, Download } from 'lucide-react'
import { useAuditLog } from '../hooks/useAuditLog'
import { api } from '../lib/axios'
import { exportToCsv } from '../lib/exportCsv'
import { Button, Card } from '../components'
import { FilterChip } from '../components/FilterChip'
import { AuditDiffView } from '../components/AuditDiffView'

const ACTION_OPTIONS = ['FILE_UPLOAD', 'FILE_DOWNLOAD', 'FILE_DELETED', 'USER_APPROVED', 'USER_REJECTED', 'USER_SUSPENDED']

export function AuditLogViewer() {
  const [action, setAction] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const filters = {
    action: action || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useAuditLog(filters)
  const entries = data?.pages.flatMap((p) => p.data) ?? []

  async function handleExport() {
    setIsExporting(true)
    try {
      // Exports the CURRENT filter, not just what's loaded on screen — a dedicated,
      // unpaginated request against the same filter params, per the acceptance criteria
      const { data: exportRows } = await api.get('/admin/audit-logs', {
        params: { ...filters, export: 'csv', pageSize: 10000 },
      })
      exportToCsv(`audit-log-${new Date().toISOString().slice(0, 10)}.csv`, exportRows.data)
    } finally {
      setIsExporting(false)
    }
  }

  const activeFilterChips = [
    action && { label: `Action: ${action}`, clear: () => setAction('') },
    dateFrom && { label: `From: ${dateFrom}`, clear: () => setDateFrom('') },
    dateTo && { label: `To: ${dateTo}`, clear: () => setDateTo('') },
  ].filter(Boolean) as { label: string; clear: () => void }[]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Audit Log</h1>
        <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
          <span className="flex items-center gap-1.5">
            <Download size={14} />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="px-3 py-2 rounded-md bg-surface border border-border-default text-text-primary text-sm"
        >
          <option value="">All actions</option>
          {ACTION_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="px-3 py-2 rounded-md bg-surface border border-border-default text-text-primary text-sm"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="px-3 py-2 rounded-md bg-surface border border-border-default text-text-primary text-sm"
        />
      </div>

      {activeFilterChips.length > 0 && (
        <div className="flex gap-2">
          {activeFilterChips.map((chip) => (
            <FilterChip key={chip.label} label={chip.label} onRemove={chip.clear} />
          ))}
        </div>
      )}

      {isLoading && <p className="text-text-muted">Loading...</p>}

      <div className="space-y-1">
        {entries.map((entry) => (
          <Card key={entry.id} className="!p-0 overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-card-hover"
            >
              {expandedId === entry.id ? (
                <ChevronDown size={16} className="text-text-muted shrink-0" />
              ) : (
                <ChevronRight size={16} className="text-text-muted shrink-0" />
              )}
              <span className="text-xs font-mono text-accent-light w-40 shrink-0">{entry.action}</span>
              <span className="text-sm text-text-secondary flex-1 truncate">
                {entry.userName ?? entry.userId ?? 'System'}
              </span>
              <span className="text-xs text-text-muted shrink-0">
                {new Date(entry.createdAt).toLocaleString()}
              </span>
            </button>
            {expandedId === entry.id && (
              <div className="px-3 pb-3 pt-1 border-t border-border-subtle bg-surface">
                <AuditDiffView oldValue={entry.oldValue} newValue={entry.newValue} />
              </div>
            )}
          </Card>
        ))}
      </div>

      {hasNextPage && (
        <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading...' : 'Load more'}
        </Button>
      )}
    </div>
  )
}