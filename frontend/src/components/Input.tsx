import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`px-3 py-2 rounded-md bg-surface border font-sans text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted
          ${error ? 'border-critical focus:border-critical' : 'border-border-default focus:border-accent'}
          ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-critical">{error}</span>}
    </div>
  )
}