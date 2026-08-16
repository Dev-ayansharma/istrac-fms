import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

export function QuickSearchBar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    // Pre-fills the query on the search page via URL param — the search page itself
    // reads this on mount (built alongside FE-034), rather than this component
    // holding any search state of its own beyond the input.
    navigate(`/dashboard/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search files, departments, tags..."
        className="w-full pl-9 pr-3 py-2.5 rounded-md bg-surface border border-border-default text-text-primary text-sm outline-none focus:border-accent"
      />
    </form>
  )
}