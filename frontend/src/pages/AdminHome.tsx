import {
  Users,
  FileText,
  Building2,
  HardDrive,
} from 'lucide-react'
import { useAdminStats } from '../hooks/useAdminStats'
import { StatCard, AuditFeed, PageHeader } from '../components'

function formatBytes(bytes: number) {
  if (bytes < 1024 ** 3) {
    return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  }

  return `${(bytes / 1024 ** 3).toFixed(2)} GB`
}

export function AdminHome() {
  const { data: stats, isLoading } = useAdminStats()


  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="System overview"
        title="Admin overview"
        description="Monitor users, files, departments and system storage."
      />

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Users"
          value={isLoading ? '—' : stats!.users}
          icon={Users}
          trend={!isLoading ? 'Registered accounts' : undefined}
        />

        <StatCard
          label="Files"
          value={isLoading ? '—' : stats!.files}
          icon={FileText}
          trend={!isLoading ? 'Stored in system' : undefined}
        />

        <StatCard
          label="Departments"
          value={isLoading ? '—' : stats!.departments}
          icon={Building2}
          trend={!isLoading ? 'Active' : undefined}
        />

        <StatCard
          label="Storage used"
          value={
            isLoading
              ? '—'
              : formatBytes(stats!.storageUsedBytes)
          }
          icon={HardDrive}
          trend={!isLoading ? 'Across all departments' : undefined}
        />
      </div>

      {/* Recent Activity */}
      <AuditFeed />
    </div>
  )
}