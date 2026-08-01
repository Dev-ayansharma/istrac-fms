import type { ReactNode } from "react"


interface CardProps {
  variant?: 'default' | 'bordered'
  children: ReactNode
  className?: string
}

const variantStyles = {
  default: 'bg-white shadow-sm',
  bordered: 'bg-white border border-slate-100',
}

export function Card({ variant = 'default', children, className = '' }: CardProps) {
  return <div className={`rounded-lg p-4 ${variantStyles[variant]} ${className}`}>{children}</div>
}