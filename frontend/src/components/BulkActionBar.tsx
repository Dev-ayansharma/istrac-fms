import { Button } from '.'

interface BulkActionBarProps {
  selectedCount: number
  onDelete: () => void
  onTag: () => void
  onClear: () => void
}

export function BulkActionBar({ selectedCount, onDelete, onTag, onClear }: BulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between bg-card border border-border-default rounded-md px-4 py-2 mb-3">
      <span className="text-sm text-text-primary">{selectedCount} selected</span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onTag}>Tag</Button>
        <Button variant="danger" size="sm" onClick={onDelete}>Delete</Button>
        <Button variant="outline" size="sm" onClick={onClear}>Clear</Button>
      </div>
    </div>
  )
}