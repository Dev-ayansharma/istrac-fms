import { useState } from 'react'
import { useDepartments, useCreateDepartment, useUpdateDepartment, useArchiveDepartment } from '../hooks/useDepartments'
import { useToastStore } from '../store/toastStore'
import { Card, Button, Badge } from '../components'
import { CreateDeptModal } from '../components/CreateDeptModal'
import { HDD_ROOT } from '../../schemas/departmentSchema'

type Tab = 'active' | 'archived'

export function DepartmentManager() {
  const { data: departments, isLoading } = useDepartments()
  const createDept = useCreateDepartment()
  const updateDept = useUpdateDepartment()
  const archiveDept = useArchiveDepartment()
  const addToast = useToastStore((s) => s.addToast)

  const [tab, setTab] = useState<Tab>('active')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDept, setEditingDept] = useState<{ id: string; name: string; folderName: string } | null>(null)

  const filtered = departments?.filter((d) => (tab === 'active' ? !d.archived : d.archived)) ?? []

  async function handleCreate(data: { name: string; hddPath: string }) {
    await createDept.mutateAsync(data)
    addToast('Department created', 'success')
    setModalOpen(false)
  }

  async function handleEdit(data: { name: string; hddPath: string }) {
    if (!editingDept) return
    await updateDept.mutateAsync({ id: editingDept.id, ...data })
    addToast('Department updated', 'success')
    setEditingDept(null)
  }

  function handleArchiveToggle(id: string, name: string, currentlyArchived: boolean) {
    archiveDept.mutate(
      { id, archived: !currentlyArchived },
      {
        onSuccess: () => addToast(`${name} ${currentlyArchived ? 'restored' : 'archived'}`, 'info'),
        onError: () => addToast('Action failed', 'error'),
      }
    )
  }

  function openEdit(dept: { id: string; name: string; hddPath: string }) {
    setEditingDept({ id: dept.id, name: dept.name, folderName: dept.hddPath.replace(HDD_ROOT, '') })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Department Manager</h1>
        <Button variant="primary" onClick={() => setModalOpen(true)}>New department</Button>
      </div>

      <div className="flex gap-4 border-b border-border-subtle">
        {(['active', 'archived'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 text-sm capitalize border-b-2 transition-colors ${
              tab === t ? 'border-accent text-accent-light' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-text-muted">Loading...</p>
      ) : filtered.length === 0 ? (
        <Card><p className="text-text-muted text-sm">No {tab} departments.</p></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((dept) => (
            <Card key={dept.id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-text-primary font-medium">{dept.name}</p>
                  <p className="text-text-muted text-xs font-mono mt-1">{dept.hddPath}</p>
                  {dept.archived && <Badge variant="neutral">Archived</Badge>}
                </div>
                <div className="flex gap-2 shrink-0">
                  {!dept.archived && (
                    <button onClick={() => openEdit(dept)} className="text-xs text-accent-light hover:underline">
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleArchiveToggle(dept.id, dept.name, dept.archived)}
                    className="text-xs text-text-secondary hover:underline"
                  >
                    {dept.archived ? 'Restore' : 'Archive'}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CreateDeptModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        isSubmitting={createDept.isPending}
      />
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