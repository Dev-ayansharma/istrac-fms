import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useFolderTree, type TreeNode } from '../hooks/useFolderTree'
import { useDepartments } from '../hooks/useDepartments'
import { FolderTree } from '../components/FolderTree'
import { DeptBreadcrumb } from '../components/DeptBreadcrumb'
import { FileBrowser } from '../components/FileBrowser'

// Walks the tree to find the path of names from root to the current folder,
// used to render the breadcrumb trail.
function findPath(nodes: TreeNode[], targetId: string, trail: TreeNode[] = []): TreeNode[] | null {
  for (const node of nodes) {
    if (node.id === targetId) return [...trail, node]
    const found = findPath(node.children, targetId, [...trail, node])
    if (found) return found
  }
  return null
}

export function DeptFileBrowser() {
  const { deptId } = useParams<{ deptId: string }>()
  const { data: departments } = useDepartments()
  const { data: tree, isLoading } = useFolderTree(deptId ?? '')
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)

  const dept = departments?.find((d) => d.id === deptId)

  const breadcrumbPath = useMemo(() => {
    if (!tree || !currentFolderId) return []
    const path = findPath(tree, currentFolderId)
    return path?.map((n) => ({ id: n.id, name: n.name })) ?? []
  }, [tree, currentFolderId])

  if (!deptId) return <p className="text-text-muted">No department selected.</p>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
      <aside className="space-y-2">
        <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide px-2">Folders</h3>
        {isLoading ? (
          <p className="text-text-muted text-sm px-2">Loading...</p>
        ) : (
          <FolderTree nodes={tree ?? []} activeFolderId={currentFolderId} onSelect={setCurrentFolderId} />
        )}
      </aside>

      <div className="space-y-3">
        <DeptBreadcrumb
          deptName={dept?.name ?? 'Department'}
          path={breadcrumbPath}
          onNavigate={setCurrentFolderId}
        />
        <FileBrowser deptId={deptId} parentId={currentFolderId} />
      </div>
    </div>
  )
}