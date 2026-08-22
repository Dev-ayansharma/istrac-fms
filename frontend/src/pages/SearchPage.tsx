import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, History } from 'lucide-react'
import { useSearch } from '../hooks/useSearch'
import { useSearchHistoryStore } from '../store/searchHistoryStore'
import { parseSearchQuery } from '../lib/searchOperators'
import { FileIcon } from '../components/FileIcon'
import { formatFileSize } from '../lib/formatFileSize'
import { PageHeader, Panel } from '../components'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [showHistory, setShowHistory] = useState(false)
  const { history, addSearch } = useSearchHistoryStore()

  const { data: results, isLoading } = useSearch(query)
  const { operators, freeText } = parseSearchQuery(query)

  useEffect(() => {
    if (query.trim()) addSearch(query.trim())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) addSearch(query.trim())
    setShowHistory(false)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Search"
        description="Filter with operators like dept:Engineering or type:pdf, or just type what you're looking for."
      />

      <form onSubmit={handleSubmit} className="group relative">
        <SearchIcon
          size={15}
          strokeWidth={1.8}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-dim transition-colors duration-150 group-focus-within:text-accent-light"
        />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowHistory(true)}
          onBlur={() => setTimeout(() => setShowHistory(false), 150)}
          placeholder="e.g. dept:Engineering type:pdf orbit report"
          aria-label="Search query"
          className="num w-full rounded-md border border-border-default bg-surface py-2.5 pr-3 pl-9 text-[13px] text-text-primary outline-none transition-colors duration-150 placeholder:text-text-dim hover:border-border-bright focus:border-accent focus:bg-card-hover"
        />

        {showHistory && history.length > 0 && (
          <div className="absolute top-full z-20 mt-1.5 max-h-56 w-full overflow-auto rounded-lg border border-border-default bg-card shadow-card-lg">
            <p className="col-label border-b border-border-subtle px-3 py-2">Recent searches</p>

            {history.slice(0, 10).map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => { setQuery(h); setShowHistory(false) }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors duration-150 hover:bg-card-hover"
              >
                <History size={12} className="shrink-0 text-text-dim" aria-hidden="true" />
                <span className="num truncate text-xs text-text-secondary">{h}</span>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Parsed operators, echoed back so it's clear how the query was read. */}
      {operators.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="col-label">Filters</span>

          {operators.map((op) => (
            <span
              key={op.key}
              className="num inline-flex max-w-full items-center rounded-sm border border-accent/30 bg-accent/10 px-2 py-1 text-[11px] text-accent-light"
            >
              <span className="truncate">{op.key}:{op.value}</span>
            </span>
          ))}
        </div>
      )}

      {isLoading && <p className="num text-xs text-text-dim">Searching…</p>}

      {!isLoading && query && results && results.length === 0 && (
        <div className="rounded-xl border border-border-subtle bg-card p-10 text-center shadow-card">
          <p className="num text-sm text-text-dim">0 RESULTS</p>
          <p className="mt-2 text-[13px] text-text-muted">
            Nothing matched “{freeText || query}”.
          </p>
        </div>
      )}

      {results && results.length > 0 && (
        <Panel title="Results" meta={`${results.length} matches`} flush>
          <div className="divide-y divide-border-subtle">
            {results.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-card-hover"
              >
                <FileIcon nodeType={file.nodeType} mimeType={file.mimeType} />

                <p className="min-w-0 flex-1 truncate text-[13px] text-text-primary">
                  {file.name}
                </p>

                <span className="num shrink-0 text-[11px] text-text-dim">
                  {formatFileSize(file.sizeBytes)}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  )
}
