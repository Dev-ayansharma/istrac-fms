import { Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Card } from '.'

interface UserDeptCardProps {
  id: string
  name: string
  fileCount: number
  lastUpdated: string
}

export function UserDeptCard({
  id,
  name,
  fileCount,
  lastUpdated,
}: UserDeptCardProps) {
  return (
    <Link
      to={`/dashboard/files/${id}`}
      className="block h-full"
    >
      <Card
        variant="interactive"
        className="h-full"
      >
        <div className="flex items-center justify-between gap-4">
          {/* Department information */}
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-text-primary">
              {name}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-xs text-text-muted">
                {fileCount} file{fileCount !== 1 ? 's' : ''}
              </p>

              <span className="text-text-muted">•</span>

              <p className="text-xs text-text-muted">
                Updated{' '}
                {new Date(lastUpdated).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Department icon */}
          <div className="flex shrink-0 items-center justify-center rounded-md bg-accent/10 p-2 text-accent-light">
            <Building2 size={18} />
          </div>
        </div>
      </Card>
    </Link>
  )
}