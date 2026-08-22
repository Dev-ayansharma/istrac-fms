import type { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'nominal' | 'warning' | 'critical' | 'special' | 'neutral'
  children: ReactNode
}

const variantStyles = {
  nominal: 'border-nominal/20 bg-nominal-bg text-nominal',
  warning: 'border-warning/20 bg-warning-bg text-warning',
  critical: 'border-critical/20 bg-critical-bg text-critical',
  special: 'border-special/20 bg-special-bg text-special',
  neutral: 'border-border-subtle bg-card text-text-secondary',
}

const dotStyles = {
  nominal: 'bg-nominal',
  warning: 'bg-warning',
  critical: 'bg-critical',
  special: 'bg-special',
  neutral: 'bg-text-secondary',
}

export function Badge({ variant = 'neutral', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] ${variantStyles[variant]}`}>
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotStyles[variant]}`} />
      <span className="truncate">{children}</span>
    </span>
  )
}
