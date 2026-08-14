import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'
import type { FileNode, SortField, SortDirection } from '../types/file'

interface UseDeptFilesParams {
  deptId: string
  parentId: string | null
  sortField: SortField
  sortDirection: SortDirection
}

export function useDeptFiles({ deptId, parentId, sortField, sortDirection }: UseDeptFilesParams) {
  return useQuery({
    queryKey: ['dept-files', deptId, parentId],
    queryFn: async () => {
      const { data } = await api.get<FileNode[]>(`/browse/${deptId}`, {
        params: parentId ? { parentId } : {},
      })
      return data
    },
    select: (data) =>
      [...data].sort((a, b) => {
        const dir = sortDirection === 'asc' ? 1 : -1
        if (sortField === 'name') return a.name.localeCompare(b.name) * dir
        if (sortField === 'sizeBytes') return ((a.sizeBytes ?? 0) - (b.sizeBytes ?? 0)) * dir
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir
      }),
    enabled: !!deptId,
  })
}

export function useBulkDeleteFiles() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (fileIds: string[]) => api.post('/files/bulk-delete', { fileIds }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dept-files'] }),
  })
}

export function useBulkTagFiles() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ fileIds, tags }: { fileIds: string[]; tags: string[] }) =>
      api.post('/files/bulk-tag', { fileIds, tags, action: 'add' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dept-files'] }),
  })
}