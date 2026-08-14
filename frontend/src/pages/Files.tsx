import { useState } from 'react'
import { useDepartments } from '../hooks/useDepartments'
import { FileBrowser } from '../components/FileBrowser'

export function Files() {
  const { data: departments } = useDepartments()
  const [activeDept, setActiveDept] = useState<string | null>(null)

  const deptId = activeDept ?? departments?.[0]?.id

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Files</h1>
        <select
          value={deptId ?? ''}
          onChange={(e) => setActiveDept(e.target.value)}
          className="px-3 py-2 rounded-md bg-surface border border-border-default text-text-primary text-sm"
        >
          {departments?.filter((d) => !d.archived).map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {deptId && <FileBrowser deptId={deptId} />}
    </div>
  )
}