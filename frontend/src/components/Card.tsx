import type { ReactNode } from 'react'

interface CardProps {
  variant?: 'default' | 'interactive'
  children: ReactNode
  className?: string
}

const variantStyles = {
  default: 'bg-card border border-border-subtle shadow-card',
  interactive:
    'bg-card border border-border-subtle shadow-card hover:border-border-default hover:bg-card-hover transition-all duration-150 cursor-pointer',
}

export function Card({
  variant = 'default',
  children,
  className = '',
}: CardProps) {
  return (
    <div
      className={`rounded-xl p-4 sm:p-5 ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  )
}