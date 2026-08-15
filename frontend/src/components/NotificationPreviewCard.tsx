import { Bell } from 'lucide-react'
import { Card } from '.'

interface NotificationPreviewCardProps {
  message: string
  target: 'all' | 'departments'
  departmentNames: string[]
}

export function NotificationPreviewCard({ message, target, departmentNames }: NotificationPreviewCardProps) {
  return (
    <Card>
      <p className="text-xs text-text-muted mb-2">Preview</p>
      <div className="flex items-start gap-3 bg-surface rounded-md p-3">
        <Bell size={18} className="text-accent-light shrink-0 mt-0.5" />
        <div>
          <p className="text-text-primary text-sm">{message || 'Your message will appear here...'}</p>
          <p className="text-text-muted text-xs mt-1">
            {target === 'all' ? 'Broadcasting to all users' : `To: ${departmentNames.join(', ') || 'no departments selected'}`}
          </p>
        </div>
      </div>
    </Card>
  )
}