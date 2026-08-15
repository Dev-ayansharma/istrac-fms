import { useDepartments } from '../hooks/useDepartments'

interface DeptMultiSelectProps {
  selected: string[]
  onChange: (ids: string[]) => void
}

export function DeptMultiSelect({ selected, onChange }: DeptMultiSelectProps) {
  const { data: departments } = useDepartments()
  const activeDepts = departments?.filter((d) => !d.archived) ?? []

  function toggle(id: string) {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id])
  }

  return (
    <div className="border border-border-default rounded-md bg-surface p-2 max-h-40 overflow-auto space-y-1">
      {activeDepts.map((dept) => (
        <label key={dept.id} className="flex items-center gap-2 text-sm text-text-primary px-2 py-1.5 rounded hover:bg-card cursor-pointer">
          <input type="checkbox" checked={selected.includes(dept.id)} onChange={() => toggle(dept.id)} />
          {dept.name}
        </label>
      ))}
      {activeDepts.length === 0 && <p className="text-text-muted text-sm px-2 py-1">No departments available.</p>}
    </div>
  )
}