import { PERMISSION_CATEGORIES } from '../config/permissions'

interface PermissionGridProps {
  selected: string[]
  onChange: (keys: string[]) => void
}

export function PermissionGrid({ selected, onChange }: PermissionGridProps) {
  function toggle(key: string) {
    onChange(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key])
  }

  return (
    <div className="space-y-4">
      {PERMISSION_CATEGORIES.map((category) => (
        <div key={category.label}>
          <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">
            {category.label}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {category.keys.map((perm) => (
              <label
                key={perm.key}
                title={perm.description}
                className="flex items-center gap-2 text-sm text-text-primary px-2 py-1 rounded hover:bg-surface cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(perm.key)}
                  onChange={() => toggle(perm.key)}
                />
                <span className="truncate">{perm.key}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}