import { useQuery } from '@tanstack/react-query'
import { categoryApi } from '@/lib/api'
import { Category } from '@/types'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoryApi.getAll()
      return response.data.data as Category[]
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
