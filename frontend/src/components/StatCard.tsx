import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: string
}

/**
 * A single telemetry readout. The figure is set in mono because it came from
 * the system, and it's the largest thing in the cell — the icon is reduced to
 * a quiet marker in the corner rather than a coloured badge competing with it.
 */
export function StatCard({ label, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="group relative rounded-xl border border-border-subtle bg-card p-4 shadow-card transition-colors duration-150 hover:border-border-default">
      <div className="flex items-start justify-between gap-3">
        <p className="col-label">{label}</p>

        <Icon
          size={15}
          strokeWidth={1.6}
          className="shrink-0 text-text-dim transition-colors duration-150 group-hover:text-accent-light"
          aria-hidden="true"
        />
      </div>

      <p className="num mt-3 text-[26px] leading-none text-text-primary">{value}</p>

      {trend && (
        <p className="mt-2.5 truncate text-[11px] text-text-dim">{trend}</p>
      )}

      {/* Hairline foot: reads as the base line of a gauge. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-accent/40 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />
    </div>
  )
}