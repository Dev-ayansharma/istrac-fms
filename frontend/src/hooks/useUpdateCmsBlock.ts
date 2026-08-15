import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'

export function useUpdateCmsBlock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ blockKey, content }: { blockKey: string; content: Record<string, unknown> }) =>
      api.put(`/cms/${blockKey}`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms'] })
    },
  })
}