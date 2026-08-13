
import { Modal, Button } from '.'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  isSubmitting?: boolean
  variant?: 'danger' | 'primary'
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', isSubmitting, variant = 'danger' }: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-text-secondary text-sm mb-4">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant={variant} onClick={onConfirm} disabled={isSubmitting}>
          {isSubmitting ? 'Working...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}