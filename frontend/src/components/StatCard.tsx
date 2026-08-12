import { type  LucideIcon } from 'lucide-react'
import { Card } from '.'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: string
}

export function StatCard({ label, value, icon: Icon, trend }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary text-sm">{label}</p>
          <p className="text-2xl font-semibold text-text-primary mt-1">{value}</p>
          {trend && <p className="text-xs text-nominal mt-1">{trend}</p>}
        </div>
        <div className="bg-accent/10 text-accent-light p-2 rounded-md">
          <Icon size={20} />
        </div>
      </div>
    </Card>
  )
}