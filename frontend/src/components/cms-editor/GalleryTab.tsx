import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useCms } from '../../context/cmsContext'
import { usePreviewRefresh } from '../../context/PreviewRefreshContext'
import { useUpdateCmsBlock } from '../../hooks/useUpdateCmsBlock'
import { useToastStore } from '../../store/toastStore'
import { Card, Input, Button } from '..'
import { SaveBar } from './SaveBar'

interface GalleryItem {
  url: string
  label: string
  caption: string
}

interface GalleryContent {
  items?: GalleryItem[]
}

export function GalleryTab() {
  const { cmsBlocks } = useCms()
  const updateBlock = useUpdateCmsBlock()
  const addToast = useToastStore((s) => s.addToast)
  const { triggerRefresh } = usePreviewRefresh()

  const existing = cmsBlocks['gallery'] as GalleryContent | undefined

  const [items, setItems] = useState<GalleryItem[]>([])

  useEffect(() => {
    setItems(existing?.items ?? [])
  }, [existing])

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        url: '',
        label: '',
        caption: '',
      },
    ])
  }

  function updateItem(index: number, patch: Partial<GalleryItem>) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    )
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSave() {
    updateBlock.mutate(
      {
        blockKey: 'gallery',
        content: { items },
      },
      {
        onSuccess: () => {
          addToast('Gallery updated', 'success')
          triggerRefresh()
        },
        onError: () => {
          addToast('Failed to save', 'error')
        },
      },
    )
  }

  return (
    <div className="space-y-4">
      {/* Gallery items */}
      {items.map((item, index) => (
        <Card key={index}>
          <div className="flex items-start gap-4">
            {/* Fields */}
            <div className="min-w-0 flex-1 space-y-3">
              <Input
                label="Image URL"
                value={item.url}
                onChange={(e) =>
                  updateItem(index, { url: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />

              <Input
                label="Label"
                value={item.label}
                onChange={(e) =>
                  updateItem(index, { label: e.target.value })
                }
                placeholder="Image label"
              />

              <Input
                label="Caption"
                value={item.caption}
                onChange={(e) =>
                  updateItem(index, { caption: e.target.value })
                }
                placeholder="Image caption"
              />
            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={() => removeItem(index)}
              aria-label={`Remove image ${index + 1}`}
              className="shrink-0 rounded-md p-2 text-text-muted transition-colors hover:bg-critical-bg hover:text-critical"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </Card>
      ))}

      {/* Empty state */}
      {items.length === 0 && (
        <Card>
          <div className="py-6 text-center">
            <p className="text-sm text-text-muted">
              No gallery images added yet.
            </p>

            <p className="mt-1 text-xs text-text-muted">
              Add an image to start building your gallery.
            </p>
          </div>
        </Card>
      )}

      {/* Add image */}
      <Button
        type="button"
        variant="outline"
        onClick={addItem}
        className="w-full"
      >
        <span className="flex items-center justify-center gap-1.5">
          <Plus size={14} />
          Add image
        </span>
      </Button>

      {/* Save */}
      <div className="flex justify-end border-t border-border-subtle pt-4">
        <SaveBar
          onSave={handleSave}
          isPending={updateBlock.isPending}
        />
      </div>
    </div>
  )
}