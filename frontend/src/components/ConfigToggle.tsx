import { useUpdateSetting } from '../hooks/useSystemConfig'

interface ConfigToggleProps {
  settingKey: string
  label: string
  checked: boolean
  helpText?: string
}

export function ConfigToggle({ settingKey, label, checked, helpText }: ConfigToggleProps) {
  const updateSetting = useUpdateSetting()

  return (
    <div>
      <label className="flex items-center gap-2 text-sm text-text-primary">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => updateSetting.mutate({ key: settingKey, value: String(e.target.checked) })}
        />
        {label}
      </label>
      {helpText && <p className="text-text-muted text-xs mt-1 ml-6">{helpText}</p>}
    </div>
  )
}