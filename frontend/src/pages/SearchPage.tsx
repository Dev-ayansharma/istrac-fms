import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import { useSearch } from '../hooks/useSearch'
import { useSearchHistoryStore } from '../store/searchHistoryStore'
import { parseSearchQuery } from '../lib/searchOperators'
import { FileIcon } from '../components/FileIcon'
import { formatFileSize } from '../lib/formatFileSize'
import { Card } from '../components'

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
    <div className="space-y-4 max-w-3xl">
      <h1 className="text-xl font-semibold text-text-primary">Search</h1>

      <form onSubmit={handleSubmit} className="relative">
        <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowHistory(true)}
          onBlur={() => setTimeout(() => setShowHistory(false), 150)}
          placeholder="e.g. dept:Engineering type:pdf orbit report"
          className="w-full pl-9 pr-3 py-2.5 rounded-md bg-surface border border-border-default text-text-primary text-sm outline-none focus:border-accent"
        />
        {showHistory && history.length > 0 && (
          <div className="absolute z-10 top-full mt-1 w-full bg-card border border-border-default rounded-md shadow-xl max-h-48 overflow-auto">
            {history.slice(0, 10).map((h) => (
              <button
                key={h}
                onClick={() => { setQuery(h); setShowHistory(false) }}
                className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-card-hover"
              >
                {h}
              </button>
            ))}
          </div>
        )}
      </form>

      {operators.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {operators.map((op) => (
            <span key={op.key} className="text-xs bg-accent/10 text-accent-light px-2.5 py-1 rounded-full">
              {op.key}:{op.value}
            </span>
          ))}
        </div>
      )}

      {isLoading && <p className="text-text-muted text-sm">Searching...</p>}

      {!isLoading && query && results && results.length === 0 && (
        <Card><p className="text-text-muted text-sm">No results for "{freeText || query}".</p></Card>
      )}

      <div className="space-y-1">
        {results?.map((file) => (
          <div key={file.id} className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-card">
            <FileIcon nodeType={file.nodeType} mimeType={file.mimeType} />
            <div className="flex-1 min-w-0">
              <p className="text-text-primary text-sm truncate">{file.name}</p>
              <p className="text-text-muted text-xs">{formatFileSize(file.sizeBytes)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}