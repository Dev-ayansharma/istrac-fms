import { useState } from 'react'
import { useUsers, useSuspendUser, useForceLogout } from '../hooks/useUsers'
import { useToastStore } from '../store/toastStore'
import { Table, Badge, Button, Input } from '../components'
import { ConfirmDialog } from '../components/ConfirmDialog'

const statusVariant: Record<string, 'nominal' | 'warning' | 'critical' | 'neutral'> = {
  ACTIVE: 'nominal',
  PENDING: 'warning',
  SUSPENDED: 'critical',
  REJECTED: 'neutral',
}

export function UserManagement() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [role, setRole] = useState('')
  const [suspendTarget, setSuspendTarget] = useState<{ id: string; name: string } | null>(null)

  const { data, isLoading } = useUsers({ page, search, status, role })
  const suspendUser = useSuspendUser()
  const forceLogout = useForceLogout()
  const addToast = useToastStore((s) => s.addToast)

  function handleSuspendConfirm() {
    if (!suspendTarget) return
    suspendUser.mutate(suspendTarget.id, {
      onSuccess: () => {
        addToast(`${suspendTarget.name} suspended`, 'info')
        setSuspendTarget(null)
      },
      onError: () => addToast('Failed to suspend user', 'error'),
    })
  }

  function handleForceLogout(userId: string, name: string) {
    forceLogout.mutate(userId, {
      onSuccess: () => addToast(`${name}'s session invalidated`, 'success'),
      onError: () => addToast('Failed to force logout', 'error'),
    })
  }

  const totalPages = data?.pagination.totalPages ?? 1

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-text-primary">User Management</h1>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="max-w-xs"
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          className="px-3 py-2 rounded-md bg-surface border border-border-default text-text-primary text-sm"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <select
          value={role}
          onChange={(e) => { setRole(e.target.value); setPage(1) }}
          className="px-3 py-2 rounded-md bg-surface border border-border-default text-text-primary text-sm"
        >
          <option value="">All roles</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="DEPT_ADMIN">Dept Admin</option>
          <option value="MEMBER">Member</option>
          <option value="GUEST">Guest</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-text-muted">Loading...</p>
      ) : (
        <>
          <Table
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'email', header: 'Email' },
              { key: 'role', header: 'Role' },
              {
                key: 'status',
                header: 'Status',
                render: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
              },
              {
                key: 'id',
                header: 'Actions',
                render: (row) => (
                  <div className="flex gap-2">
                    {row.status === 'ACTIVE' && (
                      <button
                        onClick={() => setSuspendTarget({ id: row.id, name: row.name })}
                        className="text-xs text-critical hover:underline"
                      >
                        Suspend
                      </button>
                    )}
                    <button
                      onClick={() => handleForceLogout(row.id, row.name)}
                      className="text-xs text-warning hover:underline"
                    >
                      Force Logout
                    </button>
                  </div>
                ),
              },
            ]}
            data={data?.data ?? []}
          />

          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>
              Page {page} of {totalPages} ({data?.pagination.total ?? 0} users)
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        isOpen={suspendTarget !== null}
        onClose={() => setSuspendTarget(null)}
        onConfirm={handleSuspendConfirm}
        title="Suspend user"
        message={`Suspend ${suspendTarget?.name}? They will be immediately logged out and unable to sign in until reinstated.`}
        confirmLabel="Suspend"
        isSubmitting={suspendUser.isPending}
      />
    </div>
  )
}