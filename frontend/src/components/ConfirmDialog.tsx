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

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  isSubmitting = false,
  variant = 'danger',
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <div>
        {/* Message — carried on a tone edge rather than a filled box. */}
        <p
          className={`border-l-2 pl-3.5 text-[13px] leading-relaxed text-text-secondary ${
            variant === 'danger' ? 'border-l-critical' : 'border-l-accent'
          }`}
        >
          {message}
        </p>

        {/* Actions */}
        <div className="mt-5 flex flex-col-reverse gap-2 border-t border-border-subtle pt-4 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            variant={variant}
            size="sm"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Working…' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}