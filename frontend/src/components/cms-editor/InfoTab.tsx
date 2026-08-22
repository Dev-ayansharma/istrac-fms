import { useEffect, useState } from 'react'
import { useCms } from '../../context/cmsContext'
import { useUpdateCmsBlock } from '../../hooks/useUpdateCmsBlock'
import { useToastStore } from '../../store/toastStore'
import { usePreviewRefresh } from '../../context/PreviewRefreshContext'
import { Card, Input } from '..'
import { SaveBar } from './SaveBar'

export function InfoTab() {
  const { cmsBlocks } = useCms()

  const contact = cmsBlocks['contact_info'] as
    | {
        email?: string
        phone?: string
      }
    | undefined

  const overview = cmsBlocks['org_overview'] as
    | {
        text?: string
      }
    | undefined

  const updateBlock = useUpdateCmsBlock()
  const addToast = useToastStore((s) => s.addToast)
  const { triggerRefresh } = usePreviewRefresh()

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
        updateBlock.mutateAsync({
          blockKey: 'contact_info',
          content: {
            email,
            phone,
          },
        }),
        updateBlock.mutateAsync({
          blockKey: 'org_overview',
          content: {
            text: overviewText,
          },
        }),
      ])

      addToast({ message: 'Info updated', variant: 'success' })
      triggerRefresh()
    } catch {
      addToast({ message: 'Failed to save', variant: 'error' })
    }
  }

  return (
    <Card>
      <div className="space-y-4">
        <Input
          label="Contact email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Contact phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <label
            htmlFor="organization-overview"
            className="text-sm font-medium text-text-secondary"
          >
            Organization overview
          </label>

          <textarea
            id="organization-overview"
            rows={4}
            value={overviewText}
            onChange={(e) => setOverviewText(e.target.value)}
            className="
              w-full
              rounded-md
              border border-border-default
              bg-surface
              px-3 py-2
              text-sm
              font-sans
              text-text-primary
              outline-none
              transition-colors
              placeholder:text-text-muted
              focus:border-accent
              resize-none
            "
            placeholder="Enter organization overview..."
          />
        </div>

        <SaveBar
          onSave={handleSave}
          isPending={updateBlock.isPending}
        />
      </div>
    </Card>
  )
}