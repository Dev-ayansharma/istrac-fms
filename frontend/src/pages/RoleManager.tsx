import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useDepartments } from '../hooks/useDepartments'
import { useCustomRoles, useCreateRole, useUpdateRole, useAssignRole } from '../hooks/useCustomRoles'
import { useToastStore } from '../store/toastStore'
import { Badge, Button, Input, PageHeader, Panel, Select } from '../components'
import { PermissionGrid } from '../components/PermissionGrid'
import { UserTypeahead } from '../components/UserTypeahead'



export function RoleManager() {
  const { data: departments } = useDepartments()
  const [deptId, setDeptId] = useState('')
  const { data: roles, isLoading } = useCustomRoles(deptId)

  const [editingRoleId, setEditingRoleId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [permissions, setPermissions] = useState<string[]>([])

  const createRole = useCreateRole()
  const updateRole = useUpdateRole()
  const assignRole = useAssignRole()
  const addToast = useToastStore((s) => s.addToast)

  const activeDeptId = deptId || departments?.[0]?.id || ''

  function startNew() {
    setEditingRoleId('new')
    setName('')
    setDescription('')
    setPermissions([])
  }

  function startEdit(role: { id: string; name: string; description: string; permissions: string[] }) {
    setEditingRoleId(role.id)
    setName(role.name)
    setDescription(role.description)
    setPermissions(role.permissions)
  }

  function handleSave() {
    if (editingRoleId === 'new') {
      createRole.mutate(
        { deptId: activeDeptId, name, description, permissions },
        {
          onSuccess: () => { addToast({ message: 'Role created', variant: 'success' }); setEditingRoleId(null) },
          onError: () => addToast({ message: 'Failed to create role', variant: 'error' }),
        }
      )
    } else if (editingRoleId) {
      updateRole.mutate(
        { id: editingRoleId, name, description, permissions },
        {
          onSuccess: () => { addToast({ message: 'Role updated', variant: 'success' }); setEditingRoleId(null) },
          onError: () => addToast({ message: 'Failed to update role', variant: 'error' }),
        }
      )
    }
  }

  function handleAssign(roleId: string, user: { id: string; name: string }) {
    assignRole.mutate(
      { roleId, userId: user.id },
      {
        onSuccess: () => addToast({ message: `${user.name} assigned`, variant: 'success' }),
        onError: () => addToast({ message: 'Failed to assign — check your own permission level', variant: 'error' }),
      }
    )
  }

  return (
    <div className="w-full max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Administration"
        title="Roles"
        description="Custom permission sets, scoped to one department."
        actions={
          <Button variant="primary" size="sm" onClick={startNew}>
            <Plus size={13} strokeWidth={2.2} />
            New role
          </Button>
        }
      />

      {/* Scope */}
      <Panel
        title="Scope"
        meta={
          isLoading
            ? 'loading…'
            : `${roles?.length ?? 0} role${roles?.length === 1 ? '' : 's'}`
        }
      >
        <div className="w-full sm:max-w-xs">
          <Select
            id="role-department"
            label="Department"
            value={activeDeptId}
            onChange={(e) => setDeptId(e.target.value)}
          >
            {departments?.filter((d) => !d.archived).map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </Select>
        </div>
      </Panel>

      {/* Roles */}
      {isLoading && (
        <div className="space-y-3">
          {[0, 1].map((row) => (
            <div
              key={row}
              className="animate-pulse-slow rounded-xl border border-border-subtle bg-card p-4 shadow-card"
            >
              <div className="h-3 w-40 rounded-sm bg-surface" />
              <div className="mt-3 h-2.5 w-64 rounded-sm bg-surface" />
              <div className="mt-5 h-9 w-full rounded-md bg-surface" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && roles?.length === 0 && (
        <div className="rounded-xl border border-border-subtle bg-card px-6 py-12 text-center shadow-card">
          <p className="text-sm text-text-secondary">
            No custom roles in this department yet.
          </p>

          <p className="mt-1.5 text-[12px] text-text-dim">
            Create one to grant a narrower set of permissions than the built-in roles.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {roles?.map((role) => (
          /* Not overflow-hidden: the typeahead results have to escape the card. */
          <article
            key={role.id}
            className="rounded-xl border border-border-subtle bg-card shadow-card"
          >
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 border-b border-border-subtle px-4 py-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <h2 className="truncate text-[15px] text-text-primary">
                    {role.name}
                  </h2>

                  <Badge variant="neutral">
                    {role.memberCount} member{role.memberCount !== 1 ? 's' : ''}
                  </Badge>
                </div>

                {role.description && (
                  <p className="mt-1 text-[12px] leading-5 text-text-muted">
                    {role.description}
                  </p>
                )}
              </div>

              <Button variant="ghost" size="sm" onClick={() => startEdit(role)}>
                Edit
              </Button>
            </div>

            <div className="space-y-4 p-4">
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="col-label">Permissions</span>

                  <span className="num text-[10px] text-text-dim">
                    {role.permissions.length}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {role.permissions.slice(0, 6).map((p) => (
                    <span
                      key={p}
                      className="num rounded-sm border border-border-subtle bg-surface px-1.5 py-0.5 text-[10px] text-text-muted"
                    >
                      {p}
                    </span>
                  ))}

                  {role.permissions.length > 6 && (
                    <span className="num px-1 py-0.5 text-[10px] text-text-dim">
                      +{role.permissions.length - 6}
                    </span>
                  )}

                  {role.permissions.length === 0 && (
                    <span className="num text-[10px] text-text-dim">none</span>
                  )}
                </div>
              </div>

              <div className="border-t border-border-subtle pt-4">
                <p className="col-label">Assign member</p>

                <div className="mt-2">
                  <UserTypeahead onSelect={(user:any) => handleAssign(role.id, user)} />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Editor */}
      {editingRoleId && (
        <Panel
          title={editingRoleId === 'new' ? 'Create role' : 'Edit role'}
          meta={`${permissions.length} selected`}
        >
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                id="role-name"
                label="Role name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                id="role-description"
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <PermissionGrid selected={permissions} onChange={setPermissions} />

            <div className="flex flex-col-reverse gap-2 border-t border-border-subtle pt-4 sm:flex-row sm:justify-end">
              <Button variant="outline" size="sm" onClick={() => setEditingRoleId(null)}>
                Cancel
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={!name || createRole.isPending || updateRole.isPending}
              >
                {createRole.isPending || updateRole.isPending ? 'Saving…' : 'Save role'}
              </Button>
            </div>
          </div>
        </Panel>
      )}
    </div>
  )
}
