import { useState } from 'react'
import { useDepartments } from '../hooks/useDepartments'
import { useCustomRoles, useCreateRole, useUpdateRole, useAssignRole } from '../hooks/useCustomRoles'
import { useToastStore } from '../store/toastStore'
import { Card, Button, Input, Badge } from '../components'
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
          onSuccess: () => { addToast('Role created', 'success'); setEditingRoleId(null) },
          onError: () => addToast('Failed to create role', 'error'),
        }
      )
    } else if (editingRoleId) {
      updateRole.mutate(
        { id: editingRoleId, name, description, permissions },
        {
          onSuccess: () => { addToast('Role updated', 'success'); setEditingRoleId(null) },
          onError: () => addToast('Failed to update role', 'error'),
        }
      )
    }
  }

  function handleAssign(roleId: string, user: { id: string; name: string }) {
    assignRole.mutate(
      { roleId, userId: user.id },
      {
        onSuccess: () => addToast(`${user.name} assigned`, 'success'),
        onError: () => addToast('Failed to assign — check your own permission level', 'error'),
      }
    )
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Role Manager</h1>
        <div className="flex gap-2">
          <select
            value={activeDeptId}
            onChange={(e) => setDeptId(e.target.value)}
            className="px-3 py-2 rounded-md bg-surface border border-border-default text-text-primary text-sm"
          >
            {departments?.filter((d) => !d.archived).map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <Button variant="primary" onClick={startNew}>New role</Button>
        </div>
      </div>

      {isLoading && <p className="text-text-muted">Loading...</p>}

      <div className="space-y-3">
        {roles?.map((role) => (
          <Card key={role.id}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-text-primary font-medium">{role.name}</p>
                <p className="text-text-secondary text-sm">{role.description}</p>
                <Badge variant="neutral">{role.memberCount} member{role.memberCount !== 1 ? 's' : ''}</Badge>
              </div>
              <button onClick={() => startEdit(role)} className="text-xs text-accent-light hover:underline">
                Edit
              </button>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {role.permissions.slice(0, 6).map((p) => (
                <span key={p} className="text-xs bg-surface text-text-muted px-2 py-0.5 rounded">{p}</span>
              ))}
              {role.permissions.length > 6 && (
                <span className="text-xs text-text-muted">+{role.permissions.length - 6} more</span>
              )}
            </div>
            <UserTypeahead onSelect={(user) => handleAssign(role.id, user)} />
          </Card>
        ))}
      </div>

      {editingRoleId && (
        <Card>
          <h2 className="text-sm font-medium text-text-primary mb-3">
            {editingRoleId === 'new' ? 'Create role' : 'Edit role'}
          </h2>
          <div className="space-y-4">
            <Input label="Role name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <PermissionGrid selected={permissions} onChange={setPermissions} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingRoleId(null)}>Cancel</Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={!name || createRole.isPending || updateRole.isPending}
              >
                Save role
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}