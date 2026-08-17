import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbSegment {
  id: string | null
  name: string
}

interface DeptBreadcrumbProps {
  deptName: string
  path: BreadcrumbSegment[]
  onNavigate: (folderId: string | null) => void
}

export function DeptBreadcrumb({
  deptName,
  path,
  onNavigate,
}: DeptBreadcrumbProps) {
  return (
    <nav
      aria-label="Department breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-sm text-text-secondary"
    >
      {/* Department root */}
      <button
        type="button"
        onClick={() => onNavigate(null)}
        className="flex items-center gap-1 hover:text-accent-light"
      >
        <Home size={14} />
        <span>{deptName}</span>
      </button>

      {/* Folder path */}
      {path.map((segment) => (
        <span
          key={segment.id ?? 'root'}
          className="flex items-center gap-1.5"
        >
          <ChevronRight
            size={12}
            className="text-text-muted"
            aria-hidden="true"
          />

          <button
            type="button"
            onClick={() => onNavigate(segment.id)}
            className="hover:text-accent-light"
          >
            {segment.name}
          </button>
        </span>
      ))}
    </nav>
  )
}