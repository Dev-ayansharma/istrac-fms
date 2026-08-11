import type  { ReactNode } from 'react'

interface CardProps {
  variant?: 'default' | 'interactive'
  children: ReactNode
  className?: string
}

const variantStyles = {
  default: 'bg-card border border-border-subtle',
  interactive: 'bg-card border border-border-subtle hover:border-border-default hover:bg-card-hover transition-colors cursor-pointer',
}

export function Card({ variant = 'default', children, className = '' }: CardProps) {
  return <div className={`rounded-lg p-4 ${variantStyles[variant]} ${className}`}>{children}</div>
}