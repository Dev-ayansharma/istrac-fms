import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  /** Guidance shown under the field while it's still valid. */
  hint?: string
}

/**
 * Labelled field. The label is the same small uppercase treatment used for
 * table column headers, so a form reads as the editable version of a record.
 */
export function Input({ label, error, hint, className = '', id, ...props }: InputProps) {
  const describedBy = error
    ? `${id}-error`
    : hint
      ? `${id}-hint`
      : undefined

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="col-label">
          {label}
        </label>
      )}

      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`w-full rounded-md border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition-colors duration-150 placeholder:text-text-dim hover:border-border-bright focus:bg-card-hover disabled:cursor-not-allowed disabled:bg-card disabled:text-text-muted ${
          error
            ? 'border-critical focus:border-critical'
            : 'border-border-default focus:border-accent'
        } ${className}`}
        {...props}
      />

      {error ? (
        <span id={`${id}-error`} className="text-[11px] leading-4 text-critical">
          {error}
        </span>
      ) : (
        hint && (
          <span id={`${id}-hint`} className="text-[11px] leading-4 text-text-dim">
            {hint}
          </span>
        )
      )}
    </div>
  )}