'use client'

import { useCategories } from '@/hooks/useCategories'
import { Layers } from 'lucide-react'

interface CategoryFilterProps {
  selectedCategoryId: string | null
  onSelectCategory: (categoryId: string | null) => void
}

export function CategoryFilter({ 
  selectedCategoryId, 
  onSelectCategory 
}: CategoryFilterProps) {
  const { data: categories = [], isLoading } = useCategories()

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-24 flex-shrink-0 animate-pulse rounded-full bg-gray-200"
          />
        ))}
      </div>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {/* All category */}
      <button
        onClick={() => onSelectCategory(null)}
        className={`flex flex-shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
          selectedCategoryId === null
            ? 'border-blue-500 bg-blue-500 text-white'
            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
        }`}
      >
        <Layers className="h-4 w-4" />
        All
      </button>

      {/* Category pills */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`flex flex-shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            selectedCategoryId === category.id
              ? 'border-blue-500 bg-blue-500 text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
          }`}
        >
          {category.icon && <span>{category.icon}</span>}
          {category.name}
        </button>
      ))}
    </div>
  )
}
