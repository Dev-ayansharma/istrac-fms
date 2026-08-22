import { useState } from 'react'
import { Search } from 'lucide-react'
import { useUserSearch } from '../hooks/useCustomRoles'

interface UserTypeaheadProps {
  onSelect: (user: { id: string; name: string; email: string }) => void
}

export function UserTypeahead({ onSelect }: UserTypeaheadProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { data: results, isLoading } = useUserSearch(query)

  return (
    <div className="relative">
      <div className="group relative">
        <Search
          size={13}
          strokeWidth={1.8}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-dim transition-colors duration-150 group-focus-within:text-accent-light"
        />

        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)} // delay so the click on a result registers first
          placeholder="Search by name or email..."
          aria-label="Search users"
          className="w-full rounded-md border border-border-subtle bg-surface py-2 pr-3 pl-8 text-[13px] text-text-primary transition-colors duration-150 outline-none placeholder:text-text-dim hover:border-border-default focus:border-accent"
        />
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-border-default bg-card shadow-card-lg">
          {isLoading && (
            <p className="num px-3 py-2 text-[11px] text-text-dim">Searching…</p>
          )}

          {!isLoading && results?.length === 0 && (
            <p className="px-3 py-2 text-[11px] text-text-muted">No matching users</p>
          )}

          {results?.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => { onSelect(user); setQuery(''); setIsOpen(false) }}
              className="flex w-full items-baseline justify-between gap-3 border-l-2 border-l-transparent border-b border-b-border-subtle px-3 py-2 text-left transition-colors duration-150 last:border-b-0 hover:border-l-accent hover:bg-card-hover"
            >
              <span className="min-w-0 truncate text-[13px] text-text-primary">
                {user.name}
              </span>

              <span className="num min-w-0 shrink-0 truncate text-[10px] text-text-dim">
                {user.email}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
