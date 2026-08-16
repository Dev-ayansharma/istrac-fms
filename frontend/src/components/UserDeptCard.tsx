import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { Card } from '.'

interface UserDeptCardProps {
  id: string
  name: string
  fileCount: number
  lastUpdated: string
}

export function UserDeptCard({ id, name, fileCount, lastUpdated }: UserDeptCardProps) {
  return (
    <Link to={`/dashboard/files/${id}`}>
      <Card variant="interactive">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-text-primary font-medium">{name}</p>
            <p className="text-text-muted text-xs mt-1">{fileCount} file{fileCount !== 1 ? 's' : ''}</p>
            <p className="text-text-muted text-xs">
              Updated {new Date(lastUpdated).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-accent/10 text-accent-light p-2 rounded-md">
            <Building2 size={18} />
          </div>
        </div>
      </Card>
    </Link>
  )
}