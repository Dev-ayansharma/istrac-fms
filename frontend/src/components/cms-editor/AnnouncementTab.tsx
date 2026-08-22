import { useEffect, useState } from 'react'
import { useCms } from '../../context/cmsContext'
import { usePreviewRefresh } from '../../context/PreviewRefreshContext'
import { useUpdateCmsBlock } from '../../hooks/useUpdateCmsBlock'
import { useToastStore } from '../../store/toastStore'
import { Input, Panel } from '..'
import { SaveBar } from './SaveBar'

const COLOR_OPTIONS = ['orange', 'red', 'navy'] as const

type ColorOption = (typeof COLOR_OPTIONS)[number]

/** Mirrors the tones AnnouncementBar actually renders, so the picker previews. */
const SWATCH: Record<ColorOption, string> = {
  orange: 'bg-warning',
  red: 'bg-critical',
  navy: 'bg-text-muted',
}

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
    <Panel title="Announcement" meta="block:announcements">
      <div className="space-y-5">
        {/* Announcement visibility */}
        <div
          className={`border-l-2 pl-3.5 transition-colors duration-150 ${
            visible ? 'border-l-nominal' : 'border-l-border-subtle'
          }`}
        >
          <label htmlFor="announcement-visible" className="col-label">
            Visibility
          </label>

          <div className="mt-2 flex items-center gap-2.5">
            <input
              id="announcement-visible"
              type="checkbox"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-accent"
            />

            <span className="text-[13px] text-text-secondary">
              Show the announcement bar on the landing page
            </span>
          </div>
        </div>

        {/* Announcement text */}
        <Input
          id="announcement-text"
          label="Announcement text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter announcement message..."
        />

        {/* Background color */}
        <fieldset>
          <legend className="col-label">Tone</legend>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {COLOR_OPTIONS.map((color) => {
              const isSelected = backgroundColor === color

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setBackgroundColor(color)}
                  aria-pressed={isSelected}
                  className={`num flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-[11px] transition-colors duration-150 ${
                    isSelected
                      ? 'border-accent bg-accent/10 text-accent-light'
                      : 'border-border-subtle bg-surface text-text-muted hover:border-border-default hover:text-text-primary'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 rounded-full ${SWATCH[color]}`}
                  />
                  {color}
                </button>
              )
            })}
          </div>
        </fieldset>

        {/* Save */}
        <SaveBar
          onSave={handleSave}
          isPending={updateBlock.isPending}
        />
      </div>
    </Panel>
  )
}
