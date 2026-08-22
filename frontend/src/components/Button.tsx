import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

/**
 * Console pushbutton. Flat planes with a hairline edge — the press is
 * communicated by the surface going darker, not by the button moving.
 */
const variantStyles = {
  primary:
    'border-accent bg-accent text-white shadow-button hover:border-accent-hover hover:bg-accent-hover active:bg-accent-dark',
  secondary:
    'border-border-default bg-card-hover text-text-primary hover:border-border-bright hover:bg-[#16202e] active:bg-card',
  outline:
    'border-border-default bg-transparent text-text-secondary hover:border-border-bright hover:bg-card-hover hover:text-text-primary active:bg-card',
  ghost:
    'border-transparent bg-transparent text-text-secondary hover:bg-card-hover hover:text-text-primary active:bg-card',
  danger:
    'border-critical bg-critical text-white hover:border-critical hover:bg-[#f4737c] active:bg-[#d94a54]',
}

const sizeStyles = {
  sm: 'min-h-7 gap-1.5 rounded-md px-2.5 text-[11px] tracking-[0.06em]',
  md: 'min-h-9 gap-2 rounded-md px-3.5 text-xs tracking-[0.05em]',
  lg: 'min-h-11 gap-2 rounded-md px-5 text-[13px] tracking-[0.04em]',
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
      className={`inline-flex shrink-0 items-center justify-center border font-bold uppercase whitespace-nowrap transition-colors duration-150 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
