import { X } from 'lucide-react'

interface FilterChipProps {
  label: string
  onRemove: () => void
}

export function FilterChip({
  label,
  onRemove,
}: FilterChipProps) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent-light transition-colors">
      <span className="truncate">{label}</span>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter: ${label}`}
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-accent-light transition-colors hover:bg-accent/20 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30"
      >
        <X size={12} strokeWidth={2} />
      </button>
    </span>
  )
}