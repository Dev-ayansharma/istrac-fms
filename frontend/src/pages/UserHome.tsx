import {
  useRecentFiles,
  useUserDepartments,
} from '../hooks/useUserHome'
import { useAuthStore } from '../store/authStore'

import { PageHeader, Panel } from '../components'
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
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title={user?.name ? `Welcome back, ${user.name}` : 'Welcome back'}
        description="Your departments and the files that changed most recently."
      />

      <div className="max-w-xl">
        <QuickSearchBar />
      </div>

      {/* Departments */}
      <Panel
        title="Your departments"
        meta={
          departments && departments.length > 0
            ? `${departments.length} assigned`
            : undefined
        }
        flush
      >
        {deptsLoading ? (
          <p className="num p-4 text-xs text-text-dim">Loading departments…</p>
        ) : departments && departments.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((department) => (
              <UserDeptCard
                key={department.id}
                {...department}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="num text-sm text-text-dim">—</p>
            <p className="mt-2 text-[13px] text-text-muted">
              No departments assigned yet.
            </p>
          </div>
        )}
      </Panel>

      {/* Recent Files */}
      <Panel
        title="Recent files"
        meta={
          recentFiles && recentFiles.length > 0
            ? `${recentFiles.length} entries`
            : undefined
        }
        flush
      >
        {filesLoading ? (
          <p className="num p-4 text-xs text-text-dim">Loading files…</p>
        ) : recentFiles && recentFiles.length > 0 ? (
          <ul className="divide-y divide-border-subtle">
            {recentFiles.map((file) => (
              <li
                key={file.id}
                className="flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-card-hover"
              >
                <div className="flex shrink-0 items-center justify-center">
                  <FileIcon
                    nodeType="FILE"
                    mimeType={file.mimeType}
                  />
                </div>

                {/* Name is human language; department is a label. */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] text-text-primary">
                    {file.name}
                  </p>

                  <p className="mt-1 truncate text-[11px] text-text-muted">
                    {file.departmentName}
                  </p>
                </div>

                {/* Size and date are machine values, so they're set in mono
                    and right-aligned to form a readable column. */}
                <span className="num hidden w-20 shrink-0 text-right text-[11px] text-text-dim sm:block">
                  {formatFileSize(file.size)}
                </span>

                <span className="num w-24 shrink-0 text-right text-[11px] text-text-dim">
                  {new Date(file.uploadedAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <p className="num text-sm text-text-dim">—</p>
            <p className="mt-2 text-[13px] text-text-muted">No recent uploads.</p>
          </div>
        )}
      </Panel>
    </div>
  )
}
