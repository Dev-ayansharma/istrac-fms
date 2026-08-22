import { ArrowRight, Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'

interface UserDeptCardProps {
  id: string
  name: string
  fileCount: number
  lastUpdated: string
}

/**
 * A department, presented as a record: the name in human type, the counts and
 * the date in mono, on a plane that brightens when it can be entered.
 */
export function UserDeptCard({
  id,
  name,
  fileCount,
  lastUpdated,
}: UserDeptCardProps) {
  return (
    <Link
      to={`/dashboard/files/${id}`}
      className="group flex h-full flex-col rounded-xl border border-border-subtle bg-card shadow-card transition-colors duration-150 hover:border-border-bright hover:bg-card-hover focus-visible:border-accent"
    >
      <div className="flex items-start gap-3 p-4">
        <Building2
          size={16}
          strokeWidth={1.7}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-text-dim transition-colors duration-150 group-hover:text-accent-light"
        />

        <p className="min-w-0 flex-1 truncate text-sm text-text-primary">{name}</p>

        <ArrowRight
          size={14}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-text-dim opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
        />
      </div>

      {/* Machine-side facts, separated from the name by a hairline. */}
      <dl className="mt-auto grid grid-cols-2 divide-x divide-border-subtle border-t border-border-subtle">
        <div className="px-4 py-3">
          <dt className="col-label">Files</dt>
          <dd className="num mt-1.5 text-[13px] text-text-secondary">{fileCount}</dd>
        </div>

        <div className="px-4 py-3">
          <dt className="col-label">Updated</dt>
          <dd className="num mt-1.5 text-[13px] text-text-secondary">
            {new Date(lastUpdated).toLocaleDateString()}
          </dd>
        </div>
      </dl>
    </Link>
  )
}
