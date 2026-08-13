import type { InputHTMLAttributes } from 'react'

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({
  label,
  error,
  className = '',
  id,
  ...props
}: InputProps) {
  return (
    <div className="flex w-full flex-col gap-1">

      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="
            block
            text-[11px]
            font-medium
            text-text-muted
            mb-0.5
          "
        >
          {label}
        </label>
      )}

      {/* Input */}
      <input
        id={id}
        className={`
          w-full

          px-3.5
          py-2.5

          rounded-lg

          bg-surface
          border

          font-sans
          text-sm
          text-text-primary

          outline-none

          placeholder:text-text-muted/50

          transition-all
          duration-150

          disabled:cursor-not-allowed
          disabled:opacity-50
          disabled:bg-card

          ${
            error
              ? `
                border-critical
                focus:border-critical
                focus:ring-2
                focus:ring-critical/20
              `
              : `
                border-border-default
                focus:border-accent
                focus:ring-2
                focus:ring-accent/20
              `
          }

          ${className}
        `}
        {...props}
      />

      {/* Error */}
      {error && (
        <span
          className="
            text-xs
            text-critical
            mt-0.5
          "
        >
          {error}
        </span>
      )}
    </div>
  )
}