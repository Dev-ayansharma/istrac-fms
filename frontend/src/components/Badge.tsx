import type { ReactNode } from "react"


interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info'
  children: ReactNode
}

const variantStyles = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-orange-100 text-orange-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-slate-100 text-slate-800',
}

export function Badge({ variant = 'info', children }: BadgeProps) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]}`}>
      {children}
    </span>
  )
}