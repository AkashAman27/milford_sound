'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'

interface Subcategory {
  id: string
  name: string
  slug: string
  experience_count: number
}

interface Category {
  id: string
  name: string
  slug: string
  experience_count: number
  subcategories: Subcategory[]
}

export function CategoryDropdown() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const supabase = createClient()
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, slug, experience_count')
        .order('sort_order')

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError)
        return
      }

      // Fetch subcategories
      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from('subcategories')
        .select('id, name, slug, experience_count, category_id')
        .order('sort_order')

      if (subcategoriesError) {
        console.error('Error fetching subcategories:', subcategoriesError)
        return
      }

      // Combine the data
      const categoriesWithSubcategories = (categoriesData || []).map(category => ({
        ...category,
        subcategories: (subcategoriesData || []).filter(sub => sub.category_id === category.id)
      }))

      setCategories(categoriesWithSubcategories)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center text-sm font-medium hover:text-primary transition-colors">
        Milford Sound Tours
        <ChevronDown className="h-4 w-4 ml-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 bg-white border border-gray-200 shadow-lg">
        <DropdownMenuItem asChild>
          <Link href="/tours" className="w-full text-gray-900 hover:bg-gray-50">
            <span className="font-medium text-gray-900">All Tours</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-gray-200" />

        {loading ? (
          <div className="px-2 py-1.5 text-sm text-gray-500">Loading...</div>
        ) : (
          categories.map((category) => (
            <DropdownMenuSub key={category.id}>
              <DropdownMenuSubTrigger className="text-gray-900 hover:bg-gray-50">
                <div className="flex items-center justify-between w-full">
                  <span className="text-gray-900">{category.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {category.experience_count}
                    </span>
                    <ChevronRight className="h-3 w-3 text-gray-400" />
                  </div>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-white border border-gray-200 shadow-lg">
                <DropdownMenuItem asChild>
                  <Link href={`/category/${category.slug}`} className="w-full text-gray-900 hover:bg-gray-50">
                    <span className="font-medium text-gray-900">All {category.name}</span>
                  </Link>
                </DropdownMenuItem>
                
                {category.subcategories && category.subcategories.length > 0 && (
                  <>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    {category.subcategories.map((subcategory) => (
                      <DropdownMenuItem key={subcategory.id} asChild>
                        <Link href={`/subcategory/${subcategory.slug}`} className="w-full text-gray-900 hover:bg-gray-50">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-gray-900">{subcategory.name}</span>
                            <span className="text-xs text-gray-500">
                              {subcategory.experience_count}
                            </span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  )
}