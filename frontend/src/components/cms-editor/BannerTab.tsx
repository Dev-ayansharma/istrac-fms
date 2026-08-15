import { useState, useEffect } from 'react'
import { useCms } from '../../context/cmsContext'
import { useUpdateCmsBlock } from '../../hooks/useUpdateCmsBlock'
import { useToastStore } from '../../store/toastStore'
import { Card, Input } from '..'
import { SaveBar } from './SaveBar'
import { usePreviewRefresh } from '../../context/PreviewRefreshContext'
export function BannerTab() {
  const { cmsBlocks } = useCms()
  const existing = cmsBlocks['banner'] as
    | { visible?: boolean; title?: string; subtitle?: string; ctaText?: string }
    | undefined
  const updateBlock = useUpdateCmsBlock()
  const addToast = useToastStore((s) => s.addToast)

  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [ctaText, setCtaText] = useState('')
  const { triggerRefresh } = usePreviewRefresh()
  useEffect(() => {
    setVisible(existing?.visible ?? false)
    setTitle(existing?.title ?? '')
    setSubtitle(existing?.subtitle ?? '')
    setCtaText(existing?.ctaText ?? '')
  }, [existing])

  function handleSave() {
    updateBlock.mutate(
      { blockKey: 'banner', content: { visible, title, subtitle, ctaText } },
      {
        onSuccess: () => {
          addToast('Banner updated', 'success')
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
          Show banner
        </label>
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input label="Subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        <Input
          label="CTA text (leave blank to hide CTA)"
          value={ctaText}
          onChange={(e) => setCtaText(e.target.value)}
        />
        <SaveBar onSave={handleSave} isPending={updateBlock.isPending} />
      </div>
    </Card>
  )
}