import { useUpdateSetting } from '../hooks/useSystemConfig'

interface ConfigToggleProps {
  settingKey: string
  label: string
  checked: boolean
  helpText?: string
}

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
    <div className="rounded-md border border-border-subtle bg-surface p-3">
      <label className="flex items-center gap-3 text-sm text-text-primary">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => handleChange(event.target.checked)}
          className="h-4 w-4"
        />

        <span>{label}</span>
      </label>

      {helpText && (
        <p className="mt-1 ml-7 text-xs text-text-muted">
          {helpText}
        </p>
      )}
    </div>
  )
}