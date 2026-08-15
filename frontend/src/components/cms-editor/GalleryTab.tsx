import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useCms } from '../../context/cmsContext'
import { useUpdateCmsBlock } from '../../hooks/useUpdateCmsBlock'
import { useToastStore } from '../../store/toastStore'
import { Card, Input, Button } from '..'
import { SaveBar } from './SaveBar'
import { usePreviewRefresh } from '../../context/PreviewRefreshContext'
interface GalleryItem {
  url: string
  label: string
  caption: string
}

export function GalleryTab() {
  const { cmsBlocks } = useCms()
  const existing = cmsBlocks['gallery'] as { items?: GalleryItem[] } | undefined
  const updateBlock = useUpdateCmsBlock()
  const addToast = useToastStore((s) => s.addToast)

  const [items, setItems] = useState<GalleryItem[]>([])
  const { triggerRefresh } = usePreviewRefresh()
  useEffect(() => {
    setItems(existing?.items ?? [])
  }, [existing])

  function addItem() {
    setItems((prev) => [...prev, { url: '', label: '', caption: '' }])
  }

  function updateItem(index: number, patch: Partial<GalleryItem>) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)))
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSave() {
    updateBlock.mutate(
      { blockKey: 'gallery', content: { items } },
      {
        onSuccess: () => {
          addToast('Gallery updated', 'success')
          triggerRefresh()
        },
        onError: () => addToast('Failed to save', 'error'),
      }
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <Card key={i}>
          <div className="flex gap-3">
            <div className="flex-1 space-y-2">
              <Input label="Image URL" value={item.url} onChange={(e) => updateItem(i, { url: e.target.value })} />
              <Input label="Label" value={item.label} onChange={(e) => updateItem(i, { label: e.target.value })} />
              <Input label="Caption" value={item.caption} onChange={(e) => updateItem(i, { caption: e.target.value })} />
            </div>
            <button onClick={() => removeItem(i)} className="text-critical shrink-0 h-fit">
              <Trash2 size={16} />
            </button>
          </div>
        </Card>
      ))}

      <Button variant="outline" onClick={addItem} className="w-full">
        <span className="flex items-center justify-center gap-1.5">
          <Plus size={14} /> Add image
        </span>
      </Button>

      <SaveBar onSave={handleSave} isPending={updateBlock.isPending} />
    </div>
  )
}