import { Button } from '..'

interface SaveBarProps {
  onSave: () => void
  isPending: boolean
}

export function SaveBar({ onSave, isPending }: SaveBarProps) {
  return (
    <div className="flex items-center justify-end border-t border-border-subtle pt-4">
      <Button
        type="button"
        variant="primary"
        onClick={onSave}
        disabled={isPending}
      >
        {isPending ? 'Saving...' : 'Save changes'}
      </Button>
    </div>
  )
}