import { X } from 'lucide-react'

interface FilterChipProps {
  label: string
  onRemove: () => void
}

export function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-accent/10 text-accent-light text-xs px-2.5 py-1 rounded-full">
      {label}
      <button onClick={onRemove} aria-label={`Remove filter: ${label}`}>
        <X size={12} />
      </button>
    </span>
  )
}   