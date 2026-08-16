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

export function DeptBreadcrumb({ deptName, path, onNavigate }: DeptBreadcrumbProps) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-text-secondary flex-wrap">
      <button onClick={() => onNavigate(null)} className="flex items-center gap-1 hover:text-accent-light">
        <Home size={14} />
        {deptName}
      </button>
      {path.map((segment) => (
        <span key={segment.id} className="flex items-center gap-1.5">
          <ChevronRight size={12} className="text-text-muted" />
          <button onClick={() => onNavigate(segment.id)} className="hover:text-accent-light">
            {segment.name}
          </button>
        </span>
      ))}
    </div>
  )
}