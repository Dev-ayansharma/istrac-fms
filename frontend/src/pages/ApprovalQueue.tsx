import { Check, UserCheck, X } from 'lucide-react'
import { useState } from 'react'
import {
  usePendingUsers,
  useApproveUser,
  useRejectUser,
} from '../hooks/usePendingUsers'
import { useToastStore } from '../store/toastStore'
import { Avatar, Badge, Button, PageHeader, Panel } from '../components'
import { RejectModal } from '../components/RejectModal'

export function ApprovalQueue() {
  const { data: pendingUsers, isLoading } = usePendingUsers()

  const approveUser = useApproveUser()
  const rejectUser = useRejectUser()
  const addToast = useToastStore((s) => s.addToast)

  const [rejectingUserId, setRejectingUserId] = useState<string | null>(null)

  function handleApprove(userId: string, name: string) {
    approveUser.mutate(userId, {
      onSuccess: () => addToast({ message: `${name} approved`, variant: 'success' }),
      onError: () => addToast({ message: 'Failed to approve — try again', variant: 'error' }),
    })
  }

  function handleRejectConfirm(reason: string) {
    if (!rejectingUserId) return

    const user = pendingUsers?.find((u) => u.id === rejectingUserId)

    rejectUser.mutate(
      { userId: rejectingUserId, reason },
      {
        onSuccess: () => {
          addToast({ message: `${user?.name ?? 'User'} rejected`, variant: 'info' })
          setRejectingUserId(null)
        },
        onError: () => addToast({ message: 'Failed to reject — try again', variant: 'error' }),
      },
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-border-subtle pb-4">
          <div className="h-2.5 w-20 animate-pulse rounded-xs bg-card-hover" />
          <div className="mt-3 h-6 w-44 animate-pulse rounded-xs bg-card-hover" />
        </div>

        <div className="overflow-hidden rounded-xl border border-border-subtle bg-card shadow-card">
          <div className="divide-y divide-border-subtle">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse space-y-3 px-4 py-5">
                <div className="h-3.5 w-40 rounded-xs bg-card-hover" />
                <div className="h-2.5 w-64 rounded-xs bg-card-hover" />
                <div className="h-2.5 w-48 rounded-xs bg-card-hover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administration"
        title="Approval queue"
        description="Review and decide on pending access requests."
        meta={
          pendingUsers && pendingUsers.length > 0 ? (
            <Badge variant="warning">{pendingUsers.length} pending</Badge>
          ) : (
            <Badge variant="nominal">Clear</Badge>
          )
        }
      />

      {/* Empty State */}
      {(!pendingUsers || pendingUsers.length === 0) && (
        <div className="rounded-xl border border-border-subtle bg-card px-6 py-14 text-center shadow-card">
          <UserCheck
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mx-auto text-nominal"
          />

          <p className="mt-4 text-[13px] text-text-primary">
            No pending registrations
          </p>

          <p className="mt-1.5 text-[13px] text-text-muted">
            All access requests have been reviewed.
          </p>
        </div>
      )}

      {/* Pending Users */}
      {pendingUsers && pendingUsers.length > 0 && (
        <Panel
          title="Requests"
          meta={
            <span className="num text-[10px] text-text-dim">
              {pendingUsers.length} awaiting decision
            </span>
          }
          flush
        >
          <div className="divide-y divide-border-subtle">
            {pendingUsers.map((user) => (
              <article
                key={user.id}
                className="flex flex-col gap-4 px-4 py-4 transition-colors duration-150 hover:bg-card-hover lg:flex-row lg:items-start lg:justify-between"
              >
                {/* Identity + record */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={user.name} size="sm" />

                    <div className="min-w-0">
                      <p className="truncate text-[13px] text-text-primary">
                        {user.name}
                      </p>

                      <p className="num truncate text-[11px] text-text-dim">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Machine facts, as a record */}
                  <dl className="mt-3.5 flex flex-wrap gap-x-8 gap-y-2.5">
                    <div>
                      <dt className="col-label">Employee ID</dt>
                      <dd className="num mt-1 text-[11px] text-text-secondary">
                        {user.employeeId}
                      </dd>
                    </div>

                    <div>
                      <dt className="col-label">Department requested</dt>
                      <dd className="mt-1 text-[11px] text-text-secondary">
                        {user.departmentPreference}
                      </dd>
                    </div>
                  </dl>

                  {/* Reason — human language, so it gets prose treatment. */}
                  {user.reasonForAccess && (
                    <div className="mt-3.5 max-w-2xl border-t border-border-subtle pt-3.5">
                      <p className="col-label">Reason for access</p>

                      <p className="mt-1.5 text-[13px] leading-6 text-text-secondary">
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
                    <Check size={13} strokeWidth={2.2} />
                    {approveUser.isPending ? 'Approving…' : 'Approve'}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRejectingUserId(user.id)}
                    disabled={rejectUser.isPending}
                    className="flex-1 lg:flex-none"
                  >
                    <X size={13} strokeWidth={2.2} />
                    Reject
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </Panel>
      )}

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
