import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'

interface PendingUser {
  id: string
  name: string
  email: string
  employeeId: string
  departmentPreference: string
  reasonForAccess: string
  createdAt: string
}

export function usePendingUsers() {
  return useQuery({
    queryKey: ['pending-users'],
    queryFn: async () => {
      const { data } = await api.get<PendingUser[]>('/users/pending')
      return data
    },
  })
}

export function useApproveUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => api.post(`/users/${userId}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-users'] })
    },
  })
}

export function useRejectUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      api.post(`/users/${userId}/reject`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-users'] })
    },
  })
}