import { useState } from 'react'
import { Send } from 'lucide-react'
import { useDepartments } from '../hooks/useDepartments'
import { useBroadcast } from '../hooks/useBroadcast'
import { useToastStore } from '../store/toastStore'
import { Button, PageHeader, Panel, Textarea } from '../components'
import { DeptMultiSelect } from '../components/DeptMultiSelect'
import { NotificationPreviewCard } from '../components/NotificationPreviewCard'

const TARGETS: {
  id: 'all' | 'departments'
  label: string
  detail: string
}[] = [
  { id: 'all', label: 'All users', detail: 'Everyone with an account' },
  { id: 'departments', label: 'Specific departments', detail: 'One or more departments' },
]

export function BroadcastNotification() {
  const [message, setMessage] = useState('')
  const [target, setTarget] = useState<'all' | 'departments'>('all')
  const [selectedDeptIds, setSelectedDeptIds] = useState<string[]>([])

  const { data: departments } = useDepartments()
  const broadcast = useBroadcast()
  const addToast = useToastStore((s) => s.addToast)

  const departmentNames =
    departments
      ?.filter((d) => selectedDeptIds.includes(d.id))
      .map((d) => d.name) ?? []

  const canSend =
    message.trim().length > 0 &&
    (target === 'all' || selectedDeptIds.length > 0)

  function handleSend() {
    broadcast.mutate(
      {
        message,
        target,
        departmentIds:
          target === 'departments'
            ? selectedDeptIds
            : undefined,
      },
      {
        onSuccess: () => {
          addToast({ message: 'Notification sent', variant: 'success' })
          setMessage('')
          setSelectedDeptIds([])
        },
        onError: () =>
          addToast({ message: 'Failed to send notification', variant: 'error' })
      },
    )
  }

  return (
    <div className="w-full max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Administration"
        title="Broadcast"
        description="Send an operational notice to everyone, or to selected departments."
      />

      {/* Compose */}
      <Panel
        title="Message"
        meta={
          <span className="num text-[10px] text-text-dim">
            {message.length} chars
          </span>
        }
      >
        <div className="space-y-5">
          <Textarea
            id="notification-message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Scheduled maintenance tonight from 11 PM to 1 AM."
            hint="One clear statement reads better than a paragraph."
          />

          {/* Target */}
          <fieldset className="border-t border-border-subtle pt-4">
            <legend className="col-label">Send to</legend>

            <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {TARGETS.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-md border border-l-2 px-3 py-2.5 transition-colors duration-150 ${
                    target === option.id
                      ? 'border-border-default border-l-accent bg-card-hover'
                      : 'border-border-subtle border-l-transparent bg-surface hover:border-border-default hover:bg-card-hover'
                  }`}
                >
                  <input
                    type="radio"
                    name="notification-target"
                    checked={target === option.id}
                    onChange={() => setTarget(option.id)}
                    className="h-3.5 w-3.5 shrink-0 accent-accent"
                  />

                  <span className="min-w-0">
                    <span className="block text-[13px] text-text-primary">
                      {option.label}
                    </span>

                    <span className="mt-0.5 block text-[11px] text-text-dim">
                      {option.detail}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            {/* Department selection */}
            {target === 'departments' && (
              <div className="mt-3">
                <DeptMultiSelect
                  selected={selectedDeptIds}
                  onChange={setSelectedDeptIds}
                />
              </div>
            )}
          </fieldset>

          {/* Resolved recipients */}
          {target === 'departments' &&
            selectedDeptIds.length > 0 && (
              <div className="border-t border-border-subtle pt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="col-label">Recipients</span>

                  <span className="num text-[10px] text-text-dim">
                    {selectedDeptIds.length} depts
                  </span>
                </div>

                <p className="mt-1.5 text-[13px] leading-6 text-text-secondary">
                  {departmentNames.join(', ')}
                </p>
              </div>
            )}

          {/* Send */}
          <div className="flex justify-end border-t border-border-subtle pt-4">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSend}
              disabled={!canSend || broadcast.isPending}
              className="w-full sm:w-auto"
            >
              <Send size={13} strokeWidth={2} />
              {broadcast.isPending
                ? 'Sending…'
                : 'Send notification'}
            </Button>
          </div>
        </div>
      </Panel>

      {/* Preview */}
      <NotificationPreviewCard
        message={message}
        target={target}
        departmentNames={departmentNames}
      />
    </div>
  )
}
