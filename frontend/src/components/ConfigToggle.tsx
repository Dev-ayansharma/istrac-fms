import { useUpdateSetting } from '../hooks/useSystemConfig'

interface ConfigToggleProps {
  settingKey: string
  label: string
  checked: boolean
  helpText?: string
}

/**
 * A setting that writes on change rather than on save. The left edge carries
 * the current state so a column of these can be read at a glance.
 */
export function ConfigToggle({
  settingKey,
  label,
  checked,
  helpText,
}: ConfigToggleProps) {
  const updateSetting = useUpdateSetting()

  function handleChange(value: boolean) {
    updateSetting.mutate({
      key: settingKey,
      value: String(value),
    })
  }

  return (
    <div
      className={`border-l-2 pl-3.5 transition-colors duration-150 ${
        checked ? 'border-l-nominal' : 'border-l-border-subtle'
      }`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={`config-${settingKey}`} className="col-label">
          {label}
        </label>

        <span className="num shrink-0 text-[10px] text-text-dim">
          {settingKey}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2.5">
        <input
          id={`config-${settingKey}`}
          type="checkbox"
          checked={checked}
          onChange={(event) => handleChange(event.target.checked)}
          disabled={updateSetting.isPending}
          className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-accent"
        />

        <span
          className={`num text-[11px] ${
            checked ? 'text-nominal' : 'text-text-dim'
          }`}
        >
          {updateSetting.isPending
            ? 'WRITING…'
            : checked
              ? 'ENABLED'
              : 'DISABLED'}
        </span>
      </div>

      {helpText && (
        <p className="mt-1.5 text-[11px] leading-4 text-text-dim">
          {helpText}
        </p>
      )}
    </div>
  )
}
