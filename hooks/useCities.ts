import { useQuery } from '@tanstack/react-query'
import { cityApi } from '@/lib/api'
import { City } from '@/types'

export function useCities() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const response = await cityApi.getAll()
      return response.data.data as City[]
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}
