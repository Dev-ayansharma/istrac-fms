import { useState } from 'react'
import { Modal, Button, Textarea } from '.'

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
      title="Reject registration"
    >
      <div>
        <p className="border-l-2 border-l-critical pl-3.5 text-[13px] leading-relaxed text-text-secondary">
          The reason is sent to the applicant, so write it as something they can
          act on.
        </p>

        <div className="mt-5">
          <Textarea
            id="rejection-reason"
            label="Reason (required)"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Employee ID could not be verified against the staff directory."
            error={touched && !isValid ? 'A reason is required' : undefined}
          />
        </div>

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
            variant="danger"
            size="sm"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Rejecting…' : 'Reject'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
