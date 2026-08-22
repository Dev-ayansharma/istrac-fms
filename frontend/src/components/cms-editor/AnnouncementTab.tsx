import { useEffect, useState } from 'react'
import { useCms } from '../../context/cmsContext'
import { usePreviewRefresh } from '../../context/PreviewRefreshContext'
import { useUpdateCmsBlock } from '../../hooks/useUpdateCmsBlock'
import { useToastStore } from '../../store/toastStore'
import { Card, Input } from '..'
import { SaveBar } from './SaveBar'

const COLOR_OPTIONS = ['orange', 'red', 'navy'] as const

type ColorOption = (typeof COLOR_OPTIONS)[number]

interface AnnouncementContent {
  visible?: boolean
  text?: string
  backgroundColor?: string
}

export function AnnouncementTab() {
  const { cmsBlocks } = useCms()
  const updateBlock = useUpdateCmsBlock()
  const addToast = useToastStore((s) => s.addToast)
  const { triggerRefresh } = usePreviewRefresh()

  const existing = cmsBlocks['announcements'] as AnnouncementContent | undefined

  const [visible, setVisible] = useState(false)
  const [text, setText] = useState('')
  const [backgroundColor, setBackgroundColor] =
    useState<ColorOption>('navy')

  useEffect(() => {
    setVisible(existing?.visible ?? false)
    setText(existing?.text ?? '')

    const color = existing?.backgroundColor

    if (COLOR_OPTIONS.includes(color as ColorOption)) {
      setBackgroundColor(color as ColorOption)
    } else {
      setBackgroundColor('navy')
    }
  }, [existing])

  function handleSave() {
    updateBlock.mutate(
      {
        blockKey: 'announcements',
        content: {
          visible,
          text,
          backgroundColor,
        },
      },
      {
        onSuccess: () => {
          addToast({ message: 'Announcement updated', variant: 'success' })
          triggerRefresh()
        },
        onError: () => {
          addToast({ message: 'Failed to save', variant: 'error' })
        },
      },
    )
  }

  return (
    <Card>
      <div className="space-y-5">
        {/* Announcement visibility */}
        <label className="flex cursor-pointer items-center gap-2 text-sm text-text-primary">
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />

          <span>Show announcement bar</span>
        </label>

        {/* Announcement text */}
        <Input
          label="Announcement text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter announcement message..."
        />

        {/* Background color */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-secondary">
            Background color
          </label>

          <div className="flex flex-wrap items-center gap-2">
            {COLOR_OPTIONS.map((color) => {
              const isSelected = backgroundColor === color

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setBackgroundColor(color)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    isSelected
                      ? 'border-accent bg-accent/10 text-accent-light'
                      : 'border-border-default bg-surface text-text-secondary hover:bg-card hover:text-text-primary'
                  }`}
                >
                  {color}
                </button>
              )
            })}
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end border-t border-border-subtle pt-4">
          <SaveBar
            onSave={handleSave}
            isPending={updateBlock.isPending}
          />
        </div>
      </div>
    </Card>
  )
}