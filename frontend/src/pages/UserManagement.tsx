import { Filter, Search, ShieldCheck, Users } from 'lucide-react'
import { useState } from 'react'
import { useUsers, useSuspendUser, useForceLogout } from '../hooks/useUsers'
import { useToastStore } from '../store/toastStore'
import { Table, Badge, Button, Input } from '../components'
import { ConfirmDialog } from '../components/ConfirmDialog'

const statusVariant: Record<
  string,
  'nominal' | 'warning' | 'critical' | 'neutral'
> = {
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
  const [suspendTarget, setSuspendTarget] = useState<{
    id: string
    name: string
  } | null>(null)

  const { data, isLoading } = useUsers({
    page,
    search,
    status,
    role,
  })

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
  const totalUsers = data?.pagination.total ?? 0

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users size={15} className="text-accent-light" />

            <span className="text-[10px] font-medium uppercase tracking-widest text-text-muted">
              Administration
            </span>
          </div>

          <h1 className="mt-1 text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
            User Management
          </h1>

          <p className="mt-1 text-xs text-text-muted sm:text-sm">
            Manage user accounts, roles, access and active sessions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <ShieldCheck size={14} className="text-nominal" />
          {totalUsers} total users
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border-subtle bg-card p-4 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={14} className="text-text-muted" />

          <span className="text-xs font-medium text-text-secondary">
            Filters
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />

            <Input
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-9"
            />
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
            className="w-full rounded-lg border border-border-default bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition-all duration-150 focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value)
              setPage(1)
            }}
            className="w-full rounded-lg border border-border-default bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition-all duration-150 focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            <option value="">All roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="DEPT_ADMIN">Dept Admin</option>
            <option value="MEMBER">Member</option>
            <option value="GUEST">Guest</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="rounded-xl border border-border-subtle bg-card p-6 shadow-card">
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4"
              >
                <div className="w-32 h-3 rounded bg-card-hover" />
                <div className="w-40 h-3 rounded bg-card-hover" />
                <div className="w-20 h-3 rounded bg-card-hover" />
                <div className="w-16 h-5 rounded-full bg-card-hover" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border-subtle bg-card shadow-card">
          <Table
            columns={[
              {
                key: 'name',
                header: 'Name',
              },
              {
                key: 'email',
                header: 'Email',
              },
              {
                key: 'role',
                header: 'Role',
              },
              {
                key: 'status',
                header: 'Status',
                render: (row) => (
                  <Badge variant={statusVariant[row.status]}>
                    {row.status}
                  </Badge>
                ),
              },
              {
                key: 'id',
                header: 'Actions',
                render: (row) => (
                  <div className="flex items-center gap-3">
                    {row.status === 'ACTIVE' && (
                      <button
                        onClick={() =>
                          setSuspendTarget({
                            id: row.id,
                            name: row.name,
                          })
                        }
                        className="text-xs font-medium text-critical transition-colors hover:text-red-300 hover:underline"
                      >
                        Suspend
                      </button>
                    )}

                    <button
                      onClick={() => handleForceLogout(row.id, row.name)}
                      disabled={forceLogout.isPending}
                      className="text-xs font-medium text-warning transition-colors hover:text-amber-300 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Force Logout
                    </button>
                  </div>
                ),
              },
            ]}
            data={data?.data ?? []}
            emptyMessage="No users found."
          />
        </div>
      )}

      {/* Pagination */}
      {!isLoading && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-text-muted">
            Page{' '}
            <span className="text-text-secondary">
              {page}
            </span>{' '}
            of{' '}
            <span className="text-text-secondary">
              {totalPages}
            </span>{' '}
            · {totalUsers} users
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Suspend Confirmation */}
      <ConfirmDialog
        isOpen={suspendTarget !== null}
        onClose={() => setSuspendTarget(null)}
        onConfirm={handleSuspendConfirm}
        title="Suspend User"
        message={`Suspend ${suspendTarget?.name}? They will be immediately logged out and unable to sign in until reinstated.`}
        confirmLabel="Suspend"
        isSubmitting={suspendUser.isPending}
      />
    </div>
  )
}