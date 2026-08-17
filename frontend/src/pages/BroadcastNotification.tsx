import { useState } from 'react'
import { Send } from 'lucide-react'
import { useDepartments } from '../hooks/useDepartments'
import { useBroadcast } from '../hooks/useBroadcast'
import { useToastStore } from '../store/toastStore'
import { Button, Card } from '../components'
import { DeptMultiSelect } from '../components/DeptMultiSelect'
import { NotificationPreviewCard } from '../components/NotificationPreviewCard'

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
          addToast('Notification sent', 'success')
          setMessage('')
          setSelectedDeptIds([])
        },
        onError: () =>
          addToast('Failed to send notification', 'error'),
      },
    )
  }

  return (
    <div className="w-full max-w-3xl space-y-5">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent-light">
            <Send size={16} />
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            Broadcast Notification
          </h1>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-text-muted">
          Send an operational notification to all users or selected
          departments.
        </p>
      </div>

      {/* Notification Form */}
      <Card>
        <div className="space-y-5">
          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="notification-message"
              className="text-xs font-medium uppercase tracking-wide text-text-secondary"
            >
              Message
            </label>

            <textarea
              id="notification-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Scheduled maintenance tonight from 11 PM to 1 AM."
              className="
                w-full resize-none rounded-lg
                border border-border-default
                bg-surface
                px-3.5 py-3
                text-sm text-text-primary
                outline-none
                placeholder:text-text-muted/60
                transition-all
                focus:border-accent
                focus:ring-2
                focus:ring-accent/20
              "
            />

            <div className="flex justify-between">
              <span className="text-[10px] text-text-muted">
                Keep the message clear and concise.
              </span>

              <span className="font-mono text-[10px] text-text-muted">
                {message.length}
              </span>
            </div>
          </div>

          {/* Target */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wide text-text-secondary">
              Send to
            </label>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {/* All users */}
              <label
                className={`
                  flex cursor-pointer items-center gap-3
                  rounded-lg border px-3 py-3
                  transition-colors
                  ${
                    target === 'all'
                      ? 'border-accent/40 bg-accent/10'
                      : 'border-border-subtle bg-surface hover:border-border-default hover:bg-card-hover'
                  }
                `}
              >
                <input
                  type="radio"
                  name="notification-target"
                  checked={target === 'all'}
                  onChange={() => setTarget('all')}
                  className="h-3.5 w-3.5 accent-accent"
                />

                <div>
                  <p className="text-sm font-medium text-text-primary">
                    All users
                  </p>

                  <p className="mt-0.5 text-[10px] text-text-muted">
                    Broadcast to everyone
                  </p>
                </div>
              </label>

              {/* Departments */}
              <label
                className={`
                  flex cursor-pointer items-center gap-3
                  rounded-lg border px-3 py-3
                  transition-colors
                  ${
                    target === 'departments'
                      ? 'border-accent/40 bg-accent/10'
                      : 'border-border-subtle bg-surface hover:border-border-default hover:bg-card-hover'
                  }
                `}
              >
                <input
                  type="radio"
                  name="notification-target"
                  checked={target === 'departments'}
                  onChange={() => setTarget('departments')}
                  className="h-3.5 w-3.5 accent-accent"
                />

                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Specific departments
                  </p>

                  <p className="mt-0.5 text-[10px] text-text-muted">
                    Choose one or more departments
                  </p>
                </div>
              </label>
            </div>

            {/* Department selection */}
            {target === 'departments' && (
              <div className="pt-1">
                <DeptMultiSelect
                  selected={selectedDeptIds}
                  onChange={setSelectedDeptIds}
                />
              </div>
            )}
          </div>

          {/* Selected recipients */}
          {target === 'departments' &&
            selectedDeptIds.length > 0 && (
              <div className="rounded-lg border border-accent/20 bg-accent/5 px-3 py-2.5">
                <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">
                  Recipients
                </p>

                <p className="mt-1 text-xs text-text-secondary">
                  {departmentNames.join(', ')}
                </p>
              </div>
            )}

          {/* Send */}
          <div className="flex justify-end border-t border-border-subtle pt-4">
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={!canSend || broadcast.isPending}
              className="w-full justify-center sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                <Send size={14} />

                {broadcast.isPending
                  ? 'Sending...'
                  : 'Send notification'}
              </span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Preview */}
      <NotificationPreviewCard
        message={message}
        target={target}
        departmentNames={departmentNames}
      />
    </div>
  )
}