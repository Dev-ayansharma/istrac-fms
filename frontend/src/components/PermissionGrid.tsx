import { PERMISSION_CATEGORIES } from '../config/permissions'

interface PermissionGridProps {
  selected: string[]
  onChange: (keys: string[]) => void
}

const TOTAL_PERMISSIONS = PERMISSION_CATEGORIES.reduce(
  (count, category) => count + category.keys.length,
  0,
)

/**
 * Permission keys are the strings the API stores, so they stay in mono. The
 * category labels are the only human language in the block.
 */
export function PermissionGrid({ selected, onChange }: PermissionGridProps) {
  function toggle(key: string) {
    onChange(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key])
  }

  return (
    <div className="overflow-hidden rounded-md border border-border-default bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-border-subtle px-3 py-2">
        <span className="col-label">Permissions</span>

        <span className="num text-[10px] text-text-dim">
          {selected.length} / {TOTAL_PERMISSIONS}
        </span>
      </div>

      <div className="divide-y divide-border-subtle">
        {PERMISSION_CATEGORIES.map((category) => (
          <fieldset key={category.label} className="px-3 py-3">
            <legend className="col-label">{category.label}</legend>

            <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-0.5 sm:grid-cols-2">
              {category.keys.map((perm) => {
                const isSelected = selected.includes(perm.key)

                return (
                  <label
                    key={perm.key}
                    title={perm.description}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-sm border-l-2 px-2 py-1 transition-colors duration-150 ${
                      isSelected
                        ? 'border-l-accent bg-accent/[0.07]'
                        : 'border-l-transparent hover:bg-card-hover'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggle(perm.key)}
                      className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-accent"
                    />

                    <span
                      className={`num min-w-0 truncate text-[11px] ${
                        isSelected ? 'text-text-primary' : 'text-text-muted'
                      }`}
                    >
                      {perm.key}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  )
}
