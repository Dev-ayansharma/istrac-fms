import { useState } from 'react'
import { Modal, Button, Input } from '.'

interface TagModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (tags: string[]) => void
  isSubmitting: boolean
}

export function TagModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
}: TagModalProps) {
  const [tagInput, setTagInput] = useState('')

  function handleClose() {
    setTagInput('')
    onClose()
  }

  function handleConfirm() {
    const tags = tagInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    if (tags.length === 0) return

    onConfirm(tags)
    setTagInput('')
  }

  /* Echo of how the comma list will be read — display only. */
  const previewTags = tagInput
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add tags"
    >
      <div className="space-y-4">
        <Input
          id="bulk-tags"
          label="Tags"
          hint="Separate with commas."
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="urgent, q3-review"
        />

        {previewTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-t border-border-subtle pt-3">
            <span className="col-label">Will apply</span>

            {previewTags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="num inline-flex max-w-full items-center rounded-sm border border-accent/30 bg-accent/10 px-2 py-0.5 text-[11px] text-accent-light"
              >
                <span className="truncate">{tag}</span>
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-border-subtle pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            disabled={isSubmitting || !tagInput.trim()}
          >
            {isSubmitting ? 'Applying…' : 'Apply tags'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
