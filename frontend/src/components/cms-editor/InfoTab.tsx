import { useState, useEffect } from 'react'
import { useCms } from '../../context/cmsContext'
import { useUpdateCmsBlock } from '../../hooks/useUpdateCmsBlock'
import { useToastStore } from '../../store/toastStore'
import { Card, Input } from '..'
import { SaveBar } from './SaveBar'
import { usePreviewRefresh } from '../../context/PreviewRefreshContext'
export function InfoTab() {
  const { cmsBlocks } = useCms()
  const contact = cmsBlocks['contact_info'] as { email?: string; phone?: string } | undefined
  const overview = cmsBlocks['org_overview'] as { text?: string } | undefined
  const updateBlock = useUpdateCmsBlock()
  const { triggerRefresh } = usePreviewRefresh()
  const addToast = useToastStore((s) => s.addToast)

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [overviewText, setOverviewText] = useState('')

  useEffect(() => {
    setEmail(contact?.email ?? '')
    setPhone(contact?.phone ?? '')
    setOverviewText(overview?.text ?? '')
  }, [contact, overview])

  async function handleSave() {
    try {
      await Promise.all([
        updateBlock.mutateAsync({ blockKey: 'contact_info', content: { email, phone } }),
        updateBlock.mutateAsync({ blockKey: 'org_overview', content: { text: overviewText } }),
      ])
      addToast('Info updated', 'success')
      triggerRefresh()
    } catch {
      addToast('Failed to save', 'error')
    }
  }

  return (
    <Card>
      <div className="space-y-4">
        <Input label="Contact email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Contact phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-secondary">Organization overview</label>
          <textarea
            rows={4}
            value={overviewText}
            onChange={(e) => setOverviewText(e.target.value)}
            className="px-3 py-2 rounded-md bg-surface border border-border-default text-text-primary text-sm outline-none focus:border-accent resize-none"
          />
        </div>
        <SaveBar onSave={handleSave} isPending={updateBlock.isPending} />
      </div>
    </Card>
  )
}