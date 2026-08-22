import { ChevronRight, Building2 } from 'lucide-react'

interface BreadcrumbSegment {
  id: string | null
  name: string
}

interface DeptBreadcrumbProps {
  deptName: string
  path: BreadcrumbSegment[]
  onNavigate: (folderId: string | null) => void
}

/**
 * The current location, as a path. The last segment is where you are, so it's
 * emphasised and not styled as something to click.
 */
export function DeptBreadcrumb({
  deptName,
  path,
  onNavigate,
}: DeptBreadcrumbProps) {
  return (
    <nav
      aria-label="Department breadcrumb"
      className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border-subtle bg-card px-3 py-2 text-[13px]"
    >
      {/* Department root */}
      <button
        type="button"
        onClick={() => onNavigate(null)}
        className={`flex items-center gap-1.5 rounded-xs transition-colors duration-150 ${
          path.length === 0
            ? 'text-text-primary'
            : 'text-text-muted hover:text-accent-light'
        }`}
      >
        <Building2 size={13} strokeWidth={1.7} aria-hidden="true" />
        <span className="truncate">{deptName}</span>
      </button>

      {/* Folder path */}
      {path.map((segment, index) => {
        const isCurrent = index === path.length - 1

        return (
          <span
            key={segment.id ?? 'root'}
            className="flex min-w-0 items-center gap-1.5"
          >
            <ChevronRight
              size={11}
              strokeWidth={2}
              className="shrink-0 text-text-dim"
              aria-hidden="true"
            />

            <button
              type="button"
              onClick={() => onNavigate(segment.id)}
              aria-current={isCurrent ? 'page' : undefined}
              className={`truncate rounded-xs transition-colors duration-150 ${
                isCurrent
                  ? 'text-text-primary'
                  : 'text-text-muted hover:text-accent-light'
              }`}
            >
              {segment.name}
            </button>
          </span>
        )
      })}
    </nav>
  )
}
