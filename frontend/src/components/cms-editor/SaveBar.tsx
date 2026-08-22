import { Button } from '..'

interface SaveBarProps {
  onSave: () => void
  isPending: boolean
}

/**
 * The closing row of every CMS tab. It owns the hairline above it, so tabs
 * should not wrap it in another bordered container.
 */
export function SaveBar({ onSave, isPending }: SaveBarProps) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-border-subtle pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[11px] leading-4 text-text-dim">
        Saving publishes to the public landing page immediately.
      </p>

      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={onSave}
        disabled={isPending}
        className="sm:shrink-0"
      >
        {isPending ? 'Saving…' : 'Save changes'}
      </Button>
    </div>
  )
}
