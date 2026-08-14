import { useState } from 'react'
import { Modal, Button, Input } from '.'

interface TagModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (tags: string[]) => void
  isSubmitting: boolean
}

export function TagModal({ isOpen, onClose, onConfirm, isSubmitting }: TagModalProps) {
  const [tagInput, setTagInput] = useState('')

  function handleConfirm() {
    const tags = tagInput.split(',').map((t) => t.trim()).filter(Boolean)
    if (tags.length === 0) return
    onConfirm(tags)
    setTagInput('')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add tags">
      <div className="space-y-3">
        <Input
          label="Tags (comma-separated)"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="urgent, q3-review"
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Applying...' : 'Apply tags'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}