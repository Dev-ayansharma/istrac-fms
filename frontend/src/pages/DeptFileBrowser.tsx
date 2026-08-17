import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  useFolderTree,
  type TreeNode,
} from '../hooks/useFolderTree'
import { useDepartments } from '../hooks/useDepartments'

import { FolderTree } from '../components/FolderTree'
import { DeptBreadcrumb } from '../components/DeptBreadcrumb'
import { FileBrowser } from '../components/FileBrowser'

/**
 * Walks the folder tree and returns the path from the root
 * to the requested folder.
 *
 * Used to build the breadcrumb navigation.
 */
function findPath(
  nodes: TreeNode[],
  targetId: string,
  trail: TreeNode[] = [],
): TreeNode[] | null {
  for (const node of nodes) {
    if (node.id === targetId) {
      return [...trail, node]
    }

    const found = findPath(
      node.children,
      targetId,
      [...trail, node],
    )

    if (found) {
      return found
    }
  }

  return null
}

export function DeptFileBrowser() {
  const { deptId } = useParams<{ deptId: string }>()

  const [currentFolderId, setCurrentFolderId] =
    useState<string | null>(null)

  const { data: departments } = useDepartments()

  const {
    data: tree,
    isLoading,
  } = useFolderTree(deptId ?? '')

  const department = departments?.find(
    (dept) => dept.id === deptId,
  )

  const breadcrumbPath = useMemo(() => {
    if (!tree || !currentFolderId) {
      return []
    }

    const path = findPath(tree, currentFolderId)

    return (
      path?.map((node) => ({
        id: node.id,
        name: node.name,
      })) ?? []
    )
  }, [tree, currentFolderId])

  if (!deptId) {
    return (
      <p className="text-text-muted">
        No department selected.
      </p>
    )
  }

  function handleFolderNavigate(folderId: string | null) {
    setCurrentFolderId(folderId)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
      {/* Folder navigation */}
      <aside className="space-y-2">
        <h3 className="px-2 text-xs font-medium text-text-secondary uppercase tracking-wide">
          Folders
        </h3>

        {isLoading ? (
          <p className="px-2 text-sm text-text-muted">
            Loading...
          </p>
        ) : (
          <FolderTree
            nodes={tree ?? []}
            activeFolderId={currentFolderId}
            onSelect={handleFolderNavigate}
          />
        )}
      </aside>

      {/* File browser */}
      <main className="space-y-3">
        <DeptBreadcrumb
          deptName={department?.name ?? 'Department'}
          path={breadcrumbPath}
          onNavigate={handleFolderNavigate}
        />

        <FileBrowser
          deptId={deptId}
          parentId={currentFolderId}
        />
      </main>
    </div>
  )
}