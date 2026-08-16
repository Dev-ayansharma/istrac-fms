import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'
import {type  FileNode } from '../types/file'

// Fetches only FOLDER-type nodes, flat, for building a tree client-side.
// Kept as a separate query from useDeptFiles (FE-022), which fetches ALL nodes
// (files + folders) for whatever single level is currently being browsed.
export function useFolderTree(deptId: string) {
  return useQuery({
    queryKey: ['folder-tree', deptId],
    queryFn: async () => {
      const { data } = await api.get<FileNode[]>(`/browse/${deptId}`, {
        params: { nodeType: 'FOLDER', flat: true },
      })
      return data
    },
    enabled: !!deptId,
    select: (folders) => buildTree(folders),
  })
}

export interface TreeNode extends FileNode {
  children: TreeNode[]
}

function buildTree(flatFolders: FileNode[]): TreeNode[] {
  const nodeMap = new Map<string, TreeNode>()
  flatFolders.forEach((f) => nodeMap.set(f.id, { ...f, children: [] }))

  const roots: TreeNode[] = []
  flatFolders.forEach((f) => {
    const node = nodeMap.get(f.id)!
    if (f.parentId && nodeMap.has(f.parentId)) {
      nodeMap.get(f.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  })
  return roots
}