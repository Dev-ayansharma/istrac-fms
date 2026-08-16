import { useState } from 'react'
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
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)} // delay so the click on a result registers first
        placeholder="Search by name or email..."
        className="w-full px-3 py-2 rounded-md bg-surface border border-border-default text-text-primary text-sm outline-none focus:border-accent"
      />
      {isOpen && query.length >= 2 && (
        <div className="absolute z-10 top-full mt-1 w-full bg-card border border-border-default rounded-md shadow-xl max-h-48 overflow-auto">
          {isLoading && <p className="text-text-muted text-xs px-3 py-2">Searching...</p>}
          {!isLoading && results?.length === 0 && (
            <p className="text-text-muted text-xs px-3 py-2">No matching users</p>
          )}
          {results?.map((user) => (
            <button
              key={user.id}
              onClick={() => { onSelect(user); setQuery(''); setIsOpen(false) }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-card-hover"
            >
              <span className="text-text-primary">{user.name}</span>
              <span className="text-text-muted text-xs block">{user.email}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}