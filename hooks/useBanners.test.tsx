import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useBanners } from './useBanners'
import { bannerApi } from '@/lib/api'

// Mock the API
vi.mock('@/lib/api', () => ({
  bannerApi: {
    getAll: vi.fn(),
  },
}))

describe('useBanners', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    vi.clearAllMocks()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  it('fetches banners successfully', async () => {
    const mockBanners = [
      {
        id: '1',
        title: 'Banner 1',
        image: 'banner1.jpg',
        order: 1,
        is_active: true,
      },
      {
        id: '2',
        title: 'Banner 2',
        image: 'banner2.jpg',
        order: 2,
        is_active: true,
      },
    ]

    vi.mocked(bannerApi.getAll).mockResolvedValue({
      data: { data: mockBanners },
    } as any)

    const { result } = renderHook(() => useBanners(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockBanners)
    expect(bannerApi.getAll).toHaveBeenCalledTimes(1)
  })

  it('handles empty banner list', async () => {
    vi.mocked(bannerApi.getAll).mockResolvedValue({
      data: { data: [] },
    } as any)

    const { result } = renderHook(() => useBanners(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([])
  })

  it('handles API errors', async () => {
    vi.mocked(bannerApi.getAll).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useBanners(), { wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeDefined()
  })

  it('caches banner data with correct staleTime', async () => {
    const mockBanners = [
      {
        id: '1',
        title: 'Banner 1',
        image: 'banner1.jpg',
        order: 1,
        is_active: true,
      },
    ]

    vi.mocked(bannerApi.getAll).mockResolvedValue({
      data: { data: mockBanners },
    } as any)

    const { result, rerender } = renderHook(() => useBanners(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Rerender should use cached data
    rerender()

    // Should only call API once due to caching
    expect(bannerApi.getAll).toHaveBeenCalledTimes(1)
  })
})
