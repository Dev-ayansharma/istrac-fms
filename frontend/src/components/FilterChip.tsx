import { X } from 'lucide-react'

interface FilterChipProps {
  label: string
  onRemove: () => void
}

/**
 * An active filter, shown as a small squared token — the operator that produced
 * it (`dept:Engineering`) is machine syntax, so the label is set in mono.
 */
export function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-sm border border-accent/30 bg-accent/10 py-1 pr-1 pl-2 text-[11px] text-accent-light">
      <span className="num truncate">{label}</span>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter: ${label}`}
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-xs text-accent-light transition-colors duration-150 hover:bg-accent/25 hover:text-text-primary"
      >
        <X size={11} strokeWidth={2.2} />
      </button>
    </span>
  )
}
