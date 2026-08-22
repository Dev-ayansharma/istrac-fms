import { useEffect, useState } from 'react'
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

/**
 * One editable setting. The stored key is shown in mono beside the label, since
 * that's the string the API writes, and the row says plainly when it's dirty.
 */
export function ConfigField({
  settingKey,
  label,
  value,
  type = 'text',
  helpText,
}: ConfigFieldProps) {
  const [localValue, setLocalValue] = useState(value)
  const [justSaved, setJustSaved] = useState(false)

  const updateSetting = useUpdateSetting()

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const isDirty = localValue !== value

  function handleSave() {
    updateSetting.mutate(
      {
        key: settingKey,
        value: localValue,
      },
      {
        onSuccess: () => {
          setJustSaved(true)

          setTimeout(() => {
            setJustSaved(false)
          }, 2000)
        },
      }
    )
  }

  return (
    <div
      className={`border-l-2 pl-3.5 transition-colors duration-150 ${
        isDirty ? 'border-l-warning' : 'border-l-border-subtle'
      }`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={`config-${settingKey}`} className="col-label">
          {label}
        </label>

        <span
          className={`num shrink-0 text-[10px] ${
            isDirty ? 'text-warning' : 'text-text-dim'
          }`}
        >
          {isDirty ? 'UNSAVED' : settingKey}
        </span>
      </div>

      <div className="mt-1.5 flex items-center gap-2.5">
        <div className="min-w-0 flex-1">
          <Input
            id={`config-${settingKey}`}
            type={type}
            value={localValue}
            onChange={(event) => setLocalValue(event.target.value)}
            className="num"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={!isDirty || updateSetting.isPending}
          className="shrink-0"
        >
          {justSaved ? (
            <Check size={13} strokeWidth={2.2} className="text-nominal" />
          ) : updateSetting.isPending ? (
            'Saving…'
          ) : (
            'Save'
          )}
        </Button>
      </div>

      {helpText && (
        <p className="mt-1.5 text-[11px] leading-4 text-text-dim">
          {helpText}
        </p>
      )}
    </div>
  )
}
