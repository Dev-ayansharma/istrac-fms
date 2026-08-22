import { useEffect, useState } from 'react'
import { useCms } from '../../context/cmsContext'
import { usePreviewRefresh } from '../../context/PreviewRefreshContext'
import { useUpdateCmsBlock } from '../../hooks/useUpdateCmsBlock'
import { useToastStore } from '../../store/toastStore'
import { Card, Input } from '..'
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
    <Card>
      <div className="space-y-5">
        {/* Banner visibility */}
        <label className="flex cursor-pointer items-center gap-2 text-sm text-text-primary">
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />

          <span>Show banner</span>
        </label>

        {/* Banner title */}
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter banner title..."
        />

        {/* Banner subtitle */}
        <Input
          label="Subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Enter banner subtitle..."
        />

        {/* CTA */}
        <Input
          label="CTA text"
          value={ctaText}
          onChange={(e) => setCtaText(e.target.value)}
          placeholder="e.g. Learn more"
        />

        <p className="-mt-3 text-xs text-text-muted">
          Leave blank to hide the CTA button.
        </p>

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