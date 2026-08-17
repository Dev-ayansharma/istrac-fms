import type { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'nominal' | 'warning' | 'critical' | 'special' | 'neutral'
  children: ReactNode
}

const variantStyles = {
  nominal: 'text-nominal bg-nominal-bg border border-nominal/15',
  warning: 'text-warning bg-warning-bg border border-warning/15',
  critical: 'text-critical bg-critical-bg border border-critical/15',
  special: 'text-special bg-special-bg border border-special/15',
  neutral: 'text-text-secondary bg-card border border-border-subtle',
}

const dotStyles = {
  nominal: 'bg-nominal',
  warning: 'bg-warning',
  critical: 'bg-critical',
  special: 'bg-special',
  neutral: 'bg-text-secondary',
}

export function Badge({
  variant = 'neutral',
  children,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide ${variantStyles[variant]}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotStyles[variant]}`}
      />

      <span className="truncate">
        {children}
      </span>
    </span>
  )
}