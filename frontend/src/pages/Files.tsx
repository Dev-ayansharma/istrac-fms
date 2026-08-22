import { useState } from 'react'

import { useDepartments } from '../hooks/useDepartments'
import { FileBrowser } from '../components/FileBrowser'
import { PageHeader, Select } from '../components'

export function Files() {
  const { data: departments, isLoading } = useDepartments()
  const [activeDept, setActiveDept] = useState<string | null>(null)

  const activeDepartments =
    departments?.filter((department) => !department.archived) ?? []

  const deptId =
    activeDept ?? activeDepartments[0]?.id

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Files"
        description="Browse the file library for a department you have access to."
        actions={
          activeDepartments.length > 0 ? (
            <div className="w-full min-w-[200px] sm:w-56">
              <Select
                id="active-department"
                aria-label="Select department"
                value={deptId ?? ''}
                onChange={(event) => setActiveDept(event.target.value)}
              >
                {activeDepartments.map((department) => (
                  <option
                    key={department.id}
                    value={department.id}
                  >
                    {department.name}
                  </option>
                ))}
              </Select>
            </div>
          ) : undefined
        }
      />

      {/* Loading */}
      {isLoading && (
        <p className="num text-xs text-text-dim">Loading departments…</p>
      )}

      {/* Empty state */}
      {!isLoading && activeDepartments.length === 0 && (
        <div className="rounded-xl border border-border-subtle bg-card p-10 text-center shadow-card">
          <p className="num text-sm text-text-dim">—</p>
          <p className="mt-2 text-[13px] text-text-muted">
            No active departments available.
          </p>
        </div>
      )}

      {/* File browser */}
      {deptId && (
        <FileBrowser
          deptId={deptId}
          parentId={null}
        />
      )}
    </div>
  )
}
