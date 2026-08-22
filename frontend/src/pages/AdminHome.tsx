import {
  Users,
  FileText,
  Building2,
  HardDrive,
  Activity,
} from 'lucide-react'
import { useAdminStats } from '../hooks/useAdminStats'
import { StatCard, AuditFeed } from '../components'

function formatBytes(bytes: number) {
  if (bytes < 1024 ** 3) {
    return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  }

  return `${(bytes / 1024 ** 3).toFixed(2)} GB`
}

export function AdminHome() {
  const { data: stats, isLoading } = useAdminStats()
  

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-accent-light" />

            <span className="text-[10px] font-medium uppercase tracking-widest text-text-muted">
              System Overview
            </span>
          </div>

          <h1 className="mt-1 text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
            Admin Overview
          </h1>

          <p className="mt-1 text-xs text-text-muted sm:text-sm">
            Monitor users, files, departments and system storage.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Users"
          value={isLoading ? '—' : stats!.users}
          icon={Users}
          trend={!isLoading ? 'Total registered users' : undefined}
        />

        <StatCard
          label="Files"
          value={isLoading ? '—' : stats!.files}
          icon={FileText}
          trend={!isLoading ? 'Files stored in system' : undefined}
        />

        <StatCard
          label="Departments"
          value={isLoading ? '—' : stats!.departments}
          icon={Building2}
          trend={!isLoading ? 'Active departments' : undefined}
        />

        <StatCard
          label="Storage Used"
          value={
            isLoading
              ? '—'
              : formatBytes(stats!.storageUsedBytes)
          }
          icon={HardDrive}
          trend={!isLoading ? 'Current storage usage' : undefined}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AuditFeed />
        </div>

        <div className="hidden lg:block">
          {/* Reserved for future admin dashboard widgets */}
        </div>
      </div>
    </div>
  )
}