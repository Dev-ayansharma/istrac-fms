import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Download,
} from 'lucide-react'
import { useAuditLog } from '../hooks/useAuditLog'
import { api } from '../lib/axios'
import { exportToCsv } from '../lib/exportCsv'
import { Button, Card, Input } from '../components'
import { FilterChip } from '../components/FilterChip'
import { AuditDiffView } from '../components/AuditDiffView'

const ACTION_OPTIONS = [
  'FILE_UPLOAD',
  'FILE_DOWNLOAD',
  'FILE_DELETED',
  'USER_APPROVED',
  'USER_REJECTED',
  'USER_SUSPENDED',
]

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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useAuditLog(filters)

  const entries = data?.pages.flatMap((p) => p.data) ?? []

  async function handleExport() {
    setIsExporting(true)

    try {
      const { data: exportRows } = await api.get('/admin/audit-logs', {
        params: {
          ...filters,
          export: 'csv',
          pageSize: 10000,
        },
      })

      exportToCsv(
        `audit-log-${new Date().toISOString().slice(0, 10)}.csv`,
        exportRows.data,
      )
    } finally {
      setIsExporting(false)
    }
  }

  const activeFilterChips = [
    action && {
      label: `Action: ${action}`,
      clear: () => setAction(''),
    },
    dateFrom && {
      label: `From: ${dateFrom}`,
      clear: () => setDateFrom(''),
    },
    dateTo && {
      label: `To: ${dateTo}`,
      clear: () => setDateTo(''),
    },
  ].filter(Boolean) as {
    label: string
    clear: () => void
  }[]

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            Audit Log
          </h1>

          <p className="mt-1 text-xs text-text-muted">
            Review system activity and changes across the platform.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={isExporting}
          className="w-full justify-center sm:w-auto"
        >
          <span className="flex items-center justify-center gap-1.5">
            <Download size={14} />

            {isExporting ? 'Exporting...' : 'Export CSV'}
          </span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="mb-3">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Filters
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Action */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="audit-action"
              className="text-xs font-medium text-text-secondary"
            >
              Action
            </label>

            <select
              id="audit-action"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="input"
            >
              <option value="">All actions</option>

              {ACTION_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <Input
            id="audit-date-from"
            label="From"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />

          {/* Date To */}
          <Input
            id="audit-date-to"
            label="To"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        {/* Active filters */}
        {activeFilterChips.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border-subtle pt-3">
            <span className="text-xs text-text-muted">
              Active filters:
            </span>

            {activeFilterChips.map((chip) => (
              <FilterChip
                key={chip.label}
                label={chip.label}
                onRemove={chip.clear}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Loading */}
      {isLoading && (
        <Card>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-border-default border-t-accent" />
            Loading audit logs...
          </div>
        </Card>
      )}

      {/* Empty state */}
      {!isLoading && entries.length === 0 && (
        <Card>
          <div className="py-6 text-center">
            <p className="text-sm font-medium text-text-secondary">
              No audit records found
            </p>

            <p className="mt-1 text-xs text-text-muted">
              Try changing or removing your filters.
            </p>
          </div>
        </Card>
      )}

      {/* Audit entries */}
      {!isLoading && entries.length > 0 && (
        <div className="space-y-2">
          {entries.map((entry) => {
            const expanded = expandedId === entry.id

            return (
              <Card
                key={entry.id}
                className="overflow-hidden !p-0"
              >
                {/* Audit row */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(
                      expanded ? null : entry.id,
                    )
                  }
                  className="
                    flex w-full items-center gap-3
                    px-3 py-3 text-left
                    transition-colors
                    hover:bg-card-hover
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-accent/30
                  "
                >
                  {/* Expand icon */}
                  <span className="shrink-0 text-text-muted">
                    {expanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>

                  {/* Action */}
                  <span className="w-full shrink-0 font-mono text-[11px] font-medium text-accent-light sm:w-40">
                    {entry.action}
                  </span>

                  {/* User */}
                  <span className="min-w-0 flex-1 truncate text-xs text-text-secondary sm:text-sm">
                    {entry.userName ??
                      entry.userId ??
                      'System'}
                  </span>

                  {/* Date */}
                  <span className="hidden shrink-0 font-mono text-[10px] text-text-muted sm:block">
                    {new Date(
                      entry.createdAt,
                    ).toLocaleString()}
                  </span>
                </button>

                {/* Mobile date */}
                <div className="px-10 pb-2 sm:hidden">
                  <span className="font-mono text-[10px] text-text-muted">
                    {new Date(
                      entry.createdAt,
                    ).toLocaleString()}
                  </span>
                </div>

                {/* Expanded diff */}
                {expanded && (
                  <div className="border-t border-border-subtle bg-surface/70 px-3 py-3">
                    <AuditDiffView
                      oldValue={entry.oldValue}
                      newValue={entry.newValue}
                    />
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Load more */}
      {hasNextPage && (
        <div className="flex justify-center pt-1">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage
              ? 'Loading...'
              : 'Load more'}
          </Button>
        </div>
      )}
    </div>
  )
}