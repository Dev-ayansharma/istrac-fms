import { AlertCircle, CheckCircle2, Info, TriangleAlert, type LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'

type AlertVariant = 'critical' | 'warning' | 'nominal' | 'info'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  children: ReactNode
  className?: string
}

const variantConfig: Record<AlertVariant, { icon: LucideIcon; shell: string; edge: string; tint: string }> = {
  critical: {
    icon: AlertCircle,
    shell: 'border-critical/25 bg-critical-bg text-critical',
    edge: 'bg-critical',
    tint: 'text-critical',
  },
  warning: {
    icon: TriangleAlert,
    shell: 'border-warning/25 bg-warning-bg text-warning',
    edge: 'bg-warning',
    tint: 'text-warning',
  },
  nominal: {
    icon: CheckCircle2,
    shell: 'border-nominal/25 bg-nominal-bg text-nominal',
    edge: 'bg-nominal',
    tint: 'text-nominal',
  },
  info: {
    icon: Info,
    shell: 'border-accent/25 bg-accent/[0.07] text-accent-light',
    edge: 'bg-accent',
    tint: 'text-accent-light',
  },
}

/**
 * A status message, drawn as an annunciator: tinted field, tone-coloured edge,
 * icon and text. Matches the flag treatment used by Badge and Toast.
 */
export function Alert({ variant = 'critical', title, children, className = '' }: AlertProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <div
      role={variant === 'critical' ? 'alert' : 'status'}
      className={`relative overflow-hidden rounded-md border ${config.shell} ${className}`}
    >
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-0.5 ${config.edge}`} />

      <div className="flex items-start gap-2.5 px-3.5 py-3">
        <Icon size={14} strokeWidth={2} className="mt-px shrink-0" aria-hidden="true" />

        <div className="min-w-0 flex-1 text-left">
          {title && <p className="eyebrow mb-1.5">{title}</p>}
          <div className="text-xs leading-5">{children}</div>
        </div>
      </div>
    </div>
  )
}
