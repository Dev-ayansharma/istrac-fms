import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Download,
} from 'lucide-react'
import { useAuditLog } from '../hooks/useAuditLog'
import { api } from '../lib/axios'
import { exportToCsv } from '../lib/exportCsv'
import { Button, Input, Select, PageHeader, Panel } from '../components'
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
      label: `action:${action}`,
      clear: () => setAction(''),
    },
    dateFrom && {
      label: `from:${dateFrom}`,
      clear: () => setDateFrom(''),
    },
    dateTo && {
      label: `to:${dateTo}`,
      clear: () => setDateTo(''),
    },
  ].filter(Boolean) as {
    label: string
    clear: () => void
  }[]

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Administration"
        title="Audit log"
        description="Every recorded action, in the order it happened."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download size={13} strokeWidth={2} />
            {isExporting ? 'Exporting…' : 'Export CSV'}
          </Button>
        }
      />

      {/* Filters */}
      <Panel title="Filters">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Select
            id="audit-action"
            label="Action"
            value={action}
            onChange={(e) => setAction(e.target.value)}
          >
            <option value="">All actions</option>

            {ACTION_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>

          <Input
            id="audit-date-from"
            label="From"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />

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
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border-subtle pt-3.5">
            <span className="col-label">Active</span>

            {activeFilterChips.map((chip) => (
              <FilterChip
                key={chip.label}
                label={chip.label}
                onRemove={chip.clear}
              />
            ))}
          </div>
        )}
      </Panel>

      {/* Loading */}
      {isLoading && (
        <div className="rounded-xl border border-border-subtle bg-card px-4 py-4 shadow-card">
          <p className="num flex items-center gap-2.5 text-xs text-text-dim">
            <span
              aria-hidden="true"
              className="h-3 w-3 animate-spin rounded-full border border-border-default border-t-accent"
            />
            Loading audit records…
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && entries.length === 0 && (
        <div className="rounded-xl border border-border-subtle bg-card px-6 py-14 text-center shadow-card">
          <p className="num text-sm text-text-dim">0 RECORDS</p>

          <p className="mt-2 text-[13px] text-text-muted">
            Nothing matches these filters.
          </p>
        </div>
      )}

      {/* Audit entries */}
      {!isLoading && entries.length > 0 && (
        <Panel
          title="Records"
          meta={
            <span className="num text-[10px] text-text-dim">
              {entries.length} loaded
            </span>
          }
          flush
        >
          <div className="divide-y divide-border-subtle">
            {entries.map((entry) => {
              const expanded = expandedId === entry.id

              return (
                <div key={entry.id}>
                  {/* Audit row */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(
                        expanded ? null : entry.id,
                      )
                    }
                    aria-expanded={expanded}
                    className={`flex w-full items-center gap-3 border-l-2 px-4 py-2.5 text-left transition-colors duration-150 hover:bg-card-hover ${
                      expanded
                        ? 'border-l-accent bg-card-hover'
                        : 'border-l-transparent'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-text-dim"
                    >
                      {expanded ? (
                        <ChevronDown size={13} strokeWidth={2} />
                      ) : (
                        <ChevronRight size={13} strokeWidth={2} />
                      )}
                    </span>

                    {/* Action code — machine value */}
                    <span className="num w-full shrink-0 text-[11px] text-accent-light sm:w-44">
                      {entry.action}
                    </span>

                    {/* Actor — human name */}
                    <span className="min-w-0 flex-1 truncate text-[13px] text-text-secondary">
                      {entry.userName ??
                        entry.userId ??
                        'System'}
                    </span>

                    {/* Timestamp */}
                    <span className="num hidden shrink-0 text-[10px] text-text-dim sm:block">
                      {new Date(
                        entry.createdAt,
                      ).toLocaleString()}
                    </span>
                  </button>

                  {/* Mobile timestamp */}
                  <div className="px-4 pb-2 pl-11 sm:hidden">
                    <span className="num text-[10px] text-text-dim">
                      {new Date(
                        entry.createdAt,
                      ).toLocaleString()}
                    </span>
                  </div>

                  {/* Expanded diff */}
                  {expanded && (
                    <div className="border-t border-border-subtle bg-surface px-4 py-4">
                      <AuditDiffView
                        oldValue={entry.oldValue}
                        newValue={entry.newValue}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Panel>
      )}

      {/* Load more */}
      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage
              ? 'Loading…'
              : 'Load more'}
          </Button>
        </div>
      )}
    </div>
  )
}
