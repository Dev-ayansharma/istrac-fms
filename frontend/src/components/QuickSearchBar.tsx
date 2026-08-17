import { useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function QuickSearchBar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      return
    }

    navigate(
      `/dashboard/search?q=${encodeURIComponent(trimmedQuery)}`
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full"
    >
      <Search
        size={16}
        className="
          pointer-events-none
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          text-text-muted
        "
      />

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search files, departments, tags..."
        aria-label="Search files, departments, and tags"
        className="
          w-full
          rounded-md
          border
          border-border-default
          bg-surface
          py-2.5
          pl-9
          pr-3
          text-sm
          text-text-primary
          outline-none
          placeholder:text-text-muted
          transition-colors
          focus:border-accent
          focus:ring-1
          focus:ring-accent/30
        "
      />
    </form>
  )
}