import {
  useRecentFiles,
  useUserDepartments,
} from '../hooks/useUserHome'
import { useAuthStore } from '../store/authStore'

import { Card } from '../components'
import { FileIcon } from '../components/FileIcon'
import { QuickSearchBar } from '../components/QuickSearchBar'
import { UserDeptCard } from '../components/UserDeptCard'

import { formatFileSize } from '../lib/formatFileSize'

export function UserHome() {
  const user = useAuthStore((state) => state.user)

  const {
    data: departments,
    isLoading: deptsLoading,
  } = useUserDepartments()

  const {
    data: recentFiles,
    isLoading: filesLoading,
  } = useRecentFiles()

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <h1 className="text-xl font-semibold text-text-primary">
          Welcome back, {user?.name}
        </h1>

        <div className="mt-3 w-full max-w-xl">
          <QuickSearchBar />
        </div>
      </section>

      {/* Departments */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-text-secondary">
            Your Departments
          </h2>

          {departments && departments.length > 0 && (
            <span className="text-xs text-text-muted">
              {departments.length}{' '}
              {departments.length === 1 ? 'department' : 'departments'}
            </span>
          )}
        </div>

        {deptsLoading ? (
          <Card>
            <p className="text-sm text-text-muted">
              Loading departments...
            </p>
          </Card>
        ) : departments && departments.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((department) => (
              <UserDeptCard
                key={department.id}
                {...department}
              />
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-sm text-text-muted">
              No departments assigned yet.
            </p>
          </Card>
        )}
      </section>

      {/* Recent Files */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-text-secondary">
            Recent Files
          </h2>

          {recentFiles && recentFiles.length > 0 && (
            <span className="text-xs text-text-muted">
              {recentFiles.length} recent
            </span>
          )}
        </div>

        <Card className="!p-0 overflow-hidden">
          {filesLoading ? (
            <div className="p-4">
              <p className="text-sm text-text-muted">
                Loading files...
              </p>
            </div>
          ) : recentFiles && recentFiles.length > 0 ? (
            <ul className="divide-y divide-border-subtle">
              {recentFiles.map((file) => (
                <li
                  key={file.id}
                  className="
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    transition-colors
                    hover:bg-card-hover
                  "
                >
                  {/* File icon */}
                  <div className="flex shrink-0 items-center justify-center">
                    <FileIcon
                      nodeType="FILE"
                      mimeType={file.mimeType}
                    />
                  </div>

                  {/* File information */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-primary">
                      {file.name}
                    </p>

                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="truncate text-xs text-text-muted">
                        {file.departmentName}
                      </span>

                      <span className="text-text-muted">
                        •
                      </span>

                      <span className="shrink-0 text-xs text-text-muted">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  </div>

                  {/* Upload date */}
                  <span className="shrink-0 text-xs text-text-muted">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4">
              <p className="text-sm text-text-muted">
                No recent uploads.
              </p>
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}