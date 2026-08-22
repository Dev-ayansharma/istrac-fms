import { useEffect, useState } from 'react'
import { useCms } from '../../context/cmsContext'
import { usePreviewRefresh } from '../../context/PreviewRefreshContext'
import { useUpdateCmsBlock } from '../../hooks/useUpdateCmsBlock'
import { useToastStore } from '../../store/toastStore'
import { Input, Panel } from '..'
import { SaveBar } from './SaveBar'

interface BannerContent {
  visible?: boolean
  title?: string
  subtitle?: string
  ctaText?: string
}

export function BannerTab() {
  const { cmsBlocks } = useCms()
  const updateBlock = useUpdateCmsBlock()
  const addToast = useToastStore((s) => s.addToast)
  const { triggerRefresh } = usePreviewRefresh()

  const existing = cmsBlocks['banner'] as BannerContent | undefined

  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [ctaText, setCtaText] = useState('')

  useEffect(() => {
    setVisible(existing?.visible ?? false)
    setTitle(existing?.title ?? '')
    setSubtitle(existing?.subtitle ?? '')
    setCtaText(existing?.ctaText ?? '')
  }, [existing])

  function handleSave() {
    updateBlock.mutate(
      {
        blockKey: 'banner',
        content: {
          visible,
          title,
          subtitle,
          ctaText,
        },
      },
      {
        onSuccess: () => {
          addToast({ message: 'Banner updated', variant: 'success' })
          triggerRefresh()
        },
        onError: () => {
          addToast({ message: 'Failed to save', variant: 'error' })
        },
      },
    )
  }

  return (
    <Panel title="Banner" meta="block:banner">
      <div className="space-y-5">
        {/* Banner visibility */}
        <div
          className={`border-l-2 pl-3.5 transition-colors duration-150 ${
            visible ? 'border-l-nominal' : 'border-l-border-subtle'
          }`}
        >
          <label htmlFor="banner-visible" className="col-label">
            Visibility
          </label>

          <div className="mt-2 flex items-center gap-2.5">
            <input
              id="banner-visible"
              type="checkbox"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-accent"
            />

            <span className="text-[13px] text-text-secondary">
              Show the banner on the landing page
            </span>
          </div>
        </div>

        {/* Banner title */}
        <Input
          id="banner-title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter banner title..."
        />

        {/* Banner subtitle */}
        <Input
          id="banner-subtitle"
          label="Subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Enter banner subtitle..."
        />

        {/* CTA */}
        <Input
          id="banner-cta"
          label="CTA text"
          value={ctaText}
          onChange={(e) => setCtaText(e.target.value)}
          placeholder="e.g. Learn more"
          hint="Leave blank to hide the CTA button."
        />

        {/* Save */}
        <SaveBar
          onSave={handleSave}
          isPending={updateBlock.isPending}
        />
      </div>
    </Panel>
  )
}
