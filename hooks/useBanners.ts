import { useQuery } from '@tanstack/react-query'
import { bannerApi } from '@/lib/api'
import { Banner } from '@/types'

// Transform backend response to frontend format
function transformBanner(backendBanner: any): Banner {
  return {
    id: backendBanner.id,
    title: backendBanner.title,
    image: backendBanner.image,
    target_type: backendBanner.targetType || backendBanner.target_type,
    target_id: backendBanner.targetId || backendBanner.target_id,
    target_url: backendBanner.targetUrl || backendBanner.target_url,
    order: backendBanner.order,
    is_active: backendBanner.isActive ?? backendBanner.is_active ?? true,
  }
}

export function useBanners() {
  return useQuery<Banner[]>({
    queryKey: ['banners'],
    queryFn: async () => {
      try {
        const response = await bannerApi.getAll()
        const banners = response.data.data as any[]
        return banners.map(transformBanner)
      } catch (error) {
        console.error('[Banners] Failed to fetch:', error)
        // Return empty array instead of throwing - banners are not critical
        return []
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once for banners
  })
}
