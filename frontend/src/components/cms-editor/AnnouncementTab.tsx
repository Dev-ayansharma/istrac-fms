import { useState, useEffect } from 'react'
import { useCms } from '../../context/cmsContext'
import { useUpdateCmsBlock } from '../../hooks/useUpdateCmsBlock'
import { useToastStore } from '../../store/toastStore'
import { Card, Input } from '..'
import { SaveBar } from './SaveBar'
import { usePreviewRefresh } from '../../context/PreviewRefreshContext'
const COLOR_OPTIONS = ['orange', 'red', 'navy'] as const

export function AnnouncementTab() {
  const { cmsBlocks } = useCms()
  const existing = cmsBlocks['announcements'] as
    | { visible?: boolean; text?: string; backgroundColor?: string }
    | undefined
  const updateBlock = useUpdateCmsBlock()
  const addToast = useToastStore((s) => s.addToast)
  const { triggerRefresh } = usePreviewRefresh()
  const [visible, setVisible] = useState(false)
  const [text, setText] = useState('')
  const [backgroundColor, setBackgroundColor] = useState<(typeof COLOR_OPTIONS)[number]>('navy')

  useEffect(() => {
    setVisible(existing?.visible ?? false)
    setText(existing?.text ?? '')
    setBackgroundColor((existing?.backgroundColor as (typeof COLOR_OPTIONS)[number]) ?? 'navy')
  }, [existing])

  function handleSave() {
    updateBlock.mutate(
      { blockKey: 'announcements', content: { visible, text, backgroundColor } },
      {
        onSuccess: () => {
          addToast('Announcement updated', 'success')
          triggerRefresh()
        },
        onError: () => addToast('Failed to save', 'error'),
      }
    )
  }

  return (
    <Card>
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
          Show announcement bar
        </label>
        <Input label="Text" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-secondary">Background color</label>
          <div className="flex gap-2">
            {COLOR_OPTIONS.map((color) => (
              <button
                key={color}
                onClick={() => setBackgroundColor(color)}
                className={`px-3 py-1.5 rounded-md text-xs capitalize border ${
                  backgroundColor === color ? 'border-accent text-accent-light' : 'border-border-default text-text-secondary'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
        <SaveBar onSave={handleSave} isPending={updateBlock.isPending} />
      </div>
    </Card>
  )
}