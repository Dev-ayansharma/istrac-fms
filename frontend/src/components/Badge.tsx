import type { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'nominal' | 'warning' | 'critical' | 'special' | 'neutral'
  children: ReactNode
}

/**
 * Annunciator flag. A solid leading bar in the status colour does the work a
 * coloured dot usually does — it survives being scanned down a dense column,
 * and it reads as a state rather than as a tag.
 */
const variantStyles = {
  nominal: 'border-nominal/25 border-l-nominal bg-nominal-bg text-nominal',
  warning: 'border-warning/25 border-l-warning bg-warning-bg text-warning',
  critical: 'border-critical/25 border-l-critical bg-critical-bg text-critical',
  special: 'border-special/25 border-l-special bg-special-bg text-special',
  neutral: 'border-border-default border-l-text-muted bg-card-hover text-text-secondary',
}

export function Badge({ variant = 'neutral', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-sm border border-l-2 px-1.5 py-0.5 text-[10px] font-bold tracking-[0.08em] uppercase ${variantStyles[variant]}`}
    >
      <span className="truncate">{children}</span>
    </span>
  )
}
