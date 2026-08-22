import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">
          {label}
        </label>
      )}

      <input
        id={id}
        className={`w-full rounded-[9px] border bg-surface px-3.5 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-muted/60 transition-all duration-200 hover:border-border-bright disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-card ${error ? 'border-critical focus:border-critical focus:ring-4 focus:ring-critical/10' : 'border-border-default focus:border-accent/70 focus:ring-4 focus:ring-accent/10'} ${className}`}
        {...props}
      />

      {error && <span className="mt-0.5 text-xs text-critical">{error}</span>}
    </div>
  )
}
