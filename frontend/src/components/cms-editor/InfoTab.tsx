import { useEffect, useState } from 'react'
import { useCms } from '../../context/cmsContext'
import { useUpdateCmsBlock } from '../../hooks/useUpdateCmsBlock'
import { useToastStore } from '../../store/toastStore'
import { usePreviewRefresh } from '../../context/PreviewRefreshContext'
import { Input, Panel, Textarea } from '..'
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
    <Panel title="Info" meta="block:contact_info, block:org_overview">
      <div className="space-y-5">
        {/* Contact */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="contact-email"
            label="Contact email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="num"
          />

          <Input
            id="contact-phone"
            label="Contact phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="num"
          />
        </div>

        {/* Overview */}
        <div className="border-t border-border-subtle pt-4">
          <Textarea
            id="organization-overview"
            label="Organization overview"
            rows={4}
            value={overviewText}
            onChange={(e) => setOverviewText(e.target.value)}
            placeholder="Enter organization overview..."
            hint="Shown on the public landing page."
          />
        </div>

        {/* Save */}
        <SaveBar
          onSave={handleSave}
          isPending={updateBlock.isPending}
        />
      </div>
    </Panel>
  )
}
