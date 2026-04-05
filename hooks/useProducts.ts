import { useQuery } from '@tanstack/react-query'
import { productApi } from '@/lib/api'
import { Product } from '@/types'

// Transform backend response (camelCase) to frontend format (snake_case)
function transformProduct(backendProduct: any): Product {
  return {
    id: backendProduct.id,
    name: backendProduct.name,
    description: backendProduct.description,
    image: backendProduct.image,
    category_id: backendProduct.categoryId || backendProduct.category_id,
    rating: backendProduct.averageRating ?? backendProduct.rating ?? 0,
    review_count: backendProduct.reviewCount ?? backendProduct.review_count ?? 0,
    variants: (backendProduct.variants || []).map((v: any) => ({
      id: v.id,
      product_id: v.productId || v.product_id || backendProduct.id,
      name: v.name,
      price: parseFloat(v.price),
      unit: v.unit,
      stock: v.quantity ? parseFloat(v.quantity) : 0,
      is_available: v.isAvailable ?? v.is_available ?? true,
    })),
    created_at: backendProduct.createdAt || backendProduct.created_at,
    updated_at: backendProduct.updatedAt || backendProduct.updated_at || backendProduct.createdAt || backendProduct.created_at,
  }
}

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await productApi.getAll()
      const products = response.data.data as any[]
      return products.map(transformProduct)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes (renamed from cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await productApi.getById(id)
      return transformProduct(response.data.data)
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes (renamed from cacheTime)
    refetchOnWindowFocus: false,
  })
}
