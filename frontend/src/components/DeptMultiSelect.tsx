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
    <div className="w-full overflow-hidden rounded-lg border border-border-default bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
          Departments
        </span>

        {selected.length > 0 && (
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent-light">
            {selected.length} selected
          </span>
        )}
      </div>

      {/* Department list */}
      <div className="max-h-48 overflow-y-auto p-1.5">
        {activeDepts.map((dept) => {
          const isSelected = selected.includes(dept.id)

          return (
            <label
              key={dept.id}
              className={`
                flex cursor-pointer items-center gap-3
                rounded-md px-3 py-2
                text-sm transition-colors
                ${
                  isSelected
                    ? 'bg-accent/10 text-text-primary'
                    : 'text-text-secondary hover:bg-card-hover hover:text-text-primary'
                }
              `}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggle(dept.id)}
                className="
                  h-3.5 w-3.5
                  shrink-0
                  cursor-pointer
                  rounded
                  border-border-default
                  bg-card
                  accent-accent
                  focus:ring-2
                  focus:ring-accent/30
                "
              />

              <span className="min-w-0 flex-1 truncate">
                {dept.name}
              </span>
            </label>
          )
        })}

        {activeDepts.length === 0 && (
          <div className="px-3 py-5 text-center">
            <p className="text-xs text-text-muted">
              No departments available.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}