import { useUserDepartments, useRecentFiles } from '../hooks/useUserHome'
import { useAuthStore } from '../store/authStore'
import { Card } from '../components'
import { UserDeptCard } from '../components/UserDeptCard'
import { QuickSearchBar } from '../components/QuickSearchBar'
import { FileIcon } from '../components/FileIcon'
import { formatFileSize } from '../lib/formatFileSize'

export function UserHome() {
  const user = useAuthStore((s) => s.user)
  const { data: departments, isLoading: deptsLoading } = useUserDepartments()
  const { data: recentFiles, isLoading: filesLoading } = useRecentFiles()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Welcome back, {user?.name}</h1>
        <div className="mt-3 max-w-lg">
          <QuickSearchBar />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-text-secondary mb-3">Your Departments</h2>
        {deptsLoading ? (
          <p className="text-text-muted text-sm">Loading...</p>
        ) : departments && departments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => <UserDeptCard key={dept.id} {...dept} />)}
          </div>
        ) : (
          <Card><p className="text-text-muted text-sm">No departments assigned yet.</p></Card>
        )}
      </div>

      <div>
        <h2 className="text-sm font-medium text-text-secondary mb-3">Recent Files</h2>
        <Card>
          {filesLoading ? (
            <p className="text-text-muted text-sm">Loading...</p>
          ) : recentFiles && recentFiles.length > 0 ? (
            <ul className="divide-y divide-border-subtle">
              {recentFiles.map((file) => (
                <li key={file.id} className="flex items-center gap-3 py-2.5">
                  <FileIcon nodeType="FILE" mimeType={file.mimeType} />
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary text-sm truncate">{file.name}</p>
                    <p className="text-text-muted text-xs">{file.departmentName}</p>
                  </div>
                  <span className="text-text-muted text-xs shrink-0">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-text-muted text-sm">No recent uploads.</p>
          )}
        </Card>
      </div>
    </div>
  )
}