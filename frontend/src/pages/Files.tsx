import { useState } from 'react'

import { useDepartments } from '../hooks/useDepartments'
import { FileBrowser } from '../components/FileBrowser'

export function Files() {
  const { data: departments, isLoading } = useDepartments()
  const [activeDept, setActiveDept] = useState<string | null>(null)

  const activeDepartments =
    departments?.filter((department) => !department.archived) ?? []

  const deptId =
    activeDept ?? activeDepartments[0]?.id

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">
          Files
        </h1>

        {activeDepartments.length > 0 && (
          <select
            value={deptId ?? ''}
            onChange={(event) =>
              setActiveDept(event.target.value)
            }
            className="px-3 py-2 rounded-md bg-surface border border-border-default text-text-primary text-sm outline-none focus:border-accent"
            aria-label="Select department"
          >
            {activeDepartments.map((department) => (
              <option
                key={department.id}
                value={department.id}
              >
                {department.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <p className="text-sm text-text-muted">
          Loading departments...
        </p>
      )}

      {/* Empty state */}
      {!isLoading && activeDepartments.length === 0 && (
        <div className="rounded-md border border-border-subtle bg-card p-4">
          <p className="text-sm text-text-muted">
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