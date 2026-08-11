import type { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'nominal' | 'warning' | 'critical' | 'special' | 'neutral'
  children: ReactNode
}

const variantStyles = {
  nominal: 'text-nominal bg-nominal-bg',
  warning: 'text-warning bg-warning-bg',
  critical: 'text-critical bg-critical-bg',
  special: 'text-special bg-special-bg',
  neutral: 'text-text-secondary bg-card',
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
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${variantStyles[variant]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`} />
      {children}
    </span>
  )
}