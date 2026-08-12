import { Users, FileText, Building2, HardDrive } from 'lucide-react'
import { useAdminStats } from '../hooks/useAdminStats'
import { StatCard, AuditFeed } from '../components'

function formatBytes(bytes: number) {
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`
}

export function AdminHome() {
  const { data: stats, isLoading } = useAdminStats()

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-text-primary">Admin Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Users" value={isLoading ? '—' : stats?.users ?? 0} icon={Users} />
        <StatCard label="Files" value={isLoading ? '—' : stats?.files ?? 0} icon={FileText} />
        <StatCard label="Departments" value={isLoading ? '—' : stats?.departments ?? 0} icon={Building2} />
        <StatCard
          label="Storage Used"
          value={isLoading ? '—' : formatBytes(stats?.storageUsedBytes ?? 0)}
          icon={HardDrive}
        />
      </div>

      <AuditFeed />
    </div>
  )
}