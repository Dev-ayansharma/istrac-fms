import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'

export interface User {
  id: string
  name: string
  email: string
  employeeId: string
  role: string
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED'
  createdAt: string
}

export interface UsersResponse {
  data: User[]
  pagination: { total: number; page: number; pageSize: number; totalPages: number }
}

interface UseUsersParams {
  page: number  
  search: string
  status: string
  role: string
  
}

export function useUsers({ page, search, status, role }: UseUsersParams) {
  return useQuery({
    queryKey: ['users', page, search, status, role],
    queryFn: async () => {
      const { data } = await api.get<UsersResponse>('/users', {
        params: { page, pageSize: 20, search: search || undefined, status: status || undefined, role: role || undefined },
      })
      return data
    },
  })
}

export function useSuspendUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => api.post(`/users/${userId}/suspend`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useForceLogout() {
  return useMutation({
    mutationFn: (userId: string) => api.post(`/users/${userId}/force-logout`),
  })
}