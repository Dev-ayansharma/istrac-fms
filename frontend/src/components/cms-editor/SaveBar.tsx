import { Button } from '..'

interface SaveBarProps {
  onSave: () => void
  isPending: boolean
}

export function SaveBar({ onSave, isPending }: SaveBarProps) {
  return (
    <div className="flex justify-end pt-2">
      <Button variant="primary" onClick={onSave} disabled={isPending}>
        {isPending ? 'Saving...' : 'Save changes'}
      </Button>
    </div>
  )
}