import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const variantStyles = {
  primary: 'border border-accent/40 bg-accent text-white shadow-button hover:-translate-y-px hover:bg-accent-light hover:shadow-[0_10px_30px_rgba(22,131,255,0.30)] active:translate-y-0 active:bg-accent-dark',
  secondary: 'border border-border-default bg-card text-text-primary hover:border-border-bright hover:bg-card-hover',
  outline: 'border border-border-default bg-surface/60 text-text-primary hover:border-accent/50 hover:bg-accent/10 hover:text-accent-light',
  danger: 'border border-critical/30 bg-critical text-white hover:bg-critical/90 active:scale-[0.98]',
}

const sizeStyles = {
  sm: 'min-h-8 rounded-[8px] px-3 py-1.5 text-xs',
  md: 'min-h-10 rounded-[9px] px-4 py-2 text-sm',
  lg: 'min-h-11 rounded-[9px] px-5 py-2.5 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-[0.01em] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-page disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
