import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { useUpdateSetting } from '../hooks/useSystemConfig'
import { Button, Input } from '.'

interface ConfigFieldProps {
  settingKey: string
  label: string
  value: string
  type?: 'text' | 'number'
  helpText?: string
}

export function ConfigField({ settingKey, label, value, type = 'text', helpText }: ConfigFieldProps) {
  const [localValue, setLocalValue] = useState(value)
  const [justSaved, setJustSaved] = useState(false)
  const updateSetting = useUpdateSetting()

  useEffect(() => setLocalValue(value), [value])

  const isDirty = localValue !== value

  function handleSave() {
    updateSetting.mutate(
      { key: settingKey, value: localValue },
      { onSuccess: () => { setJustSaved(true); setTimeout(() => setJustSaved(false), 2000) } }
    )
  }

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <Input
          label={label}
          type={type}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
        />
        {helpText && <p className="text-text-muted text-xs mt-1">{helpText}</p>}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSave}
        disabled={!isDirty || updateSetting.isPending}
        className="mb-0.5"
      >
        {justSaved ? <Check size={14} className="text-nominal" /> : updateSetting.isPending ? 'Saving...' : 'Save'}
      </Button>
    </div>
  )
}