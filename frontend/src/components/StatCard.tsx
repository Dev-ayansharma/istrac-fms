import type { LucideIcon } from 'lucide-react'
import { Card } from '.'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-text-secondary">
            {label}
          </p>

          <p className="mt-1 text-2xl font-semibold tracking-tight text-text-primary">
            {value}
          </p>

          {trend && (
            <p className="mt-1.5 text-[10px] text-text-muted">
              {trend}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-center w-9 h-9 rounded-lg border border-accent/10 bg-accent/10 text-accent-light">
          <Icon size={18} strokeWidth={1.8} />
        </div>
      </div>

      <div className="absolute right-0 bottom-0 w-16 h-16 rounded-full bg-accent/5 blur-2xl pointer-events-none" />
    </Card>
  )
}