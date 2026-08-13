import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'

interface Department {
  id: string
  name: string
  hddPath: string
  archived: boolean
}

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data } = await api.get<Department[]>('/departments')
      return data
    },
  })
}

export function useCreateDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { name: string; hddPath: string }) => api.post('/departments', payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  })
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; name?: string; hddPath?: string }) =>
      api.put(`/departments/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  })
}

export function useArchiveDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, archived }: { id: string; archived: boolean }) =>
      api.put(`/departments/${id}`, { archived }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  })
}