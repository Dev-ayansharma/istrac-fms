import { useState, useEffect } from 'react'
import { useCms } from '../../context/cmsContext'
import { useUpdateCmsBlock } from '../../hooks/useUpdateCmsBlock'
import { useToastStore } from '../../store/toastStore'
import { Card, Input } from '..'
import { SaveBar } from './SaveBar'

export function HeroTab() {
  const { cmsBlocks } = useCms()
  const existing = cmsBlocks['hero'] as { title?: string; subtitle?: string; ctaText?: string } | undefined
  const updateBlock = useUpdateCmsBlock()
  const addToast = useToastStore((s) => s.addToast)

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [ctaText, setCtaText] = useState('')

  useEffect(() => {
    setTitle(existing?.title ?? '')
    setSubtitle(existing?.subtitle ?? '')
    setCtaText(existing?.ctaText ?? '')
  }, [existing]);

  function handleSave() {
    updateBlock.mutate(
      { blockKey: 'hero', content: { title, subtitle, ctaText } },
      {
        onSuccess: () => addToast('Hero section updated', 'success'),
        onError: () => addToast('Failed to save', 'error'),
      }
    )
  }

  return (
    <Card>
      <div className="space-y-4">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input label="Subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        <Input label="CTA button text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} />
        <SaveBar onSave={handleSave} isPending={updateBlock.isPending} />
      </div>
    </Card>
  )
}