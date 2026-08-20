import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'
import { useNotificationStore } from '../store/notificationStore'

interface NotificationItem {
  id: number
  type: string
  message: string
  category: 'Files' | 'Approvals' | 'System'
  readAt: string | null
  createdAt: string
}

export function useNotifications(category?: string) {
  return useInfiniteQuery({
    queryKey: ['notifications', category],
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<{ data: NotificationItem[]; nextCursor: string | null }>('/notifications', {
        params: { category: category || undefined, cursor: pageParam },
      })
      return data
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  })
}

export function useMarkAllRead() {
  const queryClient = useQueryClient()
  const resetUnread = useNotificationStore((s) => s.resetUnread)
  return useMutation({
    mutationFn: () => api.post('/notifications/mark-all-read'),
    onSuccess: () => {
      resetUnread()
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })
}