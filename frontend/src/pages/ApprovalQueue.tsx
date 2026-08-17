import { Check, Clock3, UserCheck, X } from 'lucide-react'
import { useState } from 'react'
import {
  usePendingUsers,
  useApproveUser,
  useRejectUser,
} from '../hooks/usePendingUsers'
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
      },
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <div className="w-40 h-6 rounded bg-card-hover animate-pulse" />
          <div className="w-56 h-3 mt-2 rounded bg-card-hover animate-pulse" />
        </div>

        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <div className="space-y-3 animate-pulse">
              <div className="w-40 h-4 rounded bg-card-hover" />
              <div className="w-64 h-3 rounded bg-card-hover" />
              <div className="w-48 h-3 rounded bg-card-hover" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            Approval Queue
          </h1>

          <p className="mt-1 text-xs text-text-muted">
            Review and manage pending access requests.
          </p>
        </div>

        {pendingUsers && pendingUsers.length > 0 && (
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-warning/20 bg-warning-bg px-2.5 py-1 text-xs font-medium text-warning">
            <Clock3 size={13} />
            {pendingUsers.length} pending
          </div>
        )}
      </div>

      {/* Empty State */}
      {(!pendingUsers || pendingUsers.length === 0) && (
        <Card className="py-10">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-nominal-bg text-nominal">
              <UserCheck size={18} />
            </div>

            <p className="text-sm font-medium text-text-primary">
              No pending registrations
            </p>

            <p className="mt-1 text-xs text-text-muted">
              All access requests have been reviewed.
            </p>
          </div>
        </Card>
      )}

      {/* Pending Users */}
      {pendingUsers?.map((user) => (
        <Card key={user.id} variant="interactive">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            {/* User Information */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-accent/10 text-accent-light text-xs font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="font-medium text-sm truncate text-text-primary">
                    {user.name}
                  </p>

                  <p className="text-xs truncate text-text-muted">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Employee / Department */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
                <p className="text-xs text-text-secondary">
                  Employee ID:{' '}
                  <span className="text-text-primary">
                    {user.employeeId}
                  </span>
                </p>

                <p className="text-xs text-text-secondary">
                  Department:{' '}
                  <span className="text-text-primary">
                    {user.departmentPreference}
                  </span>
                </p>
              </div>

              {/* Reason */}
              {user.reasonForAccess && (
                <div className="mt-3 max-w-2xl">
                  <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-text-muted">
                    Reason for access
                  </p>

                  <p className="text-xs leading-relaxed text-text-secondary">
                    {user.reasonForAccess}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex w-full shrink-0 gap-2 lg:w-auto">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApprove(user.id, user.name)}
                disabled={approveUser.isPending}
                className="flex-1 lg:flex-none"
              >
                <Check size={14} />
                {approveUser.isPending ? 'Approving...' : 'Approve'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectingUserId(user.id)}
                disabled={rejectUser.isPending}
                className="flex-1 lg:flex-none"
              >
                <X size={14} />
                Reject
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {/* Reject Modal */}
      <RejectModal
        isOpen={rejectingUserId !== null}
        onClose={() => setRejectingUserId(null)}
        onConfirm={handleRejectConfirm}
        isSubmitting={rejectUser.isPending}
      />
    </div>
  )
}