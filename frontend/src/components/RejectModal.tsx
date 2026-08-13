import { useState } from 'react'
import { Modal, Button } from '.'

interface RejectModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  isSubmitting: boolean
}

export function RejectModal({ isOpen, onClose, onConfirm, isSubmitting }: RejectModalProps) {
  const [reason, setReason] = useState('')
  const [touched, setTouched] = useState(false)

  const isValid = reason.trim().length > 0

  function handleConfirm() {
    setTouched(true)
    if (!isValid) return
    onConfirm(reason)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reject registration">
      <div className="space-y-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-secondary">Reason (required)</label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="px-3 py-2 rounded-md bg-surface border border-border-default text-text-primary text-sm outline-none focus:border-accent resize-none"
          />
          {touched && !isValid && <span className="text-xs text-critical">A reason is required</span>}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Rejecting...' : 'Reject'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}