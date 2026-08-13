import { useState } from 'react'
import { usePendingUsers, useApproveUser, useRejectUser } from '../hooks/usePendingUsers'
import { useToastStore } from '../store/toastStore'
import { Card, Button } from '../components'
import { RejectModal } from '../components/RejectModal'

export function ApprovalQueue() {
  const { data: pendingUsers, isLoading } = usePendingUsers()
  const approveUser = useApproveUser()
  const rejectUser = useRejectUser()
  const addToast = useToastStore((s) => s.addToast)
  const [rejectingUserId, setRejectingUserId] = useState<string | null>(null)

  function handleApprove(userId: string, name: string) {
    approveUser.mutate(userId, {
      onSuccess: () => addToast(`${name} approved`, 'success'),
      onError: () => addToast('Failed to approve — try again', 'error'),
    })
  }

  function handleRejectConfirm(reason: string) {
    if (!rejectingUserId) return
    const user = pendingUsers?.find((u) => u.id === rejectingUserId)
    rejectUser.mutate(
      { userId: rejectingUserId, reason },
      {
        onSuccess: () => {
          addToast(`${user?.name ?? 'User'} rejected`, 'info')
          setRejectingUserId(null)
        },
        onError: () => addToast('Failed to reject — try again', 'error'),
      }
    )
  }

  if (isLoading) return <p className="text-text-muted">Loading...</p>

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-text-primary">Approval Queue</h1>

      {(!pendingUsers || pendingUsers.length === 0) && (
        <Card>
          <p className="text-text-muted text-sm">No pending registrations.</p>
        </Card>
      )}

      {pendingUsers?.map((user) => (
        <Card key={user.id}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-text-primary font-medium">{user.name}</p>
              <p className="text-text-secondary text-sm">{user.email} · {user.employeeId}</p>
              <p className="text-text-secondary text-sm mt-1">
                Requesting: <span className="text-text-primary">{user.departmentPreference}</span>
              </p>
              <p className="text-text-muted text-xs mt-2 max-w-lg">{user.reasonForAccess}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApprove(user.id, user.name)}
                disabled={approveUser.isPending}
              >
                Approve
              </Button>
              <Button variant="outline" size="sm" onClick={() => setRejectingUserId(user.id)}>
                Reject
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <RejectModal
        isOpen={rejectingUserId !== null}
        onClose={() => setRejectingUserId(null)}
        onConfirm={handleRejectConfirm}
        isSubmitting={rejectUser.isPending}
      />
    </div>
  )
}