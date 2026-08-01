import type { InputHTMLAttributes } from "react"


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-900">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`px-3 py-2 rounded-md border font-sans text-sm outline-none transition-colors
          ${error ? 'border-red-500 focus:border-red-600' : 'border-slate-100 focus:border-navy-500'}
          ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
}