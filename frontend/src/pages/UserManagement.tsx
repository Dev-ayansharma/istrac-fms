import { Search } from 'lucide-react'
import { useState } from 'react'
import { useUsers, useSuspendUser, useForceLogout, } from '../hooks/useUsers'
import { useToastStore } from '../store/toastStore'
import { Table, Badge, Button, Select, PageHeader, Panel, Avatar } from '../components'
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
        addToast({ message: `${suspendTarget.name} suspended`, variant: 'success' })
        setSuspendTarget(null)
      },
      onError: () => addToast({ message: 'Failed to suspend user', variant: 'error'}),
    })
  }

  function handleForceLogout(userId: string, name: string) {
    forceLogout.mutate(userId, {
      onSuccess: () => addToast({ message: `${name}'s session invalidated`, variant: 'success' }),
      onError: () => addToast({ message: 'Failed to force logout', variant: 'error' }),
    })
  }

  const totalPages = data?.pagination.totalPages ?? 1
  const totalUsers = data?.pagination.total ?? 0

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administration"
        title="User management"
        description="Accounts, roles, access state and live sessions."
        meta={
          <span className="num text-[11px] text-text-dim">
            {totalUsers} accounts
          </span>
        }
      />

      {/* Filters */}
      <Panel title="Filters">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group relative">
            <label htmlFor="user-search" className="col-label">
              Search
            </label>

            <Search
              size={14}
              strokeWidth={1.8}
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[13px] left-3 text-text-dim transition-colors duration-150 group-focus-within:text-accent-light"
            />

            <input
              id="user-search"
              placeholder="Name or email"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="mt-1.5 w-full rounded-md border border-border-default bg-surface py-2.5 pr-3 pl-9 text-sm text-text-primary outline-none transition-colors duration-150 placeholder:text-text-dim hover:border-border-bright focus:border-accent focus:bg-card-hover"
            />
          </div>

          <Select
            id="user-status"
            label="Status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
          >
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="REJECTED">Rejected</option>
          </Select>

          <Select
            id="user-role"
            label="Role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value)
              setPage(1)
            }}
          >
            <option value="">All roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="DEPT_ADMIN">Dept Admin</option>
            <option value="MEMBER">Member</option>
            <option value="GUEST">Guest</option>
          </Select>
        </div>
      </Panel>

      {/* Table */}
      {isLoading ? (
        <div className="overflow-hidden rounded-xl border border-border-subtle bg-card shadow-card">
          <div className="animate-pulse divide-y divide-border-subtle">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 px-4 py-3.5"
              >
                <div className="h-2.5 w-32 rounded-xs bg-card-hover" />
                <div className="h-2.5 w-40 rounded-xs bg-card-hover" />
                <div className="h-2.5 w-20 rounded-xs bg-card-hover" />
                <div className="h-4 w-16 rounded-xs bg-card-hover" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Panel
          title="Accounts"
          meta={
            <span className="num text-[10px] text-text-dim">
              page {page} / {totalPages}
            </span>
          }
          flush
        >
          <Table
            columns={[
              {
                key: 'name',
                header: 'Name',
                render: (row) => (
                  <span className="flex items-center gap-2.5">
                    <Avatar name={row.name} size="sm" />
                    <span className="truncate">{row.name}</span>
                  </span>
                ),
              },
              {
                key: 'email',
                header: 'Email',
                render: (row) => (
                  <span className="num text-[11px] text-text-secondary">
                    {row.email}
                  </span>
                ),
              },
              {
                key: 'role',
                header: 'Role',
                render: (row) => (
                  <span className="num text-[11px] text-text-secondary">
                    {row.role}
                  </span>
                ),
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
                  <span className="flex items-center gap-4">
                    {row.status === 'ACTIVE' && (
                      <button
                        type="button"
                        onClick={() =>
                          setSuspendTarget({
                            id: row.id,
                            name: row.name,
                          })
                        }
                        className="text-[11px] font-bold tracking-[0.06em] uppercase text-critical transition-colors duration-150 hover:text-text-primary"
                      >
                        Suspend
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleForceLogout(row.id, row.name)}
                      disabled={forceLogout.isPending}
                      className="text-[11px] font-bold tracking-[0.06em] uppercase text-warning transition-colors duration-150 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Force logout
                    </button>
                  </span>
                ),
              },
            ]}
            data={data?.data ?? []}
            emptyMessage="No users match these filters."
          />
        </Panel>
      )}

      {/* Pagination */}
      {!isLoading && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="num text-[11px] text-text-dim">
            Page {page} of {totalPages} · {totalUsers} users
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
        title="Suspend user"
        message={`Suspend ${suspendTarget?.name}? They will be immediately logged out and unable to sign in until reinstated.`}
        confirmLabel="Suspend"
        isSubmitting={suspendUser.isPending}
      />
    </div>
  )
}
