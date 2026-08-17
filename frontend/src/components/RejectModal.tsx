import { useState } from 'react'
import { Modal, Button } from '.'

interface RejectModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  isSubmitting: boolean
}

export function RejectModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
}: RejectModalProps) {
  const [reason, setReason] = useState('')
  const [touched, setTouched] = useState(false)

  const isValid = reason.trim().length > 0

  function handleConfirm() {
    setTouched(true)

    if (!isValid) return

    onConfirm(reason)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Registration"
    >
      <div className="space-y-4">
        {/* Reason */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="rejection-reason"
            className="text-xs font-medium text-text-secondary"
          >
            Reason <span className="text-critical">*</span>
          </label>

          <textarea
            id="rejection-reason"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter the reason for rejecting this registration..."
            className={`
              w-full
              resize-none
              rounded-lg
              border
              bg-surface
              px-3.5
              py-2.5
              font-sans
              text-sm
              text-text-primary
              outline-none
              transition-all
              duration-150
              placeholder:text-text-muted/50
              focus:ring-2
              ${
                touched && !isValid
                  ? 'border-critical focus:border-critical focus:ring-critical/20'
                  : 'border-border-default focus:border-accent focus:ring-accent/20'
              }
            `}
          />

          {touched && !isValid && (
            <span className="text-xs text-critical">
              A reason is required
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Rejecting...' : 'Reject'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}