import { useDepartments } from '../hooks/useDepartments'

interface DeptMultiSelectProps {
  selected: string[]
  onChange: (ids: string[]) => void
}

export function DeptMultiSelect({
  selected,
  onChange,
}: DeptMultiSelectProps) {
  const { data: departments } = useDepartments()

  const activeDepts =
    departments?.filter((dept) => !dept.archived) ?? []

  function toggle(id: string) {
    onChange(
      selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id],
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-md border border-border-default bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-border-subtle px-3 py-2">
        <span className="col-label">Departments</span>

        <span className="num text-[10px] text-text-dim">
          {selected.length} / {activeDepts.length}
        </span>
      </div>

      {/* Department list */}
      <div className="max-h-48 divide-y divide-border-subtle overflow-y-auto">
        {activeDepts.map((dept) => {
          const isSelected = selected.includes(dept.id)

          return (
            <label
              key={dept.id}
              className={`flex cursor-pointer items-center gap-3 border-l-2 px-3 py-2 text-[13px] transition-colors duration-150 ${
                isSelected
                  ? 'border-l-accent bg-accent/[0.07] text-text-primary'
                  : 'border-l-transparent text-text-secondary hover:bg-card-hover hover:text-text-primary'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggle(dept.id)}
                className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-accent"
              />

              <span className="min-w-0 flex-1 truncate">
                {dept.name}
              </span>
            </label>
          )
        })}

        {activeDepts.length === 0 && (
          <p className="px-3 py-6 text-center text-[13px] text-text-muted">
            No departments available.
          </p>
        )}
      </div>
    </div>
  )
}
