import { Archive, Building2, Folder, Plus, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import {
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useArchiveDepartment,
} from '../hooks/useDepartments'
import { useToastStore } from '../store/toastStore'
import { Card, Button, Badge } from '../components'
import { CreateDeptModal } from '../components/CreateDeptModal'
import { HDD_ROOT } from '../../schemas/departmentSchema'
import { departmentsFixture } from '../mocks/Fixtures'
type Tab = 'active' | 'archived'

export function DepartmentManager() {
  const { data: departments, isLoading } = useDepartments()
 const displayDepartments = departments && departments.length > 0 ? departments : departmentsFixture
  const createDept = useCreateDepartment()
  const updateDept = useUpdateDepartment()
  const archiveDept = useArchiveDepartment()
  const addToast = useToastStore((s) => s.addToast)

  const [tab, setTab] = useState<Tab>('active')
  const [modalOpen, setModalOpen] = useState(false)

  const [editingDept, setEditingDept] = useState<{
    id: string
    name: string
    folderName: string
  } | null>(null)

  const filtered =
    displayDepartments?.filter((dept) =>
      tab === 'active' ? !dept.archived : dept.archived
    ) ?? []

  const activeCount =
    displayDepartments?.filter((dept) => !dept.archived).length ?? 0

  const archivedCount =
    displayDepartments?.filter((dept) => dept.archived).length ?? 0

  async function handleCreate(data: {
    name: string
    hddPath: string
  }) {
    await createDept.mutateAsync(data)

    addToast('Department created', 'success')
    setModalOpen(false)
  }

  async function handleEdit(data: {
    name: string
    hddPath: string
  }) {
    if (!editingDept) return

    await updateDept.mutateAsync({
      id: editingDept.id,
      ...data,
    })

    addToast('Department updated', 'success')
    setEditingDept(null)
  }

  function handleArchiveToggle(
    id: string,
    name: string,
    currentlyArchived: boolean
  ) {
    archiveDept.mutate(
      {
        id,
        archived: !currentlyArchived,
      },
      {
        onSuccess: () =>
          addToast(
            `${name} ${
              currentlyArchived ? 'restored' : 'archived'
            }`,
            'info'
          ),

        onError: () => addToast('Action failed', 'error'),
      }
    )
  }

  function openEdit(dept: {
    id: string
    name: string
    hddPath: string
  }) {
    setEditingDept({
      id: dept.id,
      name: dept.name,
      folderName: dept.hddPath.replace(HDD_ROOT, ''),
    })
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Building2
              size={15}
              className="text-accent-light"
            />

            <span className="text-[10px] font-medium uppercase tracking-widest text-text-muted">
              Administration
            </span>
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
            Department Manager
          </h1>

          <p className="mt-1 text-xs text-text-muted sm:text-sm">
            Manage departments and their storage locations.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus size={15} />
          New department
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border-subtle">
        <button
          onClick={() => setTab('active')}
          className={`relative flex items-center gap-2 px-3 py-3 text-xs font-medium transition-colors ${
            tab === 'active'
              ? 'text-text-primary'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <span>Active</span>

          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] ${
              tab === 'active'
                ? 'bg-accent/10 text-accent-light'
                : 'bg-card text-text-muted'
            }`}
          >
            {activeCount}
          </span>

          {tab === 'active' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t bg-accent" />
          )}
        </button>

        <button
          onClick={() => setTab('archived')}
          className={`relative flex items-center gap-2 px-3 py-3 text-xs font-medium transition-colors ${
            tab === 'archived'
              ? 'text-text-primary'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <span>Archived</span>

          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] ${
              tab === 'archived'
                ? 'bg-accent/10 text-accent-light'
                : 'bg-card text-text-muted'
            }`}
          >
            {archivedCount}
          </span>

          {tab === 'archived' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t bg-accent" />
          )}
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-xl border border-border-subtle bg-card p-5"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-card-hover" />
                  <div className="h-3 w-48 rounded bg-card-hover" />
                </div>

                <div className="h-6 w-16 rounded bg-card-hover" />
              </div>

              <div className="h-3 w-24 rounded bg-card-hover" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="py-10 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-card-hover">
            {tab === 'archived' ? (
              <Archive
                size={18}
                className="text-text-muted"
              />
            ) : (
              <Building2
                size={18}
                className="text-text-muted"
              />
            )}
          </div>

          <p className="text-sm font-medium text-text-secondary">
            No {tab} departments
          </p>

          <p className="mt-1 text-xs text-text-muted">
            {tab === 'active'
              ? 'Create a department to get started.'
              : 'Archived departments will appear here.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((dept) => (
            <Card
              key={dept.id}
              className="group transition-all duration-200 hover:border-border-default hover:shadow-card-lg"
            >
              <div className="flex flex-col gap-4">
                {/* Department Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-light">
                      <Building2 size={17} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-primary">
                        {dept.name}
                      </p>

                      {dept.archived && (
                        <div className="mt-1">
                          <Badge variant="neutral">
                            Archived
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-3">
                    {!dept.archived && (
                      <button
                        onClick={() => openEdit(dept)}
                        className="text-xs font-medium text-accent-light transition-colors hover:text-blue-300 hover:underline"
                      >
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleArchiveToggle(
                          dept.id,
                          dept.name,
                          dept.archived
                        )
                      }
                      disabled={archiveDept.isPending}
                      className="flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {dept.archived ? (
                        <>
                          <RotateCcw size={12} />
                          Restore
                        </>
                      ) : (
                        <>
                          <Archive size={12} />
                          Archive
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* HDD Path */}
                <div className="rounded-lg border border-border-subtle bg-surface/60 px-3 py-2.5">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Folder
                      size={12}
                      className="text-text-muted"
                    />

                    <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                      Storage Path
                    </span>
                  </div>

                  <p className="break-all font-mono text-[11px] text-text-secondary">
                    {dept.hddPath}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Department */}
      <CreateDeptModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        isSubmitting={createDept.isPending}
      />

      {/* Edit Department */}
      <CreateDeptModal
        isOpen={editingDept !== null}
        onClose={() => setEditingDept(null)}
        onSubmit={handleEdit}
        initialValues={editingDept ?? undefined}
        isSubmitting={updateDept.isPending}
      />
    </div>
  )
}