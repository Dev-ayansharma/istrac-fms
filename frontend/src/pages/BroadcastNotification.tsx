import { useState } from 'react'
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

  const departmentNames = departments
    ?.filter((d) => selectedDeptIds.includes(d.id))
    .map((d) => d.name) ?? []

  const canSend = message.trim().length > 0 && (target === 'all' || selectedDeptIds.length > 0)

  function handleSend() {
    broadcast.mutate(
      { message, target, departmentIds: target === 'departments' ? selectedDeptIds : undefined },
      {
        onSuccess: () => {
          addToast('Notification sent', 'success')
          setMessage('')
          setSelectedDeptIds([])
        },
        onError: () => addToast('Failed to send notification', 'error'),
      }
    )
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold text-text-primary">Broadcast Notification</h1>

      <Card>
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Message</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="px-3 py-2 rounded-md bg-surface border border-border-default text-text-primary text-sm outline-none focus:border-accent resize-none"
              placeholder="e.g. Scheduled maintenance tonight from 11 PM to 1 AM."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary">Send to</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-text-primary">
                <input type="radio" checked={target === 'all'} onChange={() => setTarget('all')} />
                All users
              </label>
              <label className="flex items-center gap-2 text-sm text-text-primary">
                <input type="radio" checked={target === 'departments'} onChange={() => setTarget('departments')} />
                Specific departments
              </label>
            </div>
            {target === 'departments' && (
              <DeptMultiSelect selected={selectedDeptIds} onChange={setSelectedDeptIds} />
            )}
          </div>

          <Button variant="primary" onClick={handleSend} disabled={!canSend || broadcast.isPending}>
            {broadcast.isPending ? 'Sending...' : 'Send notification'}
          </Button>
        </div>
      </Card>

      <NotificationPreviewCard message={message} target={target} departmentNames={departmentNames} />
    </div>
  )
}