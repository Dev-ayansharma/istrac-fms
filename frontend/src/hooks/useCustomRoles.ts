import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'

interface CustomRole {
  id: string
  departmentId: string | null
  name: string
  description: string
  permissions: string[]
  memberCount: number
}

export function useCustomRoles(deptId: string) {
  return useQuery({
    queryKey: ['custom-roles', deptId],
    queryFn: async () => {
      const { data } = await api.get<CustomRole[]>('/roles', { params: { deptId } })
      return data
    },
    enabled: !!deptId,
  })
}

export function useCreateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { deptId: string; name: string; description: string; permissions: string[] }) =>
      api.post('/roles', payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['custom-roles'] }),
  })
}

export function useUpdateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; name?: string; description?: string; permissions?: string[] }) =>
      api.put(`/roles/${id}`, payload),
    onSuccess: () => {
      // "Saves invalidate permission cache" — the mutation success itself is the trigger;
      // invalidating this query ensures the UI reflects the fresh grant/deny state immediately,
      // matching what the backend's own permission-check cache (Ch.16.3, 60s TTL) will
      // eventually converge to server-side.
      queryClient.invalidateQueries({ queryKey: ['custom-roles'] })
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] })
    },
  })
}

export function useAssignRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, userId }: { roleId: string; userId: string }) =>
      api.post(`/roles/${roleId}/assign`, { userId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['custom-roles'] }),
  })
}

// For the typeahead — reuses the existing /users list endpoint from FE-020
export function useUserSearch(query: string) {
  return useQuery({
    queryKey: ['user-search', query],
    queryFn: async () => {
      const { data } = await api.get('/users', { params: { search: query, pageSize: 8 } })
      return data.data as { id: string; name: string; email: string }[]
    },
    enabled: query.length >= 2,
  })
}